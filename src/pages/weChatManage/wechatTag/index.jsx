/*
 * @Author: yzc
 * @Date: 2021-12-21 10:48:36
 * @LastEditors: yzc
 * @LastEditTime: 2021-12-21 10:57:49
 * @Description: 创建@映射src 例如：引入控件可使用 MySyncBtn
 */
import React, { Component } from 'react'
import { corptagtasks, addcorptagtask, delcorptagtask, corptagtaskstatus, requestNewAdTagList, getWechatList, getFansTag, getWechatUser, corptags } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MySyncBtn, MyImageUpload } from "@/components/views.js"

import util from 'utils'
// import "./style.css"
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
            pageSize: 10,
            total: 0,
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 48 },
            },
            lists: [],
            visible: false,
            currentItem: "",
            source: "",
            searchWord: {},
            dict_user_tags: [],
            wechatList: [],
            corptagsList: [],
            allUserList: [],
            selectProps: {
                optionFilterProp: "children",
                // filterOption(input, option){
                //   return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // },
                showSearch() {
                    console.log('onSearch')
                }
            },
            columns: [
                {
                    title: "标签",
                    dataIndex: "tagName",
                    key: "tagName",
                    // render: (rowValue, row, index) => {
                    //     return (
                    //         <div>{this.getTagsName(rowValue)}</div>
                    //     )
                    // }
                },
                {
                    title: "电视家用户标签",
                    dataIndex: "qyTagName",
                    key: "qyTagName",
                },
                {
                    title: "标签人数",
                    dataIndex: "sucNum",
                    key: "sucNum",
                },
                {
                    title: "公司",
                    dataIndex: "qywechatCode",
                    key: "qywechatCode",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getTagsName(rowValue)}</div>
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
                                {/* 0-未开始；1-进行中；2-已完成 */}
                                {/* {rowValue === 1 ? "未开始" : rowValue === 2 ? "进行中" : rowValue === 3 ? "已完成" : "未知"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.status = val ? 1 : 2
                                        this.corptagtaskstatus(obj)
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "任务状态",
                    dataIndex: "taskStatus",
                    key: "taskStatus",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* 0-未开始；1-进行中；2-已完成 */}
                                {rowValue === 1 ? "未开始" : rowValue === 2 ? "进行中" : rowValue === 3 ? "已完成" : "未知"}
                                {/* <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.state = val ? 1 : 0
                                        this.corptagtaskstatus(obj)

                                    }}
                                /> */}
                            </div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 110,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
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
        let { lists, layout, loading, columns, entranceState, wechatList, corptagsList, allUserList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>企微标签</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
                            {/* <Button type="primary"  onClick={this.getEarnTskList.bind(this)}>刷新</Button> */}
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
                            <MySyncBtn type={26} name='同步企业微信标签' />
                        </div>
                    }
                >
                    <Table
                        dataSource={lists}
                        scroll={{ x: 1200, y: '75vh' }}
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
                <Modal title="新建" centered visible={entranceState} onCancel={() => {
                    this.setState({ entranceState: false })
                    this.formRef.current.resetFields()
                }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="公司" name="qywechatCode" rules={[{ required: true, message: '请选择公司' }]}>
                                <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择公司"
                                    onChange={(e) => {
                                        this.getWechatUser(e)
                                        this.corptags(e)
                                    }}
                                >
                                    {wechatList.map((item, index) => (
                                        <Option value={item.code} key={item.code}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="电视家用户标签" name="qyTagId" rules={[{ required: true, message: '电视家用户标签' }]} >
                                <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择电视家用户标签">
                                    {corptagsList.map((item, index) => (
                                        <Option value={item.tagId} key={index}>{item.tagName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label='用户标签' name="tagCode" rules={[{ required: true, message: '请选择用户设备标签' }]}>
                                <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择用户设备标签"
                                    filterOption={(input, option) => {
                                        if (!input) return true;
                                        let children = option.children;
                                        if (children) {
                                            let key = children[2];
                                            let isFind = false;
                                            isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                            if (!isFind) {
                                                let code = children[0];
                                                isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                            }

                                            return isFind;
                                        }
                                    }}>
                                    {this.state.dict_user_tags.map((item, index) => (
                                        <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="客服联系人" name="userids">
                                <Select
                                    placeholder="请输入客服联系人"
                                    allowClear
                                    mode="multiple"
                                    {...this.state.selectProps}
                                >
                                    {
                                        allUserList.map((r, i) => {
                                            return (
                                                <Option value={r.userid} key={i}>
                                                    <img src={r.avatar} alt="" style={{ width: "20px" }} />
                                                    {r.name}
                                                    {r.limit ? "---" + r.limit : ""}
                                                </Option>
                                            )

                                        })
                                    }

                                </Select>
                            </Form.Item>
                            <Form.Item label="状态" name="status" valuePropName="checked">
                                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
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
    async componentDidMount() {
        await this.corptagtasks();
        await this.getWechatList()
        await this.requestNewAdTagList()
    }
    changeSize = (page, pageSize) => {   // 分页
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.corptagtasks()
        })
    }
    async getWechatUser(val) {  //获取全部客服
        await getWechatUser({ qywechatCode: val }).then(res => {
            this.setState({
                allUserList: res.data
            }, () => {
                // this.getCount(val)
            })
        })
    }
    corptags(val) {
        let params = { qywechatCode: val }
        corptags(params).then(res => {
            console.log(res.data)
            this.setState({
                corptagsList: res.data
            })
        })
    }
    getWechatList() {
        getWechatList({}).then(res => {
            console.log(res.data)
            this.setState({
                wechatList: res.data
            })
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // return
        this.addcorptagtask(val)
        this.closeModal()
    }

    corptagtasks() {
        let params = {
        }
        corptagtasks(params).then(res => {
            this.setState({
                lists: res.data
            })
        })
    }
    closeModal() {
        this.formRef.current.resetFields()
        this.setState({
            entranceState: false
        })
    }
    addcorptagtask(val) {
        let arr = this.state.corptagsList.filter(item=>item.tagId == val.qyTagId)
        val.qyTagName = arr.length>0?arr[0].tagName : ""
        let tagList = this.state.dict_user_tags.filter(item=>item.code == val.tagCode)
        val.tagName = tagList.length>0?tagList[0].name : ""
        let params = {
            ...val,
            status: val.status ? 1 : 2,
            qyuserids: Array.isArray(val.userids) ? val.userids.join(",") : ""
        }
        addcorptagtask(params).then(res => {
            this.corptagtasks()
            message.success("新增成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delcorptagtask(obj)
            },
            onCancel: () => {
            }
        })
    }
    delcorptagtask(item) {
        let params = {
            id: item.id
        }
        delcorptagtask(params).then(res => {
            message.success("删除成功")
            this.corptagtasks()
        })
    }
    corptagtaskstatus(item) {
        let params = {
            id:item.id,
            status:item.status
        }
        corptagtaskstatus(params).then(res => {
            message.success("修改成功")
            this.corptagtasks()
        })
    }
    // 获取用户标签
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                dict_user_tags: res.data,
            }, () => {
                this.forceUpdate();
            });
        })
    }
    getTagsName(val) {
        let arr = this.state.wechatList.filter(r => r.code == val)
        if (arr.length > 0) {
            return arr[0].name
        } else {
            return ""
        }
    }
}