/*
 * @Author: YZC
 * @Date: 2022-04-27 14:07:35
 * @LastEditors: YZC
 * @LastEditTime: 2022-04-27 14:07:35
 * @Description: 自定义选择跳转类型列表，是一个大的整体，
 */


import React, { useState, useEffect, useReducer } from 'react'
import { getChannel } from 'api'
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
    const { formRef } = props
    const [channelList, setChannelList] = useState([])
    const selectProps = {
        optionFilterProp: "children",
        // filterOption(input, option) {
        //     return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // },
        showSearch() {
            console.log('onSearch')
        }
    }
    useEffect(()=>{
        getChannelList()
    },[])
    //搜索频道
    const comChannel = (type, e) => {
        if (privateData.inputTimeOutVal) {
            clearTimeout(privateData.inputTimeOutVal);
            privateData.inputTimeOutVal = null;
        }
        privateData.inputTimeOutVal = setTimeout(() => {
            if (!privateData.inputTimeOutVal) return;
            getChannelList(e)
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
    return (
        <div>
            <Form.Item label='频道' name={props.channelCode}>
                <Select style={{ width: "100%" }} placeholder='请选择频道' allowClear mode={props.multiple}
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

        </div>
    )
}

export default App2