import React, { useState, useEffect, useReducer } from 'react'
import { getAdSPList, updateAdSPList, delAdSPList, addAdSPList, requestNewAdTagList, requestOperateApk } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Space, InputNumber } from 'antd'
import { } from 'react-router-dom'
import { CloseOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let { RangePicker } = DatePicker;
let privateData = {
  inputTimeOutVal: null
};
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9999)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
  const [tagList, setTagList] = useState([])
  const [apkList, setApkList] = useState([])
  const [layout] = useState({ labelCol: { span: 4 }, wrapperCol: { span: 20 } })
  const [formRef] = Form.useForm()
  const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })
  const [openDailog, setOpen] = useState(false)
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
  const apkLauTypes = [
    { key: 1, value: '腾讯' },
    { key: 2, value: '爱奇艺' },
    { key: 3, value: '优酷' },
  ]
  const columns = [
    {
      title: "名称",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "图片",
      dataIndex: "picUrl",
      key: "picUrl",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {
      title: "上下线时间",
      dataIndex: "time",
      key: "time",
      width: 300,
      render: (rowValue, row, index) => {
        return (
          <div>
            {row.startTime ? util.formatTime(row.startTime, "", "") : "未配置"}
            -
            {row.endTime ? util.formatTime(row.endTime, "", "") : "未配置"}
          </div>
        )
      }
    },
    {
      title: "标签",
      dataIndex: "tag",
      key: "tag",
      render: (rowValue, row, index) => {
        return (
          <div>{getTagName(rowValue)}</div>
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
            defaultChecked={rowValue == 1 ? true : false}
            // key={rowValue}
            onChange={(val) => {
              let info = JSON.parse(JSON.stringify(row))
              info.status = val ? 1 : 2
              console.log(info.status, "info.status")
              submitForm(info)
            }}
          />}</div>
        )
      }
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right', width: 150,
      render: (rowValue, row, index) => {
        return (
          <div>
            <Button
              style={{ margin: "0 10px" }}
              size="small"
              type="primary"
              onClick={() => {
                console.log("row",row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.time = [arr.startTime?moment(arr.startTime * 1000):0, arr.endTime?moment(arr.endTime * 1000):0]
                arr.status = arr.status == 1 ? true : false
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
      let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      setTagList(arr.data)
      let list = await requestOperateApk({ page: { isPage: 9 } })
      setApkList(list.data)
    }
    fetchTagData()
  }, [])
  useEffect(() => {//列表
    const fetchData = async () => {
      //setLists([])
      const list = await getAdSPList({ page: { currentPage: 1, pageSize: 9999 } })
      setLists(list.data)
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (e) => {
    console.log(e)
  }
  const submitForm = (val) => {//表单提交
    console.log(val)
    if (source == "add") {
      let params = {
        ...val,
        startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : val.startTime,
        endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : val.endTime,
        status: val.status ? 1 : 2
      }
      addArmour(params)
    } else if (source == "edit") {
      let params = {
        ...currentItem,
        ...val,
        startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : val.startTime,
        endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : val.endTime,
        status: val.status ? 1 : 2
      }
      editArmour(params)
    } else {
      let params = {
        ...val,
      }
      editArmour(params)
    }
    closeDialog()
  }
  const addArmour = (params) => {
    addAdSPList(params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
  }
  const editArmour = (params) => {
    updateAdSPList(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        delAdSPList({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const getTagName = (name) => {
    let arr = tagList.filter(item => item.code == name)
    if (arr.length > 0) {
      return arr[0].name
    } else {
      return ""
    }
  }
  const getUploadFileUrl = (type, file, newItem) => {
    let that = this;
    let image_url = newItem.fileUrl;
    let obj = {};
    obj[type] = image_url;
    console.log(obj)
    formRef.setFieldsValue(obj);
    forceUpdatePages()
  }
  const getUploadFileImageUrlByType = (type) => {
    let image_url = formRef.getFieldValue(type);
    return image_url ? image_url : '';
  }
  const chooseWord = (val) => {
    let word = formRef.getFieldValue("backDoor") ? formRef.getFieldValue("backDoor") : ""
    if (val != "删") {
      formRef.setFieldsValue({ backDoor: word + val })
    } else {
      formRef.setFieldsValue({ backDoor: word.slice(0, word.length - 1) })
    }
  }
  return (
    <div className="loginVip">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>马甲包管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={31} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1200, y: '75vh' }}
          rowKey={item=>item.id}
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
              <Form.Item label="名称" name="title" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item label="类型" name="type" rules={[{ required: true, message: '请输入类型' }]}>
                <Select mode={true} allowClear showSearch placeholder="请选择类型"
                  onChange={() => forceUpdatePages()}
                >
                  <Option value={1} key={1}>热门活动</Option>
                  <Option value={2} key={2}>推广应用</Option>
                </Select>
              </Form.Item>
              <Form.Item label="标签" name="tag">
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
              <Form.Item label="图片" name="picUrl" rules={[{ required: true, message: '请上传图片' }]}>
                <MyImageUpload
                  getUploadFileUrl={(file, newItem) => getUploadFileUrl('picUrl', file, newItem)}
                  imageUrl={getUploadFileImageUrlByType('picUrl')}
                />
                <Input defaultValue={formRef.getFieldValue("picUrl")} key={formRef.getFieldValue("picUrl")}
                  onChange={(e) => {
                    if (privateData.inputTimeOutVal) {
                      clearTimeout(privateData.inputTimeOutVal);
                      privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                      if (!privateData.inputTimeOutVal) return;
                      formRef.setFieldsValue({ picUrl: e.target.value })
                      forceUpdatePages()
                    }, 1000)
                  }}
                />
              </Form.Item>
              {
                formRef.getFieldValue("type") == 1 &&
                <>
                  <Form.Item label="二维码文案" name="qrInfo" rules={[{ required: true, message: '请输入二维码文案' }]}>
                    <Input placeholder="请输入二维码文案" />
                  </Form.Item>
                  <Form.Item label="二维码地址" name="qrUrl" rules={[{ required: true, message: '请输入二维码地址' }]}>
                    <Input placeholder="请输入二维码地址" />
                  </Form.Item>
                </>
              }
              {
                formRef.getFieldValue("type") == 2 &&
                <>
                  <Form.Item label="运营APK" name="opApkId" rules={[{ required: true, message: '请选择运营APK' }]}>
                    <Select mode={true} allowClear showSearch placeholder="请选择运营APK"
                      onChange={() => forceUpdatePages()}
                    >
                      {
                        apkList.map((item, index) => {
                          return <Option key={index} value={item.id}>{item.id}-{item.name}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item label="推广渠道" name="exCp">
                    <Select mode={true} allowClear showSearch placeholder="请选择推广渠道"
                      onChange={() => forceUpdatePages()}
                    >
                      {
                        apkLauTypes.map((item, index) => (
                          <Option value={item.key} key={index}>{item.value}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item label="推广地址" name="exUrl">
                    <Input placeholder="请输入推广地址" />
                  </Form.Item>
                  <Form.Item label="推广参数" name="exParam">
                    <Input placeholder="请输入推广参数" />
                  </Form.Item>
                </>
              }

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