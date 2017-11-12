<template>
  <div class="popup" :class='{"showPopup": showPopup}'>
    <div class="popup_bg" @click='closePopup()'></div>
    <div class="popup_content">
      <div class="popup_header">
        <!-- Add participants -->
        <span class="icon_close" @click='closePopup()'></span>
      </div>
      <div class="popup_body">
        <div class="input_box">
          <input type="text" class="form-control" v-model='text'>
        </div>
      </div>
      <div class="popup_footer">
        <button type="button" class="btn btn-primary" @click='confirm()'>Confirm</button>
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
      inputMethod: {
        type: [Function, String],
        required: true
      },
      inputValue: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
        text: '',
        callback: ''
      }
    },
    watch: {
      showPopup () {
        if (this.showPopup) {
          this.text = this.inputValue
          this.callback = this.inputMethod
        }
      }
    },
    mounted () {
    },
    methods: {
      confirm () {
        (this.callback)(this.text)

        this.$emit('closePopup')
      },
      closePopup () {
        this.$emit('closePopup')
      }
    }
  }
</script>

<style lang='scss' scoped>
  .popup{
    position: fixed;z-index: 999;width: 100%;height: 100%;top: 0;left: 0;display: none;
    .popup_bg{background: rgba(0,0,0,0.2);z-index: -1;height: 100%;}
    .popup_content{
      width: 500px;background: #fff;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);border-radius: 4px;
      .popup_header{
        font-size: 30px;color: #fff;text-align: center;background: #4E81BD;line-height: 68px;height: 68px;position: relative;
        .icon_close{position: absolute;width: 36px;height: 36px;background: url('../images/icon_close.png') 0 0 / 100% 100% no-repeat;right: 30px;top: 16px;cursor: pointer;}
      }
      .popup_body{
        padding: 30px 60px 26px;
        input{background: #f5f5f5;}
      }
      .popup_footer{
        text-align: center;padding: 20px;
        .btn{width: 160px;}
      }
    }
  }
  .popup.showPopup{display: block;}
  // .header{z-index: 99;}
</style>