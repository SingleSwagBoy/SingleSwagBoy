import React, { Component } from 'react'
// import request from 'utils/request'
import { getGameSchedule,updateGameSchedule,deleteGameSchedule,refreshSpider } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,DatePicker,TimePicker} from 'antd'
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
      pageSize: 1000,
      total: 0,
      data: [],
      loading:false,
      lists: [],
      currentItem:{id:null},//编辑行的id
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "开赛日期（北京时间）",
          dataIndex: "startTime",
          key: "startTime",
          sorter: {
            compare: (a, b) => a.startTime - b.startTime,
            multiple: 1,
          },
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <DatePicker onChange={this.timeChange.bind(this,row,1)} defaultValue={moment(row.startTime*1000)}></DatePicker>
                  :util.formatTime(String(row.startTime).length==10? row.startTime* 1000:row.startTime,"-",3)
                }
              </div>
            )
          }
        },
        {
          title: "开赛时间（北京时间）",
          dataIndex: "startTime",
          key: "startTime",
          sorter: {
            compare: (a, b) => a.startTime - b.startTime,
            multiple: 1,
          },
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <TimePicker onChange={this.timeChange.bind(this,row,2)} defaultValue={moment(row.startTime* 1000)}></TimePicker>
                  :util.formatTime(String(row.startTime).length==10? row.startTime* 1000:row.startTime,"-",7)
                }
              </div>
            )
          }
        },
        {
          title: "项目大项",
          dataIndex: "category1",
          key: "category1",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <Input placeholder={row.category1} defaultValue={row.category1} onChange={(val)=>{
                    this.state.currentItem.category1 = val.target.value
                    this.setState({
                      currentItem:this.state.currentItem
                    })
                  }} />
                  :row.category1
                }
              </div>
            )
          }
        },
        {
          title: "项目小项",
          dataIndex: "category2",
          key: "category2",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <Input placeholder={row.category2} defaultValue={row.category2} onChange={(val)=>{
                    this.state.currentItem.category2 = val.target.value
                    this.setState({
                      currentItem:this.state.currentItem
                    })
                  }} />
                  :row.category2
                }
              </div>
            )
          }
        },
        {
          title: "项目名",
          dataIndex: "gameName",
          key: "gameName",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <Input placeholder={row.gameName} defaultValue={row.gameName} onChange={(val)=>{
                    this.state.currentItem.gameName = val.target.value
                    this.setState({
                      currentItem:this.state.currentItem
                    })
                  }} />
                  :row.gameName
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
                  this.state.currentItem.id===row.id?
                  <div>
                    <Button 
                     style={{margin:"0 10px"}}
                    size="small"
                    type="primary"
                    onClick={()=>{
                      this.updateGameSchedule(row.id)
                    }}
                    >确认</Button>
                    <Button 
                      size="small"
                      danger
                      onClick={()=>{
                        // let arr = this.state.lists.filter(item=>item.id === row.id)
                        this.setState({
                          currentItem:{id:null}
                        })
                        this.getGameSchedule()
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
                          currentItem:row
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
            <Breadcrumb.Item>奥运赛事列表</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({
                loading:true
              })
              this.refreshSpider()
            }}
            >更新</Button>
          </div> 
        }
        >
          <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              rowKey={record => record.id}
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
    this.setState({
      loading:true
    })
    this.getGameSchedule()
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
      title: '删除此时间的赛事',
      content: '确认删除？',
      onOk: ()=>{
        this.deleteGameSchedule(id)
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
  //获取赛事列表
  getGameSchedule(){
    getGameSchedule({}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data,
          loading:false
        })
      }else{
        this.setState({
          loading:false
        })
      }
    })
  }
  timeChange(val,type,time){
    console.log(val,time)
    let c = new Date(time.toDate())
    if(type === 1){ //日期
      let d = new Date(String(this.state.currentItem.startTime).length === 10?this.state.currentItem.startTime*1000:this.state.currentItem.startTime)
      this.state.currentItem.startTime = c.setHours(d.getHours(),d.getMinutes()) / 1000
    }else{ //时分秒
      let d = new Date(String(this.state.currentItem.startTime).length === 10?this.state.currentItem.startTime*1000:this.state.currentItem.startTime)
      this.state.currentItem.startTime = c.setFullYear(d.getFullYear(),d.getMonth(),d.getDate()) / 1000
    }
    this.setState({
      currentItem:this.state.currentItem
    })
  }
   //编辑赛事列表
  updateGameSchedule(id){
    let params={id:id}
    let body ={
      ...this.state.currentItem
    }
    updateGameSchedule(params,body).then(res=>{
      if(res.data.errCode === 0){
        this.getGameSchedule()
        this.setState({
          currentItem:{id:null}
        })
        message.success("更新成功")
      }else{
        message.error("更新失败")
      }
    })
  }
  deleteGameSchedule(id){
    let params={id:id}
    let body ={}
    deleteGameSchedule(params,body).then(res=>{
      if(res.data.errCode === 0){
        this.getGameSchedule()
        message.success("删除成功")
      }else{
        message.error("删除失败")
      }
    })
  }
  refreshSpider(){
    refreshSpider().then(res=>{
      if(res.data.errCode === 0){
       
      }else{
        message.success("更新失败")
      }
      this.setState({
        loading:false
      })
    })
  }
}
