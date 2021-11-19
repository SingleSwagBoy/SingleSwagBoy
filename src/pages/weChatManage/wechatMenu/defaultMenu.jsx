import React, { Component } from 'react'
import { getRefresh, getWechatMenu, addRefresh, changeRefresh, delRefresh } from 'api'
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
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            visible: false,
            openKeys: [],
            menuInfo: "",
            radioState: "default",
            currentMenu: "",//当前点击的菜单
        }
    }
    render() {
        let { layout, radioState } = this.state;
        let { openModal, menuInfo } = this.props
        let arr = ""
        let openKeys = []
        if (menuInfo && openModal) {
            arr = menuInfo.defaultMenu.button
            if (arr && arr.length > 0) {
                arr.forEach(r => {
                    openKeys.push(r.name)
                })
            }
        }
        return (
            <div>
                <Modal title={menuInfo.name} centered visible={openModal} onCancel={() => { this.props.onCloseModal() }} footer={null} width={1200}>
                    <Radio.Group defaultValue={radioState} style={{ marginTop: 16 }} onChange={(e) => {
                        this.setState({
                            radioState: e.target.value
                        }, () => {
                            this.getWechatMenu()
                        })
                    }}>
                        <Radio.Button value="default">默认菜单</Radio.Button>
                        <Radio.Button value="personal">个性化菜单</Radio.Button>
                    </Radio.Group>
                    <div style={{ "width": "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: "20px" }}>
                        {/* 菜单 */}
                        <div style={{ "width": "20%", border: "1px solid #000" }}>
                            <Menu mode="inline"
                                openKeys={openKeys}
                                // defaultOpenKeys={["sub1"]}
                                expandIcon={
                                    <></>
                                }
                                onSelect={(e) => {
                                    // console.log(e, 1)
                                }}
                                onOpenChange={this.onOpenChange.bind(this)} style={{ width: 256 }}

                            >
                                {
                                    menuInfo.defaultMenu && menuInfo.defaultMenu.button.map(r => {
                                        return (
                                            <SubMenu key={r.name}
                                                title={
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <div>{r.name}</div>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <div onClick={this.addMenu("sub1")}><PlusOutlined /></div>
                                                            <div style={{ margin: "0 10px" }}><DeleteOutlined /></div>
                                                            <div><HighlightOutlined /></div>
                                                        </div>
                                                    </div>
                                                }
                                                onTitleClick={(e) => {
                                                    console.log(r)
                                                    this.formRef.current.setFieldsValue(r)
                                                }}>
                                                {
                                                    r.sub_button
                                                        ?
                                                        <>
                                                            {
                                                                r.sub_button.map(l => {
                                                                    return <Menu.Item key={l.key} onClick={(e) => {
                                                                        console.log(l)
                                                                        this.setState({
                                                                            currentMenu: l
                                                                        })
                                                                        this.formRef.current.setFieldsValue(l)
                                                                    }}>
                                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                            <div>{l.name}</div>
                                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                                <div onClick={this.addMenu("sub1")}><PlusOutlined /></div>
                                                                                <div style={{ margin: "0 10px" }}><DeleteOutlined /></div>
                                                                                <div><HighlightOutlined /></div>
                                                                            </div>
                                                                        </div>
                                                                    </Menu.Item>
                                                                })
                                                            }
                                                        </>
                                                        : ""
                                                }

                                            </SubMenu>
                                        )
                                    })
                                }

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
                                <Form.Item
                                    label="回复内容"
                                    // name="voters"
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Form.List name="reply_info" rules={[{ required: true, message: '' }]}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map((field, index) => (
                                                    <Space key={field.key} align="baseline" style={{ width: "100%" }}>
                                                        <div>
                                                            <div>
                                                                <Form.Item  {...field} label="消息类型" name={[field.name, 'msg_type']} fieldKey={[field.fieldKey, 'msg_type']}>
                                                                    <Radio.Group onChange={(e) => {
                                                                        let arr = this.formRef.current.getFieldValue("reply_info")
                                                                        arr[index].msg_type = e.target.value
                                                                        console.log(arr)
                                                                        this.formRef.current.setFieldsValue({ "reply_info": arr })
                                                                    }} defaultValue={1}>
                                                                        <Radio value={"text"}>文字</Radio>
                                                                        <Radio value={"image"}>图片</Radio>
                                                                        <Radio value={"news"}>图文卡片</Radio>
                                                                        <Radio value={"mini"}>小程序卡片</Radio>
                                                                        <Radio value={5}>点击跳转</Radio>
                                                                    </Radio.Group>
                                                                </Form.Item>
                                                            </div>
                                                            <div>
                                                                {
                                                                    // 文字
                                                                    this.formRef.current.getFieldValue("reply_info")[index].msg_type == "text"
                                                                        ?
                                                                        <Form.Item {...field} label="" name={[field.name, 'content']} fieldKey={[field.fieldKey, 'content']}>
                                                                            <Input placeholder="文字" />
                                                                        </Form.Item>
                                                                        :
                                                                        // 图片
                                                                        this.formRef.current.getFieldValue("reply_info")[index].msg_type == "image"
                                                                            ?
                                                                            <Form.Item {...field} label="图片" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                <MyImageUpload
                                                                                    getUploadFileUrl={(file) => { this.getUploadFileUrl('url', file) }}
                                                                                    // imageUrl={this.iconFormRef.current.getFieldValue("picUrl")}
                                                                                    postUrl={"/mms/wxReply/addMedia"} //上传地址
                                                                                    params={this.state.currentMenu.reply_info[index].imgs[0].wx_code} //另外的参数
                                                                                    imageUrl={this.state.currentMenu.reply_info[index].imgs[0].url}
                                                                                />
                                                                            </Form.Item>
                                                                            :
                                                                            this.formRef.current.getFieldValue("reply_info")[index].msg_type == "news" ?
                                                                                <>
                                                                                    <Form.Item {...field} label="" name={[field.name, 'title']} fieldKey={[field.fieldKey, 'title']}>
                                                                                        <Input placeholder="卡片标题" />
                                                                                    </Form.Item>
                                                                                    <Form.Item {...field} label="" name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
                                                                                        <Input placeholder="卡片描述" />
                                                                                    </Form.Item>
                                                                                    <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                        <Input placeholder="跳转链接" />
                                                                                    </Form.Item>
                                                                                    <Form.Item {...field} label="卡片图" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']}>
                                                                                        <MyImageUpload
                                                                                            getUploadFileUrl={(file) => { this.getUploadFileUrl('url', file) }}
                                                                                            postUrl={"/mms/wxReply/addMedia"} //上传地址
                                                                                            params={this.state.currentMenu.reply_info[index].imgs[0].wx_code} //另外的参数
                                                                                            imageUrl={this.state.currentMenu.reply_info[index].imgs[0].url}
                                                                                        />
                                                                                    </Form.Item>
                                                                                </>

                                                                                :
                                                                                this.formRef.current.getFieldValue("reply_info")[index].msg_type == "mini" ?
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
                                                                                    this.formRef.current.getFieldValue("reply_info")[index].msg_type == 5 ?
                                                                                        <>
                                                                                            <Form.Item {...field} label="" name={[field.name, 'formType']} fieldKey={[field.fieldKey, 'formType']}>
                                                                                                <Radio.Group defaultValue="a" style={{ marginTop: 16 }}>
                                                                                                    <Radio.Button value="a">默认菜单</Radio.Button>
                                                                                                    <Radio.Button value="b">个性化菜单</Radio.Button>
                                                                                                </Radio.Group>
                                                                                            </Form.Item>
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
                                                            </div>
                                                        </div>
                                                        <MinusCircleOutlined onClick={() => { remove(field.name) }} />
                                                    </Space>
                                                ))}

                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => { add() }} block icon={<PlusOutlined />}>
                                                        新建一条回复内容
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
                </Modal>

            </div>
        )
    }
    componentDidMount() {
        this.getWechatMenu()
        // this.getRefresh();
    }
    onOpenChange(e) {
        // console.log(e, "onOpenChange")
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
                // this.delRefresh(_obj.zzItemCode)
            },
            onCancel: () => {
            }
        })
    }
    getWechatMenu() {
        let params = {
            menuType: this.state.radioState
        }
        getWechatMenu(params).then(res => {
            this.setState({
                menuInfo: res.data
            })
        })
    }
}