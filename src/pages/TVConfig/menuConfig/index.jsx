import React, { useState, useEffect, useReducer } from 'react'
import { getMenuList, updateMenuList, delMenuList, addMenuList, requestNewAdTagList, requestOperateApk } from 'api'
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
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "默认图片",
      dataIndex: "defPicUrl",
      key: "defPicUrl",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {
      title: "无焦点图片",
      dataIndex: "noFocPicUrl",
      key: "noFocPicUrl",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {
      title: "焦点图片",
      dataIndex: "focPicUrl",
      key: "focPicUrl",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (rowValue, row, index) => {
        return (
          <div>{getTagName(rowValue)}</div>
        )
      }
    },
    {
      title: "插入位置",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "上下线时间",
      dataIndex: "time",
      key: "time",
      width: 300,
      render: (rowValue, row, index) => {
        return (
          <div>
            {row.onlineTime ? util.formatTime(row.onlineTime, "", "") : "未配置"}
            -
            {row.offlineTime ? util.formatTime(row.offlineTime, "", "") : "未配置"}
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
          <div key={index}>
            {<Switch
              checkedChildren="有效"
              unCheckedChildren="无效"
              defaultChecked={rowValue == 1 ? true : false}
              key={row.id}
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
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.time = [arr.onlineTime ? moment(arr.onlineTime * 1000) : 0, arr.offlineTime ? moment(arr.offlineTime * 1000) : 0]
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
      const list = await getMenuList({ page: { currentPage: page, pageSize: pageSize } })
      setLists(list.data)
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
    if (source == "add") {
      let params = {
        ...val,
        onlineTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : val.onlineTime,
        offlineTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : val.offlineTime,
        status: val.status ? 1 : 2
      }
      addArmour(params)
    } else if (source == "edit") {
      let params = {
        ...currentItem,
        ...val,
        onlineTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : val.onlineTime,
        offlineTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : val.offlineTime,
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
    addMenuList(params).then(res => {
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
    updateMenuList(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        delMenuList({ id: row.id }).then(res => {
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
  return (
    <div className="loginVip">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>菜单配置</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={32} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1500, y: '75vh' }}
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
              <Form.Item label="默认图片" name="defPicUrl" rules={[{ required: true, message: '请上传默认图片' }]}>
                <div style={{ display: "flex", alignItems: "center" }}>

                  <Input defaultValue={formRef.getFieldValue("defPicUrl")} key={formRef.getFieldValue("defPicUrl")}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ defPicUrl: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('defPicUrl', file, newItem)}
                    imageUrl={getUploadFileImageUrlByType('defPicUrl')}
                  />
                </div>

              </Form.Item>
              <Form.Item label="插入位置" name="index" rules={[{ required: true, message: '请输入插入位置' }]}>
                <InputNumber placeholder="请输入插入位置" min={0} />
              </Form.Item>
              <Form.Item label="无焦点图片" name="noFocPicUrl">
                <div style={{ display: "flex", alignItems: "center" }}>

                  <Input defaultValue={formRef.getFieldValue("noFocPicUrl")} key={formRef.getFieldValue("noFocPicUrl")}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ noFocPicUrl: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('noFocPicUrl', file, newItem)}
                    imageUrl={getUploadFileImageUrlByType('noFocPicUrl')}
                  />
                </div>
              </Form.Item>
              <Form.Item label="焦点图片" name="focPicUrl">
                <div style={{ display: "flex", alignItems: "center" }}>

                  <Input defaultValue={formRef.getFieldValue("focPicUrl")} key={formRef.getFieldValue("focPicUrl")}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ focPicUrl: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('focPicUrl', file, newItem)}
                    imageUrl={getUploadFileImageUrlByType('focPicUrl')}
                  />
                </div>
              </Form.Item>
              <Form.Item label="上下线时间" name="time">
                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
              </Form.Item>
              {/* <Form.Item label="H5地址" name="webUrl" rules={[{ required: true, message: '请输入H5地址' }]}>
                <Input placeholder="请输入H5地址" />
              </Form.Item> */}
              <Form.Item label="H5地址" name="webUrl">
                <div style={{ display: "flex", alignItems: "center" }}>

                  <Input defaultValue={formRef.getFieldValue("webUrl")} key={formRef.getFieldValue("webUrl")}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ webUrl: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('webUrl', file, newItem)}
                    contents={"menu"}
                    // imageUrl={getUploadFileImageUrlByType('webUrl')}
                  />
                </div>
              </Form.Item>
              <Form.Item label="标签" name="tags">
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
              <Form.Item label="排序" name="sort">
                <InputNumber placeholder="请输入排序" />
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