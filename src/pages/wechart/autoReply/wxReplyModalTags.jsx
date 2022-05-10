import React, { Component } from 'react';
import { Tag, Card, Col, Row, Select } from 'antd';
import { CloseOutlined } from "@ant-design/icons"
import "./wxReplyModalTags.css";
let { Option } = Select;

export default class wxReplyModalTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_open_tags: false,    //是否展示控件
            selectTagList: []
        }
    }


    componentDidMount() {
        this.props.onRef(this);
    }

    render() {
        let that = this;
        let { is_open_tags } = that.state;
        let { tags, tag_select_id, dict_public_types, menu_type } = that.props;

        let view = '';
        if (tags && tags.length > 0) {
            view = (
                <div className="custom-tag-wrapper">
                    <div className="custom-tag-box" style={{ display: "flex", "alignItems": "center" }}>
                        {
                            tags.map((item, index) => {
                                return (
                                    tag_select_id === index ? <div className="custom-tag-item" key={index}>
                                        <Tag className="custom-tag-pane" color="volcano" closable
                                            onClick={() => that.onTagClick(index)} onClose={(e) => { that.onTagDeleteClick(e, index) }}>
                                            当前选择-{index + 1}-{item.name}
                                        </Tag>
                                    </div> : ''
                                )
                            })
                        }
                        {
                            menu_type == "keywords" &&
                            <div>
                                <Select placeholder='搜索' style={{ width: "200px" }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                    onChange={(e) => {
                                        let index = tags.findIndex(item => item.keywords == e)
                                        if (index > -1) {
                                            that.onTagClick(index)
                                        }
                                    }}>
                                    {tags.map((item, index) => (
                                        <Option value={item.keywords} key={index}>{item.keywords}</Option>
                                    ))}
                                </Select>
                            </div>
                        }
                        {
                            menu_type == "other" &&
                            <>
                                <div style={{ "marginRight": "5px" }}>
                                    <Select placeholder='搜索' style={{ width: "200px" }}
                                        allowClear
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        showSearch
                                        onChange={(e) => {
                                            console.log(e)
                                            // let index = tags.findIndex(item => item.name == e)
                                            let arr = tags.filter(item => item.wxCode.includes(e))
                                            console.log(arr)
                                            this.setState({ selectTagList: arr })
                                        }}>
                                        {dict_public_types.map((item, index) => (
                                            <Option value={item.code} key={index}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                {
                                    this.state.selectTagList.length > 0 &&
                                    <div>
                                        <Select placeholder='搜索' style={{ width: "200px" }}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            showSearch
                                            onChange={(e) => {
                                                let index = tags.findIndex(item => item.name == e)
                                                if (index > -1) {
                                                    that.onTagClick(index)
                                                }
                                            }}>
                                            {this.state.selectTagList.map((item, index) => (
                                                <Option value={item.name} key={index}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                }

                            </>

                        }

                    </div>
                    <div className={`custom-tag-boxs ${!is_open_tags ? 'custom-tag-box-close' : ''}`}>
                        {
                            <Row gutter={24}>
                                {tags.map((item, index) => {
                                    return (
                                        <Col span={4} onClick={() => that.onTagClick(index)} style={{ marginBottom: "10px" }}>
                                            <Card title={index + 1 + "-" + item.name} bordered={true} style={{ backgroundColor: tag_select_id === index && '#fff2e8' }}
                                                extra={<CloseOutlined onClick={(e) => that.onTagDeleteClick(e, index)} />}

                                            >
                                                {
                                                    menu_type == "keywords" &&
                                                    <div>
                                                        <div>关键字：<span style={{ color: "#d4380d" }}>{item.keywords}</span></div>
                                                        <div>匹配规则：<span style={{ color: "#d4380d" }}>{item.ruleType == 1 ? "全匹配" : item.ruleType == 2 ? "半匹配" : "未知"}</span></div>
                                                        <div>回复公众号：<span style={{ color: "#d4380d" }}>{this.getWxName(item)}</span></div>
                                                        <div>状态：<span style={{ color: "#d4380d" }}>{item.status == 1 ? "有效" : "无效"}</span></div>
                                                    </div>
                                                }
                                                {
                                                    menu_type == "other" &&
                                                    <>
                                                        <div>回复公众号：<span style={{ color: "#d4380d" }}>{this.getWxName(item)}</span></div>
                                                        <div>状态：<span style={{ color: "#d4380d" }}>{item.status == 1 ? "有效" : "无效"}</span></div>
                                                    </>

                                                }
                                                {
                                                    (menu_type === 'messageDefault' || menu_type === 'addFriend' || menu_type === 'scanSubscribe' || menu_type === 'scan' || menu_type === 'streamInvalidScan') &&
                                                    <>
                                                        <div>标签：<span style={{ color: "#d4380d" }}>{item.code || ""}</span></div>
                                                        {/* <div>状态：<span style={{ color: "#d4380d" }}>{item.status == 1 ? "有效" : "无效"}</span></div> */}
                                                    </>

                                                }

                                            </Card>
                                        </Col>
                                    )
                                })}
                            </Row>
                            //      <div className="custom-tag-item" key={index}>
                            //      <Tag className="custom-tag-pane" color={tag_select_id === index ? 'volcano' : ''} closable
                            //          onClick={() => that.onTagClick(index)} onClose={(e) => { that.onTagDeleteClick(e, index) }}>
                            //          {index + 1}-{item.name}
                            //      </Tag>
                            //  </div>
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
                        <div className='custom-tag-item-empty' >
                            没有获取到Tag数据，请刷新列表。
                        </div>
                    </div>
                </div>
            )
        }

        return view;
    }
    getWxName(item) {
        let arr = item.wxCode ? item.wxCode.split(",") : []
        let list = this.props.dict_public_types.filter(item => arr.some(h => h == item.code))
        let word = []
        if (list.length > 0) {
            list.forEach(r => {
                word.push(r.name)
            })
        }
        return word.join(",")
    }
    //tag标签被选择
    onTagClick(index) {
        let that = this;
        that.props.onSelectIdChange(index);
        document.querySelector('.ant-layout-content').scrollTo({
            top:document.querySelector('.reply-wrapper-out').offsetTop,
            behavior: "smooth"
        })
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