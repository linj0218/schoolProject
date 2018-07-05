<template>
  <div class="crumbs">
    <template v-for='nav in data.crumbs'>
      <router-link class="nav" :class="nav.readonly ? 'readonly' : ''" :to="{ path: nav.path, query: nav.query }" tag='a'>
        <i class="icon_home" v-if='nav.isHome'></i>{{nav.name}}
      </router-link>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      // crumbs name
      name: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
        data: {
          crumbs: []
        }
      }
    },
    created () {
    },
    cumputed () {
    },
    mounted () {
      this.init();
    },
    watch: {
      name () {
        this.init();
      }
    },
    methods: {
      init () {
        if (this.$route.path === '/') {
          this.data.crumbs = [
            { name: this.$t('Home'), path: '/', query: {}, isHome: true }
          ]
        } else if (this.$route.path === '/homepage') {
          this.data.crumbs = [
            { name: this.$t('Home'), path: '/', query: {}, isHome: true },
            { name: this.$t('Calendar'), path: '/homepage', query: {year: this.$route.query.year, month: this.$route.query.month, date: this.$route.query.date, id: this.$route.query.id}, readonly: true }
          ]
        } else if (this.$route.path === '/memo') {
          this.data.crumbs = [
            { name: this.$t('Home'), path: '/', query: { memoside: false }, isHome: true },
            { name: this.name, path: '/', query: {} },
            { name: this.$t('Edit Memo'), path: '/memo', query: {memo_id: this.$route.query.memo_id}, readonly: true }
          ]
        } else if (this.$route.path === '/logs') {
          this.data.crumbs = [
            { name: this.$t('Home'), path: '/', query: {}, isHome: true },
            { name: this.$t('Logs'), path: '/logs', query: {}, readonly: true }
          ]
        } else if (this.$route.path === '/setting') {
          this.data.crumbs = [
            { name: this.$t('Home'), path: '/', query: {}, isHome: true },
            { name: this.$t('Configuration'), path: '/setting', query: {tabflg: this.$route.query.tabflg}, readonly: true }
          ]
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .crumbs{padding: 15px 0;height: 56px;position: relative;z-index: 2;background: #f5f5f5;}
  .crumbs:after{content: '';display: block;clear: both;}
  .nav{
    display: inline-block;min-width: 90px;height: 26px;line-height: 27px;background: #fff;font-size: 12px;color: #4E81BD;position: relative;float: left;margin-left: 18px;padding-left: 10px;
    .icon_home{display: inline-block;width: 15px;height: 14px;background: url('../images/icon_home.png') 0 0 / 100% 100% no-repeat;margin-right: 5px;}
  }
  .readonly{color: #999;text-decoration: none;cursor: default;}
  .nav:first-child{margin-left: 0;}
  .nav:after{content: '';position: absolute;right: -18px;top: 0;width: 18px;height: 26px;background: #fff url('../images/icon_crumbs_bg.png') 0 0 / 100% 100% no-repeat;}
  .nav:last-child:after{content: '';background: url('../images/icon_crumbs_bg.png') 0 0 / 100% 100% no-repeat;}
</style>
