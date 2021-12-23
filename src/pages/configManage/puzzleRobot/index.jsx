import React, { Component } from 'react'
import { getConfig, setConfig, delMpConfig } from 'api'
import { Card, Breadcrumb, Button, message, Table, Modal, Form, Input, Image, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MyImageUpload } from '@/components/views.js';
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
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            key: "point.robot",
            columns: [
                {
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "头像",
                    dataIndex: "headImage",
                    key: "headImage",
                    render: (rowValue, row, index) => {
                        return <Image src={rowValue} style={{ width: "100px", height: "100px" }}></Image>
                    }
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
                                    onClick={() => { this.delArt(index) }}
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
                                }, () => {
                                    this.formRef.current.resetFields()
                                })
                            }}>新建</Button>
                        </div>
                    }
                >
                    <Table
                        dataSource={this.state.lists}
                        // rowKey={i}
                        loading={this.state.loading}
                        columns={this.state.columns} />

                </Card>
                <Modal
                    title="录入小程序"
                    centered
                    visible={this.state.isOpen}
                    onCancel={() => { this.setState({ isOpen: false }) }}
                    footer={null}
                    width={800}
                >
                    {
                        <Form
                            {...this.state.layout}
                            name="mini"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}
                        >
                            <Form.Item
                                label="投票选项"
                            // name="voters"
                            // rules={[{ required: true, message: '投票选项' }]}
                            >
                                <Form.List name="robotList">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline">
                                                    <Form.Item
                                                        {...field}
                                                        label="昵称"
                                                        name={[field.name, 'name']}
                                                        fieldKey={[field.fieldKey, 'name']}
                                                        rules={[{ required: true, message: '昵称' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="头像"
                                                        name={[field.name, 'headImage']}
                                                        fieldKey={[field.fieldKey, 'headImage']}
                                                        // valuePropName="fileList" 
                                                        // 如果没有下面这一句会报错
                                                        // getValueFromEvent={normFile}
                                                        rules={[{ required: true, message: '头像' }]}
                                                    >
                                                        <div className="image_vote" style={{ display: "flex", "alignItems": "flex-start" }}>
                                                            <MyImageUpload
                                                                getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('headImage', file, newItem, index) }}
                                                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("robotList")[index] && this.formRef.current.getFieldValue("robotList")[index].headImage} />
                                                        </div>

                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                </Space>
                                            ))}

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    新建机器人
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Form.Item>

                            <Form.Item {...this.state.tailLayout}>
                                <Button style={{ margin: "0 20px" }} onClick={() => this.setState({ isOpen: false })}>
                                    取消
                                </Button>
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
        this.getConfig()
    }
    submitForm(val) {
        // return 
        console.log(val)
        this.setConfig(val)
        this.setState({
            isOpen: false
        })
    }
    getConfig() {
        getConfig({ key: this.state.key }).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    lists: res.data.data.robotList
                })
            }
        })
    }
    setConfig(val, type) {
        let params = {}
        if (type == "del") {
            params = { robotList: [...val] }
        } else {
            params = { robotList: [...this.state.lists, ...val.robotList] }
        }
        setConfig({ key: this.state.key },params).then(res => {
            if (res.data.errCode === 0) {
                message.success(type == "del"?"删除成功":"新增成功")
                this.getConfig()
            } else {
                message.error(type == "del"?"删除失败":"新增失败")
            }
        })
    }
    delArt(index) {
        Modal.confirm({
            title: '删除此条数据',
            content: '确认删除？',
            onOk: () => {
                this.delRobot(index)
            },
            onCancel: () => {

            }
        })
    }
    delRobot(index) {
        let arr = JSON.parse(JSON.stringify(this.state.lists))
        arr.splice(index, 1)
        this.setConfig(arr, "del")
    }
    //获取上传文件
    getUploadFileUrl(type, file, newItem, index) {
        console.log(type, file, newItem, "type, file, newItem")
        let that = this;
        let image_url = file;
        this.formRef.current.getFieldValue("robotList")[index].headImage = image_url;
        // that.formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
}
