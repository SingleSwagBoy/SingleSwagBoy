import React, { Component } from 'react'
import { getDict } from "api"
import { Checkbox, Row, Col } from 'antd';
import { } from '@ant-design/icons';
import { } from 'react-router-dom'
import { } from 'react-redux'

class MyChannel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_check_all: false,
            dict_product_line_list: [],
            checkData: [],
            is_fold_product: false
        }
    }
    componentDidMount() {
        this.getDict()
    }
    render() {
        // 传出的数据如[aaaa,bbbb,cccc]类型 需要在外层进一步处理数据aaaa,bbbb,cccc

        let that = this;
        //被选中的列表
        let { id, formRef } = that.props;
        let { dict_product_line_list, is_fold_product, } = that.state;
        let curr_check_data = formRef.current.getFieldValue(id);

        if (!curr_check_data) {
            let obj = {};
            curr_check_data = [];
            obj[id] = curr_check_data;
            formRef.current.setFieldsValue(obj);

        }
        //
        else if (curr_check_data.constructor === String) {
            curr_check_data = curr_check_data.split(",");
            let obj = {};
            obj[id] = curr_check_data;
            formRef.current.setFieldsValue(obj);
        }


        let is_check_all = dict_product_line_list.length === curr_check_data.length;        //是否选择所有数据

        return (
            <div>
                <Row >
                    <Checkbox checked={is_check_all} key={new Date().getTime() * 6} onClick={() => { that.onAllClick(is_check_all) }}>
                        全选
                    </Checkbox>
                </Row>
                <div style={{ height: is_fold_product ? 0 : "auto", overflow: "hidden", }}>
                    <Row>
                        {dict_product_line_list.map((item, index) => {

                            let is_check = false;
                            for (let i = 0, len = curr_check_data.length; i < len; i++) {
                                let temp = curr_check_data[i];
                                if (temp === item.code) {
                                    is_check = true;
                                    break;
                                }
                            }
                            return (<Col span={12} key={index}><Checkbox checked={is_check} onClick={(v) => { that.onCheckBoxClick(v, item) }} >{item.name}</Checkbox></Col>)
                        })}
                    </Row>
                </div>

                <div style={{ position: "absolute", right: "0px", top: "-20px", color: "#1890ff", cursor: "pointer", fontSize: "20px" }}
                    onClick={() => {
                        this.setState({ is_fold_product: !is_fold_product })
                    }}
                >
                    {this.state.is_fold_product ? "点击展开" : "点击折叠"}
                </div>
            </div>

        )
    }
    //当全选按钮被点击
    onAllClick(is_check) {
        let that = this;

        let { id, formRef } = that.props;
        let { dict_product_line_list, } = that.state;

        let maps = [];
        if (!is_check) {
            for (let i = 0, len = dict_product_line_list.length; i < len; i++) {
                let item = dict_product_line_list[i];
                maps.push(item.code);
            }
        }

        let obj = {};
        obj[id] = maps;
        console.log(obj, obj[id])
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    //选择框被点击
    onCheckBoxClick(v, item) {
        let that = this;
        let is_check = v.target.checked;
        let { id, formRef } = that.props;

        let curr_check_data = formRef.current.getFieldValue(id);
        //选中
        if (is_check) {
            curr_check_data.push(item.code);
            let obj = {};
            obj[id] = curr_check_data;
            formRef.current.setFieldsValue(obj);
        }
        //取消选中
        else {
            for (let i = 0, len = curr_check_data.length; i < len; i++) {
                let temp = curr_check_data[i];
                if (temp === item.code) {
                    curr_check_data.splice(i, 1);
                    let obj = {};
                    obj[id] = curr_check_data;
                    formRef.current.setFieldsValue(obj);
                    break;
                }
            }

        }
        that.forceUpdate();
    }
    getDict() { //获取产品线
        let that = this;
        let params = {
            page: { isPage: 9 },
            prodType: 1
        }
        getDict(params).then(res => {
            that.setState({
                dict_product_line_list: res.data.data,
            })
        })
    }
}

export default MyChannel