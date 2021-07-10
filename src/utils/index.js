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
  var date = new Date(dataParmas);
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
let objFun = {
  splitStr,GetUrlParam,formatTime,getEveryTime
}
export default objFun