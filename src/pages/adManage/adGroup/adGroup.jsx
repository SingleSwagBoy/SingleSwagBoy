/*
 * @Author: HuangQS
 * @Date: 2021-10-26 11:18:31
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-03 11:46:44
 * @Description: 广告组策略
 */
import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, Radio, Divider, Image, message, Switch } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { MySyncBtn, MyTagSelect, MyTagConfigFormulas } from '@/components/views.js';
import AdCreateModal from './adGroupCreateModal';
import AdChooseModal from './adGroupChooseModal';

import {
    requestNewAdTagList,                    //获取 标签列表
    requestAdFieldList,                     //获取 Field列表

    requestNewGroupCreate,                  //新建广告组
    requestNewGroupUpdate,                  //更新广告组
    requestNewGroupList,                    //获取广告组
    requestNewGroupDelete,                  //删除广告组
    requestNewGroupCopy,                    //复制广告组

} from 'api';

let { RangePicker } = DatePicker;
let { Option } = Select;


export default class adGroup extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            modal_choose_ad_ref: null,      //选择广告对话框
            modal_create_ad_ref: null,      //创建广告对话框

            dict_ad_type: [
                { key: 1, value: '右键运营位' },
                { key: 2, value: '屏显广告' },
            ],
            //标签列表
            dict_target_list: [],
            dict_field_list: [],

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
        let { table_box, modal_box
            , dict_ad_type, dict_target_list, dict_field_list } = that.state;

        return (
            <div>
                <Alert message="配置列表" type="success" action={
                    <div className="alert-box">
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增广告组</Button>
                        <MySyncBtn type={7} name='同步缓存' />
                    </div>
                } />
                <Alert type="success" action={
                    <div className="alert-box">
                        <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索广告组名称" onBlur={(e) => that.onSearchAdGroupNameBlur(e)} />
                        <RangePicker style={{ marginLeft: 5 }} style={{ width: '405px', marginLeft: 5 }} showTime placeholder={['上线时间', '下线时间']} onChange={(e) => that.onSearchAdGroupTimeChange(e)} />
                        <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索广告名称" onBlur={(e) => that.onSearchAdNameBlur(e)} />
                        {/* <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索标签名称" /> */}
                        {/* <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索广告内容" /> */}
                    </div>
                } />

                {/* <Alert type="success" action={
                    <div className="alert-box">
                     
                    </div>
                } /> */}


                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }} />

                <Modal visible={modal_box.is_show} title={modal_box.title} width={1500} style={{ top: 20 }} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >保存</Button>
                    ]}>

                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} ref={that.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }

                                <Form.Item label="广告组名称" name='name' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder="请输入广告组名称" />
                                </Form.Item>
                                <Form.Item label="广告组时间" name='time' rules={[{ required: true }]}>
                                    <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                                </Form.Item>
                                <Form.Item label="标签" rules={[{ required: true }]}>
                                    <Form.Item>
                                        <Select className="base-input-wrapper" showSearch placeholder="请选择标签"
                                            onChange={(e) => {
                                                let selectCode = e;
                                                if (!selectCode) return;
                                                //更新下方rule数据
                                                for (let i = 0, len = dict_target_list.length; i < len; i++) {
                                                    let item = dict_target_list[i];
                                                    if (item.code === selectCode) {
                                                        console.log('rule', item);
                                                        that.formRef.current.setFieldsValue({ 'rule': item.rule })
                                                        break;
                                                    }
                                                }
                                                that.forceUpdate();
                                            }}
                                            onClear={() => {
                                                that.formRef.current.setFieldsValue({ 'rule': [] })
                                                that.forceUpdate();
                                            }}
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
                                            {dict_target_list.map((item, index) => (
                                                <Option value={item.code.toString()} key={item.code}>{item.code}-{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        如需要新增管理标签配置，请点击[<a onClick={() => that.onTagConfigClick()}>标签配置</a>]跳转到配置页中完成规则。
                                    </Form.Item>

                                    {
                                        that.formRef.current.getFieldValue('rule') &&
                                        <Form.Item name='rule' >
                                            <MyTagConfigFormulas formRef={that.formRef} dict_field={dict_field_list} is_show_only={true} />
                                        </Form.Item>
                                    }


                                </Form.Item>



                                {/* <div style={{ border: '1px dashed #9b709e' }}> */}
                                <div>
                                    <Divider>广告详情</Divider>
                                    <Form.Item label="广告类型" >
                                        <Radio.Group className="base-input-wrapper" >
                                            {dict_ad_type.map((item, index) => {
                                                return (
                                                    <Radio value={item.key} key={index} onClick={(e) => { }}>
                                                        {item.value}(5条)
                                                    </Radio>
                                                )
                                            })}
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item label="广告列表">
                                        <MyTagSelect style={{ width: '100%' }} tags={[{ id: 1, name: "广告" }, { id: 2, name: "广告" }, { id: 3, name: "广告" }, { id: 4, name: "广告" }, { id: 5, name: "广告" }]}
                                            tag_select_id={3} show_create={true} btns={["挑选素材", "手动新增"]}
                                            onTagCreateClick={(key) => that.onTagSelectClick(key)}
                                            onSelectIdChange={(tag_select_id) => that.onTagSelectChange(tag_select_id)}
                                            onTabsDeleteClick={(index) => { console.log(`delete--->${index}`) }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="广告类型">
                                    </Form.Item>
                                    <Form.Item label="广告名称">
                                        <Input className="base-input-wrapper" placeholder="这里是广告名称" disabled />
                                    </Form.Item>
                                    <Form.Item label="广告时间">
                                        <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} disabled />
                                    </Form.Item>

                                    <Form.Item label="缩略图">
                                        <Image width={100} />
                                    </Form.Item>
                                    <Form.Item label="背景图">
                                        <Image width={100} />
                                    </Form.Item>
                                </div>
                            </div>
                        }
                    </Form>
                </Modal>
                {/* 广告创建 */}
                <AdCreateModal onRef={(ref) => { that.setState({ modal_create_ad_ref: ref }) }} />
                {/* 广告选择 */}
                <AdChooseModal onRef={(ref) => { that.setState({ modal_choose_ad_ref: ref }) }} />

            </div>
        );
    }


    componentDidMount() {
        let that = this;
        that.initData();
    }

    initData() {
        let that = this;
        let { table_box } = that.state;
        let table_title = [
            { title: '广告组名称', dataIndex: 'name', key: 'name', width: 200, },
            { title: '标签', dataIndex: 'tag', key: 'tag', width: 200, },
            {
                title: '上下线时间', dataIndex: 'time', key: 'time',
                render: (rowValue, row, index) => {
                    let open_time = (!row.onlineTime || row.onlineTime === 0) ? '' : row.onlineTime;
                    let stop_time = (!row.offlineTime || row.offlineTime === 0) ? '' : row.offlineTime;
                    let format = "YYYY-MM-DD HH:mm:ss";

                    let time = '';

                    if (open_time) time += moment(new Date(open_time).format(format));
                    else time += '未配置'

                    time += ' - ';

                    if (stop_time) time += moment(new Date(open_time).format(format));
                    else time += '未配置'
                    
                    return time;
                }
            },
            { title: '下发量', dataIndex: 'dealtNum', key: 'dealtNum', width: 200, },
            {
                title: '状态', dataIndex: 'status', key: 'status', width: 200,
                render: (rowValue, row, index) => {
                    // 1、有效,2、无效
                    if (rowValue == '1') return '有效';
                    if (rowValue == '2') return '无效';
                    return '';
                }
            },
            { title: '备注', dataIndex: 'remark', key: 'remark', width: 200, },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 210,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small'>复制</Button>
                            <Button size='small' style={{ marginLeft: 5 }}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 5 }}>删除</Button>
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
        });


        //获取标签信息
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            that.setState({
                dict_target_list: res.data,
            });
        })

        //标签数据类型信息
        requestAdFieldList({}).then(res => {
            that.setState({
                dict_field_list: res.data,
            })
        })
    }


    //搜索广告组名称
    onSearchAdGroupNameBlur(item) {
        let that = this;
        let search_name = item.target.value;
        console.log('名称过滤', search_name);
        that.refreshList();
    }
    //搜索广告时间范围
    onSearchAdGroupTimeChange(item) {
        let that = this;
        let start_time = item[0].valueOf();
        let endt_time = item[1].valueOf();
        console.log('时间过滤', start_time, endt_time);
        that.refreshList();
    }
    //搜索广告组名称
    onSearchAdNameBlur(item) {
        let that = this;
        let search_name = item.target.value;
        console.log('名称过滤', search_name);
        that.refreshList();
    }

    refreshList() {
        let that = this;
        let { table_box } = that.state;

        requestNewGroupList().then(res => {
            console.log('group_list', res.data);

            table_box.table_datas = res.data;
            that.setState({
                table_box: table_box,
            });
        })
    }

    onCreateClick() {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '新增广告组',
            }
        }, () => {
            that.forceUpdate();
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

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
        let { modal_box } = that.state;
        let value = that.formRef.current.getFieldsValue();

    }


    //标签选择被点击
    onTagSelectClick(key) {
        let that = this;

        if (key === '挑选素材') {
            let { modal_choose_ad_ref } = that.state;
            let obj = {
                title: key,
            }
            modal_choose_ad_ref.showModal(obj);

        }
        //
        else if (key === '手动新增') {
            let { modal_create_ad_ref } = that.state;
            let obj = {
                title: key,
            }
            modal_create_ad_ref.showModal(obj);
        }
    }

    //标签选择器 标签变更
    onTagSelectChange(tag_select_id) {

    }

    //标签配置页被点击
    onTagConfigClick() {
        let that = this;
        // that.forceUpdate();

        Modal.confirm({
            title: '跳转',
            content: '你将要跳转到标签配置页，未保存的数据将不会存储到云端，是否立即跳转？',
            onOk: () => {

            }
        })
    }
}