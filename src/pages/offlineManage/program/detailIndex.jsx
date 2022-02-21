import React, { useState, useEffect, useReducer, useRouter } from 'react'
import { getOfflineChannel, updateOfflineTime, deleteConfig, addList, changeWelcome, requestNewAdTagList, getApkList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Popover, Space } from 'antd'
import { Link } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
let privateData = {
  inputTimeOutVal: null
};
function App2(props) {
  console.log(props, "props")
  
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
  const [apkList, setApkList] = useState([])
  const [tagList, setTagList] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
  const filterOption = (input, option) => {
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
  }
  const controlState = [
    { key: 1, value: "严格下线" },
    { key: 2, value: "换台下线" },
    { key: 3, value: "彻底下线" },
    { key: 4, value: "退出下线" },
  ]
  const content = (
    <div>
      {
        controlState.map((r, i) => {
          return <p><Button type={i == 3 ? "primary" : i == 0 ? "ghost" : i == 1 ? "dashed" : i == 2 ? "" : ""} danger={i == 2 ? false : true} onClick={() => changeLine(r.key)}>{r.value}</Button></p>
        })
      }
    </div>
  );
  
  const changeLine = (index) => {
    console.log(index)
  }
  const getBtnCont = (val) => {
    let arr = controlState.filter(item => item.key == val)
    return arr[0].value
  }
  const columns = [
    { title: "频道编码", dataIndex: "channelCode", key: "channelCode", },
    { title: "频道名称", dataIndex: "channelName", key: "channelName" },
    {
      title: "控制状态", dataIndex: "strict", key: "strict",
      render: (rowValue, row, index) => {
        return (
          <Popover content={content} trigger="focus">
            <Button>{getBtnCont(rowValue)}</Button>
          </Popover>
        )
      }
    },
    {
      title: "状态", dataIndex: "status", key: "status",
      render: (rowValue, row, index) => {
        return (
          <div>{<Switch
            checkedChildren="有效"
            unCheckedChildren="无效"
            defaultChecked={rowValue == 1 ? true : false}
            key={rowValue}
            onChange={(val) => {
              let info = JSON.parse(JSON.stringify(row))
              info.status = val

            }}
          />}</div>
        )
      }
    },
    {
      title: "上下线时间", dataIndex: "time", key: "time",width:350,
      render: (rowValue, row, index) => {
        return (
          <div>
            {row.scheduleList ? util.formatTime(JSON.parse(row.scheduleList)[0].startTime, "", "") : "未配置"}
            -
            {row.scheduleList ? util.formatTime(JSON.parse(row.scheduleList)[0].endTime, "", "") : "未配置"}
          </div>
        )
      }
    },
    {
      title: "操作", key: "action", fixed: 'right', width: 200,
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
                let list = arr.scheduleList?JSON.parse(arr.scheduleList):[]
                list.forEach(r => {
                  r.time = [moment(r.startTime), moment(r.endTime)]
                })
                arr.scheduleList = list
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
  ]
  useEffect(() => {//标签
    const fetchTagData = async () => {
      // let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      // setTagList(arr.data)
      // let list = await getApkList({ page: { isPage: 9 } })
      // setApkList(list.data)
    }
    fetchTagData()
    if(!props.location.query)return props.history.push('/mms/offline/program')
  }, [])
  useEffect(() => {//列表
    const fetchData = async () => {
      if(props.location.query){
        const list = await getOfflineChannel({ page: { currentPage: page, pageSize: pageSize }, programId: props.location.query.id })
        setLists(list.data)
      }
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (e) => {
    console.log(e)
  }
  const submitForm = (val) => {//表单提交
    let list = JSON.parse(currentItem.scheduleList)
    val.scheduleList.forEach(r => {
      if (list.length == 0) {
        r.programId = currentItem.programId
        r.channelId = currentItem.channelId
        r.startTime = r.time[0].valueOf()
        r.endTime = r.time[1].valueOf()
        r.deleted = 0
      } else {
        list.forEach(l => {
          if (r.id == l.id) {
            r.startTime = r.time[0].valueOf()
            r.endTime = r.time[1].valueOf()
          } else {
            r.programId = currentItem.programId
            r.channelId = currentItem.channelId
            r.startTime = r.time[0].valueOf()
            r.endTime = r.time[1].valueOf()
            r.deleted = 0
          }
        })
      }
    })
    console.log(val.scheduleList)
    updateOffline(val.scheduleList)
  }
  const addWelcomeApi = (params) => {
    addList(params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
  }
  const updateOffline = (params) => {
    updateOfflineTime(params).then(res => {
      message.success("操作成功")
      forceUpdate()
      setOpen(false)
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        deleteConfig({ id: row.indexId }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  return (
    <div className="loginVip">
      <Card title={
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/mms/offline/program">下线频道</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>设置下线频道</Breadcrumb.Item>

        </Breadcrumb>

      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建频道</Button>
            <MySyncBtn type={7} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1200, y: '75vh' }}
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
        <Modal title="时刻表" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              <Form.Item label="时刻表">
                <Form.List name="scheduleList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                          <Form.Item
                            {...field}
                            label=""
                            name={[field.name, 'time']}
                            fieldKey={[field.fieldKey, 'name']}
                            rules={[{ required: true, message: '时间不能为空' }]}
                          >
                            <RangePicker showTime placeholder={['开始时间', '结束时间']} />
                          </Form.Item>

                          <MinusCircleOutlined onClick={() => {
                            // let arr = formRef.getFieldsValue().scheduleList
                            // console.log(arr)
                            // arr[index].deleted = 1
                            // formRef.setFieldsValue({scheduleList:arr})
                            remove(field.name)
                          }} />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          新增下线时刻表
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
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