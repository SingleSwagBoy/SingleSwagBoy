/*
 * @Author: HuangQS
 * @Date: 2021-09-16 14:07:35
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-13 22:07:30
 * @Description: 自定义组件列表,无论组件内部叫什么名字 在此处尽量改名为以My为开头的名称，区别于ant组件库 以及网络其他组件
 */

export { default as MyTagTypes } from './tags/tag-types';                           //用户标签-投放类型 组合控件
export { default as MySyncBtn } from './syncBtn/syncBtn';                           //同步按钮 根据type类型不同 触发不同的【数据同步】
export { default as MyImageUpload } from './ImageUpload/index';                     //图片上传按钮
export { default as MyTimeInterval } from './timeInterval/time-interval';           //时间段选择器
export { default as MyAddress } from "./address/index"                              //地域组件
export { default as MyMarketChannel } from "./market/index"                         //渠道组件[尹正超] 需要单独配置 但不依赖Form组件
export { default as MyChannel } from "./cannel/index"                               //渠道组件[黄秋实] 不用单独配置 但必须要在外层包裹Form组件 示例：[停服下线通知配置|offineConfig.jsx]








