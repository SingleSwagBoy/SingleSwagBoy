import React, { Component } from 'react';
import { Tag } from 'antd';

import "./wxReplyModalTags.css";


export default class wxReplyModalTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_open_tags: false,    //是否展示控件
        }
    }


    componentDidMount() {
        this.props.onRef(this);
    }

    render() {
        let that = this;
        let { is_open_tags } = that.state;
        let { tags, tag_select_id } = that.props;

        let view = '';
        if (tags && tags.length > 0) {
            view = (
                <div className="custom-tag-wrapper">
                    <div className={`custom-tag-box ${!is_open_tags ? 'custom-tag-box-close' : ''}`}>
                        {
                            tags.map((item, index) => {
                                return (
                                    <div className="custom-tag-item">
                                        <Tag className="custom-tag-pane" color={tag_select_id === index ? 'volcano' : ''} closable
                                            onClick={() => that.onTagClick(index)} onClose={(e) => { that.onTagDeleteClick(e, index) }}>
                                            {item.name}
                                        </Tag>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="custom-extend-box">
                        <div className="custom-extend-item" onClick={() => that.onExtendClick()}>
                            {is_open_tags ? '收起列表' : '展开列表'}
                        </div>
                    </div>
                </div >
            )
        } else {
            view = (
                <div className="custom-tag-wrapper">
                    <div className="custom-tag-box">
                        <div className='custom-tag-empty' >
                            没有获取到Tag数据，请刷新列表。
                        </div>
                    </div>
                </div>
            )

        }

        return view;
    }

    //tag标签被选择
    onTagClick(index) {
        let that = this;
        that.props.onSelectIdChange(index);
    }

    //删除Tag按钮被点击
    onTagDeleteClick(e, index) {
        e.preventDefault();
        let that = this;
        that.props.onTabsDeleteClick(index);
    }

    //展开关闭按钮被点击
    onExtendClick() {
        let that = this;
        let is_open_tags = that.state.is_open_tags;
        that.setState({ is_open_tags: !is_open_tags });
    }

}