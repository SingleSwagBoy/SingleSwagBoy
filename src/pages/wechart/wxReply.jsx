/*
 * @Description: 微信自动回复
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-03 11:01:36
 */
import React, { Component } from 'react';
import { Menu, message, Tooltip, Modal } from 'antd';
import {
    requestDictStatus,                  //字典 状态
    requestWxReply,                     //获取微信关键字回复
    requestWxReplyTypes,                //获取回复公众号的类型
    requestWxReplyUpdate,               //编辑|更新
    requestWxReplyDelete,               //删除
    requestWxReplyCreate,               //添加
    getUserTag,                         //用户设备标签
} from 'api'
import './wxReply.css';
import WxReplyModal from "./wxReplyModal"

export default class WxReply extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            wxReplyModlRef: null,
            menu_select_code: '',
            //目录列表 code其实是微信Code
            menu_list: [
                { index: "1", code: "keywords", name: '关键字回复' },
                { index: "6", code: "other", name: '自定义二维码回复' },
                { index: "2", code: "messageDefault", name: '收到消息回复' },
                { index: "3", code: "addFriend", name: '搜索关注回复' },
                { index: "4", code: "scanSubscribe", name: '第1次扫码关注回复' },
                { index: "5", code: "scan", name: '第N次关注扫码回复' },
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
                { key: 'mini', value: '小程序卡片' },   //用于前端 穿给后端的时候 用文本形式上传
            ],
            //关键字匹配规则
            dict_rule_types: [
                { key: 1, value: '全匹配' },
                { key: 2, value: '半匹配' },
            ],
            dict_user_tags: [],                      //字典 用户标签
            dict_public_types: [],                  //字典 微信公众号回复类型
            dict_status: [],                        //字典 状态类型
            table_box: {
                table_title: [],
                table_datas: [],
            },
            request_box: {
                code: '',
                notCode: '',
                wxCode: '',
            },
            reply_box: {
                id: '',
                info: [],
                msgType: '',
                select_id: 0,
                tags: [],
            },
            modal_box: {
                is_show: false,
                select_item: null,
            },
        }

    }


    render() {
        let { table_box, menu_select_code, menu_list, request_box,
            dict_public_types, dict_msg_type, dict_user_tags, dict_rule_types, } = this.state;

        return (
            <div>
                {/* ===================== 关键字回复|自定义二维码回复 ===================== */}
                <Tooltip title='回复类型' placement="left" color={'purple'}>
                    <Menu onClick={(item) => this.onMenuClick(item)} selectedKeys={[menu_select_code]} mode="horizontal">
                        {
                            menu_list.map((item, index) => {
                                return <Menu.Item key={item.code}> {item.name}</Menu.Item>
                            })
                        }
                    </Menu>
                </Tooltip>

                {/* ===================== 收到消息回复|被关注回复|首次扫码关注回复|已关注扫码回复 ===================== */}
                {
                    (menu_select_code === 'messageDefault' || menu_select_code === 'addFriend' || menu_select_code === 'scanSubscribe' || menu_select_code === 'scan') &&
                    <div>
                        <Tooltip title='回复公众号类型' placement="left" color={'purple'}>
                            <Menu onClick={(item) => this.onMenuPublicTypeClick(item)} selectedKeys={[request_box.wxCode]} mode="horizontal">
                                {
                                    dict_public_types.map((item, index) => {
                                        return <Menu.Item key={item.code}> {item.name}</Menu.Item>
                                    })
                                }
                            </Menu>
                        </Tooltip>
                    </div>
                }


                <WxReplyModal onRef={(val) => { this.setState({ wxReplyModlRef: val }) }}
                    dict_msg_type={dict_msg_type} dict_user_tags={dict_user_tags} dict_public_types={dict_public_types} dict_rule_types={dict_rule_types}
                    menu_type={menu_select_code} request_box={request_box}
                    onSave={this.onWxReplySaveClick.bind(this)} onDelete={this.onWxReplyDeleteClick.bind(this)} />

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
                requestWxReplyTypes().then(res => {
                    let types = res.data;
                    if (types && types.length > 0) {
                        that.setState({
                            dict_public_types: types
                        }, () => {
                            //渲染menu
                            let code = that.state.menu_list[0].code;
                            that.refreshTableTitleByMenuCode(code);
                        })
                    } else {
                        message.error('获取字典[回复公众号类型]时发生错误，请刷新页面。')
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
        let request_box = that.state.request_box;
        let curr_code = item.key;
        let last_code = request_box.wxCode;

        if (last_code === curr_code) return;

        request_box.wxCode = curr_code;

        that.setState({
            request_box: request_box,
        }, () => {
            that.refreshList();
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

        //关键字回复 || 自定义二维码回复
        if (code === 'keywords' || code === 'other') {
            if (code === 'keywords') {
                request_box = {
                    code: code,
                    wxCode: '',
                }
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
                request_box = {
                    notCode: codes,
                    wxCode: '',
                }
            }
        }
        //其他类型
        else {
            let wxCode = dict_public_types[0].code;
            request_box = {
                code: code,
                wxCode: wxCode,
            }
        }


        // table_title.push({ title: 'id', dataIndex: 'id', key: 'id', width: 50, });
        // table_title.push({ title: '分类', dataIndex: 'name', key: 'name', width: 100, });

        // // table_title.push({
        // //     title: '回复类型', dataIndex: 'msgType', key: 'msgType', width: 140,
        // //     render: (rowValue, row, index) => {
        // //         return (
        // //             <Select defaultValue={row.msgType} style={{ width: '100%' }} onChange={(e) => {
        // //                 row.msgType = e;
        // //                 that.forceUpdate();
        // //             }} >
        // //                 {dict_msg_type.map((item, index) => (
        // //                     <Option value={item.key}>{item.value}</Option>
        // //                 ))}
        // //             </Select>
        // //         )
        // //     }
        // // });


        // //关键字回复
        // if (code === 'keywords' || code === 'other') {
        //     menu_public_type_select_code = '';
        //     if (code === 'keywords') {
        //         request_box = { code: code }
        //     }
        //     //other类型 特殊处理 根据老CMS的接口设计 貌似这里需要传递'abc'类型的字符串 需要带上冒号
        //     else {
        //         let code_array = [];
        //         let items = that.state.menu_list;
        //         for (let i = 0, len = items.length; i < len; i++) {
        //             let item = items[i];
        //             code_array.push(`'${item.code}'`)
        //         }
        //         let codes = code_array.join(',');
        //         request_box = { notCode: codes }
        //     }


        //     table_title.push({
        //         title: '回复公众号', dataIndex: 'wxCode', key: 'wxCode', width: 140,
        //         render: (rowValue, row, index) => {
        //             let array = [];
        //             if (row.wxCode && row.wxCode.constructor === String) {
        //                 array = row.wxCode.split(',')
        //             }

        //             return (
        //                 <Select defaultValue={array} style={{ width: '100%' }} mode="multiple" allowClear>
        //                     {dict_public_types.map((item, index) => (
        //                         <Option value={item.code}>{item.name}</Option>
        //                     ))}
        //                 </Select>
        //             )
        //         }
        //     });

        //     if (code === 'keywords') {
        //         table_title.push({ title: '规则', dataIndex: 'ruleName', key: 'ruleName', width: 100, });
        //         table_title.push({
        //             title: '匹配规则', dataIndex: 'ruleType', key: 'ruleType', width: 140,
        //             render: (rowValue, row, index) => {
        //                 let array = [];
        //                 if (row.wxCode && row.wxCode.constructor === String) {
        //                     array = row.wxCode.split(',')
        //                 }
        //                 return (
        //                     <Select defaultValue={parseInt(row.ruleType)} style={{ width: '100%' }} >
        //                         {dict_rule_type.map((item, index) => (
        //                             <Option value={item.key} key={item.key}>{item.value}</Option>
        //                         ))}
        //                     </Select>
        //                 )
        //             }
        //         });
        //         table_title.push({ title: '关键字', dataIndex: 'keywords', key: 'keywords', width: 100, });
        //     }
        //     //
        //     else {
        //         table_title.push({ title: '名称', dataIndex: 'name', key: 'name', width: 100, });
        //         table_title.push({ title: '编码', dataIndex: 'code', key: 'code', width: 100, });
        //     }
        // }
        // //其他类型
        // else {
        //     menu_public_type_select_code = dict_public_types[0].code;

        //     //其他类型的貌似都需要单独name
        //     let menu_list = that.state.menu_list;
        //     let name = '';
        //     for (let i = 0, len = menu_list.length; i < len; i++) {
        //         let item = menu_list[i];
        //         if (code === item.code) {
        //             name = item.name;
        //             break;
        //         }
        //     }
        //     request_box = { code: code, name: name }
        // }


        // table_title.push({
        //     title: '状态', dataIndex: 'status', key: 'status', width: 100,
        //     render: (rowValue, row, index) => {
        //         return (
        //             <Switch defaultChecked={row.status === 1 ? true : false} checkedChildren="有效" unCheckedChildren="无效"
        //                 onChange={(type) => this.onItemStatusChanged(type, row)} />
        //         )
        //     }
        // });

        // table_title.push({
        //     title: '操作', dataIndex: 'action', key: 'action', width: 80, fixed: 'right',
        //     render: (rowValue, row, index) => {
        //         return (
        //             <div>
        //                 {/* <Button>复制</Button> */}
        //                 <Button size='small' type='primary' type='link' onClick={() => { console.log(row) }}>编辑</Button>
        //                 <Button size='small' type='primary' type='link' onClick={() => that.onItemDeleteClick(row)}>删除</Button>
        //             </div>
        //         )
        //     }

        // });

        // table_box.table_title = table_title;

        that.setState({
            request_box: request_box,
        }, () => {
            that.refreshList();
        });


    }

    //item状态变更
    onItemStatusChanged(type, row) {
        let that = this;
        let obj = Object.assign({}, row);
        obj.status = type ? 1 : 2;
    }
    //获取数据列表
    refreshList() {
        let that = this;
        let table_box = that.state.table_box;
        let request_box = that.state.request_box;

        let obj = {};
        if (request_box.code) obj.code = request_box.code;
        if (request_box.notCode) obj.notCode = request_box.notCode;
        if (request_box.wxCode) obj.wxCode = request_box.wxCode;

        obj.page = { currentPage: 1, pageSize: 9999 };

        table_box.table_datas = [];
        that.setState(
            { table_box: table_box, },
            () => {
                requestWxReply(obj)
                    .then(res => {
                        if (res.data) {
                            table_box.table_datas = res.data;
                            that.setState({
                                table_box: table_box
                            }, () => {
                                that.state.wxReplyModlRef.injectFormData(res.data)
                            })
                        }
                    })
                    .catch(res => {
                    })
            })
    }


    //获取Form对象 避免报错
    getFormByLoop() {
        let that = this;
        if (!that.formRef || !that.formRef.current) {
            let interval = setInterval(() => {
                if (!that.formRef || !that.formRef.current) {
                    //loop
                } else {
                    clearInterval(interval);
                    return that.formRef;
                }
            }, 200)
        } else {
            return that.formRef;
        }
    }

    //
    onWxReplyCreateClick() {

    }



    //删除按钮被点击
    onItemDeleteClick(item) {
        console.log(item);
        let id = item.id;
        let that = this;
        Modal.confirm({
            title: '删除数据',
            content: '确认删除这一条数据？',
            onOk: () => {
                requestWxReplyDelete({ id: id })
                    .then(res => {
                        message.success('删除成功');
                        that.refreshList();
                    })
                    .catch(res => {
                        message.error('删除失败' + res.desc);
                    })
            },
        })
    }

    //编辑按钮被点击
    onItemEditorClick(row) {

    }

    //保存按钮被点击
    onWxReplySaveClick(item) {
        let that = this;
        (item.id ? requestWxReplyUpdate(item) : requestWxReplyCreate(item))
            .then(res => {
                message.success(`${item.id ? '更新成功' : '创建成功'}`);
                that.refreshList();
            })
            .catch(res => {
                message.error(`${item.id ? '更新失败：' : '创建失败：'}` + res.desc);
            })
    }

    //删除按钮被点击
    onWxReplyDeleteClick(item) {
        console.log('delete!!!');
        console.log(item);
        let that = this;
        let obj = {
            id: item,
        }
        requestWxReplyDelete(obj)
            .then((res) => {
                message.success('删除成功！');
                that.refreshList();
            })
            .catch((res) => {
                message.error('删除失败:' + res.desc);
            })
    }

}