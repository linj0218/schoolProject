<template>
  <div class="popup" :class='{"showPopup": showPopup}'>
    <div class="popup_bg" @click='closePopup()'></div>
    <div class="popup_content">
      <div class="popup_header">
        <span class="icon_close" @click='closePopup()'></span>
      </div>
      <div class="popup_body">
        <div class="" style="text-align: center;font-size: 16px;">
          {{inputValue}}
        </div>
      </div>
      <div class="popup_footer">
        <button type="button" class="btn btn-primary" @click='confirm()'>Confirm</button>
        <button type="button" class="btn cancel" @click='closePopup()'>Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      showPopup: {
        type: Boolean,
        required: true
      },
      // 提示内容
      inputValue: {
        type: String,
        required: true
      },
      // 回调函数
      inputMethod: {
        type: [Function, String],
        required: true
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    watch: {
    },
    methods: {
      closePopup () {
        this.$emit('closePopup')
      },
      confirm () {
        if (typeof this.inputMethod !== 'function') {
          console.log('组件错误，请传入回调函数')
        } else {
          (this.inputMethod)()
        }

        this.closePopup()
      }
    }
  }
</script>

<style lang='scss' scoped>
  .popup{
    position: fixed;z-index: 999;width: 100%;height: 100%;top: 0;left: 0;display: none;
    .popup_bg{background: rgba(0,0,0,0.2);z-index: -1;height: 100%;}
    .popup_content{
      width: 420px;background: #fff;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);border-radius: 4px;
      .popup_header{
        font-size: 30px;color: #fff;text-align: center;background: #4E81BD;line-height: 68px;height: 68px;position: relative;
        .icon_close{position: absolute;width: 36px;height: 36px;background: url('../images/icon_close.png') 0 0 / 100% 100% no-repeat;right: 30px;top: 16px;cursor: pointer;}
      }
      .popup_body{
        padding: 30px 35px 26px;
      }
      .popup_footer{
        text-align: center;padding: 20px;
        .btn{width: 160px;height: 40px;margin: 0 10px;}
        .btn.cancel{background: #ccc;color: #fff;}
      }
    }
  }
  .popup.showPopup{display: block;}
</style>