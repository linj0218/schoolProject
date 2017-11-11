<template>
  <div class="dropdown" :class='{"opening": isOpen}'>
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
            :disabled="isDisabled"
            @blur='buttonBlur()'
            @click='openDropdown()'>
      <span class="icon icon_calendar" v-show='showIcon'></span>{{inputValue}}
    </button>
    <div class="dropdown-menu-box" aria-labelledby="dropdownMenu" tabindex="1" @focus='dropdownFocus()' @blur='dropdownBlur()'>
      <calendar :showMonthInfo='false'
                :showABWeek='false'
                :inputActDateInfo='actDateInfo'
                @buttonFocus='buttonFocus'
                @buttonBlur='buttonBlur'
                @syncDataFunc='syncDataFunc'>
      </calendar>
    </div>
  </div>
</template>

<script>
  import calendar from '@/components/calendar'
  export default {
    props: {
      isDisabled: {
        type: Boolean,
        required: false,
        default: false
      },
      inputValue: {
        type: String,
        required: true
      },
      showIcon: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    components: {
      calendar
    },
    data () {
      return {
        isFocus: true,
        isOpen: false,
        actDateInfo: null // 目标日期
      }
    },
    created () {
      let dateStrList = []
      if (this.inputValue.indexOf('-') > -1) {
        dateStrList = this.inputValue.split('-')
      } else if (this.inputValue.indexOf('/') > -1) {
        dateStrList = this.inputValue.split('/').reverse()
      } else {
        console.error('日期格式错误')
      }
      this.actDateInfo = {
        thisYear: Number(dateStrList[0]),
        thisMonth: Number(dateStrList[1]),
        thisDate: Number(dateStrList[2])
      }
    },
    mounted () {
    },
    methods: {
      openDropdown () {
        this.isOpen = !this.isOpen
      },
      syncDataFunc (calendarList, thisDateInfo, actDateInfo) {
        // console.log(calendarList, thisDateInfo, actDateInfo)
        this.isOpen = false
        this.$emit('dataChange', calendarList, thisDateInfo, actDateInfo)
      },
      dropdownFocus () {
        this.isFocus = true
      },
      dropdownBlur () {
        this.isFocus = false
        this.checkFocus()
      },
      checkFocus () {
        setTimeout(() => {
          if (!this.isFocus) {
            this.isOpen = false
            // console.log(this.isFocus, 'if')
          }
        }, 0)
      },
      buttonFocus () {
        this.isFocus = true
      },
      buttonBlur () {
        this.isFocus = false
        this.checkFocus()
      }
    }
  }
</script>

<style lang='scss'>
  .btn .icon_calendar{width: 20px;height: 22px;background: url('../images/icon_calendar.png') 0 0 / 100% 100% no-repeat;display: inline-block;vertical-align: middle;margin-right: 10px;}
  .dropdown-menu-box{outline: none;}
  .dropdown-menu > .isSelected > a{color: #337ab7;}
  .dropdown.opening .dropdown-menu-box{display: block;}
  .dropdown-menu-box{position: absolute;width: 100%;top: 100%;left: 0;z-index: 1000;display: none;float: left;min-width: 160px;padding: 5px 0;margin: 2px 0 0;font-size: 14px;text-align: left;list-style: none;background-color: #fff;-webkit-background-clip: padding-box;background-clip: padding-box;border: 1px solid #ccc;border: 1px solid rgba(0,0,0,.15);border-radius: 4px;-webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);box-shadow: 0 6px 12px rgba(0,0,0,.175);min-width: 340px;}
  .btn-default{width: 100%;position: relative;text-align: left;}
  .open>.dropdown-menu{width: 100%;}
</style>
