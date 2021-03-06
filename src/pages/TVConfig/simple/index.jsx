import React, { useState, useEffect, useReducer } from 'react'
import { getList, updateList, addList, deleteConfig, requestNewAdTagList, getLockList } from 'api'
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
  const keyParams = "CHANNEL_GROUP_SIMPLE"
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
  const [channelTemp, setChannelTemp] = useState([])
  const selectProps = {
    optionFilterProp: "children",
    filterOption(input, option){
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
 
  const playContent = [
    { key: 1, value: "????????????" },
    { key: 2, value: "????????????" },
    { key: 3, value: "????????????" },
  ]
  const columns = [
    {
      title: "??????",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "???????????????",
      dataIndex: "titleUrl",
      key: "titleUrl",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {
      title: "?????????",
      dataIndex: "groupName",
      key: "groupName",
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
      title: "??????",
      dataIndex: "sort",
      key: "sort",
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
                updateOfflineProgramFunc(info)
              }}
            />}</div>
        )
      }
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
      const list = await getList({ key: keyParams })
      setLists(list.data.data)
    }
    fetchData()
  }, [forceUpdateId])
  useEffect(() => {//??????
    const fetchData = async () => {
      let arr = await requestNewAdTagList({ currentPage: 1, pageSize: 999999, })
      setTagList(arr.data)
      let temp = await getLockList({channelTemplateId: 0,name: "",page: {currentPage: 1, isPage: 9, pageSize: 1000},status: 1})
      setChannelTemp(temp.data.data)
    }
    fetchData()
  }, [])
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
    let list = channelTemp.filter(item=>item.code == val.groupCode)
    val.groupName = list[0].name
    if (source == "add") {
      let params = {
        ...val,
        status: val.status ? 1 : 2,
      }
      addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...formRef.getFieldValue(),
        ...val,
        status: val.status ? 1 : 2,
      }
      updateOfflineProgramFunc(params)
    }
    closeDialog()
  }
  const addOfflineProgramFunc = (params) => {
    addList({ key: keyParams }, params).then(res => {
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
    updateList({key:keyParams,id:params.indexId},params).then(res => {
      message.success("????????????")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `??????????????????????????????`,
      onOk: () => {
        deleteConfig({ key: keyParams, id: row.indexId }).then(res => {
          message.success("????????????")
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
            <Breadcrumb.Item>????????????</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>??????</Button>
            <MySyncBtn type={7} name='????????????' params={{key:keyParams}} />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1200, y: '75vh' }}
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
              <Form.Item label="??????" name="title" rules={[{ required: true, message: '???????????????' }]}>
                <Input placeholder="???????????????" />
              </Form.Item>
              <Form.Item label="??????" name="tag">
                <Select mode={true} allowClear showSearch placeholder="???????????????????????????" {...selectProps}>
                  {
                    tagList.map((item, index) => (
                      <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="???????????????" name="groupCode" rules={[{ required: true, message: '????????????????????????' }]}>
                <Select mode={true} allowClear showSearch placeholder="????????????????????????" {...selectProps}>
                  {
                    channelTemp.map((r, index) => {
                      return <Option value={r.code} key={r.id}>{r.name +"----"+ r.code}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="??????" name="titleUrl">
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
                    imageUrl={getUploadFileImageUrlByType('titleUrl')}
                  />
                </div>
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