import React, { Component } from 'react'
import { Card, Breadcrumb, Form, Input, Button, message, Upload, Image } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import E from 'wangeditor'
import { getArtById, updateArt } from 'api'


export default class ArtEdit extends Component {
  constructor(){
    super();
    const _this = this;
    this.state={

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
      props: {
        name: 'img',
        action: 'http://rap2api.taobao.org/app/mock/275069/api/v1/upload',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {  // 监控上传状态的回调
          if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            _this.setState({
              thumb: info.fileList[0].response.data.thumb
            })
            message.success(`${info.file.name} 上传成功`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
          }
        }
      },

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
            <Breadcrumb.Item>
              <Link to="/mms/artLists">文章列表</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>编辑文章</Breadcrumb.Item>
          </Breadcrumb>
        }>
          <div style={{maxWidth: 800}}>
            {
              this.state.art
              &&
              <Form
                {...this.state.layout}
                name="basic"
                onFinish={this.submitForm}
                initialValues = {{
                  ...this.state.art
                }}
              >
                <Form.Item
                  label="文章标题"
                  name="title"
                  // validateTrigger="onBlur"
                  rules={[{ required: true, message: '请输入文章标题！' }]}
                >
                  <Input />
                </Form.Item>
                .

                <Form.Item
                  label="文章作者"
                  name="author"
                  rules={[{ required: true, message: '请填写作者！' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="文章描述"
                  name="desc"
                >
                  <Input.TextArea />
                </Form.Item>
                
                <Form.Item
                  label="封面图片"
                  // name="desc"
                >
                  {/* 上传文件的控件 */}
                  <Upload {...this.state.props}>
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                  <Image preview={false} width="100" src={this.state.art.thumb}></Image>
                </Form.Item>

                <Form.Item
                  label="编辑详情"
                  // name="desc"
                >
                  <div id="content"></div>
                </Form.Item>

                <Form.Item {...this.state.tailLayout}>
                  <Button type="primary" htmlType="submit">
                    增加文章
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
    this.getArt()
  }
  getArt = () => {
    getArtById(this.props.match.params.artId).then(res=>{
      console.log(res)
      if(res.data.code === 200) {
        this.setState({
          art: res.data.data
        }, () => {
          this.initEditor()
        })
      }
    })
  }
  // 渲染富文本
  initEditor = () => {
    const editor = new E('#content')
    editor.create()
    console.log(this.state.art);
    editor.txt.html(this.state.art.createArt)
    // editor.config.zIndex = 2
    this.setState({
      editor
    })
  }

  submitForm = (params) => {
    params = {                                                                                                                                                       
      ...params,
      id: this.props.match.params.ardId,
      thumb: this.state.thumb,
      content: this.state.editor.txt.html()
    }
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
