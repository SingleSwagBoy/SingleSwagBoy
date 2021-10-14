/*
 * @Author: HuangQS
 * @Date: 2021-10-14 15:56:23
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-14 16:26:13
 * @Description: 存储管理  
 * 使用方式[直接引用]
 * import { loadStore, saveStore, clearStore } from "@/utils/StoreManage"
 */


export let loadStore = (key, value) => {
    let result = window.localStorage.getItem(key)
    if (result) return result;
    else if (value) return value;
    else return null;
}


export let saveStore = (key, value) => {
    window.localStorage.setItem(key, value)
}


export let clearStore = () => {

}


