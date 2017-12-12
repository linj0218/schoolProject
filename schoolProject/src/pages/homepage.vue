<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @configToggle='configToggle'
             @profileToggle='profileToggle'>
    </headerr>

    <div class="page_body">
      <div class="page_body_box clearfix">
        <div class="part_1">
          <div class="title">Calendar</div>

          <!-- 日历组件 -->
          <calendar :inputActDateInfo='actDateInfo'
                    :showMonthInfo='false'
                    @afterInit='afterInit'
                    @syncDataFunc='syncDataFunc'>
          </calendar>

          <div class="title bg_color">Campus</div>
          <div class="places">
            <button type="button" class="btn btn-block"
                    v-for='place in placesList'
                    :class='place.isSelected ? "act" : ""'
                    @click='placeSelectedChanged(place)'>
              {{place.name}}<span></span>
            </button>
          </div>
        </div>
        <div class="part_2">
          <div class="week_nav">
            <div class="month_info">
              <button @click='switchWeek("prev")'></button>
              <button @click='switchWeek("next")'></button>
              <span class="week_info">
                Week: <span class="week_num">{{getYearWeek()}}</span>
              </span>
              <span class="week_ab" :class='getMonthWeek()'>{{getMonthWeek()}}</span>
            </div>
            <div class="filter_condition">
              <span>Category:</span>
              <div class="select">

                <!-- 下拉组件 -->
                <drapdown :input-value='categoryId'
                          :input-name='categoryName'
                          :input-color-type='"circle"'
                          :input-color='categoryColor'
                          :input-select='categorys'
                          @inputChange='categoryChanged'>
                </drapdown>

              </div>
              <span>See the category as:</span>
              <div class="select">

                <!-- 下拉组件 -->
                <drapdown :input-value='seeCategoryId'
                          :input-name='seeCategoryName'
                          :input-select='seeCategorys'
                          @inputChange='seeCategoryChanged'>
                </drapdown>

              </div>
              <button type="button" class="btn btn-primary" @click='()=>{this.eventType="new";this.showEvent=true}'>
                <span class="icon_btn_add"></span> New Event
              </button>
            </div>
          </div>
          <div class="week_calendar">
            <div class="table_head">
              <div class="th" v-for='th in weekTableHead'
                              :class='{"act": th.isActDate}'
                              @click='changeActDateFromWeekview(th)'>
                <div class="week_name">{{th.week}}</div>
                <div class="month_num">{{th.date}}</div>
              </div>
            </div>
            <div class="table_body">
              <div class="table_body_bg flex">
                <div v-for='th in weekTableHead' :class='{"act": th.isActDate}' @click='changeActDateFromWeekview(th)'></div>
              </div>
              <template v-for='li in weekTaskList'>
                <div class="li" v-show='showli(li)'>
                  <div v-for='td in li' :class='"task_" + td.spanNum' @click='changeActDateFromWeekview(td)'>
                    <div :title='td.title' v-show='!(td.spanNum==1 && td.time!="All day")'>
                      <div :class='[td.color, {"no_table_cell": td.spanNum>1&&td.time!="All day"}]'>
                        <div class="title_line">
                          <div class="time_line" v-show='td.spanNum>1&&td.time!="All day"'>{{td.startTime}}</div>
                          <div class="time_line right" v-show='td.spanNum>1&&td.time!="All day"'>{{td.endTime}}</div>
                          {{td.title}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="part_3">
          <div class="task_title">
            <div class="act_date_info">{{data.actDateInfoLabel}}</div>
            <template v-for='li in weekTaskList'>
              <div class="li container-fluid"
                   v-for='td in li'
                   v-if='showTask(td)'
                   :class='{"act": td.id==weekTaskListActId}'
                   @click='weekTaskListActIndexChanged(td)'>
                <div class="label_line"></span>{{td.time}}</div>
                <div class="label_line"><span :class='td.color'></span>{{td.place}} - {{td.room}}</div>
                <div class="label_line">{{td.title}}</div>
              </div>
            </template>
          </div>
          <div class="task_detail" >
            <div v-if='weekTaskListActId!=null'>
              <div class="tast_detail_right">
                <div class="title">Participants</div>
                <template v-for='(item, index) in eventsUserGroupList'>
                  <button type="button" class="btn btn-block" v-if='index < 4'>
                    <span class="icon icon_members"></span>{{item.group_alias_name}}
                  </button>
                </template>
                <template v-for='(item, index) in eventsUserList'>
                  <button type="button" class="btn btn-block" v-if='eventsUserGroupList.length < 4 && index < 4 - eventsUserGroupList.length'>
                    <span class="icon icon_member"></span>{{item.nom}}
                  </button>
                </template>
                <div v-if='eventsUserGroupList.length + eventsUserList.length > 4'>...</div>
                <div class="title margin_top">Viewed by</div>
                <button type="button" class="btn btn-block" v-if='eventsGroupList.length == 7'>All Employees</button>
                <template v-for='(item, index) in eventsGroupList' v-else>
                  <button type="button" class="btn btn-block">
                    {{item.group_alias_name}}
                  </button>
                </template>
              </div>
              <div class="tast_detail_left">
                <div class="item">
                  <span>Title:</span><div>{{taskDetailInfo.title ? taskDetailInfo.title : '-'}}</div>
                </div>
                <div class="item">
                  <span>Categroy:</span><div>{{taskDetailInfo.categroy ? taskDetailInfo.categroy : '-'}} <i :class='taskDetailInfo.color'></i></div>
                </div>
                <div class="item">
                  <span>Description:</span><div>{{taskDetailInfo.description ? taskDetailInfo.description : '-'}}</div>
                </div>
                <div class="item">
                  <span>Attachment:</span><div><a target="_blank" href="http://www.baidu.com">test<i class="icon_attachment"></i></a></div>
                </div>
              </div>
              <div class="edit_btn">
                <button type="button" class="btn btn-primary" @click='editEvent()'>
                  <span class="icon icon_btn_edit"></span> Edit
                </button>
                <button type="button" class="btn btn-danger" @click='deleteEvent()'>
                  <span class="icon icon_btn_del"></span> Delete
                </button>
                <div class="creater_info">
                  <div class="name">Creater</div>
                  <div>{{taskDetailInfo.creater}}</div>
                  <div>{{taskDetailInfo.create_time}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <!-- 系统设置 -->
      <config ref='config' @openBanner='openBanner'></config>

      <new-event :show-config='showEvent'
                 :event-type='eventType'
                 :event-id='weekTaskListActId'
                 @closeEventModal='closeEventModal'
                 @openBanner='openBanner'>
      </new-event>

      <banner ref='banner'></banner>

      <alert ref='alert'></alert>

    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import banner from '@/components/banner'
  import profile from '@/components/profile'
  import config from '@/components/configuration'
  import calendar from '@/components/calendar'
  import newEvent from '@/components/newEvent'
  import drapdown from '@/components/drapdown'
  import alert from '@/components/alert'
  import {weekMap, forEach, getMonthWeek, getYearWeek, formatDate} from '@/plugins/util'
  import {mapState, mapMutations} from 'vuex'

  export default {
    components: {
      headerr, banner, calendar, profile, config, newEvent, drapdown, alert
    },
    data () {
      return {
        data: {
          initOver: false,
          actDateInfoLabel: ''
        },
        // part_1 ------------------------------------------------------------
        // Calendar
        calendarList: null,
        thisDateInfo: null,
        actDateInfo: { // 目标日期
          thisYear: new Date().getFullYear(),
          thisMonth: new Date().getMonth() + 1,
          thisDate: new Date().getDate()
        },
        // 当前日期所属的周数据
        actWeekList: [],
        // Places
        placesList: [],
        // part_2 ------------------------------------------------------------
        // Week info
        categoryId: '0',
        categoryName: 'All',
        categoryColor: '',
        categorys: [],
        seeCategoryId: '0',
        seeCategoryName: 'All',
        seeCategoryColor: '',
        seeCategorys: [],
        weekTableHead: [],
        weekTaskListActId: null,
        weekTaskList: [],
        // part_3 ------------------------------------------------------------
        // Task info
        taskDetailInfo: {
          title: '',
          creater: '',
          create_time: '',
          categroy: '',
          color: '',
          place: '',
          room: '',
          start: '',
          end: '',
          description: ''
        },
        eventsUserGroupList: [],
        eventsUserList: [],
        eventsGroupList: [],
        // 新建事件弹窗
        showEvent: false,
        eventType: null
      }
    },
    created () {
      if (JSON.stringify(this.$route.query) !== '{}') {
        this.actDateInfo.thisYear = Number(this.$route.query.year)
        this.actDateInfo.thisMonth = Number(this.$route.query.month)
        this.actDateInfo.thisDate = Number(this.$route.query.date)
      }
    },
    computed: {
      ...mapState(['test'])
    },
    mounted () {
      // console.log(this)
      if (JSON.stringify(this.$route.query) !== '{}') {
        this.createWeekInfo()
      }
      // console.log(this.$route.query)
      this.initPageData().then(() => {
        this.data.initOver = true
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
      })
    },
    watch: {
      test () {
        console.log(this.test)
      }
    },
    methods: {
      ...mapMutations(['SET_TEST']),
      initPageData () {
        let self = this
        return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', {
          data: JSON.stringify({event_id: 0})
        }).then((res) => {
          let resData = res.data

          let placesList = []
          forEach(resData.campusList, (i, item) => {
            let obj = {
              id: item.id,
              name: item.campus_name,
              address: item.address,
              isSelected: true
            }
            placesList.push(obj)
          })
          self.placesList = placesList

          let categorys = [{value: '0', name: 'All', color: ''}]
          forEach(resData.categoryList, (i, item) => {
            let obj = {
              value: item.id,
              name: item.category_no,
              color: item.category_remark
            }
            categorys.push(obj)
          })
          self.categorys = categorys

          // groups
          let seeCategorys = [{value: '0', name: 'All'}]
          forEach(resData.groupsList, (i, item) => {
            let obj = {
              value: item.id,
              name: item.group_name
            }
            seeCategorys.push(obj)
          })
          self.seeCategorys = seeCategorys

          // 重构Holiday数据
          // let holidays = [];
          // forEach(resData.schoolYearList, (i, item) => {
          //   if (!item.hoildayList) return;
          //   holidays = holidays.concat(item.hoildayList)
          // })
          // setSessionStorage('holidays', holidays);

          return res
        })
      },
      // 地址切换事件
      placeSelectedChanged (place) {
        place.isSelected = !place.isSelected
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
      },
      // 周视图切换上下周
      switchWeek (targetStr) {
        let targetDate = null
        let actDateTime = this.$moment([this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate].join('-'))
        if (targetStr === 'prev') {
          targetDate = actDateTime.add(-7, 'days')
        } else {
          targetDate = actDateTime.add(7, 'days')
        }
        this.actDateInfo.thisYear = Number(targetDate.format('YYYY'))
        this.actDateInfo.thisMonth = Number(targetDate.format('MM'))
        this.actDateInfo.thisDate = Number(targetDate.format('DD'))
        this.createWeekInfo()
      },
      // 创建日历下周任务视图
      createWeekInfo () {
        let tempList = []
        forEach(this.calendarList, (i, item) => {
          forEach(item, (i2, item2) => {
            if (item2.monthValue === this.actDateInfo.thisMonth && item2.day === this.actDateInfo.thisDate) {
              forEach(this.calendarList[i], (i3, item3) => {
                let tempObj = {}
                tempObj = {
                  thisYear: item3.yearValue,
                  thisMonth: item3.monthValue,
                  thisDate: item3.day,
                  week: weekMap[Number(i3) + 1].substr(0, 3),
                  date: item3.day,
                  isActDate: item2.day === item3.day
                }
                tempList.push(tempObj)
              })
            }
          })
        })
        this.weekTableHead = tempList

        // 获取周视图数据
        if (this.data.initOver) {
          this.getWeekInfoData().then(() => {
            this.getViews()
          })
        }
      },
      // 获取周视图数据
      getWeekInfoData () {
        let startDate = this.actWeekList[0]
        let endDate = this.actWeekList[6]
        let _startDate = formatDate([startDate.yearValue, startDate.monthValue, startDate.day].join('-'), 'yyyy-mm-dd')
        let _endDate = formatDate([endDate.yearValue, endDate.monthValue, endDate.day].join('-'), 'yyyy-mm-dd')

        let placesList = []
        this.placesList.map((o) => { if (o.isSelected) { placesList.push('\'' + o.name + '\'') } })

        let self = this
        let params = {
          dayFlag: 0,
          startDate: _startDate,
          endDate: _endDate,
          category_id: this.categoryId,
          group_id: this.seeCategoryId
        }
        if (placesList.length > 0) {
          params.place = placesList.join(',')
        }
        return this.$http.post('/sharedcalendarCtl/event/searchOneDayEvents', {
          data: JSON.stringify(params)
        }).then((res) => {
          let resData = res.data
          let emptyWeekFlg = true
          let tempList = []
          let list = []
          self.weekTaskList = []

          // 默认Event详情
          this.weekTaskListActId = null
          this.taskDetailInfo = {
            title: '',
            creater: '',
            create_time: '',
            categroy: '',
            color: '',
            place: '',
            room: '',
            start: '',
            end: '',
            description: ''
          }

          let count = 0

          // 递归构建周视图
          let formatWeekInfo = () => {
            if (count > 15) return
            count++

            for (let i = 0, len = self.weekTableHead.length; i < len; i++) {
              let item = self.weekTableHead[i]
              let tempObj = {}

              for (let i2 = 0, len2 = resData.length; i2 < len2; i2++) {
                let field = JSON.parse(JSON.stringify(resData[i2]))
                if (field === null) continue

                let dateList = field.start_date.split('-')
                let taskStartYear = Number(dateList[0])
                let taskStartMonth = Number(dateList[1])
                let taskStartDate = Number(dateList[2])

                if (item.thisYear === taskStartYear && item.thisMonth === taskStartMonth && item.thisDate === taskStartDate) {
                  if (field.days > 1) {
                    i = i + field.days - 1
                  }
                  /*
                  1.单天的event
                  a.All day
                  文本显示为：All day
                  b.非All day
                  文本显示为：2:00 am – 4:00 pm

                  2.跨天的evetn
                  a.All day
                  文本显示为：All day (28/11 – 29/11)
                  b.非All day
                  文本显示为：28/11 2:00 am – 29/11 4:00 pm

                  显示顺序从上至下为：跨天allday，跨天非allday, 单天allday，单天非allday
                  */
                  let time = ''
                  if (field.day_flag === 1) {
                    time = 'All day'
                    if (field.days > 1) {
                      time += ' (' + (formatDate(field.start_date, 'dd/mm') + ' - ' + formatDate(field.end_date, 'dd/mm')) + ')'
                    }
                  } else if (field.days > 1) {
                    time = formatDate(field.start_date, 'dd/mm') + ' ' + field.start_time + ' - ' + formatDate(field.end_date, 'dd/mm') + ' ' + field.end_time
                  } else {
                    time = field.start_time + ' - ' + field.end_time
                  }
                  tempObj = {
                    id: field.id,
                    spanNum: field.days,
                    color: field.category_remark,
                    time: time,
                    title: field.title,
                    place: field.campus_name,
                    room: field.place_name,
                    startTime: field.start_time,
                    endTime: field.end_time,
                    thisYear: item.thisYear,
                    thisMonth: item.thisMonth,
                    thisDate: item.thisDate
                  }
                  tempObj.source = field

                  // 默认选中第一个Event
                  if (emptyWeekFlg) {
                    let endDateList = field.end_date.split('-')
                    let taskEndYear = Number(endDateList[0])
                    let taskEndMonth = Number(endDateList[1])
                    let taskEndDate = Number(endDateList[2])

                    let actDate = new Date(formatDate([this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate].join('-'))).getTime()
                    let _taskStartDate = new Date(formatDate([taskStartYear, taskStartMonth, taskStartDate].join('-'))).getTime()
                    let _taskEndDate = new Date(formatDate([taskEndYear, taskEndMonth, taskEndDate].join('-'))).getTime()

                    if (actDate >= _taskStartDate && actDate <= _taskEndDate) {
                      emptyWeekFlg = false
                      this.weekTaskListActId = field.id
                      let createTime = field.create_time.split(' ')
                      this.taskDetailInfo = {
                        title: field.title,
                        creater: field.nom,
                        create_time: formatDate(createTime[0], 'dd/mm/yy') + ' ' + createTime[1],
                        categroy: field.category_no,
                        color: field.category_remark,
                        place: field.campus_name,
                        room: field.place_name,
                        start: formatDate(field.start_date, 'dd/mm/yy') + ' ' + field.start_time,
                        end: formatDate(field.end_date, 'dd/mm/yy') + ' ' + field.end_time,
                        description: field.description
                      }
                    }
                  }

                  resData.splice(i2, 1, null)
                  break;
                }
              }

              if (JSON.stringify(tempObj) === '{}') {
                tempObj = {
                  id: '',
                  spanNum: 0,
                  color: '',
                  time: '',
                  title: '',
                  place: '',
                  room: '',
                  startTime: '',
                  endTime: '',
                  thisYear: item.thisYear,
                  thisMonth: item.thisMonth,
                  thisDate: item.thisDate}
              }
              tempList.push(tempObj)
            }
            list.push(tempList)
            self.weekTaskList = list

            for (let i = 0, len = resData.length; i < len; i++) {
              if (resData[i] != null) {
                tempList = []
                formatWeekInfo()
                break;
              }
            }
          }
          formatWeekInfo()
          this.formatActDateInfoLabel()
          // console.log(self.weekTaskList)

          return res
        })
      },
      // Event列表时间
      formatActDateInfoLabel () {
        let actDate = [this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate].join('-')
        let week = new Date(actDate).getDay()
        this.data.actDateInfoLabel = formatDate(actDate, 'yyyy-mm-dd') + ', ' + weekMap[week].substr(0, 3)
      },
      // 周视图隐藏空行
      showli (li) {
        let showFlg = false
        forEach(li, (i, item) => {
          if (item.spanNum > 1 || item.time === 'All day') showFlg = true
        })
        return showFlg
      },
      // Event list校验显示当前日期对应的Events
      showTask (item) {
        if (item.spanNum === 0) return false
        // if (item.spanNum === 1 && item.time !== 'All day') return false

        let thisActDate = formatDate([this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate].join('-'), 'yyyy-mm-dd')
        let startDate = item.source.start_date
        let endDate = item.source.end_date
        let actDateTime = new Date(thisActDate).getTime()
        let startDateTime = new Date(startDate).getTime()
        let endDateTime = new Date(endDate).getTime()

        if (actDateTime >= startDateTime && actDateTime <= endDateTime) return true
        else return false
      },
      // 从周视图同步数据到日历
      changeActDateFromWeekview (item) {
        this.actDateInfo.thisYear = item.thisYear
        this.actDateInfo.thisMonth = item.thisMonth
        this.actDateInfo.thisDate = item.thisDate
        this.createWeekInfo()
      },
      // 日历日期切换事件
      syncDataFunc (calendarList, thisDateInfo, actDateInfo) {
        this.calendarList = calendarList
        this.thisDateInfo = thisDateInfo
        this.actDateInfo = actDateInfo
        this.actWeekList = arguments[3] || {}
        this.createWeekInfo()
      },
      afterInit (calendarList, thisDateInfo, actDateInfo) {
        this.calendarList = calendarList
        this.thisDateInfo = thisDateInfo
        this.actDateInfo = actDateInfo
        this.actWeekList = arguments[3] || {}
        this.createWeekInfo()
      },
      profileToggle () {
        this.$refs.profile.show = !this.$refs.profile.show;
      },
      // 配置弹窗切换事件
      configToggle () {
        this.$refs.config.show = !this.$refs.config.show
      },
      // Event弹窗关闭刷新数据
      closeEventModal () {
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
        this.showEvent = !this.showEvent
      },
      categoryChanged (item) {
        this.categoryId = item.value
        this.categoryName = item.name
        this.categoryColor = item.color
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
      },
      seeCategoryChanged (item) {
        this.seeCategoryId = item.value
        this.seeCategoryName = item.name
        this.seeCategoryColor = item.color
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
      },
      // 点击任务列表同步Event详情
      weekTaskListActIndexChanged (o) {
        let item = o.source
        this.weekTaskListActId = item.id
        let createTime = item.create_time.split(' ')
        this.taskDetailInfo = {
          title: item.title,
          creater: item.nom,
          create_time: formatDate(createTime[0], 'dd/mm/yy') + ' ' + createTime[1],
          categroy: item.category_no,
          color: item.category_remark,
          place: item.campus_name,
          room: item.place_name,
          start: formatDate(item.start_date, 'dd/mm/yy') + ' ' + item.start_time,
          end: formatDate(item.end_date, 'dd/mm/yy') + ' ' + item.end_time,
          description: item.description
        }
        this.getViews()
      },
      // 获取Event详情右边的views
      getViews () {
        if (!this.weekTaskListActId) {
          this.eventsUserGroupList = []
          this.eventsUserList = []
          this.eventsGroupList = []
          return false
        }
        let self = this
        this.$http.post('/sharedcalendarSettingCtl/event/getEventsDetailByEventId', {
          data: JSON.stringify({event_id: this.weekTaskListActId})
        }).then((res) => {
          if (res.success) {
            let resData = res.data

            self.eventsUserGroupList = resData.eventsUserGroupList
            self.eventsUserList = resData.eventsUserList
            self.eventsGroupList = resData.eventsGroupList
          }
        })
      },
      // Event详情编辑按钮
      editEvent () {
        if (!this.weekTaskListActId) return false
        this.eventType = 'edit'
        this.showEvent = true
      },
      // Event详情删除按钮
      deleteEvent () {
        if (!this.weekTaskListActId) return false

        this.$refs.alert.showDialog().then(() => {
          this.$http.post('sharedcalendarSettingCtl/event/editEvent', {
            data: JSON.stringify({id: this.weekTaskListActId, operation_flag: -1})
          }).then((res) => {
            if (res.success) {
              let banner = {
                status: 'SUCCESS',
                msg: 'Delete Successed'
              }
              this.openBanner(banner)
              return res
            }
          }).then(() => {
            this.getWeekInfoData().then(() => {
              this.getViews()
            })
          })
        })
      },
      openBanner (res) {
        this.$refs.banner.show(res.msg)
      },
      getMonthWeek () {
        return getMonthWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate) % 2 ? 'A' : 'B'
      },
      getYearWeek () {
        return getYearWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  #body{height: 100%;background: #f5f5f5;overflow: auto;}
  .page_body{
    padding: 30px 180px;position: relative;
    .icon_btn_add{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;background: url('../images/icon_btn_add.png') 50% 50% / auto auto no-repeat;}
    .part_1{
      background: #fff;float: left;width: 380px;height: 918px;margin-right: 20px;box-shadow: 0 0 1px #ddd;
      .title{line-height: 56px;font-size: 28px;background: #4A90E2;color: #fff;text-align: center;position: relative;}
      .title:after{content: '';position: absolute;bottom: -11px;height: 11px;width: 100%;left: 0;background: url('../images/icon_other1.png') 24px 0 / auto 100% no-repeat;}
      .title.bg_color{background: #5ACE6D;margin-top: 95px;}
      .title.bg_color:after{background: url('../images/icon_other2.png') 24px 0 / auto 100% no-repeat;}
      .places{
        padding: 40px 90px;
        .btn{
          border: 1px solid #ccc;font-size: 20px;color: #ccc;height: 36px;padding: 0;position: relative;outline: none;background: #fff;
          span{position: absolute;width: 30px;height: 27px;right: -2px;top: -2px;background: url('../images/icon_checked.png') 0 0 / 100% 100% no-repeat;display: none;}
        }
        .btn.act{
          border: 2px solid #5ACE6D;color: #5ACE6D;
          span{display: block;}
        }
      }
    }
    .part_2, .part_3{overflow: hidden;background: #fff;box-shadow: 0 0 1px #ddd;}
    .part_2{
      min-height: 365px;margin-bottom: 20px;
      .week_nav{
        height: 76px;border-bottom: 1px solid #eee;
        .month_info{
          float: left;padding: 24px 30px;height: 76px;
          button{width: 28px;height: 28px;border: 0;margin: 0 5px;vertical-align: middle;}
          button:nth-child(1){background: url(../images/icon_calendar_left.png) 0 0 / 100% 100% no-repeat;}
          button:nth-child(2){background: url(../images/icon_calendar_right.png) 0 0 / 100% 100% no-repeat;}
          .week_info{font-size: 20px;color: #333;margin: 0 20px;}
          .week_num{color: #666;}
          .week_ab{font-size: 16px;display: inline-block;width: 28px;height: 28px;color: #fff;border-radius: 2px;text-align: center;line-height: 28px;}
          .week_ab.A{background: #4A90E2;}
          .week_ab.B{background: #5ACE6D;}
        }
        .filter_condition{
          text-align: right;line-height: 76px;padding: 0 30px;
          .select{width: 150px;display: inline-block;height: 36px;vertical-align: middle;line-height: 36px;margin: 10px;}
        }
      }
      .week_calendar{
        text-align: center;
        .table_head{
          height: 60px;border-bottom: 1px solid #eee;display: flex;
          .th{
            flex: 1;height: 100%;border-right: 1px solid #eee;color: #969DBA;padding: 12px;
            .week_name{font-size: 18px;line-height: 18px;}
            .month_num{font-size: 14px;line-height: 18px;}
          }
          .th.act{background: rgba(74,144,226,0.1);}
          .th:last-child{border-right: 0;}
        }
        .table_body{
          height: 229px;position: relative;padding: 4px 0;z-index: 0;overflow: auto;
          &::-webkit-scrollbar {width: 0;height: 0;}
          .table_body_bg{
            position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: -1;
            div{flex: 1;border-right: 1px solid #eee;}
            div.act{background: rgba(74,144,226,0.1);}
            div:last-child{border-right: 0;}
          }
          .li{
            display: flex;height: 60px;
            .task_1{flex: 1;}
            .task_2{flex: 2;}
            .task_3{flex: 3;}
            .task_4{flex: 4;}
            .task_5{flex: 5;}
            .task_6{flex: 6;}
            .task_7{flex: 7;}
            .task_1 > div,
            .task_2 > div,
            .task_3 > div,
            .task_4 > div,
            .task_5 > div,
            .task_6 > div,
            .task_7 > div{padding: 4px 8px;height: 60px;display: table;width: 100%;position: relative;}
            .task_1 > div > div,
            .task_2 > div > div,
            .task_3 > div > div,
            .task_4 > div > div,
            .task_5 > div > div,
            .task_6 > div > div,
            .task_7 > div > div{
              height: 52px;border-radius: 3px;font-size: 16px;color: #fff;display: table-cell;vertical-align: middle;line-height: 17.4px;
              &.no_table_cell{display: block;}
              .title_line{overflow: hidden;padding: 0 5px;max-height: 52px;}
              .time_line{font-size: 12px;display: inline-block;width: 49%;text-align: left;}
              .time_line.right{text-align: right;}
            }
            .task_0{flex: 1;}
          }
        }
      }
    }
    .part_3{
      height: 533px;
      .task_title{
        float: left;width: 323px;height: 100%;overflow-y: auto;
        &::-webkit-scrollbar {width: 0;height: 0;}
        &:empty:after{content: 'no event';padding: 20px;display: block;font-size: 18px;color: #333;}
        .act_date_info{text-align: center;padding: 10px 0;font-size: 16px;}
        .li{
          line-height: 20px;border-bottom: 1px solid #eee;padding: 10px 10px;color: #333;font-size: 14px;
          .label_line{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-left: 20px;position: relative;}
          span{width: 12px;height: 12px;border-radius: 50%;position: absolute;left: 0;top: 50%;transform: translateY(-50%);}
        }
        .li.act{border-left: 2px solid #4A90E2;background: rgba(74,144,226,0.1);}
        .li:hover{cursor: default;}
      }
      .task_detail{
        overflow: hidden;height: 100%;border-left: 3px solid #4A90E2;position: relative;
        &:empty:after{content: 'no event';padding: 20px;display: block;font-size: 18px;color: #333;}
        .tast_detail_left{
          overflow: hidden;padding: 20px 0;height: 100%;
          .item{
            line-height: 24px;padding: 5px 0;
            span{float: left;width: 140px;text-align: right;color: #999;font-size: 14px;margin-right: 10px;}
            div{overflow: hidden;font-size: 14px;color: #333;}
            i{display: inline-block;width: 20px;height: 20px;border-radius: 50%;vertical-align: middle;margin-left: 10px;}
            .icon_attachment{display: inline-block; width: 28px;height: 28px;background: url('../images/icon_attachment.png') 0 0 / 100% 100% no-repeat;}
          }
        }
        .tast_detail_right{
          float: right;width: 260px;padding: 30px 30px 94px 30px;height: 100%;position: relative;
          .title{text-align: center;color: #999;font-size: 16px;margin-bottom: 12px;}
          .margin_top{margin-top: 35px;}
          & > .btn{
            border: 1px solid #4E81BD;color: #4E81BD;font-size: 14px;background: #fff;outline: none;cursor: default;position: relative;padding: 6px 48px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
            .icon{width: 24px;height: 24px;display: inline-block;vertical-align: middle;position: absolute;}
            .icon_member{left: 12px;background: url('../images/icon_member.png') 0 0 / 100% 100% no-repeat;}
            .icon_members{left: 12px;background: url('../images/icon_members.png') 0 0 / 100% 100% no-repeat;}
          }
        }
        .edit_btn{
          position: absolute;width: 100%;bottom: 0;text-align: center;left: 0;padding: 30px;
          .btn{margin: 0 5px;width: 120px;}
          .icon{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;margin-right: 5px;}
          .icon_btn_edit{background: url('../images/icon_btn_edit.png') 50% 50% / auto auto no-repeat;}
          .icon_btn_del{background: url('../images/icon_btn_del.png') 50% 50% / auto auto no-repeat;}
          .creater_info{position: absolute;right: 10px;top: 50%;transform: translateY(-50%);color: #aaa;}
          .creater_info .name{color: #333;}
        }
      }
    }
  }
</style>
