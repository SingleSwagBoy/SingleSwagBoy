import React, { Component } from 'react'
import { getRefresh, getZzItemList, addRefresh, changeRefresh, delRefresh } from 'api'
import { Radio, Card, Menu, Button, message, Modal, Divider, Input, Form, Select, Space, Image } from 'antd'
import { } from 'react-router-dom'
import { PlusOutlined, DeleteOutlined, HighlightOutlined, MinusCircleOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { SubMenu } = Menu;
const format = 'HH:mm';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            visible: false,
            openKeys: ["sub1"]
        }
    }
    render() {
        let { openKeys, layout, } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Select allowClear placeholder="请选择公众号">
                            <Option value={1} key={1}>{1}</Option>
                        </Select>
                    </div>
                }
                    extra={
                        <div>
                            {/* <Button type="primary"  onClick={this.getEarnTskList.bind(this)}>刷新</Button> */}
                            {/* <Button type="primary" style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.setState({
                                        source: "add",
                                        entranceState: true,
                                    }, () => {
                                        this.formRef.current.resetFields();
                                    })
                                }}
                            >推送到微信</Button> */}
                            <MySyncBtn type={13} name='推送到微信' />
                        </div>
                    }
                >
                    <Radio.Group defaultValue="a" style={{ marginTop: 16 }}>
                        <Radio.Button value="a">默认菜单</Radio.Button>
                        <Radio.Button value="b">个性化菜单</Radio.Button>
                    </Radio.Group>
                    <div style={{ "width": "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: "20px" }}>
                        {/* 菜单 */}
                        <div style={{ "width": "20%", border: "1px solid #000" }}>
                            <Menu mode="inline" openKeys={openKeys}
                                // defaultOpenKeys={["sub1"]}
                                expandIcon={
                                    <></>
                                }
                                onSelect={(e) => {
                                    console.log(e)
                                }}
                                onOpenChange={this.onOpenChange.bind(this)} style={{ width: 256 }}>
                                <SubMenu key="sub1"
                                    title={
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div>菜单</div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div onClick={this.addMenu("sub1")}><PlusOutlined /></div>
                                                <div style={{ margin: "0 10px" }}><DeleteOutlined /></div>
                                                <div><HighlightOutlined /></div>
                                            </div>
                                        </div>
                                    }
                                    onTitleClick={(e) => { console.log(e) }}>
                                    <Menu.Item key="1" >Option 1</Menu.Item>
                                    <Menu.Item key="2">Option 2</Menu.Item>
                                    <Menu.Item key="3">Option 3</Menu.Item>
                                    <Menu.Item key="4">Option 4</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </div>
                        <div style={{ "width": "78%", border: "1px solid #000" }}>
                            <Form {...layout}
                                name="taskForm"
                                ref={this.formRef}
                                onFinish={this.submitForm.bind(this)}>
                                <Divider dashed plain >设置自动回复</Divider>
                                <Form.Item label="菜单名称" name="name" rules={[{ required: true, message: '请填写名称' }]}>
                                    <Input placeholder="请输入名称" disabled />
                                </Form.Item>
                                <Divider dashed plain >菜单内容</Divider>
                                <Form.Item label="消息类型" name="type">
                                    <Radio.Group onChange={(e) => {
                                        this.formRef.current.setFieldsValue({ "type": e.target.value })
                                    }} defaultValue={1}>
                                        <Radio value={1}>文字</Radio>
                                        <Radio value={2}>图片</Radio>
                                        <Radio value={3}>图文卡片</Radio>
                                        <Radio value={4}>小程序卡片</Radio>
                                        <Radio value={5}>点击跳转</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="新建"
                                    // name="voters"
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Form.List name="setting" rules={[{ required: true, message: '' }]}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map((field, index) => (
                                                    <Space key={field.key} align="baseline" style={{ width: "100%" }}>

                                                        {
                                                            // 文字
                                                            this.formRef.current.getFieldValue("type") == 1
                                                                ?
                                                                <Form.Item {...field} label="文字" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                    <Input />
                                                                </Form.Item>
                                                                :
                                                                // 图片
                                                                this.formRef.current.getFieldValue("type") == 2
                                                                    ?
                                                                    <Form.Item {...field} label="图片" name={[field.name, 'picUrl']} fieldKey={[field.fieldKey, 'picUrl']}>
                                                                        <MyImageUpload
                                                                            getUploadFileUrl={(file) => { this.getUploadFileUrl('picUrl', file) }}
                                                                        // imageUrl={this.iconFormRef.current.getFieldValue("picUrl")}
                                                                        />
                                                                    </Form.Item>
                                                                    :
                                                                    this.formRef.current.getFieldValue("type") == 3 ?
                                                                        <>
                                                                            <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                <Input placeholder="卡片标题" />
                                                                            </Form.Item>
                                                                            <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                <Input placeholder="卡片描述" />
                                                                            </Form.Item>
                                                                            <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                <Input placeholder="跳转链接" />
                                                                            </Form.Item>
                                                                            <Form.Item {...field} label="卡片图" name={[field.name, 'picUrl']} fieldKey={[field.fieldKey, 'picUrl']}>
                                                                                <MyImageUpload
                                                                                    getUploadFileUrl={(file) => { this.getUploadFileUrl('picUrl', file) }}
                                                                                // imageUrl={this.iconFormRef.current.getFieldValue("picUrl")}
                                                                                />
                                                                            </Form.Item>
                                                                        </>

                                                                        :
                                                                        this.formRef.current.getFieldValue("type") == 4 ?
                                                                            <>
                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                    <Select
                                                                                        placeholder="请选择微信小程序"
                                                                                        allowClear
                                                                                    >
                                                                                       <Option value={1} key={1}>{1}</Option>
                                                                                    </Select>
                                                                                </Form.Item>
                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                    <Input placeholder="小程序标题" />
                                                                                </Form.Item>
                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                    <Input placeholder="小程序跳转路径" />
                                                                                </Form.Item>
                                                                                <Form.Item {...field} label="封面图片" name={[field.name, 'picUrl']} fieldKey={[field.fieldKey, 'picUrl']}>
                                                                                    <MyImageUpload
                                                                                        getUploadFileUrl={(file) => { this.getUploadFileUrl('picUrl', file) }}
                                                                                    // imageUrl={this.iconFormRef.current.getFieldValue("picUrl")}
                                                                                    />
                                                                                </Form.Item>
                                                                            </>
                                                                            :
                                                                            this.formRef.current.getFieldValue("type") == 5 ?
                                                                            <>
                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                    <Select
                                                                                        placeholder="请选择微信小程序"
                                                                                        allowClear
                                                                                    >
                                                                                       <Option value={1} key={1}>{1}</Option>
                                                                                       <Option value={2} key={2}>{2}</Option>
                                                                                    </Select>
                                                                                </Form.Item>
                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                    <Input placeholder="小程序跳转路径" />
                                                                                </Form.Item>
                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                    <Input placeholder="备用路径" />
                                                                                </Form.Item>
                                                                            </>
                                                                            :
                                                                            ""
                                                        }
                                                        <MinusCircleOutlined onClick={() => { remove(field.name) }} />
                                                    </Space>
                                                ))}
                                                
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => { add() }} block icon={<PlusOutlined />}>
                                                        新建一条
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
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
    componentDidMount() {
        // this.getZzItemList()
        // this.getRefresh();
    }
    onOpenChange(e) {
        console.log(e, "onOpenChange")
        // this.setState({
        //     openKeys: e
        // })
        this.forceUpdate()

    }
    addMenu(key) {

    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        this.addRefresh(val)
        this.closeModal()
    }

    closeModal() {
        this.setState({
            entranceState: false
        })
    }

    getUploadFileUrl(index, file) {   // 图片上传的方法
        console.log(file, index, "获取上传的图片路径")
        this.iconFormRef.current.setFieldsValue({ "pic": file })
        this.forceUpdate()
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
    // delRefresh(code) {
    //     let params = {
    //         zzItemCodes: code
    //     }
    //     delRefresh(params).then(res => {
    //         message.success("删除成功")
    //         this.getRefresh()
    //     })
    // }
}