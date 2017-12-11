<template>
  <div class="month_cal">
    <!-- 日历导航 -->
    <div class="month_nav">
      <button @click='changeActMonth("last_month")'
              @focus='()=>{this.$emit("buttonFocus")}'
              @blur='()=>{this.$emit("buttonBlur")}' >
      </button>
      {{actDateInfo.thisMonth | monthName}} {{actDateInfo.thisYear}}
      <button @click='changeActMonth("next_month")'
              @focus='()=>{this.$emit("buttonFocus")}'
              @blur='()=>{this.$emit("buttonBlur")}' >
      </button>
    </div>
    <div class="month_body">
      <div class="month_table clearfix">
        <!-- A、B、H 周 -->
        <div class="table_left" v-if='showABWeek'>
          <div></div>
          <div v-for='(row, index) in calendarList'><div>{{getABHWeek(row, index)}}</div></div>
        </div>
        <div class="table_right">
          <!-- 星期 -->
          <div class="li li_head">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            <div v-if='selectModel==="week"'></div>
          </div>
          <!-- 日期 -->
          <div class="li li_cont" v-for='(li, index) in calendarList'
               :class='[{"week": selectModel==="week"}, {"act": actWeek===index}]'
               @click='changeActWeek(index, selectModel)'>
            <div v-for='day in li'
                :class="[day.monthInfo,
                        {'this_day': thisDateInfo.thisMonth==day.monthValue&&thisDateInfo.thisDate==day.day},
                        {'act': day.monthInfo=='this_month'&&day.day==actDateInfo.thisDate}]"
                @click='changeActDate(day, selectModel)'>
              <div>{{day.day}}</div>
            </div>
            <div class="icon_check" v-if='selectModel==="week"'></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动周信息 -->
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
        // 日历数组
        calendarList: [],
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
    watch: {
      // 监听活动日期改变，当活动日期与月视图不匹配，重绘日历
      inputActDateInfo: {
        handler (val) {
          for (let i = 0; i < this.calendarList[1].length; i++) {
            let item = this.calendarList[1][i]
            if (item.monthInfo === 'this_month' && item.monthValue !== val.thisMonth) {
              this.createCalendar()
              break
            }
          }
        },
        deep: true
      }
    },
    methods: {
      // 构建日历
      createCalendar () {
        let thisYear = this.actDateInfo.thisYear
        let thisMonth = this.actDateInfo.thisMonth
        let thisMonthFirstDate = new Date(thisYear + '-' + thisMonth + '-1')
        let thisMonthLastDate = new Date(thisYear, thisMonth, 0)

        let thisMonthFirstWeek = !thisMonthFirstDate.getDay() ? 7 : thisMonthFirstDate.getDay()
        let thisMonthDateCount = thisMonthLastDate.getDate()
        let thisMonthLastWeek = !thisMonthLastDate.getDay() ? 7 : thisMonthLastDate.getDay()

        let lastMonth = thisMonth - 1 === 0 ? 12 : thisMonth - 1
        let lastMonthLastDate = new Date(lastMonth === 12 ? thisYear - 1 : thisYear, thisMonth - 1, 0)
        let lastMonthLackCount = thisMonthFirstWeek - 1

        let nextMonth = thisMonth + 1 === 13 ? 1 : thisMonth + 1
        let nextMonthFirstDate = new Date(nextMonth === 1 ? thisYear + 1 : thisYear, nextMonth - 1, 1)
        let nextMonthLackCount = 7 - thisMonthLastWeek

        let calendarListIndex = 0
        let calendarList = []
        // 构建上月数据
        calendarList[0] = !calendarList[0] ? [] : calendarList[0]
        for (let i = 1, len = lastMonthLackCount; i <= len; i++) {
          calendarList[0].push({
            monthInfo: 'last_month',
            day: lastMonthLastDate.getDate() - (len - i),
            monthValue: lastMonth,
            yearValue: lastMonthLastDate.getFullYear()
          })
        }

        // 构建本月数据
        for (let i = 1, len = thisMonthDateCount; i <= len; i++) {
          if (calendarList[calendarListIndex].length === 7) {
            ++calendarListIndex
            calendarList[calendarListIndex] = []
          }
          calendarList[calendarListIndex].push({
            monthInfo: 'this_month',
            day: i,
            monthValue: thisMonth,
            yearValue: thisYear
          })
        }

        // 构建下月数据
        for (let i = 1, len = nextMonthLackCount; i <= len; i++) {
          calendarList[calendarListIndex].push({
            monthInfo: 'next_month',
            day: i,
            monthValue: nextMonth,
            yearValue: nextMonthFirstDate.getFullYear()
          })
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
      // 切换周
      changeActWeek (index, selectModel) {
        if (selectModel === 'week') {
          this.actWeek = index
          this.actDateInfo = {
            thisYear: this.calendarList[index][0].yearValue,
            thisMonth: this.calendarList[index][0].monthValue,
            thisDate: this.calendarList[index][0].day
          }
          this.syncData()
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
      // 活动日期在今年为单周或双周
      getMonthWeek () {
        return getMonthWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate) % 2 ? 'A' : 'B'
      },
      // 活动日期在今年为第几周
      getYearWeek () {
        return getYearWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate)
      },
      getABHWeek (row, index) {
        // console.log(getSessionStorage('holidays'))
        // console.log(this.$moment({y: row[0].yearValue, M: row[0].monthValue - 1, d: row[0].day}).format('YYYY-MM-DD'))
        return index % 2 === 0 ? 'A' : 'B';
      },
      // 获取当前日期所属的周数据
      getActWeek () {
        let actWeek = []
        for (let i = 0, len = this.calendarList.length; i < len; i++) {
          let row = this.calendarList[i]
          for (let i2 = 0, len2 = row.length; i2 < len2; i2++) {
            let item = row[i2]
            if (this.actDateInfo.thisYear === item.yearValue && this.actDateInfo.thisMonth === item.monthValue && this.actDateInfo.thisDate === item.day) {
              actWeek = row
              return actWeek
            }
          }
        }
        return actWeek
      },
      // 日历构建完毕
      afterInit () {
        this.$emit('afterInit', this.calendarList, this.thisDateInfo, this.actDateInfo, this.getActWeek())
      },
      // 返回数据：日历数据，今日数据，当前日期数据，当前日期所属周数据
      syncData () {
        this.$emit('syncDataFunc', this.calendarList, this.thisDateInfo, this.actDateInfo, this.getActWeek())
      }
    },
    filters: {
      monthName (str) {
        return monthMap[Number(str)].substr(0, 3)
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
