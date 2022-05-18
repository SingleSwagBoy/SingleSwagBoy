// 活动管理-任务配置
import React, { useState, useEffect, useReducer } from 'react'
import { couponConfigList,couponConfigAdd,couponConfigEdit,couponConfigDel,requestProductSkuList,couponConfigSync } from 'api'
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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [virList,setvirList]=useState([])  // 任务列表
  const [productList,setproductList]=useState([])   // 套餐列表
  const [currentItem, setCurrent] = useState({})
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
    {title: "id",dataIndex: "id",key: "id",},
    {title: "优惠券标题",dataIndex: "name",key: "name",},
    {
        title: '有效时间', dataIndex: 'timeType', key: 'timeType', width: 300,
        render: (rowValue, row, index) => {
            return (
                <div>
                    
                    {
                        rowValue==1 &&
                        <span>领取后{row.expireDays}天</span> ||
                        <span>{row.startTime ? util.formatTime(row.startTime, ".", "") : "未配置"}-{row.endTime ? util.formatTime(row.endTime, ".", "") : "未配置"}</span>
                    }
                </div>
            )
        }
    },
    {
        title: "优惠金额",dataIndex: "deductType", key: "deductType",
        render: (rowValue, row, index) => {
          return (
            <div>
                {
                    rowValue==1 &&
                    <span>折扣-{row.deductNum/10}折</span> ||
                    <span>直减-减{row.deductNum/100}元</span>
                }
            </div>
          )
        }
    },
    {title: "支持套餐",dataIndex: "range",key: "range",
      render: (rowValue, row, index) => {
        return (
            <div>
                {
                    rowValue==1 &&
                    <span>全部套餐</span> ||
                    <span>{getGroupNmae(row.pcode)}</span>
                }
            </div>
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
                if(obj.startTime==0 && obj.endTime==0){
                    obj.time = ["", ""]
                }else{
                    obj.time = [moment(obj.startTime*1000), moment(obj.endTime*1000)]
                }
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
                        couponConfigDel({ id: row.id }).then(res => {
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
    }
    fetchData();
  },[])

  useEffect(() => {//列表
    const fetchData=async ()=>{
        let res=await couponConfigList({ currentPage: 1, pageSize: 50 })
        console.log("res",res)
        setvirList(res.data)
        setTotal(res.page.totalCount)
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
    if (source == "add") {   //新增商品
        
        if(obj.timeType==2){
            obj.startTime= (obj.time && obj.time[0]) ? parseInt(obj.time[0].valueOf()/1000) : 0
            obj.endTime= (obj.time && obj.time[1]) ? parseInt(obj.time[1].valueOf()/1000) : 0
        }
        let params = {
            ...obj
        }
        console.log("assd    params",params)
        couponConfigAdd(params).then(res=>{
            message.success("新增成功")
            setOpen(false);
            setSource("")
            formRef.resetFields()
            forceUpdate()
        })
    }else if (source == "edit") {   // 编辑商品
        if(obj.timeType==2){
            obj.startTime= (obj.time && obj.time[0]) ? parseInt(obj.time[0].valueOf()/1000) : 0
            obj.endTime= (obj.time && obj.time[1]) ? parseInt(obj.time[1].valueOf()/1000) : 0
        }
        let params = {
            ...formRef.getFieldValue(),
            ...obj,
            id:currentItem.id
        }
        console.log("编辑商品  params",params)
        couponConfigEdit(params).then(res=>{
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
                couponConfigSync({}).then(res=>{
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
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total
          }}
        />

        {/* 新增/编辑的弹框 */}
        <Modal title={source=='add'?"新增":source=='edit'?"编辑":""} centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout} name="taskForm" form={formRef} onFinish={(e) => submitForm(e)}>
              <Form.Item label="优惠券标题" name="name" rules={[{ required: true, message: '请输入优惠券标题' }]}>
                <Input placeholder="请输入优惠券标题" />
              </Form.Item>
              <Form.Item label="优惠类型" name="deductType" rules={[{ required: true, message: '请选择优惠类型' }]}>
                  <Radio.Group
                    onChange={(e)=>{
                        console.log("优惠类型",e)
                        formRef.setFieldsValue({ deductType: e.target.value })
                        forceUpdatePages()
                    }}
                  >
                    <Radio value={1}>折扣</Radio>
                    <Radio value={2}>直减</Radio>
                  </Radio.Group>
                </Form.Item>
                {
                    formRef.getFieldValue("deductType") == 1 &&
                    <Form.Item className='per-position' label="折扣百分比" name="deductNum" rules={[{ required: true, message: '请输入折扣数' }]}>
                        <InputNumber min={10} placeholder="(实际价格=原价*xx%)" max={90} step={5}/>
                    </Form.Item> ||
                    formRef.getFieldValue("deductType") == 2 &&
                    <Form.Item label="直减" name="deductNum" rules={[{ required: true, message: '请输入直减金额' }]}>
                        <InputNumber style={{width:'200px'}} min={0} placeholder="直减金额(分)" step={10}/>
                    </Form.Item> 
                }
                <Form.Item label="时间类型" name="timeType" rules={[{ required: true}]}>
                    <Radio.Group
                        onChange={(e)=>{
                            console.log("时间类型",e)
                            formRef.setFieldsValue({ timeType: e.target.value })
                            forceUpdatePages()
                        }}
                    >
                        <Radio value={1}>领取后N天</Radio>
                        <Radio value={2}>时间段</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    formRef.getFieldValue("timeType") == 1 &&
                    <Form.Item label="过期天数" name="expireDays" rules={[{ required: true, message: '请输入过期天数' }]}>
                        <InputNumber min={1} placeholder="N" />
                    </Form.Item> ||
                    formRef.getFieldValue("timeType") == 2 &&
                    <Form.Item label="上下线时间" name='time'>
                        <RangePicker format={'YYYY-MM-DD HH:mm'} className="base-input-wrapper" showTime placeholder={['开始时间', '过期时间']} />
                    </Form.Item>
                }
                <Form.Item label="支持套餐" name="range" rules={[{ required: true}]}>
                    <Radio.Group
                        onChange={(e)=>{
                            console.log("时间类型",e)
                            formRef.setFieldsValue({ range: e.target.value })
                            forceUpdatePages()
                        }}
                    >
                        <Radio value={1}>全部套餐</Radio>
                        <Radio value={2}>组合套餐</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    formRef.getFieldValue("range") == 2 &&
                    <Form.Item label="选择套餐">
                        <Form.List name="products">
                        {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <>
                                            <div style={{ display: "flex" }}>
                                                <Space key={field.key} align="baseline" style={{ flexWrap: "wrap" }}>
                                                    <Form.Item {...field} name={[field.name,'skuCode']} rules={[{ required: true,message: '请选择套餐'}]} fieldKey={[field.fieldKey, 'skuCode']}>
                                                        <Select allowClear showSearch placeholder="请选择套餐" onChange={(e)=>{
                                                            console.log("e 请选择套餐 e",e)
                                                        }} style={{width:"200px"}} {...selectProps}>
                                                            {
                                                                productList.map((r, i) => {
                                                                    return <Option value={r.skuCode} key={r.id}>{r.name}---{r.skuCode}</Option>
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
                                            新增套餐
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