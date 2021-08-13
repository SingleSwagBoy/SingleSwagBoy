import React, { Component } from 'react'
// import request from 'utils/request'
import { addVoting,editVoting,deleteVote,getVotingList,getMyProduct,getUserTag,getChannel,changeStateVote,voteSyncCache} from 'api'
import { Card, Button, Table, message, DatePicker,Select,Input,InputNumber,Switch,Modal,Form,Space,Radio} from 'antd'
import {  } from 'react-router-dom'

import { MinusCircleOutlined,LoadingOutlined,PlusOutlined  } from "@ant-design/icons"
import  util from 'utils'
import Address from "../../../components/address/index"
import Market from "../../../components/market/index"
import ImageUpload from "../../../components/ImageUpload/index"
import "./style.css"
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
let privateData = {
  inputTimeOutVal: null
};
export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    let _this = this
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      loading:false,
      source:"",//按钮来源
      currentItem:{},
      searchWord:{},
      lists: [],
      optionList:[],
      screen:{}, //筛选对象
      productList:[],
      userTagList:[],
      channelList:[],
      defaultAddress:[],
      area:"",
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      selectProps:{
        optionFilterProp:"children",
        filterOption(input, option){
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        showSearch(){
          console.log('onSearch')
        }
      },
      columns: [
        {
          title: "ID",
          dataIndex: "voteId",
          key: "voteId",
          width:150,
        },
        {
          title: "标题",
          dataIndex: "voteTitle",
          key: "voteTitle",
          width:150,
        },
        {
          title: "开始时间-结束时间",
          dataIndex: "startTime",
          key: "startTime",
          width:450,
          render: (rowValue,row,index) => {
            return (
              <span>
                {util.formatTime(String(row.startTime).length==10? row.startTime* 1000:row.startTime,"","")}
                ---
                {util.formatTime(String(row.endTime).length==10? row.endTime* 1000:row.endTime,"","")}
              </span>
            )
          },
        },
        {
          title: "类型",
          dataIndex: "voteType",
          key: "voteType",
          width:"20%",
          render: (rowValue,row,index) => {
            return (
              <span>{rowValue==10?"提前展示结果（点赞）":"不提前展示结果（投票）"}</span>
            )
          },
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          render: (rowValue, row, index)=>{
            return (
              <div>
                <Switch checkedChildren="有效" unCheckedChildren="无效" 
                // checked={rowValue === 1?true:false}
                key={new Date().getTime()}
                defaultChecked={rowValue === 1?true:false}
                onChange={(val)=>{
                  row.state = val?1:0
                  this.changeStateVote(row)
                }}
                 />
              </div>
            )
          }
        },
        
        {
          title: "操作",
          key: "action",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  <div>
                    <Button 
                      size="small"
                      dashed="true"
                      onClick={()=>{
                        this.setState({
                          defaultAddress:row.area.includes(",")?row.area.split(","):row.area,
                        },()=>{
                          this.addVoting(row,2)
                        })
                      }}
                      >复制</Button>
                    <Button 
                    size="small"
                    type="primary"
                    style={{margin:"0 10px"}}
                    onClick={()=>{
                      console.log(row,"currentItem")
                      this.setState({
                        visible:true,
                        currentItem:row,
                        editType:2,
                        source:2,
                        defaultAddress:row.area.includes(",")?row.area.split(","):row.area,
                        newData:{type:row.type},
                        // area:row.area
                      },()=>{
                        // console.log(this.state.defaultAddress)
                        this.formRef.current.setFieldsValue(row)
                        this.formRef.current.setFieldsValue({
                            ...row,
                          'startTime': moment(row.startTime * 1000),
                          "endTime":moment(row.endTime * 1000),
                          "state":row.state == 1?true:false
                        })
                      })
                    }}
                    >编辑</Button>
                    <Button 
                    
                      size="small"
                      danger
                      onClick={()=>{this.delArt(row)}}
                      >删除</Button>
                      
                  </div>
                    
                }
              </div>
            )
          }
        }
        
      ],
      visible:false,
    }
  }
  render() {
    return (
      <div className="address">
        <Card title={
          <div className="cardTitle">
            <div className="everyBody">
              <div>名称:</div>
              <Input.Search  
                onChange={(val)=>{
                  this.state.searchWord.name = val
                }}
                onSearch={(val)=>{
                  this.state.searchWord.name = val
                  this.setState({
                    page:1,
                  },()=>{
                    this.getVotingList()
                  })
                 
                }} />
            </div>
            <div className="everyBody">
              <div>类型:</div>
              <Select allowClear  placeholder="请选择类型" 
                onChange={(val)=>{
                  this.state.searchWord.type = val
                  this.setState({
                    page:1,
                  },()=>{
                    this.getVotingList()
                  })
                }}
              >
                <Option value={10} key={10}>提前展示结果（点赞）</Option>
                <Option value={20} key={20}>不提前展示结果（投票）</Option>
              </Select>
            </div>
          </div>
        }
        extra={
          <div>
            <Button type="primary" onClick={()=>{this.setState({visible:true,source:1,currentItem:{},defaultAddress:[]})}}>新建</Button>
            <Button type="primary" style={{margin:"0 10px"}} onClick={()=>{this.voteSyncCache()}}>数据同步</Button>
          </div>
        }
        >
          <Table 
              dataSource={this.state.lists}
              pagination={{
                current:this.state.page,
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize,
                // pageSizeOptions:[10,50,100,1000,5000],
                // // hideOnSinglePage:true,
                // showSizeChanger:true
              }}
              rowKey={item=>item.voteId}
              // loading={this.state.loading}
              columns={this.state.columns} />
        </Card>
        <Modal
            title="活动"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel()}}
            footer={null}
            // forceRender={true}
            width={1200}
          >
            {
              <Form
                {...this.state.layout}
                name="voting"
                ref = {this.formRef}
                onFinish={this.submitForm.bind(this)}
                >
                <Form.Item
                  label="标题"
                  name="voteTitle"
                  rules={[{ required: true, message: '请填写分类名称' }]}
                >
                 <Input placeholder="请填写分类名称" />
                </Form.Item>
                <Form.Item
                    label="类型"
                    name="voteType"
                    rules={[{ required: true, message: '请选择类型' }]}
                  >
                  <Select
                        placeholder="请选择类型"
                        // mode="multiple"
                        onChange={(val)=>{
                          console.log(val)
                          let arr = this.formRef.current.getFieldValue("voters")
                          this.formRef.current.setFieldsValue({"voters":arr})
                        }}
                        // defaultValue={this.state.newData.categories||[]}
                        allowClear
                      >
                         <Option value={10} key={10}>点赞</Option>
                         <Option value={20} key={20}>投票</Option>
                      </Select>
                  </Form.Item>
                <Form.Item
                    label="开始时间-结束时间"
                    // name="time"
                    // rules={[{ required: true, message: '请选择所属分类' }]}
                >
                  <Form.Item
                    name="startTime"
                    rules={[{ required: true }]}
                    style={{ display: 'inline-block', margin: '0 8px 0 0' }}
                  >
                    <DatePicker showTime></DatePicker>
                  </Form.Item>
                  <Form.Item
                    name="endTime"
                    rules={[{ required: true }]}
                    style={{ display: 'inline-block', }}
                  >
                    <DatePicker showTime></DatePicker>
                  </Form.Item>
                 
                </Form.Item>
                <Form.Item
                    label="频道配置"
                    name="channelId"
                    rules={[{ required: true, message: '请选择频道配置' }]}
                  >
                  <Select
                        placeholder="请选择频道配置"
                        mode="multiple"
                        onChange={(val)=>{
                          console.log(val)
                        }}
                        // defaultValue={this.state.newData.categories||[]}
                        // {...this.state.selectProps}
                        allowClear
                      >
                        {
                          this.state.channelList.map(r=>{
                            return(
                              <Option value={r.code} key={r.id}>{r.name}</Option>
                            )
                          })
                        }
                      </Select>
                  </Form.Item>
                  <Form.Item
                    label="投票选项"
                    // name="voters"
                    // rules={[{ required: true, message: '请选择所属分类' }]}
                  >
                  <Form.List name="voters">
                    {(fields, { add, remove }) => (
                      <>
                      {console.log(this.formRef.current?this.formRef.current.getFieldValue("voteType"):1,"voteType")}
                        {fields.map((field,index) => (
                          <Space key={field.key} align="baseline">
                            {
                              this.formRef.current && this.formRef.current.getFieldValue("voteType") == 10?
                              <Form.Item
                                {...field}
                                label="点赞特效"
                                name={[field.name, 'effect']}
                                fieldKey={[field.fieldKey, 'effect']}
                              >
                                <Select>
                                  <Option value={1} key={1}>点赞</Option>
                                  <Option value={2} key={2}>踩</Option>
                                  <Option value={3} key={3}>打气</Option>
                                </Select>
                              </Form.Item>:""
                            }
                            <Form.Item
                              {...field}
                              label="选项"
                              name={[field.name, 'name']}
                              fieldKey={[field.fieldKey, 'name']}
                              // rules={[{ required: true, message: '选项' }]}
                            >
                             <Input />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label="选项图片"
                              name={[field.name, 'avtor']}
                              fieldKey={[field.fieldKey, 'avtor']}
                              // rules={[{ required: true, message: '选项图片' }]}
                            >
                              <div className="image_vote" style={{display:"flex","alignItems":"flex-start"}}>
                                <TextArea autoSize 
                                key={this.formRef.current.getFieldValue("voters")[field.key]?this.formRef.current.getFieldValue("voters")[field.key].avtor:""}
                                defaultValue={
                                  this.formRef.current.getFieldValue("voters")[field.key]?this.formRef.current.getFieldValue("voters")[field.key].avtor:""
                                }
                                onChange={(val)=>{
                                  if(this.formRef.current.getFieldValue("voters")[field.key]){
                                    let arr = this.formRef.current.getFieldValue("voters")
                                    arr[index].avtor = val.target.value
                                    if(privateData.inputTimeOutVal) {
                                      clearTimeout(privateData.inputTimeOutVal);
                                      privateData.inputTimeOutVal = null;
                                      }
                                      privateData.inputTimeOutVal = setTimeout(() => {
                                          if(!privateData.inputTimeOutVal) return;
                                          this.formRef.current.setFieldsValue({"voters":arr})
                                      }, 1000)
                                    
                                  }
                                }}
                                   />
                                <ImageUpload  getUploadFileUrl={this.getUploadFileUrl.bind(this,index)}
                                imageUrl={this.formRef.current.getFieldValue("voters")[field.key]?this.formRef.current.getFieldValue("voters")[field.key].avtor:""}
                                 />
                              </div>
                              
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label="投票人数"
                              name={[field.name, 'votes']}
                              fieldKey={[field.fieldKey, 'votes']}
                              // rules={[{ required: true, message: '投票人数' }]}
                            >
                              <InputNumber min={0} />
                            </Form.Item>

                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          </Space>
                        ))}

                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          新建投票选项
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  </Form.Item>
                  <Form.Item
                    label="状态"
                    name="state"
                    valuePropName="checked"
                    // rules={[{ required: true, message: '请选择状态' }]}
                  >
                    <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                  </Form.Item>
                  <Form.Item
                    label="用户设备标签"
                    // rules={[{ required: true, message: '请选择状态' }]}
                    // style={{ display: 'inline-flex'}}
                  >
                    <Form.Item
                    name="tags"
                    // rules={[{ required: true, message: '请选择状态' }]}
                    style={{ display: 'inline-flex', width: 'calc(50% - 8px)', margin: '0 8px 0 0' }}
                    >
                      <Select
                        placeholder="请选择用户设备标签"
                        mode="multiple"
                        onChange={(val)=>{
                          console.log(val)
                          
                        }}
                        // defaultValue={this.state.newData.tags}
                        // {...this.state.selectProps}
                        allowClear
                      >
                        {
                          this.state.userTagList.map(r=>{
                            return <Option value={r.code} key={r.id}>{r.name}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="标签投放类型"
                      name="deliverType"
                      // rules={[{ required: true, message: '请选择状态' }]}
                      style={{ display: 'inline-flex', width: 'calc(50% - 8px)'}}
                    >
                      <Radio.Group 
                      // onChange={onChange} value={value}
                      >
                        <Radio value={1}>定向</Radio>
                        <Radio value={2}>非定向</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                      label="地域"
                      name="area"
                      // rules={[{ required: true, message: '请选择地域' }]}
                    >
                      <Address defaultAddress={this.state.defaultAddress}
                        onCheckAddress={this.onCheckAddress.bind(this)}
                      />
                    </Form.Item>
                  <Form.Item
                    label="渠道"
                    name="market"
                    // rules={[{ required: true, message: '请选择所属类别' }]}
                  >
                      <Market getMarketReturn={this.getMarketReturn.bind(this)}
                      checkData={this.state.currentItem.market}
                       />
                  </Form.Item>
                  <Form.Item
                    label="产品线"
                    name="product"
                    // rules={[{ required: true, message: '请选择产品线' }]}
                  >
                     <Select
                        placeholder="请选择"
                        mode="multiple"
                        allowClear
                      >
                        {
                          this.state.productList.map(r=>{
                            return(
                              <Option value={r.id.toString()} key={r.appid}>{r.name}</Option>
                            )
                          })
                        }
                      </Select>
                  </Form.Item>
                  
                  
                <Form.Item {...this.state.tailLayout}>
                  <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                    确定
                  </Button>
                </Form.Item>
              </Form> 
            }
          </Modal>
      </div>
    )
  }
  componentDidMount(){
    this.getVotingList() // 查询列表数据
    this.getMyProduct() // 查询产品线
    this.getUserTag() // 用户标签
    this.getChannel() // 用户标签
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    },()=>{
      this.getVotingList()
    })
  
  }
  // //获取国家地区
  // getPlace(){
  //   let params={
  //     page:{isPage:9}
  //   }
  //   getPlace(params).then(res=>{
  //     let address = Object.assign([],res.data.data)
  //     let arr = address.filter(item=>item.parentCode === "CN")
  //     arr.forEach(r=>{
  //       r.title = r.name
  //       r.key = r.code + "-"
  //       r.children =[]
  //       address.forEach(h=>{
  //         if(r.code === h.parentCode){
  //           r.children.push({title:h.name,key:h.code})
  //         }
  //       })
  //     })
  //     let tree =[
  //       {title:"全选",key:"all",children:arr}
  //     ]
  //     this.setState({
  //       treeData:tree
  //     })
  //   })
  // }
  getMyProduct(){ //获取产品线
    let params={
      page:{isPage:9},
      prodType:1
    }
    getMyProduct(params).then(res=>{
      this.setState({
        productList:res.data.data
      })
    })
  }
  getUserTag(){ //获取用户标签
    getUserTag({}).then(res=>{
      this.setState({
        userTagList:res.data.data
      })
    })
  }
  getChannel(){ //获取用户标签
    getChannel({}).then(res=>{
      this.setState({
        channelList:res.data.data
      })
    })
  }
  onSelectAddress(val){
    console.log(val)
  }
  onCheckAddress(val){
    console.log(val)
    let postAddress = val.filter(item=>item !== "all")
    let arr = []
    postAddress.forEach(r=>{
      if(r.indexOf("-") !== -1){
        arr.push(r.replace("-",""))
      }else{
        arr.push(r)
      }
    })
    this.setState({
      defaultAddress:arr
    })
  }
  submitForm(params){
    console.log(params)
    this.closeModel()
    if(this.state.source === 2){
      this.editVoting(params)
    }else{
      this.addVoting(params,1)
    }
    
  }
  closeModel(){
    this.formRef.current.resetFields()
    this.setState({
      visible:false,
    })
  }
  getVotingList(){
    let params={
      "voteTitle":this.state.searchWord.name, //(string)名称
      "voteType": this.state.searchWord.type, // (int)类型:10=提前展示结果;20=不提前展示结果
      page:{
        "currentPage": this.state.page,
        "pageSize": this.state.pageSize
      }
    }
    getVotingList(params).then(res=>{
      if(res.data.errCode == 0){
        let arr = res.data.data.data
        arr.forEach(r=>{
          if(r.tags){
            r.tags = r.tags.split(",")
          }else{
            r.tags = []
          }
          if(r.market){
            r.market = r.market.split(",")
          }else{
            r.market = []
          }
          if(r.product){
            r.product = r.product.split(",")
          }else{
            r.product = []
          }
        })
       this.setState({
        lists:[...arr],
        total:res.data.data.page.totalCount
       })
       console.log(arr)
      }
    })
  }
  addVoting(item,type){
    if(type == 2) delete item.voteId
    let params={
      ...item,
      area:this.state.defaultAddress?this.state.defaultAddress.join(","):"",
      startTime:type ==2?item.startTime:parseInt(item.startTime.toDate().getTime() / 1000),
      endTime:type ==2?item.endTime:parseInt(item.endTime.toDate().getTime() /1000),
      state:type ==2?item.state:item.state?1:0,
      tags:item.tags?item.tags.join(","):'',
      market:item.market?item.market.join(","):'',
      product:item.product?item.product.join(","):''
    }
    // return console.log(params,"params")
    addVoting(params).then(res=>{
      if(res.data.errCode === 0){
        if(type == 2) message.success("复制成功")
        else message.success("新增成功")
        this.getVotingList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  editVoting(item){
    let params={
      ...this.state.currentItem,
      ...item,
      area:this.state.defaultAddress?this.state.defaultAddress.join(","):"",
      startTime:parseInt(item.startTime.toDate().getTime() / 1000),
      endTime:parseInt(item.endTime.toDate().getTime() /1000),
      state:item.state?1:0,
      tags:item.tags.join(","),
      market:item.market.join(","),
      product:item.product.join(",")
    }
    // return console.log(params,"params")
    editVoting(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("修改成功")
        this.getVotingList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  // 删除文章
  delArt(item) {
    Modal.confirm({
      title: '删除此活动',
      content: '确认删除？',
      onOk: ()=>{
        this.deleteVote(item)
      },
      onCancel: ()=>{

      }
    })
  }
  deleteVote(item){
    let params={
      id:item.voteId
    }
    deleteVote(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("删除成功")
        this.getVotingList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  changeStateVote(item){
    let params={
      id:item.voteId
    }
    changeStateVote(params).then(res=>{
      if(res.data.errCode === 0){
        // this.getVotingList()
        // item.state = item.state === 1?false:true
        // this.setState({
        //   lists:this.state.lists
        // })
      }else{
        message.error(res.data.msg)
      }
    })
  }
  voteSyncCache(){ // 数据同步
    voteSyncCache({}).then(res=>{
      if(res.data.errCode === 0){
        message.success("数据同步成功")
      }else{
        message.error(res.data.msg)
      }
    })
  }
  getMarketReturn(val){
    console.log(val)
    this.state.currentItem.market = val
    this.setState({
      currentItem:this.state.currentItem
    })
    this.formRef.current.setFieldsValue({"market":val})
  }
  //获取上传的图片路径
  getUploadFileUrl(index,file){
    console.log(file,"获取上传的图片路径")
     let arr = this.formRef.current.getFieldValue("voters")
     arr[index].avtor = file
     this.formRef.current.setFieldsValue({"voters":arr})
  }
}
