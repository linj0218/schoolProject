import axios from 'axios';
import qs from 'qs';
import { getSStorage } from '@/script/util';
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
  // console.log('request: ', config)
  if (config.method === 'post') {
    let param = null;
    if (config.data.data) {
      param = typeof config.data.data === 'object' ? config.data.data : JSON.parse(config.data.data);
    } else {
      param = config.data;
    }
    if (config.url.indexOf('/login') === -1) {
      let userinfo = getSStorage('userinfo')
      if (userinfo !== null) {
        param.userId = userinfo.id
      }
    }
    config.data = qs.stringify({data: JSON.stringify(param)})
  }
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
  }
  return res.data
}, (err) => {
  document.getElementById('loading').className = ''
  console.log('网络异常')
  return Promise.reject(err)
})

export default axios
