import React, { Component } from 'react'
// import request from 'utils/request'
import { getGameSchedule, updateGameSchedule, getConfig, setConfig, deleteGameSchedule, refreshSpider, getChannel, getProgramsList } from 'api'
import { Card, Breadcrumb, Button, Table, Modal, message, Input, Form, Select, DatePicker, TimePicker, Tree } from 'antd'
import { } from 'react-router-dom'
import { LeftOutlined } from "@ant-design/icons"
import { MyAddress,MySyncBtn } from '@/components/views.js';
import util from 'utils'
import "./style.css"
import moment from 'moment';
const { confirm } = Modal
const { Option } = Select;
let privateData = {
  inputTimeOutVal: null
};

export default class SportsProgram extends Component {
  formRefAdd = React.createRef();
  formRef = React.createRef();
  constructor() {
    super();
    this.state = {
      page: 1,
      pageSize: 1000,
      total: 0,
      data: [],
      loading: false,
      newData: {},
      lists: [],
      currentItem: { id: null },//编辑行的id
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      tailLayout: {
        wrapperCol: { offset: 4, span: 20 },
      },
      channelList: [],
      columns: [
        {
          title: "开赛日期（北京时间）",
          dataIndex: "startTime",
          key: "startTime",
          sorter: {
            compare: (a, b) => a.startTime - b.startTime,
            multiple: 1,
          },
          render: (rowValue, row, index) => {
            return (
              <div>
                {
                  this.state.currentItem.id == row.id ?
                    <DatePicker onChange={this.timeChange.bind(this, row, 1)} defaultValue={moment(row.startTime * 1000)}></DatePicker>
                    : util.formatTime(String(row.startTime).length == 10 ? row.startTime * 1000 : row.startTime, "-", 3)
                }
              </div>
            )
          }
        },
        {
          title: "开赛时间（北京时间）",
          dataIndex: "startTime",
          key: "startTime",
          sorter: {
            compare: (a, b) => a.startTime - b.startTime,
            multiple: 1,
          },
          render: (rowValue, row, index) => {
            return (
              <div>
                {
                  this.state.currentItem.id == row.id ?
                    <TimePicker onChange={this.timeChange.bind(this, row, 2)} defaultValue={moment(row.startTime * 1000)}></TimePicker>
                    : util.formatTime(String(row.startTime).length == 10 ? row.startTime * 1000 : row.startTime, "-", 7)
                }
              </div>
            )
          }
        },
        {
          title: "项目大项",
          dataIndex: "category1",
          key: "category1",
          render: (rowValue, row, index) => {
            return (
              <div>
                {
                  this.state.currentItem.id == row.id ?
                    <Input placeholder={row.category1} defaultValue={row.category1} onChange={(val) => {
                      this.state.newData.category1 = val.target.value
                      // this.setState({
                      //   currentItem:this.state.currentItem
                      // })
                    }} />
                    : row.category1
                }
              </div>
            )
          }
        },
        {
          title: "项目小项",
          dataIndex: "category2",
          key: "category2",
          render: (rowValue, row, index) => {
            return (
              <div>
                {
                  this.state.currentItem.id == row.id ?
                    <Input placeholder={row.category2} defaultValue={row.category2} onChange={(val) => {
                      this.state.newData.category2 = val.target.value
                      // this.setState({
                      //   currentItem:this.state.currentItem
                      // })
                    }} />
                    : row.category2
                }
              </div>
            )
          }
        },
        {
          title: "项目名",
          dataIndex: "gameName",
          key: "gameName",
          render: (rowValue, row, index) => {
            return (
              <div>
                {
                  this.state.currentItem.id == row.id ?
                    <Input placeholder={row.gameName} defaultValue={row.gameName} onChange={(val) => {
                      this.state.newData.gameName = val.target.value
                      // this.setState({
                      //   currentItem:this.state.currentItem
                      // })
                    }} />
                    : row.gameName
                }
              </div>
            )
          }
        },
        {
          title: "关联节目",
          dataIndex: "channelData",
          key: "channelData",
          render: (rowValue, row, index) => {
            return (
              <div>
                {row.channelData.channelId ? "已关联" : "未关联"}
              </div>
            )
          }
        },
        {
          title: "是否有中国队",
          dataIndex: "isChinaEvent",
          key: "isChinaEvent",
        },
        {
          title: "是否决赛",
          dataIndex: "isGoldEvent",
          key: "isGoldEvent",
        },
        {
          title: "操作",
          key: "action",
          fixed: 'right', width: 250,
          render: (rowValue, row, index) => {
            return (
              <div>
                {
                  this.state.currentItem.id === row.id ?
                    <div>
                      <Button
                        style={{ margin: "0 10px" }}
                        size="small"
                        type="primary"
                        onClick={() => {
                          this.updateGameSchedule(row)
                        }}
                      >确认</Button>
                      <Button
                        size="small"
                        danger
                        onClick={() => {
                          // let arr = this.state.lists.filter(item=>item.id === row.id)
                          this.setState({
                            currentItem: { id: null }
                          })
                          this.getGameSchedule()
                        }}
                      >取消</Button>
                    </div> :
                    <div>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          this.setState({
                            currentItem: row,
                            newData: {}
                          })
                        }}
                      >编辑</Button>
                      <Button
                        size="small"
                        style={{ margin: "0 10px" }}
                        danger
                        onClick={() => { this.delArt(row.id) }}
                      >删除</Button>
                      <Button
                        size="small"
                        onClick={() =>
                          this.setState({
                            visible: true,
                            currentItem: row
                          }, () => {
                            let info = JSON.parse(JSON.stringify(row))
                            // info.time = [info.indexStartTime ? moment(info.indexStartTime * 1000) : "", info.indexEndTime ? moment(info.indexEndTime * 1000) : ""]
                            info.channelId = info.channelData.channelId
                            info.name = info.channelData.name
                            this.getChannel(info.channelData.channelName)
                            this.formRef.current.resetFields()
                            this.formRef.current.setFieldsValue(info)
                          })
                        }
                      >关联节目</Button>
                    </div>
                }
              </div>
            )
          }
        }
      ],
      visible: false,
      addressVisible: false,
      treeData: [],
      defaultProgram: [],
      programGrounp: [],
      configInfo: {},
      allAddress: "",
      selectProps: {
        optionFilterProp: "children",
        filterOption(input, option) {
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        showSearch() {
          console.log('onSearch')
        }
      }
    }
  }

  render() {
    let { channelList, programGrounp } = this.state
    return (
      <div>
        <Card title={
          <Breadcrumb>
            <Breadcrumb.Item>奥运赛事列表</Breadcrumb.Item>
          </Breadcrumb>
        }
          extra={
            <div>
              <Button type="primary"
                style={{ margin: "0 20px" }}
                onClick={() => {
                  this.setState({ addressVisible: true }, () => {
                    let arr = this.state.configInfo
                    arr.area = Array.isArray(arr.area)?arr.area:arr.area.split(",")
                    console.log(arr)
                    this.formRefAdd.current.setFieldsValue(arr)
                    this.forceUpdate()
                  })
                }}
              >地域配置</Button>
              <Button type="primary"
                onClick={() => {
                  this.setState({
                    loading: true
                  })
                  this.refreshSpider()
                }}
              >更新</Button>
               <MySyncBtn type={3} name='同步地域缓存' params={{key:"olympic.game.config"}} />
            </div>
          }
        >
          <Table
            dataSource={this.state.lists}
            scroll={{ x: 1500, y: '75vh' }}
            loading={this.state.loading}
            rowKey={record => record.id}
            pagination={{
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: this.changeSize
            }}
            columns={this.state.columns} />

        </Card>
        <Modal
          title="关联节目"
          centered

          visible={this.state.visible}
          onCancel={() => { this.closeModel() }}
          footer={null}
        >
          {
            <Form
              {...this.state.layout}
              name="basic"
              ref={this.formRef}
              onFinish={this.submitForm.bind(this)}
            >
              <Form.Item label="频道信息" name="channelId" rules={[{ required: true, message: '请选择频道信息' }]}>
                <Select
                  style={{ width: "300px" }}
                  placeholder="请选择频道配置"
                  allowClear
                  {...this.state.selectProps}
                  onSearch={(val) => {
                    console.log(val)
                    if (privateData.inputTimeOutVal) {
                      clearTimeout(privateData.inputTimeOutVal);
                      privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                      if (!privateData.inputTimeOutVal) return;
                      this.getChannel(val)
                    }, 800)
                  }}>
                  {
                    channelList.map((r, i) => {
                      return <Option value={r.code} key={r.id}>{r.name + "----" + r.code}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="节目信息" name="name" rules={[{ required: true, message: '请选择节目信息' }]}>
                <Select
                  style={{ width: "300px" }}
                  placeholder="请选择节目信息"
                  allowClear
                  {...this.state.selectProps}
                  onSearch={(val) => {
                    console.log(val)
                    if (privateData.inputTimeOutVal) {
                      clearTimeout(privateData.inputTimeOutVal);
                      privateData.inputTimeOutVal = null;
                    }
                    privateData.inputTimeOutVal = setTimeout(() => {
                      if (!privateData.inputTimeOutVal) return;
                      this.getProgramsList(val)
                    }, 800)
                  }}>
                  {
                    programGrounp.map((r, i) => {
                      return (
                        <Option value={r.value} key={r.value}>{r.label}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item {...this.state.tailLayout}>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
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
          onCancel={() => { this.closeModel(2) }}
          footer={null}

        >
          {
            <Form
              {...this.state.layout}
              name="basic"
              ref={this.formRefAdd}
              onFinish={this.submitFormAdd.bind(this)}
            >
              <Form.Item
                label="支持地域"
                name="area"
              >
                <MyAddress onCheckAddress={(e) => this.onCheckAddress(e,'area')}
                  defaultAddress={this.formRefAdd.current && this.formRefAdd.current.getFieldValue("area")} />
              </Form.Item>
              <Form.Item
                label="预约H5"
                name="thirdJumpUrl"
                rules={[{ required: true, message: '请输入预约H5地址' }]}
              >
                <Input placeholder="请输入预约H5地址" />
              </Form.Item>
              <Form.Item
                label="白名单"
                name="ip"
              >
                <Input placeholder="请输入白名单" />
              </Form.Item>
              <Form.Item {...this.state.tailLayout}>
                <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          }
        </Modal>
      </div>
    )
  }
  componentDidMount() {
    this.setState({
      loading: true
    })
    this.getGameSchedule()
    this.getConfig()

  }
  onSearch(e) {
    console.log(e, "e")
  }
  closeModel(val) {
    this.setState({
      visible: false,
      addressVisible: false,
      currentItem: { id: null }
    })
  }
  // 新增
  submitForm(val) {
    console.log(val)
    let arr = this.state.defaultProgram[val.name]
    let channelArr = this.state.channelList.filter(item => item.code == val.channelId)
    val.channelData = {
      channelId: val.channelId,
      // channelName:"" ,
      name: arr.name,
      startTime: arr.start_time,
    }
    if (channelArr.length > 0) {
      // val.channelData.channelName = channelArr[0].name
      val.channelData = {
        ...val.channelData,
        channelName: channelArr[0].name
      }
    }
    val.id = this.state.currentItem.id
    // return console.log(val)
    this.updateGameSchedule(val, 1)
    this.closeModel()
  }
  // 删除文章
  delArt(id) {
    Modal.confirm({
      title: '删除此时间的赛事',
      content: '确认删除？',
      onOk: () => {
        this.deleteGameSchedule(id)
      },
      onCancel: () => {

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
  //获取赛事列表
  getGameSchedule() {
    getGameSchedule({}).then(res => {
      if (res.data.errCode === 0) {
        this.setState({
          lists: res.data.data,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    })
  }
  timeChange(val, type, time) {
    console.log(val, time)
    let c = new Date(time.toDate())
    if (type === 1) { //日期
      let d = new Date(String(this.state.currentItem.startTime).length === 10 ? this.state.currentItem.startTime * 1000 : this.state.currentItem.startTime)
      this.state.newData.startTime = c.setHours(d.getHours(), d.getMinutes()) / 1000
    } else { //时分秒
      let d = new Date(String(this.state.currentItem.startTime).length === 10 ? this.state.currentItem.startTime * 1000 : this.state.currentItem.startTime)
      this.state.newData.startTime = c.setFullYear(d.getFullYear(), d.getMonth(), d.getDate()) / 1000
    }
    // this.setState({
    //   currentItem:this.state.currentItem
    // })
  }
  //编辑赛事列表
  updateGameSchedule(item, type) {
    let params = { id: item.id }
    let body
    if (type == 1) {
      body = {
        ...this.state.currentItem,
        ...item,
      }
    } else {
      body = {
        ...this.state.currentItem,
        ...this.state.newData
      }
    }
    updateGameSchedule(params, body).then(res => {
      if (res.data.errCode === 0) {
        this.getGameSchedule()
        this.setState({
          currentItem: { id: null },
          newData: {}
        })
        message.success("更新成功")
      } else {
        message.error("更新失败")
      }
    })
  }
  deleteGameSchedule(id) {
    let params = { id: id }
    let body = {}
    deleteGameSchedule(params, body).then(res => {
      if (res.data.errCode === 0) {
        this.getGameSchedule()
        message.success("删除成功")
      } else {
        message.error("删除失败")
      }
    })
  }
  refreshSpider() {
    refreshSpider().then(res => {
      if (res.data.errCode === 0) {

      } else {
        message.success("更新失败")
      }
      this.setState({
        loading: false
      })
    })
  }
  getChannel(val) {
    let params = {
      keywords: val
    }
    getChannel(params).then(res => {
      this.setState({
        channelList: res.data.data || []
      })
    })
  }
  getProgramsList(val) {
    if (!val) return
    let param = {
      keyword: val,
      channelId: this.formRef.current.getFieldValue("channelId")
    }
    getProgramsList(param).then(res => {
      if (res.data.errCode === 0) {
        let a = Object.entries(res.data.data)
        console.log(a, "a")
        let b = []
        for (const [key, value] of a) {
          b.push({ label: util.formatTime(value.start_time, "", 2) + " " + value.name + " " + value.channel_id, value: key })
        }
        this.setState({
          programGrounp: b,
          defaultProgram: res.data.data
        })
      }
    })
  }
  getConfig() {
    getConfig({ key: "olympic.game.config" }).then(res => {
      if (res.data.errCode === 0) {
        let info = JSON.parse(JSON.stringify(res.data.data))
        info.area = info.area.includes(",") ? info.area.split(",") : info.area
        this.setState({
          configInfo: res.data.data
        })
      }
    })
  }
  submitFormAdd(val) {
    console.log(val, "val")
    this.setConfig(val)
  }
  setConfig(val) {
    let area = this.formRefAdd.current.getFieldValue("area")
    area = Array.isArray(area) ? area.join(",") : area
    let params = {
      ...val,
      area: area
    }
    setConfig({ key: "olympic.game.config" }, params).then(res => {
      if (res.data.errCode === 0) {
        this.closeModel()
        this.getConfig()
      }
    })
  }
  onCheckAddress(e,val){
    console.log(e,val,"e,val")
    this.formRefAdd.current.setFieldsValue({[val]:e})
    this.forceUpdate()
  }
}
