/*
 * @Author: HuangQS
 * @Date: 2021-12-24 18:32:16
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-12-27 10:49:18
 * @Description: 图片上传
 */
import React, { Component } from 'react'
import { baseUrl } from "api"
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
// import adminRoutes from '../../routes/adminRoutes.js'
import { uploadButton } from 'react-router-dom'
import { } from 'react-redux'

class ImageUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      updateProps: {
        name: "file",
        // data:{wxCode:this.props.params}, //接口其他参数
        listType: "picture-card",
        className: "avatar-uploader",
        showUploadList: false,
        action: `${baseUrl}${this.props.postUrl ? this.props.postUrl : "/mms/file/upload?dir=ad"}`,//需要上传其他地址传过来，默认为ad
        headers: {
          authorization: JSON.parse(localStorage.getItem("user")).authorization,
        },
      },
    }
    if (this.props.params) {
      this.state.updateProps.data = {
        wxCode: this.props.params
      }
    }
  }
  componentDidMount() {

  }
  render() {
    /* 
    场景：
        平铺的checkBox
    参数：
        checkData：默认选中的数据 数组//多加了一个判断，
    回调函数：
        getMarketReturn：选中后的数据回调
    */
    let { loading } = this.state;
    let uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    let that = this;
    let imageUrl = that.props.imageUrl;

    return (
      <>
        <Upload {...that.state.updateProps}
          onChange={(info) => {
            // 监控上传状态的回调
            if (info.file.status !== 'uploading') {
              that.setState({ loading: true });
            }
            if (info.file.status === 'done') {
              let response = info.file.response;
              console.log(info)
              if (response.errCode === 0) {
                that.props.getUploadFileUrl(response.data.fileUrl, response.data)
                that.setState(
                  { loading: false },
                  () => {
                    message.success(`上传成功`);
                  });
              } else {
                that.setState(
                  { loading: false },
                  () => {
                    message.error(response.msg)
                  });
              }

            } else if (info.file.status === 'error') {
              that.setState({ loading: false });
              message.error(`${info.file.name} 上传失败.`);
            }
          }
          }
        >
          {
            imageUrl ?
              <img src={imageUrl} key={new Date().getTime()} style={{ width: '100%', height: "100%", backgroundColor: "#ccc" }} />
              : uploadButton
          }
        </Upload>
      </>

    )
  }
}

export default ImageUpload