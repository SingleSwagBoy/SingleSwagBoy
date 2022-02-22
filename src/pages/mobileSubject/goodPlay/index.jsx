import React, { Component,useState, useEffect, useCallback  } from 'react'

import { specialList, sortChannelSport, resetChannelSport,specialGetBaseInfo,specialSetBaseInfo,specialStatus,specialSync,specialDelete,specialChangepos,specialResort } from 'api'
import { Breadcrumb, Card, Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, InputNumber,Switch,Radio } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
// import ContentDialog from "./contentDialog"
import util from 'utils'
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import ContentDialog from "./contentDialog"
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};


export default class GoodPlay extends Component{
    
    constructor(){
        super();
        this.formRef = React.createRef()
        this.state = {
            page: 1,
            pageSize: 50,
            total: 0,
            data: [],
            loading: false,
            btnLoading: false,
            searchWords: "",
            lists: [],
            currentItem: "",//编辑行的id
            newData: {},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 8, span: 16 },
            },
            dataSource: [],
            visible: false,
            isShow:false,//内容配置
            //状态
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],
            columns: [
                { title: "排序", dataIndex: "position", key: "position",width:100,
                    render: (rowValue, row, index) => {
                        return (
                            this.state.activityIndex == index ?
                                <div><InputNumber defaultValue={rowValue} step={10} min={0} onBlur={(e) => {
                                    console.log(e)
                                    this.sortChannelSport(e.target.value, row)
                                }}></InputNumber></div>
                                :
                                <div style={{ color: "#1890ff" }} onClick={() => this.setState({ activityIndex: index })}>{rowValue}</div>
                        )
                    }
                },
                { title: "专题 id", dataIndex: "id", key: "id", width:100,},
                { title: "专题名称", dataIndex: "title", key: "title", },
                {
                    title: "专题封面", dataIndex: "cover", key: "cover",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={row.cover} />)
                    }
                },
                {
                    title: '状态', dataIndex: 'status', key: 'status',
                    render: (rowValue, row, index) => {
                        return (
                            <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                            defaultChecked={rowValue == 1 ? true : false}
                            onChange={(val) => {
                                console.log(val)
                                let obj = JSON.parse(JSON.stringify(row))
                                obj.status = val ? 1 : 2
                                this.changeStatus(obj)
                            }}
                        />
                        )
                    }
                },
                {
                    title: "操作", key: "action",
                    fixed: 'right', width: 310,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(rowValue, row);
                                        this.onTableItemEditClick(row)
                                        //this.props.history.push(`/mms/mobileSubject/editSubject/${row.ID}`)
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.specialDelete(row) }}
                                >删除</Button>
                            </div>
                        )
                    }
                }
            ],
            isOpenModal:false,
            formData:{type:1,title:""},
            picUrl:"",
            refTvConfigModal: null,
            activityIndex: null,
        }
    }
    componentDidMount() {
        //this.ChannelTopic();
        this.getList();
        //this.getTitleInfo()
    }
    getTitleInfo=()=>{   // 获取title信息
        specialGetBaseInfo().then(res=>{
            console.log("specialGetBaseInfo",res);
            if(res.data.errCode === 0){
                this.setState({
                    isOpenModal:true,
                    formData: res.data.data
                },()=>{
                    this.formRef.current.resetFields();
                    this.formRef.current.setFieldsValue(this.state.formData)
                    this.forceUpdate()
                })
            }
        })
    }
    getList=()=>{   // 获取数据列表
        specialList({}).then(res=>{
            console.log("specialList",res)
            if(res.data.errCode === 0){
                this.setState({
                    lists: res.data.data
                })
            }
        })
    }
    changeStatus=(obj)=>{   // 专题上下线
        console.log("changeStatus",obj);
        let params={
            id:obj.id,
            status:obj.status
        }
        specialStatus(params).then(res=>{
            console.log("changeStatus",res)
            if(res.data.errCode === 0){
                message.success("操作成功")
            }else{
                message.error(res.data.msg)
            }
        })
    }
    submitForm(obj){  // 修改title信息
        console.log(obj);
        let params={
            ...obj
        }
        specialSetBaseInfo(params).then(res=>{
            console.log("specialSetBaseInfo",res);
            if(res.data.errCode === 0){
                message.success("修改成功")
                this.setState({
                    isOpenModal: false
                })
            }else{
                message.error(res.data.msg)
            }
        })
    }
    getUploadFileUrl(fill){   // 图片上传
        console.log(fill)
        this.formRef.current.setFieldsValue({ "title": fill });
        // this.setState({
        //     picUrl:fill
        // })
        this.forceUpdate();
    }
    closeDialog=()=>{
        this.setState({
            isShow:false
        })
    }
    //创建配置
    onCreateConfigClick(item) {
        let that = this;
        let { refTvConfigModal} = that.state;
        that.setState({
            isShow:true
        })

        refTvConfigModal.refreshFromData(item);
    }
    //编辑配置
    onTableItemEditClick(item) {
        this.onCreateConfigClick(item);
    }
    onModalResult=(obj)=>{
        console.log("obj",obj)
    }
    specialDelete=(obj)=>{   // 删除
        let params={
            id:obj.id
        }
        Modal.confirm({
            title: `执行删除操作后，该专题和该专题下对应的信息都会被删除。是否确认删除？`,
            content: '确认删除？',
            onOk: () => {
                specialDelete(params).then(res=>{
                    if(res.data.errCode==0){
                        message.success("操作成功")
                        this.getList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
            },
            onCancel: () => {
            }
        })
    }
    sortChannelSport(val, row) { //重新排序
        console.log("val,row",val,row);
        let params = {
            id: row.id,
            position: Number(val)
        }
        specialChangepos(params).then(res => {
            if(res.data.errCode==0){
                this.setState({ activityIndex: null })
                this.getList()
            }else{
                message.error(res.data.msg)
            }
        })
    }
    resetsort() { //重新排序
        specialResort({}).then(res => {
            if(res.data.errCode==0){
                message.success("重新排序成功")
            }else{
                message.error(res.data.msg)
            }
        })
    }
    syncData=()=>{  // 数据同步
        specialSync({}).then(res=>{
            console.log("syncData",res)
            if(res.data.errCode === 0){
                message.success("同步成功")
            }else{
                message.error(res.data.msg)
            }
        })
    }
    render(){
        return (
            <div>
                <Card extra={
                    <div>
                        <Button danger style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.resetsort()
                                }}
                            >重新排序</Button>
                        <Button type="primary" onClick={()=>{
                            this.getTitleInfo();
                            this.setState({isOpenModal:true},
                                ()=>{
                                    
                                    this.formRef.current.resetFields();
                                    this.formRef.current.setFieldsValue(this.state.formData)
                                    this.forceUpdate()
                                })
                    }}>标题配置</Button>
                        <Button type="primary" style={{ margin: "0 10px" }}
                            onClick={() => this.onCreateConfigClick(null)}
                        >新增专题</Button>
                        <Button type="primary"
                            // loading={this.state.btnLoading}
                            onClick={() => {
                                this.syncData()
                            }}
                        >数据同步</Button>
                    </div>
                }>
                    <Table
                        dataSource={this.state.lists}
                        // rowKey={item=>item.indexId}
                        loading={this.state.loading}
                        columns={this.state.columns} 
                        />
                    <Modal visible={this.state.isOpenModal}  onCancel={() => {this.setState({isOpenModal:false})}}  footer={null}>
                        {
                            <Form name="mini" ref = {this.formRef} onFinish={this.submitForm.bind(this)}>
                                <Form.Item label="标题配置" name="type">
                                    <Radio.Group
                                        onChange={(e) => {
                                            console.log(e)
                                            this.formRef.current.setFieldsValue("type",e.target.value);
                                            this.forceUpdate()
                                        }}
                                    >
                                        <Radio value={1}>文字</Radio>
                                        <Radio value={2}>图片</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {
                                    this.formRef && this.formRef.current &&
                                    <div>
                                        {
                                            this.formRef.current.getFieldValue("type")==1 &&
                                            <Form.Item name="title" rules={[{ required: true, message: '请填写标题名称' }]}>
                                                <Input placeholder="请填写标题名称" />
                                            </Form.Item>  ||
                                            this.formRef.current.getFieldValue("type")==2 &&
                                            <Form.Item label="上传图片" name="title" valuePropName="fileList" getValueFromEvent={normFile} >
                                                <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)} imageUrl={this.formRef.current && this.formRef.current.getFieldValue("title")}/>
                                            </Form.Item>
                                        }
                                    </div>
                                }
                                
                                <Form.Item {...this.state.tailLayout}>
                                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                        提交
                                    </Button>
                                    <Button style={{ margin: "0 20px" }} onClick={()=>{
                                        this.setState({isOpenModal:false})
                                    }}>
                                        取消
                                    </Button>
                                </Form.Item>
                            </Form>
                        }
                    </Modal>
                    {/* <ContentDialog isShow={this.state.isShow} onCloseDialog={()=>this.closeDialog()}></ContentDialog> */}
                    <ContentDialog 
                    isShow={this.state.isShow} 
                    onRef={(val) => { this.setState({ refTvConfigModal: val }) }} 
                    onResult={(obj) => { this.onModalResult(obj) }}
                    ongetList={this.getList}
                    onCloseDialog={()=>this.closeDialog()}></ContentDialog>
                </Card>
            </div>
            
        )
    }
}