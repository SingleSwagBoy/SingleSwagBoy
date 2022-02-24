import React, { useState, useEffect, useReducer, useRouter } from 'react'
import { getOfflineChannel, updateOfflineTime, delOfflineChannel, addList, getChannel, updateOfflineChannel, addOfflineChannel } from 'api'
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
  const [channelList, setChannelList] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef, channerForm] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [isChannelShow, setIsChannel] = useState(false)
  const [currentItem, setCurrent] = useState({})
  const [currentChannel, setCurrentChannel] = useState({})
  const [source, setSource] = useState("")
  const selectProps = {
    optionFilterProp: "children",
    filterOption(input, option) {
      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    showSearch() {
      console.log('onSearch')
    }
  }
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
    { key: 1, value: "退出下线" },
    { key: 2, value: "换台下线" },
    { key: 3, value: "严格下线" },
    { key: 4, value: "彻底下线" },
  ]
  const content = (val) => {
    return (
      <div>
        {
          controlState.map((r, i) => {
            return (
              <p>
                <Button type={i == 3 ? "primary" : i == 0 ? "ghost" : i == 1 ? "dashed" : i == 2 ? "" : ""}
                  danger={i == 2 ? false : true} onClick={() => changeLine(r.key, val)}>
                  {r.value}
                </Button>
              </p>
            )

          })
        }
      </div>
    )
  }

  const changeLine = (index, val) => {
    console.log(index)
    val.strict = index
    updateOfflineFunc(val)
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
          <Popover content={content(row)} trigger="focus">
            <Button type={rowValue == 4 ? "primary" : rowValue == 1 ? "ghost" : rowValue == 2 ? "dashed" : rowValue == 3 ? "" : ""} danger={rowValue == 3 ? false : true} >{getBtnCont(rowValue)}</Button>
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
              info.status = val ? 1 : 2
              updateOfflineFunc(info)
            }}
          />}</div>
        )
      }
    },
    {
      title: "上下线时间", dataIndex: "time", key: "time", width: 350,
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
                let list = arr.scheduleList ? JSON.parse(arr.scheduleList) : []
                list.forEach(r => {
                  r.time = [moment(r.startTime), moment(r.endTime)]
                })
                arr.scheduleList = list
                setCurrent(row.scheduleList)
                setCurrentChannel(row)
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
    if (!props.location.query) return props.history.push('/mms/offline/program')
  }, [])
  useEffect(() => {//列表
    const fetchData = async () => {
      if (props.location.query) {
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
    console.log(currentItem, val)
    let list = currentItem ? Array.isArray(currentItem) ? currentItem : JSON.parse(currentItem) : []
    if (list.length == 0) {
      val.scheduleList.forEach(r => {
        r.programId = currentChannel.programId
        r.channelId = currentChannel.channelId
        r.startTime = r.time[0].valueOf()
        r.endTime = r.time[1].valueOf()
        r.deleted = 0
      })
      updateOffline(val.scheduleList)
    } else {
      list.forEach(l => {
        if (val.scheduleList.length == 0) {
          l.deleted = 1
        } else {
          val.scheduleList.forEach(r => {
            if (r.deleted == 0 || !r.deleted) {
              if (r.id == l.id) {
                l.startTime = r.time[0].valueOf()
                l.endTime = r.time[1].valueOf()
              } else {
                list.push({
                  programId: currentChannel.programId,
                  channelId: currentChannel.channelId,
                  startTime: r.time[0].valueOf(),
                  endTime: r.time[1].valueOf(),
                  deleted: 0
                })
              }
            }
          })
        }
      })
      // return console.log(list)
      updateOffline(list)
    }
  }
  const updateOfflineFunc = (params) => {
    updateOfflineChannel(params).then(res => {
      message.success("修改成功")
      forceUpdate()
    })
  }
  const closeDialog = (type) => {
    formRef.resetFields()
    if (type == 1) {
      setOpen(false)
    } else {
      setIsChannel(false)
    }

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
        delOfflineChannel({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const getChannelFunc = (val) => {
    let params = {
      keywords: val
    }
    getChannel(params).then(res => {
      setChannelList(res.data.data || [])
    })
  }
  const submitChannelForm = (val) => {
    console.log(val)
    let params = {
      programId: props.location.query.id,
      channelIds: val.channelList.join(",")
    }
    addOfflineChannel(params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
    setIsChannel(false)
  }
  return (
    <div className="loginVip">
      <Card title={
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/mms/offline/program">下线节目</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>设置下线频道</Breadcrumb.Item>

        </Breadcrumb>

      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setIsChannel(true)
              setSource("add")
            }}>新建频道</Button>
            {/* <MySyncBtn type={7} name='同步缓存' /> */}
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
        <Modal title="时刻表" centered visible={openDailog} onCancel={() => closeDialog(1)} footer={null} width={1000}>
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
                            if (!!currentItem) {
                              let arr = Array.isArray(currentItem) ? currentItem : JSON.parse(currentItem)
                              if (arr.length > 0) {
                                console.log(arr)
                                arr[index].deleted = 1
                                setCurrent(arr)
                              }
                            }
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
                <Button onClick={() => closeDialog(1)}>取消</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          }
        </Modal>
        <Modal title="新增频道" centered visible={isChannelShow} onCancel={() => closeDialog(2)} footer={null} width={1000}>
          {
            <Form {...layout}
              name="channelForm"
              form={channerForm}
              onFinish={(e) => submitChannelForm(e)}>
              <Form.Item label="频道" name="channelList">
                <Select placeholder="请选择频道配置" mode="multiple" allowClear
                  {...selectProps}
                  onSearch={(val) => {
                    console.log(val)
                    if (privateData.inputTimeOutVal) {
                      clearTimeout(privateData.inputTimeOutVal);
                      privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                      if (!privateData.inputTimeOutVal) return;
                      getChannelFunc(val)
                    }, 1000)
                  }}
                >
                  {
                    channelList.map(r => {
                      return (
                        <Option value={r.id} key={r.id}>{r.name + "----" + r.code}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button onClick={() => closeDialog(2)}>取消</Button>
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