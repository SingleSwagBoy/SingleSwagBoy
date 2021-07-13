import React, { Component } from 'react'
// import request from 'utils/request'
import { baseUrl,getList , addList,setConfig,getConfig,deleteConfig,syn_config,syn_slice } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Upload,Image} from 'antd'
import {  } from 'react-router-dom'
import { LoadingOutlined,PlusOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
const { confirm } = Modal
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
export default class WinningNews extends Component {
  formRef = React.createRef();
  constructor(){
    super();
    const _this = this;
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      loading:false,
      dataLoading:false,
      lists: [],
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      columns: [
        {
          title: "ID",
          dataIndex: "indexId",
          key: "indexId",
        },
        {
          title: "发送时间",
          dataIndex: "createTime",
          key: "createTime",
          render: (rowValue, row, index) => {
            return (
              <span>
                {util.formatTime(row.createTime*1000,"",1)}
              </span>
            )
          }
        },
        {
          title: "发送信息",
          dataIndex: "text",
          key: "text",
        },
        {
          title: "操作",
          key: "action",
          render: (rowValue, row, index)=>{
            return (
              <div>
                <Button 
                  size="small"
                  danger
                  onClick={()=>{this.delArt(row.indexId)}}
                  >删除</Button>
                
              </div>
            )
          }
        }
      ],
      visible:false,
      h5BackVisible:false,
      imageH5Url:"",
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
                imageH5Url:info.file.response.data.fileUrl
              }),
            );
            console.log(info.file,"info.file")
            // let a = _this.state.formData
            //  a.image= info.file.response.data.fileUrl
            //  _this.formRef.current.setFieldsValue(_this.state.formData)
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
    }
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  render() {
    const { loading, imageH5Url } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>夺奖快讯</Breadcrumb.Item>
          </Breadcrumb>
          
        }
        extra={
          <div>
            <Button type="primary"
              onClick={()=>{
              
                this.setState({visible:true},()=>{
                  this.formRef.current.resetFields()
                })
                
              }}
            >新增</Button>
             <Button type="primary"
              style={{margin:"0 0 0 20px"}}
              onClick={()=>{
                this.getConfig()
                this.setState({h5BackVisible:true})
              }}
            >头图</Button>
             <Button type="primary"
              style={{margin:"0 0 0 20px"}}
              loading={this.state.dataLoading}
              onClick={()=>{
                this.setState({
                  dataLoading:true
                })
                this.syn_config("OLYMPIC.H5.BG.IMG")
                this.syn_slice("OLYMPIC.MEDAL.NEWS")
              }}
            >数据同步</Button>
          </div>
         
        }
        >
          <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              pagination={{
                pageSize: this.state.pageSize,
                total: this.state.total,
                onChange: this.changeSize
              }}
              columns={this.state.columns} />
         
        </Card>
        <Modal
            title="新增夺奖快讯"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel(1)}}
            footer={null}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this,1)}
                ref = {this.formRef}
              >
                <Form.Item
                  label="夺奖快讯"
                  name="name"
                  rules={[{ required: true, message: '请填写夺奖快讯' }]}
                >
                  {/* <Input.TextArea /> */}
                  <Input placeholder="请填写夺奖快讯" />
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
            title="H5头图"
            centered
            visible={this.state.h5BackVisible}
            onCancel={() => {this.closeModel(2)}}
            footer={null}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm.bind(this,2)}
                // ref = {this.formRef}
              >
               <Form.Item
                  label="封面图片"
                  name="image"
                  valuePropName="fileList" 
                    // 如果没有下面这一句会报错
                    getValueFromEvent={normFile} 
                >
                  {/* 上传文件的控件 */}
                  <Upload {...this.state.updateProps}>
                    {/* <Image /> */}
                    {this.state.imageH5Url ? <img src={this.state.imageH5Url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                  <Image />
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
    this.getList() // 查询列表数据
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(type){
    if(type == 1){
      this.setState({
        visible:false
      })
    }else{
      this.setState({
        h5BackVisible:false,
      })
    }
   
  }
  // 新增
  submitForm(type,params){
    console.log(params)
    if(type == 1){
      this.addList(params)
    }else{
      this.setConfig(params)
    }
   
    this.closeModel(type)
  }
  // 删除文章
  delArt(id) {
    Modal.confirm({
      title: '删除此夺奖快讯',
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
  getList(){
    getList({key:"OLYMPIC.MEDAL.NEWS"}).then(res=>{
      if(res.data.errCode == 0){
        this.setState({
          lists:res.data.data
        })
      }
    })
  }
  getConfig(){
    getConfig({key:"OLYMPIC.H5.BG.IMG"}).then(res=>{
      if(res.data.errCode == 0){
        this.setState({
          imageH5Url:res.data.data.h5BgImgUrl
        })
      }
    })
  }
  addList(val){
    let params={
      text:val.name,
      createTime:parseInt(new Date().getTime() / 1000)
    }
    addList({key:"OLYMPIC.MEDAL.NEWS"},params).then(res=>{
      if(res.data.errCode == 0){
        this.getList()
      }
    })
  }
  setConfig(val){ // 设置h5 头图
    let params={
      h5BgImgUrl:this.state.imageH5Url,
    }
    setConfig({key:"OLYMPIC.H5.BG.IMG"},params).then(res=>{
      if(res.data.errCode == 0){
        message.success("设置成功")
        this.getConfig()
      }else{
        message.error("设置失败")
      }
    })
  }
  deleteConfig(id){
    deleteConfig({key:"OLYMPIC.MEDAL.NEWS","id":id}).then(res=>{
      if(res.data.errCode === 0){
        message.success("删除成功")
        this.getList()
      }else{
        message.error("删除失败")
      }
    })
  }
  syn_config(key){
    syn_config({key:key}).then(res=>{
      if(res.data.errCode === 0){
        message.success("同步成功")
      }else{
        message.error("同步失败")
      }
    })
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
