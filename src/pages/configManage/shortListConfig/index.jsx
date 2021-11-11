import React, { Component } from 'react'
import { getProgramlist, getDetailProgram, getShortList, addProgramList, getProgramInfo, uploadProgramList, delProgramList } from 'api'
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
let privateData = {
    inputTimeOutVal: null
};
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 50,
            total: 0,
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
            shortList: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            columns: [
                {
                    title: "节目单id",
                    dataIndex: "programId",
                    key: "programId",
                },
                {
                    title: "节目单名称",
                    dataIndex: "programTitle",
                    key: "programTitle",
                },
                {
                    title: "已关联视频集数",
                    dataIndex: "total",
                    key: "total",
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 300,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <MySyncBtn type={15} name='同步缓存' params={{id:row.id}}  size="small" />
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
                                            // let arr = JSON.parse(JSON.stringify(row))
                                            // this.formRef.current.setFieldsValue(arr)
                                            this.getProgramInfo(row.id)
                                            this.getDetailProgram(row.programTitle)
                                            this.forceUpdate()
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
        let { productLists, lists, layout, loading, columns, entranceState, shortList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>节目单视频集配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
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
                        scroll={{ x: 1000, y: '75vh' }}
                        // rowKey={item=>item.indexId}
                        loading={loading}
                        columns={columns}
                        pagination={{
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.changeSize
                        }}
                    />
                </Card>
                <Modal title="新增任务" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="节目单名称" name="programId" rules={[{ required: true, message: '请选择节目单名称' }]}>
                                <Select
                                    allowClear
                                    placeholder="请选择节目单名称"
                                    showSearch
                                    optionFilterProp={"children"}
                                    onSearch={(e) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            this.getDetailProgram(e)
                                        }, 1000)
                                    }}>
                                    {
                                        productLists.map((r, i) => {
                                            return <Option value={r.programId} key={r.feedId}>{r.name}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="视频集关联"
                                name="collections"
                                rules={[{ required: true, message: '视频集关联' }]}
                            >
                                <Form.List name="collections">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline" style={{ width: "100%" }}>
                                                    <Form.Item {...field} label="" name={[field.name]} fieldKey={[field.fieldKey, "num"]}>
                                                        <Select allowClear placeholder="请选择视频集" style={{width:"200px"}}>
                                                            {
                                                                shortList.map((r, i) => {
                                                                    return <Option value={r.id} key={r.id}>{r.title}</Option>
                                                                })
                                                            }

                                                        </Select>
                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => { remove(field.name) }} />
                                                </Space>
                                            ))}

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => { add() }} block icon={<PlusOutlined />}>
                                                    新建关联视频集
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
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
        this.getShortList()
        this.getProgramlist();
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getProgramlist()
        })
    }
    getDetailProgram(keyword) {
        if (!keyword) return
        let params = {
            name: keyword,
        }
        getDetailProgram(params).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    productLists: res.data.data,
                })
                // this.forceUpdate()
            }

        })
    }
    submitForm(val) {   // 提交表单
        console.log(val)
        if(val.collections){
            let arr = val.collections.filter(r=>!!r)
            if(arr.length == 0){
                return message.error("请关联一个视频合集")
            }
        }
        if (this.state.source == "edit") {
            this.uploadProgramList(val)
        } else {
            this.addProgramList(val)
        }
        this.closeModal()
    }
    getProgramInfo(id) { //节目单详情
        let params = {
            id: id
        }
        getProgramInfo(params).then(res => {
            console.log(res)
            let arr = res.data.data
            let list = []
            if (Array.isArray(arr.collections) && arr.collections.length > 0) {
                arr.collections.forEach(r => {
                    list.push(r.id)
                })
            }
            arr.collections = list
            this.formRef.current.setFieldsValue(arr)
        })
    }
    getProgramlist() {
        let params = {
            currentPage: 1, // (int)页码
            pageSize: 9999 // (int)每页数量
        }
        getProgramlist(params).then(res => {
            this.setState({
                lists: res.data.data,
                total: res.data.totalCount
            })
        })
    }
    getShortList() {
        let params = {
            currentPage: 1, // (int)页码
            pageSize: 9999 // (int)每页数量
        }
        getShortList(params).then(res => {
            this.setState({
                shortList: res.data.data
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addProgramList(val) {
        let arr = this.state.productLists.filter(r => r.programId == val.programId)
        let params = {
            ...val,
            programTitle: arr.length > 0 ? arr[0].name : ""
        }
        addProgramList(params).then(res => {
            this.getProgramlist()
            message.success("成功")
        })
    }
    uploadProgramList(val){
        let arr = this.state.productLists.filter(r => r.programId == val.programId)
        let params = {
            ...this.state.currentItem,
            ...val,
            programTitle: arr.length > 0 ? arr[0].name : ""
        }
        uploadProgramList(params).then(res => {
            this.getProgramlist()
            message.success("成功")
        })
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delProgramList(_obj.id)
            },
            onCancel: () => {
            }
        })
    }
    delProgramList(id) {
        let params = {
            id: id
        }
        delProgramList(params).then(res => {
            message.success("删除成功")
            this.getProgramlist()
        })
    }
}