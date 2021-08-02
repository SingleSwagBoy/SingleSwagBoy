import React, { Component } from 'react'
// import request from 'utils/request'
import { getTagList,addTag,deleteItem,editTag } from 'api'
import {Breadcrumb, Card, Image, Button, Table, Modal, message,Input, Form,Select,InputNumber} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { Link } from 'react-router-dom'
import { MenuOutlined } from "@ant-design/icons"
import arrayMove from 'array-move';
import  util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { Option } = Select;

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />)
export default class SportsProgram extends Component {
  formRef = React.createRef();
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
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
      dataSource:[],
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
          title: "分类名称",
          dataIndex: "name",
          key: "name",
          render: (rowValue, row, index)=>{
            return (
              <div>
                 {
                   row.id === this.state.currentItem.id?
                   <Input placeholder={row.name} defaultValue={row.name} onChange={(val)=>{
                    this.state.newData.name = val.target.value
                    }} />:
                    <div>{rowValue}</div>
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
                  row.id === this.state.currentItem.id?
                  <div>
                  <Button 
                    style={{margin:"0 10px"}}
                    size="small"
                    type="primary"
                    onClick={()=>{
                      this.editTag(row)
                    }}
                    >确认</Button>
                    <Button 
                      size="small"
                      danger
                      onClick={()=>{
                        this.setState({
                          currentItem:{id:null}
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
                        currentItem:row,
                        newData:{}
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
                }
                
              </div>
              
            )
          }
        }
      ],
      visible:false,
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
    const { dataSource } = this.state;
    return (
      <div>
        <Card title={
          <div>
             <Breadcrumb>
             <Breadcrumb.Item>
              <Link to="/mms/service/serviceLog">服务分类</Link>
            </Breadcrumb.Item>
              <Breadcrumb.Item>类别管理</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        }
        extra={
          <div>
           <Button type="primary"
            onClick={()=>{
              this.setState({visible:true},()=>{
                this.formRef.current.resetFields()
              })
            }}
            >新增类别</Button>
          </div> 
        }
        >
          <Table
            pagination={false}
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
            title="新建类别"
            centered
            visible={this.state.visible}
            onCancel={() => {this.closeModel()}}
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
                  label="类别名称"
                  name="name"
                  rules={[{ required: true, message: '请填写类别名称' }]}
                >
                 <Input placeholder="请填写类别名称" />
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
   this.getTagList()
  }
  onSearch(e){
    console.log(e,"e")
  }
  closeModel(){
    this.setState({
      visible:false
    })
  }
  // 新增
  submitForm(params){
    console.log(params)
    this.closeModel()
    this.addTag(params)
  }
  // 删除文章
  delArt(val,type) {
    Modal.confirm({
      title: `是否确认删除该类别？`,
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
      
    })
   
  }
  getTagList(){
    let params={
      categoryId:this.props.match.params.categoryId
    }
    getTagList(params).then(res=>{
      if(res.data.errCode === 0){
        this.setState({
          dataSource:res.data.data.data
        })
      }else{
        this.setState({
          dataSource:[]
        })
      }
    })
  }
  addTag(name){
    let params={
      ...name,
      sort:this.state.dataSource.length+1,
      state: 1 //:0=禁用;1=开启
    }
    addTag(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("新增成功")
        this.getTagList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  deleteItem(val){
    console.log(val)
    let params={
      type:"tag",
      ids:val.id
    }
    deleteItem(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("删除成功")
        this.getTagList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
  editTag(item){
    let params={
      ...item,
      name:this.state.newData.name
    }
    editTag(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("更新成功")
        this.setState({
          currentItem:{id:null}
        })
        this.getTagList()
      }else{
        message.error(res.data.msg)
      }
    })
  }
}
