// 节目推荐
import React, { Component } from 'react';
import { Tabs, Input, DatePicker, Button, Tooltip, Table, Switch, Modal, Form, Row, Col, Select } from 'antd';
import './style.css'
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class Teast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabPosition: 'left',
            teast_box: {
                table_datas: [
                    {
                        key: '1',
                        name: '这是广告名字',
                        date: '7月13日',
                        id: 1,
                        rate: "2",
                    },
                ],
                table_title: [
                    { title: 'id', dataIndex: 'id', key: 'id', width: 40, },
                    { title: '名称', dataIndex: 'name', key: 'name', width: 100, },
                    { title: '预览', dataIndex: 'pre', key: 'pre', width: 100, },
                    { title: '开始时间 - 结束时间', dataIndex: 'date', key: 'date', width: 200, },
                    { title: '比例 (展示概率)', dataIndex: 'rate', key: 'rate', width: 200, },
                    { title: '展示时长', dataIndex: 'time', key: 'time', width: 100, },
                    {
                        title: '状态', dataIndex: 'status', key: 'status', width: 80, fixed: 'right',
                        render: () => {
                            return (
                                <Switch checkedChildren="有效" unCheckedChildren="无效"></Switch>
                            )
                        }
                    },
                    {
                        title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 160,
                        render: (rowValue, row, index) => {
                            return (
                                <div>
                                    <Button size='small' type="primary" type="link" onClick>复制</Button>
                                    <Button size='small' type="primary" type="link" onClick>编辑</Button>
                                    <Button size='small' type="primary" type="link" onClick>删除</Button>
                                </div>
                            )
                        }
                    },

                ],
            },
            modal_box: {
                is_show: false
            },
            //二维码
            qucode_type_options: [],

        }
    }

    render() {
        const { tabPosition, teast_box, modal_box } = this.state;
        return (
            <div>
                <div>广告管理</div>
                <Tabs className="tab-wrapper" defaultActiveKey="1" tabPosition={tabPosition}>
                    <TabPane tab="尝鲜版广告" key="1">
                        <div className="teast-wrapper">
                            <div className="input-wrapper">
                                <div className="title">频道与广告的比例:</div>
                                <Input className="input" placeholder="请输入比例" />
                                <Button className="btn" type="primary" size='small'>保存</Button>
                            </div>
                            <div className="input-wrapper">
                                <div className="title">频道展示时长:</div>
                                <Tooltip trigger={['focus']} title='单位(秒)' placement="top"  >
                                    <Input className="input" placeholder="请输入展示时长" />
                                </Tooltip>
                                <Button className="btn" type="primary" size='small'>保存</Button>
                            </div>
                            <div className="input-wrapper">
                                <div className="title">搜索频道名称:</div>
                                <Tooltip trigger={['focus']} title='筛选搜索频道名称' placement="top" >
                                    <Input className="input" placeholder="请输入搜索频道名称" />
                                </Tooltip>
                                <Button className="btn" type="primary" size='small'>搜索</Button>
                            </div>

                            <div className="input-wrapper">
                                <div className="title">广告时间选择:</div>
                                <Tooltip trigger={['focus']} title='请选择开始时间' placement="top" >
                                    <RangePicker className="date-picker" showTime />
                                </Tooltip>
                                <Button className="btn" type="primary" size='small'>调整比例</Button>
                            </div>
                        </div>
                        <Button onClick={() => this.showModalToCreate()} >新增</Button>
                        <Table columns={teast_box.table_title} dataSource={teast_box.table_datas} scroll={{ x: 1300 }} />;

                    </TabPane>
                    <TabPane tab="其他" key="2">
                    </TabPane>
                </Tabs>
                <Modal title="广告信息" width={800} visible={modal_box.is_show} onOk={() => this.onModalConfirm()} onCancel={() => this.onModalCancel()}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                        <Form.Item label="名称" name="username">
                            <Input className="input" placeholder="请输入广告名称" />
                        </Form.Item>
                        <Form.Item label="图片" name="pic">
                            <Input className="input" placeholder="请上传图片" />
                        </Form.Item>
                        <Form.Item label="二维码" name="qrcode_img">
                            <Select defaultValue="lucy" style={{ width: 120 }} onChange={() => this.onQrCodeChange}>
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="二维码尺寸">
                            <Input className="input" placeholder="200" />
                        </Form.Item>
                        <Form.Item label="二维码横向偏移量">

                        </Form.Item>
                        <Form.Item label="二维码纵向偏移量">

                        </Form.Item>
                        <Form.Item label="比例">
                            <Input className="input" placeholder="10" />
                        </Form.Item>
                        <Form.Item label="展示时长(s)">
                            <Input className="input" placeholder="10" />
                        </Form.Item>
                    </Form>
                    <Form>
                        <Row>
                            <Col span={12}  >
                                <Form.Item label="跳转类型">
                                    <Select style={{ width: 120 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}  >
                                <Form.Item label="频道">
                                    <Select style={{ width: 120 }}></Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="状态">
                            <Switch checkedChildren="有效" unCheckedChildren="无效"></Switch>
                        </Form.Item>

                        <Row>
                            <Col span={12}  >
                                <Form.Item label="跳转类型">
                                    <Select style={{ width: 120 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}  >
                                <Form.Item label="频道">
                                    <Select style={{ width: 120 }}></Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Modal>
            </div>
        )
    }
    //展示弹出框 新增数据
    showModalToCreate() {
        this.setState({
            modal_box: {
                is_show: true,
            }
        })
    }
    onModalConfirm() {
        console.log('confirm');
        this.setState({
            modal_box: {
                is_show: false,
            }
        })
    }
    onModalCancel() {
        console.log('cancel');

        this.setState({
            modal_box: {
                is_show: false,
            }
        })
    }
    //二维码切换监听
    onQrCodeChange() {

    }
}


