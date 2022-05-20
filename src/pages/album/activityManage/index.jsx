import React, { useState, useEffect, useReducer } from 'react'
import { getAblum, updateAblum, addAblum, delAblum, } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker, Divider, Space, Switch } from 'antd'
import { Link, Router } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};
const { RangePicker } = DatePicker;
function App2(props) {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [searchWord, setSearchWord] = useState("")
  const [source, setSource] = useState("")
  const selectProps = {
    optionFilterProp: "children",
    filterOption: (input, option) => {
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
  const columns = [
    {
      title: "编号",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "活动主题",
      dataIndex: "theme",
      key: "theme",
    },

    {
      title: "活动上下线时间",
      dataIndex: "time",
      key: "time",
      width: 300,
      render: (rowValue, row, index) => {
        return (
          // 栏目类型 1=用户属性，2=观看历史，3=其他数据
          <div>{row.startTime ? util.formatTime(row.startTime, "") : "未配置"} - {row.endTime ? util.formatTime(row.endTime, "") : "未配置"}</div>
        )
      }
    },
    {
      title: "活动奖品",
      dataIndex: "prize",
      key: "prize",
    },
    {
      title: "活动规则",
      dataIndex: "rule",
      key: "rule",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (rowValue, row, index) => {
        return (
          <div key={rowValue}>
            {<Switch checkedChildren="有效" unCheckedChildren="无效" defaultChecked={rowValue == 1 ? true : false}
              onChange={(val) => {
                let info = JSON.parse(JSON.stringify(row))
                info.status = val ? 1 : 2
                updateFunc(info)
              }}
            />}</div>
        )
      }
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right', width: 250,
      render: (rowValue, row, index) => {
        return (
          <div>
            <Button size="small" type="primary"
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.time = [arr.startTime ? moment(arr.startTime * 1000) : 0, arr.endTime ? moment(arr.endTime * 1000) : 0]
                arr.awardTime = arr.awardTime ? moment(arr.awardTime * 1000) : 0
                arr.status = row.status == 1 ? true : false
                let list = []
                arr.demo.forEach(r => {
                  list.push({ pic: r })
                })
                arr.imageList = list
                // setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
             <Button size="small" type="dashed" style={{ margin: " 0 10px" }} onClick={() => props.history.push({ pathname: "/mms/album/checkAblum", params: { period: row.period} })}>作品审核</Button>
            <Button danger size="small" onClick={() => delItem(row)}>删除</Button>
          </div>
        )
      }
    }
  ]
  useEffect(() => {//列表
    const fetchData = async () => {
      const list = await getAblum({ title: searchWord, page: { currentPage: page, pageSize: pageSize } })
      setLists(list.data)
      setTotal(list.totalCount)
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (page, pageSize) => {
    setPage(page)
    setPageSize(pageSize)
    forceUpdate()
  }
  const submitForm = (val) => {//表单提交
    console.log(val)
    let list = []
    val.imageList.forEach(r => {
      list.push(r.pic)
    })
    val.demo = list
    let params = {
      ...formRef.getFieldValue(),
      ...val,
      status: val.status ? 1 : 2,
      startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : 0,
      endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : 0,
      awardTime: val.awardTime ? parseInt(val.awardTime.valueOf() / 1000) : 0,
    }
    if (source == "add") {
      addFunc(params)
    } else if (source == "edit") {
      updateFunc(params)
    }
    closeDialog()
  }
  const addFunc = (params) => {
    addAblum(params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
  }
  const updateFunc = (params) => {
    updateAblum(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      onOk: () => {
        delAblum({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const getUploadFileUrl = (type, file, newItem) => {
    let image_url = newItem.fileUrl;
    let obj = formRef.getFieldValue(type) || []
    obj.push({ pic: image_url })
    formRef.setFieldsValue({ [type]: obj });
    forceUpdatePages()
  }
  return (
    <div className="loginVip">
      <Card title={
        <div className="marsBox">
          <div className="everyBody">
            <div>名称:</div>
            <Input.Search
              allowClear
              onChange={(val) => {
                setSearchWord(val.target.value)
              }}
              onSearch={(val) => {
                forceUpdate()
              }} />
          </div>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={"ablumActivity"} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1000, y: '75vh' }}
          rowKey={item => item.id}
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
              <Form.Item label="活动主题" name="theme" rules={[{ required: true, message: '请输入活动主题' }]}>
                <Input placeholder="请输入活动主题" />
              </Form.Item>
              <Form.Item label="活动奖品" name="prize" rules={[{ required: true, message: '请输入活动奖品' }]}>
                <Input.TextArea placeholder="请输入活动奖品" />
              </Form.Item>
              <Form.Item label="活动规则" name="rule" rules={[{ required: true, message: '请输入活动规则' }]}>
                <Input.TextArea placeholder="请输入活动规则" />
              </Form.Item>
              <Form.Item label='示范案例'>
                <Form.List name="imageList" label='示范案例'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={index} style={{ display: "inline-flex" }}>
                          <Form.Item  {...field} name={[field.name, 'pic']}
                            fieldKey={[field.fieldKey, "pic"]} label="图片">
                            <Image width={100} src={formRef.getFieldValue("imageList")[index].pic} />
                          </Form.Item>
                          <Button danger onClick={() => {
                            remove(field.name)
                          }} >删除</Button>
                        </div>

                      ))}
                      <Form.Item>
                        <MyImageUpload
                          getUploadFileUrl={(file, newItem) => getUploadFileUrl("imageList", file, newItem)}
                        />
                        {/* <Button type="primary" onClick={() => {
                          add()
                        }} block icon={<PlusOutlined />}>
                          新增投放时间段
                        </Button> */}
                      </Form.Item>

                    </>
                  )}
                </Form.List>
              </Form.Item>
              <Form.Item label="上下线时间" name='time' rules={[{ required: true, message: '请输入上下线时间' }]}>
                <RangePicker showTime placeholder={['上线时间', '下线时间']} />
              </Form.Item>
              <Form.Item label="领取时间" name='awardTime' rules={[{ required: true, message: '请输入领取时间' }]}>
                <DatePicker placeholder="领取时间" showTime />
              </Form.Item>
              <Form.Item label="每天最多可投票数" name="voteLimit" rules={[{ required: true, message: '请输入每天最多可投票数' }]}>
                <InputNumber min={0} placeholder="每天最多可投票数" />
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
      </Card >

    </div >
  )
}

export default App2