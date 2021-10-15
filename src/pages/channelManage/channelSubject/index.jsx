import React, { Component } from 'react'

import { ChannelTopic, deleteChannelTopic, syncChannel } from 'api'
import { Breadcrumb, Card, Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, InputNumber } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import moment from 'moment';
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class SportsProgram extends Component {
    formRef = React.createRef();
    constructor() {
        super();
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            loading: false,
            btnLoading: false,
            searchWords: "",
            lists: [
                { name: "扫黑风暴", sort: 1, status: 1, id: 1 },
                { name: "啊啊啊啊", sort: 2, status: 2, id: 2 }
            ],
            currentItem: "",//编辑行的id
            newData: {},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            dataSource: [],
            visible: false,
            //专题状态
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],
            columns: [
                { title: "专题 ID", dataIndex: "ID", key: "ID", },
                { title: "标题", dataIndex: "title", key: "title", },
                { title: "排序", dataIndex: "column", key: "column", },
                {
                    title: "时间", dataIndex: "time", key: "time",
                    render: (rowValue, row, index) => {
                        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                        let time = [];
                        if (row.startTime && row.endTime) {
                            time = [moment(new Date(row.startTime)), moment(new Date(row.endTime)),]
                        }

                        return (
                            <div>
                                <RangePicker defaultValue={time} showTime format={dateFormat} disabled />
                            </div>
                        )
                    }
                },
                {
                    title: '状态', dataIndex: 'status', key: 'status',
                    render: (rowValue, row, index) => {
                        return (
                            <Select className="base-input-wrapper" value={rowValue} disabled placeholder='请选择状态'>
                                {this.state.dict_status.map((item, index) => {
                                    return <Option key={index} value={item.key}>{item.value}</Option>
                                })}
                            </Select>
                        )
                    }
                },


                // {
                //     title: "频道",
                //     dataIndex: "channelName",
                //     key: "channelName",
                // },
                // {
                //     title: "节目",
                //     dataIndex: "programName",
                //     key: "programName",
                // },
                {
                    title: "背景图", dataIndex: "backImage", key: "backImage",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={row.backImage} />)
                    }
                },
                {
                    title: "操作", key: "action",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(rowValue, row);
                                        this.props.history.push(`/mms/channelManage/editSubject/${row.ID}`)
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteSubject(row) }}
                                >删除</Button>
                            </div>
                        )
                    }
                }
            ],
        }
    }
    componentDidMount() {
        this.ChannelTopic();
    }
    ChannelTopic() {
        let params = {
            // name:keyWord || ""
        }
        ChannelTopic(params).then(res => {
            console.log(res);
            if (res.data.errCode === 0) {
                this.setState({
                    lists: res.data.data.dataList
                })
            }
        })
    }
    deleteItem(val) {
        let params = {
            id: val.ID
        }
        deleteChannelTopic(params).then(res => {
            console.log(res);
            if (res.data.errCode == 0) {
                message.success("删除成功")
                this.ChannelTopic();
            } else {
                message.error(res.data.msg)
            }
        })
    }
    syncChannel() {
        console.log("数据同步")
        this.setState({
            btnLoading: true
        })
        syncChannel().then((res) => {
            console.log(res);
            if (res.data.errCode == 0) {
                message.success("数据同步成功")
                this.setState({
                    btnLoading: false
                })
            } else {
                message.error(res.data.msg)
                this.setState({
                    btnLoading: false
                })
            }
        });
    }
    deleteSubject(_obj) {
        console.log("删除行", _obj)
        Modal.confirm({
            title: `执行删除操作后，该专题和该专题下对应的信息都会被删除。是否确认删除？`,
            content: '确认删除？',
            onOk: () => {
                this.deleteItem(_obj)
            },
            onCancel: () => {
            }
        })
    }
    render() {
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>频道专题管理</Breadcrumb.Item>
                        </Breadcrumb>
                        {/* <Input.Search allowClear style={{ width: '20%',marginTop:"10px" }} 
                        placeholder="请输入频道专题名称"
                        onSearch={(val)=>{
                            this.setState({
                                searchWords:val
                            })
                            this.ChannelTopic(val)
                        }} /> */}
                    </div>
                }
                    extra={
                        <div>
                            <Button type="primary"
                                onClick={() => {
                                    this.props.history.push(`/mms/channelManage/editSubject/add`)
                                }}
                            >新增专题</Button>
                            <Button type="primary"
                                loading={this.state.btnLoading}
                                style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.syncChannel()
                                }}
                            >数据同步</Button>
                        </div>
                    }
                >
                    <Table
                        dataSource={this.state.lists}
                        // rowKey={item=>item.indexId}
                        loading={this.state.loading}
                        columns={this.state.columns} />
                </Card>
            </div>
        )
    }
}