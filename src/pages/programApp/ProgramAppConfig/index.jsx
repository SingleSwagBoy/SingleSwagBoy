import React, { Component } from 'react'
import { updateProgramAppConfig, getProgramAppConfig } from 'api'
import { Card, Breadcrumb, Button, message, Table, Modal, Form, Input, Select, Switch,InputNumber } from 'antd'
import { MySyncBtn } from '@/components/views.js';
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import { MyArea } from '@/components/views.js';
import util from 'utils'
const { Option } = Select;
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            loading: false,
            isOpen: false,
            source: "",
            currentItem: "",
            searchWord: "",
            currentIndex: 0,
            layout: {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            },
            tailLayout: {
                wrapperCol: { offset: 8, span: 16 },
            },
            columns: [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{index + 1}</div>
                        )
                    }
                },
                {
                    title: "版本code",
                    dataIndex: "appVerCode",
                    key: "appVerCode",
                },
                {
                    title: "渠道",
                    dataIndex: "mChannel",
                    key: "mChannel",
                },
                {
                    title: "低于版本code是否发送下载信息",
                    dataIndex: "isFilter",
                    key: "isFilter",
                    render: (rowValue, row, index) => {
                        return (
                            <Switch checkedChildren="发送" unCheckedChildren="不发送"
                                // checked={rowValue === 1?true:false}
                                key={new Date().getTime()}
                                defaultChecked={rowValue === 1 ? true : false}
                                onChange={(val) => {
                                    row.isFilter = val ? 1 : 2
                                    this.updateProgramAppConfig(row)
                                }}
                            />
                        )
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
                                    type="primary"
                                    onClick={() => {
                                        this.setState({
                                            source: "edit",
                                            isOpen: true,
                                            currentItem: row,
                                            currentIndex: index
                                        }, () => {
                                            this.formRef.current.setFieldsValue({
                                                ...row,
                                                isFilter: row.isFilter == 1 ? true : false
                                            })
                                        })
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.delArt(row, index) }}
                                    style={{ margin: "0 10px" }}
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
            <div className="list_page">
                <Card title={
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>电视节目单配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </>
                }
                    extra={
                        <div>
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    isOpen: true,
                                    source: "add",
                                    currentItem: ""
                                })
                            }}>新建</Button>
                            <MySyncBtn type={9} name={'同步缓存'} />
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
                    title="电视节目单配置"
                    centered
                    visible={this.state.isOpen}
                    onCancel={() => {
                        this.setState({ isOpen: false })
                        this.formRef.current.resetFields()
                    }}
                    width={1200}
                    footer={null}
                    forceRender={true}
                >
                    {
                        <Form
                            {...this.state.layout}
                            name=""
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}
                        >
                            {
                                this.formRef && this.formRef.current &&
                                <>
                                    <Form.Item
                                        label="版本code"
                                        name="appVerCode"
                                        rules={[{ required: true, message: '请填写版本code' }]}
                                    >
                                        <InputNumber type="" placeholder="请填写版本code" min={0} />
                                    </Form.Item>
                                    <Form.Item
                                        label="渠道"
                                        name="mChannel"
                                        rules={[{ required: true, message: '请填写渠道' }]}
                                    >
                                        <Input placeholder="请填写渠道" />
                                    </Form.Item>
                                    <Form.Item
                                        label="地域版本code是否发送下载信息"
                                        name="isFilter"
                                        rules={[{ required: true, message: '请填写地域版本code是否发送下载信息' }]}
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="发送" unCheckedChildren="不发送" ></Switch>
                                    </Form.Item>
                                    <Form.Item
                                        label="app"
                                        name="app"
                                        rules={[{ required: true, message: '请填写app' }]}
                                    >
                                        <Input placeholder="请填写app" />
                                    </Form.Item>
                                    <Form.Item
                                        label="图标"
                                        name="icon"
                                        rules={[{ required: true, message: '请填写图标' }]}
                                    >
                                        <Input placeholder="请填写图标" />
                                    </Form.Item>
                                    <Form.Item
                                        label="安装时间间隔"
                                        name="interval"
                                        // rules={[{ required: true, message: '请填写安装时间间隔' }]}
                                    >
                                        <InputNumber placeholder="请填写安装时间间隔" min={0} />
                                    </Form.Item>
                                    <Form.Item
                                        label="名称"
                                        name="name"
                                        rules={[{ required: true, message: '请填写名称' }]}
                                    >
                                        <Input placeholder="请填写名称" />
                                    </Form.Item>
                                    <Form.Item
                                        label="推荐下载地址"
                                        name="url"
                                        rules={[{ required: true, message: '请填写推荐下载地址' }]}
                                    >
                                        <Input placeholder="请填写推荐下载地址" />
                                    </Form.Item>
                                    <Form.Item
                                        label="风险设备"
                                        name="badMan"
                                        // rules={[{ required: true, message: '请填写风险设备' }]}
                                    >
                                        <Input placeholder="请填写风险设备" />
                                    </Form.Item>
                                    <Form.Item
                                        label="风险路由"
                                        name="badRouter"
                                        // rules={[{ required: true, message: '请填写风险路由' }]}
                                    >
                                        <Input placeholder="请填写风险路由" />
                                    </Form.Item>
                                    <Form.Item
                                        label="非风险地区二维码"
                                        name="inviteImg"
                                        // rules={[{ required: true, message: '请填写非风险地区二维码' }]}
                                    >
                                        <Input placeholder="请填写非风险地区二维码" />
                                    </Form.Item>
                                    <Form.Item
                                        label="风险地区二维码"
                                        name="inviteImg2"
                                        // rules={[{ required: true, message: '请填写风险地区二维码' }]}
                                    >
                                        <Input placeholder="请填写风险地区二维码" />
                                    </Form.Item>
                                    <Form.Item
                                        label="地域"
                                        name="cityCode"
                                        // rules={[{ required: true, message: '请填写风险地域' }]}
                                    >
                                        <MyArea formRef={this.formRef} />
                                    </Form.Item>
                                    <Form.Item {...this.state.tailLayout}>
                                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                            提交
                                        </Button>
                                    </Form.Item>
                                </>

                            }



                        </Form>
                    }
                </Modal>
            </div>
        )
    }
    componentDidMount() {
        this.getProgramAppConfig()
    }
    submitForm(val) {
        console.log(this.formRef.current.getFieldsValue())
        this.setState({
            isOpen: false
        })
        this.updateProgramAppConfig(val)

    }
    getProgramAppConfig() {
        getProgramAppConfig().then(res => {
            this.setState({
                lists: res.data.audits
            })
        })
    }
    updateProgramAppConfig(val, index) {
        val.cityCode = Array.isArray(val.cityCode) ? val.cityCode.join(",") : val.cityCode
        val.isFilter = util.isNumber(val.isFilter)?val.isFilter:val.isFilter?1:2
        let list = this.state.lists
        if (index) {
            list.splice(index, 1)
        } else {
            if(this.state.source === "add"){
                list.push(val)
            }else{
                list[this.state.currentIndex] = val
            }
        }
        let params = {
            audits: [...list]
        }
        // return console.log(params,"currentItem")
        updateProgramAppConfig(params).then(res => {
            message.success("更新成功")
            this.getProgramAppConfig()
        }).catch(res => {
            message.error("更新失败")
        })
    }
    delArt(item, index) {
        Modal.confirm({
            title: '删除此配置吗',
            content: '确认删除？',
            onOk: () => {
                this.updateProgramAppConfig(item, index)
            },
            onCancel: () => {

            }
        })
    }
}
