/*
 * @Author: HuangQS
 * @Date: 2017-09-01 10:13:24
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-16 10:53:05
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
import Loading from '../components/loading/loading.jsx';

let history = createHashHistory()
let isTestMode = true;

let request = axios.create({
    // baseURL: "http://test.cms.tvplus.club",
    timeout: 8000,
})

// request拦截器
request.interceptors.request.use(config => {
    let url = config.url;
    let method = config.method;
    showConsole(`>>>> 请求 接口地址:${url}`);
    showConsole(`---> 请求 接口类型:[${method}]`);

    if (url) {
        //数据同步 缓存清理的接口 不显示loading框
        let check = url.indexOf('/mms/sync/') > -1;
        if (!check) {
            Loading.showLoading();
        }
    }

    //Get
    if (method === 'get') {
        showConsole(`---> 请求 接口参数:`);
        showConsole(`${config.params ? JSON.stringify(config.params) : '{}'}`);
    }
    //Post
    else if (method === 'post') {
        showConsole(`---> 请求 接口参数:`);
        showConsole(`${config.data ? JSON.stringify(config.data) : '{}'}`);
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
    Loading.hideLoading();
    return Promise.reject(error);
});
// response拦截器
request.interceptors.response.use(response => {

    let config = response.config;
    let status = response.status;   //200成功的请求
    let data = response.data;
    let code = data.code;
    let err_code = data.errCode;

    showConsole(`<<<< 获取 接口地址：${config.url.replace(process.env.BASE_API, '')}`);
    showConsole(`<--- 获取 接口类型：[${config.method}]`);
    showConsole(`<--- 获取 返回状态：${status} 接口状态：${err_code}`);
    if (code === 401 || code === 403) {
        // token 没传或过期 弹出全局提醒
        message.error(data.msg, 2, () => {
            // 重定向到登录页
            history.push('/login')
            history.go(0)
        })
        Loading.hideLoading();
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
            //比如同步数据接口 仅返回{errCode : 0}
            if (err_code === 0) {
                //如果存在页码 返回的数据规范为空集合类型
                if (data.currentPage || data.pageSize) {
                    data.data = [];
                } else {
                    data.data = {};
                }

                result.data = data.data;
            }
            //出错了
            else {
                let msg = data.msg;
                if (!msg) msg = `数据返回错误 code:[${err_code}]`;
                return onFailCallback(status, err_code, msg);
            }
        }

        showConsole(`<--- 获取 返回数据：`);
        showConsole(result)
        showConsole(`----------------------------`);
        Loading.hideLoading();
        return result;
    }
    //其他错误
    else {
        message.error('请求失败 状态码：' + status)
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
    Loading.hideLoading();
    return Promise.reject(fail);
}


//日志展示
function showConsole(desc) {
    if (isTestMode) console.log(desc);
}



export default request
