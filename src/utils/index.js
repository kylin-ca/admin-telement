import {
  Message
} from 'element-ui';
import md5 from 'js-md5'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    s
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export const succeed = (message) => {
  Message({
    showClose: true,
    message: message,
    type: 'success',
    duration: 3000,
    center: true
  });
}
export const failed = (message) => {
  Message({
    showClose: true,
    message: message,
    type: 'error',
    duration: 3000,
    center: true
  });
}
export const warning = (message) => {
  Message({
    showClose: true,
    message: message,
    type: 'warning',
    duration: 3000,
    center: true
  });
}
//将二进制字符串转换成Unicode字符串
export function binaryToStr(str) {
  var result = [];
  var list = str.split(" ");
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var asciiCode = parseInt(item, 2);
    var charValue = String.fromCharCode(asciiCode);
    result.push(charValue);
  }
  return result.join("");
}
export function getTimestamp() {
  return new Date().getTime();
}
export function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
/**
 * @description: 生成请求的签名
 * @param 
 * u:客户端ip
 * v：版本
 * t：时间戳
 * d：请求body
 */
export function getSignature(rid, time, data, key, method) {
  if (method === 'GET' || method === 'DELETE') {
    let obj = data;
    let objStr = '';
    if (data) {
      for (let i in obj) {
        objStr += `&${i}=${obj[i]}`
      }
      objStr = encodeURI(objStr.substr(1));
    } else {
      objStr = null
    }
    let str = `GET:${rid}-(TIME:${time}-DATA:${objStr}|SECRET:${key})=${method}`;
    let signature = md5(str).toUpperCase();
    return signature
  }
  let str = `GET:${rid}-(TIME:${time}-DATA:${JSON.stringify(data) ? JSON.stringify(data) : null}|SECRET:${key})=${method}`;
  console.log(str)
  let signature = md5(str).toUpperCase();
  return signature
}

export function pswEncryption(password) {
  return md5(password).toUpperCase();
}

export function formatDate(now) {
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}