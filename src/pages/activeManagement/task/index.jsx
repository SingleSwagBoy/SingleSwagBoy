// 活动管理-任务配置
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
  const [virList,setvirList]=useState([])  // 任务列表
  const columns = [
    {title: "任务标题",dataIndex: "name",key: "name",},
    {
        title: "任务类型",dataIndex: "goodsType", key: "goodsType",
        render: (rowValue, row, index) => {
          return (
            <div>{rowValue==1?"一次性":"每日"}</div>
          )
        }
      },
    {title: "引导图",dataIndex: "cover",key: "cover",
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
                // let arr = JSON.parse(JSON.stringify(row))
                // setCurrent(row)
                // setOpen(true)
                // formRef.setFieldsValue(arr)
                // setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" onClick={() => {
                Modal.confirm({
                    title: `确认删除该条数据吗？`,
                    onOk: () => {
                        // signGoodsDelete({ id: row.id }).then(res => {
                        //     message.success("删除成功")
                        //     forceUpdate()
                        // })
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

  }, [])

const submitForm=(obj)=>{
    console.log("submitForm---",obj)

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


  return (
    <div className="loginVip">
      <Card title={
        <div>
            
        </div>
      }
        extra={
          <div>
            <Button type="primary">新增</Button>
            <Button type="primary" style={{marginLeft:"10px"}}>同步缓存</Button>
          </div>
        }
      >
          <Table
          dataSource={virList}
          rowKey={item => item.id}
          columns={columns}
        />

          
      </Card >
    </div >
  )
}

export default App2