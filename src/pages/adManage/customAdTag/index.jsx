import React, { Component } from 'react'
// import request from 'utils/request'
import { requestAdTagList, requestAdFieldList, requestDictionary, delDIYTag, esQuery } from 'api'
import { Card, Breadcrumb, Button, message, Tabs, Table, Switch, Modal, Input, Select } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import "./style.css"
import MyModel from "./MyModel"
const { TabPane } = Tabs;
const { Option } = Select;
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
            esShowModal: false,
            esResult: "",
            fieldList: [],//field列表
            dictionaryList: [],//数据远
            searchWord: "",//搜索词
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
                                        row.status = val ? 1 : 2
                                        this.refs.getMyModal.updateDIYTag(row, "status")
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
                                onSearch={(val) => {
                                    this.state.searchWord = val.trim()
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getAdTagList()
                                    })

                                }} />
                        </div>
                        <div className="everyBody">
                            <div>标签类型:</div>
                            <Select allowClear placeholder="请选择标签类型" style={{ width: "200px" }}
                                onChange={(val) => {
                                    this.state.searchTagType = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getAdTagList()
                                    })
                                }}
                            >
                                <Option value={1} key={1}>设备标签</Option>
                                <Option value={2} key={2}>用户标签</Option>
                            </Select>
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
                    onCancel={() => { this.setState({ esShowModal: false }) }}
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
        let arr = ""
        let ruleArr = Array.isArray(item.rule) ? item.rule : JSON.parse(item.rule)
        let indexArr = Array.isArray(item.index) ? item.index : JSON.parse(item.index)
        let filterArr = this.state.dictionaryList.filter(h => [...indexArr].some(l => l == h.key))
        filterArr.forEach(r => {
            arr = arr + r.value
        })
        return (
            <>
                <div>标签数据源：{arr}</div>
                <div>标签code：{item.code}</div>
                <div>标签名字：{item.name}</div>
                <div>标签描述：{item.description}</div>
                <div>标签类型：{item.tagType === 1 ? "设备标签" : "用户标签"}</div>
                <div>标签规则：
                    {
                        ruleArr.map((r, i) => {
                            return (
                                <div key={i}>
                                    <span>field:{r.field}  </span>
                                    <span>运算符:{r.oper}  </span>
                                    <span>取值:{r.value}  </span>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    getAdTagList() {
        this.setState({
            loading: true
        })
        let params = {
            code: "",
            name: this.state.searchWord ? this.state.searchWord : "",
            pageType: 2,
            status: -1,
            tagType: this.state.searchTagType ? this.state.searchTagType : "",
            page: { currentPage: this.state.page, pageSize: this.state.pageSize }
        }

        requestAdTagList(params).then(res => {
            this.setState({
                lists: res.data.data,
                loading: false,
                total: res.data.totalCount,
            })
        }).catch(res => {
            this.setState({
                lists: [],
                loading: false
            })
        })
    }
    getAdFieldList() {
        requestAdFieldList({page:{pageSize:9999}}).then(res => {
                this.setState({
                    fieldList: res.data,
                })
        })
    }
    getDictionary() {
        requestDictionary({ type: "tagIndex" }).then(res => {
                this.setState({
                    dictionaryList: res.data,
                })
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
                    esShowModal: true,
                    esResult: res.data.data
                })
            } else {
                message.success("失败")
            }
        })
    }
}
