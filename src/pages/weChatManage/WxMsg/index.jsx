import React, { Component } from 'react'
// import request from 'utils/request'
import { getMsg, getMsgLog, getPublicList, getUserTag ,deleteMsg} from 'api'
import { Card, Breadcrumb, Button, message, Tabs, Table, Switch,Modal } from 'antd'
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
            addressList: [
                { name: "定时任务", type: 1 },
                { name: "发送记录", type: 2 }
            ],
            listType: 0, // 列表类型，主要判断是否显示新增按钮
            userTagList: [],//用户设备标签列表
            columnsList: [],
            wxPublic: [],//微信公众号列表
            visible: false,
            columns: [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                    width: 100,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {index+1}-{rowValue}
                            </div>
                        )
                    }
                },
                {
                    title: "公众号",
                    dataIndex: "wxCode",
                    key: "wxCode",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    this.state.wxPublic.filter(item => item.code === row.wxCode).length > 0 ?
                                        this.state.wxPublic.filter(item => item.code === row.wxCode)[0].name : ""
                                }
                            </div>
                        )
                    }
                },
                {
                    title: "用户设备标签",
                    dataIndex: "tag",
                    key: "tag",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getWords(row)}</div>
                        )
                    }
                },
                {
                    title: "定时发送方式",
                    dataIndex: "sendType",
                    key: "sendType",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.sendType === 1 ? "一次性定时发送" : row.sendType === 2 ? "循环定时发送" : "相对时间定时发送"}</div>
                        )
                    }
                },
                {
                    title: "发送类型",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.type === "text" ? "文字消息" : row.type === "image" ? "图片消息" :row.type === "mpnews"?"图文消息": "图文消息（外链）"}</div>
                        )
                    }
                },
                {
                    title: "创建时间",
                    dataIndex: "updateTime",
                    key: "updateTime",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.updateTime, "", 1)}</div>
                        )
                    }
                },
                {
                    title: "执行时间",
                    dataIndex: "sendTime",
                    key: "sendTime",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.sendTime, "", 1)}</div>
                        )
                    }
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
                    width: 200,
                    fixed: 'right', width: 250,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    size="small"
                                    dashed="true"
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
                                    onClick={()=>{
                                       this.delArt(row)
                                    }}
                                >删除</Button>
                            </div>
                        )
                    }
                }

            ],
            columnsLog: [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                },
                {
                    title: "公众号",
                    dataIndex: "wxCode",
                    key: "wxCode",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    this.state.wxPublic.filter(item => item.code === row.wxCode).length > 0 ?
                                        this.state.wxPublic.filter(item => item.code === row.wxCode)[0].name : ""
                                }
                            </div>
                        )
                    }
                },
                {
                    title: "发送类型",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.type ? row.type === "text" ? "文字消息" : row.type === "image" ? "图片消息" : "图文消息（外链）" : ""}</div>
                        )
                    }
                },
                {
                    title: "发送时间",
                    dataIndex: "createTime",
                    key: "createTime",
                },
                {
                    title: "执行时间",
                    dataIndex: "ExecutionTime",
                    key: "ExecutionTime",
                },
                {
                    title: "成功数",
                    dataIndex: "successNum",
                    key: "successNum",
                },
                {
                    title: "失败数",
                    dataIndex: "errorNum",
                    key: "errorNum",
                },
            ]
        }
    }
    render() {
        const { addressList, listType } = this.state;
        return (
            <div className="address_page">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>客服消息</Breadcrumb.Item>
                    </Breadcrumb>

                }
                    extra={
                        listType == 0 ?
                            <div>
                                <Button type="primary"
                                    style={{ margin: "0 0 0 20px" }}
                                    onClick={() => {
                                        this.setState({
                                            visible: true
                                        }, () => {
                                            this.refs.getMyModal.getFormData(1)
                                        })
                                    }}
                                >新增客服消息</Button>
                                <Button type="primary"
                                    style={{ margin: "0 0 0 20px" }}
                                    onClick={() => {
                                        this.refs.getMyModal.openMaterialModal()
                                    }}
                                >新增客服消息素材</Button>
                            </div> : ""
                    }
                >
                    <Tabs defaultActiveKey="0" tabPosition={"top"}
                        onChange={(val) => {
                            console.log(val)
                            if (val == 0) {
                                this.getMsg()
                            } else {
                                this.getMsgLog()
                            }
                            this.setState({
                                listType: val,
                                loading:true
                            })
                        }}
                    >
                        {
                            addressList.map((r, i) => (
                                <TabPane tab={r.name} key={i}>
                                    <Table
                                        dataSource={this.state.lists}
                                        scroll={{ x: 1300 }}
                                        rowKey={item => item.id}
                                        expandable={{
                                            expandedRowRender: record => <p style={{ margin: 0 }}>{record.info}</p>,
                                            // rowExpandable: record => record.info !== '',
                                        }}
                                        loading={this.state.loading}
                                        columns={this.state.columnsList}
                                        pagination={{
                                            current: this.state.page,
                                            pageSize: this.state.pageSize,
                                            total: this.state.total,
                                            onChange: this.changeSize,
                                        }}
                                         />
                                </TabPane>
                            ))
                        }
                    </Tabs>

                </Card>
                <MyModel visible={this.state.visible} userTagList={this.state.userTagList} wxPublic={this.state.wxPublic}
                    closeModel={() => { this.setState({ visible: false }) }} getMsg={this.getMsg.bind(this)}
                    ref="getMyModal"
                />
            </div>
        )
    }
    componentDidMount() {
        this.setState({
            // loading:true
        })
        this.getPublicList()
        this.getMsg()
        this.getUserTag()
    }
    changeSize = (page, pageSize) => {
        // 分页获取
        this.setState({
          page,
          pageSize
        }, () => {
            if(this.state.listType == 0){
                this.getMsg()
            }else{
                this.getMsgLog()
            }
        })
    
      }
    getMsg() {
        let params = {
            messageType: "custom",
            page: { currentPage: this.state.page, pageSize:this.state.pageSize}
        }
        getMsg(params).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    columnsList: this.state.columns,
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
    getMsgLog() {
        let params = {
            messageType: "custom",
            page: { currentPage: this.state.page, pageSize:this.state.pageSize}
        }
        getMsgLog(params).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    columnsList: this.state.columnsLog,
                    lists: res.data.data,
                    loading: false
                })
            } else {
                this.setState({
                    lists: [],
                    loading: false
                })
            }
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
    getUserTag() {
        getUserTag({}).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    userTagList: res.data.data
                })
            }
        })
    }
    getWords(item) {
        let arr = []
        if (item.tag != "") {
            arr = Array.isArray(item.tag) ? item.tag : item.tag.split(",")
            let someArr = this.state.userTagList.filter(item => [...arr].some(h => h == item.code))
            let str = []
            someArr.forEach(r => {
                str.push(r.name)
            })
            return str.join(",")
        } else {
            return ""
        }
    }
    delArt(item) {
        Modal.confirm({
          title: '删除此消息',
          content: '确认删除？',
          onOk: () => {
            this.deleteMsg(item)
          },
          onCancel: () => {
    
          }
        })
      }
    deleteMsg(val){
        deleteMsg({id:val.id}).then(res=>{
          if(res.data.errCode === 0){
            this.getMsg()
            message.success("删除成功")
          }else{
            message.error("删除失败")
          }
        })
      }
}
