<template>
  <div class="header">
    <router-link :to='{path: "/"}' tag='div' class="logo"></router-link>
    <div class="title">{{ $t("LFS Applications Portal") }}</div>
    <div class="userInfo">
      <span>{{userName}}</span>
      <div class="icon head_portrait">
        {{shortName}}
        <div class="logo_box">
          <img v-if="avatar" :src="avatar">
        </div>
        <ul class="drop_down">
          <div class="icon_other1"></div>
          <li @click='profileToggle()'><span class="icon1"></span>{{ $t("Profile") }}</li>
          <li @click='appSettingToggle()' v-if='showAppSetting'><span class="icon2"></span>{{ $t("Configuration") }}</li>
          <li @click='configToggle()' v-if='showConfig'><span class="icon2"></span>{{ $t("Configuration") }}</li>
          <li @click='logout()'><span class="icon3"></span>{{ $t("Log out") }}</li>
        </ul>
      </div>
      <div class="icon language" :class="lang">
        <ul class="drop_down">
          <div class="icon_other2"></div>
          <li class="english" :class="lang=='en-US'?'act':''" @click="changeLanguage('en-US')"><i></i></span>English</li>
          <li class="french" :class="lang=='fr-FR'?'act':''" @click="changeLanguage('fr-FR')"><i></i>French</li>
          <!-- <li class="china" :class="lang=='zh-CH'?'act':''" @click="changeLanguage('zh-CH')"><i></i>简体中文</li> -->
        </ul>
      </div>
    </div>

    <alert ref='alert'></alert>

  </div>
</template>

<script>
  import alert from '@/components/alert'
  import {getShortName, getSStorage, removeSStorage} from '@/script/util'
  import { mapGetters } from 'vuex';
  export default {
    components: {
      alert
    },
    props: {
    },
    data () {
      return {
        userName: '',
        userRole: 0, // 用户角色
        permission: '',
        shortName: '',
        showConfig: false,
        showAppSetting: false,
        avatar: ''
      }
    },
    computed: {
      ...mapGetters({
        lang: 'lang'
      })
    },
    mounted () {
      this.initUserInfo()
      this.initMenu()
    },
    methods: {
      // 初始化用户信息
      initUserInfo () {
        let userInfo = getSStorage('userinfo');
        // console.log(userInfo);
        this.userName = userInfo.nom
        this.permission = userInfo.permission_title
        this.userRole = userInfo.role;
        // 这接口写的
        this.avatar = !userInfo.avatar ? '' : (this.$config.api_path.img_path + '/avatar/' + userInfo.avatar);
        this.shortName = getShortName(userInfo.nom);
      },
      // 初始化头部菜单
      initMenu () {
        let pageName = this.$route.name
        if (pageName === 'homepage' && this.userRole === 0) {
          this.showConfig = true
        } else if ((pageName === 'index' || pageName === 'contacts') && this.userRole === 0) {
          this.showAppSetting = true
        }
      },
      changeLanguage (lang) {
        localStorage.setItem('LANGUAGE', lang);
        this.$store.dispatch('getLanguage');
        this.$i18n.locale = lang;
      },
      profileToggle () {
        this.$emit('profileToggle', true)
      },
      appSettingToggle () {
        this.$emit('profileToggle', false)
        this.$router.push({ path: '/setting', query: {tabflg: 0} });
      },
      configToggle () {
        this.$emit('profileToggle', false)
        this.$router.push({ path: '/setting', query: {tabflg: 1} });
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
        height: 0;overflow: hidden;width: 190px;margin-bottom: 0;font-size: 16px;position: absolute;transition:all 0.3s; -webkit-transition:all 0.3s;
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
      .icon:hover .drop_down{height: 200px;}
      .icon.head_portrait{width: 60px;height: 60px;color: #4E81BD;text-align: center;line-height: 60px;font-size: 28px;position: relative;}
      .icon.head_portrait .logo_box{width: 100%;height: 100%;position: absolute;top: 0;left: 0;z-index: 2;}
      .icon.head_portrait .logo_box img{width: 100%;height: 100%;float: left;}
      .icon.head_portrait .drop_down{left: -55px;top: 60px;}
      .icon.language{width: 50px;height: 50px;}
      .icon.language .drop_down{left: -145px;top: 50px;}
      .icon.language.en-US{background: #fff url('../images/english1.png') 0 0 / 100% 100% no-repeat;}
      .icon.language.fr-FR{background: #fff url('../images/french1.png') 0 0 / 100% 100% no-repeat;}
      .icon.language.zh-CH{background: #fff url('../images/china1.png') 0 0 / 100% 100% no-repeat;}
      .icon.language:hover .drop_down{right: 10px;top: 50px;}
    }
  }
</style>
