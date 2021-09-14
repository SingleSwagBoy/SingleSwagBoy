/*
 * @Author: HuangQS
 * @Date: 2021-09-14 17:13:30
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-14 17:24:42
 * @Description: 关键字类型 活动控件
 */

import React, { Component } from 'react';
import { Form, message, Switch, Radio, Input } from 'antd';

export default class wxReplyModalImageBox extends Component {
    constructor(props) {
        super(props);
        this.activityFormRef = React.createRef();

        this.state = {
            base_width: 450,
        }
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
    }

    render() {
        let that = this;
        let { base_width } = that.state;
        {/* "reply_activity": "{\"activityType\": 1, \"activityDayType\": 1, \"activityDays\":1, \"activityCycle\": 3}"
 "activityType": 1vip活动...  activityDayType: 1固定2随机 activityDays: 天数, 随机的话是0-配置的天数 activityCycle: 领取周期(100000表示永久, 小于100000表示配置天数) */}

        return (
            <div>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} style={{ width: 600 }} ref={that.activityFormRef} >

                    <Form.Item label='开展活动'>
                        <Switch checkedChildren="开" unCheckedChildren="关" />
                    </Form.Item>

                    <Form.Item label='活动类型' name='activityType'>

                    </Form.Item>

                    <Form.Item label='VIP天数'>
                        <Form.Item name='activityDayType' >
                            {/* 固定 随机 */}
                            {/* <Radio.Group>
                                                            {dict_delivery_types.map((item, index) => {
                                                                return <Radio value={item.key} key={index}> {item.value}</Radio>
                                                            })}
                                                        </Radio.Group> */}
                        </Form.Item>

                        <Form.Item name='activityDays' >
                            {/* 天数, 随机的话是0-配置的天数 */}
                            <Input style={{ width: base_width }} placeholder='随机的话是0-配置的天数' />
                        </Form.Item>
                    </Form.Item>

                    <Form.Item label='领取周期' name='activityCycle'>
                        {/* 领取周期(100000表示永久, 小于100000表示配置天数 */}
                        <Input style={{ width: base_width }} placeholder='领取周期(100000表示永久, 小于100000表示配置天数' />
                    </Form.Item>
                </Form>
            </div>
        )
    }

}