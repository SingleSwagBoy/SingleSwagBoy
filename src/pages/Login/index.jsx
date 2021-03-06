import React, { Component } from 'react'
import { Tabs,Form, Input, Button, Checkbox, message } from 'antd';
import {connect} from 'react-redux'
import { doLogin } from 'store/user/actionCreators'
import {loginSystem} from "../../api/index"
import './index.css';
import BGParticle from '../../utils/BGParticle'
import util from "../../utils/index"
const { TabPane } = Tabs;
const mapStateToProps = (state) => {
  return {
    
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: (params) => {
      dispatch(doLogin(params))
    }
  }
}


@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {
  state={
    dingdParam: {
      "appid": "",
      "redirect_uri": "/mms/login/new_ding",
      "uri": "",
    },
    devAppid:{
      "appidDev": "dingoaaoqasyxflot45f87",
      "appidTest": "dingoa79hazduekdhw6oyb",
      "appidTest2": "dingoa09ucxedcx85kgpjl",
      "appidProd": "dingoatekbebkig2bsnjlb",
      "appidProd2": "dingoaulkihfjnml7eezqz",
      "bak03": "dingoaqmmzeoa6cmsltsb5",
      "bak04": "dingoaiwgulonzto4vwh9v",
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
    if (base.indexOf("localhost") !== -1) {
      a.appid = this.state.devAppid["appidDev"]
    } else if (window.location.host === "cms.tvplus.club") {
        a.appid = this.state.devAppid["appidProd"]
    } else if (window.location.host === "test2.cms.tvplus.club") {
        a.appid = this.state.devAppid["appidTest2"]
    } else if (window.location.host === "cms2.tvplus.club") {
        a.appid = this.state.devAppid["appidProd2"]
    } else if (window.location.host === "bak04.tvplus.club") {
        a.appid = this.state.devAppid["bak04"]
        a.redirect_uri = "/mms/login/ding"
    } else if (window.location.host === "bak03.tvplus.club") {
        a.appid = this.state.devAppid["bak03"]
        a.redirect_uri = "/mms/login/ding"
    } else {
        a.appid = this.state.devAppid["appidTest"]
    }
    if (a.redirect_uri.indexOf(base) === -1){
      a.redirect_uri = base + a.redirect_uri;
      // this.setState({
      //   dingdParam:a
      // })
  }
    a.uri = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + a.appid + "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" + a.redirect_uri;
    this.setState({
      dingdParam:a
    })
    //2.2.??????????????????
    window.DDLogin({
        id: "login_container",
        goto: encodeURIComponent(this.state.dingdParam.uri),
        style: "border:none;background-color:rgba(0,0,0,0.4);",
        height: "350",
        width:"350"
    });
  }
  DDListen(){
    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', this.getDingCode, false);
    } else if (typeof window.attachEvent !== 'undefined') {
      window.attachEvent('onmessage', this.getDingCode);
    }

    //2.5.????????????token,?????????cookie
    let authorization = util.GetUrlParam("authorization");
    let userid = util.GetUrlParam("userid");
    let name = util.GetUrlParam("name");
    let id = util.GetUrlParam("id");
    console.log(authorization,"authorization")
    if(authorization && userid){
      let params ={
        authorization,
        userid,
        name,
        id,
      }
      this.props.doLogin(params)
      setTimeout(r=>{
        this.props.history.push("/mms/transition")
      },2000)
    }
  }
  getDingCode(event){
    console.log(event,"event")
    let origin = event.origin;
    let info = this.state.dingdParam
    if (origin === "https://login.dingtalk.com") { //??????????????????ddLogin???????????????
        let loginTmpCode = event.data; //??????loginTmpCode??????????????????????????????????????????????????????
        let redirect_uri_check = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${info.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${info.redirect_uri}&loginTmpCode=${loginTmpCode}`
        window.location.href = redirect_uri_check
    }
  }
  callback(key) {
    console.log(key);
  }
  onFinish(params) {
    console.log(params)
    this.loginSystem(params)
  }
  loginSystem(params){
    loginSystem(params).then(res=>{
      if(res.data.errCode === 0){
        message.success("????????????")
        this.props.doLogin(res.data.data)
        setTimeout(r=>{
          this.props.history.push("/mms/transition")
        },1500)
      }else{
        message.error(res.data.msg)
      }
    })
  }
  render() {
    return (
      <>
       <div className="login">
            <div id='backgroundBox' className="backgroundBox"></div>
            <Tabs defaultActiveKey="1" onChange={this.callback()} tabPosition={"top"} centered>
              <TabPane tab="????????????" key="1">
                <div className="common_box">
                  <div id="login_container" className="login_container"></div>
                </div>
              </TabPane>
              <TabPane tab="????????????" key="2">
                <div className="common_box">
                  <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    // width={"100%"}
                    style={{width:"350px",backgroundColor:"rgba(255,255,255,0.4)",paddingTop:"50px"}}
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish.bind(this)}
                    // onFinishFailed={onFinishFailed}
                  >
                    <Form.Item
                      label="??????"
                      name="username"
                      rules={[{ required: true, message: '???????????????' }]}
                    >
                      <Input placeholder={"???????????????"} />
                    </Form.Item>

                    <Form.Item
                      label="??????"
                      name="password"
                      rules={[{ required: true, message: '???????????????' }]}
                    >
                      <Input.Password placeholder={"???????????????"} />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 18 }}>
                      <Checkbox>?????????</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
                      <Button type="primary" htmlType="submit">
                        ??????
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                
              </TabPane>
            </Tabs>
        </div>
          
      </>
     
    )
  }
}

export default Login