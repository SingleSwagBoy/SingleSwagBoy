/*
 * @Author: HuangQS
 * @Date: 2021-09-28 11:34:45
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-26 14:00:06
 * @Description: 菜单列表
 */

import React, { Component } from 'react';
import { Breadcrumb, InputNumber, Input, Form, Button, Table, Modal, Alert, message, Select, } from 'antd';

import {
    requestSysMenu,
    requestSysMenuCreate,
    requestSysMenuUpdate,
    requestSysMenuDelete,
} from 'api';
import adminRoutes from '@/routes/adminRoutes.js'
import '@/style/base.css';

let { Option } = Select;

export default class SysMenu extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            dict_role_lise: [],
            dict_level_type: [
                { key: 1, value: '父级组件' },
                { key: 2, value: '子类组件' },
            ],
            table_box: {
                menus: [],
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
        let { table_box, modal_box, dict_level_type } = that.state;


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
                                {that.formRef.current.getFieldValue('id') &&
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
                                <Form.Item label='排序' name='sortOrder' >
                                    <InputNumber className="base-input-wrapper" min={0} max={999} placeholder='请输入排序' />
                                </Form.Item>

                                <Form.Item label='层级类型' name='level' rules={[{ required: true }]}>
                                    <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择页面层级" onChange={() => { that.forceUpdate() }}>
                                        {dict_level_type.map((item, index) => (
                                            <Option key={index} value={item.key}>{item.key}-{item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {that.formRef.current.getFieldValue('level') != 1 &&
                                    <Form.Item label='父组件ID' name='parentId' rules={[{ required: true }]}>
                                        <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择父组件的id"
                                            filterOption={(input, option) => {
                                                if (!input) return true;
                                                let children = option.children;
                                                if (children) {
                                                    let key = children[2];
                                                    let isFind = false;
                                                    isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                    if (!isFind) {
                                                        let code = children[0];
                                                        isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                    }
                                                    return isFind;
                                                }
                                            }}>
                                            {table_box.menus.map((item, index) => (
                                                <Option key={index} value={item.id}>{item.id}-{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                }
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
                let data = res.data;
                let menus = [];

                //获取父级页面列表
                for (let i = 0, len = data.length; i < len; i++) {
                    let temp = data[i];
                    if (temp.level === 1) {
                        menus.push(temp);
                    }
                }
                table_box.table_datas = data;
                table_box.menus = menus;       //父级目录

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