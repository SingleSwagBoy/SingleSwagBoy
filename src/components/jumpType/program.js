/*
 * @Author: YZC
 * @Date: 2022-04-27 14:07:35
 * @LastEditors: YZC
 * @LastEditTime: 2022-04-27 14:07:35
 * @Description: 自定义选择跳转类型列表，是一个大的整体，
 */


import React, { useState, useEffect, useReducer } from 'react'
import { selectSearch, getChannel, getProgramsList } from 'api'
import { Form, Select, } from 'antd'
import { } from 'react-router-dom'
import util from 'utils'
const { Option } = Select;
let privateData = {
    inputTimeOutVal: null
};
function App2(props) {
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const { formRef } = props
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
    useEffect(() => {//列表
        const fetchData = async () => {

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

        </div>
    )
}

export default App2