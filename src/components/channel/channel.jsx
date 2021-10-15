/*
 * @Author: HuangQS
 * @Date: 2021-10-14 11:16:44
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-15 18:30:56
 * @Description: 快捷获取渠道信息
 */
import React, { Component } from 'react'
import { getDict } from "api"
import { Checkbox, Row, Col, Tree } from 'antd';
import { loadStore, saveStore, clearStore } from "@/utils/StoreManage"


class MyChannel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_check_all: false,
            dict_product_line_list: [],
            checkData: [],
            is_fold_product: false
        }
    }

    componentDidMount() {
        let that = this;
        that.requestChannelDict()

        //缓存如果有地址就不需要再次去请求
        let channel = loadStore('my_channel_data');
        if (channel) {
            that.setState({
                dict_area_list: JSON.parse(channel)
            })
        } else {
            that.requestChannelDict()
        }

    }
    render() {
        let that = this;
        let { dict_product_line_list, search_value } = that.state;
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
                    treeData={dict_product_line_list}
                />
            </div>
        )
    }



    //获取渠道信息
    requestChannelDict() {
        let that = this;
        let params = {
            page: { isPage: 9 },
            prodType: 1
        }
        getDict(params).then(res => {
            let data = res.data.data;

            let children = [];
            data.forEach(item => {
                children.push({ title: item.name, key: item.code })
            })

            let tree = [
                { title: "全选", key: "all", children: children }
            ]
            that.setState({
                dict_product_line_list: tree,
            }, () => {
                saveStore('my_channel_data', JSON.stringify(tree))
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

export default MyChannel