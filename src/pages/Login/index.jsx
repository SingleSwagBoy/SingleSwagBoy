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
      "redirect_uri": "mms/dashBoard",
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
  constructor(props){
    super(props);
    this.getDingCode = this.getDingCode.bind(this);
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
    let a = this.state.dingdParam
    if (this.state.dingdParam.redirect_uri.indexOf(base) === -1){
        a.redirect_uri = base + this.state.dingdParam.redirect_uri;
        this.setState({
          dingdParam:a
        })
    }
    if (base.indexOf("localhost") !== -1) {
      a.appid = this.state.devAppid["appidDev"]
    } else if (window.location.host === "cms.tvplus.club") {
        a.appid = this.state.devAppid["appidProd"]
    } else if (window.location.host === "test2.cms.tvplus.club") {
        a.appid = this.state.devAppid["appidTest2"]
    } else if (window.location.host === "cms2.tvplus.club") {
        a.appid = this.state.devAppid["appidProd2"]
    } else {
        a.appid = this.state.devAppid["appidTest"]
    }
    a.uri = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + a.appid + "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + a.redirect_uri;
    this.setState({
      dingdParam:a
    })
    //2.2.扫码触发事件
    window.DDLogin({
        id: "login_container",
        goto: encodeURIComponent(this.state.dingdParam.uri),
        style: "border:none;background-color:rgba(0,0,0,0.4);",
        height: "350",
    });
  }
  DDListen(){
    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', this.getDingCode, false);
    } else if (typeof window.attachEvent !== 'undefined') {
      window.attachEvent('onmessage', this.getDingCode);
    }
  }
  getDingCode(event){
    console.log(event,"event")
    console.log(this.state.dingdParam,"this.state.dingdParam")
    let origin = event.origin;
    let info = this.state.dingdParam
    if (origin === "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
        let loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
        let redirect_uri_check = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + info.appid +
            "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + info.redirect_uri + "&loginTmpCode=";
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