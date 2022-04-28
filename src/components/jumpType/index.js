/*
 * @Author: YZC
 * @Date: 2022-04-27 14:07:35
 * @LastEditors: YZC
 * @LastEditTime: 2022-04-27 14:07:35
 * @Description: 自定义选择跳转类型列表，是一个大的整体，
 */


import React, { useState, useEffect, useReducer } from 'react'
import { getCorner, selectSearch, getChannel, getApkList, getMenuList, getProgramsList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Space, InputNumber } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined } from "@ant-design/icons"
import moment from 'moment';
import util from 'utils'
const { Option } = Select;
let { RangePicker } = DatePicker;
let privateData = {
    inputTimeOutVal: null
};
function App2(props) {
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
    const {formRef} = props
    const [channelList, setChannelList] = useState([])
    const [programsList, setPrograms] = useState([])
    const [defaultPrograms, setDefaultPrograms] = useState([])
    const selectProps = {
        optionFilterProp: "children",
        // filterOption(input, option) {
        //     return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // },
        showSearch() {
            console.log('onSearch')
        }
    }
    const [apkList, setApkList] = useState([])
    const adType = [
        { key: 1, value: '图片' },
        { key: 3, value: '支付' },
        { key: 8, value: '宣传内容' },
        { key: 9, value: '家庭号' },
        { key: 10, value: '公众号登录' },
        { key: 11, value: '小程序登录' },
        { key: 13, value: '登录预约' },
    ]
    const goodLookTypes = [
        { key: 1, value: '点歌台' },
        { key: 2, value: '电视相册' },
        // { key: 3, value: '公共相册' },
    ]
    const jumpTypes = [
        { key: 1, value: '跳转到频道' },
        { key: 2, value: '跳转到下载' },
        // { key: 3, value: '跳转到商品' },
        // { key: 4, value: '跳转到活动' },
        // { key: 5, value: '跳转到任务' },
        { key: 6, value: '跳转到菜单' },
        // { key: 7, value: '跳转到二维码' },
        { key: 8, value: '跳转到好看分类' },
        { key: 11, value: '跳转到视频' },
    ]
    const [jumpMenuTypes, setJumpMenuTypes] = useState(
        [
            { key: 1, value: '跳转到我的' },
            // { key: 2, value: '跳转到H5' },
            { key: 3, value: '跳转到自建' },
            { key: 4, value: '跳转到设置' },
            { key: 5, value: '跳转到帮助' },
            { key: 6, value: '跳转到语音' },
            { key: 7, value: '跳转到套餐' },
            // { key: 8, value: '跳转到小剧场列表页' },
            // { key: 100, value: '跳转到小剧场播放页' },
        ]
    )
    useEffect(() => {//列表
        const fetchData = async () => {
            let myApk = await getApkList({ page: { idPage: 9 } })
            setApkList(myApk.data)
            getMenuListFuc()
        }
        fetchData()
    }, [forceUpdateId])
    //搜索频道
    const comChannel = (type, e) => {
        if (privateData.inputTimeOutVal) {
            clearTimeout(privateData.inputTimeOutVal);
            privateData.inputTimeOutVal = null;
        }
        privateData.inputTimeOutVal = setTimeout(() => {
            if (!privateData.inputTimeOutVal) return;
            if (type == 1) {
                getChannelList(e)
            }
        }, 1000)
    }
    // //获取频道
    const getChannelList = (val) => {
        let params = {
            keywords: val,
            page: { currentPage: 1, pageSize: 999 }
        }
        getChannel(params).then(res => {
            if (res.data.errCode == 0 && res.data.data) {
                setChannelList(res.data.data)
                props.onForceUpdatePages()
            }
        })
    }
    const getMenuListFuc = () => {
        let params = {
            page: { currentPage: 1, pageSize: 9999 }
        }
        getMenuList(params).then(res => {
            let arr = res.data.filter(item => item.status == 1)
            console.log(arr, "arr")
            let list = []
            arr.forEach((r, i) => {
                if (i == 0) {
                    list.push({ key: 21, value: r.name })
                } else if (i == 1) {
                    list.push({ key: 22, value: r.name })
                } else if (i == 2) {
                    list.push({ key: 23, value: r.name })
                }
            })
            setJumpMenuTypes(jumpMenuTypes => jumpMenuTypes.concat(list))
        })
    }
    const getProgams = (id, val) => {
        if (!val || !id) return
        let param = {
            keywords: val,
            channelId: id
        }
        selectSearch(param).then(res => {
            if (res.data.errCode == 0 && res.data.data && res.data.data.length > 0) {
                setPrograms(res.data.data)
            }
        })
    }
    //获取节目
    const getProgramsListFunc = (id, val) => {
        if (!val || !id) return
        let param = {
            keyword: val,
            channelId: id
        }
        getProgramsList(param).then(res => {
            if (res.data.errCode === 0) {
                let a = Object.entries(res.data.data)
                console.log(res.data.data, "a")
                let b = []
                for (const [key, value] of a) {
                    b.push({ label: util.formatTime(value.start_time, "", 2) + " " + value.name + " " + value.channel_id, value: key })
                }
                setPrograms(b)
                setDefaultPrograms(res.data.data)
            }
        })
    }
    return (
        <div>
            <Form.Item label='跳转类型' name="jumpType">
                <Select style={{ width: "100%" }} placeholder='请选择跳转类型' allowClear
                    onChange={(e) => props.onForceUpdatePages()}>
                    {jumpTypes.map((item, index) => (
                        <Option value={item.key} key={index}>{item.value}</Option>
                    ))}
                </Select>
            </Form.Item>
            {
                (formRef.getFieldValue("jumpType") == 1 || formRef.getFieldValue("jumpType") == 11) &&
                <Form.Item label='频道' name={props.channelCode}>
                    <Select style={{ width: "100%" }} placeholder='请选择频道' allowClear
                        {...selectProps}
                        onSearch={(e) => comChannel(1, e)
                        }
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
                formRef.getFieldValue("jumpType") == 2 &&
                <Form.Item label='运营APK' name={props.apk}>
                    <Select style={{ width: "100%" }} placeholder='请选择频道' allowClear {...selectProps}>
                        {
                            apkList.map((r, i) => {
                                return <Option value={r.id} key={r.id}>{r.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            }
            {
                formRef.getFieldValue("jumpType") == 6 &&
                <Form.Item label='跳转菜单类型' name={props.menuList}>
                    <Select style={{ width: "100%" }} placeholder='请选择跳转菜单类型' allowClear>
                        {jumpMenuTypes.map((item, index) => (
                            <Option value={item.key} key={index}>{item.value}</Option>
                        ))}
                    </Select>
                </Form.Item>
            }
            {
                formRef.getFieldValue("jumpType") == 8 &&
                <Form.Item label='好看分类' name={props.goodLook}>
                    <Select style={{ width: "100%" }} placeholder='请选择好看分类' allowClear>
                        {goodLookTypes.map((item, index) => (
                            <Option value={item.key} key={index}>{item.value}</Option>
                        ))}
                    </Select>
                </Form.Item>
            }
            {
                formRef.getFieldValue("jumpType") == 11 &&
                <Form.Item label="选择视频" name={props.programName}>
                    <Select
                        placeholder="请选择视频"
                        allowClear
                        {...selectProps}
                        onSearch={(val) => {
                            if (privateData.inputTimeOutVal) {
                                clearTimeout(privateData.inputTimeOutVal);
                                privateData.inputTimeOutVal = null;
                            }
                            privateData.inputTimeOutVal = setTimeout(() => {
                                if (!privateData.inputTimeOutVal) return;
                                let arr = channelList.filter(item => item.code == formRef.getFieldValue("jumpChannelCode"))
                                if (arr.length > 0) {
                                    console.log(arr, "arr")
                                    if (arr[0].recommendType == 1) {
                                        getProgams(formRef.getFieldValue("jumpChannelCode"), val)
                                    } else {
                                        getProgramsListFunc(formRef.getFieldValue("jumpChannelCode"), val)
                                    }
                                }
                            }, 1000)
                        }}
                        onChange={(r) => {
                            let info;
                            if (defaultPrograms[r]) { //非自建
                                info = defaultPrograms[r]
                                formRef.setFieldsValue({ channelSubTitle: info.name, channelStartTime: info.start_time, channelEndTime: info.end_time })
                                console.log(formRef.getFieldValue())
                            } else { //自建频道
                                info = programsList.filter(item => item.programId == r)
                                console.log(info,"自建频道")
                                if (info.length > 0) {
                                    formRef.setFieldsValue({ channelSubTitle: info[0].programName, channelStartTime: parseInt(info[0].startAt / 1000), channelEndTime: parseInt(info[0].endAt / 1000), picUrl: info[0].programPic })
                                }
                            }
                            props.onForceUpdatePages()
                        }}
                    >
                        {
                            programsList.map((r, i) => {
                                if (r.label) {
                                    return (
                                        <Option value={r.value} key={r.value}>{r.label}</Option>
                                    )
                                } else {
                                    return (
                                        <Option value={r.programId} key={i}>{r.programName}</Option>
                                    )
                                }
                            })

                        }
                    </Select>
                </Form.Item>
            }

        </div>
    )
}

export default App2