/*
 * @Author: HuangQS
 * @Date: 2021-09-26 11:44:16
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-26 16:47:41
 * @Description: 时间段 投放时间段 播放时间段 时间段选择器
 */

import React, { Component, useEffect } from 'react';
import { TimePicker, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './time-interval.css';
import moment from 'moment';

let { RangePicker } = TimePicker;


export default class TimeInterval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_interval_all: [],      //时间间隔 所有
            time_interval_array: [],    //时间间隔 已添加的时间
        }
    }

    render() {
        let that = this;
        let { time_interval_array } = that.state;
        let format = 'HH:mm';

        return (
            <div className='time-interval-wrapper'>
                <Button type="primary" size='default' className='time-interval-btn' icon={<PlusOutlined />} onClick={() => that.onTimeIntervalClick()} >添加时间段</Button>
                {
                    time_interval_array.map((item, index) => {
                        let split = item.split('-');
                        let time = [];
                        time.push(moment(split[0], format));
                        time.push(moment(split[1], format));

                        return (
                            <div className='time-interval-line'>
                                <RangePicker className='time-interval-range' defaultValue={time} format={format} minuteStep={5} />
                                <Button icon={<DeleteOutlined />} onClick={() => that.onTimeIntervalDelete(item, index)} />
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
        let time_interval_all = that.initTimeInterval(24, 5);

        that.setState({
            time_interval_all: time_interval_all,
        }, () => {
            that.parseData();
        })
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
    }
    onTimeIntervalClick() {
        let that = this;
        let { time_interval_array } = that.state;
        time_interval_array.push('00:00-23:55');
        that.setState({
            time_interval_array: time_interval_array,
        })
    }
    //数据删除
    onTimeIntervalDelete(item, index) {
        let that = this;
        let { time_interval_array } = that.state;

        time_interval_array.splice(index, 1);
        that.setState({
            time_interval_array: time_interval_array,
        })
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

}

