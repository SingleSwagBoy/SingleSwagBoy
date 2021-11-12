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
                        <MySyncBtn type={14} name='同步缓存' params={{"key":"randText"}} />
                    </div>
                }
                >
                    <Form {...layout}
                        name="taskForm"
                        ref={this.formRef}
                        onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="随机提现开关" name="switch" valuePropName="checked">
                            <Switch checkedChildren="开" unCheckedChildren="关" ></Switch>
                        </Form.Item>
                        <Form.Item label="提现图片" name="backgroundUrl" rules={[{ required: true, message: '请上传提现图片' }]}>
                            <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this,"backgroundUrl")}
                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("backgroundUrl")}
                            />
                        </Form.Item>
                        <Form.Item label="弹窗图片" name="popPicture" rules={[{ required: true, message: '请上传弹窗图片' }]}>
                            <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this,"popPicture")}
                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("popPicture")}
                            />
                        </Form.Item>
                        <Form.Item label="弹窗提示" name="popNotice" rules={[{ required: true, message: '请填写弹窗提示' }]}>
                            <Input placeholder="请输入弹窗提示" />
                        </Form.Item>

                        <Form.Item label="开始时间" name="startAt" >
                            <TimePicker format={format} />
                        </Form.Item>
                        <Form.Item label="结束时间" name="endAt" >
                            <TimePicker format={format} />
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
            key: "randText"
        }
        getZZShow(params).then(res => {
            let val = res.data
            val.startAt = val.startAt?moment(val.startAt,format):""
            val.endAt = val.endAt?moment(val.endAt,format):""
            val.switch = val.switch == "open"? true :false
            this.formRef.current.setFieldsValue(val)
            this.forceUpdate()
        })
    }
    saveZZShow(val){
        let params = {
            ...val,
            switch:val.switch ? "open" : "close",
            startAt:moment(val.startAt).format(format),
            endAt:moment(val.endAt).format(format)
        }
        let header={
            key: "randText"
        }
        saveZZShow(params,header).then(res => {
            message.success("保存成功")
        })
    }
}