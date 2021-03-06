import React, { Component } from 'react'
// import request from 'utils/request'
import {baseUrl, miniList,getMiniInfo,getSelector,addMini,deleteItem,editMini,changeState,dataSyncCache } from 'api'
import {Breadcrumb, Card, Image, Button, Table, Modal, message,Input, Form,Select,Switch,Upload} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import {  } from 'react-router-dom'
import { MenuOutlined,LoadingOutlined,PlusOutlined  } from "@ant-design/icons"
import arrayMove from 'array-move';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { Option } = Select;

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />)
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
    this.state = {
      page: 1,
      pageSize: 50,
      total: 0,
      data: [],
      loading:false,
      searchWords:"",
      categoriesList:[],
      tagsList:[],
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      tailLayout: {
        wrapperCol: { offset: 8, span: 16 },
      },
      dataSource:[],
      source:null,
      currentItem:{},
      columns: [
        {
          title: 'Sort',
          dataIndex: 'sort',
          width: 30,
          className: 'drag-visible',
          render: () => <DragHandle />,
        },
        {
          title: "序号",
          dataIndex: "id",
          className: 'drag-visible',
          key: "id",
        },
        {
          title: "小程序名称",
          dataIndex: "name",
          key: "name",
          width:"20%",
        },
        {
          title: "所属分类",
          dataIndex: "categories",
          key: "categories",
        },
        {
          title: "所属类别",
          dataIndex: "tags",
          key: "tags",
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          render: (rowValue, row, index)=>{
            return (
              <div>
                {/* {rowValue === 1?"有效":"无效"} */}
                <Switch disabled={row.categories?false:true} checkedChildren="有效" unCheckedChildren="无效" defaultChecked={rowValue === 1?true:false}
                onChange={(val)=>{
                  if(!row.categories)return
                  this.changeState(row)
                }}
                 />
              </div>
            )
          }
        },
        {
          title: "操作",
          key: "action",
          width:"20%",
          render: (rowValue, row, index)=>{
            return (
              <div>
                <Button 
                  style={{margin:"0 10px"}}
                  size="small"
                  type="primary"
                  onClick={()=>{
                    console.log(row,"row")
                    this.getMiniInfo(row)
                    this.setState({visible:true,currentItem:row,source:2},()=>{
                      this.state.currentItem.categories = Array.isArray(this.state.currentItem.categories)?this.state.currentItem.categories:this.state.currentItem.categories.split(",")
                      this.state.currentItem.tags = Array.isArray(this.state.currentItem.tags)?this.state.currentItem.tags:this.state.currentItem.tags.split(",")
                      this.formRef.current.setFieldsValue(row)
                      this.forceUpdate()
                    })
                  }}
                  >编辑</Button>
                <Button 
                  size="small"
                  danger
                  onClick={()=>{
                    this.delArt(row,1)
                  }}
                  >删除</Button>
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
    this.onSortEnd = ({ oldIndex, newIndex }) => {
      const { dataSource } = this.state;
      if (oldIndex !== newIndex) {
        const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
        console.log('Sorted items: ', newData);
        this.setState({ dataSource: newData });
      }
    };
  
    this.DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
  
    this.DraggableBodyRow = ({ className, style, ...restProps }) => {
      const { dataSource } = this.state;
      // function findIndex base on Table rowKey props and should always be a right array index
      const id = dataSource.findIndex(x => x.id === restProps['data-row-key']);
      return <SortableItem index={id} {...restProps} />;
    };
  }
  
  render() {
    const { dataSource,loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    // const checkIcon = (rule,value) => {
    //   console.log(rule,value,"自定义校验")
    //   if (this.state.newData.icon) {
    //     return Promise.resolve();
    //   }
  
    //   return Promise.reject('请上传小程序图标');
    // }
    // const checkQrCode = (rule,value) => {
    //   console.log(rule,value,"自定义校验")
    //   if (this.state.newData.qrcode) {
    //     return Promise.resolve();
    //   }
  
    //   return Promise.reject('请上传小程序码截图');
    // }
    return (
      <div>
        <Card title={
          <div>
             <Breadcrumb>
              <Breadcrumb.Item>小程序信息录入</Breadcrumb.Item>
            </Breadcrumb>
             <Input.Search allowClear style={{ width: '20%',marginTop:"10px" }} 
              placeholder="请输入小程序名称"
              onSearch={(val)=>{
                this.setState({
                  searchWords:val,
                  page: 1,
                },()=>{
                  this.miniList(val)
                })
              }} />
          </div>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true,source:1,currentItem:{}},()=>{
                this.formRef.current.resetFields()
                this.forceUpdate()
              })
            }}
            >新增小程序</Button>
           <Button type="primary"
           style={{margin:"0 10px"}}
            onClick={()=>{
              this.dataSyncCache()
            }}
            >数据同步</Button>
          </div> 
        }
        >
          <Table
            pagination={{
              current:this.state.page,
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: this.changeSize
            }}
            dataSource={dataSource}
            columns={this.state.columns}
            rowKey={record => record.id}
            components={{
              body: {
                wrapper: this.DraggableContainer,
                row: this.DraggableBodyRow,
              },
            }}
          />
         
        </Card>
        <Modal
            title="小程序"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel()}}
            footer={null}
            // key={this.state.currentItem.id}
            width={700}
          >
            {
              <Form
                {...this.state.layout}
                name="basic"
                ref = {this.formRef}
                onFinish={this.submitForm.bind(this)}
              >
                <Form.Item
                  label="分类名称"
                  name="name"
                  rules={[{ required: true, message: '请填写分类名称' }]}
                >
                 <Input placeholder="请填写分类名称" />
                </Form.Item>
                <Form.Item
                    label="小程序图标"
                    name="icon"
                    rules={[{ required: true, message: '请上传小程序图标' }]}
                    // rules={[{ validator: checkIcon, }]}
                  >
                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this,"icon")}
                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("icon")}
                            />
                  </Form.Item>
                <Form.Item
                    label="小程序码截图"
                    name="qrcode"
                    rules={[{ required: true, message: '请上传小程序码截图' }]}
                    // rules={[{ validator: checkQrCode, }]}
                  >
                      <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this,"qrcode")}
                                imageUrl={this.formRef.current && this.formRef.current.getFieldValue("qrcode")}
                            />
                  </Form.Item>
                  <Form.Item
                    label="所属分类"
                    name="categories"
                    rules={[{ required: true, message: '请选择所属分类' }]}
                  >
                  <Select
                        placeholder="请选择所属分类"
                        mode="multiple"
                        onDropdownVisibleChange={()=>{
                          this.getSelector("category")
                        }}
                        {...this.state.selectProps}
                        allowClear
                      >
                        {
                          this.state.categoriesList.map(r=>{
                            return(
                              <Option value={r.rowKey} key={r.rowKey}>{r.name}</Option>
                            )
                          })
                        }
                      </Select>
                  </Form.Item>
                  <Form.Item
                    label="所属类别"
                    name="tags"
                    // rules={[{ required: true, message: '请选择所属类别' }]}
                  >
                  <Select
                        placeholder="请选择所属类别"
                        mode="multiple"
                        onDropdownVisibleChange={()=>{
                          this.getSelector("tag")
                        }}
                        {...this.state.selectProps}
                        allowClear
                      >
                        {
                          this.state.tagsList.map(r=>{
                            return(
                              <Option value={r.rowKey} key={r.rowKey}>{r.name}</Option>
                            )
                          })
                        }
                      </Select>
                  </Form.Item>
                  <Form.Item
                    label="推荐理由"
                    name="reason"
                    rules={[{ required: true, message: '请输入推荐理由' }]}
                  >
                    <Input.TextArea  placeholder={"推荐理由"} />
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
   this.miniList()
  //  this.getServiceList()
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(){
    this.setState({
      visible:false,
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.closeModel()
    if(this.state.source === 2){
      this.editMini(params)
    }else{
      this.addMini(params)
    }
    
  }
  // 删除文章
  delArt(val,type) {
    Modal.confirm({
      title: `删除该小程序后，该小程序不会在前端展示。是否确认删除？`,
      content: '确认删除？',
      onOk: ()=>{
        this.deleteItem(val)
      },
      onCancel: ()=>{

      }
    })
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    console.log(page,pageSize)
    this.setState({
      page,
      pageSize
    },()=>{
      this.miniList(this.state.searchWords)
    })
   
  }
  miniList(keyWord){
    let params={
      name:keyWord || "",
      page:{
        currentPage:this.state.page,
        pageSize:this.state.pageSize
      }
    }
    miniList(params).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          dataSource:res.data.data.data,
          total:res.data.data.page.totalCount
        })
      }
    })
  }
  getSelector(type){
    let ids={}
    if(type==="tag" && this.formRef.current.getFieldValue("categories")){
      let b = Array.isArray(this.formRef.current.getFieldValue("categories"))?this.formRef.current.getFieldValue("categories"):[this.formRef.current.getFieldValue("categories")]
      console.log(b,"b")
      ids=b?b.includes(",")?b:b.join(","):""
    }
    let params={
      type:type,
      ids:type==="category"?"":ids
    }
    getSelector(params).then(res=>{
      if(res.data.errCode === 0){
        if(type === "category"){
          this.setState({
            categoriesList:res.data.data
          })
        }else{
          this.setState({
            tagsList:res.data.data
          })
        }
      }else{
        if(type === "category"){
          this.setState({
            categoriesList:[]
          })
        }else{
          this.setState({
            tagsList:[]
          })
        }
      }
    })
  }
  addMini(item){
    let params={
      ...item,
      categories:item.categories.join(","),
      tags:item.tags?item.tags.join(","):""
    }
    // return console.log(params,"params")
    addMini(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("新增成功")
        this.miniList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  getMiniInfo(item){
    let params={
      id:item.id
    }
    getMiniInfo(params).then(res=>{
      if(res.data.errCode === 0){
        if(!res.data.data.categories){
          res.data.data.categories =[]
        }
        if(!res.data.data.tags){
          res.data.data.tags =[]
        }
       this.formRef.current.setFieldsValue(res.data.data)
       this.getSelector("category")
       this.getSelector("tag")
       this.forceUpdate()
      }
    })
  }
  deleteItem(val){
    console.log(val)
    let params={
      type:"miniProgram",
      ids:val.id
    }
    deleteItem(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("删除成功")
        this.miniList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  editMini(item){
    let params={
      ...this.state.currentItem,
      ...item,
      categories:item.categories.join(","),
      tags:item.tags.join(",")
    }
    console.log(params,"params")
    editMini(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("更新成功")
        this.miniList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  changeState(item){
    let params={
      type:"miniProgram",
      ids:item.id
    }
    changeState(params).then(res=>{
      if(res.data.errCode === 0){
        // message.success("成功")
        // this.miniList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  dataSyncCache(){
    dataSyncCache({}).then(res=>{
      if(res.data.errCode === 0){
        message.success("数据同步成功")
      }else{
        message.error(res.data.msg)
      }
    })
  }
  getUploadFileUrl(name, file) {   // 图片上传的方法
    console.log(name,file, "获取上传的图片路径")
    this.formRef.current.setFieldsValue({ [name]: file })
    this.forceUpdate()
}
}
