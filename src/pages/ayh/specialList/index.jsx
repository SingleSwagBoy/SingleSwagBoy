import React, { Component } from 'react'
// import request from 'utils/request'
import { shortVideoSearch,addColumn,cvideos,update_column,editColumn } from 'api'
import { Card, Image, Button, Table, Modal, message,Input, Form,Select,InputNumber} from 'antd'
import {  } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { Option } = Select;


export default class SportsProgram extends Component {
  formRef = React.createRef();
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      searchWords:"",
      lists: [],
      currentItem:"",//编辑行的id
      newData:{},
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      linkVideoList:[],
      columns: [
        {
          title: "专题名",
          dataIndex: "name",
          key: "name",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem == row.id?
                  <Input defaultValue={row.name} onChange={(val)=>{
                    this.state.newData.name = val.target.value
                    this.setState({
                      newData:this.state.newData
                    })
                  }} />
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
                  this.state.currentItem == row.id?
                  <InputNumber defaultValue={row.sort} onChange={(val)=>{
                    console.log(val)
                    this.state.newData.sort = val
                    this.setState({
                      newData:this.state.newData
                    })
                  }} />
                  :row.sort
                }
              </div>
            )
          }
        },
        {
          title: "列表封面",
          dataIndex: "image",
          key: "image",
          render: (rowValue) => {
            return (
              <Image
                width={100}
                src={rowValue}
              />
            )
          },
        },
        {
          title: "关联视频",
          dataIndex: "video",
          key: "video",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {/* {
                  this.state.currentItem == row.id?
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
                } */}
                <Button size="small"type="primary"
                onClick={()=>{
                  this.cvideos(row.id)
                  this.setState({
                    videoVisible:true
                  })
                }}
                >查看关联视频</Button>
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
                  this.state.currentItem===row.id?
                  <div>
                    <Button 
                     style={{margin:"0 10px"}}
                    size="small"
                    type="primary"
                    onClick={()=>{
                      this.editColumn(row)
                    }}
                    >确认</Button>
                    <Button 
                      size="small"
                      danger
                      onClick={()=>{
                        this.setState({
                          currentItem:null,
                          newData:{}
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
                          currentItem:row.id,
                          newData:{}
                        })
                      }}
                      >编辑</Button>
                      <Button 
                        size="small"
                        danger
                        onClick={()=>{
                          this.delArt(row,1)
                        }}
                        >删除</Button>
                    </div>
                }
              </div>
            )
          }
        }
      ],
      visible:false,
      videoVisible:false,
      videoColumns:[
        {
          title: "名称",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "id",
          dataIndex: "pid",
          key: "pid",
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
                  onClick={()=>{this.delArt(row,2)}}
                  >删除</Button>
              </div>
            )
          }
        }
      ]
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
              this.setState({
                searchWords:val
              })
              this.shortVideoSearch(val)
            }} />
          </div>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true},()=>{
                this.formRef.current.resetFields()
              })
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
            onCancel={() => {this.closeModel(1)}}
            footer={null}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                ref = {this.formRef}
                onFinish={this.submitForm.bind(this)}
              >
                <Form.Item
                  label="专题名"
                  name="name"
                  rules={[{ required: true, message: '请填写专题名' }]}
                >
                 <Input placeholder="请填写专题名" />
                </Form.Item>
                <Form.Item
                  label="专题key"
                  name="topicKey"
                  rules={[{ required: true, message: '请填写专题key' }]}
                >
                 <Input placeholder="请填写专题key" />
                </Form.Item>
                <Form.Item {...this.state.tailLayout}>
                  <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                    确定
                  </Button>
                </Form.Item>
              </Form> 
            }
          </Modal>
          <Modal
            title="关联视频"
            centered
            visible={this.state.videoVisible}
            onCancel={() => {this.closeModel(2)}}
            footer={null}
            width={1000}
          >
            <Table 
              dataSource={this.state.linkVideoList}
              columns={this.state.videoColumns} />
          </Modal>
      </div>
    )
  }
  componentDidMount(){
   this.shortVideoSearch(this.state.searchWords)
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(type){
    if(type === 1){
      this.setState({
        visible:false
      })
    }else{
      this.setState({
        videoVisible:false
      })
    }
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.addColumn(params)
    this.closeModel(1)
  }
  // 删除文章
  delArt(val,type) {
    Modal.confirm({
      title: `${type === 2?"删除此关联视频":"删除此专题"}`,
      content: '确认删除？',
      onOk: ()=>{
        if(type === 2){
          this.update_column(val)
        }else{
          //删除专题
         this.state.newData.status = 2
         this.setState({
          newData:this.state.newData
         },()=>{
          this.editColumn(val)
         })
        }
      },
      onCancel: ()=>{

      }
    })
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    console.log(page,pageSize)
    this.setState({
      page,
      pageSize
    },()=>{
      this.shortVideoSearch(this.state.searchWords)
    })
   
  }
  shortVideoSearch(val){
    // if(!val)return
    let params={
      type:1,
      is_tv:false,
      keywords:val,
      page:{
        currentPage: this.state.page,
        pageSize: this.state.pageSize
      }
    }
    shortVideoSearch(params).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data.list || [],
          total:res.data.data.total
        })
      }
    })
  }
  addColumn(val){
    let params={
      name:val.name,
      topicKey:val.topicKey,
      type:1,
      sort:100
    }
    addColumn(params).then(res=>{
      console.log(res)
      if(res.data.errCode === 0){
        this.shortVideoSearch(this.state.searchWords)
        message.success("新增成功")
      }else{
        message.error("新增成功")
      }
    })
  }
  cvideos(id){
    cvideos({column_id:id}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          linkVideoList:res.data.data
        })
      }
    })
  }
  update_column(val){
    let params={
      id:Number(val.pid),
      column_id:0
    }
    update_column(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("删除成功")
        this.cvideos(val.columnId)
      }else{
        message.error("删除失败")
      }
    })
  }
  editColumn(val){
    console.log(val,"val")
    let params={
      ...val,
      ...this.state.newData
    }
    editColumn(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("更新成功")
        // this.cvideos(val.id)
        this.shortVideoSearch(this.state.searchWords)
      }else{
        message.error("更新失败")
      }
      this.setState({currentItem:null})
    })
  }
}
