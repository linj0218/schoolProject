import axios from 'axios'
import qs from 'qs'

// default
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.baseURL = 'http://218.83.241.198:8001'
// request
axios.interceptors.request.use((config) => {
  console.log('请求参数：', config)
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (err) => {
  console.log('传参错误')
  return Promise.reject(err)
})
// response
axios.interceptors.response.use((res) => {
  console.log('接口返回：', res)
  if (res.data.code !== '200') {
    console.log('接口错误：', res.data.code)
    return Promise.reject(res);
  }
  return res
}, (err) => {
  console.log('网络异常')
  return Promise.reject(err)
})

export default axios
