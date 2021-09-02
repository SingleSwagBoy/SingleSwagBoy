/*
 * @Author: HuangQS
 * @Date: 2021-08-30 15:27:40
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-02 13:49:05
 * @Description: 微信自动回复模块
 */


import React, { Component } from 'react';
import { Modal, Tabs, Divider, Button, Input, Upload, Image, message, Select, Switch, Alert, Tooltip, Form, Radio, Layout } from 'antd';
import "./wxReplyModal.css";
import ImageUpload from "@/components/ImageUpload/index" //图片组件

let { TabPane } = Tabs;
let { TextArea } = Input;
let { Option } = Select;


export default class WxReplyModal extends Component {
    constructor(props) {
        super(props);
        this.titleFormRef = React.createRef();      //如果有额外的title From 放这里
        this.replyFormRef = React.createRef();

        this.state = {
            base_width: 450,
            is_edit_mode: false,    //编辑模式
            datas: [],              //数据源
            tags: [],               //标题 标签 分类

            item: {},               //当前数据源
            infos: [],              //回复列表
            wxCodes: [],            //在[自定义二维码回复]类型中展示 
            tag_select_id: 0,       //标题标签选中id
            reply_select_id: 0,     //回复消息选中id

        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }

    render() {
        let that = this;
        let { menu_type, } = that.props;
        let { dict_msg_type, dict_public_types, dict_user_tags, } = that.props;
        let { tags, item, base_width, infos, tag_select_id, reply_select_id } = that.state;
        let targetReplyId = parseInt(reply_select_id) + 1;
        return (
            <div key='modal'>
                <div>
                    <Alert className="alert-box" message="微信自动回复数据载体" type="success" action={
                        <div>
                            <Tooltip title='新增数据' placement='top'>
                                <Button type="primary" onClick={() => { that.onCreateNewDataClick() }} >新增</Button>
                            </Tooltip>
                        </div>
                    }>
                    </Alert>
                    {/* 所有被选中的标签 */}
                    <Tooltip title='当前自动回复消息相关联影响的标签' placement="top" color={'purple'} >
                        <div className="tap-wrapper">
                            <Tabs type="editable-card" hideAdd activeKey={`${tag_select_id}`}
                                onEdit={(targetKey, action) => that.onTabsCreateDeleteClick(targetKey, action)} onChange={(activeKey) => that.onTitleTagChangeClick(activeKey)}  >
                                {tags.map((item, index) => (
                                    <TabPane tab={item.name} key={`${index}`}></TabPane>
                                ))}
                            </Tabs>
                        </div>
                    </Tooltip>
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
                                    {
                                        menu_type === 'keywords' &&
                                        <div>
                                            <Form.Item label='分类名称' name='ruleName' >
                                                <Input style={{ width: base_width }} placeholder='请输入分类名称' />
                                            </Form.Item>
                                            <Form.Item label='关键字' name='keywords' >
                                                <Input style={{ width: base_width }} placeholder='请输入关键字' />
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        menu_type === 'other' &&
                                        <div>
                                            <Form.Item label='名称' name='name' >
                                                <Input style={{ width: base_width }} placeholder='请输入名称' />
                                            </Form.Item>
                                            <Form.Item label='编码' name='code' >
                                                <Input style={{ width: base_width }} placeholder='请输入编码' />
                                            </Form.Item>
                                            <Form.Item label='回复公众号' name='wxCodes' >
                                                <Select style={{ width: base_width }} mode="multiple" allowClear placeholder='请选择回复公众号' >
                                                    {dict_public_types.map((item, index) => (
                                                        <Option value={item.code}>{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        menu_type !== 'keywords' && menu_type !== 'other' &&
                                        <div>
                                            <Form.Item label='标签' name='tags' >
                                                <Select style={{ width: base_width }} placeholder="请选择用户设备标签" onChange={(value) => that.onUserTagSelectChange(value)}>
                                                    {dict_user_tags.map((item, index) => (
                                                        <Option value={item.id.toString()} key={item.id}>{item.id}-{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    }
                                    <Form.Item label='状态' name='status' valuePropName='checked'>
                                        <Switch checkedChildren="有效" unCheckedChildren="无效" />
                                    </Form.Item>
                                </Form>
                            </div>

                            {/* 手机界面 */}
                            <div className="phone-wrapper-outer">
                                <div className="phone-wrapper">
                                    {infos.map((item, index) => (
                                        <div className='phone-message-box'>
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
                                                            <Image width={140} height={140} src={item.pic_url}></Image>
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
                                                        {/* <div className='phone-url'>{item.url}</div> */}
                                                        <div className='phone-image'>
                                                            <Image width={140} height={140} src={item.pic_url}></Image>
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
                                                            <Image width={140} height={140} src={item.pic_url}></Image>
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
                                <Tabs type="editable-card" tabPosition={"left"} activeKey={`${reply_select_id}`}
                                    onEdit={(targetKey, action) => that.onReplyItemClick(targetKey, action)} onChange={(activeKey) => that.onReplyItemChange(activeKey)}>
                                    {infos.map((item, index) => (
                                        <TabPane tab={`第${index + 1}条`} key={`${index}`}></TabPane>
                                    ))}
                                </Tabs>
                            </div>
                            <div className="content-wrapper">
                                {/* 数据源 */}
                                <Form style={{ width: 600, minHight: 500 }} name='recom' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} ref={that.replyFormRef}>
                                    {that.replyFormRef && that.replyFormRef.current && (
                                        <div>
                                            <Form.Item label='消息类型' name='msg_type' >
                                                <Radio.Group onChange={(e) => that.onRadioClick(e)}>
                                                    {dict_msg_type.map((item, index) => (
                                                        <Radio value={item.key}>{item.value}</Radio>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            {
                                                // 文字回复
                                                that.replyFormRef.current.getFieldValue('msg_type') === 'text' &&
                                                <div>
                                                    <Form.Item label='文字回复' name='content'>
                                                        <TextArea style={{ width: base_width }} rows={5} placeholder='请输入文字回复' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                </div>
                                            }

                                            {
                                                // 图片回复
                                                that.replyFormRef.current.getFieldValue('msg_type') === 'image' &&
                                                <div>
                                                    <Form.Item label='图片上传'>
                                                        <Form.Item >
                                                            <ImageUpload getUploadFileUrl={that.getUploadFileUrl.bind(this)}
                                                                imageUrl={that.replyFormRef.current.getFieldValue("pic_url") ? that.replyFormRef.current.getFieldValue("pic_url") : ""}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name='pic_url'>
                                                            <TextArea style={{ width: base_width }} rows={3} placeholder='请输入图片地址' onBlur={() => that.onInputLoseFocus()} />
                                                        </Form.Item>
                                                    </Form.Item>
                                                </div>
                                            }

                                            {
                                                // 图文回复
                                                that.replyFormRef.current.getFieldValue('msg_type') === 'news' &&
                                                <div>
                                                    <Form.Item label='标题' name='title'>
                                                        <Input style={{ width: base_width }} placeholder='请输入标题' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='摘要' name='description'>
                                                        <TextArea style={{ width: base_width }} rows={5} placeholder='请输入摘要' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='内容' name='content'>
                                                        <TextArea style={{ width: base_width }} rows={5} placeholder='请输入内容' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>

                                                    <Form.Item label='图片上传'>
                                                        <Form.Item >
                                                            <ImageUpload getUploadFileUrl={that.getUploadFileUrl.bind(this)}
                                                                imageUrl={that.replyFormRef.current.getFieldValue("pic_url") ? that.replyFormRef.current.getFieldValue("pic_url") : ""}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name='pic_url' >
                                                            <TextArea style={{ width: base_width }} rows={3} placeholder='请输入图片地址' onBlur={() => that.onInputLoseFocus()} />
                                                        </Form.Item>
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
                                                        <Input style={{ width: base_width }} placeholder='请输入小程序标题' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='小程序appId' name='appid'>
                                                        <Input style={{ width: base_width }} placeholder='请填写小程序Appid' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='小程序路径' name='path'>
                                                        <TextArea style={{ width: base_width }} rows={3} placeholder='小程序页面 示例：pages/index/hqs' onBlur={() => that.onInputLoseFocus()} />
                                                    </Form.Item>
                                                    <Form.Item label='图片上传'>
                                                        <Form.Item >
                                                            <ImageUpload getUploadFileUrl={that.getUploadFileUrl.bind(this)}
                                                                imageUrl={that.replyFormRef.current.getFieldValue("pic_url") ? that.replyFormRef.current.getFieldValue("pic_url") : ""}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item name='pic_url'>
                                                            <TextArea style={{ width: base_width }} rows={3} placeholder='请输入图片地址' onBlur={() => that.onInputLoseFocus()} />
                                                        </Form.Item>
                                                    </Form.Item>


                                                </div>
                                            }
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </div>
                        <div className="reply-wrapper">
                            <div className="tab-wrapper"></div>
                            <div className="btn-wrapper">
                                {
                                    that.titleFormRef && that.titleFormRef.current && that.replyFormRef && that.replyFormRef.current &&
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
    injectFormData(item) {
        let that = this;
        if (!that.titleFormRef || !that.titleFormRef.current || !that.replyFormRef || !that.replyFormRef.current) {
            let interval = setInterval(() => {
                if (!that.titleFormRef || !that.titleFormRef.current || !that.replyFormRef || !that.replyFormRef.current) {
                } else {
                    clearInterval(interval);
                    that.initFormData(item);
                }
            }, 1000)
        } else {
            that.initFormData(item);
        }
    }

    //根据传入数据 转换为需要的类型
    initFormData(datas) {
        let that = this;
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
        that.titleFormRef.current.resetFields();
        that.replyFormRef.current.resetFields();

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
                tag = { id: i, name: name }
            }
            //自定义二维码回复
            else if (menu_type === 'other') {
                let name = item.name;
                if (!name || name.length <= 0) {
                    name = `第${item.id + 1}条`;
                }
                tag = { id: i, name: name }
            }
            //其他类型
            else {
                if (!tag) {
                    tag = { name: `[老数据id:${item.id}]` }
                } else {
                    let obj = { id: -1, name: tag };
                    for (let j = 0, jlen = dict_user_tags.length; j < jlen; j++) {
                        let temp_tag_item = dict_user_tags[j];
                        if (`${temp_tag_item.id}` === tag) {
                            let name = temp_tag_item.name;
                            let id = parseInt(temp_tag_item.id);
                            obj = { id: id, name: name }
                            break;
                        }
                    }
                    tag = obj;
                }
            }
            tags.push(tag);

            //将info转为对象类型
            let info = item.info;
            item.info = !info ? [] : JSON.parse(info);
        }
        let is_edit_mode = that.state.is_edit_mode;
        let tag_select_id = 0;
        let reply_select_id = 0;

        //防止编辑模式时 数据刷新导致选择框错误
        if (is_edit_mode) {
            tag_select_id = that.state.tag_select_id;
            reply_select_id = that.state.reply_select_id;
        }

        that.setState({
            tags: tags,
            datas: datas,
            tag_select_id: tag_select_id,
            reply_select_id: reply_select_id,
            is_edit_mode: false,
        }, () => {
            that.renderFormData();
        })
    }


    //点选按钮被点击
    onRadioClick(e) {
        let that = this;
        //let value = e.target.value;

        let datas = that.state.datas;
        if (!datas || datas.length === 0) {
            message.error('没有获取到数据，请刷新页面。')
            return;
        }

        let tag_select_id = that.state.tag_select_id;
        let reply_select_id = that.state.reply_select_id;

        let infos = that.state.infos;
        let last_info = infos[reply_select_id];
        let curr_info = Object.assign({}, last_info, that.replyFormRef.current.getFieldsValue());

        infos[reply_select_id] = curr_info;
        datas[tag_select_id].infos = curr_info;

        that.setState({
            datas: datas,
            infos: infos,
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
            let infos = item.info;
            if (!infos || infos.length <= 0) {
                infos = [];
                infos.push({ msg_type: 'text' })
            }

            let result_item = Object.assign({}, item);
            result_item.status = item.status === 1 ? true : false;

            //关键字回复
            if (menu_type === 'keywords') {
            }
            //更新[自定义二维码回复]类型对应的wxCode数据
            else if (menu_type === 'other') {
                let wxCodes = [];
                let tempWxCode = item.wxCode;
                if (tempWxCode && tempWxCode.length > 0) {
                    wxCodes = tempWxCode.split(',');
                } else {
                    wxCodes = [];
                }
                result_item.wxCodes = wxCodes;
            }
            //其他类型数据
            else {
                let tags = item.tags;
                if (!tags) delete result_item.tags;
            }

            that.titleFormRef.current.setFieldsValue(result_item);

            item.is_empty = false;
            item.info = infos;
            datas[tag_select_id] = item;

            that.setState({
                item: item,
                infos: infos,
                datas: datas,
            }, () => {
                let curr_data = infos[reply_select_id];         //渲染当前分类数据下 第x个数据的信息
                that.replyFormRef.current.setFieldsValue(curr_data);
                that.forceUpdate();
            })
        } else {
            item = {}
            item.is_empty = true;
            that.setState({
                item: item,
            }, () => {
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


    //创建和删除新回复按钮被点击
    onReplyItemClick(index, action) {
        let that = this;
        let infos = that.state.infos;
        let reply_select_id = that.state.reply_select_id;

        //新增数据
        if (action === 'add') {
            if (infos && infos.length >= 3) {
                message.error('最多只能配置3条回复')
                return;
            }

            infos.push({ msg_type: 'text' });   //如果无数据 将强制一个text类型的回复数据
            let new_reply_select_id = parseInt(reply_select_id) + 1;

            that.setState({
                infos: infos,
                reply_select_id: new_reply_select_id
            }, () => {
                that.replyFormRef.current.resetFields();
                that.renderFormData();
            })
        }
        //删除数据
        else if (action === 'remove') {
            Modal.confirm({
                title: '删除数据',
                content: '确认删除这条数据吗？',
                onOk: () => {
                    infos = infos.splice(index, 1);

                    let new_reply_select_id = parseInt(reply_select_id) - 1;
                    if (new_reply_select_id <= 0) new_reply_select_id = 0;

                    that.setState({
                        infos: infos,
                        reply_select_id: new_reply_select_id,
                    }, () => {
                        that.replyFormRef.current.resetFields();
                        that.renderFormData();
                    })
                },
            })
        }
    }
    //获取上传的图片路径
    getUploadFileUrl(file) {
        let that = this;
        that.replyFormRef.current.setFieldsValue({ "pic_url": file });
        that.onInputLoseFocus();
    }

    //标题标签被点击
    onTitleTagChangeClick(index) {
        let that = this;
        that.replyFormRef.current.resetFields();

        that.setState({
            tag_select_id: index,
            reply_select_id: 0,
        }, () => {
            that.renderFormData();
        })
    }

    //回复列表标签被点击 切换标签
    onReplyItemChange(index) {
        let that = this;
        let infos = that.state.infos;
        let reply_select_id = that.state.reply_select_id;

        //存储老数据
        let last_info = infos[reply_select_id];
        let curr_info = that.replyFormRef.current.getFieldsValue()

        let new_info = Object.assign({}, last_info, curr_info)
        infos[reply_select_id] = new_info;

        that.setState({
            infos: infos,
            reply_select_id: index,
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

    //输入框时区焦点监听
    onInputLoseFocus() {
        let that = this;
        let infos = that.state.infos;
        let reply_select_id = that.state.reply_select_id;

        let last_info = infos[reply_select_id];
        let curr_info = that.replyFormRef.current.getFieldsValue()

        let new_info = Object.assign({}, last_info, curr_info)
        infos[reply_select_id] = new_info;
        that.setState({
            infos: infos
        }, () => {
            that.forceUpdate();
        })
    }

    //用户标签选择监听，判断是否存在重复标签
    onUserTagSelectChange(item) {
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

    //新增按钮被点击 新增一条数据
    onCreateNewDataClick() {
        let that = this;
        let datas = that.state.datas;
        let tags = that.state.tags;

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

        //关键字回复
        if (menu_type === 'keywords') {
            new_data.ruleName = '';
            new_data.keywords = '';
        }
        //更新[自定义二维码回复]类型对应的wxCode数据
        else if (menu_type === 'keywords') {
            new_data.name = '';
            new_data.code = '';
            new_data.wxCodes = [];
        }
        //其他类型数据
        else {
            new_data.tags = '';
        }

        let new_info = [];
        new_data.infos = new_info;

        datas.push(new_data)
        let tag_select_id = datas.length - 1;
        tags.push({ name: '保存后更新' })

        that.setState({
            tags: tags,
            datas: datas,
            tag_select_id: tag_select_id,
            reply_select_id: 0,
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
        let infos = that.state.infos;

        let tag_select_id = that.state.tag_select_id;

        let data = datas[tag_select_id];


        let extra_data = that.titleFormRef.current.getFieldsValue();    //data层需要更新的数据

        let result_data = Object.assign({}, data, extra_data);
        delete result_data.infos;

        result_data.info = JSON.stringify(infos);
        result_data.replyObjType = 2;
        result_data.msgType = 'multi';

        let request_box = that.props.request_box;
        if (request_box.code) result_data.code = request_box.code;
        if (request_box.wxCode) result_data.wxCode = request_box.wxCode;
        // if (request_box.notCode) result_data.notCode = request_box.notCode;
        let id = result_data.id;
        that.setState({
            is_edit_mode: true,
        }, () => {
            that.props.onSave(result_data);
        })
    }

}

