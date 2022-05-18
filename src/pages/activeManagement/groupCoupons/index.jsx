// 活动管理-任务配置
import React, { useState, useEffect, useReducer } from 'react'
import { GcouponConfigList,GcouponConfigAdd,GcouponConfigEdit,GcouponConfigDel,requestNewAdTagList, couponConfigList,GcouponConfigSync } from 'api'
import { Radio, Card, Checkbox, Image, Button, message, Table, Modal, Tabs, Input, Form, Select, InputNumber, DatePicker , Space,Divider,Calendar,Badge } from 'antd'

import { Link } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { MySyncBtn, MyImageUpload } from "@/components/views.js"
import util from 'utils'
import "./index.css"
import locale from 'antd/lib/calendar/locale/zh_CN.js'
import 'moment/locale/zh-cn';
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};
const { TextArea } = Input;
const { RangePicker } = DatePicker;
let activityIndex=null;


const plainOptions = [
    "tv端","小程序"
];
const defaultCheckedList = [];
function App2() {
  const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
  const [forceUpdateCateId, forceUpdateCate] = useReducer(() => [], []);
  const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
  const tailLayout = { wrapperCol: { offset: 15, span: 40 } }
  const [formRef] = Form.useForm()
  const [virList,setvirList]=useState([])  // 任务列表

  const [currentItem, setCurrent] = useState({})
  const [dict_user_tags,setdict_user_tags]=useState([])
  const selectProps = {
    optionFilterProp: "children",
    filterOption(input, option) {
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
  const [platType,setplatType]=useState([
      {type:1,name:"全平台"},{type:2,name:"tv端"},{type:4,name:"小程序"},
  ])
  const [couponList,setCouponList]=useState([])  // 优惠券列表
  const [openDailog, setOpen] = useState(false)  // 新增、编辑的弹框
  const [source, setSource] = useState("")   //  add / edit
  const columns = [
    {title: "id",dataIndex: "id",key: "id",},
    {title: "组合名称",dataIndex: "name",key: "name",},
    {
        title: '领取平台', dataIndex: 'platform', key: 'platform', width: 150,
        render: (rowValue, row, index) => {
            return (
                <span>{getPlatName(rowValue)}</span>
            )
        }
    },
    {
        title: "标签",dataIndex: "tag", key: "tag",
        render: (rowValue, row, index) => {
            return (
                <div>{getTagsName(rowValue)}</div>
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
                let obj = JSON.parse(JSON.stringify(row))
                if(obj.platform==1){
                    obj.platform=["tv端","小程序"]
                    setCheckedList(plainOptions)
                    setCheckAll(true)
                }else{
                    let _arr=[]
                    if(obj.platform.includes("2")){
                        _arr.push("tv端")
                    }
                    if(obj.platform.includes("4")){
                        _arr.push("小程序")
                    }
                    obj.platform=_arr
                    setCheckedList(_arr)
                    setCheckAll(false)
                }
                
                setCurrent(row)
                setOpen(true)
                formRef.setFieldsValue(obj)
                setSource("edit")
              }}
            >编辑</Button>
            <Button danger size="small" onClick={() => {
                Modal.confirm({
                    title: `确认删除该条数据吗？`,
                    onOk: () => {
                        GcouponConfigDel({ id: row.id }).then(res => {
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
  useEffect(()=>{
    const fetchData=async ()=>{
        let _tag=await requestNewAdTagList({ currentPage: 1, pageSize: 999999})
        console.log("_tag_tag_tag",_tag)
        setdict_user_tags(_tag.data)

        let _coupons=await couponConfigList({})
        console.log("setCouponList_coupons_coupons",_coupons)
        setCouponList(_coupons.data)
    }
    fetchData();
  },[])

  useEffect(() => {//列表
    const fetchData=async ()=>{
        let res=await GcouponConfigList({})
        console.log("res",res)
        setvirList(res.data)
    }
    fetchData();
  }, [forceUpdateId])
  const getPlatName=(_name)=>{  // 获取平台名称
    //console.log("name_name",_name)
    if(_name==1){
        return "全平台"
    }else{
        let arr=[];
        if(_name.includes("2")){  // 2:tv, 3：手机, 4:小程序
            arr.push("tv端")
        }
        
        if(_name.includes("4")){  
            arr.push("小程序")
        }
        let str=arr.join("、");
        return str
    }
  }
  const getTagsName=(val)=> {  // 获取用户标签名称
    if(dict_user_tags.length == 0){
        return "-"
    }
    let arr = dict_user_tags.filter(r => r.code == val)
    if (arr.length > 0) {
        return arr[0].name
    } else {
        return ""
    }
}

const submitForm=(obj)=>{
    console.log("submitForm---",obj)
    if (source == "add") {   //新增商品
        
        let params = {
            ...obj
        }
        
        console.log("checkedList",checkedList)
        if(checkedList.length==0){
            message.error("请选择领取平台");
            return
        }else{
            if(checkedList.length==2){
                params.platform="1"
            }else{
                let arr=[]
                if(checkedList.includes("tv端")){  // 2:tv, 3：手机, 4:小程序
                    arr.push(2)
                }
                if(checkedList.includes("小程序")){ 
                    arr.push(4)
                }
                params.platform=arr.join(",")
            }
            
        }
        console.log("assd    params",params)

        GcouponConfigAdd(params).then(res=>{
            message.success("新增成功")
            setCheckedList([])
            setIndeterminate(false);
            setOpen(false);
            setSource("")
            setCheckAll(false)
            formRef.resetFields()
            forceUpdate()
        })
    }else if (source == "edit") {   // 编辑商品
        let params = {
            ...formRef.getFieldValue(),
            ...obj,
            id:currentItem.id
        }
        if(checkedList.length==0){
            message.error("请选择领取平台");
            return
        }else{
            if(checkedList.length==2){
                params.platform="1"
            }else{
                let arr=[]
                if(checkedList.includes("tv端")){  // 2:tv, 3：手机, 4:小程序
                    arr.push(2)
                }
                if(checkedList.includes("小程序")){ 
                    arr.push(4)
                }
                params.platform=arr.join(",")
            }
        }
        console.log("编辑商品  params",params)
        GcouponConfigEdit(params).then(res=>{
            message.success("编辑成功")
            setCheckedList([])
            setIndeterminate(false);
            setOpen(false);
            setSource("")
            setCheckAll(false)
            formRef.resetFields()
            forceUpdate()
        })
    }

}

const closeDialog = () => {
    formRef.resetFields()
    setOpen(false)
    setSource("")
}



const [checkedList, setCheckedList] = useState([]);
const [indeterminate, setIndeterminate] = useState(false);
const [checkAll, setCheckAll] = useState(false);

const onCheckAllChange = e => {
    console.log("onCheckAllChangeonCheckAllChangeonCheckAllChangeonCheckAllChange",e)
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    forceUpdatePages()
};
const onChange = list => {
    console.log("onChange___list",list)
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    forceUpdatePages()
  };



  return (
    <div className="loginVip">
      <Card title={
        <div>
            
        </div>
      }
        extra={
          <div>
            <Button type="primary" onClick={() => {
                setCheckedList([])
                setCheckAll(false);
                setIndeterminate(false);
                setOpen(true)
                setSource("add")
            }}>新增</Button>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{
                GcouponConfigSync({}).then(res=>{
                    message.success("同步成功")
                })
            }}>同步缓存</Button>
          </div>
        }
      >
          <Table
          dataSource={virList}
          rowKey={item => item.id}
          columns={columns}
        />

        {/* 新增/编辑的弹框 */}
        <Modal title={source=='add'?"新增":source=='edit'?"编辑":""} centered visible={openDailog} onCancel={() => closeDialog()} footer={null} width={1000}>
          {
            <Form {...layout} name="taskForm" form={formRef} onFinish={(e) => submitForm(e)}>
                <Form.Item label="组合名称" name="name" rules={[{ required: true, message: '请输入优惠券标题' }]}>
                    <Input placeholder="请输入优惠券标题" />
                </Form.Item>
                <Form.Item label="优惠券选择" rules={[{ required: true }]}>
                    <Form.List name="coupons">
                    {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <>
                                        <div style={{ display: "flex" }}>
                                            <Space key={field.key} align="baseline" style={{ flexWrap: "wrap" }}>
                                                <Form.Item {...field} name={[field.name,'id']} fieldKey={[field.fieldKey, 'id']} rules={[{ required: true }]}>
                                                    <Select allowClear showSearch placeholder="请选择优惠券" onChange={(e)=>{
                                                        console.log("e 请选择优惠券 e",e)
                                                    }} style={{width:"200px"}} {...selectProps}>
                                                        {
                                                            couponList.map((r, i) => {
                                                                return <Option value={r.id} key={r.id}>{r.name}---{r.id}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Space>
                                            <div>
                                                <Button danger onClick={() => remove(field.name)} block icon={<MinusCircleOutlined />}>
                                                    删除
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加优惠券
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
                <Form.Item label="领取平台">
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>全平台</Checkbox>
                    <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
                </Form.Item>

                <Form.Item label='用户标签' name="tags" >
                    <Select className="base-input-wrapper" allowClear showSearch placeholder="请选择用户标签"
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
                        {dict_user_tags.map((item, index) => (
                            <Option value={item.code.toString()} key={item.code}>{item.name}-{item.code}</Option>
                        ))}
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