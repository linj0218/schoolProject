<template>
  <div id="app">
    <router-view/>
    <loading></loading>
  </div>
</template>

<script>
  // import $ from 'jquery/dist/jquery.min.js'
  import loading from '@/components/loading'
  import {browser} from '@/script/util'
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
        userInfo: 'userInfo'
      })
    },
    created () {
      this.$store.dispatch('getUserInfo');
    },
    mounted () {
      this.data.browserVersion = browser.versions.gecko ? 'gecko' : ''
      let timeoutflg = null
      let resetZoom = () => {
        var r = window.innerWidth / 1920
        document.getElementsByTagName('html')[0].style.zoom = r < 0.7 ? 0.7 : r;
        if (this.data.browserVersion === 'gecko') {
          document.getElementsByTagName('html')[0].style.MozTransform = 'scale(' + (r < 0.7 ? 0.7 : r) + ')';
          document.getElementsByTagName('html')[0].style.height = window.innerHeight * (2 - (r < 0.7 ? 0.7 : r)) + 30 + 'px';
        }
      }
      resetZoom()
      window.addEventListener('resize', function () {
        clearTimeout(timeoutflg)
        timeoutflg = setTimeout(resetZoom(), 300)
      })
    }
  }
</script>

<style>
</style>
