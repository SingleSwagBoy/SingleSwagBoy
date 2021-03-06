/*
 * @Author: HuangQS
 * @Date: 2021-08-30 11:56:33
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-03 11:52:22
 * @Description: 微信支付模板消息
 */


import React, { Component } from 'react';
import { Button, Table, Switch, Input, Modal, Radio, message, Select, Alert, Form, DatePicker, InputNumber } from 'antd';
import { MyTagTypes, MySyncBtn, MyTimeInterval } from '@/components/views.js';
import '@/style/base.css';
import myTimeUtils from '@/utils/time.js';
import WxTemplateMsgContent from './wxTemplateMsgContent';

import moment from 'moment';
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
            //标签标签类型
            dict_alls: [
                { key: 1, value: '公众号全量' },
                { key: 2, value: '非全量' },
            ],
            //状态
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],
            //是否测试
            dict_tests: [
                // { key: 1, value: '测试' },
                { key: 2, value: '正式' },
            ],

            ref_tag_types: null,
            ref_time_interval: null,
            ref_template_content: null,

            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
            },
            //小程序类型
            dict_mini_types: [
                { key: 1, value: '跳转小程序' },
                { key: 2, value: '跳转到外链' },
            ],
            //模板类型 选择模板 1=支付模板，后续其他模板，需要不断的去添加
            tmpl_type: [
                { key: 1, value: '支付模板' },
                { key: 2, value: '预约模板' },
            ],

        }
    }
    render() {
        let that = this;
        let { table_box, modal_box
            , dict_tests, dict_mini_types, dict_status, dict_alls, dict_public_types, dict_wx_program, tmpl_type } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="微信模板消息" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={6} name={'同步缓存'} />
                    </div>
                } />

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1000, y: '75vh' }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >确定</Button>
                    ]}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef} key='form'>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }
                                {/* { title: '名称', dataIndex: 'name', key: 'name', width: 200, }, */}

                                <Form.Item label="名称" name='name' rules={[{ required: true }]} >
                                    <Input className="base-input-wrapper" />
                                </Form.Item>

                                <Form.Item label="状态" name='status' rules={[{ required: true }]} >
                                    {/* <Switch checkedChildren="有效" unCheckedChildren="无效" /> */}
                                    <Select placeholder='请选择状态' className="base-input-wrapper" >
                                        {dict_status.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="上下线时间" name='start_end_time' rules={[{ required: true }]} >
                                    <RangePicker className="base-input-wrapper" showTime format={'YYYY-MM-DD HH:mm:ss'} />
                                </Form.Item>
                                <Form.Item label="排序" name='sort' rules={[{ required: true }]} >
                                    <InputNumber min={0} />
                                </Form.Item>

                                <Form.Item label="模板类型" name='tmpl_type' >
                                    <Select className="base-input-wrapper">
                                        {tmpl_type.map((item, index) => (
                                            <Option value={item.key} key={index}>{item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="是否测试" name='test'>
                                    <Select className="base-input-wrapper" placeholder='请选择是否是测试数据' onChange={(val) => { that.forceUpdate() }}>
                                        {dict_tests.map((item, index) => (
                                            <Option value={item.key} key={index}>{item.key}-{item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {
                                    that.formRef.current.getFieldValue('test') === 1 &&
                                    <Form.Item label="测试用户" name='testUsers'>
                                        <TextArea className="base-input-wrapper" placeholder='请填写测试用户数据模板' autoSize={{ minRows: 4, maxRows: 8 }} />
                                    </Form.Item>
                                }

                                <Form.Item label="模板id" name='tmpl_id' >
                                    <TextArea className="base-input-wrapper" placeholder='请填写模板id' autoSize={{ minRows: 2, maxRows: 5 }} />
                                </Form.Item>

                                <Form.Item label="微信公众号" name='wx_code' >
                                    <Select className="base-input-wrapper" placeholder='请选择微信公众号'>
                                        {dict_public_types.map((item, index) => (
                                            <Option value={item.code} key={index}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="播放时间段" name='time_bucket' >
                                    <MyTimeInterval onRef={(ref) => that.setState({ ref_time_interval: ref })} />
                                </Form.Item>


                                <Form.Item label="编辑内容" name='data'>
                                    <WxTemplateMsgContent onRef={(ref) => that.setState({ ref_template_content: ref })} />
                                </Form.Item>

                                <Form.Item label="跳转类型" name='mini'>
                                    <Radio.Group className="base-input-wrapper" >
                                        {dict_mini_types.map((item, index) => {
                                            return <Radio value={item.key} key={index} onClick={(e) => { that.forceUpdate() }}>
                                                {item.value}
                                            </Radio>
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                                {
                                    //跳转类型为小程序类型
                                    that.formRef.current.getFieldValue('mini') === 1 &&
                                    <div>
                                        {/*mini_config  {\n    \"appid\": \"wx9e8718eb2360dfb8\",\n    \"pagepath\": \"pages/recharge/main?source=mb\"\n} */}
                                        <Form.Item label='小程序' name='appid'>
                                            <Select placeholder='请选择小程序' onChange={() => { that.forceUpdate() }} className="base-input-wrapper">
                                                {dict_wx_program.map((item, index) => (
                                                    <Option value={item.appid} key={index}>{item.appName}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label='跳转路径' name='pagepath'>
                                            <TextArea placeholder='输入跳转小程序页面，例:page/main' className="base-input-wrapper" autoSize={{ minRows: 2, maxRows: 3 }} />
                                        </Form.Item>
                                    </div>
                                }
                                {
                                    //跳转类型为外链类型
                                    that.formRef.current.getFieldValue('mini') === 2 &&
                                    <Form.Item label='跳转路径' name='jump'>
                                        <TextArea className="base-input-wrapper" placeholder='请输入http://开头的地址' />
                                    </Form.Item>
                                }
                                {/* 
                                <Form.Item label="发送人群" name='all'>
                                    <Radio.Group className="base-input-wrapper" onChange={() => { that.forceUpdate() }}>
                                        {dict_alls.map((item, index) => {
                                            return <Radio value={item.key} key={index} >
                                                {item.value}
                                            </Radio>
                                        })}
                                    </Radio.Group>
                                </Form.Item> */}
                            </div>
                        }
                    </Form>
                    <MyTagTypes tag_name='tag' desc={'未选择标签，则针对全部用户生效,只支持用户标签。'} onRef={(ref) => that.setState({ ref_tag_types: ref })} />
                </Modal >
            </div >

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
        let { table_box, dict_public_types, dict_status } = that.state;

        let table_title = [
            { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
            { title: '名称', dataIndex: 'name', key: 'name', width: 200, },
            { title: '排序', dataIndex: 'sort', key: 'sort', width: 80,},
            // { title: 'Title', dataIndex: 'Title', key: 'Title', width: 80, },
            {
                title: '微信公众号', dataIndex: 'wx_code', key: 'wx_code', width: 120,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Select disabled defaultValue={row.wx_code} style={{ width: '100%' }}>
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
                title: '上下线时间', dataIndex: 'time', key: 'time',width: 400,
                render: (rowValue, row, index) => {

                    let open_time = row.start_time ? row.start_time : "";
                    let stop_time = row.end_time ? row.end_time : "";
                    let time = [moment(new Date(open_time)), moment(new Date(stop_time))];
                    return (<RangePicker defaultValue={time} showTime disabled />)
                }
            },
            {
                title: '投放时间段', dataIndex: 'time_bucket', key: 'time_bucket', width: 200,
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
                title: '状态', dataIndex: 'status', key: 'status', width: 120,
                render: (rowValue, row, index) => {
                    // return (<Switch defaultChecked={row.status === 1 ? true : false} checkedChildren="是" unCheckedChildren="否" onChange={(checked) => that.onItemStatusChange(row, checked)} />)
                    return <Select defaultValue={rowValue} disabled placeholder='请选择状态'>
                        {dict_status.map((item, index) => {
                            return <Option key={index} value={item.key}>{item.value}</Option>
                        })}
                    </Select>

                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 240,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' style={{ marginLeft: 3 }} onClick={() => that.onItemCopyClick(row)}>复制</Button>
                            {/* <Button size='small' style={{ marginLeft: 3 }} onClick={() => that.onItemSendClick(row)}>发送</Button> */}
                            <Button size='small' style={{ marginLeft: 3 }} onClick={() => that.onItemEditClick(row)}>编辑</Button>
                            <Button size='small' style={{ marginLeft: 3 }} onClick={() => that.onItemDlelteClick(row)}>删除</Button>
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


        table_box.table_datas = [];
        that.setState({
            table_box: table_box,
        }, () => {
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

            let obj = {};
            obj.testUsers = "[{\n" +
                "    \"id\": 0,\n" +
                "    \"userId\": \"userid\",\n" +
                "    \"wxCode\": \"dianshijiang\",\n" +
                "    \"openid\": \"openid\",\n" +
                "    \"tag\": \"tag\",\n" +
                "    \"msg1\": \"\",\n" +
                "    \"msg2\": \"\",\n" +
                "    \"msg3\": \"\",\n" +
                "    \"msg4\": \"\"\n" +
                "}]";
            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(obj);

            setTimeout(() => {
                let ref_tag_types = that.state.ref_tag_types;
                if (ref_tag_types) ref_tag_types.pushData(obj);
            }, 10)

        })
    }

    //状态变化触发数据更新
    onItemStatusChange(row, checked) {
        console.log(checked);

        row.status = checked === true ? 1 : 2;
        let that = this;

        requestWxTemplateMsgConfigUpload(row)
            .then(res => {
                that.refreshList();
                message.success('更新成功');
            })
    }

    //复制按钮被点击
    onItemCopyClick(item) {
        let that = this;
        Modal.confirm({
            title: '复制',
            content: `确认复制【${item.name}】吗？`,
            onOk: () => {
                let obj = Object.assign({}, item);
                delete obj.id;

                obj.name = `${obj.name}_`

                requestWxTemplateMsgConfigCreate(obj)
                    .then(res => {
                        that.refreshList();
                        message.success('复制成功');
                    })
            }
        })
    }

    //发送按钮被点击
    onItemSendClick(item) {
        let that = this;
        Modal.confirm({
            title: '提示',
            content: '确认立即执行该配置的模版消息吗?',
            onOk: () => {
                let obj = {
                    id: item.id,
                }
                requestWxTemplateMsgConfigSend(obj)
                    .then(res => {
                        message.success('发送成功');
                        that.refreshList();
                    })
            }
        })
    }

    //编辑按钮被点击
    onItemEditClick(item) {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '编辑',
            }
        }, () => {
            that.forceUpdate();
            let obj = Object.assign({}, item);
            obj.start_end_time = [moment(obj.start_time), moment(obj.end_time)];

            //小程序配置
            let mini_config = obj.mini_config;
            if (mini_config) {
                mini_config = JSON.parse(mini_config);
                obj.appid = mini_config.appid ? mini_config.appid : '';
                obj.pagepath = mini_config.pagepath ? mini_config.pagepath : '';
            } else {
                obj.appid = "";
                obj.pagepath = "";
            }
            if (!obj.testUsers) {
                obj.testUsers = "[{\n" +
                    "    \"id\": 0,\n" +
                    "    \"userId\": \"userid\",\n" +
                    "    \"wxCode\": \"dianshijiang\",\n" +
                    "    \"openid\": \"openid\",\n" +
                    "    \"tag\": \"tag\",\n" +
                    "    \"msg1\": \"\",\n" +
                    "    \"msg2\": \"\",\n" +
                    "    \"msg3\": \"\",\n" +
                    "    \"msg4\": \"\"\n" +
                    "}]";
            }


            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(obj);

            setTimeout(() => {
                let ref_tag_types = that.state.ref_tag_types;
                ref_tag_types.pushData(obj);
            }, 10)
        })
    }

    //删除按钮被点击
    onItemDlelteClick(item) {
        let that = this;
        Modal.confirm({
            title: '删除',
            content: '确认删除此配置信息？',
            onOk: () => {
                let obj = {
                    id: item.id,
                };
                requestWxTemplateMsgConfigDelete(obj)
                    .then(res => {
                        message.success('删除成功');
                        that.refreshList();
                    })
                    .catch(res => {

                    })

            }
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
        let { ref_time_interval, ref_tag_types, ref_template_content } = that.state;

        let value = that.formRef.current.getFieldsValue();  //表格数据
        let data = Object.assign({}, value, ref_tag_types.loadData());  //用户标签-投放类型




        data.time_bucket = ref_time_interval.getData() == "-"?"":ref_time_interval.getData();     //播放时间段
        // return console.log(data.time_bucket,"data.time_bucket")
        let formData = ref_template_content.loadData();        //编辑内容
        if (formData) {
            formData = formData.replaceAll('\\n', '');
        }
        data.data = formData;


        //数据状态 不存在
        if (data.status === undefined) delete data.status;
        //数据状态转换
        else {
            if (data.status === true) data.status = 1;
            else if (data.status === false) data.status = 2;
        }
        //上下线时间
        let start_end_time = data.start_end_time;
        if (!start_end_time) {
            message.error('请选择输入上下线时间');
            return;
        } else {
            delete data.start_end_time;

            data.start_time = start_end_time[0].valueOf();
            data.end_time = start_end_time[1].valueOf();
        }

        //小程序配置
        let mini_config = {
            appid: data.appid,
            pagepath: data.pagepath,
        };
        data.mini_config = JSON.stringify(mini_config);

        let tag = data.tag;
        if (!tag) tag = '';
        //
        else if (tag.constructor === Array) {
            if (tag.length > 0) tag = tag.join(',');
            else tag = '';
        }
        data.tag = tag;


        let id = data.id;

        (id ? requestWxTemplateMsgConfigUpload(data) : requestWxTemplateMsgConfigCreate(data))
            .then(res => {

                that.setState({
                    modal_box: {
                        is_show: false,
                        title: '',
                    }
                }, () => {
                    message.success('操作成功');
                    that.refreshList();
                })
            });
    }


    //发送标签类型被点击
    onTagTypeRadioClick(key) {
        let that = this;
        that.formRef.current.setFieldsValue({ 'all': key });
        that.forceUpdate();
    }


}