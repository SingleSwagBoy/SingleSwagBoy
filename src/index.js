import React from 'react'
import { render } from 'react-dom'
import App from './App'
import 'antd/dist/antd.css'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import { Provider } from 'react-redux'
import store from './store'
String.prototype.replaceAll = function(targetStr, newStr) { //兼容360浏览器不兼容replaceAll的方法
  var sourceStr = this.valueOf()
  while (sourceStr.indexOf(targetStr) !== -1) {
    sourceStr = sourceStr.replace(targetStr, newStr)
  }
  return sourceStr
}
window.$store = store;
render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <App/>
       </Provider>
    </ConfigProvider>
  </HashRouter>
  ,document.querySelector('#root')
)