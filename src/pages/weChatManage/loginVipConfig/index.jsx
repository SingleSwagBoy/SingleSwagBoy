import React, { Component } from 'react'
import { getQrcodeConfig, requestNewAdTagList, saveQrcodeConfig, getWechatUser, getMyWechatUser } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
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
                wrapperCol: { offset: 16, span: 48 },
            },
            lists: [],
            tagList: [],
            currentItem: "",
            userEdit: false,
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
            chooseUserList: [],
            noSavebtn:[],
            filterList:[],
            userType:null,
            columns: [
                {
                    title: "位置",
                    dataIndex: "position",
                    key: "position",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == "login" ? "登陆" : rowValue == "exclusive" ? "专享解锁" : "未知"}</div>
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
                    width: 300,
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
                            <div>{<Switch checkedChildren="有效" unCheckedChildren="无效" defaultChecked={rowValue === 1 ? true : false} />}</div>
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
        let { lists, layout, loading, columns, entranceState, tagList, allUserList,userType, chooseUserList,noSavebtn, userEdit,filterList } = this.state;
        return (
            <div className="loginVip">
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
                }} footer={null} width={800}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="800客服联系人" name="tagCode">
                                <div className="add_user" onClick={() => this.addUser(1)}><PlusOutlined />添加成员</div>
                                <div className="user_box">
                                    {
                                        this.getMyUserList(1).map(r => {
                                            return <div className="every_box"><img src={r.avatar} alt="" /> {r.name} <CloseOutlined /></div>
                                        })
                                    }
                                </div>
                            </Form.Item>
                            <Form.Item label="200客服联系人" name="tagCode">
                                <div className="add_user" onClick={() => this.addUser(2)}><PlusOutlined />添加成员</div>
                                <div className="user_box">
                                    {
                                        this.getMyUserList(2).map(r => {
                                            return <div className="every_box"><img src={r.avatar} alt="" /> {r.name} <CloseOutlined /></div>
                                        })
                                    }
                                </div>
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
                <Modal title="客服编辑" centered visible={userEdit} onCancel={() => {
                    this.setState({ userEdit: false,noSavebtn:chooseUserList})
                }} footer={null} width={800}>
                    <div className="add_dialog">
                        <div className="left">
                            <Input placeholder="请搜索你想要添加的客服" className="search_input" allowClear 
                            onChange={(e)=>{ //过滤搜索
                                let list = this.state.allUserList.filter(item=>item.name.includes(e.target.value))
                                if(list.length>0){
                                    this.setState({filterList:list})
                                }else{
                                    this.setState({filterList:[]})
                                }
                            }}
                            />
                            <div>全部成员</div>
                            <div className="list">
                                {
                                    filterList.map((r,i) => {
                                        return (
                                            <div className={`every_list ${this.getSplitArr(userType,r)?'activityClass':''}`}
                                            key={i}
                                            onClick={()=>{
                                                let arr = noSavebtn.filter(item => item.type == userType)
                                                if(arr.length>0){
                                                    let list = arr[0].userids?arr[0].userids.split(","):[]
                                                    let info = list.filter(l=>l == r.userid)
                                                    if(info.length == 0){ //增加
                                                        list.push(r.userid)
                                                        arr[0].userids = list.join(",")
                                                    }else{ //删除
                                                        let h = list.filter(l=>l != r.userid)
                                                        arr[0].userids = h.join(",")
                                                    }
                                                    console.log(111)
                                                    this.setState({noSavebtn:arr})
                                                }
                                            }}
                                            >
                                                <img src={r.avatar} alt="" />
                                                <div>{r.name}</div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                        <div className="left">
                            <div className="list" key={noSavebtn.length}>
                                <div>已选客服</div>
                                {
                                    this.getMyUserList(userType,1).map((r,i) => {
                                        return (
                                            <div className="every_list" key={i}>
                                                <img src={r.avatar} alt="" />
                                                <div>{r.name}</div>
                                                <div><CloseOutlined /></div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                    <div className="user_btn"><Button>取消</Button><Button type="primary" onClick={()=>{
                        console.log(this.getMyUserList(userType))
                    }}>确定</Button></div>
                </Modal>
            </div>
        )
    }
    getSplitArr(type,r){ //匹配哪些已经被选择了
        let arr = this.state.noSavebtn.filter(item => item.type == type)
        if(arr.length>0){
            let list = arr[0].userids?arr[0].userids.split(","):[]
            if(list.length>0){
                let info = list.filter(item=>item == r.userid)
                if(info.length>0){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return false
        }
        
    }
    getMyUserList(type,source) { //匹配初始选中的客服
        let arr = (source== 1?this.state.noSavebtn:this.state.chooseUserList).filter(item => item.type == type)
        if (arr.length > 0) {
            let h = arr[0].userids ? arr[0].userids.split(",") : []
            let l = this.state.allUserList.filter(item => h.some(l => item.userid == l))
            if (l.length > 0) {
                // console.log(l)
                return l
            } else {
                return []
            }
        } else {
            return []
        }
    }
    componentDidMount() {
        this.getQrcodeConfig();
        this.requestNewAdTagList()
        this.getWechatUser()
        this.getMyWechatUser()
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
        this.saveQrcodeConfig(val)
        this.closeModal()
    }

    getQrcodeConfig() {
        getQrcodeConfig({}).then(res => {
            this.setState({
                lists: res.data
            })
        })
    }
    getWechatUser() {  //获取全部客服
        getWechatUser({}).then(res => {
            this.setState({
                allUserList: res.data,
                filterList:res.data
            })
        })
    }
    getMyWechatUser() {  //获取全部客服
        getMyWechatUser({}).then(res => {
            let info = res.data
            this.setState({
                chooseUserList: info,
            },()=>{
                this.setState({
                    noSavebtn:JSON.parse(JSON.stringify(this.state.chooseUserList))
                })
            })
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
                ...val
            }
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
    addUser(type) {
        this.setState({ userEdit: true,userType:type,noSavebtn:this.state.chooseUserList })
    }
}