import React, { Component } from 'react'
// import request from 'utils/request'
import { baseUrl,getList,getRecords,importFile} from 'api'
import { Card, Button, Table, message, DatePicker,Select,Upload,Input} from 'antd'
import {  } from 'react-router-dom'
import {  } from "@ant-design/icons"
import  util from 'utils'
import XLSX from 'xlsx'
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
const url =  {
  downloadUrl: './file/template.xlsx',
}
export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    let _this = this
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      dataLoading:false,
      currentItem:{},
      lists: [],
      excelData:"",
      optionList:[],
      activityType:[
        {id:1,name:"秒杀活动"},
        {id:2,name:"抽奖活动"},
        {id:3,name:"拼团实物套餐"},
        // {id:4,name:"私域兑换"},
      ],
      screen:{}, //筛选对象
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      activityTpye:0,   // 活动类别  ==1的时候显示筛选权益名称
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "商品sn",
          dataIndex: "sn",
          key: "sn",
          width:150,
        },
        {
          title: "活动类别",
          dataIndex: "activityType",
          key: "activityType",
          width:130,
          render:(RowValue,row,index)=>{
            return <span>{RowValue==1?'秒杀活动':RowValue==2?'抽奖活动':RowValue==3?"拼团实物套餐":RowValue==4?"私域兑换":""}</span>
          }
        },
        {
          title: "商品名称",
          dataIndex: "goodName",
          key: "goodName",
          width:"8%",
        },
        {
          title: "userid",
          dataIndex: "userId",
          key: "userId",
          width:150,
        },
        {
          title: "参与时间",
          dataIndex: "createTime",
          key: "createTime",
          width:"10%",
          render: (rowValue,row,index) => {
            return (
              <span>{util.formatTime(String(row.createTime).length==10? row.createTime* 1000:row.createTime,"","")}</span>
            )
          },
        },
        {
          title: "昵称",
          dataIndex: "userName",
          key: "userName",
          width:150,
        },
        {
          title: "联系人",
          dataIndex: "contactorName",
          key: "contactorName",
          width:"5%",
        },
        {
          title: "手机",
          dataIndex: "contactorMobile",
          key: "contactorMobile",
          width:150,
        },
        {
          title: "收货地址",
          dataIndex: "contactorAddress",
          key: "contactorAddress",
          width:"10%",
        },
        {
          title: "用户备注",
          dataIndex: "contactorNote",
          key: "contactorNote",
          width:150,
        },
        {
          title: "发货状态",
          dataIndex: "state",
          key: "state",
          width:"5%",
          render: (rowValue,row,index) => {
            return (
              <span>{row.state === 20?"待发货":row.state === 30?"已发货":"-"}</span>
            )
          },
        },
        {
          title: "物流单号",
          dataIndex: "shippingCode",
          key: "shippingCode",
          width:250,
        },
        {
          title: "物流公司",
          dataIndex: "shippingCompany",
          key: "shippingCompany",
          width:"10%",
        },
      ],
      visible:false,
      updateProps: {
        name:"file",
        // listType:"picture-card",
        className:"uploader_file",
        action: `${baseUrl}/mms/activity/levelMs/import`,
        headers: {
          authorization: JSON.parse(localStorage.getItem("user")).authorization,
        },
        onChange(info) {  // 监控上传状态的回调
          if (info.file.status !== 'uploading') {
            _this.setState({ loading: true });
          }
          if (info.file.status === 'done') {
            console.log(info.file)
            if(info.file.response.errCode === 0){
              message.success(info.file.response.msg);
              setTimeout(()=>{
                _this.setState({ loading: false,screen:{}},()=>{
                  _this.getRecords(1)
                });
              },1500)
             
            }else{
              _this.setState({ loading: false});
              message.error(info.file.response.msg);
            }
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            _this.setState({ loading: false});
          }
        },
        beforeUpload(file){
          // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          // if (!isJpgOrPng) {
          //   message.error('You can only upload JPG/PNG file!');
          // }
          // const isLt2M = file.size / 1024 / 1024 < 2;
          // if (!isLt2M) {
          //   message.error('Image must smaller than 2MB!');
          // }
          // return isJpgOrPng && isLt2M;
        }
      },
    }
  }
  render() {
    return (
      <div className="address">
        <Card title={
          <div className="cardTitle">
            <div className='everyBody'>
              <div>活动类别:</div>
              <Select allowClear  placeholder="请选择权益类型"
                onChange={(val)=>{
                  console.log(val)
                  this.setState({
                    activityTpye:val,
                    screen:{}
                  },()=>{
                    this.forceUpdate();
                    this.getRecords(1)
                  })
                }}
              >
                {
                  this.state.activityType.map(r=>{
                    return(
                      <Option value={r.id} key={r.id}>{r.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            {
              this.state.activityTpye==1 &&
              <div className="everyBody">
                <div>权益名称:</div>
                <Select allowClear  placeholder="请选择权益类型"
                  onChange={(val)=>{
                    if(val){
                      this.state.screen.rightId = Number(val)
                    }else{
                      delete this.state.screen.rightId
                    }
                    this.getRecords(1)
                  }}
                >
                  {
                    this.state.optionList.map(r=>{
                      return(
                        <Option value={r.indexId} key={r.indexId}>{r.name}</Option>
                      )
                    })
                  }
                </Select>
              </div>
            }
            <div className="everyBody">
              <div>参与时间:</div>
              <RangePicker   
              showTime
                onChange={(val)=>{
                  if(val){
                    this.state.screen.startTime = Number(new Date(val[0].toDate()).getTime())
                    this.state.screen.endTime = Number(new Date(val[1].toDate()).getTime())
                  }else{
                    delete this.state.screen.startTime
                    delete this.state.screen.endTime
                  }
                  this.getRecords(1)
                }}
              />
            </div>
            <div className="everyBody">
              <div>发货状态:</div>
              <Select allowClear  placeholder="请选择发货状态" 
                onChange={(val)=>{
                  if(val){
                    this.state.screen.state = Number(val)
                  }else{
                    delete this.state.screen.state
                  }
                  this.getRecords(1)
                }}
              >
                <Option value={30} key={30}>已发货</Option>
                <Option value={20} key={20}>待发货</Option>
              </Select>
            </div>
            {/* <div className="everyBody">
              <div>商品sn:</div>
              <Input placeholder="请输入商品sn"  />
            </div> */}
            <div className="everyBody">
              <div>用户userid:</div>
              <Input.Search allowClear placeholder="请输入用户userid" onSearch={(val)=>{
                if(val){
                  this.state.screen.userId = val
                }else{
                  delete this.state.screen.userId
                }
                this.getRecords(1)
              }} />
            </div>
          </div>
        }
        extra={
          <div>
            <Button type="primary" onClick={()=>{this.exportExcel(1)}}>导出</Button>
             <Button type="primary" style={{margin:"0 20px"}}  loading={this.state.loading}>
                  <Upload {...this.state.updateProps}>
                      导入数据（发货）
                   </Upload>
               </Button>
             <Button type="primary"><a href={url.downloadUrl} download >下载导入模版</a></Button>
          </div>
        }
        >
          <Table 
              dataSource={this.state.lists}
              scroll={{ x: 2500, y: '75vh' }}
              pagination={{
                current:this.state.page,
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize,
                pageSizeOptions:[10,50,100,1000,5000],
                // hideOnSinglePage:true,
                showSizeChanger:true
              }}
              rowKey={item=>item.id}
              loading={this.state.loading}
              columns={this.state.columns} />
         
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.getList() // 查询列表数据
    //this.getGoods();
    this.getRecords(1)
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    },()=>{
      this.getRecords()
    })
  }
  getList(){
    getList({key:"USER.EQUITY"}).then(res=>{
      console.log("获取 类型",res)
      if(res.data.errCode == 0){
       this.setState({
         optionList:res.data.data
       })
      }
    })
  }
  getRecords(type){
    if(type){
      this.setState({
        page:type
      })
    }
    let params={
      ...this.state.screen,
      activityType:this.state.activityTpye,
      // currentPage: type?type:this.state.page,
      // pageSize: this.state.pageSize
      "page": {
        "currentPage": type?type:this.state.page,
        "pageSize": this.state.pageSize,
        // "pageSize": 10,
      }
    }
    getRecords(params).then(res=>{
      console.log(res);
      if(res.data.errCode == 0){
       this.setState({
         lists:res.data.data.data,
         total:res.data.data.page.totalCount
       })
      }
    })
  }
  exportExcel = (type) => {
    // 处理表头
    // console.log(Object.keys(this.state.lists[0]))
    let data = [];
    let keys = []
    let exportKey = []
    this.state.columns.forEach(r=>{
      keys.push(r.title)
      exportKey.push(r.key)
    })
    data.push(keys)
    this.state.lists.forEach(l=>{
      let obj =[]
      exportKey.forEach(r=>{
        if(r === "createTime"){
          obj.push(util.formatTime(l[r],"",""))
        }else if(r === "state"){
          obj.push(l[r] === 20?"待发货":l[r] === 30?"已发货":"未知")
        }else{
          obj.push(l[r])
        }
      })
      data.push(obj)
    })
    this.setState({
      excelData:data
    }, ()=>{
      this.exportFile(type)
    })
  }
  exportFile = (type) => {
    // 导出excel
		const ws = XLSX.utils.aoa_to_sheet(this.state.excelData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		XLSX.writeFile(wb, "用户列表.xlsx")
  }
  importFile(){

  }
}
