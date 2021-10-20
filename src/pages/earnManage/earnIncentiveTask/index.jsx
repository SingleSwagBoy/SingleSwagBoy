import React, { Component } from 'react'
import { getEarnTskList,addEarnTskList,updateEarnTskList,deleteEarnTskList,syncEarnTskList} from 'api'
import {Breadcrumb, Card, Image, Button, message,Table, Modal, DatePicker,Input, Form,Select,InputNumber,Switch,Radio} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import  util from 'utils'
import "./style.css"
const { Option } = Select;

const disabledDate=(current)=>{
    return  current && current < moment().subtract(1, 'day');
}
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};
const computed=(_t)=>{
    if(_t>=10){
        return _t
    }else{
        return "0"+_t
    }
}
class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            dateFormat: 'YYYY-MM-DD HH:mm:ss',          //日期格式化
            loading:false,
            btnLoading:false,
            searchWords:"",
            lists: [
            ],
            pic:"",
            currentItem:"",//编辑行的id
            editType:1,//1 是新增 2是编辑
            newData:{},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            dataSource:[],
            visible:false,
            disabled:true,
            editStartTime:"",
            editEndTime:"",
            columns: [
                {
                    title: "激励任务名称",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "金币配置",
                    dataIndex: "coin",
                    key: "coin",
                },
                {
                    title: "上线时间",
                    dataIndex: "start",
                    key: "start",
                },
                {
                    title: "下线时间",
                    dataIndex: "end",
                    key: "end",
                },
                {
                    title: "系统",  // //1:android,2:ios,3:全端
                    dataIndex: "plat",
                    key: "plat",
                    render:(rowValue, row, index)=>{
                        return(
                            <div>
                                {
                                    rowValue==1 &&
                                    <span>android</span> ||
                                    rowValue==2 &&
                                    <span>ios</span> ||
                                    rowValue==3 &&
                                    <span>全端</span>
                                }
                            </div>
                        )
                    }
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index)=>{
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                    <Switch checkedChildren="已开启" disabled={this.state.disabled} unCheckedChildren="已关闭" defaultChecked={rowValue === 1?true:false}
                                        // onChange={(val)=>{
                                        //     console.log(val)
                                        //     this.setState({
                                        //         currentItem:row
                                        //     },()=>{
                                        //         row.status = val?1:2
                                        //         this.updateList(row)
                                        //     })
                                        // }}
                                />
                            </div>
                        )
                      }
                },
                {
                    title: "缩略图",
                    dataIndex: "pic",
                    key: "pic",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={row.pic} />)
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    render: (rowValue, row, index)=>{
                        return (
                        <div>
                            <Button 
                            style={{margin:"0 10px"}}
                            size="small"
                            type="primary"
                            onClick={()=>{
                                this.setState({
                                    entranceState:true,
                                    currentItem:row,
                                    pic:row.pic,
                                    editType:2
                                  },()=>{
                                    let _row =row;
                                    if(row.start){
                                        let starts=new Date(row.start).getTime();
                                        _row.starts=moment(starts);
                                    }else{
                                        _row.starts=""
                                    }
                                    if(row.end){
                                        let ends=new Date(row.end).getTime();
                                        _row.ends=moment(ends);
                                    }else{
                                        _row.ends=""
                                    }
                                    console.log(rowValue, _row);
                                    this.formRef.current.setFieldsValue(row)
                                  })
                            }}
                            >编辑</Button>
                            <Button 
                                size="small"
                                danger
                                onClick={()=>{this.deleteItem(row)}}
                            >删除</Button>
                        </div>
                        )
                    }
                }
            ],
            entranceState:false,  // 弹框
            plat_types:[
                {key:3,value:"全端"},
                {key:1,value:"android"},
                {key:2,value:"ios"}
            ]
        }
    }
    render() { 
        let { btnLoading, lists, layout,loading,columns,entranceState,dateFormat,plat_types} = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>频道专题管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                extra={
                    <div>
                        <Button type="primary"
                            loading={btnLoading}
                            style={{margin:"0 10px"}}
                                onClick={()=>{
                                this.syncData()
                            }}
                        >同步缓存</Button>
                        <Button type="primary"  onClick={this.getEarnTskList.bind(this)}>刷新</Button>
                        <Button type="primary" style={{margin:"0 10px"}}
                            onClick={()=>{
                                this.setState({
                                    editType:1,
                                    entranceState:true,
                                    pic:""
                                },()=>{
                                    this.formRef.current.resetFields();
                                })
                            }}
                        >新增</Button>
                    </div> 
                }
                >
                    <Table 
                        dataSource={lists}
                        // rowKey={item=>item.indexId}
                        loading={loading}
                        columns={columns} 
                        pagination={{
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.changeSize
                        }}
                    />
                </Card>
                <Modal title="新增任务" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={800}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="激励任务名称" name="title" rules={[{ required: true, message: '请填写任务名称' }]}>
                                <Input placeholder="请输入任务名称，最多6个字" maxLength={6} style={{width:'40%'}}/>
                            </Form.Item>
                            <Form.Item label="金币配置" name="coin" rules={[{ required: true, message: '请输入金币(正整数)' }]}>
                                <InputNumber min={0} />
                            </Form.Item>
                            {/*  */}
                            <Form.Item label="定时上线" name="starts" >
                                <DatePicker showTime format={dateFormat}  disabledDate={disabledDate} onChange={this.changeStart.bind(this)}></DatePicker>
                            </Form.Item>
                            <Form.Item label="定时下线" name="ends" >
                                <DatePicker showTime format={dateFormat}  disabledDate={disabledDate} ></DatePicker>
                            </Form.Item>
                            <Form.Item label="缩略图" name="pic" valuePropName="fileList" 
                                // 如果没有下面这一句会报错
                                getValueFromEvent={normFile} 
                            >
                                <div className="input-wrapper-box">
                                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)}
                                        imageUrl={this.state.pic}
                                        // this.formRef.current ? this.formRef.current.getFieldValue("backImage") : ""
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item label="系统" name="plat" rules={[{ required: true,message: '请选择系统' }]}>
                                <Radio.Group onChange={(val)=>{
                                    console.log(val)
                                }}>
                                    {plat_types.map((item, index) => {
                                        return <Radio value={item.key} key={index}> {item.value}</Radio>
                                    })}
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...this.state.tailLayout}>
                                <Button onClick={() => { this.setState({ entranceState: false }) }}>取消</Button>
                                <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </div>
        )
    }
    componentDidMount(){
        this.getEarnTskList();
    }
    changeStart(e){
        console.log(e);
    }
    changeSize=(page, pageSize)=>{   // 分页
        console.log(page, pageSize);
        this.setState({
            page:page,
            pageSize:pageSize
        }, () => {
            this.getEarnTskList()
        })
    }
    submitForm(_obj){   // 提交表单
        console.log(_obj);
        if(_obj.starts==undefined){
            _obj.start=""
        }else{
            let d=new Date(_obj.starts);
            let datetime=d.getFullYear() + '-' + computed((d.getMonth() + 1)) + '-' + computed(d.getDate()) + ' ' + computed(d.getHours()) + ':' + computed(d.getMinutes()) + ':' + computed(d.getSeconds()); 
            console.log(datetime)
            _obj.start=datetime;
        }
        if(_obj.ends==undefined){
            _obj.end=""
        }else{
            let d=new Date(_obj.ends);
            let datetime=d.getFullYear() + '-' + computed((d.getMonth() + 1)) + '-' + computed(d.getDate()) + ' ' + computed(d.getHours()) + ':' + computed(d.getMinutes()) + ':' + computed(d.getSeconds()); 
            console.log(datetime)
            _obj.end=datetime;
        }
        if(_obj.pic==undefined){
            _obj.pic=""
        }
        if(_obj.start.includes("NaN")){
            _obj.start=""
        }
        if(_obj.end.includes("NaN")){
            _obj.end=""
        }
        // delete _obj.starts
        // delete _obj.ends
        if(this.state.editType==1){  // 新增
            let params={
                ..._obj
            }
            console.log(params)
            addEarnTskList(params).then(res=>{
                console.log(res);
                if(res.data.errCode == 0){
                    message.success("新增成功")
                    this.setState({ entranceState: false })
                    this.getEarnTskList();
                }else{
                    message.error(res.data.msg)
                }
            })
        }else{  // 编辑
            let params={
                ..._obj,
                id:this.state.currentItem.id
            }
            console.log(params)
            updateEarnTskList(params).then(res=>{
                console.log(res);
                if(res.data.errCode == 0){
                    message.success("修改成功")
                    this.setState({ entranceState: false })
                    this.getEarnTskList();
                }else{
                    message.error(res.data.msg)
                }
            })
        }
    }
    getUploadFileUrl(fill){   // 图片上传的方法
        console.log(fill)
        this.formRef.current.setFieldsValue({ "pic": fill });
        this.setState({
            pic:fill
        })
    }
    getEarnTskList(){  // 获取任务列表
        let param={
            currentPage:this.state.page,
            pageSize:this.state.pageSize
        }
        getEarnTskList(param).then(res=>{
            console.log(res);
            this.setState({
                lists:res.data,
                page:res.page.currentPage,
                total:res.page.totalCount
            })
        })
    }
    deleteItem(_obj){  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: ()=>{
                this.deleteFunc(_obj.id)
            },
            onCancel: ()=>{
            }
        })
    }
    deleteFunc(_val){  // 删除
        let params={
            id:_val
        }
        deleteEarnTskList(params).then(res=>{
            console.log(res);
            if(res.data.errCode == 0){
                message.success("删除成功")
                this.getEarnTskList();
            }else{
                message.error(res.data.msg)
            }
        })
    }
    syncData(){   // 同步缓存
        syncEarnTskList().then(res=>{
            console.log(res);
        })
    }
}
 
export default EarnIncentiveTask;