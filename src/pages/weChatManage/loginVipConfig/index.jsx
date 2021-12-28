import React, { Component } from 'react'
import { getQrcodeConfig, requestNewAdTagList, saveQrcodeConfig, getWechatUser, getMyWechatUser, saveMyWechatUser, getWechatList, getCount } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Divider, Tabs } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
const { TabPane } = Tabs;
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
            allUserList: [],
            wechatList: [],
            activityCode:"",//当前激活的哪一个qywechatCode
            columns: [
                {
                    title: "位置",
                    dataIndex: "position",
                    key: "position",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == "login" ? "登录" : rowValue == "exclusive" ? "专享解锁" : "未知"}</div>
                        )
                    }
                },
                {
                    title: "功能",
                    dataIndex: "code",
                    key: "code",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == "loginmini" ? "小程序登录" : rowValue == "loginwechat" ? "公众号登录" : rowValue == "exclusivemini" ? "小程序解锁" : rowValue == "exclusivewechat" ? "关注公众号解锁" : "企业微信解锁"}</div>
                        )
                    }
                },
                {
                    title: "上线时间-下线时间",
                    dataIndex: "onlineTime",
                    key: "onlineTime",
                    width: 350,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.start != 0 ? util.formatTime(row.start, "") : "未知"} - {row.end != 0 ? util.formatTime(row.end, "") : "未知"}</div>
                        )
                    }
                },
                {
                    title: "用户标签",
                    dataIndex: "tagCode",
                    key: "tagCode",
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
                            <div>{<Switch
                                checkedChildren="有效"
                                unCheckedChildren="无效"
                                disabled={index < 2}
                                defaultChecked={rowValue === 1 ? true : false}
                                key={rowValue}
                                onChange={(val) => {
                                    let info = JSON.parse(JSON.stringify(row))
                                    info.status = val ? 1 : 0
                                    this.saveQrcodeConfig(info, "change")
                                }}
                            />}</div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 100,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    //登录暂时不能编辑
                                    index > 1
                                        ?
                                        <Button
                                            style={{ margin: "0 10px" }}
                                            size="small"
                                            type="primary"
                                            onClick={() => {
                                                console.log(row)
                                                this.setState({
                                                    entranceState: true,
                                                    currentItem: row,
                                                }, async () => {
                                                    let arr = JSON.parse(JSON.stringify(row))
                                                    arr.time = [arr.start ? moment(arr.start * 1000) : "", arr.end ? moment(arr.end * 1000) : ""]
                                                    arr.status = arr.status == 1 ? true : false
                                                    arr.qywechatCode = this.state.wechatList.length > 0 ? this.state.wechatList[0].code : null
                                                    this.setState({
                                                        activityCode:arr.qywechatCode
                                                    })
                                                    this.formRef.current.setFieldsValue(arr)
                                                    this.forceUpdate()
                                                    await this.getWechatUser(arr.qywechatCode)
                                                    await this.getMyWechatUser(arr.qywechatCode)
                                                    await this.getCount(arr.qywechatCode)

                                                })
                                            }}
                                        >编辑</Button>
                                        : ""
                                }
                            </div>
                        )
                    }
                }
            ],
        }
    }
    render() {
        let { lists, layout, loading, columns, entranceState, tagList, allUserList } = this.state;
        return (
            <div className="loginVip">
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>登录(专享)配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
                            <MySyncBtn type={23} name='同步企业微信数据' />
                            <MySyncBtn type={22} name='同步缓存' />
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
                <Modal title="编辑" centered visible={entranceState} onCancel={() => {
                    this.setState({ entranceState: false })
                    this.formRef.current.resetFields()
                }} footer={null} width={1000}>

                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("code") == "exclusiveworkwx"
                                    ?

                                    <>
                                        <Tabs defaultActiveKey="0" centered onChange={async(e) => {
                                            console.log(e)
                                            let code = this.state.wechatList[e].code
                                            await this.getWechatUser(code)
                                            this.getMyWechatUser(code)
                                            this.getCount(code)
                                            // this.forceUpdate()
                                            this.setState({
                                                activityCode:code
                                            })
                                        }}>
                                            {
                                                this.state.wechatList.map((r, i) => {
                                                    return (
                                                        <TabPane tab={r.name} key={i}>
                                                            <Form.Item label="选择客服联系人">
                                                                <Form.List name="userList">
                                                                    {(fields, { add, remove }) => (
                                                                        <>
                                                                            {fields.map((field, index) => (
                                                                                <Space key={field.key} align="baseline" style={{ width: "100%", display: "flex", "flexWrap": "wrap", alignItems: "center", borderBottom: "1px dashed #ccc", marginBottom: "10px" }}>

                                                                                    {/* <div key={field.key} > */}
                                                                                    {/* <Divider>第{index + 1}条</Divider> */}
                                                                                    <Form.Item  {...field} label="出二维码次数" name={[field.name, 'showLimit']} fieldKey={[field.fieldKey, 'showLimit']}
                                                                                        rules={[{ required: true, message: '出二维码次数' }]}
                                                                                    >
                                                                                        <InputNumber min={0} />
                                                                                    </Form.Item>

                                                                                    <Form.Item  {...field} label="客服联系人" name={[field.name, 'userId']} fieldKey={[field.fieldKey, 'userId']}
                                                                                        rules={[{ required: true, message: '客服联系人' }]}
                                                                                        style={{ width: "600px" }}
                                                                                    >
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
                                                                                                            {r.limit?"---"+r.limit:""}
                                                                                                        </Option>
                                                                                                    )

                                                                                                })
                                                                                            }

                                                                                        </Select>
                                                                                    </Form.Item>
                                                                                    <Button type="dashed" style={{ marginBottom: "28px" }} onClick={() => {
                                                                                        if(this.formRef.current.getFieldValue("userList").length==1)return message.error("请保留至少一条")
                                                                                        remove(field.name)
                                                                                    }} icon={<MinusCircleOutlined />}>
                                                                                        删除
                                                                                    </Button>

                                                                                    {/* </div> */}

                                                                                </Space>
                                                                            ))}
                                                                            <Form.Item style={{ marginTop: "20px" }}>
                                                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                                    新建客服联系人
                                                                                </Button>
                                                                            </Form.Item>
                                                                        </>
                                                                    )}
                                                                </Form.List>
                                                            </Form.Item>
                                                        </TabPane>
                                                    )
                                                })

                                            }
                                        </Tabs>
                                    </>
                                    : ""
                            }
                            <Form.Item label="开始时间-结束时间" name="time">
                                <RangePicker placeholder={['开始时间', '结束时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="用户标签" name="tagCode">
                                <Select
                                    placeholder="请输入用户标签"
                                    allowClear
                                    {...this.state.selectProps}
                                >
                                    {
                                        tagList.map((r, i) => {
                                            return <Option value={r.code} key={i}>{r.name}</Option>
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

    componentDidMount() {
        this.getQrcodeConfig();
        this.requestNewAdTagList()
        this.getWechatList()
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
        this.saveQrcodeConfig(val) //保存其他数据
        this.saveMyWechatUser(val) //保存联系人
        this.closeModal()
    }

    getWechatList() {
        getWechatList({}).then(res => {
            console.log(res.data)
            this.setState({
                wechatList: res.data
            })
        })
    }
    getQrcodeConfig() {
        getQrcodeConfig({}).then(res => {
            this.setState({
                lists: res.data
            })
        })
    }
    async getWechatUser(val) {  //获取全部客服
        await getWechatUser({ qywechatCode: val }).then(res => {
            this.setState({
                allUserList: res.data
            },()=>{
                // this.getCount(val)
            })
        })
    }
    getMyWechatUser(val) {  //获取选中客服
        getMyWechatUser({ qywechatCode: val }).then(res => {
            let info = JSON.parse(JSON.stringify(res.data))
            info.forEach(r => {
                r.userId = r.userids ? r.userids.split(",") : []
            })
            this.formRef.current.setFieldsValue({ "userList": info })
        })
    }
    getCount(val) {  //获取选中客服次数
        getCount({ qywechatCode: val }).then(res => {
            console.log(this.state.allUserList,"allUserList")
            let keys = Object.keys(res.data)
            let arr = this.state.allUserList
            keys.forEach(r=>{
                arr.forEach(l=>{
                    if(r == l.userid){
                        l.limit = res.data[r]
                    }
                })
            })
            this.setState({allUserList:arr})
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    saveQrcodeConfig(val, type) {
        let params = ""
        if (type == "change") {
            params = {
                ...val
            }
        } else {
            params = {
                ...this.state.currentItem,
                ...val,
                start: parseInt(val.time[0].valueOf() / 1000),
                end: parseInt(val.time[1].valueOf() / 1000),
                status: val.status ? 1 : 0,
                // qywechatCode:this.state.activityCode
            }
            delete params.userList
        }
        // return console.log(params,"params")
        saveQrcodeConfig(params).then(res => {
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
    saveMyWechatUser(val) {
        let info = val.userList
        let arr = []
        info.forEach(r => {
            arr.push({
                "qywechatCode": this.state.activityCode,   //企业微信code码
                "userids": r.userId.join(","),   //企业微信客服列表里面的userid
                "showLimit": r.showLimit   // 二维码次数限制
            })
        })
        let params = arr
        // return console.log(params)

        saveMyWechatUser(params).then(res => {
            message.success("保存联系人成功")
        })
    }
}