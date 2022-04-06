import React, { useState, useEffect, useReducer } from 'react'
import { getMineGrid, editMineGrid, addMineGrid, delMineGrid, requestNewAdTagList, getChannel, getProgramsList,copyMineGrid } from 'api'
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
  // console.log(props,"props============》")
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
  const [channleList, setChannel] = useState([])
  const [programsList, setPrograms] = useState([])
  const [defaultPrograms, setDefaultPrograms] = useState([])
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
  const typeList = [
    { key: 1, value: "通用配置" },
    { key: 2, value: "观看历史" },
    { key: 3, value: "家庭号" },
    { key: 4, value: "登录" },
    { key: 5, value: "领金币" },
    { key: 6, value: "现金收益" },
  ]
  // 左上、左下、中心、右上、右下、垂直居中、横向居中
  const positionList = [
    { key: 1, value: '左上', },
    { key: 2, value: '左下', },
    { key: 3, value: '中心', },
    { key: 4, value: '右上', },
    { key: 5, value: '右下', },
    { key: 6, value: '垂直居中', },
    { key: 7, value: '横向居中', }
  ]
  const jumpType = [
    { key: 1, value: "跳转到频道" },
    { key: 6, value: "跳转到菜单" },
    { key: 8, value: "跳转到好看分类" },
    { key: 16, value: "跳转到图片" },
    { key: 11, value: "跳转到视频" },
    { key: 14, value: "跳转到原生页" },
  ]
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "跳转类型",
      dataIndex: "jumpType",
      key: "jumpType",
    },
    {
      title: "宽度",
      dataIndex: "width",
      key: "width",
      // render: (rowValue, row, index) => {
      //   return (
      //     // 栏目类型 1=用户属性，2=观看历史，3=其他数据
      //     <div>{rowValue == 1 ? "用户属性" : rowValue == 2 ? "观看历史" : rowValue == 3 ? "其他数据" : "未知"}</div>
      //   )
      // }
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
                submitForm(info)
              }}
            />}</div>
        )
      }
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right', width: 220,
      render: (rowValue, row, index) => {
        return (
          <div>
             <Button size="small" onClick={() => copyMineGridFunc(row)}>复制</Button>
            <Button size="small" type="primary" style={{ margin: " 0 10px" }}
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.status = row.status == 1 ? true : false
                arr.time = [arr.startTime ? moment(arr.startTime * 1000) : 0, arr.endTime ? moment(arr.endTime * 1000) : 0]
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
      if (!props.location.params) {
        return props.history.go(-1)
      }
      const list = await getMineGrid({ page: { currentPage: page, pageSize: pageSize } }, { id: props.location.params.id })
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
  const submitForm = (val) => {//表单提交
    console.log(val)
    if (source == "add") {
      let params = {
        ...val,
        status: val.status ? 1 : 2,
        startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : "",
        endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : "",
        channelSpecial: val.channelSpecial ? 1 : 2
      }
      addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...formRef.getFieldValue(),
        ...val,
        status: val.status ? 1 : 2,
        startTime: val.time ? parseInt(val.time[0].valueOf() / 1000) : 0,
        endTime: val.time ? parseInt(val.time[1].valueOf() / 1000) : 0,
        channelSpecial: val.channelSpecial ? 1 : 2
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
    addMineGrid(params, { id: props.location.params.id }).then(res => {
      message.success("新增成功")
      forceUpdate()
    })
  }
  const copyMineGridFunc = (row) => {
    Modal.confirm({
      title: `确认复制该条数据吗？`,
      onOk: () => {
        copyMineGrid({id:row.id},{ id: props.location.params.id }).then(res => {
          message.success("复制成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
    
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
  }
  const updateOfflineProgramFunc = (params) => {
    editMineGrid(params, { id: props.location.params.id }).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      onOk: () => {
        delMineGrid({ id: row.id }).then(res => {
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
        console.log(res.data.data, "a")
        let b = []
        for (const [key, value] of a) {
          b.push({ label: util.formatTime(value.start_time, "", 2) + " " + value.name + " " + value.channel_id, value: key })
        }
        setPrograms(b)
        setDefaultPrograms(res.data.data)
      }
    })
  }
  return (
    <div className="loginVip">
      <Card title={
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/mms/TVConfig/mine">我的</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>

        </Breadcrumb>
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
              <Form.Item label="类型" name="type" rules={[{ required: true, message: '请输入类型' }]}>
                <Select allowClear placeholder="请选择类型" onChange={() => forceUpdatePages()}>
                  {
                    typeList.map((r, i) => {
                      return <Option value={r.key} key={r.key}>{r.value}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="上下线时间" name='time'>
                <RangePicker showTime placeholder={['上线时间', '下线时间']} />
              </Form.Item>

              {
                formRef.getFieldValue("type") == 1 &&
                <>
                  <Form.Item label="跳转类型" name="jumpType" rules={[{ required: true, message: '请输入跳转类型' }]}>
                    <Select allowClear placeholder="请选择类型" onChange={() => forceUpdatePages()}>
                      {
                        jumpType.map((r, i) => {
                          return <Option value={r.key} key={r.key}>{r.value}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  {
                    (formRef.getFieldValue("jumpType") == 1 || formRef.getFieldValue("jumpType") == 11) &&
                    <>
                      <Form.Item label="频道" name="channelCode">
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
                          onChange={(e)=>{
                            let arr = channleList.filter(item=>item.code == e)
                            if(arr.length>0){
                              formRef.setFieldsValue({"picUrl":arr[0].posterUrl})
                            }
                            forceUpdatePages()
                          }}
                        >
                          {
                            channleList.map((r, i) => {
                              return <Option value={r.code} key={i}>{r.name}------{r.code}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                      {
                        formRef.getFieldValue("jumpType") == 11 &&
                        <Form.Item label="请选择视频" name="">
                          <Select
                            placeholder="请选择视频"
                            allowClear
                            {...selectProps}
                            onSearch={(val) => {
                              if (privateData.inputTimeOutVal) {
                                clearTimeout(privateData.inputTimeOutVal);
                                privateData.inputTimeOutVal = null;
                              }
                              privateData.inputTimeOutVal = setTimeout(() => {
                                if (!privateData.inputTimeOutVal) return;
                                getProgramsListFunc(formRef.getFieldValue("channelCode"), val)
                              }, 1000)
                            }}
                            onChange={(r) => {
                              let info = defaultPrograms[r]
                              formRef.setFieldsValue({ channelSubTitle: info.name, channelStartTime: info.start_time, channelEndTime: info.end_time })
                              forceUpdatePages()
                            }}
                          >
                            {
                              programsList.map((r, i) => {
                                return (
                                  <Option value={r.value} key={r.value}>{r.label}</Option>
                                )
                              })
                            }
                          </Select>
                        </Form.Item>
                      }
                      <Form.Item label="副标题" name="channelSubTitle" >
                        <Input placeholder="请输入副标题" />
                      </Form.Item>
                      <Form.Item label="背景色" name="channelBackgroundColor" >
                        <Input placeholder="请输入背景色" />
                      </Form.Item>
                      <Form.Item label="是否特殊频道" name="channelSpecial" valuePropName="checked">
                        <Switch checkedChildren="是" unCheckedChildren="不是" ></Switch>
                      </Form.Item>
                    </>

                  }
                  {
                    formRef.getFieldValue("jumpType") == 6 &&
                    <>
                      <Form.Item label="菜单" name="menuId">
                        <Select
                          placeholder="请输入菜单"
                          allowClear
                          {...selectProps}
                        >
                          {
                            util.jumpMenuTypes.map((r, i) => {
                              return <Option value={r.key} key={i}>{r.value}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </>
                  }
                  {
                    formRef.getFieldValue("jumpType") == 8 &&
                    <>
                      <Form.Item label="好看分类" name="goodLookType">
                        <Select
                          placeholder="请输入菜单"
                          allowClear
                          {...selectProps}
                        >
                          {
                            util.goodLookTypes.map((r, i) => {
                              return <Option value={r.key} key={i}>{r.value}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </>
                  }
                  {
                    formRef.getFieldValue("jumpType") == 16 &&
                    <>
                      <Form.Item label="打开图片地址" name="jumpPicUrl">
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                          <Input.TextArea defaultValue={formRef.getFieldValue("jumpPicUrl")} key={formRef.getFieldValue("jumpPicUrl")}
                            onChange={(e) => {
                              if (privateData.inputTimeOutVal) {
                                clearTimeout(privateData.inputTimeOutVal);
                                privateData.inputTimeOutVal = null;
                              }
                              privateData.inputTimeOutVal = setTimeout(() => {
                                if (!privateData.inputTimeOutVal) return;
                                formRef.setFieldsValue({ jumpPicUrl: e.target.value })
                                forceUpdatePages()
                              }, 1000)
                            }}
                          />
                          <MyImageUpload
                            getUploadFileUrl={(file, newItem) => getUploadFileUrl('jumpPicUrl', file, newItem)}
                            imageUrl={getUploadFileImageUrlByType('jumpPicUrl')}
                          />
                        </div>
                      </Form.Item>
                    </>
                  }



                </>
              }

              {
                formRef.getFieldValue("type") == 4 && //登录
                <>
                  <Form.Item label="二维码尺寸" >
                    <Form.Item label="" name="qrWidth">
                      <Input placeholder="请输入宽度" style={{ width: "200px" }} prefix="宽度" suffix="px" />
                    </Form.Item>
                    <Form.Item label="" name="qrHeight">
                      <Input placeholder="请输入高度" style={{ width: "200px" }} prefix="高度" suffix="px" />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item label="二维码坐标" >
                    <Form.Item label="" name="qrX">
                      <Input placeholder="请输入横向坐标" style={{ width: "200px" }} prefix="横" suffix="px" />
                    </Form.Item>
                    <Form.Item label="" name="qrY">
                      <Input placeholder="请输入纵向坐标" style={{ width: "200px" }} prefix="纵" suffix="px" />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item label="二维码位置" name="position">
                    <Select allowClear placeholder="请选择类型">
                      {
                        positionList.map((r, i) => {
                          return <Option value={r.key} key={r.key}>{r.value}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                </>
              }
              {
                formRef.getFieldValue("type") == 2 && //观看历史
                <>
                  <Form.Item label="-" style={{border:"1px dashed #ccc",padding:"10px"}}>
                    <Form.Item label="频道" name="channelCode">
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
                    <Form.Item label="位置" name="channelIndex">
                      <InputNumber placeholder="请输入位置" style={{ width: "200px" }} min={0} />
                    </Form.Item>
                    <Form.Item label="类型" name="channelType">
                      <Select allowClear placeholder="请选择类型">
                        <Option value={1} key={1}>推荐频道</Option>
                        <Option value={2} key={2}>填充频道</Option>
                      </Select>
                    </Form.Item>
                  </Form.Item>

                </>
              }



              <Form.Item label="图片" name="picUrl" >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <Input.TextArea defaultValue={formRef.getFieldValue("picUrl")} key={formRef.getFieldValue("picUrl")}
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
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => getUploadFileUrl('picUrl', file, newItem)}
                    imageUrl={getUploadFileImageUrlByType('picUrl')}
                  />
                </div>
              </Form.Item>
              <Form.Item label="宽度" name="width">
                <InputNumber placeholder="请输入高度" style={{ width: "200px" }} min={0} />
              </Form.Item>
              <Form.Item label="排序" name="sort">
                <InputNumber placeholder="请输入排序" style={{ width: "200px" }} min={0} />
              </Form.Item>
              <Form.Item label="状态" name="status" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" ></Switch>
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