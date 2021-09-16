
/*
 * @Author: HuangQS
 * @Date: 2021-09-16 14:01:05
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-16 19:28:49
 * @Description: 用户标签 - 投放类型 组合控件
 * 
 * tag_name:                可更改[用户标签]字段名称
 * delivery_name:           可更改[投放类型]字段名称
 * 
 * is_disable_tag:          不开启[用户标签]标签
 * is_disable_delivery:     不开启[投放类型]标签
 */
import React, { Component } from 'react';
import { Form, Select, Radio } from 'antd';
import './tag-types.css';
import {
    getUserTag,                         //用户设备标签
    requestDeliveryTypes,               //投放类型
} from 'api';

let { Option } = Select;

export default class WxReplyModal extends Component {
    constructor(props) {
        super(props);

        this.viewFormRef = React.createRef();

        this.state = {
            dict_user_tags: [],
            dict_delivery_types: [],
        }

    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        that.initData();
    }

    render() {
        let that = this;
        let input_width_size = 340;
        let { dict_user_tags, dict_delivery_types } = that.state;
        let { is_disable_tag, is_disable_delivery } = that.props;


        return (
            <div className='tag-types-wrapper'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.viewFormRef}>
                    {!is_disable_tag &&
                        <Form.Item label='用户标签' name={that.getTagName()} >
                            <Select style={{ width: input_width_size }} mode="multiple" showSearch placeholder="请选择用户设备标签">
                                {dict_user_tags.map((item, index) => (
                                    <Option value={item.code.toString()} key={item.code}>{item.code}-{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    }
                    {!is_disable_delivery &&
                        <Form.Item label='投放类型' name={that.getDeliveryName()}>
                            <Radio.Group style={{ width: input_width_size }} >
                                {dict_delivery_types.map((item, index) => {
                                    return <Radio value={item.key} key={index} onClick={(e) => that.onRadioClick(item.key)}>
                                        {item.value}
                                    </Radio>
                                })}
                            </Radio.Group>
                        </Form.Item>
                    }
                </Form>
            </div>
        )
    }


    initData() {
        let that = this;
        //用户标签
        getUserTag().then(userTagResult => {
            requestDeliveryTypes().then(deliveryTypesResult => {
                that.setState({
                    dict_user_tags: userTagResult.data.data,
                    dict_delivery_types: deliveryTypesResult,
                }, () => {
                    that.forceUpdate();
                });
            });
        })
    }

    /**
     * 装载数据
     * @param {*} item 
     */
    pushData(item) {
        let that = this;
        let voewFormRef = that.viewFormRef;

        let tag_name = that.getTagName()

        let tags = item[tag_name];
        if (tags) {
            if (tags.constructor === String) {
                tags = tags.split(',');
            }
            // 
            else if (tags.constructor === Array) {
                if (tags.length <= 0) {
                    tags = [];
                }
            }
        } else {
            tags = [];
        }

        item[tag_name] = tags;

        voewFormRef.current.resetFields();
        voewFormRef.current.setFieldsValue(item);
    }

    /**
     * 获取数据
     */
    loadData() {
        let that = this;
        let voewFormRef = that.viewFormRef;
        let value = voewFormRef.current.getFieldsValue();

        let tags_name = that.getTagName();
        let delivery_name = that.getDeliveryName();
        let obj = {};

        //用户标签
        let tags = value[tags_name];
        if (tags) {
            if (tags.constructor === String) {
                tags = tags.split(',');
            }
            //
            else if (tags.constructor === Array) {
                if (tags.length > 0) {
                    tags = tags.join(',');
                }
            }
            obj[tags_name] = tags;
        }

        //投放类型
        let delivery = value[delivery_name];
        if (delivery) {
            if (delivery !== 0) {
                obj[delivery_name] = delivery;
            }
        }

        return obj;
    }

    //监听单选框 被选中的数据 再次被点击 将清除当前数据
    onRadioClick(target) {
        let that = this;
        let voewFormRef = that.viewFormRef;
        let delivery_name = that.getDeliveryName();
        let value = voewFormRef.current.getFieldValue(delivery_name);
        if (value === target) {
            let obj = {};
            obj[delivery_name] = '';
            voewFormRef.current.setFieldsValue(obj);
        }
    }

    //==========================================================

    //获取用户标签名称
    getTagName() {
        let that = this;
        let { tag_name } = that.props;
        if (!tag_name) tag_name = 'tag';
        return tag_name;
    }

    //获取投放类型名称
    getDeliveryName() {
        let that = this;
        let { delivery_name } = that.props;
        if (!delivery_name) delivery_name = 'deliveryType';
        return delivery_name;
    }



}