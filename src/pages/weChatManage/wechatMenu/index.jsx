import React, { Component } from 'react'
import { getRefresh, getZzItemList, addRefresh, changeRefresh, delRefresh } from 'api'
import { Radio, Card, Menu, Button, message, Table, Modal, DatePicker, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { PlusOutlined,DeleteOutlined,HighlightOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { SubMenu } = Menu;
const format = 'HH:mm';
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
            visible: false,
            openKeys: ["sub1"]
        }
    }
    render() {
        let { productLists, openKeys, layout, loading, columns, entranceState, } = this.state;
        return (
            <div>
                <Card title={
                    <div>
                        <Select allowClear placeholder="请选择公众号">
                            <Option value={1} key={1}>{1}</Option>
                        </Select>
                    </div>
                }
                    extra={
                        <div>
                            {/* <Button type="primary"  onClick={this.getEarnTskList.bind(this)}>刷新</Button> */}
                            {/* <Button type="primary" style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.setState({
                                        source: "add",
                                        entranceState: true,
                                    }, () => {
                                        this.formRef.current.resetFields();
                                    })
                                }}
                            >推送到微信</Button> */}
                            <MySyncBtn type={13} name='推送到微信' />
                        </div>
                    }
                >
                    <Radio.Group defaultValue="a" style={{ marginTop: 16 }}>
                        <Radio.Button value="a">默认菜单</Radio.Button>
                        <Radio.Button value="b">个性化菜单</Radio.Button>
                    </Radio.Group>
                    <div style={{ "width": "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: "20px" }}>
                        {/* 菜单 */}
                        <div style={{ "width": "20%", border: "1px solid #000" }}>
                            <Menu mode="inline" openKeys={openKeys}
                                // defaultOpenKeys={["sub1"]}
                                expandIcon={
                                    <></>
                                }
                                onSelect={(e) => {
                                    console.log(e)
                                }}
                                onOpenChange={this.onOpenChange.bind(this)} style={{ width: 256 }}>
                                <SubMenu key="sub1" 
                                title={
                                    <div style={{display:"flex",justifyContent:"space-between"}}>
                                        <div>菜单</div>
                                        <div style={{display:"flex",justifyContent:"space-between"}}>
                                            <div onClick={this.addMenu("sub1")}><PlusOutlined /></div>
                                            <div style={{margin:"0 10px"}}><DeleteOutlined /></div>
                                            <div><HighlightOutlined /></div>
                                        </div>
                                    </div>
                                } 
                                onTitleClick={(e) => { console.log(e) }}>
                                    <Menu.Item key="1" >Option 1</Menu.Item>
                                    <Menu.Item key="2">Option 2</Menu.Item>
                                    <Menu.Item key="3">Option 3</Menu.Item>
                                    <Menu.Item key="4">Option 4</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </div>
                        <div style={{ "width": "78%", border: "1px solid #000" }}>2</div>
                    </div>
                </Card>
                {/* <Modal title="新增任务" centered visible={entranceState} onCancel={() => { this.setState({ entranceState: false }) }} footer={null} width={1200}>
                    {
                        <Form {...layout}
                            name="taskForm"
                            ref={this.formRef}
                            onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请填写名称' }]}>
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                           
                            <Form.Item label="库存" name="zzItemStock" rules={[{ required: true, message: '请填写初始库存' }]}>
                                <InputNumber min={0} formatter={util.limitNumber} />
                            </Form.Item>
                            <Form.Item label="状态" name="state" valuePropName="checked" rules={[{ required: true }]}>
                                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                            </Form.Item>
                            <Form.Item
                                label="刷新库存时间"
                                // name="voters"
                                rules={[{ required: true, message: '刷新库存时间' }]}
                            >
                                <Form.List name="setting" rules={[{ required: true, message: '刷新库存时间' }]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Space key={field.key} align="baseline" style={{ width: "100%" }}>
                                                   

                                                    <MinusCircleOutlined onClick={() => { remove(field.name) }} />
                                                </Space>
                                            ))}

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => { add() }} block icon={<PlusOutlined />}>
                                                    新建刷新库存时间
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Form.Item>


                            <Form.Item {...this.state.tailLayout}>
                                <Button onClick={() => { this.setState({ entranceState: false }) }}>取消</Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal> */}
            </div>
        )
    }
    componentDidMount() {
        // this.getZzItemList()
        // this.getRefresh();
    }
    onOpenChange(e) {
        console.log(e, "onOpenChange")
        // this.setState({
        //     openKeys: e
        // })
        this.forceUpdate()

    }
    addMenu(key){
        
    }
    submitForm(val) {   // 提交表单
        console.log(val, "val")
        this.addRefresh(val)
        this.closeModal()
    }

    closeModal() {
        this.setState({
            entranceState: false
        })
    }



    deleteItem(_obj) {  // 删除数据
        console.log(_obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            // content: '确认删除？',
            onOk: () => {
                this.delRefresh(_obj.zzItemCode)
            },
            onCancel: () => {
            }
        })
    }
    // delRefresh(code) {
    //     let params = {
    //         zzItemCodes: code
    //     }
    //     delRefresh(params).then(res => {
    //         message.success("删除成功")
    //         this.getRefresh()
    //     })
    // }
}