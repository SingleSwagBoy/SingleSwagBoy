import React, { Component } from 'react'
import { getEnterChannel, requestNewAdTagList, uploadEnterChannel, addEnterChannel, delEnterChannel, getChannel } from 'api'
import { Radio, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
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
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                },
                {
                    title: "频道编码",
                    dataIndex: "bootChannelCode",
                    key: "bootChannelCode",
                },
                {
                    title: "用户标签",
                    dataIndex: "tag",
                    key: "tag",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getTagsName(rowValue)}</div>
                        )
                    }
                },
                {
                    title: "上线时间-下线时间",
                    dataIndex: "startTime",
                    key: "startTime",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.startTime * 1000, "")} - {util.formatTime(row.endTime * 1000, "")}</div>
                        )
                    }
                },
                {
                    title: "优先级",
                    dataIndex: "sortOrder",
                    key: "sortOrder",
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "enabled",
                    key: "enabled",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.enabled = val ? 1 : 2
                                        this.setState({
                                            currentItem: "",
                                        }, () => {
                                            this.uploadEnterChannel(obj, "change")
                                        })

                                    }}
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
                                            arr.time = [moment(arr.startTime * 1000), moment(arr.endTime * 1000)]
                                            arr.enabled = arr.enabled == 1 ? true : false
                                            this.formRef.current.setFieldsValue(arr)
                                            this.getChannel(arr.bootChannelCode)
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
                    <div className="marsBox">
                        <div className="everyBody">
                            <div>名称:</div>
                            <Input.Search
                                allowClear
                                onChange={(val) => {
                                    this.state.searchWord.name = val.target.value
                                }}
                                onSearch={(val) => {
                                    console.log(1, val)
                                    this.state.searchWord.name = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getEnterChannel()
                                    })

                                }} />
                        </div>
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
                            <MySyncBtn type={20} name='同步缓存' />
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
                <Modal title="新建" centered visible={entranceState} onCancel={() => {
                    this.setState({ entranceState: false })
                    this.formRef.current.resetFields()
                }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="频道名称" name="bootChannelCode" rules={[{ required: true, message: '请选择频道' }]}>
                                <Select
                                    placeholder="请输入频道名称"
                                    allowClear
                                    // mode="multiple"
                                    {...this.state.selectProps}
                                    onSearch={(val) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            this.getChannel(val)
                                        }, 1000)
                                    }}
                                    // onChange={(e) => {
                                    //     console.log(e)
                                    //     this.formRef.current.setFieldsValue({ "bootChannelCode": e })
                                    // }}
                                >
                                    {
                                        channelList.map((r, i) => {
                                            return <Option value={r.code} key={i}>{r.name}------{r.code}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="用户标签" name="tag">
                                <Select
                                    placeholder="请输入用户标签"
                                    allowClear
                                    {...this.state.selectProps}
                                // onSearch={(val) => {
                                //     if (privateData.inputTimeOutVal) {
                                //         clearTimeout(privateData.inputTimeOutVal);
                                //         privateData.inputTimeOutVal = null;
                                //     }
                                //     privateData.inputTimeOutVal = setTimeout(() => {
                                //         if (!privateData.inputTimeOutVal) return;
                                //         this.getChannel(val)
                                //     }, 1000)
                                // }}
                                >
                                    {
                                        tagList.map((r, i) => {
                                            return <Option value={r.code} key={i}>{r.name}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>


                            <Form.Item label="开始时间-结束时间" name="time" rules={[{ required: true, message: '请选择开始时间和结束时间' }]}>
                                <RangePicker placeholder={['开始时间', '结束时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="下发人数" name="maxCount" >
                                <InputNumber placeholder="下发人数" style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="开机频率" name="frequencyDays" >
                                <Input placeholder="开机频率" min={0} type="number" addonAfter={"天一次"} style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="优先级" name="sortOrder" >
                                <InputNumber placeholder="优先级" style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="状态" name="enabled" valuePropName="checked">
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
        this.getEnterChannel();
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
    //获取频道信息
    getChannel(val) {
        let params = {
            keywords: val,
            // page: {currentPage: 1, pageSize: 50}
        }
        getChannel(params).then(res => {
            if (res.data.errCode == 0 && res.data.data) {
                this.setState({
                    channelList: res.data.data
                });
            }
        })
    }
    changeSize = (page, pageSize) => {   // 分页
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getEnterChannel()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // return
        if (this.state.source == "edit") {
            this.uploadEnterChannel(val)
        } else {
            this.addEnterChannel(val)
        }
        this.closeModal()
    }

    getEnterChannel() {
        let params = {
            bootChannelCode: this.state.searchWord.name,
            page:{
                currentPage:this.state.page,
                pageSize:this.state.pageSize
            }
        }
        getEnterChannel(params).then(res => {
            this.setState({
                lists: res.data,
                total: res.totalCount
            })
        })
    }
    closeModal() {
        this.formRef.current.resetFields()
        this.setState({
            entranceState: false
        })
    }
    addEnterChannel(val) {
        let params = {
            ...val,
            startTime: parseInt(val.time[0].valueOf() / 1000),
            endTime: parseInt(val.time[1].valueOf() / 1000),
            enabled: val.enabled ? 1 : 2,
            frequencyDays:Number(val.frequencyDays)
        }
        addEnterChannel(params).then(res => {
            this.getEnterChannel()
            message.success("新增成功")
        })
    }
    uploadEnterChannel(val, type) {
        let params = ""
        if (type == "change") {
            params = {
                ...val
            }
        } else {
            params = {
                ...this.state.currentItem,
                ...val,
                startTime: parseInt(val.time[0].valueOf() / 1000),
                endTime: parseInt(val.time[1].valueOf() / 1000),
                enabled: val.enabled ? 1 : 2,
                frequencyDays:Number(val.frequencyDays),
                tag:val.tag?val.tag:""
            }
        }
        // return console.log(params,"params")
        uploadEnterChannel(params).then(res => {
            this.getEnterChannel()
            message.success("更新成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delEnterChannel(obj)
            },
            onCancel: () => {
            }
        })
    }
    delEnterChannel(item) {
        let params = {
            id: item.id
        }
        delEnterChannel(params).then(res => {
            message.success("删除成功")
            this.getEnterChannel()
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
}