import React, { Component } from 'react'
import moment from 'moment';
import { 
    getPActivityList ,  //  获取列表
    updatePActivity ,   // 修改数据
    getPProductList,  // 商品列表
    addPActivity, // 新增
    removePActivity,  // 删除
} from 'api'
import {Breadcrumb, Card, Image, Button, Table, Modal, message,Input, Form,Select,InputNumber,Switch,DatePicker,Divider} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
const { Option } = Select;
const { RangePicker } = DatePicker;
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};
const { TextArea } = Input;


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
            picUrl:"",  // 背景图
            loading:false,
            drawNumber:"次",
            productList:[],  // 商品列表
            activity_type: [
                {key: 1, value: '大转盘'},
                {key: 2, value: '夺宝'},
                {key: 3, value: '兑换'},
                {key: 4, value: '会员下单'}
            ],
            ac_type:[  // 活动类型
                {key: 1, value: '会员下单'},
            ],
            table_box: {
                table_title: [],
                table_datas: [],
            },
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            goods_list:[  // 商品列表
                // {id:1,name:"name1"},{id:2,name:"name2"}
            ],  
        }
    }
    render() { 
        let {showEditModel,table_box,loading,page,pageSize,total,editType,layout,goods_list,productList,activity_type,picUrl,tailLayout,drawNumber}=this.state;
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
                                this.setState({ showEditModel: true,editType:1 }, () => {
                                    this.formRef.current.resetFields()
                                })
                            }}
                        >新增</Button>
                    </div>
                }
            >
                <Table 
                    dataSource={table_box.table_datas}
                    // rowKey={item=>item.indexId}
                    loading={loading}
                    columns={table_box.table_title}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: this.changeSize
                    }}
                    />

            </Card>
            <Modal title={editType==1?"新增":"编辑"} centered visible={showEditModel} onCancel={() => { this.setState({ showEditModel: false }) }} footer={null} width={800}>
                {
                    <Form {...layout} name="taskForm" ref={this.formRef} onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="活动标题" name="name" rules={[{ required: true, message: '请填写活动标题' }]}>
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                        <Form.Item label="抽奖页ID" name="id" rules={[{ required: true, message: '请填写抽奖页ID' }]}>
                            <Input placeholder="请输入抽奖页唯一ID(自定义)"/>
                        </Form.Item>
                        <Divider orientation="left">商品配置</Divider>
                        <Form.Item className='form-item-custom'>
                            <div className='from-flex'>
                                <Form.Item label='第一格' name="goods1" rules={[{ required: true}]}>
                                    <Select className="input-wrapper-from-1" optionFilterProp="filterValue" showSearch={true} placeholder='选择商品' allowClear>
                                        {productList.map((item, index) => {
                                            return <Option value={item.id} key={item.id} name={item.name} filterValue={item.value}>
                                                <div>{item.value}</div>
                                            </Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="库存" name="attend" style={{ margin: '0 3px' }} rules={[{ required: true, message: '请输入库存'}]}>
                                    <InputNumber min={0} className="input-wrapper-from" placeholder="0" />
                                </Form.Item>
                                <Form.Item name="dLimit" label="概率" rules={[{ required: true, message: '请填写概率'}]}>
                                    <Input min={0} max={99} className="input-wrapper-from" placeholder="0" addonAfter="%" />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item className='form-item-custom'>
                            <div className='from-flex'>
                                <Form.Item label="活动类型" name="type" rules={[{ required: true}]}>
                                    <Select defaultValue="4-会员下单">
                                        {
                                            activity_type.map((item,index)=>{
                                                return <Option value={item.key} key={item.key} name={item.value}>{item.key}-{item.value}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ margin: '0 25px' }} label="抽奖次数" name="actualAttend" rules={[{ required: true}]}> 
                                    <Input min={0} placeholder="N" addonAfter={drawNumber}/>
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item label="缩略图" name="picUrl" valuePropName="fileList" 
                                // 如果没有下面这一句会报错
                                getValueFromEvent={normFile} 
                            >
                            <div className="input-wrapper-box">
                                <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)} imageUrl={picUrl}/>
                            </div>
                        </Form.Item>
                        <Form.Item label="活动规则" name="rule" rules={[{ required: true}]}>
                            <TextArea placeholder='请输入活动规则'  autoSize={{ minRows: 5 }}></TextArea>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button onClick={() => { this.setState({ showEditModel: false }) }}>取消</Button>
                            <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                                确定
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </Modal>
        </div>
    }
    componentDidMount(){
        this.initData();   // 初始化table 的thead
        this.getGoodsList();
    }
    submitForm(obj){
        console.log(obj);
        console.log("this.state.editType",this.state.editType);
        let params={
            ...obj
        }
        if(this.state.editType==1){   // 新增
            addPActivity(params).then(res=>{
                if(res.data.errCode==0){
                    message.success("添加成功");
                    this.getList();
                }else{
                    message.error(res.data.msg)
                }
            })
        }else{    // 修改
            updatePActivity(params).then(res=>{
                if(res.data.errCode==0){
                    message.success("修改成功");
                    this.getList();
                }else{
                    message.error(res.data.msg)
                }
            })
        }
    }
    getUploadFileUrl(fill){   // 图片上传
        console.log(fill)
        this.formRef.current.setFieldsValue({ "picUrl": fill });
        this.setState({
            picUrl:fill
        })
    }
    getGoodsList(){   // 获取商品列表
        let params = {
            page: {currentPage: 1, pageSize: 1000}
        };
        getPProductList(params).then(res=>{
            console.log("获取商品列表",res)
            if(res.data.errCode==0){
                let _list=res.data.data.map((item,index)=>{
                    item.value=item.id+"-"+item.name;
                    return item
                })
                this.setState({
                    productList:_list
                })
            }
        })
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
    updateList(obj){  // 修改数据 状态
        console.log(obj);
        let params={
            id:obj.id,
            status:obj.status,
            type:obj.type
        }
        updatePActivity(params).then(res=>{
            console.log(res);
            if(res.data.errCode==0){
                this.getList();
            }else{
                message.error(res.data.msg)
            }
        })
    }
    deleteItem(obj){   // 删除数据
        console.log(obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            onOk: ()=>{
                let params={
                    id:obj.id
                }
                removePActivity(params).then(res=>{
                    console.log(res);
                    if(res.data.errCode==0){
                        message.success("已删除");
                        this.getList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
                //this.deleteFunc(obj.id)
            },
            onCancel: ()=>{
            }
        })
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