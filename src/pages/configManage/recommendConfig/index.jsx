import React, { Component } from 'react'
import { searchShortList, getSuggest, addSuggest, updateSuggest, getChannel } from 'api'
import { Breadcrumb, Card, TimePicker, Button, message, Table, Modal, DatePicker, Form, Select, Checkbox, InputNumber } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MySyncBtn } from "@/components/views.js"
import moment from 'moment';
import util from 'utils'
import "./style.css"
let { RangePicker } = DatePicker;
let format = "YYYY-MM-DD HH:mm:ss"
let privateData = {
    inputTimeOutVal: null
};
const { Option } = Select; export default class EarnIncentiveTask extends React.Component {
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
            channel_list: [],
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            columns: [
                {
                    title: "位置",
                    dataIndex: "position",
                    key: "position",
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
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            rowValue ?
                                <div>{row.start} - {row.end}</div>
                                :
                                <div>长期</div>

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
                                        this.setState({
                                            entranceState: true,
                                            currentItem: row,
                                            source: "edit"
                                        }, () => {
                                            let arr = JSON.parse(JSON.stringify(row))
                                            arr.time = [arr.start ? moment(arr.start) : "", arr.end ? moment(arr.end) : ""]
                                            arr.checked = arr.start ? false : true
                                            console.log(arr)
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
        let { lists, layout, loading, columns, entranceState, channel_list } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>首页为你推荐配置</Breadcrumb.Item>
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
                            <MySyncBtn type={16} name='同步缓存' />
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
                            <Form.Item label="位置" name="position" rules={[{ required: true, message: '请输入位置' }]}>
                                <InputNumber placeholder="请输入位置" min={0} style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="展示频道" name="channelId" rules={[{ required: true, message: '请选择视频集名称' }]}>
                                {/* <Input placeholder="请选择视频集名称" /> */}
                                <Select
                                    placeholder="请选择频道配置"
                                    // mode="multiple"
                                    allowClear
                                    {...this.state.selectProps}
                                    onSearch={(val) => {
                                        console.log(val)
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            this.getChannel(val)
                                        }, 1000)
                                    }}
                                >
                                    {
                                        channel_list.map((r, i) => {
                                            return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>
                            <Form.Item label="展示时间段" style={{ display: "flex" }}>
                                <Form.Item name="time" >
                                    <RangePicker placeholder={['上线时间', '下线时间']} showTime onChange={(e) => {
                                        console.log(e)
                                        if (e && e[1]) {
                                            this.formRef.current.setFieldsValue({ "checked": false })
                                        } else {
                                            this.formRef.current.setFieldsValue({ "checked": true })

                                        }
                                        this.forceUpdate()
                                    }} ></RangePicker>
                                </Form.Item>
                                <Form.Item name="checked">
                                    <Checkbox valuePropName="checked" checked={(this.formRef.current && this.formRef.current.getFieldValue("checked"))} onChange={val => {
                                        console.log(val.target.checked)
                                        if (val.target.checked) {
                                            this.formRef.current.setFieldsValue({ "star": "", "end": "", time: ["", ""] })
                                        } else {
                                            this.formRef.current.setFieldsValue({ time: "" })
                                        }
                                        this.formRef.current.setFieldsValue({ checked: val.target.checked })
                                        this.forceUpdate()
                                    }}>
                                        长期
                                    </Checkbox>
                                </Form.Item>
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
    getChannel(val) {
        let params = {
            keywords: val,
        }
        //获取频道组
        getChannel(params).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0 && res.data.data) {
                this.setState({
                    channel_list: res.data.data,
                })
            }else{
                this.setState({
                    channel_list: [],
                })
            }
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
        if (!val.time && !val.checked) {
            return message.error("请选择时间段")
        }
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
        this.formRef.current.resetFields();
        this.setState({
            entranceState: false
        })
    }
    addSuggest(val) {
        let params = {
            ...val,
            start: (val.time && val.time[0]) ? moment(val.time[0]).format(format) : "",
            end: (val.time && val.time[1]) ? moment(val.time[1]).format(format) : ""
        }
        addSuggest(params).then(res => {
            this.getSuggest()
            message.success("新增成功")
        })
    }
    updateSuggest(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            start: (val.time && val.time[0]) ? moment(val.time[0]).format(format) : "",
            end: (val.time && val.time[1]) ? moment(val.time[1]).format(format) : ""
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