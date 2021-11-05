/*
 * @Author: HuangQS
 * @Date: 2021-10-26 17:19:51
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-27 14:32:55
 * @Description: 广告组手动选择弹出框
 */



import React, { Component } from 'react';

import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, message, InputNumber } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { addAdRightKey,addScreen } from "api"
import { MyImageUpload } from '@/components/views.js';
let { RangePicker } = DatePicker;
let { Option } = Select;

export default class adCreateModal extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            modal_box: {
                is_show: false,
                title: '',
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            typeList:[
                {key:0,name:"通用"},
                {key:1,name:"家庭号"},
                {key:2,name:"公众号登陆"},
                {key:3,name:"小程序登陆"},
            ]
        }
    }
    render() {
        let that = this;
        let { modal_box } = that.state;
        let { adIndex } = this.props
        return (
            <div>
                {modal_box &&
                    <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" maskClosable={false}
                        onCancel={() => that.onModalCancelClick()} 
                        footer={null}
                    // footer={[
                    //     <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                    //     <Button onClick={() => that.onModalConfirmClick()}>上传</Button>
                    // ]}
                    >
                        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef} onFinish={this.onModalConfirmClick.bind(this)}>
                            {
                                (that.formRef && that.formRef.current) ?
                                    adIndex == 1 ?
                                        <div>
                                            {
                                                that.formRef.current.getFieldValue('id') &&
                                                <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                                    <Input className="base-input-wrapper" disabled />
                                                </Form.Item>
                                            }
                                            <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                                                <Input className="base-input-wrapper" placeholder="请输入广告名称" />
                                            </Form.Item>
                                            <Form.Item label='时长（s）' name='duration' rules={[{ required: true }]}>
                                                <InputNumber min={0} />
                                            </Form.Item>
                                            <Form.Item label='类型' name='type' rules={[{ required: true }]}>
                                                <Select placeholder="请选择类型">
                                                    {this.state.typeList.map((item, index) => {
                                                        return <Option value={item.key} key={index}> {item.name}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label='倒计时结束时间' name="djsEndTime"  rules={[{ required: true }]}>
                                                <DatePicker showTime  />
                                            </Form.Item>
                                            <Form.Item label='是否显示距离今日结束时间' name='jljr' rules={[{ required: true }]}>
                                                <Select placeholder="是否显示距离今日结束时间">
                                                    <Option value={1} key={1}> 是</Option>
                                                    <Option value={0} key={0}> 否</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="背景图" name="picUrl" rules={[{ required: true }]}>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('picUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('picUrl')} />
                                            </Form.Item>
                                            <Form.Item label="缩略图" name="iconPicUrl" rules={[{ required: true }]}>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('iconPicUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('iconPicUrl')} />
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
                                            {
                                                that.formRef.current.getFieldValue('id') &&
                                                <Form.Item label="id" name='id' rules={[{ required: true }]} >
                                                    <Input className="base-input-wrapper" disabled />
                                                </Form.Item>
                                            }
                                            <Form.Item label='名称' name='name' rules={[{ required: true }]}>
                                                <Input className="base-input-wrapper" placeholder="请输入广告名称" />
                                            </Form.Item>
                                            <Form.Item label="上下线时间" name='time' rules={[{ required: true }]}>
                                                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                                            </Form.Item>
                                            <Form.Item label="背景图" name="picUrl" rules={[{ required: true }]}>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('picUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('picUrl')} />
                                            </Form.Item>
                                            <Form.Item label="缩略图" name="iconPicUrl" rules={[{ required: true }]}>
                                                <MyImageUpload
                                                    getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('iconPicUrl', file, newItem) }}
                                                    imageUrl={that.getUploadFileImageUrlByType('iconPicUrl')} />
                                            </Form.Item>
                                            <Form.Item label="类型" name="type" rules={[{ required: true }]}>
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
                                    : ""
                            }



                        </Form>


                    </Modal>
                }
            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        console.log('初始化');
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
    onModalConfirmClick(val) {
        let that = this;
        console.log(val, "获取数据")
        let { modal_box } = that.state;
        // let value = that.formRef.current.getFieldsValue();
        val.startTime = val.time[0].toDate().getTime()
        val.endTime = val.time[1].toDate().getTime()
        if(this.props.adIndex == 1){
            val.djsEndTime = val.djsEndTime.toDate().getTime()
            this.addAdRightKey(val)
        }else{
            this.addScreen(val)
        }
        
    }

    //展示对话框
    showModal(data) {
        let that = this;
        let { modal_box } = that.state;
        modal_box.is_show = true;
        modal_box.title = data.title;


        that.setState({ modal_box: modal_box }, () => {
            that.forceUpdate()
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
    addAdRightKey(val) {
        let param = {
            ...val
        }
        addAdRightKey(param).then(res => {
            this.props.onGetInfo(val);
            this.onModalCancelClick()
        })
    }
    addScreen(val) {
        let param = {
            ...val
        }
        addScreen(param).then(res => {
            this.props.onGetInfo(val);
            this.onModalCancelClick()
        })
    }


}