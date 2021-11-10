/*
 * @Author: HuangQS
 * @Date: 2021-10-26 11:18:31
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-03 11:46:44
 * @Description: 广告组策略
 */
import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, Radio, Divider, Image, message, Switch, InputNumber } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import util from 'utils'
import { MySyncBtn, MyTagSelect, MyTagConfigFormulas } from '@/components/views.js';
import AdCreateModal from './adGroupCreateModal';
import AdChooseModal from './adGroupChooseModal';

import {
    requestNewAdTagList,                    //获取 标签列表
    requestAdFieldList,                     //获取 Field列表

    requestNewGroupCreate,                  //新建广告组
    requestNewGroupUpdate,                  //更新广告组
    requestNewGroupList,                    //获取广告组
    requestNewGroupDelete,                  //删除广告组
    requestNewGroupCopy,                    //复制广告组
    requestAdRightKey,                      ///右键运营位
    getScreen,//获取屏显广告

} from 'api';

// import { util } from 'echarts';

let { RangePicker } = DatePicker;
let { Option } = Select;


export default class adGroup extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            modal_choose_ad_ref: null,      //选择广告对话框
            modal_create_ad_ref: null,      //创建广告对话框

            dict_ad_type: [
                { key: 1, value: '右键运营位' },
                { key: 2, value: '屏显广告' },
            ],
            //标签列表
            dict_target_list: [],
            dict_field_list: [],

            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
            },
            adList: [],
            tag_select_id: 0,
            adIndex: 1,
            currentItem: "",
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
            tagWarn: {
                wrapperCol: { offset: 4, span: 20 },
            },
            source: "",
            search: {
                groupName: "",
                onlineTime: "",
                offlineTime: "",
                tag: "",
                adName: "",
                adType: "",
            }
        }
    }

    render() {
        let that = this;
        let { table_box, modal_box
            , dict_ad_type, dict_target_list, dict_field_list } = that.state;

        return (
            <div>
                <Alert message="配置列表" type="success" action={
                    <div className="alert-box">
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增广告组</Button>
                        <MySyncBtn type={11} name='同步缓存' />
                    </div>
                } />
                <Alert type="success" action={
                    <div className="alert-box">
                        <Input style={{ width: '200px', marginLeft: 5 }} allowClear placeholder="搜索广告组名称" onChange={(e) => { this.state.search.groupName = e.target.value }} />
                        <RangePicker style={{ marginLeft: 5 }} style={{ width: '405px', marginLeft: 5 }} showTime placeholder={['上线时间', '下线时间']} onChange={(e) => {
                            this.state.search.onlineTime = e ? parseInt(e[0].valueOf() / 1000) : ""
                            this.state.search.offlineTime = e ? parseInt(e[1].valueOf() / 1000) : ""
                        }} />
                        <Input style={{ width: '200px', marginLeft: 5 }} allowClear placeholder="搜索广告名称" onChange={(e) => { this.state.search.adName = e.target.value }} />
                        <Input style={{ width: '200px', marginLeft: 5 }} allowClear placeholder="广告内容" />
                        <Select style={{ width: '200px', marginLeft: 5 }} allowClear showSearch placeholder="请选择标签"
                            onChange={(e) => { this.state.search.tag = e }}
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
                            {this.state.dict_target_list.map((item, index) => (
                                <Option value={item.code.toString()} key={item.code}>{item.code}-{item.name}</Option>
                            ))}
                        </Select>
                        <Select style={{ width: '200px', marginLeft: 5 }} allowClear showSearch placeholder="广告内容"
                            onChange={(e) => { this.state.search.adType = e }}
                        >
                            <Option value={1} key={1}>右键运营位广告</Option>
                            <Option value={2} key={2}>屏显广告</Option>
                        </Select>
                        <Button type="primary" onClick={() => { this.refreshList(this.state.search) }}>查询</Button>
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={1500} style={{ top: 20 }} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    footer={null}
                // destroyOnClose
                // footer={[
                //     <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                //     <Button onClick={() => that.onModalConfirmClick()} >保存</Button>
                // ]}
                >

                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} ref={that.formRef} onFinish={this.onModalConfirmClick.bind(this)}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {/* {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                } */}

                                <Form.Item label="广告组名称" name='name' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder="请输入广告组名称" />
                                </Form.Item>
                                <Form.Item label="上线时间-下线时间" name='time'>
                                    <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                                </Form.Item>
                                <Form.Item label="最大下发量" name="dealtMaxNum">
                                    <Input className="base-input-wrapper" placeholder="这里是最大下发量" />
                                </Form.Item>
                                <Form.Item label="排序" name="sortOrder">
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item label="备注" name="remark">
                                    <Input className="base-input-wrapper" placeholder="这里是备注" />
                                </Form.Item>
                                <Form.Item label="状态" name="status" valuePropName="checked">
                                    <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                                </Form.Item>
                                <Form.Item name="tag" label="标签" >
                                    <Select className="base-input-wrapper" showSearch placeholder="请选择标签" allowClear
                                        onChange={(e) => {
                                            let selectCode = e;
                                            if (!selectCode) return that.formRef.current.setFieldsValue({ 'tag': "" });
                                            //更新下方rule数据
                                            for (let i = 0, len = dict_target_list.length; i < len; i++) {
                                                let item = dict_target_list[i];
                                                if (item.code === selectCode) {
                                                    console.log('rule', item);
                                                    that.formRef.current.setFieldsValue({ 'rule': item.rule })
                                                    break;
                                                }
                                            }
                                            that.forceUpdate();
                                        }}
                                        onClear={() => {
                                            that.formRef.current.setFieldsValue({ 'rule': [] })
                                            that.forceUpdate();
                                        }}
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
                                        }}>
                                        {dict_target_list.map((item, index) => (
                                            <Option value={item.code.toString()} key={item.code}>{item.code}-{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item  {...this.state.tagWarn}>
                                    如需要新增管理标签配置，请点击[<a onClick={() => that.onTagConfigClick()}>标签配置</a>]跳转到配置页中完成规则。
                                </Form.Item>

                                {/* {
                                    that.formRef.current.getFieldValue('rule') &&
                                    <Form.Item name='rule' >
                                        <MyTagConfigFormulas formRef={that.formRef} dict_field={dict_field_list} is_show_only={true} />
                                    </Form.Item>
                                } */}




                                {/* <div style={{ border: '1px dashed #9b709e' }}> */}
                                <div>
                                    <Divider>广告详情</Divider>
                                    <Form.Item label="广告类型" value={this.state.adIndex}>
                                        <Radio.Group className="base-input-wrapper" defaultValue={this.state.adIndex} key={this.state.adIndex}
                                            onChange={(e) => {
                                                this.formRef.current.setFieldsValue({ "detailName": "", "detailTime": "", "detailPic": "", "detailIconPicUrl": "" })
                                                let arr = this.formRef.current.getFieldValue("content") ? JSON.parse(JSON.stringify(this.formRef.current.getFieldValue("content"))) : []
                                                let list = arr.filter(item => item.adType == e.target.value)
                                                this.setState({
                                                    adList: list,
                                                    tag_select_id: list.length > 0 ? list[0].adId : 0,
                                                    adIndex: e.target.value
                                                })

                                                if (e.target.value == 1) {
                                                    this.requestAdRightKey(list.length > 0 ? list[0].adId : "")
                                                } else {
                                                    this.getScreen(list.length > 0 ? list[0].adId : "")
                                                }
                                                this.forceUpdate()
                                            }}
                                        >
                                            {dict_ad_type.map((item, index) => {
                                                return (
                                                    <Radio value={item.key} >
                                                        {item.value}(5条)
                                                    </Radio>
                                                )
                                            })}
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item label="广告列表">
                                        <MyTagSelect style={{ width: '100%' }} tags={this.state.adList}
                                            tag_select_id={this.state.tag_select_id} show_create={true} btns={["挑选素材", "手动新增"]}
                                            onTagCreateClick={(key) => that.onTagSelectClick(key)}
                                            onSelectIdChange={(index, id) => that.onTagSelectChange(index, id)}
                                            onTabsDeleteClick={(index, id) => { that.deleteTabChange(index, id) }}
                                        />
                                    </Form.Item>
                                    {/* <Form.Item label="广告类型">
                                    </Form.Item> */}
                                    <Form.Item label="广告名称" name="detailName">
                                        <Input className="base-input-wrapper" placeholder="这里是广告名称" disabled />
                                    </Form.Item>
                                    <Form.Item label="广告时间" name="detailTime">
                                        <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} disabled />
                                    </Form.Item>
                                    {
                                        this.state.adIndex == 1 &&
                                        <Form.Item label="缩略图">
                                            <Image width={100} src={this.formRef.current.getFieldValue("detailIconPicUrl")} />
                                        </Form.Item>
                                    }

                                    <Form.Item label="背景图" name="detailPic">
                                        <Image width={100} src={this.formRef.current.getFieldValue("detailPic")} />
                                    </Form.Item>
                                    <Form.Item {...this.state.tailLayout}>
                                        <Button onClick={() => { this.onModalCancelClick() }}>取消</Button>
                                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                            确定
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        }
                    </Form>
                </Modal>
                {/* 广告创建 */}
                <AdCreateModal onRef={(ref) => { that.setState({ modal_create_ad_ref: ref }) }} adIndex={this.state.adIndex} onGetInfo={this.getInfo.bind(this)} />
                {/* 广告选择 */}
                <AdChooseModal onRef={(ref) => { that.setState({ modal_choose_ad_ref: ref }) }} onGetInfo={this.getInfo.bind(this)} />

            </div>
        );
    }


    componentDidMount() {
        let that = this;
        that.initData();
    }

    initData() {
        let that = this;
        let { table_box } = that.state;
        let table_title = [
            { title: '广告组名称', dataIndex: 'name', key: 'name', width: 200, },
            { title: '标签', dataIndex: 'tag', key: 'tag', width: 200, },
            {
                title: '上下线时间', dataIndex: 'time', key: 'time',
                render: (rowValue, row, index) => {
                    return(
                        <div>{row.onlineTime?util.formatTime(row.onlineTime, ""):"未配置"} - {row.offlineTime?util.formatTime(row.offlineTime, ""):"未配置"}</div>
                    )
                }
            },
            { title: '下发量', dataIndex: 'dealtNum', key: 'dealtNum', },
            {
                title: '状态', dataIndex: 'status', key: 'status', width: 200,
                render: (rowValue, row, index) => {
                    // 1、有效,2、无效
                    if (rowValue == '1') return '有效';
                    if (rowValue == '2') return '无效';
                    return '';
                }
            },
            { title: '备注', dataIndex: 'remark', key: 'remark', width: 200, },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 210,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => { this.requestNewGroupCopy(row) }}>复制</Button>
                            <Button size='small' style={{ marginLeft: 5 }} onClick={() => {
                                console.log(row)
                                this.onCreateClick(row)

                            }}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 5 }} onClick={() => {
                                this.requestNewGroupDelete(row.id)
                            }}>删除</Button>
                        </div>
                    );
                }
            },
        ];

        table_box.table_title = table_title;

        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList();
        });


        //获取标签信息
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            that.setState({
                dict_target_list: res.data,
            });
        })

        //标签数据类型信息
        requestAdFieldList({}).then(res => {
            that.setState({
                dict_field_list: res.data,
            })
        })
    }

    refreshList(val) {
        let that = this;
        let { table_box } = that.state;
        let params = {
            ...val
        }
        requestNewGroupList(val ? params : {}).then(res => {
            console.log('group_list', res.data);

            table_box.table_datas = res.data;
            that.setState({
                table_box: table_box,
            });
        })
    }

    onCreateClick(row) {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '新增广告组',
            },
        }, () => {
            console.log(this.state.adIndex)
            if (row) {
                let obj = JSON.parse(JSON.stringify(row))
                obj.time = [obj.onlineTime?moment(obj.onlineTime * 1000):"", obj.offlineTime?moment(obj.offlineTime * 1000):""]
                obj.status = obj.status == 1 ? true : false
                let list = obj.content ? obj.content.filter(item => item.adType == 1) : []
                this.setState({
                    adList: list,
                    currentItem: row,
                    source: "upload",
                    tag_select_id: list.length > 0 ? list[0].adId : 0,
                })
                this.requestAdRightKey(list.length > 0 ? list[0].adId : "")
                this.formRef.current.setFieldsValue(obj ? obj : "")
            } else {
                this.setState({
                    adList: [],
                    source: "add"
                })
            }
            that.forceUpdate();

        })

    }

    //弹出框取消按钮被点击
    onModalCancelClick() {
        let that = this;
        this.formRef.current.resetFields()
        that.setState({
            modal_box: {
                is_show: false,
                title: '',
            },
            adIndex: 1
        }, () => {
            console.log(this.state.adIndex, "adIndex")
        })

        this.forceUpdate()
    }

    //弹出框确定按钮被点击
    onModalConfirmClick(val) {
        let that = this;
        if (this.state.source == "upload") {
            this.requestNewGroupUpdate(val)
        } else {
            this.requestNewGroupCreate(val)
        }
    }


    //标签选择被点击
    onTagSelectClick(key) {
        console.log(key)
        let that = this;
        if (key === '挑选素材') {
            let { modal_choose_ad_ref } = that.state;
            let obj = {
                title: key,
            }
            modal_choose_ad_ref.showModal(obj, this.state.adIndex, this.state.adList);

        }
        //
        else if (key === '手动新增') {
            let { modal_create_ad_ref } = that.state;
            let obj = {
                title: key,
            }
            modal_create_ad_ref.showModal(obj, this.state.adIndex);
        }
    }

    //标签选择器 标签变更
    onTagSelectChange(index, id) {
        console.log(index, id)
        this.setState({
            tag_select_id: id
        })
        if (this.state.adIndex == 1) {
            this.requestAdRightKey(id)
        } else {
            this.getScreen(id)
        }

    }

    //标签配置页被点击
    onTagConfigClick() {
        let that = this;
        // that.forceUpdate();

        Modal.confirm({
            title: '跳转',
            content: '你将要跳转到标签配置页，未保存的数据将不会存储到云端，是否立即跳转？',
            onOk: () => {
                this.props.history.push("/mms/config/tagConfig")
            }
        })
    }
    requestNewGroupUpdate(val) { //更新
        delete val.detailName
        delete val.detailPic
        delete val.detailTime
        console.log(this.formRef.current.getFieldValue("content"),val, "val")
        let params = {
            ...this.state.currentItem,
            ...val,
            status: val.status ? 1 : 2,
            offlineTime: (val.time && val.time[1])?val.time[1].toDate().getTime() / 1000:"",
            onlineTime: (val.time && val.time[0])?val.time[0].toDate().getTime() / 1000:"",
            content: this.formRef.current.getFieldValue("content")
        }
        delete params.time
        // return console.log(params,"params")
        requestNewGroupUpdate(params).then(res => {
            console.log('group_list', res.data);
            this.refreshList()
            this.onModalCancelClick()
        })
    }
    requestNewGroupCreate(val) { //新建
        delete val.detailName
        delete val.detailPic
        delete val.detailTime
        console.log(val, "val")
        let params = {
            ...val,
            status: val.status ? 1 : 2,
            offlineTime: val.time?parseInt(val.time[1].toDate().getTime() / 1000):"",
            onlineTime: val.time?parseInt(val.time[0].toDate().getTime() / 1000):"",
            content: this.formRef.current.getFieldValue("content")
        }
        delete params.time
        // return console.log(params,"params")
        requestNewGroupCreate(params).then(res => {
            console.log('group_list', res.data);
            message.success("新增成功")
            this.refreshList()
            this.onModalCancelClick()
        })
    }
    requestAdRightKey(id) {
        if (!id) return
        let params = {
            id: id
        }
        requestAdRightKey(params).then(res => {
            console.log('group_list', res.data);
            if (res.data && res.data.length > 0) {
                let arr = res.data[0]
                this.formRef.current.setFieldsValue({ "detailName": arr.name, "detailTime": [moment(arr.startTime), moment(arr.endTime)], "detailPic": arr.picUrl ,"detailIconPicUrl": arr.iconPicUrl})
                this.forceUpdate()

            }
        })
    }
    getScreen(id) {
        if (!id) return
        let params = {
            id: id
        }
        getScreen(params).then(res => {
            console.log('group_list', res.data);
            if (Array.isArray(res.data) && res.data.length > 0) {
                let arr = res.data[0]
                this.formRef.current.setFieldsValue({ "detailName": arr.name, "detailTime": [moment(arr.startTime), moment(arr.endTime)], "detailPic": arr.picUrl })
                this.forceUpdate()
            }
        })
    }
    getInfo(arr) {
        console.log(arr, "选择回来的素材")
        let allList = this.formRef.current.getFieldValue("content") || []
        let list = []
        if(!Array.isArray(arr)){
            arr = [{...arr}]
            list = allList
        }else{
            list = allList.filter(r => r.adType != this.state.adIndex)
        }
        if (arr.length > 0) {
            arr.forEach(r => {
                list.push({ adId: r.id||r.adId, adName: r.name||r.adName, adType: Number(this.state.adIndex) })
            })
            this.formRef.current.setFieldsValue({ "detailName": arr[0].name || arr[0].adName, "detailTime": [moment(arr[0].startTime), moment(arr[0].endTime)], "detailPic": arr[0].picUrl, "detailIconPicUrl": arr[0].iconPicUrl })
        }
        this.formRef.current.setFieldsValue({ "content": list })
        this.setState({
            adList: list.filter(r=>r.adType == this.state.adIndex),
            tag_select_id: arr.length>0?arr[0].id || arr[0].adId:""
        },()=>{
            if (this.state.adIndex == 1) {
                this.requestAdRightKey(this.state.tag_select_id)
            } else {
                this.getScreen(this.state.tag_select_id)
            }
        })
       
        this.forceUpdate()
    }
    deleteTabChange(index, id) {
        console.log(index, id, this.formRef.current.getFieldValue("content"))
        let contentIndex = this.formRef.current.getFieldValue("content").findIndex(r => r.adId == id)
        let arr = this.formRef.current.getFieldValue("content")
        if (contentIndex != -1) {
            arr.splice(contentIndex, 1)
        }
        let list = arr.filter(r => r.adType == this.state.adIndex)
        this.setState({
            adList: list,
            tag_select_id: index > 0 ? list[index - 1].adId : list.length > 0 ? list[list.length - 1].adId : ""
        }, () => {
            this.requestAdRightKey(this.state.tag_select_id)
            if (!this.state.tag_select_id) {
                this.formRef.current.setFieldsValue({ "detailName": "", "detailTime": [], "detailPic": "", "detailIconPicUrl": "" })
                this.forceUpdate()
            }
        })

        this.forceUpdate()
    }
    requestNewGroupDelete(id) { //删除广告组
        let params = {
            id: id
        }
        Modal.confirm({
            title: '删除此广告组',
            content: '确认删除？',
            onOk: () => {
                requestNewGroupDelete(params).then(res => {
                    message.success("删除成功")
                    this.refreshList()
                })
            },
            onCancel: () => {

            }
        })

    }
    requestNewGroupCopy(val) {
        let params = {
            ...val
        }
        requestNewGroupCopy(params).then(res => {
            message.success("复制成功")
            this.refreshList()
        })
    }
}