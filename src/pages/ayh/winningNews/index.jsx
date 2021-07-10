import React, { Component } from 'react'
// import request from 'utils/request'
import {  } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form} from 'antd'
import {  } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { confirm } = Modal

export default class WinningNews extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      lists: [],
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "发送时间",
          dataIndex: "sendTime",
          key: "sendTime",
          render: (rowValue, row, index) => {
            return (
              <span>
                {util.formatTime(row.sendTime,"",1)}
              </span>
            )
          }
        },
        {
          title: "发送信息",
          dataIndex: "sendMessage",
          key: "sendMessage",
        },
        {
          title: "操作",
          key: "action",
          render: (rowValue, row, index)=>{
            return (
              <div>
                <Button 
                  size="small"
                  danger
                  onClick={()=>{this.delArt(row.id)}}
                  >删除</Button>
                
              </div>
            )
          }
        }
      ],
      visible:false,
    }
  }
  
  render() {
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>夺奖快讯</Breadcrumb.Item>
          </Breadcrumb>
          
        }
        extra={
          <Button type="primary"
          onClick={()=>{
            this.setState({visible:true})
          }}
          >新增</Button>
        }
        >
          <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              pagination={{
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize
              }}
              columns={this.state.columns} />
         
        </Card>
        <Modal
            title="新增夺奖快讯"
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
                  label="夺奖快讯"
                  name="name1"
                  rules={[{ required: true, message: '请填写夺奖快讯' }]}
                >
                  {/* <Input.TextArea /> */}
                  <Input placeholder="请填写夺奖快讯" />
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
    this.fetchArtLists()
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
    this.fetchArtLists()
  }
  fetchArtLists = () => {
    this.setState({
      lists:[
        {id:1,sendTime:1625734263540,sendMessage:"中国队夺冠啦中国队夺冠啦中国队夺冠啦中国队夺冠啦中国队夺冠啦中国队夺冠啦中国队夺冠啦"}
      ]
    })
    // 请求文章列表接口
    // fetchArtLists({page: this.state.page, pageSize: this.state.pageSize}).then(res => {
    //   if(res.data.code === 200) {
    //     const { lists, total } = res.data.data
    //     this.setState({
    //       lists,
    //       total
    //     })
    //   }
    // })
  }
}
