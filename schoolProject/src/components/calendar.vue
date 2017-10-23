<template>
  <div class="month_cal">
    <div class="month_nav">
      <button @click='changeActMonth("last_month")'></button>
      {{actDateInfo.thisMonth | monthName}} {{actDateInfo.thisYear}}
      <button @click='changeActMonth("next_month")'></button>
    </div>
    <div class="month_body">
      <div class="month_table clearfix">
        <div class="table_left" v-if='showABWeek'>
          <div></div>
          <div v-for='(item, index) in calendarList'><div>{{index%2==0?"A":"B"}}</div></div>
        </div>
        <div class="table_right">
          <div class="li li_head">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            <div v-if='selectModel==="week"'></div>
          </div>
          <div class="li li_cont" v-for='(li, index) in calendarList'
               :class='[{"week": selectModel==="week"}, {"act": actWeek===index}]'
               @click='changeActWeek(index, selectModel)'>
            <div v-for='day in li'
                :class="[day.monthInfo,
                        {'this_day': thisDateInfo.thisMonth==actDateInfo.thisMonth&&day.day==thisDateInfo.thisDate},
                        {'act': day.monthInfo=='this_month'&&day.day==actDateInfo.thisDate}]"
                @click='changeActDate(day, selectModel)'>
              <div>{{day.day}}</div>
            </div>
            <div class="icon_check" v-if='selectModel==="week"'></div>
          </div>
        </div>
      </div>
    </div>
    <div class="month_info" v-if='showMonthInfo'>
        Week: {{getYearWeek()}}
        <span :class='getMonthWeek()'></span>
    </div>
  </div>
</template>

<script>
  import {monthMap, getMonthWeek, getYearWeek} from '@/plugins/util'
  export default {
    props: {
      showMonthInfo: {
        type: Boolean,
        required: false,
        default: true
      },
      showABWeek: {
        type: Boolean,
        required: false,
        default: true
      },
      inputActDateInfo: {
        type: Object,
        required: true
      },
      selectModel: {
        type: String,
        required: false,
        default: 'date'
      }
    },
    data () {
      return {
        calendarList: [ // 日历数组
        ],
        thisDateInfo: { // 今日
          thisYear: new Date().getFullYear(),
          thisMonth: new Date().getMonth() + 1,
          thisDate: new Date().getDate()
        },
        actDateInfo: null, // 目标日期
        actWeek: -1 // 选中周
      }
    },
    created () {
      this.actDateInfo = this.inputActDateInfo
      this.createCalendar()
    },
    methods: {
      // 构建日历
      createCalendar () {
        let thisYear = this.actDateInfo.thisYear
        let thisMonth = this.actDateInfo.thisMonth
        let thisMonthFirstDate = new Date(thisYear + '.' + thisMonth + '.1')
        let thisMonthLastDate = new Date(thisYear, thisMonth, 0)

        let thisMonthFirstWeek = !thisMonthFirstDate.getDay() ? 7 : thisMonthFirstDate.getDay()
        let thisMonthDateCount = thisMonthLastDate.getDate()
        let thisMonthLastWeek = !thisMonthLastDate.getDay() ? 7 : thisMonthLastDate.getDay()

        let lastMonth = thisMonth - 1 === 0 ? 12 : thisMonth - 1
        let lastMonthLastDate = new Date(lastMonth === 12 ? thisYear - 1 : thisYear, thisMonth - 1, 0).getDate()
        let lastMonthLackCount = thisMonthFirstWeek - 1

        let nextMonth = thisMonth + 1 === 13 ? 1 : thisMonth + 1
        let nextMonthLackCount = 7 - thisMonthLastWeek

        let calendarListIndex = 0
        let calendarList = []
        // 构建上月数据
        calendarList[0] = !calendarList[0] ? [] : calendarList[0]
        for (let i = 1, len = lastMonthLackCount; i <= len; i++) {
          calendarList[0].push({monthInfo: 'last_month', day: lastMonthLastDate - (len - i), monthValue: lastMonth})
        }

        // 构建本月数据
        for (let i = 1, len = thisMonthDateCount; i <= len; i++) {
          if (calendarList[calendarListIndex].length === 7) {
            ++calendarListIndex
            calendarList[calendarListIndex] = []
          }
          calendarList[calendarListIndex].push({monthInfo: 'this_month', day: i, monthValue: thisMonth})
        }

        // 构建下月数据
        for (let i = 1, len = nextMonthLackCount; i <= len; i++) {
          calendarList[calendarListIndex].push({monthInfo: 'next_month', day: i, monthValue: nextMonth})
        }

        this.calendarList = calendarList

        if (thisMonthDateCount < this.actDateInfo.thisDate) {
          this.actDateInfo.thisDate = 1
        }

        this.afterInit()
      },
      // 切换月份
      changeActMonth (navStr, actDate) {
        let tempObj = {}
        if (navStr === 'last_month') {
          let targetMonth = this.actDateInfo.thisMonth - 1
          if (targetMonth === 0) {
            tempObj = {
              thisYear: this.actDateInfo.thisYear - 1,
              thisMonth: 12,
              thisDate: actDate !== undefined ? actDate : this.actDateInfo.thisDate
            }
          } else {
            tempObj = {
              thisYear: this.actDateInfo.thisYear,
              thisMonth: targetMonth,
              thisDate: actDate !== undefined ? actDate : this.actDateInfo.thisDate
            }
          }
        } else {
          let targetMonth = this.actDateInfo.thisMonth + 1
          if (targetMonth === 13) {
            tempObj = {
              thisYear: this.actDateInfo.thisYear + 1,
              thisMonth: 1,
              thisDate: actDate !== undefined ? actDate : this.actDateInfo.thisDate
            }
          } else {
            tempObj = {
              thisYear: this.actDateInfo.thisYear,
              thisMonth: targetMonth,
              thisDate: actDate !== undefined ? actDate : this.actDateInfo.thisDate
            }
          }
        }
        this.actDateInfo = tempObj
        this.createCalendar()
      },
      changeActWeek (index, selectModel) {
        if (selectModel === 'week') {
          this.actWeek = index
        }
      },
      // 切换日期
      changeActDate (dayInfo, selectModel) {
        if (selectModel === 'week') return
        if (dayInfo.monthInfo !== 'this_month') {
          this.changeActMonth(dayInfo.monthInfo, dayInfo.day)
          return
        }
        this.actDateInfo.thisDate = dayInfo.day

        this.syncData()
      },
      getMonthWeek () {
        return getMonthWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate) % 2 ? 'A' : 'B'
      },
      getYearWeek () {
        return getYearWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate)
      },
      afterInit () {
        this.$emit('afterInit', this.calendarList, this.thisDateInfo, this.actDateInfo)
      },
      syncData () {
        this.$emit('syncDataFunc', this.calendarList, this.thisDateInfo, this.actDateInfo)
      }
    },
    filters: {
      monthName (str) {
        return monthMap[str].substr(0, 3)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .month_cal{
    text-align: center;
    .month_nav{
      font-size: 20px;color: #333;padding: 20px;
      button{width: 28px;height: 28px;border: 0;margin: 0 34px;vertical-align: middle;}
      button:nth-child(1){background: url(../images/icon_calendar_left.png) 0 0 / 100% 100% no-repeat;}
      button:nth-child(2){background: url(../images/icon_calendar_right.png) 0 0 / 100% 100% no-repeat;}
    }
    .month_body{
      font-size: 14px;padding: 0 20px;
      .table_left{
        float: left;width: 44px;
        & > div{
          color: #fff;height: 38px;padding: 4px 0;
          & div{height: 100%;line-height: 30px;border-radius: 2px;}
        }
        & :nth-child(even) div{background: #4A90E2;}
        & :nth-child(odd) div{background: #5ACE6D;}
      }
      .table_right{
        overflow: hidden;
        .li{
          display: flex;
          div{flex: 1;height: 38px;line-height: 38px;}
        }
        .li_head{color: #969DBA;}
        .li_cont{
          color: #333;
          .last_month, .next_month{color: #aaa;}
          .this_day div{background: #ddd;}
          .act div{background: #4E81BD !important;color: #fff;}
          div{text-align: center;}
          & > div > div{width: 38px;margin: auto;}
          & > div > div:hover{border: 2px solid #4E81BD;line-height: 34px;}
        }
        .li_cont.week .act div{background: inherit !important;color: #333;}
        .li_cont.week.act{background: rgba(79,129,190,0.3) !important;}
        .li_cont.week.act .icon_check{background: #4F81BE url('../images/icon_calendar_checked.png') 50% 50% / auto auto no-repeat;}
        .li_cont.week:nth-child(even){background: #f9f9f9;}
      }
    }
    .month_info{
      font-size: 30px;color: #333;line-height: 30px;padding: 20px;text-align: center;
      span{display: inline-block;width: 44px;height: 30px;color: #fff;font-size: 16px;vertical-align: top;line-height: 30px;border-radius: 2px;margin: 0 10px;}
      span.A{background: #4A90E2;}
      span.A:after{content: 'A';}
      span.B{background: #5ACE6D;}
      span.B:after{content: 'B';}
    }
  }
</style>