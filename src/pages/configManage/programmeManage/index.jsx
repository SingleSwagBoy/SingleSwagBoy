import React, { Component,useState, useEffect, useCallback  } from 'react'

import { getRecords, getlistAllPrograms,requestNewAdTagList,getCategories,categoriesUpdate } from 'api'
import { Breadcrumb, Card, Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, Checkbox,Switch,Radio } from 'antd'

import { } from 'react-router-dom'
import { } from "@ant-design/icons"
// import ContentDialog from "./contentDialog"
import util from 'utils'
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};
const { TextArea } = Input;


export default class ProgrammeManage extends Component{
    
    constructor(){
        super();
        this.formRef = React.createRef()
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            loading: false,
            btnLoading: false,
            searchWords: "",
            lists: [],
            currentItem: "",//编辑行的id
            newData: {},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 8, span: 16 },
            },
            dataSource: [],
            visible: false,
            isShow:false,//内容配置
            columns: [
                { title: "节目ID", dataIndex: "programId", key: "programId", width:100,},
                { title: "节目名", dataIndex: "name", key: "name", },
                { title: "节目类别", dataIndex: "categoryName", key: "categoryName", },
                {
                    title: "节目封面", dataIndex: "image", key: "image",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {  
                                    row.image &&
                                    <Image width={80} src={rowValue} /> ||
                                    <span>-</span>
                                }
                            </div>
                        )
                    }
                },
                {
                    title:"节目信息",dataIndex: "projectInfo", key: "projectInfo",width:200,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <p>主演:{row.starring?row.starring:"-"}</p>
                                <p>导演:{row.director?row.director:"-"}</p>
                                <p>编剧:{row.screenWriter?row.screenWriter:"-"}</p>
                                <p>地区:{row.part?row.part:"-"}</p>
                            </div>
                            
                        )
                    }
                },
                {
                    title: '状态', dataIndex: 'isBlack', key: 'isBlack',
                    render: (rowValue, row, index) => {
                        return (
                            <span>
                                {rowValue?"是("+this.getTagsName(row.tags)+")":""}
                            </span>
                        )
                    }
                },
                {
                    title: "操作", key: "action",
                    fixed: 'right', 
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button  size="small" type="primary"
                                    onClick={() => {
                                        console.log(rowValue, row);
                                        if(row.categoryOne){
                                            let params={
                                                type:row.categoryOne
                                            }
                                            getCategories(params).then(res=>{
                                                console.log("row.categoryOnerow.categoryOnerow.categoryOnerow.categoryOne",res)
                                                if(res.data.errCode==0){
                                                    let _list=res.data.data.type;
                                                    for(let i=0;i<_list.length;i++){
                                                        if(_list[i].name==row.categoryOne){
                                                            this.setState({
                                                                optionListTwo:_list[i].category.map((item=>{
                                                                    item.label=item.name;
                                                                    item.value=item.name;
                                                                    return item;
                                                                }))
                                                            },()=>{
                                                                console.log("optionListTwooptionListTwooptionListTwooptionListTwo",this.state.optionListTwo)
                                                            })
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                        
                                        this.setState({isOpenModal:true,currentItem:row},()=>{
                                            this.forceUpdate();
                                            this.formRef.current.resetFields();
                                            this.formRef.current.setFieldsValue(row);
                                        })
                                    }}>编辑</Button>
                            </div>
                        )
                    }
                }
            ],
            isOpenModal:false,
            formData:{type:1,name:"专题名称",picUrl:""},
            picUrl:"",
            refTvConfigModal: null,
            activityIndex: null,
            screen:{}, //筛选对象
            activityType:[
                {id:1,name:"电视剧"},
                {id:2,name:"电影"},
                {id:3,name:"综艺"},
            ],
            optionList:[
                {value:1,label:"现代都市"},{value:2,label:"科幻"},{value:3,label:"喜剧"},{value:4,label:"乡村"},{value:5,label:"犯罪"},
                {value:6,label:"戏剧"},{value:7,label:"青春偶像"},{value:8,label:"励志"},{value:9,label:"恐怖"},{value:10,label:"少儿"},
                {value:11,label:"家庭"},{value:12,label:"历史传奇"},{value:13,label:"谍战"},{value:14,label:"悬疑"},{value:15,label:"动漫"},
                {value:16,label:"革命战争"},{value:17,label:"军旅"},{value:18,label:"爱情"},{value:19,label:"穿越"},{value:20,label:"神话魔幻"},
                {value:21,label:"动作"},{value:22,label:"纪录片"},{value:23,label:"武侠"},{value:24,label:"古装"},
            ],
            optionListTwo:[],
            categoryNext:[],  // 二级分类列表
            checkedOptionList:["喜剧"],
            tagList: [],
            searchName:"",  // 搜索名称
            type:"",     // 类型名称（电视剧、电影、综艺）
            category:"",   // 分类名称
            isBlack:"",  //是否屏蔽(true: 已屏蔽；false :未屏蔽)
        }
    }
    componentDidMount() {
        //this.ChannelTopic();
        //this.initData()
        requestNewAdTagList().then(res => {
            console.log("res requestNewAdTagList",res)
            // let _list = res.data.map(item => { 
            //     //return { label: item.name, value: item.code }
            //     item.name=item.name+"-"+item.code;
            //     return item
            // })
            this.setState({
                tagList: res.data
            })
        });
        this.getlistAllPrograms()
    }
    getTagsName=(val)=> {
        let arr = this.state.tagList.filter(r => r.code == val)
        if (arr.length > 0) {
            return arr[0].name
        } else {
            return ""
        }
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getlistAllPrograms()
        })
    }
    getlistAllPrograms() {
        let params = {
            name: this.state.searchName,
            type:this.state.type,
            category:this.state.category,
            isBlack:this.state.isBlack,
            pageSize: this.state.pageSize,
            pageNum: this.state.page
        }
        getlistAllPrograms(params).then(res => {
            console.log("getlistAllPrograms",res)
            this.setState({
                lists: Array.isArray(res.data.data.programs)?res.data.data.programs.map((item)=>{
                    if(item.categoryName){
                        let arr=item.categoryName.split(" ");
                        console.log("arrrrrrr",arr);
                        item.categoryOne=item.categoryName.split(" ")[0];
                        item.categoryTwo=arr.slice(1,arr.length);
                        console.log("item.categoryTwo",item.categoryTwo);
                    }else{
                        item.categoryOne="";
                        item.categoryTwo=[];
                    }
                    return item
                }):[],
                total:res.data.data.totalPage*this.state.pageSize
            },()=>{
                console.log("listslistslists====listslistslistslists",this.state.lists);
            })
        })
    }
    submitForm(obj){
        console.log(obj);
        obj.categoryName=""
        if(obj.categoryTwo.length==0){
            obj.categoryName=obj.categoryOne
        }else{
            obj.categoryName=obj.categoryOne+" "+obj.categoryTwo.join(" ")
        }
        console.log("obj.categoryName",obj.categoryName)
        let params={
            ...this.state.currentItem,
            ...obj
        }
        console.log("params",params)
        categoriesUpdate(this.state.currentItem.programId,params).then(res=>{
            console.log("categoriesUpdate",res)
            if(res.data.errCode==0){
                message.success("操作成功")
                this.setState({
                    isOpenModal:false
                })
                this.formRef.current.resetFields();
                this.getlistAllPrograms()
            }else{
                message.error(res.data.msg)
            }
        })
        
    }
    getUploadFileUrl(type,fill){   // 图片上传
        console.log(fill)
        this.formRef.current.setFieldsValue({ "image": fill });
        //this.formRef.current.setFieldsValue(obj);
        // this.setState({
        //     picUrl:fill
        // })
        this.forceUpdate();
    }
    closeDialog=()=>{
        this.setState({
            isShow:false
        })
    }
    onModalResult=(obj)=>{
        console.log("obj",obj)
    }
    getCategoryList=()=>{
        let params={
            type:this.state.type
        }
        getCategories(params).then(res=>{
            console.log("getCategoryList============getCategoryList",res)
            if(res.data.errCode==0){
                let _list=res.data.data.type;
                for(let i=0;i<_list.length;i++){
                    if(_list[i].name==this.state.type){
                        this.setState({
                            categoryNext:_list[i].category
                        })
                    }
                }
                
            }
        })
    }

    getRecords(type){
        let params={
          ...this.state.screen,
        //   "page": {
        //     "currentPage": type?type:this.state.page,
        //     "pageSize": this.state.pageSize,
        //     // "pageSize": 10,
        //   }
        }
        console.log("params",params)
        // getRecords(params).then(res=>{
        //   console.log(res);
        //   if(res.data.errCode == 0){
        //    this.setState({
        //      lists:res.data.data.data,
        //      total:res.data.data.page.totalCount
        //    })
        //   }
        // })
    }

    render(){
        let {page,pageSize,total,categoryNext}=this.state
        return (
            <div>
                <Card title={
                    <div className="cardTitle">
                        <div className="everyBody">
                            <Input.Search allowClear placeholder="请输入节目名" onSearch={(val)=>{
                                this.setState({
                                    searchName:val
                                },()=>{
                                    this.getlistAllPrograms();
                                })
                            }} />
                        </div>
                        <div className='everyBody'>
                            <Select allowClear  placeholder="类型" className='set-width-select'
                                onChange={(val)=>{
                                    console.log("val",val)
                                    this.setState({
                                        type:val,
                                        category:"",
                                        categoryNext:[]
                                    },()=>{
                                        this.forceUpdate();
                                        this.getlistAllPrograms();
                                        this.getCategoryList();
                                    })
                                }}
                            >
                                {
                                this.state.activityType.map(r=>{
                                    return(
                                    <Option value={r.name} key={r.id}>{r.name}</Option>
                                    )
                                })
                                }
                            </Select>
                        </div>
                        <div className="everyBody">
                            <Select allowClear  placeholder="分类" className='set-width-select'
                            onChange={(val)=>{
                                console.log("category  val",val)
                                this.setState({
                                    category:val
                                },()=>{
                                    this.forceUpdate();
                                    this.getlistAllPrograms();
                                })
                            }}
                            >
                            {
                                categoryNext.map(r=>{
                                    return(
                                        <Option value={r.name} key={r.id}>{r.name}</Option>
                                    )
                                })
                            }
                            </Select>
                        </div>
                        <div className="everyBody">
                            <Select allowClear  placeholder="是否屏蔽"  className='set-width-select'
                                onChange={(val)=>{
                                    console.log("category  val",val)
                                    this.setState({
                                        isBlack:val
                                    },()=>{
                                        this.forceUpdate();
                                        this.getlistAllPrograms();
                                    })
                                }}
                            >
                                <Option value={true} key={1}>已屏蔽</Option>
                                <Option value={false} key={2}>未屏蔽</Option>
                            </Select>
                        </div>
                        {/* <div className='everyBody'>
                            <Button type="primary" onClick={()=>{this.getRecords(1)}}>搜索</Button>
                        </div> */}
                  </div>
                }
                >
                    <Table
                        dataSource={this.state.lists}
                        loading={this.state.loading}
                        columns={this.state.columns} 
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: total,
                            onChange: this.changeSize
                        }}/>
                    <Modal visible={this.state.isOpenModal} title="节目单管理" onCancel={() => {
                        this.setState({isOpenModal:false})
                        this.formRef.current.resetFields()
                        }} footer={null} width={740}>
                        {
                            <Form name="projectForm" ref = {this.formRef} onFinish={this.submitForm.bind(this)}>
                                <Form.Item label="节目名" name="name" rules={[{ required: true, message: '请填写节目名' }]}>
                                    <Input className='base-input-wrapper' placeholder="请填写节目名称" />
                                </Form.Item> 
                                <Form.Item label="节目类别" name="categoryOne" rules={[{ required: true,message: '请选择节目类别'}]}>
                                    <Radio.Group
                                        onChange={(e) => {
                                            console.log(e)
                                            this.formRef.current.setFieldsValue("categoryOne",e.target.value);
                                            this.forceUpdate()
                                            let params={
                                                type:e.target.value
                                            }
                                            getCategories(params).then(res=>{
                                                console.log("row.categoryOnerow.categoryOnerow.categoryOnerow.categoryOne",res)
                                                if(res.data.errCode==0){
                                                    let _list=res.data.data.type;
                                                    for(let i=0;i<_list.length;i++){
                                                        if(_list[i].name==e.target.value){
                                                            if(_list[i].category){
                                                                this.setState({
                                                                    optionListTwo:_list[i].category.map((item=>{
                                                                        item.label=item.name;
                                                                        item.value=item.name;
                                                                        return item
                                                                    }))
                                                                },()=>{
                                                                    console.log("optionListTwooptionListTwooptionListTwooptionListTwo",this.state.optionListTwo)
                                                                })
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                        }}
                                    >
                                        <Radio value={"电视剧"}>电视剧</Radio>
                                        <Radio value={"电影"}>电影</Radio>
                                        <Radio value={"综艺"}>综艺</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="具体类别" name="categoryTwo">
                                    <Checkbox.Group options={this.state.optionListTwo}  onChange={(e) => {
                                        console.log(e)
                                        // this.setState({
                                        //     checkedItem: e
                                        // })
                                    }} />
                                </Form.Item> 
                                <Form.Item label="主演" name="starring">
                                    <Input className='base-input-wrapper' placeholder="主演" />
                                </Form.Item> 
                                <Form.Item label="导演" name="director">
                                    <Input className='base-input-wrapper' placeholder="导演" />
                                </Form.Item> 
                                <Form.Item label="编剧" name="screenWriter">
                                    <Input className='base-input-wrapper' placeholder="编剧" />
                                </Form.Item> 
                                <Form.Item label="地区" name="part">
                                    <Input className='base-input-wrapper' placeholder="地区" />
                                </Form.Item> 
                                <Form.Item label="剧情介绍" name="plot">
                                    <TextArea className='base-input-wrapper' placeholder="剧情介绍" />
                                </Form.Item> 
                                <Form.Item label="节目封面" name="image" valuePropName="fileList" getValueFromEvent={normFile} >
                                    <MyImageUpload
                                    getUploadFileUrl={(file) => { this.getUploadFileUrl('image', file) }}
                                    imageUrl={this.formRef.current && this.formRef.current.getFieldValue("image")} />
                                </Form.Item>
                                <div className='flex-row-items2'>
                                    <Form.Item label="是否屏蔽" name="isBlack" rules={[{ required: true,message: '请选择是否屏蔽'}]} style={{marginRight:"40px"}}>
                                        <Select className="base-input-wrapper3" placeholder="请选择" dropdownMatchSelectWidth={true} 
                                        onChange={(val)=>{
                                            console.log(val);
                                            this.forceUpdate();
                                        }}
                                        allowClear>
                                            <Option value={true} key={1}>已屏蔽</Option>
                                            <Option value={false} key={2}>未屏蔽</Option>
                                        </Select>
                                    </Form.Item>
                                    {
                                        this.formRef.current && this.formRef.current.getFieldValue("isBlack") &&
                                        this.formRef.current.getFieldValue("isBlack") == 1 &&
                                        <Form.Item label="关联标签" name="tags" >
                                            <Select className="base-input-wrapper5" placeholder="请选择标签" showSearch allowClear
                                            filterOption={(input, option) => {
                                                if (!input) return true;
                                                let children = option.children;
                                                if (children) {
                                                    let key = children[2];
                                                    let isFind = false;
                                                    isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                    if (!isFind) {
                                                        let code = children[0];
                                                        isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                    }
                                                    return isFind;
                                                }
                                            }}>
                                                {
                                                    this.state.tagList.map(r => {
                                                        return (
                                                            <Option value={r.code.toString()} key={r.code}>{r.code}-{r.name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    }
                                </div>
                                
                                <Form.Item {...this.state.tailLayout}>
                                    <Button style={{ margin: "0 20px" }} onClick={()=>{this.setState({isOpenModal:false});this.formRef.current.resetFields();}}>取消</Button>
                                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>提交</Button>
                                </Form.Item>
                                
                            </Form>
                        }
                    </Modal>

                </Card>
            </div>
            
        )
    }
}