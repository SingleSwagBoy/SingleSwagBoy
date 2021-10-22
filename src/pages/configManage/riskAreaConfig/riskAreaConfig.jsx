import React, { Component } from 'react'
import { Input, Form, Alert, Button, message } from 'antd';
import '@/style/base.css';
import { MyArea, MySyncBtn } from '@/components/views.js';
import {
    setConfig,                        //获取列表数据
    getConfig,                        //添加列表数据
} from 'api';


export default class RiskAreaConfig extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            config_key: 'RISK.AREAS',
        }
    }
    render() {
        let that = this;
        let { config_key } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="系统配置 风险地域" type="success" action={
                    <div>
                        <Button style={{ marginLeft: 5 }} onClick={() => that.onSaveClick()} >保存配置</Button>

                        <MySyncBtn type={3} name='同步缓存' params={{ key: config_key }} />
                    </div>
                } />
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef}>
                    {
                        that.formRef && that.formRef.current &&
                        <div>
                            {/* 地域 */}
                            <Form.Item label="地域" name="areas"  >
                                <MyArea formRef={that.formRef} />
                            </Form.Item>
                        </div>
                    }
                </Form>
            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.initData();
    }

    initData() {
        let that = this;
        that.refreshList();
    }

    refreshList() {
        let that = this;
        let { config_key } = that.state;
        that.forceUpdate();

        getConfig({ key: config_key }).then(res => {
            if (res.data.errCode == 0) {
                let data = res.data.data;

                if (data) {
                    console.log(data);
                    let obj = {};
                    obj.areas = data.areas;
                    that.formRef.current.setFieldsValue(obj);
                }
            }
        })
    }


    //保存被点击
    onSaveClick() {
        let that = this;
        let { config_key } = that.state;
        let value = that.formRef.current.getFieldsValue();

        let areas = value.areas;
        if (!areas) {
            message.error('请选择地域信息');
            return;
        }
        if (areas.constructor === Array) {
            areas = areas.join(',');
        }
        let obj = {};
        obj.areas = areas;


        setConfig({ key: config_key }, obj).then(res => {
            if (res.data.errCode === 0) {
                message.success('成功')
                that.refreshList();
            }
        })
    }
}