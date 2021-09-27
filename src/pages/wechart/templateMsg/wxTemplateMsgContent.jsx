/*
 * @Author: HuangQS
 * @Date: 2021-09-27 14:10:05
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-27 17:17:51
 * @Description: 模版内容行数据
 */

import React, { Component } from 'react';
import { Input, Button, Divider, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './wxTemplateMsgContent.css';

let { TextArea } = Input;

export default class WxTemplateMsgContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_show_help: false,

            content_array: [
                {
                    key: '',
                    color: '',
                    title: '',
                }
            ],
        }
    }


    render() {
        let that = this;
        let { content_array, is_show_help } = that.state;

        return (
            <div div className='wx-msg-content-wrapper' >
                {/*mini_config  {\n    \"appid\": \"wx9e8718eb2360dfb8\",\n    \"pagepath\": \"pages/recharge/main?source=mb\"\n} */}
            
                <Button type="primary" size='default' className='wx-msg-content-btn' icon={<PlusOutlined />} onClick={() => that.onCreateClick()} >增加模板内容行数据</Button>
                {
                    content_array.map((item, index) => {
                        return (
                            <div>
                                {(index + 1) % 2 != 0 ? <Divider>第{index + 1}条</Divider> : <Divider />}
                                {/* <Divider>第{index + 1}条</Divider> */}
                                <div>
                                    <Row >
                                        <Col span={9}>
                                            <Input value={item.key} addonBefore="key" placeholder='key' onChange={(e) => { that.onInputChange(e, index, 'key', item) }} />
                                        </Col>
                                        <Col span={9}>
                                            <Input value={item.color} style={{ marginLeft: 4 }} addonBefore="颜色" placeholder='颜色' onChange={(e) => { that.onInputChange(e, index, 'color', item) }} />
                                        </Col>
                                        <Col span={2}>
                                            <Button style={{ marginLeft: 8 }} icon={<DeleteOutlined />} onClick={() => that.onItemDelete(item, index)} >删除</Button>
                                        </Col>
                                    </Row>

                                    <TextArea value={item.title} style={{ marginTop: 5 }} placeholder='请输入文案内容' autoSize={{ minRows: 2, maxRows: 5 }} onChange={(e) => { that.onInputChange(e, index, 'title', item) }} />
                                </div>
                            </div>
                        )
                    })
                }
                <Divider />
                <Button type="link" block onClick={() => { that.onShowHideHelpClick() }}>{is_show_help ? '隐藏配置说明' : '展示配置说明'}</Button>

                {
                    is_show_help &&
                    <div>
                        <div>注意：key为模版消息体中的英文单词，如：first、keywords1等</div>
                        <div>文案中：可以用</div>
                        <div>#now# 代表当前日期 2006年01月02日 </div>
                        <div>#nowstamp# 当前年月日时分 2006年01月02日15:04:05 </div>
                        <div>#name# 用户昵称</div>
                        <div>#huanhang# 插入换行</div>
                        <div>#msg1# 代替消息中的msg1</div>
                        <div>#msg2#" 代替消息中的msg2</div>
                        <div>#msg12#" 代替消息中的msg12</div>
                    </div>
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
        that.parseData();
    }

    parseData() {
        let that = this;
        let value = that.props.value;
        if (value) {
            console.log('wx_msg_content');
            console.log(value);
        }
    }


    //增加数据按钮被点击
    onCreateClick() {
        let that = this;
        let { content_array } = that.state;

        content_array.push(
            {
                key: '',
                color: '',
                title: '',
            }
        )
        that.setState({
            content_array: content_array,
        })

    }
    //数据删除
    onItemDelete(item, index) {
        let that = this;
        let { content_array } = that.state;

        content_array.splice(index, 1);

        that.setState({
            content_array: content_array,
        })
    }

    //输入框监听
    onInputChange(e, index, target_name, item) {
        let that = this;
        let { content_array } = that.state;
        item[target_name] = e.target.value;
        content_array[index] = item;

        that.setState({
            content_array: content_array,
        })
    }



    //展示|隐藏说明被点击
    onShowHideHelpClick() {
        let that = this;
        let { is_show_help } = that.state;

        that.setState({
            is_show_help: !is_show_help,
        })

    }
}