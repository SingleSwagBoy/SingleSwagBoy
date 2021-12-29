/*
 * @Author: yzc
 * @Date: 2021-12-20 10:48:36
 * @LastEditors: yzc
 * @LastEditTime: 2021-12-20 10:57:49
 * @Description: 创建@映射src 例如：引入控件可使用 MySyncBtn
 */
import React, { Component } from 'react'
import { getPowerBoot, requestNewAdTagList, editPowerBoot, addPowerBoot, delPowerBoot, changePowerBoot } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space, Alert } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MySyncBtn, MyImageUpload } from "@/components/views.js"

import util from 'utils'
import "./style.css"
const { Option } = Select;
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
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "启动图",
                    dataIndex: "imageUrl",
                    key: "imageUrl",
                    render: (rowValue, row, index) => {
                        return (
                            <div><Image src={rowValue} style={{width:"100px"}} /></div>
                        )
                    }
                },
                {
                    title: "用户标签",
                    dataIndex: "tagCode",
                    key: "tagCode",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getTagsName(rowValue)}</div>
                        )
                    }
                },
                {
                    title: "排序",
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
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.state = val ? 1 : 0
                                        this.changePowerBoot(obj)

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
                                            arr.state = arr.state == 1 ? true : false
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
                        <Breadcrumb.Item>开机启动图配置</Breadcrumb.Item>
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
                            <MySyncBtn type={24} name='同步缓存' />
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
                            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]} >
                                <Input placeholder="名称" />
                            </Form.Item>
                            <Form.Item label="背景图" name="imageUrl" rules={[{ required: true, message: '请选择背景图片' }]} >
                                <MyImageUpload
                                    getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('imageUrl', file, newItem) }}
                                    imageUrl={this.formRef.current && this.formRef.current.getFieldValue("imageUrl")} />
                            </Form.Item>
                            <Form.Item label="用户标签" name="tagCode">
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
                            <Form.Item label="排序" name="sort" >
                                <InputNumber placeholder="排序" style={{ width: "200px" }} />
                            </Form.Item>
                            <Form.Item label="状态" name="state" valuePropName="checked">
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
        this.getPowerBoot();
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
    changeSize = (page, pageSize) => {   // 分页
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getPowerBoot()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // return
        if (this.state.source == "edit") {
            this.editPowerBoot(val)
        } else {
            this.addPowerBoot(val)
        }
        this.closeModal()
    }

    getPowerBoot() {
        let params = {
        }
        getPowerBoot(params).then(res => {
            this.setState({
                lists: res.data.data,
                total: res.data.page.totalCount
            })
        })
    }
    closeModal() {
        this.formRef.current.resetFields()
        this.setState({
            entranceState: false
        })
    }
    addPowerBoot(val) {
        let params = {
            ...val,
            state: val.state ? 1 : 0,
        }
        addPowerBoot(params).then(res => {
            this.getPowerBoot()
            message.success("新增成功")
        })
    }
    editPowerBoot(val, type) {
        let params = {
            ...this.state.currentItem,
            ...val,
            state: val.state ? 1 : 0,
            tag: val.tag ? val.tag : ""
        }
        // return console.log(params,"params")
        editPowerBoot(params).then(res => {
            this.getPowerBoot()
            message.success("更新成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delPowerBoot(obj)
            },
            onCancel: () => {
            }
        })
    }
    delPowerBoot(item) {
        let params = {
            ids: item.id
        }
        delPowerBoot(params).then(res => {
            message.success("删除成功")
            this.getPowerBoot()
        })
    }
    changePowerBoot(item) {
        let params = {
           ids:item.id
        }
        changePowerBoot(params).then(res => {
            message.success("修改成功")
            this.getPowerBoot()
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
     //获取上传文件
     getUploadFileUrl(type, file, newItem) {
        let that = this;


        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;

        that.formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
}