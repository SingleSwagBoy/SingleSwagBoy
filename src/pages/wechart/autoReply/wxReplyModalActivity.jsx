/*
 * @Author: HuangQS
 * @Date: 2021-09-14 17:13:30
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-15 11:09:08
 * @Description: 关键字类型 活动控件
 */

import React, { Component } from 'react';
import { Form, message, Switch, Radio, Input, InputNumber } from 'antd';

export default class wxReplyModalImageBox extends Component {
    constructor(props) {
        super(props);
        this.activityFormRef = React.createRef();

        this.state = {
            base_width: 450,
            dict_activity_type: [{ key: 1, value: 'vip活动' }],
            dict_activity_day_type: [{ key: 1, value: '固定' }, { key: 2, value: '随机' }],

        }
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
    }

    render() {
        let that = this;
        let { base_width, dict_activity_type, dict_activity_day_type, } = that.state;
        {/* "reply_activity": "{\"activityType\": 1, \"activityDayType\": 1, \"activityDays\":1, \"activityCycle\": 3}"
 "activityType": 1vip活动...  activityDayType: 1固定2随机 activityDays: 天数, 随机的话是0-配置的天数 activityCycle: 领取周期(100000表示永久, 小于100000表示配置天数) */}

        return (
            <div>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} style={{ width: 600 }} ref={that.activityFormRef} >
                    <Form.Item label='开展活动' name='isOpen' valuePropName='checked' >
                        <Switch checkedChildren="开" unCheckedChildren="关" onChange={(checked) => {
                            that.activityFormRef.current.setFieldsValue({ isOpen: checked })
                            that.forceUpdate();
                        }} />
                    </Form.Item>


                    {that.activityFormRef && that.activityFormRef.current && that.activityFormRef.current.getFieldValue('isOpen') &&
                        <div>
                            <Form.Item label='活动类型' name='activityType'>
                                <Radio.Group>
                                    {dict_activity_type.map((item, index) => (
                                        <Radio value={item.key}>{item.value}</Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label='VIP天数'>
                                <Form.Item name='activityDayType' >
                                    <Radio.Group>
                                        {dict_activity_day_type.map((item, index) => (
                                            <Radio value={item.key}>{item.value}</Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item name='activityDays' >
                                    {/* 天数, 随机的话是0-配置的天数 */}
                                    <InputNumber min={1} max={100000} style={{ width: base_width }} placeholder='随机的话是0-配置的天数' />
                                </Form.Item>
                            </Form.Item>

                            <Form.Item label='领取周期' name='activityCycle'>
                                {/* 领取周期(100000表示永久, 小于100000表示配置天数 */}
                                <InputNumber min={1} max={100000} style={{ width: base_width }} placeholder='领取周期(100000表示永久, 小于100000表示配置天数' />
                            </Form.Item>
                        </div>
                    }




                </Form>
            </div>
        )
    }

    //推送活动数据
    pushActivityData(data) {
        let that = this;
        let activityFormRef = that.activityFormRef;
        if (!activityFormRef || !activityFormRef.current) return;
        if (!data) {
            activityFormRef.current.current.resetFields();
            return;
        }

        activityFormRef.current.setFieldsValue(data);
    }

    //获取数据信息
    getDatas() {
        let that = this;
        let activityFormRef = that.activityFormRef;
        let values = activityFormRef.current.getFieldsValue();
        return values;
    }

}