<template>
  <div id="body" v-cloak>
    <div class="bg"></div>
    <div class="form">
      <div class="form_title">
        <span class="logo"></span>
        <span class="sys_name" style="margin-top: 28px;">Portail Intranet du</span>
        <span class="sys_name">Lycée Français de Shanghai</span>
      </div>
      <div class="form_cont">
        <input tabindex="1" id='user' class="form-control" type="text" :placeholder="$t('Enter your email address')" v-model='userName'>
        <input tabindex="2" id='pwd' class="form-control" type="password" :placeholder="$t('Password')" v-model='passWord' @keyup.enter='login()'>
      </div>
      <div class="error_info" :style='{visibility: errorText !== "" ? "visible" : "hidden"}'>
        <span>
          <span class="icon"></span> {{errorText}}
        </span>
      </div>
      <!-- <div class="forget_pwd">
        <a href="javascripe:void(0);">Forget your Password?</a>
      </div> -->
      <div class="login_btn">
        <button type="button" class="btn btn-primary btn-block" @click='login()'>
          {{$t("Log in")}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {setSStorage, setCookie} from '@/script/util'
// import md5 from 'js-md5';

export default {
  components: {
  },
  data () {
    return {
      userName: '',
      passWord: '',
      errorType: ['Login timeout', 'Account or password is incorrect'],
      errorText: ''
    }
  },
  mounted () {
    // william.trang@lyceeshanghai.com
    // kan.chen@lyceeshanghai.com
    let cacheUserName = localStorage.getItem('USERNAME')
    if (cacheUserName) {
      this.userName = cacheUserName
      document.getElementById('pwd').focus()
    } else {
      document.getElementById('user').focus()
    }
  },
  methods: {
    login () {
      if (this.userName === '' || this.passWord === '') return false;

      let self = this;
      // this.passWord = md5(this.passWord)

      let params = {
        userName: this.userName,
        passWord: this.passWord
      }
      this.$http.post('/loginCtl/user/login', {
        data: JSON.stringify(params)
      }).then((res) => {
        if (res.result === 'SUCCESS') {
          let resData = res.data;
          resData.token = res.token;
          if (resData.permission_title === 'Admin') {
            resData.role = 0;
          } else if (resData.permission_title === 'Super User') {
            resData.role = 1;
          } else if (resData.permission_title === 'User') {
            resData.role = 2;
          }
          localStorage.setItem('USERNAME', this.userName)
          setCookie('USERNAME', this.userName, {expires: 1 / 8});
          setCookie('PASSWORD', this.passWord, {expires: 1 / 8});
          setSStorage('userinfo', resData);
          this.$store.dispatch('getUserInfo');
          self.$router.push({ path: '/' })
        } else {
          this.errorText = this.errorType[1]
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  #body{height: 100%;background: #f5f5f5;overflow: auto;position: relative;}
  .bg{height: 100%;background-image: url('../images/login_bg.jpg');background-repeat: no-repeat;background-size: cover;background-position: center;}
  .form{
    position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);min-width: 400px;height: 380px;background: #fff;
    .form_title{
      color: #4F81BE;font-size: 18px;text-align: center;padding: 25px 20px 30px 20px;
      .logo{float: left;width: 63px;height: 95px;background: url('../images/logo_2.png') 0 0 / 100% 100% no-repeat;margin: 0 15px 0 20px;}
      .sys_name{display: block;overflow: hidden;text-align: left;}
    }
    .form_title:after{content: '';clear: both;display: block;}
    .form_cont{
      padding: 0 20px;
      .form-control{background: transparent;height: 38px;}
      .form-control:first-child{margin-bottom: 15px;}
    }
    .error_info{
      padding: 5px 20px 0 20px;color: #f00;
      .icon{display: inline-block;width: 16px;height: 16px;background: url('../images/icon_error.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;}
    }
    .forget_pwd{padding: 10px 30px;text-align: right;}
    .login_btn{padding: 20px;}
  }
</style>
