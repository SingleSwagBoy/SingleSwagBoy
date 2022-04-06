import React, { Component,useState, useEffect, useCallback  } from 'react'

import { getlistPhoto } from 'api'
import { Breadcrumb, Card, Image, Button, Table, Modal, message, DatePicker, Input, Form, Select, Checkbox,Switch,Pagination } from 'antd'

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
            pageSize: 100,
            total: 0,
            totalCount:0,
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
            totalPage:"",
            photoList:[],
            pagesList:[],
            currentPage:1,
        }
    }
    componentDidMount() {
        //this.getlistAllPrograms()
    }
    getlistAllPrograms() {
        let params = {
            userId: this.state.searchName,
            pageSize: this.state.pageSize,
            page: this.state.page
        }
        getlistPhoto(params).then(res => {
            console.log("getlistAllPrograms",res)
            if(res.data.errCode==0){
                if(res.data.data.length==0){
                    message.error("未查找到数据");
                }
                this.setState({
                    photoList:res.data.data,
                    totalCount:res.data.totalCount,
                    totalPage:Math.ceil(res.data.totalCount/this.state.pageSize)
                })
            }
        })
    }
    changePage(index){
        console.log("changePage",index)
        document.getElementById("pagescontent1").scrollTop=0;
        this.setState({
            currentPage:index*1+1,
            page:index*1+1,
        },()=>{
            this.getlistAllPrograms();
        })
    }
    changePagination=(page,size)=>{
        console.log("page,size",page,size);
        this.setState({
            page:page,
            pageSize:size,
            photoList:[]
        },()=>{
            this.getlistAllPrograms()
        })
    }

    render(){
        let {page,totalCount,pageSize,photoList,pagesList,currentPage}=this.state
        return (
            <div>
                <Card id="pagescontent1" title={
                    <div className="cardTitle">
                        <div className="everyBody">
                            <Input.Search allowClear placeholder="请输入用户userId" onSearch={(val)=>{
                                this.setState({
                                    searchName:val,
                                    page:1,
                                    currentPage:1,
                                    totalPage:"",
                                    pagesList:[],
                                },()=>{
                                    if(val){
                                        this.getlistAllPrograms();
                                    }
                                })
                            }} />
                        </div>
                  </div>
                }
                >
                    <div className='photos-content'>
                        {
                            photoList.length>0 && photoList.map((item,index)=>{
                                return (
                                    <Image className='photo-item' src={item.pic} key={index}></Image>
                                )
                            })
                        }
                    </div>
                    
                    {
                        totalCount>0 &&
                        <div className='pages-content'>
                            <Pagination defaultCurrent={page} total={totalCount} defaultPageSize={pageSize} showQuickJumper={true} onChange={(page, pageSize)=>{this.changePagination(page,pageSize)}}/>
                        </div>
                    }
                    {/* <div className='pages-content' id="pagescontent">
                        {
                            pagesList.length>0 && pagesList.map((item,index)=>{
                                return (
                                    <div className={`page-btn ${currentPage == (index+1) ? "page-btn-active" : ""}`} onClick={()=>{
                                        this.changePage(index)
                                    }}>第{item}页</div>
                                )
                            })
                        }
                    </div> */}
                    

                </Card>
            </div>
            
        )
    }
}