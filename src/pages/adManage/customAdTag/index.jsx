import React, { Component } from 'react'
// import request from 'utils/request'
import { getAdTagList, getAdFieldList, getDictionary, delDIYTag,esQuery } from 'api'
import { Card, Breadcrumb, Button, message, Tabs, Table, Switch, Modal,Input } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import "./style.css"
import MyModel from "./MyModel"
const { TabPane } = Tabs;
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 100,
            total: 0,
            lists: [],
            loading: false,
            config: "",
            channelList: [],
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            visible: false,
            esShowModal:false,
            esResult:"",
            fieldList: [],//field列表
            dictionaryList: [],//数据远
            searchWord:"",//搜索词
            columns: [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                    width: 100,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {index + 1}-{rowValue}
                            </div>
                        )
                    }
                },
                {
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                    // render: (rowValue, row, index) => {
                    //     return (
                    //         <div>{row.name}</div>
                    //     )
                    // }
                },
                {
                    title: "标签编码",
                    dataIndex: "code",
                    key: "code",

                },
                {
                    title: "标签类型",
                    dataIndex: "tagType",
                    key: "tagType",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.tagType === 1 ? "设备标签" : "用户标签"}</div>
                        )
                    }
                },
                {
                    title: "描述",
                    dataIndex: "description",
                    key: "description",
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Switch checkedChildren="有效" unCheckedChildren="无效"
                                    key={new Date().getTime()}
                                    defaultChecked={rowValue === 1 ? true : false}
                                    onChange={(val) => {
                                        // row.state = val ? 1 : 0
                                        // this.changeStateVote(row)
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 350,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    size="small"
                                    dashed="true"
                                    onClick={() => {
                                        this.refs.getMyModal.addDIYTag(row, "copy")
                                    }}
                                >复制</Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    style={{ margin: "0 10px" }}
                                    onClick={() => {
                                        this.setState({
                                            visible: true
                                        }, () => {
                                            this.refs.getMyModal.getFormData(row)
                                        })
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => {
                                        this.delArt(row)
                                    }}
                                >删除</Button>
                                <Button
                                    size="small"
                                    dashed="true"
                                    style={{ margin: "0 10px" }}
                                    onClick={() => {
                                        this.esQuery(row)
                                    }}
                                >esQuery</Button>
                            </div>
                        )
                    }
                }

            ],
        }
    }
    render() {
        const { } = this.state;
        return (
            <div className="kefu_page">
                <Card title={
                    <div className="cardTitle">
                        <div className="everyBody">
                            <div>名称:</div>
                            <Input.Search allowClear
                                onChange={(val) => {
                                    this.state.searchWord = val
                                }}
                                onSearch={(val) => {
                                    this.state.searchWord = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getAdTagList()
                                    })

                                }} />
                        </div>
                    </div>
                }
                    extra={
                        <Button type="primary"
                            style={{ margin: "0 0 0 20px" }}
                            onClick={() => {
                                this.setState({
                                    visible: true
                                }, () => {
                                    this.refs.getMyModal.getFormData()
                                })
                            }}
                        >新增</Button>
                    }
                >
                    <Table
                        dataSource={this.state.lists}
                        scroll={{ x: 1300 }}
                        rowKey={item => item.id}
                        expandable={{
                            expandedRowRender: record => <p style={{ margin: 0 }}>{this.getListContent(record)}</p>
                        }}
                        loading={this.state.loading}
                        columns={this.state.columns}
                        pagination={{
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.changeSize,
                        }}
                    />

                </Card>
                <MyModel visible={this.state.visible} fieldList={this.state.fieldList} dictionaryList={this.state.dictionaryList}
                    closeModel={() => { this.setState({ visible: false }) }} getAdTagList={this.getAdTagList.bind(this)}
                    ref="getMyModal"
                />
                 <Modal visible={this.state.esShowModal}
                    title="Es Query"
                    centered
                    onCancel={() => {this.setState({esShowModal:false})}}
                    footer={null}
                    // width={1200}
                 >
                     <div>{this.state.esResult}</div>
                 </Modal>
            </div>
        )
    }
    componentDidMount() {
        // this.setState({
        //     // loading:true
        // })
        // this.getPublicList()
        this.getAdTagList()
        this.getAdFieldList()
        this.getDictionary()
    }
    changeSize = (page, pageSize) => {
        // 分页获取
        this.setState({
            page,
            pageSize
        }, () => {
            this.getAdTagList()
        })

    }
    getListContent(item) {
        return 1
    }
    getAdTagList() {
        let params = {
            code: "",
            name: this.state.searchWord ? this.state.searchWord : "",
            pageType: 2,
            status: -1,
            tagType: 0,
            page: { currentPage: this.state.page, pageSize: this.state.pageSize }
        }
        getAdTagList(params).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    lists: res.data.data,
                    loading: false,
                    total: res.data.totalCount,
                })
            } else {
                this.setState({
                    lists: [],
                    loading: false
                })
            }
        })
    }
    getAdFieldList() {
        getAdFieldList({}).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    fieldList: res.data.data
                })
            }
        })
    }
    getDictionary() {
        getDictionary({ type: "tagIndex" }).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    dictionaryList: res.data.data
                })
            }
        })
    }
    delArt(item) {
        Modal.confirm({
            title: '删除此消息',
            content: '确认删除？',
            onOk: () => {
                this.delDIYTag(item)
            },
            onCancel: () => {

            }
        })
    }
    delDIYTag(item) {
        delDIYTag({ id: item.id }).then(res => {
            if (res.data.errCode === 0) {
                message.success("删除成功")
                this.getAdTagList()
            } else {
                message.success("删除失败")
            }
        })
    }
    esQuery(item) {
        esQuery({ code: item.code }).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    esShowModal:true,
                    esResult:res.data.data
                })
            } else {
                message.success("失败")
            }
        })
    }
}
