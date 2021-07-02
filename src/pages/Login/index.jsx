import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import {connect} from 'react-redux'
import { doLoginAsync } from 'store/user/actionCreators'
import './index.less'

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
  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 8 },
    };
    
    return (
      <div className="login">
        <div id='backgroundBox'></div>
        11
      </div>
    )
  }
  login = (value) => {
    this.props.doLogin(value)
  }
}

export default Login