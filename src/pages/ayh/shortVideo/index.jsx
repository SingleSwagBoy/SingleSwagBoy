import React, { Component } from 'react'
// import request from 'utils/request'
import { searchVideo,shortVideoSearch,update_column } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,InputNumber} from 'antd'
import {  } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};

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
          title: "短视频ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "名字",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "关联视频",
          dataIndex: "video",
          key: "video",
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
                        currentId:row,
                        visible:true
                      })
                    }}
                    >添加到专题</Button>
              </div>
            )
          }
        }
      ],
      visible:false,
      selectOptions:[],
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
          <div>
             {/* <Breadcrumb>
              <Breadcrumb.Item>短视频搜索</Breadcrumb.Item>
            </Breadcrumb> */}
            <Input.Search allowClear style={{ width: '20%',marginTop:"10px" }} 
            placeholder="请输入搜索短视频的名称"
            onSearch={(val)=>{
              console.log(val)
              this.searchVideo(val)
            }}
             />
          </div>
         
        }
        // extra={
        //   <div>
        //    <Button type="primary"
        //     onClick={()=>{
        //       this.setState({visible:true})
        //     }}
        //     >新增</Button>
        //   </div> 
        // }
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
            title="添加到专题"
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
                  label="添加到"
                  name="id"
                  // rules={[{ required: true, message: '请填写节目信息' }]}
                >
                 <Select
                   placeholder="请选择专题"
                  //  onChange={this.onGenderChange}
                   {...this.state.selectProps}
                   allowClear
                   mode="multiple"
                   onSearch={(val)=>{
                    console.log(val)
                    if(privateData.inputTimeOutVal) {
                     clearTimeout(privateData.inputTimeOutVal);
                     privateData.inputTimeOutVal = null;
                     }
                     privateData.inputTimeOutVal = setTimeout(() => {
                         if(!privateData.inputTimeOutVal) return;
                         this.shortVideoSearch(val)
                     }, 1000)
                  }}
                 >
                   {
                     this.state.selectOptions.map(r=>{
                       return(
                        <Option value={r.id} key={r.pid}>{r.name}</Option>
                       )
                     })
                   }
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
    //currentId
    this.update_column(params)
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
  //
  searchVideo(val){
    if(!val)return
    let params={
      word:val
    }
    searchVideo(params).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data
        })
      }
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
          selectOptions:res.data.data.list
        })
      }
    })
  }
  update_column(val){
    let params={
      id:Number(this.state.currentId.pid),
      column_id:Number(val.id)
    }
    update_column(params).then(res=>{
      if(res.data.errCode === 0){
        
      }
    })
  }
}
