import React, { Component } from 'react'
import moment from 'moment';
import { 
    updateGoods ,   // 修改数据
    getPProductList,  // 商品列表
    addPActivityGoods, // 新增
    delgoodsList,  // 删除
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
class GoodsConfig extends React.Component {
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state={
            page: 1,
            pageSize: 10,
            total: 0,
            loading:false,
            btnLoading:false,
            icon:"",
            currentItem:"",//编辑行的id
            editType:1,//1 是新增 2是编辑
            showEditModel:false,
            table_box:{
                columns:[]
            },
            goodsList:[],
            currentType:"",
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            vipOptions:[   // 会员天数
                {key:1,value:"1天",num:1},
                {key:2,value:"3天",num:3},
                {key:3,value:"7天",num:7},
                {key:4,value:"15天",num:15},
                {key:5,value:"1个月",num:30},
                {key:6,value:"3个月",num:90},
                {key:7,value:"6个月",num:180},
                {key:8,value:"1年",num:365},
                {key:9,value:"2年",num:730},
            ],
            goodsTypes:[  // 商品类型
                {key: 1, value: '金币'},{key: 2, value: '会员'},{key: 3, value: '实体'}
            ],
        }
    }
    render() { 
        let {goodsList,table_box,loading,page,pageSize,total,editType,showEditModel,layout,goodsTypes,vipOptions,icon,tailLayout}=this.state
        return <div>
            <Card
                title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>商品配置</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                }
                extra={
                    <div>
                        <Button type="primary"
                            onClick={() => {
                                this.setState({ showEditModel: true,editType:1,icon:"", }, () => {
                                    this.formRef.current.resetFields();
                                    this.forceUpdate();
                                })
                            }}
                        >新增</Button>
                    </div>
                }
            >
                <Table 
                    dataSource={goodsList}
                    loading={loading}
                    columns={table_box.columns}
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
                    <Form {...layout} name="goodsForm" ref={this.formRef} onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="活动标题" name="name" rules={[{ required: true, message: '请填写商品名称' }]}>
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                        <Form.Item label="商品类别" name="type" rules={[{ required: true}]}>
                            <Select placeholder="请选择类别" dropdownMatchSelectWidth={true} 
                            onChange={(val)=>{
                                console.log(val);
                                this.formRef.current.setFieldsValue({ "num": 0 })
                                this.forceUpdate();
                            }}
                            allowClear>
                                {
                                    goodsTypes.map((item,index)=>{
                                        return <Option value={item.key} key={item.key} name={item.value}>{item.value}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        {
                            this.formRef && this.formRef.current &&
                            <div className='custom-class'>
                                {
                                    this.formRef.current.getFieldValue("type")==1 &&
                                    <Form.Item label="金币数量" name="num" rules={[{ required: true, message: '请输入金币数量' }]}>
                                        <InputNumber placeholder="请输入金币数量"/>
                                    </Form.Item> ||
                                    this.formRef.current.getFieldValue("type")==2 &&
                                    <Form.Item label="会员天数" name="days" rules={[{ required: true}]}>
                                        <Select placeholder="请选择类别" dropdownMatchSelectWidth={true} allowClear>
                                            {
                                                vipOptions.map((item,index)=>{
                                                    return <Option value={item.key} key={item.key} name={item.value}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item> ||
                                    this.formRef.current.getFieldValue("type")==3 &&
                                    <div></div>
                                }
                            </div>
                        }
                        <Form.Item label="缩略图" name="icon" valuePropName="fileList" getValueFromEvent={normFile} >
                            <div className="input-wrapper-box">
                                <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)} imageUrl={icon}/>
                            </div>
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
        </div>;
    }
    componentDidMount(){
        //this.getList();
        this.initColums();
    }
    getList(){   // 商品列表
        let params = {
            currentPage: this.state.page, 
            pageSize: this.state.pageSize
        };
        getPProductList(params).then(res=>{
            console.log(res);
            if(res.data.errCode==0){
                let _list=res.data.data.map((item,index)=>{
                    if(item.type==2){
                        switch (item.num){
                            case 1:
                                item.days=1;
                                break;
                            case 3:
                                item.days=2;
                                break;
                            case 7:
                                item.days=3;
                                break;
                            case 15:
                                item.days=4;
                                break;
                            case 30:
                                item.days=5;
                                break;
                            case 90:
                                item.days=6;
                                break;
                            case 180:
                                item.days=7;
                                break;
                            case 365:
                                item.days=8;
                                break;
                            case 730:
                                item.days=9;
                                break;
                        }
                    }
                    return item
                })
                console.log(_list)
                this.setState({
                    goodsList:_list,
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
    deleteItem(obj){   // 删除数据
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            onOk:()=>{
                let params={
                    id:obj.id
                }
                delgoodsList(params).then(res=>{
                    console.log(res);
                    if(res.data.errCode==0){
                        message.success("已删除");
                        this.getList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
            },
            onCancel: ()=>{
            }
        })
    }
    submitForm(obj){   // 提交表单
        console.log(obj)
        if(obj.type==2){
            for(let i=0;i<this.state.vipOptions.length;i++){
                if(this.state.vipOptions[i].key==obj.days){
                    obj.num=this.state.vipOptions[i].num;
                }
            }
        }
        if(obj.icon==undefined){
            obj.icon=""
        }
        if(this.state.editType==1){  // 新增
            let params={
                ...obj
            }
            addPActivityGoods(params).then(res=>{
                if(res.data.errCode==0){
                    message.success("添加成功");
                    this.getList();
                    this.setState({
                        showEditModel:false
                    })
                }else{
                    message.error(res.data.msg)
                }
            })
        }else{  // 修改
            delete obj.days
            let params={
                id:this.state.currentItem.id,
                ...obj
            }
            updateGoods(params).then(res=>{
                if(res.data.errCode==0){
                    message.success("修改成功");
                    this.getList();
                    this.setState({
                        showEditModel:false
                    })
                }else{
                    message.error(res.data.msg)
                }
            })
        }
    }
    getUploadFileUrl(fill){   // 图片上传
        console.log(fill)
        this.formRef.current.setFieldsValue({ "icon": fill });
        this.setState({
            icon:fill
        })
    }
    initColums(){
        let { table_box, vipOptions} = this.state;
        let columns=[
            {
                title: "商品名称",
                dataIndex: "name",
                key: "name",
                render:(rowValue, row, index)=>{
                    if(row.type==3){
                        return <span>{rowValue}</span>
                    }else if(row.type==1){
                        return <span>{rowValue}({row.num}金币)</span>
                    }else if(row.type==2){
                        //let _list=this.state.goodsTypes;
                        for(let i=0;i<vipOptions.length;i++){
                            if(vipOptions[i].num==row.num){
                                return <span>{rowValue}({vipOptions[i].value})</span>
                            }
                        }
                    }
                }
            },
            {
                title: "类别",
                dataIndex: "type",
                key: "type",
                render:(rowValue, row, index)=>{
                    return (
                        <div>
                            {
                                rowValue==1 && 
                                <span>金币</span> ||
                                rowValue==2 && 
                                <span>会员</span> ||
                                rowValue==3 && 
                                <span>实体</span>
                            }
                        </div>
                    )
                }
            },
            {
                title: "缩略图",
                dataIndex: "icon",
                key: "icon",
                render: (rowValue, row, index) => {
                    return (<Image width={80} src={row.icon} />)
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
                                icon:row.icon,
                                currentType:row.type,
                                editType:2
                            },()=>{
                                this.forceUpdate();
                                this.formRef.current.resetFields();
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
        table_box.columns=columns;
        this.setState({
            table_box:table_box
        },()=>{
            this.getList();
        })
    }
}
 
export default GoodsConfig;