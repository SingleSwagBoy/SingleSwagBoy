import React, { useState, useEffect, useReducer } from 'react'
import { getArmourPackage, editArmourPackage, delArmourPackage, addArmourPackage, copyArmourPackage, requestNewAdTagList } from 'api'
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
  const [layout] = useState({ labelCol: { span: 4 }, wrapperCol: { span: 20 } })
  const [formRef] = Form.useForm()
  const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })
  const [openDailog, setOpen] = useState(false)
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
  const [dictState] = useState([{ key: 0, value: '未使用' }, { key: 1, value: '已使用' },])
  const columns = [
    {
      title: "序号",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "设备码",
      dataIndex: "time",
      key: "time",
      width: 260,
    },
    {
      title: "备注",
      dataIndex: "autoDownload",
      key: "autoDownload",
    },
    {
      title: "状态",
      dataIndex: "backDoor",
      key: "backDoor",
      width: 200,
      render: (rowValue, row, index) => {
        return (
          <div>{row.backDoor == 0 ? '未使用' : '已使用'}</div>
        )
      }
    },


  ]
  useEffect(() => {//标签
    const fetchTagData = async () => {
      let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      setTagList(arr.data)
    }
    fetchTagData()
  }, [])
  useEffect(() => {//列表
    const fetchData = async () => {
      const list = await getArmourPackage({ page: { currentPage: 1, pageSize: 9999 } })
      setLists(list.data.data)
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (e) => {
    console.log(e)
  }
  const submitForm = (val) => {//表单提交
    console.log(val)
    if (source == "number") {
      let params = {
        ...val,
        startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : val.startTime,
        endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : val.endTime,
        autoDownload: val.autoDownload ? 1 : 2,
        status: val.status ? 1 : 2
      }
      addArmour(params)
    } else if (source == "numLetter") {
      let params = {
        ...currentItem,
        ...val,
        startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : val.startTime,
        endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : val.endTime,
        autoDownload: val.autoDownload ? 1 : 2,
        status: val.status ? 1 : 2
      }
      editArmour(params)
    }
    closeDialog()
  }
  const addArmour = (params) => {
    addArmourPackage(params).then(res => {
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
    editArmourPackage(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const copyData = (item) => {
    copyArmourPackage({ id: item.id }).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        delArmourPackage({ id: row.id }).then(res => {
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
            <Breadcrumb.Item>马甲包安装</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Select placeholder='请选择状态' className="base-input-type">
              {dictState.map((item, index) => {
                return <Option key={index} value={item.key}>{item.value}</Option>
              })}
            </Select>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("number")
            }} style={{ 'marginLeft': '10px' }}>生成纯数字</Button>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("numLetter")
            }} style={{ 'marginLeft': '10px' }} >生成数字+字母</Button>
            <MySyncBtn type={29} name='同步缓存' />
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
        <Modal title="编辑" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              <Form.Item label="名称" name="title" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item label="上下线时间" name="time">
                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
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
              <Form.Item label="包名" name="app" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item label="图标" name="appIcon" rules={[{ required: true, message: '请上传图标' }]}>
                <MyImageUpload
                  getUploadFileUrl={(file, newItem) => getUploadFileUrl('appIcon', file, newItem)}
                  imageUrl={getUploadFileImageUrlByType('appIcon')}
                />
                <Input defaultValue={formRef.getFieldValue("appIcon")} key={formRef.getFieldValue("appIcon")}
                  onChange={(e) => {
                    if (privateData.inputTimeOutVal) {
                      clearTimeout(privateData.inputTimeOutVal);
                      privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                      if (!privateData.inputTimeOutVal) return;
                      formRef.setFieldsValue({ appIcon: e.target.value })
                      forceUpdatePages()
                    }, 1000)
                  }}
                />
              </Form.Item>
              <Form.Item label="应用名" name="appName" rules={[{ required: true, message: '请输入应用名' }]}>
                <Input placeholder="请输入应用名" />
              </Form.Item>
              <Form.Item label="下载地址" name="appLink" rules={[{ required: true, message: '请输入下载地址' }]}>
                <Input placeholder="请输入下载地址" />
              </Form.Item>
              <Form.Item label="自动下载" name="autoDownload" valuePropName="checked">
                <Switch checkedChildren="开" unCheckedChildren="关" ></Switch>
              </Form.Item>
              <Form.Item label="后门配置">
                <Form.Item>
                  <div className='backDoor'>
                    <div value="上" onClick={() => chooseWord("上")}>上</div>
                    <div value="下" onClick={() => chooseWord("下")}>下</div>
                    <div value="左" onClick={() => chooseWord("左")}>左</div>
                    <div value="右" onClick={() => chooseWord("右")}>右</div>
                    <div value="删" onClick={() => chooseWord("删")}><CloseOutlined /></div>
                  </div>
                </Form.Item>
                <Form.Item name="backDoor">
                  <Input disabled />
                </Form.Item>
              </Form.Item>
              <Form.Item label="排序" name="sortOrder">
                <InputNumber min={0} style={{ width: "200px" }} placeholder='请输入排序' />
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