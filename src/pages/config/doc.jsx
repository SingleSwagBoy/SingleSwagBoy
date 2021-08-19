import React, { Component } from 'react';
import { Breadcrumb, Badge, Input, DatePicker, Form, Button, Tooltip, Table, Pagination, Modal, Upload, Image, Select, Alert, notification, message, Divider } from 'antd';
import {
    requestConfigAddDoc,                //配置列表-添加配置
    requestConfigDocList,               //配置列表-配置列表
    requestConfigDeleteDoc,             //配置列表-删除配置
    requestConfigUpdateDoc,             //配置列表-更新配置
    requestConfigDocKeyList,            //配置列表-配置文件Key列表
} from 'api'
import './doc_style.css'

const { Option } = Select;

export default class Doc extends Component {
    constructor(props) {
        super(props);
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
            modal_box: {
                title: '',
                is_show: false,
                formRef: null,      //数据映射
            },
            temp: true,
        }
    }

    render() {
        let { table_box, modal_box } = this.state;
        return (
            <div>
                <Divider orientation="left">
                    <Breadcrumb>
                        <Breadcrumb.Item>列表</Breadcrumb.Item>
                        {table_box.table_layer.map((item, index) => {
                            return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
                        })}
                    </Breadcrumb>
                </Divider>
                <Alert className="alert-box" message="配置详情列表" type="success" action={
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
                            <Button onClick={() => this.onItemShowModalClick(null)} type="primary" style={{ 'marginLeft': '10px' }} >新增</Button>
                        </Tooltip>
                    </div>
                }>
                </Alert>

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1000 }} />

                {
                    table_box.table_pages.totalCount !== 0 &&
                    <div className="pagination-box">
                        <Pagination current={table_box.table_pages.currentPage} total={table_box.table_pages.totalCount} pageSize={table_box.table_pages.pageSize}
                            onChange={(page, pageSize) => this.onPageChange(page, pageSize)} />
                    </div>
                }




                <Modal title={modal_box.title} visible={modal_box.is_show} forceRender={true} onOk={() => this.onModalOkClick()} onCancel={() => this.onModalCancelClick()}>
                    {/* 第一层 */}
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        {
                            table_box.table_layer.length == 0 &&
                            <div>
                                <Form.Item label="名称" name='name' rules={[{ required: true, message: '请输入名称' }]}>
                                    <Input className="input-wrapper-from" placeholder="请输入名称" />
                                </Form.Item>
                                <Form.Item label="编码" name='time' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Input className="input-wrapper-from" placeholder="请输入编码" />
                                </Form.Item>
                            </div>
                        }
                        {
                            table_box.table_layer.length == 1 &&
                            <div>
                                <Form.Item label="key名称" name='name' rules={[{ required: true, message: '请输入名称' }]}>
                                    <Input className="input-wrapper-from" placeholder="请输入名称" />
                                </Form.Item>
                                <Form.Item label="key编码" name='time' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Input className="input-wrapper-from" placeholder="请输入编码" />
                                </Form.Item>
                            </div>
                        }
                        {
                            table_box.table_layer.length == 2 &&
                            <div>
                                <Form.Item label="方案value" name='time' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Upload>上传图片</Upload>
                                </Form.Item>
                            </div>
                        }
                    </Form>
                </Modal>
            </div>
        )
    }

    componentDidMount() {
        this.initData();
        this.refreshList()
    }

    initData() {
        let that = this;
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
        let table_layer = table_box.table_layer;    //表格层级

        titles.push({ title: 'id', dataIndex: 'id', key: 'id', width: 100, });

        let layer_count = table_layer.length;
        if (layer_count === 0 || layer_count === 1) {
            titles.push({
                title: '文案名称', dataIndex: 'name', key: 'name', render: (rowValue, row, index) => {
                    return (
                        row.is_edit_name ?
                            // <Input defaultValue={row.name} onBlur={(e) => { row.name = e.target.value ;}} /> :
                            <Input defaultValue={row.name} onBlur={(e) => {
                                let that = this;
                                row.name = e.target.value;
                                that.requestUpdateData(row)
                            }} /> :

                            <Button type='link' onClick={() => { row.is_edit_name = true; this.forceUpdate() }} >{row.name}</Button>
                    )
                }
            });
            titles.push({
                title: '文案编码', dataIndex: 'code', key: 'code', render: (rowValue, row, index) => {
                    return (
                        row.is_edit ?
                            <Input defaultValue={row.code} onChange={(e) => { row.code = e.target.value }} /> :
                            <div>{row.code}</div>
                    )
                }
            });
        }
        else if (layer_count === 2) {
            titles.push({
                title: '参数', dataIndex: 'value', key: 'value', render: (rowValue, row, index) => {
                    return (
                        row.is_edit ?
                            <Input defaultValue={row.value} onChange={(e) => { row.value = e.target.value }} /> :
                            <div >{row.value}</div>
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
                            <Select defaultValue={row.type} style={{ width: 120 }} onChange={(select_id) => this.onItemTypeChange(select_id, row)}>
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
                        <Select defaultValue={row.status} style={{ width: 120 }} onChange={(select_id) => this.onItemStatusChanged(select_id, row)}>
                            {dict_status.map((item, index) => {
                                return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                            })}
                        </Select>
                    )
                }
            });
        }
        titles.push({
            title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right',
            render: (rowValue, row, index) => {
                let params_count = layer_count === 0 ? row.keyCount : layer_count === 1 ? row.valueCount : '';
                return (
                    <div>
                        {/* <Button size='small' type="primary" type="link" onClick={() => { }}>复制</Button> */}
                        {layer_count < 2 &&
                            <Badge count={params_count} size="small">
                                <Button size='small' type="primary" type="link" onClick={() => this.onItemManagerClick(row)}>管理</Button>
                            </Badge>
                        }
                        <Button size='small' type="primary" type="link" onClick={() => this.onItemEditClick(row)} style={{ marginLeft: 10 }}>{row.is_edit ? '保存' : '编辑'}</Button>
                        <Button size='small' type="primary" type="link" onClick={() => this.onItemDeleteClick(row)}>删除</Button>
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
        request_params.page = { currentPage: curr_page, pageSize: 1000, isPage: 9 };

        table_box.table_title = titles;
        that.setState({ table_box: table_box, });

        table_box.table_datas = [];

        requestConfigDocList(layer_count, request_params).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0) {
                table_box.table_datas = res.data.data;
                table_box.table_pages = {
                    currentPage: res.data.currentPage,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount,
                };

                that.setState({ table_box: table_box, });
            }
        })
    }

    //管理按钮被点击 跳转到下一层数据
    onItemManagerClick(item) {
        let that = this;
        let table_box = that.state.table_box;
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
        let id = item.id;
        console.log(item);
    }

    //刷新列表被点击
    onRefreshListClick() {
        let that = this;
        that.refreshList();
    }
    //新增文案按钮被点击
    onItemShowModalClick(item) {
        let that = this;
        let modal_box = that.state.modal_box;
        modal_box.is_show = true;
        modal_box.title = item ? '编辑' : '新增';
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

    //弹出框OK被点击
    onModalOkClick() {

    }
    //弹出框Cancel被点击
    onModalCancelClick() {
        let that = this;
        let modal_box = that.state.modal_box;
        modal_box.is_show = false;

        that.setState({ modal_box: modal_box })
    }

    //类型变更
    onItemTypeChange(select_id, row) {
        let that = this;
        row.type = select_id;
        that.requestUpdateData(row);
    }

    //状态变更
    onItemStatusChanged(select_id, row) {
        let that = this;
        row.status = select_id;
        that.requestUpdateData(row);
    }

    //更新
    requestUpdateData(row) {
        let that = this;
        let table_box = that.state.table_box;
        let table_layer = table_box.table_layer;    //表格层级
        let layer_count = table_layer.length;

        requestConfigUpdateDoc(layer_count, row).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0) {
                message.success('修改成功');
                that.refreshList();
            } else {
                message.error('修改失败:' + res.data.message);
            }
        })
    }

}