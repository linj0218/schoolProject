<template>
  <div class="crumbs">
    <template v-for='nav in data.crumbs'>
      <router-link class="nav" :to="{ path: nav.path }" tag='a'><i class="icon_home" v-if='nav.isHome'></i>{{ $t(nav.name) }}</router-link>
    </template>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: {}
      }
    },
    created () {
      if (this.$route.path === '/') {
        this.data.crumbs = [
          { name: 'Home', path: '/', isHome: true }
        ]
      } else if (this.$route.path === '/homepage') {
        this.data.crumbs = [
          { name: 'Home', path: '/', isHome: true }, { name: 'Calendar', path: '/homepage' }
        ]
      }
    },
    methods: {
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .crumbs{padding: 15px 0;}
  .crumbs:after{content: '';display: block;clear: both;}
  .nav{
    display: inline-block;width: 90px;height: 26px;line-height: 27px;background: #fff;font-size: 12px;color: #4E81BD;position: relative;float: left;margin-left: 18px;padding-left: 10px;
    .icon_home{display: inline-block;width: 15px;height: 14px;background: url('../images/icon_home.png') 0 0 / 100% 100% no-repeat;margin-right: 5px;}
  }
  .nav:first-child{margin-left: 0;}
  .nav:after{content: '';position: absolute;right: -18px;top: 0;width: 18px;height: 26px;background: #fff url('../images/icon_crumbs_bg.png') 0 0 / 100% 100% no-repeat;}
  .nav:last-child:after{content: '';background: url('../images/icon_crumbs_bg.png') 0 0 / 100% 100% no-repeat;}
</style>
