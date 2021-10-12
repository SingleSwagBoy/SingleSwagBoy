/*
 * @Author: HuangQS
 * @Date: 2021-09-26 10:49:14
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-29 18:16:33
 * @Description: 时间相关工具类
 */
import moment from 'moment';

let timeUtils = {
    //获取当前时间
    parseTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
        // let date = new Date();
        // let format = 'YYYY-MM-DD, HH:mm:ss';
        if (!time || time === 0) return '';
        return moment(time).format(format);
    }
};




export default timeUtils;


