import React, { Component } from 'react'

import { specialAdd, getChannel, searchVideo, getShortList, specialUpdate, saveConfChannel } from 'api'
import { Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, InputNumber, Space, Radio, Divider } from 'antd'
import { } from 'react-router-dom'
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { MyImageUpload } from '@/components/views.js';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import util from 'utils'
import moment from 'moment';
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
let privateData = {
    inputTimeOutVal: null
};
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};

export default class GoodPlayDialog extends Component{
    formRef = React.createRef();
    constructor() {
        super();
        this.formRef = React.createRef();
        this.state={
            playerTypes:[  //  播放器内容 
                {key: 1, value: '频道'},{key: 2, value: '图片'}
            ],
            searchChannel: [],      //频道类型 搜索到频道
            searchProgram: [],      //节目类型 搜索到视频   
            shortVideoList: [],//短视频
            shortList: [],//短视频集
            //渠道搜索
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            tailLayout: {
                wrapperCol: { offset: 8, span: 16 },
            },
            hasId:null,
        }
    }
    componentDidMount(){
        this.props.onRef(this);
        this.onChannelSearch()
        this.getShortList()
        //this.getLockList()
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
    closeDialog=()=>{
        this.formRef.current.resetFields()
        this.props.onCloseDialog()
    }
    //外部请求更新页面数据
    refreshFromData(data){
        console.log("refreshFromData",data)
        //存在数据 当前是编辑
        let obj = {};
        this.setState({
            hasId:data?data.id:null
        },()=>{console.log("hasIdhasId",this.state.hasId)})
        if (data){
            console.log("cunzai data ")
            obj = Object.assign({}, data);
        }
        this.formRef.current.setFieldsValue(obj);
        this.forceUpdate();
    }
    onConfirmClick=()=>{   // 提交
        let obj = this.formRef.current.getFieldsValue();
        console.log("valuevaluevalue",obj)
        let params={
            ...obj
        }
        //obj.id?specialUpdate(params):specialAdd(params)
        if(this.state.hasId){   //  修改
            params.id=this.state.hasId;
            specialUpdate(params).then(res=>{
                console.log("specialUpdate",res)
                if(res.data.errCode==0){
                    message.success("修改成功")
                    this.formRef.current.resetFields()
                    this.props.onCloseDialog();
                    this.props.ongetList();
                }else{
                    message.error(res.data.msg)
                }
            })
        }else{   // 新增
            specialAdd(params).then(res=>{
                console.log("onConfirmClick",res)
                if(res.data.errCode==0){
                    message.success("新增成功")
                    this.formRef.current.resetFields()
                    this.props.onCloseDialog();
                    this.props.ongetList();
                }else{
                    message.error(res.data.msg)
                }
            })
        }
        //this.props.onCloseDialog()
    }
    getUploadFileUrlTwo=(type, file, newItem, arr, index, i)=>{
        console.log("type, file, newItem, arr, index, i",type, file, newItem, arr, index, i)
        let that = this;
        let image_url = newItem.fileUrl;
        let obj = that.formRef.current.getFieldValue(arr)
        console.log("obj",obj)
        // if (arr == "content") {
        //     obj[index].params[i][type] = image_url
        // } else {
        //     if (obj[index]) {
        //         obj[index][type] = image_url;
        //     } else {
        //         obj[index] = {}
        //         obj[index][type] = image_url;
        //     }
        // }
        if (type=="cover") {
            console.log(1111)
            obj[index].subContents[i].cover = image_url;
        } else {
            console.log(2222)
            obj[index].target = image_url;
        }
        console.log("obj",obj)
        that.formRef.current.setFieldsValue({ [arr]: obj });
        that.forceUpdate();
    }
    render(){
        let {playerTypes,searchChannel,selectProps,shortVideoList,shortList}=this.state
        let { isShow } = this.props
        return(
            <Modal title="好剧专题" centered forceRender={true} visible={isShow} onCancel={() => { this.closeDialog() }} width={1200} footer={null}>
                
                <Form name='form' ref={this.formRef} onFinish={this.onConfirmClick.bind(this)}>
                    <Form.Item label="专题标题" name='title' rules={[{ required: true, message: '请输入专题标题' }]}>
                        <Input placeholder='请填写标题' className="base-input-wrapper1" style={{width:"350px !important;"}}/>
                    </Form.Item>
                    
                    <Form.Item>
                        <div className='flex-row-items2'>
                        <Form.Item label="播放器内容" name="playerType" rules={[{ required: true}]} style={{marginRight:"40px"}}>
                            <Select className="base-input-wrapper" placeholder="请选择类别" dropdownMatchSelectWidth={true} 
                            onChange={(val)=>{
                                console.log(val);
                                this.forceUpdate();
                            }}
                            allowClear>
                                {
                                    playerTypes.map((item,index)=>{
                                        return <Option value={item.key} key={item.key} name={item.value}>{item.value}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        
                        {
                            this.formRef.current && this.formRef.current.getFieldValue("playerType") &&
                            this.formRef.current.getFieldValue("playerType") == 1 &&
                            <Form.Item name='playerTarget' rules={[{ required: true }]} >
                                <Select className="base-input-wrapper" allowClear {...selectProps} placeholder="频道搜索" 
                                onSearch={(searchKey) => {
                                    if (privateData.inputTimeOutVal) {
                                        clearTimeout(privateData.inputTimeOutVal);
                                        privateData.inputTimeOutVal = null;
                                    }
                                    privateData.inputTimeOutVal = setTimeout(() => {
                                        if (!privateData.inputTimeOutVal) return;
                                        this.onChannelSearch(searchKey)
                                    }, 800)
                                }}
                                >
                                    {
                                        searchChannel.map((item, index) => {
                                            return <Option value={item.code} key={item.id}>{item.name + "----" + item.code}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>  ||
                            this.formRef.current && this.formRef.current.getFieldValue("playerType") &&
                            this.formRef.current.getFieldValue("playerType") == 2 &&
                            <Form.Item name="playerCover" valuePropName="fileList" getValueFromEvent={normFile} >
                                <MyImageUpload
                                getUploadFileUrl={(file) => { this.getUploadFileUrl('playerCover', file) }}
                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("playerCover")} />
                            </Form.Item>
                        }
                        
                        </div>
                    </Form.Item>
                    <Form.Item rules={[{ required: true, message: '请上传播放器样式图' }]} label="播放器样式" name="playerStyle" valuePropName="fileList" getValueFromEvent={normFile} >
                        <MyImageUpload
                        getUploadFileUrl={(file) => { this.getUploadFileUrl('playerStyle', file) }}
                        imageUrl={this.formRef.current && this.formRef.current.getFieldValue("playerStyle")} />
                    </Form.Item>
                    {
                        this.formRef.current && this.formRef.current.getFieldValue("playerType") &&
                        this.formRef.current.getFieldValue("playerType") == 2 &&
                        <Form.Item label="播放器跳转" name='playerTarget' rules={[{ required: true }]} >
                            <Select className="base-input-wrapper" allowClear {...selectProps} placeholder="频道搜索" 
                            onSearch={(searchKey) => {
                                if (privateData.inputTimeOutVal) {
                                    clearTimeout(privateData.inputTimeOutVal);
                                    privateData.inputTimeOutVal = null;
                                }
                                privateData.inputTimeOutVal = setTimeout(() => {
                                    if (!privateData.inputTimeOutVal) return;
                                    this.onChannelSearch(searchKey)
                                }, 800)
                            }}
                            >
                                {
                                    searchChannel.map((item, index) => {
                                        return <Option value={item.code} key={item.id}>{item.name + "----" + item.code}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item> 
                    }
                    <div className='flex-row-items2'>
                        <Form.Item style={{marginRight:"50px"}} rules={[{ required: true, message: '请上传封面图' }]} label="封面图(首页列表封面)" name="cover" valuePropName="fileList" getValueFromEvent={normFile} >
                            <MyImageUpload
                            getUploadFileUrl={(file) => { this.getUploadFileUrl('cover', file) }}
                            imageUrl={this.formRef.current && this.formRef.current.getFieldValue("cover")} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: '请上传背景图' }]} label="背景图" name="background" valuePropName="fileList" getValueFromEvent={normFile} >
                            <MyImageUpload
                            getUploadFileUrl={(file) => { this.getUploadFileUrl('background', file) }}
                            imageUrl={this.formRef.current && this.formRef.current.getFieldValue("background")} />
                        </Form.Item>
                    </div>
                    <Form.Item label="背景色" name='backgroundColor' rules={[{ required: true, message: '请填写背景色' }]}>
                        <Input placeholder='背景色' className="base-input-wrapper2"/>
                    </Form.Item>
                    <Form.List name="contents" >
                        {(fields, { add, remove }) => (
                            <>

                                {fields.map((field, index) => (
                                    <>
                                        <Divider >内容板块{index + 1}</Divider>
                                        {/* style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }} */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                                            <Space key={field.key} align="baseline" style={{ flexWrap: "wrap" }}>
                                                <Form.Item {...field} label="标题" name={[field.name, 'titleType']} fieldKey={[field.fieldKey, 'titleType']}>
                                                    <Select style={{ width: "200px" }} placeholder="请选择内容类型"
                                                        onChange={() => this.forceUpdate()}
                                                    >
                                                        <Option value={1} key={1}>文字</Option>
                                                        <Option value={2} key={2}>图片</Option>
                                                    </Select>
                                                </Form.Item>
                                                {
                                                    this.formRef.current &&
                                                        this.formRef.current.getFieldValue("contents") && this.formRef.current.getFieldValue("contents")[index]
                                                        ?
                                                        this.formRef.current.getFieldValue("contents")[index].titleType == 1
                                                            ?
                                                            <Form.Item {...field} label="" name={[field.name, 'target']} fieldKey={[field.fieldKey, 'target']}>
                                                                <Input placeholder="请填写标题" style={{ width: "200px" }} />
                                                            </Form.Item>
                                                            :
                                                            this.formRef.current.getFieldValue("contents")[index].titleType == 2 ?
                                                                <Form.Item {...field} label="" name={[field.name, 'target']} fieldKey={[field.fieldKey, 'target']}>
                                                                    <MyImageUpload
                                                                        getUploadFileUrl={(file, newItem) => { this.getUploadFileUrlTwo('target', file, newItem, "contents", index) }}
                                                                        imageUrl={
                                                                            this.formRef.current &&
                                                                            this.formRef.current.getFieldValue("contents") &&
                                                                            this.formRef.current.getFieldValue("contents")[index] &&
                                                                            this.formRef.current.getFieldValue("contents")[index].target} />
                                                                </Form.Item>
                                                                :
                                                                ""
                                                        :
                                                        ""
                                                }
                                                <div style={{ width: "700px" }}></div>
                                                {/* <Form.Item label="内容"> */}
                                                    <Form.List name={[field.name, 'subContents']}>
                                                        {(fieldsCont, { add, remove }) => (
                                                            <>
                                                                {fieldsCont.map((fieldItem, i) => (
                                                                    <Space key={fieldItem.key} align="baseline" wrap="false" direction="horizontal">
                                                                        {/* <Space key={fieldItem.key} align="baseline" wrap="false" direction="horizontal"></Space> */}
                                                                        <Form.Item label={`内容${i+1}`} rules={[{ required: true}]} {...fieldItem} name={[fieldItem.name, 'channelCode']} fieldKey={[fieldItem.fieldKey, 'channelCode']}>
                                                                            <Select
                                                                                style={{ width: "150px" }}
                                                                                placeholder="请选择频道配置"
                                                                                allowClear
                                                                                {...this.state.selectProps}
                                                                                onChange={(e) => {
                                                                                    //this.getImageAndTitle(index, i, "posterUrl", e, searchChannel,"code")
                                                                                }}
                                                                                onSearch={(val) => {
                                                                                    console.log(val)
                                                                                    if (privateData.inputTimeOutVal) {
                                                                                        clearTimeout(privateData.inputTimeOutVal);
                                                                                        privateData.inputTimeOutVal = null;
                                                                                    }
                                                                                    privateData.inputTimeOutVal = setTimeout(() => {
                                                                                        if (!privateData.inputTimeOutVal) return;
                                                                                        this.onChannelSearch(val)
                                                                                    }, 800)
                                                                                }}>
                                                                                {
                                                                                    searchChannel.map((r, i) => {
                                                                                        return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                                                    })
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                        <Form.Item {...fieldItem} label="标题" name={[fieldItem.name, 'title']} fieldKey={[fieldItem.fieldKey, 'title']}>
                                                                            <Input placeholder='请输入关联标题' />
                                                                        </Form.Item>
                                                                        <Form.Item {...fieldItem} label="描述" name={[fieldItem.name, 'description']} fieldKey={[fieldItem.fieldKey, 'description']}>
                                                                            <Input placeholder='请输入描述' />
                                                                        </Form.Item>
                                                                        <Form.Item {...fieldItem} label="封面" name={[fieldItem.name, 'cover']} fieldKey={[fieldItem.fieldKey, 'cover']}>
                                                                            <MyImageUpload
                                                                                getUploadFileUrl={(file, newItem) => { this.getUploadFileUrlTwo('cover', file, newItem, "contents", index, i) }}
                                                                                imageUrl={
                                                                                    this.formRef.current &&
                                                                                    this.formRef.current.getFieldValue("contents")[index] &&
                                                                                    this.formRef.current.getFieldValue("contents")[index].subContents[i] &&
                                                                                    this.formRef.current.getFieldValue("contents")[index].subContents[i].cover
                                                                                } />
                                                                        </Form.Item>
                                                           
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
                                                {/* </Form.Item> */}

                                            </Space>
                                            <div>
                                                <Button danger onClick={() => remove(field.name)} block icon={<MinusCircleOutlined />}>
                                                    删除内容板块
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        新增内容板块
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item {...this.state.tailLayout}>
                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                            提交
                        </Button>
                        <Button style={{ margin: "0 20px" }} onClick={()=>{
                            this.closeDialog()
                        }}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
    /**
     * 刷新频道列表
     * 
     * @param {*} currSearchKey     当前搜索的关键字
     */
     onChannelSearch(currSearchKey) {
        let obj = {
            keywords: currSearchKey,
        };
        getChannel(obj).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0 && res.data.data) {
                this.setState({
                    searchChannel: res.data.data,
                })
            }
        })
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
                },()=>{
                    console.log(this.state.shortVideoList)
                })
            }else{
                this.setState({
                    shortVideoList: []
                })
            }
        }).catch(err=>{
            this.setState({
                shortVideoList: []
            })
        })
    }
    getUploadFileUrl(name, file) {   // 图片上传的方法
        console.log(file, name, "获取上传的图片路径")
        this.formRef.current.setFieldsValue({ [name]: file })
        this.forceUpdate()
    }
}