/*
 * @Author: YZC
 * @Date: 2022-04-27 14:07:35
 * @LastEditors: YZC
 * @LastEditTime: 2022-04-27 14:07:35
 * @Description: 自定义选择跳转类型列表，是一个大的整体，
 */


import React, { useState, useEffect, useReducer } from 'react'
import { requestNewAdTagList } from 'api'
import { Form, Select, } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined } from "@ant-design/icons"
const { Option } = Select;
let privateData = {
    inputTimeOutVal: null
};
function App2(props) {
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const [tagList, setTagList] = useState([])
    const selectProps = {
        optionFilterProp: "children",
        filterOption(input, option) {
            if (!input) return true;
            let children = option.children;
            if (children) {
                let key = children[2];
                let isFind = false;
                isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                if (!isFind) {
                    let code = children[0];
                    isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                }

                return isFind;
            }
        },
        showSearch() {
            console.log('onSearch')
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
            setTagList(arr.data)
        }
        fetchData()
    }, [])

    return (
        <div>
            <Form.Item label='标签' name={props.tagName}>
                <Select mode={true} allowClear showSearch placeholder="请选择用户设备标签" {...selectProps}>
                    {
                        tagList.map((item, index) => (
                            <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                        ))
                    }
                </Select>
            </Form.Item>

        </div>
    )
}

export default App2