/*
 * @Author: HuangQS
 * @Date: 2021-09-28 11:34:45
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-29 18:26:14
 * @Description: 菜单列表
 */

import React, { Component } from 'react';
import { Breadcrumb, InputNumber, Input, Form, Button, Table, Modal, Alert, message, } from 'antd';
import {
    requestSysMenu,
    requestSysMenuCreate,
    requestSysMenuUpdate,
    requestSysMenuDelete,
} from 'api';
import adminRoutes from '@/routes/adminRoutes.js'
import '@/style/base.css';



export default class SysMenu extends Component {
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
                    <Breadcrumb>
                        <Breadcrumb.Item>菜单列表</Breadcrumb.Item>
                    </Breadcrumb>

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
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }
                                <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder='请输入名称' />
                                </Form.Item>
                                <Form.Item label='code' name='code' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder='请输入code' />
                                </Form.Item>
                                <Form.Item label='访问路径' name='path' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder='请输入访问路径' />
                                </Form.Item>

                                <Form.Item label='层级' name='level' rules={[{ required: true }]}>
                                    <InputNumber className="base-input-wrapper" min={1} max={999} placeholder='请输入页面层级' />
                                </Form.Item>

                                <Form.Item label='排序' name='sortOrder' >
                                    <InputNumber className="base-input-wrapper" min={1} max={999} placeholder='请输入排序' />
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
            { title: '名称', dataIndex: 'name', key: 'name', width: 240, },
            { title: 'code', dataIndex: 'code', key: 'code', width: 220, },
            { title: '层级', dataIndex: 'level', key: 'level', width: 80, },
            { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80, },
            {
                title: '路径', dataIndex: 'path', key: 'path',
                render: (rowValue, row, index) => {
                    let is_has_router = false;

                    for (let key in adminRoutes) {
                        let temp_path = adminRoutes[key].path;
                        if (temp_path === rowValue) {
                            is_has_router = true;
                            break;
                        }
                    }

                    {
                        return is_has_router ? <a onClick={() => that.onPathClick(rowValue)}>{rowValue}</a> : <label> {rowValue}</label>
                    }


                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 150,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => that.showModal(row)}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 3 }} onClick={() => that.onItemDeleteClick(row)}>删除</Button>
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
        requestSysMenu()
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
        that.requestToCreateModifyMenu();
    }
    //申请创建修改用户信息
    requestToCreateModifyMenu() {
        let that = this;
        let id = that.formRef.current.getFieldValue('id');

        let obj = Object.assign({}, that.formRef.current.getFieldsValue());
        for (let key in obj) {
            let value = obj[key];
            if (!value) delete obj[key];
        }

        if (!obj.name) {
            message.error('请输入名称');
            return;
        }
        if (!obj.code) {
            message.error('请输入code');
            return;
        }
        if (!obj.path) {
            message.error('请输入路径');
            return;
        }
        if (!obj.level) {
            message.error('请输入页面层级');
            return;
        }

        (id ? requestSysMenuUpdate(obj) : requestSysMenuCreate(obj)).then(res => {
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
    //删除按钮被点击
    onItemDeleteClick(item) {
        let that = this;
        Modal.confirm({
            title: '删除数据',
            content: '确认删除这一条数据？',
            onOk: () => {
                requestSysMenuDelete({ id: item.id }).then(res => {
                    message.success('删除成功')
                    that.refreshList();
                })
            }
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

    onPathClick(path) {
        let that = this;
        that.props.history.push({ pathname: path })
    }
}