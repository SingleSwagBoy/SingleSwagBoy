/*
 * @Author: HuangQS
 * @Date: 2021-10-26 17:19:51
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-27 18:05:53
 * @Description: 广告组手动选择弹出框
 */



import React, { Component } from 'react';

import { Input, Form, DatePicker, Button, Table, Modal, Checkbox, Select, message, Image } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import {
    requestAdRightKey   //获取广告素材 获取右下角广告素材
} from 'api';

let { RangePicker } = DatePicker;
let { Option } = Select;

export default class adCreateModal extends Component {

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
            },

        }
    }
    render() {
        let that = this;
        let { table_box, modal_box } = that.state;

        return (
            <div>
                {modal_box &&
                    <Modal visible={modal_box.is_show} title={modal_box.title} transitionName="" maskClosable={false}
                        width={1400} style={{ top: 20 }} onCancel={() => that.onModalCancelClick()}
                        footer={[
                            <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                            <Button onClick={() => that.onModalConfirmClick()}>选择</Button>
                        ]}>

                        <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '70vh' }} />

                    </Modal>
                }
            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        console.log('初始化');
    }


    //弹出框取消按钮被点击
    onModalCancelClick() {
        let that = this;
        that.setState({
            modal_box: {
                is_show: false,
                title: '',
            }
        })
    }

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
    }

    //展示对话框
    showModal(data) {
        let that = this;
        let { table_box, modal_box } = that.state;
        modal_box.is_show = true;
        modal_box.title = data.title;

        let table_title = [
            {
                title: '选择', dataIndex: 'choose', key: 'choose', width: 80,
                render: (rowValue, row, index) => {
                    return <Checkbox checked={row.checked} onChange={(e) => {
                        let check = e.target.checked;
                        let { table_box } = that.state;
                        let datas = table_box.table_datas;
                        for (let i = 0, len = datas.length; i < len; i++) {
                            let item = datas[i];
                            item.checked = false;
                        }

                        row.checked = check;
                        that.forceUpdate();
                    }} />
                }
            },
            { title: '素材名称', dataIndex: 'name', key: 'name', width: 300, },
            { title: '类型', dataIndex: 'type', key: 'type', width: 100, },
            {
                title: '缩略图', dataIndex: 'iconPicUrl', key: 'iconPicUrl', width: 150,
                render: (rowValue, row, index) => {
                    return (<Image width={50} src={rowValue} />)
                }
            },
            {
                title: '背景图', dataIndex: 'picUrl', key: 'picUrl', width: 150,
                render: (rowValue, row, index) => {
                    return (<Image width={50} src={rowValue} />)
                }
            },
            {
                title: '时间', dataIndex: 'time', key: 'startTime',
                render: (rowValue, row, index) => {
                    let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                    let time = [];
                    if (row.startTime && row.endTime) {
                        time = [moment(new Date(row.startTime)), moment(new Date(row.endTime)),]
                    }
                    return (
                        <RangePicker value={time} showTime format={dateFormat} disabled />
                    )
                }
            },
        ];

        table_box.table_title = table_title;

        that.setState({
            modal_box: modal_box,
            table_box: table_box,
        }, () => {
            that.forceUpdate();
            that.refreshList();

        })

    }

    refreshList() {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            page: { currentPage: 1, pageSize: 10000 }
        };
        requestAdRightKey(obj).then(res => {

            table_box.table_datas = res.data;
            that.setState({
                table_box: table_box,
            })
        })
    }



}