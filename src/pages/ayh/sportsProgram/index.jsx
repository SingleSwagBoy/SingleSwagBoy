import React, { Component } from 'react'
// import request from 'utils/request'
import { getPlace ,addList,getList,getConfig,setConfig,getProgramsList,deleteConfig,updateList,syn_config,syn_slice} from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,Tree} from 'antd'
import {  } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { confirm } = Modal
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};
export default class SportsProgram extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      dataLoading:false,
      programGrounp:[],
      defaultProgram:"",
      lists: [],
      currentId:{indexId:null},//编辑行的id
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      treeData:[],
      columns: [
        {
          title: "ID",
          dataIndex: "indexId",
          key: "indexId",
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          render: (rowValue, row, index) => {
            return (
              <span>
                {util.formatTime(row.startTime*1000,"",1) || "-"}
              </span>
            )
          }
        },
        {
          title: "频道",
          dataIndex: "channelName",
          key: "channelName",
        },
        {
          title: "场次",
          dataIndex: "stage",
          key: "stage",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId.indexId == row.indexId?
                  <Input placeholder={row.stage} defaultValue={row.stage} onChange={(val)=>{
                    this.state.currentId.stage = val.target.value
                    this.setState({
                      currentId:this.state.currentId
                    })
                  }}  />
                  :row.stage||"-"
                }
              </div>
            )
          }
        },
        {
          title: "赛事类型",
          dataIndex: "cateName",
          key: "cateName",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId.indexId == row.indexId?
                  <Input placeholder={row.cateName} defaultValue={row.cateName} onChange={(val)=>{
                    this.state.currentId.cateName = val.target.value
                    this.setState({
                      currentId:this.state.currentId
                    })
                  }}  />
                  :row.cateName||"-"
                }
              </div>
            )
          }
        },
        {
          title: "赛事",
          dataIndex: "competitionName",
          key: "competitionName",
        },
        {
          title: "标签",
          dataIndex: "tag",
          key: "tag",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId.indexId == row.indexId?
                  <Input placeholder={row.tag} defaultValue={row.tag} onChange={(val)=>{
                    this.state.currentId.tag = val.target.value
                    this.setState({
                      currentId:this.state.currentId
                    })
                  }} />
                  :row.tag||"-"
                }
              </div>
            )
          }
        },
        {
          title: "节目信息",
          dataIndex: "name",
          key: "name",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {
                  this.state.currentId.indexId == row.indexId?
                  <Input placeholder={row.name} defaultValue={row.name} onChange={(val)=>{
                    this.state.currentId.name = val.target.value
                    this.setState({
                      currentId:this.state.currentId
                    })
                  }}  />
                  :row.name||"-"
                }
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
                  this.state.currentId.indexId===row.indexId?
                  <div>
                    <Button 
                     style={{margin:"0 10px"}}
                    size="small"
                    type="primary"
                    onClick={()=>{
                      this.updateList()
                    }}
                    >确认</Button>
                    <Button 
                      size="small"
                      danger
                      onClick={()=>{
                        this.setState({
                          currentId:{id:null}
                        })
                      }}
                      >取消</Button>
                  </div>:
                    <div>
                      <Button 
                      style={{margin:"0 10px"}}
                      size="small"
                      type="primary"
                      onClick={()=>{
                        this.setState({
                          currentId:row
                        })
                      }}
                      >编辑</Button>
                      <Button 
                        size="small"
                        danger
                        onClick={()=>{this.delArt(row.indexId)}}
                        >删除</Button>
                    </div>
                }
              </div>
            )
          }
        }
      ],
      visible:false,
      addressVisible:false,
      selectProps:{
        optionFilterProp:"children",
        filterOption(input, option){
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        showSearch(){
          console.log('onSearch')
        }
      },
      allAddress:"",
      entranceUrl:"",
      thirdJumpUrl:"",
      ip:"1",
      area:""
    }
  }
  
  render() {
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>体育节目</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true})
            }}
            >新增</Button>
             <Button type="primary"
             style={{margin:"0 20px"}}
            onClick={()=>{
              this.setState({addressVisible:true})
            }}
            >地域配置</Button>
             <Button type="primary"
              style={{margin:"0 0 0 0px"}}
              loading={this.state.dataLoading}
              onClick={()=>{
                this.setState({
                  dataLoading:true
                })
                this.syn_config(["OLYMPIC.H5.ENTRANCE","OLYMPIC.THIRD.JUMP.URL","OLYMPIC.IP.WHITELIST","OLYMPIC.AREA.CODE"])
                this.syn_slice("OLYMPIC.PROGRAMS")
              }}
            >数据同步</Button>
          </div> 
        }
        >
          <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              rowKey={record => record.indexId}
              pagination={{
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize
              }}
              columns={this.state.columns} />
         
        </Card>
        <Modal
            title="新增体育节目"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel(1)}}
            footer={null}
            width={1000}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this,1)}
              >
                <Form.Item
                  label="节目信息"
                  name="value"
                  rules={[{ required: true, message: '请填写节目信息' }]}
                >
                 <Select
                   placeholder="请输入节目信息"
                   {...this.state.selectProps}
                   allowClear
                   onSearch={(val)=>{
                    console.log(val)
                    if(privateData.inputTimeOutVal) {
                     clearTimeout(privateData.inputTimeOutVal);
                     privateData.inputTimeOutVal = null;
                     }
                     privateData.inputTimeOutVal = setTimeout(() => {
                         if(!privateData.inputTimeOutVal) return;
                         this.getProgramsList(val)
                     }, 1000)
                  }}
                 >
                   {
                    this.state.programGrounp.map((r,i)=>{
                      return(
                        <Option value={r.value} key={r.value}>{r.label}</Option>
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
          <Modal
            title="地域配置"
            centered
            visible={this.state.addressVisible}
            onCancel={() => {this.closeModel(2)}}
            footer={null}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this,2)}
                initialValues={
                  {entranceUrl:this.state.entranceUrl,ip:this.state.ip,thirdJumpUrl:this.state.thirdJumpUrl}
                }
              >
                <Form.Item
                  label="支持地域"
                  name="area"
                >
                  <Tree
                    height={250}
                    checkable
                    onCheck={this.onCheckAddress.bind(this)}
                    checkedKeys={this.state.area}
                    onSelect={this.onSelectAddress.bind(this)}
                    // defaultSelectedKeys={this.state.area}
                    treeData={this.state.treeData}
                  />
                </Form.Item>
                <Form.Item
                  label="入口H5"
                  name="entranceUrl"
                  rules={[{ required: true, message: '请输入入口H5地址' }]}
                >
                 <Input placeholder="请输入入口H5地址" defaultValue={this.state.entranceUrl} />
                </Form.Item>
                <Form.Item
                  label="预约H5"
                  name="thirdJumpUrl"
                  rules={[{ required: true, message: '请输入预约H5地址' }]}
                >
                 <Input  placeholder="请输入预约H5地址" defaultValue={this.state.thirdJumpUrl} />
                </Form.Item>
                <Form.Item
                  label="白名单"
                  name="ip"
                >
                 <Input placeholder="请输入白名单" defaultValue={this.state.ip} />
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
    this.getPlace()
    this.getList()
    this.getConfig()
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(type){
    if(type === 1){
      this.setState({
        visible:false
      })
    }else{
      this.setState({
        addressVisible:false
      })
    }
  }
  // 新增
  submitForm(type,params){
    console.log(params)
    if(type === 1){
      this.addList(params)
    }else{
      this.setConfig(params)
    }
   
    this.closeModel(type)
  }
  // 删除文章
  delArt(id) {
    Modal.confirm({
      title: '删除此节目',
      content: '确认删除？',
      onOk: ()=>{
        this.deleteConfig(id)
      },
      onCancel: ()=>{

      }
    })
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    })
  }
  //获取国家地区
  getPlace(){
    let params={
      page:{isPage:9}
    }
    getPlace(params).then(res=>{
      let address = Object.assign([],res.data.data)
      let arr = address.filter(item=>item.parentCode === "CN")
      arr.forEach(r=>{
        r.title = r.name
        r.key = r.code + "-"
        r.children =[]
        address.forEach(h=>{
          if(r.code === h.parentCode){
            r.children.push({title:h.name,key:h.code})
          }
        })
      })
      let tree =[
        {title:"全选",key:"all",children:arr}
      ]
      this.setState({
        treeData:tree
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
      area:arr,
      allAddress:arr.join(",")
    })
  }
  getList(){
    getList({key:"OLYMPIC.PROGRAMS"}).then(res=>{
      if(res.data.errCode == 0){
        this.setState({
          lists:res.data.data
        })
      }
    })
  }
  addList(val){
    console.log(val)
    let params={
      "date": "",
      "startTime": this.state.defaultProgram[val.value].start_time,
      "channelName": this.state.defaultProgram[val.value].channel_id,
      "channelId": this.state.defaultProgram[val.value].channel_id,
      "stage": "",
      "cateName": "",
      "cateId": "",
      "competitionName": "",
      "name": this.state.defaultProgram[val.value].name,
      "tag": "",
      "endTime": this.state.defaultProgram[val.value].end_time
    }
    addList({key:"OLYMPIC.PROGRAMS"},params).then(res=>{
      if(res.data.errCode == 0){
        message.success("新增成功")
        this.getList()
      }else{
        message.error("新增失败")
      }
    })
  }
  getProgramsList(val){
    if(!val)return
    let param={
      keyword:val,
      channelId:4
    }
    getProgramsList(param).then(res=>{
      if(res.data.errCode === 0 ){
        let a = Object.entries(res.data.data)
        console.log(a,"a")
        let b = []
        for (const [key, value] of a) {
          b.push({label: value.start_time +  " " +value.name  + " " + value.channel_id, value: key})
        }
        this.setState({
          programGrounp:b,
          defaultProgram:res.data.data
        })
      }
    })
  }
  getConfig(){
    let a = ["OLYMPIC.H5.ENTRANCE","OLYMPIC.THIRD.JUMP.URL","OLYMPIC.IP.WHITELIST","OLYMPIC.AREA.CODE"]
    a.forEach((r,i)=>{
      getConfig({key:r}).then(res=>{
        if(res.data.errCode === 0){
          if(i === 0){
            this.setState({
              entranceUrl:res.data.data.entranceUrl
            })
          }else if(i === 1){
            this.setState({
              thirdJumpUrl:res.data.data.thirdJumpUrl
            })
          }else if(i === 2){
            this.setState({
              ip:res.data.data.ip
            })
          }else{
            this.setState({
              area:res.data.data.area.split(",")
            })
          }
        }
      })
    })
  }
  setConfig(val){
    let a = ["OLYMPIC.H5.ENTRANCE","OLYMPIC.THIRD.JUMP.URL","OLYMPIC.IP.WHITELIST","OLYMPIC.AREA.CODE"]
    a.forEach((r,i)=>{
      let params={}
      if(i === 0){
        params.entranceUrl = val.entranceUrl?val.entranceUrl:this.state.entranceUrl
      }else if(i === 1){
        params.thirdJumpUrl = val.thirdJumpUrl?val.thirdJumpUrl:this.state.thirdJumpUrl
      }else if(i === 2){
        params.ip = val.ip?val.ip:this.state.ip
      }else{
        params.area =this.state.area.join(",")
      }
      
      setConfig({key:r},params).then(res=>{
        if(res.data.errCode === 0){
          if(i === 0){
           
          }else if(i === 1){
            
          }else if(i === 2){
            
          }else{
            
          }
        }
      })
    })
  }
  deleteConfig(id){
    deleteConfig({key:"OLYMPIC.PROGRAMS","id":id}).then(res=>{
      if(res.data.errCode === 0){
        message.success("删除成功")
        this.getList()
      }else{
        message.error("删除失败")
      }
    })
  }
  updateList(){
    let obj = this.state.lists.filter(item=>item.indexId === this.state.currentId.indexId)
    let body={
      ...obj[0]
    }
    console.log(body)
    updateList({key:"OLYMPIC.PROGRAMS","id":this.state.currentId.indexId},body).then(res=>{
      if(res.data.errCode === 0){
        message.success("更新成功")
        this.setState({
          currentId:{indexId:null}
        })
        this.getList()
      }else{
        message.error("更新失败")
      }
    })
  }
  syn_config(key){
    if(Array.isArray(key)){
      key.forEach(r=>{
        syn_config({key:r}).then(res=>{
          if(res.data.errCode === 0){
            // message.success("同步成功")
          }else{
            // message.error("同步失败")
          }
        })
      })
    }else{
      syn_config({key:key}).then(res=>{
        if(res.data.errCode === 0){
          // message.success("同步成功")
        }else{
          // message.error("同步失败")
        }
      })
    }
  }
  syn_slice(key){
    syn_slice({key:key}).then(res=>{
      if(res.data.errCode === 0){
        message.success("同步成功")
      }else{
        message.error("同步失败")
      }
      this.setState({
        dataLoading:false
      })
    })
  }
}
