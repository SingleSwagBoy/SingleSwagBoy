/*
 * @Author: HuangQS
 * @Date: 2021-09-14 17:13:30
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-15 15:19:30
 * @Description: 关键字类型 活动控件
 */

import React, { Component } from 'react';
import { Form, message, Switch, Radio, Input, InputNumber, Select, Button } from 'antd';
import { requestNewAdTagList, setMoney,getMoney } from "api"
let { Option } = Select;
export default class wxReplyModalImageBox extends Component {
    constructor(props) {
        super(props);
        this.activityFormRef = React.createRef();

        this.state = {
            base_width: 450,
            dict_activity_type: [{ key: 1, value: 'vip活动' }, { key: 2, value: '返现金' }],
            dict_activity_day_type: [{ key: 1, value: '固定' }, { key: 2, value: '随机' }],
            dict_user_tags: [],
            surplus:0
        }
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        this.requestNewAdTagList()
    }
    render() {
        let that = this;
        let { base_width, dict_activity_type, dict_activity_day_type, dict_user_tags } = that.state;
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
                                <Radio.Group onChange={(e) => {
                                    // that.activityFormRef.current.setFieldsValue({activityType:e.target.value})
                                    this.props.onChangeType(e.target.value)
                                }}>
                                    {dict_activity_type.map((item, index) => (
                                        <Radio value={item.key}>{item.value}</Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                            {
                                this.activityFormRef.current && this.activityFormRef.current.getFieldValue("activityType") == 1
                                &&
                                <>
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
                                </>

                            }
                            {
                                this.activityFormRef.current && this.activityFormRef.current.getFieldValue("activityType") == 2
                                &&
                                <>
                                    <Form.Item label='金额'>
                                        <Form.Item name='activityDayType' >
                                            <Radio.Group>
                                                {dict_activity_day_type.map((item, index) => (
                                                    <Radio value={item.key}>{item.value}</Radio>
                                                ))}
                                            </Radio.Group>
                                        </Form.Item>

                                        <Form.Item name='activityMoney' >
                                            {/* 天数, 随机的话是0-配置的天数 */}
                                            <InputNumber min={1}  style={{ width: base_width }} placeholder='随机配置30-配置的金额（分）' />
                                        </Form.Item>
                                    </Form.Item>


                                    <Form.Item label='总金额'>
                                        <div  style={{display:"flex"}}>
                                            <Form.Item  name='activityTotalMoney'>
                                                {/* 领取周期(100000表示永久, 小于100000表示配置天数 */}
                                                <InputNumber placeholder='配置总金额' min={0} style={{ width: "200px" }}  />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" onClick={() => that.setMoney()} >更新金额</Button>
                                            </Form.Item>
                                        </div>
                                       
                                    </Form.Item>
                                    <Form.Item label='剩余金额'>
                                        <div style={{display:"flex"}}>
                                            <Form.Item>
                                                <InputNumber key={this.state.surplus} placeholder='剩余金额' min={0} defaultValue={this.state.surplus} style={{ width: "200px" }} disabled />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" onClick={() => that.getMoney()} >获取剩余金额</Button>
                                            </Form.Item>
                                        </div>
                                       
                                    </Form.Item>
                                    <Form.Item label='用户标签' name='activityTag'>
                                        <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择用户设备标签"
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
                                    <Form.Item label='参与次数' name='activityTimes'>
                                        <InputNumber placeholder='配置参与次数' min={0}  />
                                    </Form.Item>
                                </>

                            }

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

    clear() {
        let that = this;
        let activityFormRef = that.activityFormRef;
        if (activityFormRef && activityFormRef.current) {
            activityFormRef.current.resetFields();
        }
    }
    requestNewAdTagList() {
        requestNewAdTagList({ currentPage: 1, pageSize: 999999, }).then(res => {
            this.setState({
                dict_user_tags: res.data,
            });
        })
    }
    setMoney() {
        console.log(this.activityFormRef.current.getFieldValue(), "111")
        let params = {
            id: this.props.replyId,
            money: this.activityFormRef.current.getFieldValue("activityTotalMoney")
        }
        setMoney(params).then(res => {
            message.success("更新成功")
        })
    }
    getMoney(){
        getMoney({id: this.props.replyId}).then(res=>{
            this.setState({
                surplus:res.data
            })
        })
    }
}