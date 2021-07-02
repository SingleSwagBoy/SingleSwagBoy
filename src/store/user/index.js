import { SETUSERINFO, LOGOUT } from './actionTypes'
let defaultState = {
  token: '',
  userInfo: {},
  role: ''
}
// 刷新时取缓存 赋值给state user
const user = localStorage.getItem('user')
if(user) {
  // 不是第一次打开程序，user已经备份
  defaultState = JSON.parse(user)
}
const reducer = (state=defaultState, action) => {
  // console.log(state)
  let newState = JSON.parse(JSON.stringify(state))
  // console.log(newState)
  switch (action.type) {
    case SETUSERINFO:
      newState.token = action.value.token
      newState.userInfo = action.value.userInfo
      newState.role = action.value.role
      break;
    case LOGOUT:
      newState.token = ''
      newState.userInfo = {}
      newState.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      // localStorage.removeItem('user')
      break;
    default:
      break;
  }
  // 同步缓存
  // console.log(newState)
  localStorage.setItem('user', JSON.stringify(newState))
  return newState
}

export default reducer