import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { addInfoGroup, getSdkList, getChannel, requestProductSkuList, updateInfoGroup, getPosition } from 'api'
import { Radio, Divider, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, Switch, Checkbox, DatePicker, Row, Col } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
let { Option } = Select;
let { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;
let privateData = {
    inputTimeOutVal: null
};
function App2(props) {
    console.log(props)
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
    const goodLookTypes = [
        { key: 1, value: '点歌台' },
        { key: 2, value: '电视相册' },
        { key: 3, value: '公共相册' },
    ]
    const jumpMenuTypes = [
        { key: 1, value: '跳转到金币' },
        { key: 2, value: '跳转到手机' },
        { key: 3, value: '跳转到自建' },
        { key: 4, value: '跳转到设置' },
        { key: 5, value: '跳转到联系' },
        { key: 6, value: '跳转到语音' },
        { key: 7, value: '跳转到套餐' },
        { key: 8, value: '跳转到小剧场列表页' },
        { key: 100, value: '跳转到小剧场播放页' },
    ]
    const apkLauTypes = [
        { key: 1, value: '腾讯' },
        { key: 2, value: '爱奇艺' },
        { key: 3, value: '优酷' },
    ]
    const selectProps = {
        optionFilterProp: "children",
        // filterOption(input, option) {
        //     return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // },
        showSearch() {
            console.log('onSearch')
        }
    }
    const [formRef] = Form.useForm()
    const [product, setProduct] = useState([])
    const [sdkList, setSdkList] = useState([])
    const [position, setPosition] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [channelList, setChannelList] = useState([])
    const [lists, setLists] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            if (props.table_data.name) {
                setLists(props.table_data)
                if (props.table_data && props.table_data.content) {
                    let arr = props.table_data
                    arr.random = arr.random == 1 ? true : false
                    if (arr.type == 6) {
                        arr.content[0].channel = Array.isArray(arr.content[0].channel) ? arr.content[0].channel : arr.content[0].channel.split(",")
                    }
                    // arr.position = Array.isArray(arr.position)?arr.position.join(","):arr.position
                    arr.time = [arr.startTime ? moment(arr.startTime) : 0, arr.endTime ? moment(arr.endTime) : 0]
                    formRef.setFieldsValue(props.table_data)
                    console.log(formRef.getFieldsValue(), "formRef.getFieldValue")
                }
            } else {
                formRef.resetFields()
                setLists([])
            }
            setActiveKey(0)
            forceUpdatePages()
        }
        fetchData()
    }, [props.table_data])
    useEffect(() => {
        const fetchData = async () => {
            let list = await getSdkList({})
            setSdkList(list.data)
            let productList = await requestProductSkuList({ productCategoryType: 10, page: { idPage: 9 } })
            setProduct(productList.data.data)
            let positionList = await getPosition({ page: { idPage: 9 } })
            let data = positionList.data
            let formPosition = []
            data.forEach((r, i) => {
                if (r.validPosition) {
                    let arr = r.validPosition.split(",")
                    arr.forEach((l, index) => {
                        formPosition.push({ key: `${r.channelGroupId}:${l}`, value: `${r.channelGroupId}-${r.name}:位置${l}` })
                    })
                }
            })
            setPosition(formPosition)
        }
        fetchData()
    }, [forceUpdateId])
    const submitFinish = (e) => {
        let obj = formRef.getFieldValue()
        if (obj.type == 6) { //轮播推荐只会有一条数据
            obj.content[0].channel = Array.isArray(obj.content[0].channel) ? obj.content[0].channel.join(",") : obj.content[0].channel
        }
        if (obj.mode == 1) {
            obj.position = Array.isArray(obj.position) ? obj.position.join(",") : obj.position
        }
        if (obj.id) {
            updateInfoGroupFunc(formRef.getFieldValue())
        } else {
            addInfoGroupFunc(formRef.getFieldValue())
        }

    }
    const addInfoGroupFunc = (val) => {
        let params = {
            ...val,
            startTime: (val.time && val.time[0]) ? parseInt(val.time[0].valueOf()) : "",
            endTime: (val.time && val.time[1]) ? parseInt(val.time[1].valueOf()) : "",
        }
        delete params.time
        addInfoGroup(params).then(res => {
            message.success("新增成功")
            props.onModalCancelClick(3)

        })
    }
    const updateInfoGroupFunc = (val) => {
        console.log(val)
        let params = {
            ...val,
            startTime: (val.time && val.time[0]) ? parseInt(val.time[0].valueOf()) : "",
            endTime: (val.time && val.time[1]) ? parseInt(val.time[1].valueOf()) : "",
        }
        delete params.time
        updateInfoGroup(params).then(res => {
            message.success("更新成功")
            props.onModalCancelClick(3)

        })
    }
    //获取上传文件
    const getUploadFileUrl = (type, file, newItem, index) => {
        console.log(type, file, newItem, "newItem")
        let arr = formRef.getFieldValue()
        arr.content[index][type] = file
        formRef.setFieldsValue(arr)
        forceUpdatePages()
    }
    //公共方法，处理数据
    const changeData = (e, val, i, type) => {
        let arr = formRef.getFieldValue().content
        arr[i][val] = type == 1 ? e.target.value : e
        formRef.setFieldsValue({ content: arr })
        if (type) {
            if (privateData.inputTimeOutVal) {
                clearTimeout(privateData.inputTimeOutVal);
                privateData.inputTimeOutVal = null;
            }
            privateData.inputTimeOutVal = setTimeout(() => {
                if (!privateData.inputTimeOutVal) return;
                forceUpdatePages()
            }, 1000)
        } else {
            forceUpdatePages()
        }
    }
    const add = () => {
        let arr = formRef.getFieldValue()
        if (formRef.getFieldValue("type") != 1 && formRef.getFieldValue("type") != 13 && formRef.getFieldValue("type") != 14 && formRef.getFieldValue("type") != 2 && arr.content.length == 1) return message.error("该类型已经达到上限")
        arr.content.push({})
        forceUpdatePages()
        setActiveKey(arr.content.length - 1)
    }
    const remove = (index) => {
        let arr = formRef.getFieldValue()
        arr.content.splice(index, 1)
        forceUpdatePages()
        setActiveKey(activeKey > 0 ? activeKey - 1 : 0)
    }
    // //获取频道
    const getChannelList = (val) => {
        let params = {
            keywords: val,
            page: { currentPage: 1, pageSize: 20 }
        }
        getChannel(params).then(res => {
            if (res.data.errCode == 0 && res.data.data) {
                setChannelList(res.data.data)
                forceUpdatePages()
            }
        })
    }
    //搜索频道
    const comChannel = (e) => {
        if (privateData.inputTimeOutVal) {
            clearTimeout(privateData.inputTimeOutVal);
            privateData.inputTimeOutVal = null;
        }
        privateData.inputTimeOutVal = setTimeout(() => {
            if (!privateData.inputTimeOutVal) return;
            getChannelList(e)
        }, 1000)
    }
    return (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={formRef} onFinish={(e) => submitFinish(e)}>
            <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                <Input className="base-input-wrapper" placeholder="请输入广告名称" />
            </Form.Item>
            <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                <Select placeholder="类型" onChange={(e) => {
                    forceUpdatePages()
                    let arr = formRef.getFieldValue()
                    arr.content = [{}]
                    setActiveKey(0)
                    formRef.setFieldsValue(arr)
                }}>
                    {
                        type.map((r, i) => {
                            return <Option value={r.key} key={i}>{r.value}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item label="上下线时间" name='time'>
                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
            </Form.Item>
            <Form.Item label="广告模式" name="mode" rules={[{ required: true }]}>
                <Select placeholder="类型" onChange={() => forceUpdatePages()}>
                    <Option value={1} key={1}>定向</Option>
                    <Option value={2} key={2}>非定向</Option>
                </Select>
            </Form.Item>

            {
                formRef.getFieldValue("mode") === 1 &&
                <>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}><Button type='primary' onClick={() => setIsOpen(isOpen => !isOpen)}>{isOpen ? "点击折叠" : "点击展开"}</Button></div>
                    <Form.Item label="位置" name="position" style={isOpen ? { height: "auto" } : { height: "200px", overflowY: "scroll" }}>
                        <CheckboxGroup>
                            <Row>
                                {
                                    position.map((r, i) => {
                                        return (
                                            <Col span={6} style={{ margin: "0 0 10px 0" }} key={i}>
                                                <Checkbox value={r.key}>{r.value}</Checkbox>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </CheckboxGroup>
                    </Form.Item>
                </>

            }
            {
                (formRef.getFieldValue("type") === 1 || formRef.getFieldValue("type") === 2) &&
                <Form.Item label='随机排序' name='random' valuePropName="checked">
                    <Switch checkedChildren="开" unCheckedChildren="关" ></Switch>
                </Form.Item>
            }

            <Form.Item label="配置">
                <div>
                    <Tabs
                        type="editable-card"
                        onChange={(e) => {
                            setActiveKey(e)
                        }}
                        activeKey={activeKey.toString()}
                        onEdit={(targetKey, action) => {
                            if (action == "add") {
                                if (formRef.getFieldValue("type") == 0 || !formRef.getFieldValue("type")) return message.error("请先选择类型")
                                add()
                            } else if (action == "remove") {
                                remove(targetKey)
                            }
                        }}
                    >
                        {(formRef.getFieldValue().content || []).map((r, i) => (
                            <TabPane tab={`第${i + 1}条`} key={i}>
                                <div>
                                    {
                                        // 图片回复
                                        (formRef.getFieldValue("type") === 1 || formRef.getFieldValue("type") === 13) &&
                                        <div>
                                            <Form.Item label='图片'>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('picUrl', file, newItem, i) }}
                                                    imageUrl={formRef.getFieldValue("content")[i].picUrl} />
                                            </Form.Item>
                                            <Form.Item label='音频'>
                                                <Input placeholder='请上传音频' key={formRef.getFieldValue("content")[i].audioUrl} defaultValue={formRef.getFieldValue("content")[i].audioUrl}
                                                    onChange={(e) => changeData(e, "audioUrl", i, 1)}
                                                />
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('audioUrl', file, newItem, i) }} />
                                            </Form.Item>
                                            <Form.Item label='SDK'>
                                                <Select style={{ width: "100%" }} placeholder='请选择sdk'
                                                    defaultValue={formRef.getFieldValue("content")[i].sdk}
                                                    key={formRef.getFieldValue("content")[i].sdk}
                                                    onChange={(e) => changeData(e, "sdk", i)}>
                                                    {sdkList.map((item, index) => (
                                                        <Option value={item.code} key={index}>{item.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            {
                                                formRef.getFieldValue("content")[i].sdk == "dsjLive" &&
                                                <>
                                                    <Form.Item label='跳转类型'>
                                                        <Select style={{ width: "100%" }} placeholder='请选择跳转类型' allowClear
                                                            defaultValue={formRef.getFieldValue("content")[i].jumpType}
                                                            key={formRef.getFieldValue("content")[i].jumpType}
                                                            onChange={(e) => changeData(e, "jumpType", i)}>
                                                            {jumpTypes.map((item, index) => (
                                                                <Option value={item.key} key={index}>{item.value}</Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    {
                                                        formRef.getFieldValue("content")[i].jumpType == 1 &&
                                                        <Form.Item label='频道'>
                                                            <Select style={{ width: "100%" }} placeholder='请选择频道' allowClear
                                                                {...selectProps}
                                                                defaultValue={formRef.getFieldValue("content")[i].channel}
                                                                key={formRef.getFieldValue("content")[i].channel}
                                                                onChange={(e) => changeData(e, "channel", i)}
                                                                onSearch={(e) => comChannel(e)}
                                                            >
                                                                {
                                                                    channelList.map((r, i) => {
                                                                        return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                                    })
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    }
                                                    {
                                                        formRef.getFieldValue("content")[i].jumpType == 6 &&
                                                        <Form.Item label='跳转菜单类型'>
                                                            <Select style={{ width: "100%" }} placeholder='请选择跳转菜单类型' allowClear
                                                                defaultValue={formRef.getFieldValue("content")[i].jumpMenuType}
                                                                key={formRef.getFieldValue("content")[i].jumpMenuType}
                                                                onChange={(e) => changeData(e, "jumpMenuType", i)}>
                                                                {jumpMenuTypes.map((item, index) => (
                                                                    <Option value={item.key} key={index}>{item.value}</Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    }
                                                    {
                                                        formRef.getFieldValue("content")[i].jumpType == 8 &&
                                                        <Form.Item label='好看分类'>
                                                            <Select style={{ width: "100%" }} placeholder='请选择好看分类' allowClear
                                                                defaultValue={formRef.getFieldValue("content")[i].goodLookType}
                                                                key={formRef.getFieldValue("content")[i].goodLookType}
                                                                onChange={(e) => changeData(e, "goodLookType", i)}>
                                                                {goodLookTypes.map((item, index) => (
                                                                    <Option value={item.key} key={index}>{item.value}</Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    }
                                                </>

                                            }

                                            <Form.Item label='停留时长'>
                                                <InputNumber min={0} placeholder='请输入停留时长' key={formRef.getFieldValue("content")[i].showTime} defaultValue={formRef.getFieldValue("content")[i].showTime}
                                                    onChange={(e) => changeData(e, "showTime", i, 2)} />
                                            </Form.Item>
                                            <Form.Item label='排序'>
                                                <InputNumber style={{ width: "400px" }} min={0} placeholder='请输入排序' key={formRef.getFieldValue("content")[i].sort} defaultValue={formRef.getFieldValue("content")[i].sort}
                                                    onChange={(e) => changeData(e, "sort", i, 2)}
                                                />
                                            </Form.Item>
                                            {
                                                formRef.getFieldValue("content")[i].sdk != "dsjLive" &&
                                                <>
                                                    <Form.Item label='推广渠道'>
                                                        {/* <Input placeholder='请输入推广渠道' key={formRef.getFieldValue("content")[i].apkLauType} defaultValue={formRef.getFieldValue("content")[i].apkLauType}
                                                    onChange={(e) => changeData(e, "apkLauType", i, 1)}
                                                /> */}
                                                        <Select style={{ width: "100%" }} placeholder='请选择推广渠道' allowClear
                                                            defaultValue={formRef.getFieldValue("content")[i].apkLauType}
                                                            key={formRef.getFieldValue("content")[i].apkLauType}
                                                            onChange={(e) => changeData(e, "apkLauType", i)}>
                                                            {apkLauTypes.map((item, index) => (
                                                                <Option value={item.key} key={index}>{item.value}</Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item label='推广地址'>
                                                        <Input placeholder='请输入推广地址' key={formRef.getFieldValue("content")[i].apkLauAction} defaultValue={formRef.getFieldValue("content")[i].apkLauAction}
                                                            onChange={(e) => changeData(e, "apkLauAction", i, 1)}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item label='推广参数'>
                                                        <Input placeholder='请输入推广参数' key={formRef.getFieldValue("content")[i].apkLauParam} defaultValue={formRef.getFieldValue("content")[i].apkLauParam}
                                                            onChange={(e) => changeData(e, "apkLauParam", i, 1)}
                                                        />
                                                    </Form.Item>
                                                </>
                                            }

                                        </div>
                                    }
                                    {
                                        // 视频
                                        (formRef.getFieldValue("type") === 2 || formRef.getFieldValue("type") === 14) &&
                                        <div>
                                            <Form.Item label='视频'>
                                                <Input placeholder='请输入视频' key={formRef.getFieldValue("content")[i].videoUrl} defaultValue={formRef.getFieldValue("content")[i].videoUrl}
                                                    onChange={(e) => changeData(e, "videoUrl", i, 1)}
                                                />
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('videoUrl', file, newItem, i) }} />
                                            </Form.Item>
                                            <Form.Item label='排序'>
                                                <InputNumber style={{ width: "400px" }} min={0} placeholder='请输入排序' key={formRef.getFieldValue("content")[i].sort} defaultValue={formRef.getFieldValue("content")[i].sort}
                                                    onChange={(e) => changeData(e, "sort", i, 2)}
                                                />
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        // 直播
                                        formRef.getFieldValue("type") === 3 &&
                                        <div>
                                            <Form.Item label='频道'>
                                                <Select style={{ width: "100%" }} placeholder='请选择频道' allowClear
                                                    {...selectProps}
                                                    defaultValue={formRef.getFieldValue("content")[i].channel}
                                                    key={formRef.getFieldValue("content")[i].channel}
                                                    onChange={(e) => changeData(e, "channel", i)}
                                                    onSearch={(e) => comChannel(e)}
                                                >
                                                    {
                                                        channelList.map((r, i) => {
                                                            return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        // 支付
                                        (formRef.getFieldValue("type") === 4 || formRef.getFieldValue("type") === 9) &&
                                        <div>
                                            <Form.Item label='图片'>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('picUrl', file, newItem, i) }}
                                                    imageUrl={formRef.getFieldValue("content")[i].picUrl} />
                                            </Form.Item>
                                            {
                                                formRef.getFieldValue("type") === 4 &&
                                                <Form.Item label='VIP套餐'>
                                                    <Select style={{ width: "100%" }} placeholder='请选择VIP套餐' allowClear
                                                        defaultValue={formRef.getFieldValue("content")[i].pCode}
                                                        key={formRef.getFieldValue("content")[i].pCode}
                                                        onChange={(e) => changeData(e, "pCode", i)}>
                                                        {product.map((item, index) => (
                                                            <Option value={item.skuCode} key={index}>{item.name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            }

                                            <Form.Item label='二维码尺寸'>
                                                <InputNumber style={{ width: "400px" }} min={0} placeholder='请输入二维码尺寸' key={formRef.getFieldValue("content")[i].qrImgWidth} defaultValue={formRef.getFieldValue("content")[i].qrImgWidth}
                                                    onChange={(e) => changeData(e, "qrImgWidth", i, 2)}
                                                />
                                            </Form.Item>
                                            <Form.Item label='横向尺寸'>
                                                <InputNumber style={{ width: "400px" }} min={0} placeholder='请输入横向尺寸' key={formRef.getFieldValue("content")[i].qrImgLevel} defaultValue={formRef.getFieldValue("content")[i].qrImgLevel}
                                                    onChange={(e) => changeData(e, "qrImgLevel", i, 2)}
                                                />
                                            </Form.Item>
                                            <Form.Item label='纵向尺寸'>
                                                <InputNumber style={{ width: "400px" }} min={0} placeholder='请输入纵向尺寸' key={formRef.getFieldValue("content")[i].qrImgVertical} defaultValue={formRef.getFieldValue("content")[i].qrImgVertical}
                                                    onChange={(e) => changeData(e, "qrImgVertical", i, 2)}
                                                />
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        // 轮播推荐
                                        formRef.getFieldValue("type") === 6 &&
                                        <div>
                                            <Form.Item label='频道'>
                                                <Select style={{ width: "100%" }} placeholder='请选择频道' allowClear
                                                    {...selectProps} mode="multiple"
                                                    defaultValue={formRef.getFieldValue("content")[i].channel}
                                                    key={formRef.getFieldValue("content")[i].channel}
                                                    onChange={(e) => changeData(e, "channel", i)}
                                                    onSearch={(e) => comChannel(e)}
                                                >
                                                    {
                                                        channelList.map((r, i) => {
                                                            return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        // 轮播推荐
                                        formRef.getFieldValue("type") === 7 &&
                                        <div>
                                            <Form.Item label='填充个数'>
                                                <InputNumber style={{ width: "400px" }} min={0} placeholder='请输入填充个数' key={formRef.getFieldValue("content")[i].channelCount} defaultValue={formRef.getFieldValue("content")[i].channelCount}
                                                    onChange={(e) => changeData(e, "channelCount", i, 2)}
                                                />
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        // h5
                                        formRef.getFieldValue("type") === 11 &&
                                        <div>
                                            <Form.Item label='H5地址'>
                                                <Input placeholder='请输入H5地址' key={formRef.getFieldValue("content")[i].h5Url} defaultValue={formRef.getFieldValue("content")[i].h5Url}
                                                    onChange={(e) => changeData(e, "h5Url", i, 1)}
                                                />
                                            </Form.Item>
                                        </div>
                                    }
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </div>

            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button onClick={() => {
                    props.onModalCancelClick()

                }}>取消</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                    确定
                </Button>
            </Form.Item>
        </Form>
    )
}

export default App2