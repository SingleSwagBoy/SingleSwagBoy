/*
 * @Author: HuangQS
 * @Date: 2021-10-12 11:47:32
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-12 20:33:16
 * @Description:
 *
 * 需求背景:
 * 规避政策上的监管，部分地域渠道产品线不支持播放功能
 * 需求目标:
 * 1、分地域分产品线分渠道停服
 * 2、停服地域，不支持任何播放功能
 * 3、保留我的、电视、菜单H5、相册功能
 * 4、H5支持下载安装应用
 */
import React, { Component } from 'react';
import { Input, InputNumber, Form, DatePicker, Button, Table, Modal, Alert, Select, message, Switch } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { MyAddress, MyMarketChannel, MySyncBtn } from '@/components/views.js';
import {
    getList,                        //获取列表数据
    addList,                        //添加列表数据
    updateList,                     //更新列表数据
    deleteConfig,                   //删除列表数据
    requestOperateApk,              //获取运营APK列表
} from 'api';

let { RangePicker } = DatePicker;
let { Option } = Select;

export default class offlineConfig extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            config_key: 'OFFLINE.CONFIG',

            //运营APK列表
            dict_apk: [],
            //菜单类型
            dict_menu_type: [
                // { key: 1, value: '3.0菜单栏H5' },
                { key: 2, value: '通知H5' },
                { key: 3, value: '进入应用H5' },
            ],

            //是否进入
            dict_into: [
                { key: 1, value: '进入' },
                { key: 2, value: '禁止进入' },
            ],

            //产品线
            dict_product_line: [
                { key: 'dsj2', value: '电视家2.0' },
                { key: 'dsj3', value: '电视家3.0' },
                { key: 'dsjr', value: '电视家尝鲜版' },
            ],
            //下载类型
            dict_download_type: [
                { key: 1, value: '手动下载' },
                { key: 2, value: '静默下载' },
            ],
            //状态
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],

            address: [],                //地域
            marketChannel: [],
            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
                key_code: '',
            },
        }
    }

    render() {
        let that = this;
        let { table_box, modal_box, config_key, address, marketChannel,
            dict_apk, dict_menu_type, dict_into, dict_product_line, dict_download_type, dict_status,

        } = that.state;

        return (
            <div>
                <Alert className="alert-box" message="配置列表" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick(config_key)} >新增配置</Button>
                        <MySyncBtn type={7} name='同步缓存' params={{ key: config_key }} />
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >保存</Button>
                    ]}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('indexId') &&
                                    <Form.Item label="id" name='indexId' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }
                                <Form.Item label="配置名称" name='name' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder="请输入排序位置" />
                                </Form.Item>
                                <Form.Item label="菜单类型" name='menuType' rules={[{ required: true }]}>
                                    <Select className="base-input-wrapper" showSearch placeholder='请选择菜单类型' onChange={(val) => {
                                        that.formRef.current.setFieldsValue({ 'menuType': val })
                                        that.forceUpdate();
                                    }}>
                                        {dict_menu_type.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                {
                                    that.formRef.current.getFieldValue('menuType') === 3 &&
                                    <Form.Item label="进入应用" name='into' rules={[{ required: true }]}>
                                        <Select className="base-input-wrapper" showSearch placeholder='请选择进入应用的类型'>
                                            {dict_into.map((item, index) => {
                                                return <Option key={index} value={item.key}>{item.value}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                }

                                <Form.Item label="上下线时间" name='time' rules={[{ required: true }]}>
                                    <RangePicker className="base-input-wrapper" showTime />
                                </Form.Item>

                                <Form.Item label="H5地址" name='h5Url' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder="请填写H5地址" />
                                </Form.Item>

                                <Form.Item label="产品线" name='productLine' rules={[{ required: true }]}>
                                    <Select className="base-input-wrapper" showSearch placeholder='请选择进产品线'>
                                        {dict_product_line.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="下载类型" name='downloadType' rules={[{ required: true }]}>
                                    <Select className="base-input-wrapper" showSearch placeholder='请选择下载类型'>
                                        {dict_download_type.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="运营APK" name='apkId' rules={[{ required: true }]}>
                                    <Select className="base-input-wrapper" showSearch placeholder='请选择下载类型'>
                                        {dict_apk.map((item, index) => {
                                            return <Option key={index} value={item.id}>{item.id}-{item.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                {/* 地域|渠道 */}
                                <Form.Item label="地域" name="area" rules={[{ required: true }]}>
                                    <MyAddress defaultAddress={address} onCheckAddress={that.onCheckAddress.bind(this)} />
                                </Form.Item>
                                <Form.Item label="渠道" name="cp" rules={[{ required: true }]}>
                                    <MyMarketChannel getMarketReturn={this.getMarketReturn.bind(this)} checkData={marketChannel} />
                                </Form.Item>


                                <Form.Item label="状态" name='status' rules={[{ required: true }]}>
                                    <Select className="base-input-wrapper" showSearch placeholder='请选择状态'>
                                        {dict_status.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
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
        let { table_box, config_key, dateFormat,
            dict_apk, dict_menu_type, dict_into, dict_product_line, dict_download_type, dict_status,
        } = that.state;

        //获取运营APK列表
        requestOperateApk({ page: { isPage: 9 } }).then(res => {
            that.setState({
                dict_apk: res.data,
            })
        })

        let table_title = [
            { title: '配置名称', dataIndex: 'name', key: 'name', width: 200, },
            {
                title: '菜单类型', dataIndex: 'menuType', key: 'menuType', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <Select defaultValue={rowValue} disabled style={{ width: '100%' }}>
                            {dict_menu_type.map((item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    );
                }
            },
            {
                title: '是否进入', dataIndex: 'into', key: 'into', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <Select defaultValue={rowValue} disabled style={{ width: '100%' }}>
                            {dict_into.map((item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    );
                }
            },
            {
                title: '配置时间', dataIndex: 'time', key: 'time',
                render: (rowValue, row, index) => {
                    let time = [moment(new Date(row.startTime)), moment(new Date(row.endTime)),]
                    return (
                        <RangePicker defaultValue={time} showTime format={dateFormat} disabled />
                    );
                }
            },
            {
                title: '状态', dataIndex: 'status', key: 'status', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <Select defaultValue={rowValue} disabled style={{ width: '100%' }}>
                            {dict_status.map((item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    );
                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 145,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => that.onItemEditClick(row)} style={{ marginLeft: 3 }}>编辑</Button>
                            <Button size='small' onClick={() => that.onItemDeleteClick(row)} style={{ marginLeft: 3 }}>删除</Button>
                        </div>
                    );
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
        let { table_box, config_key } = that.state;

        getList({ key: config_key }).then(res => {
            if (res.data.errCode == 0) {
                let data = res.data.data;

                if (data.length > 0) {
                    table_box.table_datas = [];

                    that.setState({
                        table_box: table_box,
                    }, () => {
                        //为数据添加标识
                        for (let i = 0, len = data.length; i < len; i++) {
                            let item = data[i];
                            item.key_code = config_key;
                        }

                        table_box.table_datas = data;

                        that.setState({
                            table_box: table_box,
                        }, () => {
                            that.forceUpdate();
                        })

                    })
                }
            }
        })

    }


    //新增按钮被点击
    onCreateClick(key_code) {
        let that = this;
        let modal_box = {
            is_show: true,
            title: '新增配置',
            key_code: key_code,
        };
        that.setState({
            modal_box: modal_box,
            address: [],
            marketChannel: [],
        }, () => {
            that.forceUpdate();
            that.formRef.current.resetFields();
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
        let key_code = modal_box.key_code;
        let value = that.formRef.current.getFieldsValue();
        //判断时间

        let time = value.time;
        try {
            value.startTime = time[0].valueOf();
            value.endTime = time[1].valueOf();
            delete value.time;
        } catch {
            message.error('请选择上下线时间')
            return;
        }

        //地域信息
        let area = that.state.address;
        if (!area) {
            message.error('请选择地域信息');
            return;
        } else {
            if (area.constructor === Array) {
                area = area.join(',');
            }
        }
        value.area = area;

        //渠道信息
        let marketChannel = that.state.marketChannel;
        if (!marketChannel) {
            message.error('请选择渠道信息');
            return;
        } else {
            if (marketChannel.constructor === Array) {
                marketChannel = marketChannel.join(',');
            }
            value.cp = marketChannel;
        }

        // console.log(value);
        // return;


        let id = value.indexId;

        (id ? updateList({ key: key_code, id: id }, value) : addList({ key: key_code }, value)).then(res => {
            if (res.data.errCode == 0) {
                modal_box.is_show = false;
                that.setState({
                    modal_box: modal_box,
                }, () => {
                    message.success('操作成功')
                    that.refreshList();
                })
            } else {
                message.error('删除失败');
            }

        })

    }



    //item编辑按钮被点击
    onItemEditClick(item) {
        let that = this;
        let key_code = item.key_code;

        that.setState({
            modal_box: {
                is_show: true,
                title: '修改配置',
                key_code: key_code,
            }
        }, () => {
            that.forceUpdate();

            //截止时间
            let obj = Object.assign({}, item)
            obj.time = [moment(new Date(item.startTime)), moment(new Date(item.endTime)),]

            //地域信息
            let area = item.area;
            if (area) {
                if (area.constructor === String) {
                    area = area.split(',');
                }
                that.setState({ address: area })
            } else {
                that.setState({ address: [] })
            }


            //渠道信息    
            let cp = item.cp;
            if (cp) {
                if (cp.constructor === String) {
                    cp = cp.split(',');
                }
                that.setState({ marketChannel: cp })
            } else {
                that.setState({ marketChannel: [] })
            }



            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(obj);
        })

        // data.time = [
        //     moment(data.startTime), moment(data.endTime)
        // ]
    }

    //item删除按钮被点击
    onItemDeleteClick(item) {
        let that = this;
        let key_code = item.key_code;

        deleteConfig({ key: key_code, id: item.indexId }, {}).then(res => {
            if (res.data.errCode == 0) {
                message.success("删除成功")
                that.refreshList();
            } else {
                message.error("删除失败")
            }
        })
    }

    //地域
    onCheckAddress(val) {
        let that = this;
        let postAddress = val.filter(item => item !== "all")
        let arr = []
        postAddress.forEach(r => {
            if (r.indexOf("-") !== -1) {
                arr.push(r.replace("-", ""))
            } else {
                arr.push(r)
            }
        })
        that.setState({
            address: arr
        });
    }

    //渠道
    getMarketReturn(val) {
        let that = this;
        that.state.marketChannel = val
        that.setState({
            marketChannel: val
        }, () => {
            that.formRef.current.setFieldsValue({ "cp": val })
        })
    }

}