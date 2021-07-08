import React, { Component } from 'react'
// import request from 'utils/request'
import { fetchArtLists, delArtById } from 'api'
import { Card, Breadcrumb, Button, Table, Image, Modal, message,Input, Space,DatePicker} from 'antd'
import { Link } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import ChannelEdit from "../../../components/channelEdit/index"

import  util from 'utils'
import "./style.css"
const { Search } = Input;
const { confirm } = Modal

export default class AyhChannel extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      lists: [],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "发送时间",
          dataIndex: "sendTime",
          key: "sendTime"
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
            title="插入节目单"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel()}}
            width={1000}
            footer={null}
          >
            <ChannelEdit closeModel={this.closeModel.bind(this)} channelItem={this.state.channelItem} />
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
  // 删除文章
  delArt(id) {
    Modal.confirm({
      title: '删除文章',
      content: '确认删除？',
      onOk: ()=>{
        delArtById(id).then(res=>{
          if(res.data.code === 200) {
            message.success(res.data.msg, 2, ()=> {
              this.props.history.go(0)
            })
          }
        })
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
    // 请求文章列表接口
    fetchArtLists({page: this.state.page, pageSize: this.state.pageSize}).then(res => {
      if(res.data.code === 200) {
        const { lists, total } = res.data.data
        this.setState({
          lists,
          total
        })
      }
    })
  }
}
