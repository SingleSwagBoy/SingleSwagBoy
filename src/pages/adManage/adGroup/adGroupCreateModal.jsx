/*
 * @Author: HuangQS
 * @Date: 2021-10-26 17:19:51
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-27 14:32:55
 * @Description: 广告组手动选择弹出框
 */



import React, { Component } from 'react';

import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, message, Switch } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import { MyArea, MyAddress, MyChannel, MySyncBtn } from '@/components/views.js';
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
        }
    }
    render() {
        let that = this;
        let { modal_box } = that.state;

        return (
            <div>
                {modal_box &&
                    <Modal visible={modal_box.is_show} title={modal_box.title} width={800} transitionName="" maskClosable={false}
                        onCancel={() => that.onModalCancelClick()}
                        footer={[
                            <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                            <Button onClick={() => that.onModalConfirmClick()}>上传</Button>
                        ]}>


                        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef}>
                            {
                                that.formRef && that.formRef.current &&
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
                                        <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间','下线时间']} />
                                    </Form.Item>
                                    <Form.Item label="背景图" rules={[{ required: true }]}>
                                    </Form.Item>
                                    <Form.Item label="缩略图" rules={[{ required: true }]}>
                                    </Form.Item>
                                    <Form.Item label="类型" rules={[{ required: true }]}>
                                    </Form.Item>
                                </div>
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
    onModalConfirmClick() {
        let that = this;
        let { modal_box } = that.state;
        let value = that.formRef.current.getFieldsValue();
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



}