<template>
  <div class="month_cal">
    <!-- 日历导航 上、下月 -->
    <div class="month_nav">
      <button class="nav_left" @click='changeActMonth("last_month")'
              @focus='()=>{this.$emit("buttonFocus")}'
              @blur='()=>{this.$emit("buttonBlur")}' >
      </button>
      {{getMonth}} {{actDateInfo.thisYear}}
      <el-tooltip effect="dark" :content="$t('Today')" placement="top-start" :open-delay="1000">
        <div class="back_to_today" v-if='showABWeek' @click='backToToday()'>{{ $t("Today") }}</div>
      </el-tooltip>
      <button class="nav_right" @click='changeActMonth("next_month")'
              @focus='()=>{this.$emit("buttonFocus")}'
              @blur='()=>{this.$emit("buttonBlur")}' >
      </button>
    </div>
    <!-- 日历主体 -->
    <div class="month_body">
      <div class="month_table clearfix">
        <!-- 日历周次 A、B、H 周 -->
        <div class="table_left" v-if='showABWeek'>
          <div></div>
          <div v-for='(row, index) in calendarList'>
            <div :class='getABHWeek(row, index)'>{{getABHWeek(row, index)}}</div>
          </div>
        </div>
        <div class="table_right">
          <!-- 星期 -->
          <div class="li li_head">
            <div>{{ $t("Mon") }}</div><div>{{ $t("Tue") }}</div><div>{{ $t("Wed") }}</div><div>{{ $t("Thu") }}</div><div>{{ $t("Fri") }}</div><div>{{ $t("Sat") }}</div><div>{{ $t("Sun") }}</div>
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
        {{ $t("Week") }}: {{getYearWeek()}}
        <span :class='getABHWeek2()'></span>
    </div>
  </div>
</template>

<script>
  import {monthMap, getMonthWeek, getYearWeek, getWeekFromTarget} from '@/script/util'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      showMonthInfo: { // 是否显示当前周信息
        type: Boolean,
        required: false,
        default: true
      },
      showABWeek: { // 是否显示A、B、H周标识
        type: Boolean,
        required: false,
        default: true
      },
      inputActDateInfo: { // 当前选中日期信息
        type: Object,
        required: true
      },
      selectModel: { // 周选择模式 date-日期 week-周
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
      ...mapGetters({
        initHoliday: 'initHoliday',
        schoolYearInfo: 'schoolYearInfo'
      }),
      getMonth () {
        return this.$t(monthMap[Number(this.actDateInfo.thisMonth)].substr(0, 3));
      }
    },
    created () {
      this.actDateInfo = this.inputActDateInfo
      if (!this.initHoliday) {
        this.$store.dispatch('getInitHoliday');
        this.getHoliday().then(() => {
          this.createCalendar();
        })
      } else if (!this.data.schoolYearInfo && this.schoolYearInfo) {
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
      getHoliday () {
        let params = {event_id: 0};
        return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', params).then((res) => {
          this.$store.dispatch('getSchoolYearInfo', res.data.schoolYearList)
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
      initCalendarFlg (reqData) {
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
        if (reqData) {
          params.category_id = reqData.category_id;
          params.group_id = reqData.group_id;
          params.place = reqData.place;
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
        }).then(() => {
          this.syncData()
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
        this.$emit('afterInit', this.calendarList, this.thisDateInfo, this.actDateInfo, this.getActWeek());
      },
      // 返回数据：日历数据，今日数据，当前日期数据，当前日期所属周数据
      syncData () {
        this.$emit('syncDataFunc', this.calendarList, this.thisDateInfo, this.actDateInfo, this.getActWeek());
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/components/calendar';
</style>
