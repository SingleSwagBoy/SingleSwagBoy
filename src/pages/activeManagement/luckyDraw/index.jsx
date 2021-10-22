import React, { Component } from 'react'
import moment from 'moment';
import { 
    getPActivityList ,  //  获取列表
    updatePActivity ,   // 修改数据
} from 'api'
import {Breadcrumb, Card, Image, Button, Table, Modal, message,Input, Form,Select,InputNumber,Switch,DatePicker} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;

class LuckyDraw extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state={
            page: 1,
            pageSize: 50,
            total: 0,
            drawList:[],  // 数据列表
            currentItem:"",
            editType:1,  // 1新增 2修改
            showEditModel:false,  // 显示修改、新增的弹框
            loading:false,
            activity_type: [
                {key: 1, value: '大转盘'},
                {key: 2, value: '夺宝'},
                {key: 3, value: '兑换'},
                {key: 4, value: '会员下单'}
            ],
            table_box: {
                table_title: [],
                table_datas: [],
            },
        }
    }
    render() { 
        return <div>
            <Card
                title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>抽奖活动管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                extra={
                    <div>
                        <Button type="primary"
                            onClick={() => {
                                this.setState({ showEditModel: true }, () => {
                                    this.formRef.current.resetFields()
                                })
                            }}
                        >新增</Button>
                    </div>
                }
            >
                <Table 
                    dataSource={this.state.table_box.table_datas}
                    // rowKey={item=>item.indexId}
                    loading={this.state.loading}
                    columns={this.state.table_box.table_title}
                    pagination={{
                        current: this.state.page,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onChange: this.changeSize
                    }}
                    />

            </Card>
        </div>
    }
    componentDidMount(){
        this.initData();   // 初始化table 的thead
    }
    getList(){   // 获取数据列表
        let params={
            page:{
                currentPage:this.state.page,
                pageSize:this.state.pageSize
            }
        }
        getPActivityList(params).then(res=>{
            console.log(res)
            if(res.data.errCode==0){
                let table_box=this.state.table_box;
                table_box.table_datas=res.data.data;
                this.setState({
                    table_box:table_box,
                    page:res.data.currentPage,
                    total:res.data.totalCount
                })
            }
        })
    }
    changeSize=(page, pageSize)=>{   // 分页
        console.log(page, pageSize);
        this.setState({
            page:page,
            pageSize:pageSize
        }, () => {
            this.getList()
        })
    }
    updateList(obj){  // 修改数据
        console.log(obj);
        let params={
            id:obj.id,
            status:obj.status,
            type:obj.type
        }
    }
    initData(){
        let { table_box, activity_type} = this.state;
        let table_title =[
            {title: "ID", dataIndex: "id", key: "id"},
            {title: "标题", dataIndex: "name", key: "name"},
            {
                title: "类别", dataIndex: "status", key: "status",
                render: (rowValue,row) => {
                    console.log("rowValue",rowValue)
                    return (
                        <div>
                            {
                                activity_type.map((item,index)=>{
                                    return (
                                        <span>{
                                            item.key==rowValue &&
                                            <span>{item.value}</span>
                                        }</span>
                                    )
                                })
                            }
                        </div>
                    )
                },
            },
            {title: "缩略图", dataIndex: "picUrl", key: "picUrl",
                render:(rowValue,row)=>{
                    return(
                        <Image src={rowValue}  width={100} height={100}></Image>
                    )
                }
            },
            {
                title: "状态",  // 启用状态(1上线2下线)
                dataIndex: "status",
                key: "status",
                render: (rowValue, row, index)=>{
                    return (
                        <div>
                            {/* {rowValue === 1?"有效":"无效"} */}
                            <Switch checkedChildren="已启用"  unCheckedChildren="未启用" defaultChecked={rowValue === 1?true:false}
                                onChange={(val)=>{
                                    console.log(val)
                                    this.setState({
                                        currentItem:row
                                    },()=>{
                                        row.status = val?1:2
                                        this.updateList(row)
                                    })
                                }}
                            />
                        </div>
                    )
                }
            },
            {
                title: "操作",
                key: "action",
                render: (rowValue, row, index)=>{
                    return (
                    <div>
                        <Button 
                        style={{margin:"0 10px"}}
                        size="small"
                        type="primary"
                        onClick={()=>{
                            console.log(rowValue, row);
                            this.setState({
                                showEditModel:true,
                                currentItem:row,
                                editType:2
                              },()=>{
                                this.formRef.current.setFieldsValue(row)
                              })
                        }}
                        >编辑</Button>
                        <Button 
                            size="small"
                            danger
                            onClick={()=>{this.deleteItem(row)}}
                        >删除</Button>
                    </div>
                    )
                }
            }
        ]
        table_box.table_title=table_title
        this.setState({
            table_box:table_box
        },()=>{
            this.getList();
        })
    }
}
 
export default LuckyDraw;