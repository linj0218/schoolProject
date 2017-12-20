<template>
  <div class="header">
    <router-link :to='{path: "/"}' tag='div' class="logo"></router-link>
    <div class="title">LFS Applications Portal</div>
    <div class="userInfo">
      <span>{{userName}}</span>
      <div class="icon head_portrait">
        {{shortName}}
        <ul class="drop_down">
          <div class="icon_other1"></div>
          <li @click='profileToggle()'><span class="icon1"></span>Profile</li>
          <li @click='appSettingToggle()' v-if='showAppSetting'><span class="icon2"></span>App Configuration</li>
          <li @click='configToggle()' v-if='showConfig'><span class="icon2"></span>Configuration</li>
          <li @click='logout()'><span class="icon3"></span>Log out</li>
        </ul>
      </div>
      <div class="icon language" :class="language">
        <ul class="drop_down">
          <div class="icon_other2"></div>
          <li class="english" :class="language=='english'?'act':''" @click="changeLanguage('english')"><i></i></span>English</li>
          <li class="french" :class="language=='french'?'act':''" @click="changeLanguage('french')"><i></i>French</li>
          <li class="china" :class="language=='china'?'act':''" @click="changeLanguage('china')"><i></i>简体中文</li>
        </ul>
      </div>
    </div>

    <alert ref='alert'></alert>

  </div>
</template>

<script>
  import alert from '@/components/alert'
  import {getShortName, getSStorage, removeSStorage} from '@/plugins/util'
  export default {
    components: {
      alert
    },
    props: {
    },
    data () {
      return {
        language: 'english',
        userName: '',
        userRole: 0, // 用户角色
        permission: '',
        shortName: '',
        showConfig: false,
        showAppSetting: false
      }
    },
    mounted () {
      this.initUserInfo()
      this.initMenu()
    },
    methods: {
      // 初始化用户信息
      initUserInfo () {
        let userInfo = getSStorage('userinfo');
        this.userName = userInfo.nom
        this.permission = userInfo.permission_title
        this.userRole = userInfo.role
        this.shortName = getShortName(userInfo.nom)
      },
      // 初始化头部菜单
      initMenu () {
        let pageName = this.$route.name
        if (pageName === 'homepage' && this.userRole === 0) {
          this.showConfig = true
        } else if (pageName === 'index' && this.userRole === 0) {
          this.showAppSetting = true
        }
      },
      changeLanguage (lang) {
        this.language = lang
      },
      profileToggle () {
        this.$emit('profileToggle', true)
        this.$emit('configToggle', false)
        this.$emit('appSettingToggle', false)
      },
      appSettingToggle () {
        this.$emit('appSettingToggle', true)
        this.$emit('profileToggle', false)
      },
      configToggle () {
        this.$emit('configToggle', true)
        this.$emit('profileToggle', false)
      },
      // 登出
      logout () {
        this.$refs.alert.showDialog('Confirm Log out?').then(() => {
          removeSStorage('userinfo')
          this.$router.push({ path: '/login' })
        })
      }
    }
  }
</script>

<style lang='scss'>
  @import '../styles/mixin';
  .header{
    height: 100px;background: #4E81BD;position: relative;z-index: 999;
    .logo{float: left;width: 180px;height: 100%;background: #fff;background: url('../images/logo.png') no-repeat 0 0 / 100% 100%;cursor: pointer;}
    .title{float: left;padding: 0 0 0 32px;font-size: 42px;line-height: 100px;color: #fff;}
    .userInfo{
      float: right;font-size: 24px;height: 100px;line-height: 100px;color: #fff;
      .icon1{background: url('../images/icon_1.png') 50% 50% / auto auto no-repeat;}
      .icon2{background: url('../images/icon_2.png') 50% 50% / auto auto no-repeat;}
      .icon3{background: url('../images/icon_3.png') 50% 50% / auto auto no-repeat;}
      .icon{display: inline-block;border-radius: 50%;background: #fff;vertical-align: middle;margin: 0 10px;position: relative;}
      .icon .drop_down{
        height: 0;overflow: hidden;width: 190px;margin-bottom: 0;font-size: 16px;position: absolute;
        .icon_other1{height: 22px;background: url('../images/icon_other3.png') 45% 100% / auto auto no-repeat;}
        .icon_other2{height: 28px;background: url('../images/icon_other3.png') 100% 100% / auto auto no-repeat;}
      }
      .icon .drop_down li{line-height: 48px;text-align: left;background: #fff;color: #333;border-left: 1px solid #eee;border-right: 1px solid #eee;}
      .icon .drop_down li:last-child{border-bottom: 1px solid #eee;}
      .icon .drop_down li:hover{background: #4E81BD;color: #fff;}
      .icon .drop_down li:hover .icon1{background: url('../images/icon_1_1.png') 50% 50% / auto auto no-repeat;}
      .icon .drop_down li:hover .icon2{background: url('../images/icon_2_2.png') 50% 50% / auto auto no-repeat;}
      .icon .drop_down li:hover .icon3{background: url('../images/icon_3_3.png') 50% 50% / auto auto no-repeat;}
      .icon .drop_down li.act{background: #4E81BD;color: #fff;}
      .icon .drop_down li span{color: #fff;margin: 0 10px;width: 20px;height: 20px;display: inline-block;vertical-align: middle;}
      .icon .drop_down li i{display: inline-block;margin: 0 10px;width: 23px;height: 17px;vertical-align: middle;}
      .icon .drop_down li.english i{background: url('../images/english.png') 0 0 / 100% 100% no-repeat;}
      .icon .drop_down li.french i{background: url('../images/french.png') 0 0 / 100% 100% no-repeat;}
      .icon .drop_down li.china i{background: url('../images/china.png') 0 0 / 100% 100% no-repeat;}
      .icon:hover{cursor: pointer;}
      .icon:hover .drop_down{height: 200px;transition:all 0.2s; -webkit-transition:all 0.2s;}
      .icon.head_portrait{width: 60px;height: 60px;color: #4E81BD;text-align: center;line-height: 60px;font-size: 28px;}
      .icon.head_portrait:hover .drop_down{left: -60px;top: 60px;}
      .icon.language{width: 50px;height: 50px;}
      .icon.language.english{background: #fff url('../images/english1.png') 0 0 / 100% 100% no-repeat;}
      .icon.language.french{background: #fff url('../images/french1.png') 0 0 / 100% 100% no-repeat;}
      .icon.language.china{background: #fff url('../images/china1.png') 0 0 / 100% 100% no-repeat;}
      .icon.language:hover .drop_down{right: 10px;top: 50px;}
    }
  }
</style>
