import React, { Component } from 'react'
// import request from 'utils/request'
import { getMsgTemplate, getTemplateImage, getTemplateUser, editMsg, sendMsg, addMsg, getMpList, addMaterial, syncWxMaterial, addText } from 'api'
import { Card, Button, message, Tabs, Radio, Modal, Form, Input, Select, DatePicker, Divider, Alert, InputNumber, Pagination } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import "./style.css"
const { Option } = Select;
const { TabPane } = Tabs;

export default class AddressNews extends Component {
  formRef = React.createRef();
  formMaterial = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      totalCount:0,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      tailLayout: {
        wrapperCol: { offset: 6, span: 18 },
      },
      materialModal: false,
      msgList: ["图文信息", "图片信息", "文字信息", "小程序卡片"],
      templateList: [], //素材列表
      tabIndex: 0,
      activeIndex: 0,
      mpList: [], //小程序列表
      selectContent: "",//素材选中内容
      previewUser: [],//预览用户
      parentsData: "", // 父组件传过来的数据
      openIdList: [],
      sourceType: "",
      addMaterial: false,
      typeText: 0,
      imageInfo: "",//图片信息
    }
  }
  render() {
    const { msgList, templateList, tabIndex, selectContent, activeIndex } = this.state;
    const divStyle = {
      "display": "flex",
      "flexWrap": "wrap",
      "justifyContent": "space-around",
    }
    const cardStyle = {
      width: "32%",
      height: "300px",
      "margin": "0 0 20px 0",
      boxShadow: " 0 2px 12px 0 rgb(0 0 0 / 10%)",
      borderRadius: "10px"
    }
    const cardStyleOut = {
      width: "50%",
      height: "300px",
      "margin": "0 0 20px 0",
      boxShadow: " 0 2px 12px 0 rgb(0 0 0 / 10%)",
      borderRadius: "10px"
    }
    return (
      <div>
        {/* 客服消息框 */}
        <Modal
          title="客服消息"
          centered
          visible={this.props.visible}
          onCancel={() => { this.closeModel() }}
          footer={null}
          // forceRender={true}
          width={800}
        >
          {
            <Form
              {...this.state.layout}
              name="voting"
              ref={this.formRef}
              onFinish={this.submitForm.bind(this)}
            >
              <Form.Item
                label="选择微信公众号"
                name="wxCode"
                rules={[{ required: true, message: '请选择类型' }]}
              // style={{ display: 'inline-flex', width: 'calc(50% - 8px)',}}
              >
                <Select
                  placeholder="请选择类型"
                  allowClear
                  onChange={(val) => {
                    console.log(val)
                    this.getTemplateUser(val)
                  }}
                >
                  {
                    this.props.wxPublic.map(r => {
                      return (
                        <Option value={r.code} key={r.id}>{r.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item {...this.state.tailLayout}>
                <Button type="primary" onClick={() => {
                  if (!this.formRef.current.getFieldValue("wxCode")) return message.error("请先选择微信公众号")
                  this.setState({ materialModal: true, tabIndex: 0 })
                  this.getMsgTemplate("mpnews")
                }}>
                  选择客服消息素材
                </Button>
              </Form.Item>
              <Divider plain orientation="left">定时发送配置</Divider>
              <Form.Item
                label="定时发送方式"
                // name="time"
                rules={[{ required: true, message: '请选择定时发送方式' }]}
              >
                <Form.Item
                  name="sendType"
                  rules={[{ required: true, message: '请选择定时发送方式' }]}
                  style={{ display: 'inline-block', margin: '0 8px 0 0' }}
                >
                  <Select
                    placeholder="请选择定时发送方式"
                    allowClear
                    onChange={(val) => {
                      if (val != 3) {
                        this.formRef.current.setFieldsValue({ "sendTime": "" })
                      }
                      this.setState({
                        test: 1
                      })

                    }}
                  >
                    <Option value={1} key={1}>一次性定时发送</Option>
                    <Option value={2} key={2}>循环定时发送</Option>
                    <Option value={3} key={3}>相对时间定时发送</Option>
                  </Select>
                </Form.Item>
                {
                  this.formRef.current && this.formRef.current.getFieldValue("sendType") === 3 ?
                    <Form.Item
                      name="sendTime"
                      rules={[{ required: true, message: '请输入相对发送时间' }]}
                      style={{ display: 'inline-block', }}
                    >
                      <InputNumber min={0}
                        formatter={value => `小时 ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        placeholder="请输入相对发送时间" style={{ width: "100%" }} />
                    </Form.Item>
                    :
                    <Form.Item
                      name="sendTime"
                      rules={[{ required: true, message: '请选择结束时间' }]}
                      style={{ display: 'inline-block', }}
                    >
                      <DatePicker showTime></DatePicker>
                    </Form.Item>
                }


              </Form.Item>

              <Form.Item
                label="用户设备标签"
                name="tag"
              >
                <Select
                  placeholder="请选择用户设备标签"
                  mode="multiple"
                  allowClear
                // optionFilterProp="name"
                >
                  {
                    this.props.userTagList.map(r => {
                      return (
                        <Option value={r.code} key={r.id} name={r.name}>{r.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              {
                this.formRef.current && (this.formRef.current.getFieldValue("type") == "news" || this.formRef.current.getFieldValue("type") == "mpnews") ?
                  <Form.Item
                    label="图文消息是否跳转外链"
                  // name="tag"
                  >
                    <Select
                      placeholder="请选择图文消息是否跳转外链"
                      allowClear
                      defaultValue={this.formRef.current && this.formRef.current.getFieldValue("type") == "news"}
                      onChange={(val) => {
                        console.log(val)
                        this.formRef.current.setFieldsValue({ "type": val ? "news" : "mpnews" })
                        this.state.selectContent.type = val ? "news" : "mpnews"
                      }}
                    // optionFilterProp="name"
                    >
                      <Option value={true} key={1} >是</Option>
                      <Option value={false} key={2} >否</Option>
                    </Select>
                  </Form.Item>
                  : ""
              }

              <Form.Item {...this.state.tailLayout}>
                <Button htmlType="submit" type="primary" >
                  提交
                </Button>
                <Button type="primary" style={{ margin: "0 20px" }} onClick={() => {
                  this.sendModal()
                }}>
                  立即客服群发
                </Button>
              </Form.Item>
              <Form.Item {...this.state.tailLayout}>
                {
                  selectContent ?
                    <Card style={cardStyleOut}>
                      {this.getCardContent(activeIndex, selectContent, 1)}
                    </Card> : ""
                }
              </Form.Item>
              <Divider plain orientation="left">预览发送配置</Divider>
              <Form.Item
                label="发送预览用户(多选)"
              >
                <Select
                  placeholder="请选择预览用户"
                  mode="multiple"
                  allowClear
                  optionFilterProp="name"
                  onChange={(val) => {
                    console.log(val)
                    let user = this.state.previewUser.filter(item => [...val].some(l => item.id == l))
                    console.log(user)
                    if (user.length > 0) {
                      let arr = []
                      user.forEach(r => {
                        arr.push(r.openid)
                      })
                      this.setState({
                        openIdList: arr
                      })
                    }
                  }}
                >
                  {
                    this.state.previewUser.map(r => {
                      return (
                        <Option value={r.id} key={r.id} name={r.name}>{r.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item {...this.state.tailLayout}>
                <Button type="primary" onClick={() => {
                  if (this.state.openIdList.length == 0) return message.error("请添加预览用户")
                  this.sendModal()
                }}>
                  发送到手机预览
                </Button>

              </Form.Item>
            </Form>
          }
        </Modal>
        {/* 编辑或者新增客服消息 */}
        <Modal
          title="素材"
          centered
          visible={this.state.materialModal}
          onCancel={() => { this.closeModel(1) }}
          footer={null}
          forceRender={true}
          width={1000}
          wrapClassName="outClass"
        // style={{ zIndex: 9999 }}
        >
          <Tabs tabPosition={"top"} activeKey={tabIndex.toString()}
            onChange={(val) => {
              this.setState({
                tabIndex: val,
                page:1,
                pageSize:10
              },()=>{
                if (val == 0) {
                  this.getMsgTemplate("mpnews")
                } else if (val == 2) {
                  this.getMsgTemplate("text")
                } else if (val == 1) {
                  this.getTemplateImage()
                }
              })
             
            }}
          >
            {
              msgList.map((r, i) => (
                <TabPane tab={r} key={i}>
                  <div style={divStyle}>
                    {
                      templateList.map(l => {
                        return (
                          <Card style={cardStyle} className="hoverStyle" onClick={() => {
                            this.selectMsg(l)
                          }}>
                            {this.getCardContent(tabIndex, l)}
                          </Card>
                        )
                      })
                    }
                  </div>
                  <Pagination defaultCurrent={1} total={this.state.totalCount}
                    current={this.state.page}
                    pageSize={this.state.tabIndex==1?20:this.state.pageSize}
                    onChange={(page, pageSize) => {
                      console.log(page, pageSize)
                      this.setState({
                        page:page,
                        pageSize:pageSize
                      },()=>{
                        if (this.state.tabIndex == 0) {
                          this.getMsgTemplate("mpnews")
                        } else if (this.state.tabIndex == 2) {
                          this.getMsgTemplate("text")
                        } else if (this.state.tabIndex == 1) {
                          this.getTemplateImage()
                        }
                      })
                     
                    }} />
                </TabPane>
              ))
            }

          </Tabs>
        </Modal>
        {/* 新增素材 */}
        <Modal
          title="新增素材"
          centered
          visible={this.state.addMaterial}
          onCancel={() => { this.closeModel(2) }}
          footer={null}
          forceRender={true}
          width={1000}
        // style={{ zIndex: 9999 }}
        >
          <Form
            {...this.state.layout}
            name="formMaterial"
            ref={this.formMaterial}
            onFinish={this.submitMaterial.bind(this)}
          >
            <Form.Item
              label="选择微信公众号"
              name="wxCode"
              rules={[{ required: true, message: '请选择类型' }]}
            // style={{ display: 'inline-flex', width: 'calc(50% - 8px)',}}
            >
              <Select
                placeholder="请选择类型"
                allowClear
                onChange={(val) => {
                  this.setState({
                    typeText: 100
                  })
                }}
              >
                {
                  this.props.wxPublic.map(r => {
                    return (
                      <Option value={r.code} key={r.id}>{r.name}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="消息类型"
              name="msgType"
              rules={[{ required: true, message: '请选择消息类型' }]}
            >
              <Radio.Group onChange={(val) => {
                this.setState({
                  typeText: 1
                })
              }} defaultValue={"news"}>
                <Radio value={"news"}>图文消息</Radio>
                <Radio value={"image"}>图片信息</Radio>
                <Radio value={"text"}>文本消息</Radio>
                <Radio value={"mpCard"}>小程序卡片</Radio>
              </Radio.Group>
            </Form.Item>
            {
              this.formMaterial.current && this.formMaterial.current.getFieldValue("msgType") == "news" ?
                <>
                  <Form.Item {...this.state.tailLayout}>
                    <Alert
                      message="标题通配符说明"
                      description="插入用户昵称请在需要的地方填入 nikeName，仅限跳转外链配置使用。"
                      type="error"
                    // closable
                    // onClose={onClose}
                    />
                  </Form.Item>
                  <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="摘要"
                    name="digest"
                  // rules={[{ required: true, message: '请输入标题' }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '请输入内容' }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    label="封面图片"
                    name="url"
                    rules={[{ required: true, message: '请上传封面图片' }]}
                  >
                    <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)}
                      key={new Date().getTime()}
                      postUrl={"/mms/wxReply/addMedia"} //上传地址
                      params={this.formMaterial.current.getFieldValue("wxCode")} //另外的参数
                      imageUrl={this.formMaterial.current.getFieldValue("url")}
                    />
                  </Form.Item>
                  <Form.Item
                    label="链接地址"
                    name="content_source_url"
                    rules={[{ required: true, message: '请输入链接地址' }]}
                  >
                    <Input />
                  </Form.Item>
                </>
                :
                // 图片消息
                this.formMaterial.current && this.formMaterial.current.getFieldValue("msgType") == "image" ?
                  <>
                    <Form.Item
                      label="图片"
                      name="url"
                      rules={[{ required: true, message: '请上传图片' }]}
                    >
                      <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)}
                        key={new Date().getTime()}
                        postUrl={"/mms/wxReply/addMedia"}
                        params={this.formMaterial.current.getFieldValue("wxCode")}
                        imageUrl={this.formMaterial.current.getFieldValue("url")}
                      />
                    </Form.Item>
                  </>
                  :
                  // 文本消息
                  this.formMaterial.current && this.formMaterial.current.getFieldValue("msgType") == "text" ?
                    <>
                      <Form.Item {...this.state.tailLayout}>
                        <Alert
                          message="标题通配符说明"
                          description="插入用户昵称请在需要的地方填入 nikeName ，插入微信小程序链接请在需要的地方填入 mpLink。"
                          type="error"
                        // closable
                        // onClose={onClose}
                        />
                      </Form.Item>
                      <Form.Item
                        label="微信小程序"
                        name="appid"
                      >
                        <Select
                          placeholder="请选择要插入的微信小程序"
                          allowClear
                        >
                          {
                            this.state.mpList.map(r => {
                              return (
                                <Option value={r.appid} key={r.appid}>{r.appName}</Option>
                              )
                            })
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="小程序标题"
                        name="mpTitle"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="小程序跳转路径"
                        name="mpPath"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="消息内容"
                        name="content"
                        rules={[{ required: true, message: '请输入消息内容' }]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </> : ""
            }

            <Form.Item {...this.state.tailLayout}>
              <Button htmlType="submit" type="primary" >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

    )
  }
  componentDidMount() {
    this.getMpList()
  }
  getCardContent(tabIndex, l, type) {
    return (
      tabIndex == 0 ?
        <div>
          {this.getImageAndWord(l, type)}
        </div>
        : tabIndex == 1 ?
          <div>
            <div style={{ width: "150px", height: "150px" }}><img src={l.url} alt="" style={{ width: "100%", height: "100%" }} /></div>
            <div>{l.name}</div>
          </div>
          : tabIndex == 2 ?
            <div>
              {l.createTime ? <div>创建时间:{util.formatTime(l.createTime, "", 1)}</div> : ""}
              {l.appName ? <div>微信小程序:{l.appName}</div> : ""}
              {l.mpTitle ? <div>微信小程序跳转标题:{l.mpTitle}</div> : ""}
              {l.info ? <div>消息内容:{l.info}</div> : ""}
              {l.mpPath ? <div>微信小程序跳转页面:{l.mpPath}</div> : ""}
            </div> : ""
    )
  }
  getImageAndWord(l, type) {
    if (l.info && l.info.includes("{")) {
      return (
        <div>
          <div>
            {
              type ? "" :
                <>
                  {util.formatTime(JSON.parse(l.info).updateTime, "", 1)}
                  <span style={{ color: "#409eff", "margin": "0 0 0 20px", "cursor": "pointer" }} onClick={() => {
                    window.open(JSON.parse(l.info).content.newsItem[0].url)
                  }}>预览文章</span>
                </>
            }
          </div>
          <div>{JSON.parse(l.info).content.newsItem[0].title}</div>
          <div style={{ width: "150px", height: "150px" }}><img src={JSON.parse(l.info).content.newsItem[0].picUrl} alt="" style={{ width: "100%", height: "100%" }} /></div>
        </div>
      )
    } else if (l.type != "image" && l.type != "text") {
      return (
        <>
          <div>{l.content ? l.content.newsItem ? l.content.newsItem[0].title : l.title : l.title}</div>
          <div style={{ width: "150px", height: "150px" }}><img src={l.content ? l.content.newsItem ? l.content.newsItem[0].picUrl : l.picUrl : l.picUrl} alt="" style={{ width: "100%", height: "100%" }} /></div>
        </>
      )
    } else {

    }
  }
  closeModel(type) { // 1是关闭素材框 2是关闭外部框
    if (type === 1) {
      this.setState({
        materialModal: false
      })
    } else if (type === 2) {
      this.setState({
        addMaterial: false
      })
    } else {
      this.props.closeModel()
    }
  }
  submitForm(val) {
    console.log(val)
    if (this.state.sourceType == "add") {
      this.addMsg(val)
    } else {
      this.editMsg(val)
    }


  }
  getFormData(data) { //获取父亲里面的这一行的数据
    console.log(data, "获取父亲里面的这一行的数据")
    if (data == 1) {
      this.formRef.current.resetFields()
      this.setState({
        selectContent: "",
        sourceType: "add"
      })
    } else if (data) {
      let formData = data
      formData.tag = formData.tag ? Array.isArray(formData.tag) ? formData.tag : formData.tag.split(",") : []
      this.formRef.current.setFieldsValue(formData)
      if (formData.sendType != 3) {
        this.formRef.current.setFieldsValue({ "sendTime": moment(formData.sendTime * 1000) })
      }

      let index = 0
      if (formData.type == "image") {
        index = 1
      } else if (formData.type == "text") {
        index = 2
      } else {
        index = 0
      }
      this.setState({
        sourceType: "edit",
        activeIndex: index,
        selectContent: index == 1 ? JSON.parse(formData.info) : index == 2 ? formData : JSON.parse(formData.info.replace(/\n/g, "<br/>"))
      })

      this.getTemplateUser(this.formRef.current.getFieldValue("wxCode"))
    }
    this.setState({
      parentsData: data
    })

  }
  selectMsg(val) {
    console.log(val, this.state.tabIndex)
    if (this.state.tabIndex == 1) {
      val.type = "image"
    }
    this.closeModel(1)
    this.formRef.current.setFieldsValue({ "type": val.type })
    this.setState({
      selectContent: val,
      activeIndex: this.state.tabIndex
    })

  }
  getMsgTemplate(val) {
    let params = {
      name: "",
      page: { currentPage: this.state.page, pageSize: this.state.pageSize },
      type: val,
      wxCode: this.formRef.current.getFieldValue("wxCode"),
    }
    getMsgTemplate(params).then(res => {
      if (res.data.errCode === 0 && res.data.data) {
        console.log(res.data)
        this.setState({
          templateList: res.data.data,
          totalCount:res.data.totalCount
        })
      } else {
        this.setState({
          templateList: []
        })
      }
    })
  }
  getTemplateImage() {
    let params = {
      count: 20,
      offset: (this.state.page -1 )* 20,
      type: "image",
      wxCode: this.formRef.current.getFieldValue("wxCode"),
    }
    getTemplateImage(params).then(res => {
      console.log(res.data)
      if (res.data.errCode === 0 && res.data.data) {
        this.setState({
          templateList: res.data.data.item,
          totalCount:res.data.data.totalCount
        })
      } else {
        this.setState({
          templateList: []
        })
      }
    })
  }
  getTemplateUser(val) {
    let params = {
      wxCode: val,
    }
    getTemplateUser(params).then(res => {
      if (res.data.errCode === 0 && res.data.data) {
        this.setState({
          previewUser: res.data.data
        })
      } else {
        this.setState({
          previewUser: []
        })
      }
    })
  }
  getMpList() { //获取小程序
    getMpList().then(res => {
      if (res.data.errCode === 0) {
        this.setState({
          mpList: res.data.data
        })
      }
    })
  }
  // 编辑客服消息
  editMsg(item) {
    console.log(this.state.selectContent, this.state.tabIndex)
    let { id, info, messageType, sendTime, sendType, tag, type, wxCode } = this.state.parentsData
    let params = {
      id, info, messageType, sendTime, sendType, type, tag, wxCode,
      ...item,
      tag: item.tag.length === 0 ? "" : item.tag.join(","),
      sendTime: item.sendType == 3 ? item.sendTime : parseInt(item.sendTime.toDate().getTime() / 1000),
      info: this.state.tabIndex == 1 ? JSON.stringify(this.state.selectContent) : this.state.selectContent.info ? this.state.selectContent.info : JSON.stringify(this.state.selectContent),
      type: this.state.selectContent.type || this.formRef.current.getFieldValue("type")
    }
    console.log(params, "params")
    editMsg(params).then(res => {
      if (res.data.errCode === 0) {
        message.success("更新成功")
        this.props.getMsg()
        this.props.closeModel()
      } else {
        message.error("更新失败")
      }
    })
  }
  sendModal() {
    Modal.confirm({
      title: '确认发送吗',
      content: '确认发送？',
      onOk: () => {
        this.sendMsg()
      },
      onCancel: () => {

      }
    })
  }
  sendMsg() {
    let formData = this.formRef.current.getFieldValue() //获取表单数据
    console.log(formData, "formData")
    console.log(this.state.selectContent, "this.state.selectContent")
    let params = {
      openid: this.state.openIdList.join(","),
      tag: formData.tag.length === 0 ? "" : formData.tag.join(","),
      wxCode: formData.wxCode,
    }
    if (formData.type === "text") {
      params.appid = formData.appid;
      params.appName = formData.appName;
      params.mpTitle = formData.mpTitle;
      params.mpPath = formData.mpPath;
      params.content = formData.info;
      params.msgType = formData.type;
    } else if (formData.type === "image") {
      params.msgType = formData.type
      params = {
        ...params, ...this.state.selectContent,
      }
    } else if (formData.type === "mpnews") {
      params = {
        ...params,
        ...(this.state.selectContent.content.newsItem[0]),
        "mediaId": this.state.selectContent.mediaId,
        "msgType": formData.type
      }
    } else if (formData.type === "news") {
      params = {
        ...params,
        ...this.state.selectContent
      }
    }
    console.log(params, "params")
    sendMsg(params).then(res => {
      if (res.data.errCode === 0) {
        message.success("推送成功")
        // this.props.getMsg()
        // this.props.closeModel()
      } else {
        message.error("推送失败")
      }
    })
  }
  addMsg(item) {
    let params = {
      ...item,
      messageType: "custom",
      sendTime: item.sendType == 3 ? item.sendTime : parseInt(item.sendTime.toDate().getTime() / 1000),
      type: this.state.selectContent.type || this.formRef.current.getFieldValue("type"),
      tag: Array.isArray(item.tag) ? item.tag.length === 0 ? "" : item.tag.join(",") : "",
      info: this.state.tabIndex == 1 ? JSON.stringify(this.state.selectContent) : this.state.selectContent.info ? this.state.selectContent.info : JSON.stringify(this.state.selectContent),
    }
    addMsg(params).then(res => {
      if (res.data.errCode === 0) {
        message.success("新增成功")
        this.props.getMsg()
        this.props.closeModel()
      } else {
        message.error("新增失败")
      }
    })
  }
  openMaterialModal() { //打开新增素材弹窗
    this.setState({
      addMaterial: true,
    })
    this.formMaterial.current.setFieldsValue({ "msgType": "news" })
  }
  //获取上传的图片路径
  getUploadFileUrl(file, newItem) {
    console.log(file, newItem, "获取上传的图片路径")
    this.formMaterial.current.setFieldsValue({ "url": newItem.url })
    this.setState({
      imageInfo: newItem
    })
    // console.log(this.formMaterial.current.getFieldValue(),"11")
  }
  submitMaterial(val) {
    if (val.msgType == "text") {
      this.addText(val)
    } else {
      this.addMaterial(val)
    }
  }
  addText(val) {
    let arr = this.state.mpList.filter(item => item.appid == val.appid)
    let params = {
      ...val,
      appName: arr.length > 0 ? arr[0].appName : "",
    }
    console.log(params, "新增")
    addText(params).then(res => {
      if (res.data.errCode === 0) {
        message.success("新增成功")
        this.closeModel(2)
      } else {
        message.error("新增失败")
      }
    })
  }
  addMaterial(val) { //新增素材
    let params = {
      ...val,
      thumb_media_id: this.state.imageInfo.mediaID
    }
    console.log(params, "新增")
    addMaterial(params).then(res => {
      if (res.data.errCode === 0) {
        message.success("新增成功")
        this.syncWxMaterial(val)
      } else {
        message.error("新增失败")
      }
    })
  }
  syncWxMaterial(val) { //同步数据新增素材
    const hide = message.loading("开始同步", 0);
    let params = {
      wxCode: val.wxCode
    }
    syncWxMaterial(params).then(res => {
      if (res.data.errCode === 0) {
        hide()
        message.success("同步成功")
        this.closeModel(2)
      } else {
        message.error("同步失败")
      }
    })
  }
}
