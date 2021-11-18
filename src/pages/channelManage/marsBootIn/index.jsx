import React, { Component } from 'react'
import { getMarsList, requestNewAdTagList, uploadMarsList, addMarsList, delMarsList, getChannel } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
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
                wrapperCol: { offset: 20, span: 4 },
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
                    title: "频道名称",
                    dataIndex: "channelName",
                    key: "channelName",
                },
                {
                    title: "频道编码",
                    dataIndex: "channelId",
                    key: "channelId",
                },
                {
                    title: "标签",
                    dataIndex: "tags",
                    key: "tags",
                    // render: (rowValue, row, index) => {
                    //     return (
                    //         // 1=固定金额;2=固定人群;3=随机金额
                    //         <div>{rowValue == 1 ? "固定金额" : rowValue == 2 ? "固定人群" : rowValue == 3 ? "随机金额" : "未知"}</div>
                    //     )
                    // }
                },
                {
                    title: "上线时间-下线时间",
                    dataIndex: "startTime",
                    key: "startTime",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.startTime, "")} - {util.formatTime(row.endTime, "")}</div>
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
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        // this.changeZzItemList(row)
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
                                            arr.time = [moment(arr.startTime), moment(arr.endTime)]
                                            arr.status = arr.status == 1 ? true : false
                                            this.formRef.current.setFieldsValue(arr)
                                            this.getChannel(arr.channelName)
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
                                    console.log(1,val)
                                    this.state.searchWord.name = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getMarsList()
                                    })

                                }} />
                        </div>
                        <div className="everyBody">
                            <div>上下线时间:</div>
                            <RangePicker placeholder={['上线时间', '下线时间']} showTime onChange={(e) => {
                                let searchInfo = this.state.searchWord
                                if(e){
                                    searchInfo.startTime = moment(e[0]).valueOf()
                                    searchInfo.endTime = moment(e[1]).valueOf()
                                }else{
                                    searchInfo.startTime =""
                                    searchInfo.endTime = ""
                                }
                                this.setState({
                                    page: 1,
                                }, () => {
                                    this.getMarsList()
                                })
                            }}></RangePicker>
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
                                    })
                                }}
                            >新增</Button>
                            <MySyncBtn type={3} name='同步缓存' params={{key:"ad_mars_startup"}} />
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
                            <Form.Item label="频道名称" name="channelName" rules={[{ required: true, message: '请选择频道' }]}>
                                <Select
                                    placeholder="请输入频道名称"
                                    allowClear
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
                                    onChange={(e) => {
                                        console.log(e)
                                        this.formRef.current.setFieldsValue({ "channelId": e })
                                    }}
                                >
                                    {
                                        channelList.map((r, i) => {
                                            return <Option value={r.code} key={i}>{r.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="频道编码" name="channelId" >
                                <Input placeholder="频道编码" disabled />
                            </Form.Item>
                            <Form.Item label="标签" name="tags">
                                <Select
                                    placeholder="请输入标签"
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
                            <Form.Item label="上下线时间" name="time" rules={[{ required: true, message: '请选择类型' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
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
        this.getMarsList();
        this.requestNewAdTagList()
    }
    //获取标签信息
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                tagList: res.data,
            });
        })
    }
    //获取频道信息
    getChannel(val) {
        getChannel({ keyword: val }).then(res => {
            this.setState({
                channelList: res.data.data
            });
        })
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getMarsList()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (this.state.source == "edit") {
            this.uploadMarsList(val)
        } else {
            this.addMarsList(val)
        }
        this.closeModal()
    }

    getMarsList() {
        let params = {
            keyword: this.state.searchWord.name,
            startTime: this.state.searchWord.startTime,
            endTime: this.state.searchWord.endTime,
        }
        getMarsList(params).then(res => {
            this.setState({
                lists: res.data.data,
                // total: res.data.page.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addMarsList(val) {
        let params = {
            ...val,
            startTime: val.time[0].valueOf(),
            endTime: val.time[1].valueOf(),
            status: val.status ? 1 : 0,
            channelName: this.state.channelList.filter(r => r.code == val.channelId)[0].name
        }
        addMarsList(params).then(res => {
            this.getMarsList()
            message.success("新增成功")
        })
    }
    uploadMarsList(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            startTime: val.time[0].valueOf(),
            endTime: val.time[1].valueOf(),
            status: val.status ? 1 : 0,
            channelName: this.state.channelList.filter(r => r.code == val.channelId)[0].name
        }
        uploadMarsList(params).then(res => {
            this.getMarsList()
            message.success("更新成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delMarsList(obj)
            },
            onCancel: () => {
            }
        })
    }
    delMarsList(item) {
        let params = {
            indexId: item.indexId
        }
        delMarsList(params).then(res => {
            message.success("删除成功")
            this.getMarsList()
        })
    }
}