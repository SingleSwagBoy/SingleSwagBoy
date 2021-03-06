/*
 * @Author: HuangQS
 * @Date: 2021-09-10 14:50:06
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-12-24 15:19:18
 * @Description: 菜单栏图片配置页
 */


import React, { Component } from 'react'
import { Input, InputNumber, Form, Select, DatePicker, Button, Table, Switch, Modal, Image, Alert, message, Divider, Space } from 'antd';
import { MyImageUpload, MyTagTypes, MySyncBtn } from '@/components/views.js';
import moment from 'moment';
import '@/style/base.css';
import './index.css'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import {
    requestConfigMenuImageList,                         //菜单栏配置 列表
    requestConfigMenuImageCreate,                       //菜单栏配置 新增
    requestConfigMenuImageEidt,                         //菜单栏配置 编辑
    requestConfigMenuImageDelete,                       //菜单栏配置 删除
    requestConfigMenuImageChangeState,                  //菜单栏配置 修改状态
    requestNewAdTagList,                                   //用户设备标签
    requestProductSkuList,                              //菜单栏配置 获取sku 套餐列表
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
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    // console.log(option.children,"option.children")
                    if(option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0){
                        return option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }else{
                        return option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            page: 1,
            pageSize: 50,
            total: 0,
            positions: [{ key: 1, value: "左上" }, { key: 2, value: "左下" }, { key: 3, value: "中心" }, { key: 4, value: "右上" }, { key: 5, value: "右下" }, { key: 6, value: "垂直居中" }, { key: 7, value: "横向居中" }],
            activeKey: 0,
            rechargeList: [],
        }
    }


    render() {
        let that = this;
        let { table_box, modal_box, positions, activeKey, rechargeList } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="菜单栏图片配置" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onCreateClick()} >新增配置</Button>
                        <MySyncBtn type={5} name={'同步缓存'} />
                    </div>
                } />

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} scroll={{ x: 1500, y: '75vh' }}
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
                    {/* <MyTagTypes is_old_tag_resouce={true} tag_name='tag' union_type="union_type" delivery_name="delivery_name"  onRef={(ref) => that.onTagTypesRefCallback(ref)} /> */}
                    <MyTagTypes is_old_tag_resouce={false} tag_name='tag' onRef={(ref) => that.onTagTypesRefCallback(ref)} />

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
                                <Divider orientation="left">续费弹窗配置</Divider>
                                <Form.Item label="开机续费弹窗"  >
                                    <Form.Item name='powerOnRenewWindow' >
                                        <MyImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('powerOnRenewWindow', file, newItem) }}
                                            imageUrl={that.getUploadFileImageUrlByType('powerOnRenewWindow')} />
                                    </Form.Item>
                                    <Form.Item name='powerOnRenewWindow' >
                                        <TextArea className="base-input-wrapper" placeholder="请上传开机续费弹窗图片" onBlur={(e) => that.onInputBlurCallback("powerOnRenewWindow", e)} />
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="续费弹窗图片宽" name="renewWindowWidth">
                                    <Input className='base-input-wrapper' addonBefore="宽" placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                                <Form.Item label="续费弹窗图片高" name="renewWindowHeight">
                                    <Input className='base-input-wrapper' addonBefore="高" placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                                <Form.Item label="位置" name="position">
                                    <Select className="base-input-wrapper" showSearch placeholder='请选择状态'>
                                        {positions.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="横向偏移量" name="xOffset">
                                    <Input className='base-input-wrapper' placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                                <Form.Item label="纵向偏移量" name="yOffset">
                                    <Input className='base-input-wrapper' placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                                <Divider orientation="left">套餐关联</Divider>
                                <Form.Item
                                    label=""
                                    wrapperCol={{ offset: 6, span: 16 }}
                                >
                                    <Form.List name="productList">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        新增套餐关联
                                                    </Button>
                                                </Form.Item>
                                                <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                    {
                                                        fields.map((field, index) => (
                                                            <div style={{ position: "relative" }} key={field.key}>
                                                                <Form.Item {...field} name={[field.name, 'pCode']} fieldKey={[field.fieldKey, 'pCode']}>
                                                                    <Select
                                                                        placeholder="请选择支付套餐" style={{ minWidth: "200px" }} className={`${this.state.activeKey == index && "isActivite"}`}
                                                                        onClick={() => {
                                                                            this.setState({ activeKey: index })
                                                                            this.forceUpdate()
                                                                        }}
                                                                        {...this.state.selectProps}
                                                                    >
                                                                        {rechargeList.map((item, index) => {
                                                                            return <Option value={item.skuCode} key={item.skuCode}>{item.name}{item.skuCode}</Option>
                                                                        })}
                                                                    </Select>
                                                                </Form.Item>
                                                                {/* <div></div> */}
                                                                <MinusCircleOutlined onClick={() => {
                                                                    remove(field.name)
                                                                    if (index > 0) {
                                                                        this.setState({ activeKey: index - 1 })
                                                                    } else {
                                                                        this.setState({ activeKey: 0 })
                                                                    }
                                                                }} style={{ position: "absolute", right: 0, top: "10px" }} />
                                                            </div>

                                                        ))
                                                    }
                                                </div>

                                                {fields.map((field, index) => (
                                                    <>
                                                        {
                                                            this.state.activeKey == index && that.formRef && that.formRef.current &&
                                                            <Space key={field.key} align="baseline" style={{ border: "1px dashed red", flexWrap: "wrap", padding: "10px 0" }}>
                                                                <Form.Item {...field} label="字体大小" name={[field.name, 'fontSize']} fieldKey={[field.fieldKey, 'fontSize']} rules={[{ required: true, message: '字体大小' }]}>
                                                                    <InputNumber min={0} placeholder="请输入字体大小" />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="字体颜色" name={[field.name, 'fontColor']} fieldKey={[field.fieldKey, 'fontColor']} rules={[{ required: true, message: '字体颜色' }]}>
                                                                    <Input />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="倒计时背景" name={[field.name, 'djsBackgroundColor']} fieldKey={[field.fieldKey, 'djsBackgroundColor']} rules={[{ required: true, message: '倒计时背景' }]}>
                                                                    <Input />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="开启活动倒计时" name={[field.name, 'hddjs']} fieldKey={[field.fieldKey, 'hddjs']} valuePropName='checked'>
                                                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                                                </Form.Item>
                                                                <Form.Item {...field} label="显示距今结束时间" name={[field.name, 'jljr']} fieldKey={[field.fieldKey, 'jljr']} valuePropName='checked'>
                                                                    <Switch checkedChildren="是" unCheckedChildren="否" />
                                                                </Form.Item>
                                                                <Form.Item label="背景图"  >
                                                                    <Form.Item name={[field.name, 'backgroundImage']} fieldKey={[field.fieldKey, 'backgroundImage']} >
                                                                        <MyImageUpload
                                                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('backgroundImage', file, newItem, index, "list") }}
                                                                            imageUrl={that.getUploadFileImageUrlByType('backgroundImage', index, "list")} />
                                                                    </Form.Item>
                                                                    <Form.Item name={[field.name, 'backgroundImage']} fieldKey={[field.fieldKey, 'backgroundImage']} >
                                                                        <TextArea className="base-input-wrapper" placeholder="请上传背景图" onBlur={(e) => that.onInputBlurCallback("backgroundImage", e,index,"list")} />
                                                                    </Form.Item>
                                                                </Form.Item>
                                                            </Space>

                                                        }
                                                    </>

                                                ))}


                                            </>
                                        )}
                                    </Form.List>
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
        this.requestProductSkuList()
    }
    initData() {
        let that = this;
        //用户标签
        let params = {
            page: {
                pageSize: 9999,
                currentPage: 1
            }
        }
        requestNewAdTagList(params).then(res => {
            console.log(res)
            let datas = res.data;
            // let tags = [];
            // tags.push({ id: -1, code: 'default', name: '默认', });
            // for (let i = 0, len = datas.length; i < len; i++) {
            //     let item = datas[i];
            //     tags.push(item);
            // }

            that.setState({
                dict_user_tags: datas
            }, () => {
                that.initTitle();
            });
        });
    }
    requestProductSkuList() {
        let that = this;
        let obj = {
            page: { isPage: 9 },
            productCategoryType: 10
        };
        requestProductSkuList(obj).then(res => {
            console.log(res.data)
            if (res.data.errCode == 0) {
                that.setState({
                    rechargeList: res.data.data
                })
            }


        })
    }
    initTitle() {
        let that = this;
        let dict_user_tags = that.state.dict_user_tags;

        let table_title = [
            { title: 'id', dataIndex: 'id', key: '_id', width: 80, },
            { title: '名字', dataIndex: 'title', key: 'title', width: 200, ellipsis: true, },
            // { title: '数据上报key', dataIndex: 'name', key: 'name', width: 200, },
            {
                title: '标签', dataIndex: 'tag', key: 'tag', width: 200,
                render: (rowValue, row, index) => {
                    return this.getTag(rowValue)
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
    getTag(val) {
        if (val) {
            let arr = this.state.dict_user_tags.filter(item => val == item.code)
            if (arr.length > 0) {
                return arr[0].name
            } else {
                return "未配置"
            }
        } else {
            return "未配置"
        }

    }

    refreshList() {
        let that = this;
        let { table_box } = that.state;

        table_box.table_datas = [];

        that.setState({
            table_box: table_box,
        }, () => {
            let obj = {
                page: {
                    currentPage: this.state.page,
                    pageSize: this.state.pageSize
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
                        total: res.data.page.totalCount
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
            if (obj.productList && obj.productList.length > 0) {
                obj.productList.forEach(r => {
                    r.hddjs = r.hddjs == 1 ? true : false
                    r.jljr = r.jljr == 1 ? true : false
                })
            }

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
    getUploadFileUrl(type, file, newItem, index, source) {
        let that = this;
        let image_url = newItem.fileUrl;
        if (source == "list" && that.formRef.current && that.formRef.current.getFieldValue("productList")[index]) {
            let info = that.formRef.current.getFieldValue("productList")
            info[index][type] = image_url
            that.formRef.current.setFieldsValue({ productList: info })
        } else {
            let obj = {};
            obj[type] = image_url;
            that.formRef.current.setFieldsValue(obj);
        }
        that.forceUpdate();
    }
    //获取上传文件图片地址 
    getUploadFileImageUrlByType(type, index, source) {
        let that = this;
        let image_url;
        if (source == "list" && that.formRef.current && that.formRef.current.getFieldValue("productList")[index]) {
            image_url = that.formRef.current.getFieldValue("productList")[index][type]
        } else {
            image_url = that.formRef.current.getFieldValue(type);
        }
        return image_url ? image_url : '';
    }
    //输入框失去焦点监听
    onInputBlurCallback(type, e,index,source) {
        let that = this;
        if(source == "list"){
            let info = that.formRef.current.getFieldValue("productList")
            info[index][type] = e.target.value;
            that.formRef.current.setFieldsValue({productList:info})
        }else{
            let obj = {};
            obj[type] = e.target.value;
            that.formRef.current.setFieldsValue(obj);
        }
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
        console.log("value", value)
        if (value.renewWindowWidth) {
            value.renewWindowWidth = parseInt(value.renewWindowWidth)
        } else {
            delete value.renewWindowWidth
        }
        if (value.renewWindowHeight) {
            value.renewWindowHeight = parseInt(value.renewWindowHeight)
        } else {
            delete value.renewWindowHeight
        }
        if (value.xOffset) {
            value.xOffset = parseInt(value.xOffset)
        } else {
            delete value.xOffset
        }
        if (value.yOffset) {
            value.yOffset = parseInt(value.yOffset)
        } else {
            delete value.yOffset
        }
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
        if (obj.productList && obj.productList.length > 0) {
            obj.productList.forEach(r => {
                r.hddjs = r.hddjs ? 1 : 2
                r.jljr = r.jljr ? 1 : 2
            })
        }

        // return console.log(obj,"-------obj--------")
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
                    if (!id) {
                        this.setState({
                            page: 1
                        }, () => {
                            that.refreshList();
                        })
                    } else {
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



    onChange = activeKey => {
        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    add() {
        console.log(111)
    };
    remove(key) {
        console.log(key)
    }
}
