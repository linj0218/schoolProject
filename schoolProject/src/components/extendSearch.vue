<template>
  <div class="extend_search">
    <div class="extendIcons">
      <template v-for="(sys, index) in data.sysList">
        <a class="iconfont" target="_blank" :href="sys.url" :class="sys.icon">
        </a><span class="line" v-if="index != data.sysList.length - 1"></span>
      </template>
    </div>
    <div class="extendIconsText">
      <template v-for="sys in data.sysList">
        <el-tooltip effect="dark" :content="sys.sys" placement="bottom">
          <span>{{sys.sys}}</span>
        </el-tooltip>
      </template>
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
          sysList: [ {icon: 'iconfont-QPDirectory', sys: 'QP Directory', url: 'http://auth.lfshanghai.com/files/Phone%20QP.pdf?'},
                     {icon: 'iconfont-PGDirectory', sys: 'PG Directory', url: 'http://auth.lfshanghai.com/files/Phone%20PG.pdf?c=pudong'},
                     {icon: 'iconfont-OneDrive', sys: 'OneDrive', url: 'https://lfs-my.sharepoint.cn/'},
                     // {icon: 'iconfont-Trombinoscope', sys: 'Trombinoscope', url: ''},
                     {icon: 'iconfont-E-mail', sys: 'E-mail', url: 'https://partner.outlook.cn'} ],
          searchText: ''
        }
      }
    },
    methods: {
      switchSearch (n) {
        // this.data.searchIcon = n;
      },
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
  .extendIcons{padding-left: 20px;}
  .extendIcons .iconfont{width: 46px;height: 46px;display: inline-block;background: #ccc;border-radius: 50%;font-size: 30px;text-align: center;line-height: 46px;cursor: pointer;color: #fff;vertical-align: middle;margin-top: -8px;text-decoration: none;}
  .extendIcons .iconfont-tongxunlu{background: #4E81BD;}
  .extendIcons .iconfont-QPDirectory{background: #4DB7BD;}
  .extendIcons .iconfont-PGDirectory{background: #65BD4D;}
  .extendIcons .iconfont-OneDrive{background: #BD9B4D;}
  .extendIcons .iconfont-Trombinoscope{background: #BD644D;}
  .extendIcons .iconfont-E-mail{background: #4D51BD;}
  .extendIcons .line{display: inline-block;width: 1.3px;height: 20px;background: #ccc;margin: 13px 20px;vertical-align: middle;margin-top: 0px;}
  // .extendIconsText{height: 10px;line-height: 10px;margin-top: 4px;}
  .extendIconsText span{display: inline-block;width: 87px;font-size: 12px;color: #666;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align: center;}
  .search_box{width: 360px;height: 46px;position: absolute;right: 0;top: 0;}
  .search_box .iconfont-fangdajing{position: absolute;width: 46px;height: 46px;font-size: 34px;color: #999;left: 10px;}
  .search_box .form-control{height: 100%;border-radius: 46px;padding-left: 56px;color: #999;}
</style>
