/*
 * @Description: 数据加载 等待框
 * @Author: HuangQS
 * @Date: 2021-08-25 13:36:29
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-26 18:43:28
 */


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import img_loading from './loading.gif';
import './loading.css'


class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_init: false,
            is_show: false,
            img_url: './loading.gif',
        }
    }
    componentDidMount() {
        let that = this;
        that.setState({
            is_init: true,
        })
    }

    render() {
        let that = this;
        let { is_show, img_url } = that.state;

        return (
            <Modal visible={is_show} footer={null} centered transitionName="" maskTransitionName=""
                /**closable={false}**/ onCancel={() => {
                    that.setState({
                        is_show: false,
                    })
                }}>
                <div className="main">
                    <img className='img' src={img_loading} alt='true' />
                    <span className='desc'>加载中</span>
                </div>
            </Modal >
        )
    }


    showLoading() {
        let that = this;
        let { is_init } = that.state;
        if (is_init) {
            that.setState({ is_show: true })
        }
    }

    hideLoading() {
        let that = this;
        let { is_init } = that.state;
        if (is_init) {
            that.setState({ is_show: false })
        }
    }

}

// ========================
let div = document.createElement('div');

let props = {};

let Box = ReactDOM.render(React.createElement(
    Loading,
    props,
), div);


export default Box;