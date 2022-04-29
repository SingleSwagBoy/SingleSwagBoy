import React, { useState, useEffect, useReducer } from 'react'
import { signCalendarList,signCalendarSave,signCalendarClear,signCalendarSync } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker , Space,Divider,Calendar,Badge } from 'antd'

import { Link } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./index.css"
import locale from 'antd/lib/calendar/locale/zh_CN.js'
import 'moment/locale/zh-cn';

const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};
const { TextArea } = Input;
const { RangePicker } = DatePicker;
let activityIndex=null;



function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdateCateId, forceUpdateCate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const tailLayout = { wrapperCol: { offset: 15, span: 40 } }
  const [formRef] = Form.useForm()
  const [today,settoday]=useState("")  // 当前选中的日期
  const [nowDate,setnowDate]=useState("")  // 当前选中的日期

  const [virList,setvirList]=useState([])  // 商品列表
  const [locales,setlocales]=useState({
    lang: {
        month: '月',
        year: '年',
    },
  })
  const [curMonth,setcurMonth]=useState("")

  const getListData=(value)=> {
    let listData;
    let _time=new Date(value);
    var date1 = time(_time);
    //console.log("date1,",date1)
    let _list=JSON.parse(JSON.stringify(virList))
    for(let i=0;i<_list.length;i++){
        if(_list[i].day==date1){
            listData=_list[i].title
        }
    }
    return listData || "";
  }
  

  const dateCellRender=(value)=> {
    const listData = getListData(value);
    return (
      <div>{listData}</div>
    );
  }

  const getMonthData=(value)=> {
    if (value.month() === 8) {
      return 1394;
    }
  }
  
  const monthCellRender=(value)=> {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }
  const time=(date)=> {
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    var h = date.getHours()
    h = h < 10 ? '0' + h : h
    var minute = date.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    var second = date.getSeconds()
    second = second < 10 ? '0' + second : second
    //return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    return y +  m +  d 
}

  useEffect(() => {//列表
    const _today_=moment().format('YYYY-MM-DD');
    settoday(_today_);
    setnowDate(_today_);
    console.log("_today_-------",_today_)
    const _month=_today_.split("-").join("").slice(0,6)
    console.log(_month)
    setcurMonth(_month)
    
    const fetchData = async () => {
        const res = await signCalendarList({month:curMonth})
        console.log("list-----",res)
        if(res.data.errCode==0){
            console.log(1234567)
            setvirList(res.data.data)
            if(res.data.data.length>0){
                let _list=JSON.parse(JSON.stringify(res.data.data))
                let _arr=[]
                _arr=_list.filter(item=>item.day==_today_.split("-").join(""))
                if(_arr.length>0){
                    
                    formRef.setFieldsValue(_arr[0])
                }else{
                    console.log("222222222")
                    let obj={
                        title:"",
                        type:1,
                        content:""
                    }
                    //formRef.resetFields()
                    formRef.setFieldsValue(obj);
                    forceUpdatePages();
                }
            }
        }
    }
    fetchData()
}, [])
useEffect(() => {
    const _today_=today;
    const fetchData = async () => {
        const res = await signCalendarList({month:curMonth})
        console.log("list-----",res)
        if(res.data.errCode==0){
            console.log(1234567)
            setvirList(res.data.data)
            if(res.data.data.length>0){
                let _list=JSON.parse(JSON.stringify(res.data.data))
                let _arr=[]
                _arr=_list.filter(item=>item.day==_today_.split("-").join(""))
                if(_arr.length>0){
                    console.log("-------")
                    
                    formRef.setFieldsValue(_arr[0])
                    forceUpdatePages();
                }else{
                    console.log("222222222")
                    let obj={
                        title:"",
                        type:1,
                        content:""
                    }
                    //formRef.resetFields()
                    formRef.setFieldsValue(obj);
                    forceUpdatePages();
                }
            }
        }
    }
    fetchData()
},[forceUpdateId,curMonth])
const submitForm=(obj)=>{
    console.log("submitForm---",obj)
    let _today=today.split("-").join("");
    let params={
        ...obj,
        day:parseInt(_today)
    }
    signCalendarSave(params).then(res=>{
        message.success("保存成功")
        forceUpdate();
    })
}
//获取上传文件图片地址 
const getUploadFileImageUrlByType = (type) => {
    let image_url = formRef.getFieldValue(type);
    return image_url ? image_url : '';
}
//获取上传文件
const getUploadFileUrl = (type, file, newItem) => {
    let image_url = newItem.fileUrl;
    let obj = {};
    obj[type] = image_url;
    formRef.setFieldsValue(obj);
    forceUpdatePages()
}
const clearDay=()=>{   // 清空当天内容
    let _today=today.split("-").join("");
    console.log("清空当天清空当天:",_today);
    signCalendarClear({day:parseInt(_today)}).then(res=>{
        formRef.resetFields()
        let obj={
            title:"",
            type:1,
            content:""
        }
        formRef.setFieldsValue(obj);
        forceUpdatePages();
        forceUpdate();
        message.success("清除完成")
    })
}

const changePannel=(e,mode)=>{
    console.log("changePannel",e,mode)
    let _time=new Date(e);
    var date2 = time(_time);
    console.log("当前的月份是",date2)
    setcurMonth(date2.slice(0,6))
}
const changeSelect=(e)=>{
    console.log("changeSelect",e)
    let _time=new Date(e);
    var date3 = time(_time);
    console.log("当前的日期是",date3.slice(0,4)+"-"+date3.slice(4,6)+"-"+date3.slice(6,8))
    let _tt=new Date(nowDate).getTime();
    let _curt=new Date(date3.slice(0,4)+"-"+date3.slice(4,6)+"-"+date3.slice(6,8)).getTime();
    console.log("_tt:",_tt,"_curt",_curt)
    if(_tt>_curt){
        message.error("不能编辑过期的日期");
        return
    }
    settoday(date3.slice(0,4)+"-"+date3.slice(4,6)+"-"+date3.slice(6,8))
    if(virList.length==0){
        console.log("111111111")
        formRef.resetFields()
        let obj={
            title:"",
            type:1,
            content:""
        }
        formRef.setFieldsValue(obj);
        forceUpdatePages();
    }else{
        console.log("2222222222")
        setTimeout(()=>{
            let _arr=[]
            _arr=virList.filter(item=>item.day==date3);
            if(_arr.length>0){
                console.log("333333333")
                formRef.resetFields()
                formRef.setFieldsValue(_arr[0]);
                forceUpdatePages();
            }else{
                formRef.resetFields()
                let obj={
                    title:"",
                    type:1,
                    content:""
                }
                formRef.setFieldsValue(obj);
                forceUpdatePages();
            }
        },300)
    }
    
}
const asyncBtn=()=>{   // 同步缓存
    let params={
        month:parseInt(curMonth)
    }
    signCalendarSync(params).then(res=>{
        message.success("同步成功")
    })
}

  return (
    <div className="loginVip">
      <Card title={
        <div>
        </div>
      }
        extra={
          <div>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>asyncBtn()}>同步缓存</Button>
          </div>
        }
      >
          <div className='content-wwrap flex-col-between'>
            <div className='date-wrapp'>
                <Calendar 
                locale={locales} 
                dateCellRender={dateCellRender} 
                monthCellRender={monthCellRender} 
                //onChange={(e)=>changeDate(e)}
                onPanelChange={(e,mode)=>changePannel(e,mode)}
                onSelect={(e)=>changeSelect(e)}
                />
            </div>
            <div className='date-my-form'>
                <div className='date-my-form-title'>{today}</div>
                <Form {...layout} name="taskForm" form={formRef} onFinish={(e) => submitForm(e)}>
                    <Form.Item label="热点标题" name="title" rules={[{ required: true, message: '请输入热点标题' }]}>
                        <Input placeholder="请输入热点标题" />
                    </Form.Item>
                    <Form.Item label="热点类型" name="type" rules={[{ required: true, message: '请选择热点热点类型' }]}>
                        <Radio.Group initialValues={1}
                            onChange={(e)=>{
                                console.log("type",e)
                                formRef.setFieldsValue({ type: e.target.value })
                                forceUpdatePages()
                            }}
                        >
                            <Radio value={1}>文字</Radio>
                            <Radio value={2}>图片</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        formRef.getFieldValue("type") == 1 &&
                        <Form.Item label="热点内容" name="content" rules={[{ required: true, message: '请填写热点内容' }]}>
                            <TextArea rows={6} placeholder="这里填写热点内容" />
                        </Form.Item> ||
                        formRef.getFieldValue("type") == 2 &&
                        <Form.Item label="热点内容" name="content" rules={[{ required: true, message: '请输入商品封面' }]}>
                            <MyImageUpload
                            getUploadFileUrl={(file, newItem) => { getUploadFileUrl('content', file, newItem) }}
                            imageUrl={getUploadFileImageUrlByType('content')} />
                        </Form.Item>
                    }
                    <Form.Item {...tailLayout}>
                        <Button onClick={() => clearDay()}>清空</Button>
                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>确定</Button>
                    </Form.Item>
                </Form>
            </div>
          </div>
          
      </Card >
    </div >
  )
}

export default App2