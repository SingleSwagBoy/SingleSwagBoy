
<!-- cnpm i axios react-router-dom antd react-redux -S -->
<!-- cnpm i @craco/craco -D -->
<!-- cnpm i @babel/plugin-proposal-decorators -D -->


<!-- const path = require('path')
module.exports = {
  devServer: {
    port: 9527,
    open: true
  },
	babel: {
    plugins: [
      ["@babel/plugin-proposal-decorators", {legacy: true}]
    ]
  },
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src'),
      'pages': path.join(__dirname, 'src/pages'),
      'utils': path.join(__dirname, 'src/utils'),
      'components': path.join(__dirname, 'src/components'),
      'api': path.join(__dirname, 'src/api')
    }
  }
} -->

## 前后端分离开发中 前端 mock数据
+ 本地 mock  （拦截ajax请求  ajax其实并没有真的发出去）
```jsx
// mockjs
// 安装
npm i mockjs -D
// 使用
const Mock = require('mockjs')

Mock.mock('/api/artLists', {
  "code": 0,
  "msg": "success",
  "data|10-100": [  // data是一个数据 长度是10-100条
    {
      "a|10-100": 11,  // 修饰一个 number 范围是 10-100
      "id|+1": 1,   // 自增1
      "b|2-5": "☆",   // 随机产生 2-5个 ☆
      "name": "@cname",  
    }
  ]
})

// 量词  | 修饰某个 返回的字段 可以修饰的数据类型有：number、string、arr
// 预设 随机数 模板变量 是写在值里面的  "@模板变量"

```
+ 真实在线mock接口  （真的接口， 真的发送请求了，只不过数据是随机模拟出来的）
easymock
![rap2](http://rap2.taobao.org/)
在线的mock数据， 真的会发请求，只不过响应的数据需要自己写mockjs语法来模拟
http://rap2api.taobao.org/app/mock/275070
/api/v1/artList

## 常见富文本编辑器
uediter 百度 老
wangeditor
Tinymce
quill-editor

使用步骤：
1. 渲染富文本（提供容器dom）
2. 输入内容，获取输入的带格式的html内容
3. 渲染默认内容

## react中 费组件的 纯js文件中操作路由
使用history插件
```js
npm i history -S

// 使用 
import { createHashHistory / createBrowserHistory } from 'history'

const history = createHashHistory()

history.push()
history.replace()
history.go()
```

## 后台管理中的用户权限
- 适用于中小型项目（角色固定就那几个， 成本小）
所有路由由前端定死，前端通过路由元信息，标记当前路由可以访问的角色有哪些
用户在登录时返回当前用户的role(角色)，在用户访问路由之前，取当前用户的role和当前用户
所访问的路由的标记可访问角色 做判断，判断当前用户的角色是否在当前路由可访问的角色列表中
在 可以访问， 不在 重定向到没有权限的路由
- 适用于中大型项目（角色不固定，更灵活）
所有的路由表 存储在后端， 在页面上可以新增角色，角色可以选择不同的权限。用户在登录时后端判断不同的角色，根据登录的角色后端返回不同的路由表
前端拿到路由表之后，缓存起来，动态渲染路由

## react 中的路由懒加载
使用react 提供的lazy方法 以及 Syspense组件做路由懒加载
```jsx
// 使用前引入组件
import Home from 'page/Home'
// 改为
import {lazy, Suspense} from 'react'
const Home = lazy(()=>import('pages/Home'))

// 路由组件
<Suspense fallback={<div>xxxloading</div>}>
<Switch>
  <Route path="xxx" component={xxx}>
  <Route path="xxx" component={xxx}>
  <Route path="xxx" component={xxx}>
</Switch>
</Suspense>
```