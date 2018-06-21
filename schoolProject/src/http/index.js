import axios from 'axios';
import qs from 'qs';
import { getSStorage, getSignByMd5 } from '@/script/util';
import config from '@/script/config';

// default
axios.defaults.timeout = 120000; // 超时时间
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.baseURL = config.api_path.base_path;

// request
axios.interceptors.request.use((config) => {
  // 只Event的保存、删除开启loading
  if (config.url.indexOf('editEvent') > -1 || config.url.indexOf('toSynchronize') > -1) {
    document.getElementById('loading').className = 'on'
  }
  // console.log('request: ', config);
  if (config.method === 'post') {
    let param = null;
    if (config.data.data) {
      param = typeof config.data.data === 'object' ? config.data.data : JSON.parse(config.data.data);
    } else {
      param = config.data;
    }
    let userinfo = getSStorage('userinfo');
    if (config.url.indexOf('/login') === -1 || config.url.indexOf('/loginOut') !== -1) {
      param.userId = !userinfo ? 0 : userinfo.id;
      param.lang = localStorage.getItem('LANGUAGE') || 'en-US'; // 多语言
    }
    param.token = !userinfo ? 0 : userinfo.token;

    // 签名
    const str = 'portal.lfshanghai.cn';
    const strBeforeSign = config.baseURL + config.url.substr(1) + '?' + JSON.stringify(param) + str;

    config.data = qs.stringify({data: JSON.stringify(param), sign: getSignByMd5(strBeforeSign)})
  }

  // 手动同步，正式环境调用测试环境的固定接口，我也是醉了
  // if (config.url.indexOf('toSynchronize') > -1 && process.env.PROJECT_BUILD_ENV === 'production') {
  //   config.url = config.fix_sync_path;
  // }
  return config
}, (err) => {
  console.log('传参错误')
  return Promise.reject(err)
})
// response
axios.interceptors.response.use((res) => {
  document.getElementById('loading').className = ''
  // console.log('response: ', res)
  if (res.status !== 200) {
    console.log('接口错误：', res.data.code)
    return Promise.reject(res);
  } else if (res.data.msg === 'Token expired') { // token过期
    setTimeout(() => {
      window.location.replace('/#/login');
    }, 1000)
    return Promise.reject(res);
  }
  return res.data
}, (err) => {
  document.getElementById('loading').className = ''
  console.log('网络异常');
  return Promise.reject(err)
})

export default axios
