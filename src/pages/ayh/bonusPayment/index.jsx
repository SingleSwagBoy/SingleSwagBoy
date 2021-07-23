import React, { Component } from 'react'
// import request from 'utils/request'
import { getBonusList,updateGold,sendAward } from 'api'
import { Card, Breadcrumb, Button, Table, message,InputNumber, Input} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"

export default class SportsProgram extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 1000,
      total: 0,
      loading:false,
      lists: [],
      currentItem:{rank:null},//编辑行的id
      listData:{},
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "日期",
          dataIndex: "truth_time",
          key: "truth_time",
        },
        {
          title: "1年订单数",
          dataIndex: "one_year_num",
          key: "one_year_num",
        },
        {
          title: "2年订单数",
          dataIndex: "two_year_num",
          key: "two_year_num",
        },
        {
          title: "金牌",
          dataIndex: "gold_num",
          key: "gold_num",
          width:"20%",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <InputNumber defaultValue={row.gold_num} min={0} onChange={(val)=>{
                    this.state.listData.gold_num = val
                    this.setState({
                      listData:this.state.listData
                    })
                  }} />
                  :row.gold_num
                }
              </div>
            )
          }
        },
        {
          title: "转账备注",
          dataIndex: "memo",
          key: "memo",
          width:"20%",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentItem.id == row.id?
                  <Input.TextArea defaultValue={row.memo}  onChange={(val)=>{
                    this.state.listData.memo = val.target.value
                    this.setState({
                      listData:this.state.listData
                    })
                  }} />
                  :row.memo
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
                  this.state.currentItem.id===row.id?
                  <div>
                    <Button 
                     style={{margin:"0 10px"}}
                      type="primary"
                      onClick={()=>{
                        this.updateGold(row)
                      }}
                      >确认</Button>
                    <Button 
                      
                      danger
                      onClick={()=>{
                        this.setState({
                          currentItem:{id:null},
                          listData:{}
                        })
                      }}
                      >取消</Button>
                  </div>:
                    <div>
                      <Button 
                      style={{margin:"0 10px"}}
                      disabled={row.status === 1 ? false : true}
                      type="primary"
                      onClick={()=>{
                        this.state.listData.gold_num = row.gold_num
                        this.setState({
                          currentItem:row,
                        })
                      }}
                      >编辑</Button>
                      <Button 
                        // size="small"
                        disabled={row.status === 1 ? false : true}
                        danger
                        di
                        onClick={this.sendAward.bind(this,row)}
                        >发放奖金</Button>
                    </div>
                }
              </div>
            )
          }
        }
      ],
    }
  }
  
  render() {
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>奥运奖金发放</Breadcrumb.Item>
          </Breadcrumb>
        }
        // extra={
        //   <div>
        //    <Button type="primary"
        //     onClick={()=>{
        //       this.setState({visible:true})
        //     }}
        //     >更新</Button>
        //   </div> 
        // }
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
      </div>
    )
  }
  componentDidMount(){
    this.getBonusList()
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    })
  }
  getBonusList(){
    getBonusList({}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data
        })
      }
    })
  }
  sendAward(item){
    if(item.status === 2)return
    if(!item.memo) return message.error("必须添加转账备注")
    this.setState({
      loading:true
    })
    sendAward({id:item.id}).then(res=>{
      if(res.data.errCode === 0){
        message.success("发放成功")
        let lengthArr = this.state.lists.findIndex(r=>r.a_code === item.a_code)
        if(lengthArr>=0){
          this.state.lists[lengthArr].status = 2
        }
        this.setState({
          lists:this.state.lists
        })
        setTimeout(()=>{
          this.setState({
            loading:false
          })
        },1500)
      }else{
        message.error(res.data.msg)
      }
    })
  }
  updateGold(item){
    let params={
      ...item,
      ...this.state.listData
    }
    updateGold(params).then(res=>{
      if(res.data.errCode === 0){
       message.success("更新成功")
       let lengthArr = this.state.lists.findIndex(r=>r.a_code === item.a_code)
       if(lengthArr>=0){
         this.state.lists[lengthArr].gold_num = this.state.listData.gold_num
         this.state.lists[lengthArr].memo = this.state.listData.memo
       }
       this.setState({
         currentItem:{id:null},
         listData:{},
         lists:this.state.lists
       })
      //  this.getBonusList()
      }else{
        message.error("更新失败")
        this.setState({
          currentItem:{id:null},
          listData:{}
        })
      }
    })
  }
  
}
