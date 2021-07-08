import React, { Component } from 'react'
import { Card, Breadcrumb, Form, Input, Button, message, Upload, Image,DatePicker,TimePicker,Select } from 'antd'
import { UploadOutlined,LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom'
import {  updateArt } from 'api'
import "./style.css"
import moment from 'moment';
const { Option } = Select;


export default class ArtEdit extends Component {
  constructor(){
    super();
    const _this = this;
    this.state={
      loading: false,
      art: null,
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
      props: {
        name:"avatar",
        listType:"picture-card",
        className:"avatar-uploader",
        showUploadList:false,
        action: 'http://rap2api.taobao.org/app/mock/275069/api/v1/upload',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {  // 监控上传状态的回调
          if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
            _this.setState({ loading: true });
          }
          if (info.file.status === 'done') {
            _this.getBase64(info.file.originFileObj, imageUrl =>
              _this.setState({
                imageUrl,
                loading: false,
              }),
            );
            message.success(`${info.file.name} 上传成功`);
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

    }
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  render() {
    const { loading, imageUrl } = this.state;
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
             name="basic"
             onFinish={this.submitForm}
             initialValues = {{
               ...this.props.channelItem
             }}
           >
             <Form.Item label="频道" style={{ marginBottom: 0 }} rules={[{ required: true }]}>
               <Form.Item
                 name="year"
                 rules={[{ required: true,message: '请选择电视台' }]}
                 style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
               >
                 <Select
                   placeholder="请选择电视台"
                   onChange={this.onGenderChange}
                   {...this.state.selectProps}
                   allowClear
                 >
                   <Option value="male">male</Option>
                   <Option value="female">female</Option>
                   <Option value="other">other</Option>
                   
                 </Select>
               </Form.Item>
               <Form.Item
                 name="month"
                 rules={[{ required: true,message: '请选择频道'  }]}
                 style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
               >
                 <Select
                   placeholder="请选择频道"
                   onChange={this.onGenderChange}
                   {...this.state.selectProps}
                   allowClear
                 >
                   <Option value="male">male</Option>
                   <Option value="female">female</Option>
                   <Option value="other">other</Option>
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
               {/* <Input.TextArea /> */}
               <TimePicker onChange={this.startTime.bind(this)} initialValues={moment('00:00:00', 'HH:mm:ss')} />
             </Form.Item>
             <Form.Item
               label="关联节目"
               name="channel"
             >
               {/* <Input.TextArea /> */}
               <Select
                 placeholder="请选择关联节目"
                 onChange={this.onGenderChange}
                 allowClear
                 {...this.state.selectProps}
               >
                 <Option value="male">male</Option>
                 <Option value="female">female</Option>
                 <Option value="other">other</Option>
               </Select>
             </Form.Item>
             <Form.Item
               label="关联分集"
               name="desc1"
             >
               {/* <Input.TextArea /> */}
               <Select
                 placeholder="请选择关联分集"
                 onChange={this.onGenderChange}
                 allowClear
                 {...this.state.selectProps}
               >
                 <Option value="male">male</Option>
                 <Option value="female">female</Option>
                 <Option value="other">other</Option>
               </Select>
             </Form.Item>
             <Form.Item
               label="显示名称"
               name="name1"
               rules={[{ required: true, message: '请填写显示名称' }]}
             >
               {/* <Input.TextArea /> */}
               <Input placeholder="请填写显示名称" />
             </Form.Item>
             
             <Form.Item
               label="封面图片"
               // name="desc"
             >
               {/* 上传文件的控件 */}
               <Upload {...this.state.props}>
                {imageUrl ? <img src={imageUrl} alt="avatar" preview={true} style={{ width: '100%' }} /> : uploadButton}
               </Upload>
             </Form.Item>

             <Form.Item {...this.state.tailLayout}>
               <Button onClick={()=>{this.props.closeModel()}}>
                 取消
               </Button>
               <Button htmlType="submit" type="primary" style={{margin:"0 20px"}}>
                 保存
               </Button>
               <Button type="primary" danger htmlType="submit">
                保存并插入下一条
               </Button>
             </Form.Item>
           </Form>
              
            }
          </div>
        </Card>
      </div>
    )
  }

  componentDidMount(){
  }
  startDay(value){
    console.log(value)
  }
  startTime(time, timeString){
    console.log(time, timeString)
  }
  onGenderChange(value){
    console.log(value,"关联节目")
  }

  submitForm = (params) => {
    console.log(params,"params")
    this.props.closeModel()
    params = {                                                                                                                                                       
      ...params,
      id: this.props.match.params.ardId,
    }
    return
    updateArt(params).then(res=>{
      if(res.data.code === 200) {
        // 弹出提示框提醒增加结果
        message.success(res.data.msg, 2, ()=>{
          this.props.history.push('/mms/artLists')
        });
      }
    })
  }
}
