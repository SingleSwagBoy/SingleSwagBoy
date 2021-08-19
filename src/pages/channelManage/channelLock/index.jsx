import React, { Component } from 'react'
// import request from 'utils/request'
import { getLockConfig,getLockList,unlockChannel} from 'api'
import { Card, Breadcrumb, Button, message, Form,InputNumber,Select,Tabs} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { Option } = Select;
export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    this.state = {
      dataSource: [],
      loading:false,
      config:"",
      channelList:[],
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
            <Breadcrumb.Item>专享台解锁</Breadcrumb.Item>
          </Breadcrumb>
          
        }
        // extra={
        //   <div>
        //      <Button type="primary"
        //       style={{margin:"0 0 0 20px"}}
        //       loading={this.state.loading}
        //       onClick={()=>{
        //         this.setState({
        //           loading:true
        //         })
        //         this.syn_config("USER.DOWN_POINT_CONF")
        //       }}
        //     >数据同步</Button>
        //   </div>
         
        // }
        >
         <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this)}
                ref = {this.formRef}
                // initialValues={this.state.config}
              >
                <Form.Item
                  label="试看频道组"
                  name="channel_group_ids"
                  rules={[{ required: true, message: '请选择试看频道组' }]}
                >
                  <Select
                        placeholder="请选择试看频道组"
                        mode="multiple"
                        allowClear
                        optionFilterProp="name"
                      >
                        {
                          this.state.channelList.map(r=>{
                            return(
                              <Option value={r.id} key={r.id} name={r.name}>{r.name +"----"+ r.code}</Option>
                            )
                          })
                        }
                      </Select>
                </Form.Item>
                <Form.Item
                  label="试看时间（S）"
                  name="free_time"
                  rules={[{ required: true, message: '请填写试看时间' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                
                <Form.Item {...this.state.tailLayout}>
                  <Button htmlType="submit" type="primary">
                    保存
                  </Button>
                </Form.Item>
              </Form>
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.getLockList()
    this.getLockConfig() // 查询
  }
  closeModel(type){
    this.setState({
      visible:false
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.unlockChannel(params)
  }
  getLockConfig(){
    getLockConfig({}).then(res=>{
      if(res.data.errCode == 0){
        let arr = []
        res.data.data.channel_group.forEach(r=>{
          arr.push(r.id)
        })
        this.formRef.current.setFieldsValue({"channel_group_ids":arr,"free_time":res.data.data.free_time})
      }
    })
  }
  getLockList(){
    let params={
      page: {currentPage: 1, pageSize: 1000}
    }
    getLockList(params).then(res=>{
      if(res.data.errCode == 0){
       this.setState({
         channelList:res.data.data
       })
      }
    })
  }
  unlockChannel(params){
    unlockChannel(params).then(res=>{
      if(res.data.errCode == 0){
        message.success("更新成功")
      }else{
        message.error("更新失败")
      }
    })
  }
}
