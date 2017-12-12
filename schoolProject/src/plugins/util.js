export const url = 'http://cc.test.shbaoyuantech.com/v_1_0'; // 测试

/*****************************************************
 * [集合、对象遍历函数]                                       *
 * @param  {[objects]} objects [传入需要遍历的list或者object] *
 * @param  {[function]} func    [遍历回调函数]             *
 *****************************************************/
export const forEach = (objects, func) => {
  if (objects === null || objects === undefined) return;
  if (typeof func !== 'function') return;
  var isObject = typeof (objects) === 'object';

  var i = 0;
  for (var item in objects) {
    var flag = func.apply(window, [(isObject ? item : i++), objects[item]]);
    if (flag === false) break;
  }
}

// 周
export const weekMap = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday', '0': 'Sunday'};

// 月
export const monthMap = {'1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'};

/************************************************************************************************
 * [格式化时间格式]                                                                                    *
 * @param  {[String]} targetTime [传入需要格式化的时间参数(需要4位年份，月份、日期不做规定)eg:yyyy-mm-dd yyyy/mm/dd]       *
 * @param  {[String]} format     [传入格式化模板eg:yyyy/mm/dd yy/mm/dd yyyy/m/d yyyy-mm-dd dd/mm/yyyy] *
 * @return {[String]} result     [返回格式化后的时间字符串]                                                 *
 ************************************************************************************************/
export const formatDate = (targetTime, format) => {
  let timeList = []
  if (targetTime.indexOf('/') > -1) {
    timeList = targetTime.split('/')
    if (timeList[0].length !== 4) {
      timeList = timeList.reverse()
    }
  } else if ((targetTime.indexOf('-') > -1)) {
    timeList = targetTime.split('-')
  }

  let formatNumber = (n) => {
    n = Number(n).toString()
    return n[1] ? n : '0' + n
  }

  let result = ''
  switch (format) {
    case 'yyyy-mm-dd':
      result = [timeList[0], timeList[1], timeList[2]].map(formatNumber).join('-')
      break;
    case 'yyyy-m-d':
      result = [timeList[0], timeList[1], timeList[2]].map((n) => { return Number(n) }).join('-')
      break;
    case 'yyyy/mm/dd':
      result = [timeList[0], timeList[1], timeList[2]].map(formatNumber).join('/')
      break;
    case 'dd/mm/yyyy':
      result = [timeList[2], timeList[1], timeList[0]].map(formatNumber).join('/')
      break;
    case 'dd/mm/yy':
      result = [timeList[2], timeList[1], timeList[0].substr(timeList[0].length - 2, 2)].map(formatNumber).join('/')
      break;
    case 'dd/mm':
      result = [timeList[2], timeList[1]].map(formatNumber).join('/')
      break;
    default:
      result = targetTime
      break;
  }

  return result
}

/****************************************
 * [获取日期对应当月第几周]                        *
 * @param  {[Number]} a [年份eg:2017]     *
 * @param  {[Number]} b [月份eg:9]        *
 * @param  {[Number]} c [日期eg:20]       *
 * @return {[Number]}   [返回日期对应第几周eg:4] *
 ****************************************/
export const getMonthWeek = (a, b, c) => {
  var date = new Date(a, parseInt(b) - 1, c);
  var w = date.getDay() ? date.getDay() : 7;
  var d = date.getDate();
  var str = Math.ceil((d + 6 - w) / 7) + (new Date(a, parseInt(b) - 1, 1).getDay() ? 0 : 1);
  return str;
}

/*****************************************
 * [获取日期对应当年第几周]                         *
 * @param  {[Number]} a [年份eg:2017]      *
 * @param  {[Number]} b [月份eg:9]         *
 * @param  {[Number]} c [日期eg:20]        *
 * @return {[Number]}   [返回日期对应第几周eg:39] *
 *****************************************/
export const getYearWeek = (a, b, c) => {
  var d1 = new Date(a, b - 1, c);
  var d2 = new Date(a, 0, 1);
  var d = Math.round((d1 - d2) / 86400000);
  return Math.ceil((d + (d2.getDay() === 0 ? 7 : d2.getDay())) / 7);
}

/*******************************************
 * 判断浏览器内核                                 *
 * 用法：if(browser.ios) console.log("ios终端") *
 *******************************************/
export const browser = {
  versions: (() => {
    let u = navigator.userAgent;
    // let app = navigator.appVersion;
    return { // 移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;) ? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/**************************************
 * [获取用户姓名首字母组合]                      *
 * @param  {[String]} str [用户姓名]      *
 * @return {[String]}     [用户名字首字母组合] *
 **************************************/
export const getShortName = (str) => {
  if (!str || typeof str !== 'string') return '-';
  let name = str.split(' ');
  let shortName = [name[0].substr(0, 1).toUpperCase(), name[1].substr(0, 1).toUpperCase()].join('')
  return shortName;
}

/*******************************************************
 * 设置sessionStorage缓存                                *
 * @param  {String}        key   缓存对象key             *
 * @param  {String/Object} value 缓存对象value           *
 * @return {Boolean}             是否保存成功 true/false  *
 *******************************************************/
export const setSStorage = function (key, value) {
  if (arguments.length !== 2) return false;
  let v = value;
  if (typeof v === 'object') {
    v = JSON.stringify(v);
    v = 'fr-obj-' + v;
  } else {
    v = 'fr-str-' + v;
  }
  let ss = sessionStorage;
  if (ss) {
    ss.setItem(key, v);
  } else { return false; }
  return true;
};

/*********************************************
 * 获取sessionStorage缓存                      *
 * @param  {String}        key   缓存对象key   *
 * @return {String/Object}       缓存对象value *
 *********************************************/
export const getSStorage = function (key) {
  let ss = sessionStorage;
  if (ss) {
    let v = ss.getItem(key);
    if (!v) { return false; }
    if (v.indexOf('fr-obj-') === 0) {
      v = v.slice(7);
      return JSON.parse(v);
    } else if (v.indexOf('fr-str-') === 0) {
      return v.slice(7);
    } else { return false; }
  } else { return false; }
};

/*******************************************
 * 删除sessionStorage缓存                      *
 * @param  {String} key  缓存对象key           *
 * @return {Boolean}     是否删除成功 true/false *
 *******************************************/
export const removeSStorage = function (key) {
  let ss = sessionStorage;
  if (ss && key) {
    ss.removeItem(key);
    return true;
  } else { return false; }
};

/***************************************
 * 清理sessionStorage缓存                  *
 * @return {Boolean} 是否清理成功 true/false *
 ***************************************/
export const clearSStorage = function () {
  let ss = sessionStorage;
  if (ss) {
    ss.clear();
    return true;
  } else { return false; }
}

export default {
}
