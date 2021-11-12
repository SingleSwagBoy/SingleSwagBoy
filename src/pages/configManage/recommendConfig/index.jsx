import React, { Component } from 'react'
import {  searchShortList, getSuggest, addSuggest, updateSuggest, delShortList } from 'api'
import { Breadcrumb, Card, TimePicker, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MySyncBtn } from "@/components/views.js"
import moment from 'moment';
import util from 'utils'
import "./style.css"
let { RangePicker } = DatePicker;
let format = "YYYY-MM-DD HH:mm:ss"
const { Option } = Select;export default class EarnIncentiveTask extends React.Component {
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
            shortList: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            columns: [
                {
                    title: "位置",
                    dataIndex: "id",
                    key: "id",
                },
                {
                    title: "展示频道",
                    dataIndex: "channelId",
                    key: "channelId",
                },
                {
                    title: "替换时间",
                    dataIndex: "start",
                    key: "start",
                    width:400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.start} - {row.end}</div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 200,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* <MySyncBtn type={15} name='同步缓存' params={{id:row.id}}  size="small" /> */}
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
                                            arr.time = [moment(arr.start),moment(arr.end)]
                                            this.formRef.current.setFieldsValue(arr)
                                            this.forceUpdate()
                                        })
                                    }}
                                >编辑</Button>
                                {/* <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteItem(row) }}
                                >删除</Button> */}
                            </div>
                        )
                    }
                }
            ],
        }
    }
    render() {
        let {  lists, layout, loading, columns, entranceState, shortList } = this.state;
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
                            <Form.Item label="展示频道" name="channelId" rules={[{ required: true, message: '请选择视频集名称' }]}>
                                <Input placeholder="请选择视频集名称" />
                            </Form.Item>
                            <Form.Item label="展示时间段" name="time" rules={[{ required: true, message: '请选择视频集名称' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
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
        this.getSuggest()
        // this.getProgramlist();
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
    // searchShortList(keyword,index) {
    //     if (!keyword) return
    //     let params = {
    //         str_id: keyword,
    //     }
    //     searchShortList(params).then(res => {
    //         console.log(res.data.data,"res.data")
    //         if(res.data.data){
    //             let arr = this.formRef.current.getFieldValue("videos")
    //             console.log(arr,"arr")
    //             let obj = res.data.data
    //             let str = {
    //                 str_id:obj.id,
    //                 cover:obj.cover,
    //                 source:obj.source,
    //                 sort:arr[index].sort || 0,
    //                 uploader:obj.uploader,
    //                 likeCount:obj.likeCount,
    //                 title:obj.title
    //             }
    //             arr[index] = str
    //             this.formRef.current.setFieldsValue({"videos":arr})
    //         }else{
    //             message.error("没找到合适的短视频")
    //         }
    //     })
    // }
    submitForm(val) {   // 提交表单
        console.log(val)
       
        if (this.state.source == "edit") {
            this.updateSuggest(val)
        } else {
            this.addSuggest(val)
        }
        this.closeModal()
    }
    getSuggest() {
        let params = {
            // currentPage: this.state.page, // (int)页码
            // pageSize: this.state.pageSize // (int)每页数量
        }
        getSuggest(params).then(res => {
            this.setState({
                lists: res.data.data,
                // total: res.data.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addSuggest(val) {
        let params = {
            ...val
        }
        addSuggest(params).then(res => {
            this.getSuggest()
            message.success("新增成功")
        })
    }
    updateSuggest(val){
        let params = {
            ...this.state.currentItem,
            ...val,
            start: moment(val.time[0]).format(format),
            end: moment(val.time[1]).format(format)
        }
        updateSuggest(params).then(res => {
            this.getSuggest()
            message.success("更新成功")
        })
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delShortList(_obj.id)
            },
            onCancel: () => {
            }
        })
    }
    // delShortList(id) {
    //     let params = {
    //         id: id
    //     }
    //     delShortList(params).then(res => {
    //         message.success("删除成功")
    //         this.getSuggest()
    //     })
    // }
}