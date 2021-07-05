import React, { Component } from 'react'
import {  } from 'antd';
import {connect} from 'react-redux'
import { doLoginAsync } from 'store/user/actionCreators'
import './index.css';
import BGParticle from '../../utils/BGParticle'
const mapStateToProps = (state) => {
  return {
    
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: (params) => {
      dispatch(doLoginAsync(params))
    }
  }
}


@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  state={
    dingdParam: {
      "appid": "",
      "redirect_uri": "",
      "uri": "",
    },
    devAppid:{
      "appidDev": "dingoaaoqasyxflot45f87",
      "appidTest": "dingoayvn0ii7s3zswzcds",
      "appidTest2": "dingoa09ucxedcx85kgpjl",
      "appidProd": "dingoajfgp2ovgefsctzuq",
      "appidProd2": "dingoaulkihfjnml7eezqz",
  }
  }
  componentDidMount () {
    this.initPage()
  }
  initPage(){
    this.particle = new BGParticle('backgroundBox')
    this.particle.init()
    this.DDlogin();
    this.DDListen();
  }
  DDlogin(){
    let base = "http://" + window.location.host;
    if (this.state.dingdParam.redirect_uri.indexOf(base) == -1){
        this.state.dingdParam.redirect_uri = base + this.state.dingdParam.redirect_uri;
    }
    if (base.indexOf("localhost") != -1) {
        this.state.dingdParam.appid = this.state.devAppid["appidDev"]
    } else if (window.location.host == "cms.tvplus.club") {
        this.state.dingdParam.appid = this.state.devAppid["appidProd"]
    } else if (window.location.host == "test2.cms.tvplus.club") {
        this.state.dingdParam.appid = this.state.devAppid["appidTest2"]
    } else if (window.location.host == "cms2.tvplus.club") {
        this.state.dingdParam.appid = this.state.devAppid["appidProd2"]
    } else {
        this.state.dingdParam.appid = this.state.devAppid["appidTest"]
    }
    this.state.dingdParam.uri = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + this.state.dingdParam.appid + "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + this.state.dingdParam.redirect_uri;
    //2.2.扫码触发事件
    this.setState({
      dingdParam:this.state.dingdParam
    })
    window.DDLogin({
        id: "login_container",
        goto: encodeURIComponent(this.state.dingdParam.uri),
        style: "border:none;background-color:rgba(0,0,0,0.4);",
        height: "350",
    });
  }
  DDListen(){
    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('message', this.getDingCode, false);
    } else if (typeof window.attachEvent != 'undefined') {
      window.attachEvent('onmessage', this.getDingCode);
    }
  }
  getDingCode(event){
    console.log(event,"event")
    let origin = event.origin;
    if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
        let loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
        let redirect_uri_check = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + this.state.dingdParam.appid +
            "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + this.state.dingdParam.redirect_uri + "&loginTmpCode=";
        window.location.href = redirect_uri_check + loginTmpCode;
    }
  }
  render() {
    return (
      <div className="login">
        <div id='backgroundBox' className="backgroundBox"></div>
        <div id="login_container" className="login_container"></div>
      </div>
    )
  }
  login = (value) => {
    this.props.doLogin(value)
  }
}

export default Login