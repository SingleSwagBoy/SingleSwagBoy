/*
 * @Author: HuangQS
 * @Date: 2021-09-02 10:48:36
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-02 10:57:49
 * @Description: 创建@映射src 例如：引入控件可使用 @/views/imageUpload/img.js
 * https://blog.csdn.net/bobringtheboys/article/details/104504639/
 */


let { override, addWebpackAlias } = request('customize-cra');
let { resolve } = require('path');
module.exports = override(
    addWebpackAlias({
        '@': resolve('src'),
    })
)