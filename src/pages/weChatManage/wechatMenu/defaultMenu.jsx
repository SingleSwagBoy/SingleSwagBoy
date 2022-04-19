import React, { Component } from 'react'
import { uploadWechatMenu, getWechatMenu, getFansTagList, requestWxProgramList, addWechatMenu, delWechatMenu,setMenuState } from 'api'
import { Radio, Switch, Menu, Button, message, Modal, Divider, Input, Form, Select, Space, Card, Col, Row, Table, InputNumber } from 'antd'
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
            isList: false,
            lists: [],
            source: "",
            openKeys: [],
            matchrule: [],//标签人群设置
            menuName: "",
            menuInfo: "",
            radioState: "default",
            currentMenu: "",//当前点击的菜单
            mpList: [],
            formData: "",
            defaultSelectedKeys: [],
            fansTagList: [],
            columns: [
                {
                    title: "个性化菜单名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "标签内容",
                    dataIndex: "tag",
                    key: "tag",
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getTagName(row)}</div>
                        )
                    }
                },
                {
                    title: "状态",  //
                    dataIndex: "status",
                    key: "status",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {/* {rowValue === 1?"有效":"无效"} */}
                                <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                                    defaultChecked={rowValue == "on" ? true : false}
                                    onChange={(val) => {
                                        console.log(val,row)
                                        // row.state = val ? 1 : 0
                                        this.setMenuState(row,val)
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
                                {/* <Button
                                    size="small"
                                    onClick={() => { }}
                                >复制</Button> */}
                                <Button
                                    style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(row)
                                        this.setState({
                                            isList: false,
                                            source: "edit",
                                            matchrule: row.matchrule,
                                            menuName: row.name,
                                        }, () => {
                                            let val = {}
                                            val.defaultMenu = row
                                            val.wxCode = row.wxCode
                                            console.log(val)
                                            this.setState({
                                               
                                               
                                            }, () => {
                                                this.openBox(val)
                                            })
                                        })

                                    }}
                                >编辑</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => {
                                        this.delWechatMenu(row)
                                    }}
                                >删除</Button>
                            </div>
                        )
                    }
                }
            ],
        }
    }
    render() {
        let { layout, radioState, defaultSelectedKeys, menuInfo, openKeys, isList, lists, columns, fansTagList } = this.state;
        let { openModal } = this.props

        // let menuInfo = JSON.parse(JSON.stringify(this.props.menuInfo))
        return (
            <div>
                <Modal title={menuInfo.name} centered visible={openModal} onCancel={this.closeModal.bind(this)} footer={null} width={1200} key={openModal}>
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
                    {
                        // 判断是否是列表
                        isList
                            ?
                            <>
                                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                                    <Button type="primary" size="large" onClick={() => {
                                        if (!this.state.menuInfo.defaultMenu || !this.state.menuInfo.defaultMenu.button || this.state.menuInfo.defaultMenu.button.length == 0) {
                                            return message.error("请先添加默认菜单")
                                        }
                                        this.setState({
                                            isList: false,
                                            source: "add"
                                        }, () => {
                                            let info = {
                                                "button": [],
                                                "wxCode": this.state.menuInfo.wxCode,
                                                "name": "",
                                                "menuType": "personal",   //菜单类型, default默认，personal个性化
                                                "matchrule": []
                                            }
                                            let defaultInfo = {
                                                defaultMenu: info,
                                                "wxCode": this.state.menuInfo.wxCode,
                                            }
                                            this.setState({
                                                matchrule: info.matchrule,
                                                menuName: info.name
                                            }, () => {
                                                console.log(defaultInfo)
                                                this.openBox(defaultInfo)
                                            })
                                        })

                                    }}>
                                        新增个性化菜单
                                    </Button>
                                </div>
                                <Table
                                    dataSource={lists}
                                    // scroll={{ x: 1500, y: '75vh' }}
                                    // rowKey={item=>item.indexId}
                                    // loading={loading}
                                    columns={columns}
                                />
                            </>

                            :
                            <>
                                {
                                    (this.state.radioState == "default" && !isList) ? "" :
                                        <div className="site-card-wrapper" style={{ backgroundColor: "#ccc", "padding": "20px" }}>
                                            <Input placeholder="个性化菜单名称" defaultValue={this.state.menuName} onChange={(e) => {
                                                this.setState({
                                                    menuName: e.target.value
                                                })
                                            }} />
                                            <div style={{ width: "100%", display: "flex", "justifyContent": "flex-end", margin: "20px 0" }}>
                                                <Button type="primary" size="large" onClick={() => {
                                                    let info = this.state.matchrule
                                                    info.push({ client_platform_type: "", tag_id: "", tag_name: "" })
                                                    this.setState({
                                                        matchrule: info
                                                    })
                                                }}>
                                                    新增粉丝标签
                                                </Button>
                                            </div>

                                            <Row gutter={16}>
                                                {
                                                    this.state.matchrule.map((r, i) => {
                                                        return <Col span={8} style={{ marginBottom: "20px" }}>
                                                            <Card title={`标签人群设置${i + 1}`} bordered={false}
                                                                extra={<div onClick={() => {
                                                                    let arr = this.state.matchrule
                                                                    arr.splice(i, 1)
                                                                    console.log(arr,"arr")
                                                                    this.setState({
                                                                        matchrule: arr
                                                                    })
                                                                }}>删除</div>}
                                                                key={r.tag_id}
                                                            >
                                                                <Radio.Group style={{ marginBottom: 16 }}
                                                                    defaultValue={Number(r.client_platform_type)}
                                                                    onChange={(e) => {
                                                                        console.log(e)
                                                                        let arr = this.state.matchrule
                                                                        arr[i].client_platform_type = String(e.target.value)
                                                                        this.setState({
                                                                            matchrule: arr
                                                                        })
                                                                    }}>
                                                                    <Radio.Button value="">全部</Radio.Button>
                                                                    <Radio.Button value={1}>苹果</Radio.Button>
                                                                    <Radio.Button value={2}>安卓</Radio.Button>
                                                                    <Radio.Button value={3}>其他</Radio.Button>
                                                                </Radio.Group>
                                                                <Select
                                                                    placeholder="请选择粉丝标签"
                                                                    allowClear
                                                                    style={{ width: "200px" }}
                                                                    defaultValue={Number(r.tag_id)}
                                                                    onChange={(e) => {
                                                                        console.log(e)
                                                                        let arr = this.state.matchrule
                                                                        arr[i].tag_id = String(e)
                                                                        arr[i].tag_name = this.state.fansTagList.filter(r => r.id == e)[0].name
                                                                        this.setState({
                                                                            matchrule: arr
                                                                        })
                                                                    }}
                                                                >
                                                                    {
                                                                        fansTagList.map(r => {
                                                                            return <Option value={r.id} key={r.id}>{r.name}----{r.count}</Option>
                                                                        })
                                                                    }
                                                                </Select>
                                                            </Card>
                                                        </Col>
                                                    })
                                                }

                                            </Row>
                                        </div>
                                }

                                <div style={{ "width": "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: "20px", flexWrap: "wrap" }}>
                                    {/* 菜单 */}
                                    <div style={{ "width": "20%", border: "1px solid #000" }}>
                                        <Menu mode="inline"
                                            className="menu_inline"
                                            openKeys={openKeys}
                                            // defaultOpenKeys={["sub1"]}
                                            selectedKeys={defaultSelectedKeys}
                                            // defaultSelectedKeys={defaultSelectedKeys}
                                            onClick={(e) => {
                                                this.setState({
                                                    defaultSelectedKeys: [e.key]
                                                })
                                            }}
                                            expandIcon={<></>}
                                            onSelect={(e) => { }}
                                            style={{ width: 256 }}
                                        >
                                            {
                                                menuInfo.defaultMenu && menuInfo.defaultMenu.button.map((r, menuIndex) => {
                                                    return (
                                                        r.sub_button
                                                            ?
                                                            <SubMenu key={r.name}
                                                                title={
                                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                        {
                                                                            r.name ?
                                                                                <div>{r.name}</div>
                                                                                : <Input maxLength="16" onBlur={(e) => {
                                                                                    r.name = e.target.value
                                                                                    // this.formRef.current.setFieldsValue(r)
                                                                                    // this.forceUpdate()
                                                                                    let arr = openKeys
                                                                                    openKeys[menuIndex] = r.name
                                                                                    this.setState({
                                                                                        openKeys: arr
                                                                                    })
                                                                                }} />
                                                                        }
                                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>

                                                                            {
                                                                                r.sub_button.length < 5 ?
                                                                                    <div onClick={this.addMenu.bind(this, r)}><PlusOutlined /></div>
                                                                                    : ""
                                                                            }
                                                                            <div style={{ margin: "0 10px" }} onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                this.delSubMenu(r, menuIndex)

                                                                            }}><DeleteOutlined /></div>
                                                                            <div onClick={() => {
                                                                                console.log(r, openKeys, "l")
                                                                                let openInfo = openKeys.filter(item => item != r.name)
                                                                                console.log(openInfo)
                                                                                if (openInfo.length > 0) {
                                                                                    r.name = ""
                                                                                    openInfo.push(r.name)
                                                                                } else {
                                                                                    openInfo = [""]
                                                                                }
                                                                                this.setState({
                                                                                    openKeys: openInfo
                                                                                })
                                                                                // this.forceUpdate()
                                                                            }}><HighlightOutlined /></div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            >
                                                                {
                                                                    r.sub_button.map((l, i) => {
                                                                        return <Menu.Item key={l.sort} onClick={(e) => {
                                                                            console.log(l)
                                                                            l.sort = `${menuIndex}-${i}`
                                                                            this.setState({
                                                                                currentMenu: l
                                                                            })
                                                                            if (l.type == "click") {
                                                                                this.formRef.current.setFieldsValue(l)
                                                                            } else {
                                                                                l.msg_type = "Jump"
                                                                                //l.reply_info = [l]
                                                                                // if(Array.isArray(l.reply_info)==true && l.reply_info.length>0){
                                                                                //     console.log("isArray=true")
                                                                                // }else{
                                                                                //     console.log("isArray=false")
                                                                                //     l.reply_info = [l]
                                                                                // }
                                                                                // l.name = l.name
                                                                                this.formRef.current.setFieldsValue(l)
                                                                            }

                                                                        }}>
                                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>

                                                                                {
                                                                                    l.name ?
                                                                                        <div>{l.name}</div>
                                                                                        : <Input maxLength="40" onBlur={(e) => {
                                                                                            l.name = e.target.value
                                                                                            let arr = openKeys
                                                                                            console.log(openKeys, i, "wo")
                                                                                            // openKeys[i] = l.name
                                                                                            this.setState({
                                                                                                openKeys: arr
                                                                                            })
                                                                                            this.formRef.current.setFieldsValue(l)
                                                                                        }} />
                                                                                }
                                                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                                    {/* <div onClick={this.addMenu("sub1")}><PlusOutlined /></div> */}
                                                                                    <div style={{ margin: "0 10px" }} onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        console.log(l, i, "删除")
                                                                                        r.sub_button.splice(i, 1)
                                                                                        if (r.sub_button && r.sub_button.length == 0) {
                                                                                            r.reply_info = [{ msg_type: "text" }]
                                                                                            r.type = "click"
                                                                                            r.sort = l.sort
                                                                                            this.setState({
                                                                                                defaultSelectedKeys: [l.sort],
                                                                                            })
                                                                                            delete r.sub_button
                                                                                            this.formRef.current.setFieldsValue(r)
                                                                                        } else {
                                                                                            this.setState({
                                                                                                defaultSelectedKeys: [r.sub_button[0].sort],
                                                                                            })
                                                                                            if (r.sub_button[0].reply_info) {
                                                                                                this.formRef.current.setFieldsValue(r.sub_button[0])
                                                                                            } else {
                                                                                                r.sub_button[0].reply_info = [r.sub_button[0]]
                                                                                                r.sub_button[0].msg_type = "Jump"
                                                                                                this.formRef.current.setFieldsValue(r.sub_button[0])
                                                                                            }

                                                                                        }
                                                                                        this.forceUpdate()
                                                                                    }}><DeleteOutlined /></div>
                                                                                    <div onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        console.log(l, "l")
                                                                                        let openInfo = openKeys.filter(item => item != l.name)
                                                                                        console.log(openInfo)
                                                                                        if (openInfo.length > 0) {
                                                                                            l.name = ""
                                                                                            openInfo.push(l.name)
                                                                                        } else {
                                                                                            openInfo = [""]
                                                                                        }

                                                                                        this.setState({
                                                                                            openKeys: openInfo
                                                                                        })
                                                                                        // this.forceUpdate()
                                                                                    }}><HighlightOutlined /></div>
                                                                                </div>
                                                                            </div>
                                                                        </Menu.Item>
                                                                    })
                                                                }

                                                            </SubMenu>
                                                            :
                                                            <Menu.Item key={r.sort} onClick={(e) => {
                                                                console.log(r)
                                                                r.sort = `${menuIndex}-0`
                                                                this.state.currentMenu = r
                                                                // this.setState({
                                                                //     currentMenu: r
                                                                // }, () => {
                                                                    
                                                                // })
                                                                if (r.type == "click") {
                                                                } else {
                                                                    r.msg_type = "Jump"
                                                                    if(Array.isArray(r.reply_info)==true && r.reply_info.length>0){
                                                                        console.log("isArray=true")
                                                                    }else{
                                                                        console.log("isArray=false")
                                                                        r.reply_info = [r]
                                                                    }
                                                                    console.log("r.msg_type =------")
                                                                }
                                                                this.formRef.current.setFieldsValue(r)
                                                            }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                    {
                                                                        r.name ?
                                                                            <div>{r.name}</div>
                                                                            : <Input maxLength="16" onChange={(e) => {
                                                                                r.name = e.target.value
                                                                                this.formRef.current.setFieldsValue(r)
                                                                            }} />
                                                                    }
                                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                        <div onClick={this.addMenu.bind(this, r)}><PlusOutlined /></div>
                                                                        <div style={{ margin: "0 10px" }} onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            this.delSubMenu(r, menuIndex)
                                                                        }}><DeleteOutlined /></div>
                                                                        <div onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            console.log(r, "l")
                                                                            let openInfo = openKeys.filter(item => item != r.name)
                                                                            console.log(openInfo)
                                                                            if (openInfo.length > 0) {
                                                                                r.name = ""
                                                                                openInfo.push(r.name)
                                                                            } else {
                                                                                openInfo = [""]
                                                                            }

                                                                            this.setState({
                                                                                openKeys: openInfo
                                                                            })

                                                                        }}><HighlightOutlined /></div>
                                                                    </div>
                                                                </div>
                                                            </Menu.Item>
                                                    )
                                                })
                                            }

                                        </Menu>
                                        {
                                            (this.state.menuInfo.defaultMenu && this.state.menuInfo.defaultMenu.button && this.state.menuInfo.defaultMenu.button.length < 3) || !this.state.menuInfo.defaultMenu ?
                                                <div style={{ width: "100%", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => {
                                                    console.log(this.state.menuInfo)
                                                    let info = this.state.menuInfo
                                                    if (info.defaultMenu && info.defaultMenu.button) {
                                                        let r = { name: "", sort: `${info.defaultMenu.button.length}-0`, type: "click", msg_type: "text" }
                                                        info.defaultMenu.button.push({ ...r, reply_info: [r] })
                                                        this.formRef.current.setFieldsValue(r)
                                                    } else {
                                                        info.defaultMenu = {
                                                            button: [],
                                                            menuType: this.state.radioState,
                                                            name: "",
                                                            status: "on",
                                                            wxCode: this.state.menuInfo.wxCode,
                                                        }
                                                        let r = { name: "", sort: `${info.defaultMenu.button.length}-0`, type: "click", msg_type: "text" }
                                                        info.defaultMenu.button.push({ ...r, reply_info: [r] })
                                                        this.formRef.current.setFieldsValue(r)
                                                    }
                                                    // info.defaultMenu
                                                    this.setState({
                                                        menuInfo: info
                                                    })
                                                }}><PlusOutlined /></div>
                                                :
                                                ""
                                        }

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
                                                                                    if (e.target.value == "Jump") {
                                                                                        Modal.confirm({
                                                                                            title: `提示`,
                                                                                            content: '如果配置跳转链接，将会重置所有数据',
                                                                                            onOk: () => {
                                                                                                console.log(this.state.currentMenu)
                                                                                                this.state.currentMenu.type = "view"
                                                                                                this.setState({
                                                                                                    currentMenu: this.state.currentMenu
                                                                                                }, () => {
                                                                                                    this.formRef.current.setFieldsValue({ "reply_info": [{ msg_type: "Jump", name: this.state.currentMenu.name, type: "view", }] })
                                                                                                })

                                                                                            },
                                                                                            onCancel: () => {
                                                                                            }
                                                                                        })
                                                                                        return
                                                                                    }
                                                                                    arr[index].type = "click"
                                                                                    arr[index].msg_type = e.target.value
                                                                                    console.log(arr)
                                                                                    this.formRef.current.setFieldsValue({ "reply_info": arr })
                                                                                }} defaultValue={1}>
                                                                                    <Radio value={"text"}>文字</Radio>
                                                                                    <Radio value={"image"}>图片</Radio>
                                                                                    <Radio value={"news"}>图文卡片</Radio>
                                                                                    <Radio value={"mini"}>小程序卡片</Radio>
                                                                                    <Radio value={"Jump"}>点击跳转</Radio>
                                                                                </Radio.Group>
                                                                            </Form.Item>
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                // 文字
                                                                                this.formRef.current.getFieldValue("reply_info")[index] && this.formRef.current.getFieldValue("reply_info")[index].msg_type == "text"
                                                                                    ?
                                                                                    <Form.Item {...field} label="" name={[field.name, 'content']} fieldKey={[field.fieldKey, 'content']} validateStatus="success">
                                                                                        <Input.TextArea placeholder="文字" id="success" />
                                                                                    </Form.Item>
                                                                                    :
                                                                                    // 图片
                                                                                    this.formRef.current.getFieldValue("reply_info")[index] && this.formRef.current.getFieldValue("reply_info")[index].msg_type == "image"
                                                                                        ?
                                                                                        <Form.Item {...field} label="图片" name={[field.name, 'imgs']} fieldKey={[field.fieldKey, 'imgs']}>
                                                                                            <MyImageUpload
                                                                                                getUploadFileUrl={(file, list) => { this.getUploadFileUrl('url', file, list, index) }}
                                                                                                // imageUrl={this.iconFormRef.current.getFieldValue("picUrl")}
                                                                                                postUrl={"/mms/wxReply/addMedia"} //上传地址
                                                                                                params={this.props.menuInfo.wxCode} //另外的参数
                                                                                                imageUrl={
                                                                                                    this.formRef.current.getFieldValue("reply_info") &&
                                                                                                    this.formRef.current.getFieldValue("reply_info")[index].imgs &&
                                                                                                    this.formRef.current.getFieldValue("reply_info")[index].imgs[0].url
                                                                                                }
                                                                                            />
                                                                                        </Form.Item>
                                                                                        :
                                                                                        this.formRef.current.getFieldValue("reply_info")[index] && this.formRef.current.getFieldValue("reply_info")[index].msg_type == "news" ?
                                                                                            <>
                                                                                                <Form.Item {...field} label="" name={[field.name, 'title']} fieldKey={[field.fieldKey, 'title']} key={field.fieldKey}>
                                                                                                    <Input placeholder="卡片标题" />
                                                                                                </Form.Item>
                                                                                                <Form.Item {...field} label="" name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']} key={field.fieldKey + 1}>
                                                                                                    <Input placeholder="卡片描述" />
                                                                                                </Form.Item>
                                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']} key={field.fieldKey + 2}>
                                                                                                    <Input placeholder="跳转链接" />
                                                                                                </Form.Item>
                                                                                                <Form.Item {...field} label="卡片图" name={[field.name, 'imgs']} fieldKey={[field.fieldKey, 'imgs']} key={field.fieldKey + 3}>
                                                                                                    <MyImageUpload
                                                                                                        getUploadFileUrl={(file, list) => { this.getUploadFileUrl('url', file, list, index) }}
                                                                                                        postUrl={"/mms/wxReply/addMedia"} //上传地址
                                                                                                        params={
                                                                                                            this.props.menuInfo.wxCode
                                                                                                        } //另外的参数
                                                                                                        imageUrl={
                                                                                                            this.formRef.current.getFieldValue("reply_info") &&
                                                                                                            this.formRef.current.getFieldValue("reply_info")[index].imgs &&
                                                                                                            this.formRef.current.getFieldValue("reply_info")[index].imgs[0].url
                                                                                                        }
                                                                                                    />
                                                                                                </Form.Item>
                                                                                            </>

                                                                                            :
                                                                                            this.formRef.current.getFieldValue("reply_info")[index] && this.formRef.current.getFieldValue("reply_info")[index].msg_type == "mini" ?
                                                                                                <>
                                                                                                    <Form.Item {...field} label="" name={[field.name, 'appid']} fieldKey={[field.fieldKey, 'appid']} key={field.fieldKey}>
                                                                                                        <Select
                                                                                                            placeholder="请选择微信小程序"
                                                                                                            allowClear
                                                                                                        >

                                                                                                            {
                                                                                                                this.state.mpList.map(r => {
                                                                                                                    return <Option value={r.appid} key={r.appid}>{r.appName}</Option>
                                                                                                                })
                                                                                                            }
                                                                                                        </Select>
                                                                                                    </Form.Item>
                                                                                                    <Form.Item {...field} label="" name={[field.name, 'title']} fieldKey={[field.fieldKey, 'title']} key={field.fieldKey + 1}>
                                                                                                        <Input placeholder="小程序标题" />
                                                                                                    </Form.Item>
                                                                                                    <Form.Item {...field} label="" name={[field.name, 'path']} fieldKey={[field.fieldKey, 'path']} key={field.fieldKey + 2}>
                                                                                                        <Input placeholder="小程序跳转路径" />
                                                                                                    </Form.Item>
                                                                                                    <Form.Item {...field} label="封面图片" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']} key={field.fieldKey + 3}>
                                                                                                        <MyImageUpload
                                                                                                            getUploadFileUrl={(file, list) => { this.getUploadFileUrl('url', file, list, index) }}
                                                                                                            postUrl={"/mms/wxReply/addMedia"} //上传地址
                                                                                                            params={
                                                                                                                this.props.menuInfo.wxCode
                                                                                                            } //另外的参数
                                                                                                            imageUrl={
                                                                                                                this.formRef.current.getFieldValue("reply_info") &&
                                                                                                                this.formRef.current.getFieldValue("reply_info")[index].imgs &&
                                                                                                                this.formRef.current.getFieldValue("reply_info")[index].imgs[0].url
                                                                                                            }
                                                                                                        />
                                                                                                    </Form.Item>
                                                                                                </>
                                                                                                :
                                                                                                this.formRef.current.getFieldValue("reply_info")[index] && this.formRef.current.getFieldValue("reply_info")[index].msg_type == "Jump" ?
                                                                                                    <>
                                                                                                        <Form.Item {...field} label="" name={[field.name, 'type']} fieldKey={[field.fieldKey, 'type']} key={field.fieldKey + 1}>
                                                                                                            <Radio.Group defaultValue={
                                                                                                                this.state.currentMenu &&
                                                                                                                this.state.currentMenu.type
                                                                                                            } style={{ marginTop: 16 }}
                                                                                                                onChange={(e) => {
                                                                                                                    let arr = this.state.currentMenu
                                                                                                                    arr.type = e.target.value
                                                                                                                    this.setState({
                                                                                                                        currentMenu: arr
                                                                                                                    }, () => {
                                                                                                                        this.forceUpdate()
                                                                                                                        console.log(arr)
                                                                                                                    })

                                                                                                                }}
                                                                                                            >
                                                                                                                <Radio.Button value={"view"} key={1}>点击跳转链接</Radio.Button>
                                                                                                                <Radio.Button value={"miniprogram"} key={2}>点击跳转小程序</Radio.Button>
                                                                                                            </Radio.Group>
                                                                                                        </Form.Item>
                                                                                                        {
                                                                                                            this.formRef.current.getFieldValue("reply_info")[index] && this.formRef.current.getFieldValue("reply_info")[index].type == "view"
                                                                                                                ?
                                                                                                                <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']} key={field.fieldKey}>
                                                                                                                    <Input placeholder="跳转路径" />
                                                                                                                </Form.Item>
                                                                                                                :
                                                                                                                <>
                                                                                                                    <Form.Item {...field} label="" name={[field.name, 'appid']} fieldKey={[field.fieldKey, 'appid']} key={field.fieldKey}>
                                                                                                                        <Select
                                                                                                                            placeholder="请选择微信小程序"
                                                                                                                            allowClear
                                                                                                                        >
                                                                                                                            {
                                                                                                                                this.state.mpList.map(r => {
                                                                                                                                    return <Option value={r.appid} key={r.appid}>{r.appName}</Option>
                                                                                                                                })
                                                                                                                            }
                                                                                                                        </Select>
                                                                                                                    </Form.Item>
                                                                                                                    <Form.Item {...field} label="" name={[field.name, 'pagepath']} fieldKey={[field.fieldKey, 'pagepath']} key={field.fieldKey + 1}>
                                                                                                                        <Input placeholder="小程序跳转路径" />
                                                                                                                    </Form.Item>
                                                                                                                    <Form.Item {...field} label="" name={[field.name, 'url']} fieldKey={[field.fieldKey, 'url']} key={field.fieldKey + 2}>
                                                                                                                        <Input placeholder="备用路径" />
                                                                                                                    </Form.Item>
                                                                                                                </>
                                                                                                        }

                                                                                                    </>
                                                                                                    : ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <MinusCircleOutlined onClick={() => {
                                                                        if (this.formRef.current.getFieldValue("reply_info").length == 1) return message.error("至少有一条哟")
                                                                        remove(field.name)
                                                                        console.log(this.formRef.current.getFieldValue("reply_info"))
                                                                    }} />
                                                                </Space>
                                                            ))}


                                                            {
                                                                this.formRef.current &&
                                                                    this.formRef.current.getFieldValue() &&
                                                                    this.formRef.current.getFieldValue("reply_info") &&
                                                                    this.formRef.current.getFieldValue("reply_info")[0].msg_type != "Jump" &&
                                                                    this.formRef.current.getFieldValue("reply_info").length < 3
                                                                    ?
                                                                    <Form.Item>
                                                                        <Button type="dashed" onClick={() => {
                                                                            if (this.formRef.current.getFieldValue("reply_info").length == 3) return message.error("一个菜单最多三条回复")
                                                                            add({ msg_type: "" })
                                                                        }} block icon={<PlusOutlined />}>
                                                                            新建一条回复内容
                                                                        </Button>
                                                                    </Form.Item>
                                                                    :
                                                                    ""
                                                            }
                                                        </>
                                                    )}
                                                </Form.List>
                                            </Form.Item>


                                            <Form.Item {...this.state.tailLayout}>
                                                {/* <Button onClick={() => { this.setState({ entranceState: false }) }}>取消</Button> */}
                                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                                    确定修改
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
                                        {
                                            this.state.radioState == "personal" ?
                                                <Button size="large" style={{ margin: "20px 0 0 20px", width: "20%" }} onClick={() => {
                                                    this.setState({
                                                        isList: true
                                                    })
                                                }}>返回列表</Button>
                                                :
                                                ""
                                        }

                                        <Button size="large" style={{ margin: "20px 0 0 20px", width: "20%" }} onClick={() => { this.closeModal() }}>取消</Button>
                                        <Button type="primary" size="large" style={{ margin: "20px 0 0 20px", width: "20%" }} onClick={this.saveForm.bind(this)}>
                                            确定提交
                                        </Button>
                                    </div>

                                </div>
                            </>

                    }

                </Modal>

            </div>
        )
    }
    componentDidMount() {
        this.props.onRef(this)
        this.requestWxProgramList();
    }
    getTagName(val) {
        if (val.matchrule && val.matchrule.length > 0) {
            let info = ""
            val.matchrule.forEach(r => {
                info = info + (r.client_platform_type == 1?"苹果": r.client_platform_type == 2?"安卓":r.client_platform_type == 2?"其他":"全部" )+ "+" + r.tag_name + "---"
            })
            return info
        } else {
            return "未配置"
        }
    }
    addMenu(item, e) {
        e.stopPropagation()
        console.log(item)

        if (item.sub_button) {
            let r = { name: "", type: "click", reply_info: [{ msg_type: "text" }] }
            item.sub_button.push(r)
            this.formRef.current.setFieldsValue(r)
            console.log()

        } else {
            // item = {}
            item.name = item.name
            item.sub_button = [
                { name: "", type: "click", reply_info: [{ msg_type: "text" }] }
            ]
            console.log(this.state.openKeys, "openKeys")
            let arr = this.state.openKeys
            arr.push(item.name)
            this.setState({
                openKeys: arr
            })
        }
        console.log(this.state.menuInfo)

        // this.setState({
        //     menuInfo: this.state.menuInfo
        // })
        this.forceUpdate()
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        console.log(this.state.currentMenu, "this.state.currentMenu")
        let editInfo = {
            ...this.state.currentMenu,
            ...val
        }
        console.log(editInfo, "editInfo")
        let info = this.state.menuInfo
        if (info.defaultMenu.button) {
            info.defaultMenu.button.forEach((l, index) => {
                if (l.sub_button) {  //有二级菜单
                    l.sub_button.forEach((h, i) => {
                        console.log(h)
                        if (!h.name) return message.error("请填写菜单名称")
                        // l.sort = `${index}-${i}`
                        if (h.type == "view" && editInfo.type == "view" && editInfo.sort == h.sort) {
                            console.log(111)
                            h.type = editInfo.reply_info[0].type
                            h.name = editInfo.reply_info[0].name
                            h.url = editInfo.reply_info[0].url
                            delete h.reply_info
                        } else if (h.type == "miniprogram" && editInfo.type == "miniprogram" && editInfo.sort == h.sort) {
                            console.log(222)
                            h.type = editInfo.reply_info[0].type
                            h.name = editInfo.reply_info[0].name
                            h.url = editInfo.reply_info[0].url
                            h.appid = editInfo.reply_info[0].appid
                            h.pagepath = editInfo.reply_info[0].pagepath
                            delete h.reply_info
                        } else if (h.type == "click" && editInfo.type == "click") {
                            if (editInfo.sort == h.sort) {
                                console.log(333)
                                h.reply_info = editInfo.reply_info
                                console.log(h, editInfo)
                            }
                        } else {
                            console.log(4444)
                        }

                    })
                } else {
                    //没有二级菜单
                    if (l.type == "view" && editInfo.type == "view" && editInfo.sort == l.sort) {
                        console.log(222 - 111)
                        l.type = editInfo.reply_info[0].type
                        l.name = editInfo.reply_info[0].name
                        l.url = editInfo.reply_info[0].url
                        delete l.reply_info
                    } else if (l.type == "miniprogram" && editInfo.type == "miniprogram" && editInfo.sort == l.sort) {
                        console.log(222 - 222)
                        l.type = editInfo.reply_info[0].type
                        l.name = editInfo.reply_info[0].name
                        l.url = editInfo.reply_info[0].url
                        l.appid = editInfo.reply_info[0].appid
                        l.pagepath = editInfo.reply_info[0].pagepath
                        delete l.reply_info
                    } else if (l.type == "click" && editInfo.type == "click") {
                        if (editInfo.sort == l.sort) {
                            console.log(222 - 3333)
                            l.reply_info = editInfo.reply_info
                            console.log(l, editInfo)
                        }
                    }
                }
            })
        }
        this.setState({
            formData: info
        })
    }
    saveForm() {
        this.uploadWechatMenu()
        // this.closeModal()
    }
    closeModal(val) {
        if (this.formRef.current) {
            this.formRef.current.resetFields()
        }
        this.props.onCloseModal(val)
        this.setState({
            radioState: "default",
            matchrule: [],
            name: "",
            isList: false,
            source: "",
            formData: ""
        })

    }

    getUploadFileUrl(type, file, list, i) {   // 图片上传的方法
        console.log(type, file, list, "获取上传的图片路径")
        let reply_info = this.formRef.current.getFieldValue("reply_info")
        reply_info[i].imgs = [{}]
        reply_info[i].imgs[0][type] = list.url
        reply_info[i].imgs[0].media_id = list.mediaID
        reply_info[i].imgs[0].wx_code = this.props.menuInfo.wxCode
        console.log(reply_info)
        this.formRef.current.setFieldsValue({ "reply_info": reply_info })
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
            menuType: this.state.radioState,
            wxCode: this.state.menuInfo.wxCode
        }
        getWechatMenu(params).then(res => {
            let menuInfo = {
                defaultMenu: res.data[0],
                wxCode: this.state.menuInfo.wxCode
            }
            if (this.state.radioState == "default") {
                this.setState({
                    isList: false,
                    menuInfo: menuInfo
                }, () => {
                    this.openBox(menuInfo)
                })
            } else {
                this.setState({
                    isList: true,
                    lists: res.data,
                })
            }

        })
    }
    uploadWechatMenu() {
        let info = this.state.formData.defaultMenu || this.state.menuInfo.defaultMenu
        info.button.forEach((r, i) => {
            let obj = {}
            if (r.sub_button) {
                obj.name = r.name
                obj.sub_button = r.sub_button
                info.button[i] = obj
            } else {
                // obj.name = r.name
                // info.button[i] = obj
            }
        })
        if (info.menuType == "personal") {
            if (this.state.matchrule && this.state.matchrule.length == 0) {
                return message.error("必须要选择粉丝标签")
            }
            info.matchrule = this.state.matchrule
            info.name = this.state.menuName
        }
        let params = info
        console.log(params, this.state.source)
        // return console.log(params,this.state.source)
        if (params.button && params.button.length == 0) {
            this.delWechatMenu(params, "default")
            return
        }
        if (this.state.source == "add" || !params.id) {
            addWechatMenu(params).then(res => {
                if (res.data.errCode == 0) {
                    message.success("新增成功")
                    if (this.state.radioState == "default") {
                        this.props.onRefresh()
                        this.closeModal()
                    } else {
                        this.setState({
                            isList: true,
                        }, () => {
                            this.getWechatMenu()
                        })
                    }

                } else {
                    message.error("新增失败")
                }

            })
        } else {
            uploadWechatMenu(params).then(res => {
                if (res.data.errCode == 0) {
                    if (this.state.radioState == "default") {
                        this.props.onRefresh()
                        this.closeModal()
                    } else {
                        this.setState({
                            isList: true,
                        }, () => {
                            this.getWechatMenu()
                        })
                    }
                } else {
                    message.error(res.data.msg)
                }

            })
        }

    }
    requestWxProgramList() {
        requestWxProgramList().then(res => {
            this.setState({
                mpList: res.data
            })
        })
    }
    openBox(val) {
        console.log(val, "val")

        if (val && val.wxCode) {
            this.getFansTagList(val)
        }
        let menuInfo = JSON.parse(JSON.stringify(val))

        let arr = ""
        let openKeys = []
        if (menuInfo && this.props.openModal) {
            if (menuInfo.defaultMenu) {
                arr = menuInfo.defaultMenu.button
                if (arr && arr.length > 0) {
                    arr.forEach((r, index) => {
                        openKeys.push(r.name)
                        if (r.sub_button) {
                            r.sub_button.forEach((l, i) => {
                                l.sort = `${index}-${i}`
                            })
                        } else {
                            r.sort = `${index}-0`
                        }
                    })

                }
                if (this.formRef.current) {
                    console.log(arr, "arr")
                    if (arr && arr.length > 0 && arr[0].sub_button && arr[0].sub_button[0]) {
                        if(arr[0].sub_button[0].type == "view" || arr[0].sub_button[0].type == "miniprogram"){
                            arr[0].sub_button[0].msg_type = "Jump"
                            arr[0].sub_button[0].reply_info = [arr[0].sub_button[0]]
                        }
                        this.formRef.current.setFieldsValue(arr[0].sub_button[0])
                        this.setState({
                            currentMenu: arr[0].sub_button[0]
                        })
                    } else {
                        if(arr && arr.length > 0){
                            if(arr[0].type == "view" || arr[0].type == "miniprogram"){
                                arr[0].msg_type = "Jump"
                                arr[0].reply_info = JSON.parse(JSON.stringify([arr[0]]))
                            }
                           
                        }
                        this.formRef.current.setFieldsValue(arr[0])
                        this.setState({
                            currentMenu: arr[0]
                        })
                    }
                }
            } else {
                arr = ""
            }


        }
        this.setState({
            defaultSelectedKeys: ["0-0"],
            menuInfo: menuInfo,
            openKeys: openKeys
        })
    }
    //删除一级菜单
    delSubMenu(r, menuIndex) {
        console.log(r, menuIndex, "删除")
        let menuInfo = this.state.menuInfo
        menuInfo.defaultMenu.button.splice(menuIndex, 1)
        console.log(menuInfo, "menuInfo")
        this.setState({
            menuInfo: menuInfo
        }, () => {
            //判断删除的时候选中某一个
            if (menuInfo.defaultMenu.button.length > 0) {
                // this.formRef.current.setFieldsValue(menuInfo.defaultMenu.button[0])
                console.log(menuInfo.defaultMenu.button)
                if (menuInfo.defaultMenu.button[0].sub_button) {
                    this.setState({
                        defaultSelectedKeys: [menuInfo.defaultMenu.button[0].sub_button[0].sort],
                    })
                    this.formRef.current.setFieldsValue(menuInfo.defaultMenu.button[0].sub_button[0])
                } else {
                    this.setState({
                        defaultSelectedKeys: [menuInfo.defaultMenu.button[0].sort],
                    })
                    this.formRef.current.setFieldsValue(menuInfo.defaultMenu.button[0])
                }

            } else {
                console.log("我崩了")
                // this.formRef.current.resetFields()
                // let r = { name: "", sort: `${menuInfo.defaultMenu.button.length}-0`, type: "click", msg_type: "text","content":"" }
                // menuInfo.defaultMenu.button =[]
                // this.setState({
                //     menuInfo:menuInfo
                // })
                // this.formRef.current.setFieldsValue(r)
                this.formRef.current.setFieldsValue({msg_type:"text",name:"",reply_info:[{}]})
                this.forceUpdate()
            }
        })
    }
    getFansTagList(item) {
        let params = {
            wxAppCode: item.wxCode || item.defaultMenu.wxCode,
            page: {
                currentPage: 1,
                pageSize: 9999
            }
        }
        getFansTagList(params).then(res => {
            this.setState({
                fansTagList: res.data
            })
        })
    }
    delWechatMenu(item, type) {
        let params = {
            id: item.id
        }
        delWechatMenu(params).then(res => {
            message.success("删除成功")
            this.getWechatMenu()
            if (type == "default") {
                this.props.onRefresh()
                this.closeModal()
            }
        })
    }
    setMenuState(item, state) {
        let params = {
            status: state?"on":"off",
            id:item.id
        }
        setMenuState(params).then(res => {
            message.success("更改成功")
        })
    }
}