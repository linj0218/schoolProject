<template>
  <div class="banner" :class='[{"on": showBanner}, {"isFixed": isFixed}]' v-cloak>
    {{inputValue}}
  </div>
</template>

<script>
  export default{
    props: {
      inputValue: {
        type: [Boolean, String],
        required: true
      },
      showBanner: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        isFixed: false
      }
    },
    watch: {
      showBanner () {
        if (this.showBanner) {
          setTimeout(() => {
            this.$emit('closeBanner')
          }, 2000)
        }
      }
    },
    mounted () {
      document.getElementById('body').addEventListener('scroll', () => {
        if (document.getElementById('body').scrollTop > 100) this.isFixed = true
        else this.isFixed = false
      });
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .banner{
    background: #48CFAD;color: #fff;font-size: 32px;text-align: center;position: absolute;width: 100%;top: 0;left: 0;height: 0;line-height: 68px;overflow: hidden;transition: all 0.2s;-webkit-transition:all 0.2s;
  }
  .banner.isFixed{position: fixed;top: 0;}
  .banner.on{height: 68px;}
</style>