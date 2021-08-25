/*
 * @Description: 
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-08-25 11:58:04
 */
import React, { Component } from 'react';
import { Menu, Button, Table, Switch, message, Select, Alert, Tooltip, Form, Checkbox } from 'antd';
import {
    requestDictStatus,                  //字典 状态
    requestWxReply,                     //获取微信关键字回复
    requestWxPublicTypes,               //获取回复公众号的类型
    getUserTag,                         //用户设备标签


} from 'api'
let { Option } = Select;


export default class WxReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_select_code: '',
            menu_public_type_select_code: '',       //微信公众号回复类型
            menu_reply_obj_type_select_code: '',    //回复对象类型

            menu_list: [
                { index: "1", code: "keywords", name: '关键字回复' },
                { index: "2", code: "messageDefault", name: '收到消息回复' },
                { index: "3", code: "addFriend", name: '被关注回复' },
                { index: "4", code: "scanSubscribe", name: '扫码关注回复' },
                { index: "5", code: "scan", name: '已登陆扫码回复' },
                { index: "6", code: "other", name: '其他扫码回复' },
            ],
            dict_rule_type: [
                { key: 1, value: '全匹配' },
                { key: 2, value: '半匹配' },
            ],
            //回复类型
            dict_msg_type: [
                { key: 'text', value: '文字' },
                { key: 'image', value: '图片' },
                { key: 'news', value: '图文' },
                { key: 'mini', value: '小程序卡片' },
            ],
            dict_reply_obj_type: [
                { code: "1", name: "老用户" },
                { code: "2", name: "新用户" },
            ],
            dict_user_tags: [],                      //字典 用户标签
            dict_public_types: [],                  //字典 微信公众号回复类型
            dict_status: [],                        //字典 状态类型
            table_box: {
                table_title: [],
                table_datas: [],
                table_pages: {
                    currentPage: 0,
                    pageSize: 0,
                    totalCount: 0,
                },
            },
            request_box: {
                code: '',
                notCode: '',
            },
        }

    }


    render() {
        let { table_box, menu_select_code, menu_list, dict_public_types, menu_public_type_select_code, menu_reply_obj_type_select_code,
            dict_reply_obj_type, dict_msg_type, dict_user_tags } = this.state;

        return (
            <div>
                <Tooltip title='回复类型' placement="left" color={'purple'}>
                    <Menu onClick={(item) => this.onMenuClick(item)} selectedKeys={[menu_select_code]} mode="horizontal">
                        {
                            menu_list.map((item, index) => {
                                return <Menu.Item key={item.code}> {item.name}</Menu.Item>
                            })
                        }
                    </Menu>
                </Tooltip>

                {/* ===================== 关键字回复|其他扫码回复 ===================== */}
                {
                    //
                    (menu_select_code === 'keywords' || menu_select_code === 'other') &&
                    <div>
                        <Alert className="alert-box" message="详情列表" type="success" action={
                            <div>
                                <Tooltip title='新增数据' placement='top'>
                                    <Button type="primary" style={{ 'marginLeft': '10px' }} >新增</Button>
                                </Tooltip>

                            </div>
                        }>
                        </Alert>

                        <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1200 }} />
                    </div>
                }
                {/* ===================== 回复公众号 ===================== */}
                {
                    //收到消息回复
                    (menu_select_code === 'messageDefault' || menu_select_code === 'addFriend' || menu_select_code === 'scanSubscribe' || menu_select_code === 'scan') &&
                    <div>
                        <Tooltip title='回复公众号类型' placement="left" color={'purple'}>
                            <Menu onClick={(item) => this.onMenuPublicTypeClick(item)} selectedKeys={[menu_public_type_select_code]} mode="horizontal">
                                {
                                    dict_public_types.map((item, index) => {
                                        return <Menu.Item key={item.code}> {item.name}</Menu.Item>
                                    })
                                }
                            </Menu>
                        </Tooltip>
                    </div>
                }
                {/* ===================== 回复对象 ===================== */}
                {
                    (menu_select_code === 'addFriend' || menu_select_code === 'scanSubscribe' || menu_select_code === 'scan') &&
                    <div>
                        <Tooltip title='回复对象类型' placement="left" color={'purple'}>
                            <Menu onClick={(item) => this.onMenuReplyObjTypeClick(item)} selectedKeys={[menu_reply_obj_type_select_code]} mode="horizontal">
                                {
                                    dict_reply_obj_type.map((item, index) => {
                                        return <Menu.Item key={item.code}> {item.name}</Menu.Item>
                                    })
                                }
                            </Menu>
                        </Tooltip>

                    </div>
                }
                {/* ===================== 文字回复|图文回复|图片回复 ===================== */}
                {
                    (menu_select_code === 'messageDefault' || menu_select_code === 'addFriend' || menu_select_code === 'scanSubscribe' || menu_select_code === 'scan') &&
                    <div>

                        <Form style={{marginTop:10}}>
                            <Form.Item label="用户标签" >
                                <Select style={{ width: 200 }} mode="multiple" allowClear>
                                    {dict_user_tags.map((item, index) => (
                                        <Option value={item.code} key={item.code}> {item.code}- {item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="消息类型" >
                                {dict_msg_type.map((item, index) => (
                                    <Checkbox value={item.key} key={item.key}>  {item.value}</Checkbox>
                                ))}
                            </Form.Item>
                        </Form>

                        <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1200 }} />

                    </div>




                }

            </div>
        )

    }

    componentDidMount() {
        let that = this;
        that.initData();
    }
    initData() {
        let that = this;

        //用户标签
        getUserTag().then(res => {
            that.setState({ dict_user_tags: res.data.data });
            //状态字典
            requestDictStatus().then(res => {
                that.setState({ dict_status: res, })
                //获取回复公众号类型
                requestWxPublicTypes().then(res => {
                    let types = res.data;
                    if (types) {
                        that.setState({
                            dict_public_types: types
                        }, () => {
                            //渲染menu
                            let code = that.state.menu_list[0].code;
                            that.refreshTableTitleByMenuCode(code);
                        })

                    }
                })
            })
        })
    }


    //目录被点击 目录切换
    onMenuClick(item) {
        let that = this;
        let curr_code = item.key;

        let last_code = that.state.menu_select_code;
        if (last_code === curr_code) return;


        that.refreshTableTitleByMenuCode(curr_code);
    };
    //微信公众号回复类型
    onMenuPublicTypeClick(item) {
        let that = this;
        let curr_code = item.key;
        let last_code = that.state.menu_public_type_select_code;
        if (last_code === curr_code) return;

        that.setState({
            menu_public_type_select_code: curr_code
        }, () => {
            that.requestList();
        })
    }
    onMenuReplyObjTypeClick(item) {
        let that = this;
        let curr_code = item.key;
        let last_code = that.state.menu_reply_obj_type_select_code;
        if (last_code === curr_code) return;

        that.setState({
            menu_reply_obj_type_select_code: curr_code
        }, () => {
            that.requestList();
        })
    }

    //根据MenuCode更新Table的Title
    refreshTableTitleByMenuCode(code) {
        let that = this;
        that.setState({ menu_select_code: code, });

        let table_box = that.state.table_box;
        let table_title = [];
        let request_box = {};
        let dict_public_types = that.state.dict_public_types;
        let dict_reply_obj_type = that.state.dict_reply_obj_type;
        let dict_rule_type = that.state.dict_rule_type;
        let dict_msg_type = that.state.dict_msg_type;
        let menu_public_type_select_code = '';
        let menu_reply_obj_type_select_code = '';

        //关键字回复
        if (code === 'keywords' || code === 'other') {
            menu_public_type_select_code = '';
            menu_reply_obj_type_select_code = '';
            if (code === 'keywords') {
                request_box = { code: code }
            }
            //other类型 特殊处理 根据老CMS的接口设计 貌似这里需要传递'abc'类型的字符串 需要带上冒号
            else {
                let code_array = [];
                let items = that.state.menu_list;
                for (let i = 0, len = items.length; i < len; i++) {
                    let item = items[i];
                    code_array.push(`'${item.code}'`)
                }
                let codes = code_array.join(',');
                request_box = { notCode: codes }
            }


            table_title.push({ title: 'id', dataIndex: 'id', key: 'id', width: 100, });
            table_title.push({
                title: '回复公众号', dataIndex: 'wxCode', key: 'wxCode', width: 140,
                render: (rowValue, row, index) => {
                    let array = [];
                    if (row.wxCode && row.wxCode.constructor === String) {
                        array = row.wxCode.split(',')
                    }

                    return (
                        <Select defaultValue={array} style={{ width: '100%' }} mode="multiple" allowClear>
                            {dict_public_types.map((item, index) => (
                                <Option value={item.code}>{item.name}</Option>
                            ))}
                        </Select>
                    )
                }
            });

            table_title.push({
                title: '回复类型', dataIndex: 'msgType', key: 'msgType', width: 140,
                render: (rowValue, row, index) => {
                    return (
                        <Select defaultValue={row.msgType} style={{ width: '100%' }} >
                            {dict_msg_type.map((item, index) => (
                                <Option value={item.key}>{item.value}</Option>
                            ))}
                        </Select>
                    )
                }
            });
            table_title.push({
                title: '状态', dataIndex: 'status', key: 'status', width: 100,
                render: (rowValue, row, index) => {
                    return (
                        <Switch defaultChecked={row.status === 1 ? true : false} checkedChildren="有效" unCheckedChildren="无效"
                            onChange={(type) => this.onItemStatusChanged(type, row)} />
                    )
                }
            });
            if (code === 'keywords') {
                table_title.push({ title: '规则', dataIndex: 'ruleName', key: 'ruleName', width: 100, });
                table_title.push({
                    title: '匹配规则', dataIndex: 'ruleType', key: 'ruleType', width: 140,
                    render: (rowValue, row, index) => {
                        let array = [];
                        if (row.wxCode && row.wxCode.constructor === String) {
                            array = row.wxCode.split(',')
                        }
                        return (
                            <Select defaultValue={parseInt(row.ruleType)} style={{ width: '100%' }} >
                                {dict_rule_type.map((item, index) => (
                                    <Option value={item.key} key={item.key}>{item.value}</Option>
                                ))}
                            </Select>
                        )
                    }
                });
                table_title.push({ title: '关键字', dataIndex: 'keywords', key: 'keywords', width: 100, });
            }
            //
            else {
                table_title.push({ title: '名称', dataIndex: 'name', key: 'name', width: 100, });
                table_title.push({ title: '编码', dataIndex: 'code', key: 'code', width: 100, });
            }



            table_title.push({
                title: '操作', dataIndex: 'action', key: 'action', width: 100, fixed: 'right',
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            {/* <Button>复制</Button> */}
                            <Button size='small' type='primary' type='link'>编辑</Button>
                            <Button size='small' type='primary' type='link'>删除</Button>
                        </div>
                    )
                }

            });

        }
        //其他类型
        else {
            menu_public_type_select_code = dict_public_types[0].code;
            //收到消息回复 不需要第三层
            if (code === 'messageDefault') {
                menu_reply_obj_type_select_code = '';
            } else {
                menu_reply_obj_type_select_code = dict_reply_obj_type[0].code;
            }

            //其他类型的貌似都需要单独name
            let menu_list = that.state.menu_list;
            let name = '';
            for (let i = 0, len = menu_list.length; i < len; i++) {
                let item = menu_list[i];
                if (code === item.code) {
                    name = item.name;
                    break;
                }
            }
            request_box = { code: code, name: name }
        }

        table_box.table_title = table_title;

        that.setState({
            table_box: table_box,
            request_box: request_box,
            menu_public_type_select_code: menu_public_type_select_code,
            menu_reply_obj_type_select_code: menu_reply_obj_type_select_code,
        }, () => {
            that.requestList();
        });


    }

    //item状态变更
    onItemStatusChanged(type, row) {
        let that = this;
        let obj = Object.assign({}, row);
        obj.status = type ? 1 : 2;
    }
    //获取数据列表
    requestList() {
        let that = this;
        let table_box = that.state.table_box;
        let request_box = that.state.request_box;

        let obj = {};
        if (request_box.code) obj.code = request_box.code;
        if (request_box.notCode) obj.notCode = request_box.notCode;
        if (request_box.name) obj.name = request_box.name;

        //微信公众号回复类型
        let menu_public_type_select_code = that.state.menu_public_type_select_code;
        if (menu_public_type_select_code) obj.wxCode = menu_public_type_select_code;
        obj.page = { currentPage: 1, pageSize: 9999 };
        //回复对象类型
        let menu_reply_obj_type_select_code = that.state.menu_reply_obj_type_select_code;
        if (menu_reply_obj_type_select_code) obj.replyObjType = parseInt(menu_reply_obj_type_select_code);

        requestWxReply(obj)
            .then(res => {
                if (res.data) {
                    table_box.table_datas = res.data;
                    table_box.table_pages = res.page;

                    that.setState({
                        table_box: table_box,
                    })
                }
            })
            .catch(res => {
                message.fail('获取失败:' + res.desc);
            })
    }


}