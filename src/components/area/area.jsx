/*
 * @Author: HuangQS
 * @Date: 2021-10-14 16:58:06
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-15 17:29:54
 * @Description: 快捷获取地域信息
 */
import React, { Component } from 'react'
import { getPlace } from "api"
import { Tree, Input } from 'antd';
import { loadStore, saveStore, clearStore } from "@/utils/StoreManage"
import '@/style/base.css';

const { Search } = Input;

class Area extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dict_area_list: [],
            search_value: '',
        }

    }
    componentDidMount() {
        let that = this;

        //缓存如果有地址就不需要再次去请求
        let address = loadStore('my_area_data');
        if (address) {
            that.setState({
                dict_area_list: JSON.parse(address)
            })
        } else {
            that.requestArea()
        }

    }
    render() {
        let that = this;
        let { dict_area_list, search_value } = that.state;
        let { id, formRef } = that.props;
        let data = formRef.current.getFieldValue(id);   //获取外部数据

        if (!data) {
            let obj = {};
            obj[id] = data = [];
            formRef.current.setFieldsValue(obj);
        }
        //
        else if (data.constructor === String) {
            data = data.split(",");
            let obj = {};
            obj[id] = data;
            formRef.current.setFieldsValue(obj);
        }

        return (
            <div>
                <Tree checkable
                    onCheck={(items) => that.onTreeItemClick(items)}
                    onSelect={(items) => { console.log(items) }}
                    checkedKeys={data}
                    treeData={dict_area_list}
                />
            </div>
        )
    }

    //获取地区信息
    requestArea() {
        let that = this;
        getPlace({ page: { isPage: 9 } }).then(res => {
            let address = Object.assign([], res.data.data)
            let arr = address.filter(item => item.parentCode === "CN")
            arr.forEach(r => {
                r.title = r.name
                r.key = r.code + "-"
                r.children = []
                address.forEach(h => {
                    if (r.code === h.parentCode) {
                        r.children.push({ title: h.name, key: h.code })
                    }
                })
            })
            let tree = [
                { title: "全选", key: "all", children: arr }
            ]
            that.setState({
                dict_area_list: tree
            }, () => {
                saveStore('my_area_data', JSON.stringify(tree))
            })
        })
    }

    //树形结构Item被点击
    onTreeItemClick(items) {
        let that = this;
        let { id, formRef } = that.props;
        let obj = {};
        obj[id] = items;
        formRef.current.setFieldsValue(obj);
    }

}

export default Area