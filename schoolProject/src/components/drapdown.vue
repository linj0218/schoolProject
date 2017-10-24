<template>
  <div class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
            :class='[{"circle": inputBgType=="circle"}, {"background": inputBgType=="background"}]'
            :disabled='inputDisabled'>
      <span class="button_bg" :class='inputBgType=="background" && inputBgColor'>
        {{inputName}}
      </span>
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
      <li v-for='item in inputSelect'
          :class='{"isSelected": item.value == inputValue}'
          @click='chooseItem(item)'>
        <a href="javascript:void(0)" :class='[{"background": inputBgType=="background"}, inputBgType=="background" && item.color]'>{{item.name}}</a>
      </li>
      <li class="li_add" v-if='inputAdd' @click='addItem()'>
        <a href="javascript:void(0)">
          <span class="icon_li_add"></span> {{inputItemText}}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      // 是否禁用
      inputDisabled: {
        type: Boolean,
        required: false,
        default: false
      },
      // 下拉按钮选中值
      inputValue: {
        type: [Number, String],
        required: true
      },
      // 下拉按钮选中文字
      inputName: {
        type: String,
        required: true
      },
      // 数据源
      inputSelect: {
        type: Array,
        required: true
      },
      // 是否显示新增列选项
      inputAdd: {
        type: Boolean,
        required: false,
        default: false
      },
      // 新增选项文字描述
      inputItemText: {
        type: String,
        required: false,
        default: 'New Item'
      },
      // 下拉按钮颜色类型
      inputBgType: {
        type: String,
        required: false,
        default: ''
      },
      // 颜色色值
      inputBgColor: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      chooseItem (item) {
        this.$emit('inputChange', item)
      },
      addItem () {
        this.$emit('addItem')
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .dropdown-menu > .isSelected > a{color: #337ab7;}
  .dropdown-menu a.background {color: #fff !important;}
  .dropdown-menu > li > a{height: 34px;line-height: 28px;}
  .dropdown-menu li:nth-child(odd) a{background: #f9f9f9;}
  .dropdown-menu .li_add a{
    color: #4E81BD;
    .icon_li_add{display: inline-block;width: 16px;height: 16px;background: url('../images/icon_li_add.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;margin-right: 5px;}
  }
  .btn-default{
    width: 100%;position: relative;text-align: left;height: 34px;padding: 4px;
    .button_bg{display: block;margin-right: 35px;padding-left: 8px;height: 24px;line-height: 24px;border-radius: 2px;}
  }
  .btn-default.background .button_bg{color: #fff;}
  .caret{position: absolute;right: 15px;top: 50%;transform: translateY(-50%);}
  .opening>.dropdown-menu{width: 100%;}
</style>
