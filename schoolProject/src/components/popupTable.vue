<template>
  <div class="popup" :class='{"open": show}'>
    <!-- 弹窗背景 -->
    <div class="popup_bg" @click='() => {this.show = false;}'></div>
    <!-- 弹窗主体 -->
    <div class="popup_content">

      <!-- 弹窗标题 -->
      <div class="popup_header">
        {{title}}
        <span class="icon_close" @click='() => {this.show = false;}'></span>
      </div>

      <!-- 弹窗内容 -->
      <div class="popup_body">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      requied: false,
      default: ''
    }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  @import '../styles/components/popupTable';
</style>

