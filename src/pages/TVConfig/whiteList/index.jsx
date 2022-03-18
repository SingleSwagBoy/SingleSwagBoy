import React, { Component } from 'react'
import { addWhite, listWhite, updateWhite, deleteWhite } from 'api'
import { Card, Breadcrumb, Button, message, Table, Modal, Form, Input, Select, Switch } from 'antd'
import { MySyncBtn } from '@/components/views.js';
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import { MyArea } from '@/components/views.js';
import util from 'utils'
import "./style.css"
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
            layout: {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            },
            tailLayout: {
                wrapperCol: { offset: 8, span: 16 },
            },
            columns: [
                {
                    title: "类型",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == 1 ? "ip" : "其他"}</div>
                        )
                    }
                },
                {
                    title: "配置",
                    dataIndex: "content",
                    key: "content",
                },
                {
                    title: "备注",
                    dataIndex: "memo",
                    key: "memo",
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <Switch checkedChildren="有效" unCheckedChildren="无效"
                                // checked={rowValue === 1?true:false}
                                key={new Date().getTime()}
                                defaultChecked={rowValue === 1 ? true : false}
                                onChange={(val) => {
                                    row.status = val ? 1 : 0
                                    this.updateWhite(row)
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
                                            currentItem: row
                                        }, () => {
                                            this.formRef.current.setFieldsValue({
                                                ...row,
                                                status: row.status == 1 ? true : false
                                            })
                                        })
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.delArt(row) }}
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
                            <Breadcrumb.Item>白名单配置（广告）</Breadcrumb.Item>
                        </Breadcrumb>
                        {/* <div style={{ display: "flex" }}>
                            <div className="everyBody">
                                <div>配置:</div>
                                <Input.Search
                                    allowClear
                                    placeholder="请输入搜索的配置"
                                    onSearch={(val) => {
                                        // this.state.search.word = val
                                        this.setState({
                                            page: 1,
                                            searchWord: val
                                        }, () => {
                                            this.listWhite()
                                        })

                                    }}
                                />
                            </div> */}
                            {/* <div className="everyBody" style={{ marginLeft: "20px" }}>
                                <div>类型:</div>
                                <Select allowClear placeholder="请选择类型"
                                    onChange={(val) => {
                                    // this.state.searchWord.type = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        // this.getVotingList()
                                    })
                                    }}
                                >
                                    <Option value={10} key={10}>UserId</Option>
                                    <Option value={20} key={20}>设备ID</Option>
                                    <Option value={30} key={30}>IP</Option>
                                </Select>
                            </div> */}
                        {/* </div> */}

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
                            <MySyncBtn type={8} name={'同步缓存'} />
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
                    title="白名单配置"
                    centered
                    visible={this.state.isOpen}
                    onCancel={() => {
                        this.setState({ isOpen: false })
                        this.formRef.current.resetFields()
                    }}
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
                                        label="类型"
                                        name="type"
                                        rules={[{ required: true, message: '请选择类型' }]}
                                    >
                                        <Select allowClear placeholder="请选择类型">
                                            <Option value={2} key={2} disabled>UserId</Option>
                                            <Option value={3} key={3} disabled>设备ID</Option>
                                            <Option value={1} key={1} >IP</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="配置"
                                        name="content"
                                        rules={[{ required: true, message: '请填写配置' }]}
                                    >
                                        <Input placeholder="请填写配置" />
                                    </Form.Item>
                                    <Form.Item
                                        label="备注"
                                        name="memo"
                                    >
                                        <Input.TextArea placeholder="请填写备注" />
                                    </Form.Item>
                                    <Form.Item
                                        label="状态"
                                        name="status"
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                                    </Form.Item>
                                    <Form.Item
                                        label="地域"
                                        name="area"
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
        this.listWhite()
    }
    submitForm(val) {
        console.log(this.formRef.current.getFieldsValue())
        this.setState({
            isOpen: false
        })
        if (this.state.source === "add") {
            this.addWhite(val)
        } else {
            this.updateWhite(val)
        }
    }
    listWhite() {
        listWhite({ content: this.state.searchWord }).then(res => {
            console.log(res)
            this.setState({
                lists: res.data
            })
        })
    }
    addWhite(val) {
        addWhite({ ...val, area: val.area.length > 0 ? val.area[val.area.length - 1] : "" }).then(res => {
            message.success("新增成功")
            this.listWhite()
        }).catch(res => {
            message.error("新增失败")
        })
    }
    updateWhite(val) {
        console.log(val)
        let params = {
            ...this.state.currentItem,
            ...val,
            area: Array.isArray(val.area) ? val.area.length > 0 ? val.area[val.area.length - 1] : "" : val.area ? val.area : "",
            status: val.status ? 1 : 2
        }
        updateWhite(params).then(res => {
            message.success("更新成功")
            this.listWhite()
        }).catch(res => {
            message.error("更新失败")
        })
    }
    delArt(item) {
        Modal.confirm({
            title: '删除此配置吗',
            content: '确认删除？',
            onOk: () => {
                this.deleteWhite(item)
            },
            onCancel: () => {

            }
        })
    }
    deleteWhite(item) {
        deleteWhite({ id: item.id }).then(res => {
            message.success("删除成功")
            this.listWhite()
        }).catch(res => {
            message.error("新增失败")
        })
    }
}
