import React, { Component } from 'react'
import { getWordsConfig, uploadWordsConfig, addWordsConfig, delWordsConfig, getDetailProgram, getChannel,getImageWordsConfig,setImageWordsConfig } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
// import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
let privateData = {
    inputTimeOutVal: null
};
let format = "YYYY-MM-DD HH:mm:ss"
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    iconFormRef = React.createRef();
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
                wrapperCol: { offset: 20, span: 4 },
            },
            iconLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            lists: [],
            visible: false,
            tagList: [],
            programList: [],
            currentItem: "",
            source: "",
            openImageBox: false,
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            channel_list: [],
            columns: [
                {
                    title: "排列顺序",
                    dataIndex: "sort",
                    key: "sort",
                },
                {
                    title: "标题",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "轮播内容",
                    dataIndex: "content",
                    key: "content",
                    ellipsis: true,
                },
                {
                    title: "上线时间",
                    dataIndex: "start",
                    key: "start",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.start, "")}</div>
                        )
                    }
                },
                {
                    title: "下线时间",
                    dataIndex: "end",
                    key: "end",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.end, "")}</div>
                        )
                    }
                },
                {
                    title: "跳转类型",  // //1:android,2:ios,3:全端
                    dataIndex: "jumpType",
                    key: "jumpType",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == 0 ? "无" :rowValue == 29 ? "短视频":rowValue == 3 ? "频道":rowValue == 19 ? "节目单详情页":""}</div>
                        )
                    }
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="已启用" unCheckedChildren="已禁用" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false} disabled
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 210,
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
                                            source: "edit"
                                        }, () => {
                                            let arr = JSON.parse(JSON.stringify(row))
                                            arr.status = arr.status == 2 ? false : true
                                            arr.start = moment(arr.start)
                                            arr.end = moment(arr.end)
                                            // this.getDetailProgram(arr.jumpContent)
                                            this.formRef.current.setFieldsValue(arr)
                                            this.forceUpdate()
                                        })
                                    }}
                                >编辑</Button>
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
        let { channel_list, lists, layout, loading, columns, entranceState, programList, openImageBox } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>文字轮播配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
                            <Button type="primary" style={{ margin: "0 10px" }} onClick={() => { this.setState({ openImageBox: true },()=>{this.getImageWordsConfig()}) }}>图标配置</Button>
                            <Button type="primary" style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.setState({
                                        source: "add",
                                        entranceState: true,
                                    }, () => {
                                        this.formRef.current.resetFields();
                                        this.forceUpdate()
                                    })
                                }}
                            >新增</Button>
                            <MySyncBtn type={17} name='同步缓存' />
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
                <Modal title="新增任务" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="标题" name="title" rules={[{ required: true, message: '请填写标题' }]}>
                                <Input placeholder="请输入商品价格" />
                            </Form.Item>
                            <Form.Item label="轮播内容" name="content" rules={[{ required: true, message: '请填写轮播内容' }]}>
                                <Input.TextArea placeholder="请输入商品名称" />
                            </Form.Item>
                            <Form.Item label="跳转类型" name="jumpType" rules={[{ required: true, message: '请选择跳转类型' }]}>
                                <Select allowClear placeholder="请选择类型" onChange={(e) => {
                                    this.formRef.current.setFieldsValue({ "jumpType": e, jumpContent: "" })
                                    this.forceUpdate()
                                }}>
                                    <Option value={0} key={0}>无</Option>
                                    <Option value={29} key={29}>短视频</Option>
                                    <Option value={3} key={3}>频道</Option>
                                    <Option value={19} key={19}>节目单详情页</Option>
                                </Select>
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("jumpType") == 29
                                    ?
                                    <Form.Item label="短视频ID" name="jumpContent" rules={[{ required: true, message: '请填写短视频ID' }]}>
                                        <Input placeholder="请输入短视频ID" />
                                    </Form.Item>
                                    :
                                    this.formRef.current && this.formRef.current.getFieldValue("jumpType") == 3
                                        ?
                                        <Form.Item label="频道" name="jumpContent" rules={[{ required: true, message: '请选择频道' }]}>
                                            <Select
                                                placeholder="请选择频道配置"
                                                allowClear
                                                {...this.state.selectProps}
                                                onSearch={(val) => {
                                                    console.log(val)
                                                    if (privateData.inputTimeOutVal) {
                                                        clearTimeout(privateData.inputTimeOutVal);
                                                        privateData.inputTimeOutVal = null;
                                                    }
                                                    privateData.inputTimeOutVal = setTimeout(() => {
                                                        if (!privateData.inputTimeOutVal) return;
                                                        this.getChannel(val)
                                                    }, 1000)
                                                }}
                                            >
                                                {
                                                    channel_list.map((r, i) => {
                                                        return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                    })
                                                }

                                            </Select>
                                        </Form.Item>
                                        :
                                        this.formRef.current && this.formRef.current.getFieldValue("jumpType") == 19
                                            ?
                                            <Form.Item label="节目单" name="jumpContent" rules={[{ required: true, message: '请选择节目单' }]}>
                                                <Select
                                                    placeholder="请选择节目单"
                                                    allowClear
                                                    {...this.state.selectProps}
                                                    onSearch={(val) => {
                                                        console.log(val)
                                                        if (privateData.inputTimeOutVal) {
                                                            clearTimeout(privateData.inputTimeOutVal);
                                                            privateData.inputTimeOutVal = null;
                                                        }
                                                        privateData.inputTimeOutVal = setTimeout(() => {
                                                            if (!privateData.inputTimeOutVal) return;
                                                            this.getDetailProgram(val)
                                                        }, 1000)
                                                    }}
                                                >
                                                    {
                                                        programList.map((r, i) => {
                                                            return <Option value={r.programId} key={r.feedId}>{r.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                            : ""
                            }
                            <Form.Item label="定时上线" name="start" rules={[{ required: true, message: '请选择上线时间' }]}>
                                <DatePicker placeholder={'上线时间'} showTime ></DatePicker>
                            </Form.Item>
                            <Form.Item label="下线时间" name="end" rules={[{ required: true, message: '请选择下线时间' }]}>
                                <DatePicker placeholder={'下线时间'} showTime ></DatePicker>
                            </Form.Item>
                            {/* <Form.Item label="状态" name="status" valuePropName="checked">
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" ></Switch>
                            </Form.Item> */}
                            <Form.Item label="排列顺序" name="sort" >
                                <InputNumber placeholder="请输入排列顺序" style={{ width: "200px" }} />
                            </Form.Item>
                            <Form.Item  {...this.state.tailLayout}>
                                <Button onClick={() => { this.setState({ entranceState: false }) }}>取消</Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
                <Modal title="图标配置" centered visible={openImageBox} onCancel={() => { this.setState({ openImageBox: false }) }} footer={null} width={800}>

                    <Form {...layout}
                        name="iconForm"
                        ref={this.iconFormRef}
                        onFinish={this.submitIcon.bind(this)}>
                        <Form.Item label="图标" name="icon" rules={[{ required: true, message: '请上传图标' }]}>
                            <MyImageUpload
                                getUploadFileUrl={(file) => { this.getUploadFileUrl('icon', file) }}
                                imageUrl={this.iconFormRef.current && this.iconFormRef.current.getFieldValue("icon")} />
                        </Form.Item>
                        <Form.Item  {...this.state.iconLayout}>
                            <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                提交
                            </Button>
                            <Button onClick={() => { this.setState({ openImageBox: false }) }}>取消</Button>

                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    componentDidMount() {
        this.getWordsConfig();
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getWordsConfig()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (this.state.source == "edit") {
            this.uploadWordsConfig(val)
        } else {
            this.addWordsConfig(val)
        }
        this.closeModal()
    }

    getWordsConfig() {
        let params = {
            // "page": {
            //     "currentPage": this.state.page, // (int)页码
            //     "pageSize": this.state.pageSize // (int)每页数量
            // }
        }
        getWordsConfig(params).then(res => {
            this.setState({
                lists: res.data.data,
                // total: res.data.page.totalCount
            })
        })
    }
    getChannel(val) {
        let params = {
            keywords: val,
        }
        //获取频道组
        getChannel(params).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0) {
                this.setState({
                    channel_list: res.data.data,
                })
            }
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addWordsConfig(val) {
        let params = {
            ...val,
            start: moment(val.start).format(format),
            end: moment(val.end).format(format),
        }

        addWordsConfig(params).then(res => {
            this.getWordsConfig()
            message.success("新增成功")
        })
    }
    uploadWordsConfig(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            start: moment(val.start).format(format),
            end: moment(val.end).format(format),
        }
        uploadWordsConfig(params).then(res => {
            this.getWordsConfig()
            message.success("更新成功")
        })
    }
    getUploadFileUrl(index, file) {   // 图片上传的方法
        console.log(file, index, "获取上传的图片路径")
        this.iconFormRef.current.setFieldsValue({ "icon": file })
        this.forceUpdate()
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delWordsConfig(_obj.id)
            },
            onCancel: () => {
            }
        })
    }
    delWordsConfig(id) {
        let params = {
            id: id
        }
        delWordsConfig(params).then(res => {
            message.success("删除成功")
            this.getWordsConfig()
        })
    }
    getDetailProgram(keyword) {
        if (!keyword) return
        let params = {
            name: keyword,
        }
        getDetailProgram(params).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    programList: res.data.data,
                })
                // this.forceUpdate()
            }

        })
    }
    getImageWordsConfig() {
        getImageWordsConfig({}).then(res => {
            console.log(res)
            if(this.iconFormRef.current){
                this.iconFormRef.current.setFieldsValue({ "icon": res.data.data.image })
                this.forceUpdate()
            }
        })
    }
    setImageWordsConfig(url) {
        let params={
            image:url
        }
        setImageWordsConfig(params).then(res => {
            console.log(res)
            message.success("设置成功")
            this.setState({
                openImageBox:false
            })
        })
    }
    submitIcon(val) { //提交图片
        console.log(val)
        this.setImageWordsConfig(val.icon)
    }
}