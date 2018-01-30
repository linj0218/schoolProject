<template>
  <div class="popup" :class='{"showPopup": showPopup}'>
    <div class="popup_bg" @click='closePopup()'></div>
    <div class="popup_content">
      <div class="popup_header">
        <!-- Add participants -->
        <span class="icon_close" @click='closePopup()'></span>
      </div>
      <div class="popup_body">
        <div class="">

          <calendar :show-month-info='false'
                    :showABWeek='false'
                    :input-act-date-info='actDateInfo'
                    :select-model='"week"'
                    @syncDataFunc='syncDataFunc'>
          </calendar>

        </div>
      </div>
      <div class="popup_footer">
        <button type="button" class="btn btn-primary" @click='confirm()'>Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
  import calendar from '@/components/calendar'
  export default {
    props: {
      showPopup: {
        type: Boolean,
        required: true
      },
      inputValue: {
        type: String,
        required: false,
        default: ''
      }
    },
    components: {
      calendar
    },
    data () {
      return {
        isOpen: false,
        actDateInfo: null, // 目标日期
        actWeekInfo: null // 选中周
      }
    },
    created () {
      if (this.inputValue === '') {
        let date = new Date()
        this.actDateInfo = {
          thisYear: date.getFullYear(),
          thisMonth: date.getMonth() + 1,
          thisDate: date.getDate()
        }
      } else {
        var dateStrList = this.inputValue.split('-')
        this.actDateInfo = {
          thisYear: Number(dateStrList[0]),
          thisMonth: Number(dateStrList[1]),
          thisDate: Number(dateStrList[2])
        }
      }
    },
    methods: {
      closePopup () {
        this.$emit('closePopup')
      },
      syncDataFunc (calendarList, thisDateInfo, actDateInfo, actWeekInfo) {
        // console.log(calendarList, thisDateInfo, actDateInfo, actWeekInfo)
        this.actWeekInfo = actWeekInfo
        // this.isOpen = false
        this.$emit('dataChange', calendarList, thisDateInfo, actDateInfo)
      },
      confirm () {
        this.$emit('inputChange', this.actWeekInfo)
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
        .btn{width: 160px;}
      }
    }
  }
  .popup.showPopup{display: block;}
  // .header{z-index: 99;}
</style>
