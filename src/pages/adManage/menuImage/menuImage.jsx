/*
 * @Author: HuangQS
 * @Date: 2021-09-10 14:50:06
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-10 15:44:34
 * @Description: 菜单栏 图片配置页
 */


import React, { Component } from 'react'
import { Input, DatePicker, Button, Tooltip, Table, Pagination, Switch, Modal, Image, Alert, notification, message, Divider } from 'antd';

import {
    requestConfigMenuImageList,                         //菜单栏配置 列表
    requestConfigMenuImageCreate,                       //菜单栏配置 新增
    requestConfigMenuImageEidt,                         //菜单栏配置 编辑
    requestConfigMenuImageDelete,                       //菜单栏配置 删除
    requestConfigMenuImageChangeState,                  //菜单栏配置 修改状态
} from 'api';

import SyncBtn from "@/components/syncBtn/syncBtn.jsx"

export default class MenuImagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            table_box: {
                table_title: [],
                table_datas: [],
            },
        }
    }

    componentDidMount() {
        let that = this;
        that.initData();
    }

    render() {
        let that = this;
        let { table_box } = that.state;

        return (
            <div>
                <SyncBtn type={4} name={'同步缓存'} />

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1300 }} />

            </div>
        )
    }

    initData() {


    }




}