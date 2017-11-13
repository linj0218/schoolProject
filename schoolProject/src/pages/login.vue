<template>
  <div id="body" v-cloak>
    <div class="bg"></div>
    <div class="form">
      <div class="form_title">
        <span class="logo"></span>
        <span>Welcome to LFS Portal</span>
      </div>
      <div class="form_cont">
        <input class="form-control" type="text" placeholder="User" v-model='userName'>
        <input class="form-control" type="password" placeholder="Password" v-model='passWord' @keyup.enter='login()'>
      </div>
      <div class="forget_pwd">
        <a href="javascripe:void(0);">Forget your Password?</a>
      </div>
      <div class="login_btn">
        <button type="button" class="btn btn-primary btn-block" @click='login()'>
          Log in
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      userName: '',
      passWord: ''
    }
  },
  methods: {
    login () {
      if (this.userName === '' || this.passWord === '') {
        return false;
      }
      let self = this
      // TODO 填入正确地址，参数
      let param = '{"userName": "' + this.userName + '","passWord": "' + this.passWord + '"}'
      // let obj = JSON.parse(param);
      this.$http.post('/loginCtl/user/login', {
        data: param
      }).then((res) => {
        if (!res.success) { // 登录失败
          alert('Login failed')
        } else {
          sessionStorage.setItem('userinfo', JSON.stringify(res.data))
          self.$router.push({ path: '/' })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  #body{height: 100%;background: #f5f5f5;overflow: auto;position: relative;}
  .bg{height: 100%;background: url('../images/login_bg.jpg') 0 0 / 100% auto no-repeat;}
  .form{
    position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 400px;height: 380px;background: #fff;
    .form_title{
      line-height: 150px;color: #2C66C2;font-size: 22px;text-align: center;
      .logo{display: inline-block;width: 63px;height: 95px;background: url('../images/logo_2.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;}
    }
    .form_cont{
      padding: 0 20px;
      .form-control{background: transparent;}
      .form-control:first-child{margin-bottom: 15px;}
    }
    .forget_pwd{padding: 10px 30px;text-align: right;}
    .login_btn{padding: 20px;}
  }
</style>