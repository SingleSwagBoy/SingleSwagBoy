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
        // data:{wxCode:this.props.params}, //接口其他参数
        listType:"picture-card",
        className:"avatar-uploader",
        showUploadList:false,
        action: `${baseUrl}${this.props.postUrl?this.props.postUrl:"/mms/file/upload?dir="+(this.props.contents||"ad")}`,//需要上传其他地址传过来，默认为ad(为oss上面的储存目录)
        headers: {
          authorization: JSON.parse(localStorage.getItem("user")).authorization,
          userid:JSON.parse(localStorage.getItem("user")).userInfo.id,
        },
      },
    }
    if(this.props.params){
      this.state.updateProps.data={
        wxCode:this.props.params
      }
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
            beforeUpload={(info)=>{
              console.log(info,"beforeUpload")
              if(this.props.needAgain){
                this.props.getUploadFile(info)
              }
            }}
            onChange = {(info)=>{
              // 监控上传状态的回调
                  if (info.file.status !== 'uploading') {
                    this.setState({ loading: true });
                  }
                  if (info.file.status === 'done') {
                    console.log(info)
                    if(info.file.response.errCode === 0){
                      this.props.getUploadFileUrl(info.file.response.data.fileUrl,info.file.response.data)
                      this.setState({ loading: false });
                      message.success(`上传成功`);
                    }else{
                      this.setState({ loading: false });
                      message.error(info.file.response.msg);
                    }
                    
                   
                  } else if (info.file.status === 'error') {
                    this.setState({ loading: false });
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