/*
 * @Author: HuangQS
 * @Date: 2021-10-27 10:47:23
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-01 17:31:31
 * @Description: Tag列表 多个Tag选项切换
 */


import React, { Component } from 'react';
import { Tag, Button } from 'antd';
import "./tag-select.css";

export default class tagSelect extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            is_open_tags: false,
            currentId:""
        }
    }
    render() {
        let that = this;
        let { is_open_tags,currentId } = that.state;
        let { tags, tag_select_id, show_extemd_box, btns } = that.props;
        let view = '';
        if (tags && tags.length > 0) {
            view = (
                <div className="custom-tag-wrapper">
                    <div className={`custom-tag-box ${!is_open_tags ? 'custom-tag-box-close' : ''}`}>
                        {
                            tags.map((item, index) => {
                                return (
                                    <div className="custom-tag-item" key={index}>
                                        <Tag className="custom-tag-pane" color={item.adId === tag_select_id ? 'volcano' : ''} closable
                                            onClick={() => that.onTagClick(index,item.adId)} onClose={(e) => { that.onTagDeleteClick(e, index,item.adId) }}>
                                            {index + 1}-{item.adName}
                                        </Tag>
                                    </div>
                                )
                            })
                        }
                        {/* 添加按钮 */}
                        {btns && btns.length > 0 &&
                            <div className="custom-tag-item custom-tag-item-btn" key='tag-create-key'>
                                {
                                    btns.map((item, index) => {
                                        return <Button key={`btn_${index}`} className="custom-tag-pane" onClick={() => { that.onCraeteClick(item) }} >{item}</Button>
                                    })
                                }
                            </div>
                        }

                    </div>

                    {/* 伸缩列表 */}
                    {show_extemd_box &&
                        <div className="custom-extend-box">
                            <div className="custom-extend-item" onClick={() => that.onExtendClick()}>
                                {is_open_tags ? '收起列表' : '展开列表'}
                            </div>
                        </div>
                    }
                </div >
            )
        } else {
            view = (
                <div className="custom-tag-wrapper">
                    <div className="custom-tag-box">
                        <div className='custom-tag-item-empty' >
                            暂无配置
                        </div>
                        {btns && btns.length > 0 &&
                            <div className="custom-tag-item custom-tag-item-btn" key='tag-create-key'>
                                {
                                    btns.map((item, index) => {
                                        return <Button key={`btn_${index}`} className="custom-tag-pane" onClick={() => { that.onCraeteClick(item) }} >{item}</Button>
                                    })
                                }
                            </div>
                        }

                    </div>
                </div>
            )
        }

        return view;
    }

    onCraeteClick(key) {
        let that = this;
        that.props.onTagCreateClick(key);
    }

    //tag标签被选择
    onTagClick(index,id) {
        let that = this;
        that.props.onSelectIdChange(index,id);
        this.setState({
            currentId:id
        })
    }

    //删除Tag按钮被点击
    onTagDeleteClick(e, index,id) {
        e.preventDefault();
        let that = this;
        that.props.onTabsDeleteClick(index,id);
    }

    //展开关闭按钮被点击
    onExtendClick() {
        let that = this;
        let is_open_tags = that.state.is_open_tags;
        that.setState({ is_open_tags: !is_open_tags });
    }


}