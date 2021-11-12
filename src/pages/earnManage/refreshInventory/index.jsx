import React, { Component } from 'react'
import { getRefresh, getZzItemList ,addRefresh,changeRefresh,delRefresh} from 'api'
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
            productLists: [],
            visible: false,
            tagList: [],
            currentItem: "",
            source: "",
            columns: [
                {
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "关联提现商品",
                    dataIndex: "zzItemCode",
                    key: "zzItemCode",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    this.state.productLists.filter(r => r.code == rowValue).length > 0 ? this.state.productLists.filter(r => r.code == rowValue)[0].name : "未知"
                                }
                            </div>
                        )
                    }
                },
                {
                    title: "上线时间-下线时间",
                    dataIndex: "startAt",
                    key: "startAt",
                    width: 400,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{util.formatTime(row.startAt, "")} - {util.formatTime(row.endAt, "")}</div>
                        )
                    }
                },
                {
                    title: "刷新库存时间",  // //1:android,2:ios,3:全端
                    dataIndex: "setting",
                    key: "setting",
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "state",
                    key: "state",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val,row)
                                        this.changeRefresh(row)
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
                                            let list= []
                                            if(arr.setting){
                                                arr.setting.split(",").forEach(r=>{
                                                    list.push({num:moment(r,format)})
                                                })
                                               
                                            } 
                                            arr.setting = list
                                            // arr.setting = arr.setting ? arr.setting.split(",") : []
                                            arr.time = [moment(arr.startAt), moment(arr.endAt)]
                                            arr.state = arr.state == 0 ? false : true
                                            console.log(arr, "arr")
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
                            <Breadcrumb.Item>刷新库存列表</Breadcrumb.Item>
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
                                    })
                                }}
                            >新增</Button>
                            {/* <MySyncBtn type={13} name='同步缓存' /> */}
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
                            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请填写名称' }]}>
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                            <Form.Item label="关联提现商品" name="zzItemCode" rules={[{ required: true, message: '请选择关联提现商品' }]}>
                                <Select allowClear placeholder="请选择关联提现商品">
                                    {
                                        productLists.map((r, i) => {
                                            return <Option value={r.code} key={r.code}>{r.name}</Option>
                                        })
                                    }

                                </Select>
                            </Form.Item>
                            <Form.Item label="上线时间-下线时间" name="time" rules={[{ required: true, message: '请选择上下线时间' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="库存" name="zzItemStock" rules={[{ required: true, message: '请填写初始库存' }]}>
                                <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item label="状态" name="state" valuePropName="checked" rules={[{ required: true}]}>
                                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                            </Form.Item>
                            <Form.Item
                                label="刷新库存时间"
                                // name="voters"
                                rules={[{ required: true, message: '刷新库存时间' }]}
                            >
                                <Form.List name="setting" rules={[{ required: true, message: '刷新库存时间' }]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline" style={{ width: "100%" }}>
                                                    <Form.Item {...field} label="" name={[field.name, "num"]} fieldKey={[field.fieldKey, "num"]}>
                                                        <TimePicker  format={format} />
                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => { remove(field.name) }} />
                                                </Space>
                                            ))}

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => { add() }} block icon={<PlusOutlined />}>
                                                    新建刷新库存时间
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
        this.getZzItemList()
        this.getRefresh();
    }
    //获取标签信息
    // requestNewAdTagList() {
    //     requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
    //         this.setState({
    //             tagList: res.data,
    //         });
    //     })
    // }

    changeStart(e) {
        console.log(e);
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getRefresh()
        })
    }
    getZzItemList() {
        let params = {
            "page": {
                "currentPage": this.state.page, // (int)页码
                "pageSize": 9999 // (int)每页数量
            }
        }
        getZzItemList(params).then(res => {
            this.setState({
                productLists: res.data.data,
            })
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

    getRefresh() {
        let params = {
            "page": {
                "currentPage": this.state.page, // (int)页码
                "pageSize": this.state.pageSize // (int)每页数量
            }
        }
        getRefresh(params).then(res => {
            this.setState({
                lists: res.data.data,
                total: res.data.page.totalCount
            })
        })
    }
    closeModal() {
        this.setState({
            entranceState: false
        })
    }
    addRefresh(val) {
        let setting = []
        if(val.setting){
            val.setting.forEach(r=>{
                setting.push(moment(r.num).format(format))
            })
        }
        let params = {
            ...val,
            startAt: val.time[0].valueOf(),
            endAt: val.time[1].valueOf(),
            state: val.state ? 1 : 0,
            setting: setting.join(",")
        }
        addRefresh(params).then(res => {
            this.getRefresh()
            message.success("成功")
        })
    }


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
    delRefresh(code) {
        let params = {
            zzItemCodes: code
        }
        delRefresh(params).then(res => {
            message.success("删除成功")
            this.getRefresh()
        })
    }
    changeRefresh(val) {
        let params = {
            zzItemCodes: val.zzItemCode
        }
        changeRefresh(params).then(res => {
           
        }).catch((err) => {

        })
    }
}