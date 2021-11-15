/*
 * @Author: HuangQS
 * @Date: 2021-09-10 14:50:06
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-02 18:52:50
 * @Description: 菜单栏图片配置页
 */


import React, { Component } from 'react'
import { Input, InputNumber, Form, Select, DatePicker, Button, Table, Switch, Modal, Image, Alert, message } from 'antd';
import { MyImageUpload, MyTagTypes, MySyncBtn } from '@/components/views.js';
import moment from 'moment';
import '@/style/base.css';

import {
    requestConfigMenuImageList,                         //菜单栏配置 列表
    requestConfigMenuImageCreate,                       //菜单栏配置 新增
    requestConfigMenuImageEidt,                         //菜单栏配置 编辑
    requestConfigMenuImageDelete,                       //菜单栏配置 删除
    requestConfigMenuImageChangeState,                  //菜单栏配置 修改状态
    requestAdTagList,                                   //用户设备标签
} from 'api';

let { TextArea } = Input;
let { Option } = Select;
let { RangePicker } = DatePicker;

export default class MenuImagePage extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            ref_tag_types: null,
            dict_user_tags: [],                         //字典 用户标签
            dict_delivery_types: [],                    //字典 投放类型 定向非定向
            table_box: {
                table_title: [],
                table_datas: [],
            },
            modal_box: {
                is_show: false,
                title: '',
            },
            page:1,
            pageSize:10,
            total:0
        }
    }


    render() {
        let that = this;
        let { table_box, modal_box } = that.state;

        return (
            <div>
                <Alert className="alert-box" message="菜单栏图片配置" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={5} name={'同步缓存'} />
                    </div>
                } />

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '75vh' }}
                pagination={{
                    current: this.state.page,
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onChange: this.changeSize,
                }}
                />

                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" onCancel={() => that.onModalCancelClick()}
                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >确定</Button>
                    ]}
                >
                    <MyTagTypes is_old_tag_resouce={true} union_type='unionType' tag_name='tag' delivery_name='deliveryType' onRef={(ref) => that.onTagTypesRefCallback(ref)} />

                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input className="base-input-wrapper" disabled />
                                    </Form.Item>
                                }

                                <Form.Item label="名称" name='title' rules={[{ required: true }]}>
                                    <Input className="base-input-wrapper" placeholder="请输入名称" />
                                </Form.Item>

                                <Form.Item label="排序" name='sort' rules={[{ required: true }]}>
                                    <InputNumber className="base-input-wrapper" min={1} max={9999999} placeholder="数字越小排序越靠前" />
                                </Form.Item>

                                <Form.Item label="时间范围" name='time' rules={[{ required: true }]}>
                                    <RangePicker showTime format={'YYYY-MM-DD HH:mm:ss'} />
                                </Form.Item>
                                <Form.Item label="状态" name='status' rules={[{ required: true }]} valuePropName='checked'>
                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                </Form.Item>

                                <Form.Item label="字体大小" name='fontSize' >
                                    <Input className="base-input-wrapper" placeholder="请输入字体大小" />
                                </Form.Item>
                                <Form.Item label="字体颜色" name='fontColor' >
                                    <Input className="base-input-wrapper" placeholder="请输入字体颜色 形如：#F1F2F3" />
                                </Form.Item>
                                <Form.Item label="倒计时背景" name='djsBackgroundColor' >
                                    <Input className="base-input-wrapper" placeholder="请输入倒计时背景颜色 形如：#F1F2F3" />
                                </Form.Item>

                                <Form.Item label="开启活动倒计时" name='hddjs' rules={[{ required: true }]} valuePropName='checked'>
                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                </Form.Item>
                                <Form.Item label="显示距今结束时间" name='jljr' rules={[{ required: true }]} valuePropName='checked'>
                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                </Form.Item>

                                {/* <Form.Item label="数据上报关键字" name='name'>
                                    <Input  className="base-input-wrapper"placeholder="数据上报关键字" />
                                </Form.Item> */}

                                <Form.Item label="背景图"  >
                                    <Form.Item name='backgroundImage' >
                                        <MyImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('backgroundImage', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('backgroundImage')} />
                                    </Form.Item>
                                    <Form.Item name='backgroundImage' >
                                        <TextArea className="base-input-wrapper" placeholder="请上传背景图" onBlur={(e) => that.onInputBlurCallback("backgroundImage", e)} />
                                    </Form.Item>
                                </Form.Item>


                                <Form.Item label="焦点图片"  >
                                    <Form.Item name='focus_url' >
                                        <MyImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('focus_url', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('focus_url')} />
                                    </Form.Item>
                                    <Form.Item name='focus_url' >
                                        <TextArea className="base-input-wrapper" placeholder="请上传背景图" onBlur={(e) => that.onInputBlurCallback("focus_url", e)} />
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item label="未选中焦点图片"  >
                                    <Form.Item name='no_focus_url' >
                                        <MyImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('no_focus_url', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('no_focus_url')} />
                                    </Form.Item>
                                    <Form.Item name='no_focus_url' >
                                        <TextArea className="base-input-wrapper" placeholder="请上传未选中焦点图片" onBlur={(e) => that.onInputBlurCallback("no_focus_url", e)} />
                                    </Form.Item>
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
        //用户标签
        let params={
            page:{
                pageSize:9999,
                currentPage:1
            }
        }
        requestAdTagList(params).then(res => {
            let datas = res.data;
            let tags = [];
            // tags.push({ id: -1, code: 'default', name: '默认', });
            for (let i = 0, len = datas.length; i < len; i++) {
                let item = datas[i];
                tags.push(item);
            }

            that.setState({
                dict_user_tags: tags
            }, () => {
                that.initTitle();
            });
        });
    }
    initTitle() {
        let that = this;
        let dict_user_tags = that.state.dict_user_tags;

        let table_title = [
            { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
            { title: '名字', dataIndex: 'title', key: 'title', width: 200,ellipsis: true, },
            // { title: '数据上报key', dataIndex: 'name', key: 'name', width: 200, },
            {
                title: '标签', dataIndex: 'tag', key: 'tag', width: 300,
                render: (rowValue, row, index) => {
                    return <Select defaultValue={row.tag} mode="multiple" style={{ width: '100%' }} placeholder="请选择用户设备标签" disabled>
                        {dict_user_tags.map((item, index) => (
                            <Option value={item.code.toString()} key={item.code}>{item.name}</Option>
                        ))}
                    </Select>
                }
            },
            { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
            {
                title: '背景图片', dataIndex: 'backgroundImage', key: 'backgroundImage', width: 120,
                render: (rowValue, row, index) => { return <Image width={60} height={60} src={row.backgroundImage} /> }
            },
            {
                title: '聚焦图片', dataIndex: 'focus_url', key: 'focus_url', width: 120,
                render: (rowValue, row, index) => { return <Image width={60} height={60} src={row.focus_url} /> }
            },
            {
                title: '非聚焦图片', dataIndex: 'no_focus_url', key: 'no_focus_url', width: 120,
                render: (rowValue, row, index) => { return <Image width={60} height={60} src={row.no_focus_url} /> }
            },
            {
                title: '时间范围', dataIndex: 'time', key: 'time', width: 400,
                render: (rowValue, row, index) => {
                    let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                    let open_time = moment(row.startTime).format(dateFormat)
                    let stop_time = moment(row.endTime).format(dateFormat)

                    return (<RangePicker showTime disabled defaultValue={[moment(open_time, dateFormat), moment(stop_time, dateFormat)]} format={dateFormat} />);
                }
            },
            {
                title: '状态', dataIndex: 'status', key: 'status', width: 80,
                render: (rowValue, row, index) => {
                    return (<Switch defaultChecked={row.status === 1 ? true : false} checkedChildren="有效" unCheckedChildren="无效" onChange={(checked) => this.onStateChange(row, 'status', checked)} />)
                }
            },
            {
                title: '开启活动倒计时', dataIndex: 'hddjs', key: 'hddjs', width: 140,
                render: (rowValue, row, index) => {
                    return (<Switch defaultChecked={row.hddjs === 1 ? true : false} checkedChildren="是" unCheckedChildren="否" onChange={(checked) => this.onStateChange(row, 'hddjs', checked)} />)
                }
            },
            {
                title: '显示距今结束时间', dataIndex: 'jljr', key: 'jljr', width: 150,
                render: (rowValue, row, index) => {
                    return (<Switch defaultChecked={row.jljr === 1 ? true : false} checkedChildren="是" unCheckedChildren="否" onChange={(checked) => this.onStateChange(row, 'jljr', checked)} />)
                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' onClick={() => this.onItemCopyClick(row)}>复制</Button>
                            <Button size='small' onClick={() => this.onItemEditClick(row)} style={{ marginLeft: 3 }}>编辑</Button>
                            <Button size='small' onClick={() => this.onItemDeleteClick(row)} style={{ marginLeft: 3 }}>删除</Button>
                        </div>
                    );
                }
            },
        ]

        let table_box = that.state.table_box;
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
                page:{
                    currentPage:this.state.page,
                    pageSize:this.state.pageSize
                }
            };
            requestConfigMenuImageList(obj)
                .then(res => {
                    console.log(res);
                    let datas = res.data.data;
                    for (let i = 0, len = datas.length; i < len; i++) {
                        let item = datas[i];

                        let tag = item.tag;
                        if (tag) {
                            item.tag = tag.split(',');
                        } else {
                            item.tag = [];
                        }
                    }
                    table_box.table_datas = datas;
                    that.setState({
                        table_box: table_box,
                        total:res.data.page.totalCount
                    })
                })
        })
    }

    //状态变更
    onStateChange(row, key, checked) {
        let that = this;
        //老状态
        if (key === 'status') {
            let obj = {
                ids: row.id
            }
            requestConfigMenuImageChangeState(obj)
                .then(res => {
                    that.setState({
                        modal_box: {
                            is_show: false,
                            title: '',
                        }
                    }, () => {
                        that.refreshList();
                    })
                })
                .catch(res => { })
        }
        //开启活动倒计时 显示距今结束时间	
        else {
            let value = checked === true ? 1 : 0;
            row[key] = value;
            let tag = row.tag;
            if (tag) {
                if (tag.constructor === Array) {
                    row.tag = tag.join(',');
                }
            }

            requestConfigMenuImageEidt(row)
                .then(res => {
                    that.setState({
                        modal_box: {
                            is_show: false,
                            title: '',
                        }
                    }, () => {
                        that.refreshList();
                    })
                })
                .catch(res => {
                    message.error(res.desc);
                    console.log(res);
                })
        }
    }


    //表格数据被点击
    onItemEditClick(item) {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                title: '修改',
            }
        }, () => {

            let obj = Object.assign({}, item);
            obj.time = [
                moment(obj.startTime),
                moment(obj.endTime)
            ]
            obj.status = obj.status === 1 ? true : false;
            that.formRef.current.resetFields();
            that.formRef.current.setFieldsValue(obj);
            that.forceUpdate();

            setTimeout(() => {
                let ref_tag_types = that.state.ref_tag_types;
                ref_tag_types.pushData(obj);
            }, 10)
        })
    }

    //表格数据删除按钮被点击
    onItemDeleteClick(item) {
        let that = this;
        Modal.confirm({
            title: '删除数据',
            content: '确认删除这一条数据？',
            onOk: () => {
                requestConfigMenuImageDelete({ ids: item.id })
                    .then(res => {
                        message.success('删除成功')
                        that.refreshList();
                    })
                    .catch(res => {

                    })
            }
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

            setTimeout(() => {
                let ref_tag_types = that.state.ref_tag_types;
                if (ref_tag_types) ref_tag_types.pushData({});
            }, 10)

            that.formRef.current.resetFields();
        })
    }
    //获取上传文件
    getUploadFileUrl(type, file, newItem) {
        let that = this;


        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;

        that.formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    //获取上传文件图片地址 
    getUploadFileImageUrlByType(type) {
        let that = this;
        let image_url = that.formRef.current.getFieldValue(type);
        return image_url ? image_url : '';
    }
    //输入框失去焦点监听
    onInputBlurCallback(type, e) {
        let that = this;
        let obj = {};
        obj[type] = e.target.value;
        that.formRef.current.setFieldsValue(obj);
        that.forceUpdate();
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

    //复制按钮被点击
    onItemCopyClick(item) {
        let that = this;
        let obj = Object.assign({}, item);
        delete obj.id;

        obj.title = `${obj.title} ${new Date().getTime()}`
        let tag = obj.tag;

        if (tag) {
            if (tag.constructor === Array) {
                if (tag.length <= 0) {
                    delete obj.tag;
                } else {
                    obj.tag = tag.join(',');
                }
            }
        } else {
            delete obj.tag;
        }
        that.submitData(obj);
    }

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
        let ref_tag_types = that.state.ref_tag_types;
        let value = that.formRef.current.getFieldsValue();
        let obj = Object.assign({}, value, ref_tag_types.loadData());
        that.submitData(obj);
    }


    //上传数据
    submitData(obj) {
        let that = this;
        if (!obj.title) {
            message.error('请填写名称');
            return;
        }
        obj.name = obj.title;

        let sort = obj.sort;
        if (!sort) {
            message.error('请填写排序');
            return;
        }

        if (obj.jljr === true) obj.jljr = 1;
        else if (obj.jljr === false) obj.jljr = 0;
        if (obj.hddjs === true) obj.hddjs = 1;
        else if (obj.jlhddjsjr === false) obj.hddjs = 0;
        //老数据状态 1：有效 2：无效
        if (obj.status === true) obj.status = 1;
        else if (obj.status === false) obj.status = 2;

        let time = obj.time;
        if (time) {
            try {
                obj.startTime = time[0].valueOf();
                obj.endTime = time[1].valueOf();
                delete obj.time;
            } catch {
                message.error('时间错误')
                return;
            }
        }
        if (!obj.startTime || !obj.startTime) {
            message.error('请填写开始结束时间')
            return;
        }


        for (let key in obj) {
            let item = obj[key];
            if (item === undefined) {
                delete obj[key];
            }
        }

        // 标签列表
        let tag = obj.tag;
        if (tag) {
            if (tag.constructor === Array) {
                if (tag.length > 0) {
                    obj.tag = tag.join(',');
                } else {
                    delete obj.tag;
                }
            } else {
                if (tag.length <= 0) {
                    delete obj.tag;
                }
            }
        } else {
            delete obj.tag;
        }

        //字体
        let fontSize = obj.fontSize;
        if (fontSize) {
            try {
                obj.fontSize = parseInt(obj.fontSize);
            } catch (e) {
                delete obj.fontSize;
            }
        } else {
            delete obj.fontSize;
        }



        let id = obj.id;
        (id ? requestConfigMenuImageEidt(obj) : requestConfigMenuImageCreate(obj))
            .then(res => {
                message.success('操作成功');
                that.setState({
                    modal_box: {
                        is_show: false,
                        title: '',
                    }
                }, () => {
                    if (that.formRef && that.formRef.current) {
                        that.formRef.current.resetFields();
                    }
                    if(!id){
                        this.setState({
                            page:1
                        },()=>{
                            that.refreshList();
                        })
                    }else{
                        that.refreshList();
                    }
                   
                })
            })
            .catch(res => {
                message.error(res.desc);
            })
    }

    //标签类型实例回调
    onTagTypesRefCallback(ref) {
        let that = this;
        that.setState({
            ref_tag_types: ref,
        })
    }

    changeSize = (page, pageSize) => {
        // 分页获取
        this.setState({
            page,
            pageSize
        }, () => {
            this.refreshList()
        })

    }
}
