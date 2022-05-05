import React, { useState, useEffect, useReducer } from 'react'
import { getMine, editMine, addMine, delMine } from 'api'
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
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
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
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "高度",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "宽度间隙",
      dataIndex: "space",
      key: "space",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (rowValue, row, index) => {
        return (
          // 栏目类型 1=用户属性，2=观看历史，3=其他数据
          <div>{rowValue == 1 ? "用户属性" : rowValue == 2 ? "观看历史" : rowValue == 3 ? "其他数据" : "未知"}</div>
        )
      }
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
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
      fixed: 'right', width: 200,
      render: (rowValue, row, index) => {
        return (
          <div>
            <Button size="small" type="primary"
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                // arr.status = row.status == 1 ? true : false
                arr.isShowTitle = row.isShowTitle == 1 ? true : false
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
            {/* <Button size="small" style={{ margin: " 0 10px" }} onClick={() => props.history.push(`/mms/TVConfig/detail/${row.id}`)}>详情</Button> */}
            <Button size="small" style={{ margin: " 0 10px" }} onClick={() => props.history.push({ pathname: "/mms/TVConfig/detail", params: { id: row.id, isHistory: row.type == 2 ? true : false } })}>详情</Button>
            <Button danger size="small" onClick={() => delItem(row)}>删除</Button>
          </div>
        )
      }
    }
  ]
  useEffect(() => {//列表
    const fetchData = async () => {
      const list = await getMine({ page: { currentPage: page, pageSize: pageSize } })
      setLists(list.data)
      setTotal(list.page.totalCount)
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
        isShowTitle: val.isShowTitle ? 1 : 2
      }
      addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...currentItem,
        ...val,
        isShowTitle: val.isShowTitle ? 1 : 2
      }
      updateOfflineProgramFunc(params)
    } else {
      let params = {
        ...val,
      }
      updateOfflineProgramFunc(params)
    }
    closeDialog()
  }
  const addOfflineProgramFunc = (params) => {
    addMine(params).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
  }
  const updateOfflineProgramFunc = (params) => {
    editMine(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      onOk: () => {
        delMine({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const getUploadFileUrl = (type, file, newItem) => {
    let that = this;
    let image_url = newItem.fileUrl;
    // 创建对象
    // var img = new Image();
    // // 改变图片的src
    // img.src = image_url;
    // // 加载完成执行
    // img.onload = () => {
    //   // 打印
    //  console.log(img.width,img.height,"-------")
    // };
    let obj = {};
    obj[type] = image_url;
    console.log(obj)
    formRef.setFieldsValue(obj);
    forceUpdatePages()
  }
  const getImageSize = (width, height) => {
    console.log(width, height)
    formRef.setFieldsValue({titleWidth:width,titleHeight:height});
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
            <Breadcrumb.Item>我的</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={35} name='同步缓存' />
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
              <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="请输入标题" />
              </Form.Item>
              <Form.Item label="高度" name="height" rules={[{ required: true, message: '请输入高度' }]}>
                <InputNumber placeholder="请输入高度" style={{ width: "200px" }} min={0} suffix="PX" />
              </Form.Item>
              <Form.Item label="间隙" name="space" rules={[{ required: true, message: '请输入间隙' }]}>
                <InputNumber placeholder="请输入间隙" style={{ width: "200px" }} min={0} />
              </Form.Item>
              <Form.Item label="排序" name="sort">
                <InputNumber placeholder="请输入排序" style={{ width: "200px" }} min={0} />
              </Form.Item>
              <Form.Item label="打开图片地址" name="titleUrl">
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <Input.TextArea defaultValue={formRef.getFieldValue("titleUrl")} key={formRef.getFieldValue("titleUrl")}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ titleUrl: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('titleUrl', file, newItem)}
                    imgSize = {true}
                    getImageSize={(width, height) => getImageSize(width, height)}
                    imageUrl={getUploadFileImageUrlByType('titleUrl')}
                  />
                </div>
              </Form.Item>
              <Form.Item label="图片宽" name="titleWidth">
                <InputNumber placeholder="请输入排序" style={{ width: "200px" }} min={0} addonAfter="px" />
              </Form.Item>
              <Form.Item label="图片高" name="titleHeight">
                <InputNumber placeholder="请输入排序" style={{ width: "200px" }} min={0} addonAfter="px" />
              </Form.Item>
              <Form.Item label="显示标题" name="isShowTitle" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" ></Switch>
              </Form.Item>
              <Form.Item label="类型" name="type">
                <Select allowClear placeholder="请选择类型" onChange={() => forceUpdatePages()}>
                  {
                    playContent.map((r, i) => {
                      return <Option value={r.key} key={r.key}>{r.value}</Option>
                    })
                  }
                </Select>
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