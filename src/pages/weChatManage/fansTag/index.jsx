import React, { Component } from 'react'
import { getFansTag, addFansTag, updateFansTag, delFansTag,getPublicList,requestNewAdTagList } from 'api'
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
            wxPublic:[],
            user_tag:[],
            columns: [
                {
                    title: "粉丝标签",
                    dataIndex: "fansTagName",
                    key: "fansTagName",

                },
                {
                    title: "电视家用户标签",
                    dataIndex: "userTagId",
                    key: "userTagId",

                },
                {
                    title: "标签人数",
                    dataIndex: "count",
                    key: "count",

                },
                {
                    title: "公众号",
                    dataIndex: "wxAppCode",
                    key: "wxAppCode",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {this.getWxName(row)}
                            </div>
                        )
                    }

                },
                {
                    title: "任务状态",
                    dataIndex: "taskStatus",
                    key: "taskStatus",
                    render: (rowValue, row, index) => {
                        return (
                            // 0-未开始（默认）；1-进行中；2-已完成
                            <div>{rowValue == 1 ? `进行中(${parseInt(row.remainTime / 60 / 60)})小时` : rowValue == 2 ? "已完成" : "未开始"}</div>
                        )
                    }
                },
                {
                    title: "微信粉丝标签",
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            // 0-未开始（默认）；1-进行中；2-已完成
                            <Switch checkedChildren="有效" unCheckedChildren="无效"
                                key={new Date().getTime()}
                                defaultChecked={rowValue === 1 ? true : false}
                                onChange={(val) => {
                                    let info = JSON.parse(JSON.stringify(row))
                                    info.status = val?1:2
                                    this.updateFansTag(info)
                                }}
                            />
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 150,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* <Button
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
                                            let info = JSON.parse(JSON.stringify(row))
                                            info.status = info.status == 1 ? true : false
                                            info.wxAppCode = info.wxAppCode?info.wxAppCode.split(","):info.wxAppCode
                                            this.formRef.current.setFieldsValue(info)
                                        })
                                    }}
                                >编辑</Button> */}
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
        let { wxPublic, lists, layout, loading, columns, entranceState,user_tag } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>粉丝标签</Breadcrumb.Item>
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
                            <Form.Item label="粉丝标签" name="fansTagName" rules={[{ required: true, message: '请填写粉丝标签' }]}>
                                <Input placeholder="请输入粉丝标签" />
                            </Form.Item>
                            <Form.Item label="电视家用户标签" name="userTagId"  rules={[{ required: true, message: '请选择电视家用户标签' }]}>
                                <Select allowClear style={{ width: "100%" }} placeholder="请选择电视家用户标签">
                                    {
                                        user_tag.map(r => {
                                            return <Option value={r.code} key={r.id}>{r.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="公众号" name="wxAppCode">
                                <Select  mode="multiple" allowClear  style={{ width: "300px" }} placeholder="请选择公众号">
                                    {
                                        wxPublic.map(r => {
                                            return <Option value={r.code} key={r.code}>{r.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="状态" name="status" valuePropName="checked">
                                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
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
        this.getPublicList()
        this.getFansTag();
        this.requestNewAdTagList()
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        val.status = val.status?1:2
        val.wxAppCode = Array.isArray(val.wxAppCode)?val.wxAppCode.join(","):val.wxAppCode
        if (this.state.source == "edit") {
            this.updateFansTag(val)
        } else {
            this.addFansTag(val)
        }
        this.closeModal()
    }

    getFansTag() {
        let params = {}
        getFansTag(params).then(res => {
            console.log(res.data)
            this.setState({
                lists: res.data
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addFansTag(val) {
        let params = {
            ...val,
        }
        addFansTag(params).then(res => {
            this.getFansTag()
            message.success("成功")

        })
    }


    deleteItem(item) {  // 删除数据
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delFansTag(item)
            },
            onCancel: () => {
            }
        })
    }
    delFansTag(item) {
        let params = {
            id: item.id
        }
        delFansTag(params).then(res => {
            message.success("删除成功")
            this.getFansTag()
        })
    }
    updateFansTag(val) {
        let params = {
            ...this.state.currentItem,
            ...val
        }
        updateFansTag(params).then(res => {
            message.success("更新成功")
            this.getFansTag()
        })
    }
    getPublicList() {
        getPublicList({}).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    wxPublic: res.data.data
                })
            }
        })
    }
    requestNewAdTagList(){
         //用户设备标签
         requestNewAdTagList({}).then(res => {
            this.setState({
                user_tag: res.data
            })
        })
    }
    getWxName(row){
        if(row.wxAppCode){
            let arr = this.state.wxPublic.filter(item=>row.wxAppCode.split(",").some(r=>item.code == r))
            if(arr.length>0){
                let name = []
                arr.forEach(r=>{
                    name.push(r.name)
                })
                return name.join(",")
            }else{
                return "未知"
            }
        }else{
            return "未知"
        }
    }
}