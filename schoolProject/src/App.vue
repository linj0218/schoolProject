<template>
  <div id="app">
    <router-view/>
    <loading></loading>
  </div>
</template>

<script>
  // import $ from 'jquery/dist/jquery.min.js'
  import loading from '@/components/loading'
  import { browser, setSStorage, getCookie, setCookie } from '@/script/util'
  import { mapGetters } from 'vuex';
  export default{
    components: {
      loading
    },
    data () {
      return {
        data: {
          browserVersion: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo',
        lang: 'lang'
      })
    },
    created () {
      this.autoLogin().then(() => {
        this.$store.dispatch('getUserInfo');
        this.$store.dispatch('getLanguage');
        // 更新cookie
        setInterval(() => {
          this.updateCookie();
        }, 1000 * 60 * 60 * 1);
        window.onbeforeunload = (e) => {
          this.updateCookie();
        }
      })
    },
    mounted () {
      this.data.browserVersion = browser.versions.gecko ? 'gecko' : ''; // 火狐
      // console.log(browser);
      // console.log(navigator.userAgent);
      // console.log(window.screen.width);
      let timeoutflg = null
      let resetZoom = () => {
        var r = window.innerWidth / 1920
        if (this.data.browserVersion === 'gecko') {
          document.getElementsByTagName('html')[0].style.MozTransform = 'scale(' + (r < 0.7 ? 0.7 : r) + ')';
          document.getElementsByTagName('html')[0].style.height = window.innerHeight * (2 - (r < 0.7 ? 0.7 : r)) + 30 + 'px';
        } else if (browser.versions.mobile) {
          const zoom = window.screen.width * window.devicePixelRatio / 1920
          document.getElementsByTagName('html')[0].style.zoom = zoom;
          document.getElementsByTagName('html')[0].style.height = window.screen.height * window.devicePixelRatio / zoom + 'px';
        } else {
          document.getElementsByTagName('html')[0].style.zoom = r < 0.7 ? 0.7 : r;
        }
      }
      resetZoom()
      window.addEventListener('resize', function () {
        clearTimeout(timeoutflg)
        timeoutflg = setTimeout(resetZoom(), 300)
      })
    },
    methods: {
      autoLogin () {
        const username = getCookie('USERNAME');
        const password = getCookie('PASSWORD');
        if (!this.userInfo.id && username && password) {
          let params = {
            userName: username,
            passWord: password
          }
          return this.$http.post('/loginCtl/user/login', {
            data: params
          }).then((res) => {
            if (res.result === 'SUCCESS') {
              let resData = res.data;
              if (resData.permission_title === 'Admin') {
                resData.role = 0;
              } else if (resData.permission_title === 'Super User') {
                resData.role = 1;
              } else if (resData.permission_title === 'User') {
                resData.role = 2;
              }
              localStorage.setItem('USERNAME', username)
              setCookie('USERNAME', username, {expires: 1 / 8});
              setCookie('PASSWORD', password, {expires: 1 / 8});
              setSStorage('userinfo', resData);
              this.$store.dispatch('getUserInfo');
            }
            return res;
          })
        } else {
          return new Promise((resolve, reject) => {});
        }
      },
      updateCookie () {
        // console.log('update cookie', getCookie());
        const username = getCookie('USERNAME');
        const password = getCookie('PASSWORD');
        setCookie('USERNAME', username, {expires: 1 / 8});
        setCookie('PASSWORD', password, {expires: 1 / 8});
      }
    }
  }
</script>

<style>
</style>
