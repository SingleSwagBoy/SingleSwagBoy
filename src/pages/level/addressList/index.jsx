import React, { Component } from 'react'
// import request from 'utils/request'
import { getList,getRecords} from 'api'
import { Card, Button, Table, message, DatePicker,Select} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import XLSX from 'xlsx'
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    this.state = {
      data: [],
      loading:false,
      dataLoading:false,
      currentItem:{},
      lists: [],
      excelData:"",
      optionList:[],
      screen:{}, //筛选对象
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "商品名称",
          dataIndex: "goodName",
          key: "goodName",
        },
        {
          title: "userid",
          dataIndex: "userId",
          key: "userId",
        },
        {
          title: "秒杀时间",
          dataIndex: "createTime",
          key: "createTime",
          render: (rowValue,row,index) => {
            return (
              <span>{util.formatTime(String(row.createTime).length==10? row.createTime* 1000:row.createTime,"","")}</span>
            )
          },
        },
        {
          title: "昵称",
          dataIndex: "userName",
          key: "userName",
        },
        {
          title: "联系人",
          dataIndex: "contactorName",
          key: "contactorName",
        },
        {
          title: "手机",
          dataIndex: "contactorMobile",
          key: "contactorMobile",
        },
        {
          title: "收货地址",
          dataIndex: "contactorAddress",
          key: "contactorAddress",
        },
        {
          title: "用户备注",
          dataIndex: "contactorNote",
          key: "contactorNote",
        },
        {
          title: "发货状态",
          dataIndex: "state",
          key: "state",
          render: (rowValue,row,index) => {
            return (
              <span>{row.state === 20?"待发货":row.state === 30?"已发货":"-"}</span>
            )
          },
        },
        {
          title: "物流单号",
          dataIndex: "shippingCode",
          key: "shippingCode",
        },
      ],
      visible:false,
    }
  }
  render() {
    return (
      <div className="address">
        <Card title={
          <div className="cardTitle">
            <div className="everyBody">
              <div>权益名称:</div>
              <Select allowClear  placeholder="请选择权益类型"
                onChange={(val)=>{
                  if(val){
                    this.state.screen.rightId = Number(val)
                  }else{
                    delete this.state.screen.rightId
                  }
                  this.getRecords()
                }}
              >
                {
                  this.state.optionList.map(r=>{
                    return(
                      <Option value={r.indexId}>{r.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="everyBody" style={{margin:"0 20px"}}>
              <div>秒杀时间:</div>
              <RangePicker   
                onChange={(val)=>{
                  if(val){
                    this.state.screen.startTime = Number(new Date(val[0].toDate()).getTime())
                    this.state.screen.endTime = Number(new Date(val[1].toDate()).getTime())
                  }else{
                    delete this.state.screen.startTime
                    delete this.state.screen.endTime
                  }
                  this.getRecords()
                }}
              />
            </div>
            <div className="everyBody">
              <div>发货状态:</div>
              <Select allowClear  placeholder="请选择发货状态" 
                onChange={(val)=>{
                  if(val){
                    this.state.screen.state = Number(val)
                  }else{
                    delete this.state.screen.state
                  }
                  this.getRecords()
                }}
              >
                <Option value={30}>已发货</Option>
                <Option value={20}>待发货</Option>
              </Select>
            </div>
          </div>
        }
        extra={
          <div>
            <Button type="primary" onClick={()=>{this.exportExcel(1)}}>导出</Button>
             <Button type="primary" style={{margin:"0 20px"}} onClick={()=>{}}>导入数据（发货）</Button>
             <Button type="primary"onClick={()=>{this.exportExcel(2)}}>下载导入模版</Button>
          </div>
        }
        >
          <Table 
              dataSource={this.state.lists}
              rowKey={item=>item.indexId}
              loading={this.state.loading}
              columns={this.state.columns} />
         
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.getList() // 查询列表数据
    this.getRecords("")
  }
 
  getList(){
    getList({key:"USER.EQUITY"}).then(res=>{
      if(res.data.errCode == 0){
       this.setState({
         optionList:res.data.data
       })
      }
    })
  }
  getRecords(){
    let params={
      ...this.state.screen
    }
    getRecords(params).then(res=>{
      if(res.data.errCode == 0){
       this.setState({
         lists:res.data.data.data
       })
      }
    })
  }
  exportExcel = (type) => {
    // 处理表头
    // console.log(Object.keys(this.state.lists[0]))
    let data = [];
    let keys = []
    let exportKey = []
    if(type === 1){
      this.state.columns.forEach(r=>{
        keys.push(r.title)
        exportKey.push(r.key)
      })
    }else{
      keys = ['编号sn', '物流单号', '物流公司']
    }
    // data.push(keys)
    let a =[]
    if(type === 1){
      this.state.lists.forEach(l => {
        exportKey.forEach(r=>{
          // if(l.){

          // }
        })
      })
    }
    console.log(data)
    return
    this.setState({
      excelData:data
    }, ()=>{
      this.exportFile(type)
    })
  }
  exportFile = (type) => {
    // 导出excel
		const ws = XLSX.utils.aoa_to_sheet(this.state.excelData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		XLSX.writeFile(wb, type===1?"用户列表.xlsx":"导入模版.xlsx")
  }
}
