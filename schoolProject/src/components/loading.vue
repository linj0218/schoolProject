<template>
  <div id="loading" :class='{"on": isShow}'>
    <div class="bg"></div>
    <div class="loading_main">
      <div class="icon animat"></div>
      <div class="text">Processing...</div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      show () {
        this.isShow = true
      },
      hide () {
        this.isShow = false
      }
    }
  }
</script>

<style lang='scss' scoped>
  #loading{
    position: fixed;left: 0;top: 0;width: 100%;height: 100%;display: none;z-index: 99999;
    .bg{background: rgba(0,0,0,0.2);height: 100%;}
    .loading_main{
      top: 50%;left: 50%;width: 200px;height: 200px;background: #fff;border-radius: 5px;transform: translate(-50%, -50%);padding: 30px 50px;position: absolute;
      .icon{width: 100px;height: 100px;background: url('../images/icon_loading.png') 0 0 / 100% 100% no-repeat;margin: auto;}
      .text{padding-top: 15px;text-align: center;}
    }
  }
  #loading.on{display: block;}
  #loading.on .animat{
    animation: animat 1s infinite linear;-webkit-animation: animat 1s infinite linear;
  }
  @keyframes animat{
    0%{transform: rotate(0deg)}
    100%{transform: rotate(360deg)}
  }
  @-webkit-keyframes animat{
    0%{-webkit-transform: rotate(0deg)}
    100%{-webkit-transform: rotate(360deg)}
  }
</style>