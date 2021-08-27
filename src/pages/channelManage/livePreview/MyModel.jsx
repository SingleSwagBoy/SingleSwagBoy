import React, { Component } from 'react'
// import request from 'utils/request'
import { getProgramsList, updateLivePreview, addLivePreview } from 'api'
import { Button, message, Modal, Form, Input, Select } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import "./style.css"
const { Option } = Select;
let privateData = {
    inputTimeOutVal: null
};
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            layout: {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
            },
            tailLayout: {
                wrapperCol: { offset: 6, span: 18 },
            },
            programGrounp: [],
            defaultProgram: [],
            fatherData: "",
            selectProps: {
                optionFilterProp: "children",
                // filterOption(input, option){
                //   return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // },
                showSearch() {
                    console.log('onSearch')
                }
            },
        }
    }
    render() {

        return (
            <div>
                {/* 客服消息框 */}
                <Modal
                    title="客服消息"
                    centered
                    visible={this.props.visible}
                    onCancel={() => { this.props.closeModel() }}
                    footer={null}
                    // forceRender={true}
                    width={800}
                >
                    {
                        <Form
                            {...this.state.layout}
                            name="voting"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}
                        >
                            <Form.Item label="节目信息" name="name" rules={[{ required: true, message: '请输入节目信息' }]}>
                                <Select
                                    placeholder="请输入节目信息 "
                                    allowClear
                                    {...this.state.selectProps}
                                    onSearch={(val) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            this.getProgramsList(val)
                                        }, 1000)
                                    }}
                                >
                                    {
                                        this.state.programGrounp.map(r => {
                                            return (
                                                <Option value={r.value} key={r.value}>{r.label}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="节目名" name="showTitle" rules={[{ required: true, message: '请输入节目名' }]} >
                                <Input />
                            </Form.Item>
                            <Form.Item label="节目详情" name="showDetail" rules={[{ required: true, message: '请输入节目详情' }]} >
                                <Input />
                            </Form.Item>
                            <Form.Item label="头图地址" required={true} >
                                <Form.Item name="picUrl" style={{ display: 'inline-flex', width: 'calc(70% - 8px)', }} ules={[{ required: true, message: '请上传头图地址' }]} >

                                    <Input.TextArea onChange={(val) => {
                                        console.log(val.target.value)
                                        this.setState({
                                            test: 1
                                        })
                                        this.formRef.current.setFieldsValue({ picUrl: val.target.value })
                                    }} />
                                </Form.Item>
                                <Form.Item name="picUrl" style={{ display: 'inline-flex', width: 'calc(30%)', }}>

                                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this, "picUrl")}
                                        imageUrl={this.formRef.current ? this.formRef.current.getFieldValue("picUrl") : ""}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="节目图地址" required={true} >
                                <Form.Item name="adImg" rules={[{ required: true, message: '请上传节目图地址' }]} style={{ display: 'inline-flex', width: 'calc(70% - 8px)', }}>
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item name="adImg" style={{ display: 'inline-flex', width: 'calc(30%)', }}                                >
                                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this, "adImg")}
                                        imageUrl={this.formRef.current ? this.formRef.current.getFieldValue("adImg") : ""} />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="预告片">
                                <Form.Item name="source" style={{ display: 'inline-flex', width: 'calc(70% - 8px)', }}    >
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item name="source" style={{ display: 'inline-flex', width: 'calc(30%)', }}       >
                                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this, "source")}
                                        postUrl={"/mms/file/upload?dir=live_preview"}
                                        imageUrl={this.formRef.current ? this.formRef.current.getFieldValue("source") : ""}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="轮播文案" name="copyWriter"
                            // style={{ display: 'inline-flex', width: 'calc(50% - 8px)',}}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="节目描述" name="showDescrip"
                            // style={{ display: 'inline-flex', width: 'calc(50% - 8px)',}}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item {...this.state.tailLayout}>
                                <Button htmlType="submit" type="primary" >
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </div>

        )
    }
    componentDidMount() {

    }
    getFormData(data) {
        console.log(data, "data")
        if (data) {
            this.formRef.current.setFieldsValue(data)
            this.setState({
                fatherData: data
            })
        } else {
            this.formRef.current.resetFields()
            this.setState({
                fatherData: ""
            })
        }
    }
    submitForm(val) {
        // console.log(this.state.fatherData)
        if (this.state.fatherData) {
            // this.updateLivePreview(val)
            this.requenstSubmitCreateUpdate(false, val);
        } else {
            // this.addLivePreview(val)
            this.requenstSubmitCreateUpdate(true, val);
        }
    }
    addLivePreview(val) {
        let arr = this.state.defaultProgram[val.name]
        let getName = []
        getName = this.state.programGrounp.filter(item => item.value == val.name)
        let params = {
            ...val,
            channelCode: arr ? arr.channel_id : "",
            startTime: arr ? arr.start_time * 1000 : "",
            endTime: arr ? arr.end_time * 1000 : "",
            name: getName.length > 0 ? getName[0].label : ""
        }
        console.log(params)
        addLivePreview(params).then(res => {
            if (res.data.errCode === 0) {
                message.success("新增成功")
                this.props.closeModel()
                this.props.getLivePreview()
            } else {
                message.error("新增失败")
            }
        })
    }
    updateLivePreview(val) {
        let arr = this.state.defaultProgram[val.name]
        console.log(arr, "arr")
        let getName = []
        getName = this.state.programGrounp.filter(item => item.value == val.name)
        let params = {
            ...this.state.fatherData,
            ...val,
            channelCode: arr ? arr.channel_id : "",
            startTime: arr ? arr.start_time * 1000 : "",
            endTime: arr ? arr.end_time * 1000 : "",
            name: getName.length > 0 ? getName[0].label : ""
        }
        console.log(params)
        updateLivePreview(params).then(res => {
            if (res.data.errCode === 0) {
                message.success("更新成功")
                this.props.closeModel()
                this.props.getLivePreview()
            } else {
                message.error("更新失败")
            }
        })
    }
    //申请发起创建 or 更新数据
    requenstSubmitCreateUpdate(is_create, val) {
        let that = this;
        let arr = that.state.defaultProgram[val.name]
        let getName = []
        getName = that.state.programGrounp.filter(item => item.value == val.name)
        let params = {
            ...val,
            channelCode: arr ? arr.channel_id : "",
            programId: arr ? arr.program_id : "",

            startTime: arr ? arr.start_time * 1000 : "",
            endTime: arr ? arr.end_time * 1000 : "",
            name: getName.length > 0 ? getName[0].label : ""
        };

        (is_create ? addLivePreview(params) : updateLivePreview(params))
            .then(res => {
                if (res.data.errCode === 0) {
                    message.success(is_create ? "新增成功" : "更新成功")
                    that.props.closeModel()
                    that.props.getLivePreview()
                } else {
                    message.error(is_create ? "新增失败" : "更新失败")
                }
            })

    }


    getUploadFileUrl(type, url) {
        console.log(type, url, "回传回来的url")
        this.formRef.current.setFieldsValue({ [type]: url })
        this.setState({
            time: 1
        })
    }
    getProgramsList(val) {
        if (!val) return
        let param = {
            keyword: val,
            channelId: 4
        }
        getProgramsList(param).then(res => {
            if (res.data.errCode === 0) {
                let a = Object.entries(res.data.data)
                console.log(a, "a")
                let b = []
                for (const [key, value] of a) {
                    b.push({ label: util.formatTime(value.start_time, "", 2) + "=》" + value.name + "-" + value.channel_id, value: key })
                }
                console.log(b, "b")
                this.setState({
                    programGrounp: b,
                    defaultProgram: res.data.data
                })
            }
        })
    }
}
