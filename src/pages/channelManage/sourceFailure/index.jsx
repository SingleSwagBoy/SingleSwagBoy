import React, { Component } from 'react'
import { getSource, requestNewAdTagList, updateSource, addSource, delSource, getChannel,copySource} from 'api'
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
                wrapperCol: { offset: 16, span: 48},
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
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                    width: 200,
                },
                {
                    title: "推荐频道",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{rowValue == 1 ? "推荐频道":rowValue == 2?"自动填充":"未知"}</div>
                        )
                    }
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
                    dataIndex: "onlineTime",
                    key: "onlineTime",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.onlineTime * 1000, "")} - {util.formatTime(row.offlineTime * 1000, "")}</div>
                        )
                    }
                },
                {
                    title: "排序",
                    dataIndex: "sortOrder",
                    key: "sortOrder",
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
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.status = val ? 1 : 2
                                        this.setState({
                                            currentItem: "",
                                        }, () => {
                                            this.updateSource(obj, "change")
                                        })

                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "备注",
                    dataIndex: "remark",
                    key: "remark",
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 250,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    size="small"
                                    onClick={() => { this.copySource(row) }}
                                >复制</Button>
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
                                            arr.time = [moment(arr.onlineTime * 1000), moment(arr.offlineTime * 1000)]
                                            arr.status = arr.status == 1 ? true : false
                                            arr.content = arr.content ? arr.content.split(",") : ""
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
                                    console.log(1, val)
                                    this.state.searchWord.name = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getSource()
                                    })

                                }} />
                        </div>
                        <div className="everyBody">
                            <div>上下线时间:</div>
                            <RangePicker placeholder={['上线时间', '下线时间']} showTime onChange={(e) => {
                                let searchInfo = this.state.searchWord
                                if (e) {
                                    searchInfo.onlineTime = moment(e[0]).valueOf()
                                    searchInfo.offlineTime = moment(e[1]).valueOf()
                                } else {
                                    searchInfo.onlineTime = ""
                                    searchInfo.offlineTime = ""
                                }
                                this.setState({
                                    page: 1,
                                }, () => {
                                    this.getSource()
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
                                        this.formRef.current.setFieldsValue({ "status": true });
                                    })
                                }}
                            >新增</Button>
                            <MySyncBtn type={19} name='同步缓存'/>
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
                            <Form.Item label="名称" name="name" >
                                <Input placeholder="名称" />
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
                            <Form.Item label="上下线时间" name="time" rules={[{ required: true, message: '请选择类型' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="推荐频道" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                                <Radio.Group onChange={()=>this.forceUpdate()}>
                                    <Radio.Button value={1} key={1}>选中频道</Radio.Button>
                                    <Radio.Button value={2} key={2}>自动填充</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("type") == 1
                                    ?
                                    <Form.Item label="频道名称" name="content" rules={[{ required: true, message: '请选择频道' }]}>
                                        <Select
                                            placeholder="请输入频道名称"
                                            allowClear
                                            mode="multiple"
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
                                                    return <Option value={r.code} key={i}>{r.name}------{r.code}</Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    :

                                    this.formRef.current && this.formRef.current.getFieldValue("type") == 2 ?
                                        <Form.Item label="频道个数" name="count" >
                                            <InputNumber placeholder="频道个数" min={0} />
                                        </Form.Item>
                                        : 
                                        ""

                            }

                            <Form.Item label="排序" name="sortOrder" >
                                <InputNumber placeholder="排序" />
                            </Form.Item>
                            <Form.Item label="备注" name="remark" >
                                <Input placeholder="备注" />
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
        this.getSource();
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
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getSource()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // return
        if (this.state.source == "edit") {
            this.updateSource(val)
        } else {
            this.addSource(val)
        }
        this.closeModal()
    }

    getSource() {
        let params = {
            name: this.state.searchWord.name,
            onlineTime: parseInt(this.state.searchWord.onlineTime / 1000),
            offlineTime: parseInt(this.state.searchWord.offlineTime / 1000),
            "page": {
                "currentPage": this.state.page,
                "pageSize": this.state.pageSize
            }
        }
        getSource(params).then(res => {
            this.setState({
                lists: res.data.data,
                total: res.data.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addSource(val) {
        let content = []
        if(val.type == 2){
            let arr = util.getRandomArrayValue(this.state.channelList,val.count)
            arr.forEach(r=>{
                content.push(r.code)
            })
            
        }
        let params = {
            ...val,
            onlineTime: parseInt(val.time[0].valueOf() / 1000),
            offlineTime: parseInt(val.time[1].valueOf() / 1000),
            status: val.status ? 1 : 2,
            content:val.type== 1?val.content?val.content.join(","):"":content.join(",")
            // channelName: this.state.channelList.filter(r => r.code == val.channelId)[0].name
        }
        addSource(params).then(res => {
            this.getSource()
            message.success("新增成功")
        })
    }
    updateSource(val, type) {
        let params = ""
        if (type == "change") {
            params = {
                ...val
            }
        } else {
            let content = []
            if(val.type == 2){
                let arr = util.getRandomArrayValue(this.state.channelList,val.count)
                arr.forEach(r=>{
                    content.push(r.code)
                })
                
            }
            params = {
                ...this.state.currentItem,
                ...val,
                onlineTime: parseInt(val.time[0].valueOf() / 1000),
                offlineTime: parseInt(val.time[1].valueOf() / 1000),
                status: val.status ? 1 : 2,
                content:val.type== 1?val.content?val.content.join(","):"": content.join(",")
            }
        }
        // return console.log(params,"params")
        updateSource(params).then(res => {
            this.getSource()
            message.success("更新成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delSource(obj)
            },
            onCancel: () => {
            }
        })
    }
    delSource(item) {
        let params = {
            id: item.id
        }
        delSource(params).then(res => {
            message.success("删除成功")
            this.getSource()
        })
    }
    copySource(item) {
        let params = {
            ...item
        }
        copySource(params).then(res => {
            message.success("复制成功")
            this.getSource()
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