import React, { Component } from 'react'
import moment from 'moment';
import { 
    getPActivityList ,  //  获取列表
    updatePActivity ,   // 修改数据
    getPProductList,  // 商品列表
    addPActivity, // 新增
    removePActivity,  // 删除
    updatePActivityStatus,  // 活动上下线
    goodsRealStock,    // 商品库存
    syncPActivity,    //同步缓存
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
            pic:"",  // 背景图
            loading:false,
            drawNumber:"次",
            productList:[],  // 商品列表
            skuTable:[], // 库存列表
            clickDate:0,
            skuColumns:[   // 库存的表单规则
                {
                    title: "位置",
                    render:(rowValue, row, index)=>{
                        return(
                            <span>{index+1}格</span>
                        )
                    }
                },
                {
                    title: "商品名称",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "剩余库存",
                    dataIndex: "stock",
                    key: "stock",
                    render:(rowValue, row, index)=>{
                        return(
                            <span>{row.realStock}/{rowValue}</span>
                        )
                    }
                }
            ],
            activity_type: [
                // {key: 1, value: '大转盘'},
                // {key: 2, value: '夺宝'},
                // {key: 3, value: '兑换'},
                {key: 1, value: '会员下单'},
                {key: 2, value: '任务积分活动'},
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
            showSkuModal:false,  // 实时库存
            goodsData:[
                {id:1,name:"goods1",stock:0,prob:10},{id:2,name:"goods2",stock:0,prob:10},{id:3,name:"goods3",stock:0,prob:10},{id:4,name:"goods4",stock:0,prob:10},
                {id:5,name:"goods5",stock:0,prob:10},{id:6,name:"goods6",stock:0,prob:10},{id:7,name:"goods7",stock:0,prob:10},{id:8,name:"goods8",stock:0,prob:10}
            ]
        }
    }
    render() { 
        let {showEditModel,showSkuModal,skuTable,skuColumns,table_box,loading,page,pageSize,total,editType,layout,productList,activity_type,pic,tailLayout,drawNumber,goodsData}=this.state;
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
                                    console.log("新增")
                                    this.formRef.current.resetFields()
                                    for(let i=0;i<8;i++){
                                        let _prob="prob"+i;
                                        console.log("_prob",_prob)
                                        this.formRef.current.setFieldsValue({ [_prob]: 0 })
                                    }
                                    this.forceUpdate();
                                })
                            }}
                        >新增</Button>
                    </div>
                }
            >
                <Table 
                    dataSource={table_box.table_datas}
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
                        <Form.Item label="活动标题" name="title" rules={[{ required: true, message: '请填写活动标题' }]}>
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                        <Divider orientation="left">商品配置</Divider>
                        <Form.Item className='form-item-custom'>
                            {
                                goodsData.map((item,index)=>{
                                    return(
                                        <div className='from-flex' key={index}>
                                            <Form.Item name={`names${index}`} label={`第${index+1}格`} rules={[{ required: true}]}>
                                                <Select dropdownMatchSelectWidth={true} className="input-wrapper-from-1" onChange={(val)=>{
                                                    let _id=Number(val.split("-")[0]);
                                                    let _stock=0;
                                                    for(let i=0;i<productList.length;i++){
                                                        if(productList[i].id==_id){
                                                            _stock=productList[i].stock;
                                                            break
                                                        }
                                                    }
                                                    let _varStock=`stock${index}`;
                                                    console.log("_stock,_varStock ",_stock,_varStock)
                                                    this.formRef.current.setFieldsValue({ [_varStock]: _stock })
                                                }} 
                                                optionFilterProp="filterValue" showSearch={true} placeholder='选择商品' allowClear>
                                                    {productList.map((item, index) => {
                                                        return <Option value={item.value} key={item.id} name={item.name} filterValue={item.value}>
                                                            <div>{item.value}</div>
                                                        </Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name={`stock${index}`} label="库存" style={{ margin: '0 3px' }} rules={[{ required: true, message: '请输入库存'}]}>
                                                <InputNumber min={0} className="input-wrapper-from" placeholder="0" />
                                            </Form.Item>
                                            <Form.Item name={`prob${index}`} label="概率" rules={[{ required: true, message: '请填写概率'}]}>
                                                <Input min={0} max={99} className="input-wrapper-from" placeholder="0" addonAfter="%" />
                                            </Form.Item>
                                        </div>  
                                    )
                                })
                            }
                        </Form.Item>
                        <Form.Item className='form-item-custom'>
                            <div className='from-flex-1'>
                                <Form.Item label="活动类型" name="activityType" rules={[{ required: true}]}>
                                    <Select placeholder="请选择类型" dropdownMatchSelectWidth={true} allowClear>
                                        {
                                            activity_type.map((item,index)=>{
                                                return <Option value={item.key} key={item.key} name={item.value}>{item.key}-{item.value}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ margin: '0 25px' }} label="抽奖次数" name="activityTimes" rules={[{ required: true}]}> 
                                    <Input min={0} placeholder="N" addonAfter={drawNumber}/>
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item label="缩略图" name="pic" valuePropName="fileList" 
                                // 如果没有下面这一句会报错
                                getValueFromEvent={normFile} 
                            >
                            <div className="input-wrapper-box">
                                <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)} imageUrl={pic}/>
                            </div>
                        </Form.Item>
                        <Form.Item label="活动规则" name="desc" rules={[{ required: true}]}>
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
            <Modal title={"实时库存"} centered visible={showSkuModal} onCancel={() => { this.setState({ showSkuModal: false }) }} footer={null} width={500}>
                <Table bordered dataSource={skuTable} columns={skuColumns}>
                    {/* <span slot='action' slot-scope="text,record,index">
                        {index}
                    </span> */}
                </Table>
            </Modal>
        </div>
    }
    componentDidMount(){
        this.initData();   // 初始化table 的thead
        this.getGoodsList();
    }
    submitForm(_obj){
        console.log(_obj);
        let _time=new Date().getTime();
        if((_time-this.state.clickDate)<1500){
            this.setState({
                clickDate:_time
            })
            return
        }
        this.setState({
            clickDate:_time
        })
        let arr=[];
        let _number=0;
        for(let i=0;i<8;i++){
            let obj={};
            let _goodsName=_obj['names'+i];
            obj.id=Number(_goodsName.split("-")[0]);
            obj.name=_goodsName.split("-")[1];
            obj.stock=_obj['stock'+i];
            obj.prob=Number(_obj['prob'+i]);
            _number+=Number(_obj['prob'+i])
            arr.push(obj)
        }
        console.log("总的概率:",_number)
        if(_number!=100){
            message.error("概率总和必须等于100");
            return
        }
        _obj.goods=JSON.stringify(arr);
        for(let m=0;m<8;m++){
            delete _obj['names'+m];
            delete _obj['stock'+m];
            delete _obj['prob'+m];
        }
        console.log("arr",_obj,arr)
        _obj.activityTimes=Number(_obj.activityTimes)
        if(_obj.pic==undefined){
            _obj.pic=""
        }
        if(this.state.editType==1){   // 新增
            let params={
                ..._obj,
                status:1
            }
            addPActivity(params).then(res=>{
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
        }else{    // 修改
            let params={
                id:this.state.currentItem.id,
                status:this.state.currentItem.status,
                ..._obj
            }
            console.log("params",params)
            updatePActivity(params).then(res=>{
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
        this.formRef.current.setFieldsValue({ "pic": fill });
        this.setState({
            pic:fill
        })
    }
    getGoodsList(){   // 获取商品列表
        let params = {
            currentPage: 1, pageSize: 1000
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
            currentPage:this.state.page,
            pageSize:this.state.pageSize
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
            status:obj.status
        }
        updatePActivityStatus(params).then(res=>{
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
    syncItem(obj){    // 同步缓存
        let params={
            id:obj.id
        }
        syncPActivity(params).then(res=>{
            if(res.data.errCode==0){
                message.success("已同步");
                this.getList();
            }else{
                message.error(res.data.msg)
            }
        })
    }
    editRow(obj){
        console.log("编辑",obj);
        let goods=JSON.parse(JSON.stringify(obj.goods));
        for(let i=0;i<8;i++){
            obj['names'+i]=goods[i].id+"-"+goods[i].name;;
            obj['stock'+i]=goods[i].stock;
            obj['prob'+i]=goods[i].prob;
            goods[i].name=goods[i].id+"-"+goods[i].name;
        }
        console.log("格式化过后的obj",obj)
        this.setState({
            showEditModel:true,
            currentItem:obj,
            editType:2,
            pic:obj.pic,
            //goodsData:goods
        },()=>{
            this.formRef.current.setFieldsValue(obj)
        })
    }
    getSku(obj){   // 库存
        console.log("库存",obj)
        let params={
            id:obj.id
        }
        goodsRealStock(params).then(res=>{
            console.log("goodsRealStock",res)
            if(res.data.errCode==0){
                this.setState({
                    skuTable:res.data.data,
                    showSkuModal:true
                })
            }
        })
    }
    initData(){
        let { table_box, activity_type} = this.state;
        let table_title =[
            {title: "ID", dataIndex: "id", key: "id"},
            {title: "标题", dataIndex: "title", key: "title"},
            {
                title: "类别", dataIndex: "activityType", key: "activityType",
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
            {title: "缩略图", dataIndex: "pic", key: "pic",
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
                        size="small"
                        type="primary"
                        onClick={()=>{
                            console.log(row);
                            this.editRow(row)
                        }}
                        >编辑</Button>
                        <Button size="small" style={{margin:"0 0 0 10px"}} onClick={()=>{this.syncItem(row)}}>同步</Button>
                        <Button size="small" style={{margin:"0 10px"}} onClick={()=>{this.getSku(row)}}>实时库存</Button>
                        <Button size="small" danger onClick={()=>{this.deleteItem(row)}}>删除</Button>
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