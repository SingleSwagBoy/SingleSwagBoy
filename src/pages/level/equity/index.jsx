import React, { Component } from 'react'
// import request from 'utils/request'
import { baseUrl, getList } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,Image,InputNumber,Upload} from 'antd'
import {  } from 'react-router-dom'
import { LoadingOutlined,PlusOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { TextArea } = Input;
const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
export default class SportsProgram extends Component {
  formRef = React.createRef();
  constructor(){
    super();
    let _this = this
    this.state = {
      page: 1,
      pageSize: 10000,
      total: 0,
      loading:false,
      lists: [],
      currentId:"",//编辑行的id
      newData:{},
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      linkVideoList:[],
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
          title: "id",
          dataIndex: "indexId",
          key: "indexId",
        },
        {
          title: "权益名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "商品备注",
          dataIndex: "memo",
          key: "memo",
        },
        {
          title: "权益icon",
          dataIndex: "iconUrl",
          key: "iconUrl",
          render: (rowValue, row, index)=>{
            return (
              rowValue?<Image
              width={100}
              src={rowValue}
            />:"-"
            )
          }
        },
        {
          title: "排序",
          dataIndex: "sort",
          key: "sort",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {rowValue === 1?"有效":"无效"}
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
                    style={{margin:"0 10px"}}
                    size="small"
                    type="primary"
                    onClick={()=>{
                      this.setState({
                        visible:true,
                        currentId:row
                      },()=>{
                        this.formRef.current.setFieldsValue(row)
                      })
                      
                    }}
                    >编辑</Button>
                    <Button 
                      size="small"
                      danger
                      onClick={()=>{this.delArt(row.id,1)}}
                      >删除</Button>
                  </div>
                    
                }
              </div>
            )
          }
        }
      ],
      visible:false,
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
            util.getBase64(info.file.originFileObj, imageUrl =>
              _this.setState({
                imageUrl,
                loading: false,
              }),
            );
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
  
  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <Card title={
          <div>
             <Breadcrumb>
              <Breadcrumb.Item>权益配置</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              // this.setState({visible:true})
            }}
            >新增</Button>
          </div> 
        }
        >
          <Table 
              dataSource={this.state.lists}
              loading={this.state.loading}
              rowKey={record => record.indexId}
              pagination={{
                // pageSize: this.state.pageSize,
                // total: this.state.total,
                // onChange: this.changeSize
              }}
              columns={this.state.columns} />
         
        </Card>
        <Modal
            title="编辑商品"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel(1)}}
            footer={null}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                ref = {this.formRef}
                onFinish={this.submitForm.bind(this)}
              >
                <Form.Item
                  label="权益名称"
                  name="name"
                  rules={[{ required: true, message: '请填写权益名称' }]}
                >
                 <Input placeholder="请填写权益名称" />
                </Form.Item>
                <Form.Item
                  label="权益类型"
                  name="type"
                  rules={[{ required: true, message: '请选择权益类型' }]}
                >
                 <Select
                      placeholder="请选择权益类型"
                      onChange={()=>{}}
                      {...this.state.selectProps}
                      // allowClear
                    >
                      <Option value={1} key={1}>普通权益</Option>
                      <Option value={2} key={2}>秒杀权益</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                  label="跳转类型"
                  // rules={[{ required: true, message: '请选择跳转类型' }]}
                >
                  <Form.Item
                    name="skipType"
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    // rules={[{ required: true, message: '请选择跳转类型' }]}
                  >
                    <Select
                      placeholder="请选择权益类型"
                      onChange={()=>{}}
                      {...this.state.selectProps}
                      // allowClear
                    >
                      <Option value={1} key={1}>h5</Option>
                      <Option value={2} key={2}>小程序</Option>
                      <Option value={3} key={3}>赚赚页</Option>
                      <Option value={4} key={4}>套餐页</Option>
                    </Select>
                    </Form.Item>
                    <Form.Item name="skipUrl"  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
                      <Input />
                    </Form.Item>
                </Form.Item>
                 <Form.Item
                  label="排序"
                  name="sort"
                >
                  <InputNumber onChange={(val)=>{
                    console.log(val)
                    // this.state.newData.sort = val
                    // this.setState({
                    //   newData:this.state.newData
                    // })
                  }} />
                 </Form.Item>
                
                 <Form.Item
                  label="权益图标"
                  name="iconUrl"
                  valuePropName="fileList" 
                    // 如果没有下面这一句会报错
                    getValueFromEvent={normFile} 
                >
                  {/* 上传文件的控件 */}
                  <Upload {...this.state.updateProps}>
                    {/* <Image /> */}
                    {this.state.currentId ? <img src={this.state.currentId.iconUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                  <Image />
                </Form.Item>
                <Form.Item
                  label="等级"
                  name="level"
                  rules={[{ required: true, message: '请选择等级' }]}
                >
                 <Select
                      placeholder="请选择用户等级"
                      onChange={()=>{}}
                      {...this.state.selectProps}
                      // allowClear
                    >
                      <Option value={1} key={1}>Lv1</Option>
                      <Option value={2} key={2}>Lv2</Option>
                      <Option value={3} key={3}>Lv3</Option>
                      <Option value={4} key={4}>Lv4</Option>
                    </Select>
                 </Form.Item>
                 <Form.Item
                  label="活动规则"
                  name="rule"
                  rules={[{ required: true, message: '请输入活动规则' }]}
                >
                 <TextArea showCount maxLength={500} onChange={()=>{}} />
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
    this.getList()
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(type){
    this.setState({
      visible:false
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.closeModel(1)
  }
  // 删除文章
  delArt(val,type) {
    Modal.confirm({
      title: `${type === 2?"删除此关联视频":"删除此专题"}`,
      content: '确认删除？',
      onOk: ()=>{
        if(type === 2){
          this.update_column(val)
        }
        
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
    getList({key:"USER.EQUITY"}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          lists:res.data.data
        })
      }
    })
  }
}
