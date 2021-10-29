import React, { Component } from 'react'
import { getEarnTskList, addEarnTskList, updateEarnTskList, deleteEarnTskList, syncEarnTskList } from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Radio } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};
class VipCombo extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            currentItem: {},
            screen: {},  //筛选对象
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            dateFormat: 'YYYY-MM-DD HH:mm:ss',          //日期格式化
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            packageTypes: [
                { key: 1, label: "普通套餐" },
                { key: 2, label: "实物" },
                { key: 7, label: "竞猜答题" },
            ],
            platform: [
                { key: 1, value: "tv" },
                { key: 2, value: "Android" },
                { key: 3, value: "iOS" },
                { key: 4, value: "移动端" },
                { key: 5, value: "全平台" },
                { key: 6, value: "小程序" },
            ],
            tags: [
                { key: 1, value: "VIP用户" },
                { key: 2, value: "未登录用户" },
                { key: 3, value: "新用户" }
            ],
            putTypes: [
                { key: 1, value: '定向' },
                { key: 2, value: '非定向' }
            ]
        }
    }
    render() {
        return <div>
            <Card title={
                <div className="cardTitle">
                    <div className="everyBody">
                        <div>商品:</div>
                        <Input.Search allowClear placeholder="商品名称或code" onSearch={(val) => {
                            if (val) {
                                this.state.screen.goodsName = val
                            } else {
                                delete this.state.screen.userId
                            }
                            //this.getRecords()
                        }} />
                    </div>
                    <div className="everyBody">
                        <div>上线时间:</div>
                        <DatePicker showTime />
                    </div>
                    <div className="everyBody">
                        <div>下线时间:</div>
                        <DatePicker showTime />
                    </div>

                    <div className="everyBody">
                        <div>支持设备:</div>
                        <Select allowClear placeholder="选择支持设备"
                            onChange={(val) => {
                                console.log(val);
                            }}
                        >
                            {
                                this.state.platform.map(r => {
                                    return (
                                        <Option value={r.key} key={r.key}>{r.value}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>

                </div>
            }
            >

            </Card>
        </div>;
    }
}

export default VipCombo;