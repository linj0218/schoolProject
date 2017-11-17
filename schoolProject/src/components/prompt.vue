<template>
  <div class="popup" :class='{"open": show}'>
    <div class="popup_bg" @click='cancel()'></div>
    <div class="popup_content">

      <div class="popup_header">
        <span class="icon_close" @click='cancel()'></span>
      </div>

      <div class="popup_body">
        <div>
          <input type="text" class="form-control" v-model='text' id='prompt_input'>
        </div>
      </div>

      <div class="popup_footer">
        <button type="button" class="btn btn-primary" @click='confirm()'>Confirm</button>
        <button type="button" class="btn cancel" @click='cancel()'>Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 组件使用：
   * 
   * <prompt ref='dialog'></prompt>
   * 
   * this.$refs.dialog.showDialog('some msg').then((res) => {
   *   // TODO callback
   *   this.$refs.dialog.show = false
   * })
   */
  export default {
    data () {
      return {
        text: '',
        show: false,
        resolve: null,
        reject: null,
        promise: null
      }
    },
    watch: {
      show () {
        if (this.show) {
          setTimeout(() => {
            document.getElementById('prompt_input').focus()
          })
        }
      }
    },
    methods: {
      showDialog (text) {
        this.text = text
        this.show = true
        this.promise = new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
        return this.promise
      },
      confirm () {
        this.resolve(this.text)
      },
      cancel () {
        this.show = false
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
  .popup.open{display: block;}
  // .header{z-index: 99;}
</style>