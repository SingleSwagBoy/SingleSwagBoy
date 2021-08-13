import React, { Component } from 'react'
import {baseUrl} from "api"
import { Upload,message } from 'antd';
import { LoadingOutlined,PlusOutlined } from '@ant-design/icons';
// import adminRoutes from '../../routes/adminRoutes.js'
import { uploadButton } from 'react-router-dom'
import {  } from 'react-redux'

class ImageUpload extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      updateProps: {
        name:"file",
        listType:"picture-card",
        className:"avatar-uploader",
        showUploadList:false,
        action: `${baseUrl}/mms/file/upload?dir=ad`,
        headers: {
          authorization: JSON.parse(localStorage.getItem("user")).authorization,
        },
      },
    }
    
  }
  componentDidMount(){
    
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
        const { loading } = this.state;
        const uploadButton = (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        );
    return (
      <>
        <Upload {...this.state.updateProps}
            onChange = {(info)=>{
              // 监控上传状态的回调
                  if (info.file.status !== 'uploading') {
                    this.setState({ loading: true });
                  }
                  if (info.file.status === 'done') {
                    console.log(info)
                    this.props.getUploadFileUrl(info.file.response.data.fileUrl)
                    message.success(`上传成功`);
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                  }
                }
            } 
            >
              {
                this.props.imageUrl?
                <img src={this.props.imageUrl} 
                key={new Date().getTime()}
                style={{ width: '100%',height:"100%",backgroundColor:"#ccc"}}
                ></img>
                : uploadButton
              }
          </Upload>
      </>
      
    )
  }
}

export default ImageUpload