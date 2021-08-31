/*
 * @Description: 数据加载 等待框
 * @Author: HuangQS
 * @Date: 2021-08-25 13:36:29
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-08-27 18:17:26
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
            is_show: false,
            img_url: './loading.gif',

        }

    }
    render() {
        let { is_show, img_url } = this.state;

        return (
            <Modal visible={is_show} footer={null} closable={false} centered  transitionName="" maskTransitionName="">
                <div className="main">
                    <img className='img' src={img_loading} alt />
                    <span className='desc'>加载中</span>
                </div>
            </Modal >
        )
    }


    showLoading() {
        let that = this;
        that.setState({ is_show: true })
        console.log("show!!!!")
    }

    hideLoading() {
        let that = this;
        that.setState({ is_show: false })
        console.log("hide!!!!")

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