import React, { useState, useEffect, useReducer } from 'react'
import { getBillboard, updateBillboard, addBillboard, delBillboard, detailBillboard, checkBillboard } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker, Popover, Space, Switch } from 'antd'
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [searchWord, setSearchWord] = useState("")
  const [source, setSource] = useState("")
  const [machine, setMachine] = useState("")
  const [manual, setManual] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState("");
  const [imageList, setImageList] = useState([]);
  // const { period } = props.location.params
  const [period, setPeriod] = useState("")
  const columns = [
    {
      title: "编号",
      dataIndex: "babyNo",
      key: "babyNo",
    },
    {
      title: "萌娃名称",
      dataIndex: "babyName",
      key: "babyName",
    },
    {
      title: "萌娃描述",
      dataIndex: "babyDescirbe",
      key: "babyDescirbe",
      ellipsis: true,
    },
    {
      title: "作品",
      dataIndex: "cover",
      key: "cover",
      with: 150,
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} preview={{ visible: false }} width={100} onClick={async () => {
            let imageList = await detailBillboard({ worksCode: row.worksCode })
            setImageList(imageList.data)
            if(imageList.data.length == 0)return message.error("暂无图片集")
            setVisible(true)
          }} />
        )
      }
    },
    {
      title: "票数",
      dataIndex: "ticketNum",
      key: "ticketNum",
    },
    {
      title: "初审结果",
      dataIndex: "machineCheckStatus",
      key: "machineCheckStatus",
      render: (rowValue, row, index) => {
        return (
          <div>{rowValue == 1 ? "未审核" : rowValue == 2 ? "审核通过" : rowValue == 3 ? "审核不通过" : "未知"}</div>
        )
      }
    },
    {
      title: "人工审核",
      dataIndex: "manualCheckStatus",
      key: "manualCheckStatus",
      render: (rowValue, row, index) => {
        return (
          <div>{rowValue == 1 ? "未审核" : rowValue == 2 ? "审核通过" : rowValue == 3 ? "审核不通过" : "未知"}</div>
        )
      }
    },
    {
      title: "联系电话",
      dataIndex: "pn",
      key: "pn",
    },
    {
      title: "作品来源",
      dataIndex: "worksOrigin",
      key: "worksOrigin",
      render: (rowValue, row, index) => {
        return (
          <div>{rowValue == 1 ? "用户" : rowValue == 2 ? "系统" : "未知"}</div>
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
              onClick={async () => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                let imageList = await detailBillboard({ worksCode: arr.worksCode })
                if (imageList.data && imageList.data.length > 0) {
                  let list = []
                  imageList.data.forEach(r => {
                    list.push({ pic: r })
                  })
                  arr.imageList = list
                }
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
            <Popover content={content(row)} trigger="focus">
              <Button size="small" type="dashed" style={{ margin: " 0 10px" }}>审核</Button>
            </Popover>
            <Button danger size="small" onClick={() => delItem(row)}>删除</Button>
          </div>
        )
      }
    }
  ]
  const content = (val) => {
    return (
      <div>
        <p><Button type="link" onClick={() => checkBillboardFunc(2, val)}>通过</Button></p>
        <p><Button type="link" onClick={() => { setIsModalVisible(true); setCurrent(val) }}>不通过</Button></p>
      </div>
    )
  }
  useEffect(() => {//列表
    const fetchData = async () => {
      let period = ""
      if (props.location.params) {
        period = props.location.params.period
        setPeriod(period)
      } else {
        props.history.go(-1)
        return
      }
      let params = {
        period: period,
        keyword: searchWord,
        machineCheckStatus: machine,
        manualCheckStatus: manual,
        page: { currentPage: page, pageSize: pageSize }
      }
      const list = await getBillboard(params)
      console.log(list,"list")
      setLists(list.data)
      if(list.page){
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
  const submitForm = (val) => {//表单提交
    console.log(val, period)
    let list = []
    val.imageList.forEach(r => {
      list.push(r.pic)
    })
    val.worksPicSets = list
    let params = {
      ...formRef.getFieldValue(),
      ...val,
      period: period,
      cover: val.worksPicSets[0]
    }
    if (source == "add") {
      addFunc(params)
    } else if (source == "edit") {
      updateFunc(params)
    }
    closeDialog()
  }
  const addFunc = (params) => {
    addBillboard(params).then(res => {
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
    updateBillboard(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      onOk: () => {
        delBillboard({ id: row.id, period: period, worksCode: row.worksCode, userId: row.userId }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  const checkBillboardFunc = (type, row) => {
    let params = {
      period: period,
      manualCheckStatus: type,
    }
    if (Array.isArray(row)) {
      params.ids = row
    } else {
      params.ids = [row.id]
    }
    if (type == 3) { //审核不通过
      if (!rejectReason) return message.error("请输入拒绝原因")
      params.reason = rejectReason
      setIsModalVisible(false)
    }
    checkBillboard(params).then(res => {
      setSelectedRowKeys([])
      forceUpdate()
    })
  }
  const getUploadFileUrl = (type, file, newItem) => {
    let image_url = newItem.fileUrl;
    let obj = formRef.getFieldValue(type) || []
    obj.push({ pic: image_url })
    formRef.setFieldsValue({ [type]: obj });
    forceUpdatePages()
  }
  const onSelectChange = (e) => {
    console.log(e)
    setSelectedRowKeys(e)

  }
  // 批量通过
  const allPass = () => {
    if (selectedRowKeys.length == 0) return message.error("请选择批量数据")
    Modal.confirm({
      title: `确认批量通过这批数据吗？`,
      onOk: () => {
        checkBillboardFunc(2, selectedRowKeys)
      },
      onCancel: () => {
      }
    })
  }
  // 批量不通过
  const allReject = () => {
    if (selectedRowKeys.length == 0) return message.error("请选择批量数据")
    Modal.confirm({
      title: `确认批量不通过这批数据吗？`,
      onOk: () => {
        // checkBillboardFunc(3,selectedRowKeys)
        setCurrent(selectedRowKeys)
        setIsModalVisible(true);
      },
      onCancel: () => {
      }
    })
  }
  return (
    <div className="loginVip">
      <Breadcrumb style={{ margin: "10px", cursor: "pointer" }}>
        <Breadcrumb.Item onClick={() => props.history.go(-1)}>活动管理</Breadcrumb.Item>
        <Breadcrumb.Item>作品审核</Breadcrumb.Item>
      </Breadcrumb>
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
          <div className="everyBody">
            <div>机器初审:</div>
            <Select placeholder="机器初审状态" style={{ width: "150px" }} allowClear onChange={(e) => { setMachine(e);setPage(1); forceUpdate() }}>
              <option value={1}>未审核</option>
              <option value={2}>审核通过</option>
              <option value={3}>审核不通过</option>
            </Select>
          </div>
          <div className="everyBody">
            <div>人工审核:</div>
            <Select placeholder="人工审核状态" style={{ width: "150px" }} allowClear onChange={(e) => { setManual(e);setPage(1); forceUpdate() }}>
              <option value={1}>未审核</option>
              <option value={2}>审核通过</option>
              <option value={3}>审核不通过</option>
            </Select>
          </div>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              allPass()
            }}>批量审核通过</Button>
            <Button type="primary" style={{ margin: "0 10px" }} onClick={() => {
              allReject()
            }}>批量审核不通过</Button>
            <Button type="primary" onClick={() => {
              setSource("add")
              setOpen(true)
            }}>创建作品</Button>
            <Button type="primary" style={{ margin: "0 10px" }} onClick={()=> forceUpdate()}>刷新</Button>
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
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange
          }}
        />
        <Modal title="编辑" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              {
                source == "edit" &&
                <>
                  <Form.Item label="作品编号" name="worksCode" rules={[{ required: true, message: '请输入作品编号' }]}>
                    <Input placeholder="请输入作品编号" readOnly />
                  </Form.Item>
                  <Form.Item label="用户编号" name="babyNo" rules={[{ required: true, message: '请输入作品编号' }]}>
                    <Input placeholder="请输入作品编号" readOnly />
                  </Form.Item>
                </>
              }
              <Form.Item label="萌娃姓名" name="babyName" rules={[{ required: true, message: '请输入萌娃姓名' }]}>
                <Input placeholder="请输入萌娃姓名" />
              </Form.Item>
              <Form.Item label="联系方式" name="pn" rules={[{ required: true, message: '请输入联系方式' }]}>
                <InputNumber placeholder="请输入联系方式" style={{ width: "200px" }} />
              </Form.Item>
              <Form.Item label="萌娃描述" name="babyDescirbe" rules={[{ required: true, message: '请输入萌娃描述' }]}>
                <Input.TextArea placeholder="请输入萌娃描述" />
              </Form.Item>
              <Form.Item label="说明" name="" >
                可上传5-15张图片，其中1张作为封面图，用于首页及详情页展示拉票

                像素建议为：480px * 270px

                格式为：jpg/png
              </Form.Item>
              <Form.Item label='参赛照片'>
                <Form.List name="imageList" label='参赛照片'>
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
              <Form.Item label="票数" name="ticketNum" rules={[{ required: true, message: '请输入每天最多可投票数' }]}>
                <InputNumber min={0} placeholder="每天最多可投票数" />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button onClick={() => closeDialog()}>取消</Button>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>确定</Button>
              </Form.Item>
            </Form>
          }
        </Modal>
      </Card >
      <Modal title="确定修改审核状态为不通过吗？" visible={isModalVisible} onOk={() => {
        checkBillboardFunc(3, current)
      }} onCancel={() => {
        setIsModalVisible(false);
        setRejectReason("")
      }}>
        <Input.TextArea placeholder='审核不通过原因' autoSize={{ minRows: 3, maxRows: 10 }} value={rejectReason} showCount onInput={(e) => {
          setRejectReason(e.target.value)
        }} />
      </Modal>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
          {
            imageList.map((r, i) => {
              return <Image src={r} key={i} />
            })
          }
        </Image.PreviewGroup>
      </div>
    </div >
  )
}

export default App2