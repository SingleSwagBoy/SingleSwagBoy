import React, { Component } from 'react'
import { getMiniProList,addMpConfig,delMpConfig } from 'api'
import { Card, Breadcrumb, Button, message, Table,Modal,Form,Input } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import "./style.css"
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            loading: false,
            isOpen: false,
            layout: {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            },
            tailLayout: {
                wrapperCol: { offset: 8, span: 16 },
            },
            columns: [
                {
                    title: "小程序名称",
                    dataIndex: "appName",
                    key: "appName",
                },
                {
                    title: "APPID",
                    dataIndex: "appid",
                    key: "appid",
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.delArt(row) }}
                                >删除</Button>
                            </div>
                        )
                    }
                }

            ],
        }
    }
    render() {
        const { addressist } = this.state;
        return (
            <div className="address_page">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>小程序配置</Breadcrumb.Item>
                    </Breadcrumb>

                }
                    extra={
                        <div>
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    isOpen: true
                                })
                            }}>新建</Button>
                        </div>
                    }
                >
                    <Table
                        dataSource={this.state.lists}
                        rowKey={item => item.id}
                        loading={this.state.loading}
                        columns={this.state.columns} />

                </Card>
                <Modal
                    title="录入小程序"
                    centered
                    visible={this.state.isOpen}
                    onCancel={() => { this.setState({ isOpen: false }) }}
                    footer={null}
                >
                    {
                        <Form
                            {...this.state.layout}
                            name="mini"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}
                        >
                            <Form.Item
                                label="小程序名称"
                                name="appName"
                                rules={[{ required: true, message: '请填写小程序名称' }]}
                            >
                                <Input placeholder="请填写小程序名称" />
                            </Form.Item>
                            <Form.Item
                                label="小程序APPID"
                                name="appid"
                                rules={[{ required: true, message: '请填写小程序APPID' }]}
                            >
                                <Input placeholder="请填写小程序APPID" />
                            </Form.Item>

                            <Form.Item {...this.state.tailLayout}>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </div>
        )
    }
    componentDidMount() {
        this.getMiniProList()
    }
    submitForm(val){
        this.addMpConfig(val)
        this.setState({
            isOpen:false
        })
    }
    getMiniProList() {
        getMiniProList({}).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    lists: res.data.data
                })
            }
        })
    }
    addMpConfig(val){
        addMpConfig({...val}).then(res=>{
            if(res.data.errCode === 0){
                message.success("新增成功")
                this.getMiniProList()
            }else{
                message.error("新增失败")
            }
        })
    }
    delArt(item) {
        Modal.confirm({
          title: '删除此小程序',
          content: '确认删除？',
          onOk: () => {
            this.delMpConfig(item)
          },
          onCancel: () => {
    
          }
        })
      }
    delMpConfig(item){
        delMpConfig({id:item.id}).then(res=>{
            if(res.data.errCode === 0){
                message.success("删除成功")
                this.getMiniProList()
            }else{
                message.error("新增失败")
            }
        })
    }
}
