import React, { Component } from 'react'
import { getChannelSport, addChannelSport, resetChannelSport, delChannelSport, getShortList, sortChannelSport } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
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
                wrapperCol: { offset: 14, span: 10 },
            },
            lists: [],
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            visible: false,
            video_list: [],
            activityIndex: null,
            columns: [
                {
                    title: "排序",
                    dataIndex: "sort",
                    key: "sort",
                    render: (rowValue, row, index) => {
                        return (
                            this.state.activityIndex == index ?
                                <div><InputNumber defaultValue={rowValue} step={10} min={0} onBlur={(e) => {
                                    console.log(e)
                                    this.sortChannelSport(e.target.value, row)
                                }}></InputNumber></div>
                                :
                                <div style={{ color: "#1890ff" }} onClick={() => this.setState({ activityIndex: index })}>{rowValue}</div>
                        )
                    }
                },
                {
                    title: "短视频集ID",
                    dataIndex: "svCollectionId",
                    key: "svCollectionId",
                },
                {
                    title: "视频集名称",
                    dataIndex: "title",
                    key: "title",
                    render: (rowValue, row, index) => {
                        return <div>{row.svCollectionDetail.title}</div>
                    }
                },
                {
                    title: "已关联视频集数",
                    dataIndex: "total",
                    key: "total",
                    render: (rowValue, row, index) => {
                        return <div>{row.svCollectionDetail.total}</div>
                    }
                },
                {
                    title: "缩略图",
                    dataIndex: "cover",
                    key: "cover",
                    render: (rowValue, row, index) => {
                        return <Image width={80} src={row.svCollectionDetail.cover} />
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
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteItem(row) }}
                                >移除</Button>
                            </div>
                        )
                    }
                }
            ],
        }
    }
    render() {
        let { lists, layout, loading, columns, entranceState, video_list } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>体育频道短视频集配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
                            <Button danger style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.resetChannelSport()
                                }}
                            >重新排序</Button>
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
                            <MySyncBtn type={21} name='同步缓存' />
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
                <Modal title="新增视频配置" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={600}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="视频集关联" name="svCollectionId" rules={[{ required: true, message: '请选择视频集关联' }]}>
                                <Select
                                    placeholder="请选择频道配置"
                                    // mode="multiple"
                                    allowClear
                                    {...this.state.selectProps}
                                // onSearch={(val) => {
                                //     console.log(val)
                                //     if (privateData.inputTimeOutVal) {
                                //         clearTimeout(privateData.inputTimeOutVal);
                                //         privateData.inputTimeOutVal = null;
                                //     }
                                //     privateData.inputTimeOutVal = setTimeout(() => {
                                //         if (!privateData.inputTimeOutVal) return;
                                //         this.getShortList()
                                //     }, 1000)
                                // }}
                                >
                                    {
                                        video_list.map((r, i) => {
                                            return <Option value={r.id} key={r.id}>{r.id + "----" + r.title}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>
                            <Form.Item label="位置" name="position" rules={[{ required: true, message: '请选择位置' }]}>
                                <Select
                                    placeholder="请选择频道配置"
                                    // mode="multiple"
                                    allowClear
                                    {...this.state.selectProps}
                                >
                                    <Option value={10} key={1}>体育频道</Option>
                                </Select>
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
        this.getChannelSport()
        this.getShortList();
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getChannelSport()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val)
        this.addChannelSport(val)
        this.closeModal()
    }
    getChannelSport() {
        let params = {
            page: {
                currentPage: this.state.page, // (int)页码
                pageSize: this.state.pageSize // (int)每页数量
            }

        }
        getChannelSport(params).then(res => {
            this.setState({
                lists: res.data.data,
                total: res.data.page.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addChannelSport(val) {
        let params = {
            ...val,
            sort: 1
        }
        addChannelSport(params).then(res => {
            this.getChannelSport()
            message.success("新增成功")
        })
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delChannelSport(_obj.id)
            },
            onCancel: () => {
            }
        })
    }
    delChannelSport(id) {
        let params = {
            ids: id
        }
        delChannelSport(params).then(res => {
            message.success("删除成功")
            this.getChannelSport()
        })
    }
    getShortList() {
        let params = {
            currentPage: 1, // (int)页码
            pageSize: 9999 // (int)每页数量
        }
        getShortList(params).then(res => {
            this.setState({
                video_list: res.data.data
            })
        })
    }
    resetChannelSport() { //重新排序
        resetChannelSport({}).then(res => {
            message.success("重新排序成功")
        })
    }
    sortChannelSport(val, row) { //重新排序
        let params = {
            id: row.id,
            sort: Number(val)
        }
        sortChannelSport(params).then(res => {
            this.setState({ activityIndex: null })
            this.getChannelSport()
        })
    }
}