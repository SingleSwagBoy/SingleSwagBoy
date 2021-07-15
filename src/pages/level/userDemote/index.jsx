import React, { Component } from 'react'
// import request from 'utils/request'
import { getConfig,setConfig,syn_config} from 'api'
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
      config:"",
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>用户降级</Breadcrumb.Item>
          </Breadcrumb>
          
        }
        extra={
          <div>
             <Button type="primary"
              style={{margin:"0 0 0 20px"}}
              loading={this.state.loading}
              onClick={()=>{
                this.setState({
                  loading:true
                })
                this.syn_config("USER.DOWN_POINT_CONF")
              }}
            >数据同步</Button>
          </div>
         
        }
        >
         <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this)}
                ref = {this.formRef}
                // initialValues={this.state.config}
              >
                <Form.Item
                  label="名称"
                  name="name"
                >
                  <div>用户降级</div>
                </Form.Item>
                <Form.Item
                  label="递减周期"
                  name="cycle"
                  rules={[{ required: true, message: '请填写成长值' }]}
                >
                  <InputNumber min={0}
                   formatter={value => `${value} 天`}
                   style={{margin:"0 20px 0 0"}} />
                  
                </Form.Item>
                <Form.Item
                  label="减成长值"
                  name="integrateNum"
                  rules={[{ required: true, message: '请填写任务介绍' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  label="计算方式"
                  name="type"
                  // rules={[{ required: true, message: '请填写' }]}
                >
                  <div>递减</div>
                </Form.Item>
                
                <Form.Item {...this.state.tailLayout}>
                  <Button htmlType="submit" type="primary">
                    确定
                  </Button>
                </Form.Item>
              </Form>
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.getConfig() // 查询列表数据
  }
  closeModel(type){
    this.setState({
      visible:false
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.setConfig(params)
  }
  getConfig(){
    getConfig({key:"USER.DOWN_POINT_CONF"}).then(res=>{
      if(res.data.errCode == 0){
       this.setState({
         config:res.data.data
       })
       this.formRef.current.setFieldsValue(res.data.data)
      }
    })
  }
  setConfig(params){
    let a={
      ...this.state.config,
      ...params
    }
    setConfig({key:"USER.DOWN_POINT_CONF"},a).then(res=>{
      if(res.data.errCode == 0){
        message.success("更新成功")
        this.getConfig()
      }else{
        message.error("更新失败")
      }
    })
  }
  syn_config(key){
    syn_config({key:key}).then(res=>{
      if(res.data.errCode === 0){
        message.success("同步成功")
      }else{
        message.error("同步失败")
      }
      setTimeout(()=>{
        this.setState({
          loading:false
        })
      },1000)
     
    })
  }
}
