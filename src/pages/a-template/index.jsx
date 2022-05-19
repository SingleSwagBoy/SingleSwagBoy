
/*
模版文件，
*/



import React, { useState, useEffect, useReducer } from 'react'
import { getFunc, update, add, delFunc, requestNewAdTagList,changeFunc } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker, Divider, Space, Switch } from 'antd'
import { Link } from 'react-router-dom'
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
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
  const [tagList, setTagList] = useState([])
  const selectProps = {
    optionFilterProp: "children",
    // filterOption(input, option){
    //   return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    // },
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
  const playContent = [
    { key: 1, value: "用户数据" },
    { key: 2, value: "观看历史" },
    { key: 3, value: "其他类型" },
  ]
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
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
      title: "图片缩略图",
      dataIndex: "background",
      key: "background",
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
          // 栏目类型 1=用户属性，2=观看历史，3=其他数据
          <div>{row.start ? util.formatTime(row.start, "") : "未配置"} - {row.end ? util.formatTime(row.end, "") : "未配置"}</div>
        )
      }
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
                changeFuncFunc(info)
              }}
            />}</div>
        )
      }
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right', width: 200,
      render: (rowValue, row, index) => {
        return (
          <div>
            <Button size="small" type="primary" style={{ margin: " 0 10px" }}
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.time = [arr.start ? moment(arr.start * 1000) : 0, arr.end ? moment(arr.end * 1000) : 0]
                arr.status = row.status == 1 ? true : false
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
  useEffect(() => {//列表
    const fetchData = async () => {
      const list = await getFunc({ page: { currentPage: page, pageSize: pageSize } })
      setLists(list.data)
      setTotal(list.page.totalCount)
      let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      setTagList(arr.data)
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (page, pageSize) => {
    setPage(page)
    setPageSize(pageSize)
    forceUpdate()
  }
  const getTagName = (name) => {
    let arr = tagList.filter(item => item.code == name)
    if (arr.length > 0) {
      return arr[0].name
    } else {
      return "-"
    }
  }
  const submitForm = (val) => {//表单提交
    console.log(val)
    let params = {
      ...formRef.getFieldValue(),
      ...val,
      status: val.status ? 1 : 2,
      start: val.time ? parseInt(val.time[0].valueOf() / 1000) : 0,
      end: val.time ? parseInt(val.time[1].valueOf() / 1000) : 0,
    }
    if (source == "add") {
      addFunc(params)
    } else if (source == "edit") {
      updateFunc(params)
    }
    closeDialog()
  }
  const addFunc = (params) => {
    add(params).then(res => {
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
    update(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      onOk: () => {
        delFunc({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const changeFuncFunc = (item) =>{
    let params = {
      id:item.id,
      status:item.status
    }
    changeFunc(params).then(res => {
      message.success("修改成功")
      forceUpdate()
    })
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
            <Breadcrumb.Item>退出登录（重新进入）</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={36} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1300, y: '75vh' }}
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
              <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="请输入名称" />
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
                  {
                    tagList.map((item, index) => (
                      <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="图片" name="background" rules={[{ required: true, message: '请输入名称' }]}>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <Input.TextArea defaultValue={formRef.getFieldValue("background")} key={formRef.getFieldValue("background")}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ background: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('background', file, newItem)}
                    imageUrl={getUploadFileImageUrlByType('background')}
                  />
                </div>
              </Form.Item>
              <Form.Item label="上下线时间" name='time'>
                <RangePicker showTime placeholder={['上线时间', '下线时间']} />
              </Form.Item>
              <Form.Item label="排序" name="sort">
                <InputNumber placeholder="请输入排序" style={{ width: "200px" }} min={0} />
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