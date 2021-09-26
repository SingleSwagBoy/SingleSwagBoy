/*
 * @Author: HuangQS
 * @Date: 2021-09-26 10:49:14
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-26 11:24:56
 * @Description: 时间相关工具类
 */
import moment from 'moment';

let timeUtils = {
    //获取当前时间
    parseTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
        // let date = new Date();
        // let format = 'YYYY-MM-DD, HH:mm:ss';
        return moment(time).format(format);
    }
};




export default timeUtils;


