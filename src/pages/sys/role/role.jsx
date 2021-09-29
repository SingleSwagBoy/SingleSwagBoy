/*
 * @Author: HuangQS
 * @Date: 2021-09-28 11:34:45
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-29 16:12:13
 * @Description: 角色列表
 */

import React, { Component } from 'react';
import { Input, Form, Button, Table, Modal, Alert, message } from 'antd';
import {
    requestSysRole,
    requestSysRoleCreate,
    requestSysRoleUpdate,
    requestSysRoleDelete,
} from 'api';

export default class SysRole extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            dict_role_lise: [],

            table_box: {
                table_datas: [],
                table_title: [],
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
                <Alert className="alert-box" message={
                    <div>角色列表</div>
                } type="success" action={
                    <div>
                        <Button style={{ marginLeft: 3 }} onClick={() => that.showModal({})}>新增</Button>
                    </div>
                }>
                </Alert>
                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1200 }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" onCancel={() => that.onModalCancelClick()}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >确定</Button>
                    ]}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input disabled />
                                    </Form.Item>
                                }
                                <Form.Item label='角色' name='name' rules={[{ required: true }]}>
                                    <Input placeholder='请输入角色名称' />
                                </Form.Item>
                                <Form.Item label='code' name='code' rules={[{ required: true }]}>
                                    <Input placeholder='请输入角色code' />
                                </Form.Item>
                            </div>
                        }
                    </Form>
                </Modal>

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
            { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
            { title: '角色名称', dataIndex: 'name', key: 'name', width: 240, },
            { title: 'code', dataIndex: 'code', key: 'code' },

            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 150,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => that.showModal(row)}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 3 }} disabled>删除</Button>
                        </div >
                    )
                }
            },
        ];
        table_box.table_title = table_title;

        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList();
        })


    }
    //刷新列表
    refreshList() {
        let that = this;
        //角色列表
        requestSysRole()
            .then(res => {
                let { table_box } = that.state;
                table_box.table_datas = res.data;
                that.setState({
                    table_box: table_box,
                })
            })
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
    //弹出框确认按钮被点击
    onModalConfirmClick() {
        let that = this;
        that.requestToCreateModifyRole();
    }

    //申请创建修改用户信息
    requestToCreateModifyRole() {
        let that = this;
        let id = that.formRef.current.getFieldValue('id');

        let obj = Object.assign({}, that.formRef.current.getFieldsValue());
        for (let key in obj) {
            let value = obj[key];
            if (!value) delete obj[key];
        }
        if (!obj.name) {
            message.error('请输入角色名称');
            return;
        }

        if (!obj.code) {
            message.error('请输入角色code');
            return;
        }

        (id ? requestSysRoleUpdate(obj) : requestSysRoleCreate(obj))
            .then(res => {
                message.success('操作成功');
                that.setState({
                    modal_box: {
                        is_show: false,
                        title: '',
                    }
                }, () => {
                    that.refreshList();
                })
            })

    }


    //展示修改|编辑对话框
    showModal(item) {
        let that = this;

        that.setState({
            modal_box: {
                is_show: true,
                title: item.id ? '编辑' : '新增',
            }
        }, () => {
            that.forceUpdate();
            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(item);
        })
    }
}