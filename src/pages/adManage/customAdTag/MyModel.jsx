import React, { Component } from 'react'
// import request from 'utils/request'
import { addDIYTag,updateDIYTag } from 'api'
import { Button, message, Modal, Form, Input, Select, Divider, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import util from 'utils'
import moment from 'moment';
import "./style.css"
const { Option } = Select;
export default class AddressNews extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      operatorList: [],//运算符列表
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      tailLayout: {
        wrapperCol: { offset: 22, span: 2 },
      },

    }
  }
  render() {
    return (
      <div>
        {/* 客服消息框 */}
        <Modal
          title={`自定义规则标签${this.state.sourceType==="add"?"（新增）":"（编辑）"}`}
          centered
          visible={this.props.visible}
          onCancel={() => { this.closeModel() }}
          footer={null}
          // forceRender={true}
          width={1200}
        >
          <Form
            {...this.state.layout}
            name="voting"
            ref={this.formRef}
            onFinish={this.submitForm.bind(this)}
          >
            <Divider plain orientation="center">自定义规则标签制作过程：1、选择数据源(可多选)；2、选择标签及规则</Divider>
            <Form.Item
              label="选择数据源"
              name="index"
              rules={[{ required: true, message: '请选择数据源' }]}
            // style={{ display: 'inline-block', margin: '0 8px 0 0' }}
            >
              <Select
                placeholder="请选择数据源"
                allowClear
                showArrow={true}
                mode="multiple"
              >
                {
                  this.props.dictionaryList.map(r => {
                    return (
                      <Option value={r.key} key={r.id}>{r.value}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="标签Code"
              name="code"
              rules={[{ required: true, message: '请输入标签Code' }]}
              getValueFromEvent={util.getValueFromEvent}
            // style={{ display: 'inline-block', margin: '0 8px 0 0' }}
            >
              <Input placeholder="请输入标签Code" />
            </Form.Item>
            <Form.Item
              label="标签名字"
              name="name"
              rules={[{ required: true, message: '请输入标签名字' }]}
              getValueFromEvent={util.getValueFromEvent}
            // style={{ display: 'inline-block', margin: '0 8px 0 0' }}
            >
              <Input placeholder="请输入标签名字" />
            </Form.Item>
            <Form.Item
              label="标签描述"
              name="description"
              getValueFromEvent={util.getValueFromEvent}
            >
              <Input.TextArea placeholder="请输入标签描述" />
            </Form.Item>
            <Form.Item
              label="标签类型"
              name="tagType"
              rules={[{ required: true, message: '请选择标签类型' }]}
            // style={{ display: 'inline-block', margin: '0 8px 0 0' }}
            >
              <Select placeholder="请选择标签类型" allowClear disabled={this.state.sourceType == "add"?false:true}>
                <Option value={1} key={1}>设备标签</Option>
                <Option value={2} key={2}>用户标签</Option>
              </Select>
            </Form.Item>
            {
              <Form.Item
                label="标签规则"
              >
                <Form.List name="rule">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                          <Form.Item
                            {...field}
                            label="field"
                            name={[field.name, 'field']}
                            fieldKey={[field.fieldKey, 'field']}
                            style={{ width: "250px" }}
                            rules={[{ required: true, message: 'field' }]}
                          >
                            <Select placeholder="请选择Field" allowClear dropdownMatchSelectWidth={false} optionLabelProp={"value"}
                            >
                              {
                                this.props.fieldList.map(r => {
                                  return (
                                    <Option value={r.field} key={r.id}>{r.field}----{r.fieldName}/{r.fieldType}</Option>
                                  )
                                })
                              }
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="运算符"
                            name={[field.name, 'oper']}
                            fieldKey={[field.fieldKey, 'oper']}
                            style={{ width: "100%" }}
                            rules={[{ required: true, message: '运算符' }]}
                          >
                            <Select placeholder="请选择标签类型"
                            style={{width:"150px"}}
                             allowClear onDropdownVisibleChange={() => {
                              if (!this.formRef.current.getFieldValue("rule")[index]) return
                              let arr = this.props.fieldList.filter(item => item.field == this.formRef.current.getFieldValue("rule")[index].field)
                              let operatorObj = Object.assign([], util.operator())
                              if (arr.length > 0) {
                                if (arr[0].fieldType === "number" || arr[0].fieldType === "array-num") {
                                  operatorObj.splice(6, 1)
                                } else if (arr[0].fieldType === "string" || arr[0].fieldType === "array-str") {
                                  operatorObj.splice(2, 4)
                                } else if (arr[0].fieldType === "region") {
                                  operatorObj.splice(0, 6)
                                }
                                this.setState({
                                  operatorList: operatorObj
                                })
                              }
                            }}>
                              {
                                this.state.operatorList.map((r, i) => {
                                  return <Option value={r.value} key={i}>{r.name}</Option>
                                })
                              }
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="取值"
                            name={[field.name, 'value']}
                            fieldKey={[field.fieldKey, 'value']}
                            style={{ width: "200px" }}
                            rules={[{ required: true, message: '取值' }]}
                            getValueFromEvent={util.getValueFromEvent}
                          >
                            <Input />
                          </Form.Item>

                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          点击增加规则
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            }
            <Form.Item {...this.state.tailLayout}>
              <Button htmlType="submit" type="primary" >
                提交
              </Button>
            </Form.Item>
          </Form>


        </Modal>

      </div>

    )
  }
  componentDidMount() {
  }

  closeModel(type) { // 1是关闭素材框 2是关闭外部框
    this.props.closeModel()
  }
  submitForm(val) {
    console.log(val)
    if (this.state.sourceType == "add") {
      this.addDIYTag(val)
    } else {
      this.updateDIYTag(val)
    }


  }
  getFormData(data) { //获取父亲里面的这一行的数据
    console.log(data, "获取父亲里面的这一行的数据")
    this.formRef.current.resetFields()
    if (data) {
      let formData = data
      formData.index = Array.isArray(formData.index) ? formData.index : JSON.parse(formData.index)
      formData.rule = Array.isArray(formData.rule) ? formData.rule : JSON.parse(formData.rule)
      this.formRef.current.setFieldsValue(formData)
      this.setState({
        sourceType: "edit",
        operatorList: util.operator(),
      })
    } else {
      this.formRef.current.setFieldsValue({ "msgType": "news" })
      this.setState({
        sourceType: "add",
        operatorList: []
      })
    }
  }


  sendModal(type) {
    Modal.confirm({
      title: '确认发送吗',
      content: '确认发送？',
      onOk: () => {
        this.sendMsg(type)
      },
      onCancel: () => {

      }
    })
  }
  addDIYTag(item,source) {
    let params = {}
    if(source == "copy"){
      params.code = util.randomWord(false, 10)
      params.name = item.name + "-copy"
      params.index = item.index
      params.rule = item.rule
      params.description = item.description
      params.tagType = item.tagType
    }else{
      params = {
        ...item,
        index: source === "copy"?item.index:JSON.stringify(item.index),
        rule: source === "copy"?item.rule:JSON.stringify(item.rule),
      }
    }
    addDIYTag(params).then(res => {
      if (res.data.errCode === 0) {
        message.success("新增成功")
        this.props.getAdTagList()
      } else {
        message.error("新增失败")
      }
      this.props.closeModel()
    })
  }
  updateDIYTag(item,source){
    let params = {
      ...item,
      ...(source=="status"?{}:this.formRef.current.getFieldValue()),
      index: Array.isArray(item.index)?JSON.stringify(item.index):item.index,
      rule: Array.isArray(item.rule)?JSON.stringify(item.rule):item.rule,
    }
    updateDIYTag(params).then(res => {
      if (res.data.errCode === 0) {
        if(source!="status"){
          message.success("更新成功")
        }
        this.props.getAdTagList()
      } else {
        message.error("更新失败")
      }
      this.props.closeModel()
    })
  }
}
