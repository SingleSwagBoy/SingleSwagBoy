import React, { Component } from 'react'
import { getWxlist, addRefresh, changeRefresh, delRefresh } from 'api'
import { Radio, Breadcrumb, Card, Menu, Button, message, Modal, Table, Input, Form, Select, Space, Image } from 'antd'
import { } from 'react-router-dom'
import { PlusOutlined, DeleteOutlined, HighlightOutlined, MinusCircleOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import DefaultMenu from "./defaultMenu"
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { SubMenu } = Menu;
const format = 'HH:mm';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            layout: {
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            visible: false,
            openPersonModal:false,
            currentItem: "",
            openModal:false,
            columns: [
                {
                    title: "公众号名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "通用菜单",
                    dataIndex: "defaultMenu",
                    key: "defaultMenu",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue ? "已配置" : "未配置"}</div>
                        )
                    }
                },

                {
                    title: "个性化菜单",  // //1:android,2:ios,3:全端
                    dataIndex: "personalMenuNum",
                    key: "personalMenuNum",
                },

                {
                    title: "操作",
                    key: "action",
                    // fixed: 'right', width: 210,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    // type="primary"
                                    onClick={() => {
                                        console.log(row, "row")
                                        this.setState({
                                            openModal: true,
                                            currentItem: JSON.parse(JSON.stringify(row))
                                        },()=>{
                                            this.child.openBox(this.state.currentItem)
                                        })
                                    }}
                                >编辑</Button>
                            </div>
                        )
                    }
                }
            ],

        }
    }
    render() {
        let { lists, loading, columns } = this.state;
        return (
            <div>
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>自定义微信菜单</Breadcrumb.Item>
                    </Breadcrumb>
                }
                    extra={
                        <div>
                            <MySyncBtn type={13} name='推送到微信' />
                        </div>
                    }
                >
                    <Table
                        dataSource={lists}
                        // scroll={{ x: 1500, y: '75vh' }}
                        // rowKey={item=>item.indexId}
                        loading={loading}
                        columns={columns}
                    />
                </Card>
                <DefaultMenu
                    openModal={this.state.openModal}
                    onCloseModal={this.closeModal.bind(this)}
                    menuInfo={this.state.currentItem}
                    onRefresh={this.getWxlist.bind(this)}
                    onRef={this.onRef.bind(this)}
                ></DefaultMenu>
                 {/* <Personal  openPersonModal={this.state.openPersonModal}></Personal> */}
            </div>
        )
    }
    componentDidMount() {
        this.getWxlist();
    }
    closeModal(val) {
        // if(val){
        //     this.setState({
        //         openPersonModal:true
        //     })
        // }
        this.setState({
            openModal: false,
        })
    }
    getWxlist() {
        getWxlist({}).then(res => {
            this.setState({
                lists: res.data
            })
        })
    }
    onRef = (ref) => {
        this.child = ref
    }
}