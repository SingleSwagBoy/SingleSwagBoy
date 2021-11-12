import React, { Component } from 'react'
import { getZZShow ,saveZZShow} from 'api'
import { Breadcrumb, Card, Image, Button, message, Table, Modal, DatePicker, Input, Form, Select, TimePicker, Switch, } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
const format = 'HH:mm';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 10, span: 14 },
            },
            tagList: [],
        }
    }
    render() {
        let { layout, tagList } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>提现商品列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                extra={
                    <div>
                        <MySyncBtn type={14} name='同步缓存' params={{"key":"notice"}} />
                    </div>
                }
                >
                    <Form {...layout}
                        name="taskForm"
                        ref={this.formRef}
                        onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="公告内容" name="content" rules={[{ required: true, message: '请填写公告内容' }]}>
                            <Input.TextArea placeholder="请输入公告内容" maxLength={150} />
                        </Form.Item>
                        <Form.Item label="开始时间-结束时间" name="time" rules={[{ required: true, message: '请选择开始时间-结束时间' }]}>
                            <RangePicker placeholder={['上线时间', '下线时间']} showTime ></RangePicker>
                        </Form.Item>
                        <Form.Item label="状态" name="state" valuePropName="checked">
                            <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                        </Form.Item>
                        <Form.Item {...this.state.tailLayout}>
                            {/* <Button onClick={() => { this.setState({ entranceState: false }) }}>取消</Button> */}
                            <Button htmlType="submit" type="primary" style={{ margin: "0 20px" ,width:"200px"}}>
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

            </div>
        )
    }
    componentDidMount() {
       this.getZZShow()
    }
   
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        this.saveZZShow(val)
    }
    getUploadFileUrl(name, file) {   // 图片上传的方法
        console.log(name,file, "获取上传的图片路径")
        this.formRef.current.setFieldsValue({ [name]: file })
        this.forceUpdate()
    }
    getZZShow() {
        let params = {
            key: "notice"
        }
        getZZShow(params).then(res => {
            let val = res.data
            val.time = [moment(val.startAt),moment(val.endAt)]
            val.state = val.state == 1 ? true : false
            this.formRef.current.setFieldsValue(val)
        })
    }
    saveZZShow(val){
        let params = {
            ...val,
            state:val.state ? 1 : 0,
            startAt:val.time[0].valueOf(),
            endAt:val.time[1].valueOf()
        }
        let header={
            key: "notice"
        }
        // return console.log(params)
        saveZZShow(params,header).then(res => {
            message.success("保存成功")
        })
    }
}