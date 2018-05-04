// 配置信息
// 测试环境-116.228.73.106:8111
// 生产环境-portal.lfshanghai.cn (116.228.73.106:80)
const configTest = 'http://218.83.241.198:8111';
const configProd = 'http://218.83.241.198:8111';
const configDev = 'http://218.83.241.198:8111';

// 根据环境修改API地址
let url = '';
if (process.env.PROJECT_BUILD_ENV === 'production') {
  url = configProd;
} else if (process.env.PROJECT_BUILD_ENV === 'test') {
  url = configTest;
} else {
  url = configDev;
}

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
