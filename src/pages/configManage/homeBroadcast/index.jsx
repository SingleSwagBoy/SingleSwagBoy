/*
 * @Author: yzc
 * @Date: 2021-12-27 18:41:39
 * @LastEditors: yzc
 * @LastEditTime: 2021-12-27 13:34:43
 * @Description: 首页改版优化移动端3.0.0版本
 */
import React, { Component } from 'react'
// import request from 'utils/request'
import { getHomeList, uploadHomeList, getStateHomeList, setStateHomeList,addTab } from 'api'
import { Card, Breadcrumb, Button, message, Tabs, Table, InputNumber, Switch } from 'antd'
import request from 'utils/request.js'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import { MySyncBtn, } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { TabPane } = Tabs;
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
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
                "央视", "卫视"
            ],
            currentSort: 0,
            editIndex: null,
            tabIndex: 1,
            tabState: false,
            activeKey:0,
            columns: [
                {
                    title: "序号",
                    dataIndex: "sort",
                    key: "sort",
                    width: 200,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    index == this.state.editIndex ?
                                        <InputNumber min={0} step={10} defaultValue={rowValue} onChange={(e) => {
                                            console.log(e)
                                            this.setState({
                                                currentSort: e
                                            })
                                        }} />
                                        :
                                        <div>{rowValue}</div>
                                }

                            </div>
                        )
                    }
                },
                {
                    title: "展示频道",
                    dataIndex: "channelName",
                    key: "channelName",
                },
                {
                    title: "操作",
                    key: "action",
                    // width: 500,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    this.state.editIndex == index ?
                                        <Button
                                            style={{ margin: "0 10px" }}
                                            size="small"
                                            type="dashed"
                                            onClick={() => {
                                                console.log(row)
                                                this.setState({
                                                    editIndex: null
                                                }, () => {
                                                    this.uploadHomeList(row)
                                                })
                                            }}
                                        >确认</Button>
                                        :
                                        <Button
                                            style={{ margin: "0 10px" }}
                                            size="small"
                                            type="primary"
                                            onClick={() => {
                                                console.log(row)
                                                this.setState({
                                                    currentSort: row.sort,
                                                    editIndex: index
                                                })
                                            }}
                                        >编辑</Button>

                                }
                            </div>
                        )
                    }
                }

            ],
        }
    }
    render() {
        const { addressList } = this.state;
        return (
            <div className="address_page">
                {/* <div style={{fontSize:"20px"}}>首页直播配置</div> */}
                <Card  >

                    <Tabs
                        // defaultActiveKey="0"
                        tabPosition={"top"}
                        centered={true}
                        type="editable-card"
                        activeKey={this.state.activeKey.toString()}
                        onEdit={(targetKey,action)=>{
                            console.log(targetKey,action)
                            if(action == "add"){
                                this.addTab()
                            }
                        }}
                        onChange={(val) => {
                            console.log(val)
                            this.setState({
                                loading: true,
                                editIndex: null,
                                tabIndex: Number(val) + 1,
                                activeKey:val
                            }, () => {
                                this.getHomeList(this.state.tabIndex)
                                this.getStateHomeList()
                            })

                        }}
                    >
                        {
                            addressList.map((r, i) => (
                                <TabPane tab={r} key={i}  closable={false}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Switch checkedChildren="已开启" unCheckedChildren="已关闭" key={new Date().getTime()}
                                            defaultChecked={this.state.tabState == 1 ? true : false}
                                            onChange={(e) => {
                                                this.setStateHomeList(e)
                                            }}
                                        />
                                        <MySyncBtn type={18} name='同步缓存' params={{ "channelType": this.state.tabIndex }} />
                                    </div>
                                    <Table
                                        dataSource={this.state.lists}
                                        rowKey={i}
                                        loading={this.state.loading}
                                        columns={this.state.columns} />
                                </TabPane>
                            ))
                        }
                    </Tabs>

                </Card>
            </div>
        )
    }
    componentDidMount() {
        this.setState({
            loading: true,
            tabIndex: 1
        }, () => {
            this.getHomeList(this.state.tabIndex)
            this.getStateHomeList()
        })
    }
    getHomeList(index) {
        let params = {
            channelType: index
        }
        getHomeList(params).then(res => {
            this.setState({
                loading: false,
                lists: res.data.data
            })
        })
    }
    uploadHomeList(item) {
        let params = {
            id: item.id,
            sort: this.state.currentSort
        }
        uploadHomeList(params).then(res => {
            this.getHomeList(this.state.tabIndex)
        })
    }
    getStateHomeList() {
        let params = {
            channelType: this.state.tabIndex
        }
        getStateHomeList(params).then(res => {
            console.log(res.data)
            this.setState({
                tabState: res.data.data.status
            })
            // this.getHomeList(this.state.tabIndex)
        })
    }
    setStateHomeList(val) {
        let params = {
            channelType: this.state.tabIndex,
            status: val ? 1 : 0
        }
        setStateHomeList(params).then(res => {
            console.log(res.data)
            message.success("修改成功")
        })
    } 
    //新增
    addTab(){
        addTab({}).then(res=>{
            console.log(res)
        })
    }
}
