/*
 * @Author: HuangQS
 * @Date: 2021-10-26 11:18:31
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-26 11:26:09
 * @Description: 广告组策略
 */
import React, { Component } from 'react';

export default class adGroup extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {}
    
    }

    render() {

        return (<div>广告组策略</div>);
    }


    componentDidMount() {
        let that = this;
        that.initData();
    }

    initData() {
        let that = this;
    
    }

    refreshList() {
        
    }
}