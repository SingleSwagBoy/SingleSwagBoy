/*
 * @Author: HuangQS
 * @Date: 2021-10-27 18:41:39
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-29 11:50:07
 * @Description: 
 */


import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, message } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { MySyncBtn } from '@/components/views.js';
import {
    requestNewAdTagList,                    //新版 获取用户标签列表
    requestNewAdTagCreate,                  //新版 创建用户标签数据
    requestNewAdTagUpdate,                  //新版 更新用户标签数据
    requestNewAdTagDelete,                  //新版 删除用户标签数据
    requestDictionary,                      //获取 字典集
    requestAdFieldList,                     //获取 Field列表

} from 'api';
import TagConfigFormulas from './tagConfigFormulas';

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
            //标签类型
            dict_tag_types: [
                { key: 1, value: '设备标签' },
                { key: 2, value: '用户标签' },
            ],
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],
            dict_field_list: [], //field列表
            //选择数据源
            dict_tag_index: [],
        }

    }
    render() {
        let that = this;
        let { table_box, modal_box, dict_tag_index, dict_field_list } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="配置列表" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={10} name='同步缓存' />
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={1500} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    style={{ top: 20 }}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >保存</Button>
                    ]}>

                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} ref={that.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }
                                {
                                    that.formRef.current.getFieldValue('code') &&
                                    <Form.Item label="标签编码" name='code' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }

                                <Form.Item label="标签名称" name='name' rules={[{ required: true }]} >
                                    <Input className="base-input-wrapper" placeholder="请输入标签名称" />
                                </Form.Item>
                                <Form.Item label="标签描述" name='description' rules={[{ required: true }]} >
                                    <Input className="base-input-wrapper" placeholder="请输入标签描述" />
                                </Form.Item>

                                <Form.Item label="标签规则" name='rule' rules={[{ required: true }]} >
                                    <TagConfigFormulas formRef={that.formRef} dict_field={dict_field_list} />
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

        let { table_box
            , dict_tag_types, dict_status, dict_tag_index
        } = that.state;


        let table_title = [
            { title: 'id', dataIndex: 'id', key: 'id', width: 80, },
            { title: '名称', dataIndex: 'name', key: 'name', },

            { title: '描述', dataIndex: 'description', key: 'description', width: 200, },
            {
                title: '状态', dataIndex: 'status', key: 'status', width: 100,
                render: (rowValue, row, indes) => {
                    return (
                        <Select value={rowValue} placeholder='标签状态' onChange={(e) => { that.onItemStatusChange(e, row) }}>
                            {dict_status.map((item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    )
                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 160,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => that.onItemEditClick(row)} style={{ marginLeft: 3 }}>编辑</Button>
                            <Button size='small' onClick={() => that.onItemDeleteClick(row)} style={{ marginLeft: 3 }}>删除</Button>
                            {/* <Button size='small' onClick={() => that.onItemQueryClick(row)} style={{ marginLeft: 3 }}>EsQuery</Button> */}
                        </div>
                    );
                }
            },
        ];

        table_box.table_title = table_title;

        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList();
        })

        //获取数据源类型字典
        requestDictionary({ type: 'tagIndex' }).then(res => {
            that.setState({
                dict_tag_index: res.data,
            })
        })

        //field集合
        requestAdFieldList({}).then(res => {
            that.setState({
                dict_field_list: res.data,
            }, () => {
                that.forceUpdate();
            })
        })

    }

    //刷新
    refreshList() {
        let that = this;
        let { table_box } = that.state;
        let obj = {
            currentPage: 1,
            pageSize: 999999,
        };

        requestNewAdTagList(obj).then(res => {
            // console.log('---------------')

            //             console.log(res)
            table_box.table_datas = res.data;

            that.setState({
                table_box: table_box,
            });
        })

    }

    //新增配置被点击
    onCreateClick() {
        let that = this;
        let modal_box = {
            is_show: true,
            title: '新增配置',
        };
        that.setState({
            modal_box: modal_box,
        }, () => {
            that.forceUpdate();
            that.formRef.current.resetFields();
        })
    }


    //item 编辑标签 被点击
    onItemEditClick(item) {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '修改配置',
            }
        }, () => {
            that.forceUpdate();
            let obj = Object.assign({}, item);

            console.log('show', item);

            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(obj);
        })
    }
    //item 编辑标签 被点击
    onItemDeleteClick(item) {
        let that = this;
        let obj = {
            id: item.id,
        };

        requestNewAdTagDelete(obj).then(res => {
            message.success('操作成功');
            that.refreshList();
        })

    }
    //item EsQuery 被点击
    onItemQueryClick() { }

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
    //item 状态变更
    onItemStatusChange(e, item) {
        let that = this;
        item.status = e;
        that.requestCreateOrUpdate(item);
    }

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
        let value = that.formRef.current.getFieldsValue();


        let obj = Object.assign({}, value);

        let rule = obj.rule;
        if (!rule) {
            message.error('请填写规则后提交。')
            return;
        }
        obj.rule = JSON.stringify(rule);

        // let id = obj.id;
        // (id ? requestNewAdTagUpdate(obj) : requestNewAdTagCreate(obj)).then(res => {
        //     modal_box.is_show = false;
        //     that.setState({
        //         modal_box: modal_box,
        //     }, () => {
        //         that.refreshList();
        //     })
        // })
        that.requestCreateOrUpdate(obj);
    }

    requestCreateOrUpdate(obj) {
        let that = this;
        let { modal_box } = that.state;

        let id = obj.id;
        (id ? requestNewAdTagUpdate(obj) : requestNewAdTagCreate(obj)).then(res => {
            modal_box.is_show = false;
            that.setState({
                modal_box: modal_box,
            }, () => {
                that.refreshList();
            })

        })
    }

}