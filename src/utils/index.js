const splitStr = (str, n) => str.substr(0, n)+'...'


function GetUrlParam(paraName) {
  let url = document.location.toString();
  let arrObj = url.split("?");

  if (arrObj.length > 1) {
      let arrPara = arrObj[1].split("&");
      let arr;

      for (let i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split("=");

          if (arr != null && arr[0] === paraName) {
              return arr[1];
          }
      }
      return "";
  }
  else {
      return "";
  }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时间转换
function formatTime(dataParmas,type,needSec){
  let types = type ? type : '-'
  var date = new Date(String(dataParmas).length===10?dataParmas*1000:dataParmas);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if(needSec === 1){
      return [year, month, day].map(formatNumber).join(types) +" "+ [hour, minute,second].map(formatNumber).join(':')
  }else if(needSec === 2){
      return [month, day].map(formatNumber).join(types) +" "+ [hour, minute].map(formatNumber).join(':')
  }else if(needSec === 3){
      return [year, month, day].map(formatNumber).join(types)
  }else if(needSec === 4){
    return formatNumber(year)+"年"+formatNumber(month)+"月"+formatNumber(day)+"日"
  }else if(needSec === 5){
    return formatNumber(year)+"年"+formatNumber(month)+"月"+formatNumber(day)+"日"+  [hour, minute].map(formatNumber).join(':')
  }else if(needSec === 6){
    let time = Math.floor((new Date() - dataParmas)/1000/60/60)
    if(time<1){
      if(Math.floor((new Date() - dataParmas)/1000/60) == 0){
        return "1分钟前"
      }else{
        return Math.floor((new Date() - dataParmas)/1000/60)+"分钟前"
      }
    }else if(time<=24){
      return Math.floor((new Date() - dataParmas)/1000/60/60)+"小时前"
    }else if(time<48){
      if(new Date().getFullYear() == day + 1){
        return `昨天 ${[hour, minute].map(formatNumber).join(':')}`
      }else{
        return `${month}月${formatNumber(day)}日 ${[hour, minute].map(formatNumber).join(':')}`
      }
    }else if(time>=48){
      if(new Date().getFullYear() == year){
        return `${month}月${formatNumber(day)}日 ${[hour, minute].map(formatNumber).join(':')}`
      }else{
        return formatNumber(year)+"年"+formatNumber(month)+"月"+formatNumber(day)+"日"+  [hour, minute].map(formatNumber).join(':')
      }
    }    
  }else if(needSec === 7){
    return [hour, minute].map(formatNumber).join(':')
  }else if(needSec === 8){
    return formatNumber(year)+formatNumber(month)+formatNumber(day)
  }else{
      return [year, month, day].map(formatNumber).join(types) +" "+ [hour, minute].map(formatNumber).join(':')
  }

  // return [year, month, day].map(formatNumber).join('-')
}
//获取7天之内的日期
function getEveryTime(dataParmas,len){
  var today = dataParmas?new Date(dataParmas):new Date();
  var targetday_milliseconds=today.getTime() + 1000*60*60*24*len;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = formatNumber(tMonth + 1);
  tDate = formatNumber(tDate);
  return tYear+"-"+tMonth+"-"+tDate;
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}



export function formatDateTwo(timeStamp, format = 'Y-M-D H:I:S', auto=true) {
  let time = (timeStamp + '').length === 10 ? new Date(parseInt(timeStamp) * 1000) : new Date(parseInt(timeStamp));
  let _year = time.getFullYear();
  let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
  let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
  let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  let formatTime = '';
  let distinctTime = new Date().getTime() - time.getTime();

  if (auto) {
      if (distinctTime <= (1 * 60 * 1000)) {
          // console.log('一分钟以内，以秒数计算');
          let _s = Math.floor((distinctTime / 1000) % 60);
          formatTime = _s + '秒前';
      } else if (distinctTime <= (1 * 3600 * 1000)) {
          // console.log('一小时以内,以分钟计算');
          let _m = Math.floor((distinctTime / (60 * 1000)) % 60);
          formatTime = _m + '分钟前';
      } else if (distinctTime <= (24 * 3600 * 1000)) {
          // console.log('一天以内，以小时计算');
          let _h = Math.floor((distinctTime / (60 * 60 * 1000)) % 24);
          formatTime = _h + '小时前';
      } else if (distinctTime <= (30 * 24 * 3600 * 1000)) {
          let _d = Math.floor((distinctTime / (24 * 60 * 60 * 1000)) % 30);
          formatTime = _d + '天前';
          // console.log('30天以内,以天数计算');
      } else {
          // 30天以外只显示年月日
          formatTime = _year + '-' + _month + '-' + _date;
      }
  } else {

      switch (format) {
          case 'Y-M-D H:I:S':
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
              break;
          case 'Y-M-D H:I:S zh':
              formatTime = _year + '年' + _month + '月' + _date + '日  ' + _hours + ':' + _minutes + ':' + _secconds;
              break;
          case 'Y-M-D H:I':
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
              break;
          case 'M-D H:I':
              formatTime = _month + '-' + _date + ' ' + _hours + ':' + _minutes;
              break;
          case 'Y-M-D H':
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours;
              break;
          case 'Y-M-D':
              formatTime = _year + '-' + _month + '-' + _date;
              break;
          case 'Y-M-D zh':
              formatTime = _year + '年' + _month + '月' + _date + '日';
              break;
          case 'Y-M':
              formatTime = _year + '-' + _month;
              break;
          case 'Y':
              formatTime = _year;
              break;
          case 'M':
              formatTime = _month;
              break;
          case 'D':
              formatTime = _date;
              break;
          case 'H':
              formatTime = _hours;
              break;
          case 'I':
              formatTime = _minutes;
              break;
          case 'S':
              formatTime = _secconds;
              break;
          default:
              formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
              break;
      }
  }  // 返回格式化的日期字符串
  return formatTime;
}
function getPositionForTextArea(ctrl){
  // 获取光标位置
  let CaretPos = {
    start: 0,
    end: 0
  };
  if (ctrl.selectionStart) {// Firefox support
    CaretPos.start = ctrl.selectionStart;
  }
  if (ctrl.selectionEnd) {
    CaretPos.end = ctrl.selectionEnd;
  }
  return (CaretPos);
}
function setCursorPosition(ctrl, pos){
  ctrl.focus();
  ctrl.setSelectionRange(pos, pos);
}
function operator(){ //运算符号
  let operator=[
    {"value": 1, "name": "="},
    {"value": 2, "name": "!="},
    {"value": 3, "name": ">"},
    {"value": 4, "name": ">="},
    {"value": 5, "name": "<"},
    {"value": 6, "name": "<="},
    {"value": 7, "name": "in"},
  ]
  return operator
} 
/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** yzc 
*/
 
function randomWord(randomFlag, min, max){
  var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if(randomFlag){
      range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
      let pos = Math.round(Math.random() * (arr.length-1));
      str += arr[pos];
  }
  return str;
}
let objFun = {
  splitStr,GetUrlParam,formatTime,getEveryTime,getBase64,formatDateTwo,getPositionForTextArea,setCursorPosition,operator,randomWord
}

export default objFun