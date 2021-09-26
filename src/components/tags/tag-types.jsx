
/*
 * @Author: HuangQS
 * @Date: 2021-09-16 14:01:05
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-18 14:11:57
 * @Description: 用户标签 - 投放类型 组合控件
 * 
 * 不传不显示下面对应的参数 不传时，获取数据也不会获取到对应参数
 * tag_name:                可更改[用户标签]字段名称 
 * delivery_name:           可更改[投放类型]字段名称
 */
import React, { Component } from 'react';
import { Form, Select, Radio } from 'antd';
import './tag-types.css';
import {
    getUserTag,                         //用户设备标签
    requestDeliveryTypes,               //投放类型
} from 'api';
import '@/style/base.css';

let { Option } = Select;

export default class TagTypes extends Component {
    constructor(props) {
        super(props);

        this.viewFormRef = React.createRef();

        this.state = {
            dict_user_tags: [],
            dict_delivery_types: [],
            // 标签类型
            dict_tag_type: [
                { key: '0', value: '满足全部标签', },
                { key: '1', value: '满足指定标签', },
            ],
        }

    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        that.initData();
    }

    render() {
        let that = this;
        let { dict_user_tags, dict_delivery_types, dict_tag_type } = that.state;
        let { tag_type, tag_name, delivery_name } = that.props;

        return (
            <div className='tag-types-wrapper'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.viewFormRef}>
                    {
                        tag_type &&
                        <Form.Item label='标签类型' name={tag_type} >
                            <Radio.Group className="base-input-wrapper" >
                                {dict_tag_type.map((item, index) => {
                                    return <Radio value={item.key} key={index} onClick={(e) => that.onRadioClick(item.key)}>
                                        {item.value}
                                    </Radio>
                                })}
                            </Radio.Group>
                        </Form.Item>
                    }

                    {tag_name &&
                        <Form.Item label='用户标签' name={tag_name} >
                            <Select className="base-input-wrapper" mode="multiple" showSearch placeholder="请选择用户设备标签">
                                {dict_user_tags.map((item, index) => (
                                    <Option value={item.code.toString()} key={item.code}>{item.code}-{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    }
                    {delivery_name &&
                        <Form.Item label='投放类型' name={delivery_name}>
                            <Radio.Group className="base-input-wrapper" >
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
        let { tag_name } = that.props;

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
        let { tag_name } = that.props;
        let { delivery_name } = that.props;
        let voewFormRef = that.viewFormRef;
        let value = voewFormRef.current.getFieldsValue();
        let obj = {};

        //用户标签
        let tags = value[tag_name];
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
            obj[tag_name] = tags;
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
        let { delivery_name } = that.props;

        let value = voewFormRef.current.getFieldValue(delivery_name);
        if (value === target) {
            let obj = {};
            obj[delivery_name] = '';
            voewFormRef.current.setFieldsValue(obj);
        }
    }


}