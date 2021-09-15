import React, { Component } from 'react'
import moment from 'moment';
import MyModal from "./myModal"
import { getHlcList , changeStateHlcList , addHlcList , editHlcList , copyHlcList , syncHlcList , deleteHlcList , getUserTag , requestDeliveryTypes} from 'api'
import {Breadcrumb, Card, Image, Button, Table, Modal, message,Input, Form,Select,InputNumber,Switch,DatePicker} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class LoginManage extends Component{
    //formRef = React.createRef();
    constructor(){
        super();
        this.state = {
            refRecommendModal: null,
            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            hlcList:[],
            loading:false,
            btnLoading:false,
            searchWords:"",
            currentItem:"",//编辑行的id
            newData:{},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            modal_box: {
                is_show: false,
                select_item: null,
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            dataSource:[],
            user_tag: [],
            delivery_types: [],     //投放类型
            visible:false,
            columns: [
                {
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "背景图",
                    dataIndex: "backgroundImage",
                    key: "backgroundImage",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={row.backgroundImage} />)
                    }
                },
                {
                    title: "上下线时间",
                    dataIndex: "date",
                    key: "date",
                    width: 400,
                    render: (rowValue, row, index) => {
                        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                        let open_time = moment(row.startTime).format(dateFormat)
                        let stop_time = moment(row.endTime).format(dateFormat)

                        return (
                            <RangePicker showTime disabled defaultValue={[moment(open_time, dateFormat), moment(stop_time, dateFormat)]} format={dateFormat} />
                        )
                    }
                },
                {
                    title: "排序",
                    dataIndex: "sort",
                    key: "sort",
                },
                {
                    title: "状态",
                    dataIndex: "state",
                    key: "state",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Switch checkedChildren="有效" unCheckedChildren="无效"
                                    key={new Date().getTime()}
                                    defaultChecked={rowValue === 1 ? true : false}
                                    onChange={(val) => {
                                        // row.state = val ? 1 : 0
                                        this.changeState(row)
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    render: (rowValue, row, index)=>{
                        return (
                        <div>
                            <Button size="small" type="primary" onClick={()=>{this.copyData(row)}}>复制</Button>
                            <Button style={{margin:"0 10px"}} size="small" type="primary"
                            onClick={()=>{
                                //console.log(rowValue, row);
                                this.editItemBtnClick(row)
                                //this.props.history.push(`/mms/channelManage/editSubject/${row.ID}`)
                            }}
                            >编辑</Button>
                            <Button size="small" danger onClick={()=>{this.deleteItem(row)}}>删除</Button>
                        </div>
                        )
                    }
                }
            ],
        }
      }
    componentDidMount(){
        this.initData();
        this.getUserTags();
    }
    initData=()=>{   // 初始化数据
        let params = {
            "name": "", 
            page: {
              "currentPage": this.state.page,
              "pageSize": this.state.pageSize
            }
          }
          this.setState({
            hlcList:[]
          })
        getHlcList(params).then(res=>{
            console.log(res);
            if(res.data.errCode==0){
                this.setState({
                    hlcList:res.data.data.data,
                    page:res.data.data.page.currentPage,
                    pageSize:res.data.data.page.pageSize,
                    total:res.data.data.page.totalCount
                })
            }
        })
    }
    copyData=(_obj)=>{   // 复制功能
        console.log(_obj);
        let params={
            id:_obj.id
        }
        copyHlcList(params).then(res=>{
            console.log(res);
            if(res.data.errCode==0){
                message.success("复制成功")
                this.initData();
            }else{
                message.error(res.data.msg)
            }
        })
    }
    deleteRow=(_obj)=>{
        console.log(_obj);
        let params={
            ids:_obj.id
        }
        deleteHlcList(params).then(res=>{
            if(res.data.errCode==0){
                message.success("删除成功")
                this.initData();
            }else{
                message.error(res.data.msg)
            }
        })
    }
    deleteItem=(_obj)=>{   // 删除
        Modal.confirm({
            title: `执行删除操作后，该数据下对应的信息都会被删除。是否确认删除？`,
            content: '确认删除？',
            onOk: ()=>{
              this.deleteRow(_obj)
            },
            onCancel: ()=>{
            }
        })
        
    }
    changeState=(_obj)=>{   // 改变状态
        console.log(_obj);
        let params={
            ids:_obj.id
        }
        changeStateHlcList(params).then(res=>{
            if(res.data.errCode==0){
                message.success("修改成功")
                this.initData();
            }else{
                message.error(res.data.msg)
            }
        })
    }
    syncData=()=>{   // 同步数据
        this.setState({
            btnLoading:true
        })
        let header={
            "Content-Type":"application/x-www-form-urlencoded"
        }
        syncHlcList({},header).then(res=>{
            if (res.data.errCode == 0) {
                message.success("数据同步成功")
                this.setState({
                    btnLoading:false
                })
            } else {
                message.error(res.data.msg)
                this.setState({
                    btnLoading:false
                })
            }
        })
    }
    changeSize = (page, pageSize) => {  // 分页获取
        this.setState({
            page,
            pageSize
        }, () => {
            this.initData()
        })
    } 
    getUserTags=()=>{  //  用户设备标签   投放类型
        getUserTag().then(res => { //用户设备标签
            console.log(res);
            let errCode = res.data.errCode;
            if (errCode === 0) {
                this.setState({
                    user_tag: res.data.data,
                })
            }
        })
        requestDeliveryTypes().then(res => { //投放类型
            this.setState({
                delivery_types: res,
            })
        });
    }
    onModalCancel() {  // 取消
        this.setState({
            modal_box: {
                is_show: false,
            }
        })
    }
    editItemBtnClick=(obj)=>{  // 点击编辑按钮
        console.log(obj);
        this.setState({
            modal_box: {
                is_show: true,
                select_item: obj,
            }
        }, () =>{
            this.state.refRecommendModal.refreshFromData(obj);
        })
       
    }
    addItemBtnClick(){   // 新增按钮
        this.setState({
            modal_box: {
                is_show: true,
                select_item: null,
            }
        })
        this.state.refRecommendModal.refreshFromData(null);
    }
    onModalConfirm=(obj)=>{   // 点击确认
        console.log(obj);
        if(obj.id!=''){  // 修改
            editHlcList(obj).then(res=>{
                console.log(res)
                if(res.data.errCode==0){
                    message.success("修改成功")
                    this.setState({
                        modal_box: {
                            is_show: false,
                        }
                    },()=>{
                        this.initData();
                    })
                    
                }else{
                    message.error(res.data.msg)
                }
            })
        }else{  // 新增
            delete obj.id;
            delete obj.time;
            delete obj.status;
            console.log(obj)
            addHlcList(obj).then(res=>{
                console.log(res)
                if(res.data.errCode==0){
                    message.success("添加成功")
                    this.setState({
                        modal_box: {
                            is_show: false,
                        }
                    },()=>{
                        this.initData();
                    })
                    //this.initData();
                }else{
                    message.error(res.data.msg)
                }
            })
        }
    }
    


    render(){
        let {modal_box,user_tag,delivery_types}=this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>个人中心登录管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                extra={
                    <div>
                        <Button type="primary"
                            onClick={()=>{
                                this.addItemBtnClick()
                                //this.props.history.push(`/mms/channelManage/editSubject/add`)
                            }}
                        >新增</Button>
                        <Button type="primary"
                            loading={this.state.btnLoading}
                            style={{margin:"0 10px"}}
                                onClick={()=>{
                                this.syncData()
                            }}
                        >数据同步</Button>
                    </div> 
                }
                >
                    <Table 
                        dataSource={this.state.hlcList}
                        // rowKey={item=>item.indexId}
                        loading={this.state.loading}
                        columns={this.state.columns}
                        pagination={{
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.changeSize
                        }}
                        />
                        <MyModal onRef={(val) => { this.setState({ refRecommendModal: val }) }} visible={modal_box.is_show} delivery_types={delivery_types}
                        user_tag={user_tag} modal_box={modal_box} onOk={this.onModalConfirm.bind(this)} onCancel={this.onModalCancel.bind(this)}></MyModal>
                </Card>
            </div>
        )
    }
}