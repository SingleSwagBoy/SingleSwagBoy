/*
 * @Author: HuangQS
 * @Date: 2017-09-01 10:13:24
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-08-23 15:43:14
 * @Description: 
 *      成功：  then()中解决问题
 *              集合类型返回     {data, pages} 
 *              对象类型返回     {data}
 *      失败：  catch()中解决问题 默认弹出message消息
 *              返回状态码      {statu_code, error_code}
 */

import axios from 'axios'
import { message } from 'antd'
import { createHashHistory } from 'history'
let history = createHashHistory()
let isTestMode = true;

let request = axios.create({
    // baseURL: "",
    // baseURL: "http://test.cms.tvplus.club",
    timeout: 10000,
})

// request拦截器
request.interceptors.request.use(config => {
    let url = config.url;
    let method = config.method;
    showConsole(`>>>> 请求 请求地址:${url}`);
    showConsole(`---> 请求 请求类型:[${method}]`);

    //Get
    if (method === 'get') {
        showConsole(`---> 请求 请求参数:${config.params ? JSON.stringify(config.params) : '{}'}`);
    }
    //Post
    else if (method === 'post') {
        showConsole(`---> 请求 请求参数:${config.data ? JSON.stringify(config.data) : '{}'}`);
    }

    let user = localStorage.getItem('user')
    if (user) {
        if (JSON.parse(user).authorization) {
            config.headers.authorization = JSON.parse(user).authorization
        }
    }

    return config;
}, function (error) {
    // hide();
    return Promise.reject(error);
});
// response拦截器
request.interceptors.response.use(response => {

    let config = response.config;
    let status = response.status;   //200成功的请求
    let data = response.data;
    let code = data.code;
    let err_code = data.errCode;

    showConsole(`<<<< 获取 请求地址：${config.url.replace(process.env.BASE_API, '')}`);
    showConsole(`<--- 获取 请求类型：[${config.method}]`);
    showConsole(`<--- 获取 返回状态：${status} 接口状态${err_code}`);
    if (code === 401 || code === 403) {
        // token 没传或过期 弹出全局提醒
        message.error(data.msg, 2, () => {
            // 重定向到登录页
            history.push('/login')
            history.go(0)
        })
        return;
    }
    //请求成功
    else if (status === 200) {
        let result = {};

        //集合
        if (data.data) {
            if (data.data.constructor === Array) {
                result.data = data.data;
                result.page = {
                    currentPage: data.currentPage,
                    totalCount: data.totalCount,
                    pageSize: data.pageSize,
                };
            }
            //其他类型
            else {
                result.data = data.data;
            }
        }
        //错误的返回？ 空数据？
        else {
            result.data = data;
        }

        showConsole(`<--- 获取 返回数据：`);
        showConsole(result)
        showConsole(`----------------------------`);
        return result;
    }
    return onFailCallback(status, err_code, data.msg);
}, function (error) {
    return Promise.reject(-1, 0, '接口发生错误,网络、参数、都可能触发');
});

//错误的集中处理
function onFailCallback(statu_code, error_code, desc) {
    let fail = {
        statu_code: statu_code,
        error_code: error_code,
    };

    message.error(desc);
    return Promise.reject(fail);
}


//日志展示
function showConsole(desc) {
    if (isTestMode) console.log(desc);
}


export default request
