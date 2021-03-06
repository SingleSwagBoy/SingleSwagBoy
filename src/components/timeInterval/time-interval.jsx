/*
 * @Author: HuangQS
 * @Date: 2021-09-26 11:44:16
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-27 21:09:37
 * @Description: 时间段 投放时间段 播放时间段 时间段选择器
 */

import React, { Component } from 'react';
import { TimePicker, Button, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './time-interval.css';
import moment from 'moment';

let { RangePicker } = TimePicker;


export default class TimeInterval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            format: 'HH:mm',
            // time_interval_all: [],      //时间间隔 所有
            time_interval_array: [],    //时间间隔 已添加的时间
        }
    }

    render() {
        let that = this;
        let { format, time_interval_array } = that.state;

        return (
            <div className='time-interval-wrapper'>
                <Button type="primary" size='default' className='time-interval-btn' icon={<PlusOutlined />} onClick={() => that.onCreateClick()} >添加时间段</Button>
                {
                    time_interval_array.map((item, index) => {
                        let split = item.split('-');
                        let time = [];
                        time.push(moment(split[0], format));
                        time.push(moment(split[1], format));

                        return (
                            <div className='time-interval-line' key={index}>
                                <RangePicker className='time-interval-range' value={time} format={format} minuteStep={5} onChange={(time, timeString) => that.onRangePickerChange(index, time, timeString)} />
                                <Button icon={<DeleteOutlined />} onClick={() => that.onItemDelete(item, index)} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    componentDidMount() {
        let that = this;
        if (that.props.onRef) {
            that.props.onRef(that);
        }
        that.initData();
    }
    initData() {
        let that = this;
        //生成时间区间
        // let time_interval_all = that.initTimeInterval(24, 5);
        that.parseData();
    }
    //解析时间数据
    parseData() {
        let that = this;
        let value = that.props.value;
        //todo 临时值 仅作为组件测试
        // value = '11:00-12:00,13:00-14:00';
        if (value) {
            let time_array = value.split(',');
            if (time_array) {
                that.setState({ time_interval_array: time_array });
            }
        }
        //不存在数据
        else {
            that.setState({ time_interval_array: [] });
        }
    }
    onCreateClick() {
        let that = this;
        let { time_interval_array } = that.state;
        time_interval_array.push('00:00-23:55');
        that.setState({
            time_interval_array: time_interval_array,
        })
    }
    //数据删除
    onItemDelete(item, index) {


        Modal.confirm({
            title: '删除',
            content: '确认删除当前播放时间段配置信息？',
            onOk: () => {
                let that = this;
                let { time_interval_array } = that.state;
                time_interval_array.splice(index, 1);

                that.setState({
                    time_interval_array: time_interval_array,
                }, () => {
                    message.success('删除成功！')
                })
            }
        })

    }

    //时间选择器监听
    onRangePickerChange(index, time, timeString) {
        let that = this;
        let { time_interval_array } = that.state;

        time_interval_array[index] = `${timeString[0]}-${timeString[1]}`;

        that.setState({
            time_interval_array: time_interval_array,
        })
    }


    /**
     * 生成时间区间 
     * @param {*} hours     目标小时数
     * @param {*} step      间隔分钟数
     * initTimeInterval(24, 5); 以24小时，每个数据间隔5分钟
     */
    initTimeInterval(hours, step) {
        let minutes = 60;
        let timeArray = [];
        for (let i = 0; i < hours; i++) {
            let hour = '';
            //格式化小时
            if (i < 10) hour = `0${i}`;
            else hour = `${i}`;

            //格式化分钟
            for (let j = 0; j < minutes; j++) {
                if (j % step === 0) {
                    let min = '';
                    if (j < 10) min = `0${j}`;
                    else min = `${j}`;

                    let time = `${hour}:${min}`;
                    timeArray.push(time);
                }
            }
        }
        return timeArray;
    }


    //外部获取所有的时间段数据
    getData() {
        let that = this;
        let { time_interval_array } = that.state;

        if (!time_interval_array) {
            time_interval_array = '';
        }
        //存在数据
        else {
            time_interval_array = time_interval_array.join(',');
        }
        return time_interval_array;
    }

}

