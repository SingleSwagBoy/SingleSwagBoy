import React, { Component } from 'react'
import { getSend, materialSend, getFansTagList, delFansTag, getPublicList, everySend, addSend } from 'api'
import { Radio, Card, Popover, Button, message, Table, Modal, DatePicker, Input, Form, Select, Alert, Checkbox, InputNumber } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import MaterialDialog from "./materialDialog"
import { MyImageUpload } from '@/components/views.js';
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
            totalCount: 0,//素材
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 12, span: 12 },
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
            materialShow: false,
            allMaterial: "",
            fansTagList: [],//粉丝
            activityIndex: null,
            submitInfo: "",
            sendState: false,
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
                                            <div><img style={{with:"100px",height:"100px"}} src={row.cover} alt="" /></div>
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
        let { wxPublic, lists, layout, loading, columns, entranceState, allMaterial, fansTagList, sendState } = this.state;
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
                                        this.getMaterial()
                                        this.formRef.current.resetFields()
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
                <Modal title="新建推送" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false, allMaterial: "" }) }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="消息类型" name="msg_type">
                                <Radio.Group defaultValue={"mpnews"} style={{ marginBottom: "16px" }} onChange={(e) => {
                                }}>
                                    <Radio.Button value={"mpnews"} key={1}>图文消息</Radio.Button>
                                    <Radio.Button value={"text"} key={2}>文字消息</Radio.Button>

                                </Radio.Group>
                            </Form.Item>
                            {
                                allMaterial
                                    ?
                                    <div style={{ display: "flex", alignItems: "flex-star", justifyContent: "space-between" }}>
                                        <div style={{ width: "52%" }}>
                                            <Form.Item label="图文标题" name="content">
                                                <Input placeholder="图文标题" onChange={(e) => {
                                                    let info = this.state.allMaterial
                                                    info[this.state.activityIndex].title = e.target.value
                                                    this.setState({
                                                        allMaterial: info
                                                    })
                                                }} />
                                            </Form.Item>
                                            <Form.Item label="图文摘要" name="digest">
                                                <Input placeholder="图文摘要" />
                                            </Form.Item>
                                            <Form.Item label="封面图" name="cover">
                                                <MyImageUpload
                                                    postUrl={"/mms/wxReply/addMedia"} //上传地址
                                                    params={this.state.wxCode} //另外的参数
                                                    getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('cover', file, newItem) }}
                                                    imageUrl={this.formRef.current && this.formRef.current.getFieldValue("cover")} />
                                            </Form.Item>
                                            <Form.Item label="留言设置" name="comment">
                                                <Checkbox
                                                    key={this.formRef.current && this.formRef.current.getFieldValue("comment")}
                                                    defaultChecked={this.formRef.current && this.formRef.current.getFieldValue("comment")}
                                                    onChange={(e) => {
                                                        this.formRef.current.setFieldsValue({ "comment": e.target.checked })
                                                        this.forceUpdate()
                                                    }}
                                                >留言</Checkbox>
                                                {
                                                    this.formRef.current && this.formRef.current.getFieldValue("comment")
                                                        ?
                                                        <Radio.Group onChange={(e) => {
                                                            // this.formRef.current.setFieldsValue({ [e.target.value]: 0 })
                                                            let info = this.state.allMaterial
                                                            info[this.state.activityIndex][e.target.value] = e.target.checked ? 1 : 0
                                                            this.setState({
                                                                allMaterial: info
                                                            })
                                                        }}
                                                            defaultChecked={this.state.allMaterial[this.state.activityIndex].need_open_comment
                                                                || this.state.allMaterial[this.state.activityIndex].only_fans_can_comment
                                                            }
                                                        >
                                                            <Radio value={"need_open_comment"}>所有人均可留言</Radio>
                                                            <Radio value={"only_fans_can_comment"}>仅关注后可留言</Radio>
                                                        </Radio.Group>
                                                        :
                                                        ""

                                                }
                                            </Form.Item>
                                            <Form.Item label="转载设置" name="sendIgnoreReprint">
                                                <Checkbox key={this.formRef.current && this.formRef.current.getFieldValue("sendIgnoreReprint")}
                                                    defaultChecked={this.formRef.current && this.formRef.current.getFieldValue("sendIgnoreReprint") == 1}
                                                    onChange={(e) => {
                                                        this.formRef.current.setFieldsValue({ sendIgnoreReprint: e.target.checked ? 1 : 0 })
                                                    }}
                                                >原创校准</Checkbox>
                                            </Form.Item>
                                            <Form.Item label="推送粉丝标签" name="tags">
                                                <Select
                                                    placeholder="请选择粉丝标签"
                                                    allowClear
                                                    mode="multiple"
                                                    style={{ width: "100%" }}
                                                >
                                                    {
                                                        fansTagList.map(r => {
                                                            return <Option value={r.id} key={r.id}>{r.name}----{r.count}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div style={{ width: "25%" }}>
                                            <div style={{ "width": "100%", "border": "1px solid #ccc" }}>
                                                {
                                                    this.state.allMaterial.map((l, index) => {
                                                        return (
                                                            <div key={index} className={`material_list ${index == 0 ? "some_list" : ""} ${this.state.activityIndex == index ? "hasBorder" : ""}`}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        activityIndex: index
                                                                    }, () => {
                                                                        console.log(l)
                                                                        let obj = {
                                                                            content: l.title,
                                                                            cover: l.thumb_url,
                                                                            digest: l.digest,
                                                                            comment: false,
                                                                            msg_type: "mpnews",
                                                                            sendIgnoreReprint: 0,
                                                                            need_open_comment: l.need_open_comment == 1 ? true : false,
                                                                            only_fans_can_comment: l.only_fans_can_comment == 1 ? true : false
                                                                        }
                                                                        this.formRef.current.setFieldsValue(obj)
                                                                        this.forceUpdate();
                                                                    })

                                                                }}
                                                            >
                                                                <div>{l.title}</div>
                                                                <div><img src={l.thumb_url} alt="" /></div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", marginTop: "20px", cursor: "pointer" }}>
                                                <div>清空图文</div>
                                                <div onClick={() => {
                                                    this.setState({
                                                        materialShow: true
                                                    }, () => {
                                                        this.child.openDialog(true, this.state.materialData)
                                                    })
                                                }}>导入图文</div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <Form.Item label="导入图文">
                                        <Button onClick={() => {
                                            this.setState({
                                                materialShow: true
                                            }, () => {
                                                this.child.openDialog(true, this.state.materialData)
                                            })
                                        }}><PlusOutlined />添加图文</Button>

                                    </Form.Item>
                            }


                            <Form.Item {...this.state.tailLayout}>
                                <Button onClick={() => { this.setState({ entranceState: false, allMaterial: "" }) }}>预览</Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    群发
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
                <MaterialDialog totalCount={this.state.totalCount} wxCode={this.state.wxCode}
                    onClose={() => this.setState({ materialShow: false })} onChooseInfo={this.onChooseInfo.bind(this)}
                    onRef={this.onRef}
                ></MaterialDialog>
                <Modal title="群发" centered visible={sendState} onCancel={() => { this.setState({ sendState: false }) }} footer={null} width={600}>
                    {this.getSendResult()}
                </Modal>
            </div >
        )
    }
    onRef = (ref) => {
        this.child = ref
    }
    componentDidMount() {
        this.getPublicList()

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
            <div style={{display:"flex"}}>
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
    getSendResult() {
        return (
            <div>
                <div>推送粉丝标签：{this.state.submitInfo && this.state.submitInfo.tagsName.join(",")}</div>
                <div style={{ margin: "10px 0" }}>发送方式：
                    <Radio.Group onChange={(e) => {
                        let info = this.state.submitInfo
                        info.sendType = e.target.value
                        this.setState({ submitInfo: info })
                    }}>
                        <Radio value={1}>立即发送</Radio>
                        <Radio value={2}>定时发送</Radio>
                    </Radio.Group>
                </div>
                {
                    this.state.submitInfo.sendType == 2
                        ?
                        <div >选择时间：<DatePicker showTime onChange={(e) => {
                            let info = this.state.submitInfo
                            info.sendTime = moment(e).format(format)
                            this.setState({ submitInfo: info })
                        }} /></div>
                        : ""
                }
                <div style={{ margin: "10px 0" }}>
                    {
                        this.state.submitInfo.sendType ?
                            <Button type="primary" style={{ margin: "0 20px" }} onClick={this.sendFunc.bind(this)}>
                                {this.state.submitInfo.sendType == 1 ? "立即群发" : "创建定时任务"}
                            </Button> :
                            ""
                    }

                </div>
            </div>

        )
    }
    changeSize = (page, pageSize) => {   // 分页
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getSend()
        })
    }
    submitForm(val) {   // 提交表单
        if (val.tags) {
            let arr = this.state.fansTagList.filter(item => val.tags.some(r => item.id == r))
            let tagsName = []
            arr.forEach(r => {
                tagsName.push(r.name)
            })
            val.tagsName = tagsName
        } else {
            val.tagsName = []
        }
        val.articles = this.state.allMaterial
        val.content = val.articles[0].title
        val.cover = val.articles[0].thumb_url
        val.digest = val.articles[0].digest
        val.wxCode = this.state.wxCode
        this.setState({
            submitInfo: val
        }, () => {
            this.setState({
                sendState: true
            })
        })
        console.log(val, "val")
        // this.closeModal()
    }
    sendFunc() {
        console.log(this.state.submitInfo)
        if (this.state.submitInfo.sendType == 1) {

        } else {
            if (!this.state.submitInfo.sendTime) return message.error("请选择发送时间")
            this.addSend()
        }
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
    getPublicList() {
        getPublicList({}).then(res => {
            console.log(res)
            if (res.data.errCode === 0) {
                this.setState({
                    wxPublic: res.data.data,
                    wxCode: res.data.data[0].code
                }, () => {
                    this.getSend()
                    this.getFansTagList()
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
    getMaterial() {
        let params = {
            "type": "news",   //news 图文
            "count": 12,   // 数量
            "wxCode": this.state.wxCode,  // 公众号code
            "offset": 0   //偏移量
        }
        materialSend(params).then(res => {
            console.log(res.data)
            this.setState({
                materialData: res.data.item,
                totalCount: res.data.total_count
            })
        })
    }
    onChooseInfo(arr) {//选择了素材回来
        console.log(arr)
        this.child.openDialog(false)
        let info = []
        arr.forEach(r => {
            info.push(...r.content.news_item)
        })
        this.setState({
            allMaterial: info,
            activityIndex: 0
        }, () => {
            let obj = {
                content: info[0].title,
                cover: info[0].thumb_url,
                digest: info[0].digest,
                comment: false,
                msg_type: "mpnews",
                sendIgnoreReprint: 0,
                need_open_comment: info[0].need_open_comment == 1 ? true : false,
                only_fans_can_comment: info[0].only_fans_can_comment == 1 ? true : false
            }
            this.formRef.current.setFieldsValue(obj)
            this.forceUpdate();
        })
    }
    //获取上传文件
    getUploadFileUrl(type, file, newItem) {
        console.log(type, file, newItem, "newItem")
        let that = this;
        let image_url = newItem;
        that.formRef.current.setFieldsValue({ [type]: image_url.url });
        let info = this.state.allMaterial
        info[this.state.activityIndex].thumb_url = image_url.url
        info[this.state.activityIndex].thumb_media_id = image_url.mediaID
        this.setState({
            allMaterial: info
        })
        // that.forceUpdate();
    }
    //获取上传文件图片地址 
    getUploadFileImageUrlByType(type) {
        let that = this;
        let image_url = that.formRef.current.getFieldValue(type);
        return image_url ? image_url : '';
    }
    getFansTagList() {
        let params = {
            wxAppCode: this.state.wxCode,
            page: {
                currentPage: 1,
                pageSize: 9999
            }
        }
        getFansTagList(params).then(res => {
            this.setState({
                fansTagList: res.data
            })
        })
    }
    addSend() {
        let params = {
            ...this.state.submitInfo
        }
        return console.log(params)
        addSend(params).then(res => {
            this.setState({
                visible: false,
                sendState: false,
            },()=>{
                message.success("操作成功")
            })
        })
    }
}