/**
 * 为页面加载基本样式和设置页面基本字体
 */
/* eslint-disable */
// !function(){var a="@charset \"utf-8\";html{color:#000;background:#fff;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}",b=document.createElement("style");if(document.getElementsByTagName("head")[0].appendChild(b),b.styleSheet)b.styleSheet.disabled||(b.styleSheet.cssText=a);else try{b.innerHTML=a}catch(c){b.innerText=a}}();!function(a,b){function c(){var b=f.getBoundingClientRect().width;b/i>540&&(b=540*i);var c=b/10;f.style.fontSize=c+"px",k.rem=a.rem=c}var d,e=a.document,f=e.documentElement,g=e.querySelector('meta[name="viewport"]'),h=e.querySelector('meta[name="flexible"]'),i=0,j=0,k=b.flexible||(b.flexible={});if(g){console.warn("将根据已有的meta标签来设置缩放比例");var l=g.getAttribute("content").match(/initial\-scale=([\d\.]+)/);l&&(j=parseFloat(l[1]),i=parseInt(1/j))}else if(h){var m=h.getAttribute("content");if(m){var n=m.match(/initial\-dpr=([\d\.]+)/),o=m.match(/maximum\-dpr=([\d\.]+)/);n&&(i=parseFloat(n[1]),j=parseFloat((1/i).toFixed(2))),o&&(i=parseFloat(o[1]),j=parseFloat((1/i).toFixed(2)))}}if(!i&&!j){var p=(a.navigator.appVersion.match(/android/gi),a.navigator.appVersion.match(/iphone/gi)),q=a.devicePixelRatio;i=p?q>=3&&(!i||i>=3)?3:q>=2&&(!i||i>=2)?2:1:1,j=1/i}if(f.setAttribute("data-dpr",i),!g)if(g=e.createElement("meta"),g.setAttribute("name","viewport"),g.setAttribute("content","initial-scale="+j+", maximum-scale="+j+", minimum-scale="+j+", user-scalable=no"),f.firstElementChild)f.firstElementChild.appendChild(g);else{var r=e.createElement("div");r.appendChild(g),e.write(r.innerHTML)}a.addEventListener("resize",function(){clearTimeout(d),d=setTimeout(c,300)},!1),a.addEventListener("pageshow",function(a){a.persisted&&(clearTimeout(d),d=setTimeout(c,300))},!1),"complete"===e.readyState?e.body.style.fontSize=12*i+"px":e.addEventListener("DOMContentLoaded",function(){e.body.style.fontSize=12*i+"px"},!1),c(),k.dpr=a.dpr=i,k.refreshRem=c,k.rem2px=function(a){var b=parseFloat(a)*this.rem;return"string"==typeof a&&a.match(/rem$/)&&(b+="px"),b},k.px2rem=function(a){var b=parseFloat(a)/this.rem;return"string"==typeof a&&a.match(/px$/)&&(b+="rem"),b}}(window,window.lib||(window.lib={}));
/* eslint-enable */

export const url = 'http://cc.test.shbaoyuantech.com/v_1_0'; // 测试

/**
 * [集合、对象遍历函数]
 * @param  {[objects]} objects [传入需要遍历的list或者object]
 * @param  {[function]} func    [遍历回调函数]
 */
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

/**
 * [获取日期对应当月第几周]
 * @param  {[Number]} a [年份eg:2017]
 * @param  {[Number]} b [月份eg:9]
 * @param  {[Number]} c [日期eg:20]
 * @return {[Number]}   [返回日期对应第几周eg:4]
 */
export const getMonthWeek = (a, b, c) => {
  var date = new Date(a, parseInt(b) - 1, c);
  var w = date.getDay() ? date.getDay() : 7;
  var d = date.getDate();
  var str = Math.ceil((d + 6 - w) / 7) + (new Date(a, parseInt(b) - 1, 1).getDay() ? 0 : 1);
  return str;
}

/**
 * [获取日期对应当年第几周]
 * @param  {[Number]} a [年份eg:2017]
 * @param  {[Number]} b [月份eg:9]
 * @param  {[Number]} c [日期eg:20]
 * @return {[Number]}   [返回日期对应第几周eg:39]
 */
export const getYearWeek = (a, b, c) => {
  var d1 = new Date(a, b - 1, c);
  var d2 = new Date(a, 0, 1);
  var d = Math.round((d1 - d2) / 86400000);
  return Math.ceil((d + (d2.getDay() === 0 ? 7 : d2.getDay())) / 7);
}

export default {
}
