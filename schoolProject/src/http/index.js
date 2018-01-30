import axios from 'axios'
import qs from 'qs'
import {getSStorage} from '@/plugins/util'

// default
axios.defaults.timeout = 20000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// axios.defaults.baseURL = 'http://13.75.92.183:8121/HTMS_WeChat/'
axios.defaults.baseURL = 'http://116.228.73.106:8111/HTMS_WeChat/'
// axios.defaults.baseURL = 'http://192.168.8.120:8081/HTMS_WeChat/' // 周勇
// axios.defaults.baseURL = 'http://192.168.8.119:8080/HTMS_WeChat/' // 王俊

// request
axios.interceptors.request.use((config) => {
  // 只Event的保存、删除开启loading
  if (config.url.indexOf('editEvent') > -1) {
    document.getElementById('loading').className = 'on'
  }
  // console.log('request: ', config)
  if (config.method === 'post') {
    let param = null;
    if (config.data.data) {
      param = JSON.parse(config.data.data);
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
