import React, { Component } from 'react'
// import request from 'utils/request'
import { getLivePreview, delLivePreview, setConfig, getConfig, updateLivePreview } from 'api'
import { Card, Breadcrumb, Button, message, Table, Switch, Modal, Form, Input, InputNumber } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import "./style.css"
import MyModel from "./MyModel"
import Address from "../../../components/address/index" //地域组件
import SyncBtn from "../../../components/syncBtn/syncBtn.jsx"


export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            lists: [],
            config: "",
            loading: false,
            searchWord: "",//搜索名称
            searchDate:"",//搜索日期
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            addressList: [
                { name: "定时任务", type: 1 },
                { name: "发送记录", type: 2 }
            ],
            visible: false,
            entranceState: false,//入口配置弹窗的状态
            defaultAddress: [],
            last_item_edit_id: '',  //上一个被编辑的id
            columns: [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                    width: 100,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {index + 1}-{rowValue}
                            </div>
                        )
                    }
                },
                {
                    title: "预告频道",
                    dataIndex: "channelCode",
                    key: "channelCode",
                },
                {
                    title: "预告节目",
                    dataIndex: "showTitle",
                    key: "showTitle",
                },
                {
                    title: "预告日期",
                    dataIndex: "date",
                    key: "date",
                },
                {
                    title: "节目id",
                    dataIndex: "programId",
                    key: "programId",
                },
                {
                    title: "开始时间",
                    dataIndex: "startTime",
                    key: "startTime",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.startTime, "", 7)}</div>
                        )
                    }
                },
                {
                    title: "结束时间",
                    dataIndex: "endTime",
                    key: "endTime",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.endTime, "", 7)}</div>
                        )
                    }
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Switch checkedChildren="有效" unCheckedChildren="无效"
                                    key={new Date().getTime()}
                                    defaultChecked={rowValue === 1 ? true : false}
                                    onChange={(val) => {
                                        if (val) row.status = 1
                                        else row.status = 2
                                        this.updateLivePreview(row)
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "排序",
                    dataIndex: "sortOrder",
                    key: "sortOrder",
                    render: (rowValue, row, index) => {
                        let is_edit = row.is_edit_sort;
                        if (!is_edit) {
                            is_edit = false;
                            row.is_edit_sort = false;
                        }
                        return (
                            is_edit && this.state.last_item_edit_id === row.id ?
                                <InputNumber min={0} max={1000} defaultValue={rowValue} onBlur={(e) => {
                                    let that = this;
                                    let target = e.target;
                                    let max = parseInt(target.ariaValueMax);
                                    let min = parseInt(target.ariaValueMin);
                                    let now = parseInt(e.target.value);

                                    //校验大小
                                    if (now > max) now = max;
                                    else if (now < min) now = min;

                                    //更新数据
                                    let last_sortOrder = row.sortOrder;
                                    if (last_sortOrder == now) {
                                        row.is_edit_sort = false;
                                    } else {
                                        row.sortOrder = now;
                                        that.updateLivePreview(row);
                                    }

                                    row.is_edit_sort = false;
                                    that.forceUpdate();

                                }} />
                                :
                                <a onClick={() => {
                                    let that = this;
                                    row.is_edit_sort = true;
                                    that.setState({
                                        last_item_edit_id: row.id,
                                    }, () => {
                                        that.forceUpdate();
                                    })

                                }}>{rowValue}</a>
                        )
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    fixed: 'right', width: 250,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button size="small" type="primary" style={{ margin: "0 10px" }}
                                    onClick={() => {
                                        this.setState({
                                            visible: true
                                        }, () => {
                                            this.refs.getMyModal.getFormData(row)
                                        })
                                    }}>编辑</Button>
                                <Button size="small" danger onClick={() => { this.delArt(row) }} >删除</Button>
                            </div>
                        )
                    }
                }

            ],
        }
    }
    render() {
        const { addressList, listType } = this.state;
        return (
            <div className="livePreview_page">
                <Card title={
                    <>
                        {/* <Breadcrumb>
                            <Breadcrumb.Item>直播预告</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <div style={{display:"flex"}}>
                            <div className="everyBody">
                                <div>节目名称:</div>
                                <Input.Search
                                    allowClear
                                    placeholder="请输入搜索的节目名称"
                                    onSearch={(val) => {
                                        this.state.searchWord = val
                                        this.setState({
                                            page: 1,
                                            searchWord: val
                                        }, () => {
                                            this.getLivePreview()
                                        })

                                    }}
                                />
                            </div>
                            <div className="everyBody" style={{marginLeft:"20px"}}>
                                <div>预告日期:</div>
                                <Input.Search
                                    allowClear
                                    placeholder="请输入预告日期"
                                    onSearch={(val) => {
                                        this.state.searchDate = val
                                        this.setState({
                                            page: 1,
                                            searchDate: val
                                        }, () => {
                                            this.getLivePreview()
                                        })

                                    }}
                                />
                            </div>
                        </div>

                    </>
                }
                    extra={
                        <div>
                            <Button type="primary" style={{ margin: "0 0 0 20px" }}
                                onClick={() => {
                                    this.setState({
                                        visible: true
                                    }, () => {
                                        this.refs.getMyModal.getFormData()
                                    })
                                }}
                            >新增</Button>
                            <Button type="primary" style={{ margin: "0 0 0 20px" }}
                                onClick={() => {
                                    this.setState({
                                        entranceState: true
                                    }, () => {
                                        this.formRef.current.setFieldsValue(this.state.config)
                                        this.formRef.current.setFieldsValue({ "area": this.state.config.area ? this.state.config.area.split(",") : "" })
                                        this.setState({
                                            defaultAddress: this.state.config.area ? this.state.config.area.split(",") : []
                                        })
                                    })
                                }}
                            >入口配置</Button>

                            <SyncBtn type={2} name='直播轮播缓存' desc='直播轮播缓存(直播预告/轮播推荐/观影厅频道配置)' />
                            <SyncBtn type={3} name='入口配置缓存' desc='这是入口配置的缓存按钮' params={{ key: 'CHANNEL.PROGRAM_ADVANCE' }} />

                        </div>
                    }
                >
                    <Table dataSource={this.state.lists} scroll={{ x: 1300 }} rowKey={item => item.id} loading={this.state.loading} columns={this.state.columns}
                        pagination={{
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.changeSize,
                        }}
                    />

                </Card>
                <MyModel visible={this.state.visible} getLivePreview={this.getLivePreview.bind(this)} closeModel={() => { this.setState({ visible: false }) }} ref="getMyModal" />
                <Modal
                    title="入口配置"
                    centered
                    visible={this.state.entranceState}
                    onCancel={() => { this.setState({ entranceState: false }) }}
                    footer={null}
                    // forceRender={true}
                    width={800}
                >
                    {
                        <Form
                            {...this.state.layout}
                            name="voting"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}
                        >
                            <Form.Item
                                label="首页"
                                name="index"
                            // rules={[{ required: true, message: '请输入节目描述' }]}
                            >
                                <Switch checkedChildren="有效" unCheckedChildren="无效"
                                    key={new Date().getTime()}
                                    defaultChecked={this.formRef.current ? this.formRef.current.getFieldValue("index") === 1 ? true : false : false}
                                />
                            </Form.Item>
                            <Form.Item
                                label="详情页"
                                name="detail"
                            // rules={[{ required: true, message: '请输入节目描述' }]}
                            >
                                <Switch checkedChildren="有效" unCheckedChildren="无效"
                                    key={new Date().getTime()}
                                    defaultChecked={this.formRef.current ? this.formRef.current.getFieldValue("detail") === 1 ? true : false : false}
                                />
                            </Form.Item>
                            <Form.Item
                                label="支持地域"
                                name="area"
                            // rules={[{ required: true, message: '请输入节目描述' }]}
                            >
                                <Address defaultAddress={this.state.defaultAddress}
                                    onCheckAddress={this.onCheckAddress.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="白名单" name="ip">
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item {...this.state.tailLayout}>
                                <Button htmlType="submit" type="primary" >
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
        this.getLivePreview()
        this.getConfig()
    }
    changeSize = (page, pageSize) => {
        // 分页获取
        this.setState({
            page,
            pageSize
        }, () => {
            this.getLivePreview()
        })

    }
    getLivePreview() {
        let that = this;
        let params = {
            date: this.state.searchDate,
            page: { currentPage: this.state.page, pageSize: this.state.pageSize },
            showTitle: this.state.searchWord
        }
        // let last_data = res.data.data;

        that.setState({ lists: [] }, () => {
            getLivePreview(params).then(res => {
                if (res.data.errCode === 0) {
                    this.setState({
                        lists: res.data.data,
                        total: res.data.totalCount
                    })
                }
            })
        });


    }
    delArt(item) {
        Modal.confirm({
            title: '删除此消息',
            content: '确认删除？',
            onOk: () => {
                this.delLivePreview(item)
            },
            onCancel: () => {

            }
        })
    }
    delLivePreview(item) {
        delLivePreview({ id: item.id }).then(res => {
            if (res.data.errCode === 0) {
                message.success("删除成功")
                this.getLivePreview()
            } else {
                message.error("删除失败")
            }
        })
    }
    // 入口配置的提交
    submitForm(val) {
        console.log(val)
        this.setConfig(val)
    }
    onCheckAddress(val) {
        let postAddress = val.filter(item => item !== "all")
        let arr = []
        postAddress.forEach(r => {
            if (r.indexOf("-") !== -1) {
                arr.push(r.replace("-", ""))
            } else {
                arr.push(r)
            }
        })
        this.setState({
            defaultAddress: arr
        })
        this.formRef.current.setFieldsValue({ "area": arr })
    }
    setConfig(val) { // 设置
        let params = {
            ...val,
            area: val.area.join(","),
            index: val.index && val.index != 2 ? 1 : 2,
            detail: val.detail && val.detail != 2 ? 1 : 2,
        }
        setConfig({ key: "CHANNEL.PROGRAM_ADVANCE" }, params).then(res => {
            if (res.data.errCode == 0) {
                message.success("设置成功")
                this.getConfig()
                this.setState({
                    entranceState: false
                })
            } else {
                message.error("设置失败")
            }
        })
    }
    getConfig() {
        getConfig({ key: "CHANNEL.PROGRAM_ADVANCE" }).then(res => {
            if (res.data.errCode == 0) {
                this.setState({
                    config: res.data.data
                })
            }
        })
    }
    updateLivePreview(item) {
        let that = this;
        let params = {
            ...item
        }
        updateLivePreview(params).then(res => {
            if (res.data.errCode === 0) {
                that.getLivePreview();
            } else {
                message.error("更新失败")
            }
        })
    }
}
