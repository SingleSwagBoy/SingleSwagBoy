import React, { Component } from 'react'
import { getMarsList, requestNewAdTagList, uploadMarsList, addMarsList, delMarsList, changeZzItemList, rsZzItemList } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
let privateData = {
    inputTimeOutVal: null
};
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
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
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            selectProps: {
                optionFilterProp: "children",
                // filterOption(input, option){
                //   return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // },
                showSearch() {
                    console.log('onSearch')
                }
            },
            columns: [
                {
                    title: "频道名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "频道编码",
                    dataIndex: "manualCode",
                    key: "manualCode",
                },
                {
                    title: "标签",
                    dataIndex: "type",
                    key: "type",
                    // render: (rowValue, row, index) => {
                    //     return (
                    //         // 1=固定金额;2=固定人群;3=随机金额
                    //         <div>{rowValue == 1 ? "固定金额" : rowValue == 2 ? "固定人群" : rowValue == 3 ? "随机金额" : "未知"}</div>
                    //     )
                    // }
                },
                {
                    title: "上线时间-下线时间",
                    dataIndex: "startAt",
                    key: "startAt",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.startAt, "")} - {util.formatTime(row.endAt, "")}</div>
                        )
                    }
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "state",
                    key: "state",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        // this.changeZzItemList(row)
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 210,
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
                                            let arr = JSON.parse(JSON.stringify(row))
                                            arr.time = [moment(arr.startAt), moment(arr.endAt)]
                                            arr.state = arr.state == 0 ? false : true
                                            this.formRef.current.setFieldsValue(arr)
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
        let { levelList, lists, layout, loading, columns, entranceState, tagList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>提现商品列表</Breadcrumb.Item>
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
                            <MySyncBtn type={13} name='同步缓存' />
                        </div>
                    }
                >
                    <Table
                        dataSource={lists}
                        scroll={{ x: 1500, y: '75vh' }}
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
                            <Form.Item label="频道名称" name="type" rules={[{ required: true, message: '请选择频道' }]}>
                                <Select
                                    placeholder="请输入频道名称"
                                    allowClear
                                    {...this.state.selectProps}
                                    onSearch={(val) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            this.getProgramsList(val)
                                        }, 1000)
                                    }}>
                                    <Option value={1} key={1}>固定金额</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="频道编码" name="code" >
                                <Input placeholder="频道编码" disabled />
                            </Form.Item>
                            <Form.Item label="标签" name="type">
                                <Select
                                    placeholder="请输入标签"
                                    allowClear
                                    {...this.state.selectProps}
                                    onSearch={(val) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            // this.getProgramsList(val)
                                        }, 1000)
                                    }}>
                                    <Option value={1} key={1}>固定金额</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="上下线时间" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="状态" name="state" valuePropName="checked">
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
        this.requestNewAdTagList()
        this.getMarsList();
    }
    //获取标签信息
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                tagList: res.data,
            });
        })
    }

    changeStart(e) {
        console.log(e);
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getMarsList()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (this.state.source == "edit") {
            this.uploadMarsList(val)
        } else {
            this.addMarsList(val)
        }
        this.closeModal()
    }

    getMarsList() {
        let params = {
            keyword: "",
            startTime: "",
            endTime: ""
        }
        getMarsList(params).then(res => {
            this.setState({
                lists: res.data.data,
                // total: res.data.page.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addMarsList(val, type) {
        let params = {
            ...val,
            startAt: val.time[0].valueOf(),
            endAt: val.time[1].valueOf(),
            state: val.state ? 1 : 0,
        }
        addMarsList(params).then(res => {
            this.getMarsList()
            message.success("新增成功")
        })
    }
    uploadMarsList(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            startAt: val.time[0].valueOf(),
            endAt: val.time[1].valueOf(),
            state: val.state ? 1 : 0,
        }
        uploadMarsList(params).then(res => {
            this.getMarsList()
            message.success("更新成功")
        })
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delMarsList(_obj)
            },
            onCancel: () => {
            }
        })
    }
    delMarsList(item) {
        let params = {
            id: item.id
        }
        delMarsList(params).then(res => {
            message.success("删除成功")
            this.getMarsList()
        })
    }
}