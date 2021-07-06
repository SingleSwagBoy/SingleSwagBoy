import React, { Component } from 'react'
// import request from 'utils/request'
import { fetchArtLists, delArtById } from 'api'
import { Card, Breadcrumb, Button, Table, Tooltip, Image, Tag, Modal, message } from 'antd'
import { Link } from 'react-router-dom'
import { DownloadOutlined } from "@ant-design/icons"
import  util from 'utils'
import dayjs from 'dayjs'
import XLSX from 'xlsx'


export default class ArtLists extends Component {
  constructor(){
    super();
    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
      lists: [],
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "作者",
          dataIndex: "author",
          key: "author"
        },
        {
          title: "描述",
          dataIndex: "desc",
          key: "desc",
          render: (rowValue, row, index) => {
            return ( 
              <Tooltip title={rowValue}>
              <span>
                { util.splitStr(rowValue, 20) }
              </span>
              </Tooltip>
            )
          },
        },
        {
          title: "封面图片",
          dataIndex: "thumb",
          key: "thumb",
          render: (rowValue) => {
            return (
              <Image
                width={100}
                src={rowValue}
              />
            )
          },
        },
        {
          title: "阅读次数",
          dataIndex: "readCount",
          key: "readCount",
          render: (rowValue, row, index) => {
            return <Tag color={ rowValue>500?"red":"green" }>{rowValue}</Tag>
          },
        },
        {
          title: "创建时间",
          dataIndex: "createAt",
          key: "createAt",
          render: (rowValue, row, index) => {
            return (
              <span>
                { dayjs(rowValue).format("YYYY-MM-DD") }
              </span>
            )
          }
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
                  onClick={()=>{this.delArt(row.id)}}
                  >删除</Button>
                <Button 
                  size="small"
                  onClick = { () => {
                    // 点击跳转到编辑页，传ID
                    this.props.history.push(`/mms/artEdit/${row.id}`)
                  } }
                  >编辑</Button>
              </div>
            )
          }
        }
      ]
    }
  }
  
  render() {
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/mms/dashBoard">首页</Link>
            </Breadcrumb.Item>
            
            <Breadcrumb.Item>文章列表</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <Button 
           size="small"
           onClick={this.exportExcel} 
           icon = {<DownloadOutlined/>}
          >导出excel</Button>
        }
        >
          <Button
           type="primary"
           onClick={ ()=>{ this.props.history.push('/mms/artAdd') } }
          >增加文章</Button>
          <Table 
            dataSource={this.state.lists}
            pagination={{
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: this.changeSize
            }}
            columns={this.state.columns} />
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.fetchArtLists()
  }
  // 删除文章
  delArt(id) {
    Modal.confirm({
      title: '删除文章',
      content: '确认删除？',
      onOk: ()=>{
        delArtById(id).then(res=>{
          if(res.data.code === 200) {
            message.success(res.data.msg, 2, ()=> {
              this.props.history.go(0)
            })
          }
        })
      },
      onCancel: ()=>{

      }
    })
  }
  exportExcel = () => {
    // 处理表头
    // console.log(Object.keys(this.state.lists[0]))
    let data = [];
    const keys = ['序号', '标题', '作者', '描述', '封面图片', '阅读次数', '创建时间']
    data.push(keys)
    this.state.lists.forEach(art => {
      data.push(Object.values(art))
    })
    this.setState({
      data
    }, ()=>{
      this.exportFile()
    })
  }
  exportFile = () => {
    // 导出excel
		const ws = XLSX.utils.aoa_to_sheet(this.state.data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		XLSX.writeFile(wb, "文章列表.xlsx")
  }
  changeSize = (page, pageSize) => {
    // 分页获取
    this.setState({
      page,
      pageSize
    })
    this.fetchArtLists()
  }
  fetchArtLists = () => {
    // 请求文章列表接口
    fetchArtLists({page: this.state.page, pageSize: this.state.pageSize}).then(res => {
      if(res.data.code === 200) {
        const { lists, total } = res.data.data
        this.setState({
          lists,
          total
        })
      }
    })
  }
}
