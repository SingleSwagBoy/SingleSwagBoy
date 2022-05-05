import React, { useState, useEffect, useReducer } from 'react'
import { signGoodsList, signGoodsDelete, signGoodsAdd, signGoodsEdit, signCategory, signCategoryAdd,signCategoryEdit,signCategoryDel,signRuleInfo,signRuleEdit,signExtra,signExtraEdit,signSync } from 'api'
import { Radio, Card, Breadcrumb, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker , Space,Divider } from 'antd'

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
const { TextArea } = Input;
const { RangePicker } = DatePicker;
let activityIndex=null;
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdateCateId, forceUpdateCate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const [lists, setLists] = useState([])
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const [formRef] = Form.useForm()
  const [formRefRule] = Form.useForm()
  const [formRefReward]=Form.useForm()
  const [formRefAdd]=Form.useForm()
  const tailLayout = { wrapperCol: { offset: 16, span: 48 } }
  const [channleList, setChannel] = useState([])
  const [programsList, setPrograms] = useState([])
  const [defaultPro, setDefaultPro] = useState([])
  const [currentItem, setCurrent] = useState({})

  const [openDailog, setOpen] = useState(false)  // 新增、编辑的弹框
  const [source, setSource] = useState("")   //  add / edit
  const [openRule, setOpenRule] = useState(false)  // 规则配置的弹框
  const [openReward,setopenReward]=useState(false) // 奖励配置的弹框
  const [openCategory,setopenCategory]=useState(false) // 商品分类的弹框
  const [addCategory,setaddCategory]=useState(false)   // 添加分类的弹窗

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
  const [virList,setvirList]=useState([])  // 商品列表
  const columns = [
    {title: "商品名称",dataIndex: "name",key: "name",},
    {
        title: "商品类型",dataIndex: "goodsType", key: "goodsType",
        render: (rowValue, row, index) => {
          return (
            <div>{rowValue==1?"会员":rowValue==2?"虚拟":"实体"}</div>
          )
        }
      },
      {title: "所属分类",dataIndex: "categoryId",key: "categoryId",
      render: (rowValue, row, index) => {
        return (
          <div>{getTypeName(rowValue)}</div>
        )
      }
    },
      {title: "兑换积分",dataIndex: "score",key: "score",},
      {title: "已兑次数",dataIndex: "exchangeNum",key: "exchangeNum",},
    {title: "背景图",dataIndex: "cover",key: "cover",
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
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(arr)
                setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" onClick={() => {
                Modal.confirm({
                    title: `确认删除该条数据吗？`,
                    onOk: () => {
                        signGoodsDelete({ id: row.id }).then(res => {
                            message.success("删除成功")
                            forceUpdate()
                        })
                    },
                    onCancel: () => {
                    }
                })
            }}>删除</Button>
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
//   const [activityIndex,setactivityIndex]=useState(1)

  const [sortTable,setsortTable]=useState([])   // 分类列表
  const [sortColumns,setsortColumns]=useState([
    {title: "顺序",dataIndex: "sort",key: "sort",
        render: (rowValue, row, index) => {
            return (
                activityIndex == index ?
                    <div><InputNumber defaultValue={rowValue} step={10} min={0} 
                    onBlur={(e) => {
                        console.log("InputNumber",e.target.value,sortTable)
                        console.log("row",row)

                        let params={
                            ...row,
                            sort:e.target.value*1
                        }
                        signCategoryEdit(params).then(res=>{
                            console.log("signCategoryEdit",res)
                            forceUpdateCate()
                        })
                    }}
                    ></InputNumber></div>
                    :
                    <div style={{ color: "#1890ff" }} onClick={() => clickIndex(index)}>{rowValue}</div>
            )
        }
    },
    {title: "分类名称",dataIndex: "name",key: "name"},
    {title: "商品数",dataIndex: "goodsNum",key: "goodsNum"},
    {title: "操作",key: "action",fixed: 'right',
    render: (rowValue, row, index) => {
        return (
          <div>
            <Button danger size="small" onClick={()=>deleteCategory(row)}>删除</Button>
          </div>
        )
      }
    }
  ])
  const clickIndex=(_index)=>{
      console.log("clickIndex----",_index);
      //setactivityIndex(index)
      activityIndex=_index
      forceUpdatePages()
  }
useEffect(() => {//列表
    const fetchData = async () => {
        const list = await signGoodsList({})
        console.log("list-----",list)
        setvirList(list.data)
    }
    fetchData()
}, [forceUpdateId])
useEffect(() => {//列表
    const fetchData = async () => {
        const  cateList=await signCategory({});
        console.log("cateList-----cateList",cateList);
        setsortTable(cateList.data)
    }
    fetchData()
}, [forceUpdateCateId])
const submitForm = (val) => {//表单提交
    console.log("submitForm---",val)
    if (source == "add") {   //新增商品
        let params = {
            ...val,
        }
        signGoodsAdd(params).then(res=>{
            message.success("新增成功")
            setOpen(false);
            setSource("")
            formRef.resetFields()
            forceUpdate()
        })
} else if (source == "edit") {   // 编辑商品
    let params = {
        ...formRef.getFieldValue(),
        ...val,
    }
    console.log(params, "params")
    signGoodsEdit(params).then(res=>{
        console.log("signGoodsEdit",res);
        message.success("编辑成功")
        setOpen(false);
        setSource("")
        formRef.resetFields()
        forceUpdate()
    })
    //updateOfflineProgramFunc(params)
}
const delItem=(obj)=>{

}
const deleteGoodsList=(obj)=>{   // 删除
    console.log("deleteGoods",obj)
}
closeDialog()
}
const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
}
const getTypeName=(type)=>{
    console.log("getTypeName",type)
    let arr=sortTable.filter(item=>item.id==type)
    if(arr.length>0){
        return arr[0].name
    }else{
        return ""
    }
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
    formRef.resetFields()
}
const closeReward=()=>{
    setopenReward(false)
}
const closeCategory=()=>{  // 关闭排序的弹框
    setopenCategory(false);
    activityIndex=null;
    //forceUpdatePages();
    //setactivityIndex(null);
    forceUpdateCate()
}
const closeaddCategory=()=>{
    setaddCategory(false)
    formRefRule.resetFields()
    forceUpdatePages();
}
const submitFormARule=(obj)=>{   // 提交规则
    console.log("submitFormARule",obj)
    let params={
        ...obj
    }
    signRuleEdit(params).then(res=>{
        console.log("signRuleEdit",res);
        setOpenRule(false)
        formRefRule.resetFields()
        message.success("保存成功")
    })
}
const submitFormReward=(obj)=>{   // 提交 连续签到奖励
    console.log("submitFormReward",obj)
    let params={
        continous:{
            days:obj.continuousDays,
            awardType:obj.rewardType,
            award:obj.rewardscoreOne
        },
        cumulative:{
            days:obj.totalDays,
            awardType:obj.rewardTypeTotal,
            award:obj.rewardscoreTwo
        }
    }
    console.log("params",params)
    signExtraEdit(params).then(res=>{
        console.log("signExtraEdit",signExtraEdit)
        message.success("保存成功")
        setopenReward(false)
        formRefReward.resetFields()
    })
}
const deleteCategory=(obj)=>{   // 删除分类
    console.log("deleteCategory----",obj)
    signCategoryDel({id:obj.id}).then(res=>{
        console.log("deleteCategory----",res)
        message.success("删除成功");
        //forceUpdate();
        forceUpdateCate();
    })
}
const addCate=()=>{   // 添加分类
    console.log("addCate11-----")
    formRefAdd.resetFields()
    setaddCategory(true)
}
const submitaddCategory=(e)=>{  // 添加分类
    console.log("submitaddCategory===submitaddCategory",e)
    let obj={
        ...e
    }
    signCategoryAdd(obj).then(res=>{
        message.success("添加成功");
        closeaddCategory();
        //forceUpdate();
        forceUpdateCate();
    })
}
const btnAsync=()=>{
    console.log("btnAsync")
    signSync({}).then(res=>{
        console.log("signSync",res);
        message.success("同步成功");
    })
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
                signRuleInfo({}).then(res=>{
                    console.log("signRuleInfo",res)
                    formRefRule.setFieldsValue(res.data)
                    setOpenRule(true)
                })
                
            }}>规则配置</Button>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{
                activityIndex=null;
                setopenCategory(true);
                forceUpdatePages();
                }}>商品分类</Button>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{
                signExtra({}).then(res=>{
                    console.log("signExtra",res);
                    let obj={
                        continuousDays:"",
                        rewardType:1,
                        rewardscoreOne:"",
                        totalDays:"",
                        rewardTypeTotal:1,
                        rewardscoreTwo:""
                    }
                    if(res.data.continous!=null){   // 连续签到配置
                        obj.continuousDays=res.data.continous.days;
                        obj.rewardType=res.data.continous.awardType;
                        obj.rewardscoreOne=res.data.continous.award;
                    }
                    if(res.data.cumulative!=null){
                        obj.totalDays=res.data.cumulative.days;
                        obj.rewardTypeTotal=res.data.cumulative.awardType;
                        obj.rewardscoreTwo=res.data.cumulative.award;
                    }

                    console.log("obj,obj",obj)

                    setopenReward(true)
                    formRefReward.setFieldsValue(obj);
                    forceUpdatePages();
                })
            }}
            >额外奖励</Button>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>btnAsync()}>同步缓存</Button>
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
              <Form.Item label="商品类型" name="goodsType" rules={[{ required: true, message: '请选择商品类型' }]}>
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
                    formRef.getFieldValue("goodsType") == 1 &&
                    <Form.Item label="会员天数" name="memberDays" rules={[{ required: true, message: '请输入会员天数' }]}>
                        <InputNumber min={1} placeholder="N" />
                        {/* <span style={{marginLeft:"10px"}}>天</span> */}
                    </Form.Item>
                }
                <Form.Item label="商品分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
                    <Select allowClear placeholder="请选择分类" onChange={() => forceUpdatePages()}>
                        {
                            sortTable.map((r, i) => {
                                return <Option value={r.id} key={r.id}>{r.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="商品封面" name="cover" rules={[{ required: true, message: '请输入商品封面' }]}>
                    <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('cover', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('cover')} />
                    <Input placeholder="请输入商品封面" defaultValue={getUploadFileImageUrlByType('cover')} key={getUploadFileImageUrlByType('cover')}
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
                </Form.Item>
                <Form.Item label="商品介绍图" name="introCover" rules={[{ required: true, message: '请输入商品介绍图' }]}>
                    <MyImageUpload
                    getUploadFileUrl={(file, newItem) => { getUploadFileUrl('introCover', file, newItem) }}
                    imageUrl={getUploadFileImageUrlByType('introCover')} />
                    <Input placeholder="请输入商品介绍图" defaultValue={getUploadFileImageUrlByType('introCover')} key={getUploadFileImageUrlByType('introCover')}
                    onChange={(e) => {
                        if (privateData.inputTimeOutVal) {
                            clearTimeout(privateData.inputTimeOutVal);
                            privateData.inputTimeOutVal = null;
                        }
                        privateData.inputTimeOutVal = setTimeout(() => {
                            if (!privateData.inputTimeOutVal) return;
                                formRef.setFieldsValue({ introCover: e.target.value })
                                forceUpdatePages()
                            }, 1000)
                    }}
                    />
                </Form.Item>
                <Form.Item label="兑换积分" name="score" rules={[{ required: true, message: '请输入兑换积分' }]}>
                    <InputNumber min={1}  />
                    {/* <span style={{marginLeft:"10px"}}>积分</span> */}
                </Form.Item>
                <Form.Item label="干预兑换数" name="robotNum" rules={[{ required: true, message: '请输入干预兑换数' }]}>
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
                {/* <Form.Item label="商品类型" name="ruleType" rules={[{ required: true, message: '请选择商品类型' }]}>
                    <Radio.Group defaultValue={1}
                        onChange={(e)=>{
                            console.log("ruleType",e)
                            formRefRule.setFieldsValue({ ruleType: e.target.value })
                            forceUpdatePages()
                        }}
                    >
                        <Radio value={1}>积分规则</Radio>
                        <Radio value={2}>兑换规则</Radio>
                    </Radio.Group>
                </Form.Item> */}
                {/* {
                    formRefRule.getFieldValue("ruleType") == 1 &&
                    <Form.Item label="积分规则" name="scoreRule" rules={[{ required: true, message: '请填写积分规则' }]}>
                        <TextArea rows={6} placeholder="这里填写积分规则" />
                    </Form.Item> ||
                    formRefRule.getFieldValue("ruleType") == 2 &&
                    <Form.Item label="兑换规则" name="exchangeRule" rules={[{ required: true, message: '请填写兑换规则' }]}>
                        <TextArea rows={6} placeholder="这里填写兑换规则" />
                    </Form.Item>
                } */}
                <Form.Item label="积分规则" name="scoreRule" rules={[{ required: true, message: '请填写积分规则' }]}>
                    <TextArea rows={6} placeholder="这里填写积分规则" />
                </Form.Item> 
                <Form.Item label="兑换规则" name="exchangeRule" rules={[{ required: true, message: '请填写兑换规则' }]}>
                    <TextArea rows={6} placeholder="这里填写兑换规则" />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button onClick={() => closeRule()}>取消</Button>
                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>确定</Button>
                </Form.Item>
            </Form>
        }
        </Modal>
        {/* 额外奖励的弹框 */}
        <Modal centered visible={openReward} onCancel={() => closeReward()} footer={null} width={700}>
        {
            <Form {...layout} name="ruleForm" form={formRefReward} onFinish={(e) => submitFormReward(e)}>
                <Divider plain>连续签到奖励配置</Divider>
                <Form.Item label="连续签到" name="continuousDays" rules={[{ required: true, message: '请输入连续签到天数' }]}>
                    <InputNumber min={2} placeholder="天" addonafter="天"/>
                    {/* <span style={{marginLeft:"10px"}}>天</span> */}
                </Form.Item>
                <Form.Item label="奖励" name="rewardType" rules={[{ required: true, message: '请选择奖励类型' }]}>
                    <Radio.Group
                        onChange={(e)=>{
                            console.log("rewardType",e)
                            formRefReward.setFieldsValue({ rewardType: e.target.value })
                            forceUpdatePages()
                        }}
                    >
                        <Radio value={1}>积分</Radio>
                        <Radio value={2}>会员</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    formRefReward.getFieldValue("rewardType") == 1 &&
                    <Form.Item label="赠送积分" name="rewardscoreOne" rules={[{ required: true, message: '请输入赠送积分' }]}>
                        <InputNumber min={1}  />
                    </Form.Item> ||
                    formRefReward.getFieldValue("rewardType") == 2 &&
                    <Form.Item label="赠送会员" name="rewardscoreOne" rules={[{ required: true, message: '请输入赠送会员' }]}>
                        <InputNumber min={1}  placeholder='天'/>
                    </Form.Item>
                }
                <Divider plain>每月累计签到配置</Divider>
                <Form.Item label="累计签到" name="totalDays" rules={[{ required: true, message: '请输入累计签到天数' }]}>
                    <InputNumber min={2} placeholder="天" addonafter="天"/>
                    {/* <span style={{marginLeft:"10px"}}>天</span> */}
                </Form.Item>
                <Form.Item label="奖励" name="rewardTypeTotal" rules={[{ required: true, message: '请选择奖励类型' }]}>
                    <Radio.Group
                        onChange={(e)=>{
                            console.log("rewardTypeTotal",e)
                            formRefReward.setFieldsValue({ rewardTypeTotal: e.target.value })
                            forceUpdatePages()
                        }}
                    >
                        <Radio value={1}>积分</Radio>
                        <Radio value={2}>会员</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    formRefReward.getFieldValue("rewardTypeTotal") == 1 &&
                    <Form.Item label="赠送积分" name="rewardscoreTwo" rules={[{ required: true, message: '请输入赠送积分' }]}>
                        <InputNumber min={1}  />
                    </Form.Item> ||
                    formRefReward.getFieldValue("rewardTypeTotal") == 2 &&
                    <Form.Item label="赠送会员" name="rewardscoreTwo" rules={[{ required: true, message: '请输入赠送会员' }]}>
                        <InputNumber min={1}  placeholder='天'/>
                    </Form.Item>
                }
                <Form.Item {...tailLayout}>
                    <Button onClick={() => closeReward()}>取消</Button>
                    <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>确定</Button>
                </Form.Item>
            </Form>
        }
        </Modal>
        {/* 商品分类的弹框 */}
        <Modal centered visible={openCategory} onCancel={() => closeCategory()} footer={null} width={700}>
            <Table bordered dataSource={sortTable} columns={sortColumns} pagination={false}>
            </Table>
            <div className='add-category' onClick={()=>addCate()}>添加分类+</div>
            <div className='btns-modal'>
                <Button onClick={() => closeCategory()}>取消</Button>
                <Button type="primary" style={{ margin: "0 20px" }} onClick={()=>closeCategory()}>
                    确定
                </Button>
            </div>
        </Modal>
        {/* 添加分类的弹框 */}
        <Modal centered visible={addCategory} onCancel={() => closeaddCategory()} footer={null} width={700}>
        {
            <Form {...layout} name="sort" form={formRefAdd} onFinish={(e) => submitaddCategory(e)}>
                <Form.Item label="排序" name="sort" rules={[{ required: true, message: '请输入排序' }]}>
                    <InputNumber min={0}  />
                </Form.Item>
                <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
                    <Input placeholder="请输入分类名称" />
                </Form.Item>
                <Form.Item label="商品数量" name="goodsNum" rules={[{ required: true, message: '请输入商品数量' }]}>
                    <InputNumber min={0}/>
                </Form.Item>
                {/* {id:5,sort:5,name:"手机",sku:100}, */}

                <Form.Item {...tailLayout}>
                    <Button onClick={() => closeaddCategory()}>取消</Button>
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