import React, { Component,useState, useEffect, useCallback  } from 'react'

import { uploadImage, deleteChannelTopic, syncChannelNew,changeChannelTopic } from 'api'
import { Breadcrumb, Card, Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, InputNumber,Switch,Radio } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
// import ContentDialog from "./contentDialog"
import util from 'utils'
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
function GoodPlay(){
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(10);
    const [total,settotal]=useState(0);
    const [lists,setlists]=useState([
        { name: "扫黑风暴", sort: 1, status: 1, id: 1,imgUrl:"" },
        { name: "啊啊啊啊", sort: 2, status: 2, id: 2,imgUrl:"" }
    ]);
    const [loading,setloading]=useState(false);
    const [btnLoading,setbtnLoading]=useState(false);
    const [columns,setcolumns]=useState([
        { title: "顺序", dataIndex: "sort", key: "sort",width:100, },
        { title: "专题 id", dataIndex: "id", key: "id", width:100,},
        { title: "专题名称", dataIndex: "name", key: "name", },
        {
            title: "专题封面", dataIndex: "imgUrl", key: "imgUrl",
            render: (rowValue, row, index) => {
                return (<Image width={80} src={row.imgUrl} />)
            }
        },
        {
            title: '状态', dataIndex: 'status', key: 'status',
            render: (rowValue, row, index) => {
                return (
                    <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                    defaultChecked={rowValue == 1 ? true : false}
                    onChange={(val) => {
                        console.log(val)
                        let obj = JSON.parse(JSON.stringify(row))
                        obj.status = val ? 1 : 2
                        //this.changeChannelTopic(obj)
                    }}
                />
                )
            }
        },
        {
            title: "操作", key: "action",
            fixed: 'right', width: 310,
            render: (rowValue, row, index) => {
                return (
                    <div>
                        <Button
                            style={{ margin: "0 10px" }}
                            size="small"
                            type="primary"
                            onClick={() => {
                                console.log(rowValue, row);
                                this.props.history.push(`/mms/mobileSubject/editSubject/${row.ID}`)
                            }}
                        >编辑</Button>
                        <Button
                            size="small"
                            danger
                            onClick={() => { this.deleteSubject(row) }}
                        >删除</Button>
                    </div>
                )
            }
        }
    ]);
    const [isOpenModal,setisOpenModal]=useState(false);
    const [formRef] = Form.useForm();
    const [tailLayout,settailLayout]=useState({
        wrapperCol: { offset: 8, span: 16 },
    });
    const [formDate,setformDate]=useState({
        type:1,name:"专题名称",picUrl:""
    });

    useEffect(async () => {

    }, [])
    const submitForm = (e) => {//表单提交
        console.log(e)
        // if (source == "add") {
        //     let params = {
        //         ...e,
        //         userids: Array.isArray(e.userids) ? e.userids.join(",") : e.userids,
        //         sourceTag: e.sourceTag ? 1 : 0,
        //         replyInfos: replyInfos ? replyInfos : []
        //     }
        //     addWelcomeApi(params)
        // } else {
        //     let params = {
        //         ...currentItem,
        //         ...e,
        //         userids: Array.isArray(e.userids) ? e.userids.join(",") : e.userids,
        //         sourceTag: e.sourceTag ? 1 : 0,
        //         replyInfos: replyInfos ? replyInfos : []
        //     }
        //     saveWelcomeApi(params)
        // }
        // closeDialog()
    }
    // //获取上传文件
    // const getUploadFileUrl = (type, file, newItem, item) => {
    //     console.log(type, file, newItem, "newItem")
    //     item.imageUrl = newItem
    //     if (item.msgType == "miniprogram") {
    //         item.dsjMediaId = newItem
    //     }
    //     let arr = [...replyInfos]
    //     setReplyInfos(arr)
    // }
    return (
        <div>
            <Card extra={
                <div>
                    <Button type="primary" onClick={()=>{
                        setisOpenModal(true);
                        formRef.setFieldsValue(formDate)
                    }}
                    >标题配置</Button>
                    <Button type="primary" style={{ margin: "0 10px" }}
                        // onClick={() => {
                        //     this.props.history.push(`/mms/mobileSubject/editSubjectNew/add`)
                        // }}
                    >新增专题</Button>
                    <Button type="primary"
                        // loading={this.state.btnLoading}
                        // onClick={() => {
                        //     this.syncChannelNew()
                        // }}
                    >数据同步</Button>
                </div>
            }>
                <Table
                    dataSource={lists}
                    // rowKey={item=>item.indexId}
                    loading={loading}
                    columns={columns} 
                    />
                <Modal visible={isOpenModal}  onCancel={() => {
                    formRef.resetFields();
                    setisOpenModal(false);
                }}  footer={null}>
                    {
                        <Form name="mini" form={formRef} onFinish={(e) => submitForm(e)}>
                            <Form.Item label="标题配置" name="type">
                                <Radio.Group
                                    onChange={(val) => {
                                        formRef.setFieldsValue("type",val.target.value);
                                        let obj=JSON.parse(JSON.stringify(formDate));
                                        obj.type=val.target.value;
                                        setformDate(obj);
                                        console.log("formDate",formDate)
                                    }}
                                >
                                    <Radio value={1}>文字</Radio>
                                    <Radio value={2}>图片</Radio>
                                </Radio.Group>
                            </Form.Item>
                            
                            {
                                formRef && formRef.getFieldValue("type") == 1 &&
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: '请填写标题名称' }]}
                                >
                                    <Input placeholder="请填写标题名称" />
                                </Form.Item> ||
                                formRef && formRef.getFieldValue("type") == 2 &&
                                <Form.Item label='配置图片'>
                                    <MyImageUpload
                                        // postUrl={`/mms/wx/qywechat/uploadmedia?picUrl=${formRef.getFieldValue("picUrl")}`} //上传地址
                                        // getUploadFileUrl={(file, newItem) => { getUploadFileUrl('imageUrl', file, newItem, replyInfos[i]) }}
                                        // imageUrl={replyInfos[i].imageUrl}
                                        />
                                </Form.Item>
                            }
                            <Form.Item {...tailLayout}>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    提交
                                </Button>
                                <Button style={{ margin: "0 20px" }} onClick={()=>{
                                    formRef.resetFields();
                                    setisOpenModal(false);
                                }}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </Card>
        </div>
    )
}
export default GoodPlay