import { SETUSERINFO, LOGOUT } from './actionTypes'
let defaultState = {
  authorization: '',
  userInfo: {},
}
// 刷新时取缓存 赋值给state user
const user = localStorage.getItem('user')
if(user) {
  if(JSON.parse(user).authorization){
    defaultState = JSON.parse(user)
  }
  // 不是第一次打开程序，user已经备份
  
}
const reducer = (state=defaultState, action) => {
  // console.log(state)
  let newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case SETUSERINFO:
      newState.authorization = action.params.authorization
      newState.userInfo = {
        userName:action.params.name,
        userId:action.params.userid,
        id:action.params.id
      }
      break;
    case LOGOUT:
      newState.authorization = ''
      newState.userInfo = {}
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