import React, { Component } from 'react'
// import request from 'utils/request'
import { getChannelGroupChannel,getListChannelInfo ,updateListChannelInfo,deleteChannelProgram,getCheckboxTry,addTvTrying,syncCacheTvTry,deleteTvTrying} from 'api'
import { Card, Breadcrumb, Button, Table, Image, Modal, message,Input, Space,DatePicker,Checkbox} from 'antd'
import { Link } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import ChannelEdit from "../../../components/channelEdit/index"

import  util from 'utils'
import "./style.css"
import moment from 'moment';
// import { utils } from 'xlsx/types'
const { Search } = Input;


export default class AyhChannel extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 1000,
      total: 0,
      type:null,
      data: [],
      loading:false,
      lists: [],
      channelItem:{},
      currentChannelItem:"",
      channelGroup:[],
      mySwiper:"",
      timeSwiper:[],
      currentItem:{channelGroupId:1495,channelName:"央视"},
      checkBoxList:[],//查看推送尝鲜版的list
      channel:[
        {channelName:"央视",channelGroupId:1495},
        {channelName:"卫视",channelGroupId:1496}
      ],
      currentIndex:0,
      columns: [
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          width: 100,
          sorter: {
            compare: (a, b) => a.startTime - b.startTime,
            multiple: 1,
          },
          render: (rowValue,row,index) => {
            return (
              <span>{util.formatTime(String(row.startTime).length==10? row.startTime* 1000:row.startTime,"",7)}</span>
            )
          },
        },
        {
          title: "显示名称",
          dataIndex: "name",
          width: 200,
          key: "name"
        },
        {
          title: "关联节目",
          dataIndex: "programName",
          width: 100,
          key: "programName",
        },
        {
          title: "关联分集",
          dataIndex: "season",
          width: 100,
          key: "season",
          render: (rowValue) => {
            return (
              <div>{rowValue?rowValue:"-"}</div>
            )
          },
        },
        {
          title: "列表封面",
          dataIndex: "h_image",
          width: 140,
          key: "h_image",
          render: (rowValue,row) => {
            return (
              <Image
                width={100}
                src={row.h_image}
              />
            )
          },
        },
        {
          title: "更新时间",
          dataIndex: "lastUpdateTime",
          width: 100,
          key: "lastUpdateTime",
          sorter: {
            compare: (a, b) => a.lastUpdateTime - b.lastUpdateTime,
            multiple: 1,
          },
        },
        {title:'推送到尝鲜版',
            key:'push_to_taste', width: 120, fixed: 'right',
            render:(row)=>{
                return(
                    <div>
                        <Checkbox checked={row.checked} disabled={this.state.checkBoxList.isAll} onChange={val=>{
                          if(val.target.checked){
                            this.addTvTrying(row)
                          }else{
                            this.deleteTvTrying(row)
                          }
                         
                        }}>
                            推送
                        </Checkbox>
                    </div>
                )
            }
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          fixed: 'right',
          render: (rowValue, row, index)=>{
            return (
              <div>
                <Button 
                  size="small"
                  onClick = { () => {
                    // 点击跳转到编辑页，传ID
                    let time = String(row.startTime).length==10? row.startTime* 1000:row.startTime
                    row.channelGroupId = this.state.currentItem.channelGroupId
                    row.channelCode = this.state.currentChannelItem.channelCode
                    row.startTime = moment(time)
                    row.time = moment(time)
                    row.h_image = Array.isArray(row.h_image)?row.h_image:[row.h_image]
                    this.setState({
                      channelItem:row,
                      type:1
                    },()=>{
                      this.setState({ visible:true})
                      console.log(this.state.channelItem,"channelItem")
                    })
                   
                  } }
                  >编辑</Button>
                <Button style={{'marginLeft':"5px"}} size="small" danger onClick={()=>{this.delArt(row)}}>
                      删除
                </Button>
                
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
        <Card >
          <div className="time_choose">
            <div className="icon_left"><LeftOutlined /></div>
            <div className="swiper_box">
              {
                this.state.timeSwiper.map((r,i)=>{
                  return(
                    <div style={{backgroundColor:this.state.currentIndex == i?"#1890ff":"#ccc"}} 
                    onClick={()=>{
                      this.setState({currentIndex:i})
                      this.getListChannelInfo(this.state.currentChannelItem,r)
                      }
                    } key={i}
                    >
                      {r}
                    </div>
                  )
                })
              }
            </div>
            <div className="icon_right">
              {/* <ClockCircleOutlined /> */}
              <Space direction="vertical" size={12}>
                <DatePicker bordered={false} onChange={this.timeChange.bind(this)} />
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
                          this.setState({currentItem:r})
                          this.getChannelGroupChannel(r.channelGroupId)
                          }
                        }  
                        className={[this.state.currentItem.channelGroupId == r.channelGroupId?"activeItem":""]}>{r.channelName}</div>
                      )
                    })
                  } 
                </div>
                <div className="right">
                  {
                    this.state.channelGroup.map((r,i)=>{
                      return(
                        <div key={r.id} onClick={()=>{
                          this.setState({currentChannelItem:r})
                          this.getListChannelInfo(r,this.state.timeSwiper[this.state.currentIndex])
                        }} 
                        className={[this.state.currentChannelItem.id == r.id?"activeItem":""]}
                        >{r.channelName}</div>
                      )
                    })
                  } 
                </div>
              </div>
            </div>
            <div className="right_box">
              <div className="action_box">
                <div className="title_btn">
                  <div>{this.state.currentItem.channelName}节目单</div>
                  {/* 节目单推送和频道推送互斥 */}
                  <div><Checkbox checked={this.state.checkBoxList.isAll} disabled={this.state.checkBoxList.programs?this.state.checkBoxList.programs.length>0:false}  
                  onChange={val=>{
                    if(val.target.checked){
                      this.addTvTrying(1)
                    }else{
                      this.deleteTvTrying(1)
                    }
                    
                  }}>推送到尝鲜版</Checkbox>
                  </div> 
                </div>
                <div className="btn_box">
                {/* //推送到尝鲜版 */}
                  <div onClick={()=>{this.syncCacheTvTry()}}>尝鲜版数据同步</div> 
                  <div onClick={()=>{this.updateListChannelInfo()}}>更新</div>
                  <div onClick={()=>{this.setState({visible:true,channelItem:null,type:2})}}>插入新节目</div>
                </div>
              </div>
              {/* {{item}} */}
              <Table scroll={{ x: 800 }} dataSource={this.state.lists}  loading={this.state.loading}
                pagination={{
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onChange: this.changeSize,
                    hideOnSinglePage:true
                }}
                rowKey={item=>item.startTime}
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
            <ChannelEdit 
            closeModel={this.closeModel.bind(this)} 
            channelItem={this.state.channelItem} 
            channel={this.state.channel}
            type={this.state.type}
            channelGroup={this.state.channelGroup}
            getChannelGroupChannel={this.getChannelGroupChannel.bind(this)}
            updateList={this.updateList.bind(this)}
            />
          </Modal>
      </div>
    )
  }
  componentDidMount(){
    this.fetchArtLists()
    this.getChannelGroupChannel(this.state.currentItem.channelGroupId,1)
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
  delArt(row) {
    Modal.confirm({
      title: '删除此节目吗',
      content: '确认删除？',
      onOk: ()=>{
        this.deleteChannelProgram(row)
      },
      onCancel: ()=>{

      }
    })
  }
  // changeSize = (page, pageSize) => {
  //   // 分页获取
  //   this.setState({
  //     page,
  //     pageSize
  //   })
  //   this.fetchArtLists()
  // }
  fetchArtLists = () => {
    // 请求文章列表接口
    
  }
  getChannelGroupChannel(id,type){//获取频道组
    let param={
      channelGroupId:id
    }
    getChannelGroupChannel(param).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          channelGroup:res.data.data
        })
        if(type == 1){
          this.setState({
            currentChannelItem:res.data.data[0]
          },()=>{
            this.timeChange()
          })
        }
      }
    })
  }
  getListChannelInfo(item,time){
    this.setState({
      loading:true
    })
    let param={
      channelId:item.channelCode,
      // date:util.formatTime(new Date().getTime(),"",8)
      // date:"20210708"
      date:time.replaceAll("-","")
    }
    console.log(param)
    getListChannelInfo(param).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data,
          loading:false
        })
        this.getCheckboxTry(param)
      }else{
        this.setState({
          lists:[],
          loading:false
        })
      }
    })
  }
  getCheckboxTry(param){
    getCheckboxTry(param).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          checkBoxList:res.data.data
        })
        if(Array.isArray(res.data.data.programs) && res.data.data.programs.length>0){
          this.state.lists.forEach(r=>{
            res.data.data.programs.forEach(l=>{ //对比时间和programId
              if(r.programId == l.split("_")[1] && util.formatTime(String(r.startTime).length==10? r.startTime* 1000:r.startTime,"",7).replaceAll(":","") == l.split("_")[0]){
                r.checked = true
              }
            })
          })
          this.setState({
            lists:[...this.state.lists]
          })
        }
      }else{
        this.setState({
          checkBoxList:[]
        })
      }
    })
  }
  addTvTrying(item){ 
    let param={
      channelId:this.state.currentChannelItem.channelCode,
      dateAt:this.state.timeSwiper[this.state.currentIndex].replaceAll("-",""),
    }
    if(item === 1){ //代表全频道

    }else{
      param.programId = item.programId
      param.timeAt = util.formatTime(String(item.startTime).length==10? item.startTime* 1000:item.startTime,"",7).replaceAll(":","")
    }
    console.log(param)
    addTvTrying(param).then(res=>{
      if(res.data.errCode === 0){
        if(item !== 1){
          item.checked = !item.checked
          this.setState({
            lists:this.state.lists
          })
        }else{
          this.state.checkBoxList.isAll = !this.state.checkBoxList.isAll
          this.setState({
            checkBoxList:this.state.checkBoxList
          })
        }
       
      }else{
        message.error(res.data.msg)
      }
    })
  }
  deleteTvTrying(item){
    let param={
      channelId:this.state.currentChannelItem.channelCode,
      dateAt:this.state.timeSwiper[this.state.currentIndex].replaceAll("-",""),
    }
    if(item === 1){ //代表全频道

    }else{
      param.programId = item.programId
      param.timeAt = util.formatTime(String(item.startTime).length==10? item.startTime* 1000:item.startTime,"",7).replaceAll(":","")
    }

    deleteTvTrying(param).then(res=>{
      if(res.data.errCode === 0){
        if(item !== 1){
          item.checked = !item.checked
          this.setState({
            lists:this.state.lists
          })
        }else{
          this.state.checkBoxList.isAll = !this.state.checkBoxList.isAll
          this.setState({
            checkBoxList:this.state.checkBoxList
          })
        }
      }else{
        message.error(res.data.msg)
      }
    })
  }
  //推送到尝鲜版
  syncCacheTvTry(){
    syncCacheTvTry({}).then(res=>{
      if(res.data.errCode === 0){
        message.success("数据同步成功")
      }else{
        message.error("数据同步失败")
      }
    })
  }
  
  updateListChannelInfo(){
    this.setState({
      loading:true
    })
    let param={
      channelId:this.state.currentChannelItem.channelCode,
      // date:util.formatTime(new Date().getTime(),"",8)
      date:(this.state.timeSwiper[this.state.currentIndex]).replaceAll("-","")
    }
    updateListChannelInfo(param).then(res=>{
      if(res.data.errCode === 0){
        message.success(`更新成功`);
        this.getListChannelInfo(this.state.currentChannelItem,this.state.timeSwiper[this.state.currentIndex])
        this.setState({
          loading:false
        })
      }else{
        message.error(`更新失败`);
        this.setState({
          loading:false
        })
      }
    }).catch(err=>{
      message.error(`更新超时`);
      this.setState({
        loading:false
      })
      console.log(err)
    })
  }
  timeChange(val){
    let arr = []
    for(let i =0;i<=6;++i){
      arr.push(util.getEveryTime(val?new Date(val.toDate()).getTime():new Date().getTime(),i))
    }
    this.setState({
      timeSwiper:arr
    })
    this.getListChannelInfo(this.state.currentChannelItem,arr[this.state.currentIndex])
  }
  updateList(){
    this.getListChannelInfo(this.state.currentChannelItem,this.state.timeSwiper[this.state.currentIndex])
  }
  deleteChannelProgram(param){
    let a={
      ...param,
      channelId:this.state.currentChannelItem.channelCode
    }
    deleteChannelProgram(a).then(res=>{
      if(res.data.errCode === 0){
        this.getListChannelInfo(this.state.currentChannelItem,this.state.timeSwiper[this.state.currentIndex])
      }
    })
  }
}
