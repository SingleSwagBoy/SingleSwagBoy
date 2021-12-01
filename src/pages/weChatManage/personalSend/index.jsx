import React, { Component } from 'react'
import { getSend, materialSend, updateFansTag, delFansTag, getPublicList, everySend } from 'api'
import { Radio, Card, Popover, Button, message, Table, Modal, DatePicker, Input, Form, Select, Alert, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import MaterialDialog from "./materialDialog"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            totalCount:0,//素材
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
            lists: [],
            productLists: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            wxPublic: [],
            everyHis: [],
            user_tag: [],
            wxCode: "",
            start: "",
            end: "",
            materialShow:false,
            columns: [
                {
                    title: "发送记录",
                    dataIndex: "sendTime",
                    key: "sendTime",
                    width: 300,
                    render: (rowValue, row, index) => {
                        return (
                            <>
                                <div>{row.sendTime}</div>
                                {/* 1未发送2发送中3已发送4已取消 */}
                                <Popover content={this.getSendHisTemp(row)} trigger="hover">
                                    <Button size="small" type={row.status == 1 ? "danger" : row.status == 2 ? "primary" : row.status == 3 ? "dashed" : "ghost"}>
                                        {row.status == 1 ? "未发送" : row.status == 2 ? "发送中" : row.status == 3 ? "已发送" : "已取消"}
                                    </Button>
                                </Popover>

                            </>
                        )
                    }
                },
                {
                    key: "action",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    row.msgType == "text"
                                        ?
                                        <div>{row.content}</div>
                                        :
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <div><img src={row.cover} alt="" /></div>
                                            <div>
                                                <div>{row.content}</div>
                                                {
                                                    row.status == 3 ?
                                                        <div>
                                                            <Popover content={this.getDataDetail(row)} trigger="click">
                                                                <Button size="small" style={{ margin: "0 20px 0 0" }} onClick={() => this.everySend(row.id)}>数据详情</Button>
                                                            </Popover>

                                                            <Button size="small" danger>删除</Button>
                                                        </div>
                                                        :
                                                        ""
                                                }

                                            </div>
                                        </div>
                                }
                            </div>
                        )
                    }
                }
            ],
        }
    }
    render() {
        let { wxPublic, lists, layout, loading, columns, entranceState, user_tag } = this.state;
        return (
            <div>
                <Card title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ margin: "0 20px 0 0" }}>日期</div>
                        <div><RangePicker showTime onChange={(e) => {
                            this.setState({
                                start: e ? moment(e[0]).format(format) : "",
                                end: e ? moment(e[1]).format(format) : ""
                            }, () => {
                                this.getSend()
                            })
                        }} />    </div>
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
                            >新建推送</Button>
                        </div>
                    }
                >
                    <Radio.Group defaultValue={this.state.wxCode} style={{ marginBottom: "16px" }} onChange={(e) => {
                        this.setState({
                            wxCode: e.target.value
                        }, () => {
                            this.getSend()
                        })
                    }}>
                        {
                            wxPublic.map((r, i) => {
                                return <Radio.Button value={r.code} key={i}>{r.name}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                    <Alert message={
                        <div>1.每个粉丝每月仅可接收微信后台和个性推送的四次推送，如果某个粉丝身上有3个标签，群发3个标签他就会收到3次推送，收满4次的粉丝无论如何都不会收到消息。
                            <div>2.通过个性推送发送的消息不会显示在公众号的历史文章和微信后台的已群发消息里</div>
                            <div>3.因微信接口限制，仅显示通过后台创建的群发记录</div>
                        </div>
                    } type="success" />
                    <Table
                        dataSource={lists}
                        // scroll={{ x: 1500, y: '75vh' }}
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
                <Modal title="新建推送" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={800}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            {/* <Form.Item label="粉丝标签" name="fansTagName" rules={[{ required: true, message: '请填写粉丝标签' }]}>
                                <Input placeholder="请输入粉丝标签" />
                            </Form.Item> */}
                            {/* <Form.Item label="电视家用户标签" name="userTagId" rules={[{ required: true, message: '请选择电视家用户标签' }]}>
                                <Select allowClear style={{ width: "100%" }} placeholder="请选择电视家用户标签">
                                    {
                                        user_tag.map(r => {
                                            return <Option value={r.code} key={r.id}>{r.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item> */}
                            <Form.Item label="消息类型" name="msg_type">
                                <Radio.Group defaultValue={"mpnews"} style={{ marginBottom: "16px" }} onChange={(e) => {
                                    
                                }}>
                                     <Radio.Button value={"mpnews"} key={1}>图文消息</Radio.Button>
                                    <Radio.Button value={"text"} key={2}>文字消息</Radio.Button>
                                   
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="导入图文" name="msg_type">
                                <Button onClick={()=>{
                                    this.getMaterial()
                                    this.setState({
                                        materialShow:true
                                    })
                                }}><PlusOutlined />添加图文</Button>
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
                <MaterialDialog materialShow={this.state.materialShow} totalCount={this.state.totalCount}
                materialData={this.state.materialData}
                ></MaterialDialog>
            </div>
        )
    }
    componentDidMount() {
        this.getPublicList()
        // this.requestNewAdTagList()
    }
    getSendHisTemp(row) { //记录按钮的状态气泡框
        return (
            <div className="popBox">
                <div>发送对象：{row.tagName}</div>
                <div>发送状态：{row.status == 1 ? "未发送" : row.status == 2 ? "发送中" : row.status == 3 ? "已发送" : "已取消"}</div>
                <div>设置时间：{row.sendTime}</div>
                <div>
                    {/* 1未发送2发送中3已发送4已取消 */}
                    {
                        row.status == 1 ?
                            <Button type="" danger>取消定时发送</Button>
                            :
                            row.status == 4 ?
                                <Button type="primary">再次发送</Button>
                                :
                                ""
                    }

                </div>
            </div>
        )
    }
    getDataDetail(row) {
        return (
            <div>
                {
                    this.state.everyHis.map((r, i) => {
                        return (
                            <div className="popBox" key={i}>
                                <div>本数据由微信官方提供，如需核对数据请登录公众平台</div>
                                <div>发送对象：{r.tagName}</div>
                                <div>定时发送：{row.sendTime}</div>
                                <div>发送人数：{r.totalCount}</div>
                                <div>有效人数：{r.filterCount}</div>
                                <div>发送成功：{r.sendCount}</div>
                                <div>未知结果：{r.errorCount}</div>
                            </div>
                        )
                    })
                }
            </div>

        )
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getSend()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // if (this.state.source == "edit") {
        //     this.updateFansTag(val)
        // } else {
        //     this.addSend(val)
        // }
        this.closeModal()
    }

    getSend() {
        let params = {
            currentPage: this.state.page,
            pageSize: this.state.pageSize,
            wxCode: this.state.wxCode,
            start: this.state.start,
            end: this.state.end
        }
        getSend(params).then(res => {
            console.log(res)
            this.setState({
                lists: res.data,
                total: res.page.totalCount
            })
        })
    }
    // closeModal() {
    //     this.setState({
    //         entranceState: false
    //     })
    // }
    // addSend(val) {
    //     let params = {
    //         ...val,
    //     }
    //     addSend(params).then(res => {
    //         this.getSend()
    //         message.success("成功")

    //     })
    // }


    // deleteItem(item) {  // 删除数据
    //     Modal.confirm({
    //         title: `确认删除该条数据吗？`,
    //         // content: '确认删除？',
    //         onOk: () => {
    //             this.delFansTag(item)
    //         },
    //         onCancel: () => {
    //         }
    //     })
    // }
    // delFansTag(item) {
    //     let params = {
    //         id: item.id
    //     }
    //     delFansTag(params).then(res => {
    //         message.success("删除成功")
    //         this.getSend()
    //     })
    // }
    // updateFansTag(val) {
    //     let params = {
    //         ...this.state.currentItem,
    //         ...val
    //     }
    //     updateFansTag(params).then(res => {
    //         message.success("更新成功")
    //         this.getSend()
    //     })
    // }
    getPublicList() {
        getPublicList({}).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    wxPublic: res.data.data,
                    wxCode: res.data.data[0].code
                }, () => {
                    this.getSend()
                })
                this.forceUpdate()
            }
        })
    }
    everySend(id) {
        //用户设备标签
        everySend({ id: id }).then(res => {
            this.setState({
                everyHis: res.data
            })
        })
    }
    getMaterial(){
        let params={
            "type": "news",   //news 图文
            "count": 12,   // 数量
            "wxCode": this.state.wxCode,  // 公众号code
            "offset": 0   //偏移量
        }
        materialSend(params).then(res=>{
            console.log(res.data)
            this.setState({
                materialData:res.data.item,
                totalCount:res.data.total_count
            })
        })
    }
}