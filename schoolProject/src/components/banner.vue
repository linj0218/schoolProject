<template>
  <div class="banner" :class='[{"on": open}, {"isFixed": isFixed}]' v-cloak>
    {{text}}
  </div>
</template>

<script>
  export default{
    data () {
      return {
        isFixed: false,
        open: false,
        text: ''
      }
    },
    mounted () {
      document.getElementById('body').addEventListener('scroll', () => {
        if (document.getElementById('body').scrollTop > 100) this.isFixed = true
        else this.isFixed = false
      });
    },
    methods: {
      show (text) {
        this.text = text || 'Successed'
        this.open = true
        setTimeout(() => {
          this.open = false
        }, 2000)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .banner{
    background: #48CFAD;color: #fff;font-size: 32px;text-align: center;position: absolute;width: 100%;top: 0;left: 0;height: 0;line-height: 68px;overflow: hidden;transition: all 0.2s;-webkit-transition:all 0.2s;z-index: 999;
  }
  .banner.isFixed{position: fixed;top: 0;}
  .banner.on{height: 68px;}
</style>