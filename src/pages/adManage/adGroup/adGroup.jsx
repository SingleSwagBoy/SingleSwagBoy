/*
 * @Author: HuangQS
 * @Date: 2021-10-26 11:18:31
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-27 16:03:05
 * @Description: 广告组策略
 */
import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, Radio, message, Switch } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { MySyncBtn, MyTagSelect } from '@/components/views.js';
import AdCreateModal from './adGroupCreateModal';
import AdChooseModal from './adGroupChooseModal';



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
            , dict_ad_type } = that.state;

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
                        <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索广告组名称" />
                        <RangePicker style={{ marginLeft: 5 }} style={{ width: '405px', marginLeft: 5 }} showTime placeholder={['上线时间', '下线时间']} />
                    </div>
                } />

                <Alert type="success" action={
                    <div className="alert-box">
                        <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索标签名称" />
                        <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索广告名称" />
                        <Input style={{ width: '200px', marginLeft: 5 }} placeholder="搜索广告内容" />
                    </div>
                } />


                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }} />

                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    width={1000}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >保存</Button>
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

                                <Form.Item label="广告组名称" name='name' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder="请输入广告组名称" />
                                </Form.Item>
                                <Form.Item label="标签">
                                </Form.Item>
                                <Form.Item label="广告内容">
                                    <Form.Item>
                                        内容个数 10个
                                    </Form.Item>
                                    <Form.Item>
                                        <Radio.Group className="base-input-wrapper" >
                                            {dict_ad_type.map((item, index) => {
                                                return <Radio value={item.key} key={index} onClick={(e) => { }}>
                                                    {item.value}(5条)
                                                </Radio>
                                            })}
                                        </Radio.Group>

                                        <MyTagSelect style={{ width: '100%' }} tags={[{ id: 1, name: "广告" }, { id: 2, name: "广告" }, { id: 3, name: "广告" }, { id: 4, name: "广告" }, { id: 5, name: "广告" }]}
                                            tag_select_id={3} show_create={true} btns={["挑选素材", "手动新增"]}
                                            onTagCreateClick={(key) => that.onTagSelectClick(key)}
                                            onSelectIdChange={(tag_select_id) => { console.log(`change--->${tag_select_id}`) }}
                                            onTabsDeleteClick={(index) => { console.log(`delete--->${index}`) }}
                                        />
                                    </Form.Item>
                                </Form.Item>
                            </div>
                        }
                    </Form>
                </Modal>
                <AdCreateModal onRef={(ref) => { that.setState({ modal_create_ad_ref: ref }) }} />
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
            { title: '上下线时间', dataIndex: 'time', key: 'time', width: 200, },
            { title: '下发量', dataIndex: 'xiafaliang', key: 'xiafaliang', width: 200, },
            { title: '排序', dataIndex: 'rank', key: 'rank', width: 200, },
            { title: '状态', dataIndex: 'status', key: 'status', width: 200, },
            { title: '备注', dataIndex: 'aa', key: 'aa', width: 200, },
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
        table_box.table_datas = [{}];

        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList();
        })
    }

    refreshList() {
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

}