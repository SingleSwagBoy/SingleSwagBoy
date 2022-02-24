import React, { useState, useEffect, useReducer } from 'react'
import { getRiskConfig, editRiskConfig, deleteConfig, addOfflineProgram, delOfflineProgram, requestNewAdTagList, getApkList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { TabPane } = Tabs;
let privateData = {
  inputTimeOutVal: null
};
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [riskRouter, setRiskRouter] = useState({})
  const [riskUser, setRiskUser] = useState({})
  const [riskUuid, setRiskUuid] = useState({})
  const controlState = [
    { key: 0, value: "严格下线" },
    { key: 1, value: "换台下线" },
    { key: 2, value: "彻底下线" },
    { key: 3, value: "退出下线" },
  ]
  const everyBody = [
    { value: "风险用户", key: 1 },
    { value: "风险设备", key: 2 },
    { value: "风险路由", key: 3 },
  ]
  useEffect(() => {//列表
    const fetchData = async () => {
      const list = await getRiskConfig({})
      console.log(list.data)
      setRiskRouter(list.data.riskRouter)
      setRiskUser(list.data.riskUser)
      setRiskUuid(list.data.riskUuid)
    }
    fetchData()
  }, [forceUpdateId])
  const submitForm = () => {//表单提交
    let params = {
      riskRouter: riskRouter,
      riskUser: riskUser,
      riskUuid: riskUuid,
    }
    // return console.log(params)
    editRiskConfigFunc(params)
  }
  const editRiskConfigFunc = (params) => {
    // return console.log(params)
    editRiskConfig(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const callback = (key) => {
    console.log(key);
  }
  const changeLine = () => {

  }
  const getState = (index) => {
    if (index == 0) {
      return riskUser.isOpenSelfBuild == 1 ? true : false
    } else if (index == 1) {
      return riskUuid.isOpenSelfBuild == 1 ? true : false
    } else if (index == 2) {
      return riskRouter.isOpenSelfBuild == 1 ? true : false
    }
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
        <div className='risk_box'>
          {
            everyBody.map((l, index) => {
              return (
                <div key={index}>
                  <div style={{ marginBottom: "20px" }}>{l.value}</div>
                  <div style={{ marginBottom: "20px", display: 'flex', alignItems: "center" }}>
                    <p style={{ marginBottom: "0" }}>下线级别:</p>
                    <Select style={{ width: "200px" }} placeholder="请选择下线级别"
                      key={index == 0 ? riskUser.strict : index == 1 ? riskUuid.strict : index == 2 ? riskRouter.strict : ""}
                      defaultValue={index == 0 ? riskUser.strict : index == 1 ? riskUuid.strict : index == 2 ? riskRouter.strict : ""}
                      onChange={(e) => {
                        if (index == 0) {
                          riskUser.strict = e
                          setRiskUser(riskUser)
                        }else if (index == 1) {
                          riskUuid.strict = e
                          setRiskUuid(riskUuid)
                        }else if (index == 2) {
                          riskRouter.strict = e
                          setRiskRouter(riskRouter)
                        } 
                      }}
                    >
                      {
                        controlState.map((r, i) => {
                          return (
                            <Option value={r.key} key={i}>{r.value}</Option>
                          )
                        })
                      }
                    </Select>
                  </div>
                  <div style={{ marginBottom: "20px", display: 'flex', alignItems: "center" }}>
                    <p style={{ marginBottom: "0" }}>开启自建/注入播放:</p>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" valuePropName="checked" key={getState(index)}
                      defaultChecked={getState(index)}
                      onChange={(e) => {
                        if (index == 0) {
                          riskUser.isOpenSelfBuild = e?1:2
                          setRiskUser(riskUser)
                        }else if (index == 1) {
                          riskUuid.isOpenSelfBuild = e?1:2
                          setRiskUuid(riskUuid)
                        }else if (index == 2) {
                          riskRouter.isOpenSelfBuild = e?1:2
                          setRiskRouter(riskRouter)
                        } 
                      }}
                    ></Switch>
                  </div>

                </div>
              )
            })
          }

        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={() => submitForm()}>确定</Button>
        </div>
      </Card>

    </div>
  )
}

export default App2