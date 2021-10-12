/*
 * @Author: HuangQS
 * @Date: 2021-10-11 14:19:18
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-11 20:23:24
 * @Description: 短视频首屏配置
 */
import React, { Component } from 'react'
import { Input, InputNumber, Form, DatePicker, Button, Table, Modal, Alert, message, Switch } from 'antd';
import '@/style/base.css';
import moment from 'moment';
import {
    getList,        //获取列表数据
    addList,        //添加列表数据
    updateList,     //更新列表数据
    deleteConfig,   //删除列表数据
} from 'api';


import { MySyncBtn } from '@/components/views.js';


export default class svScreenConfig extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            config_key_guess_u_like: 'SV_OPERATION_GEUSS_U_LIKE',
            config_key_movie: 'SV_OPERATION_MOVIE',


            table_box: {
                table_title: [],
                table_datas_like: [],
                table_datas_movie: [],
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
        let { table_box, modal_box, config_key_guess_u_like, config_key_movie } = that.state;


        return (
            <div>
                <Alert className="alert-box" message="猜喜" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick(config_key_guess_u_like)} >新增配置</Button>
                        <MySyncBtn type={7} name='同步缓存' params={{ key: config_key_guess_u_like }} />
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas_like} pagination={false} scroll={{ x: 1500, y: '75vh' }} />

                <Alert className="alert-box" style={{ marginTop: 8 }} message="影视" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick(config_key_movie)} >新增配置</Button>
                        <MySyncBtn type={7} name='同步缓存' params={{ key: config_key_movie }} />
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas_movie} pagination={false} scroll={{ x: '80vw', y: '75vh' }} />

                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" onCancel={() => that.onModalCancelClick()}
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
                                <Form.Item label="排序位置" name='rank' rules={[{ required: true }]}>
                                    <InputNumber className="base-input-wrapper" placeholder="请输入排序位置" />
                                </Form.Item>
                                <Form.Item label="短视频ID" name='vid' rules={[{ required: true }]}>
                                    <InputNumber className="base-input-wrapper" placeholder="请输入短视频的ID" />
                                </Form.Item>
                                <Form.Item label="展示比例" name='showRate' rules={[{ required: true }]}>
                                    <InputNumber className="base-input-wrapper" placeholder="请输入展示比例如:0.45" />
                                </Form.Item>
                                <Form.Item label="过期时间" name='expiration' rules={[{ required: true }]}>
                                    <DatePicker className="base-input-wrapper" showTime />
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
        let { table_box, config_key_guess_u_like, config_key_movie } = that.state;


        let table_title = [
            // { title: 'id', dataIndex: 'indexId', key: 'indexId', width: 200, },
            { title: '排序位置', dataIndex: 'rank', key: 'rank', width: 200, },
            { title: '短视频ID', dataIndex: 'vid', key: 'vid', width: 200, },
            { title: '展示比例', dataIndex: 'showRate', key: 'showRate', width: 200, },
            {
                title: '过期时间', dataIndex: 'expiration', key: 'expiration',
                render: (rowValue, row, index) => {
                    let expiration = row.expiration
                    if (expiration) {
                        expiration = moment(new Date(expiration));
                    } else {
                        expiration = '';
                    }

                    return (
                        <div>
                            <DatePicker defaultValue={expiration} showTime disabled />
                        </div>
                    )
                }
            },
            {
                title: '状态', dataIndex: 'status', key: 'status',
                render: (rowValue, row, index) => {
                    let dataTime = row.expiration
                    if (dataTime) {
                        dataTime = moment(new Date(dataTime));
                    } else {
                        dataTime = 0;
                    }
                    let currTime = new Date().getTime();
                    let is_expire_time = currTime < dataTime;
                    return (
                        <Switch disabled checkedChildren="有效" unCheckedChildren="过期" defaultChecked={is_expire_time} />
                    )
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
        ];
        table_box.table_title = table_title;
        that.setState({
            table_box: table_box,
        }, () => {
            that.refreshList(config_key_guess_u_like);
            that.refreshList(config_key_movie);
        })
    }


    refreshList(code) {
        let that = this;
        let { table_box, config_key_guess_u_like, config_key_movie } = that.state;
        getList({ key: code }).then(res => {
            if (res.data.errCode == 0) {
                let data = res.data.data;

                if (data.length > 0) {

                    //like
                    if (code == config_key_guess_u_like) {
                        table_box.table_datas_like = [];
                    }
                    //move
                    else if (code == config_key_movie) {
                        table_box.table_datas_movie = [];
                    }

                    that.setState({
                        table_box: table_box,
                    }, () => {
                        //为数据添加标识
                        for (let i = 0, len = data.length; i < len; i++) {
                            let item = data[i];
                            item.key_code = code;
                        }

                        //like
                        if (code == config_key_guess_u_like) {
                            table_box.table_datas_like = data;
                        }
                        //move
                        else if (code == config_key_movie) {
                            table_box.table_datas_movie = data;
                        }
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



    onCreateClick(key_code) {
        let that = this;
        let modal_box = {
            is_show: true,
            title: '新增配置',
            key_code: key_code,
        };
        that.setState({
            modal_box: modal_box,
        }, () => {
            that.forceUpdate();
            that.formRef.current.resetFields();
        })
    }

    //item编辑按钮被点击
    onItemEditClick(item) {
        let key_code = item.key_code;
        let that = this;

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
            if (item.expiration) {
                obj.expiration = moment(new Date(item.expiration));
            } else {
                obj.expiration = '';
            }

            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(obj);
        })
    }
    onItemDeleteClick(item) {
        let that = this;
        let key_code = item.key_code;

        deleteConfig({ key: key_code, id: item.indexId }, {}).then(res => {
            if (res.data.errCode == 0) {
                message.success("删除成功")
                that.refreshList(key_code);
            } else {
                message.error("删除失败")
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
        })
    }

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
        let { modal_box } = that.state;
        let key_code = modal_box.key_code;

        let value = that.formRef.current.getFieldsValue();
        //判断时间
        if (value.expiration) {
            value.expiration = value.expiration.valueOf();
        } else {
            message.error('请选择输入截止日期')
            return;
        }

        console.log(value);
        let id = value.indexId;

        (id ? updateList({ key: key_code, id: id }, value) : addList({ key: key_code }, value)).then(res => {
            if (res.data.errCode == 0) {
                modal_box.is_show = false;
                that.setState({
                    modal_box: modal_box,
                }, () => {
                    message.success('操作成功')
                    that.refreshList(key_code);
                })
            } else {
                message.error('删除失败');
            }

        })






        // updateList()


        // let ref_tag_types = that.state.ref_tag_types;
        // let value = that.formRef.current.getFieldsValue();
        // let obj = Object.assign({}, value, ref_tag_types.loadData());
        // that.submitData(obj);
    }
}



// a -->
// [
//     {
//         "rank": 1,
//         "vid": 7055608,
//         "showRate": 0.4,
//         "expiration": 1632899932000
//     },
//     {
//         "rank": 2,
//         "vid": 7055575,
//         "showRate": 0.8,
//         "expiration": 3600
//     },{
//         "rank": 3,
//         "vid": 7055608,
//         "showRate": 0.4,
//         "expiration": 1632899932000
//     }
// ]


// b--> 
// [
//     {
//         "rank": 1,
//         "vid": 6699459,
//         "showRate": 0.4,
//         "expiration": 1632899932000
//     },
//     {
//         "rank": 2,
//         "vid": 6008429,
//         "showRate": 0.8,
//         "expiration": 3600
//     }
// ]