// 活动管理-任务配置
import React, { useState, useEffect, useReducer } from 'react'
import {boatrewards,activityList,taskList,activityAdd,activityEdit,activityDelete,activitySync, requestProductSkuList } from 'api'
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
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 20 } }
  const tailLayout = { wrapperCol: { offset: 15, span: 40 } }
  const [formRef] = Form.useForm()
  const [virList,setvirList]=useState([])  // 任务列表
  const [productList,setproductList]=useState([])   // 套餐列表
  const [currentItem, setCurrent] = useState({})
  const [rewardList,setrewardList]=useState([])
  const [taskLists,settaskLists]=useState([])
  const selectProps = {
    optionFilterProp: "children",
    filterOption(input, option) {
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
    },
    showSearch() {
        console.log('onSearch')
    }
  }

  const [openDailog, setOpen] = useState(false)  // 新增、编辑的弹框
  const [source, setSource] = useState("")   //  add / edit
  const columns = [
    {title: "活动id",dataIndex: "id",key: "id",},
    {title: "活动标题",dataIndex: "name",key: "name",},
    {
        title: '活动时间', dataIndex: 'start', key: 'start', width: 300,
        render: (rowValue, row, index) => {
            return (
                <div>
                    <span>{row.start ? util.formatTime(row.start, ".", "") : "未配置"}-{row.end ? util.formatTime(row.end, ".", "") : "未配置"}</span>
                </div>
            )
        }
    },
    {
        title: '背景图', dataIndex: 'background', key: 'background', width: 150,
        render: (rowValue, row, index) => {
            return (<Image width={50} src={rowValue} />)
        }
    },
    {
        title: '状态', dataIndex: 'status', key: 'status', width: 150,
        render: (rowValue, row, index) => {
            return (
                <span>{rowValue==1?"未开始":rowValue==2?"活动中":rowValue==3?"已结束":""}</span>
            )
        }
    },
    {title: "操作",key: "action",fixed: 'right', width: 150,
      render: (rowValue, row, index) => {
        return (
          <div>
            {/* <Button size="small" onClick={() => copyOfflineProgramFuc(row)}>复制</Button> */}
            <Button
              style={{ margin: " 0 10px" }}
              size="small"
              type="primary"
              onClick={() => {
                console.log(row)
                let obj = JSON.parse(JSON.stringify(row))
                if(obj.start==0 && obj.end==0){
                    obj.time = ["", ""]
                }else{
                    obj.time = [moment(obj.start*1000), moment(obj.end*1000)]
                }
                if(obj.progressRewards.length>0){
                    let arr=obj.progressRewards.filter(item=>item.percent==100)
                    console.log("arrarrarr",arr)
                    if(arr.length>0){
                        obj.oneHundred=arr[0].rewardType;
                        if(arr[0].rewardType==1){  // 1. 固定奖励 2 抽奖
                            obj.hundredrewardId=arr[0].rewardId
                        }else if(arr[0].rewardType==2){
                            obj.hundredFift=arr[0].turntableId
                        }
                    }
                    obj.progressRewards=obj.progressRewards.filter(item=>item.percent!=100)
                }
                console.log("hundredrewardId  obj",obj)
                console.log("rewardList-----rewardList",rewardList)
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(obj)
                setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" onClick={() => {
                Modal.confirm({
                    title: `确认删除该条数据吗？`,
                    onOk: () => {
                        activityDelete({ id: row.id }).then(res => {
                            message.success("删除成功")
                            forceUpdate()
                        })
                    },
                    onCancel: () => {
                    }
                })
            }}>删除</Button>
          </div>
        )
      }
    }
  ]
  useEffect(()=>{
    const fetchData=async ()=>{
        let params={
            page: { isPage: 9 },
            productCategoryType: 10
        }
        let res=await requestProductSkuList(params)
        console.log("获取套餐列表",res);
        setproductList(res.data.data)

        let _goods=await boatrewards({})
        console.log("_goods",_goods);
        setrewardList(_goods.data.data)
    }
    fetchData();
  },[])

  useEffect(()=>{
    const fetchData=async ()=>{
        let res=await taskList({})
        console.log("settaskLists",res);
        settaskLists(res.data.data)
    }
    fetchData();
  },[])

  useEffect(() => {//列表
    const fetchData=async ()=>{
        let res=await activityList({})
        console.log("res",res)
        setvirList(res.data.data)
    }
    fetchData();
  }, [forceUpdateId])
  const getGroupNmae=(_name)=>{
    //console.log("name_name",_name)
    if(productList.length<=0){
        return
    }else{
        if(_name){
            let _names=_name.split(",")
            //console.log("_names",_names)
            let _nameText=""
            if(_names){
                for(let i=0;i<productList.length;i++){
                    for(let j=0;j<_names.length;j++){
                        if(productList[i].skuCode==_names[j]){
                            _nameText+=productList[i].name+"、"
                        }
                    }
                }
            }
            return _nameText || _name
        }
    }
  }

const submitForm=(obj)=>{
    console.log("submitForm---",obj)
    if(obj.tasks){
        console.log("obj.tasks")
        obj.tasks=obj.tasks.map((item,index)=>{
            console.log("obj.tasks rewardId*1")
            item.rewardId=item.rewardId*1;
            return item
        })
    }
    if(obj.progressRewards){
        obj.progressRewards=obj.progressRewards.map((item,index)=>{
            item.rewardId=item.rewardId*1;
            if(item.percent!=100){
                console.log("budengyu    100")
                item.rewardType=1
            }
            return item
        })
    }
    console.log("obj.progressRewards",obj.progressRewards)
    if(obj.time){
        obj.start= (obj.time && obj.time[0]) ? parseInt(obj.time[0].valueOf()/1000) : 0
        obj.end= (obj.time && obj.time[1]) ? parseInt(obj.time[1].valueOf()/1000) : 0
    }else{
        obj.start=0;
        obj.end=0;
    }
    if (source == "add") {   //新增商品
        let _hun={
        }
        _hun.percent=100;
        _hun.rewardType=obj.oneHundred;
        if(obj.oneHundred==1){   // 1. 固定奖励 2 抽奖
            _hun.rewardId=obj.hundredrewardId*1
        }else if(obj.oneHundred==2){
            _hun.turntableId=obj.hundredFift
        }
        console.log("_hun_hun_hun",_hun)
        if(obj.progressRewards){
            obj.progressRewards.push(_hun)
        }else{
            obj.progressRewards=[_hun]
        }

        let params = {
            ...obj
        }
        console.log("assd    params",params)
        //return
        activityAdd(params).then(res=>{
            message.success("新增成功")
            setOpen(false);
            setSource("")
            formRef.resetFields()
            forceUpdate()
        })
    }else if (source == "edit") {   // 编辑商品
        let _hun={
        }
        _hun.percent=100;
        _hun.rewardType=obj.oneHundred;
        if(obj.oneHundred==1){   // 1. 固定奖励 2 抽奖
            _hun.rewardId=obj.hundredrewardId*1
        }else if(obj.oneHundred==2){
            _hun.turntableId=obj.hundredFift
        }
        console.log("_hun_hun_hun----edit",_hun)
        if(obj.progressRewards){
            obj.progressRewards.push(_hun)
        }else{
            obj.progressRewards=[_hun]
        }
        let params = {
            ...formRef.getFieldValue(),
            ...obj,
            id:currentItem.id
        }
        delete params.time
        delete params.hundredFift
        delete params.hundredrewardId
        console.log("编辑商品  params",params)
        //return
        activityEdit(params).then(res=>{
            message.success("编辑成功")
            setOpen(false);
            setSource("")
            formRef.resetFields()
            forceUpdate()
        })
    }

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
const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
}


  return (
    <div className="loginVip">
      <Card title={
        <div>
            
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新增</Button>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{
                activitySync({}).then(res=>{
                    message.success("同步成功")
                })
            }}>同步缓存</Button>
          </div>
        }
      >
          <Table
          dataSource={virList}
          rowKey={item => item.id}
          columns={columns}
        />

        {/* 新增/编辑的弹框 */}
        <Modal title={source=='add'?"新增":source=='edit'?"编辑":""} centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout} name="taskForm" form={formRef} onFinish={(e) => submitForm(e)}>
                <Form.Item label="活动标题" name="name" rules={[{ required: true, message: '请输入活动标题' }]}>
                    <Input placeholder="请输入活动标题" />
                </Form.Item>
                <Form.Item label="活动时间" name='time'>
                    <RangePicker format={'YYYY-MM-DD HH:mm'} className="base-input-wrapper" showTime placeholder={['开始时间', '过期时间']} />
                </Form.Item>
                <Form.Item label="背景图" name="background">
                    <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('background', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('background')} />
                </Form.Item>
                <Form.Item label="活动总分值" name="totalScore" rules={[{ required: true, message: '请输入活动总分值' }]}>
                    <InputNumber min={100} step={10} />
                </Form.Item> 
                <Space className='my-space' align="baseline" style={{ flexWrap: "wrap" }}>
                    <Form.Item label="100%进度奖励" name="oneHundred" rules={[{ required: true, message: '请选择优惠类型' }]}>
                        <Radio.Group
                            onChange={(e)=>{
                                console.log("优惠类型",e)
                                formRef.setFieldsValue({ oneHundred: e.target.value })
                                forceUpdatePages()
                            }}
                        >
                            <Radio value={1}>固定奖励</Radio>
                            <Radio value={2}>抽奖</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        formRef.getFieldValue("oneHundred") == 2 && 
                        <Form.Item className='space-rigjht' label="抽奖活动id" name="hundredFift" rules={[{ required: true}]}>
                            <InputNumber placeholder="抽奖活动id" />
                        </Form.Item> || 
                        formRef.getFieldValue("oneHundred") == 1 && 
                        <Form.Item className='space-rigjht' label="商品列表"  name="hundredrewardId">
                            <Select allowClear showSearch placeholder="请选择" onChange={(e)=>{
                                console.log("e 请选择套餐 e",e)
                            }}  {...selectProps}> 
                                {
                                    rewardList.map((item, i) => {
                                        return <Option value={item.rewardId} key={i}>{item.name}-{item.rewardId}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                </Space>
                {
                    <Form.Item label="进度">
                        <Form.List name="progressRewards">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <>
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>
                                            <Space key={field.key} align="baseline" style={{ flexWrap: "wrap" }}>
                                                <Form.Item label="进度%" {...field} name={[field.name,'percent']} fieldKey={[field.fieldKey, 'percent']}>
                                                    <InputNumber min={0} step={10} />
                                                </Form.Item>
                                                <Form.Item label="奖励" {...field} name={[field.name,'rewardId']} fieldKey={[field.fieldKey, 'rewardId']}>
                                                    <Select allowClear showSearch placeholder="请选择" onChange={(e)=>{
                                                        console.log("e 请选择 e",e)
                                                    }} style={{width:"200px"}} {...selectProps}>
                                                        {
                                                            rewardList.map((r, i) => {
                                                                return <Option value={r.rewardId} key={i}>{r.name}---{r.rewardId}</Option>
                                                            })
                                                        }

                                                    </Select>
                                                </Form.Item>
                                            </Space>
                                            <div>
                                                <Button danger onClick={() => remove(field.name)} block icon={<MinusCircleOutlined />}>
                                                    删除
                                                </Button>
                                            </div>
                                        </div>
                                    </>


                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加进度奖励
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                        </Form.List>
                    </Form.Item>
                }
                <Form.Item label="活动规则" name="rule" rules={[{ required: true, message: '请输入活动规则' }]}>
                    <TextArea rows={6} placeholder="这里填写活动规则" />
                </Form.Item> 

                {
                    <Form.Item label="任务">
                        <Form.List name="tasks">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <>
                                    <Divider></Divider>
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>
                                            <Space key={field.key} align="baseline" style={{ flexWrap: "wrap" }}>
                                                <Form.Item label="排序" {...field} name={[field.name,'sort']} fieldKey={[field.fieldKey, 'sort']}>
                                                    <InputNumber  />
                                                </Form.Item>
                                                <Form.Item {...field} name={[field.name,'taskId']} fieldKey={[field.fieldKey, 'taskId']}>
                                                    <Select allowClear showSearch placeholder="请选择任务" onChange={(e)=>{
                                                        console.log("e 请选择 e",e)
                                                    }} style={{width:"200px"}} {...selectProps}>
                                                        {
                                                            taskLists.map((r, i) => {
                                                                return <Option value={r.id} key={i}>{r.title}---{r.id}</Option>
                                                            })
                                                        }

                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="任务标题" {...field} name={[field.name,'taskName']} fieldKey={[field.fieldKey, 'taskName']} rules={[{ required: true}]}>
                                                    <Input placeholder="请输入活动标题" />
                                                </Form.Item>
                                                <Form.Item label="积分" {...field} name={[field.name,'score']} fieldKey={[field.fieldKey, 'score']} rules={[{ required: true}]}>
                                                    <InputNumber placeholder='%' min={0}  />
                                                </Form.Item>
                                                <Form.Item label="奖励" {...field} name={[field.name,'rewardId']} fieldKey={[field.fieldKey, 'rewardId']}>
                                                    <Select allowClear showSearch placeholder="请选择" onChange={(e)=>{
                                                        console.log("e 请选择 e",e)
                                                    }} style={{width:"200px"}} {...selectProps}>
                                                        {
                                                            rewardList.map((r, i) => {
                                                                return <Option value={r.rewardId} key={i}>{r.name}---{r.rewardId}</Option>
                                                            })
                                                        }

                                                    </Select>
                                                </Form.Item>
                                            </Space>
                                            <div>
                                                <Button danger onClick={() => remove(field.name)} block icon={<MinusCircleOutlined />}>
                                                    删除
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加任务
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                        </Form.List>
                    </Form.Item>
                }

              <Form.Item {...tailLayout}>
                <Button onClick={() => closeDialog()}>取消</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          }
        </Modal>

          
      </Card >
    </div >
  )
}

export default App2