import axios from 'axios'
import { message } from 'antd'
import { createHashHistory } from 'history'
const history = createHashHistory()

const request = axios.create({
  // baseURL: "",
  // baseURL: "http://test.cms.tvplus.club",
  timeout: 8000
})

let hide = null;
// 请求拦截
request.interceptors.request.use(function (config) {
  // 请求头中添加token
  // hide = message.loading('加载中...', 0);
  const user = localStorage.getItem('user')
  if(JSON.parse(user).authorization) {
    config.headers.authorization = JSON.parse(user).authorization
  }
  // hide()
  return config;
}, function (error) {
  // hide();
  return Promise.reject(error);
});
// 响应拦截
request.interceptors.response.use(function (res) {
  // hide()
  // 判断token是否过期，或者是不是没有传token  token 没有传 code：401   过期 code：403
  if(res.data.code === 401 || res.data.code === 403) {
    // token 没传或过期 弹出全局提醒
    message.error(res.data.msg, 2, ()=>{
      // 重定向到登录页
      history.push('/login')
      history.go(0)
    })

  }
  return res;
}, function (error) {
  // hide();
  return Promise.reject(error);
});

export default request
