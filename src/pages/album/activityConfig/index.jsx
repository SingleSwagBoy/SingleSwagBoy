import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { getActivityConfig,updateActivityConfig } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn } from "@/components/views.js"
import util from 'utils'
import "./style.css"

function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [activityConfig, setActivityConfig] = useState({gradeTask:[],monthTask:""})
  // const [monthTask, setMonthTask] = useState([])

  useEffect(() => { //获取家庭数据

    // getMyFamilyClick()
    const fetchData = async () => {
      const list = await getActivityConfig({})
      let arr = list.data.length > 0 ? list.data[0] : []
      // setGradeTask(arr.gradeTask.length > 0 ? arr.gradeTask : [])
      // setMonthTask(arr.monthTask ? arr.monthTask.value : 0)
      setActivityConfig(arr)
    }
    fetchData()
  }, [forceUpdateId])

  const addGradeTask = () =>{
    let arr = Object.assign([],activityConfig)
    let list = arr.gradeTask.filter(item=>!item.value)
    if(list.length>0)return message.error("请输入某个阶段的空数量后再增加")
    arr.gradeTask.push({grade:arr.gradeTask.length,value:null})
    // setGradeTask([...arr])
    setActivityConfig(arr)
  }
  const deleteData =(index)=>{
    let arr = Object.assign([],activityConfig)
    if(arr.gradeTask.length == 1)return message.error("必须保留一项")
    arr.gradeTask.splice(index,1)
    setActivityConfig(arr)
  }
  const submitData =()=>{
    let list = activityConfig.gradeTask.filter(item=>!item.value)
    if(list.length>0)return message.error("请输入某个阶段的空数量后再增加")
    console.log(activityConfig,"gradeTask")
    let params={
      ...activityConfig
    }
    updateActivityConfig(params).then(res=>{
      message.success("更改成功")
      forceUpdate()
    })
  }
  return (
    <div className="album_page">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>传照片活动配置</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        
      }
      extra={
        <MySyncBtn type={28} name='同步缓存' />
    }
      >
        <div className='task_box'>
          <div className='box'>
            <div className='title'>等级任务:</div>
            {
              activityConfig.gradeTask.map((r, i) => {
                return (
                  <div className='level' key={i}>
                    <div>等级{i+1}</div>
                    <div><InputNumber placeholder='请输入该阶段照片数量' min={0} defaultValue={r.value} key={r.value} style={{ width: "100%" }} 
                    onChange={(e)=>{
                      console.log(e)
                      r.value = e
                      // setGradeTask([...gradeTask])
                    }}
                    /></div>
                    <div onClick={()=>deleteData(i)}><CloseOutlined /></div>
                  </div>
                )
              })
            }

            <div className='btn' ><Button type="primary" onClick={()=>addGradeTask()}>新增阶段</Button></div>
          </div>
          <div className='box'>
            <div className='title'>每月任务:</div>
            <div className='level'>
              <div>每月上传照片数量</div>
              <div><InputNumber placeholder='请输入该阶段照片数量' min={0} defaultValue={activityConfig.monthTask.value} key={activityConfig.monthTask.value}
               onChange={(e)=>{
                console.log(e)
                activityConfig.monthTask.value = e
                // setGradeTask([...gradeTask])
              }}
              /></div>
            </div>
          </div>
        </div>
        <div className='save_btn'>
          <Button type="primary" style={{width:"300px"}} onClick={()=>submitData()}>保存</Button>
        </div>

      </Card>

    </div>
  )
}

export default App2