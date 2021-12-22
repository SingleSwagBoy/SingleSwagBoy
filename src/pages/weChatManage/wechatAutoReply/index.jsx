import React, { useState, useEffect, useCallback } from 'react'
import { getWelcome, getWechatUser, requestWxProgramList, saveWelcome, delWelcome, getWechatList, uploadImage, addWelcome, changeWelcome } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { TabPane } = Tabs;
let { TextArea } = Input;
function App2() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [lists, setLists] = useState([])
    const [getWechatUserList, setWechatUserList] = useState([])
    const [getWechat, setWechat] = useState([])
    const [dict_wx_program, setMiniPro] = useState([])
    const [layout] = useState({ labelCol: { span: 4 }, wrapperCol: { span: 20 } })
    const [formRef] = Form.useForm()
    const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })
    const [openDailog, setOpen] = useState(false)
    const [tabPane, setTabPane] = useState([])
    const [activeKey, setActiveKey] = useState(0)
    const [replyInfos, setReplyInfos] = useState([])
    const [currentItem, setCurrent] = useState({})
    const [source, setSource] = useState("")
    const [qywechatCode, setQywechatCode] = useState("")
    const [dict_msg_type] = useState([
        { key: 'text', value: '文字' },
        { key: 'image', value: '图片' },
        { key: 'miniprogram', value: '小程序卡片' },   //用于前端 穿给后端的时候 用文本形式上传
    ])
    const [columns] = useState([
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (rowValue, row, index) => {
                return (
                    <div>{<Switch
                        checkedChildren="有效"
                        unCheckedChildren="无效"
                        defaultChecked={rowValue === 1 ? true : false}
                        key={rowValue}
                        onChange={(val) => {
                            let info = JSON.parse(JSON.stringify(row))
                            info.status = val ? 1 : 0
                            changeWelcomeAPi(info)

                        }}
                    />}</div>
                )
            }
        },
        {
            title: "操作",
            key: "action",
            fixed: 'right', width: 200,
            render: (rowValue, row, index) => {
                return (
                    <div>
                        <Button
                            style={{ margin: "0 10px" }}
                            size="small"
                            type="primary"
                            onClick={() => {
                                console.log(row)
                                let arr = JSON.parse(JSON.stringify(row))
                                arr.sourceTag = arr.sourceTag == 1 ? true : false
                                arr.userids = arr.userids ? arr.userids.split(",") : ""
                                setReplyInfos(arr.replyInfos)
                                setCurrent(row)
                                setOpen(true)
                                setActiveKey(0)
                                formRef.setFieldsValue(arr)
                                setSource("edit")
                            }}
                        >编辑</Button>
                        <Button danger size="small" onClick={() => delItem(row)}>删除</Button>
                    </div>
                )
            }
        }
    ])
    useEffect(async () => {
        // const getWelcomeList = await getWelcome({})

        const getWechatUserList = await getWechatUser({})
        const getMiniPro = await requestWxProgramList({})
        const getWechat = await getWechatList({})
        setWechat(getWechat.data)
        setWechatUserList(getWechatUserList.data)
        setMiniPro(getMiniPro.data)
        getWelcomeFunc(getWechat.data)
    }, [])
    // useEffect(async () => {
    //     setActiveKey(setActiveKey)
    // }, [replyInfos])
    const changeSize = (e) => {
        console.log(e)
    }
    const submitForm = (e) => {//表单提交
        console.log(e)
        if (source == "add") {
            let params = {
                ...e,
                userids: Array.isArray(e.userids) ? e.userids.join(",") : e.userids,
                sourceTag: e.sourceTag ? 1 : 0,
                replyInfos: replyInfos ? replyInfos : []
            }
            addWelcomeApi(params)
        } else {
            let params = {
                ...currentItem,
                ...e,
                userids: Array.isArray(e.userids) ? e.userids.join(",") : e.userids,
                sourceTag: e.sourceTag ? 1 : 0,
                replyInfos: replyInfos ? replyInfos : []
            }
            saveWelcomeApi(params)
        }
        closeDialog()
    }
    const addWelcomeApi = (params) => {
        addWelcome(params).then(res => {
            message.success("新增成功")
            getWelcomeFunc(params.qywechatCode)
        })
    }
    const closeDialog = () => {
        formRef.resetFields()
        setOpen(false)
        setReplyInfos([])
    }
    const saveWelcomeApi = (params) => {
        saveWelcome(params).then(res => {
            message.success("更新成功")
            getWelcomeFunc(params.qywechatCode)
        })
    }
    const changeWelcomeAPi = (val) => {
        console.log(val)
        let params = {
            id: val.id,
            status: val.status
        }
        changeWelcome(params).then(res => {
            message.success("操作成功")
            // getWelcomeFunc(val.qywechatCode)
        })
    }
    const add = () => {
        if (!formRef.getFieldValue("qywechatCode")) return message.error("请先选择企业微信")
        let index = replyInfos.length
        let item = { title: `第${index}条`, key: index }
        setReplyInfos(replyInfos => [...replyInfos, item])
        setActiveKey(index)

    };
    const remove = (e) => {
        console.log(e)
        let list = JSON.parse(JSON.stringify(replyInfos))
        list.splice(e, 1)
        list.forEach((r, i) => {
            r.key = i + 1
            r.title = `第${r.key}条`
        })
        setActiveKey(e > 0 ? e - 1 : e)
        setReplyInfos([...list])
    };
    //获取上传文件
    const getUploadFileUrl = (type, file, newItem, item) => {
        console.log(type, file, newItem, "newItem")
        item.imageUrl = newItem
        if (item.msgType == "miniprogram") {
            item.dsjMediaId = newItem
        }
        let arr = [...replyInfos]
        setReplyInfos(arr)
    }
    //获取上传文件
    const getUploadFile = (file) => {
        console.log(file)
        // uploadMiniImage(file)
    }
    const delItem = (row) => {
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                deleteItem(row)
            },
            onCancel: () => {
            }
        })
    }
    const deleteItem = (item) => {
        delWelcome({ id: item.id }).then(res => {
            getWelcomeFunc(item.qywechatCode)
        })
    }
    const getWelcomeFunc = (data) => {
        let param = {
            qywechatCode: Array.isArray(data) ? data[0].code : data
        }
        getWelcome(param).then(res => {
            setLists(res.data)
            setQywechatCode(param.qywechatCode)
        })
    }
    const strToBinary = (str) => {
        var result = [];
        var list = str.split("");
        for (var i = 0; i < list.length; i++) {
            if (i != 0) {
                result.push(" ");
            }
            var item = list[i];
            var binartStr = item.charCodeAt().toString(2);
            result.push(binartStr);
        }
        return result.join("");
    }
    // const [values, setFieldValues] = useForm()
    const uploadMiniImage = (item) => {
        console.log(item)
        let formData = new FormData();
        formData.append('file', JSON.stringify(item))
        console.log(formData)
        let info = strToBinary(item)
        let parmas = { qywechatCode: formRef.getFieldValue("qywechatCode") }
        let header = {
            "Content-Type": "multipart/form-data",
            // "Content-Type":"application/x-www-form-urlencoded"
        }
        uploadImage(parmas, formData, header).then(res => {

        })
    }
    return (
        <div className="loginVip">
            <Card title={
                <div>
                    {/* <Breadcrumb>
                        <Breadcrumb.Item>企业自动回复</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Select allowClear style={{ width: "40%" }} key={qywechatCode} defaultValue={qywechatCode} placeholder="请选择电视家用户标签" onChange={(e) => {
                        getWelcomeFunc(e)
                    }}>
                        {
                            getWechat.map(r => {
                                return (
                                    <Option value={r.code} key={r.id}>{r.name}</Option>
                                )
                            })
                        }
                    </Select>
                </div>
            }
                extra={
                    <div>
                        <Button type="primary" onClick={() => {
                            setOpen(true)
                            setSource("add")
                        }}>新建</Button>
                    </div>
                }
            >
                <Table
                    dataSource={lists}
                    // scroll={{ x: 1200, y: '75vh' }}
                    // rowKey={item=>item.indexId}
                    // loading={loading}
                    columns={columns}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: changeSize
                    }}
                />
                <Modal title="编辑" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            form={formRef}
                            onFinish={(e) => submitForm(e)}>
                            <Form.Item label="企业微信" name="qywechatCode">
                                <Select allowClear style={{ width: "100%" }} placeholder="请选择电视家用户标签">
                                    {
                                        getWechat.map(r => {
                                            return (
                                                <Option value={r.code} key={r.id}>{r.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="名称" name="name">
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                            <Form.Item label="客服联系人" name="userids">
                                <Select allowClear mode="multiple" style={{ width: "100%" }} placeholder="请选择电视家用户标签" showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        getWechatUserList.map(r => {
                                            return (
                                                <Option value={r.userid} key={r.userid}>
                                                    <img src={r.avatar} alt="" style={{ width: "20px" }} />
                                                    {r.name}
                                                </Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="客服标签" name="sourceTag" valuePropName="checked">
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" ></Switch>
                            </Form.Item>
                            <Form.Item label="欢迎语" name="replyInfos">
                                <Tabs
                                    type="editable-card"
                                    onChange={(e) => {
                                        // let info = JSON.parse(JSON.stringify(replyInfos))
                                        console.log(replyInfos, "replyInfos")
                                        setReplyInfos([...replyInfos])
                                        setActiveKey(e)
                                    }}
                                    activeKey={activeKey.toString()}
                                    onEdit={(targetKey, action) => {
                                        if (action == "add") {
                                            if (replyInfos.length == 9) return message.error("已经达到上限")
                                            add()
                                        } else if (action == "remove") {
                                            remove(targetKey)
                                        }
                                    }}
                                >
                                    {replyInfos.map((r, i) => (
                                        <TabPane tab={`第${i + 1}条`} key={i}>
                                            <div>
                                                <Form.Item label='消息类型' >
                                                    <Radio.Group onChange={(e) => {
                                                        r.msgType = e.target.value
                                                        let info = [...replyInfos]
                                                        setReplyInfos(info)
                                                    }}
                                                        key={replyInfos[i].msgType}
                                                        defaultValue={replyInfos[i].msgType}
                                                    >
                                                        {dict_msg_type.map((item, index) => (
                                                            <Radio value={item.key} key={index}>{item.value}</Radio>
                                                        ))}
                                                    </Radio.Group>
                                                </Form.Item>
                                                {
                                                    // 文字回复
                                                    replyInfos[i].msgType === 'text' &&
                                                    <div>
                                                        <Form.Item label='文字回复'>
                                                            <TextArea style={{ width: "100%" }} rows={5} placeholder='请输入文字回复' defaultValue={replyInfos[i].content}
                                                                onChange={(e) => {
                                                                    replyInfos[i].content = e.target.value
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                }
                                                {
                                                    // 图片回复
                                                    replyInfos[i].msgType === 'image' &&
                                                    <div>
                                                        <Form.Item label='图片回复'>
                                                            <MyImageUpload
                                                                postUrl={`/mms/wx/qywechat/uploadimg?qywechatCode=${formRef.getFieldValue("qywechatCode")}`} //上传地址
                                                                // params={{qywechatCode:formRef.getFieldValue("qywechatCode")}}
                                                                getUploadFileUrl={(file, newItem) => { getUploadFileUrl('imageUrl', file, newItem, replyInfos[i]) }}
                                                                imageUrl={replyInfos[i].imageUrl} />
                                                        </Form.Item>
                                                    </div>
                                                }
                                                {
                                                    // 小程序卡片
                                                    replyInfos[i].msgType === 'miniprogram' &&
                                                    <div>
                                                        <Form.Item label='卡片标题'>
                                                            <Input style={{ width: "100%" }} placeholder='请输入小程序标题' defaultValue={replyInfos[i].title}
                                                                onChange={(e) => {
                                                                    replyInfos[i].title = e.target.value
                                                                }} />
                                                        </Form.Item>
                                                        <Form.Item label='小程序'>
                                                            <Select style={{ width: "100%" }} placeholder='请选择小程序'
                                                                defaultValue={replyInfos[i].appid}
                                                                onChange={(e) => {
                                                                    replyInfos[i].appid = e
                                                                    let arr = [...replyInfos]
                                                                    console.log(arr)
                                                                    setReplyInfos(arr)
                                                                }}>
                                                                {dict_wx_program.map((item, index) => (
                                                                    <Option value={item.appid} key={index}>{item.appName}</Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label='appId' >
                                                            <Input style={{ width: "100%" }} placeholder='请输入appid' disabled defaultValue={replyInfos[i].appid} key={replyInfos[i].appid}></Input>
                                                        </Form.Item>
                                                        <Form.Item label='小程序路径'>
                                                            <TextArea style={{ width: "100%" }} rows={3} placeholder='小程序页面 示例：pages/index/hqs' defaultValue={replyInfos[i].path}
                                                                onChange={(e) => {
                                                                    replyInfos[i].path = e.target.value
                                                                }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label='小程序路径'>
                                                            <MyImageUpload
                                                                postUrl={"/mms/wx/qywechat/uploadmedia"} //上传地址
                                                                getUploadFile={(file) => getUploadFile(file)}
                                                                needAgain={true}
                                                                getUploadFileUrl={(file, newItem) => { getUploadFileUrl('imageUrl', file, newItem, replyInfos[i]) }}
                                                                imageUrl={replyInfos[i].imageUrl} />
                                                        </Form.Item>
                                                    </div>
                                                }
                                            </div>
                                        </TabPane>
                                    ))}
                                </Tabs>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button onClick={() => closeDialog()}>取消</Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </Card>

        </div>
    )
}

export default App2