// 配置信息
// 测试环境-116.228.73.106:8011
// 生产环境-portal.lfshanghai.cn (218.83.241.198:8111)
const configTest = 'http://116.228.73.106:8011';
const configProd = 'http://218.83.241.198:8111';
const configDev = 'http://116.228.73.106:8011';

// 根据环境修改API地址
let url = '';
if (process.env.PROJECT_BUILD_ENV === 'production') {
  url = configProd;

  // 正式环境使用frame转发，用这种方式给浏览器tab加上logo
  // var head = window.parent.document.getElementsByTagName('head')[0];
  // var linkTag = document.createElement('link');
  //
  // linkTag.setAttribute('rel', 'shortcut icon');
  // linkTag.setAttribute('type', 'image/x-icon');
  // linkTag.setAttribute('href', 'http://lfshanghai.cn:8111/static/images/favicon.ico');
  //
  // head.appendChild(linkTag);
} else if (process.env.PROJECT_BUILD_ENV === 'test') {
  url = configTest;
} else {
  url = configDev;
}
window.UEDITOR_HOME_URL = url;

const config = {
  'api_path': { // API地址
    'base_path': url + '/LFS_SharedCalendar/', // 基础接口地址
    'img_upload': url + '/LFS_SharedCalendar/fileCtl/app/imgUpload', // APP图片上传
    'user_img_upload': url + '/LFS_SharedCalendar/fileCtl/avatar/avatarUpload', // users图片上传
    'file_upload': url + '/LFS_SharedCalendar/fileCtl/file/fileUpload', // 文件上传
    'img_path': url + '', // 图片查看
    'fix_sync_path': url + '/adSynchronizeCtl/sys/toSynchronizeForFormal' // AD同步接口
  }
}

export default config;
