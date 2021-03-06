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
    { key: 1, value: "????????????" },
    { key: 2, value: "????????????" },
    { key: 3, value: "????????????" },
    { key: 4, value: "????????????" },
  ]
  const content = (val) => {
    return (
      <div>
        {
          controlState.map((r, i) => {
            return (
              <p>
                <Button style={{ backgroundColor: i == 3 ? "#f56c6c" : i == 0 ? "#67c23a" : i == 1 ? "#409eff" : i == 2 ? "#7266ba" : "", color: "#fff" }}
                  onClick={() => changeLine(r.key, val)}>
                  {r.value}
                </Button>
                {

                }
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
    { title: "????????????", dataIndex: "channelCode", key: "channelCode", },
    { title: "????????????", dataIndex: "channelName", key: "channelName" },
    {
      title: "????????????", dataIndex: "strict", key: "strict",
      render: (rowValue, row, index) => {
        return (
          <Popover content={content(row)} trigger="focus">
            {
              rowValue == 1 &&
              <Button style={{ "backgroundColor": "#67c23a", color: "#fff" }}>
                {getBtnCont(rowValue)}
              </Button>
            }
            {
              rowValue == 2 &&
              <Button style={{ "backgroundColor": "#409eff", color: "#fff" }}>
                {getBtnCont(rowValue)}
              </Button>
            }
            {
              rowValue == 3 &&
              <Button style={{ "backgroundColor": "#7266ba", color: "#fff" }}>
                {getBtnCont(rowValue)}
              </Button>
            }
            {
              rowValue == 4 &&
              <Button style={{ "backgroundColor": "#f56c6c", color: "#fff" }}>
                {getBtnCont(rowValue)}
              </Button>
            }

          </Popover>
        )
      }
    },
    {
      title: "??????", dataIndex: "status", key: "status",
      render: (rowValue, row, index) => {
        return (
          <div>{<Switch
            checkedChildren="??????"
            unCheckedChildren="??????"
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
      title: "???????????????", dataIndex: "time", key: "time", width: 350,
      render: (rowValue, row, index) => {
        return (
          <div>
            {row.scheduleList ? util.formatTime(JSON.parse(row.scheduleList)[0].startTime, "", "") : "?????????"}
            -
            {row.scheduleList ? util.formatTime(JSON.parse(row.scheduleList)[0].endTime, "", "") : "?????????"}
          </div>
        )
      }
    },
    {
      title: "??????", key: "action", fixed: 'right', width: 200,
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
            >??????</Button>
            <Button danger size="small" onClick={() => delItem(row)}>??????</Button>
          </div>
        )
      }
    }
  ]
  useEffect(() => {//??????
    const fetchTagData = async () => {
      // let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      // setTagList(arr.data)
      // let list = await getApkList({ page: { isPage: 9 } })
      // setApkList(list.data)
    }
    fetchTagData()
    if (!props.location.query) return props.history.push('/mms/offline/program')
  }, [])
  useEffect(() => {//??????
    const fetchData = async () => {
      if (props.location.query) {
        const list = await getOfflineChannel({ page: { currentPage: page, pageSize: pageSize }, programId: props.location.query.id })
        setLists(list.data)
        console.log(list)
        setTotal(list.page.totalCount)
      }
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (page, pageSize) => {
    setPage(page)
    setPageSize(pageSize)
    forceUpdate()
  }
  const submitForm = (val) => {//????????????
   
    let list = currentItem ? Array.isArray(currentItem) ? currentItem : JSON.parse(currentItem) : []
    console.log(list, val)
    if (list.length > 0) {
      let addList = val.scheduleList.filter(item => !item.id)
      let diffList = list.filter(item => val.scheduleList.every(l => l.id != item.id))
      let sameList = list.filter(item => val.scheduleList.some(l => l.id == item.id))
      console.log(diffList,"diffList")
      console.log(sameList,"sameList")
      console.log(addList,"addList")
      if(addList.length>0){
        diffList.push(...addList)
      }
      let arr = []
      sameList.forEach(r => {
        val.scheduleList.forEach(l => {
          if (r.id == l.id) {
            r.startTime = l.time[0].valueOf()
            r.endTime = l.time[1].valueOf()
          }
        })
      })
      diffList.forEach(r => {
        if (!r.deleted && r.deleted != 0) {
          arr.push({
            programId: currentChannel.programId,
            channelId: currentChannel.channelId,
            startTime: r.time[0].valueOf(),
            endTime: r.time[1].valueOf(),
            deleted: 0
          })
        }else{
          r.deleted = 1
          arr.push(r)
        }
      })
      let submitList = sameList.concat(arr)
      // return console.log(submitList,"submitList-----------")
      updateOffline(submitList)
    } else {
      let arr = []
      val.scheduleList.forEach(r => {
        arr.push({
          programId: currentChannel.programId,
          channelId: currentChannel.channelId,
          startTime: r.time[0].valueOf(),
          endTime: r.time[1].valueOf(),
          deleted: 0
        })
      })
      // return console.log(arr,"arr11-----------")
      updateOffline(arr)
    }

  }
  const updateOfflineFunc = (params) => {
    updateOfflineChannel(params).then(res => {
      message.success("????????????")
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
      message.success("????????????")
      forceUpdate()
      setOpen(false)
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `??????????????????????????????`,
      // content: '???????????????',
      onOk: () => {
        delOfflineChannel({ id: row.id }).then(res => {
          message.success("????????????")
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
      message.success("????????????")
      forceUpdate()
    })
    setIsChannel(false)
  }
  return (
    <div className="loginVip">
      <Card title={
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/mms/offline/program">????????????</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>??????????????????</Breadcrumb.Item>

        </Breadcrumb>

      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setIsChannel(true)
              setSource("add")
            }}>????????????</Button>
            {/* <MySyncBtn type={7} name='????????????' /> */}
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
        <Modal title="?????????" centered visible={openDailog} onCancel={() => closeDialog(1)} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              <Form.Item label="?????????">
                <Form.List name="scheduleList">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Button type="primary" onClick={() => {
                          let scheduleList = formRef.getFieldValue("scheduleList") || []
                          console.log(scheduleList)
                          if (scheduleList.length == 0) {
                            scheduleList.push({
                              time:[moment(new Date().getTime()),moment(new Date().getTime())]
                            })
                          }else{
                            if(scheduleList[scheduleList.length-1].startTime){
                              scheduleList.push({
                                time:[moment(scheduleList[scheduleList.length-1].startTime+(24*60*60*1000)),moment(scheduleList[scheduleList.length-1].endTime+(24*60*60*1000))]
                              })
                            }else{
                              scheduleList.push({
                                time:[moment((scheduleList[scheduleList.length-1].time[0]).valueOf()+(24*60*60*1000)),moment((scheduleList[scheduleList.length-1].time[1]).valueOf()+(24*60*60*1000))]
                              })
                            }
                           
                          }
                          console.log(scheduleList)
                          formRef.setFieldsValue({scheduleList:scheduleList})
                          // setCurrent(row)
                          // add()
                        }} block icon={<PlusOutlined />}>
                          ?????????????????????
                        </Button>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                          <Form.Item
                            {...field}
                            label=""
                            name={[field.name, 'time']}
                            fieldKey={[field.fieldKey, 'name']}
                            rules={[{ required: true, message: '??????????????????' }]}
                          >
                            <RangePicker showTime placeholder={['????????????', '????????????']} />
                          </Form.Item>

                          <MinusCircleOutlined onClick={() => {
                            remove(field.name)
                          }} />
                        </Space>
                      ))}


                    </>
                  )}
                </Form.List>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button onClick={() => closeDialog(1)}>??????</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  ??????
                </Button>
              </Form.Item>
            </Form>
          }
        </Modal>
        <Modal title="????????????" centered visible={isChannelShow} onCancel={() => closeDialog(2)} footer={null} width={1000}>
          {
            <Form {...layout}
              name="channelForm"
              form={channerForm}
              onFinish={(e) => submitChannelForm(e)}>
              <Form.Item label="??????" name="channelList">
                <Select placeholder="?????????????????????" mode="multiple" allowClear
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
                <Button onClick={() => closeDialog(2)}>??????</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  ??????
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