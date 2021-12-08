import React, { Component } from 'react'
import { getList, addList, updateList, deleteConfig } from 'api'
import { Radio, Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import { MySyncBtn } from "@/components/views.js"
import { MyImageUpload } from '@/components/views.js';
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
            key: "LIMITED_TIME_TASK",
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
            visible: false,
            tagList: [],
            channelList: [],
            currentItem: "",
            source: "",
            searchWord: {},
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
                    title: "任务标题",
                    dataIndex: "title",
                    key: "title",
                    // width: 200,
                },
                {
                    title: "任务描述",
                    dataIndex: "taskDesc",
                    key: "taskDesc",

                },
                {
                    title: "任务类型",
                    dataIndex: "taskType",
                    key: "taskType",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == 1?"每日看电视-累计时间":rowValue == 2?"每日看电视-观看频道数":"未知"}</div>
                        )
                    }
                },
                {
                    title: "任务天数",
                    dataIndex: "taskDays",
                    key: "taskDays",
                },
                {
                    title: "缩略图",
                    dataIndex: "pic",
                    key: "pic",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={rowValue} />)
                    }
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "start",
                    key: "start",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="已上线" unCheckedChildren="未上线" key={new Date().getTime()}
                                    defaultChecked={(row.start<=(new Date().getTime() / 1000) && row.end>(new Date().getTime()/ 1000))? true : false} disabled
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "有效时间",
                    dataIndex: "start",
                    key: "start",
                    width: 350,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.start * 1000, "")} - {util.formatTime(row.end * 1000, "")}</div>
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
                                            arr.time = [moment(arr.start * 1000), moment(arr.end * 1000)]
                                            arr.taskStatus = arr.taskStatus == 1 ? true : false
                                            arr.rewardType = arr.reward.rewardType
                                            arr.rewardCount = arr.reward.rewardCount
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
        let { channelList, lists, layout, loading, columns, entranceState, tagList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>赚赚限时任务</Breadcrumb.Item>
                        </Breadcrumb>
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
                                        this.formRef.current.setFieldsValue({ "status": true });
                                    })
                                }}
                            >新增</Button>
                             <MySyncBtn type={7} name='同步缓存' params={{ key: this.state.key }} />
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
                <Modal title="新增任务" centered visible={entranceState} onCancel={() => {
                    this.setState({ entranceState: false })
                    this.formRef.current.resetFields()
                }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="名称" name="title" rules={[{ required: true, message: '请填写名称' }]} >
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                            <Form.Item label="任务描述" name="taskDesc" rules={[{ required: true, message: '请填写任务描述' }]}   >
                                <Input placeholder="请输入任务描述" />
                            </Form.Item>
                            <Form.Item label="任务类型" name="taskType" rules={[{ required: true, message: '请选择任务类型' }]}>
                                <Select
                                    placeholder="请输入用户标签"
                                    allowClear
                                    {...this.state.selectProps}
                                >
                                    <Option value={1} key={1}>每日看电视-累计时间</Option>
                                    <Option value={2} key={2}>每日看电视-观看频道数</Option>

                                </Select>
                            </Form.Item>
                            <Form.Item label="任务天数" name="taskDays" rules={[{ required: true, message: '请填写任务天数' }]}   >
                                <InputNumber placeholder="请输入任务天数" min={0} />
                            </Form.Item>
                            <Form.Item label="有效时间" name="time" rules={[{ required: true, message: '请选择有效时间' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="达成奖励" name="rewardType" rules={[{ required: true, message: '请选择达成奖励' }]}>
                                <Select
                                    placeholder="请输入用户标签"
                                    allowClear
                                    {...this.state.selectProps}
                                    onChange={() => {
                                        this.formRef.current.setFieldsValue({ "rewardCount": "" })
                                        this.forceUpdate()
                                    }}
                                >
                                    <Option value={1} key={1}>每日看电视-累计时间</Option>
                                    <Option value={2} key={2}>每日看电视-观看频道数</Option>

                                </Select>
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("rewardType") == 1
                                    ?
                                    <Form.Item label="金币" name="rewardCount" rules={[{ required: true, message: '请输入金币' }]}>
                                        <InputNumber min={0} />
                                    </Form.Item>
                                    :

                                    this.formRef.current && this.formRef.current.getFieldValue("rewardType") == 2 ?
                                        <Form.Item label="会员天数" name="rewardCount" rules={[{ required: true, message: '请选择会员天数' }]}>
                                            <Select
                                                placeholder="请输入用户标签"
                                                allowClear
                                            // {...this.state.selectProps}
                                            >
                                                <Option value={1} key={1}>1天</Option>
                                                <Option value={3} key={3}>3天</Option>
                                                <Option value={7} key={7}>7天</Option>
                                                <Option value={15} key={15}>15天</Option>
                                                <Option value={30} key={30}>1个月</Option>
                                                <Option value={90} key={90}>3个月</Option>

                                            </Select>
                                        </Form.Item>
                                        :
                                        ""

                            }
                            <Form.Item label="活动规则" name="taskRule" rules={[{ required: true, message: '请填写活动规则' }]}  >
                                <Input.TextArea placeholder="活动规则" />
                            </Form.Item>
                            <Form.Item label="背景图" name="pic" rules={[{ required: true, message: '请上传背景图' }]}  >
                                <MyImageUpload
                                    getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('pic', file, newItem) }}
                                    imageUrl={this.getUploadFileImageUrlByType('pic')} />
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
        this.getList();
    }
    // changeSize = (page, pageSize) => {   // 分页
    //     console.log(page, pageSize);
    //     this.setState({
    //         page: page,
    //         pageSize: pageSize
    //     }, () => {
    //         this.getList()
    //     })
    // }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (this.state.source == "edit") {
            this.updateList(val)
        } else {
            this.addList(val)
        }
        this.closeModal()
    }

    getList() {
        let params = {
            key: "LIMITED_TIME_TASK"
        }
        getList(params).then(res => {
            this.setState({
                lists: res.data.data
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addList(val) {
        let header={
            key:this.state.key,
        }
        let params = {
            ...val,
            start: parseInt(val.time[0].valueOf() / 1000),
            end: parseInt(val.time[1].valueOf() / 1000),
            reward:{
                rewardType:val.rewardType,
                rewardCount:val.rewardCount
            }
        }
        addList(header,params).then(res => {
            this.getList()
            message.success("新增成功")
        })
    }
    updateList(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            start: parseInt(val.time[0].valueOf() / 1000),
            end: parseInt(val.time[1].valueOf() / 1000),
            reward:{
                rewardType:val.rewardType,
                rewardCount:val.rewardCount
            }
        }
        let header={
            key:this.state.key,
            id:this.state.currentItem.indexId
        }
        // return console.log(params,"params")
        updateList(header,params).then(res => {
            this.getList()
            message.success("更新成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.deleteConfig(obj)
            },
            onCancel: () => {
            }
        })
    }
    deleteConfig(item) {
        let params = {
            key: this.state.key,
            id: item.indexId
        }
        deleteConfig(params).then(res => {
            message.success("删除成功")
            this.getList()
        })
    }
      //获取上传文件
      getUploadFileUrl(type, file, newItem) {
        let that = this;
        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;

        that.formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    //获取上传文件图片地址 
    getUploadFileImageUrlByType(type) {
        let that = this;
        if(that.formRef.current){
            let image_url = that.formRef.current.getFieldValue(type);
            return image_url ? image_url : '';
        }else{
            return null
        }
        
    }
    // copySource(item) {
    //     let params = {
    //         ...item
    //     }
    //     copySource(params).then(res => {
    //         message.success("复制成功")
    //         this.getList()
    //     })
    // }
    // getTagsName(val) {
    //     let arr = this.state.tagList.filter(r => r.code == val)
    //     if (arr.length > 0) {
    //         return arr[0].name
    //     } else {
    //         return ""
    //     }
    // }
}