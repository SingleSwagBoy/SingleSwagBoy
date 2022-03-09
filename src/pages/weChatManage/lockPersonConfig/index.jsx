import React, { Component } from 'react'
import { getconfigsLogin,getconfigsstatus,getconfigsDelete, requestNewAdTagList, saveQrcodeConfig, getconfigsSync, getconfigsUpdate, getconfigsAdd, getWechatList, getCount,getexcluswitch,setexcluswitch } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Divider, Tabs } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
import { SortableElement } from 'react-sortable-hoc'
const { Option } = Select;
let { RangePicker } = DatePicker;
const { TabPane } = Tabs;
let privateData = {
    inputTimeOutVal: null
};
export default class LockPersonConfig extends React.Component {
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
                {  WxCode: "dsj_server",Name:   "电视家服务号" },
                {  WxCode: "dsj_welfare",Name:   "电视家福利号"},
                {  WxCode: "dsj_reader",Name:   "电视家权益号"}
            ],
            activityCode: "",//当前激活的哪一个qywechatCode
            switchState:"",
            columns: [
                { title: "名称", dataIndex: "name", key: "name"},
                {
                    title: "标签",
                    dataIndex: "tag",
                    key: "tag",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getTagsName(rowValue)}</div>
                        )
                    }
                },
                { title: "解锁天数", dataIndex: "days", key: "days"},
                { title: "排序", dataIndex: "sort", key: "sort",width:100, },
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
                    title: "状态",
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{<Switch
                                checkedChildren="有效"
                                unCheckedChildren="无效"
                                //disabled={index < 2}
                                defaultChecked={rowValue === 1 ? true : false}
                                key={rowValue}
                                onChange={(val) => {
                                    let info = JSON.parse(JSON.stringify(row))
                                    info.status = val ? 1 : 2
                                    this.saveConfig(info, "change")
                                }}
                            />}</div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 160,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(rowValue, row);
                                        this.setState({
                                            entranceState: true,
                                            currentItem: row,
                                        },()=>{
                                            let arr = JSON.parse(JSON.stringify(row))
                                            arr.time = [arr.start ? moment(arr.start * 1000) : "", arr.end ? moment(arr.end * 1000) : ""]
                                            arr.status = arr.status == 1 ? true : false
                                            this.formRef.current.setFieldsValue(arr)
                                            this.forceUpdate()
                                        })
                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteSubject(row) }}
                                >删除</Button>
                            </div>
                        )
                    }
                }
            ],
            searchWord:"", // 关键字搜索
            entranceState:false
        }
    }
    deleteSubject=(obj)=>{   // 删除
        let params={id:obj.id}
        Modal.confirm({
            title: `是否确认删除？`,
            content: '确认删除？',
            onOk: () => {
                getconfigsDelete(params).then(res=>{
                    console.log("getconfigsDelete",res)
                    if(res.data.errCode==0){
                        message.success("删除成功");
                        this.getconfigsLogin();
                    }
                })
            },
            onCancel: () => {
            }
        })
    }
    voteSyncCache=()=>{   // 同步缓存
        getconfigsSync({}).then(res=>{
            if(res.data.errCode==0){
                message.success("同步成功~")
            }
        })
    }
    saveConfig=(obj)=>{   // 更改状态
        console.log(obj)
        let params={
            id:obj.id,
            status:obj.status
        }
        getconfigsstatus(params).then(res=>{
            console.log("getconfigsstatus",res)
            if(res.data.errCode==0){
                message.success("修改成功")
                this.getconfigsLogin();
            }
        })
    }
    render() {
        let { layout, entranceState, tagList} = this.state;
        return (
            <div>
                <Card  title={
                    <div className="cardTitle">
                        <div className="everyBody">
                        <div>名称:</div>
                        <Input.Search
                            onChange={(val) => {
                                //this.state.searchWord = val
                            }}
                            onSearch={(val) => {
                                this.setState({
                                    page: 1,
                                    searchWord:val
                                }, () => {
                                    this.getconfigsLogin()
                                })
                            }} />
                        </div>
                    </div>
                    }
                    extra={
                        <div>
                            <Button type="primary" 
                            onClick={() => { this.setState({ visible: true, source: 1, currentItem: {}, defaultAddress: [] }) }}
                            onClick={() => {
                                this.setState({ entranceState: true,currentItem:{}, }, () => {
                                    this.formRef.current.resetFields();
                                    this.forceUpdate();
                                })
                            }}
                            >新增</Button>
                            <Button type="primary" style={{ margin: "0 10px" }} onClick={() => { this.voteSyncCache() }}>同步缓存</Button>
                        </div>
                    }>
                        <Table
                            dataSource={this.state.lists}
                            pagination={{
                                current: this.state.page,
                                pageSize: this.state.pageSize,
                                total: this.state.total,
                                onChange: this.changeSize,
                            }}
                            columns={this.state.columns} />

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
                            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请填写名称' }]}>
                                <Input  laceholder="请填写名称" />
                            </Form.Item>
                            
                            <Form.Item label="用户标签" name="tag">
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
                            <Form.Item label="解锁天数" name="days" rules={[{ required: true, message: '请填写' }]}>
                                <InputNumber min={1} />
                            </Form.Item>
                            <Form.Item label="排序" name="sort">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label="开始时间-结束时间" name="time">
                                <RangePicker placeholder={['开始时间', '结束时间']} showTime ></RangePicker>
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
        this.getconfigsLogin();
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
            this.getconfigsLogin()
        })
    }
    submitForm(obj) {   // 提交表单
        console.log(obj, "obj")
        if(this.state.currentItem.id){   // 修改
            let params={
                ...obj,
                status:obj.status?1:2,
                start: parseInt(obj.time[0].valueOf() / 1000),
                end: parseInt(obj.time[1].valueOf() / 1000),
                id:this.state.currentItem.id
            }
            console.log(params)
            getconfigsUpdate(params).then(res=>{
                console.log("getconfigsUpdate",res)
                if(res.data.errCode==0){
                    message.success("修改成功");
                    this.setState({
                        entranceState:false
                    })
                    this.formRef.current.resetFields();
                    this.getconfigsLogin();
                }else{
                    message.error(res.data.msg);
                }
            })
        }else{   // 新增
            let params={
                ...obj,
                status:obj.status?1:2,
                start: parseInt(obj.time[0].valueOf() / 1000),
                end: parseInt(obj.time[1].valueOf() / 1000),
            }
            getconfigsAdd(params).then(res=>{
                console.log("getconfigsAdd",res)
                if(res.data.errCode==0){
                    message.success("添加成功");
                    this.setState({
                        entranceState:false
                    })
                    this.formRef.current.resetFields();
                    this.getconfigsLogin();
                }else{
                    message.error(res.data.msg);
                }
            })
        }
    }

    getconfigsLogin() {   //  获取列表数据
        let params={
            name:this.state.searchWord,
            limit:this.state.pageSize,
            page:this.state.page,
        }
        getconfigsLogin(params).then(res => {
            console.log("getconfigsLogin",res);
            this.setState({
                lists: res.data.data.data,
                page:res.data.data.page,
                total:res.data.data.total,
                limit:res.data.data.limit,
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
                ...val,
                
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
    getTagsName=(val)=> {
        let arr = this.state.tagList.filter(r => r.code == val)
        if (arr.length > 0) {
            return arr[0].name
        } else {
            return ""
        }
    }
}