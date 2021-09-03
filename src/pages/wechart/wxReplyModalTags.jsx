import React, { Component } from 'react';
import { Button, Form, Radio } from 'antd';

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
        // return (

        //     <div className='custom-tag-wrapper'>
        //         {
        //             tags && tags.map((item, index) => {


        //                 if (is_open_tags) {
        //                     <div className='custom-tag-pane' onClick={() => that.onTagClick(index)}>
        //                         {item.name}
        //                     </div>
        //                 }


        //             })
        //         }
        //     </div>
        // )

        let view = '';
        if (tags && tags.length > 0) {
            view = (
                <div className="custom-tag-wrapper">
                    <div className={`custom-tag-box ${!is_open_tags ? 'custom-tag-box-close' : ''}`}>
                        {
                            tags.map((item, index) => {
                                return <div className={`custom-tag-pane ${tag_select_id === index ? 'custom-tag-pane-select' : ''}`}
                                    onClick={() => that.onTagClick(index)}>
                                    {item.name}
                                </div>
                            })
                        }
                    </div>
                    <div className="custom-extend-box">
                        <div className="custom-extend-item" onClick={() => that.onExtendClick()}>
                            {is_open_tags ? '收起列表' : '展开列表'}
                        </div>
                    </div>
                </div>
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

    //展开关闭按钮被点击
    onExtendClick() {
        let that = this;
        let is_open_tags = that.state.is_open_tags;
        that.setState({ is_open_tags: !is_open_tags });
    }

}