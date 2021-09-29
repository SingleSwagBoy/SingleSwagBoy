/*
 * @Author: HuangQS
 * @Date: 2021-09-28 11:35:08
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-29 16:12:37
 * @Description: 用户列表
 */


import React, { Component } from 'react';
import { Input, Form, Button, Table, Modal, Select, Alert, message, } from 'antd';
import {
    requestSysUser,
    requestSysUserCreate,
    requestSysUserUpdate,
    requestSysUserDelete,
    requestSysRole,
} from 'api';

let { Option } = Select;

export default class SysUser extends Component {
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
        let { table_box, modal_box, dict_role_lise } = that.state;

        return (
            <div>

                <Alert className="alert-box" message={
                    <div>用户列表</div>
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
                                <Form.Item label='登录账号' name='loginName' rules={[{ required: true }]}>
                                    <Input placeholder='请输入登录账号' />
                                </Form.Item>

                                <Form.Item label='登录姓名' name='userName' rules={[{ required: true }]}>
                                    <Input placeholder='请输入姓名' />
                                </Form.Item>

                                <Form.Item label='手机号' name='mobile'>
                                    <Input placeholder='请输入手机号' />
                                </Form.Item>

                                <Form.Item label='角色' name='roleId'>
                                    <Select placeholder="请选择用户角色">
                                        {dict_role_lise.map((item, index) => (
                                            <Option key={index} value={item.id}>{item.id}-{item.name}</Option>
                                        ))}
                                    </Select>
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

        //角色列表
        requestSysRole()
            .then(res => {
                that.setState({
                    dict_role_lise: res.data,
                }, () => {
                    that.initTitle();
                })
            })

    }

    initTitle() {
        let that = this;
        let { table_box } = that.state;

        let table_title = [
            { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
            { title: '登录账号', dataIndex: 'loginName', key: 'loginName', width: 300, },
            { title: '登录姓名', dataIndex: 'userName', key: 'userName', width: 120, },
            { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 200, },
            { title: '手机', dataIndex: 'mobile', key: 'mobile', },
            {
                title: '时间', dataIndex: 'time', key: 'time', width: 300,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <div>创建时间:{row.createTime}</div>
                            <div>更新时间:{row.updateTime}</div>
                        </div>
                    )
                }
            },

            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 150,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => that.showModal(row)}>编辑</Button>
                            <Button size='small' onClick={() => that.onItemDeleteClick(row)} style={{ marginLeft: 3 }}>删除</Button>
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

    //刷新用户数据
    refreshList() {
        let that = this;
        let { table_box } = that.state;

        requestSysUser().then(res => {
            table_box.table_datas = res.data;

            that.setState({
                table_box: table_box,
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
            let roleId = item.roleId;
            if (!roleId || roleId === 0) {
                delete item.roleId;
            }

            that.forceUpdate();
            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(item);
        });
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
        that.requestToCreateModifyUser();
    }



    //申请创建修改用户信息
    requestToCreateModifyUser() {
        let that = this;
        let id = that.formRef.current.getFieldValue('id');

        let obj = Object.assign({}, that.formRef.current.getFieldsValue());
        for (let key in obj) {
            let value = obj[key];
            if (!value) delete obj[key];
        }
        if (!obj.loginName) {
            message.error('请输入登录账号');
            return;
        }

        if (!obj.userName) {
            message.error('请输入用户姓名');
            return;
        }
        (id ? requestSysUserUpdate(obj) : requestSysUserCreate(obj))
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


    //删除用户信息
    onItemDeleteClick(item) {
        let that = this;

        Modal.confirm({
            title: '删除数据',
            content: '确认删除这一条数据？',
            onOk: () => {
                requestSysUserDelete({ id: item.id }).then(res => {
                    message.success('删除成功')
                    that.refreshList();
                })
            }
        })
    }
}
