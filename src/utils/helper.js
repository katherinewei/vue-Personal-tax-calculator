// import qrImage from 'qr-image';
// import strings from "../assets/strings";

// 获取系统时间

// export function getSystemTime () {
//   if (nowTime) {
//     return timeString(new Date(nowTime).getTime() / 1000)
//   } else {
//     return timeString(new Date().getTime() / 1000)
//   }
// }

export function inSize (w, h, ...sizes) {
  if (sizes[0].indexOf(':') > -1) {
    const rate = sizes[0].split(':')
    return (w / h).toFixed(2) === (rate[0] / rate[1]).toFixed(2)
  }
  return sizes.indexOf(`${w}x${h}`) > -1
}

// 时间不能大于当前时间
export function validator (value) {
  var myDate = new Date()
  var now = myDate.valueOf()
  var time = new Date(value * 1000).valueOf()
  if (now > time) {
    return true
  } else {
    return false
  }
}
/**
 *  将文本转成二维码
 * @param text
 * @returns {string}
 */
// export function getQRImage(text) {
//   if (text == null) {
//     return '';
//   }
//   let pngBuffer = qrImage.imageSync(text, {
//     type: 'png',
//     margin: 1
//   });
//   return 'data:image/png;base64,' + pngBuffer.toString('base64');
// }

/**
 **文本格式
 **/
// export function getString(template, ...pattern) {
//   let result = strings.getString(template)
//   if (pattern.length == 0) {
//     return result;
//   }
//   return result.replace(/{(\d+)}/g, (match, number) => pattern[number] !== undefined ? pattern[number] : match)
// }

/**
 * 时间格式化
 * @param time
 */
export function timeString (time) {
  // console.log(time);
  let date = new Date(time * 1000)
  // console.log(date.Format('yyyy-MM-dd h:m:s'));
  // return date.toLocaleString('zh-CN', {hour12: false})
  return date.Format('yyyy-MM-dd hh:mm:ss')
}

export function timeStringFormat (time, format) {
  // console.log(new Date(time).getTime())
  let date = new Date(time * 1000)
  return date.Format(format)
}

/**
 * 日期字符串转成时间戳
 * @param  {[type]} expire [description]
 * @return {[type]}        [description]
 */
export function dateToTime (expire) {
  let year = expire.substr(0, 2)
  let math = expire.substr(2, 2)
  let day = expire.substr(4, 2)
  year = '20' + year
  math = math | 0
  day = day | 0
  const d = new Date(year + '/' + math + '/' + day)
  const eDate = d.getTime() + 24 * 60 * 60 * 1000
  return eDate
}

/**
 *  日期字符串转成xx月 xx日
 *
 * @param  {[type]} expire [description]
 * @return {[type]}        [description]
 */
export function dateToText (expire) {
  let e = expire.expire
  let math = e.substr(2, 2)
  let day = e.substr(4, 2)
  math = math | 0
  day = day | 0

  return math + '月' + day + '日'
}

export function getPrice (price) {
  if (price === undefined) {
    return 0.00
  }
  return (parseFloat(price) / 100).toFixed(2)
}
/**
 * 替换url ${0}为id
 */
export function getReplUrl (url, id) {
  var str = url
  return str.replace('{0}', id)
}

/**
 * initWeiXinConfig
 */
export function initWeiXinConfig () {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera
  if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1) {
    // window.load();
  }
}

/**
 * 时间格式
 */
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds()             // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}

/***
 **验证提示
 ***/
export function validatorTip (text) {
  const tip = document.getElementById('validator_tips')
  if (tip) {
    return
  }
  const div = document.createElement('div')
  div.innerHTML = text
  div.id = 'validator_tips'
  div.setAttribute('class', 'validator_tips')
  document.getElementById('endings-content').appendChild(div)
  setTimeout(function () {
    div.setAttribute('class', 'validator_tips hide')
  }, 1300)
  setTimeout(function () {
    document.getElementById('endings-content').removeChild(div)
  }, 1800)
}

export function IsPC () {
  let userAgentInfo = navigator.userAgent
  let Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod']
  let isTrue = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      isTrue = false
      break
    }
  }
  return isTrue
}

/***
 ** 特定机台
 ***/

export function specifiedMachine () {
  const specifiedMachine = sessionStorage.getItem('specifiedMachine')
  const flag = specifiedMachine && specifiedMachine === 'true'
  return flag
}
