import React, { useState, useEffect, useReducer } from 'react'
import { getLogout, updateLogout, addLogout, delLogout, requestNewAdTagList,changeLogoutState } from 'api'
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
    { key: 1, value: "????????????" },
    { key: 2, value: "????????????" },
    { key: 3, value: "????????????" },
  ]
  const columns = [
    {
      title: "??????",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "??????",
      dataIndex: "tag",
      key: "tag",
      render: (rowValue, row, index) => {
        return (
          <div>{getTagName(rowValue)}</div>
        )
      }
    },
    {
      title: "???????????????",
      dataIndex: "background",
      key: "background",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {
      title: "???????????????",
      dataIndex: "time",
      key: "time",
      width: 300,
      render: (rowValue, row, index) => {
        return (
          // ???????????? 1=???????????????2=???????????????3=????????????
          <div>{row.start ? util.formatTime(row.start, "") : "?????????"} - {row.end ? util.formatTime(row.end, "") : "?????????"}</div>
        )
      }
    },
    {
      title: "??????",
      dataIndex: "status",
      key: "status",
      render: (rowValue, row, index) => {
        return (
          <div key={rowValue}>
            {<Switch checkedChildren="??????" unCheckedChildren="??????" defaultChecked={rowValue == 1 ? true : false}
              onChange={(val) => {
                let info = JSON.parse(JSON.stringify(row))
                info.status = val ? 1 : 2
                changeLogoutStateFunc(info)
              }}
            />}</div>
        )
      }
    },
    {
      title: "??????",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "??????",
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
            >??????</Button>

            <Button danger size="small" onClick={() => delItem(row)}>??????</Button>
          </div>
        )
      }
    }
  ]
  useEffect(() => {//??????
    const fetchData = async () => {
      const list = await getLogout({ page: { currentPage: page, pageSize: pageSize } })
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
  const submitForm = (val) => {//????????????
    console.log(val)
    if (source == "add") {
      let params = {
        ...val,
        status: val.status ? 1 : 2,
        start: val.time ? parseInt(val.time[0].valueOf() / 1000) : 0,
        end: val.time ? parseInt(val.time[1].valueOf() / 1000) : 0,
      }
      addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...currentItem,
        ...val,
        status: val.status ? 1 : 2,
        start: val.time ? parseInt(val.time[0].valueOf() / 1000) : 0,
        end: val.time ? parseInt(val.time[1].valueOf() / 1000) : 0,
      }
      updateOfflineProgramFunc(params)
    }
    closeDialog()
  }
  const addOfflineProgramFunc = (params) => {
    addLogout(params).then(res => {
      message.success("????????????")
      forceUpdate()
    })
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
  }
  const updateOfflineProgramFunc = (params) => {
    updateLogout(params).then(res => {
      message.success("????????????")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `??????????????????????????????`,
      onOk: () => {
        delLogout({ id: row.id }).then(res => {
          message.success("????????????")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const changeLogoutStateFunc = (item) =>{
    let params = {
      id:item.id,
      status:item.status
    }
    changeLogoutState(params).then(res => {
      message.success("????????????")
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
            <Breadcrumb.Item>??????????????????????????????</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>??????</Button>
            <MySyncBtn type={36} name='????????????' />
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
        <Modal title="??????" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              <Form.Item label="??????" name="name" rules={[{ required: true, message: '???????????????' }]}>
                <Input placeholder="???????????????" />
              </Form.Item>
              <Form.Item label="??????" name="tag">
                <Select mode={true} allowClear showSearch placeholder="???????????????????????????"
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
              <Form.Item label="??????" name="background" rules={[{ required: true, message: '???????????????' }]}>
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
              <Form.Item label="???????????????" name='time'>
                <RangePicker showTime placeholder={['????????????', '????????????']} />
              </Form.Item>
              <Form.Item label="??????" name="sort">
                <InputNumber placeholder="???????????????" style={{ width: "200px" }} min={0} />
              </Form.Item>
              <Form.Item label="??????" name="status" valuePropName="checked">
                <Switch checkedChildren="??????" unCheckedChildren="??????" ></Switch>
              </Form.Item>



              <Form.Item {...tailLayout}>
                <Button onClick={() => closeDialog()}>??????</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  ??????
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