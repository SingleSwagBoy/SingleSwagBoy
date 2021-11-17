import React, { Component } from 'react'
import { getZzItemList, requestNewAdTagList, editZzItemList, addZzItemList, deleteZzItemList, changeZzItemList, rsZzItemList } from 'api'
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
            currentItem: "",
            source: "",
            levelList: [
                { level: 1, name: "青铜" },
                { level: 2, name: "白银" },
                { level: 3, name: "黄金" },
                { level: 4, name: "钻石" },
            ],
            columns: [
                {
                    title: "提现商品名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "商品code",
                    dataIndex: "manualCode",
                    key: "manualCode",
                },
                {
                    title: "类型",
                    dataIndex: "type",
                    key: "type",
                    render: (rowValue, row, index) => {
                        return (
                            // 1=固定金额;2=固定人群;3=随机金额
                            <div>{rowValue == 1 ? "固定金额" : rowValue == 2 ? "固定人群" : rowValue == 3 ? "随机金额" : "未知"}</div>
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
                    title: "排序",  // //1:android,2:ios,3:全端
                    dataIndex: "sort",
                    key: "sort",
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
                                        console.log(val)
                                        // row.state = val ? 1 : 0
                                        this.changeZzItemList(row)
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "备注",
                    dataIndex: "note",
                    key: "note",
                    ellipsis: true,
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: 'right', width: 210,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                    size="small"
                                    onClick={() => this.addZzItemList(row, "copy")}
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
                                            arr.setting = JSON.parse(arr.setting)
                                            // if (row.type == 1) {
                                            //     arr.setting.forEach(r => {
                                            //         r.num = row.stock * r.ratio / 100
                                            //     })
                                            // }
                                            arr.time = [moment(arr.startAt), moment(arr.endAt)]
                                            arr.state = arr.state == 0 ? false : true
                                            this.formRef.current.setFieldsValue(arr)
                                            this.rsZzItemList(row)
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
        let { levelList, lists, layout, loading, columns, entranceState, tagList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>提现商品列表</Breadcrumb.Item>
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
                            <MySyncBtn type={13} name='同步缓存' />
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
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("type") == 1 ?
                                    <Form.Item label="价格" name="price" rules={[{ required: true, message: '请填写价格' }]}>
                                        <InputNumber placeholder="请输入商品价格" min={0} style={{ width: "200px" }} />
                                    </Form.Item> : ""
                            }
                            <Form.Item label="提现商品名称" name="name" rules={[{ required: true, message: '请填写任务名称' }]}>
                                <Input placeholder="请输入商品名称" />
                            </Form.Item>
                            <Form.Item label="商品code" name="manualCode" rules={[{ required: true, message: '请输入code' }]}>
                                <Input placeholder="请输入商品code" />
                            </Form.Item>
                            {/*  */}
                            <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                                <Select allowClear placeholder="请选择类型" onChange={(e) => {
                                    console.log(e, "e")
                                    this.formRef.current.setFieldsValue({ "type": e, "setting": [{ "tagCode": "none" }] })
                                    this.forceUpdate()
                                }}>
                                    <Option value={1} key={1}>固定金额</Option>
                                    <Option value={2} key={2}>固定人群</Option>
                                    <Option value={3} key={3}>随机金额</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="上线时间-下线时间" name="time" rules={[{ required: true, message: '请选择上下线时间' }]}>
                                <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
                            </Form.Item>
                            <Form.Item label="状态" name="state" valuePropName="checked">
                                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                            </Form.Item>
                            <Form.Item label="备注" name="note" >
                                <Input placeholder="请输入备注" />
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("type") == 1 ?
                                    <>
                                        <Alert
                                            message="警告"
                                            description="更改完实时库存和更改配置里面的库存比列，必须要点击重新计算的按钮，慎点慎点慎点!!!"
                                            type="error"
                                            // closable
                                            // onClose={onClose}、
                                            style={{ marginBottom: "20px", textAlign: "center" }}
                                        />
                                        <Form.Item {...this.state.tailLayout}>
                                            <Button danger onClick={this.getNewNum.bind(this)}>重新计算</Button>
                                        </Form.Item>
                                    </>

                                    : ""
                            }

                            <Form.Item label="实时库存" name="stock" rules={[{ required: true, message: '请填写实时库存' }]}>
                                <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item label="排序" name="sort" rules={[{ required: true, message: '请填写排序' }]}>
                                <InputNumber min={0} />
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("type") == 1
                                    ?
                                    // 固定商品
                                    <Form.Item
                                        label="配置"
                                        name="setting"
                                        rules={[{ required: true, message: '请增加配置' }]}
                                    >
                                        <Form.List name="setting" rules={[{ required: true, message: '配置' }]}>
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map((field, index) => (
                                                        <Space key={field.key} align="baseline">
                                                            <Form.Item {...field} label="用户等级" name={[field.name, 'level']} fieldKey={[field.fieldKey, 'level']}>
                                                                <Select allowClear style={{ width: "200px" }}
                                                                    onChange={(e) => {
                                                                        let arr = this.formRef.current.getFieldValue("setting")
                                                                        arr[index].level = e
                                                                        this.formRef.current.setFieldsValue({ "setting": arr })
                                                                    }}
                                                                >
                                                                    {
                                                                        levelList.map(r => {
                                                                            return <Option value={r.level} key={r.level}
                                                                                disabled={this.getDisable(r, "level", "level")}
                                                                            >{r.name}</Option>
                                                                        })
                                                                    }
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item {...field} label="占库存比例（%）" name={[field.name, 'ratio']} fieldKey={[field.fieldKey, 'ratio']}>
                                                                <InputNumber min={0} max={100} onChange={(e) => {
                                                                    if (!this.formRef.current.getFieldValue("stock")) return message.error("请先输入库存")
                                                                    console.log(e)
                                                                    let arr = this.formRef.current.getFieldValue("setting")
                                                                    let total = 0
                                                                    arr.forEach(r => {
                                                                        total = total + Number(r.ratio)
                                                                    })
                                                                    console.log(total, "现有总数比列")
                                                                    if (total > 100) {
                                                                        arr[index].ratio = e - (total - 100)
                                                                        // arr[index].num = Math.floor(arr[index].ratio * this.formRef.current.getFieldValue("stock") / 100)
                                                                        this.formRef.current.setFieldsValue({ "setting": arr })
                                                                        this.forceUpdate()
                                                                        return
                                                                    }
                                                                    // arr[index].num = Math.floor(e * this.formRef.current.getFieldValue("stock") / 100)
                                                                    this.formRef.current.setFieldsValue({ "setting": arr })
                                                                    this.forceUpdate()
                                                                }} />
                                                            </Form.Item>
                                                            <Form.Item {...field} label="当前库存" name={[field.name, 'num']} fieldKey={[field.fieldKey, 'num']}>
                                                                <InputNumber min={0} disabled />
                                                            </Form.Item>

                                                            <MinusCircleOutlined onClick={() => {
                                                                remove(field.name)
                                                            }} />
                                                        </Space>
                                                    ))}

                                                    <Form.Item>
                                                        <Button type="dashed" onClick={() => {
                                                            if (this.formRef.current.getFieldValue("setting") && this.formRef.current.getFieldValue("setting").length >= 4) return message.error("最多四个等级")
                                                            add()
                                                        }} block icon={<PlusOutlined />}>
                                                            新建配置
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                    :
                                    this.formRef.current && this.formRef.current.getFieldValue("type") == 2
                                        ?
                                        // 固定人群
                                        <Form.Item
                                            label="配置"
                                            name="setting"
                                            rules={[{ required: true, message: '请增加配置' }]}
                                        >
                                            <Form.List name="setting">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map((field, index) => (
                                                            <Space key={field.key} align="baseline">
                                                                <Form.Item {...field} label="用户标签" name={[field.name, 'tagCode']} fieldKey={[field.fieldKey, 'tagCode']}>
                                                                    <Select style={{ width: "200px" }}
                                                                        disabled={this.formRef.current.getFieldValue("setting")[index] && this.formRef.current.getFieldValue("setting")[index].tagCode == "none"}
                                                                        onChange={(e) => {
                                                                            let arr = this.formRef.current.getFieldValue("setting")
                                                                            arr[index].tagCode = e
                                                                            this.formRef.current.setFieldsValue({ "setting": arr })
                                                                        }}
                                                                    >
                                                                        {
                                                                            tagList.map((r, i) => {
                                                                                return <Option value={r.code} key={i}
                                                                                    disabled={this.getDisable(r, "tagCode", "code")}
                                                                                >{r.name}</Option>
                                                                            })
                                                                        }

                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item {...field} label="金额（分）" name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                                                                    <InputNumber min={0} />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="角标图" name={[field.name, 'conner']} fieldKey={[field.fieldKey, 'conner']}>
                                                                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this, index)}
                                                                        imageUrl={this.formRef.current.getFieldValue("setting")[index] ? this.formRef.current.getFieldValue("setting")[index].conner : ""}
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="排序" name={[field.name, 'sort']} fieldKey={[field.fieldKey, 'sort']}>
                                                                    <InputNumber min={0} />
                                                                </Form.Item>
                                                                {
                                                                    index == 0 ? "" :
                                                                        <MinusCircleOutlined onClick={() => {
                                                                            remove(field.name)
                                                                        }} />
                                                                }

                                                            </Space>
                                                        ))}

                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => {
                                                                // if (this.formRef.current.getFieldValue("setting") && this.formRef.current.getFieldValue("setting").length >= 4) return
                                                                add()
                                                            }} block icon={<PlusOutlined />}>
                                                                新建配置
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Form.Item>
                                        :
                                        // 随机商品
                                        <Form.Item
                                            label="配置"
                                            name="setting"
                                            rules={[{ required: true, message: '请增加配置' }]}
                                        >
                                            <Form.List name="setting">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map((field, index) => (
                                                            <Space key={field.key} align="baseline">
                                                                <Form.Item {...field} label="用户标签" name={[field.name, 'tagCode']} fieldKey={[field.fieldKey, 'tagCode']}>
                                                                    <Select style={{ width: "200px" }} disabled={this.formRef.current.getFieldValue("setting")[index] && this.formRef.current.getFieldValue("setting")[index].tagCode == "none"}
                                                                        onChange={(e) => {
                                                                            let arr = this.formRef.current.getFieldValue("setting")
                                                                            arr[index].tagCode = e
                                                                            this.formRef.current.setFieldsValue({ "setting": arr })
                                                                        }}
                                                                    >
                                                                        {
                                                                            tagList.map((r, i) => {
                                                                                return <Option value={r.code} key={i} disabled={this.getDisable(r, "tagCode", "code")}>
                                                                                    {r.name}
                                                                                </Option>
                                                                            })
                                                                        }

                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item {...field} label="最小金额（分）" name={[field.name, 'min']} fieldKey={[field.fieldKey, 'min']}>
                                                                    <InputNumber min={0} />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="最大金额（分）" name={[field.name, 'max']} fieldKey={[field.fieldKey, 'max']}>
                                                                    <InputNumber min={0} />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="排序" name={[field.name, 'sort']} fieldKey={[field.fieldKey, 'sort']}>
                                                                    <InputNumber min={0} />
                                                                </Form.Item>

                                                                {
                                                                    index == 0 ? "" :
                                                                        <MinusCircleOutlined onClick={() => {
                                                                            remove(field.name)
                                                                        }} />
                                                                }
                                                            </Space>
                                                        ))}

                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => {
                                                                if (!this.formRef.current.getFieldValue("type") || (this.formRef.current.getFieldValue("setting") && this.formRef.current.getFieldValue("setting").length >= 4)) return
                                                                add()
                                                            }} block icon={<PlusOutlined />}>
                                                                新建配置
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Form.Item>
                            }

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
        this.requestNewAdTagList()
        this.getZzItemList();
    }
    getDisable(val, tagCode, code) {
        if (val && this.formRef.current.getFieldValue("setting") && this.formRef.current.getFieldValue("setting").length > 0) {
            let arr = this.formRef.current.getFieldValue("setting").filter(r => r && r[tagCode] == val[code])
            if (arr.length > 0) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    //获取标签信息
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                tagList: res.data,
            });
        })
    }

    changeStart(e) {
        console.log(e);
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getZzItemList()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        if (val.setting) {
            let arr = []
            if (val.type == 1) {
                arr = val.setting.filter(r => !r.level)
            } else if (val.type == 2) {
                arr = val.setting.filter(r => !r.value)
            } else {
                arr = val.setting.filter(r => !r.max || !r.min)
            }
            if (arr.length > 0) {
                return message.error("请填写完整的配置信息")
            }
        }
        if (this.state.source == "edit") {
            this.editZzItemList(val)
        } else {
            this.addZzItemList(val)
        }
        this.closeModal()
    }

    getZzItemList() {
        let params = {
            page: {
                "currentPage": this.state.page, // (int)页码
                "pageSize": this.state.pageSize // (int)每页数量
            }
        }
        getZzItemList(params).then(res => {
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
    addZzItemList(val, type) {
        let params
        if (type == "copy") {
            params = {
                ...val,
                manualCode: util.randomWord(false, 10)
            }
        } else {
            params = {
                ...val,
                startAt: val.time[0].valueOf(),
                endAt: val.time[1].valueOf(),
                state: val.state ? 1 : 0,
                setting: JSON.stringify(val.setting)
            }
        }

        addZzItemList(params).then(res => {
            this.getZzItemList()
            message.success("新增成功")
        })
    }
    editZzItemList(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            startAt: val.time[0].valueOf(),
            endAt: val.time[1].valueOf(),
            state: val.state ? 1 : 0,
            setting: JSON.stringify(val.setting)
        }
        editZzItemList(params).then(res => {
            this.getZzItemList()
            message.success("更新成功")
        })
    }
    getUploadFileUrl(index, file) {   // 图片上传的方法
        console.log(file, index, "获取上传的图片路径")
        let arr = this.formRef.current.getFieldValue("setting")
        console.log(arr, "arr")
        arr[index].conner = file
        this.formRef.current.setFieldsValue({ "setting": arr })
    }

    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.deleteZzItemList(_obj.code)
            },
            onCancel: () => {
            }
        })
    }
    deleteZzItemList(code) {
        let params = {
            codes: code
        }
        deleteZzItemList(params).then(res => {
            message.success("删除成功")
            this.getZzItemList()
        })
    }
    changeZzItemList(val) {
        let params = {
            codes: val.code
        }
        changeZzItemList(params).then(res => {
            // message.success("成功")
            // this.getZzItemList()
        }).catch((err) => {

        })
    }
    rsZzItemList(val) {
        let params = {
            codes: val.code
        }
        rsZzItemList(params).then(res => {
            console.log(res.data)
            this.formRef.current.setFieldsValue({ "stock": res.data[val.code] })
        })
    }
    getNewNum() {
        if (!this.formRef.current.getFieldValue("stock")) return message.error("请先输入库存")
        let arr = this.formRef.current.getFieldValue("setting")
        arr.forEach(r => {
            if(r){
                r.num = Math.floor(r.ratio * this.formRef.current.getFieldValue("stock") / 100)
            }
           
        })
        this.formRef.current.setFieldsValue({ "setting": arr })
        this.forceUpdate()
    }
}