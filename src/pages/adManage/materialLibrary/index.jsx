/*
 * @Author: HuangQS
 * @Date: 2021-10-26 17:19:51
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-27 18:05:53
 * @Description: 广告组手动选择弹出框
 */



import React, { Component } from 'react';

import { Input, Form, DatePicker, Button, Table, Modal, Card, Switch, Select, message, Image, InputNumber, Radio } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import util from "utils"
import {
    requestAdRightKey,   //获取广告素材 获取右下角广告素材
    getScreen,
    adRightKeyUpdate,
    screenUpdate,
    screenDel,
    adRightKeyDel,
    addAdRightKey, addScreen, screenCopy, adRightKeyCopy, requestProductSkuList, getInfoGroup, delInfoGroup, updateInfoGroup
} from 'api';
import { MySyncBtn } from '@/components/views.js';
import { MyImageUpload } from '@/components/views.js';
import InfoDialog from "./infoDialog"
let { RangePicker } = DatePicker;
let { Option } = Select;

let privateData = {
    inputTimeOutVal: null
};
export default class adCreateModal extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            materialShow: false,
            page: 1,
            pageSize: 10,
            total: 10,
            lists: [],
            adIndex: 1,
            typeList: [
                { key: 0, name: "通用" },
                { key: 1, name: "家庭号" },
                { key: 2, name: "公众号登陆" },
                { key: 3, name: "小程序登陆" },
                { key: 4, name: "支付广告" },
            ],
            type: [
                { key: 1, value: '图片' },
                { key: 13, value: '图片（会员可投）' },
                { key: 2, value: '视频' },
                { key: 14, value: '视频（会员可投）' },
                { key: 3, value: '直播' },
                { key: 4, value: '支付' },
                { key: 5, value: '三方sdk' },
                { key: 6, value: '轮播推荐' },
                { key: 7, value: '轮播推荐(自动填充)' },
                { key: 8, value: '优惠券' },
                { key: 9, value: '家庭号' },
                { key: 10, value: '登录' },
                { key: 11, value: 'H5' },
                { key: 12, value: '小程序登录' }
            ],
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            rechargeList: [],
            currentItem: "",
            table_title: [
                { title: '素材名称', dataIndex: 'name', key: 'name', width: 300, },
                {
                    title: '类型', dataIndex: 'type', key: 'type', width: 200,
                    render: (rowValue, row, index) => {
                        return (
                            this.state.adIndex == 1 ?
                                this.getType(rowValue, 1)
                                :
                                this.state.adIndex == 2 ?
                                    <div>{row.adType == 1 ? "普通级别" : row.adType == 2 ? "宣传内容" : "未知"}</div>
                                    :
                                    this.getType(rowValue, 3)
                        )
                    }
                },
                {
                    title: '缩略图', dataIndex: 'iconPicUrl', key: 'iconPicUrl', width: 150,
                    render: (rowValue, row, index) => {
                        return (<Image width={50} src={rowValue} />)
                    }
                },
                {
                    title: '背景图', dataIndex: 'picUrl', key: 'picUrl', width: 150,
                    render: (rowValue, row, index) => {
                        return (<Image width={50} src={rowValue} />)
                    }
                },
                {
                    title: '时间', dataIndex: 'time', key: 'time', width: 300,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {row.startTime ? util.formatTime(row.startTime, "", "") : "未配置"}
                                -
                                {row.endTime ? util.formatTime(row.endTime, "", "") : "未配置"}
                            </div>
                        )
                    }
                },
                {
                    title: '状态', dataIndex: 'status', key: 'status',
                    render: (rowValue, row, index) => {
                        return (
                            <Switch checkedChildren="有效" unCheckedChildren="无效"
                                key={new Date().getTime()}
                                defaultChecked={rowValue === 1 ? true : false}
                                onChange={(val) => {
                                    if (val) row.status = 1
                                    else row.status = 2
                                    if (this.state.adIndex == 1) {
                                        this.adRightKeyUpdateState(row)
                                    } else if (this.state.adIndex == 2) {
                                        this.screenUpdateState(row)
                                    } else {
                                        this.updateInfoGroup(row)
                                    }
                                }}
                            />
                        )
                    }
                },
                {
                    title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 210,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    this.state.adIndex != 3 &&
                                    <Button Button size='small' style={{ marginLeft: 5 }} onClick={() => {
                                        if (this.state.adIndex == 1) {
                                            this.adRightKeyCopy(row)
                                        } else {
                                            this.screenCopy(row)
                                        }
                                    }}>复制</Button>
                                }

                                <Button Button size='small' style={{ marginLeft: 5 }} onClick={() => {
                                    console.log(row)
                                    // this.onCreateClick(row)
                                    this.setState({
                                        adIndex: this.state.adIndex,
                                        materialShow: true,
                                        source: "upload",
                                        currentItem: row,
                                    }, () => {
                                        let obj = JSON.parse(JSON.stringify(row))
                                        obj.time = [moment(obj.startTime), moment(obj.endTime)]
                                        obj.djsEndTime = obj.djsEndTime ? moment(obj.djsEndTime) : ""
                                        obj.status = obj.status == 1 ? true : false
                                        if (this.state.adIndex != 3) {
                                            this.formRef.current.setFieldsValue(obj)
                                        }
                                        this.forceUpdate()
                                    })
                                }
                                }> 编辑</Button>
                                <Button size='small' style={{ marginLeft: 5 }} onClick={() => {
                                    if (this.state.adIndex == 1) {
                                        this.adRightKeyDel(row.id)
                                    } else if (this.state.adIndex == 2) {
                                        this.screenDel(row.id)
                                    } else {
                                        this.delInfoGroup(row.id)
                                    }
                                }}>删除</Button>
                            </div >
                        );
                    }
                },
            ]

        }
    }
    render() {
        let that = this;
        let { table_title, lists, materialShow, adIndex } = that.state;

        return (
            <div>
                <Card title={
                    <>
                        {/* <Breadcrumb>
                            <Breadcrumb.Item>素材库</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <div style={{ display: "flex" }}>
                            <div className="everyBody" style={{ display: "flex", marginLeft: "20px", alignItems: 'center' }}>
                                <div>类型:</div>
                                {/* <Select allowClear placeholder="请选择类型" defaultValue={1}
                                    onChange={(val) => {
                                        this.setState({
                                            adIndex: val,
                                            page: 1
                                        }, () => {
                                            this.refreshList(val)
                                        })
                                    }}
                                >
                                    <Option value={1} key={1}>右键运营位广告</Option>
                                    <Option value={2} key={2}>屏显广告</Option>
                                </Select> */}
                                <Radio.Group defaultValue="1" size="large"
                                    onChange={(val) => {
                                        let arr = table_title
                                        if (val.target.value == 3) {//信息流素材自定义表头
                                            arr = table_title.filter(item => item.key != "iconPicUrl" && item.key != "picUrl")
                                            if (arr[2].dataIndex != "mode") {
                                                arr.splice(2, 0, {
                                                    title: '广告模式', dataIndex: 'mode', key: 'mode', width: 300,
                                                    render: (rowValue, row, index) => {
                                                        return (
                                                            <div>{rowValue == 1 ? "定向" : rowValue == 2 ? "不定向" : "未知"}</div>
                                                        )
                                                    }
                                                })
                                            }

                                        }
                                        this.setState({
                                            adIndex: val.target.value,
                                            page: 1,
                                            table_title: arr
                                        }, () => {
                                            this.refreshList(val.target.value)
                                        })
                                    }}>
                                    <Radio.Button value="1">右键运营位广告</Radio.Button>
                                    <Radio.Button value="2">屏显广告</Radio.Button>
                                    <Radio.Button value="3">信息流广告</Radio.Button>
                                </Radio.Group>
                            </div>
                            <div className="everyBody" style={{ display: "flex", marginLeft: "20px", alignItems: 'center' }}>
                                <div>广告名称:</div>
                                <Input.Search allowClear placeholder="请输入广告名称"
                                    onSearch={(val) => {
                                        this.setState({
                                            page: 1,
                                            searchWords: val
                                        }, () => {
                                            this.refreshList(this.state.adIndex)
                                        })

                                    }}
                                />
                            </div>
                        </div>

                    </>
                }
                    extra={
                        <div>
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    currentItem: {},
                                    adIndex: this.state.adIndex,
                                    materialShow: true,
                                    source: "add",
                                }, () => {
                                    if (this.state.adIndex != 3) {
                                        this.formRef.current.resetFields()
                                    }
                                    this.forceUpdate()
                                })
                            }}>新建</Button>
                            <MySyncBtn type={12} name={'同步缓存'} />
                        </div>
                    }
                >
                    <Table
                        columns={table_title}
                        dataSource={lists}
                        pagination={false}
                        scroll={{ x: 1500, y: '70vh' }}
                        pagination={{
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.changeSize,
                        }}
                    />
                </Card>
                <Modal visible={materialShow} title="素材" width={1500} transitionName="" maskClosable={false}
                    onCancel={() => that.onModalCancelClick()}
                    footer={null}
                >
                    {
                        adIndex == 3 &&
                        <div><InfoDialog table_data={this.state.currentItem} materialShow={materialShow} onModalCancelClick={(e) => this.onModalCancelClick(e)} /></div>
                    }
                    {
                        adIndex != 3 &&
                        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef} onFinish={this.onModalConfirmClick.bind(this)}>
                            {
                                (that.formRef && that.formRef.current) &&
                                    adIndex == 1 ?
                                    <div>
                                        <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                                            <Input className="base-input-wrapper" placeholder="请输入广告名称" />
                                        </Form.Item>
                                        <Form.Item label='时长（s）' name='duration' rules={[{ required: true }]}>
                                            <InputNumber min={0} />
                                        </Form.Item>
                                        <Form.Item label='类型' name='type' rules={[{ required: true }]}>
                                            <Select placeholder="请选择类型" onChange={() => this.forceUpdate()}>
                                                {this.state.typeList.map((item, index) => {
                                                    return <Option value={item.key} key={index}> {item.name}</Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        {
                                            that.formRef.current.getFieldValue("type") == 4
                                            &&
                                            <Form.Item label='支付套餐' name='pCode'>
                                                <Select placeholder="请选择支付套餐">
                                                    {this.state.rechargeList.map((item, index) => {
                                                        return <Option value={item.skuCode} key={index}> {item.name}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        }
                                        <Form.Item label='排序' name='sortData' rules={[{ required: true }]}>
                                            <InputNumber min={0} />
                                        </Form.Item>
                                        <Form.Item label='倒计时结束时间' name="djsEndTime">
                                            <DatePicker showTime />
                                        </Form.Item>
                                        <Form.Item label='是否显示距离今日结束时间' name='jljr'>
                                            <Select placeholder="是否显示距离今日结束时间">
                                                <Option value={1} key={1}> 是</Option>
                                                <Option value={0} key={0}> 否</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label='状态' name='status' valuePropName="checked">
                                            <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                                        </Form.Item>
                                        <Form.Item label="背景图" name="picUrl" rules={[{ required: true }]}>
                                            <div>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('picUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('picUrl')} />
                                                <Input.TextArea defaultValue={that.getUploadFileImageUrlByType('picUrl')} key={that.getUploadFileImageUrlByType('picUrl') || ""}
                                                    onChange={(e) => {
                                                        this.getNewUrl("picUrl", e.target.value)
                                                    }} />
                                            </div>
                                        </Form.Item>
                                        <Form.Item label="缩略图" name="iconPicUrl" rules={[{ required: true }]}>
                                            <div>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('iconPicUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('iconPicUrl')} />
                                                <Input.TextArea defaultValue={that.getUploadFileImageUrlByType('iconPicUrl')} key={that.getUploadFileImageUrlByType('iconPicUrl') || ""}
                                                    onChange={(e) => {
                                                        this.getNewUrl("iconPicUrl", e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </Form.Item>
                                        <Form.Item label="上下线时间" name='time' rules={[{ required: true }]}>
                                            <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                                        </Form.Item>
                                        <Form.Item {...this.state.tailLayout}>
                                            <Button onClick={() => { this.onModalCancelClick() }}>取消</Button>
                                            <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                                确定
                                            </Button>
                                        </Form.Item>
                                    </div>
                                    :

                                    <div>
                                        <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                                            <Input className="base-input-wrapper" placeholder="请输入广告名称" />
                                        </Form.Item>
                                        <Form.Item label='排序' name='sortData' rules={[{ required: true }]}>
                                            <InputNumber min={0} />
                                        </Form.Item>
                                        <Form.Item label="上下线时间" name='time' rules={[{ required: true }]}>
                                            <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                                        </Form.Item>
                                        <Form.Item label='状态' name='status' valuePropName="checked">
                                            <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                                        </Form.Item>
                                        <Form.Item label="背景图" name="picUrl" rules={[{ required: true }]}>

                                            <div>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('picUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('picUrl')} />
                                                <Input.TextArea defaultValue={that.getUploadFileImageUrlByType('picUrl')} key={that.getUploadFileImageUrlByType('picUrl')}
                                                    onChange={(e) => {
                                                        this.getNewUrl("picUrl", e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </Form.Item>
                                        {/* <Form.Item label="缩略图" name="iconPicUrl" rules={[{ required: true }]}>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('iconPicUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('iconPicUrl')} />
                                            </Form.Item> */}
                                        <Form.Item label="类型" name="adType" rules={[{ required: true }]}>
                                            <Select placeholder="类型">
                                                <Option value={1} key={1}>普通级别</Option>
                                                <Option value={2} key={2}>宣传内容</Option>
                                            </Select>
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
                    }



                </Modal>
            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.refreshList(1);
    }
    getType(val, index) {
        if (index == 1) {
            let arr = this.state.typeList.filter(item => item.key == val)
            if (arr.length > 0) {
                return arr[0].name
            } else {
                return "未知"
            }
        } else {
            let arr = this.state.type.filter(item => item.key == val)
            if (arr.length > 0) {
                return arr[0].value
            } else {
                return "未知"
            }
        }

    }
    getNewUrl(name, val) {
        if (privateData.inputTimeOutVal) {
            clearTimeout(privateData.inputTimeOutVal);
            privateData.inputTimeOutVal = null;
        }
        privateData.inputTimeOutVal = setTimeout(() => {
            if (!privateData.inputTimeOutVal) return;
            this.formRef.current.setFieldsValue({ [name]: val })
            this.forceUpdate()
        }, 1000)
    }
    changeSize = (page, pageSize) => {
        // 分页获取
        this.setState({
            page,
            pageSize
        }, () => {
            this.refreshList(this.state.adIndex)
        })

    }

    //弹出框取消按钮被点击
    onModalCancelClick(e) {
        let that = this;
        console.log(e, "e")
        if (e == 3) {
            this.refreshList(3)
        }
        if (this.state.adIndex != 3) {
            this.formRef.current.resetFields()
        }
        that.setState({
            materialShow: false,
        })
    }

    //弹出框确定按钮被点击
    onModalConfirmClick(val) {
        let that = this;
        that.setState({
            materialShow: false
        })
        if (this.state.adIndex == 1) {
            if (this.state.source == "upload") {
                this.adRightKeyUpdate(val)
            } else {
                this.addAdRightKey(val)
            }
        } else {
            if (this.state.source == "upload") {
                this.screenUpdate(val)
            } else {
                this.addScreen(val)
            }
        }

        console.log(val)
    }
    refreshList(index) {
        if (index == 1) {
            this.requestAdRightKey()
            this.requestProductSkuList()
        } else if (index == 2) {
            this.getScreen()
        } else {
            this.getInfoGroup()
        }
    }
    requestAdRightKey() {
        let that = this;
        let { table_box } = that.state;
        console.log(table_box, "table_box")
        let obj = {
            page: { currentPage: this.state.page, pageSize: this.state.pageSize },
            name: this.state.searchWords
        };
        requestAdRightKey(obj).then(res => {
            that.setState({
                lists: res.data || [],
                total: res.page ? res.page.totalCount : 0
            })
            this.forceUpdate()
        })
    }
    getScreen() {
        let that = this;
        let obj = {
            page: { currentPage: this.state.page, pageSize: this.state.pageSize },
            name: this.state.searchWords
        };
        getScreen(obj).then(res => {
            that.setState({
                lists: res.data || [],
                total: res.page ? res.page.totalCount : 0
            })
            this.forceUpdate()
        })
    }
    getInfoGroup() {
        let that = this;
        let obj = {
            page: { currentPage: this.state.page, pageSize: this.state.pageSize },
            name: this.state.searchWords
        };
        getInfoGroup(obj).then(res => {
            that.setState({
                lists: res.data || [],
                total: res.page ? res.page.totalCount : 0
            })
            this.forceUpdate()
        })
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
    //获取上传文件
    getUploadFileUrl(type, file, newItem) {
        // console.log(type, file,newItem,"newItem")
        let that = this;
        let image_url = file;
        // let obj = {};
        // obj[type] = image_url;
        that.formRef.current.setFieldsValue({ [type]: image_url });
        that.forceUpdate();
    }
    //获取上传文件图片地址 
    getUploadFileImageUrlByType(type) {
        let that = this;
        let image_url = that.formRef.current && that.formRef.current.getFieldValue(type);
        return image_url ? image_url : '';
    }
    adRightKeyUpdateState(val) {
        let params = {
            ...val,
        }
        adRightKeyUpdate(params).then(res => {

        })
    }
    screenUpdateState(val) {
        let params = {
            ...val,
        }
        screenUpdate(params).then(res => {

        })
    }
    adRightKeyUpdate(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            startTime: val.time ? val.time[0].valueOf() : val.startTime,
            endTime: val.time ? val.time[1].valueOf() : val.endTime,
            djsEndTime: val.djsEndTime.valueOf(),
            status: val.status ? 1 : 2
        }
        delete params.time
        adRightKeyUpdate(params).then(res => {
            message.success("修改成功")
            this.refreshList(1)
        })
    }
    screenUpdate(val) {
        let params = {
            ...this.state.currentItem,
            ...val,
            startTime: val.time ? val.time[0].valueOf() : val.startTime,
            endTime: val.time ? val.time[1].valueOf() : val.endTime,
            status: val.status ? 1 : 2
        }
        delete params.time
        screenUpdate(params).then(res => {
            message.success("修改成功")
            this.refreshList(2)
        })
    }
    screenDel(id) {
        Modal.confirm({
            title: '删除此屏显素材',
            content: '确认删除？',
            onOk: () => {
                screenDel({ id: id }).then(res => {
                    message.success("删除成功")
                    this.refreshList(2)
                })
            },
            onCancel: () => {

            }
        })
    }
    delInfoGroup(id) {
        Modal.confirm({
            title: '删除此信息流素材',
            content: '确认删除？',
            onOk: () => {
                delInfoGroup({ id: id }).then(res => {
                    message.success("删除成功")
                    this.refreshList(3)
                })
            },
            onCancel: () => {

            }
        })
    }
    adRightKeyDel(id) {
        Modal.confirm({
            title: '删除此右键运营位素材',
            content: '确认删除？',
            onOk: () => {
                adRightKeyDel({ id: id }).then(res => {
                    message.success("删除成功")
                    if (this.state.lists.length == 1 && this.state.page > 1) {
                        this.setState({
                            page: this.state.page - 1
                        }, () => {
                            this.refreshList(1)
                        })
                    } else {
                        this.refreshList(1)
                    }

                })
            },
            onCancel: () => {

            }
        })
    }
    addAdRightKey(val) {
        let param = {
            ...val,
            startTime: val.time[0].valueOf(),
            endTime: val.time[1].valueOf(),
            djsEndTime: val.djsEndTime ? val.djsEndTime.valueOf() : "",
            status: val.status ? 1 : 2
        }
        addAdRightKey(param).then(res => {
            message.success("新增成功")
            this.refreshList(1)
        })
    }
    addScreen(val) {
        let param = {
            ...val,
            startTime: val.time[0].valueOf(),
            endTime: val.time[1].valueOf(),
            status: val.status ? 1 : 2
        }
        addScreen(param).then(res => {
            message.success("新增成功")
            this.refreshList(2)
        })
    }
    adRightKeyCopy(val) {
        let param = {
            ...val,
        }
        adRightKeyCopy(param).then(res => {
            message.success("复制成功")
            this.refreshList(1)
        })
    }
    screenCopy(val) {
        let param = {
            ...val,
        }
        screenCopy(param).then(res => {
            message.success("复制成功")
            this.refreshList(2)
        })
    }
    updateInfoGroup(val) {
        let params = {
            ...val,
        }
        updateInfoGroup(params).then(res => {
            message.success("更新成功")
            this.onModalCancelClick(3)
        })
    }
}