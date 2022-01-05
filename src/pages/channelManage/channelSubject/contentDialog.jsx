import React, { Component } from 'react'

import { showConfChannel, getChannel, searchVideo, getShortList, getLockList,saveConfChannel } from 'api'
import { Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, InputNumber, Space, Radio, Divider } from 'antd'
import { } from 'react-router-dom'
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { MyImageUpload } from '@/components/views.js';
import util from 'utils'
import moment from 'moment';
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
let privateData = {
    inputTimeOutVal: null
};
export default class SportsProgram extends Component {
    formRef = React.createRef();
    constructor() {
        super();
        this.state = {
            layout: {
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            formInfo: {},
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            channelList: [],//频道
            shortVideoList: [],//短视频
            shortList: [],//短视频集
            channelGroupList: [],//频道组
            channelTopicNewId:"",
        }
    }
    componentDidMount() {
        console.log(111)
        this.props.onRef(this)
        this.getChannel()
        this.getShortList()
        this.getLockList()
    }
    submitForm(val) {
        console.log(val)
        this.saveConfChannel(val)
    }
    closeDialog() {
        this.props.onCloseDialog()
    }
    saveConfChannel(val){
        let params={
            ...val,
            channelTopicNewId:this.state.channelTopicNewId,
            player:{
                title:val.playerTitle,
                params:val.playerParams
            }
        }
        saveConfChannel(params).then(res=>{
            message.success("保存成功")
            this.closeDialog()
        })
    }
    showConfChannel(id) {
        this.setState({channelTopicNewId:id})
        let params = { channelTopicNewId: id }
        showConfChannel(params).then(res => {
            let info = JSON.parse(JSON.stringify(res.data))
            info.playerTitle = info.player.title
            info.playerParams = info.player.params
            this.formRef.current.setFieldsValue(info)
            this.setState({ formInfo: info })
        })
    }
    getChannel(val) {
        let params = {
            keywords: val
        }
        getChannel(params).then(res => {
            this.setState({
                channelList: res.data.data || []
            })
        })
    }
    // 频道组
    getLockList() {
        let params = {
            page: { currentPage: 1, pageSize: 1000 }
        }
        getLockList(params).then(res => {
            if (res.data.errCode == 0) {
                this.setState({
                    channelGroupList: res.data.data
                })
            }
        })
    }
    //获取上传文件
    getUploadFileUrl(type, file, newItem, arr, index, i) {
        let that = this;
        let image_url = newItem.fileUrl;
        let obj = that.formRef.current.getFieldValue(arr.includes("_") ? arr.split("_")[0] : arr)
        if (arr == "content") {
            obj[index].params[i][type] = image_url
        } else {
            if(obj[index]){
                obj[index][type] = image_url;
            }else{
                obj[index] = {}
                obj[index][type] = image_url;
            }
        }
        that.formRef.current.setFieldsValue({ [arr]: obj });
        that.forceUpdate();
    }
    //短视频搜索
    searchVideo(val) {
        if (!val) return
        let params = {
            word: val
        }
        searchVideo(params).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    shortVideoList: res.data.data
                })
            }
        })
    }
    //短视频集搜索
    getShortList() {
        let params = {
            currentPage: 1, // (int)页码
            pageSize: 9999 // (int)每页数量
        }
        getShortList(params).then(res => {
            this.setState({
                shortList: res.data.data
            })
        })
    }
    render() {
        let { channelList, shortVideoList, shortList, channelGroupList } = this.state
        let { isShow } = this.props
        return (
            <Modal title="内容配置"
                centered
                visible={isShow}
                onCancel={() => { this.closeDialog() }}
                footer={null}
                width={1200}
            >
                <Form name="formInfo" ref={this.formRef}  {...this.state.layout} onFinish={this.submitForm.bind(this)}>
                    <Form.Item label="播放器标题" name="playerTitle" rules={[{ required: true, message: '请填写播放器标题' }]}>
                        <Input className="base-input-wrapper" placeholder="请填写播放器标题" />
                    </Form.Item>
                    <Form.Item
                        label="播放器内容"
                    // name="voters"
                    // rules={[{ required: true, message: '投票选项' }]}
                    >
                        <Form.List name="playerParams">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} align="baseline">
                                            <Form.Item {...field} label="" name={[field.name, 'type']} fieldKey={[field.fieldKey, 'type']}>
                                                <Select style={{ width: "350px" }} placeholder="请选择播放器播放类型" onChange={()=>this.forceUpdate()}>
                                                    {/* :10=短视频;20=频道 */}
                                                    <Option value={10} key={10}>短视频</Option>
                                                    <Option value={20} key={20}>频道</Option>
                                                </Select>
                                            </Form.Item>
                                            {
                                                // 频道配置
                                                this.formRef.current && this.formRef.current.getFieldValue("playerParams")
                                                && this.formRef.current.getFieldValue("playerParams")[index] && this.formRef.current.getFieldValue("playerParams")[index].type == 20
                                                &&
                                                <Form.Item {...field} label="" name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                                                    <Select
                                                        style={{ width: "350px" }}
                                                        placeholder="请选择频道配置"
                                                        
                                                        allowClear
                                                        {...this.state.selectProps}
                                                        onSearch={(val) => {
                                                            console.log(val)
                                                            if (privateData.inputTimeOutVal) {
                                                                clearTimeout(privateData.inputTimeOutVal);
                                                                privateData.inputTimeOutVal = null;
                                                            }
                                                            privateData.inputTimeOutVal = setTimeout(() => {
                                                                if (!privateData.inputTimeOutVal) return;
                                                                this.getChannel(val)
                                                            }, 800)
                                                        }}>
                                                        {
                                                            channelList.map((r, i) => {
                                                                return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            }
                                            {
                                                // 短视频配置
                                                this.formRef.current && this.formRef.current.getFieldValue("playerParams")
                                                && this.formRef.current.getFieldValue("playerParams")[index] && this.formRef.current.getFieldValue("playerParams")[index].type == 10
                                                &&
                                                <Form.Item {...field} label="" name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                                                    <Select
                                                        style={{ width: "350px" }}
                                                        placeholder="请输入短视频ID"
                                                        allowClear
                                                        {...this.state.selectProps}
                                                        onSearch={(val) => {
                                                            console.log(val)
                                                            if (privateData.inputTimeOutVal) {
                                                                clearTimeout(privateData.inputTimeOutVal);
                                                                privateData.inputTimeOutVal = null;
                                                            }
                                                            privateData.inputTimeOutVal = setTimeout(() => {
                                                                if (!privateData.inputTimeOutVal) return;
                                                                if (this.formRef.current.getFieldValue("playerParams")[index].type == "10") {
                                                                    this.searchVideo(val)
                                                                }
                                                            }, 800)
                                                        }}>
                                                        {
                                                            shortVideoList.map((r, i) => {
                                                                return <Option value={r.id} key={i}>{r.title}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            }


                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            新增播放器内容
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                    <Form.Item label="是否开启目录" name="openMenu" rules={[{ required: true, message: '请选择是否开启目录' }]}>
                        <Radio.Group>
                            <Radio value={1}>开启</Radio>
                            <Radio value={0}>关闭</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="内容板块"
                    // name="voters"

                    >
                        <Form.List name="content" rules={[{ required: true, message: '内容板块' }]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                                            <Space key={field.key} align="baseline" style={{ flexWrap: "wrap" }}>
                                                <Form.Item {...field} label="标题" name={[field.name, 'type']} fieldKey={[field.fieldKey, 'type']}>
                                                    <Select style={{ width: "200px" }} placeholder="请选择内容类型"
                                                        onChange={() => this.forceUpdate()}
                                                    >
                                                        <Option value={10} key={10}>文字</Option>
                                                        <Option value={20} key={20}>图片</Option>
                                                    </Select>
                                                </Form.Item>
                                                {
                                                    this.formRef.current &&
                                                        this.formRef.current.getFieldValue("content") &&  this.formRef.current.getFieldValue("content")[index]
                                                        ?
                                                        this.formRef.current.getFieldValue("content")[index].type == 10
                                                            ?
                                                            <Form.Item {...field} label="" name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                                                                <Input placeholder="请填写标题" style={{ width: "200px" }} />
                                                            </Form.Item>
                                                            :
                                                            this.formRef.current.getFieldValue("content")[index].type == 20 ?
                                                                <Form.Item {...field} label="" name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                                                                    <MyImageUpload
                                                                        getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('value', file, newItem, "content_value", index) }}
                                                                        imageUrl={
                                                                            this.formRef.current &&
                                                                            this.formRef.current.getFieldValue("content") &&
                                                                            this.formRef.current.getFieldValue("content")[index] &&
                                                                            this.formRef.current.getFieldValue("content")[index].value} />
                                                                </Form.Item>
                                                                :
                                                                ""
                                                        :
                                                        ""
                                                }

                                                <div style={{ width: "700px" }}>
                                                    <Form.Item {...field} label="" name={[field.name, 'arrangement']} fieldKey={[field.fieldKey, 'arrangement']}>
                                                        <Radio.Group>
                                                            {/* 1=横排;2=双纵;3=首位高权重 */}
                                                            <Radio value={1}>横排列表</Radio>
                                                            <Radio value={2}>双纵列表</Radio>
                                                            {
                                                                this.formRef.current &&
                                                                this.formRef.current.getFieldValue("content") &&
                                                                this.formRef.current.getFieldValue("content")[index] &&
                                                                this.formRef.current.getFieldValue("content")[index].type == 10 &&
                                                                <Radio value={3}>首位高权重</Radio>
                                                            }

                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>

                                                <Form.Item
                                                    label="内容"
                                                // style={{ width: "700px" }}
                                                // rules={[{ required: true, message: '投票选项' }]}
                                                >
                                                    <Form.List name={[field.name, 'params']}>
                                                        {(fieldsCont, { add, remove }) => (
                                                            <>
                                                                {fieldsCont.map((fieldItem, i) => (
                                                                    <Space key={fieldItem.key} align="baseline" wrap="false" direction="horizontal">
                                                                        <Form.Item {...fieldItem} label="" name={[fieldItem.name, 'subType']} fieldKey={[fieldItem.fieldKey, 'subType']}>
                                                                            <Select style={{ width: "100px" }} placeholder="请选择类型" onChange={(e) => {
                                                                                let content = this.formRef.current.getFieldValue("content")
                                                                                content[index].params[i].subType = e
                                                                                content[index].params[i].subValue = undefined
                                                                                this.formRef.current.setFieldsValue({ "content": content })
                                                                            }}>
                                                                                {/* 10=短视频;11=短视频集;20=频道 */}
                                                                                <Option value={10} key={10}>短视频</Option>
                                                                                <Option value={11} key={11}>短视频集</Option>
                                                                                <Option value={20} key={20}>频道</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                        <Form.Item {...fieldItem} label="" name={[fieldItem.name, 'subValue']} fieldKey={[fieldItem.fieldKey, 'subValue']}>
                                                                            {
                                                                                (this.formRef.current &&
                                                                                    this.formRef.current.getFieldValue("content")[index] &&
                                                                                    this.formRef.current.getFieldValue("content")[index].params[i])
                                                                                    ?
                                                                                    this.formRef.current.getFieldValue("content")[index].params[i].subType == 10
                                                                                        ?
                                                                                        <Select
                                                                                            style={{ width: "200px" }}
                                                                                            placeholder="请输入短视频ID"
                                                                                            allowClear
                                                                                            {...this.state.selectProps}
                                                                                            onSearch={(val) => {
                                                                                                console.log(val)
                                                                                                if (privateData.inputTimeOutVal) {
                                                                                                    clearTimeout(privateData.inputTimeOutVal);
                                                                                                    privateData.inputTimeOutVal = null;
                                                                                                }
                                                                                                privateData.inputTimeOutVal = setTimeout(() => {
                                                                                                    if (!privateData.inputTimeOutVal) return;
                                                                                                    this.searchVideo(val)
                                                                                                }, 800)
                                                                                            }}>
                                                                                            {
                                                                                                shortVideoList.map((r, i) => {
                                                                                                    return <Option value={r.id} key={i}>{r.title}</Option>
                                                                                                })
                                                                                            }
                                                                                        </Select>
                                                                                        :
                                                                                        this.formRef.current.getFieldValue("content")[index].params[i].subType == 11
                                                                                            ?
                                                                                            <Select
                                                                                                style={{ width: "300px" }}
                                                                                                placeholder="请选择短视频集"
                                                                                                allowClear
                                                                                                {...this.state.selectProps}>
                                                                                                {
                                                                                                    shortList.map((r, i) => {
                                                                                                        return <Option value={r.id.toString()} key={i}>{r.title}</Option>
                                                                                                    })
                                                                                                }
                                                                                            </Select>
                                                                                            :
                                                                                            <Select
                                                                                                style={{ width: "300px" }}
                                                                                                placeholder="请选择频道配置"
                                                                                                allowClear
                                                                                                {...this.state.selectProps}
                                                                                                onSearch={(val) => {
                                                                                                    console.log(val)
                                                                                                    if (privateData.inputTimeOutVal) {
                                                                                                        clearTimeout(privateData.inputTimeOutVal);
                                                                                                        privateData.inputTimeOutVal = null;
                                                                                                    }
                                                                                                    privateData.inputTimeOutVal = setTimeout(() => {
                                                                                                        if (!privateData.inputTimeOutVal) return;
                                                                                                        this.getChannel(val)
                                                                                                    }, 800)
                                                                                                }}>
                                                                                                {
                                                                                                    channelList.map((r, i) => {
                                                                                                        return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                                                                    })
                                                                                                }
                                                                                            </Select>
                                                                                    :
                                                                                    ""

                                                                            }
                                                                        </Form.Item>
                                                                        {
                                                                            this.formRef.current &&
                                                                            this.formRef.current.getFieldValue("content")[index] &&
                                                                            this.formRef.current.getFieldValue("content")[index].params[i] &&
                                                                            this.formRef.current.getFieldValue("content")[index].params[i].subType != 11 &&
                                                                            <>
                                                                                <Form.Item {...fieldItem} label="封面" name={[fieldItem.name, 'subCover']} fieldKey={[fieldItem.fieldKey, 'subCover']}>
                                                                                    <MyImageUpload
                                                                                        getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('subCover', file, newItem, "content", index, i) }}
                                                                                        imageUrl={
                                                                                            this.formRef.current &&
                                                                                            this.formRef.current.getFieldValue("content")[index] &&
                                                                                            this.formRef.current.getFieldValue("content")[index].params[i] &&
                                                                                            this.formRef.current.getFieldValue("content")[index].params[i].subCover
                                                                                        } />
                                                                                </Form.Item>
                                                                                <Form.Item {...fieldItem} label="标题" name={[fieldItem.name, 'subTitle']} fieldKey={[fieldItem.fieldKey, 'subTitle']}>
                                                                                    <Input style={{ width: "130px" }} />
                                                                                </Form.Item>
                                                                            </>
                                                                        }


                                                                        <div style={{ margin: "0 0 0 40px" }}>
                                                                            <Button danger onClick={() => remove(fieldItem.name)} block icon={<MinusCircleOutlined />}>
                                                                                删除内容
                                                                            </Button>
                                                                        </div>
                                                                    </Space>
                                                                ))}

                                                                <Form.Item>
                                                                    <Button type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                        新增内容
                                                                    </Button>
                                                                </Form.Item>
                                                            </>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>

                                            </Space>
                                            <div>
                                                <Button danger onClick={() => remove(field.name)} block icon={<MinusCircleOutlined />}>
                                                    删除内容板块
                                                </Button>
                                            </div>
                                        </div>

                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            新增内容板块
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>




                    <Form.Item
                        label="banner设置"
                    // name="voters"
                    // rules={[{ required: true, message: '投票选项' }]}
                    >
                        <Form.List name="banner">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (

                                        <Space key={field.key} align="baseline">
                                            <Form.Item {...field} label="封面" name={[field.name, 'cover']} fieldKey={[field.fieldKey, 'cover']}>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('cover', file, newItem, "banner", index) }}
                                                    imageUrl={
                                                        this.formRef.current &&
                                                        this.formRef.current.getFieldValue("banner") &&
                                                        this.formRef.current.getFieldValue("banner")[index] &&
                                                        this.formRef.current.getFieldValue("banner")[index].cover} />
                                            </Form.Item>
                                            {/* (int)跳转类型:5=其他H5;6=专题页;10=短视频;11=短视频集;20=频道;21=频道组 */}
                                            <Form.Item {...field} label="标题" name={[field.name, 'jumpType']} fieldKey={[field.fieldKey, 'jumpType']}>
                                                <Select style={{ width: "200px" }} placeholder="请选择播放器播放类型"
                                                    onChange={() => {
                                                        let info = this.formRef.current.getFieldValue("banner")
                                                        info[index].jumpValue = undefined
                                                        this.formRef.current.setFieldsValue({ "banner": info })
                                                        this.forceUpdate()
                                                    }}
                                                >
                                                    <Option value={5} key={5}>其他H5</Option>
                                                    <Option value={6} key={6}>专题页</Option>
                                                    <Option value={10} key={10}>短视频</Option>
                                                    <Option value={11} key={11}>短视频集</Option>
                                                    <Option value={20} key={20}>频道</Option>
                                                    <Option value={21} key={21}>频道组</Option>
                                                </Select>
                                            </Form.Item>
                                            {
                                                this.formRef.current &&
                                                    this.formRef.current.getFieldValue("banner") &&
                                                    this.formRef.current.getFieldValue("banner")[index]
                                                    ?
                                                    this.formRef.current.getFieldValue("banner")[index].jumpType == 5
                                                        ?
                                                        <Form.Item {...field} label="地址" name={[field.name, 'jumpValue']} fieldKey={[field.fieldKey, 'jumpValue']}>
                                                            <Input placeholder="请输入地址" style={{ width: "200px" }} />
                                                        </Form.Item>
                                                        :
                                                        this.formRef.current.getFieldValue("banner")[index].jumpType == 6 ?
                                                            <Form.Item {...field} label="专题地址" name={[field.name, 'jumpValue']} fieldKey={[field.fieldKey, 'jumpValue']}>
                                                                <Input placeholder="请输入专题地址" style={{ width: "200px" }} />
                                                            </Form.Item>
                                                            :
                                                            this.formRef.current.getFieldValue("banner")[index].jumpType == 10 ?
                                                                <Form.Item {...field} label="短视频ID" name={[field.name, 'jumpValue']} fieldKey={[field.fieldKey, 'jumpValue']}>
                                                                    <Select
                                                                        style={{ width: "300px" }}
                                                                        placeholder="请输入短视频ID"
                                                                        allowClear
                                                                        {...this.state.selectProps}
                                                                        onSearch={(val) => {
                                                                            console.log(val)
                                                                            if (privateData.inputTimeOutVal) {
                                                                                clearTimeout(privateData.inputTimeOutVal);
                                                                                privateData.inputTimeOutVal = null;
                                                                            }
                                                                            privateData.inputTimeOutVal = setTimeout(() => {
                                                                                if (!privateData.inputTimeOutVal) return;
                                                                                this.searchVideo(val)
                                                                            }, 800)
                                                                        }}>
                                                                        {
                                                                            shortVideoList.map((r, i) => {
                                                                                return <Option value={r.id} key={i}>{r.title}</Option>
                                                                            })
                                                                        }
                                                                    </Select>
                                                                </Form.Item>
                                                                :
                                                                this.formRef.current.getFieldValue("banner")[index].jumpType == 11 ?
                                                                    <Form.Item {...field} label="短视频集" name={[field.name, 'jumpValue']} fieldKey={[field.fieldKey, 'jumpValue']}>
                                                                        <Select
                                                                            style={{ width: "300px" }}
                                                                            placeholder="请选择短视频集"
                                                                            allowClear
                                                                            {...this.state.selectProps}>
                                                                            {
                                                                                shortList.map((r, i) => {
                                                                                    return <Option value={r.id.toString()} key={i}>{r.title}</Option>
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </Form.Item>
                                                                    :
                                                                    this.formRef.current.getFieldValue("banner")[index].jumpType == 20 ?
                                                                        <Form.Item {...field} label="频道配置" name={[field.name, 'jumpValue']} fieldKey={[field.fieldKey, 'jumpValue']}>
                                                                            <Select
                                                                                style={{ width: "300px" }}
                                                                                placeholder="请选择频道配置"
                                                                                allowClear
                                                                                {...this.state.selectProps}
                                                                                onSearch={(val) => {
                                                                                    console.log(val)
                                                                                    if (privateData.inputTimeOutVal) {
                                                                                        clearTimeout(privateData.inputTimeOutVal);
                                                                                        privateData.inputTimeOutVal = null;
                                                                                    }
                                                                                    privateData.inputTimeOutVal = setTimeout(() => {
                                                                                        if (!privateData.inputTimeOutVal) return;
                                                                                        this.getChannel(val)
                                                                                    }, 800)
                                                                                }}>
                                                                                {
                                                                                    channelList.map((r, i) => {
                                                                                        return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                                                    })
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                        :
                                                                        this.formRef.current.getFieldValue("banner")[index].jumpType == 21 ?
                                                                            <Form.Item {...field} label="频道组" name={[field.name, 'jumpValue']} fieldKey={[field.fieldKey, 'jumpValue']}>
                                                                                <Select
                                                                                    style={{ width: "300px" }}
                                                                                    placeholder="请选择频道组"

                                                                                    allowClear
                                                                                    {...this.state.selectProps}>
                                                                                    {
                                                                                        channelGroupList.map((r, i) => {
                                                                                            return <Option value={r.id} key={r.id} name={r.name}>{r.name + "----" + r.code}</Option>
                                                                                        })
                                                                                    }
                                                                                </Select>
                                                                            </Form.Item>
                                                                            :
                                                                            ""
                                                    :
                                                    ""
                                            }

                                            <Button danger onClick={() => remove(field.name)} icon={<MinusCircleOutlined />}>
                                                删除banner
                                            </Button>
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            新增banner
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>




                    <Form.Item {...this.state.tailLayout}>
                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}