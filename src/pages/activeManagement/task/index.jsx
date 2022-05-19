// 活动管理-任务配置
import React, { useState, useEffect, useReducer } from 'react'
import { taskList,boatrewards,taskAdd,taskEdit,taskDelete ,activitySync} from 'api'
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
  const [currentItem, setCurrent] = useState({})
  const [formRef] = Form.useForm()
  const [virList,setvirList]=useState([])  // 任务列表
  const [openDailog, setOpen] = useState(false)  // 新增、编辑的弹框
  const [source, setSource] = useState("")   //  add / edit
  const columns = [
    {title: "任务标题",dataIndex: "title",key: "title",},
    {
        title: "任务类型",dataIndex: "taskType", key: "taskType",
        render: (rowValue, row, index) => {
          return (
            <div>{rowValue==1?"每日":"一次性"}</div>
          )
        }
      },
    {title: "引导图",dataIndex: "guideImage",key: "guideImage",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
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
                let arr = JSON.parse(JSON.stringify(row))
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" onClick={() => {
                Modal.confirm({
                    title: `确认删除该条数据吗？`,
                    onOk: () => {
                      taskDelete({ id: row.id }).then(res => {
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

  useEffect(() => {//列表
    const fetchData=async ()=>{
      let res=await taskList({})
      console.log("taskList",res)
      setvirList(res.data.data)
    }
    fetchData();
  }, [forceUpdateId])

const submitForm=(obj)=>{
    console.log("submitForm---",obj)
    if (source == "add"){
      let params = {
        ...obj
      }
      taskAdd(params).then(res=>{
        message.success("新增成功")
        setOpen(false);
        setSource("")
        formRef.resetFields()
        forceUpdate()
      })
    }else if (source == "edit"){
      let params = {
        ...formRef.getFieldValue(),
        ...obj,
        id:currentItem.id
      }
      console.log("编辑商品  params",params)
      taskEdit(params).then(res=>{
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
              <Form.Item label="任务标题" name="title" rules={[{ required: true, message: '请输入任务标题' }]}>
                <Input placeholder="请输入任务标题" />
              </Form.Item>
              <Form.Item label="任务编码" name="code" rules={[{ required: true, message: '请输入任务编码' }]}>
                <Input placeholder="请输入任务编码" />
              </Form.Item>

                <Form.Item label="任务类型" name="taskType" rules={[{ required: true}]}>
                    <Radio.Group
                        onChange={(e)=>{
                            console.log("任务类型",e)
                            formRef.setFieldsValue({ taskType: e.target.value })
                            forceUpdatePages()
                        }}
                    >
                        <Radio value={1}>每日</Radio>
                        <Radio value={2}>一次性</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="任务引导图" name="guideImage">
                    <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('guideImage', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('guideImage')} />
                </Form.Item>


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