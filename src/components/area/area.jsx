/*
 * @Author: HuangQS
 * @Date: 2021-10-14 16:58:06
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-14 20:35:14
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
            searchValue: '',
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
        let { dict_area_list, searchValue } = that.state;
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
                <Search className="base-input-wrapper" style={{ marginBottom: 8 }} placeholder="筛选搜索地域信息(方便勾选)" onChange={(e) => { that.onSearchInputChange(e) }} />
                <Tree checkable
                    onCheck={(items) => that.onTreeItemClick(items)}
                    onSelect={(items) => { console.log(items) }}
                    checkedKeys={data}
                    treeData={dict_area_list.filter((item, i, self) => {
                        console.log(item)
                        return searchValue ? item.name === searchValue : true
                    })}
                />
            </div>
        )
    }

    //搜索输入框发生改变
    onSearchInputChange(e) {
        let { value } = e.target;
        console.log(value);

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