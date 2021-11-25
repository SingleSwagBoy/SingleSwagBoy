import React, { Component } from 'react'
import {  getList ,addList,updateList,deleteConfig} from 'api'
import { Breadcrumb, Card, TimePicker, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
const format = 'HH:mm';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
            lists: [],
            productLists: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            columns: [
                {
                    title: "用户UserId",
                    dataIndex: "userId",
                    key: "userId",
                    width:200
                },
                {
                    title: "备注",
                    dataIndex: "mark",
                    key: "mark",
                    width:400
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 150,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(row)
                                        this.setState({
                                            entranceState: true,
                                            currentItem: row,
                                            source: "edit"
                                        }, () => {
                                            this.formRef.current.setFieldsValue(row)
                                        })
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteItem(row) }}
                                >删除</Button>
                            </div>
                        )
                    }
                }
            ],
        }
    }
    render() {
        let { productLists, lists, layout, loading, columns, entranceState, } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>提现黑名单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
                            {/* <Button type="primary"  onClick={this.getEarnTskList.bind(this)}>刷新</Button> */}
                            <Button type="primary" style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.setState({
                                        source: "add",
                                        entranceState: true,
                                    }, () => {
                                        this.formRef.current.resetFields();
                                    })
                                }}
                            >新增</Button>
                            <MySyncBtn type={7} name='同步缓存' params={{key:"WITHDRAWAL_BLACKLIST"}} />
                        </div>
                    }
                >
                    <Table
                        dataSource={lists}
                        // scroll={{ x: 1500, y: '75vh' }}
                        // rowKey={item=>item.indexId}
                        loading={loading}
                        columns={columns}
                    />
                </Card>
                <Modal title="配置" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="用户UserId" name="userId" rules={[{ required: true, message: '请填写用户UserId' }]}>
                                <Input placeholder="请输入用户UserId" disabled={this.state.source == "edit"} />
                            </Form.Item>
                            <Form.Item label="备注" name="mark">
                                <Input placeholder="请输入备注" />
                            </Form.Item>
                            <Form.Item {...this.state.tailLayout}>
                                <Button onClick={() => { this.setState({ entranceState: false }) }}>取消</Button>
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
        this.getList();
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (this.state.source == "edit") {
            this.updateList(val)
        } else {
            this.addList(val)
        }
        this.closeModal()
    }

    getList() {
        let params = {
            key:"WITHDRAWAL_BLACKLIST"
        }
        getList(params).then(res => {
            this.setState({
                lists: res.data.data
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addList(val) {
        let body={
            key:"WITHDRAWAL_BLACKLIST"
        }
        let params = {
            ...val,
        }
        addList(body,params).then(res => {
            if(res.data.errCode == 0){
                this.getList()
                message.success("成功")
            }else{
                message.error(res.dara.msg)
            }
            
        })
    }


    deleteItem(item) {  // 删除数据
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.deleteConfig(item)
            },
            onCancel: () => {
            }
        })
    }
    deleteConfig(item) {
        let params = {
            key:"WITHDRAWAL_BLACKLIST",
            id: item.indexId
        }
        deleteConfig(params).then(res => {
            message.success("删除成功")
            this.getList()
        })
    }
    updateList(val) {
        let params={
            key:"WITHDRAWAL_BLACKLIST",
            id:this.state.currentItem.indexId
        }
        let body = {
            ...val,
        }
        updateList(params,body).then(res => {
            if(res.data.errCode === 0){
                message.success("更新成功")
                this.getList()
              }else{
                message.error("更新失败")
              }
        })
    }
}