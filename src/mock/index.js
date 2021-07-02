const Mock = require('mockjs')
// 模拟文章列表的接口
Mock.mock('/api/artLists', {
  "code": 200,
  "msg": "success",
  "data|5-20": [
    {
      "id|+1": 1,
      "title": "@ctitle",
      "author": "@cname",
      "desc": "@cparagraph",
      "thumb": "@Image('100x100', '@color', '嘿嘿嘿')"
    }
  ]
})