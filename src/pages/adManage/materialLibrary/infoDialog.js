import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { addInfoGroup, getSdkList } from 'api'
import { Radio, Divider, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, Switch, Space, DatePicker } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
let { Option } = Select;
let { RangePicker } = DatePicker;
const { TabPane } = Tabs;
function App2(props) {
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
    const [activityConfig, setActivityConfig] = useState({ gradeTask: [], monthTask: "" })
    const tailLayout = {
        wrapperCol: { offset: 16, span: 8 }
    }
    const [activeKey, setActiveKey] = useState(0)
    const type = [
        { key: 1, value: '图片' },
        { key: 13, value: '图片（会员可投）' },
        { key: 2, value: '视频' },
        { key: 14, value: '视频（会员可投）' },
        { key: 3, value: '直播' },
        { key: 4, value: '支付' },
        { key: 5, value: '三方sdk' },
        { key: 6, value: '轮播推荐' },
        { key: 7, value: '轮播推荐(自动填充)' },
        { key: 8, value: '优惠券' },
        { key: 9, value: '家庭号' },
        { key: 10, value: '登录' },
        { key: 11, value: 'H5' },
        { key: 12, value: '小程序登录' }
    ]
    const jumpTypes = [
        { key: 1, value: '跳转到频道' },
        { key: 2, value: '跳转到下载' },
        { key: 3, value: '跳转到商品' },
        { key: 4, value: '跳转到活动' },
        { key: 5, value: '跳转到任务' },
        { key: 6, value: '跳转到菜单' },
        { key: 7, value: '跳转到二维码' },
        { key: 8, value: '跳转到好看分类' },
    ]
    const [formRef] = Form.useForm()
    const [content, setContent] = useState([])
    const [sdkList, setSdkList] = useState([])
    const [lists, setLists] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            setLists(props.table_data)
            if (props.table_data && props.table_data.content) {
                let arr = props.table_data
                arr.random = arr.random == 1 ? true : false
                arr.time = [moment(arr.startTime), moment(arr.endTime)]
                formRef.setFieldsValue(props.table_data)
            }
        }
        fetchData()
    }, [props.table_data])
    useEffect(() => {
        const fetchData = async () => {
            let list = await getSdkList({})
            setSdkList(list.data)
        }
        fetchData()
    }, [forceUpdateId])
    const submitFinish = (e) => {
        console.log(e)
    }
    //获取上传文件
    const getUploadFileUrl = (type, file, newItem, item) => {
        console.log(type, file, newItem, "newItem")
        item.imageUrl = newItem

    }
    return (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={formRef} onFinish={(e) => submitFinish(e)}>
            <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                <Input className="base-input-wrapper" placeholder="请输入广告名称" />
            </Form.Item>
            <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                <Select placeholder="类型" onChange={() => forceUpdatePages()}>
                    {
                        type.map((r, i) => {
                            return <Option value={r.key} key={i}>{r.value}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item label="上下线时间" name='time' rules={[{ required: true }]}>
                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
            </Form.Item>
            <Form.Item label="广告模式" name="mode" rules={[{ required: true }]}>
                <Select placeholder="类型">
                    <Option value={1} key={1}>定向</Option>
                    <Option value={2} key={2}>非定向</Option>
                </Select>
            </Form.Item>
            <Form.Item label='随机排序' name='random' valuePropName="checked">
                <Switch checkedChildren="开" unCheckedChildren="关" ></Switch>
            </Form.Item>
            <Form.Item label="图片配置" name="content">
                <Tabs
                    type="editable-card"
                    onChange={(e) => { }}
                    activeKey={activeKey.toString()}
                    onEdit={(targetKey, action) => {
                        // if (action == "add") {
                        //     if (content.length == 9) return message.error("已经达到上限")
                        //     add()
                        // } else if (action == "remove") {
                        //     remove(targetKey)
                        // }
                    }}
                >
                    {(formRef.getFieldValue("content") || []).map((r, i) => (
                        <TabPane tab={`第${i + 1}条`} key={i}>
                            <div>
                                {
                                    // 图片回复
                                    formRef.getFieldValue("type") === 1 &&
                                    <div>
                                        <Form.Item label='图片'>
                                            <MyImageUpload
                                                getUploadFileUrl={(file, newItem) => { getUploadFileUrl('picUrl', file, newItem, content[i]) }}
                                                imageUrl={formRef.getFieldValue("content")[i].picUrl} />
                                        </Form.Item>
                                        <Form.Item label='SDK'>
                                            <Select style={{ width: "100%" }} placeholder='请选择sdk'
                                                defaultValue={formRef.getFieldValue("content")[i].sdk}
                                                key={formRef.getFieldValue("content")[i].sdk}
                                                onChange={(e) => {

                                                }}>
                                                {sdkList.map((item, index) => (
                                                    <Option value={item.code} key={index}>{item.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label='跳转类型'>
                                            <Select style={{ width: "100%" }} placeholder='请选择跳转类型'
                                                defaultValue={formRef.getFieldValue("content")[i].jumpType}
                                                key={formRef.getFieldValue("content")[i].jumpType}
                                                onChange={(e) => {
                                                    console.log(formRef.getFieldValue())
                                                    let arr = formRef.getFieldValue().content
                                                    arr[i].jumpType = e
                                                    formRef.setFieldsValue(arr)
                                                    forceUpdatePages()
                                                }}>
                                                {jumpTypes.map((item, index) => (
                                                    <Option value={item.key} key={index}>{item.value}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        {
                                            formRef.getFieldValue("content")[i].jumpType == 1 &&
                                            <Form.Item label='频道'>
                                                <Select style={{ width: "100%" }} placeholder='请输入频道'
                                                    defaultValue={formRef.getFieldValue("content")[i].jumpType}
                                                    key={formRef.getFieldValue("content")[i].jumpType}
                                                    onChange={(e) => {

                                                    }}>
                                                    {jumpTypes.map((item, index) => (
                                                        <Option value={item.key} key={index}>{item.value}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        }
                                    </div>
                                }
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button onClick={() => { }}>取消</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                    确定
                </Button>
            </Form.Item>
        </Form>
    )
}

export default App2