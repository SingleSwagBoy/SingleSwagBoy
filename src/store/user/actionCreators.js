import { doLogin } from 'api'
import { SETUSERINFO, LOGOUT } from './actionTypes'
import { createHashHistory } from 'history'
import { message } from 'antd'
const history = createHashHistory()

// 登录actionCreator
const doLoginAsync = (params={}) => {
  // console.log(params, '--------')
  return (dispatch)=>{
    doLogin(params).then(res=>{
      // console.log(res)
      if(res.data.code === 200){
        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('role', res.data.data.role)
        dispatch({
          type: SETUSERINFO,
          value: res.data.data
        })
        // 登录成功 跳转到主页
        message.success(res.data.msg, 2, ()=>{
          history.push('/admin')
          history.go(0)
        })
      }
    })
  }
}

// 退出登录
const logout = ()=>{
  return {
    type: LOGOUT
  }
}


export {
  doLoginAsync,
  logout
}