import React, { Component } from 'react'
import { getQrcodeConfig, requestNewAdTagList, updateSource,} from 'api'
import { Radio, Card,Breadcrumb, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
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
                wrapperCol: { offset: 16, span: 48},
            },
            lists: [],
            tagList: [],
            currentItem: "",
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
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                    width: 200,
                },
                {
                    title: "推荐频道",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == 1 ? "推荐频道":rowValue == 2?"自动填充":"未知"}</div>
                        )
                    }
                },
                {
                    title: "用户标签",
                    dataIndex: "tag",
                    key: "tag",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getTagsName(rowValue)}</div>
                        )
                    }
                },
                {
                    title: "上线时间-下线时间",
                    dataIndex: "onlineTime",
                    key: "onlineTime",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.onlineTime * 1000, "")} - {util.formatTime(row.offlineTime * 1000, "")}</div>
                        )
                    }
                },
                {
                    title: "排序",
                    dataIndex: "sortOrder",
                    key: "sortOrder",
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.status = val ? 1 : 2
                                        this.setState({
                                            currentItem: "",
                                        }, () => {
                                            this.updateSource(obj, "change")
                                        })

                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "备注",
                    dataIndex: "remark",
                    key: "remark",
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 250,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(row)
                                        this.setState({
                                            entranceState: true,
                                            currentItem: row,
                                        }, () => {
                                            let arr = JSON.parse(JSON.stringify(row))
                                            this.formRef.current.setFieldsValue(arr)
                                            this.forceUpdate()
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
        let {  lists, layout, loading, columns, entranceState, tagList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                    <Breadcrumb>
                        <Breadcrumb.Item>登陆(专享)配置</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                }
                >
                    <Table
                        dataSource={lists}
                        scroll={{ x: 1500, y: '75vh' }}
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
                <Modal title="编辑" centered visible={entranceState} onCancel={() => { 
                    this.setState({ entranceState: false })
                    this.formRef.current.resetFields()
                     }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="用户标签" name="tag">
                                <Select
                                    placeholder="请输入用户标签"
                                    allowClear
                                    {...this.state.selectProps}
                                // onSearch={(val) => {
                                //     if (privateData.inputTimeOutVal) {
                                //         clearTimeout(privateData.inputTimeOutVal);
                                //         privateData.inputTimeOutVal = null;
                                //     }
                                //     privateData.inputTimeOutVal = setTimeout(() => {
                                //         if (!privateData.inputTimeOutVal) return;
                                //         this.getChannel(val)
                                //     }, 1000)
                                // }}
                                >
                                    {
                                        tagList.map((r, i) => {
                                            return <Option value={r.code} key={i}>{r.name}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="状态" name="status" valuePropName="checked">
                                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                            </Form.Item> */}

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
        this.getQrcodeConfig();
        this.requestNewAdTagList()
    }
    //获取标签信息
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                tagList: res.data || [],
            });
        })
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getQrcodeConfig()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // return
        this.updateSource(val)
        this.closeModal()
    }

    getQrcodeConfig() {
        getQrcodeConfig({}).then(res => {
            this.setState({
                lists: res.data
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    updateSource(val, type) {
        let params = ""
        if (type == "change") {
            params = {
                ...val
            }
        } else {
            params = {
                ...this.state.currentItem,
                ...val
            }
        }
        // return console.log(params,"params")
        updateSource(params).then(res => {
            this.getQrcodeConfig()
            message.success("更新成功")
        })
    }
    getTagsName(val) {
        let arr = this.state.tagList.filter(r => r.code == val)
        if (arr.length > 0) {
            return arr[0].name
        } else {
            return ""
        }
    }
}