/*
 * @Author: HuangQS
 * @Date: 2021-10-28 14:56:24
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-11-02 15:15:28
 * @Description: 标签配置页 公式组件
 */


import React, { Component } from 'react';
import { Input, Form, DatePicker, Button, Table, Modal, Alert, Select, message } from 'antd';
import '@/style/base.css';
import './tagConfigFormulas.css'
import { PlusOutlined } from '@ant-design/icons';
import { MyAddress } from '@/components/views.js';
import Market from "@/components/market/index" //渠道组件
import MyMarket from "@/components/myMarket/index" //新渠道组件
let privateData = {
    inputTimeOutVal: null
};

let { Option } = Select;


export default class tagConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 计算公式
            dict_operator: [
                { "value": 1, "name": "=" },
                { "value": 2, "name": "!=" },
                { "value": 3, "name": ">" },
                { "value": 4, "name": ">=" },
                { "value": 5, "name": "<" },
                { "value": 6, "name": "<=" },
                { "value": 7, "name": "in" },
                { "value": 9, "name": "notin" },
                { "value": 10, "name": "exist" },
                { "value": 11, "name": "notExist" },
            ],
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                  console.log('onSearch')
                }
            },
        }

    }
    render() {
        // <BorderLeftOutlined />
        let that = this;
        let { dict_operator } = that.state;
        let { id, formRef, dict_field, is_show_only ,productList} = that.props;      //is_show_only:仅作展示，数据不提供修改编辑
        // console.log("dict_field=====dict_field",dict_field)
        let rules = formRef.current.getFieldValue(id);   //获取外部数据
        // console.log("rulesrulesrulesrules",rules)


        if (!rules) {
            rules = [[[]]];
            let obj = {};
            obj[id] = rules;
            console.log(obj)
            formRef.current.setFieldsValue(obj);
            that.onItemCreateClick('第三层', 0, 0) //默认添加一项
        }
        //
        else if (rules.constructor === String) {
            rules = JSON.parse(rules);
            let obj = {};
            obj[id] = rules;
            formRef.current.setFieldsValue(obj);
        }

        if (!dict_field) dict_field = [];


        let view = '';

        //第一层
        if (rules && rules.length > 0) {
            // let layer1Item = rules;  //第一层数据
            view = (
                <div>
                    {/* {JSON.stringify(dict_field[0])} */}
                    {/* {JSON.stringify(rules)} */}
                    <div className="formulas-wrapper" >
                        <div className="type-wrapper">且</div>
                        <div className="formula-items">
                       
                            {
                                rules && rules.length > 0 ?
                                
                                    rules.map((layer1item, layer1index) => {
                                        return (
                                            layer1item && layer1item.length > 0 ?
                                                <div div className="formulas-wrapper">
                                                    <div className="type-wrapper">或</div>
                                                    <div className="formula-items">
                                                        {

                                                            layer1item.map((layer2item, layer2index) => {
                                                                return (
                                                                    <div div className="formulas-wrapper">
                                                                        <div className="type-wrapper">且</div>
                                                                        <div className="formula-items">
                                                                            {
                                                                                layer2item.map((layer3item, layer3index) => {
                                                                                    return (
                                                                                        <div className="formula-items-line">
                                                                                            <div className="formula-item" style={{ width: 320 }} >
                                                                                                <Select showSearch placeholder='版本' allowClear value={layer3item.field} disabled={is_show_only} onChange={(e) => { that.onFieldSelectChange(e, layer1index, layer2index, layer3index, 'field') }}
                                                                                                    filterOption={(input, option) => {
                                                                                                        if (!input) return true;
                                                                                                        let children = option.children;
                                                                                                        if (children) {
                                                                                                            let key = children[2];
                                                                                                            let isFind = false;
                                                                                                            isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                                                                            if (!isFind) {
                                                                                                                let code = children[0];
                                                                                                                isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                                                                            }
                                                                                                            return isFind;
                                                                                                        }
                                                                                                    }}>
                                                                                                    {dict_field.map((item, index) => {
                                                                                                        return <Option key={index} value={item.field}>{item.fieldName}-{item.field}</Option>
                                                                                                    })}
                                                                                                </Select>
                                                                                            </div>

                                                                                            <div className="formula-item" style={{ width: 90 }}>
                                                                                                <Select showSearch placeholder='运算符' allowClear value={layer3item.oper} disabled={is_show_only} onChange={(e) => { that.onOperatorSelectChange(e, layer1index, layer2index, layer3index, 'oper') }}>
                                                                                                    {dict_operator.map((item, index) => {
                                                                                                        return <Option key={index} value={item.value} 
                                                                                                        disabled={this.getStateOption(item,layer3item)}>{item.name}</Option>
                                                                                                    })}
                                                                                                </Select>
                                                                                            </div>
                                                                                            {
                                                                                                (layer3item.oper != 10 && layer3item.oper != 11)  &&
                                                                                                <div className="formula-item" style={{ width: 300 }}>
                                                                                                {
                                                                                                    layer3item.field == "region" &&
                                                                                                    <MyAddress onCheckAddress={(e)=>this.onCheckAddress(e, layer1index, layer2index, layer3index, 'value')} defaultAddress={(layer3item.value && !Array.isArray(layer3item.value))?layer3item.value.split(","):layer3item.value} /> ||
                                                                                                    layer3item.field == "appid" && 
                                                                                                    <Select placeholder="请选择" mode="multiple" {...this.state.selectProps}
                                                                                                    onSearch={(val)=>{
                                                                                                      console.log("val-----",val)
                                                                                                      if (privateData.inputTimeOutVal) {
                                                                                                        clearTimeout(privateData.inputTimeOutVal);
                                                                                                        privateData.inputTimeOutVal = null;
                                                                                                      }
                                                                                                      privateData.inputTimeOutVal = setTimeout(() => {
                                                                                                        if (!privateData.inputTimeOutVal) return;
                                                                                                        this.getChangeList(val)

                                                                                                      }, 1000)
                                                                                                    }} allowClear onChange={(e)=>this.onCheckSelect(e, layer1index, layer2index, layer3index, 'value')} defaultValue={(layer3item.value && !Array.isArray(layer3item.value))?layer3item.value.split(","):layer3item.value}>
                                                                                                        {
                                                                                                            productList.map(r => {
                                                                                                                return (
                                                                                                                    <Option value={r.appid} key={r.appid}>{r.name}</Option>
                                                                                                                )
                                                                                                            })
                                                                                                        }
                                                                                                    </Select> ||
                                                                                                    layer3item.field == "marketChannelName" && 
                                                                                                    // <Market getMarketReturn={(e)=>{this.checkMark(e, layer1index, layer2index, layer3index, 'value')}}
                                                                                                    //     checkData={(layer3item.value && !Array.isArray(layer3item.value))?layer3item.value.split(","):layer3item.value}/> 
                                                                                                    <MyMarket onCheckMarket={(e)=>this.onCheckMarket(e, layer1index, layer2index, layer3index, 'value')} defaultMarket={(layer3item.value && !Array.isArray(layer3item.value))?layer3item.value.split(","):layer3item.value}  />
                                                                                                        ||
                                                                                                    <Input value={layer3item.value} placeholder="取值" disabled={is_show_only} onChange={(e) => { that.onInputBlurClick(e, layer1index, layer2index, layer3index, 'value') }} />
                                                                                                }
                                                                                            </div>
                                                                                            }

                                                                                            

                                                                                            {!is_show_only && <Button disabled={is_show_only} onClick={() => { that.onItemDeleteClick('第三层', layer1index, layer2index, layer3index) }}>删除</Button>}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                        {!is_show_only && <Button size='small' icon={<PlusOutlined />} onClick={() => { that.onItemCreateClick('第三层', layer1index, layer2index) }}>维度</Button>}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    {!is_show_only && <Button size='small' disabled={is_show_only} icon={<PlusOutlined />} onClick={() => { that.onItemCreateClick('第二层', layer1index) }}>维度</Button>}
                                                </div>
                                                : <div div className="formulas-wrapper"></div>
                                        )
                                    })
                                    : <div div className="formulas-wrapper"><Button onClick={() => { that.onInitRulesClick() }} >初始化规则</Button></div>

                            }
                        </div>
                        {!is_show_only && <Button size='small' icon={<PlusOutlined />} disabled={is_show_only} onClick={() => { that.onItemCreateClick('第一层',) }}>维度</Button>}
                    </div>
                </div>
            )
        }
        return view;
    }
    componentDidMount() {
        let that = this;
        that.initData();
    }
    initData() {
        // 地域 产品线 渠道 类型数据需要特殊处理
    }
    getStateOption(item,layer3item){
        if(layer3item.field == "region"){
            if(item.value>=7){
                return false
            }else{
                return true
            }
        }else if(layer3item.field == "marketChannelName"){
            if(item.value==7){
                return false
            }else{
                return true
            }
        }else{
            return false
        }
    }
    getChangeList=(_val)=>{
        console.log("getChangeList获取的参数",_val)
    }

    // that.onInputBlurClick(e, layer1index, layer2index, layer3index, 'field')
    //输入框失去焦点
    onInputBlurClick(e, layer1index, layer2index, layer3index, targetKey) {
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        let value = e.target.value;

        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    onCheckSelect(e, layer1index, layer2index, layer3index, targetKey){
        console.log("onCheckSelect::::",e, layer1index, layer2index, layer3index, targetKey)
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        let value = e;  // .target.value

        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    checkMark(e, layer1index, layer2index, layer3index, targetKey){
        console.log("checkMark::::",e, layer1index, layer2index, layer3index, targetKey)
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        let value = e;  // .target.value

        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }

    //Field控件被选择
    onFieldSelectChange(e, layer1index, layer2index, layer3index, targetKey) {
        console.log(e, layer1index, layer2index, layer3index, targetKey,"e, layer1index, layer2index, layer3index, targetKey")
        let that = this;
        let { id, formRef, dict_field } = that.props;
        let rules = formRef.current.getFieldValue(id);
        let value = e;

        //更新type数据
        for (let i = 0, len = dict_field.length; i < len; i++) {
            let temp = dict_field[i];
            if (value === temp.field) {
                rules[layer1index][layer2index][layer3index]['type'] = temp.type;
                break;
            }
        }
        //更新运算符
        if(targetKey == "field"){
            rules[layer1index][layer2index][layer3index].oper = null;
        }
       
        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    //运算符控件被选择
    onOperatorSelectChange(e, layer1index, layer2index, layer3index, targetKey) {
        console.log("e, layer1index, layer2index, layer3index, targetKey",e, layer1index, layer2index, layer3index, targetKey)
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        let value = parseInt(e);

        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }




    //维度添加按钮被点击
    onItemCreateClick(key, layer1index, layer2index,) {
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id)|| [];

        let newData = {
            // "field": '',
            // "oper": '',
            // "value": '',
            // "type": ''
        }

        if (key === '第一层') {
            rules.push([[newData]]);
        }
        //
        else if (key === '第二层') {
            rules[layer1index].push([newData]);
        }
        //
        else if (key === '第三层') {
            console.log(key, layer1index, layer2index,"key, layer1index, layer2index,")
            rules[layer1index][layer2index].push(newData);
        }

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
    //删除按钮被点击
    onItemDeleteClick(key, layer1index, layer2index, layer3index) {
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        console.log(key, layer1index, layer2index, layer3index,rules,"key, layer1index, layer2index, layer3index")
        if(layer1index ==0 && layer2index == 0 && layer3index == 0 && rules[layer1index][layer2index].length==1){ //阻止删除最后一项
            rules[layer1index][layer2index][layer3index] ={}
            formRef.current.setFieldsValue(rules[layer1index][layer2index][layer3index]);
            that.forceUpdate();
            return
        } 
        if (key === '第三层') {

            rules[layer1index][layer2index].splice(layer3index, 1);
            let array2 = rules[layer1index][layer2index];

            if (array2) {
                if (array2.length <= 0) {
                    rules[layer1index].splice(layer2index, 1);
                }
            }

            let array1 = rules[layer1index];
            if (array1) {
                if (array1.length <= 0) {
                    rules.splice(layer1index, 1);
                }
            }


            console.log('删除11', rules);
            console.log('删除array1->', array1);
            // console.log('删除11', rules[0]);
            console.log('---------------')
            // 清除空数据
            // for (let i = 0, len = rules.length; i < len; i++) {
            //     let item = rules[i];
            //     console.log(i, item);

            //     if (item.length !== 0) {
            //         datas.push(item);
            //     }
            // }
            // if (datas.length === 0) {
            //     datas = [[[]]];
            // }

            // let datas = []
            // for (let i = 0, len = rules.length; i < len; i++) {
            //     let item = rules[i];
            //     if (!item || item.length > 0) {
            //         console.log(i, item);
            //         datas.push(item);
            //     }
            // }

            // if (datas.length == 0) {
            //     datas = [
            //         [
            //            [ { 'value': '', 'type': '', 'field': '' }]
            //         ]
            //     ];
            // }



            let obj = {};
            obj[id] = rules;
            formRef.current.setFieldsValue(obj);
            that.forceUpdate();


        }

    }

    //初始化规则被点击
    onInitRulesClick() {

    }
    onCheckAddress(value, layer1index, layer2index, layer3index, targetKey) {
        console.log(value, layer1index, layer2index, layer3index, targetKey)
        let postAddress = value.filter(item => item !== "all")
        let arr = []
        postAddress.forEach(r => {
            if (r.indexOf("-") !== -1) {
                arr.push(r.replace("-", ""))
            } else {
                arr.push(r)
            }
        })
        console.log(arr,"arr")
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
        // this.setState({
        //     address: arr
        // })
    }
    onCheckMarket(value, layer1index, layer2index, layer3index, targetKey) {
        console.log(value, layer1index, layer2index, layer3index, targetKey)
        let that = this;
        let { id, formRef } = that.props;
        let rules = formRef.current.getFieldValue(id);
        //更新参数
        rules[layer1index][layer2index][layer3index][targetKey] = value ? value : "";

        let obj = {};
        obj[id] = rules;
        formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
}