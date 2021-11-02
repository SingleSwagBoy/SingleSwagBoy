
/*
 * @Author: HuangQS
 * @Date: 2021-09-16 14:01:05
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-02 19:08:49
 * @Description: 用户标签 - 投放类型 组合控件
 * 
 * 不传不显示下面对应的参数 不传时，获取数据也不会获取到对应参数
 * tag_name:                可更改[用户标签]字段名称 
 * delivery_name:           可更改[投放类型]字段名称
 */
import React, { Component } from 'react';
import { Form, Select, Radio, Input, Tooltip, message } from 'antd';
import './tag-types.css';
import {
    requestAdTagList,                   //用户设备标签
    requestNewAdTagList,                //用户设备标签[新版] 用户标签
    requestDeliveryTypes,               //投放类型
} from 'api';
import '@/style/base.css';

let { Option } = Select;

export default class TagTypes extends Component {
    constructor(props) {
        super(props);

        this.viewFormRef = React.createRef();

        this.state = {
            //标签判断逻辑
            dict_union_type: [
                { key: 1, value: '满足全部标签' },
                { key: 2, value: '满足部分标签' },
            ],
            dict_user_tags: [],         //用户设备标签
            dict_delivery_types: [],    //投放类型
        }

    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        that.initData();
    }

    render() {
        let that = this;
        let { dict_union_type, dict_user_tags, dict_delivery_types } = that.state;
        let { union_type, tag_name, delivery_name, desc
            , is_old_tag_resouce } = that.props;

        return (
            <div className='tag-types-wrapper'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.viewFormRef}>
                    {
                        union_type &&
                        <Tooltip title='是以按当前配置的[用户标签]为基础，进行全匹配，模糊匹配。' placement="top" color={'blue'}>
                            <Form.Item label='标签逻辑' name={union_type} >
                                <Radio.Group className="base-input-wrapper" >
                                    {dict_union_type.map((item, index) => {
                                        return <Radio value={item.key} key={index} onClick={(e) => that.onUnionTypeRadioClick(item.key)}>
                                            {item.value}
                                        </Radio>
                                    })}
                                </Radio.Group>
                            </Form.Item>
                        </Tooltip>
                    }

                    {delivery_name &&
                        <Tooltip title='投放类型取消或不选，都将默认为[非定向]' placement="top" color={'blue'}>
                            <Form.Item label='投放类型' name={delivery_name}>
                                <Radio.Group className="base-input-wrapper" >
                                    {dict_delivery_types.map((item, index) => {
                                        return <Radio value={item.key} key={index} onClick={(e) => that.onRadioClick(item.key)}>
                                            {item.value}
                                        </Radio>
                                    })}
                                </Radio.Group>
                            </Form.Item>
                        </Tooltip>
                    }

                    {tag_name &&
                        <Form.Item label='用户标签' name={tag_name} >
                            <Select className="base-input-wrapper" mode={is_old_tag_resouce ? 'multiple' : true} showSearch placeholder="请选择用户设备标签"
                                filterOption={(input, option) => {
                                    if (!input) return true;
                                    let children = option.children;
                                    if (children) {
                                        let key = children[2];
                                        let isFind = false;
                                        isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                        if (!isFind) {
                                            let code = children[0];
                                            isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                        }

                                        return isFind;
                                    }
                                }}>
                                {dict_user_tags.map((item, index) => (
                                    <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    }
                    {desc &&
                        <Form.Item label='注意' >
                            <label style={{ color: 'red' }}>{desc}</label>
                        </Form.Item>
                    }
                </Form>
            </div>
        )
    }


    initData() {
        let that = this;
        let { is_old_tag_resouce } = that.props;

        //用户标签 根据类型获取新旧标签
        if (is_old_tag_resouce) {
            requestAdTagList().then(res => {
                that.setState({
                    dict_user_tags: res.data,
                }, () => {
                    that.forceUpdate();
                });
            })
        }
        //
        else {
            requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
                that.setState({
                    dict_user_tags: res.data,
                }, () => {
                    that.forceUpdate();
                });
            })
        }

        //投放类型
        requestDeliveryTypes().then(res => {
            that.setState({
                dict_delivery_types: res,
            }, () => {
                that.forceUpdate();
            });
        });
    }

    /**
     * 装载数据
     * @param {*} item 
     */
    pushData(item) {
        let that = this;
        let viewFormRef = that.viewFormRef;
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

        viewFormRef.current.resetFields();
        viewFormRef.current.setFieldsValue(item);
    }

    /**
     * 获取数据
     */
    loadData() {
        let that = this;
        let { union_type, tag_name, delivery_name } = that.props;
        let viewFormRef = that.viewFormRef;
        let value = viewFormRef.current.getFieldsValue();
        let obj = {};

        //标签判断逻辑
        if (union_type) {
            let union = value[union_type];
            if (union) {
                obj[union_type] = union;
            } else {
                message.error('请选择标签判断逻辑')
            }
        }

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

    //标签类型逻辑
    onUnionTypeRadioClick() {
        let that = this;
        let viewFormRef = that.viewFormRef;
        let { union_type } = that.props;


        let obj = {};
        obj[union_type] = '';
        viewFormRef.current.setFieldsValue(obj);
    }

    //监听单选框 被选中的数据 再次被点击 将清除当前数据
    onRadioClick(target) {
        let that = this;
        let viewFormRef = that.viewFormRef;
        let { delivery_name } = that.props;

        let value = viewFormRef.current.getFieldValue(delivery_name);
        if (value === target) {
            let obj = {};
            obj[delivery_name] = '';
            viewFormRef.current.setFieldsValue(obj);
        }
    }


}