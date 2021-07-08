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
      channelItem:"",
      mySwiper:"",
      timeSwiper:[
        "2020-07-06",
        "2020-07-07",
        "2020-07-08",
        "2020-07-09",
        "2020-07-10",
        "2020-07-11",
        "2020-07-12",
      ],
      currentItem:[{child:[]}],
      channel:[
        "央视","卫视","地方台","其他"
      ],
      channel_info:[
        {name:"央视",child:["cctv1","cctv2"]},
        {name:"卫视",child:["cctv3","cctv4"]},
        {name:"地方台",child:["cctv5","cctv6"]},
        {name:"其他",child:["cctv7","cctv8"]},
      ],
      currentIndex:0,
      columns: [
        {
          title: "开始时间",
          dataIndex: "title",
          key: "title",
          sorter: {
            compare: (a, b) => a.title - b.title,
            multiple: 1,
          },
        },
        {
          title: "显示名称",
          dataIndex: "author",
          key: "author"
        },
        {
          title: "关联节目",
          dataIndex: "desc",
          key: "desc",
        },
        {
          title: "关联分集",
          dataIndex: "author",
          key: "author",
        },
        {
          title: "列表封面",
          dataIndex: "thumb",
          key: "thumb",
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
          title: "更新时间",
          dataIndex: "createAt",
          key: "createAt",
          sorter: {
            compare: (a, b) => a.createAt - b.createAt,
            multiple: 1,
          },
        },
        {
          title: "操作",
          key: "action",
          render: (rowValue, row, index)=>{
            return (
              <div>
                <Button 
                  size="small"
                  onClick = { () => {
                    // 点击跳转到编辑页，传ID
                    this.setState({
                      visible:true,
                      channelItem:row
                    })
                  } }
                  >编辑</Button>
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
            <Breadcrumb.Item>节目单</Breadcrumb.Item>
          </Breadcrumb>
        }
        >
          <div className="time_choose">
            <div className="icon_left"><LeftOutlined /></div>
            <div className="swiper_box">
              {
                this.state.timeSwiper.map((r,i)=>{
                  return(
                    <div style={{backgroundColor:this.state.currentIndex == i?"#1890ff":"#ccc"}} onClick={()=>{this.setState({currentIndex:i})}} key={i}>{r}</div>
                  )
                })
              }
            </div>
            <div className="icon_right">
              {/* <ClockCircleOutlined /> */}
              <Space direction="vertical" size={12}>
                <DatePicker bordered={false} />
              </Space>
              </div>
          </div>
          <div className="content">
            <div className="left_box">
              <Search
                placeholder="输入频道名称"
                allowClear
                enterButton="搜索"
                size="large"
                onSearch={this.onSearch.bind(this)}
              />
              <div className="channel_farther">
                <div className="left">
                  {
                    this.state.channel.map((r,i)=>{
                      return(
                        <div key={i} onClick={()=>{
                          let arr = this.state.channel_info.filter(item=>item.name == r)
                          // console.log(arr)
                          this.setState({currentItem:arr})}
                        }  
                        className={[this.state.currentItem[0].name == r?"activeItem":""]}>{r}</div>
                      )
                    })
                  } 
                </div>
                <div className="right">
                  {
                    this.state.currentItem[0].child.map((r,i)=>{
                      return(
                        <div key={i}>{r}</div>
                      )
                    })
                  } 
                </div>
              </div>
            </div>
            <div className="right_box">
              <div className="action_box">
                <div>{this.state.currentItem[0].name}节目单</div>
                <div className="btn_box">
                  <div>更新</div>
                  <div onClick={()=>{
                    this.setState({visible:true,channelItem:null})
                  }}>插入新节目</div>
                </div>
              </div>
              <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              pagination={{
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize
              }}
              columns={this.state.columns} />
            </div>
          </div>
         
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
