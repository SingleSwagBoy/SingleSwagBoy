import React, { Component } from 'react'
// import request from 'utils/request'
import { getMsgTemplate, getTemplateImage, getTemplateUser, editMsg, sendMsg, addMsg, requestWxProgramList, addMaterial, syncWxMaterial, addText } from 'api'
import { Card, Button, message, Tabs, Radio, Modal, Form, Input, Select, DatePicker, Divider, Alert, InputNumber, Pagination } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import "./style.css"
const { Option } = Select;
const { TabPane } = Tabs;
let contentProps =  ""//input的光标位置
export default class AddressNews extends Component {
  formRef = React.createRef();
  formMaterial = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      tailLayout: {
        wrapperCol: { offset: 6, span: 18 },
      },
      materialModal: false,
      // msgList: ["图文信息", "图片信息", "文字信息", "小程序卡片"],
      msgList: ["图片信息"],
      templateList: [], //素材列表
      mpList: [], //小程序列表
      previewUser: [],//预览用户
      parentsData: "", // 父组件传过来的数据
      openIdList: [],
      sourceType: "",
      addMaterialState: false,
      typeText: 0,
      imageInfo: "",//图片信息
      wildcard: "",//通配符的位置记录
     
    }
  }
  render() {
    const { msgList, templateList } = this.state;
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
              {
                this.getMsgTemp()
              }
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
                  this.sendModal(1)
                }}>
                  立即客服群发
                </Button>
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
                    let arr = []
                    if (user.length > 0) {
                      user.forEach(r => {
                        arr.push(r.openid)
                      })
                    }
                    this.setState({
                      openIdList: arr
                    })
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
          <Tabs tabPosition={"top"} activeKey={"0"}
            onChange={(val) => {
              this.setState({
                page: 1,
                pageSize: 10
              }, () => {
                this.getTemplateImage()
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
                            {this.getCardContent(l)}
                          </Card>
                        )
                      })
                    }
                  </div>
                  <Pagination defaultCurrent={1} total={this.state.totalCount}
                    current={this.state.page}
                    pageSize={20}
                    onChange={(page, pageSize) => {
                      console.log(page, pageSize)
                      this.setState({
                        page: page,
                        pageSize: pageSize
                      }, () => {
                        this.getTemplateImage()
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
          visible={this.state.addMaterialState}
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
              label="图片"
              name="url"
              rules={[{ required: true, message: '请上传图片' }]}
            >
              {
                this.formMaterial.current ?
                  <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this, 2)}
                    key={new Date().getTime()}
                    postUrl={"/mms/wxReply/addMedia"} //上传地址
                    params={this.formMaterial.current.getFieldValue("wxCode")} //另外的参数
                    imageUrl={this.formMaterial.current.getFieldValue("url")}
                  />
                  : ""
              }

            </Form.Item>


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
  getCardContent(l) {
    return (
      <div>
        <div style={{ width: "150px", height: "150px" }}><img src={l.url} alt="" style={{ width: "100%", height: "100%" }} /></div>
        <div>{l.name}</div>
      </div>
    )
  }

  /* 
    素材列表
  */
  getMsgTemp() {
    return (
      <>
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
            <Radio value={"mini"}>小程序卡片</Radio>
          </Radio.Group>
        </Form.Item>
        {
          this.formRef.current && this.formRef.current.getFieldValue("msgType") == "news" ?
            <>
              <Form.Item {...this.state.tailLayout}>
                <Alert
                  message="标题通配符说明"
                  description="插入用户昵称请在需要的地方填入 nickName，仅限跳转外链配置使用。"
                  type="error"
                // closable
                // onClose={onClose}
                />
              </Form.Item>
              {/* 通配符函数 */}
              {/* {
                this.getWildCard("#nickName")
              } */}
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input onFocus={(val) => {
                  contentProps = val
                  this.setState({
                    wildcard: "title",
                    wildType:"input"
                  })
                }} />
              </Form.Item>
              <Form.Item
                label="摘要"
                name="digest"
              // rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input.TextArea onFocus={(val) => {
                  contentProps = val
                  this.setState({
                    wildcard: "digest"
                  })
                }} />
              </Form.Item>
              <Form.Item
                label="封面图片"
                name="url"
                rules={[{ required: true, message: '请上传封面图片' }]}
              >
                {
                  this.getPostButton()
                }
              </Form.Item>
              <Form.Item
                label="链接地址"
                name="content_source_url"
                rules={[{ required: true, message: '请输入链接地址' }]}
              >
                <Input onFocus={() => {
                  this.setState({
                    wildcard: "not"
                  })
                }} />
              </Form.Item>
            </>
            :
            // 图片消息
            this.formRef.current && this.formRef.current.getFieldValue("msgType") == "image" ?
              <>
                <Form.Item
                  label="图片"
                  name="url"
                  rules={[{ required: true, message: '请上传图片' }]}
                >
                  {
                    this.getPostButton()
                  }
                </Form.Item>
              </>
              :
              // 文本消息
              this.formRef.current && this.formRef.current.getFieldValue("msgType") == "text" ?
                <>
                  <Form.Item {...this.state.tailLayout}>
                    <Alert
                      message="标题通配符说明"
                      description="插入用户昵称请在需要的地方填入 nickName"
                      type="error"
                    // closable
                    // onClose={onClose}
                    />
                  </Form.Item>
                  {/* 通配符函数 */}
                  {/* {
                    this.getWildCard("#nickName")
                  } */}
                  <Form.Item
                    label="消息内容"
                    name="content"
                    rules={[{ required: true, message: '请输入消息内容' }]
                    }
                  >
                    <Input.TextArea autoSize={true}  onFocus={(val) => {
                      contentProps = val
                      this.setState({
                        wildcard: "content"
                      })
                    }} />
                  </Form.Item>
                </>
                :
                // 小程序消息
                this.formRef.current && this.formRef.current.getFieldValue("msgType") == "mini" ?
                  <>
                    <Form.Item {...this.state.tailLayout}>
                      <Alert
                        message="标题通配符说明"
                        description="插入用户昵称请在需要的地方填入 nickName ，插入微信小程序链接请在需要的地方填入 mpLink。"
                        type="error"
                      // closable
                      // onClose={onClose}
                      />
                    </Form.Item>
                    <Form.Item
                      label="微信小程序"
                      name="appid"
                    // rules={[{ required: true, message: '请选择微信小程序' }]}
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
                    {/* {
                      this.getWildCard("#nickName")
                    } */}
                    <Form.Item
                      label="小程序标题"
                      name="mpTitle"
                      rules={[{ required: true, message: '请输入小程序标题' }]}
                    >
                      <Input  onFocus={(val) => {
                        contentProps = val
                        this.setState({
                          wildcard: "mpTitle"
                        })
                      }} />
                    </Form.Item>

                    <Form.Item
                      label="小程序跳转路径"
                      name="mpPath"
                      rules={[{ required: true, message: '请输入小程序跳转路径' }]}
                    >
                      <Input onFocus={() => {
                        this.setState({
                          wildcard: "not"
                        })
                      }} />

                    </Form.Item>
                    <Form.Item
                      label="封面图片"
                      name="url"
                      rules={[{ required: true, message: '请上传封面图片' }]}
                    >
                      {
                        this.getPostButton()
                      }
                    </Form.Item>
                  </>
                  : ""
        }
      </>
    )
  }
  // 获取通配符
  getWildCard(addInfo) {
    return (
      <Form.Item {...this.state.tailLayout}>
        <div>
          <div style={{ border: "1px solid #000", width: "fit-content", padding: "2px 5px", borderRadius: "5px" }}
            onClick={() => {
              if (this.state.wildcard == "not") {
                return message.warn("该输入框不支持通配符")
              }
              if (this.state.wildcard) {
                let word = this.formRef.current.getFieldValue([this.state.wildcard])
                let props = ""
                props = contentProps.target; // 获取dom节点实例
                let position = util.getPositionForTextArea(props); // 光标的位置
                let length = 0;
                // setFieldsValue方法是异步的
                // 不加延时器就会发生光标还没插入文字呢 就已经把光标插入后的位置提前定位
                if(word){
                  length = addInfo.length
                  word = word.substr(0,position.start)+addInfo+word.substr(position.start)
                }else{
                  word = addInfo
                }
                this.formRef.current.setFieldsValue({ [this.state.wildcard]: word})
                setTimeout(()=>{
                    util.setCursorPosition(props, position.start+length);
                },100);
              }
            }}
          >
            用户姓名
          </div>
        </div>
      </Form.Item>
    )
  }
  // getPositionForTextArea = (ctrl) => {
  //   // 获取光标位置
  //   let CaretPos = {
  //     start: 0,
  //     end: 0
  //   };
  //   if (ctrl.selectionStart) {// Firefox support
  //     CaretPos.start = ctrl.selectionStart;
  //   }
  //   if (ctrl.selectionEnd) {
  //     CaretPos.end = ctrl.selectionEnd;
  //   }
  //   return (CaretPos);
  // }
  // setCursorPosition = (ctrl, pos) => {
  //   ctrl.focus();
  //   ctrl.setSelectionRange(pos, pos);
  // }
  //获取图片素材按钮
  getPostButton() {
    return (
      <div style={{ display: "flex", "justifyContent": "flex-start" }}>
        <div style={{ width: "20%" }}>
          <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this, 1)}
            key={new Date().getTime()}
            postUrl={"/mms/wxReply/addMedia"} //上传地址
            params={this.formRef.current.getFieldValue("wxCode")} //另外的参数
            imageUrl={this.formRef.current.getFieldValue("url")}
          />
        </div>
        <Button type="primary" onClick={() => {
          if (!this.formRef.current.getFieldValue("wxCode")) return message.error("请先选择微信公众号")
          this.setState({ materialModal: true, page: 1 }, () => {
            this.getTemplateImage()
          })

        }}>
          选择素材
        </Button>
      </div>
    )
  }

  closeModel(type) { // 1是关闭素材框 2是关闭外部框
    if (type === 1) {
      this.setState({
        materialModal: false
      })
    } else if (type === 2) {
      this.setState({
        addMaterialState: false
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
    this.formRef.current.resetFields()
    if (data == 1) {
      this.formRef.current.setFieldsValue({ "msgType": "news" })
      this.setState({
        sourceType: "add"
      })
    } else if (data) {
      let formData = data
      formData.tag = formData.tag ? Array.isArray(formData.tag) ? formData.tag : formData.tag.split(",") : []
      this.formRef.current.setFieldsValue(formData)
      if (formData.type === "multi") {
        let arr = JSON.parse(formData.multiInfo.replace(/\n/g, "\\n").replace(/\r/g,"\\r"))
        console.log(formData.multiInfo)
        if (arr[0].msgType === "news") {
          this.formRef.current.setFieldsValue({
            "msgType": arr[0].msgType,
            title: arr[0].title,
            digest: arr[0].description,
            url: arr[0].picUrl,
            content_source_url: arr[0].url,
          })
        } else if (arr[0].msgType === "image") {
          this.formRef.current.setFieldsValue({
            "msgType": arr[0].msgType,
            url: arr[0].picUrl,

          })
        } else if (arr[0].msgType === "text") {
          this.formRef.current.setFieldsValue({
            "msgType": arr[0].msgType,
            content: arr[0].content,

          })
        } else if (arr[0].msgType === "mini") {
          this.formRef.current.setFieldsValue({
            "msgType": arr[0].msgType,
            mpTitle: arr[0].miniTitle,
            mpPath: arr[0].path,
            url: arr[0].picUrl,
            appid: arr[0].appid,
          })
        }
        this.setState({
          imageInfo: arr[0]
        })
      } else {
        this.formRef.current.setFieldsValue({ "msgType": formData.type === "mpnews" ? "news" : formData.type })
      }
      if (formData.sendType != 3) {
        this.formRef.current.setFieldsValue({ "sendTime": moment(formData.sendTime * 1000) })
      }
      this.setState({
        sourceType: "edit",
      })

      this.getTemplateUser(this.formRef.current.getFieldValue("wxCode"))
    }
    this.setState({
      parentsData: data
    })

  }
  selectMsg(val) {
    console.log(val)
    this.closeModel(1)
    if (this.formRef.current.getFieldValue("multiInfo")) {
      let imageInfo = JSON.parse(this.formRef.current.getFieldValue("multiInfo"))[0]
      imageInfo.picUrl = val.url
      imageInfo.mediaId = val.mediaId
      this.formRef.current.setFieldsValue({ "multiInfo": JSON.stringify([imageInfo]) })
    }
    this.formRef.current.setFieldsValue({ "url": val.url })
    this.setState({
      imageInfo: val,
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
          totalCount: res.data.totalCount
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
      offset: (this.state.page - 1) * 20,
      type: "image",
      wxCode: this.formRef.current.getFieldValue("wxCode"),
    }
    getTemplateImage(params).then(res => {
      console.log(res.data)
      if (res.data.errCode === 0 && res.data.data) {
        this.setState({
          templateList: res.data.data.item,
          totalCount: res.data.data.totalCount
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
    requestWxProgramList({})
      .then(res => {
        this.setState({
          mpList: res.data
        })
      }).catch(res => {

      })
  }
  // 编辑客服消息
  editMsg(item) {
    console.log(item, this.state.imageInfo)
    // let { id, info, messageType, sendTime, sendType, tag, type, wxCode } = this.state.parentsData
    let info = []
    if (item.msgType == "image") {
      info.push({
        mediaId: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
        picUrl: this.state.imageInfo.url || this.state.imageInfo.picUrl,
        msgType: item.msgType
      })
    } else if (item.msgType == "text") {
      info.push({ content: item.content, msgType: item.msgType })
    } else if (item.msgType == "mini") {
      info.push({
        appid: item.appid,
        miniTitle: item.mpTitle,
        path: item.mpPath,
        mediaId: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
        picUrl: this.state.imageInfo.url || this.state.imageInfo.picUrl,
        msgType: item.msgType
      })
    } else {
      info.push({
        title: item.title,
        mediaId: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
        picUrl: this.state.imageInfo.url || this.state.imageInfo.picUrl,
        description: item.digest,
        url: item.content_source_url,
        msgType: item.msgType
      })
    }
    let params = {
      // id, messageType, sendTime, sendType, type, tag, wxCode,
      ...this.state.parentsData,
      ...item,
      tag: item.tag.length === 0 ? "" : item.tag.join(","),
      sendTime: item.sendType == 3 ? item.sendTime : parseInt(item.sendTime.toDate().getTime() / 1000),
      type: "multi",
      multiInfo: JSON.stringify(info)
    }
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
  sendModal(type) {
    Modal.confirm({
      title: '确认发送吗',
      content: '确认发送？',
      onOk: () => {
        this.sendMsg(type)
      },
      onCancel: () => {

      }
    })
  }
  sendMsg(type) {
    let formData = this.formRef.current.getFieldValue() //获取表单数据
    console.log(formData, "formData")
    let params = {
      openid:type == 1 ? "" : this.state.openIdList.join(","),
      tag: formData.tag ? formData.tag.length === 0 ? "" : formData.tag.join(",") : "",
      wxCode: formData.wxCode,
    }
    if (formData.type === "multi") {  //新版本
      let arr = JSON.parse(formData.multiInfo.replace(/\n/g, "\\n").replace(/\r/g,"\\r"))[0]
      console.log(arr)
      params = {
        ...params,
        ...arr
      }
      if (arr.msgType == "mini") {
        params.title = arr.miniTitle
        // params.path = arr.mpPath
      }
    }
    if (this.state.sourceType == "add") {
      if (formData.msgType == "image") {
        params.mediaId = this.state.imageInfo.mediaID || this.state.imageInfo.mediaId
        params.picUrl = this.state.imageInfo.url || this.state.imageInfo.picUrl
        params.msgType = formData.msgType
      } else if (formData.msgType == "text") {
        params.content = formData.content
        params.msgType = formData.msgType
      } else if (formData.msgType == "mini") {
        params.appid = formData.appid
        params.miniTitle = formData.mpTitle
        params.path = formData.mpPath
        params.mediaId = this.state.imageInfo.mediaID || this.state.imageInfo.mediaId
        params.picUrl = this.state.imageInfo.url || this.state.imageInfo.picUrl
        params.msgType = formData.msgType
      } else {
        params.title = formData.title
        params.mediaId = this.state.imageInfo.mediaID || this.state.imageInfo.mediaId
        params.picUrl = this.state.imageInfo.url || this.state.imageInfo.picUrl
        params.description = formData.digest
        params.url = formData.content_source_url
        params.msgType = formData.msgType
      }
    }
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
  addMsg(item,source) {
    console.log(item)
    let info = []
    let type = ""
    if(source == "copy"){
      info = JSON.parse(item.multiInfo.replace(/\n/g, "\\n").replace(/\r/g,"\\r"))
      item.createTime = new Date().getTime()/ 1000
      delete item.id
    }else{
      type = this.formRef.current.getFieldValue("msgType")
      if (type == "image") {
        info.push({
          mediaId: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
          picUrl: this.state.imageInfo.url,
          msgType: type
        })
      } else if (type == "text") {
        info.push({ content: item.content, msgType: type })
      } else if (type == "mini") {
        info.push({
          appid: item.appid,
          appName: item.appName,
          miniTitle: item.mpTitle,
          path: item.mpPath,
          mediaId: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
          picUrl: this.state.imageInfo.url,
          msgType: type
        })
      } else {
        info.push({
          title: item.title,
          mediaId: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
          picUrl: this.state.imageInfo.url,
          description: item.digest,
          url: item.content_source_url,
          msgType: type
        })
      }
    }
    
   
    let params = {
      ...item,
      messageType: "custom",
      sendTime: source == "copy"?item.sendTime : item.sendType == 3 ? item.sendTime : parseInt(item.sendTime.toDate().getTime() / 1000),
      type: "multi",
      tag: Array.isArray(item.tag) ? item.tag.length === 0 ? "" : item.tag.join(",") : item.tag?item.tag:"",
      multiInfo: JSON.stringify(info)
    }
    // return console.log(params)
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
      addMaterialState: true,
    })
    this.formMaterial.current.resetFields()
  }
  //获取上传的图片路径
  getUploadFileUrl(type, file, info) {
    console.log(type, file, info, "获取上传的图片路径")
    if (type === 1) {
      this.formRef.current.setFieldsValue({ "url": info.url })
    } else {
      this.formMaterial.current.setFieldsValue({ "url": info.url })
    }
    this.setState({
      imageInfo: info
    })
    // console.log(this.formMaterial.current.getFieldValue(),"11")
  }
  submitMaterial(val) {
    this.addMaterial(val)
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
      thumb_media_id: this.state.imageInfo.mediaID || this.state.imageInfo.mediaId,
      msgType: "image"
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
