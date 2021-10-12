/*
 * @Author: HuangQS
 * @Date: 2021-09-28 11:34:45
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-11 13:58:17
 * @Description: 权限列表
 */

import React, { Component } from 'react';
import { Menu, Input, Form, Button, Pagination, Table, Modal, DatePicker, Select, Alert, Switch, message, Divider } from 'antd';
import timeUtils from '@/utils/time.js';
import '@/style/base.css';
import {
    requestSysRole,                                     //角色列表
    requestSysMenu,                                     //功能列表
    requestSysUserRolePermissions,                      //获取角色权限
    requestSysUserRolePermissionCreate,                 //添加角色权限
    requestSysUserRolePermissionUpdate,                 //更新角色权限
    requestSysUserRolePermissionDelete,                 //删除角色权限

} from 'api';
import moment from 'moment';

let { Option } = Select;
let { RangePicker } = DatePicker;

export default class SysPermission extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            dict_sys_role: [],                          //角色列表
            dict_sys_menu: [],                          //功能列表
            dict_permissions: [
                { key: 1, value: '只读' },
                { key: 2, value: '读写' },
                { key: 3, value: '读写删' },
            ],
            table_box: {
                table_datas: [],
                table_pages: {
                    currentPage: 1,
                    totalCount: 0,
                    pageSize: 100,
                },
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
        let { table_box, modal_box, 
            dict_sys_role, dict_sys_menu, dict_permissions, } = that.state;

        return (
            <div>
                <Alert className="alert-box" message={
                    <div>权限列表</div>
                } type="success" action={
                    <div>
                        <Button style={{ marginLeft: 3 }} onClick={() => that.showModal({})}>新增</Button>
                    </div>
                }>
                </Alert>


                {/* {dict_sys_role.map((item, index) => {
                    return <div>{item.name}</div>
                })} */}

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} scroll={{ x: 1200 }} pagination={false} />

                <div className="pagination-box">
                    {/* <Pagination current={table_box.table_pages.currentPage} pageSize={table_box.table_pages.pageSize} onChange={(page, pageSize) => that.onPageChange(page, pageSize)} total={table_box.table_pages.totalCount} /> */}
                </div>

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
                                <Form.Item label="角色" name='roleId' rules={[{ required: true }]} >
                                    <Select className="base-input-wrapper" placeholder="请选择用户角色">
                                        {dict_sys_role.map((item, index) => (
                                            <Option key={index} value={item.id}>{item.id}-{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="菜单目录功能" name='menuId' rules={[{ required: true }]} >
                                    <Select className="base-input-wrapper" placeholder="请选择菜单目录" showSearch={true}>
                                        {dict_sys_menu.map((item, index) => (
                                            <Option key={index} value={item.id}>{item.id}-{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="权限" name='permission' rules={[{ required: true }]} >
                                    <Select className="base-input-wrapper" placeholder="请选择用户角色">
                                        {dict_permissions.map((item, index) => (
                                            <Option key={index} value={item.key}>{item.key}-{item.value}</Option>
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
        requestSysRole().then(res => {
            that.setState({
                dict_sys_role: res.data,
            }, () => {
                //权限目录列表
                requestSysMenu().then(res => {
                    let menus = [];
                    let data = res.data;
                    for (let i = 0, len = data.length; i < len; i++) {
                        let item = data[i];
                        if (item.level !== 1) {
                            let obj = {
                                id: item.id,
                                name: item.name,
                            }
                            menus.push(obj);
                        }
                    }


                    that.setState({
                        dict_sys_menu: menus,
                    }, () => {
                        that.initTitle();
                    })
                })
            })
        })
    }

    initTitle() {
        let that = this;

        let { table_box, dict_permissions } = that.state;

        let table_title = [
            { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
            { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 200, },
            { title: '功能', dataIndex: 'menuName', key: 'menuName', width: 170, },
            {
                title: '权限', dataIndex: 'permission', key: 'permission', width: 240,
                render: (rowValue, row, index) => {
                    return (
                        <Select style={{ width: '100%' }} defaultValue={rowValue} placeholder="请选择用户角色">
                            {dict_permissions.map((item, index) => (
                                <Option key={index} value={item.key}>{item.key}-{item.value}</Option>
                            ))}
                        </Select>
                    )
                }
            },
            {
                title: '时间', dataIndex: 'time', key: 'time',
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <div>创建时间:{timeUtils.parseTime(row.createTime * 1000)}</div>
                            <div>更新时间:{timeUtils.parseTime(row.updateTime * 1000)}</div>
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
    refreshList() {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            // keywords:'服务端研发',
            // menuId: 14,
            page: table_box.table_pages,
        };
        //权限列表
        requestSysUserRolePermissions(obj)
            .then(res => {
                table_box.table_datas = res.data;
                table_box.table_pages = res.page;
                that.setState(
                    { table_box: table_box }
                )
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
        that.requestToCreateModify();
    }

    //申请修改编辑
    requestToCreateModify() {
console.log('snsns')
    }

    //表格分页监听
    onPageChange(page, pageSize) {
        let that = this;
        let { table_box } = that.state;
        table_box.table_pages.currentPage = page;
        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList();
        })
    }

    //删除角色权限信息
    onItemDeleteClick(item) {

    }

}