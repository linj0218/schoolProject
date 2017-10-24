<template>
  <div class="configuration" :class='{"act": showProfile}'>
    <div class="config_bg" @click='closeProfile()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeProfile()'></span>Configuration
      </div>
      <div class="content">
        
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    showProfile: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    closeProfile () {
      this.$emit('closeProfile')
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .configuration{
    position: absolute;top: 0;right: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;
    .config_bg{position: absolute;width: 100%;height: 100%;background: rgba(0,0,0,0.2);z-index: -1;}
    .config_body{
      width: 0;transition:all 0.2s; -webkit-transition:all 0.2s;
      .icon_btn_add{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;background: url('../images/icon_btn_add.png') 50% 50% / auto auto no-repeat;}
      .title{
        height: 80px;border-bottom: 1px solid #eee;font-size: 30px;color: #4E81BD;padding: 20px 0;
        .icon_back{width: 40px;height: 40px;margin: 0 30px;float: left;background: url('../images/icon_back.png') 0 0 / 100% 100% no-repeat;display: inline-block;cursor: pointer;}
      }
      .content{
        padding: 0 30px;
      }
    }
  }
  .configuration.act{
    z-index: 99;
    .config_body{width: 800px;height: 100%;background: #fff;float: right;}
  }
</style>