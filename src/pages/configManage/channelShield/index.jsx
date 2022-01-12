import React, { Component } from 'react'
import { getShieldList, addShieldList, delShieldList } from 'api'
import { Card, Breadcrumb, Button, message, Table, Modal, Form, Input, Image, Space,Switch } from 'antd'
import { } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { MyImageUpload, MySyncBtn } from '@/components/views.js';
import util from 'utils'
import "./style.css"
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            loading: false,
            isOpen: false,
            page: 1,
            pageSize: 50,
            total: 0,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 16, span: 8 },
            },
            searchName: "",
            columns: [
                { title: "节目ID", dataIndex: "programId", key: "programId", },
                { title: "节目名", dataIndex: "name", key: "name", },
                { title: "节目类别", dataIndex: "categoryName", key: "categoryName", },
                {
                    title: "节目封面",
                    dataIndex: "image",
                    key: "image",
                    render: (rowValue, row, index) => {
                        return <Image src={rowValue} style={{ width: "100px", height: "100px" }}></Image>
                    }
                },
                { title: "节目信息", dataIndex: "plot", key: "plot", ellipsis: true, },
                {
                    title: "是否屏蔽", dataIndex: "isBlack", key: "isBlack",
                    render: (rowValue, row, index) => {
                        return (
                            <Switch checkedChildren="是" unCheckedChildren="否" key={new Date().getTime()}
                                defaultChecked={rowValue}
                                onChange={(val) => {
                                    console.log(val)
                                    let obj = JSON.parse(JSON.stringify(row))
                                    obj.isBlack = val
                                    if(val){
                                        this.addShieldList(obj)
                                    }else{
                                        this.delShieldList(obj)
                                    }
                                }}
                            />
                        )
                    }
                },
                // {
                //     title: "操作",
                //     key: "action",
                //     width: 200,
                //     render: (rowValue, row, index) => {
                //         return (
                //             <div>
                //                 <Button
                //                     size="small"
                //                     danger
                //                     onClick={() => { this.delArt(index) }}
                //                 >删除</Button>
                //             </div>
                //         )
                //     }
                // }

            ],
        }
    }
    render() {
        const { page, pageSize, total } = this.state;
        return (
            <div className="address_page">
                <Card title={
                    <div className="marsBox">
                        <div className="everyBody">
                            <div>名称:</div>
                            <Input.Search
                                allowClear
                                onChange={(val) => {
                                    this.state.searchName = val.target.value
                                }}
                                onSearch={(val) => {
                                    console.log(1, val)
                                    this.state.searchName = val
                                    this.setState({
                                        page: 1,
                                    }, () => {
                                        this.getShieldList()
                                    })

                                }} />
                        </div>
                    </div>

                }
                    extra={
                        <div>
                            {/* <Button type="primary" onClick={() => {
                                this.setState({
                                    isOpen: true
                                }, () => {
                                    this.formRef.current.resetFields()
                                })
                            }}>新建</Button>
                            <MySyncBtn type={3} name='同步数据' params={{key:this.state.key}} /> */}
                        </div>
                    }
                >
                    <Table
                        dataSource={this.state.lists}
                        // rowKey={i}
                        loading={this.state.loading}
                        columns={this.state.columns}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: total,
                            onChange: this.changeSize
                        }}
                    />

                </Card>
                <Modal
                    title="录入小程序"
                    centered
                    visible={this.state.isOpen}
                    onCancel={() => { this.setState({ isOpen: false }) }}
                    footer={null}
                    width={800}
                >
                    {
                        <Form
                            {...this.state.layout}
                            name="mini"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}
                        >
                            <Form.Item
                                label="投票选项"
                            // name="voters"
                            // rules={[{ required: true, message: '投票选项' }]}
                            >
                                <Form.List name="robotList">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline">
                                                    <Form.Item
                                                        {...field}
                                                        label="昵称"
                                                        name={[field.name, 'name']}
                                                        fieldKey={[field.fieldKey, 'name']}
                                                        rules={[{ required: true, message: '昵称' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="头像"
                                                        name={[field.name, 'headImage']}
                                                        fieldKey={[field.fieldKey, 'headImage']}
                                                        // valuePropName="fileList" 
                                                        // 如果没有下面这一句会报错
                                                        // getValueFromEvent={normFile}
                                                        rules={[{ required: true, message: '头像' }]}
                                                    >
                                                        <div className="image_vote" style={{ display: "flex", "alignItems": "flex-start" }}>
                                                            <MyImageUpload
                                                                getUploadFileUrl={(file, newItem) => { this.getUploadFileUrl('headImage', file, newItem, index) }}
                                                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("robotList")[index] && this.formRef.current.getFieldValue("robotList")[index].headImage} />
                                                        </div>

                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                </Space>
                                            ))}

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    新建机器人
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Form.Item>

                            <Form.Item {...this.state.tailLayout}>
                                <Button style={{ margin: "0 20px" }} onClick={() => this.setState({ isOpen: false })}>
                                    取消
                                </Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
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
        this.getShieldList()
    }
    submitForm(val) {
        // return 
        console.log(val)
        // this.addShieldList(val)
        // this.setState({
        //     isOpen: false
        // })
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getShieldList()
        })
    }
    getShieldList() {
        let params = {
            name: this.state.searchName,
            pageSize: this.state.pageSize,
            pageNum: this.state.page
        }
        getShieldList(params).then(res => {
            console.log(res)
            this.setState({
                lists: res.data.programs,
                total:res.data.totalPage
            })
        })
    }
    addShieldList(val) {
        let params={
            name:val.name,
            programId:val.programId
        }
        addShieldList(params).then(res => {
            message.success("操作成功")
            this.getShieldList()
        })
    }
    delShieldList(val) {
        let params={
            name:val.name,
            programId:val.programId
        }
        delShieldList(params).then(res => {
            message.success("操作成功")
            this.getShieldList()
        })
    }
    
    
    //获取上传文件
    getUploadFileUrl(type, file, newItem, index) {
        console.log(type, file, newItem, "type, file, newItem")
        let that = this;
        let image_url = file;
        this.formRef.current.getFieldValue("robotList")[index].headImage = image_url;
        // that.formRef.current.setFieldsValue(obj);
        that.forceUpdate();
    }
}
