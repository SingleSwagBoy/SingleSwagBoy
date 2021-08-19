import React, { Component } from 'react';
import { Breadcrumb, Badge, Input, Form, Button, Tooltip, Table, Pagination, Modal, Upload, Image, Select, Alert, notification, message, Divider } from 'antd';
import {
    baseUrl,
    requestConfigAddDoc,                //配置列表-添加配置
    requestConfigDocList,               //配置列表-配置列表
    requestConfigDeleteDoc,             //配置列表-删除配置
    requestConfigUpdateDoc,             //配置列表-更新配置
} from 'api'
import './doc_style.css'
const { Option } = Select;

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
            //弹出框
            modal_box: {
                is_show: false,
                title: '新增',
            },
            temp: true,
        }
    }

    render() {
        let { table_box, modal_box } = this.state;
        let that = this;
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
                            <Button onClick={() => this.onItemShowModalClick()} type="primary" style={{ 'marginLeft': '10px' }} >新增</Button>
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
                {/* 弹出框 多层数据新增弹框 */}
                <Modal title={modal_box.title} visible={modal_box.is_show} forceRender={true} width={800} onOk={() => this.onModalOkClick()} onCancel={() => this.onModalCancelClick()}>
                    {/* 第一层 */}
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        {
                            table_box.table_layer.length === 0 &&
                            <div>
                                <Form.Item label="名称" name='name' rules={[{ required: true, message: '请输入名称' }]}>
                                    <Input className="input-wrapper-from" placeholder="请输入名称" />
                                </Form.Item>
                                <Form.Item label="编码" name='code' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Input className="input-wrapper-from" placeholder="请输入编码" />
                                </Form.Item>
                            </div>
                        }
                        {
                            table_box.table_layer.length === 1 &&
                            <div>
                                <Form.Item label="key名称" name='name' rules={[{ required: true, message: '请输入名称' }]}>
                                    <Input className="input-wrapper-from" placeholder="请输入名称" />
                                </Form.Item>
                                <Form.Item label="key编码" name='code' rules={[{ required: true, message: '请输入编码' }]}  >
                                    <Input className="input-wrapper-from" placeholder="请输入编码" />
                                </Form.Item>
                            </div>
                        }
                        {
                            table_box.table_layer.length === 2 &&
                            <div>
                                <Form.Item label="快捷上传"  >
                                    <Upload  {...this.buildAdImageUpload()}>
                                        <Button>快捷上传</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item label="参数" name='value' rules={[{ required: true, message: '请输入参数' }]}>
                                    <Input className="input-wrapper-from" placeholder="请输入参数" onBlur={(e) => {
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
                    return (that.renderTitleItem(row, 'is_edit_name', 'name'))
                }
            });
            titles.push({
                title: '文案编码', dataIndex: 'code', key: 'code', render: (rowValue, row, index) => {
                    return (that.renderTitleItem(row, 'is_edit_code', 'code'))
                }
            });
        }
        else if (layer_count === 2) {
            titles.push({
                title: '参数', dataIndex: 'value', key: 'value', render: (rowValue, row, index) => {
                    return (that.renderTitleItem(row, 'is_edit_value', 'value'))
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
                            <Select defaultValue={row.type} style={{ width: 220 }} onChange={(select_id) => this.onItemTypeChange(select_id, row)}>
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
                        <Select defaultValue={row.status} style={{ width: 220 }} onChange={(select_id) => this.onItemStatusChanged(select_id, row)}>
                            {dict_status.map((item, index) => {
                                return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                            })}
                        </Select>
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
        request_params.page = { currentPage: curr_page, pageSize: 30, isPage: 1 };

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


        Modal.info({
            title: '删除',
            content: (
                <p>确定删除【{item.name}】这条数据？</p>
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
                    let errCode = res.data.errCode;
                    if (errCode === 0) {
                        message.success('数据删除成功');
                        that.refreshList();
                    } else {
                        message.error('数据删除失败:', res.data.msg);
                    }
                })
            },
        });

        // requestConfigDeleteDoc
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

        let modal_box = that.state.modal_box;
        modal_box.is_show = true;
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

        console.log(object);

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


        requestConfigAddDoc(step, object).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0) {
                message.success('数据添加成功');
                //隐藏弹出框
                let modal_box = that.state.modal_box;
                modal_box.is_show = false;
                that.setState({ modal_box: modal_box })
                that.refreshList();
            } else {
                message.error('数据添加失败：' + res.data.meg)
            }
        })




    }
    //弹出框Cancel被点击
    onModalCancelClick() {
        let that = this;
        let modal_box = that.state.modal_box;
        modal_box.is_show = false;

        that.setState({ modal_box: modal_box })
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
     * @param {*} row 
     * @param {*} flag_key 
     * @param {*} param_key 
     * @returns 
     */
    renderTitleItem(row, flag_key, param_key) {
        let that = this;
        let is_edit = row[flag_key];
        let default_value = row[param_key];

        //编辑形态 失去焦点 更新数据
        if (is_edit) {
            return <Input defaultValue={default_value} onBlur={(e) => {
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
            return <Button type='link' onClick={() => { row[flag_key] = true; that.forceUpdate(); }} >
                {default_value}
            </Button>
        }
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
                let isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG file!');
                }
                let isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            }
        }
    }

    getBase64(img, callback) {
        let reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
}