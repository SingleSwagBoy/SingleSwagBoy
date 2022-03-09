import React, { useState, useEffect, useReducer } from 'react'
import { getOfflineProgram, updateOfflineProgram, deleteConfig, addOfflineProgram, delOfflineProgram, requestNewAdTagList, getApkList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, DatePicker, Switch, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./style.css"
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
  const [apkList, setApkList] = useState([])
  const [tagList, setTagList] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [openDailog, setOpen] = useState(false)
  const [currentItem, setCurrent] = useState({})
  const [source, setSource] = useState("")
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
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "下线图",
      dataIndex: "bgPicUrl",
      key: "bgPicUrl",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100} />
        )
      }
    },
    {
      title: "运营APK",
      dataIndex: "apkId",
      key: "apkId"
    },
    {
      title: "运营标签",
      dataIndex: "operatorTag",
      key: "operatorTag",
      render: (rowValue, row, index) => {
        return (
          <div>{getTagName(rowValue)}</div>
        )
      }
    },
    {
      title: "风险标签",
      dataIndex: "tag",
      key: "tag",
      render: (rowValue, row, index) => {
        return (
          <div>{getTagName(rowValue)}</div>
        )
      }
    },
    // {
    //   title: "仅下线最新版本",
    //   dataIndex: "isOfflineLastestOnly",
    //   key: "isOfflineLastestOnly",
    //   render: (rowValue, row, index) => {
    //     return (
    //       <div>{<Switch
    //         checkedChildren="是"
    //         unCheckedChildren="否"
    //         defaultChecked={rowValue == 1 ? true : false}
    //         key={rowValue}
    //         onChange={(val) => {
    //           let info = JSON.parse(JSON.stringify(row))
    //           info.isOfflineLastestOnly = val?1:2
    //           submitForm(info)
    //         }}
    //       />}</div>
    //     )
    //   }
    // },
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
            key={rowValue}
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
      fixed: 'right', width: 300,
      render: (rowValue, row, index) => {
        return (
          <div>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                console.log(row)
                let arr = JSON.parse(JSON.stringify(row))
                arr.time = [moment(arr.startTime), moment(arr.endTime)]
                arr.showType = arr.showType == 1 ? true : false
                arr.isOpenSelfBuild = arr.isOpenSelfBuild == 1 ? true : false
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
            <Button size="small" type="dashed" style={{ margin: "0 10px" }}>
              {/* <Link to={`/mms/offline/detail?id=${row.id}&name=${row.name}`}>设置下线频道</Link> */}
              <Link to={{ pathname: '/mms/offline/detail', query: { id: row.id, name: row.name } }}>设置下线频道</Link>
            </Button>
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
      let list = await getApkList({ page: { isPage: 9 } })
      setApkList(list.data)
    }
    fetchTagData()
  }, [])
  useEffect(() => {//列表
    const fetchData = async () => {
      const list = await getOfflineProgram({ page: { currentPage: page, pageSize: pageSize } })
      setLists(list.data)
      setTotal(list.totalCount)
    }
    fetchData()
  }, [forceUpdateId])
  const changeSize = (page, pageSize) => {
    console.log(page, pageSize);
    setPage(page)
    setPageSize(pageSize)
  }
  const submitForm = (val) => {//表单提交
    console.log(val)
    // return
    if (source == "add") {
      let params = {
        ...val,
        showType: val.showType ? 1 : 2,
        isOpenSelfBuild: val.isOpenSelfBuild ? 1 : 2,
      }
      addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...currentItem,
        ...val,
        showType: val.showType ? 1 : 2,
        isOpenSelfBuild: val.isOpenSelfBuild ? 1 : 2
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
    addOfflineProgram(params).then(res => {
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
    updateOfflineProgram(params).then(res => {
      message.success("更新成功")
      forceUpdate()
    })
  }
  const delItem = (row) => {
    Modal.confirm({
      title: `确认删除该条数据吗？`,
      // content: '确认删除？',
      onOk: () => {
        delOfflineProgram({ id: row.id }).then(res => {
          message.success("删除成功")
          forceUpdate()
        })
      },
      onCancel: () => {
      }
    })
  }
  //获取上传文件
  const getUploadFileUrl = (type, file, newItem) => {
    let image_url = newItem.fileUrl;
    let obj = {};
    obj[type] = image_url;
    formRef.setFieldsValue(obj);
    forceUpdatePages()
  }
  //获取上传文件图片地址 
  const getUploadFileImageUrlByType = (type) => {
    let image_url = formRef.getFieldValue(type);
    return image_url ? image_url : '';
  }
  //获取标签name
  const getTagName = (val) =>{
    let arr = tagList.filter(item=>item.code == val)
    if(arr.length>0){
      return arr[0].name
    }else{
      return "未配置"
    }
  }
  return (
    <div className="loginVip">
      <Card title={
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>下线节目</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新建</Button>
            <MySyncBtn type={30} name='同步缓存' />
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
              <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item label="运营标签" name="operatorTag" rules={[{ required: formRef.getFieldValue("tag") ? false : true, message: '请选择运营标签' }]}>
                <Select mode={true} allowClear showSearch placeholder="请选择运营标签" filterOption={filterOption} onChange={() => forceUpdatePages()}>
                  {tagList.map((item, index) => (
                    <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="风险标签" name="tag" rules={[{ required: formRef.getFieldValue("operatorTag") ? false : true, message: '请选择风险标签' }]}>
                <Select mode={true} allowClear showSearch placeholder="请选择用户风险标签" filterOption={filterOption} onChange={() => forceUpdatePages()}>
                  {tagList.map((item, index) => (
                    <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item label="上下线时间" name="time">
                <RangePicker className="base-input-wrapper" showTime placeholder={['上线时间', '下线时间']} />
              </Form.Item> */}
              {/* <Form.Item label="设备" name="platform">
                <Radio.Group size="large" onChange={(e) => {
                  forceUpdatePages()
                }}>
                  <Radio.Button value="1">手机端配置</Radio.Button>
                  <Radio.Button value="2">电视端配置</Radio.Button>
                </Radio.Group>
              </Form.Item> */}
              <Divider plain>手机端配置</Divider>
              <Form.Item label="下线图" name="mBgPicUrl" rules={[{ required: formRef.getFieldValue("fullScreenStyle") ? false : true, message: '请输入跳转链接' }]}>
                <MyImageUpload
                  getUploadFileUrl={(file, newItem) => { getUploadFileUrl('mBgPicUrl', file, newItem) }}
                  imageUrl={getUploadFileImageUrlByType('mBgPicUrl')} />
                <Input placeholder="请输入下线图地址" defaultValue={getUploadFileImageUrlByType('mBgPicUrl')} key={getUploadFileImageUrlByType('mBgPicUrl')}
                  onChange={(e) => {
                    if (privateData.inputTimeOutVal) {
                      clearTimeout(privateData.inputTimeOutVal);
                      privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                      if (!privateData.inputTimeOutVal) return;
                      formRef.setFieldsValue({ mBgPicUrl: e.target.value })
                      forceUpdatePages()
                    }, 1000)
                  }}
                />
              </Form.Item>
              <Form.Item label="跳转链接" name="jumpUrl" rules={[{ required: formRef.getFieldValue("fullScreenStyle") ? false : true, message: '请输入跳转链接' }]}>
                <Input placeholder="请输入跳转链接" onChange={() => forceUpdatePages()} />
              </Form.Item>

              <Divider plain>电视端配置</Divider>
              <Form.Item label="全屏样式" name="fullScreenStyle" rules={[{ required: (formRef.getFieldValue("mBgPicUrl") || formRef.getFieldValue("jumpUrl")) ? false : true, message: '请选择全屏样式' }]}>
                <Select mode={true} allowClear showSearch placeholder="请选择全屏样式" filterOption={filterOption}
                  onChange={(e) => forceUpdatePages()}
                >
                  <Option value={1} key={1}>下线图</Option>
                  <Option value={2} key={2}>apk下载</Option>
                </Select>
              </Form.Item>
              {
                formRef.getFieldValue("fullScreenStyle") &&
                <Form.Item label="下线图" name="bgPicUrl" rules={[{ required: true, message: '请输入下线图地址' }]}>
                  <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('bgPicUrl', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('bgPicUrl')} />
                  <Input placeholder="请输入下线图地址" defaultValue={getUploadFileImageUrlByType('bgPicUrl')} key={getUploadFileImageUrlByType('bgPicUrl')}
                    onChange={(e) => {
                      if (privateData.inputTimeOutVal) {
                        clearTimeout(privateData.inputTimeOutVal);
                        privateData.inputTimeOutVal = null;
                      }
                      privateData.inputTimeOutVal = setTimeout(() => {
                        if (!privateData.inputTimeOutVal) return;
                        formRef.setFieldsValue({ bgPicUrl: e.target.value })
                        forceUpdatePages()
                      }, 1000)
                    }}
                  />
                </Form.Item>
              }

              {
                formRef.getFieldValue("fullScreenStyle") == "1" &&
                <>

                  <Form.Item label="下线运营图" name="operaterPicUrl" rules={[{ required: true, message: '请输入下线运营图' }]}>
                    <MyImageUpload
                      getUploadFileUrl={(file, newItem) => { getUploadFileUrl('operaterPicUrl', file, newItem) }}
                      imageUrl={getUploadFileImageUrlByType('operaterPicUrl')} />
                    <Input placeholder="请输入下线运营图地址" defaultValue={getUploadFileImageUrlByType('operaterPicUrl')} key={getUploadFileImageUrlByType('operaterPicUrl')}
                      onChange={(e) => {
                        if (privateData.inputTimeOutVal) {
                          clearTimeout(privateData.inputTimeOutVal);
                          privateData.inputTimeOutVal = null;
                        }
                        privateData.inputTimeOutVal = setTimeout(() => {
                          if (!privateData.inputTimeOutVal) return;
                          formRef.setFieldsValue({ operaterPicUrl: e.target.value })
                          forceUpdatePages()
                        }, 1000)
                      }}
                    />
                  </Form.Item>

                </>
              }
              {
                formRef.getFieldValue("fullScreenStyle") == "2" &&
                <>
                  <Form.Item label="全屏背景图" name="fullScreenBgPicUrl" rules={[{ required: true, message: '请输入下线运营图' }]}>
                    <MyImageUpload
                      getUploadFileUrl={(file, newItem) => { getUploadFileUrl('fullScreenBgPicUrl', file, newItem) }}
                      imageUrl={getUploadFileImageUrlByType('fullScreenBgPicUrl')} />
                    <Input placeholder="请输入下线运营图地址" defaultValue={getUploadFileImageUrlByType('fullScreenBgPicUrl')} key={getUploadFileImageUrlByType('fullScreenBgPicUrl')}
                      onChange={(e) => {
                        if (privateData.inputTimeOutVal) {
                          clearTimeout(privateData.inputTimeOutVal);
                          privateData.inputTimeOutVal = null;
                        }
                        privateData.inputTimeOutVal = setTimeout(() => {
                          if (!privateData.inputTimeOutVal) return;
                          formRef.setFieldsValue({ fullScreenBgPicUrl: e.target.value })
                          forceUpdatePages()
                        }, 1000)
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="运营APK" name="apkId" rules={[{ required: true, message: '请选择全屏样式' }]}>
                    <Select mode={true} allowClear showSearch placeholder="请选择全屏样式" filterOption={filterOption}>
                      {
                        apkList.map((r, i) => {
                          return <Option value={r.id} key={i}>{r.name}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item label="推广渠道" name="apkLauType" rules={[{ required: true, message: '请选择全屏样式' }]}>
                    <Select mode={true} allowClear showSearch placeholder="请选择全屏样式" filterOption={filterOption}>
                      <Option value={1} key={1}>腾讯</Option>
                      <Option value={2} key={2}>爱奇艺</Option>
                      <Option value={3} key={3}>优酷</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="推广地址" name="apkLauAction">
                    <Input placeholder="请输入推广地址" />
                  </Form.Item>
                  <Form.Item label="推广参数" name="apkLauParam">
                    <Input placeholder="请输入推广参数" />
                  </Form.Item>
                </>
              }
              <Form.Item label="二维码登录" name="showType" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" ></Switch>
              </Form.Item>
              <Form.Item label="开启自建/注入播放" name="isOpenSelfBuild" valuePropName="checked">
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
      </Card>

    </div>
  )
}

export default App2