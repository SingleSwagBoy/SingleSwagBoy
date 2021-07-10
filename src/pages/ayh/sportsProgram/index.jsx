import React, { Component } from 'react'
// import request from 'utils/request'
import { getPlace } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select} from 'antd'
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
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      lists: [],
      currentId:"",//编辑行的id
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
          title: "开始时间",
          dataIndex: "sendTime",
          key: "sendTime",
          render: (rowValue, row, index) => {
            return (
              <span>
                {util.formatTime(row.sendTime,"",7)}
              </span>
            )
          }
        },
        {
          title: "频道",
          dataIndex: "sendMessage",
          key: "sendMessage",
        },
        {
          title: "场次",
          dataIndex: "sendMessage",
          key: "sendMessage",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <Input placeholder={row.sendMessage} onChange={()=>{
                    console.log(111)
                  }} />
                  :row.sendMessage
                }
              </div>
            )
          }
        },
        {
          title: "赛事类型",
          dataIndex: "sendMessage",
          key: "sendMessage",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <Input placeholder={row.sendMessage} onChange={()=>{
                    console.log(111)
                  }} />
                  :row.sendMessage
                }
              </div>
            )
          }
        },
        {
          title: "赛事",
          dataIndex: "sendMessage",
          key: "sendMessage",
        },
        {
          title: "标签",
          dataIndex: "sendMessage",
          key: "sendMessage",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <Input placeholder={row.sendMessage} onChange={()=>{
                    console.log(111)
                  }} />
                  :row.sendMessage
                }
              </div>
            )
          }
        },
        {
          title: "节目信息",
          dataIndex: "sendMessage",
          key: "sendMessage",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <Input placeholder={row.sendMessage} onChange={()=>{
                    console.log(111)
                  }} />
                  :row.sendMessage
                }
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
                {
                  this.state.currentId===row.id?
                  <div>
                    <Button 
                     style={{margin:"0 10px"}}
                    size="small"
                    type="primary"
                    onClick={()=>{
                      this.setState({
                        
                      })
                    }}
                    >确认</Button>
                    <Button 
                      size="small"
                      danger
                      onClick={()=>{
                        this.setState({
                          currentId:null
                        })
                      }}
                      >取消</Button>
                  </div>:
                    <div>
                      <Button 
                      style={{margin:"0 10px"}}
                      size="small"
                      type="primary"
                      onClick={()=>{
                        this.setState({
                          currentId:row.id
                        })
                      }}
                      >编辑</Button>
                      <Button 
                        size="small"
                        danger
                        onClick={()=>{this.delArt(row.id)}}
                        >删除</Button>
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
            <Breadcrumb.Item>体育节目</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true})
            }}
            >新增</Button>
             <Button type="primary"
             style={{margin:"0 40px"}}
            onClick={()=>{
              this.setState({visible:true})
            }}
            >地域配置</Button>
             <Button type="primary"
            onClick={()=>{
              this.setState({visible:true})
            }}
            >预约H5</Button>
          </div> 
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
                  label="节目信息"
                  name="name1"
                  rules={[{ required: true, message: '请填写节目信息' }]}
                >
                 <Select
                   placeholder="请选择电视台"
                   onChange={this.onGenderChange}
                   {...this.state.selectProps}
                   allowClear
                 >
                   <Option value="male">male</Option>
                   <Option value="female">female</Option>
                   <Option value="other">other</Option>
                   
                 </Select>
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
    this.getPlace()
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
  //获取国家地区
  getPlace(){
    let params={
      page:{isPage:9}
    }
    getPlace(params).then(res=>{
      console.log(res)
    })
  }
  fetchArtLists = () => {
    this.setState({
      lists:[
        {id:1,sendTime:1625734263540,sendMessage:"中国队夺冠啦"},
        {id:2,sendTime:1625734263540,sendMessage:"中国队夺冠啦"},
        {id:3,sendTime:1625734263540,sendMessage:"中国队夺冠啦"},
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
