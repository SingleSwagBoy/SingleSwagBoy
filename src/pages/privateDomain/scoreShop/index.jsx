import React, { useState, useEffect, useReducer } from 'react'
import { getTopic, updateTopic, addTopic, delTopic, getChannel, getProgramsList } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker, Divider, Space } from 'antd'
import { Link } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./index.css"
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
  const [formRefRule] = Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [channleList, setChannel] = useState([])
  const [programsList, setPrograms] = useState([])
  const [defaultPro, setDefaultPro] = useState([])
  const [currentItem, setCurrent] = useState({})

  const [openDailog, setOpen] = useState(false)  // 新增、编辑的弹框
  const [source, setSource] = useState("")   //  add / edit
  const [openRule, setOpenRule] = useState(false)  // 规则配置的弹框

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
  const [virList,setvirList]=useState([
      {id:1,name:"商品1",type:1,category:"分类1",score:400,rechageNum:41,imgCover:""},
      {id:2,name:"商品1",type:2,category:"分类2",score:500,rechageNum:41,imgCover:""},
      {id:3,name:"商品1",type:3,category:"分类3",score:600,rechageNum:41,imgCover:""},
      {id:4,name:"商品1",type:1,category:"分类4",score:700,rechageNum:41,imgCover:""},
      {id:5,name:"商品1",type:1,category:"分类5",score:800,rechageNum:41,imgCover:""},
  ])
  const columns = [
    {title: "商品名称",dataIndex: "name",key: "name",},
    {
        title: "商品类型",dataIndex: "type", key: "type",
        render: (rowValue, row, index) => {
          return (
            <div>{rowValue==1?"会员":rowValue==2?"虚拟":"实体"}</div>
          )
        }
      },
      {title: "所属分类",dataIndex: "category",key: "category",},
      {title: "兑换积分",dataIndex: "score",key: "score",},
      {title: "已兑次数",dataIndex: "rechageNum",key: "rechageNum",},
    {title: "背景图",dataIndex: "imgCover",key: "imgCover",
      render: (rowValue, row, index) => {
        return (
          <Image src={rowValue} width={100}></Image>
        )
      }
    },
    {title: "操作",key: "action",fixed: 'right', width: 150,
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
                // arr.blocks.forEach(r => {
                //   r.contents.forEach(l => {
                //     l.time = [l.start?moment(l.start * 1000):0, l.end?moment(l.end * 1000):0]
                //   })
                // })
                // console.log(arr, "arr")
                // setCurrent(row)
                // setOpen(true)
                // formRef.setFieldsValue(arr)
                // setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" >删除</Button>
          </div>
        )
      }
    }
  ]
  const [categoryList,setcategoryList]=useState([
      {id:1,name:"全部"},
      {id:2,name:"热门商品"},
      {id:3,name:"虚拟商品"},
      {id:4,name:"实物商品"}
  ])
  useEffect(() => {//列表
    // const fetchData = async () => {
    //   const list = await getTopic({})
    //   setLists(list.data)
    //   // setTotal(list.totalCount)
    // }
    // fetchData()
  }, [forceUpdateId])
  const submitForm = (val) => {//表单提交
    console.log("submitForm---",val)
    if (source == "add") {
      let params = {
        ...val,
      }
      //addOfflineProgramFunc(params)
    } else if (source == "edit") {
      let params = {
        ...formRef.getFieldValue(),
        ...val,
      }
      // return console.log(params, "params")
      //updateOfflineProgramFunc(params)
    }
    closeDialog()
  }
  const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
  }
//获取上传文件图片地址 
const getUploadFileImageUrlByType = (type) => {
    let image_url = formRef.getFieldValue(type);
    return image_url ? image_url : '';
}
//获取上传文件
const getUploadFileUrl = (type, file, newItem) => {
    let image_url = newItem.fileUrl;
    let obj = {};
    obj[type] = image_url;
    formRef.setFieldsValue(obj);
    forceUpdatePages()
}
const closeRule=()=>{   // 关闭规则弹框
    setOpenRule(false)
}
const submitFormARule=(obj)=>{   // 提交规则
    console.log("submitFormARule",obj)
}

  return (
    <div className="loginVip">
      <Card title={
        <div>
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
              setOpen(true)
              setSource("add")
            }}>新增商品</Button>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{
                setOpenRule(true)
            }}>规则配置</Button>
            <Button type="primary" style={{marginLeft:"10px"}}>商品分类</Button>
            <Button type="primary" style={{marginLeft:"10px"}}>额外奖励</Button>
            <MySyncBtn type={34} name='同步缓存' />
          </div>
        }
      >
        <Table
          dataSource={virList}
          //scroll={{ x: 1400, y: '75vh' }}
          rowKey={item => item.id}
          // loading={loading}
          columns={columns}
        />
        {/* 新增/编辑的弹框 */}
        <Modal title={source=='add'?"新增":source=='edit'?"编辑":""} centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout} name="taskForm" form={formRef} onFinish={(e) => submitForm(e)}>
              <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
                <Input placeholder="请输入商品名称" />
              </Form.Item>
              <Form.Item label="商品类型" name="type" rules={[{ required: true, message: '请选择商品类型' }]}>
                  <Radio.Group
                    onChange={(e)=>{
                        console.log("xxxxxx",e)
                        formRef.setFieldsValue({ type: e.target.value })
                        forceUpdatePages()
                    }}
                  >
                    <Radio value={1}>会员</Radio>
                    <Radio value={2}>虚拟</Radio>
                    <Radio value={3}>实体</Radio>
                  </Radio.Group>
                </Form.Item>
                {
                    formRef.getFieldValue("type") == 1 &&
                    <Form.Item label="会员天数" name="days" rules={[{ required: true, message: '请输入会员天数' }]}>
                        <InputNumber min={1} placeholder="N" />
                        {/* <span style={{marginLeft:"10px"}}>天</span> */}
                    </Form.Item>
                }
                <Form.Item label="商品分类" name="category" rules={[{ required: true, message: '请选择分类' }]}>
                    <Select allowClear placeholder="请选择分类" onChange={() => forceUpdatePages()}>
                        {
                            categoryList.map((r, i) => {
                                return <Option value={r.id} key={r.id}>{r.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="商品封面" name="imgCover" rules={[{ required: true, message: '请输入商品封面' }]}>
                    <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('imgCover', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('imgCover')} />
                    <Input placeholder="请输入商品封面" defaultValue={getUploadFileImageUrlByType('imgCover')} key={getUploadFileImageUrlByType('imgCover')}
                    onChange={(e) => {
                        if (privateData.inputTimeOutVal) {
                            clearTimeout(privateData.inputTimeOutVal);
                            privateData.inputTimeOutVal = null;
                        }
                        privateData.inputTimeOutVal = setTimeout(() => {
                            if (!privateData.inputTimeOutVal) return;
                                formRef.setFieldsValue({ imgCover: e.target.value })
                                forceUpdatePages()
                            }, 1000)
                    }}
                    />
                </Form.Item>
                <Form.Item label="商品介绍图" name="introduceCover" rules={[{ required: true, message: '请输入商品介绍图' }]}>
                        <MyImageUpload
                        getUploadFileUrl={(file, newItem) => { getUploadFileUrl('introduceCover', file, newItem) }}
                        imageUrl={getUploadFileImageUrlByType('introduceCover')} />
                        <Input placeholder="请输入商品介绍图" defaultValue={getUploadFileImageUrlByType('introduceCover')} key={getUploadFileImageUrlByType('introduceCover')}
                        onChange={(e) => {
                            if (privateData.inputTimeOutVal) {
                                clearTimeout(privateData.inputTimeOutVal);
                                privateData.inputTimeOutVal = null;
                            }
                            privateData.inputTimeOutVal = setTimeout(() => {
                                if (!privateData.inputTimeOutVal) return;
                                    formRef.setFieldsValue({ introduceCover: e.target.value })
                                    forceUpdatePages()
                                }, 1000)
                        }}
                        />
                </Form.Item>
                <Form.Item label="兑换积分" name="score" rules={[{ required: true, message: '请输入兑换积分' }]}>
                    <InputNumber min={1}  />
                    {/* <span style={{marginLeft:"10px"}}>积分</span> */}
                </Form.Item>
                <Form.Item label="干预兑换数" name="peoNum" rules={[{ required: true, message: '请输入干预兑换数' }]}>
                    <InputNumber min={0}  />
                    {/* <span style={{marginLeft:"10px"}}>个</span> */}
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
        {/* 规则配置的弹框 */}
            <Modal centered visible={openRule} onCancel={() => closeRule()} footer={null} width={700}>
            {
                <Form {...layout} name="ruleForm" form={formRefRule} onFinish={(e) => submitFormARule(e)}>
                    <Form.Item label="首次登录赠送" name="score" rules={[{ required: true, message: '请输入首次登录赠送' }]}>
                        <InputNumber min={1}  />
                    </Form.Item>
                    <Form.Item label="商品类型" name="ruleType" rules={[{ required: true, message: '请选择商品类型' }]}>
                        <Radio.Group
                            onChange={(e)=>{
                                console.log("ruleType",e)
                                formRefRule.setFieldsValue({ ruleType: e.target.value })
                                forceUpdatePages()
                            }}
                        >
                            <Radio value={1}>积分规则</Radio>
                            <Radio value={2}>兑换规则</Radio>
                        </Radio.Group>
                    </Form.Item>


                    <Form.Item {...tailLayout}>
                        <Button onClick={() => closeRule()}>取消</Button>
                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>确定</Button>
                    </Form.Item>
                </Form>
            }
            </Modal>
      </Card >

    </div >
  )
}

export default App2