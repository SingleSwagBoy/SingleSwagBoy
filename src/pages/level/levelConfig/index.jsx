import React, { Component } from 'react'
// import request from 'utils/request'
import { getList, updateList, syn_slice } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message, Input, Form, InputNumber,Image } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import { MyImageUpload } from '@/components/views.js';
import util from 'utils'
import "./style.css"
export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      dataLoading: false,
      currentItem: {},
      lists: [],
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "等级名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "等级成长值",
          dataIndex: "integrateStart",
          key: "integrateStart",
          render: (rowValue, row, index) => {
            return (
              <div>
                {row.integrateStart} - {row.integrateEnd}
              </div>
            )
          }
        },
        {
          title: "等级",
          dataIndex: "level",
          key: "level",
        },
        // {
        //   title: '等级图标', dataIndex: 'ico', key: 'ico', width: 120,
        //   render: (rowValue, row, index) => { return <Image width={60} height={60} src={rowValue} /> }
        // },
        {
          title: "操作",
          key: "action",
          render: (rowValue, row, index) => {
            return (
              <div>
                <Button
                  size="small"
                  danger
                  onClick={() => {
                    this.setState({ visible: true, currentItem: row }, () => {
                      this.formRef.current.setFieldsValue(row)
                      this.forceUpdate()
                    })
                  }}
                >编辑</Button>
              </div>
            )
          }
        }
      ],
      visible: false,
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
                style={{ margin: "0 0 0 20px" }}
                loading={this.state.dataLoading}
                onClick={() => {
                  this.setState({
                    dataLoading: true
                  })
                  this.syn_slice("USER.LEVEL")
                }}
              >数据同步</Button>
            </div>

          }
        >
          <Table
            dataSource={this.state.lists}
            rowKey={item => item.indexId}
            loading={this.state.loading}
            columns={this.state.columns} />

        </Card>
        <Modal
          title="编辑等级配置"
          centered
          visible={this.state.visible}
          onCancel={() => { this.closeModel(1) }}
          footer={null}
        >
          {
            <Form
              {...this.state.layout}
              name="basic"
              onFinish={this.submitForm.bind(this)}
              ref={this.formRef}
            >
              <Form.Item
                label="等级名称"
                name="name"
                rules={[{ required: true, message: '请填写等级名称' }]}
              >
                {/* <Input.TextArea /> */}
                <Input placeholder="请填写等级名称" />
              </Form.Item>
              <Form.Item
                label="等级成长值"
                rules={[{ required: true, message: '请填写等级名称' }]}
              >
                <Form.Item
                  label="最低"
                  name="integrateStart"
                  rules={[{ required: true, message: '请填写最高成长值' }]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  label="最高"
                  name="integrateEnd"
                  rules={[{ required: true, message: '请填写最低成长值' }]}
                >
                  <InputNumber />
                </Form.Item>
              </Form.Item>
              {/* <Form.Item label="等级图标" name="ico" rules={[{ required: true, message: '请上传等级图标' }]}>
                <MyImageUpload
                  getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('ico', file, newItem) }}
                  imageUrl={this.formRef.current && this.formRef.current.getFieldValue("ico")} />
              </Form.Item> */}
              <Form.Item {...this.state.tailLayout}>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          }
        </Modal>
      </div>
    )
  }
  componentDidMount() {
    this.getList() // 查询列表数据
  }
  closeModel(type) {
    this.formRef.current.resetFields()
    this.setState({
      visible: false
    })
    
  }
  // 新增
  submitForm(params) {
    console.log(params)
    this.updateList(params)
    this.closeModel()
  }
  getList() {
    getList({ key: "USER.LEVEL" }).then(res => {
      if (res.data.errCode == 0) {
        this.setState({
          lists: res.data.data
        })
      }
    })
  }
  updateList(params) {
    let a = {
      ...this.state.currentItem,
      ...params
    }
    updateList({ key: "USER.LEVEL", id: this.state.currentItem.indexId }, a).then(res => {
      if (res.data.errCode == 0) {
        message.success("更新成功")
        this.getList()
      } else {
        message.error("更新失败")
      }
    })
  }
  syn_slice(key) {
    syn_slice({ key: key }).then(res => {
      if (res.data.errCode === 0) {
        message.success("同步成功")
      } else {
        message.error("同步失败")
      }
      setTimeout(() => {
        this.setState({
          dataLoading: false
        })
      }, 1000)

    })
  }
  //获取上传文件
  getUploadFileUrl(type, file) {
    let that = this;
    that.formRef.current.setFieldsValue({ "ico": file });
    that.forceUpdate();
  }
}
