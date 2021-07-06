const splitStr = (str, n) => str.substr(0, n)+'...'


function GetUrlParam(paraName) {
  let url = document.location.toString();
  let arrObj = url.split("?");

  if (arrObj.length > 1) {
      let arrPara = arrObj[1].split("&");
      let arr;

      for (let i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split("=");

          if (arr != null && arr[0] == paraName) {
              return arr[1];
          }
      }
      return "";
  }
  else {
      return "";
  }
}
export {
  splitStr,
  GetUrlParam
}