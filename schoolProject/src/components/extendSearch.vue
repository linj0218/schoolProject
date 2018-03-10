<template>
  <div class="extend_search">
    <div class="extendIcons">
      <i class="iconfont iconfont-tongxunlu on"></i>
      <!-- <span class="line"></span> -->
    </div>
    <div class="search_box">
      <i class="iconfont iconfont-fangdajing"></i>
      <input type="text" class="form-control" v-model='data.searchText' placeholder="Search" @keyup.enter='searchEvent()'>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: {
          searchText: ''
        }
      }
    },
    methods: {
      searchEvent () {
        if (this.data.searchText === '') return false;
        this.$router.push({ path: '/contacts', query: {searchText: this.data.searchText} })
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .extend_search{position: relative;height: 46px;margin-bottom: 20px;}
  .extendIcons .iconfont{width: 46px;height: 46px;display: inline-block;background: #ccc;border-radius: 50%;font-size: 30px;text-align: center;line-height: 46px;cursor: pointer;color: #fff;vertical-align: middle;}
  .extendIcons .iconfont.on{background: #4E81BD;}
  .extendIcons .line{display: inline-block;width: 1px;height: 20px;background: #ccc;margin: 13px 20px;vertical-align: middle;}
  .search_box{width: 360px;height: 46px;position: absolute;right: 0;top: 0;}
  .search_box .iconfont-fangdajing{position: absolute;width: 46px;height: 46px;font-size: 34px;color: #999;left: 10px;}
  .search_box .form-control{height: 100%;border-radius: 46px;padding-left: 56px;color: #999;}
</style>
