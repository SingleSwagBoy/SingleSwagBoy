import React, { Component } from 'react'
import { getProgramlist, getProgramsList ,addRefresh,changeRefresh,delRefresh} from 'api'
import { Breadcrumb, Card, TimePicker, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
const format = 'HH:mm';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
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
            lists: [],
            productLists: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            columns: [
                {
                    title: "节目单id",
                    dataIndex: "programId",
                    key: "programId",
                },
                {
                    title: "节目单名称",
                    dataIndex: "programTitle",
                    key: "programTitle",
                },
                {
                    title: "已关联视频集数",
                    dataIndex: "total",
                    key: "total",
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
        let { productLists, lists, layout, loading, columns, entranceState, } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>节目单视频集配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                    extra={
                        <div>
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
                            <MySyncBtn type={13} name='同步缓存' />
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
                            <Form.Item label="节目单名称" name="zzItemCode" rules={[{ required: true, message: '请选择节目单名称' }]}>
                                <Select allowClear placeholder="请选择节目单名称" showSearch onSearch={(e)=>{
                                    this.getProgramsList(e)
                                }}>
                                    {
                                        productLists.map((r, i) => {
                                            return <Option value={r.code} key={r.code}>{r.name}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="视频集关联"
                                // name="voters"
                                rules={[{ required: true, message: '视频集关联' }]}
                            >
                                <Form.List name="setting" rules={[{ required: true, message: '视频集关联' }]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline" style={{ width: "100%" }}>
                                                    <Form.Item {...field} label="" name={[field.name, "num"]} fieldKey={[field.fieldKey, "num"]}>
                                                    <Select allowClear placeholder="请选择视频集">
                                                        {
                                                            productLists.map((r, i) => {
                                                                return <Option value={r.code} key={r.code}>{r.name}</Option>
                                                            })
                                                        }

                                                    </Select>
                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => { remove(field.name) }} />
                                                </Space>
                                            ))}

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => { add() }} block icon={<PlusOutlined />}>
                                                    新建关联视频集
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
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
        // this.getZzItemList()
        this.getProgramlist();
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
    getProgramsList(keyword) {
        let params = {
            channelId:4,
            keyword:keyword,
        }
        getProgramsList(params).then(res => {
            console.log(res.data.data)
            if(res.data.data && Array.isArray(res.data.data)){
                this.setState({
                    productLists: res.data.data,
                })
            }
            
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (this.state.source == "edit") {
            let item ={
                ...this.state.currentItem,
                ...val,
            }
            this.addRefresh(item)
        } else {
            this.addRefresh(val)
        }
        this.closeModal()
    }

    getProgramlist() {
        let params = {
            currentPage: this.state.page, // (int)页码
            pageSize: this.state.pageSize // (int)每页数量
        }
        getProgramlist(params).then(res => {
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
    // addRefresh(val) {
    //     let setting = []
    //     if(val.setting){
    //         val.setting.forEach(r=>{
    //             setting.push(moment(r.num).format(format))
    //         })
    //     }
    //     let params = {
    //         ...val,
    //         startAt: val.time[0].valueOf(),
    //         endAt: val.time[1].valueOf(),
    //         state: val.state ? 1 : 0,
    //         setting: setting.join(",")
    //     }
    //     addRefresh(params).then(res => {
    //         this.getProgramlist()
    //         message.success("成功")
    //     })
    // }


    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delRefresh(_obj.zzItemCode)
            },
            onCancel: () => {
            }
        })
    }
    // delRefresh(code) {
    //     let params = {
    //         zzItemCodes: code
    //     }
    //     delRefresh(params).then(res => {
    //         message.success("删除成功")
    //         this.getProgramlist()
    //     })
    // }
    // changeRefresh(val) {
    //     let params = {
    //         zzItemCodes: val.zzItemCode
    //     }
    //     changeRefresh(params).then(res => {
           
    //     }).catch((err) => {

    //     })
    // }
}