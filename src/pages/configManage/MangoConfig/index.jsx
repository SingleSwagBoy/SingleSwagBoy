
import React, { Component } from 'react';

import { Input, Form, DatePicker, Button, Table, Modal, Card, Switch, Select, message, Image, InputNumber, Radio } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import "./style.css"
import util from "utils"
import {
    getMangoList,addMangoList,addMangoUpdate,delMango,getMangoSync,addMangosearch,updateMangoSort,getSortList
} from 'api';
import { MySyncBtn } from '@/components/views.js';
import { MyImageUpload } from '@/components/views.js';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
//import InfoDialog from "./infoDialog"
let { RangePicker } = DatePicker;
let { Option } = Select;

let privateData = {
    inputTimeOutVal: null
};
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};
export default class adCreateModal extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.formRefTwo = React.createRef();
        this.state = {
            materialShow: false,
            page: 1,
            pageSize: 10,
            total: 10,
            format: 'YYYY-MM-DD HH:mm',
            lists: [],
            adIndex: 1,
            titleTypes:[
                { key: 0, name: "热门推荐" },
                { key: 3, name: "电视剧推荐" },
                { key: 2, name: "电影推荐" },
                { key: 1, name: "综艺推荐" },
            ],
            typeList: [
                { key: 0, name: "通用" },
                { key: 1, name: "家庭号" },
                { key: 2, name: "公众号登陆" },
                { key: 3, name: "小程序登陆" },
                { key: 4, name: "支付广告" },
            ],
            typess: [
                { key: 1, value: '综艺' },
                { key: 2, value: '电影' },
                { key: 3, value: '电视剧' },
                { key: 4, value: '音乐' },
                { key: 5, value: '动漫' },
                { key: 6, value: '纪录片' },
                { key: 7, value: '娱乐' },
                { key: 8, value: '原创' },
                { key: 9, value: '教育' },
                { key: 10, value: '游戏' },
                { key: 11, value: '体育' },
                { key: 12, value: '生活' },
            ],
            tailLayout: {
                wrapperCol: { offset: 12, span: 16 },
            },
            rechargeList: [],
            currentItem: "",
            table_title: [
                { title: '列表位置', dataIndex: 'location', key: 'location', width: 100,},
                {
                    title: '剧集类别', dataIndex: 'category', key: 'category', width: 100,
                    render: (rowValue, row, index) => {
                        return (
                            <div>{this.getProgrameType(rowValue)}</div>
                        )
                    }
                },
                { title: '剧集名称', dataIndex: 'name', key: 'name', width: 200,},
                { title: '剧集标题', dataIndex: 'title', key: 'title', width: 200,},
                {
                    title: '封面图', dataIndex: 'cover', key: 'cover', width: 150,
                    render: (rowValue, row, index) => {
                        return (<Image width={50} src={rowValue} />)
                    }
                },
                
                {
                    title: '有效时间', dataIndex: 'time', key: 'time', width: 300,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                
                                {
                                    (row.startTime=="" || row.startTime==0) &&  (row.endTime=="" || row.endTime==0) &&
                                    <span>长期</span> ||
                                    (row.startTime || row.endTime) &&
                                    <span>{row.startTime ? util.formatTime(row.startTime, ".", "") : "未配置"}-{row.endTime ? util.formatTime(row.endTime, ".", "") : "未配置"}</span>
                                }
                            </div>
                        )
                    }
                },
                {
                    title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 210,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button size='small' style={{ marginLeft: 5 }} onClick={() => {
                                    console.log(row)
                                    console.log("row.name",row.name)
                                    //this.getProgrames(row.name)
                                    this.setState({
                                        materialShow: true,
                                        editType:2,
                                        currentItem: row,
                                    }, () => {
                                        let obj = JSON.parse(JSON.stringify(row))
                                        if(obj.startTime==0 && obj.endTime==0){
                                            obj.time = ["", ""]
                                        }else{
                                            obj.time = [moment(obj.startTime), moment(obj.endTime)]
                                        }
                                        this.formRefTwo.current.setFieldsValue(obj)
                                        this.forceUpdate()
                                    })
                                }
                                }> 编辑</Button>
                                <Button size='small' style={{ marginLeft: 5 }} onClick={() => {this.deleteData(row)}}>删除</Button>
                            </div >
                        );
                    }
                },
            ],
            currentType:0,
            isOpenModal:false,
            allList:[],   // 所有的列表数据
            showList:[],  // 当前显示的数据
            titleAdd:"",  // 是否是新增title
            tieleCurrentItem:"",  // 修改title,当前的数据
            editType:1,  // 列表数据是否新增   1 是新增 2是编辑
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },
            searchProgram:[],  // 节目列表
            showSortTable:false,  // 排序的弹框
            sortTable:[], // 排序列表
            sortTableBefore:[],
            activityIndex: null,
            skuColumns:[
                {
                    title: "顺序",
                    dataIndex: "sequence",
                    key: "sequence",
                    render: (rowValue, row, index) => {
                        return (
                            this.state.activityIndex == index ?
                                <div><InputNumber defaultValue={rowValue} step={10} min={0} onBlur={(e) => {
                                    console.log(e)
                                    console.log("row",row)
                                    //this.sortChannelSport(e.target.value, row)
                                    let _list=this.state.sortTableBefore.map(item=>{
                                        if(item.type==row.type){
                                            item.sequence=e.target.value*1
                                        }
                                        return item
                                    })
                                    console.log("_list",_list)
                                    this.setState({
                                        sortTableBefore:_list
                                    },()=>{
                                        console.log("this.state.sortTableBefore",this.state.sortTableBefore)
                                    })
                                    
                                }}></InputNumber></div>
                                :
                                <div style={{ color: "#1890ff" }} onClick={() => this.setState({ activityIndex: index })}>{rowValue}</div>
                        )
                    }
                },
                {
                    title: "tab名称",dataIndex: "name",key: "name",
                },
            ],
        }
    }
    
    render() {
        let that = this;
        let { titleTypes,currentType,table_title, searchProgram, materialShow, format,showList ,editType,selectProps,sortTable,skuColumns} = that.state;

        return (
            <div>
                <Card title={
                    <>
                        <div style={{ display: "flex" }}>
                            <div className="everyBody" style={{ display: "flex", alignItems: 'center' }}>
                                {
                                    titleTypes.map((item,index)=>{
                                        return (
                                            <div className={`everyBody-item ${item.key==currentType?"everyBody-item-active":""}`} key={index} onClick={()=>{this.changeType(item.key)}}>{item.name}</div>
                                        )
                                    })
                                }
                     
                            </div>
                        </div>

                    </>
                }
                    extra={
                        <div>
                            <Button type="primary" onClick={()=>{
                                this.setState({
                                    showSortTable:true
                                },()=>{
                                    this.getSort()
                                })
                            }}>tab顺序</Button>
                            <Button type="primary" style={{ marginLeft: "10px" }} onClick={()=>{
                                this.getTitle();
                            }}>标题配置</Button>
                            <Button type="primary" style={{ margin: "0 10px" }} onClick={() => {
                                this.setState({
                                    currentItem: {},
                                    materialShow: true,
                                    editType: 1,
                                }, () => {
                                    this.formRefTwo.current.resetFields()
                                    this.forceUpdate()
                                })
                            }}>新增</Button>
                            <Button type="primary" onClick={this.syncData.bind(this)}>同步缓存</Button>
                        </div>
                    }
                >
                    <Table
                        columns={table_title}
                        dataSource={showList}
                        pagination={false}
                        scroll={{ x: 1500 }}
                    />
                </Card>
                <Modal visible={this.state.isOpenModal}  onCancel={() => {this.setState({isOpenModal:false})}}  footer={null}>
                    {
                        <Form name="mini" ref = {this.formRef} onFinish={this.submitForm.bind(this)}>
                            <Form.Item label="标题配置" name="titleCategory">
                                <Radio.Group
                                    onChange={(e) => {
                                        console.log(e)
                                        this.formRef.current.setFieldsValue("titleCategory",e.target.value);
                                        this.forceUpdate()
                                    }}
                                >
                                    <Radio value={1}>文字</Radio>
                                    <Radio value={2}>图片</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {
                                this.formRef && this.formRef.current &&
                                <div>
                                    {
                                        this.formRef.current.getFieldValue("titleCategory")==1 &&
                                        <Form.Item name="title" rules={[{ required: true, message: '请填写标题名称' }]}>
                                            <Input placeholder="请填写标题名称" />
                                        </Form.Item>  ||
                                        this.formRef.current.getFieldValue("titleCategory")==2 &&
                                        <Form.Item label="上传图片" name="title" rules={[{ required: true}]} valuePropName="fileList" getValueFromEvent={normFile} >
                                            <ImageUpload 
                                            //getUploadFileUrl={this.getUploadFileUrl.bind(this)} 
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('title', file, newItem) }}
                                            imageUrl={this.formRef.current && this.formRef.current.getFieldValue("title")}/>
                                        </Form.Item>
                                    }
                                </div>
                            }
                            
                            <Form.Item {...this.state.tailLayout}>
                                <Button style={{ margin: "0 20px" }} onClick={()=>{ this.setState({isOpenModal:false})}}>取消</Button>
                                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>提交</Button>
                            </Form.Item>
                        </Form>
                    }
                </Modal>
                <Modal visible={materialShow} title={editType==1?"新增":"编辑"}  width={800} transitionName="" maskClosable={false}
                    onCancel={() => that.onModalCancelClick()}
                    footer={null}
                    zIndex={888}
                >
                    {
                        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRefTwo} onFinish={this.onModalConfirmClick.bind(this)}>
                            <div>
                                <div  className='form-g'>
                                    <Form.Item  style={{marginLeft:"70px"}} label='剧集名称' name='name' rules={[{ required: true }]}>
                                        <Select className="base-input-wrapper" allowClear {...selectProps} placeholder="频道搜索" onChange={(e)=>{
                                            console.log("eeeeee",e);
                                            let arr=searchProgram.filter(item=>item.title==e);
                                            console.log("arr",arr);
                                            if(arr.length>0){
                                                this.formRefTwo.current.setFieldsValue({ 
                                                    "name":arr[0].title,
                                                    "title": arr[0].subTitle,
                                                    "cover": arr[0].imgX,
                                                    "type":arr[0].type,
                                                    "vid":arr[0].vId,
                                                    "kind":arr[0].kind,
                                                    "category":arr[0].categoryType,
                                                    "keyword":arr[0].keyword,
                                                    "cid":arr[0].cId,
                                                    "serialNo":arr[0].serialNo,
                                                    "count":arr[0].serialCount
                                                });
                                                this.forceUpdate();
                                            }
                                        }} onSearch={(searchKey) => {
                                            console.log("searchKeysearchKey",searchKey);
                                            if (privateData.inputTimeOutVal) {
                                                clearTimeout(privateData.inputTimeOutVal);
                                                privateData.inputTimeOutVal = null;
                                            }
                                            privateData.inputTimeOutVal = setTimeout(() => {
                                                if (!privateData.inputTimeOutVal) return;
                                                this.getProgrames(searchKey)
                                            }, 800)
                                        }}>
                                            {
                                                searchProgram.map((item, index) => {  // + "----" + item.id
                                                    return <Option value={item.title} key={item.id}>{item.title}</Option>
                                                })
                                            }
                                        </Select>
                                        
                                    </Form.Item>
                                    <div className='right-text'>
                                        {
                                            this.formRefTwo.current && this.formRefTwo.current.getFieldValue("category") &&
                                            <span className='mar-left-10'>{this.getProgrameType(this.formRefTwo.current.getFieldValue("category"))}</span>
                                        }
                                        {
                                            this.formRefTwo.current && this.formRefTwo.current.getFieldValue("type") && this.formRefTwo.current.getFieldValue("type") == 10 &&
                                            <span className='mar-left-10'>合集</span> ||
                                            this.formRefTwo.current && this.formRefTwo.current.getFieldValue("type") && this.formRefTwo.current.getFieldValue("type") == 20 &&
                                            <span className='mar-left-10'>分集</span> 
                                        }
                                    </div>
                                </div>
                                <Form.Item label="副标题" name="title" >
                                    <Input className="base-input-wrapper"  />
                                </Form.Item>
                                <Form.Item label="封面图" name="cover">
                                    <MyImageUpload 
                                        //getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl('title', file, newItem,"formRefTwo") }}
                                        getUploadFileUrl={(file, newItem) => { that.getUploadFileUrlTwo('cover', file, newItem) }}
                                        imageUrl={this.formRefTwo.current && this.formRefTwo.current.getFieldValue("cover")} />
                                </Form.Item>
                                <Form.Item label="上下线时间" name='time'>
                                    <RangePicker format={format} className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
                                </Form.Item>
                                <Form.Item label='列表位置' name='location' rules={[{ required: true }]}>
                                    <InputNumber min={1} max={6} placeholder="输入1~6"/>
                                </Form.Item>
                                <Form.Item {...this.state.tailLayout}>
                                    <Button onClick={() => { this.onModalCancelClick() }}>取消</Button>
                                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                        确定
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    }
                </Modal>
                <Modal visible={this.state.showSortTable}  onCancel={() => {this.cancenSort()}}  footer={null} width={500}>
                    <Table bordered dataSource={sortTable} columns={skuColumns} pagination={false}>
                    </Table>
                    <div className='btns-modal'>
                        <Button onClick={() => { this.cancenSort() }}>取消</Button>
                        <Button type="primary" style={{ margin: "0 20px" }} onClick={()=>{this.changeSort()}}>
                            确定
                        </Button>
                    </div>
                </Modal>
            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.getMangoList();
        that.getProgrames("");
    }
    cancenSort=()=>{  // 取消排序
        this.setState({
            showSortTable:false,
            activityIndex:null
        })
    }
    getSort=()=>{   // 获取排序列表
        let params={
            key:"MANGOTV.TAB"
        }
        console.log(1234)
        getSortList(params).then(res=>{
            console.log("MANGOTV.TAB",res);
            this.setState({
                //showSortTable:true,
                sortTable:res.data.tabs,
                sortTableBefore:res.data.tabs
            })
        })
    }
    changeSort=()=>{
        let params={
            //key:"MANGOTV.TAB",
            tabs:this.state.sortTableBefore
        }
        updateMangoSort("MANGOTV.TAB",params).then(res=>{
            console.log("addMangoUpdate",res)
            message.success("修改成功")
            this.cancenSort();
        }).catch(err=>{
            message.success(err)
        })
    }
    getProgrames=(_title)=>{   // 模糊搜索视频库
        let params={
            title:_title,
            page:{
                currentPage:1,
                pageSize:30
            }
        }
        addMangosearch(params).then(res=>{
            console.log("addMangosearch",res)
            if(res.data.errCode==0){
                if(res.data.data){
                    this.setState({
                        searchProgram:res.data.data
                    })
                }
                
            }else{
                console.log("res.data.msg",res.data.msg)
                message.error(res.data.msg);
            }
        })
    }
    getMangoList=()=>{   // 获取数据列表
        let params={
            key:"MANGOTV.RESOURCE"
        }
        getMangoList(params).then(res=>{
            console.log("MANGOTV.RESOURCE",res);
            let _list=res.data.map(item=>{
                if(item.startTime){
                    item.startTime=item.startTime*1000
                }
                if(item.endTime){
                    item.endTime=item.endTime*1000
                }
                return item
            });
            this.setState({
                
                allList:_list,
                showList:_list.filter(item=> item.commandType==this.state.currentType)
            },()=>{
                console.log("this.state.showList",this.state.showList)
            })
        })
    }
    getTitle=()=>{   // 获取title
        let params={
            key:"MANGOTV.MODULE"
        }
        getMangoList(params).then(res=>{
            console.log("MANGOTV.RESOURCE",res);
            let arr=[];
            let obj={};
            let addStatus
            arr=res.data.filter(item=>item.titleType==this.state.currentType);
            if(arr.length>0){
                obj=arr[0];
                addStatus=false
                this.setState({
                    tieleCurrentItem:arr[0]
                })
            }else{
                addStatus=true
                obj={
                    title:"",
                    titleCategory:1,
                    titleType:this.state.currentType
                }
            }
            console.log("getMangoList=obj",obj)
            this.setState({
                isOpenModal:true,
                titleAdd:addStatus
            },()=>{
                this.formRef.current.resetFields();
                this.formRef.current.setFieldsValue(obj)
                this.forceUpdate()
            })
        })
    }
    getProgrameType=(type)=>{
        console.log("typegetProgrameType",type)
        let arr=this.state.typess.filter(item=>item.key==type)
        if(arr.length>0){
            return arr[0].value
        }else{
            return ""
        }
    }
    changeType=(type)=>{   //   切换type
        console.log("type",type)
        if(type!=this.state.currentType){
            this.setState({
                currentType:type
            },()=>{
                this.getMangoList();
            })
        }
    }
    submitForm(obj){  // 修改title信息
        console.log("submitForm",obj);
        obj.title=obj.title.replace(/\s/g,"");
        if(obj.title==""){
            if(this.state.currentType==0){
                obj.title="热门推荐"
            }else if(this.state.currentType==1){
                obj.title="综艺推荐"
            }else if(this.state.currentType==2){
                obj.title="电影推荐"
            }else if(this.state.currentType==3){
                obj.title="电视剧推荐"
            }
        }
        let params={
            ...obj,
            titleType:this.state.currentType,
            key:"MANGOTV.MODULE"
        }
        console.log("params",params);
        if(this.state.titleAdd==true){   // 新增title配置
            addMangoList(params).then(res=>{
                console.log("addMangoList",res)
                this.setState({isOpenModal:false})
                message.success("设置成功")
            })
        }else{  // 修改title配置
            params.indexId=this.state.tieleCurrentItem.indexId;
            addMangoUpdate(params).then(res=>{
                console.log("addMangoUpdate",res)
                this.setState({isOpenModal:false})
                message.success("设置成功")
            })
        }
    }
    syncData=()=>{   // 同步缓存
        let _list=["MANGOTV.RESOURCE","MANGOTV.MODULE","MANGOTV.TAB"]
        for(let i=0;i<_list.length;i++){
            let params={
                key:_list[i]
            }
            getMangoSync(params).then(res=>{
                console.log("getMangoSync",res)
                if(_list[i]=="MANGOTV.TAB"){
                    message.success("缓存同步成功");
                }
            })
        }
    }
    deleteData=(obj)=>{
        console.log("deleteData",obj)
        Modal.confirm({
            title: `确认删除该条数据吗？`,
            onOk:()=>{
                let params={
                    key:"MANGOTV.RESOURCE",
                    id:obj.indexId
                }
                delMango(params).then(res=>{
                    console.log(res);
                    message.success("删除成功");
                    this.getMangoList();
                })
            },
            onCancel: ()=>{
            }
        })
    }
    onModalCancelClick() {   //弹出框取消按钮被点击
        this.formRefTwo.current.resetFields();
        this.setState({
            materialShow: false,
        })
    }
    //弹出框确定按钮被点击
    onModalConfirmClick(val) {
        console.log("val",val)
        //console.log("parseInt(val.time[0].valueOf())",parseInt(val.time[0].valueOf()))
        let obj=JSON.parse(JSON.stringify(val))
        if(obj.cover==undefined){
            obj.cover=""
        }
        if(obj.title==undefined){
            obj.title=""
        }
        if(this.state.editType==1){   // 新增
            let params={
                ...this.formRefTwo.current.getFieldValue(),
                ...obj,
                key:"MANGOTV.RESOURCE",
                startTime: (val.time && val.time[0]) ? parseInt(val.time[0].valueOf()/1000) : 0,
                endTime: (val.time && val.time[1]) ? parseInt(val.time[1].valueOf()/1000) : 0,
                commandType:this.state.currentType
            }
            console.log("params",params)
            addMangoList(params).then(res=>{
                console.log("addMangoList",res)
                message.success("添加成功");
                this.onModalCancelClick();
                this.getMangoList();
            })
        }else{   // 编辑
            let params={
                ...this.state.currentItem,
                ...this.formRefTwo.current.getFieldValue(),
                ...obj,
                key:"MANGOTV.RESOURCE",
                startTime: (val.time && val.time[0]) ? parseInt(val.time[0].valueOf()/1000) : val.startTime,
                endTime: (val.time && val.time[1]) ? parseInt(val.time[1].valueOf()/1000) : val.endTime,
            }
            console.log("params",params)
            addMangoUpdate(params).then(res=>{
                console.log("addMangoUpdate",res)
                message.success("编辑成功");
                this.onModalCancelClick();
                this.getMangoList();
            })
        }
    }

    //获取上传文件
    getUploadFileUrl(type, file, newItem) {
        console.log(type, file,newItem,"newItem")
        let that = this;
        let image_url = file;
        // let obj = {};
        // obj[type] = image_url;
        //that.formRef.current.setFieldsValue({ [type]: image_url });
        that.formRef.current.setFieldsValue({ [type]: image_url });
        that.forceUpdate();
    }
    //获取上传文件
    getUploadFileUrlTwo(type, file, newItem) {
        console.log(type, file,newItem,"newItem")
        let that = this;
        let image_url = file;
        // let obj = {};
        // obj[type] = image_url;
        that.formRefTwo.current.setFieldsValue({ [type]: image_url });
        that.forceUpdate();
    }
}