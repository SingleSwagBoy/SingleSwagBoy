import React, { Component } from 'react'
import { Card, Form, Input, Button, message, Upload, Image,DatePicker,TimePicker,Select } from 'antd'
import { LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {  } from 'react-router-dom'
import { baseUrl,getChannelGroupChannel,searchPrograms ,updateChannelProgram,addChannelProgram} from 'api'
import "./style.css"
// import moment from 'moment';
// import util  from 'utils';
const { Option } = Select;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
let privateData = {
  inputTimeOutVal: null
};
export default class ChannelEdit extends Component {
  formRef = React.createRef();
  constructor(props){
    super(props);
    const _this = this;
    console.log(props)
    this.state={
      loading: false,
      formData:{},
      status:null,
      channelGroup:[],
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      thumb: "",
      editor: null,
      selectProps:{
        optionFilterProp:"children",
        filterOption(input, option){
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        showSearch(){
          console.log('onSearch')
        }
      },
      updateTime:"",
      updateTime_hours:"",
      updateProps: {
        name:"file",
        listType:"picture-card",
        className:"avatar-uploader",
        showUploadList:false,
        action: `${baseUrl}/mms/file/upload?dir=ad`,
        headers: {
          authorization: JSON.parse(localStorage.getItem("user")).authorization,
        },
        onChange(info) {  // 监控上传状态的回调
          if (info.file.status !== 'uploading') {
            _this.setState({ loading: true });
          }
          if (info.file.status === 'done') {
            _this.getBase64(info.file.originFileObj, imageUrl =>
              _this.setState({
                imageUrl,
                loading: false,
              }),
            );
            let a = _this.state.formData
             a.h_image= info.file.response.data.fileUrl
             _this.formRef.current.setFieldsValue(_this.state.formData)
            message.success(`上传成功`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
          }
        },
        beforeUpload(file){
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
          }
          return isJpgOrPng && isLt2M;
        }
      },
      programGrounp:[],
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.channelItem){
      this.setState({
        formData:nextProps.channelItem,
        status:1
      },()=>{
        this.formRef.current.setFieldsValue(nextProps.channelItem)
        this.searchPrograms(this.state.formData.programName)
      })
    }else{
      console.log("晴空")
      this.setState({
        formData:{},
        status:2
      })
      this.formRef.current.resetFields()
    }
    if(nextProps.channelGroup){
      this.setState({
        channelGroup:nextProps.channelGroup
      })
    }
    
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div className="edit_channel">
        <Card>
          <div style={{maxWidth: 800}}>
            {
             <Form
             {...this.state.layout}
             ref = {this.formRef}
             name="basic"
             onFinish={this.submitForm}
            //  initialValue = {{
            //    ...this.state.formData
            //  }}
           >
             <Form.Item label="频道" style={{ marginBottom: 0 }} rules={[{ required: true }]}>
               <Form.Item
                 name="channelGroupId"
                 rules={[{ required: true,message: '请选择频道' }]}
                 style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
               >
                 {/* {getFieldDecorator('name', {
                    getValueFromEvent: val => {
                            // 进行你想要的操作
                            return val;
                    }
                  })(
                    
                  )} */}
                  <Select
                      placeholder="请选择频道"
                      onChange={this.onGenderChange.bind(this,1,"channelGroupId")}
                      {...this.state.selectProps}
                      allowClear
                    >
                      {
                        this.props.channel.map(r=>{
                          return(
                            <Option value={r.channelGroupId} key={r.channelGroupId}>{r.channelName}</Option>
                          )
                        })
                      }
                      
                    </Select>
               </Form.Item>
               <Form.Item
                 name="channelCode"
                 rules={[{ required: true,message: '请选择频道组'  }]}
                 style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
               >
                 <Select
                   placeholder="请选择频道组"
                   onChange={this.onGenderChange.bind(this,2,"channelCode")}
                   {...this.state.selectProps}
                   allowClear
                 >
                   {
                     this.state.channelGroup.map(r=>{
                       return(
                        <Option value={r.channelCode} key={r.channelCode}>{r.channelName}</Option>
                       )
                     })
                   }
                 </Select>
               </Form.Item>
             </Form.Item>
             

             <Form.Item
               label="开始日期"
               name="startTime"
               rules={[{ required: true, message: '请填写开始日期' }]}
             >
               <DatePicker onChange={this.startDay.bind(this)} />
             </Form.Item>

             <Form.Item
               label="开始时间"
               name="time"
               rules={[{ required: true, message: '请填写开始时间' }]}
             >
               <TimePicker onChange={this.startTime.bind(this)} />
             </Form.Item>
             <Form.Item
               label="关联节目"
               name="programName"
               rules={[{ required: true, message: '请填写关联节目' }]}
             >
               {/* <Input.TextArea /> */}
               <Select
                 placeholder="请选择关联节目"
                 onChange={this.onGenderChange.bind(this,3,"programName")}
                 allowClear
                 {...this.state.selectProps}
                 onSearch={(val)=>{
                   console.log(val)
                   if(privateData.inputTimeOutVal) {
                    clearTimeout(privateData.inputTimeOutVal);
                    privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                        if(!privateData.inputTimeOutVal) return;
                        this.searchPrograms(val)
                    }, 1000)
                 }}
               >
                 {
                   this.state.programGrounp.map((r,i)=>{
                     return(
                      <Option value={r.name} key={i}>{r.name}</Option>
                     )
                   })
                  
                 }
                 
                 
               </Select>
             </Form.Item>
             <Form.Item
               label="关联分集"
               name="season"
             >
               {/* <Input.TextArea /> */}
               <Select
                 placeholder="请选择关联分集"
                 onChange={this.onGenderChange}
                 allowClear
                 {...this.state.selectProps}
               >
                 
               </Select>
             </Form.Item>
             <Form.Item
               label="显示名称"
               name="name"
               rules={[{ required: true, message: '请填写显示名称' }]}
             >
               {/* <Input.TextArea /> */}
               <Input placeholder="请填写显示名称" />
             </Form.Item>

             <Form.Item
               label="封面图片"
               name="h_image"
               valuePropName="fileList" 
                // 如果没有下面这一句会报错
                getValueFromEvent={normFile} 
             >
               {/* 上传文件的控件 */}
               <Upload {...this.state.updateProps}>
                 {/* <Image /> */}
                {this.state.formData ? <img referrer="no-referrer|origin|unsafe-url" src={this.state.formData.h_image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
               </Upload>
               <Image />
             </Form.Item>

             <Form.Item {...this.state.tailLayout}>
               <Button onClick={()=>{this.props.closeModel()}}>
                 取消
               </Button>
               <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                 保存
               </Button>
               {/* <Button type="primary" danger htmlType="submit">
                保存并插入下一条
               </Button> */}
             </Form.Item>
           </Form>
              
            }
          </div>
        </Card>
      </div>
    )
  }

  componentDidMount(){
    this.formRef.current.setFieldsValue(this.props.channelItem)
  }
  startDay(value){
    console.log(value)
    console.log(value.toDate())
    this.setState({
      updateTime:new Date(value.toDate())
    })
  }
  startTime(time, timeString){
    console.log(time, timeString)
    console.log(time.toDate())
    this.setState({
      updateTime_hours:new Date(time.toDate())
    })
  }
  onGenderChange(type,name,value){
    
    if(type === 1){
      this.getChannelGroupChannel(value)
      this.state.formData[name] = value
      this.formRef.current.setFieldsValue(this.state.formData)
    }else if(type === 2){
      this.state.formData[name] = value
      this.formRef.current.setFieldsValue(this.state.formData)
    }else if(type === 3){
      console.log(type,name,value)
      this.searchPrograms(value)
    }
  }

  submitForm = (params) => {
    console.log(params,"params")
    let a = params
    a["h_image"] =Array.isArray(a.h_image)?a.h_image.join(","):a.h_image
    let b = this.state.programGrounp.filter(item=>item.name===a.programName)
    if(b.length>0){
      a["programId"] = b[0].program_id
    }else{
      a["programId"] = ""
    }
    a["openId"] = this.state.formData.openId
    a["image"] = this.state.formData.image
    a["channelId"] = this.state.formData.channelCode
    let c = new Date(a["startTime"].toDate())
    a["startTime"] = parseInt(new Date(a["time"].toDate().setFullYear(c.getFullYear(),c.getMonth(),c.getDate())).getTime() /1000)
    console.log(a,"a")
    this.props.closeModel()
    if(this.state.status ===1){
      this.updateChannelProgram(a)
    }else{
      this.addChannelProgram(a)
    }
    
    
  }
  getChannelGroupChannel(id){//获取频道组
    let param={
      channelGroupId:id
    }
    getChannelGroupChannel(param).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          channelGroup:res.data.data
        })
        // this.formRef.current.setFieldsValue(this.state.formData)
      }
    })
  }
  searchPrograms(val){
    if(!val)return
    let param={
      word:val
    }
    searchPrograms(param).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          programGrounp:res.data.data
        })
      }
    })
  }
  updateChannelProgram(param){
    updateChannelProgram({...param}).then(res=>{
      if(res.data.errCode === 0){
        this.props.updateList()
      }
    })
  }
  addChannelProgram(param){
    addChannelProgram({...param}).then(res=>{
      if(res.data.errCode === 0){
        
      }
    })
  }
}
