import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { getList, updateList, deleteConfig, addList, changeWelcome, requestNewAdTagList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Space } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
const { TabPane } = Tabs;
let { TextArea } = Input;
let { RangePicker } = DatePicker;
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
  const [tagList, setTagList] = useState([])
  const [layout] = useState({ labelCol: { span: 4 }, wrapperCol: { span: 20 } })
  const [formRef] = Form.useForm()
  const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })
  const [openDailog, setOpen] = useState(false)
  const [replyInfos, setReplyInfos] = useState([])
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
  const [qywechatCode, setQywechatCode] = useState("")
  const key = "CHANNEL_RISK_TAG"
  const [columns] = useState([
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      // render: (rowValue, row, index) => {
      //   return (
      //     <div>{getTagName(rowValue)}</div>
      //   )
      // }
    },
    {
      title: "上下线时间",
      dataIndex: "time",
      key: "time",
      render: (rowValue, row, index) => {
        return (
          <div>
               {row.startTime?util.formatTime(row.startTime, "", "") : "未配置"}
                -
                {row.endTime?util.formatTime(row.endTime, "", "") :"未配置"}
          </div>
        )
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (rowValue, row, index) => {
        return (
          <div>{<Switch
            checkedChildren="有效"
            unCheckedChildren="无效"
            defaultChecked={rowValue}
            key={rowValue}
            onChange={(val) => {
              let info = JSON.parse(JSON.stringify(row))
              info.status = val
              submitForm(info)
            }}
          />}</div>
        )
      }
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right', width: 200,
      render: (rowValue, row, index) => {
        return (
          <div>
            <Button
              style={{ margin: "0 10px" }}
              size="small"
              type="primary"
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.time = [moment(arr.startTime), moment(arr.endTime)]
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" onClick={() => delItem(row)}>删除</Button>
          </div>
        )
      }
    }
  ])
  useEffect(() => {
    const fetchData = async () => {
      const list = await getList({ key: key })
      console.log(list.data.data)
      setLists(list.data.data)
    }
    fetchData()
  }, [forceUpdateId])
  useEffect(() => {
    const fetchTagData = async () => {
      let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      console.log(arr,"arr")
      setTagList(arr.data)
    }
    fetchTagData()
  }, [])
  const changeSize = (e) => {
    console.log(e)
  }
  const submitForm = (val) => {//表单提交
    console.log(val)
    if (source == "add") {
      let params = {
        ...val,
        startTime: val.time ? val.time[0].valueOf() : val.startTime,
        endTime: val.time ? val.time[1].valueOf() : val.endTime,
      }
      addWelcomeApi(params)
    } else if(source == "edit"){
      let params = {
        ...currentItem,
        ...val,
        startTime: val.time ? val.time[0].valueOf() : val.startTime,
        endTime: val.time ? val.time[1].valueOf() : val.endTime,
      }
      saveWelcomeApi(params)
    }else{
      let params = {
        ...val,
      }
      saveWelcomeApi(params)
    }
    closeDialog()
  }
  const addWelcomeApi = (params) => {
    addList({key:key},params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setReplyInfos([])
  }
  const saveWelcomeApi = (params) => {
    updateList({key:key,id:params.indexId},params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const changeWelcomeAPi = (val) => {
    console.log(val)
    let params = {
      id: val.id,
      status: val.status
    }
    changeWelcome(params).then(res => {
      message.success("操作成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        deleteConfig({ id: row.indexId,key:key}).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const getTagName = (name) =>{
    console.log(tagList,"tagList==========")
  }
  return (
    <div className="loginVip">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>频道风险地域</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
              formRef.setFieldsValue({ "qywechatCode": qywechatCode })
            }}>新建</Button>
            <MySyncBtn type={7} name='同步缓存'  params={{ key: key }} />
          </div>
        }
      >
        <Table
          dataSource={lists}
          // scroll={{ x: 1200, y: '75vh' }}
          // rowKey={item=>item.indexId}
          // loading={loading}
          columns={columns}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: changeSize
          }}
        />
        <Modal title="编辑" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item label="标签" name="tags" rules={[{ required: true, message: '请选择标签' }]}>
                <Select mode={true} allowClear showSearch placeholder="请选择用户设备标签"
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
                  {tagList.map((item, index) => (
                    <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="上下线时间" name="time">
                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
              </Form.Item>
              <Form.Item label="状态" name="status" valuePropName="checked">
                <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
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
      </Card>

    </div>
  )
}

export default App2