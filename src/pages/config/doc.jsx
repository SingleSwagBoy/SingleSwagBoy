/*
 * @Description: 
 * @Author: HuangQS
 * @Date: 2021-08-20 16:06:46
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-16 19:33:19
 */

import React, { Component } from 'react';
import { Tabs, Menu, Breadcrumb, Badge, Input, Form, Button, Tooltip, Table, Pagination, Modal, Upload, Image, Select, Alert, Switch, message, Divider } from 'antd';
import {
    baseUrl,
    requestConfigAddDoc,                //配置列表-添加配置
    requestConfigDocList,               //配置列表-配置列表
    requestConfigDeleteDoc,             //配置列表-删除配置
    requestConfigUpdateDoc,             //配置列表-更新配置
} from 'api'
import './doc_style.css'
import { MySyncBtn } from '@/components/views.js';

let { TextArea } = Input;
let { Option } = Select;
let { TabPane } = Tabs;
export default class Doc extends Component {
    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        this.state = {
            table_box: {
                table_layer: [],                //表格层级 根据层级更新表格title
                table_datas: [],
                table_title: [],
                table_pages: {
                    currentPage: 0,
                    pageSize: 0,
                    totalCount: 0,
                },
            },
            //状态类型
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],
            //类型
            dict_types: [
                { key: 1, value: '多语言文本' },
                { key: 2, value: '单项配置值' },
                { key: 3, value: '多项配置值' },
            ],
            //产品线
            dict_product_line: [
                // productLine 整数类型 1=电视端，2=安卓，3=ios, 6=小程序
                { key: 100, code: 'all', value: '全端' },
                { key: 1, code: 'tv', value: '电视端' },
                { key: 2, code: 'android', value: '安卓' },
                { key: 3, code: 'ios', value: 'ios' },
                { key: 6, code: 'mini', value: '小程序' },
            ],
            curr_select_product_line_code: '', //当前选择的产品线 
            //弹出框
            modal_box: {
                is_show: false,
                is_edit: false,
                title: '新增',
            },
            last_item_edit_id: '',   //上一个被选中的id
        }
    }

    render() {
        let { curr_select_product_line_code, table_box, modal_box, dict_product_line } = this.state;
        let that = this;
        return (
            <div>
                <Tooltip title='产品线' placement="left" color={'purple'}>
                    <Menu onClick={(item) => that.onMenuClick(item.key)} selectedKeys={[curr_select_product_line_code]} mode="horizontal">
                        {
                            dict_product_line.map((item, index) => {
                                return <Menu.Item key={item.code}> {item.value}</Menu.Item>
                            })
                        }
                    </Menu>
                </Tooltip>


                <Alert className="alert-box" message={
                    <Breadcrumb>
                        <Breadcrumb.Item>列表</Breadcrumb.Item>
                        {table_box.table_layer.map((item, index) => {
                            return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
                        })}
                    </Breadcrumb>

                } type="success" action={
                    <div>
                        {
                            table_box.table_layer.length > 0 &&
                            <Tooltip title='返回上一层数据列表' placement="top"  >
                                <Button onClick={() => this.onLayerBackClick()} type="primary" ghost style={{ 'marginLeft': '10px' }} >返回</Button>
                            </Tooltip>
                        }

                        <Tooltip title='仅仅只是刷新当前列表最新的数据' placement="top"  >
                            <Button onClick={() => this.onRefreshListClick()} type="primary" style={{ 'marginLeft': '10px' }} >刷新</Button>
                        </Tooltip>

                        <Tooltip title='新增数据' placement="top"  >
                            <Button onClick={() => this.onItemShowModalClick()} type="primary" style={{ 'marginLeft': '10px' }} >新增</Button>
                        </Tooltip>

                        <MySyncBtn type={1} name={'同步缓存'} />
                    </div>
                }>
                </Alert>

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1200 }} />

                {/* {
                    table_box.table_pages.totalCount !== 0 &&
                    <div className="pagination-box">
                        <Pagination current={table_box.table_pages.currentPage} pageSize={table_box.table_pages.pageSize} onChange={(page, pageSize) => this.onPageChange(page, pageSize)} total={table_box.table_pages.totalCount} />
                    </div>
                } */}
                {/* 弹出框 多层数据新增弹框 */}
                <Modal title={modal_box.title} visible={modal_box.is_show} forceRender={true} width={800} onOk={() => this.onModalOkClick()} onCancel={() => this.onModalCancelClick()}>
                    {/* 第一层 */}
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>

                        <Form.Item label='id' name='id' rules={[{ required: true }]} >
                            <Input style={{ width: 350 }} disabled placeholder="创建成功后将自动生成id" />
                        </Form.Item>
                        {
                            table_box.table_layer.length === 0 &&
                            <div>
                                <Form.Item label='产品线' name='productLine' rules={[{ required: true, message: '请选择产品线' }]}>
                                    <Select style={{ width: 350 }} placeholder="请选择产品线">
                                        {dict_product_line.map((item, index) => (
                                            <Option value={item.key} key={item.key}> {item.key}- {item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="名称" name='name' rules={[{ required: true, message: '请输入名称' }]}>
                                    <Input style={{ width: 350 }} className="input-wrapper-from" placeholder="请输入名称" />
                                </Form.Item>
                                <Form.Item label="编码" name='code' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Input style={{ width: 350 }} className="input-wrapper-from" placeholder="请输入编码" />
                                </Form.Item>
                            </div>
                        }
                        {
                            table_box.table_layer.length === 1 &&
                            <div>
                                <Form.Item label='产品线' name='productLine' rules={[{ required: true, message: '请选择产品线' }]}>
                                    <Select style={{ width: 350 }} placeholder="请选择产品线" disabled >
                                        {dict_product_line.map((item, index) => (
                                            <Option value={item.key} key={item.key}> {item.key}- {item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="key名称" name='name' rules={[{ required: true, message: '请输入名称' }]}>
                                    <Input style={{ width: 350 }} className="input-wrapper-from" placeholder="请输入名称" />
                                </Form.Item>
                                <Form.Item label="key编码" name='code' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Input style={{ width: 350 }} className="input-wrapper-from" placeholder="请输入编码" />
                                </Form.Item>
                            </div>
                        }
                        {
                            table_box.table_layer.length === 2 &&
                            <div>
                                <Form.Item label='产品线' name='productLine' rules={[{ required: true, message: '请选择产品线' }]}>
                                    <Select style={{ width: 350 }} placeholder="请选择产品线" disabled >
                                        {dict_product_line.map((item, index) => (
                                            <Option value={item.key} key={item.key}> {item.key}- {item.value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="快捷上传"  >
                                    <Upload  {...this.buildAdImageUpload()}>
                                        <Button>快捷上传</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item label="参数" name='value' rules={[{ required: true, message: '请输入参数' }]}>
                                    <Input style={{ width: 350 }} className="input-wrapper-from" placeholder="请输入参数" onBlur={(e) => {
                                        let new_value = e.target.value;
                                        that.formRef.current.setFieldsValue({ "value": new_value })
                                        that.forceUpdate();
                                    }}></Input>
                                </Form.Item>
                                {
                                    that.formRef.current.getFieldValue("value") ?
                                        <Form.Item label="展示"  >
                                            <Image height={100} src={that.formRef.current.getFieldValue("value")} />
                                        </Form.Item> : ''
                                }
                            </div>
                        }
                    </Form>
                </Modal>
            </div >
        )
    }

    componentDidMount() {
        this.initData();
    }

    initData() {
        let that = this;
        let dict_product_line = that.state.dict_product_line;
        let code = dict_product_line[0].code;
        that.setState({
            curr_select_product_line_code: code,
        }, () => {
            that.refreshList()
        })
    }
    //页码切换
    onPageChange(page, pageSize) {
        console.log(page);
        let that = this;
        let table_box = that.state.table_box;

        let table_pages = table_box.table_pages;
        table_pages.currentPage = page;
        that.setState({ table_box: table_box });
        that.refreshList();
    }

    /**
     * 请求数据列表
     * @param {*} table_layer       当前列表层级 
     * @param {*} request_params    请求附带参数
     */
    refreshList() {
        let that = this;
        let titles = [];
        let table_box = that.state.table_box;
        let dict_product_line = that.state.dict_product_line;
        let table_layer = table_box.table_layer;    //表格层级

        titles.push({ title: 'id', dataIndex: 'id', key: 'id', width: 100, });

        let layer_count = table_layer.length;
        if (layer_count === 0 || layer_count === 1) {
            titles.push({
                title: '文案名称', dataIndex: 'name', key: 'name', render: (rowValue, row, index) => {
                    return (that.renderTitleItem(layer_count, row, 'is_edit_name', 'name'))
                }
            });
            titles.push({
                title: '文案编码', dataIndex: 'code', key: 'code', render: (rowValue, row, index) => {
                    return (that.renderTitleItem(layer_count, row, 'is_edit_code', 'code'))
                }
            });
        }
        else if (layer_count === 2) {
            titles.push({
                title: '参数', dataIndex: 'value', key: 'value', render: (rowValue, row, index) => {
                    return (that.renderTitleItem(layer_count, row, 'is_edit_value', 'value'))
                }
            });
        }
        if (layer_count === 0) {
            titles.push({
                title: '产品线', dataIndex: 'productLine', key: 'productLine',
                render: (rowValue, row, index) => {
                    let is_disable = layer_count !== 0;
                    return (
                        <Select style={{ width: 120 }} defaultValue={row.productLine} onChange={(data) => this.onItemDataChange(row, 'productLine', data)} disabled={is_disable}>
                            {dict_product_line.map((item, index) => {
                                return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                            })}
                        </Select>
                    )
                }
            });
        }


        //第0层||第1层
        if (layer_count === 0 || layer_count === 1) {
            let dict_status = that.state.dict_status;

            if (layer_count === 1) {
                let dict_types = that.state.dict_types;
                titles.push({
                    title: '类型', dataIndex: 'type', key: 'type',
                    render: (rowValue, row, index) => {
                        return (
                            <Select defaultValue={row.type} style={{ width: 180 }} onChange={(data) => this.onItemDataChange(row, 'type', data)}>
                                {dict_types.map((item, index) => {
                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        )
                    }
                });
            }

            titles.push({
                title: '状态', dataIndex: 'status', key: 'status',
                render: (rowValue, row, index) => {
                    return (
                        <Switch defaultChecked={row.status === 1 ? true : false} checkedChildren="有效" unCheckedChildren="无效" onChange={(data) => this.onItemDataChange(row, 'status', data ? 1 : 2)} />
                    )
                }
            });
        }
        titles.push({
            title: '操作', dataIndex: 'action', key: 'action', width: 160, fixed: 'right',
            render: (rowValue, row, index) => {
                let params_count = layer_count === 0 ? row.keyCount : layer_count === 1 ? row.valueCount : '';
                return (
                    <div>
                        {/* <Button size='small' type="primary" type="link" onClick={() => { }}>复制</Button> */}
                        {layer_count < 2 &&
                            <Badge count={params_count} size="small">
                                <Button size='small' type="primary" type="link" onClick={() => this.onItemManagerClick(row)}>配置</Button>
                            </Badge>
                        }
                        {/* <Button size='small' type="primary" type="link" onClick={() => this.onItemEditClick(row)} style={{ marginLeft: 10 }}>{row.is_edit ? '保存' : '编辑'}</Button> */}
                        <Button size='small' type="primary" type="link" style={{ marginLeft: 15 }} onClick={() => this.onItemDeleteClick(row)}>删除</Button>
                    </div>
                )
            }
        });

        let request_params = {};

        //第0层
        if (layer_count === 0) {
        }
        //第1层 查询key层
        else if (layer_count === 1) {
            let layer = table_layer[0];
            request_params.docId = layer.id;
        }
        //第2层 查询value层
        else if (layer_count === 2) {
            let layer = table_layer[1];
            request_params.docKeyId = layer.id;
        }

        //更新页码
        let table_pages = table_box.table_pages;
        let curr_page = table_pages.currentPage;
        if (curr_page === 0) curr_page = 1;
        request_params.page = { currentPage: curr_page, pageSize: 9999, isPage: 9 };

        table_box.table_title = titles;
        that.setState({ table_box: table_box, });


        let product_line_code = that.state.curr_select_product_line_code;
        if (product_line_code) {
            let dict_product_line = that.state.dict_product_line;
            for (let i = 0, len = dict_product_line.length; i < len; i++) {
                let item = dict_product_line[i];
                if (product_line_code === item.code) {
                    request_params.productLine = item.key;
                    break;
                }
            }
        }

        table_box.table_datas = [];
        that.setState({
            table_box: table_box,
        }, () => {
            requestConfigDocList(layer_count, request_params).then(res => {
                if (res.data) {
                    table_box.table_datas = res.data;
                    table_box.table_pages = res.page;
                    that.setState({ table_box: table_box },);
                } else {
                    message.error('暂无数据');
                }
            }).catch(res => {
                message.error(res.desc);
            })
        })
    }

    //管理按钮被点击 跳转到下一层数据
    onItemManagerClick(item) {
        let that = this;
        let table_box = that.state.table_box;
        //页码更新
        let table_pages = table_box.table_pages;
        table_pages.currentPage = 0;

        //层级更新
        let table_layer = table_box.table_layer;
        let layer = {
            id: item.id,
            name: item.name,
        }

        table_layer.push(layer);
        that.setState({ table_box: table_box, });
        that.refreshList();
    }
    //删除按钮被点击 删除并刷新当前页面
    onItemDeleteClick(item) {
        let that = this;

        Modal.confirm({
            title: '删除',
            content: (
                <p>确定删除这条数据？</p>
            ),
            okText: '删除',
            cancelText: '取消',
            onOk() {
                let table_layer = that.state.table_box.table_layer;
                let layer_count = table_layer.length;
                let obj = {
                    id: parseInt(item.id),
                }
                requestConfigDeleteDoc(layer_count, obj).then(res => {
                    message.success('数据删除成功');
                    that.refreshList();
                }).catch(res => {
                    message.error('数据删除失败:', res.desc);
                })
            },
        });
    }

    //刷新列表被点击
    onRefreshListClick() {
        let that = this;
        that.refreshList();
    }
    //新增文案按钮被点击 展示输入框
    onItemShowModalClick() {
        let that = this;
        that.formRef.current.resetFields();

        //默认选择当前产品线
        let product_line_code = that.state.curr_select_product_line_code;
        let dict_product_line = that.state.dict_product_line;
        for (let i = 0, len = dict_product_line.length; i < len; i++) {
            let item = dict_product_line[i];
            if (product_line_code === item.code) {
                that.formRef.current.setFieldsValue({ productLine: item.key });
                break;
            }
        }
        let modal_box = that.state.modal_box;
        modal_box.is_show = true;
        modal_box.is_edit = false;
        modal_box.data = {};
        that.setState({ modal_box: modal_box })
    }
    //编辑按钮被点击
    onItemEditClick(item) {
        let that = this;
        let is_edit = item.is_edit;
        if (!is_edit) is_edit = false;
        item.is_edit = !is_edit;
        that.forceUpdate();

        //保存
        if (!item.is_edit) {
            that.requestUpdateData(item);
        }
    }
    //弹出框OK被点击
    onModalOkClick() {
        let that = this;
        let object = that.formRef.current.getFieldsValue();

        let table_layer = that.state.table_box.table_layer;
        let step = table_layer.length;

        //配置列表 Key值列表
        if (step === 0 || step === 1) {
            let name = object.name;
            if (!name) {
                message.error('请填写名称');
                return;
            }
            let code = object.code;
            if (!code) {
                message.error('请填写编码');
                return;
            }

            //第二层
            if (step === 1) {
                let item = table_layer[step - 1];   //更新id
                object.docId = item.id;
                object.type = 2; // 默认单项
            }
        }
        //value列表
        else if (step === 2) {
            object.value = that.formRef.current.getFieldValue('value'); //控件原因 暂时这么写
            if (!object.value) {
                message.error('请填写value值');
                return;
            }
            let item = table_layer[step - 1];   //更新id
            object.docKeyId = item.id;
        }

        if (object.code) object.code = object.code.replace(/(^\s*)|(\s*$)/g, "");
        if (object.name) object.name = object.name.replace(/(^\s*)|(\s*$)/g, "");
        if (object.value) object.value = object.value.replace(/(^\s*)|(\s*$)/g, "");


        let is_modify = object.id ? true : false;

        (is_modify ? (requestConfigUpdateDoc(step, object)) : (requestConfigAddDoc(step, object)))
            .then(res => {
                message.success('保存成功');
                //隐藏弹出框
                let modal_box = that.state.modal_box;
                modal_box.is_show = false;
                that.setState({
                    modal_box: modal_box
                }, () => {
                    that.refreshList();
                });
            }).catch(res => {
                message.error('操作失败：' + res.desc)
            })


    }

    //弹出框Cancel被点击
    onModalCancelClick() {
        let that = this;
        let modal_box = that.state.modal_box;
        modal_box.title = '新增';
        modal_box.is_show = false;
        modal_box.is_edit = false;
        modal_box.data = {};
        that.setState({ modal_box: modal_box })
    }

    //目录被点击 目录切换
    onMenuClick(key) {
        let that = this;
        let curr_code = key;
        let last_code = that.state.curr_select_product_line_code;
        if (last_code === curr_code) return;
        let table_box = that.state.table_box;
        table_box.table_layer = [];         //每次切换目录 每次从根目录进入 

        that.setState({
            table_box: table_box,
            curr_select_product_line_code: curr_code,
        }, () => {
            that.refreshList();
        })
    }


    //返回上一层层级
    onLayerBackClick() {
        let that = this;
        let table_box = that.state.table_box;
        let table_layer = table_box.table_layer;

        table_layer.pop();  //层级减1
        if (!table_layer) table_layer = [];

        table_box.table_layer = table_layer;
        that.setState({ table_box: table_box, })
        that.refreshList();
    }

    //从字典中解析对应参数类型的名称
    parseShowNameByKeyValue(curr_type, data_array) {
        // let that = this;
        for (let i = 0; i < data_array.length; i++) {
            let item = data_array[i]
            if (curr_type === item.key) {
                return item.value;
            }
        }
        return '';
    }
    /**
     * 数据变更切换 统一更新逻辑
     * @param {*} source        item数据源(row)
     * @param {*} key           变更参数的key
     * @param {*} value         变更参数对应的数据
     */
    onItemDataChange(source, key, value) {
        let that = this;
        source[key] = value;
        //更新数据
        let obj = Object.assign({}, source);
        that.requestUpdateData(obj);
    }

    /**
     * 输入框变更
     * 
     * @param {*} target_key 
     * @param {*} e 
     * @param {*} row 
     */
    onItemInputChanged(target_key, e, row) {
        let that = this;
        row[target_key] = e.target.value;
        that.requestUpdateData(row)
    }

    /**
     * 渲染表格item 默认为按钮，被点击后出现输入框、失去焦点后判断更新数据、刷新列表
     * @param {*} layer_count 层级
     * @param {*} row 
     * @param {*} flag_key 
     * @param {*} param_key 
     * @returns 
     */
    renderTitleItem(layer_count, row, flag_key, param_key) {
        let that = this;
        let is_edit = row[flag_key];
        let default_value = row[param_key];
        let last_item_edit_id = that.state.last_item_edit_id;


        //编辑形态 失去焦点 更新数据
        if (is_edit) {
            if (last_item_edit_id !== row.id) {
                row[flag_key] = false;
                that.forceUpdate();
                return;
            }

            return <TextArea defaultValue={default_value} style={{ width: 350 }} autoSize={{ minRows: 2, maxRows: 6 }} onBlur={(e) => {
                let new_value = e.target.value;
                if (default_value === new_value) {
                    row[flag_key] = false;
                    that.forceUpdate();
                    return;
                }

                row[param_key] = new_value;
                that.requestUpdateData(row)
            }} />
        }
        //按钮形态
        else {
            return <a type='link' onClick={() => {
                //第三层数据 
                if (layer_count === 2) {
                    let modal_box = that.state.modal_box;
                    modal_box.title = '编辑';
                    modal_box.is_show = true;
                    modal_box.is_edit = true;
                    modal_box.data = row;
                    that.formRef.current.setFieldsValue(row);

                    that.setState({ modal_box: modal_box })
                }
                //第1、2层数据
                else {
                    row[flag_key] = true;
                    that.setState({
                        last_item_edit_id: row.id,
                    }, () => {
                        that.forceUpdate();
                    })
                }

            }} >
                {default_value}
            </a>
        }
    }
    //更新
    requestUpdateData(row) {
        let that = this;
        let table_box = that.state.table_box;
        let table_layer = table_box.table_layer;    //表格层级
        let layer_count = table_layer.length;
        if (row.code) row.code = row.code.replace(/(^\s*)|(\s*$)/g, "");
        if (row.name) row.name = row.name.replace(/(^\s*)|(\s*$)/g, "");
        if (row.value) row.value = row.value.replace(/(^\s*)|(\s*$)/g, "");

        requestConfigUpdateDoc(layer_count, row).then(res => {
            message.success('修改成功');
            that.refreshList();
        }).catch(res => {
            message.error('修改失败:' + res.desc);
        })
    }


    //图片上传地址
    buildAdImageUpload() {
        let that = this;
        return {
            name: "file",
            listType: "text",
            className: "avatar-uploader",
            showUploadList: false,
            action: `${baseUrl}/mms/file/upload?dir=ad`,
            headers: {
                authorization: JSON.parse(localStorage.getItem("user")).authorization,
            },
            //上传文件改变时的状态
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    that.setState({ is_loading: true });
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    let errCode = response.errCode;
                    if (errCode === 0) {
                        let fileObj = info.file.originFileObj;
                        that.getBase64(fileObj, imageUrl => {

                            if (!info.file.response.data) {
                                message.error(`${info.file.name} 上传失败.保持网络连接，图片不能超过大小限制。`);
                                that.setState({ is_loading: false, });
                                return;
                            }
                            message.success(`上传成功`);
                            console.log('上传成功', info.file.response.data.fileUrl)
                            that.formRef.current.setFieldsValue({ 'value': info.file.response.data.fileUrl })
                            that.forceUpdate();
                        })
                    }
                    else {
                        let msg = response.msg;
                        message.error(`上传失败` + msg);
                    }
                }
                else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                }
            },
            //上传文件之前的钩子，参数为上传的文件
            beforeUpload(file) {
                // let isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                // if (!isJpgOrPng) {
                //     message.error('You can only upload JPG/PNG file!');
                // }
                // let isLt2M = file.size / 1024 / 1024 < 2;
                // if (!isLt2M) {
                //     message.error('Image must smaller than 2MB!');
                // }
                // return isJpgOrPng && isLt2M;
                return true;
            }
        }
    }

    getBase64(img, callback) {
        let reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
}