/*
 * @Author: HuangQS
 * @Date: 2021-08-30 11:56:33
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-17 14:18:30
 * @Description: 微信支付模板消息
 */


import React, { Component } from 'react';
import { Menu, Button, Table, Switch, Input, Upload, Image, message, Select, Alert, Tooltip, Form, Radio } from 'antd';
import { MySyncBtn } from '@/components/views.js';

import {
    requestWxTemplateMsgConfigList,                             //微信模板消息 列表
    requestWxTemplateMsgConfigCreate,                           //微信模板消息 添加
    requestWxTemplateMsgConfigUpload,                           //微信模板消息 修改
    requestWxTemplateMsgConfigDelete,                           //微信模板消息 删除
    requestWxTemplateMsgConfigSend,                             //微信模板消息 测试发送
} from 'api';


export default class WxPayTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
            },
        }
    }
    render() {
        let that = this;
        let { table_box, modal_box } = that.state;
        let input_width_size = 340;


        return (
            <div>
                <Alert className="alert-box" message="微信模板消息" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={6} name={'同步缓存'} />
                    </div>
                } />


                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1000, y: '75vh' }} />
            </div>

        )
    }
    componentDidMount() {
        let that = this;
        that.initData();
    }

    initData() {
        let that = this;
        that.initTitle();
    }

    initTitle() {
        let that = this;
        let { table_box } = that.state;

        let table_title = [
            { title: 'Id', dataIndex: 'Id', key: '_id', width: 80, },
            { title: '名称', dataIndex: 'Name', key: 'Name', width: 80, },
            // { title: 'Title', dataIndex: 'Title', key: 'Title', width: 80, },
            { title: '微信公众号', dataIndex: 'WxCode', key: 'WxCode', width: 80, },
            // { title: '模板Id', dataIndex: 'TmplId', key: 'TmplId', width: 80, },
            // { title: '跳转地址', dataIndex: 'Jump', key: 'Jump', width: 80, },
            {
                title: '上下线时间', dataIndex: 'Time', key: 'Time', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <div>{row.StartTime} -{row.EndTime}</div>
                        </div>
                    )
                }
            },
            { title: '投放时间段', dataIndex: 'TimeBucket', key: 'TimeBucket', width: 200, },
         
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' style={{ marginLeft: 3 }}>复制</Button>
                            <Button size='small' style={{ marginLeft: 3 }}>发送</Button>
                            <Button size='small' style={{ marginLeft: 3 }}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 3 }}>删除</Button>
                        </div>
                    )
                }

            },


        ]


        table_box.table_title = table_title;

        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList();
        })
    }

    refreshList() {
        let that = this;
        let { table_box } = that.state;
        let obj = {
            page: {
                currentPage: 1,
                pageSize: 999999,
            }
        };
        requestWxTemplateMsgConfigList(obj)
            .then(res => {
                console.log(res.data);

                table_box.table_datas = res.data;
                that.setState({
                    table_box: table_box,
                });
            })

    }

    onCreateClick() {

    }
}