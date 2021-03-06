import React, { Component } from 'react'
// import request from 'utils/request'
import { getConfig,getMedalList,setMedalList,getChinaTodayMedal,setChinaTodayMedal } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,InputNumber} from 'antd'
import {  } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { confirm } = Modal
const { Option } = Select;

export default class SportsProgram extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 1000,
      total: 0,
      data: [],
      loading:false,
      lists: [],
      currentItem:{rank:null},//编辑行的id
      listData:"",
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      setBody:"",//进入奖牌数
      columns: [
        {
          title: "排名",
          dataIndex: "rank",
          key: "rank",
          width: 100,
        },
        {
          title: "国家",
          dataIndex: "country",
          key: "country",
          width: 100,
        },
        {
          title: "国旗",
          dataIndex: "flag",
          key: "flag",
        },
        {
          title: "金牌",
          dataIndex: "gold",
          key: "gold",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.rank == row.rank?
                  <Input placeholder={row.gold} onChange={(val)=>{
                    this.state.currentItem.gold = Number(val.target.value)
                    this.setState({
                      currentItem:this.state.currentItem
                    })
                  }} />
                  :row.gold
                }
              </div>
            )
          }
        },
        {
          title: "银牌",
          dataIndex: "silver",
          key: "silver",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.rank == row.rank?
                  <Input placeholder={row.silver} onChange={(val)=>{
                    this.state.currentItem.silver = Number(val.target.value)
                    this.setState({
                      currentItem:this.state.currentItem
                    })
                  }} />
                  :row.silver
                }
              </div>
            )
          }
        },
        {
          title: "铜牌",
          dataIndex: "bronze",
          key: "bronze",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.rank == row.rank?
                  <Input placeholder={row.bronze} onChange={(val)=>{
                    this.state.currentItem.bronze = Number(val.target.value)
                    this.setState({
                      currentItem:this.state.currentItem
                    })
                  }} />
                  :row.bronze
                }
              </div>
            )
          }
        },
        {
          title: "操作",
          key: "action",
          width: 300,
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.rank===row.rank?
                  <div>
                    <Button 
                     style={{margin:"0 10px"}}
                    
                    type="primary"
                    onClick={()=>{
                      this.setMedalList()
                    }}
                    >确认</Button>
                    <Button 
                      
                      danger
                      onClick={()=>{
                        this.setState({
                          currentItem:{rank:null}
                        })
                        this.getMedalList()
                      }}
                      >取消</Button>
                  </div>:
                    <div>
                      <Button 
                      style={{margin:"0 10px"}}
                      type="primary"
                      onClick={()=>{
                        this.setState({
                          currentItem:row
                        })
                      }}
                      >编辑</Button>
                      {/* <Button 
                        size="small"
                        danger
                        onClick={()=>{this.delArt(row.id)}}
                        >删除</Button> */}
                    </div>
                }
              </div>
            )
          }
        }
      ],
      visible:false,
      selectProps:{
        optionFilterProp:"children",
        filterOption(input, option){
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        showSearch(){
          console.log('onSearch')
        }
      }
    }
  }
  
  render() {
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>奖牌榜</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true})
            }}
            >今日奖牌数</Button>
          </div> 
        }
        >
          <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              rowKey={record => record.rank+record.country}
              pagination={{
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize
              }}
              columns={this.state.columns} />
         
        </Card>
        <Modal
            title="今日奖牌数"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel()}}
            footer={null}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this)}
              >
                <Form.Item
                  label="今日奖牌数"
                  name="gold"
                  // rules={[{ required: true, message: '请填写节目信息' }]}
                >
                 <InputNumber min={0} defaultValue={this.state.setBody.gold} onChange={(val)=>{
                   console.log(val)
                 }} />
                </Form.Item>
                <Form.Item {...this.state.tailLayout}>
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
    this.getMedalList()
    this.getChinaTodayMedal()
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(val){
    this.setState({
      visible:false
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.setChinaTodayMedal(params)
    this.closeModel()
  }
  // 删除文章
  delArt(id) {
    Modal.confirm({
      title: '删除此夺奖快讯',
      content: '确认删除？',
      onOk: ()=>{
        
      },
      onCancel: ()=>{

      }
    })
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    })
  }
  getMedalList(){
    getMedalList({}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data.item,
          listData:res.data.data
        })
      }
    })
  }
  setMedalList(){
    this.state.lists.forEach(r=>{
      if(r.country === this.state.currentItem.country){
        r = this.state.currentItem
      }
    })
    let params={
      ...this.state.listData,
      item:[...this.state.lists]
    }
    setMedalList(params).then(res=>{
      if(res.data.errCode === 0){
        this.getMedalList()
        this.setState({
          currentItem:{rank:null}
        })
        message.success("更新成功")
      }else{
        message.success("更新失败")
      }
    })
  }
  getChinaTodayMedal(){
    getChinaTodayMedal({}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          setBody:res.data.data
        })
      }else{
        message.error(res.data.msg)
      }
    })
  }
  setChinaTodayMedal(num){
    let params={
      ...this.state.setBody,
      gold:num.gold
    }
    setChinaTodayMedal(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("设置成功")
        this.state.setBody.gold = num.gold
      }else{
        message.error(res.data.msg)
      }
    })
  }
}
