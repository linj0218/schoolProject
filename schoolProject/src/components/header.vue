<template>
  <div class="header">
    <router-link :to='{path: "/"}' tag='div' class="logo"></router-link>
    <div class="title">{{ $t("LFS Applications Portal") }} {{envName}}</div>
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
  import {getShortName, removeSStorage, removeCookie} from '@/script/util'
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
        avatar: '',
        envName: ''
      }
    },
    computed: {
      ...mapGetters({
        lang: 'lang',
        autoLoginFinish: 'autoLoginFinish',
        userInfo: 'userInfo'
      })
    },
    mounted () {
      if (process.env.PROJECT_BUILD_ENV === 'test') this.envName = ' (test)'
      this.initUserInfo()
      this.initMenu()
    },
    watch: {
      autoLoginFinish () {
        if (this.autoLoginFinish) {
          this.initUserInfo();
        }
      }
    },
    methods: {
      // 初始化用户信息
      initUserInfo () {
        // let userInfo = getSStorage('userinfo');
        let userInfo = this.userInfo;
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
          this.$http.post('/loginCtl/user/loginOut', { }).then((res) => {
            if (res.result === 'SUCCESS') {
              removeSStorage('userinfo');
              removeCookie('USERNAME');
              removeCookie('PASSWORD');
              this.$router.push({ path: '/login' })
            } else {
              console.error('logout error');
            }
          })
        })
      }
    }
  }
</script>

<style lang='scss'>
  @import '../styles/mixin';
  @import '../styles/components/header';
</style>
