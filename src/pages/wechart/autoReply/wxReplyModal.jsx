/*
 * @Author: HuangQS
 * @Date: 2021-08-30 15:27:40
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-13 16:51:17
 * @Description: 微信自动回复模块
 */


import React, { Component } from 'react';
import { Modal, Tabs, Divider, Button, Input, Tag, Image, message, Select, Switch, Alert, Tooltip, Form, Radio } from 'antd';

import "./wxReplyModal.css";
import WxReplyModalImageBox from "./wxReplyModalImageBox"
import WxReplyModalActivity from "./wxReplyModalActivity"

import { MySyncBtn } from '@/components/views.js';


import WxReplyModalTags from "./wxReplyModalTags"
let { TabPane } = Tabs;
let { TextArea, Search } = Input;
let { Option } = Select;


export default class WxReplyModal extends Component {
    constructor(props) {
        super(props);
        this.titleFormRef = React.createRef();      //如果有额外的title From 放这里
        this.replyFormRef = React.createRef();

        // this.imageFormRef = React.createRef();

        this.state = {
            image_box_ref: null,                //图片盒子控件实例
            activity_ref: null,                 //活动Form对象
            form_interval: null,                //Form表格状态计时器

            base_width: 450,
            is_edit_mode: false,                //编辑模式
            datas: [],                          //数据源
            tags: [],                           //标题 标签 分类

            item: {},                           //当前数据源
            infos: [],                          //回复列表
            wxCode: [],                         //在[自定义二维码回复]类型中展示 
            tag_select_id: 0,                   //标题标签选中id
            reply_select_id: 0,                 //回复消息选中id
            join_type: [{ key: "no_quality", value: "无资格" }, { key: "join", value: "已参与" }, { key: "no_count", value: "无次数" }, { key: "over", value: "已结束" }],
            //最近获取到焦点的的输入框
            last_select_input_box: {
                key: '',
                value: '',
            },
            optionType: "",
            replyId:"", //回复id
            isShowType: "",//是否显隐参与场景
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }

    render() {
        let that = this;
        let { menu_type, } = that.props;
        let { dict_msg_type, dict_public_types, dict_user_tags, dict_rule_types, dict_wx_program } = that.props;
        let { tags, datas, base_width, tag_select_id, reply_select_id, last_select_input_box, join_type,isShowType } = that.state;
        let targetReplyId = parseInt(reply_select_id) + 1;

        let item = datas[tag_select_id];     //当前选择的数据 整体信息
        let replys = [];
        if (!item) item = { info: [] };
        else {
            replys = item.info;
            if (replys.constructor !== Array) replys = [];
        }



        return (
            <div key='modal'>
                {/* <div>item</div>
                <div>{JSON.stringify(item)}</div> */}
                {/* <div>replys</div>
                <div>{JSON.stringify(replys)}</div> */}
                <div>
                    <Alert className="alert-box" message="微信自动回复数据载体" type="success" action={
                        <div>
                            <Tooltip title='新增数据' placement='top'>
                                <Button style={{ marginLeft: 10 }} onClick={() => { that.onCreateNewDataClick() }} >新增配置</Button>
                            </Tooltip>
                            <MySyncBtn type={4} name={'微信缓存'} />
                        </div>
                    }>
                    </Alert>

                    <WxReplyModalTags onRef={(val) => { }} tags={tags}
                        tag_select_id={tag_select_id}
                        dict_public_types={dict_public_types}
                        menu_type={menu_type}
                        onSelectIdChange={(tag_select_id) => that.onTitleTagChangeClick(tag_select_id)}
                        onTabsDeleteClick={(index) => that.onTabsCreateDeleteClick(index, 'remove')}
                    />

                </div>
                {
                    item.is_empty &&
                    <div className="empty-wrapper">
                        <div className='item'> 请点击右上角[新增]按钮，添加自动回复消息模板。</div>
                    </div>
                }
                {
                    <div style={{ visibility: `${item.is_empty ? 'hidden' : 'visible'}`, }} className="reply-wrapper-out">
                        <div className="reply-wrapper">
                            <div className="tab-wrapper"></div>
                            <div className="title-wrapper">
                                <Form style={{ width: 600, minHight: 500 }} name='title_form' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} ref={that.titleFormRef}>
                                    <Form.Item label='id' name='id' >
                                        <Input style={{ width: base_width }} placeholder='数据保存之后，服务端将自动生成id' disabled />
                                    </Form.Item>
                                    <Form.Item label='状态' name='status' valuePropName='checked'>
                                        <Switch checkedChildren="有效" unCheckedChildren="无效" />
                                    </Form.Item>
                                    {
                                        menu_type === 'keywords' &&
                                        <div>
                                            <Form.Item label='名称' name='ruleName' >
                                                <Input style={{ width: base_width }} placeholder='请输入分类名称' onBlur={(view) => that.onInputLoseFocus(view)} />
                                            </Form.Item>

                                            <Form.Item label='回复公众号' name='wxCode' >
                                                <Select style={{ width: base_width }} mode="multiple" allowClear placeholder='请选择回复公众号'
                                                    onChange={() => { that.refreshImageBoxByWxCode() }} onBlur={(view) => that.onInputLoseFocus(view)}>
                                                    {dict_public_types.map((item, index) => (
                                                        <Option value={item.code} key={index}>{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item label='关键字匹配'>
                                                <Form.Item name='ruleType' >
                                                    <Select style={{ width: base_width }} placeholder="请选择匹配规则" >
                                                        {dict_rule_types.map((item, index) => (
                                                            <Option value={item.key} key={item.key}>{item.key}-{item.value}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item name='keywords' >
                                                    <Input style={{ width: base_width }} placeholder='请输入关键字' />
                                                </Form.Item>
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        menu_type === 'other' &&
                                        <div>
                                            <Form.Item label='名称' name='name' >
                                                <Input style={{ width: base_width }} placeholder='请输入名称' onBlur={(view) => that.onInputLoseFocus(view)} />
                                            </Form.Item>
                                            <Form.Item label='编码' name='code' >
                                                <Input style={{ width: base_width }} placeholder='请输入编码' onBlur={(view) => that.onInputLoseFocus(view)} />
                                            </Form.Item>
                                            <Form.Item label='回复公众号' name='wxCode' >
                                                <Select style={{ width: base_width }} mode="multiple" allowClear placeholder='请选择回复公众号'
                                                    onChange={() => { that.refreshImageBoxByWxCode() }} onBlur={(view) => that.onInputLoseFocus(view)}>
                                                    {dict_public_types.map((item, index) => (
                                                        <Option value={item.code} key={index}>{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        menu_type !== 'keywords' && menu_type !== 'other' &&
                                        <div>
                                            {
                                                menu_type=="loginScan" &&
                                                <Form.Item label='标签' name='tags'>
                                                    <Select style={{ width: base_width }}  defaultValue={dict_user_tags[0].code.toString()} disabled>
                                                        {dict_user_tags.map((item, index) => (
                                                            <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item> || 
                                                <Form.Item label='标签' name='tags' >
                                                    <Select style={{ width: base_width }} showSearch placeholder="请选择用户设备标签" onChange={(value, option) => that.onUserTagSelectChange(value, option)}
                                                    filterOption={(input, option) => {
                                                        if (!input) return true;
                                                        let children = option.children;
                                                        if (children) {
                                                            let key = children[2];
                                                            let isFind = false;
                                                            isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                            if (!isFind) {
                                                                let code = children[0];
                                                                isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                            }
        
                                                            return isFind;
                                                        }
                                                    }}
                                                    >
                                                        {dict_user_tags.map((item, index) => (
                                                            <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            }
                                        </div>
                                    }

                                </Form>
                                {
                                    (menu_type === 'keywords' || menu_type === 'other') &&
                                    <WxReplyModalActivity
                                    replyId={that.titleFormRef.current && that.titleFormRef.current.getFieldValue("id")}
                                     onRef={(val) => {
                                        that.setState({ activity_ref: val, }, () => {
                                        })
                                    }} 
                                    onChangeType={(e)=>{
                                        let {datas} = this.state
                                        that.replyFormRef.current.resetFields();
                                        console.log(datas,tag_select_id,"datas")
                                        let obj = {msg_type:"text"}
                                        if(e == 2){
                                            obj.option = "no_quality"
                                        }
                                        datas[tag_select_id].info = [obj]
                                        datas[tag_select_id].replyActivity = ""
                                        datas[tag_select_id].activityType = e
                                        this.setState({ 
                                            isShowType: e ,
                                            datas:datas
                                        },()=>{
                                            console.log(datas,"datas=======<>")
                                            that.replyFormRef.current.setFieldsValue(obj);
                                        })
                                    }}
                                    >
                                    </WxReplyModalActivity>
                                }
                            </div>
                            {/* 手机界面 */}
                            <div className="phone-wrapper-outer">
                                <div className="phone-wrapper">
                                    {replys.map((item, index) => (
                                        <div className='phone-message-box' key={index}>
                                            {
                                                item.msg_type === 'text' &&
                                                <div className='phone-box'>
                                                    <div className='head-img'>文字</div>
                                                    <div className='phone-item-box'>
                                                        <div className='phone-content'> {item.content}</div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                item.msg_type === 'image' &&
                                                <div className='phone-box'>
                                                    <div className='head-img'>图片</div>
                                                    <div className='phone-item-box'>
                                                        <div className='phone-image'>
                                                            <Image width={140} height={140} src={item.imgs && item.imgs.length > 0 ? item.imgs[0].url : ''}></Image>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                item.msg_type === 'news' &&
                                                <div className='phone-box'>
                                                    <div className='head-img'>图文</div>
                                                    <div className='phone-item-box'>
                                                        <div className='title'>{item.title}</div>
                                                        <div className='description' >{item.description}</div>
                                                        <div className='phone-content'>{item.content}</div>
                                                        <div className='phone-image'>
                                                            <Image width={140} height={140} src={item.imgs && item.imgs.length > 0 ? item.imgs[0].url : ''}></Image>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {
                                                item.msg_type === 'mini' &&
                                                <div className='phone-box'>
                                                    <div className='head-img'>小程序</div>
                                                    <div className='phone-item-box'>
                                                        <div className='title'>{item.title}</div>
                                                        <div className='mini-icon'>
                                                            <Image width={140} height={140} src={item.imgs && item.imgs.length > 0 ? item.imgs[0].url : ''}></Image>
                                                        </div>
                                                        <div>小程序</div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className="reply-wrapper">
                            <div className="tab-wrapper"></div>
                            <div className="title-wrapper">
                                <Divider orientation="left" plain>第{targetReplyId}条消息配置</Divider>
                            </div>
                        </div>
                        <div className="reply-wrapper">
                            <div className="tab-wrapper">
                                {/* 侧边栏  */}
                                {
                                    replys.length > 0 &&
                                    <Tabs type="editable-card" tabPosition={"left"} activeKey={`${reply_select_id}`}
                                        onEdit={(targetKey, action) => that.onReplyItemClick(targetKey, action)} onChange={(activeKey) => that.onReplyItemChange(activeKey)}>
                                        {replys.map((item, index) => (
                                            <TabPane tab={`
                                            ${item.option == "no_quality" ? "无资格" :
                                                    item.option == "join" ? "已参与" : item.option
                                                        == "over" ? "已结束" : item.option == "no_count"?"无次数":"默认"}第${index + 1}条`} key={index}></TabPane>
                                        ))}
                                    </Tabs>
                                }

                            </div>

                            <div className="content-wrapper">
                                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} style={{ width: 600, minHight: 500 }} ref={that.replyFormRef}>
                                    {that.replyFormRef && that.replyFormRef.current && (
                                        <div>
                                            {
                                                isShowType == 2 &&
                                                <Form.Item label='参与场景' name='option' >
                                                    <Radio.Group onChange={(e) => {
                                                        console.log(that.replyFormRef.current.getFieldValue())
                                                        this.setState({ optionType: e.target.value })
                                                        console.log(datas,replys,"datas=======>")
                                                        replys[reply_select_id].option = e.target.value
                                                    }}
                                                    >
                                                        {join_type.map((item, index) => (
                                                            <Radio value={item.key} key={index}>{item.value}</Radio>
                                                        ))}
                                                    </Radio.Group>
                                                </Form.Item>
                                            }

                                            <Form.Item label='消息类型' name='msg_type' >
                                                <Radio.Group onChange={(e) => that.onRadioClick(e)}>
                                                    {dict_msg_type.map((item, index) => (
                                                        <Radio value={item.key} key={index}>{item.value}</Radio>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            {that.replyFormRef.current.getFieldValue('msg_type') !== 'image' &&
                                                <Form.Item label='快捷功能'  >
                                                    <Form.Item>
                                                        当前选择组件 {last_select_input_box.key ? `[${last_select_input_box.key}]` : '[尚未选择]'}
                                                    </Form.Item>

                                                    <Tooltip title='系统将自动转化为[用户姓名]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#nickname#')}>#用户姓名#</Button>
                                                    </Tooltip>
                                                    <Tooltip title='系统将自动转化为[用户Id]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#userid#')} style={{ marginLeft: 3 }}>#用户ID#</Button>
                                                    </Tooltip>
                                                    <Tooltip title='系统将自动转化为[会员时间]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#expire#')} style={{ marginLeft: 3 }}>#会员时间#</Button>
                                                    </Tooltip>
                                                    <Tooltip title='系统将自动转化为[VIP天数]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#days#')} style={{ marginLeft: 3 }}>#VIP天数#</Button>
                                                    </Tooltip>
                                                    <Tooltip title='系统将自动转化为[退费]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#refund#')} style={{ marginLeft: 3 }}>#退费#</Button>
                                                    </Tooltip>
                                                    <Tooltip title='系统将自动转化为[次数]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#cbcnt#')} style={{ marginLeft: 3,marginTop:3, }}>#次数#</Button>
                                                    </Tooltip>
                                                    <Tooltip title='系统将自动转化为[金额]' placement='top'>
                                                        <Button size='small' onClick={() => that.onUserTargetClick('#cbmoney#')} style={{ marginLeft: 3,marginTop:3, }}>#金额#</Button>
                                                    </Tooltip>
                                                </Form.Item>
                                            }
                                            {
                                                // 文字回复
                                                that.replyFormRef.current.getFieldValue('msg_type') === 'text' &&
                                                <div>
                                                    <Form.Item label='文字回复' name='content'>
                                                        <TextArea style={{ width: base_width }} rows={5} placeholder='请输入文字回复' onFocus={() => that.onInputGetFocus('文字回复', 'content')} onBlur={(view) => that.onInputLoseFocus(view)} />
                                                    </Form.Item>
                                                </div>
                                            }
                                            {
                                                // 图文回复
                                                that.replyFormRef.current.getFieldValue('msg_type') === 'news' &&
                                                <div>
                                                    <Form.Item label='标题' name='title'>
                                                        <Input style={{ width: base_width }} placeholder='请输入标题' onFocus={() => that.onInputGetFocus('标题', 'title')} onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='摘要' name='description'>
                                                        <TextArea style={{ width: base_width }} rows={5} placeholder='请输入摘要' onFocus={() => that.onInputGetFocus('摘要', 'description')} onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='链接地址' name='url'>
                                                        <TextArea style={{ width: base_width }} rows={3} placeholder='请输入链接地址' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                </div>
                                            }
                                            {
                                                // 小程序卡片
                                                that.replyFormRef.current.getFieldValue('msg_type') === 'mini' &&
                                                <div>
                                                    <Form.Item label='卡片标题' name='title'>
                                                        <Input style={{ width: base_width }} placeholder='请输入小程序标题' onFocus={() => that.onInputGetFocus('卡片标题', 'title')} onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='小程序' name='appid'>
                                                        <Select style={{ width: base_width }} placeholder='请选择小程序'
                                                            onChange={() => { that.forceUpdate() }} onBlur={(view) => that.onInputLoseFocus(view)}>
                                                            {dict_wx_program.map((item, index) => (
                                                                <Option value={item.appid} key={index}>{item.appName}</Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item label='appId' name='appid'>
                                                        <Input style={{ width: base_width }} placeholder='请输入appid' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='小程序路径' name='path'>
                                                        <TextArea style={{ width: base_width }} rows={3} placeholder='小程序页面 示例：pages/index/hqs' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                </div>
                                            }
                                        </div>
                                    )}
                                </Form>
                                {that.replyFormRef && that.replyFormRef.current && that.replyFormRef.current.getFieldValue('msg_type') !== 'text' &&
                                    <WxReplyModalImageBox dict_public_types={dict_public_types} onCallback={(imgs) => that.onImageBoxCallback(imgs)}
                                        onRef={(val) => {
                                            that.setState({ image_box_ref: val }, () => {
                                                that.refreshImageBoxByWxCode();
                                            });
                                        }} />
                                }
                            </div>
                        </div>

                        <div className="reply-wrapper">
                            <div className="tab-wrapper"></div>
                            <div className="btn-wrapper">
                                {
                                    that.titleFormRef && that.titleFormRef.current && that.replyFormRef && that.replyFormRef.current && replys.length > 0 &&
                                    <Tooltip title='当前下的所有信息、推送信息，都将会被保存，请点击之前确认数据无误。' placement="top" color={'purple'} >
                                        <Button type="primary" onClick={() => that.onSaveEiditClick()} >{
                                            that.titleFormRef.current.getFieldValue('id') ? '更新信息' : '新增信息'
                                        }</Button>
                                    </Tooltip>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }


    //循环、等待数据更新 且 判断刷新弹出框数据
    injectFormData(datas) {
        let that = this;
        let interval = that.state.form_interval;

        if (that.titleFormRef && that.titleFormRef.current && that.replyFormRef && that.replyFormRef.current) {
            if (interval) clearInterval(interval);
            that.initFormData(datas);
            return;
        } else {
            if (!interval) {
                interval = setInterval(() => {
                    that.injectFormData(datas);
                    that.forceUpdate();
                }, 1000);
            }
        }
    }

    //根据传入数据 转换为需要的类型
    initFormData(datas) {
        let that = this;
        that.titleFormRef.current.resetFields();
        that.replyFormRef.current.resetFields();
        console.log(that.state.activity_ref.activityFormRef)
        if (that.state.activity_ref && that.state.activity_ref.activityFormRef.current) {
            that.state.activity_ref.activityFormRef.current.resetFields();
        }
        if (!datas || datas.length <= 0) {
            that.setState({
                tags: [],
                datas: datas,
                tag_select_id: 0,
                reply_select_id: 0,
            }, () => {
                that.renderFormData();
            })
            return;
        }


        let menu_type = that.props.menu_type;
        let dict_user_tags = that.props.dict_user_tags;

        //获取标签列表
        let tags = [];
        for (let i = 0, len = datas.length; i < len; i++) {
            let item = datas[i];
            //解析历史数据分类信息
            let tag = item.tags;

            //关键字类型
            if (menu_type === 'keywords') {
                let name = item.ruleName;
                if (!name || name.length <= 0) {
                    name = `第${item.id + 1}条`;
                }
                tag = { id: i, ...item,name: name, }
            }
            //自定义二维码回复
            else if (menu_type === 'other') {
                let name = item.name;
                if (!name || name.length <= 0) {
                    name = `第${item.id + 1}条`;
                }
                tag = { id: i, name: name,...item }
            }
            //其他类型
            else {
                if (!tag) {
                    tag = { name: `[无标签的老数据]` }
                } else {
                    let obj = { id: -1, name: tag, code: ''};
                    for (let j = 0, jlen = dict_user_tags.length; j < jlen; j++) {
                        let temp_tag_item = dict_user_tags[j];
                        if (`${temp_tag_item.code}` === tag) {
                            let name = temp_tag_item.name;
                            let id = parseInt(item.id);
                            let code = temp_tag_item.code;
                            let status = temp_tag_item.status;
                            obj = { id: id, name: name, code: code};
                            break;
                        }
                    }
                    tag = obj;
                }
            }
            tags.push(tag);

            // //将info转为对象类型
            // let info = item.info;
            // try {
            //     if (info) {
            //         info = info.replace(/\n/g, "\\n");
            //         item.info = JSON.parse(info);
            //     } else {
            //         item.info = [];
            //     }
            // } catch (e) {
            //     console.log('error', item.info)
            //     console.log(e)
            //     item.info = [];
            // }
        }
        let is_edit_mode = that.state.is_edit_mode;
        let tag_select_id = 0;
        let reply_select_id = 0;

        //防止编辑模式时 数据刷新导致选择框错误
        if (is_edit_mode) {
            tag_select_id = that.state.tag_select_id;
            reply_select_id = that.state.reply_select_id;
           
        }
        console.log(datas[tag_select_id],"datas")
        that.setState({
            tags: tags,
            datas: datas,
            tag_select_id: tag_select_id,
            reply_select_id: reply_select_id,
            replyId:datas[tag_select_id].id,
            isShowType:datas[tag_select_id].replyActivity?JSON.parse(datas[tag_select_id].replyActivity).activityType:0,
            is_edit_mode: false,
            last_select_input_box: {
                key: '',
                value: '',
            }
        }, () => {
            that.renderFormData();
        })
    }


    //点选按钮被点击
    onRadioClick(e) {
        let that = this;
        let { datas, tag_select_id, reply_select_id } = that.state;
        if (!datas || datas.length === 0) {
            message.error('转变类型失败，请刷新页面后重试。')
            return;
        }

        let data = datas[tag_select_id];
        let info = data.info[reply_select_id];

        data = Object.assign({}, data, that.titleFormRef.current.getFieldsValue());
        info = Object.assign({}, info, that.replyFormRef.current.getFieldsValue());

        data.info[reply_select_id] = info;
        datas[tag_select_id] = data;

        that.setState({
            datas: datas,
            // infos: infos,
            last_select_input_box: {
                key: '',
                value: '',
            },
        }, () => {
            that.renderFormData();
        })

    }


    //渲染数据
    renderFormData() {
        let that = this;
        let datas = that.state.datas;

        let tag_select_id = that.state.tag_select_id;
        let reply_select_id = that.state.reply_select_id;
        let menu_type = that.props.menu_type;
        //获取数据列表
        let item = datas[tag_select_id];
        if (item) {
            let reply = item.info;
            if (!reply) {
                reply = [{ msg_type: 'text' }];
            }
            //存在回复信息载体
            else {
                if (reply.constructor === String) {
                    reply = JSON.parse(reply.replace(/\n/g, "\\n"));    //将JSON类型的回复信息格式化后 转为对象
                }
            }
            item.status = item.status === 1 ? true : item.status === 2 ? false : item.status;

            //对应公众号信息
            if (menu_type === 'keywords' || menu_type === 'other') {
                let wxCode = item.wxCode;
                if (wxCode.constructor === String) {
                    item.wxCode = wxCode.split(',')
                }
                item.tags = '';
            }
            //其他普通类型
            else {

            }

            item.is_empty = false;
            item.info = reply;
            
            that.setState({
                datas: datas,
            }, () => {
                that.replyFormRef.current.setFieldsValue(reply[reply_select_id]);
                that.titleFormRef.current.setFieldsValue(item);
                //关键字类型  活动控件数据配置
                if (menu_type === 'keywords' || menu_type === 'other') {
                    let replyActivity = item.replyActivity;
                    if (!replyActivity) {
                        //判断当前组件 是否存在，取出组件内数据
                        let activity_ref = that.state.activity_ref;
                        let isEmpty = true; //是否为空数据

                        if (activity_ref) {
                            replyActivity = activity_ref.getDatas();
                            if (replyActivity) {
                                isEmpty = false;
                            }
                        }

                        // if (isEmpty || menu_type === 'other') {
                        if (isEmpty) {
                            replyActivity = {
                                isOpen: false,          //是否开启
                                activityType: 0,        //1.vip活动2返现金
                                activityDayType: '',    //1.固定 2.随机
                                activityDays: '',       //天数, 随机的话是0-配置的天数
                                activityCycle: '',      //领取周期(100000表示永久, 小于100000表示配置天数)
                            }
                        }
                    } else {
                        replyActivity = JSON.parse(replyActivity);
                        replyActivity.isOpen = true;
                    }
                    this.setState({ isShowType:replyActivity.activityType},()=>{console.log(item,"isShowType")})
                    that.refreshActivityBox(replyActivity);
                }

                that.refreshImageBoxByWxCode(); //渲染图片列表控件内部数据
                that.forceUpdate();
            })
        } else {
            item = {};
            item.is_empty = true;
            that.setState({
                datas: datas,
            }, () => {
                that.refreshImageBoxByWxCode();
                that.forceUpdate();
            })
        }
    }

    //Tab创建删除 按钮被点击 回调
    onTabsCreateDeleteClick(index, action) {
        let that = this;
        //删除数据
        if (action === 'remove') {
            Modal.confirm({
                title: '删除数据',
                content: '确认删除这一条数据？',
                onOk: () => {
                    let datas = that.state.datas;
                    let tags = that.state.tags;


                    let delete_data = datas[index];
                    let id = delete_data.id;
                    //删除已存在数据
                    if (id) {
                        that.props.onDelete(id);
                    }
                    //数据不存在 本地临时数据
                    else {
                        tags.splice(index, 1);
                        datas.splice(index, 1);
                        let new_select_id = index - 1;
                        if (new_select_id <= 0) new_select_id = 0;

                        that.setState({
                            tags: tags,
                            datas: datas,
                            tag_select_id: new_select_id,
                            reply_select_id: 0,
                        }, () => {
                            that.titleFormRef.current.resetFields();
                            that.replyFormRef.current.resetFields();
                            that.renderFormData();
                        })
                    }
                },
            })
        }

    }

    //渲染Keywords标签列表
    renderKeywordsTags() {
        let that = this;
        let titleFormRef = that.titleFormRef;

        if (!titleFormRef || !titleFormRef.current) return;

        let keywords = titleFormRef.current.getFieldValue('keywords');
        if (!keywords || keywords.length <= 0) return;

        let last_modify_input = null;
        let last_select_id = '';


        let views = (
            <div>
                {/* 标签列表 */}
                {keywords && keywords.length > 0 && keywords.map((item, index) => {
                    let is = last_select_id === index;


                    if (last_select_id === index)
                        return (
                            <Input></Input>
                        )
                    else
                        return (
                            <Tag>
                                <span onDoubleClick={e => {
                                    // console.log('two click!!!')
                                    // last_select_id = index;
                                    // console.log(last_select_id, index);
                                    // that.forceUpdate();
                                }}>
                                    {item}
                                </span>

                            </Tag>
                        )
                })}

            </div>

        )

        keywords = keywords.join(',');
        titleFormRef.current.setFieldsValue({ keywords: keywords });
        return views;

    }

    //创建和删除新回复按钮被点击
    onReplyItemClick(index, action) {
        let that = this;
        let { datas, tag_select_id, reply_select_id, } = this.state;
        let replys = datas[tag_select_id].info;

        //新增数据
        if (action === 'add') {
            let arr = replys.filter(item => item.option == this.state.optionType)
            if (replys && arr.length >= 3) {
                message.error('一个类型最多只能配置3条回复')
                return;
            }

            replys.push({ msg_type: 'text', option: this.state.optionType });   //如果无数据 将强制一个text类型的回复数据
            let new_reply_select_id = replys.length - 1;
            that.setState({
                datas: datas,
                reply_select_id: new_reply_select_id
            }, () => {
                that.replyFormRef.current.resetFields();
                that.renderFormData();
                console.log(new_reply_select_id,"new_reply_select_id======>")
            })
        }
        //删除数据
        else if (action === 'remove') {
            Modal.confirm({
                title: '删除数据',
                content: '确认删除这条数据吗？',
                onOk: () => {
                    replys = replys.splice(index, 1);

                    let new_reply_select_id = parseInt(reply_select_id) - 1;
                    if (new_reply_select_id <= 0) new_reply_select_id = 0;

                    that.setState({
                        datas: datas,
                        reply_select_id: new_reply_select_id,
                    }, () => {
                        that.replyFormRef.current.resetFields();
                        that.renderFormData();
                    })
                },
            })
        }
    }

    //标题标签被点击
    onTitleTagChangeClick(index) {
        let that = this;

        that.setState({
            tag_select_id: index,
            reply_select_id: 0,
            last_select_input_box: {
                key: '',
                value: '',
            }
        }, () => {
            //清空活动组件数据
            let activity_ref = that.state.activity_ref;
            if (activity_ref) {
                activity_ref.clear();
            }

            that.renderFormData();
        })
    }

    //回复列表标签被点击 切换标签
    onReplyItemChange(index) {
        let that = this;
        let { datas, tag_select_id, reply_select_id } = that.state;

        let data = datas[tag_select_id];
        let infos = data.info;

        //存储老数据
        let last_info = infos[reply_select_id];
        let curr_info = that.replyFormRef.current.getFieldsValue()


        let new_info = Object.assign({}, last_info, curr_info)
        infos[reply_select_id] = new_info;
        that.setState({
            infos: infos,
            reply_select_id: index,
            optionType: infos[Number(index)].option,
            last_select_input_box: {
                key: '',
                value: '',
            },
        }, () => {
            that.titleFormRef.current.resetFields();
            that.replyFormRef.current.resetFields();
            that.renderFormData()
        })
    }


    //Tag分类关闭按钮被点击
    onTagClick(index, item) {
        let that = this;
        let is_select = item.is_select;

        if (is_select) {
            item.is_select = false;
        } else {
            item.is_select = true;
        }
        that.forceUpdate();

    }

    //输入框获取焦点 存储获取焦点的输入框对象
    onInputGetFocus(key, value) {
        let that = this;

        that.setState({
            last_select_input_box: {
                key: key,
                value: value,
            },
        }, () => {
            that.forceUpdate();
        })
    }

    //输入框时区焦点监听
    onInputLoseFocus() {
        let that = this;
        let { datas, tag_select_id, reply_select_id } = that.state;
        let data = datas[tag_select_id];
        if (!data) {
            that.titleFormRef.current.resetFields();
            that.replyFormRef.current.resetFields();
            return;
        }
        let info = data.info[reply_select_id];


        data = Object.assign({}, data, that.titleFormRef.current.getFieldsValue());
        info = Object.assign({}, info, that.replyFormRef.current.getFieldsValue());

        data.info[reply_select_id] = info;
        datas[tag_select_id] = data;

        that.setState({
            datas: datas,
        }, () => {
            that.forceUpdate();
        })
    }
    //添加 #用户名# 按钮被点击 在对应参数后面添加 #name#
    onUserTargetClick(target) {
        let that = this;
        let last_select_input_box = that.state.last_select_input_box;
        let value = last_select_input_box.value;
        if (!value) {
            message.error('请先选择需要添加 #用户名称# 的输入框，获取焦点后再使用。')
            return;
        }

        let curr_info = that.replyFormRef.current.getFieldsValue()
        let last_value = curr_info[value];
        if (!last_value) last_value = "";

        let curr_value = last_value + target

        let obj = {}
        obj[value] = curr_value;
        that.replyFormRef.current.setFieldsValue(obj);
        that.onInputLoseFocus();
    }

    //用户标签选择监听，判断是否存在重复标签
    onUserTagSelectChange(item, option) {
        // let that = this;
        // let dict_user_tags = that.props.dict_user_tags;
        // let tags = that.props.tags;

        // let curr_id = parseInt(item);
        // // let last_id = that.titleFormRef.current.getFieldValue('tags');

        // for (let i = 0, len = tags.length; i < len; i++) {
        //     let tag = tags[i];
        //     let temp_id = tag.id;
        //     if (curr_id === temp_id) {
        //         message.error('这个标签已经存在，请换一个标签');
        //         break;
        //     }
        // }
    }
    //图片上传控件初始化成功 刷新图片列表 
    refreshImageBoxByWxCode() {
        let that = this;
        let ref = that.state.image_box_ref;
        if (!ref) return;

        let { menu_type } = that.props;
        let wxCodeKeys = [];
        if (menu_type === 'keywords' || menu_type === 'other') {
            let wxCode = that.titleFormRef.current.getFieldValue('wxCode');
            wxCodeKeys = [].concat(wxCode)
        } else {
            let request_box = that.props.request_box;
            wxCodeKeys.push(request_box.wxCode);
        }

        //当前被选中的数据源
        let { datas, tag_select_id, reply_select_id } = that.state;
        let data = datas[tag_select_id];
        if (!data) return;
        if (!data.info || data.info <= 0) return;
        let reply = datas[tag_select_id].info[reply_select_id];
        
        let msg_type = reply?reply.msg_type:"text";
        if(!reply){
            this.setState({reply_select_id:0})
        }
        if (msg_type === 'text') return;
        ref.pushSelectWxCodeKeys(wxCodeKeys, msg_type, reply);
    }

    //刷新活动控件
    refreshActivityBox(item) {
        let that = this;
        let ref = that.state.activity_ref;
        if (!ref) return;
        ref.pushActivityData(item);
    }


    //图片盒子上传图片回调
    onImageBoxCallback(imgs) {
        let that = this;
        let { datas, tag_select_id, reply_select_id } = that.state;
        let reply = datas[tag_select_id].info[reply_select_id];
        reply.imgs = imgs;

        that.setState({
            datas: datas,
        })
    }



    //新增按钮被点击 新增一条数据
    onCreateNewDataClick() {
        let that = this;
        let datas = that.state.datas;
        let tags = that.state.tags;

        let activity_ref = that.state.activity_ref;
        if (activity_ref) activity_ref.clear();

        if (datas && datas.length > 0) {
            let last_data = datas[datas.length - 1];
            if (!last_data.id) {
                message.error('你有数据尚未完成创建')
                let tag_select_id = datas.length - 1;
                that.setState({
                    tag_select_id: tag_select_id,
                }, () => {
                    that.renderFormData();
                })
                return;
            }
        }
        let menu_type = that.props.menu_type;
        let new_data = {}
        new_data.id = '';
        new_data.status = false;

        //多数据组合类型
        if (menu_type === 'keywords' || menu_type === 'other') {
            new_data.name = '';
            new_data.code = '';
            new_data.wxCode = [];
        }
        //其他类型数据
        else {
            new_data.tags = '';
        }

        let new_info = [{ msg_type: 'text' }];
        new_data.info = new_info;

        datas.push(new_data)
        let tag_select_id = datas.length - 1;
        tags.push({ name: '保存后更新' })

        that.setState({
            tags: tags,
            datas: datas,
            tag_select_id: tag_select_id,
            reply_select_id: 0,
            image_box_ref: null,
        }, () => {
            that.titleFormRef.current.resetFields();
            that.replyFormRef.current.resetFields();
            that.renderFormData();
        })
    }

    //向上层传递处理好的数据 等待保存
    onSaveEiditClick() {
        let that = this;
        let datas = that.state.datas;
        // let infos = that.state.infos;
        let menu_type = that.props.menu_type;           //校验上传标签
        let tag_select_id = that.state.tag_select_id;

        let data = datas[tag_select_id];
        if (!data) {
            message.error('请刷新后重传数据');
            return;
        }

        //data层需要更新的数据
        let result_data = Object.assign({}, data, that.titleFormRef.current.getFieldsValue());
        let info = result_data.info;

        for (let i = 0, len = info.length; i < len; i++) {
            let temp = info[i];
            let content = temp.content;
            if (content) {
                temp.content = content.replace('\\n', '\n');
            }
        }
        console.log(info, "info===========>")
        result_data.info = JSON.stringify(info);

        result_data.replyObjType = 2;
        result_data.msgType = 'multi';

        let request_box = that.props.request_box;
        if (request_box.code) result_data.code = request_box.code;

        if (menu_type === 'keywords' || menu_type === 'other') {
            //微信公众号
            let local_wx_code = result_data.wxCode;
            if (!local_wx_code || local_wx_code.length <= 0) {
                message.error('请选择微信公众号')
                return;
            }
            if (local_wx_code) {
                if (local_wx_code.constructor === Array) {
                    local_wx_code = local_wx_code.join(',');
                }
                result_data.wxCode = local_wx_code;
            }
        }
        //其他类型 wxCode为类型
        else {
            if (request_box.wxCode) result_data.wxCode = request_box.wxCode;
        }

        //获取推送活动数据
        if (menu_type === 'keywords' || menu_type === 'other') {
            let activity_ref = that.state.activity_ref;
            let activity_ref_data = activity_ref.getDatas();
            console.log("activity_ref_data========>",activity_ref_data)
            if (activity_ref_data) {
                let isOpen = activity_ref_data.isOpen;
                if (isOpen) {
                    delete activity_ref_data.isOpen;
                    if (!activity_ref_data.activityType) {
                        message.error('请选择开展的活动');
                        return;
                    }
                    if (activity_ref_data.activityType == 1) {
                        if (!activity_ref_data.activityDayType) {
                            message.error('请选择活动Vip天数类型');
                            return;
                        }
                        if (!activity_ref_data.activityDays) {
                            message.error('请输入活动Vip天数');
                            return;
                        }
                        if (!activity_ref_data.activityCycle) {
                            message.error('请输入活动领取周期');
                            return;
                        }

                        result_data.replyActivity = JSON.stringify(activity_ref_data);
                    } else {
                        console.log(activity_ref_data)
                        if (!activity_ref_data.activityDayType) {
                            message.error('请选择金额类型');
                            return;
                        }
                        if (!activity_ref_data.activityMoney) {
                            message.error('请输入金额数量');
                            return;
                        }
                        if (!activity_ref_data.activityTotalMoney) {
                            message.error('请输入总金额数量');
                            return;
                        }
                        if (!activity_ref_data.activityTimes) {
                            message.error('请输入参与次数');
                            return;
                        }
                        // activity_ref_data.activityTimes = Number(activity_ref_data.activityTimes)
                        result_data.replyActivity = JSON.stringify(activity_ref_data);
                    }

                } else {
                    result_data.replyActivity = '';
                }
            }
        }


        result_data.status = result_data.status === true ? 1 : 2;   //状态

        if (menu_type !== 'keywords' && menu_type !== 'other') {
            let id = result_data.id;
            let tag_list = that.state.tags;
            let new_tag = result_data.tags;
            if (!new_tag) {
                message.error('请为数据选择标签。');
                return;
            }


            //筛选 过滤 判断标签是否重复
            for (let i = 0, len = tag_list.length; i < len; i++) {
                let item = tag_list[i];
                let temp_id = item.id;
                if (id === temp_id) continue;
                let code = item.code;
                if (code === new_tag) {
                    Modal.error({
                        title: '标签冲突',
                        content: `与第${i + 1}条数据标签冲突，请检查数据的标签名称。`,
                    });
                    return;
                }
            }
        }

        that.setState({
            is_edit_mode: true,
        }, () => {
            // return console.log(result_data,"result_data")
            that.props.onSave(result_data);
        })
    }

    getIndex(item) {
        console.log(item)
    }
}

