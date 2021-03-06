import React, { Component } from 'react'
import { getQrcodeConfig,bigwechatsPublic, requestNewAdTagList, saveQrcodeConfig, getWechatUser, getMyWechatUser, saveMyWechatUser, getWechatList, getCount,getexcluswitch,setexcluswitch,listextraGet,setextra } from 'api'
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
            public_list: [
                {  wxCode: "dsj_server",name:   "电视家服务号" },
                {  wxCode: "dsj_welfare",name:   "电视家福利号" },
                {  wxCode: "dsj_reader",name:   "电视家权益号"},
                {  wxCode: "dsj_helper",name:   "电视家助手"},
            ],
            activityCode: "",//当前激活的哪一个qywechatCode
            switchState:"",
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
                            <div>{rowValue == "loginmini" ? "小程序登录" : rowValue == "loginwechat" ? "公众号登录" : rowValue == "exclusivemini" ? "小程序" : rowValue == "exclusivewechat" ? "关注公众号小号" :  rowValue == "exclusiveworkwx" ? "企业微信":rowValue == "exclusivebigwechat" ? "关注公众号大号":""}</div>
                        )
                    }
                },
                {
                    title: "排序",
                    dataIndex: "sort",
                    key: "sort",
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
                    title: "解锁人数/当日展示量",
                    dataIndex: "unlockNum",
                    key: "unlockNum",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue}/{row.showNum}</div>
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
                                                        activityCode: arr.qywechatCode
                                                    })
                                                    if(row.code=="exclusivemini" || row.code=="exclusivewechat" || row.code=="exclusiveworkwx" || row.code=="exclusivebigwechat"){
                                                        let params={
                                                            exclusiveType:row.code=="exclusivemini"?"mp":row.code=="exclusivewechat"?"wx":row.code=="exclusiveworkwx"?"workwx":row.code=="exclusivebigwechat"?"bigwx":""
                                                         }
                                                         listextraGet(params).then(res=>{
                                                             let obj={
                                                                 ...arr,
                                                                 ...res.data.data
                                                             }
                                                             this.formRef.current.setFieldsValue(obj);
                                                             this.forceUpdate();
                                                         })
                                                    }else{
                                                        this.formRef.current.setFieldsValue(arr);
                                                        this.forceUpdate();
                                                    }
                                                    
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
            curentWindow:"",
        }
    }
    render() {
        let { lists, layout, loading, columns, entranceState, tagList, allUserList,public_list } = this.state;
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
                            <Switch
                                    checkedChildren="开启"
                                    unCheckedChildren="关闭"
                                    defaultChecked={this.state.switchState == "open" ? true : false}
                                    key={this.state.switchState}
                                    onChange={(val) => {
                                        this.setexcluswitch(val)
                                    }}
                                />
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
                                        <Tabs defaultActiveKey="0" centered onChange={async (e) => {
                                            console.log(e)
                                            let code = this.state.wechatList[e].code
                                            await this.getWechatUser(code)
                                            this.getMyWechatUser(code)
                                            this.getCount(code)
                                            // this.forceUpdate()
                                            this.setState({
                                                activityCode: code
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
                                                                                                            {r.limit ? "---" + r.limit : ""}
                                                                                                        </Option>
                                                                                                    )

                                                                                                })
                                                                                            }

                                                                                        </Select>
                                                                                    </Form.Item>
                                                                                    <Button type="dashed" style={{ marginBottom: "28px" }} onClick={() => {
                                                                                        if (this.formRef.current.getFieldValue("userList").length == 1) return message.error("请保留至少一条")
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
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("code") == "exclusivebigwechat" &&
                                <Form.Item label="公众号" name="wxcode">
                                    <Select placeholder="请选择类别" dropdownMatchSelectWidth={true} 
                                    onChange={(val)=>{
                                        console.log(val);
                                        this.formRef.current.setFieldsValue({ "num": 0 })
                                        this.forceUpdate();
                                    }}
                                    allowClear>
                                        {
                                            public_list.map((item,index)=>{
                                                return <Option value={item.wxCode} key={item.wxCode} name={item.name}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            }
                            {
                                this.formRef.current && (this.formRef.current.getFieldValue("code") == "exclusivemini" || this.formRef.current.getFieldValue("code") == "exclusivewechat" || this.formRef.current.getFieldValue("code") == "exclusivebigwechat") &&
                                <Form.Item label="展示量" name="showLimit">
                                    <InputNumber min={0} />
                                </Form.Item>
                            }
                            <Form.Item label="排序" name="sort">
                                <InputNumber min={1}/>
                            </Form.Item>
                            <Form.Item label="标题" name="title">
                                <Input  laceholder="请填写标题" />
                            </Form.Item>
                            <Form.Item label="副标题" name="subtitle">
                                <Input  laceholder="请填写副标题" />
                            </Form.Item>
                            <Form.Item label="更多频道标题" name="moreTitle">
                                <Input  laceholder="请填写" />
                            </Form.Item>
                            <Form.Item label="更多频道副标题" name="moreSubtitle">
                                <Input  laceholder="请填写" />
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
        this.setState({
            curentWindow:(window.location.host.includes("localhost") || window.location.host.includes("test") )?"test":"product"
        },()=>{console.log("this.state.curentWindow",this.state.curentWindow)})
        this.requestNewAdTagList()
        this.getWechatList()
        this.getexcluswitch()
        this.getPublicBigList()
    }
    getPublicBigList=()=>{
        bigwechatsPublic({}).then(res=>{
            console.log("bigwechatsPublic=bigwechatsPublic",res)
            if(res.data.errCode==0){
                if(this.state.curentWindow=="test"){
                    this.setState({
                        public_list:res.data.data
                    })
                }
            }
        })
    }
    getexcluswitch(){
        getexcluswitch({}).then(res => {
            this.setState({
                switchState: res.data
            });
        })
    }
    setexcluswitch(val){
        setexcluswitch({config:val?"open":"close"}).then(res => {
            message.success("设置成功")
        })
    }
    //获取标签信息
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                tagList: res.data || [],
            },()=>{
                this.getQrcodeConfig();
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
        this.saveQrcodeConfig(val) //保存其他数据
        this.saveMyWechatUser(val) //保存联系人
        val.exclusiveType=this.state.currentItem.code=="exclusivemini"?"mp":this.state.currentItem.code=="exclusivewechat"?"wx":this.state.currentItem.code=="exclusiveworkwx"?"workwx":this.state.currentItem.code=="exclusivebigwechat"?"bigwx":"";
        console.log(val, "val")
        setextra(val).then(res=>{
            console.log("setextra",res)
        })
        this.getQrcodeConfig()
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
            console.log("getQrcodeConfig",res)
            this.setState({
                lists: res.data
            })
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
            console.log(this.state.allUserList, "allUserList")
            let keys = Object.keys(res.data)
            let arr = this.state.allUserList
            keys.forEach(r => {
                arr.forEach(l => {
                    if (r == l.userid) {
                        l.limit = res.data[r]
                    }
                })
            })
            this.setState({ allUserList: arr })
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
        console.log("info",info)
        let arr = []
        if(info){
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
}