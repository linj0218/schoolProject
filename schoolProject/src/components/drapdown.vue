<template>
  <div class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
            :class='[{"circle": inputColorType=="circle"}, {"background": inputColorType=="background"}, {"noInput": inputRequired}]'
            :disabled='inputDisabled'>
      <span class="button_bg" :class='inputColorType=="background" && inputColor' :title="inputName">
        {{inputName}}
      </span>
      <span v-show='inputColorType=="circle"' class="icon_circle" :class='inputColor'></span>
      <span class="caret"></span>
    </button>
    <button type="button" v-if='inputAdd' @click='addItem()' class="li_add"></button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
      <li v-for='item in inputSelect'
          :class='{"isSelected": item.value == inputValue}'
          @click='chooseItem(item)'>
        <a href="javascript:void(0)" :class='[{"background": inputColorType=="background"}, inputColorType=="background" && item.color]'>
           <el-tooltip class="item" effect="dark" :content="item.name" placement="left">
             <span>{{item.name}}</span>
           </el-tooltip>
         <!-- {{item.name}} -->
         <span class="li_icon_circle" v-show='inputColorType=="circle"' :class='inputColorType=="circle" && item.color'></span>
        </a>
      </li>
      <!-- <li class="li_add" v-if='inputAdd' @click='addItem()'>
        <a href="javascript:void(0)">
          <span class="icon_li_add"></span> {{inputItemText}}
        </a>
      </li> -->
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
        type: [Number, String],
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
      inputColorType: {
        type: String,
        required: false,
        default: ''
      },
      // 颜色色值
      inputColor: {
        type: String,
        required: false,
        default: ''
      },
      inputRequired: {
        type: Boolean,
        required: false,
        default: false
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
  .dropdown{position: relative;}
  .dropdown-menu > .isSelected > a{color: #337ab7;}
  .dropdown-menu a.background {color: #fff !important;}
  .dropdown-menu > li > a{height: 34px;line-height: 28px;position: relative;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 12px;}
  .dropdown-menu li:nth-child(odd) a{background: #f9f9f9;}
  .li_add{position: absolute;width: 32px;height: 32px;background: url('../images/icon_li_add.png') 0 0 / 100% 100% no-repeat;right: -45px;top: 0;border: 0;}
  .btn-default{
    width: 100%;position: relative;text-align: left;height: 34px;padding: 4px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    .button_bg{display: block;margin-right: 35px;padding-left: 8px;height: 24px;line-height: 24px;border-radius: 2px;}
  }
  .btn-default.background .button_bg{color: #fff;}
  .caret{position: absolute;right: 15px;top: 50%;transform: translateY(-50%);}
  .icon_circle{position: absolute;width: 22px;height: 22px;right: 35px;top: 50%;transform: translateY(-50%);border-radius: 50%;display: none;}
  .circle .icon_circle{display: inline-block;}
  .li_icon_circle{position: absolute;width: 22px;height: 22px;right: 15px;top: 50%;transform: translateY(-50%);border-radius: 50%;}
  .open > .dropdown-menu{width: 100%;overflow-y: auto;max-height: 300px;overflow-x: hidden;}
  .open > .dropdown-menu::-webkit-scrollbar {width: 5px;height: auto;}
  .open > .dropdown-menu::-webkit-scrollbar-thumb {background: #bbb;border-radius: 5px;}
  .open > .dropdown-menu::-webkit-scrollbar-track-piece {background-color: #fff;}
  .btn.btn-default.dropdown-toggle.noInput{border: 1px solid #f56c6c;}
</style>
