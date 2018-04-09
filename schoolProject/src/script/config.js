// 配置信息
const url = 'http://116.228.73.106:8111'; // 测试环境-116.228.73.106:8111 生产环境-116.228.73.106:8111 周勇-192.168.8.125:8081
const config = {
  'api_path': { // API地址
    'base_path': url + '/HTMS_WeChat/', // 基础接口地址
    'img_upload': url + '/HTMS_WeChat/fileCtl/app/imgUpload', // APP图片上传
    'user_img_upload': url + '/HTMS_WeChat/fileCtl/avatar/avatarUpload', // users图片上传
    'file_upload': url + '/HTMS_WeChat/fileCtl/file/fileUpload', // 文件上传
    'img_path': url + '' // 图片查看
  }
}

export default config;
