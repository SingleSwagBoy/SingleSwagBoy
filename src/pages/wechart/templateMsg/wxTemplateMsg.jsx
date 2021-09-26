/*
 * @Author: HuangQS
 * @Date: 2021-08-30 11:56:33
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-26 17:39:50
 * @Description: 微信支付模板消息
 */


import React, { Component } from 'react';
import { Menu, Button, Table, Switch, Input, Upload, Radio, message, Select, Alert, Modal, Form, DatePicker } from 'antd';
import { MyTagTypes, MySyncBtn, MyTimeInterval } from '@/components/views.js';
import '@/style/base.css';
import myTimeUtils from '@/utils/time.js';

import {
    requestWxReplyTypes,                                        //获取回复公众号的类型
    requestWxProgramList,                                       //获取微信小程序列表

    requestWxTemplateMsgConfigList,                             //微信模板消息 列表
    requestWxTemplateMsgConfigCreate,                           //微信模板消息 添加
    requestWxTemplateMsgConfigUpload,                           //微信模板消息 修改
    requestWxTemplateMsgConfigDelete,                           //微信模板消息 删除
    requestWxTemplateMsgConfigSend,                             //微信模板消息 测试发送
} from 'api';


let { Option } = Select;
let { RangePicker } = DatePicker;
let { TextArea } = Input;

export default class WxPayTemplate extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            dict_wx_program: [],    //字典 微信小程序列表
            dict_public_types: [],  //字典 微信公众号回复类型

            ref_tag_types: null,
            ref_time_interval: null,

            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
            },
            //小程序类型
            mini_types: [
                { key: '1', value: '跳转小程序' },
                { key: '2', value: '跳转到外链' },
            ],
            //模板类型 选择模板 1=支付模板，后续其他模板，需要不断的去添加
            tmpl_type: [
                { key: '1', value: '支付模板' },
            ]
        }
    }
    render() {
        let that = this;
        let { table_box, modal_box, mini_types
            , dict_public_types, dict_wx_program, tmpl_type } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="微信模板消息" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={6} name={'同步缓存'} />
                    </div>
                } />

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1000, y: '75vh' }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" onCancel={() => that.onModalCancelClick()}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >确定</Button>
                    ]}
                >
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('Id') &&
                                    <Form.Item label="id" name='Id' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }

                                <Form.Item label="状态" name='status' valuePropName='checked'>
                                    <Switch checkedChildren="有效" unCheckedChildren="无效" />
                                </Form.Item>

                                <Form.Item label="上下线时间">
                                    <RangePicker className="base-input-wrapper" showTime />
                                </Form.Item>

                                <Form.Item label="模板类型" name='TmplType' >
                                    <Select className="base-input-wrapper">
                                        {tmpl_type.map((item, index) => (
                                            <Option value={item.key} key={index}>{item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="模板id" name='TmplId' >
                                    <TextArea className="base-input-wrapper" autoSize={{ minRows: 2, maxRows: 5 }} />
                                </Form.Item>


                                <Form.Item label="播放时间段" name='TimeBucket' >
                                    <MyTimeInterval onRef={(ref) => that.setState({ ref_time_interval: ref })} />
                                </Form.Item>

                                <Form.Item label="微信公众号" name='WxCode' >
                                    <Select className="base-input-wrapper">
                                        {dict_public_types.map((item, index) => (
                                            <Option value={item.code} key={index}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="编辑内容">
                                    <TextArea className="base-input-wrapper" autoSize={{ minRows: 5, maxRows: 5 }} placeholder='请输入待编辑内容' />
                                </Form.Item>

                                <Form.Item label="跳转人群" >
                                    <Form.Item name='Mini'>
                                        <Radio.Group className="base-input-wrapper" >
                                            {mini_types.map((item, index) => {
                                                return <Radio value={item.key} key={index} onClick={(e) => that.onRadioClick(item.key)}>
                                                    {item.value}
                                                </Radio>
                                            })}
                                        </Radio.Group>
                                    </Form.Item>

                                    {
                                        //跳转类型为小程序类型
                                        that.formRef.current.getFieldValue('Mini') === '1' &&
                                        <div>
                                            <Form.Item className="base-input-wrapper" label='小程序'>
                                                <Select placeholder='请选择小程序' onChange={() => { that.forceUpdate() }}>
                                                    {dict_wx_program.map((item, index) => (
                                                        <Option value={item.appid} key={index}>{item.appName}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item className="base-input-wrapper" label='跳转路径'>
                                                <TextArea placeholder='输入跳转小程序页面，例:page/main' autoSize={{ minRows: 2, maxRows: 3 }} />
                                            </Form.Item>
                                            <Form.Item className="base-input-wrapper" label='备用地址'>
                                                <TextArea placeholder='不支持跳转的小程序将跳转到此' autoSize={{ minRows: 2, maxRows: 3 }} />
                                            </Form.Item>
                                        </div>
                                    }
                                    {
                                        //跳转类型为外链类型
                                        that.formRef.current.getFieldValue('Mini') === '2' &&
                                        <Form.Item >
                                            <TextArea className="base-input-wrapper" placeholder='请输入http://开头的地址' />
                                        </Form.Item>
                                    }
                                </Form.Item>

                            </div>
                        }
                    </Form>

                    {/* 标签类型 */}
                    <MyTagTypes tag_type='type' tag_name='tag' delivery_name='delivery' onRef={(ref) => that.setState({ ref_tag_types: ref })} />



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

        // requestWxProgramList

        // Promise.all([requestWxReplyTypes, requestWxProgramList])

        requestWxReplyTypes().then(res => {
            let types = res.data;

            that.setState({
                dict_public_types: types,
            }, () => {
                requestWxProgramList().then(res => {
                    that.setState({
                        dict_wx_program: res.data
                    }, () => {
                        that.initTitle();
                    })
                })
            });
        })

    }

    initTitle() {
        let that = this;
        let { table_box, dict_public_types } = that.state;

        let table_title = [
            { title: 'id', dataIndex: 'Id', key: '_id', width: 80, },
            { title: '名称', dataIndex: 'Name', key: 'Name', width: 80, },
            // { title: 'Title', dataIndex: 'Title', key: 'Title', width: 80, },
            {
                title: '微信公众号', dataIndex: 'WxCode', key: 'WxCode', width: 120,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Select disabled defaultValue={row.WxCode} style={{ width: '100%' }}>
                                {dict_public_types.map((item, index) => (
                                    <Option value={item.code} key={index}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    )
                }
            },
            // { title: '模板Id', dataIndex: 'TmplId', key: 'TmplId', width: 80, },
            // { title: '跳转地址', dataIndex: 'Jump', key: 'Jump', width: 80, },
            {
                title: '上下线时间', dataIndex: 'Time', key: 'Time', width: 350,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            {/* <div>{row.StartTime} -{row.EndTime}</div> */}
                            <div>{myTimeUtils.parseTime(row.StartTime)} -- {myTimeUtils.parseTime(row.EndTime)}</div>
                        </div>
                    )
                }
            },
            {
                title: '投放时间段', dataIndex: 'TimeBucket', key: 'TimeBucket', width: 200,
                render: (rowValue, row, index) => {
                    let time_array = [];
                    if (rowValue) {
                        time_array = rowValue.split(',');
                    }
                    return (
                        <div>
                            {
                                time_array.map((item, index) => {
                                    return <div key={index} >{item}</div>
                                })}
                        </div>
                    );
                }
            },
            {
                title: '状态', dataIndex: 'Status', key: 'Status', width: 80,
                render: (rowValue, row, index) => {
                    return (<Switch defaultChecked={row.Status === 1 ? true : false} checkedChildren="是" unCheckedChildren="否" />)
                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' style={{ marginLeft: 3 }}>复制</Button>
                            <Button size='small' style={{ marginLeft: 3 }}>发送</Button>
                            <Button size='small' style={{ marginLeft: 3 }} onClick={() => that.onItemEditClick(row)}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 3 }}>删除</Button>
                        </div>
                    )
                }
            },
        ]


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
            page: {
                currentPage: 1,
                pageSize: 999999,
            }
        };
        requestWxTemplateMsgConfigList(obj)
            .then(res => {
                console.log(res.data);

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
                title: '新增',
            }
        }, () => {
            that.forceUpdate();
            that.formRef.current.resetFields();

            setTimeout(() => {
                let ref_tag_types = that.state.ref_tag_types;
                if (ref_tag_types) ref_tag_types.pushData({});
            }, 10)

        })
    }

    //编辑按钮被点击
    onItemEditClick(item) {
        // console.log(item);
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '编辑',
            }
        }, () => {
            console.log(item);
            that.forceUpdate();
            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(item);

            let obj = Object.assign({}, item);
            setTimeout(() => {
                let ref_tag_types = that.state.ref_tag_types;
                ref_tag_types.pushData(obj);
            }, 10)
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
        });
    }

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
        let { ref_time_interval, ref_tag_types } = that.state;

        let value = that.formRef.current.getFieldsValue();  //表格数据
        let data = Object.assign({}, value, ref_tag_types.loadData());  //用户标签-投放类型

        data.time_bucket = ref_time_interval.getData();

        //数据状态 不存在
        if (data.status === undefined) delete data.status;
        //数据状态转换
        else {

        }


        console.log(data);
    }


    //跳转人群选项被点击
    onRadioClick() {
        let that = this;
        that.forceUpdate();
    }


}