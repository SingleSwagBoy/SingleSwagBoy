import React, { useState, useEffect, useReducer } from 'react'
import { getOfflineProgram, updateOfflineProgram, deleteConfig, addOfflineProgram, delOfflineProgram, requestNewAdTagList, getApkList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [lists, setLists] = useState([])

  useEffect(() => {//列表
    const fetchData = async () => {
      // const list = await getOfflineProgram({ page: { currentPage: page, pageSize: pageSize } })
      // setLists(list.data)
    }
    fetchData()
  }, [forceUpdateId])
  const submitForm = (val) => {//表单提交
    console.log(val)
    let params = {
      ...val,
    }
    updateOfflineProgramFunc(params)
  }
  const addOfflineProgramFunc = (params) => {
    addOfflineProgram(params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const updateOfflineProgramFunc = (params) => {
    // return console.log(params)
    updateOfflineProgram(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  return (
    <div className="loginVip">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>风险设备控制</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            {/* <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button> */}
            {/* <MySyncBtn type={7} name='同步缓存' /> */}
          </div>
        }
      >
       
      </Card>

    </div>
  )
}

export default App2