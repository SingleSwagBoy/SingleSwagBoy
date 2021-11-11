import React, { Component } from 'react'
import { getProgramlist, searchShortList, getShortList, addShortList, getProgramInfo, updateShortList, delProgramList } from 'api'
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
            shortList: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            columns: [
                {
                    title: "短视频集id",
                    dataIndex: "id",
                    key: "id",
                },
                {
                    title: "视频集名称",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "视频数量",
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
                                            this.formRef.current.setFieldsValue(arr)
                                            // this.getProgramInfo(row.id)
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
                            <Form.Item label="视频集名称" name="title" rules={[{ required: true, message: '请选择视频集名称' }]}>
                                <Input placeholder="请选择视频集名称" />
                            </Form.Item>
                            <Form.Item
                                label="短视频添加"
                                name="videos"
                                rules={[{ required: true, message: '短视频添加' }]}
                            >
                                <Form.List name="videos">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline" style={{ width: "100%" }}>
                                                    <Form.Item {...field} label="排序" name={[field.name, "sort"]} fieldKey={[field.fieldKey, "sort"]}>
                                                        <InputNumber placeholder="请输入排序" />
                                                    </Form.Item>
                                                    <Form.Item {...field} label="短视频ID" name={[field.name, "str_id"]} fieldKey={[field.fieldKey, "str_id"]}>
                                                        <Input.Search placeholder="请输入短视频标题" onSearch={(e)=>{
                                                            this.searchShortList(e,index)
                                                        }} />
                                                    </Form.Item>
                                                    <Form.Item {...field} label="短视频标题" name={[field.name, "title"]} fieldKey={[field.fieldKey, "title"]}>
                                                        <Input placeholder="请输入短视频标题" style={{width:"300px"}} />
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
    searchShortList(keyword,index) {
        if (!keyword) return
        let params = {
            str_id: keyword,
        }
        searchShortList(params).then(res => {
            console.log(res.data.data,"res.data")
            if(res.data.data){
                let arr = this.formRef.current.getFieldValue("videos")
                console.log(arr,"arr")
                let obj = res.data.data
                let str = {
                    str_id:obj.id,
                    cover:obj.cover,
                    source:obj.source,
                    sort:obj.sort || 0,
                    uploader:obj.uploader,
                    likeCount:obj.likeCount,
                    title:obj.title
                }
                arr[index] = str
                this.formRef.current.setFieldsValue({"videos":arr})
            }else{
                message.error("没找到合适的短视频")
            }
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val)
        if (val.collections) {
            let arr = val.collections.filter(r => !!r)
            if (arr.length == 0) {
                return message.error("请关联一个视频合集")
            }
        }
        if (this.state.source == "edit") {
            this.updateShortList(val)
        } else {
            this.addShortList(val)
        }
        this.closeModal()
    }
    // getProgramInfo(id) { //节目单详情
    //     let params = {
    //         id: id
    //     }
    //     getProgramInfo(params).then(res => {
    //         console.log(res)
    //         let arr = res.data.data
    //         let list = []
    //         if (Array.isArray(arr.collections) && arr.collections.length > 0) {
    //             arr.collections.forEach(r => {
    //                 list.push(r.id)
    //             })
    //         }
    //         arr.collections = list
    //         this.formRef.current.setFieldsValue(arr)
    //     })
    // }
    // getProgramlist() {
    //     let params = {
    //         currentPage: 1, // (int)页码
    //         pageSize: 9999 // (int)每页数量
    //     }
    //     getProgramlist(params).then(res => {
    //         this.setState({
    //             lists: res.data.data,
    //             total: res.data.totalCount
    //         })
    //     })
    // }
    getShortList() {
        let params = {
            currentPage: this.state.page, // (int)页码
            pageSize: this.state.pageSize // (int)每页数量
        }
        getShortList(params).then(res => {
            this.setState({
                lists: res.data.data,
                total: res.data.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addShortList(val) {
        let params = {
            ...val
        }
        addShortList(params).then(res => {
            this.getShortList()
            message.success("成功")
        })
    }
    updateShortList(val){
        let params = {
            ...this.state.currentItem,
            ...val,
        }
        updateShortList(params).then(res => {
            this.getShortList()
            message.success("成功")
        })
    }

    // deleteItem(_obj) {  // 删除数据
    //     console.log(_obj)
    //     Modal.confirm({
    //         title: `确认删除该条数据吗？`,
    //         // content: '确认删除？',
    //         onOk: () => {
    //             this.delProgramList(_obj.id)
    //         },
    //         onCancel: () => {
    //         }
    //     })
    // }
    // delProgramList(id) {
    //     let params = {
    //         id: id
    //     }
    //     delProgramList(params).then(res => {
    //         message.success("删除成功")
    //         this.getProgramlist()
    //     })
    // }
}