/*
 * @Author: HuangQS
 * @Date: 2021-10-27 18:41:39
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-28 11:03:44
 * @Description: 
 */


import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, message, Switch } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { MyArea, MyAddress, MyChannel, MySyncBtn } from '@/components/views.js';
import {
    requestAdTagList,           //获取广告标签列表

} from 'api';

let { RangePicker } = DatePicker;
let { Option } = Select;

export default class tagConfig extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
                key_code: '',
            },
        }

    }
    render() {
        let that = this;
        let { table_box, modal_box, address, } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="配置列表" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={7} name='同步缓存' />
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }} />

            </div>
        )
    }
    componentDidMount() {
        let that = this;
        that.initData();
    }
    initData() {
        let that = this;

        let { table_box } = that.state;


        let table_title= [];


        table_box.table_title = table_title;


        that.refreshList();
    }

    //刷新
    refreshList() {
        let that = this;
        let { table_box } = that.state;
        let obj = {
            pageType: 2,
            status: -1,
            tagType: 0,
        }

        // code: ""
        // name: ""
        // pageType: 2
        // status: -1
        // tagType: 0

        requestAdTagList(obj).then(res => {
            console.log(res.data);

        })

    }

    //新增配置被点击
    onCreateClick() {

    }
}