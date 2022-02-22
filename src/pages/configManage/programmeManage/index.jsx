import React, { Component,useState, useEffect, useCallback  } from 'react'

import { getRecords, delShieldList, getShieldList,requestAdTagList } from 'api'
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
            pageSize: 50,
            total: 0,
            data: [],
            loading: false,
            btnLoading: false,
            searchWords: "",
            lists: [
                { name: "扫黑风暴",type:1,category:"电视剧 科幻 少儿", sort: 1, status: 1, id: 1,imgUrl:"http://cdn.mydianshijia.com/wechat/breakfast/shareImg.jpg",
                hide:"敏感地区" ,projectInfo:"节目信息111",zhuyan:"艾斯",daoyan:"导演",bianju:"编剧",area:"中国",pbi:1,tag:"es-es-feixiandiyu"},
                { name: "啊啊啊啊",type:2,category:"电视剧 科幻 少儿", sort: 2, status: 2, id: 2,imgUrl:"",hide:"",projectInfo:"节目信息222",
                zhuyan:"艾斯2",daoyan:"导演2",bianju:"编剧2",area:"日本" ,pbi:2,tag:""}
            ],
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
                    title:"节目信息",dataIndex: "projectInfo", key: "projectInfo",
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <p>主演:{row.zhuyan?row.zhuyan:"-"}</p>
                                <p>导演:{row.daoyan?row.daoyan:"-"}</p>
                                <p>编剧:{row.bianju?row.bianju:"-"}</p>
                                <p>地区:{row.area?row.area:"-"}</p>
                            </div>
                            
                        )
                    }
                },
                {
                    title: '状态', dataIndex: 'isBlack', key: 'isBlack',
                    render: (rowValue, row, index) => {
                        return (
                            <span>
                                {rowValue?`是(${rowValue})`:`否`}
                            </span>
                        )
                    }
                },
                {
                    title: "操作", key: "action",
                    fixed: 'right', width: 310,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                <Button  size="small" type="primary"
                                    onClick={() => {
                                        console.log(rowValue, row);
                                        this.setState({isOpenModal:true},()=>{
                                            this.forceUpdate();
                                            this.formRef.current.resetFields();
                                            this.formRef.current.setFieldsValue(row);
                                        })
                                    }}>编辑</Button>
                                <Button size="small" type="primary" onClick={() => { 
                                    
                                }} style={{ margin: "0 10px" }}>同步缓存</Button>
                                <Button size="small" danger onClick={() => { this.delShieldList(row) }}>删除</Button>
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
            checkedOptionList:[2,3],
            tagList: [],
        }
    }
    componentDidMount() {
        //this.ChannelTopic();
        //this.initData()
        requestAdTagList().then(res => {
            console.log("res",res)
            let _list = res.data.map(item => { 
                //return { label: item.name, value: item.code }
                item.name=item.name+"-"+item.code;
                return item
            })
            this.setState({
                tagList: res.data
            })
        });
        this.getShieldList()
    }
    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getShieldList()
        })
    }
    getShieldList() {
        let params = {
            //name: this.state.searchName,
            pageSize: this.state.pageSize,
            pageNum: this.state.page
        }
        getShieldList(params).then(res => {
            console.log("getShieldList",res)
            this.setState({
                lists: res.data.programs,
                total:res.data.totalPage
            })
        })
    }
    delShieldList(val) {   // 删除
        Modal.confirm({
            title: `执行删除操作后，该专题和该专题下对应的信息都会被删除。是否确认删除？`,
            content: '确认删除？',
            onOk: () => {
                let params={
                    name:val.name,
                    programId:val.programId
                }
                delShieldList(params).then(res => {
                    message.success("操作成功")
                    this.getShieldList()
                })
            },
            onCancel: () => {
            }
        })
    }
    submitForm(obj){
        console.log(obj);
    }
    getUploadFileUrl(fill){   // 图片上传
        console.log(fill)
        this.formRef.current.setFieldsValue({ "picUrl": fill });
        this.setState({
            picUrl:fill
        })
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
        let {page,pageSize,total,}=this.state
        return (
            <div>
                <Card title={
                    <div className="cardTitle">
                        <div className="everyBody">
                            <Input.Search allowClear placeholder="请输入节目名" onSearch={(val)=>{
                                if(val){
                                    this.state.screen.name = val
                                }else{
                                    delete this.state.screen.name
                                }
                                this.getRecords(1)
                            }} />
                        </div>
                        <div className='everyBody'>
                            <Select allowClear  placeholder="类型"
                                onChange={(val)=>{
                                    console.log(val)
                                    if(val){
                                        this.state.screen.type = Number(val)
                                    }else{
                                        delete this.state.screen.type
                                    }
                                    this.forceUpdate();
                                    this.getRecords(1)
                                }}
                            >
                                {
                                this.state.activityType.map(r=>{
                                    return(
                                    <Option value={r.id} key={r.id}>{r.name}</Option>
                                    )
                                })
                                }
                            </Select>
                        </div>
                        <div className="everyBody">
                            <Select allowClear  placeholder="分类"
                            onChange={(val)=>{
                                if(val){
                                    this.state.screen.cateGray = Number(val)
                                }else{
                                    delete this.state.screen.cateGray
                                }
                                this.getRecords(1)
                            }}
                            >
                            {
                                this.state.optionList.map(r=>{
                                    return(
                                        <Option value={r.id} key={r.id}>{r.name}</Option>
                                    )
                                })
                            }
                            </Select>
                        </div>
                        <div className="everyBody">
                            <Select allowClear  placeholder="是否屏蔽" 
                                onChange={(val)=>{
                                    if(val){
                                        this.state.screen.hide = Number(val)
                                    }else{
                                        delete this.state.screen.hide
                                    }
                                    this.getRecords(1)
                                }}
                            >
                                <Option value={1} key={1}>已屏蔽</Option>
                                <Option value={2} key={2}>未屏蔽</Option>
                            </Select>
                        </div>
                        <div className='everyBody'>
                            <Button type="primary" onClick={()=>{this.getRecords(1)}}>搜索</Button>
                        </div>
                  </div>
                }
                extra={
                    <div>
                        <Button type="primary"
                            // loading={this.state.btnLoading}
                            // onClick={() => {
                            //     this.syncChannelNew()
                            // }}
                        >同步缓存</Button>
                    </div>
                }>
                    <Table
                        dataSource={this.state.lists}
                        loading={this.state.loading}
                        columns={this.state.columns} 
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: total,
                            onChange: this.changeSize
                        }}
                        />
                    <Modal visible={this.state.isOpenModal} title="节目单管理" onCancel={() => {this.setState({isOpenModal:false})}} footer={null} width={740}>
                        {
                            <Form name="projectForm" ref = {this.formRef} onFinish={this.submitForm.bind(this)}>
                                <Form.Item label="节目名" name="name" rules={[{ required: true, message: '请填写节目名' }]}>
                                    <Input className='base-input-wrapper' placeholder="请填写节目名称" />
                                </Form.Item> 
                                <Form.Item label="节目类别" name="type" rules={[{ required: true,message: '请选择节目类别'}]}>
                                    <Radio.Group
                                        onChange={(e) => {
                                            console.log(e)
                                            this.formRef.current.setFieldsValue("type",e.target.value);
                                            this.forceUpdate()
                                        }}
                                    >
                                        <Radio value={1}>电视剧</Radio>
                                        <Radio value={2}>电影</Radio>
                                        <Radio value={3}>综艺</Radio>
                                        <Radio value={4}>无</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="具体类别">
                                    <Checkbox.Group options={this.state.optionList} defaultValue={this.state.checkedOptionList} onChange={(e) => {
                                        console.log(e)
                                        // this.setState({
                                        //     checkedItem: e
                                        // })
                                    }} />
                                </Form.Item> 
                                <Form.Item label="主演" name="zhuyan">
                                    <Input className='base-input-wrapper' placeholder="主演" />
                                </Form.Item> 
                                <Form.Item label="导演" name="daoyan">
                                    <Input className='base-input-wrapper' placeholder="导演" />
                                </Form.Item> 
                                <Form.Item label="编剧" name="bianju">
                                    <Input className='base-input-wrapper' placeholder="编剧" />
                                </Form.Item> 
                                <Form.Item label="地区" name="area">
                                    <Input className='base-input-wrapper' placeholder="地区" />
                                </Form.Item> 
                                <Form.Item label="剧情介绍" name="projectInfo">
                                    <TextArea className='base-input-wrapper' placeholder="剧情介绍" />
                                </Form.Item> 
                                <Form.Item label="节目封面" name="imgUrl" valuePropName="fileList" getValueFromEvent={normFile} >
                                    <MyImageUpload
                                    getUploadFileUrl={(file) => { this.getUploadFileUrl('imgUrl', file) }}
                                    imageUrl={this.formRef.current && this.formRef.current.getFieldValue("imgUrl")} />
                                </Form.Item>
                                <div className='flex-row-items2'>
                                    <Form.Item label="是否屏蔽" name="type" rules={[{ required: true,message: '请选择是否屏蔽'}]} style={{marginRight:"40px"}}>
                                        <Select className="base-input-wrapper3" placeholder="请选择" dropdownMatchSelectWidth={true} 
                                        onChange={(val)=>{
                                            console.log(val);
                                            this.forceUpdate();
                                        }}
                                        allowClear>
                                            <Option value={1} key={1}>已屏蔽</Option>
                                            <Option value={2} key={2}>未屏蔽</Option>
                                        </Select>
                                    </Form.Item>
                                    {
                                        this.formRef.current && this.formRef.current.getFieldValue("type") &&
                                        this.formRef.current.getFieldValue("type") == 1 &&
                                        <Form.Item label="关联标签" name="tag" >
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
                                    <Button style={{ margin: "0 20px" }} onClick={()=>{this.setState({isOpenModal:false})}}>取消</Button>
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