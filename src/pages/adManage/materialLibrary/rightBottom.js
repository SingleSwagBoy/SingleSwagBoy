import React, { useState, useEffect, useReducer } from 'react'
import { getCorner, addCorner, updateCorner, delCorner, getChannelTag, requestProductSkuList } from 'api'
import { TimePicker, Image, Button, message, Table, Modal, Radio, Input, Form, Select, DatePicker, Switch, Space, InputNumber, Divider, Row, Col } from 'antd'
import { } from 'react-router-dom'
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons"
import moment from 'moment';
import { ChannelCom, MyImageUpload, JumpType, ProgramCom } from "@/components/views.js"
import util from 'utils'
import "./index.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
let privateData = {
    inputTimeOutVal: null
};
function App2(props) {
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(9999)
    const [total, setTotal] = useState(0)
    const [lists, setLists] = useState([])
    const [channelTag, setChannelTag] = useState([])
    // const [tagList, setTagList] = useState([])
    const [layout] = useState({ labelCol: { span: 4 }, wrapperCol: { span: 20 } })
    const [formRef] = Form.useForm()
    const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })
    const [openDailog, setOpen] = useState(false)
    const [source, setSource] = useState("")
    const [productList, setProductList] = useState([])
    const everyTime = "00:00,01:00,02:00,03:00,04:00,05:00,06:00,07:00,08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00,20:00,21:00,22:00,23:00"
    const selectProps = {
        optionFilterProp: "children",
        // filterOption(input, option) {
        //     return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // },
        showSearch() {
            console.log('onSearch')
        }
    }
    const adType = [
        { key: 1, value: '图片' },
        { key: 3, value: '支付' },
        { key: 8, value: '宣传内容' },
        { key: 9, value: '家庭号' },
        { key: 10, value: '公众号登录' },
        { key: 11, value: '小程序登录' },
        { key: 23, value: '登录预约' },
    ]
    const positions = [
        { key: 1, value: '左上', },
        { key: 2, value: '左下', },
        { key: 3, value: '中心', },
        { key: 4, value: '右上', },
        { key: 5, value: '右下', }
    ]
    const dsjPositions = [
        { key: 1, value: '左上', },
        { key: 2, value: '左下', },
        { key: 3, value: '中心', },
        { key: 4, value: '右上', },
        { key: 5, value: '右下', },
        { key: 6, value: '垂直居中', },
        { key: 7, value: '横向居中', }
    ]
    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "排序",
            dataIndex: "sortOrder",
            key: "sortOrder",
        },
        {
            title: '广告图预览', dataIndex: 'picUrl', key: 'picUrl',
            render: (rowValue, row, index) => {
                return (<Image width={100} src={rowValue} />)
            }
        },
        {
            title: "上下线时间",
            dataIndex: "time",
            key: "time",
            width:300,
            render: (rowValue, row, index) => {
                return (
                    <div>
                        {row.startTime ? util.formatTime(row.startTime, "", "") : "未配置"}
                        -
                        {row.endTime ? util.formatTime(row.endTime, "", "") : "未配置"}
                    </div>
                )
            }
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (rowValue, row, index) => {
                return (
                    <div>{<Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={rowValue == 1 ? true : false} key={rowValue}
                        onChange={(val) => {
                            let info = JSON.parse(JSON.stringify(row))
                            info.status = val ? 1 : 2
                            editArmour(info)
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
                        <Button danger size="small" onClick={() => addArmour(row, 1)}>复制</Button>
                        <Button
                            style={{ margin: "0 10px" }}
                            size="small"
                            type="primary"
                            onClick={() => {
                                console.log(row)
                                let arr = JSON.parse(JSON.stringify(row))
                                if (arr.type == 3) {
                                    getProduct() //请求套餐
                                }
                                if(arr.type == 23){
                                    arr.programName = arr.channelSubTitle
                                }
                                arr.time = [moment(arr.startTime), moment(arr.endTime)] //上下线时间
                                if (arr.djsEndTime) { //倒计时结束时间
                                    arr.djsEndTime = moment(arr.djsEndTime)
                                }
                                if (arr.jumpType == 11) { //登录视频
                                    arr.programName = arr.channelSubTitle
                                }
                                arr.isLoop = arr.isLoop ? 1 : 2 //是否循环
                                if (arr.timers) {
                                    if (arr.timers == everyTime) {
                                        arr.setTimeVal = 2
                                    } else {
                                        arr.setTimeVal = 1
                                    }
                                    arr.isSetTime = 1
                                } else {
                                    arr.isSetTime = 2
                                }
                                // arr.setTimeVal = arr.timers == everyTime ? 2 : arr.timers ? 1 : null //定时设置
                                arr.duration = arr.duration / 1000
                                arr.interval = arr.interval / 1000 / 60
                                arr.delayTime = arr.delayTime / 1000
                                // 封装自定义时间
                                let list = arr.timers ? arr.timers.split(",") : []
                                let isA = []
                                list.forEach(r => {
                                    isA.push({ time: moment(r, "HH:mm") })
                                })
                                arr.timersList = isA
                                // 投放时间
                                if (arr.channelDeliveryType == 1 && arr.deliveryTimeDaily.length > 0) {
                                    arr.deliveryTimeDaily.forEach(r => {
                                        r.myTime = [moment(r.startTime, "HH:mm"), moment(r.endTime, "HH:mm")]
                                    })
                                }
                                arr.channels = Array.isArray(arr.channels) ? arr.channels : arr.channels ? arr.channels.split(",") : [] //关联频道
                                arr.channelTag = Array.isArray(arr.channelTag) ? arr.channelTag : arr.channelTag ? arr.channelTag.split(",") : [] //关联频道标签
                                setOpen(true)
                                console.log(arr, "arr")
                                formRef.setFieldsValue(arr)
                                setSource("edit")
                            }}
                        >编辑</Button>
                        <Button danger size="small" onClick={() => delItem(row)}>删除</Button>
                    </div>
                )
            }
        }
    ]
    useEffect(() => {//标签
        const fetchTagData = async () => {
            if (props.isOpen) {
                formRef.resetFields()
                setSource("add")
                setOpen(props.isOpen)
            }
        }
        fetchTagData()
    }, [props.isOpen])
    useEffect(() => {//列表
        const fetchData = async () => {
            const list = await getCorner({ name: props.searchWords, page: { currentPage: 1, pageSize: 9999 } })
            setLists(list.data)
        }
        fetchData()
    }, [forceUpdateId, props.searchWords])
    useEffect(() => {//频道标签
        const fetchData = async () => {
            const arr = await getChannelTag({})
            setChannelTag(arr.data)
        }
        fetchData()
    }, [])
    const changeSize = (e) => {
        console.log(e)
    }
    const getProduct = () => { //获取产品线
        let params = {
            page: { isPage: 9 },
            productCategoryType: 10
        }
        requestProductSkuList(params).then(res => {
            setProductList(res.data.data)
        })
    }
    const submitForm = (val) => {//表单提交
        // 处理数据
        if (val.channelTag) {
            val.channelTag = Array.isArray(val.channelTag) ? val.channelTag.join(",") : val.channelTag
        }
        if (val.channels) {
            val.channels = Array.isArray(val.channels) ? val.channels.join(",") : val.channels
        }
        if (val.deliveryTimeDaily && val.deliveryTimeDaily.length > 0) {
            val.deliveryTimeDaily.forEach(r => {
                r.startTime = moment(r.myTime[0]).format("HH:mm")
                if (moment(r.myTime[1]).format("HH:mm") == "00:00") {
                    r.endTime = "24:00"
                } else {
                    r.endTime = moment(r.myTime[1]).format("HH:mm")
                }
            })
        }
        if (val.isCountDown == 1 && val.djsEndTime) {
            val.djsEndTime = val.djsEndTime.valueOf()
        }
        val.startTime = val.time ? parseInt(val.time[0].valueOf()) : val.startTime;
        val.endTime = val.time ? parseInt(val.time[1].valueOf()) : val.endTime;
        val.isLoop = val.isLoop ? 1 : 2;
        val.duration = val.duration * 1000
        val.interval = val.interval * 1000 * 60
        val.delayTime = val.delayTime * 1000
        // val.timers =
        if (val.setTimeVal == 2) {
            val.timers = everyTime
        } else {
            let list = []
            if (val.timersList && val.timersList.length > 0) {
                val.timersList.forEach(r => {
                    list.push(moment(r.time).format("HH:mm"))
                })
                val.timers = list.join(",")
            } else {
                val.timers = ""
            }
        }
        let params = {
            ...formRef.getFieldValue(),
            ...val,
        }
        console.log(val)
        // return
        if (source == "add") {
            addArmour(params)
        } else if (source == "edit") {
            editArmour(params)
        } else {
            let params = {
                ...val,
            }
            editArmour(params)
        }
        closeDialog()
    }
    const addArmour = (params, type) => {
        if (type == 1) {
            delete params.id
            Modal.confirm({
                title: `确认复制该条数据吗？`,
                // content: '确认删除？',
                onOk: () => {
                    addCorner(params).then(res => {
                        message.success("新增成功")
                        forceUpdate()
                    })
                },
                onCancel: () => {
                }
            })
        } else {
            addCorner(params).then(res => {
                message.success("新增成功")
                forceUpdate()
            })
        }

    }
    const closeDialog = () => {
        formRef.resetFields()
        setOpen(false)
        props.onCloseOpen()
        setSource("")
    }
    const editArmour = (params) => {
        updateCorner(params).then(res => {
            message.success("修改成功")
            forceUpdate()
        })
    }
    const delItem = (row) => {
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                delCorner({ id: row.id }).then(res => {
                    message.success("删除成功")
                    forceUpdate()
                })
            },
            onCancel: () => {
            }
        })
    }
    const getUploadFileUrl = (type, file, newItem) => {
        let that = this;
        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;
        console.log(obj)
        formRef.setFieldsValue(obj);
        forceUpdatePages()
    }
    const getUploadFileImageUrlByType = (type) => {
        let image_url = formRef.getFieldValue(type);
        return image_url ? image_url : '';
    }
    return (
        <div className="loginVip">
            <Table
                dataSource={lists}
                scroll={{ x: 1000, y: '75vh' }}
                rowKey={item => item.id}
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
                        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
                            <Input placeholder="请输入名称" />
                        </Form.Item>
                        <Form.Item label='类型' name="type">
                            <Select style={{ width: "100%" }} placeholder='请选择跳转类型' allowClear onChange={(e) => {
                                console.log(e)
                                if (e == 3 && productList.length == 0) { //支付
                                    getProduct()
                                }
                                forceUpdatePages()
                            }}>
                                {adType.map((item, index) => (
                                    <Option value={item.key} key={index}>{item.value}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {
                            // 支付、小程序登录、公众号登录
                            (formRef.getFieldValue("type") == 3 || formRef.getFieldValue("type") == 10 || formRef.getFieldValue("type") == 11) &&
                            <>
                                <Form.Item label="二维码尺寸" >
                                    <Form.Item label="" name="qrWidth" style={{ display: "inline-flex" }} >
                                        <InputNumber placeholder="请输入二维码尺寸" style={{ width: "150px" }} addonAfter="px" />
                                    </Form.Item>
                                    <Form.Item label="二维码横向偏移" name="qrX" style={{ display: "inline-flex", margin: "0 20px" }}>
                                        <InputNumber placeholder="请输入二维码横向偏移" style={{ width: "150px" }} addonAfter="px" />
                                    </Form.Item>
                                    <Form.Item label="二维码纵向偏移" name="qrY" style={{ display: "inline-flex" }}>
                                        <InputNumber placeholder="请输入二维码纵向偏移" style={{ width: "150px" }} addonAfter="px" />
                                    </Form.Item>
                                </Form.Item>

                            </>

                        }
                        {
                            // 支付
                            formRef.getFieldValue("type") == 3 &&
                            <Form.Item label="二维码套餐" name="pCode" >
                                <Select placeholder='选择关联频道标签' allowClear {...selectProps}>
                                    {
                                        productList.map((item, index) => {
                                            return <Option value={item.skuCode} key={index}> {item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                        {
                            // 登录预约
                            formRef.getFieldValue("type") == 23 &&
                            <ProgramCom formRef={formRef} programName={"programName"} channelCode={"jumpChannelCode"} onForceUpdatePages={() => forceUpdatePages()} />
                        }
                        <Form.Item label="图片" name="picUrl">
                            <div style={{ display: "flex", alignItems: "flex-start" }}>
                                <Input.TextArea defaultValue={formRef.getFieldValue("picUrl")} key={formRef.getFieldValue("picUrl")}
                                    onChange={(e) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            formRef.setFieldsValue({ picUrl: e.target.value })
                                            forceUpdatePages()
                                        }, 1000)
                                    }}
                                />
                                <MyImageUpload
                                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('picUrl', file, newItem)}
                                    formRef={formRef} width={"width"} height={"height"}
                                    imageUrl={getUploadFileImageUrlByType('picUrl')}
                                />
                            </div>

                        </Form.Item>
                        <Form.Item label="音频地址" name="videoUrl">
                            <div style={{ display: "flex", alignItems: "flex-start" }}>
                                <Input.TextArea defaultValue={formRef.getFieldValue("videoUrl")} key={formRef.getFieldValue("videoUrl")}
                                    onChange={(e) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            formRef.setFieldsValue({ videoUrl: e.target.value })
                                            forceUpdatePages()
                                        }, 1000)
                                    }}
                                />
                                <MyImageUpload
                                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('videoUrl', file, newItem)}
                                    imageUrl={getUploadFileImageUrlByType('videoUrl')}
                                />
                            </div>

                        </Form.Item>
                        <Form.Item label="上下线时间">
                            <Form.Item label="" name="time" className='line_flex'>
                                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                            </Form.Item>
                            <Form.Item label='位置' name='position' className='line_flex'>
                                <Select className="input-wrapper-from" placeholder='位置'>
                                    {positions.map((item, index) => {
                                        return <Option value={item.key} key={item.key} name={item.value}>
                                            <div>{item.value}</div>
                                        </Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="图片宽">
                            <Form.Item label="" name="width" className='line_flex'>
                                <InputNumber placeholder="请输入二维码尺寸" style={{ width: "150px" }} addonAfter="px" />
                            </Form.Item>
                            <Form.Item label="图片高" name="height" className='line_flex'>
                                <InputNumber placeholder="请输入二维码尺寸" style={{ width: "150px" }} addonAfter="px" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="横向偏移">
                            <Form.Item label="" name="rightOffset" className='line_flex'>
                                <InputNumber placeholder="请输入横向偏移" style={{ width: "150px" }} addonAfter="px" />
                            </Form.Item>
                            <Form.Item label="纵向偏移" name="bottomOffset" className='line_flex'>
                                <InputNumber placeholder="请输入纵向偏移" style={{ width: "150px" }} addonAfter="px" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="显示时长（s）">
                            <Form.Item label="" name="duration" className='line_flex'>
                                <InputNumber placeholder="请输入横向偏移" style={{ width: "150px" }} addonAfter="s" />
                            </Form.Item>
                            <Form.Item label="显示次数" name="totalCount" className='line_flex'>
                                <InputNumber placeholder="请输入纵向偏移" style={{ width: "150px" }} addonAfter="次" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="延迟时长（s）">
                            <Form.Item label="" name="delayTime" className='line_flex'>
                                <InputNumber placeholder="请输入延迟时长（s）" style={{ width: "150px" }} addonAfter="s" />
                            </Form.Item>
                            <Form.Item label="间隔时长（m）" name="interval" className='line_flex'>
                                <InputNumber placeholder="请输入间隔时长（m）" style={{ width: "150px" }} addonAfter="min" />
                            </Form.Item>
                        </Form.Item>
                        {/* 
                            此组件是选择类型整体组件，后续可能还会用到、
                            参数是 formRef 
                        */}
                        {
                            formRef.getFieldValue("type") != 23 &&
                            <JumpType
                                onForceUpdatePages={() => forceUpdatePages()}
                                formRef={formRef} //表单对象
                                channelCode={"jumpChannelCode"}
                                apk={"apkId"}
                                menuList={"jumpMenuType"}
                                goodLook={"goodLookType"}
                                programName={"programName"}
                            />
                        }

                        <Form.Item label="是否参与循环">
                            <Form.Item label="" name="isLoop" valuePropName="checked" className='line_flex'>
                                <Switch checkedChildren="是" unCheckedChildren="否" ></Switch>
                            </Form.Item>
                            <Form.Item label="排序" name="sortOrder" className='line_flex'>
                                <InputNumber style={{ width: "200px" }} placeholder='请输入排序' />
                            </Form.Item>
                        </Form.Item>


                        <Form.Item label='是否定时' name='isSetTime'>
                            <Radio.Group onChange={() => forceUpdatePages()}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            formRef.getFieldValue("isSetTime") == 1 &&
                            <Form.Item label='定时设置'>
                                <Form.Item label='' name='setTimeVal' className='line_flex'>
                                    <Select className="input-wrapper-from" placeholder='定时设置' onChange={(e) => {
                                        if (e == 2) {
                                            let isA = []
                                            everyTime.split(",").forEach(r => {
                                                isA.push({ time: moment(r, "HH:mm") })
                                            })
                                            formRef.setFieldsValue({ timersList: isA })
                                        } else {
                                            formRef.setFieldsValue({ timersList: [] })
                                        }
                                        forceUpdatePages()
                                    }}>
                                        <Option value={1} key={1}>自定义</Option>
                                        <Option value={2} key={2}>每小时</Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        }
                        {
                            formRef.getFieldValue("isSetTime") == 1 && formRef.getFieldValue("setTimeVal") == 1 &&
                            <Form.Item label="自定义">
                                <Form.List name="timersList">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Row gutter={16} key={index}>
                                                    <Col className="gutter-row" span={16}>
                                                        <Form.Item
                                                            {...field}
                                                            label=""
                                                            key={index}
                                                            name={[field.name, 'time']}
                                                            fieldKey={[field.fieldKey, index]}
                                                            rules={[{ required: true, message: '时间不能为空' }]}
                                                            className="line_flex"
                                                            style={{ width: "100px" }}
                                                        >
                                                            <TimePicker onChange={() => { }} format={"HH:mm"} />
                                                        </Form.Item>

                                                        <Button danger onClick={() => {
                                                            remove(field.name)
                                                        }} >删除</Button>
                                                    </Col>

                                                </Row>
                                            ))}
                                            <Form.Item>
                                                <Button type="primary" onClick={() => {
                                                    add()
                                                }} block icon={<PlusOutlined />}>
                                                    新增自定义时间
                                                </Button>
                                            </Form.Item>

                                        </>
                                    )}
                                </Form.List>
                            </Form.Item>
                        }
                        <Form.Item label='显示倒计时' name='isCountDown'>
                            <Select className="input-wrapper-from" placeholder='定时设置' onChange={() => forceUpdatePages()}>
                                <Option value={1} key={1}>是</Option>
                                <Option value={2} key={2}>否</Option>
                            </Select>
                        </Form.Item>
                        {
                            formRef.getFieldValue("isCountDown") == 1 &&
                            <>
                                <Form.Item label='倒计时结束时间' name='djsEndTime'>
                                    <DatePicker showTime />
                                </Form.Item>
                                <Form.Item label="字号" >
                                    <Form.Item label="" name="fontSize" style={{ display: "inline-flex" }} >
                                        <InputNumber placeholder="请输入二维码尺寸" style={{ width: "150px" }} addonAfter="px" />
                                    </Form.Item>
                                    <Form.Item label="字体颜色" name="fontColor" style={{ display: "inline-flex", margin: "0 20px" }}>
                                        <Input placeholder="请输入字体颜色" style={{ width: "150px" }} />
                                    </Form.Item>
                                    <Form.Item label="倒计时背景颜色" name="djsBackgroundColor" style={{ display: "inline-flex" }}>
                                        <Input placeholder="请输入倒计时背景颜色" style={{ width: "150px" }} />
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="显示距离今日结束时间" >
                                    <Form.Item label="" name="jljr" className='line_flex'>
                                        <Select placeholder='选择显示距离今日结束时间' onChange={() => forceUpdatePages()} style={{ width: "200px" }}>
                                            <Option value={1} key={1}>是</Option>
                                            <Option value={2} key={2}>否</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="字体位置" name="djsPosition" className='line_flex'>
                                        <Select className="input-wrapper-from" placeholder='位置'>
                                            {dsjPositions.map((item, index) => {
                                                return <Option value={item.key} key={item.key} name={item.value}>
                                                    <div>{item.value}</div>
                                                </Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="字体横坐标" >
                                    <Form.Item label="" name="fontX" className='line_flex'>
                                        <InputNumber placeholder="请输入字体横坐标" style={{ width: "150px" }} addonAfter="px" />
                                    </Form.Item>
                                    <Form.Item label="字体纵坐标" name="fontY" className='line_flex'>
                                        <InputNumber placeholder="请输入字体纵坐标" style={{ width: "150px" }} addonAfter="px" />
                                    </Form.Item>
                                </Form.Item>
                            </>
                        }
                        <Divider orientation="left">投放配置</Divider>
                        <Form.Item label='投放类型' name='channelDeliveryType'>
                            <Radio.Group>
                                <Radio value={1}>定向</Radio>
                                <Radio value={2}>非定向</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='投放时间段'>
                            <Form.List name="deliveryTimeDaily" label='投放时间段'>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            // <Space key={index*10} align="baseline">

                                            // </Space>
                                            <Row gutter={16} key={index}>
                                                <Col className="gutter-row" span={16}>
                                                    <Form.Item
                                                        {...field}
                                                        label=""
                                                        name={[field.name, 'myTime']}
                                                        fieldKey={[field.fieldKey, "myTime"]}
                                                        rules={[{ required: true, message: '时间不能为空' }]}
                                                        className="line_flex"
                                                        style={{ width: "200px" }}
                                                    >
                                                        <TimePicker.RangePicker minuteStep={30} format={"HH:mm"} />
                                                    </Form.Item>
                                                    <Button danger onClick={() => {
                                                        remove(field.name)
                                                    }} >删除</Button>
                                                </Col>

                                            </Row>

                                        ))}
                                        <Form.Item>
                                            <Button type="primary" onClick={() => {
                                                add()
                                            }} block icon={<PlusOutlined />}>
                                                新增投放时间段
                                            </Button>
                                        </Form.Item>

                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                        <ChannelCom formRef={formRef} channelCode={"channels"} multiple={"multiple"} />
                        <Form.Item label="关联频道标签" name="channelTag">
                            <Select placeholder='选择关联频道标签' mode='multiple' allowClear>
                                {
                                    channelTag.map((r, i) => {
                                        return <Option value={String(r.id)} key={i}>{r.name}</Option>
                                    })
                                }
                            </Select>
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

        </div>
    )
}

export default App2