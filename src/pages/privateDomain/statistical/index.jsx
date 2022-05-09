import React, { Component } from 'react'
// import request from 'utils/request'
import { baseUrl,getList,getRecords,importFile,scoreExrecords,scoreRecordEdit} from 'api'
import { Card, Button, Table, message, DatePicker,Select,Upload,Input,Radio, Image, Modal, Form,InputNumber,Switch,Divider} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import XLSX from 'xlsx'
import "./index.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const url =  {
  downloadUrl: './file/template.xlsx',
}
export default class WinningNews extends Component {
  constructor(props){
    super(props);
    this.formRef = React.createRef();
    let _this = this
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      dataLoading:false,
      currentItem:"",//编辑行的id
      showEditModel:false,
      lists: [],
      excelData:"",
      optionList:[],
      activityType:[
        {id:1,name:"秒杀活动"},
        {id:2,name:"抽奖活动"},
        {id:3,name:"拼团实物套餐"},
        {id:4,name:"私域兑换"},
      ],
      screen:{}, //筛选对象
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      activityTpye:0,   // 活动类别  ==1的时候显示筛选权益名称
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "商品id",
          dataIndex: "id",
          key: "id",
          width:150,
        },
        {
          title: "商品类型",
          dataIndex: "goodsType",
          key: "goodsType",
          width:130,
          render:(RowValue,row,index)=>{   // 1.会员2.虚拟3.实体
            return <span>{RowValue==1?'会员':RowValue==2?'虚拟':RowValue==3?"实体":""}</span>
          }
        },
        {
          title: "商品名称",
          dataIndex: "goodsName",
          key: "goodsName",
          width:"8%",
        },
        {
          title: "userid",
          dataIndex: "userid",
          key: "userid",
          width:150,
        },
        {
          title: "参与时间",
          dataIndex: "createTime",
          key: "createTime",
          width:"10%",
          render: (rowValue,row,index) => {
            return (
              <span>{util.formatTime(String(row.createTime).length==10? row.createTime* 1000:row.createTime,"","")}</span>
            )
          },
        },
        {
          title: "昵称",
          dataIndex: "nickname",
          key: "nickname",
          width:150,
        },
        {
          title: "联系人",
          dataIndex: "name",
          key: "name",
          width:"5%",
        },
        {
          title: "手机",
          dataIndex: "phone",
          key: "phone",
          width:150,
        },
        {
          title: "收货地址",
          dataIndex: "detail",
          key: "detail",
          width:"10%",
          render: (rowValue,row,index) => {  // 1. 待发货 2 已发货
            return (
              <span>{row.province}{row.city}{row.area}{row.detail}</span>
            )
          },
        },
        {
          title: "用户备注",
          dataIndex: "contactorNote",
          key: "contactorNote",
          width:150,
        },
        {
          title: "发货状态",
          dataIndex: "state",
          key: "state",
          width:"5%",
          render: (rowValue,row,index) => {  // 1. 待发货 2 已发货
            return (
              <span>{row.state === 1?"待发货":row.state === 2?"已发货":"-"}</span>
            )
          },
        },
        {
          title: "物流单号",
          dataIndex: "shippingCode",
          key: "shippingCode",
          width:250,
        },
        {
          title: "物流公司",
          dataIndex: "shippingCompany",
          key: "shippingCompany",
          width:"10%",
        },
        {
            title: "操作", key: "action",
            fixed: 'right', width: 150,
            render: (rowValue, row, index) => {
                return (
                    <div>
                        <Button size="small" type="primary"
                            onClick={() => {
                                let obj={
                                    //id:row.id,
                                    shippingCode:row.shippingCode,
                                    shippingCompany:row.shippingCompany,
                                    status:row.status,
                                    remark:row.remark
                                }
                                console.log("obj-----",obj);
                                this.setState({
                                    showEditModel:true,
                                    currentItem:row
                                },()=>{
                                    this.forceUpdate();
                                    this.formRef.current.resetFields();
                                    this.formRef.current.setFieldsValue(obj)
                                })
                            }}
                        >编辑</Button>
                    </div>
                )
            }
        }
      ],
      visible:false,
    }
  }
  render() {
    let {showEditModel,layout,goodsTypes,vipOptions,icon,tailLayout}=this.state
    return (
      <div className="address">
        <Card title={
          <div className="cardTitle">
            <div className="everyBody">
              <div>参与时间:</div>
              <RangePicker   
              showTime
                onChange={(val)=>{
                  if(val){
                    this.state.screen.start = Number(new Date(val[0].toDate()).getTime())
                    this.state.screen.end = Number(new Date(val[1].toDate()).getTime())
                  }else{
                    delete this.state.screen.start
                    delete this.state.screen.end
                  }
                  this.getRecords(1)
                }}
              />
            </div>
            <div className="everyBody">
              <div>发货状态:</div>
              <Select allowClear  placeholder="请选择发货状态" 
                onChange={(val)=>{
                  if(val){
                    this.state.screen.status = Number(val)
                  }else{
                    delete this.state.screen.status
                  }
                  this.getRecords(1)
                }}
              >
                <Option value={2} key={2}>已发货</Option>
                <Option value={1} key={1}>待发货</Option>
              </Select>
            </div>
            {/* <div className="everyBody">
              <div>商品sn:</div>
              <Input placeholder="请输入商品sn"  />
            </div> */}
            <div className="everyBody">
              <div>用户userid:</div>
              <Input.Search allowClear placeholder="请输入用户userid" onSearch={(val)=>{
                if(val){
                  this.state.screen.userid = val
                }else{
                  delete this.state.screen.userid
                }
                this.getRecords(1)
              }} />
            </div>
          </div>
        }
        // extra={
        //   <div>
        //      <Button type="primary">同步缓存</Button>
        //   </div>
        // }
        >
          <Table 
              dataSource={this.state.lists}
              scroll={{ x: 2500, y: '75vh' }}
              pagination={{
                current:this.state.page,
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize,
                pageSizeOptions:[10,50,100,1000,5000],
                // hideOnSinglePage:true,
                showSizeChanger:true
              }}
              rowKey={item=>item.id}
              loading={this.state.loading}
              columns={this.state.columns} />

            <Modal title={"编辑"} centered visible={showEditModel} onCancel={() => { this.setState({ showEditModel: false }) }} footer={null} width={700}>
                {
                    <Form {...layout} name="goodsForm" ref={this.formRef} onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="物流单号" name="shippingCode">
                            <Input placeholder="请输入物流单号"/>
                        </Form.Item>
                        <Form.Item label="物流公司" name="shippingCompany">
                            <Input placeholder="请输入物流公司"/>
                        </Form.Item>
                        <Form.Item label="发货状态" name="status">
                        {/* 1. 待发货 2 已发货 */}
                            <Radio.Group initialValues={1}
                                onChange={(e)=>{
                                    console.log("type",e)
                                    this.formRef.current.setFieldsValue({ status: e.target.value })
                                    this.forceUpdate();
                                }}
                            >
                                <Radio value={1}>待发货</Radio>
                                <Radio value={2}>已发货</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="用户备注" name="remark" >
                            <TextArea rows={6} placeholder="这里填写用户备注" />
                        </Form.Item> 
                        
                        <Form.Item {...tailLayout}>
                            <Button onClick={() => { this.setState({ showEditModel: false }) }}>取消</Button>
                            <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                                确定
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </Modal>
         
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.getList() // 查询列表数据
    //this.getGoods();
    this.getRecords(1)
  }
  submitForm=(e)=>{
    console.log("submitForm",e);
    let params={
        id:this.state.currentItem.id,
        ...e
    }
    scoreRecordEdit(params).then(res=>{
        console.log("scoreRecordEdit--scoreRecordEdit",res)
        if(res.data.errCode==0){
            message.success("更新成功");
            this.getRecords(1);
            this.setState({ showEditModel: false });
        }else{
            message.error(res.data.msg)
        }
    })
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    },()=>{
      this.getRecords()
    })
  }
  getList(){
    getList({key:"USER.EQUITY"}).then(res=>{
      console.log("获取 类型",res)
      if(res.data.errCode == 0){
       this.setState({
         optionList:res.data.data
       })
      }
    })
  }
  getRecords(type){
    if(type){
      this.setState({
        page:type
      })
    }
    let _obj=JSON.parse(JSON.stringify(this.state.screen))  // util.formatTime(String(row.createTime).length==10? row.createTime* 1000:row.createTime,"","")
    if(_obj.start){
        _obj.start=util.formatTime(String(_obj.start).length==10? _obj.start* 1000:_obj.start,"",1)
    }
    if(_obj.end){
        _obj.end=util.formatTime(String(_obj.end).length==10? _obj.end* 1000:_obj.end,"",1)
    }
    let params={
      ..._obj,
      currentPage: type?type:this.state.page,
      pageSize: this.state.pageSize
    }
    scoreExrecords(params).then(res=>{
      console.log(res);
      if(res.data.errCode == 0){
       this.setState({
         lists:res.data.data.data.map((item)=>{
             let obj={
                 ...item.record,
                 ...item.address
             }
             item=obj;
             return item
         }),
         total:res.data.data.page.totalCount
       })
      }
    })
  }

  importFile(){

  }
}
