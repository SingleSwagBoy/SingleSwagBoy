/*
 * @Author: yzc
 * @Date: 2021-12-21 10:48:36
 * @LastEditors: yzc
 * @LastEditTime: 2021-12-21 10:57:49
 * @Description: 创建@映射src 例如：引入控件可使用 MySyncBtn
 */
import React, { Component } from 'react'
import { getHkCategory, editHkCategory, addHkCategory, delHkCategory, changeHkCategory, getChannel, switchHkCategory, requestNewAdTagList } from 'api'
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
            channelList: [],
            currentItem: "",
            source: "",
            searchWord: {},
            channelList: [],
            dict_user_tags: [],
            selectProps: {
                optionFilterProp: "children",
                // filterOption(input, option){
                //   return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // },
                showSearch() {
                    console.log('onSearch')
                }
            },
            // 7=生活服务;6=体育赛程;5=其他H5链接;4=频道;3=在看好剧;2=家庭相册;1=点歌台 
            jumpList: [
                { key: 1, name: "点歌台" },
                { key: 2, name: "家庭相册" },
                { key: 3, name: "在看好剧" },
                { key: 4, name: "频道" },
                { key: 5, name: "其他H5链接" },
                { key: 6, name: "体育赛程" },
                { key: 7, name: "生活服务" },
            ],
            columns: [
                {
                    title: "名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "频道组显示",
                    dataIndex: "chName",
                    key: "chName",
                },
                {
                    title: "排序",
                    dataIndex: "sort",
                    key: "sort",
                    width:100,
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
                    title: "按上键进入频道",  //上下线状态(1上线2下线)
                    dataIndex: "isKeyUpEnter",
                    key: "isKeyUpEnter",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="开" unCheckedChildren="关" key={new Date().getTime()}
                                    defaultChecked={rowValue == 1 ? true : false}
                                    disabled={row.jumpType == 3 || row.jumpType == 6}
                                    onChange={(val) => {
                                        console.log(val)
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.isKeyUpEnter = val ? 1 : 0
                                        this.switchHkCategory(obj)
                                    }}
                                />
                            </div>
                        )
                    }
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
                                        this.changeHkCategory(obj)

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
        let { jumpList, lists, layout, loading, columns, entranceState, channelList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>好看分类</Breadcrumb.Item>
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
                            <MySyncBtn type={25} name='同步缓存' />
                        </div>
                    }
                >
                    <Table
                        dataSource={lists}
                        scroll={{ x: 1200, y: '75vh' }}
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
                                <Input placeholder="名称" maxLength="10" />
                            </Form.Item>
                            <Form.Item label="频道组显示" name="chName" rules={[{ required: true, message: '请输入频道组显示' }]} >
                                <Input placeholder="频道组显示" maxLength="7" />
                            </Form.Item>
                            <Form.Item label="跳转类型" name="jumpType">
                                <Select
                                    placeholder="请选择跳转类型"
                                    allowClear
                                    {...this.state.selectProps}
                                    onChange={(e) => {
                                        if (e == 4) { this.getChannel() }
                                        this.formRef.current.setFieldsValue({ "jumpType": e, "jumpValue": null })
                                        this.forceUpdate()
                                    }}
                                >
                                    {
                                        jumpList.map((r, i) => {
                                            return <Option value={r.key} key={i}>{r.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("jumpType") == 4 &&
                                <Form.Item label="跳转地址" name="jumpValue">
                                    <Select
                                        placeholder="请选择跳转地址"
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
                                    >
                                        {
                                            channelList.map((r, i) => {
                                                return <Option value={r.code} key={r.code}>{r.name}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            }
                            {
                                this.formRef.current && (this.formRef.current.getFieldValue("jumpType") == 5 || this.formRef.current.getFieldValue("jumpType") == 6  || this.formRef.current.getFieldValue("jumpType") == 7) &&
                                <Form.Item label="跳转地址" name="jumpValue">
                                    <Input placeholder="跳转地址" />
                                </Form.Item>
                            }
                            <Form.Item label="排序" name="sort" >
                                <InputNumber placeholder="数字从小到大，越小优先级越高" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item label='用户标签' name="tagCode" >
                                <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择用户设备标签"
                                    filterOption={(input, option) => {
                                        if (!input) return true;
                                        let children = option.children;
                                        if (children) {
                                            let key = children[2];
                                            let isFind = false;
                                            isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                            if (!isFind) {
                                                let code = children[0];
                                                isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                            }

                                            return isFind;
                                        }
                                    }}>
                                    {this.state.dict_user_tags.map((item, index) => (
                                        <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                                    ))}
                                </Select>
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
        this.getHkCategory();
        this.requestNewAdTagList()
    }
    changeSize = (page, pageSize) => {   // 分页
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getHkCategory()
        })
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        // return
        if (this.state.source == "edit") {
            this.editHkCategory(val)
        } else {
            this.addHkCategory(val)
        }
        this.closeModal()
    }

    getHkCategory() {
        let params = {
        }
        getHkCategory(params).then(res => {
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
    addHkCategory(val) {
        let params = {
            ...val,
            state: val.state ? 1 : 0,
        }
        addHkCategory(params).then(res => {
            this.getHkCategory()
            message.success("新增成功")
        })
    }
    editHkCategory(val, type) {
        let params = {
            ...this.state.currentItem,
            ...val,
            state: val.state ? 1 : 0,
        }
        // return console.log(params,"params")
        editHkCategory(params).then(res => {
            this.getHkCategory()
            message.success("更新成功")
        })
    }

    deleteItem(obj) {  // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delHkCategory(obj)
            },
            onCancel: () => {
            }
        })
    }
    delHkCategory(item) {
        let params = {
            ids: item.id
        }
        delHkCategory(params).then(res => {
            message.success("删除成功")
            this.getHkCategory()
        })
    }
    changeHkCategory(item) {
        let params = {
            ids: item.id
        }
        changeHkCategory(params).then(res => {
            message.success("修改成功")
            this.getHkCategory()
        })
    }
    switchHkCategory(item) {
        let params = {
            ids: item.id
        }
        switchHkCategory(params).then(res => {
            message.success("修改成功")
            this.getHkCategory()
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
    // 获取用户标签
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                dict_user_tags: res.data,
            }, () => {
                this.forceUpdate();
            });
        })
    }
    getTagsName(val) {
        let arr = this.state.dict_user_tags.filter(r => r.code == val)
        if (arr.length > 0) {
            return arr[0].name
        } else {
            return ""
        }
    }
}