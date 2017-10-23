<template>
  <div class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
            :disabled="inputDisabled">
      {{inputName}}
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
      <li v-for='item in inputSelect' @click='chooseItem(item)' :class='{"isSelected": item.value == inputValue}'>
        <a href="javascript:void(0)">{{item.name}}</a>
      </li>
      <li class="li_add" v-if='inputAdd' @click='addItem()'>
        <a href="javascript:void(0)">
          <span class="icon_li_add"></span> New Item
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      inputDisabled: {
        type: Boolean,
        required: false,
        default: false
      },
      inputValue: {
        type: [Number, String],
        required: true
      },
      inputName: {
        type: String,
        required: true
      },
      inputSelect: {
        type: Array,
        required: true
      },
      inputAdd: {
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
  .dropdown-menu > .isSelected > a{color: #337ab7;}
  .dropdown-menu > li > a{height: 34px;line-height: 28px;}
  .dropdown-menu > li:nth-child(odd) > a{background: #f9f9f9;}
  .dropdown-menu .li_add a{
    color: #4E81BD;
    .icon_li_add{display: inline-block;width: 16px;height: 16px;background: url('../images/icon_li_add.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;margin-right: 5px;}
  }
  .btn-default{width: 100%;position: relative;text-align: left;}
  .caret{position: absolute;right: 15px;top: 50%;transform: translateY(-50%);}
  .open>.dropdown-menu{width: 100%;}
</style>
