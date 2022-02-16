import React, { Component } from 'react'

import { ChannelTopic, deleteChannelTopic, syncChannelNew,changeChannelTopic } from 'api'
import { Breadcrumb, Card, Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, InputNumber,Switch } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import ContentDialog from "./contentDialog"
import util from 'utils'
import moment from 'moment';
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
export default class SportsProgram extends Component {
    formRef = React.createRef();
    constructor() {
        super();
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            loading: false,
            btnLoading: false,
            searchWords: "",
            lists: [
                { name: "扫黑风暴", sort: 1, status: 1, id: 1 },
                { name: "啊啊啊啊", sort: 2, status: 2, id: 2 }
            ],
            currentItem: "",//编辑行的id
            newData: {},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            dataSource: [],
            visible: false,
            isShow:false,//内容配置
            //专题状态
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],
            columns: [
                { title: "专题 id", dataIndex: "id", key: "id", width:100,},
                { title: "标题", dataIndex: "title", key: "title", },
                { title: "排序", dataIndex: "column", key: "column",width:100, },
                {
                    title: "时间", dataIndex: "time", key: "time",
                    width:420,
                    render: (rowValue, row, index) => {
                        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                        let time = [];
                        if (row.startTime && row.endTime) {
                            time = [moment(new Date(row.startTime)), moment(new Date(row.endTime)),]
                        }

                        return (
                            <div>
                                <RangePicker value={time} showTime format={dateFormat} disabled />
                            </div>
                        )
                    }
                },
                {
                    title: '状态', dataIndex: 'status', key: 'status',
                    render: (rowValue, row, index) => {
                        return (
                            // <Select className="base-input-wrapper" value={rowValue} disabled placeholder='请选择状态'>
                            //     {this.state.dict_status.map((item, index) => {
                            //         return <Option key={index} value={item.key}>{item.value}</Option>
                            //     })}
                            // </Select>
                            // <div>{rowValue==1?"有效":rowValue==2?"无效":"未知"}</div>
                            <Switch checkedChildren="有效" unCheckedChildren="无效" key={new Date().getTime()}
                            defaultChecked={rowValue == 1 ? true : false}
                            onChange={(val) => {
                                console.log(val)
                                let obj = JSON.parse(JSON.stringify(row))
                                obj.status = val ? 1 : 2
                                this.changeChannelTopic(obj)
                            }}
                        />
                        )
                    }
                },


                // {
                //     title: "频道",
                //     dataIndex: "channelName",
                //     key: "channelName",
                // },
                // {
                //     title: "节目",
                //     dataIndex: "programName",
                //     key: "programName",
                // },
                {
                    title: "背景图", dataIndex: "backImage", key: "backImage",
                    render: (rowValue, row, index) => {
                        return (<Image width={80} src={row.backImage} />)
                    }
                },
                {
                    title: "操作", key: "action",
                    fixed: 'right', width: 310,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button
                                 
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        console.log(rowValue, row);
                                        this.props.history.push(`/mms/mobileSubject/editSubjectNew/${row.id}`)
                                    }}
                                >基础配置</Button>
                                <Button
                                   style={{ margin: "0 10px" }}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                       
                                        this.setState({isShow:true},()=>{
                                            this.child.showConfChannel(row.id)
                                        })
                                    }}
                                >内容配置</Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => { this.deleteSubject(row) }}
                                >删除</Button>
                            </div>
                        )
                    }
                }
            ],
        }
    }
    componentDidMount() {
        this.ChannelTopic();
    }
    ChannelTopic() {
        let params = {
            // name:keyWord || ""
        }
        ChannelTopic(params).then(res => {
            console.log(res);
            if (res.data.errCode === 0) {
                this.setState({
                    lists: res.data.data.data
                })
            }
        })
    }
    changeChannelTopic(val){
        let params = {
           ids:val.id
        }
        changeChannelTopic(params).then(res => {
            console.log(res);
            if (res.data.errCode == 0) {
                message.success("修改成功")
                this.ChannelTopic()
            } else {
                message.error(res.data.msg)
            }
        })
    }
    deleteItem(val) {
        let params = {
            ids: val.id
        }
        deleteChannelTopic(params).then(res => {
            console.log(res);
            if (res.data.errCode == 0) {
                message.success("删除成功")
                this.ChannelTopic();
            } else {
                message.error(res.data.msg)
            }
        })
    }
    syncChannelNew() {
        console.log("数据同步")
        this.setState({
            btnLoading: true
        })
        syncChannelNew().then((res) => {
            console.log(res);
            if (res.data.errCode == 0) {
                message.success("数据同步成功")
                this.setState({
                    btnLoading: false
                })
            } else {
                message.error(res.data.msg)
                this.setState({
                    btnLoading: false
                })
            }
        });
    }
    deleteSubject(_obj) {
        console.log("删除行", _obj)
        Modal.confirm({
            title: `执行删除操作后，该专题和该专题下对应的信息都会被删除。是否确认删除？`,
            content: '确认删除？',
            onOk: () => {
                this.deleteItem(_obj)
            },
            onCancel: () => {
            }
        })
    }
    closeDialog(){
        this.setState({isShow:false})
    }
    render() {
        let {isShow } = this.state
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>频道专题管理</Breadcrumb.Item>
                        </Breadcrumb>
                        {/* <Input.Search allowClear style={{ width: '20%',marginTop:"10px" }} 
                        placeholder="请输入频道专题名称"
                        onSearch={(val)=>{
                            this.setState({
                                searchWords:val
                            })
                            this.ChannelTopic(val)
                        }} /> */}
                    </div>
                }
                    extra={
                        <div>
                            <Button type="primary"
                                onClick={() => {
                                    this.props.history.push(`/mms/mobileSubject/editSubjectNew/add`)
                                }}
                            >新增专题</Button>
                            <Button type="primary"
                                loading={this.state.btnLoading}
                                style={{ margin: "0 10px" }}
                                onClick={() => {
                                    this.syncChannelNew()
                                }}
                            >数据同步</Button>
                        </div>
                    }
                >
                    <Table
                        dataSource={this.state.lists}
                        // rowKey={item=>item.indexId}
                        loading={this.state.loading}
                        columns={this.state.columns} 
                        scroll={{ x: 1200, y: '75vh' }}
                        />
                </Card>
                <ContentDialog isShow={isShow} onCloseDialog={()=>this.closeDialog()} onRef={(ref) => {this.child = ref}}></ContentDialog>
            </div>
        )
    }
}