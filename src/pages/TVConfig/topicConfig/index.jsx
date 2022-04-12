import React, { useState, useEffect, useReducer } from 'react'
import { getTopic, updateTopic, addTopic, delTopic, getChannel, getProgramsList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker, Divider, Space } from 'antd'
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
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [lists, setLists] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [channleList, setChannel] = useState([])
  const [programsList, setPrograms] = useState([])
  const [defaultPro, setDefaultPro] = useState([])
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
    { key: 1, value: "频道" },
    { key: 2, value: "图片" },
    { key: 3, value: "视频" },
  ]
  const columns = [
    {
      title: "专题ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "专题标题",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "背景图",
      dataIndex: "background",
      key: "background",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
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
            {/* <Button size="small" onClick={() => copyOfflineProgramFuc(row)}>复制</Button> */}
            <Button
              style={{ margin: " 0 10px" }}
              size="small"
              type="primary"
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                // arr.time = 
                arr.blocks.forEach(r => {
                  r.contents.forEach(l => {
                    l.time = [moment(l.start * 1000), moment(l.end * 1000)]
                  })
                })
                console.log(arr, "arr")
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
      const list = await getTopic({})
      setLists(list.data)
      // setTotal(list.totalCount)
    }
    fetchData()
  }, [forceUpdateId])
  const submitForm = (val) => {//表单提交
    console.log(val)
    // return
    val.blocks.forEach(r => {
      r.contents.forEach(l => {
        l.start = l.time[0] ? parseInt(l.time[0].valueOf() / 1000) : ""
        l.end = l.time[1] ? parseInt(l.time[1].valueOf() / 1000) : ""
      })
    })
    if (source == "add") {
      let params = {
        ...val,
      }
      addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...formRef.getFieldValue(),
        ...val,
      }
      // return console.log(params, "params")
      updateOfflineProgramFunc(params)
    }
    closeDialog()
  }
  const addOfflineProgramFunc = (params) => {
    addTopic(params).then(res => {
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
    // return console.log(params)
    updateTopic(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        delTopic({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  //获取上传文件
  const getUploadFileUrl = (type, file, newItem, index, i, source) => {
    let image_url = newItem.fileUrl;
    let contObj = formRef.getFieldValue("blocks")
    if (source == "other") {
      contObj[index].contents[i][type] = image_url
      formRef.setFieldsValue({ blocks: contObj })
    } else if (source == "out") {
      contObj[index][type] = image_url
      formRef.setFieldsValue({ blocks: contObj })
    } else {
      let obj = {};
      obj[type] = image_url;
      formRef.setFieldsValue(obj);
    }
    forceUpdatePages()
  }
  //获取上传文件图片地址 
  const getUploadFileImageUrlByType = (type) => {
    let image_url = formRef.getFieldValue(type);
    return image_url ? image_url : '';
  }
  //获取频道信息
  const getChannelList = (val) => {
    let params = {
      keywords: val,
      // page: {currentPage: 1, pageSize: 50}
    }
    getChannel(params).then(res => {
      if (res.data.errCode == 0 && res.data.data) {
        setChannel(res.data.data)
      }
    })
  }
  //获取节目
  const getProgramsListFunc = (id, val) => {
    if (!val || !id) return
    let param = {
      keyword: val,
      channelId: id
    }
    getProgramsList(param).then(res => {
      if (res.data.errCode === 0) {
        let a = Object.entries(res.data.data)
        console.log(a, "a")
        let b = []
        for (const [key, value] of a) {
          b.push({ label: util.formatTime(value.start_time, "", 2) + " " + value.name + " " + value.channel_id, value: key })
        }
        setPrograms(b)
        setDefaultPro(res.data.data)
        // this.setState({
        //   programGrounp: b,
        //   defaultProgram: res.data.data
        // })
      }
    })
  }
  return (
    <div className="loginVip">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>配置管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={34} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={lists}
          scroll={{ x: 1400, y: '75vh' }}
          rowKey={item => item.id}
          // loading={loading}
          columns={columns}


        />
        <Modal title="编辑" centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout}
              name="taskForm"
              form={formRef}
              onFinish={(e) => submitForm(e)}>
              <Form.Item label="专题名称" name="name" rules={[{ required: true, message: '请输入专题名称' }]}>
                <Input placeholder="请输入专题名称" />
              </Form.Item>
              <Form.Item label="专题字色" name="fontColor">
                <Input placeholder="请输入专题字色" />
              </Form.Item>
              <Form.Item label="播放器内容" name="playType" rules={[{ required: true, message: '请输入播放器内容' }]}>
                <Select allowClear placeholder="请选择播放器内容" onChange={() => forceUpdatePages()}>
                  {
                    playContent.map((r, i) => {
                      return <Option value={r.key} key={r.key}>{r.value}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              {
                formRef.getFieldValue("playType") == 1 &&
                <Form.Item label="频道" name="playTarget" rules={[{ required: true, message: '请选择频道' }]}>
                  <Select
                    placeholder="请输入频道名称"
                    allowClear
                    {...selectProps}
                    onSearch={(val) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        getChannelList(val)
                      }, 1000)
                    }}
                  // onChange={(e) => {
                  //   console.log(e)
                  //   formRef.setFieldsValue({ "channelId": e })
                  // }}
                  >
                    {
                      channleList.map((r, i) => {
                        return <Option value={r.code} key={i}>{r.name}------{r.code}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              }

              {
                formRef.getFieldValue("playType") == 3 &&
                <Form.Item label="视频" name="playTarget" rules={[{ required: true, message: '请输入视频' }]}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>

                    <Input.TextArea placeholder="请输入视频地址" defaultValue={getUploadFileImageUrlByType('playTarget')} key={getUploadFileImageUrlByType('playTarget')}
                      onChange={(e) => {
                        if (privateData.inputTimeOutVal) {
                          clearTimeout(privateData.inputTimeOutVal);
                          privateData.inputTimeOutVal = null;
                        }
                        privateData.inputTimeOutVal = setTimeout(() => {
                          if (!privateData.inputTimeOutVal) return;
                          formRef.setFieldsValue({ playTarget: e.target.value })
                          forceUpdatePages()
                        }, 1000)
                      }}
                    />
                    <MyImageUpload
                      getUploadFileUrl={(file, newItem) => { getUploadFileUrl('playTarget', file, newItem) }}
                    // imageUrl={getUploadFileImageUrlByType('playTarget')} 
                    />
                  </div>

                </Form.Item>
              }
              <Form.Item label="封面图" name="cover" rules={[{ required: true, message: '请上传封面图' }]}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>

                  <Input.TextArea placeholder="请输入封面图地址" defaultValue={getUploadFileImageUrlByType('cover')} key={getUploadFileImageUrlByType('cover')}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ cover: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('cover', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('cover')} />
                </div>

              </Form.Item>

              <Form.Item label="播放器标题" name="playTitle" rules={[{ required: true, message: '请输入播放器标题' }]}>
                <Input placeholder="请输入播放器标题" />
              </Form.Item>
              {/* mms/channel/programs/list */}
              <Form.Item label="专题背景图" name="background" rules={[{ required: true, message: '请输入专题背景图' }]}>
                <MyImageUpload
                  getUploadFileUrl={(file, newItem) => { getUploadFileUrl('background', file, newItem) }}
                  imageUrl={getUploadFileImageUrlByType('background')} />
                <Input placeholder="请输入专题背景图" defaultValue={getUploadFileImageUrlByType('background')} key={getUploadFileImageUrlByType('background')}
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
              </Form.Item>


              <Divider plain>板块配置</Divider>

              <Form.Item
                label="板块创建"
              // name="voters"

              >
                <Form.List name="blocks" rules={[{ required: true, message: '板块创建' }]}>
                  {(fields, { add, remove }) => (
                    <>

                      {fields.map((field, index) => (
                        <>
                          <Divider key={index+fields.length}>板块{index + 1}</Divider>

                          <Space key={field.key} align="baseline" style={{ flexWrap: "wrap", alignItems: "flex-start" }} className="border_box">
                            <Form.Item {...field} label="标题" name={[field.name, 'titleType']} fieldKey={[field.fieldKey, 'titleType']}>
                              <Select style={{ width: "200px" }} placeholder="请选择内容类型"
                                onChange={() => forceUpdatePages()}
                              >
                                <Option value={1} key={1}>文字</Option>
                                <Option value={2} key={2}>图片</Option>
                              </Select>
                            </Form.Item>

                            {
                              formRef.getFieldValue("blocks")[index] && formRef.getFieldValue("blocks")[index].titleType == 1 &&
                              <Form.Item {...field} label="" name={[field.name, 'title']} fieldKey={[field.fieldKey, 'title']}>
                                <Input placeholder="请填写标题" style={{ width: "200px" }} />
                              </Form.Item>
                            }
                            {
                              formRef.getFieldValue("blocks")[index] && formRef.getFieldValue("blocks")[index].titleType == 2 &&
                              <Form.Item {...field} label="" name={[field.name, 'title']} fieldKey={[field.fieldKey, 'title']}>
                                <MyImageUpload
                                  getUploadFileUrl={(file, newItem) => { getUploadFileUrl('title', file, newItem, index, "", "out") }}
                                  imageUrl={
                                    formRef.getFieldValue("blocks")[index] && formRef.getFieldValue("blocks")[index].title
                                  } />
                              </Form.Item>
                            }
                            <Form.Item {...field} label="排序" name={[field.name, 'sort']} fieldKey={[field.fieldKey, 'sort']}>
                              <InputNumber placeholder='排序' style={{ width: "100px" }} min={0} />
                            </Form.Item>
                            <Form.Item {...field} label="列表类型" name={[field.name, 'composeType']} fieldKey={[field.fieldKey, 'composeType']}>
                              <Radio.Group style={{ width: "600px" }}>
                                <Radio value={2}>横排列表</Radio>
                                <Radio value={1}>双纵列表</Radio>

                              </Radio.Group>
                            </Form.Item>


                            <Form.Item
                              label="内容"
                              name=""
                            >
                              <Form.List name={[field.name, 'contents']} fieldKey={[field.fieldKey, 'contents']}>
                                {(fieldsCont, { add, remove }) => (
                                  <>
                                    {fieldsCont.map((fieldItem, i) => (
                                      <>
                                        <Divider >内容{i + 1}</Divider>
                                        <Space key={fieldItem.key} align="baseline" wrap="false" direction="horizontal" className='every_box'>
                                          <Form.Item {...fieldItem} label="" name={[fieldItem.name, 'contentType']} fieldKey={[fieldItem.fieldKey, 'contentType']}>
                                            <Select style={{ width: "150px" }} placeholder="请选择类型" onChange={(e) => forceUpdatePages()}>
                                              {/* 1=频道;2 =节日*/}
                                              <Option value={1} key={1}>频道</Option>
                                              <Option value={2} key={2}>频道（节目）</Option>
                                            </Select>
                                          </Form.Item>
                                          {
                                            // formRef.getFieldValue("blocks")[index].contents && formRef.getFieldValue("blocks")[index].contents[i].contentType &&
                                            <Form.Item {...fieldItem} label="" style={{ width: "250px" }} name={[fieldItem.name, 'channelCode']} fieldKey={[fieldItem.fieldKey, 'channelCode']} rules={[{ required: true, message: '请选择频道' }]}>
                                              <Select
                                                placeholder="请输入频道名称"
                                                allowClear
                                                {...selectProps}
                                                onSearch={(val) => {
                                                  if (privateData.inputTimeOutVal) {
                                                    clearTimeout(privateData.inputTimeOutVal);
                                                    privateData.inputTimeOutVal = null;
                                                  }
                                                  privateData.inputTimeOutVal = setTimeout(() => {
                                                    if (!privateData.inputTimeOutVal) return;
                                                    getChannelList(val)
                                                  }, 1000)
                                                }}
                                              >
                                                {
                                                  channleList.map((r, i) => {
                                                    return <Option value={r.code} key={i}>{r.name}------{r.code}</Option>
                                                  })
                                                }
                                              </Select>
                                            </Form.Item>
                                          }

                                          {
                                            formRef.getFieldValue("blocks")[index].contents && formRef.getFieldValue("blocks")[index].contents[i] && formRef.getFieldValue("blocks")[index].contents[i].contentType == 2 &&
                                            <Form.Item label="" name={[fieldItem.name, 'programId']} fieldKey={[fieldItem.fieldKey, 'programId']} style={{ width: "250px", flexWrap: "nowrap" }}>
                                              <Select
                                                placeholder="请输入节目名称"
                                                allowClear
                                                {...selectProps}
                                                onSearch={(val) => {
                                                  if (privateData.inputTimeOutVal) {
                                                    clearTimeout(privateData.inputTimeOutVal);
                                                    privateData.inputTimeOutVal = null;
                                                  }
                                                  privateData.inputTimeOutVal = setTimeout(() => {
                                                    if (!privateData.inputTimeOutVal) return;
                                                    getProgramsListFunc(formRef.getFieldValue("blocks")[index].contents[i].channelCode, val)
                                                  }, 1000)
                                                }}
                                                onChange={(e) => {
                                                  let arr = programsList.filter(item => item.value == e)
                                                  if (arr.length > 0) {
                                                    let info = formRef.getFieldValue("blocks")
                                                    let obj = defaultPro[arr[0].value]
                                                    info[index].contents[i].startTime = obj.start_time
                                                    info[index].contents[i].endTime = obj.end_time
                                                    info[index].contents[i].programName = obj.name
                                                    formRef.setFieldsValue({ blocks: info })
                                                  }
                                                }}
                                              >
                                                {
                                                  programsList.map((r, i) => {
                                                    return (
                                                      <Option value={r.value} key={i}>{r.label}</Option>
                                                    )
                                                  })
                                                }
                                              </Select>
                                            </Form.Item>
                                          }
                                          <>
                                            <Form.Item {...fieldItem} label="封面" name={[fieldItem.name, 'cover']} fieldKey={[fieldItem.fieldKey, 'cover']}>
                                              <MyImageUpload
                                                getUploadFileUrl={(file, newItem) => { getUploadFileUrl('cover', file, newItem, index, i, "other") }}
                                                imageUrl={
                                                  formRef.getFieldValue("blocks")[index] && formRef.getFieldValue("blocks")[index].contents[i] && formRef.getFieldValue("blocks")[index].contents[i].cover
                                                } />
                                            </Form.Item>
                                            <Form.Item {...fieldItem} label="标题" name={[fieldItem.name, 'title']} fieldKey={[fieldItem.fieldKey, 'title']}>
                                              <Input placeholder="请输入标题" />
                                            </Form.Item>
                                            <Form.Item {...fieldItem} label="描述" name={[fieldItem.name, 'desc']} fieldKey={[fieldItem.fieldKey, 'desc']}>
                                              <Input.TextArea placeholder="请输入描述" />
                                            </Form.Item>
                                            <Form.Item label="开始时间-结束时间"
                                              name={[fieldItem.name, 'time']} fieldKey={[fieldItem.fieldKey, 'time']}
                                            // rules={[{ required: true, message: '请选择结束时间' }]}
                                            >
                                              <RangePicker showTime></RangePicker>
                                            </Form.Item>

                                          </>

                                          <div style={{ position: "absolute", right: "10px", top: "10px" }}>
                                            <MinusCircleOutlined onClick={() => remove(fieldItem.name)} />
                                          </div>
                                        </Space>
                                      </>

                                    ))}

                                    <Form.Item>
                                      <Button type="primary" style={{ marginTop: "20px" }} onClick={() => { add() }} block icon={<PlusOutlined />}>
                                        新增内容
                                      </Button>
                                    </Form.Item>
                                  </>
                                )}
                              </Form.List>
                            </Form.Item>
                            <Button style={{ width: "fit-content", position: "absolute", right: "10px", top: "10px" }} danger onClick={() => remove(field.name)} block icon={<MinusCircleOutlined />}>
                              删除板块{index + 1}
                            </Button>
                          </Space>

                        </>


                      ))}

                      <Form.Item>
                        <Button style={{ marginTop: "20px" }} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          新增内容板块
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
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