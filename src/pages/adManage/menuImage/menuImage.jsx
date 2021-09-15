/*
 * @Author: HuangQS
 * @Date: 2021-09-10 14:50:06
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-15 14:52:36
 * @Description: 菜单栏图片配置页
 */


import React, { Component } from 'react'
import { Input, InputNumber, Form, Select, DatePicker, Button, Radio, Table, Pagination, Switch, Modal, Image, Alert, notification, message, Divider } from 'antd';
import moment from 'moment';
import ImageUpload from "@/components/ImageUpload/index" //图片组件
import SyncBtn from "@/components/syncBtn/syncBtn.jsx"


import {
    requestConfigMenuImageList,                         //菜单栏配置 列表
    requestConfigMenuImageCreate,                       //菜单栏配置 新增
    requestConfigMenuImageEidt,                         //菜单栏配置 编辑
    requestConfigMenuImageDelete,                       //菜单栏配置 删除
    requestConfigMenuImageChangeState,                  //菜单栏配置 修改状态
    requestDeliveryTypes,                               //投放类型
    getUserTag,                                         //用户设备标签

} from 'api';

let { Option } = Select;
let { RangePicker } = DatePicker;

export default class MenuImagePage extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            dict_user_tags: [],                         //字典 用户标签
            dict_delivery_types: [],                    //字典 投放类型 定向非定向
            table_box: {
                table_title: [],
                table_datas: [],
                table_columns: [
                    { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
                    { title: '名字', dataIndex: 'title', key: 'title', width: 200, },
                    { title: '数据上报key', dataIndex: 'name', key: 'name', width: 200, },
                    {
                        title: '标签', dataIndex: 'tag', key: 'tag', width: 300,
                        render: (rowValue, row, index) => {
                            return <Select defaultValue={row.tag} style={{ width: '100%' }} placeholder="请选择用户设备标签" disabled>
                                {this.state.dict_user_tags.map((item, index) => (
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
                        title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 180,
                        render: (rowValue, row, index) => {
                            return (
                                <div>
                                    <Button size='small' onClick={() => this.onItemEditClick(row)}>编辑</Button>
                                    <Button size='small' onClick={() => this.onItemDeleteClick(row)} style={{ marginLeft: 3 }}>删除</Button>
                                </div>
                            );
                        }
                    },
                ]
            },
            modal_box: {
                is_show: false,
                title: '',
                select_item: {},
            },
        }
    }

    componentDidMount() {
        let that = this;
        that.initData();
    }

    render() {
        let that = this;
        let { table_box, modal_box, dict_user_tags, dict_delivery_types } = that.state;
        let input_width_size = 340;

        return (
            <div>

                <Alert className="alert-box" message="菜单栏图片配置" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <SyncBtn type={5} name={'同步缓存'} />
                    </div>

                } />

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} columns={table_box.table_columns} pagination={false} scroll={{ x: 1500 }} />

                <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" onCancel={() => that.onModalCancelClick()}

                    footer={[
                        <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                        <Button onClick={() => that.onModalConfirmClick()} >确定</Button>
                    ]}
                >
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        {
                            that.formRef && that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue('id') &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                        <Input style={{ width: input_width_size }} disabled />
                                    </Form.Item>
                                }

                                <Form.Item label="名称" name='title' rules={[{ required: true }]}>
                                    <Input style={{ width: input_width_size }} placeholder="请输入名称" />
                                </Form.Item>

                                <Form.Item label="排序" name='sort' rules={[{ required: true }]}>
                                    <InputNumber style={{ width: input_width_size }} min={1} max={9999999} placeholder="数字越小排序越靠前" />
                                </Form.Item>

                                <Form.Item label="时间范围" name='time' rules={[{ required: true }]}>
                                    <RangePicker showTime format={'YYYY-MM-DD HH:mm:ss'} />
                                </Form.Item>
                                <Form.Item label="状态" name='status' rules={[{ required: true }]} valuePropName='checked'>
                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                </Form.Item>

                                <Form.Item label="开启活动倒计时" name='hddjs' rules={[{ required: true }]} valuePropName='checked'>
                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                </Form.Item>
                                <Form.Item label="显示距今结束时间" name='jljr' rules={[{ required: true }]} valuePropName='checked'>
                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                </Form.Item>


                                <Form.Item label="数据上报关键字" name='name'>
                                    <Input style={{ width: input_width_size }} placeholder="数据上报关键字" />
                                </Form.Item>

                                <Form.Item label="标签" name='tag' >
                                    <Select style={{ width: input_width_size }} showSearch placeholder="请选择用户设备标签" >
                                        {dict_user_tags.map((item, index) => (
                                            <Option value={item.code.toString()} key={item.code}>{item.code}-{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item label='投放类型' name='deliveryType'>
                                    <Radio.Group>
                                        {dict_delivery_types.map((item, index) => {
                                            return <Radio value={item.key} key={index}> {item.value}</Radio>
                                        })}
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="背景图"  >
                                    <Form.Item name='backgroundImage' >
                                        <ImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('backgroundImage', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('backgroundImage')} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Input style={{ width: input_width_size }} placeholder="请上传背景图" value={that.getUploadFileImageUrlByType('backgroundImage')} />
                                    </Form.Item>
                                </Form.Item>


                                <Form.Item label="焦点图片"  >
                                    <Form.Item name='focus_url' >
                                        <ImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('focus_url', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('focus_url')} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Input style={{ width: input_width_size }} placeholder="请上传背景图" value={that.getUploadFileImageUrlByType('focus_url')} />
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item label="未选中焦点图片"  >
                                    <Form.Item name='no_focus_url' >
                                        <ImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('no_focus_url', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('no_focus_url')} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Input style={{ width: input_width_size }} placeholder="请上传未选中焦点图片" value={that.getUploadFileImageUrlByType('no_focus_url')} />
                                    </Form.Item>
                                </Form.Item>
                            </div>
                        }
                    </Form>
                </Modal>
            </div>
        )
    }

    initData() {
        let that = this;

        //用户标签
        getUserTag().then(res => {
            let datas = res.data.data;
            let tags = [];
            // tags.push({ id: -1, code: 'default', name: '默认', });
            for (let i = 0, len = datas.length; i < len; i++) {
                let item = datas[i];
                tags.push(item);
            }
            //投放类型
            requestDeliveryTypes().then(res => {
                that.setState({
                    dict_delivery_types: res,
                })
            });


            that.setState({
                dict_user_tags: tags
            }, () => {
                that.refreshList();
            });
        });
    }

    refreshList() {
        let that = this;
        let { table_box } = that.state;

        let obj = {};

        that.setState({
            table_box: [],
        }, () => {
            requestConfigMenuImageList(obj)
                .then(res => {
                    console.log(res);
                    table_box.table_datas = res.data.data;

                    that.setState({
                        table_box: table_box,
                    })
                })
                .catch(res => {

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
            that.forceUpdate()
            that.formRef.current.resetFields();

            let obj = Object.assign({}, item);
            obj.time = [
                moment(obj.startTime),
                moment(obj.endTime)
            ]

            obj.status = obj.status === 1 ? true : false;

            console.log(obj)

            that.formRef.current.setFieldsValue(obj);
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
        let value = that.formRef.current.getFieldsValue();
        if (value.deliveryType == 0) delete value.deliveryType;


        let id = value.id;

        let tag = value.tag;
        if (tag) {
            if (tag.constructor === Array) {
                value.tag = tag.join(',');
            }
        }

        let sort = value.sort;
        if (!sort) {
            message.error('请填写排序');
            return;
        }


        if (value.jljr.constructor === Boolean)  value.jljr = value.jljr === true ? 1 : 0;
        if (value.hddjs.constructor === Boolean)  value.hddjs = value.hddjs === true ? 1 : 0;
        if (value.status.constructor === Boolean)  value.status = value.status === true ? 1 : 2;    //老数据状态 1：有效 2：无效

        let time = value.time;
        if (!time) {
            message.error('请填写开始结束时间')
            return
        } else {
            try {
                value.startTime = time[0].valueOf();
                value.endTime = time[1].valueOf();
            } catch {
                message.error('时间错误')
                return;
            }
        }

        (id ? requestConfigMenuImageEidt(value) : requestConfigMenuImageCreate(value))
            .then(res => {
                that.setState({
                    modal_box: {
                        is_show: false,
                        title: '',
                    }
                }, () => {
                    that.formRef.current.resetFields();
                    that.refreshList();
                })
            })
            .catch(res => {
                message.error(res.desc);
                console.log(res);
            })
    }


}