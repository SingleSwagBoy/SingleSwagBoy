/*
 * @Author: HuangQS
 * @Date: 2021-10-27 18:41:39
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-12-23 18:42:37
 * @Description: 
 */


import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, message } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import "./index.css"
import util from 'utils'
import { MySyncBtn, MyTagConfigFormulas } from '@/components/views.js';
import {
    requestNewAdTagList,                    //新版 获取用户标签列表
    requestNewAdTagCreate,                  //新版 创建用户标签数据
    requestNewAdTagUpdate,                  //新版 更新用户标签数据
    requestNewAdTagDelete,                  //新版 删除用户标签数据
    requestDictionary,                      //获取 字典集
    requestAdFieldList,                     //获取 Field列表
    getMyProduct,
    requestNewAdTagRecord,                  //

} from 'api';

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
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
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
            productList: [],
            tagList: []
        }

    }
    render() {
        let that = this;
        let { table_box, modal_box, dict_tag_index, dict_field_list, productList, tagList } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="配置列表" type="success" action={
                    <div className='top_box'>
                        <div className="everyBody">
                            <div>名称:</div>
                            <Input.Search allowClear
                                onSearch={(val) => {
                                    if (val) { //有值则变化
                                        let arr = tagList.filter(item => item.name.includes(val))
                                        table_box.table_datas = arr
                                        this.setState({
                                            table_box: table_box
                                        })
                                    } else { //没值就恢复默认列表
                                        table_box.table_datas = tagList
                                        this.setState({
                                            table_box: table_box
                                        })
                                    }

                                }} />
                        </div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={10} name='同步缓存' />
                    </div>
                } />
                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} rowKey={item => item.id} scroll={{ x: 1500, y: '75vh' }} />
                <Modal visible={modal_box.is_show} title={modal_box.title} width={1500} transitionName="" maskClosable={false} onCancel={() => that.onModalCancelClick()}
                    style={{ top: 20 }} footer={null}
                // footer={[
                //     <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                //     <Button onClick={() => that.onModalConfirmClick()} >保存</Button>
                // ]}
                >

                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} ref={that.formRef} onFinish={this.onModalConfirmClick.bind(this)}>
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
                                <Form.Item label="创建者" name='createUser' rules={[{ required: true }]} >
                                    <Input className="base-input-wrapper" placeholder="请输入创作者" />
                                </Form.Item>
                                <Form.Item label="标签规则" rules={[{ required: true }]}>
                                    <Form.Item>
                                        且：多个规则同时满足。或：多个规则中选择其中一条符合的配置规则。
                                    </Form.Item>
                                    <Form.Item name='rule' >
                                        <MyTagConfigFormulas formRef={that.formRef} dict_field={dict_field_list} productList={productList} />
                                    </Form.Item>
                                </Form.Item>
                                {/* <Form.Item label="计数" name='count' >
                                    <Input className="base-input-wrapper" placeholder="计数" disabled />
                                </Form.Item> */}
                                <Form.Item label="计数">
                                    <Form.Item label="" name='count' style={{display:"inline-block"}}>
                                        <Input className="base-input-wrapper" placeholder="计数" disabled />
                                    </Form.Item>
                                    <Form.Item label="" style={{display:"inline-block",width:"50%"}}>
                                        <Button type='primary' onClick={() => this.requestNewAdTagRecord()}>获取实时</Button>
                                    </Form.Item>

                                </Form.Item>


                                <Form.Item {...this.state.tailLayout}>
                                    <Button onClick={() => { this.onModalCancelClick() }}>取消</Button>
                                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                        确定
                                    </Button>
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
        that.getProductList();
    }
    getProductList = () => {
        let params = {
            page: { isPage: 9 }
        }
        getMyProduct(params).then(res => {
            console.log("getMyProduct-------getMyProduct", res)
            this.setState({
                productList: res.data.data
            })
        })
    }
    initData() {
        let that = this;

        let { table_box
            , dict_tag_types, dict_status, dict_tag_index
        } = that.state;


        let table_title = [
            { title: 'id', dataIndex: 'id', key: 'id', width: 80, },
            { title: '名称', dataIndex: 'name', key: 'name', width: 200, },
            { title: '标签code', dataIndex: 'code', key: 'code', width: 200, },
            { title: '描述', dataIndex: 'description', key: 'description', },
            {
                title: '创建者', dataIndex: 'createUser', key: 'createUser',
                render: (rowValue, row, index) => {
                    return (
                        <div>{decodeURIComponent(rowValue)}</div>
                    )
                }
            },
            {
                title: '状态', dataIndex: 'status', key: 'status', width: 100,
                render: (rowValue, row, index) => {
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
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 260,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => that.onItemCopyClick(row)} style={{ marginLeft: 3 }}>复制</Button>
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
            that.refreshList();
        })

        //获取数据源类型字典
        requestDictionary({ type: 'tagIndex' }).then(res => {
            that.setState({
                dict_tag_index: res.data,
            })
        })

        //field集合
        requestAdFieldList({ page: { pageSize: 9999 } }).then(res => {
            that.setState({
                dict_field_list: res.data.filter(r => r.type != 2 && r.type != 4),
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
            table_box.table_datas = res.data;
            that.setState({
                table_box: table_box,
                tagList: res.data
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
            let name = JSON.parse(localStorage.getItem('user')).userInfo.userName
            that.formRef.current.setFieldsValue({ createUser: decodeURIComponent(name) });
        })
    }


    //item 编辑标签 被点击
    onItemEditClick(item) {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '修改配置',
            },
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
    //item 复制 被点击
    onItemCopyClick(val) {
        let params = {
            ...val
        }
        delete params.id
        delete params.code
        requestNewAdTagCreate(params).then(res => {
            this.refreshList();
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
    //item 状态变更
    onItemStatusChange(e, item) {
        let that = this;
        item.status = e;
        that.requestCreateOrUpdate(item);
    }

    //弹出框确定按钮被点击
    onModalConfirmClick(val) {
        let that = this;
        // let value = that.formRef.current.getFieldsValue();
        let value = val


        let obj = Object.assign({}, value);

        let rule = obj.rule;
        console.log(rule, "rule")
        if (!rule) {
            message.error('请填写规则后提交。')
            return;
        }
        rule.forEach(r => {
            r.forEach(h => {
                h.forEach(l => {
                    if (l.value && Array.isArray(l.value)) {
                        let postAddress = l.value.filter(item => !item.includes("#"))
                        console.log(l, "l")
                        let arr = []
                        if (l.field == "marketChannelName") {
                            postAddress.forEach(m => {
                                if (m.includes("-")) {
                                    arr.push(m.split("-")[0])
                                }
                            })
                        } else {
                            arr = postAddress
                        }
                        l.value = arr.join(",")
                    }

                })
            })
        })
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
    requestNewAdTagRecord() {
        message.loading("计算中，请等待两分钟后再试")
        let params = {
            ...this.formRef.current.getFieldValue(),
            rule:JSON.stringify(this.formRef.current.getFieldValue("rule"))
        }
        requestNewAdTagRecord(params).then(res => {
            message.success("更新成功")
            console.log(res,"res.data")
            this.formRef.current.setFieldsValue({count:res.data.data||0})
        })
    }

}