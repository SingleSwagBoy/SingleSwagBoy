import React, { Component } from 'react'
// import request from 'utils/request'
import { shortVideoSearch,addColumn } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,InputNumber} from 'antd'
import {  } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { Option } = Select;


export default class SportsProgram extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10000,
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
          title: "专题名",
          dataIndex: "name",
          key: "name",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <Input defaultValue={row.name} />
                  :row.name
                }
              </div>
            )
          }
        },
        {
          title: "排序",
          dataIndex: "sort",
          key: "sort",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <InputNumber defaultValue={row.sort} onChange={(val)=>{
                    console.log(val)
                  }} />
                  :row.sort||"-"
                }
              </div>
            )
          }
        },
        {
          title: "关联视频",
          dataIndex: "video",
          key: "video",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId == row.id?
                  <Select
                    mode="multiple"
                    placeholder="Please select"
                    defaultValue={row.video}
                    onChange={(value)=>{
                      console.log(value)
                    }}
                    style={{ width: '100%' }}
                  >
                    {
                      Array.isArray(row.video) &&
                      row.video.map((r,i)=>{
                        return(
                          <Option key={i} value={r} >{r}</Option>
                        )
                      })
                    }
                    
                  </Select>
                  :row.video
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
    }
  }
  
  render() {
    return (
      <div>
        <Card title={
          <div>
             {/* <Breadcrumb>
              <Breadcrumb.Item>奥运专题</Breadcrumb.Item>
            </Breadcrumb> */}
             <Input.Search allowClear style={{ width: '20%',marginTop:"10px" }} 
            placeholder="请输入搜索专题的名称"
            onSearch={(val)=>{
              this.shortVideoSearch(val)
            }} />
          </div>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true})
            }}
            >新增</Button>
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
            title="新增专题"
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
                  label="专题名"
                  name="name"
                  rules={[{ required: true, message: '请填写专题名' }]}
                >
                 <Input placeholder="请填写专题名" />
                </Form.Item>
                {/* <Form.Item
                  label="短视频ID"
                  name="shortVideoId"
                >
                 <Input placeholder="请填写短视频ID" />
                </Form.Item> */}
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
    this.addColumn(params)
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
  shortVideoSearch(val){
    if(!val)return
    let params={
      is_tv:false,
      keywords:val,
      page:{
        currentPage: 1,
        pageSize: 2000
      }
    }
    shortVideoSearch(params).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data.list || []
        })
      }
    })
  }
  addColumn(val){
    let params={
      name:val.name,
      type:1
    }
    addColumn(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("新增成功")
      }else{
        message.error("新增成功")
      }
    })
  }
}
