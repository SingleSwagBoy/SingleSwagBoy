import React, { Component } from 'react'
// import request from 'utils/request'
import { getList,updateList,syn_slice} from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,InputNumber,Select,Tabs} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    this.state = {
      data: [],
      loading:false,
      dataLoading:false,
      currentItem:{skipList:[{skipType:""},{skipType:""},{skipType:""}]},
      lists: [],
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      activeKey:"1",
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      tabList:[
        {name:"ios",id:1},
        {name:"安卓",id:2},
        {name:"小程序",id:3},
      ],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "成长值",
          dataIndex: "integrateNum",
          key: "integrateNum",
        },
        {
          title: "排序",
          dataIndex: "sort",
          key: "sort",
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
                      visible:true,
                      currentItem:row,
                      activeKey:"1",
                    },()=>{
                      this.formRef.current.setFieldsValue(row)
                    })
                  }}
                  >编辑</Button>
                  <Button 
                  size="small"
                  danger
                  onClick={()=>{
                    // this.setState({visible:true,currentItem:row},()=>{
                    //   this.formRef.current.setFieldsValue(row)
                    // })
                  }}
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
    const { loading } = this.state;
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>等级配置</Breadcrumb.Item>
          </Breadcrumb>
          
        }
        extra={
          <div>
            {/* <Button type="primary"
              onClick={()=>{
                this.setState({visible:true},()=>{
                  this.formRef.current.resetFields()
                })
              }}
            >新增</Button> */}
             <Button type="primary"
              style={{margin:"0 0 0 20px"}}
              loading={this.state.dataLoading}
              onClick={()=>{
                this.setState({
                  dataLoading:true
                })
                this.syn_slice("USER.POINT_CONF")
              }}
            >数据同步</Button>
          </div>
         
        }
        >
          <Table 
              dataSource={this.state.lists}
              // rowKey={item=>item.indexId}
              loading={this.state.loading}
              columns={this.state.columns} />
         
        </Card>
        <Modal
            title="编辑等级配置"
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
                ref = {this.formRef}
              >
                <Form.Item
                  label="等级名称"
                  name="name"
                  rules={[{ required: true, message: '请填写等级名称' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="类型"
                  name="code"
                  rules={[{ required: true, message: '请选择活动类型' }]}
                >
                  <Select >
                  {/* task=任务，pay=支付，tvActive=电视活跃，mobileActive=手机端活跃，miniActive=福利号小程序活跃 */}
                    <Option value={"task"}>任务</Option>
                    <Option value={"pay"}>支付</Option>
                    <Option value={"tvActive"}>电视活跃</Option>
                    <Option value={"mobileActive"}>手机端活跃</Option>
                    <Option value={"miniActive"}>福利号小程序活跃</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="成长值"
                  name="integrateNum"
                  rules={[{ required: true, message: '请填写成长值' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  label="任务介绍"
                  name="introduce"
                  rules={[{ required: true, message: '请填写任务介绍' }]}
                >
                  <TextArea /> 
                </Form.Item>
                <Form.Item
                  label="排序"
                  name="sort"
                  // rules={[{ required: true, message: '请填写' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  label="三端配置"
                  name="skipList"
                  // rules={[{ required: true, message: '请填写等级名称' }]}
                >
                 <Tabs tabPosition={"left"} defaultActiveKey={this.state.activeKey}  activeKey={this.state.activeKey} 
                  onTabClick={(val)=>{
                    this.setState({
                      activeKey:val
                    })
                  }}
                 >
                   {
                     this.state.tabList.map((r,i)=>{
                       return(
                        <TabPane tab={r.name} key={r.id} >
                          <Select
                            style={{margin:"20px 0"}}
                            defaultValue={this.state.currentItem.skipList[i].skipType}
                            key={this.state.currentItem.indexId}
                            onChange={(val)=>{
                              this.state.currentItem.skipList[i].skipType = val
                              this.setState({
                                currentItem:this.state.currentItem
                              })
                            }}
                            >
                         
                            <Option value={1} key={1}>h5</Option>
                            <Option value={2} key={2}>小程序</Option>
                            <Option value={3} key={3}>赚赚页</Option>
                            <Option value={4} key={4}>套餐页</Option>
                          </Select>
                          <Input defaultValue={this.state.currentItem.skipList[i].skipUrl} placeholder={"请输入地址"} onChange={(val)=>{
                             this.state.currentItem.skipList[i].skipUrl = val.target.value
                             this.setState({
                              currentItem:this.state.currentItem
                            })
                          }} />
                        </TabPane>
                       )
                     })
                   }
                </Tabs>
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
    this.getList() // 查询列表数据
  }
  closeModel(){
    // this.formRef.current.resetFields()
    this.setState({
      visible:false
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.updateList(params)
    this.closeModel()
  }
  getList(){
    getList({key:"USER.POINT_CONF"}).then(res=>{
      if(res.data.errCode == 0){
       this.setState({
         lists:res.data.data
       })
      }
    })
  }
  updateList(params){
    let a={
      ...this.state.currentItem,
      ...params
    }
    updateList({key:"USER.POINT_CONF",id:this.state.currentItem.indexId},a).then(res=>{
      if(res.data.errCode == 0){
        message.success("更新成功")
        this.getList()
      }else{
        message.error("更新失败")
      }
    })
  }
  syn_slice(key){
    syn_slice({key:key}).then(res=>{
      if(res.data.errCode === 0){
        message.success("同步成功")
      }else{
        message.error("同步失败")
      }
      setTimeout(()=>{
        this.setState({
          dataLoading:false
        })
      },1000)
     
    })
  }
}
