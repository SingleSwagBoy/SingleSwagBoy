import { SETUSERINFO, LOGOUT } from './actionTypes'

// 登录actionCreator
const doLogin = (params) => {
  return {
    type:SETUSERINFO,
    params
  }
}

// 退出登录
const logout = ()=>{
  return {
    type: LOGOUT
  }
}


export {
  doLogin,
  logout
}