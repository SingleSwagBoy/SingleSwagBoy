/*
 * @Author: yzc
 * @Date: 2021-12-27 18:41:39
 * @LastEditors: yzc
 * @LastEditTime: 2021-12-27 13:34:43
 * @Description: 首页改版优化移动端3.0.0版本
 */
import React, { Component } from 'react'
// import request from 'utils/request'
import { getHomeList, uploadHomeList, searchVideo, addTab, getHomeBaseInfo, addHomeList, getAllBaseInfo, getChannel, getShortList, delHomeList, setHomeBaseInfo } from 'api'
import { Input, Card, Breadcrumb, Form, DatePicker, Tabs, Button, Table, Modal, Alert, Select, Radio, Divider, Image, message, Switch, InputNumber } from 'antd'
import request from 'utils/request.js'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import moment from 'moment';
import "./style.css"
const { TabPane } = Tabs;
let { RangePicker } = DatePicker;
let { Option } = Select;
let privateData = {
    inputTimeOutVal: null
};
export default class AddressNews extends Component {
    formRef = React.createRef();
    formRefTitle = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            loading: false,
            config: "",
            channelList: [],
            programlist: [],
            currentItem: "",
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            tailLayoutTitle: {
                wrapperCol: { offset: 12, span: 12 },
            },
            addressList: [
                // "央视", "卫视"
            ],
            currentSort: 0,
            editIndex: null,
            tabIndex: null,
            isOpen: false,//内容配置
            titleShow: false,//标题配置
            source: "",
            titleInfo: "",//标题信息
            shortList: [],//短视频列表
            columns: [
                {
                    title: "序号",
                    dataIndex: "sort",
                    key: "sort",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    index == this.state.editIndex ?
                                        <InputNumber min={0} step={10} defaultValue={rowValue}
                                            onBlur={(e) => {
                                                console.log(e)
                                                this.setState({
                                                    editIndex: null,
                                                    currentItem: row,
                                                }, () => {
                                                    let arr = JSON.parse(JSON.stringify(row))
                                                    arr.time = arr.startTime ? [moment(arr.startTime * 1000), moment(arr.endTime * 1000)] : 0
                                                    arr.sort = Number(e.target.value)
                                                    this.uploadHomeList(arr)
                                                })
                                            }}
                                        />
                                        :
                                        <div style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => {
                                            this.setState({
                                                editIndex: index
                                            })
                                        }}>{rowValue}</div>
                                }

                            </div>
                        )
                    }
                },
                {
                    title: "内容类别",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == 1 ? "频道" : rowValue == 2 ? "视频" : rowValue == 3 ? "视频集" : "未知"}</div>
                        )
                    }
                },
                {
                    title: "标题",
                    dataIndex: "channelName",
                    key: "channelName",
                },
                {
                    title: "封面",
                    dataIndex: "cover",
                    key: "cover",
                    render: (rowValue, row, index) => {
                        return <Image src={rowValue} width={100}></Image>
                    }
                },
                {
                    title: "描述",
                    dataIndex: "desc",
                    key: "desc",
                },
                {
                    title: "有效时间",
                    dataIndex: "startTime",
                    key: "startTime",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{row.startTime ? util.formatTime(row.startTime, "") : "未配置"} - {row.endTime ? util.formatTime(row.endTime, "") : "未配置"}</div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    fixed: 'right',
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <>
                                    <Button
                                        style={{ margin: "0 10px" }}
                                        size="small"
                                        type="primary"
                                        onClick={() => {
                                            console.log(row)
                                            this.setState({
                                                currentItem: row,
                                                source: "edit",
                                                isOpen: true
                                            }, () => {
                                                let arr = JSON.parse(JSON.stringify(row))
                                                arr.time = arr.startTime ? [moment(arr.startTime * 1000), moment(arr.endTime * 1000)] : 0
                                                this.formRef.current.setFieldsValue(arr)
                                                if (arr.type == 1) {
                                                    this.getChannel()
                                                } else if (arr.type == 2) {
                                                    this.searchVideo(arr.channelName)
                                                } else {
                                                    this.getShortList()
                                                }
                                            })
                                        }}
                                    >编辑</Button>
                                    <Button size="small" danger onClick={() => this.delItem(row)}>删除</Button>
                                </>
                            </div>
                        )
                    }
                }

            ],
        }
    }
    render() {
        const { addressList, shortList, channelList, programlist } = this.state;
        return (
            <div className="address_page">
                {/* <div style={{fontSize:"20px"}}>首页直播配置</div> */}
                <Card >

                    <Tabs
                        // defaultActiveKey="0"
                        tabPosition={"top"}
                        centered={true}
                        type="editable-card"
                        activeKey={String(this.state.tabIndex)}
                        onEdit={(targetKey, action) => {
                            console.log(targetKey, action)
                            if (action == "add") {
                                this.addTab()
                            }
                        }}
                        onChange={(val) => {
                            console.log(val)
                            this.setState({
                                loading: true,
                                editIndex: null,
                                tabIndex: val,
                            }, async () => {
                                await this.getHomeList()
                                await this.getHomeBaseInfo()
                            })

                        }}
                    >
                        {
                            addressList.map((r, i) => (
                                <TabPane tab={r.tabName} key={r.channelType} closable={false}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center", "marginBottom": "20px" }}>
                                        <Switch checkedChildren="已开启" unCheckedChildren="已关闭" key={this.state.titleInfo.status}
                                            defaultChecked={this.state.titleInfo.status == 1 ? true : false}
                                            onChange={(e) => {
                                                let info = this.state.titleInfo
                                                info.status = e ? 1 : 2
                                                this.setHomeBaseInfo(info)
                                            }}
                                        />
                                        <Button type="primary" style={{ margin: "0 10px" }} disabled={r.channelType == 1 || r.channelType == 2}
                                            onClick={() => {
                                                this.setState({
                                                    titleShow: true,
                                                }, () => {
                                                    this.formRefTitle.current.setFieldsValue(this.state.titleInfo)
                                                    this.forceUpdate()
                                                })
                                            }}
                                        >标题配置</Button>
                                        <Button type="primary" style={{ margin: "0 10px" }}
                                            onClick={() => {
                                                this.setState({
                                                    source: "add",
                                                    isOpen: true,
                                                }, () => {
                                                    this.formRef.current.resetFields();
                                                })
                                            }}
                                        >新增</Button>
                                        <MySyncBtn type={18} name='同步缓存' params={{ "channelType": this.state.tabIndex }} />

                                    </div>
                                    <Table
                                        dataSource={this.state.lists}
                                        scroll={{ x: 1200, }}
                                        rowKey={i}
                                        loading={this.state.loading}
                                        columns={this.state.columns} />
                                </TabPane>
                            ))
                        }
                    </Tabs>
                    <Modal
                        title="配置"
                        centered
                        visible={this.state.isOpen}
                        onCancel={() => {
                            this.closeDialog(this.formRef, "isOpen")
                        }}
                        footer={null}
                        forceRender={true}
                        width={1000}
                    >
                        {
                            <Form
                                {...this.state.layout}
                                name=""
                                ref={this.formRef}
                                onFinish={this.submitForm.bind(this)}
                            >
                                {
                                    this.formRef && this.formRef.current &&
                                    <>
                                        <Form.Item
                                            label="内容类型"
                                            name="type"
                                            rules={[{ required: true, message: '请选择类型' }]}
                                        >
                                            <Radio.Group className="base-input-wrapper" onChange={(e) => {
                                                console.log(e)
                                                let index = e.target.value
                                                if (index == 1) {
                                                    this.getChannel()
                                                } else if (index == 2) {
                                                    this.searchVideo(this.formRef.current && this.formRef.current.getFieldValue("channelId"))
                                                } else {
                                                    this.getShortList()
                                                }
                                                this.formRef.current.setFieldsValue({ "channelId": null })
                                            }}>
                                                {/* 1频道,2视频,3视频集 */}
                                                <Radio value={1} key={1}>频道</Radio>
                                                <Radio value={2} key={2} disabled={this.formRef.current && (this.formRef.current.getFieldValue("channelType") == 1 || this.formRef.current.getFieldValue("channelType") == 2)}>视频</Radio>
                                                <Radio value={3} key={3} disabled={this.formRef.current && (this.formRef.current.getFieldValue("channelType") == 1 || this.formRef.current.getFieldValue("channelType") == 2)}>视频集</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="频道选择"
                                            name="channelId"
                                            rules={[{ required: true, message: '请选择类型' }]}
                                        >
                                            <Select allowClear placeholder="请选择类型"
                                                showSearch
                                                onChange={(e)=>{
                                                    let arr = ""
                                                    if (this.formRef.current.getFieldValue("type") == 1){
                                                        arr = channelList.filter(item => item.code == e)
                                                        this.formRef.current.setFieldsValue({ "cover": arr[0].posterUrl })
                                                    }else if (this.formRef.current.getFieldValue("type") == 2){
                                                        arr = shortList.filter(item => item.id == e)
                                                        this.formRef.current.setFieldsValue({ "cover": arr[0].cover })
                                                    }
                                                    this.forceUpdate()
                                                }}
                                                onSearch={(e) => {
                                                    if (privateData.inputTimeOutVal) {
                                                        clearTimeout(privateData.inputTimeOutVal);
                                                        privateData.inputTimeOutVal = null;
                                                    }
                                                    privateData.inputTimeOutVal = setTimeout(() => {
                                                        if (!privateData.inputTimeOutVal) return;
                                                        this.searchVideo(e)
                                                    }, 1000)
                                                }}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    this.formRef.current && this.formRef.current.getFieldValue("type") == 1 &&
                                                    channelList.map((r, index) => {
                                                        return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                    })
                                                }
                                                {
                                                    this.formRef.current && this.formRef.current.getFieldValue("type") == 2 &&
                                                    shortList.map((r, index) => {
                                                        return <Option value={r.id} key={index} >{r.title}</Option>
                                                    })
                                                }
                                                {
                                                    this.formRef.current && this.formRef.current.getFieldValue("type") == 3 &&
                                                    programlist.map((r, i) => {
                                                        return <Option value={r.id.toString()} key={i}>{r.title}</Option>
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="描述"
                                            name="desc"
                                        // rules={[{ required: true, message: '请填写配置' }]}
                                        >
                                            <Input placeholder="请填写描述" />
                                        </Form.Item>
                                        <Form.Item
                                            label="封面"
                                            name="cover"
                                        >
                                            <MyImageUpload
                                                getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('cover', file, newItem, this.formRef) }}
                                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("cover")} />
                                            <Button onClick={() =>{
                                                 this.formRef.current.setFieldsValue({cover:""})
                                                 this.forceUpdate()
                                            }} style={{ margin: "0 20px" }}>
                                                删除
                                            </Button>
                                        </Form.Item>
                                        <Form.Item label="有效时间" name="time" >
                                            <RangePicker className="base-input-wrapper" showTime allowClear placeholder={['开始时间', '结束时间']} />
                                        </Form.Item>
                                        <Form.Item {...this.state.tailLayout}>
                                            <Button onClick={() => this.closeDialog(this.formRef, "isOpen")} style={{ margin: "0 20px" }}>
                                                取消
                                            </Button>
                                            <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                                提交
                                            </Button>
                                        </Form.Item>
                                    </>

                                }



                            </Form>
                        }
                    </Modal>
                    {/* 标题 */}
                    <Modal
                        title="标题配置"
                        centered
                        visible={this.state.titleShow}
                        onCancel={() => {
                            this.closeDialog(this.formRefTitle, "titleShow")
                        }}
                        footer={null}
                        forceRender={true}
                    >
                        {
                            <Form
                                {...this.state.layout}
                                name=""
                                ref={this.formRefTitle}
                                onFinish={this.submitTitleForm.bind(this)}
                            >
                                <Form.Item
                                    label="内容类型"
                                    name="type"
                                    rules={[{ required: true, message: '请选择类型' }]}
                                >
                                    <Radio.Group className="base-input-wrapper"
                                        onChange={(e) => {
                                            this.formRefTitle.current.setFieldsValue({ "type": e.target.value })
                                            this.forceUpdate()
                                        }}
                                    >
                                        <Radio value={1} key={1}>文字</Radio>
                                        <Radio value={2} key={2}>图片</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {
                                    this.formRefTitle.current && this.formRefTitle.current.getFieldValue("type") == 1 &&
                                    <Form.Item
                                        label="标题名称"
                                        name="title"
                                    // rules={[{ required: true, message: '请填写配置' }]}
                                    >
                                        <Input placeholder="请填写标题名称" />
                                    </Form.Item>
                                }
                                {
                                    this.formRefTitle.current && this.formRefTitle.current.getFieldValue("type") == 2 &&
                                    <Form.Item
                                        label="图片"
                                        name="title"
                                    >
                                        <MyImageUpload
                                            getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('title', file, newItem, this.formRefTitle) }}
                                            imageUrl={this.formRefTitle.current && this.formRefTitle.current.getFieldValue("title")} />
                                    </Form.Item>
                                }


                                <Form.Item {...this.state.tailLayoutTitle}>
                                    <Button onClick={() => this.closeDialog(this.formRefTitle, "titleShow")} style={{ margin: "0 20px" }}>
                                        取消
                                    </Button>
                                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                        提交
                                    </Button>
                                </Form.Item>


                            </Form>
                        }
                    </Modal>
                </Card>
            </div>
        )
    }
    componentDidMount() {
        this.setState({
            loading: true,
        }, async () => {
            await this.getAllBaseInfo()
        })
    }
    async getAllBaseInfo(type) {
        getAllBaseInfo({}).then(res => {
            console.log(!!res.data)
            if (res.data && Array.isArray(res.data)) {
                this.setState({
                    addressList: res.data,
                    tabIndex: res.data.length > 0 ? type == 1 ? res.data[res.data.length - 1].channelType : res.data[0].channelType : 0
                }, () => {
                    this.getHomeList(this.state.tabIndex)
                    this.getHomeBaseInfo(this.state.tabIndex)
                })
            }

        })
    }
    async getHomeList(index) {
        let params = {
            channelType: index ? index : this.state.tabIndex
        }
        getHomeList(params).then(res => {
            this.setState({
                loading: false,
                lists: res.data.data
            })
        })
    }
    addHomeList(item) {
        console.log(this.state.tabIndex, "this.state.tabIndex")
        let params = {
            ...item,
            startTime: item.time ? parseInt(item.time[0].valueOf() / 1000) : 0,
            endTime: item.time ? parseInt(item.time[1].valueOf() / 1000) : 0,
            channelType: Number(this.state.tabIndex)
        }
        addHomeList(params).then(res => {
            message.success("新增成功")
            this.getHomeList()
        })
    }
    uploadHomeList(item) {
        let params = {
            ...this.state.currentItem,
            ...item,
            startTime: item.time ? parseInt(item.time[0].valueOf() / 1000) : 0,
            endTime: item.time ? parseInt(item.time[1].valueOf() / 1000) : 0,
        }
        uploadHomeList(params).then(res => {
            message.success("更新成功")
            this.getHomeList()
        })
    }
    // setStateHomeList(val) {
    //     let params = {
    //         channelType: this.state.tabIndex,
    //         status: val ? 1 : 0
    //     }
    //     setStateHomeList(params).then(res => {
    //         console.log(res.data)
    //         message.success("修改成功")
    //     })
    // }
    //新增
    addTab() {
        addTab({}).then(async (res) => {
            console.log(res)
            await this.getAllBaseInfo(1)
            // await this.getHomeList()
        })
    }
    submitForm(val) {
        console.log(val)
        let arr = ""
        if (val.type == 1) {
            arr = this.state.channelList.filter(item => item.code == val.channelId)
            val.channelName = arr.length > 0 ? arr[0].name : ""
        } else if (val.type == 2) {
            arr = this.state.shortList.filter(item => item.id == val.channelId)
            val.channelName = arr.length > 0 ? arr[0].title : ""
        } else {
            arr = this.state.programlist.filter(item => item.id == val.channelId)
            val.channelName = arr.length > 0 ? arr[0].title : ""
        }
        if (this.state.source == "add") {
            this.addHomeList(val)
        } else {
            this.uploadHomeList(val)
        }
        this.closeDialog(this.formRef, "isOpen")
    }

    closeDialog(form, type) {
        form.current.resetFields()
        this.setState({ [type]: false })
    }
    //获取上传文件
    getUploadFileUrl(type, file, newItem, form) {
        let that = this;


        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;

        form.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    getChannel(val) { //获取用户标签
        let params = {
            keywords: val
        }
        getChannel(params).then(res => {
            this.setState({
                channelList: res.data.data
            })
        })
    }
    getShortList() {
        let params = {
            currentPage: 1, // (int)页码
            pageSize: 9999 // (int)每页数量
        }
        getShortList(params).then(res => {
            this.setState({
                programlist: res.data.data
            })
        })
    }
    searchVideo(val) {
        if (!val) return
        let params = {
            word: val
        }
        searchVideo(params).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    shortList: res.data.data
                })
            }
        })
    }
    delItem(item) {
        Modal.confirm({
            title: '删除此活动',
            content: '确认删除？',
            onOk: () => {
                this.delHomeList(item)
            },
            onCancel: () => {

            }
        })
    }
    delHomeList(item) {
        delHomeList({ id: item.id }).then(res => {
            message.success("删除成功")
            this.getHomeList()
        })
    }




    //设置标题弹窗




    getHomeBaseInfo(index) {
        getHomeBaseInfo({ channelType: index ? index : this.state.tabIndex }).then(res => {
            this.setState({
                titleInfo: res.data
            })
        })
    }
    //设置标题
    submitTitleForm(val) {
        this.setHomeBaseInfo(val)
        this.closeDialog(this.formRefTitle, "titleShow")
    }
    setHomeBaseInfo(val, type) {
        let params = {}
        if (type == 1) {
            params = {
                ...val
            }
        } else {
            params = {
                ...this.formRefTitle.current.getFieldValue(),
                ...val
            }
        }
        setHomeBaseInfo(params).then(res => {
            message.success("设置成功")
            this.setState({
                titleShow: false
            }, () => {
                this.getHomeBaseInfo()
            })
        })
    }
}
