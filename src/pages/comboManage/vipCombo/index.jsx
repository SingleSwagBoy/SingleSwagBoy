import React, { Component } from 'react'
import { getEarnTskList, addEarnTskList, updateEarnTskList, deleteEarnTskList, syncEarnTskList } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Radio } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};
class VipCombo extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            currentItem: {},
            screen: {},  //筛选对象
            showModal: false,  // \
            editType: 1,  // 1 新增  2 编辑
            pic: "",
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            dateFormat: 'YYYY-MM-DD HH:mm:ss',          //日期格式化
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            packageTypes: [
                { key: 1, value: "普通套餐" },
                { key: 2, value: "实物" },
                { key: 7, value: "竞猜答题" },
            ],
            platform: [
                { key: 1, value: "tv" },
                { key: 2, value: "Android" },
                { key: 3, value: "iOS" },
                { key: 4, value: "移动端" },
                { key: 5, value: "全平台" },
                { key: 6, value: "小程序" },
            ],
            tags: [
                { key: 1, value: "VIP用户" },
                { key: 2, value: "未登录用户" },
                { key: 3, value: "新用户" }
            ],
            putTypes: [
                { key: 1, value: '定向' },
                { key: 2, value: '非定向' }
            ],
            lists: [],
            columns: [
                {
                    title: "商品名称", dataIndex: "name", key: "name",
                },
                {
                    title: "商品code", dataIndex: "code", key: "code",
                },
                {
                    title: "角标图", dataIndex: "pic", key: "pic",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={row.pic} />)
                    }
                },
                {
                    title: "支持设备", dataIndex: "plat", key: "plat",
                    render: (rowValue, row, index) => {
                        return (
                            <Select style={{ width: 120 }} defaultValue={row.plat} onChange={(data) => this.onItemDataChange(row, 'plat', data)}>
                                {this.state.platform.map((item, index) => {
                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        )
                    }
                },
                {
                    title: "上线时间-下线时间", dataIndex: "startTime", key: "startTime", width: 450,
                    render: (rowValue, row, index) => {
                        return (
                            <span>
                                {util.formatTime(String(row.startTime).length == 10 ? row.startTime * 1000 : row.startTime, "", "")}
                                ---
                                {util.formatTime(String(row.endTime).length == 10 ? row.endTime * 1000 : row.endTime, "", "")}
                            </span>
                        )
                    },
                },
                {
                    title: "排序", dataIndex: "sort", key: "sort",
                },
                {
                    title: "状态",  //上下线状态(1上线2下线)
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" defaultChecked={rowValue === 1 ? true : false}
                                    onChange={(val) => {
                                        console.log(val)
                                        this.setState({
                                            currentItem: row
                                        }, () => {
                                            row.status = val ? 1 : 2
                                            this.updateList(row)
                                        })
                                    }}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "备注", dataIndex: "des", key: "des",
                },
                {
                    title: "操作",
                    key: "action",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button size="small" dashed="true" onClick={() => this.onCopyDataClick(row)}>复制</Button>
                                <Button style={{ margin: "0 10px" }} size="small" type="primary"
                                    onClick={() => {
                                        this.setState({
                                            showModal: true,
                                            currentItem: row,
                                            pic: row.pic,
                                            editType: 2
                                        }, () => {
                                            this.formRef.current.setFieldsValue(row)
                                        })
                                    }}>编辑</Button>
                                <Button size="small" danger onClick={() => { this.deleteItem(row) }}>删除</Button>
                            </div>
                        )
                    }
                }
            ]
        }
    }
    render() {
        let { page, pageSize, total, loading, screen, showModal, editType, pic, layout, tailLayout, packageTypes, platform, tags, putTypes, lists, columns } = this.state
        return <div>
            <Card title={
                <div className="cardTitle">
                    <div className="everyBody">
                        <div>商品:</div>
                        <Input.Search allowClear placeholder="商品名称或code" onSearch={(val) => {
                            if (val) {
                                screen.goodsName = val
                            } else {
                                delete screen.userId
                            }
                            //this.getRecords()
                        }} />
                    </div>
                    <div className="everyBody">
                        <div>上线时间:</div>
                        <DatePicker showTime />
                    </div>
                    <div className="everyBody">
                        <div>下线时间:</div>
                        <DatePicker showTime />
                    </div>

                    <div className="everyBody">
                        <div>支持设备:</div>
                        <Select allowClear placeholder="选择支持设备"
                            onChange={(val) => {
                                console.log(val);
                            }}
                        >
                            {
                                platform.map(r => {
                                    return (
                                        <Option value={r.key} key={r.key}>{r.value}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className="everyBody everyBody-1">
                        <div>标签:</div>
                        <Select allowClear placeholder="选择用户标签" mode="multiple"
                            onChange={(val) => {
                                console.log(val);
                            }}
                        >
                            {
                                tags.map(r => {
                                    return (
                                        <Option value={r.key} key={r.key}>{r.value}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className='everyBody'>
                        <Button type="primary" style={{ margin: "0 10px" }}>搜索</Button>
                    </div>
                </div>
            }
                extra={
                    <div>
                        <Button type="primary"
                            style={{ margin: "0 10px" }}
                            onClick={() => {
                                this.syncData()
                            }}
                        >同步缓存</Button>
                        <Button type="primary" style={{ margin: "0 10px" }}
                            onClick={() => {
                                this.setState({
                                    editType: 1,
                                    showModal: true,
                                    pic: ""
                                }, () => {
                                    this.formRef.current.resetFields();
                                })
                            }}
                        >新增</Button>
                    </div>
                }
            >
                <Table
                    dataSource={lists} loading={loading} columns={columns}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: this.changeSize
                    }}
                >
                </Table>

            </Card>
            <Modal title={editType == 1 ? "新增" : "编辑"} centered visible={showModal} onCancel={() => { this.setState({ showModal: false }) }} footer={null} width={800}>
                {
                    <Form {...layout} name="comboForm" ref={this.formRef} onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请填写商品名称' }]}>
                            <Input placeholder="请输入商品名称" />
                        </Form.Item>
                        <Form.Item label="商品code" name="code" rules={[{ required: true, message: '请填写商品code' }]}>
                            <Input placeholder="请输入商品code" />
                        </Form.Item>
                        <Form.Item label="副标题" name="title">
                            <Input placeholder="请输入副标题" />
                        </Form.Item>
                        <Form.Item label="商品类型" name="type">
                            <Select className="base-input-wrapper" showSearch placeholder='商品类型'>
                                {packageTypes.map((item, index) => {
                                    return <Option key={index} value={item.key}>{item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="角标图" name="pic" valuePropName="fileList" getValueFromEvent={normFile}>
                            <div className="input-wrapper-box">
                                <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)} imageUrl={pic}/>
                            </div>
                        </Form.Item>
                        <Form.Item label="支持设备" name="plat" rules={[{ required: true, message: '请填写商品code' }]}>
                            <Select className="base-input-wrapper" showSearch placeholder='支持设备'>
                                {platform.map((item, index) => {
                                    return <Option key={index} value={item.key}>{item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
                }
            </Modal>
        </div>;
    }
}

export default VipCombo;