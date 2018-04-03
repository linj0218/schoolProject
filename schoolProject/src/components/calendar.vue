<template>
  <div class="month_cal">
    <!-- 日历导航 -->
    <div class="month_nav">
      <button class="nav_left" @click='changeActMonth("last_month")'
              @focus='()=>{this.$emit("buttonFocus")}'
              @blur='()=>{this.$emit("buttonBlur")}' >
      </button>
      {{actDateInfo.thisMonth | monthName}} {{actDateInfo.thisYear}}
      <div class="back_to_today" v-if='showABWeek' @click='backToToday()'>Today</div>
      <button class="nav_right" @click='changeActMonth("next_month")'
              @focus='()=>{this.$emit("buttonFocus")}'
              @blur='()=>{this.$emit("buttonBlur")}' >
      </button>
    </div>
    <div class="month_body">
      <div class="month_table clearfix">
        <!-- A、B、H 周 -->
        <div class="table_left" v-if='showABWeek'>
          <div></div>
          <div v-for='(row, index) in calendarList'>
            <div :class='getABHWeek(row, index)'>{{getABHWeek(row, index)}}</div>
          </div>
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
              <div :class="{'hasEvent': day.hasEvent}">{{day.day}}</div>
            </div>
            <div class="icon_check" v-if='selectModel==="week"'></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动周信息 -->
    <div class="month_info" v-if='showMonthInfo'>
        Week: {{getYearWeek()}}
        <span :class='getABHWeek2()'></span>
    </div>
  </div>
</template>

<script>
  import {monthMap, getMonthWeek, getYearWeek, getWeekFromTarget} from '@/plugins/util'
  import {mapState, mapMutations} from 'vuex'
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
        data: {
          schoolYearInfo: null // 学年信息
        },
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
    computed: {
      ...mapState(['initHoliday', 'schoolYearInfo'])
    },
    created () {
      this.actDateInfo = this.inputActDateInfo
      if (!this.initHoliday) {
        this.SET_INITHOLIDAY(true);
        this.getHoliday()
      } else if (!this.data.schoolYearInfo && this.schoolYearInfo) {
        // this.data.schoolYearInfo = this.schoolYearInfo;
        let actDate = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate})
        for (let i = 0; i < this.schoolYearInfo.length; i++) {
          let item = this.schoolYearInfo[i];
          if (this.$moment(item.start_date) <= actDate && this.$moment(item.end_date) >= actDate) {
            this.data.schoolYearInfo = item;
            break;
          }
        }
        this.createCalendar();
      } else {
        this.createCalendar()
      }
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
      },
      schoolYearInfo () {
        // 设置活动日期所属学期的学年信息
        let actDate = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate})
        for (let i = 0; i < this.schoolYearInfo.length; i++) {
          let item = this.schoolYearInfo[i];
          if (this.$moment(item.start_date) <= actDate && this.$moment(item.end_date) >= actDate) {
            this.data.schoolYearInfo = item;
            break;
          }
        }
        this.createCalendar()
      }
    },
    methods: {
      ...mapMutations(['SET_INITHOLIDAY', 'SET_SCHOOLYEARINFO']),
      getHoliday () {
        let params = {event_id: 0};
        return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', params).then((res) => {
          this.SET_SCHOOLYEARINFO(res.data.schoolYearList);
          return res;
        })
      },
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
            dateValue: i,
            monthValue: lastMonth,
            yearValue: lastMonthLastDate.getFullYear(),
            hasEvent: false
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
            dateValue: i,
            monthValue: thisMonth,
            yearValue: thisYear,
            hasEvent: false
          })
        }

        // 构建下月数据
        for (let i = 1, len = nextMonthLackCount; i <= len; i++) {
          calendarList[calendarListIndex].push({
            monthInfo: 'next_month',
            day: i,
            dateValue: i,
            monthValue: nextMonth,
            yearValue: nextMonthFirstDate.getFullYear(),
            hasEvent: false
          })
        }

        this.calendarList = calendarList

        if (thisMonthDateCount < this.actDateInfo.thisDate) {
          this.actDateInfo.thisDate = 1
        }

        this.afterInit();
      },
      // 向日历中添加事件标识
      initCalendarFlg () {
        // 查询日历首尾日期，查询已有事件的日期
        let calendarLength = this.calendarList.length;
        let startDateObj = this.calendarList[0][0];
        let endDateObj = this.calendarList[calendarLength - 1][6];
        let startDate = this.$moment({y: startDateObj.yearValue, M: startDateObj.monthValue - 1, d: startDateObj.day}).format('YYYY-MM-DD')
        let endDate = this.$moment({y: endDateObj.yearValue, M: endDateObj.monthValue - 1, d: endDateObj.day}).format('YYYY-MM-DD')
        let params = {
          dayFlag: 0,
          place: '',
          indexFlag: '0',
          category_id: 0,
          group_id: 0,
          startDate: startDate,
          endDate: endDate
        }
        return this.$http.post('/sharedcalendarCtl/event/searchOneDayEvents', {
          data: params
        }).then((res) => {
          if (res.result === 'SUCCESS') {
            for (let i2 = 0; i2 < this.calendarList.length; i2++) {
              let calendarRow = this.calendarList[i2];
              for (let i3 = 0; i3 < calendarRow.length; i3++) {
                let date = calendarRow[i3];
                date.hasEvent = false;
                let tempDate = this.$moment({y: date.yearValue, M: date.monthValue - 1, d: date.day});
                for (let i = 0; i < res.data.length; i++) {
                  let item = res.data[i];
                  let startDate = this.$moment(item.start_date);
                  let endDate = this.$moment(item.end_date);
                  if (startDate <= tempDate && endDate >= tempDate) {
                    date.hasEvent = true;
                  }
                }
              }
            }
            this.calendarList = JSON.parse(JSON.stringify(this.calendarList));
            return res;
          }
        })
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
      // 返回今日
      backToToday () {
        let date = this.$moment()
        let dateObj = {
          thisYear: date.year(),
          thisMonth: date.month() + 1,
          thisDate: date.date()
        }
        this.actDateInfo = dateObj;
        this.createCalendar();
        // changeActDate(dayInfo, selectModel)
      },
      // 判断本周为A、B、H周
      getABHWeek (row, index) {
        // console.log(this.data.schoolYearInfo, row)
        let weekStr = index % 2 === 0 ? 'A' : 'B';
        // 从学年开始日期计算A、B周，遇到H周跳过
        let firstWeekDate = this.$moment({y: row[0].yearValue, M: row[0].monthValue - 1, d: row[0].day});
        let scount = this.data.schoolYearInfo ? getWeekFromTarget(firstWeekDate, this.data.schoolYearInfo.start_date) : -1;
        let quantity = 0; // 活动日期之前的holiday数量
        // console.log(this.data.schoolYearInfo);
        if (this.data.schoolYearInfo && this.data.schoolYearInfo.hoildayList) {
          for (let i = 0; i < this.data.schoolYearInfo.hoildayList.length; i++) {
            let item = this.data.schoolYearInfo.hoildayList[i];

            if (firstWeekDate > this.$moment(item.start_date)) {
              quantity++;
            }

            if (firstWeekDate.format('YYYY-MM-DD') === this.$moment(item.start_date).format('YYYY-MM-DD')) {
              scount = -1;
              weekStr = 'H';
              break;
            }
          }
        }
        if (scount > -1) {
          scount -= quantity;
          weekStr = scount % 2 === 0 ? 'A' : 'B';
        }

        return weekStr;
      },
      getABHWeek2 () {
        let row = this.getActWeek();
        // console.log(row, this.data.schoolYearInfo)
        if (!row || !row.length || !this.data.schoolYearInfo) return '';
        // let weekStr = index % 2 === 0 ? 'A' : 'B';
        let weekStr = '';
        // 从学年开始日期计算A、B周，遇到H周跳过
        let firstWeekDate = this.$moment({y: row[0].yearValue, M: row[0].monthValue - 1, d: row[0].day});
        let scount = getWeekFromTarget(firstWeekDate, this.data.schoolYearInfo.start_date);
        let quantity = 0; // 活动日期之前的holiday数量
        // console.log(this.data.schoolYearInfo);
        if (this.data.schoolYearInfo && this.data.schoolYearInfo.hoildayList) {
          for (let i = 0; i < this.data.schoolYearInfo.hoildayList.length; i++) {
            let item = this.data.schoolYearInfo.hoildayList[i];

            if (firstWeekDate > this.$moment(item.start_date)) {
              quantity++;
            }

            if (firstWeekDate.format('YYYY-MM-DD') === this.$moment(item.start_date).format('YYYY-MM-DD')) {
              scount = -1;
              weekStr = 'H';
              break;
            }
          }
        }
        if (scount > -1) {
          scount -= quantity;
          weekStr = scount % 2 === 0 ? 'A' : 'B';
        }
        return weekStr;
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
        this.initCalendarFlg().then(() => {
          this.$emit('afterInit', this.calendarList, this.thisDateInfo, this.actDateInfo, this.getActWeek());
        });
      },
      // 返回数据：日历数据，今日数据，当前日期数据，当前日期所属周数据
      syncData () {
        this.$emit('syncDataFunc', this.calendarList, this.thisDateInfo, this.actDateInfo, this.getActWeek());
        // this.initCalendarFlg();
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
      font-size: 20px;color: #333;padding: 20px;position: relative;
      .back_to_today{cursor: pointer;width: 70px;height: 28px;background: #4A90E2;color: #fff;border-radius: 2px;position: absolute;right: 20px;top: 50%;transform: translateY(-50%);font-size: 14px;line-height: 28px;}
      button{width: 28px;height: 28px;border: 0;vertical-align: middle;}
      button.nav_left{background: url(../images/icon_calendar_left.png) 0 0 / 100% 100% no-repeat;margin-right: 10px;}
      button.nav_right{background: url(../images/icon_calendar_right.png) 0 0 / 100% 100% no-repeat;margin-left: 10px;}
    }
    .month_body{
      font-size: 14px;padding: 0 20px;
      .table_left{
        float: left;width: 44px;
        & > div{
          color: #fff;height: 38px;padding: 4px 0;
          & div{height: 100%;line-height: 30px;border-radius: 2px;}
        }
        & .A{background: #4A90E2;}
        & .B{background: #5ACE6D;}
        & .H{background: #F3A222;}
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
          & > div > div{width: 38px;margin: auto;position: relative;border: 2px solid transparent;line-height: 34px;}
          & > div > div.hasEvent:after{content: "";position: absolute;width: 5px;height: 5px;border-radius: 50%;background: #CC3C39;right: 2px;top: 4px;}
          & > div > div:hover{border: 2px solid #4E81BD;}
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
      span.H{background: #F3A222;}
      span.H:after{content: 'H';}
    }
  }
</style>
