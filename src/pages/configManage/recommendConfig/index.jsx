import React, { Component } from 'react'
import { searchShortList, getSuggest, addSuggest, updateSuggest, getChannel,getSuggestInfo,setSuggestInfo } from 'api'
import { Breadcrumb, Card,Input, TimePicker,Radio, Button, message, Table, Modal, DatePicker, Form, Select, Checkbox, InputNumber, Image } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import moment from 'moment';
import util from 'utils'
import "./style.css"
let { RangePicker } = DatePicker;
let format = "YYYY-MM-DD HH:mm:ss"
let privateData = {
    inputTimeOutVal: null
};
const { Option } = Select; export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    formRefTitle = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 50,
            total: 0,
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
            tailLayoutTitle: {
                wrapperCol: { offset: 10, span: 14 },
            },
            lists: [],
            shortList: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            channel_list: [],
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            columns: [
                {
                    title: "位置",
                    dataIndex: "position",
                    key: "position",
                    width: 100,
                },
                {
                    title: "展示频道",
                    dataIndex: "channelId",
                    key: "channelId",
                },
                {
                    title: "替换时间",
                    dataIndex: "start",
                    key: "start",
                    width: 300,
                    render: (rowValue, row, index) => {
                        return (
                            rowValue ?
                                <div>{row.start} - {row.end}</div>
                                :
                                <div>长期</div>

                        )
                    }
                },
                {
                    title: "封面",
                    dataIndex: "cover",
                    key: "cover",
                    render: (rowValue, row, index) => {
                        return <Image src={rowValue} width={100} height={100} />
                    }
                },
                {
                    title: "描述",
                    dataIndex: "desc",
                    key: "desc",
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 200,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* <MySyncBtn type={15} name='同步缓存' params={{id:row.id}}  size="small" /> */}
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        this.setState({
                                            entranceState: true,
                                            currentItem: row,
                                            source: "edit"
                                        }, () => {
                                            let arr = JSON.parse(JSON.stringify(row))
                                            arr.time = [arr.start ? moment(arr.start) : "", arr.end ? moment(arr.end) : ""]
                                            arr.checked = arr.start ? false : true
                                            console.log(arr)
                                            this.getChannel(arr.channelId)
                                            this.formRef.current.setFieldsValue(arr)
                                            this.forceUpdate()
                                        })
                                    }}
                                >编辑</Button>
                                {/* <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteItem(row) }}
                                >删除</Button> */}
                            </div>
                        )
                    }
                }
            ],
            titleInfo:{},
            titleShow:false
        }
    }
    render() {
        let { lists, layout, loading, columns, entranceState, channel_list,titleShow } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>首页为你推荐配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
                             <Button type="primary" style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.setState({
                                        titleShow: true,
                                    }, () => {
                                        this.formRefTitle.current.setFieldsValue(this.state.titleInfo);
                                        this.forceUpdate()
                                    })
                                }}
                            >标题设置</Button>
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
                            <MySyncBtn type={16} name='同步缓存' />
                        </div>
                    }
                >
                    <Table
                        dataSource={lists}
                        scroll={{ x: 1000, y: '75vh' }}
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
                            <Form.Item label="位置" name="position" rules={[{ required: true, message: '请输入位置' }]}>
                                <InputNumber placeholder="请输入位置" min={0} style={{ width: "200px" }} />
                            </Form.Item>
                            <Form.Item label="展示频道" name="channelId" rules={[{ required: true, message: '请选择视频集名称' }]}>
                                {/* <Input placeholder="请选择视频集名称" /> */}
                                <Select
                                    placeholder="请选择频道配置"
                                    // mode="multiple"
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
                            <Form.Item label="展示时间段" style={{ display: "flex" }}>
                                <Form.Item name="time" >
                                    <RangePicker placeholder={['上线时间', '下线时间']} showTime onChange={(e) => {
                                        console.log(e)
                                        if (e && e[1]) {
                                            this.formRef.current.setFieldsValue({ "checked": false })
                                        } else {
                                            this.formRef.current.setFieldsValue({ "checked": true })

                                        }
                                        this.forceUpdate()
                                    }} ></RangePicker>
                                </Form.Item>
                                <Form.Item name="checked">
                                    <Checkbox valuePropName="checked" checked={(this.formRef.current && this.formRef.current.getFieldValue("checked"))} onChange={val => {
                                        console.log(val.target.checked)
                                        if (val.target.checked) {
                                            this.formRef.current.setFieldsValue({ "star": "", "end": "", time: ["", ""] })
                                        } else {
                                            this.formRef.current.setFieldsValue({ time: "" })
                                        }
                                        this.formRef.current.setFieldsValue({ checked: val.target.checked })
                                        this.forceUpdate()
                                    }}>
                                        长期
                                    </Checkbox>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="描述" name="desc" >
                                <Input placeholder="请输入描述" />
                            </Form.Item>
                            <Form.Item label="封面" name="cover">
                                <MyImageUpload
                                    getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('cover', file, newItem, this.formRef) }}
                                    imageUrl={this.formRef.current && this.formRef.current.getFieldValue("cover")} />
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



                {/* 标题设置 */}
                <Modal title="新增任务" centered visible={titleShow} onCancel={() => { this.setState({ titleShow: false }) }} footer={null}>
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
                            <Button onClick={() => this.setState({titleShow:false})} style={{ margin: "0 20px" }}>
                                取消
                            </Button>
                            <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                提交
                            </Button>
                        </Form.Item>


                    </Form>
                    }
                </Modal>
            </div>
        )
    }
    componentDidMount() {
        this.getSuggest()
        this.getSuggestInfo();
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getProgramlist()
        })
    }
    getChannel(val) {
        let params = {
            keywords: val,
        }
        //获取频道组
        getChannel(params).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0 && res.data.data) {
                this.setState({
                    channel_list: res.data.data,
                })
            } else {
                this.setState({
                    channel_list: [],
                })
            }
        })
    }
    // searchShortList(keyword,index) {
    //     if (!keyword) return
    //     let params = {
    //         str_id: keyword,
    //     }
    //     searchShortList(params).then(res => {
    //         console.log(res.data.data,"res.data")
    //         if(res.data.data){
    //             let arr = this.formRef.current.getFieldValue("videos")
    //             console.log(arr,"arr")
    //             let obj = res.data.data
    //             let str = {
    //                 str_id:obj.id,
    //                 cover:obj.cover,
    //                 source:obj.source,
    //                 sort:arr[index].sort || 0,
    //                 uploader:obj.uploader,
    //                 likeCount:obj.likeCount,
    //                 title:obj.title
    //             }
    //             arr[index] = str
    //             this.formRef.current.setFieldsValue({"videos":arr})
    //         }else{
    //             message.error("没找到合适的短视频")
    //         }
    //     })
    // }
    submitForm(val) {   // 提交表单
        console.log(val)
        if (!val.time && !val.checked) {
            return message.error("请选择时间段")
        }
        if (this.state.source == "edit") {
            this.updateSuggest(val)
        } else {
            this.addSuggest(val)
        }
        this.closeModal()
    }
    getSuggest() {
        let params = {
            // currentPage: this.state.page, // (int)页码
            // pageSize: this.state.pageSize // (int)每页数量
        }
        getSuggest(params).then(res => {
            this.setState({
                lists: res.data.data,
                // total: res.data.totalCount
            })
        })
    }
    closeModal() {
        this.formRef.current.resetFields();
        this.setState({
            entranceState: false
        })
    }
    addSuggest(val) {
        let params = {
            ...val,
            start: (val.time && val.time[0]) ? moment(val.time[0]).format(format) : "",
            end: (val.time && val.time[1]) ? moment(val.time[1]).format(format) : ""
        }
        addSuggest(params).then(res => {
            this.getSuggest()
            message.success("新增成功")
        })
    }
    updateSuggest(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            start: (val.time && val.time[0]) ? moment(val.time[0]).format(format) : "",
            end: (val.time && val.time[1]) ? moment(val.time[1]).format(format) : ""
        }
        updateSuggest(params).then(res => {
            this.getSuggest()
            message.success("更新成功")
        })
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delShortList(_obj.id)
            },
            onCancel: () => {
            }
        })
    }
    // delShortList(id) {
    //     let params = {
    //         id: id
    //     }
    //     delShortList(params).then(res => {
    //         message.success("删除成功")
    //         this.getSuggest()
    //     })
    // }
    //获取上传文件
    getUploadFileUrl(type, file, newItem, form) {
        let that = this;
        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;

        form.current.setFieldsValue(obj);
        that.forceUpdate();
    }





    //标题设置
    getSuggestInfo(){
        getSuggestInfo().then(res=>{
            this.setState({
                titleInfo:res.data
            })
        })
    }
    submitTitleForm(val){
        this.setSuggestInfo(val)
        // this.closeDialog(this.formRefTitle, "titleShow")
        this.setState({titleShow:false})
    }
    setSuggestInfo(val){
        let params = {
            ...this.formRefTitle.current.getFieldValue(),
            ...val
        }
        setSuggestInfo(params).then(res => {
            message.success("设置成功")
            this.setState({
                titleShow: false
            }, () => {
                this.getSuggestInfo()
            })
        })
    }
}