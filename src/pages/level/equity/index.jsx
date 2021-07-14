import React, { Component } from 'react'
// import request from 'utils/request'
import { baseUrl, getList,addList,updateList } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message,Input, Form,Select,Image,InputNumber,Upload,DatePicker} from 'antd'
import {  } from 'react-router-dom'
import { LoadingOutlined,PlusOutlined } from "@ant-design/icons"
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { RangePicker } = DatePicker;
const { confirm } = Modal
const { TextArea } = Input;
const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
// @Form.create()
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
      currentItem:"",//编辑行的id
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
      levelList:[],
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
              height={100}
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
                        currentItem:row,
                        newData:{}
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
        // onChange(info) {  // 监控上传状态的回调
        //   if (info.file.status !== 'uploading') {
        //     _this.setState({ loading: true });
        //   }
        //   if (info.file.status === 'done') {
        //     util.getBase64(info.file.originFileObj, imageUrl =>
        //       _this.setState({
        //         imageUrl,
        //         loading: false,
        //       }),
        //     );
        //     console.log(info.file)
        //     // let a = _this.state.formData
        //     //  a.image= info.file.response.data.fileUrl
        //     //  _this.formRef.current.setFieldsValue(_this.state.formData)
        //     message.success(`上传成功`);
        //   } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} 上传失败.`);
        //   }
        // },
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
    // const { getFieldDecorator } = this.props.form
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
            width={800}
          >
            {
              // this.state.currentItem.
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
                {
                  this.state.newData.type ===2 &&
                  <Form.Item
                    label="商品备注"
                    name="memo"
                    rules={[{ required: true, message: '请填写商品备注' }]}
                  >
                  <Input placeholder="请填写权益名称" />
                  </Form.Item>
                }
                <Form.Item
                  label="权益类型"
                  name="type"
                  // rules={[{ required: true, message: '请选择权益类型' }]}
                >
                 <Select
                      placeholder="请选择权益类型"
                      onChange={(val)=>{
                        console.log(val)
                        this.state.newData.type = val
                        this.setState({
                          newData:this.state.newData
                        })
                      }}
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
                    <Upload {...this.state.updateProps}
                     onChange = {(info)=>{
                       // 监控上传状态的回调
                          if (info.file.status !== 'uploading') {
                            this.setState({ loading: true });
                          }
                          if (info.file.status === 'done') {
                            this.state.newData.iconUrl = info.file.response.data.fileUrl
                            this.setState({
                              newData:this.state.newData,
                              loading: false
                            })
                            message.success(`上传成功`);
                          } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} 上传失败.`);
                          }
                        }
                     } 
                    >
                      {this.state.newData.iconUrl?<img src={this.state.newData.iconUrl} alt="avatar" style={{ width: '100%',height:"100%" }} />:this.state.currentItem ? <img src={this.state.currentItem.iconUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                    <Image />
                  </Form.Item>
                 {
                  this.state.newData.type ===2 &&
                  <div>
                    <Form.Item
                      label="秒杀商品名称"
                      name="goodName"
                      rules={[{ required: true, message: '请填写秒杀商品名称' }]}
                    >
                      <Input placeholder="请填写权益名称" />
                    </Form.Item>
                    <Form.Item
                      label="秒杀时间"
                      // name="startTime"
                      rules={[{ required: true, message: '请选择秒杀时间' }]}
                    >
                      <RangePicker
                        defaultValue={[moment(util.formatTime(this.state.currentItem.startTime,"/",3), 'YYYY/MM/DD'), moment(util.formatTime(this.state.currentItem.endTime,"/",3), 'YYYY/MM/DD')]}
                        onChange={(val)=>{
                          console.log(val)
                          this.state.newData.startTime = new Date(val[0].toDate()).getTime()
                          this.state.newData.endTime = new Date(val[1].toDate()).getTime()
                          this.setState({
                            newData:this.state.newData
                          })
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="库存"
                      name="storeNum"
                      rules={[{ required: true, message: '请填写库存' }]}
                    >
                      <Input placeholder="请填写库存" />
                    </Form.Item>
                    <Form.Item
                      label="秒杀商品图片"
                      name="secKillUrl"
                      valuePropName="fileList" 
                        // 如果没有下面这一句会报错
                        getValueFromEvent={normFile} 
                    >
                      {/* 上传文件的控件 */}
                      <Upload {...this.state.updateProps}
                      onChange = {(info)=>{
                        // 监控上传状态的回调
                           if (info.file.status !== 'uploading') {
                             this.setState({ loading: true });
                           }
                           if (info.file.status === 'done') {
                             this.state.newData.secKillUrl = info.file.response.data.fileUrl
                             this.setState({
                               newData:this.state.newData,
                               loading: false
                             })
                             message.success(`上传成功`);
                           } else if (info.file.status === 'error') {
                             message.error(`${info.file.name} 上传失败.`);
                           }
                         }
                      } 
                      >
                        {this.state.newData.secKillUrl?<img src={this.state.newData.secKillUrl} alt="avatar" style={{ width: '100%',height:"100%" }} />:this.state.currentItem ? <img src={this.state.currentItem.secKillUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                      </Upload>
                      <Image />
                    </Form.Item>
                  </div>
                }
                 
                <Form.Item
                  label="等级"
                  name="userLevelId"
                  rules={[{ required: true, message: '请选择等级' }]}
                >
                 <Select
                      placeholder="请选择用户等级"
                      onChange={()=>{}}
                      {...this.state.selectProps}
                      // allowClear
                    >
                      {
                        this.state.levelList.map(r=>{
                          return(
                            <Option value={r.indexId} key={r.indexId}>{r.name}</Option>
                          )
                        })
                      }
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
    this.getLevel()
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
    let allParams = {
      ...this.state.currentItem,
      ...params,
      ...this.state.newData
    }
    if(this.state.currentItem){
      this.updateList(allParams) // 更新
    }else{
      this.addList(allParams) // 新增
    }
    // console.log(allParams,"allParams")
   
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
  getLevel(){
    getList({key:"USER.LEVEL"}).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          levelList:res.data.data
        })
      }
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
  addList(params){
    addList({key:"USER.EQUITY"},params).then(res=>{
      if(res.data.errCode == 0){
        message.success("新增成功")
        this.getList()
      }else{
        message.error("新增失败")
      }
    })
  }
  updateList(params){
    updateList({key:"USER.EQUITY",id:params.indexId},params).then(res=>{
      if(res.data.errCode == 0){
        message.success("更新成功")
        this.getList()
      }else{
        message.error("更新失败")
      }
    })
  }
}
