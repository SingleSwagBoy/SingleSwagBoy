import React, { useState, useEffect } from 'react'
import { getWelcome } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
function App2() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [lists, setLists] = useState([])
    const [layout] = useState({ labelCol: { span: 4 }, wrapperCol: { span: 20 } })
    const [formRef] = Form.useForm()
    const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })
    const [openDailog, setOpen] = useState(false)
    const [columns] = useState([
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (rowValue, row, index) => {
                return (
                    <div>{<Switch
                        checkedChildren="有效"
                        unCheckedChildren="无效"
                        disabled={index < 2}
                        defaultChecked={rowValue === 1 ? true : false}
                        key={rowValue}
                        onChange={(val) => {
                            let info = JSON.parse(JSON.stringify(row))
                            info.status = val ? 1 : 0
                            // this.saveQrcodeConfig(info,"change")

                        }}
                    />}</div>
                )
            }
        },
        {
            title: "操作",
            key: "action",
            fixed: 'right', width: 100,
            render: (rowValue, row, index) => {
                return (
                    <div>
                        {
                            <Button
                                style={{ margin: "0 10px" }}
                                size="small"
                                type="primary"
                                onClick={() => {
                                    console.log(row)
                                    let arr = JSON.parse(JSON.stringify(row))
                                    arr.sourceTag = arr.sourceTag == 1 ? true : false
                                    setOpen(true)
                                    formRef.setFieldsValue(arr)

                                }}
                            >编辑</Button>
                        }
                    </div>
                )
            }
        }
    ])
    useEffect(async () => {
        const getWelcomeList = await getWelcome({})
        setLists(getWelcomeList.data)
    }, [])
    const changeSize = (e) => {
        console.log(e)
    }
    const submitForm = (e) => {//表单提交
        console.log(e)
    }
    // const [values, setFieldValues] = useForm()
    return (
        <div className="loginVip">
            <Card title={
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item>登录(专享)配置</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            }
                extra={
                    <div>
                        <Button type="primary">新建</Button>
                    </div>
                }
            >
                <Table
                    dataSource={lists}
                    // scroll={{ x: 1200, y: '75vh' }}
                    // rowKey={item=>item.indexId}
                    // loading={loading}
                    columns={columns}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: changeSize
                    }}
                />
                <Modal title="编辑" centered visible={openDailog} onCancel={() => { setOpen(false) }} footer={null} width={1000}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            form={formRef}
                            onFinish={(e) => submitForm(e)}>
                            <Form.Item label="名称" name="name">
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                            <Form.Item label="200客服联系人">
                                <div className="add_user"><PlusOutlined />添加成员</div>
                                <div className="user_box">
                                    {
                                        // this.getMyUserList(1).map(r => {
                                        //     return <div className="every_box"><img src={r.avatar} alt="" /> {r.name}</div>
                                        // })
                                    }
                                </div>
                            </Form.Item>

                            <Form.Item label="客服标签" name="sourceTag" valuePropName="checked">
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" ></Switch>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button >取消</Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </Card>

        </div>
    )
}

export default App2