import axios from 'axios'
import qs from 'qs'

// default
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.baseURL = 'http://117.78.50.43:8080/HTMS_WeChat/'
// axios.defaults.baseURL = 'http://192.168.8.104:8081/HTMS_WeChat/'

// request
axios.interceptors.request.use((config) => {
  // console.log('请求参数：', config)
  if (config.method === 'post') {
    let param = JSON.parse(config.data.data)
    let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
    param.userId = userinfo.id
    config.data = {data: JSON.stringify(param)}
    config.data = qs.stringify(config.data)
  }
  return config
}, (err) => {
  console.log('传参错误')
  return Promise.reject(err)
})
// response
axios.interceptors.response.use((res) => {
  // console.log('接口返回：', res)
  if (res.status !== 200) {
    console.log('接口错误：', res.data.code)
    return Promise.reject(res);
  }
  return res.data
}, (err) => {
  console.log('网络异常')
  return Promise.reject(err)
})

export default axios
