<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @configToggle='configToggle'
             @profileToggle='profileToggle'>
    </headerr>


    <div class="page_body">
      <div class="page_body_box clearfix">
        <crumbs></crumbs>
        <div class="part_1">
          <div class="title">{{ $t("Calendar") }}</div>

          <!-- 日历组件 -->
          <calendar :inputActDateInfo='actDateInfo'
                    :showMonthInfo='false'
                    ref="calendar"
                    @afterInit='afterInit'
                    @syncDataFunc='syncDataFunc'>
          </calendar>

          <div class="title bg_color">{{ $t("Places") }}</div>
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
                {{ $t("Week") }}: <span class="week_num">{{getYearWeek()}}</span>
              </span>
              <span class="week_ab" :class='getABHWeek()'>{{getABHWeek()}}</span>
            </div>
            <div class="filter_condition">
              <span>{{ $t("Category") }}:</span>
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
              <span v-if='data.canEdit'>{{ $t("See as") }}:</span>
              <div class="select" v-if='data.canEdit'>

                <!-- 下拉组件 -->
                <drapdown :input-value='seeCategoryId'
                          :input-name='seeCategoryName'
                          :input-select='seeCategorys'
                          @inputChange='seeCategoryChanged'>
                </drapdown>

              </div>
              <el-tooltip class="item" effect="dark" :content="$t('New Event')" placement="top" :open-delay="1000">
                <button style="width: 140px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" type="button" class="btn btn-primary" @click='newEvent()' v-if='data.canEdit'>
                  <span class="icon_btn_add"></span> {{ $t("New Event") }}
                </button>
              </el-tooltip>
            </div>
          </div>
          <div class="week_calendar">
            <div class="table_head">
              <div class="th" v-for='th in weekTableHead'
                              :class='{"act": th.isActDate, "hasEvent": th.hasEvent}'
                              @click='changeActDateFromWeekview(th)'>
                <div class="week_name">{{ $t(th.week) }}</div>
                <div class="month_num">{{th.date}}</div>
              </div>
            </div>
            <div class="table_body">
              <div class="table_body_bg flex">
                <div v-for='th in weekTableHead' :class='{"act": th.isActDate}' @click='changeActDateFromWeekview(th)'></div>
              </div>
              <template v-for='li in weekTaskList'>
                <div class="li" v-show='showli(li)'>
                  <div v-for='td in li' :class='"task_" + td.spanNum' @click='()=>{if(td.spanNum<=1){changeActDateFromWeekview(td)}}'>
                    <div :title='td.title' v-show='!(td.spanNum==1 && td.time!="All day")'>
                      <div class="content_box" :class='[{"no_table_cell": td.spanNum>1&&td.time!="All day"}]' :style="{backgroundColor: td.color}">
                        <div class="title_line">
                          <div class="time_line">{{td.startTime}}</div><div class="time_line right">{{td.endTime}}</div>
                          {{td.title}}
                        </div>
                      </div>
                      <div class="event_box">
                        <div v-for='(num, $index) in td.spanNum' @click='()=>{if(td.spanNum>1){changeActDateFromWeekview(td, $index)}}'></div>
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
                <span :style='{backgroundColor: td.color}'></span>
                <div class="label_line"></span>{{td.time}}</div>
                <div class="label_line">
                  <el-tooltip effect="dark" :content="td.category" placement="top-start">
                  </el-tooltip>
                  {{td.title}}
                </div>
                <!-- <div class="label_line class_room">{{td.place}} - {{td.room}}</div> -->
              </div>
            </template>
          </div>
          <div class="task_detail" >
            <div v-if='weekTaskListActId!=null'>
              <div class="tast_detail_right">
                <div class="title">{{ $t("Participants") }}</div>
                <div class="scroll_box">
                  <template v-for='(item, index) in eventsUserGroupList'>
                    <button type="button" class="btn btn-block" :class='{act: item.operation_flag == 1}'>
                      <span class="icon icon_members"></span>

                      <el-tooltip class="item" effect="dark" :content="item.group_alias_name || item.group_name" placement="top" :open-delay="1000">
                        <span>{{item.group_alias_name || item.group_name}}</span>
                      </el-tooltip>
                    </button>
                  </template>
                  <template v-for='(item, index) in eventsUserList'>
                    <button type="button" class="btn btn-block" :class='{act: item.operation_flag == 0}'>
                      <span class="icon icon_member"></span>

                      <el-tooltip class="item" effect="dark" :content="item.nom" placement="top" :open-delay="1000">
                        <span>{{item.nom}}</span>
                      </el-tooltip>
                    </button>
                  </template>
                </div>
                <div class="title margin_top" v-if='data.canEdit'>{{ $t("Viewed by") }}</div>
                <div class="scroll_box" v-if='data.canEdit'>
                  <template v-for='(item, index) in eventsGroupList'>
                    <button type="button" class="btn btn-block" :class='{act: item.operation_flag == 1}'>
                      <span class="icon icon_members"></span>

                      <el-tooltip class="item" effect="dark" :content="item.group_alias_name || item.group_name" placement="top" :open-delay="1000">
                        <span>{{item.group_alias_name || item.group_name}}</span>
                      </el-tooltip>
                    </button>
                  </template>
                </div>
              </div>
              <div class="tast_detail_left">
                <div class="item">
                  <span>{{ $t("Title") }}:</span><div>{{taskDetailInfo.title ? taskDetailInfo.title : '-'}}</div>
                </div>
                <div class="item">
                  <span>{{ $t("Category") }}:</span><div>{{taskDetailInfo.categroy ? taskDetailInfo.categroy : '-'}} <i :style='{backgroundColor: taskDetailInfo.color}'></i></div>
                </div>
                <div class="item">
                  <span>{{ $t("Time") }}:</span><div>{{taskDetailInfo.start}} - {{taskDetailInfo.end}}</div>
                </div>
                <div class="item">
                  <span>{{ $t("Place") }}:</span><div>{{taskDetailInfo.place}} - {{taskDetailInfo.room}}</div>
                </div>
                <div class="item">
                  <span>{{ $t("Description") }}:</span><div><span v-html="taskDetailInfo.description || '-'"></span></div>
                </div>
                <div class="item" v-if='taskDetailInfo.fileList.length'>
                  <span>{{ $t("Attachment") }}:</span>
                  <div>
                    <template v-for='file in taskDetailInfo.fileList'>
                      <a class="link_download" target="_blank" download :href="$config.api_path.img_path+file.file_url">{{file.file_name}}<i class="icon_attachment"></i></a><br/>
                    </template>
                  </div>
                </div>
              </div>
              <div class="edit_btn">
                <button type="button" class="btn btn-primary" @click='editEvent()' v-if='data.canEdit'>
                  <span class="icon icon_btn_edit"></span> {{ $t("Edit") }}
                </button>
                <button type="button" class="btn btn-danger" @click='deleteEvent()' v-if='data.canEdit'>
                  <span class="icon icon_btn_del"></span> {{ $t("Delete") }}
                </button>
                <div class="creater_info">
                  <div class="name">{{ $t("Creater") }}</div>
                  <div>{{taskDetailInfo.creater}}</div>
                  <div>{{taskDetailInfo.create_time}}</div>
                </div>
              </div>
            </div>
            <div class="empty" v-else>{{ $t("no event") }}</div>
          </div>
        </div>
      </div>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <!-- 系统设置 -->
      <config ref='config' @openBanner='openBanner' @close='fresh'></config>

      <new-event :show-config='showEvent'
                 :event-type='eventType'
                 :event-id='weekTaskListActId'
                 @freshCalendar="freshCalendar"
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
  import crumbs from '@/components/crumbs'
  import banner from '@/components/banner'
  import profile from '@/components/profile'
  import config from '@/components/configuration'
  import calendar from '@/components/calendar'
  import newEvent from '@/components/newEvent'
  import drapdown from '@/components/drapdown'
  import alert from '@/components/alert'
  import {weekMap, forEach, getMonthWeek, getYearWeek, formatDate, getSStorage, getWeekFromTarget} from '@/script/util'
  import {mapState, mapMutations} from 'vuex'

  export default {
    components: {
      headerr, crumbs, banner, calendar, profile, config, newEvent, drapdown, alert
    },
    data () {
      return {
        data: {
          initOver: false,
          actDateInfoLabel: '',
          role: 0,
          canEdit: false,
          checkActEventId: null,
          schoolYearInfo: []
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
        categoryName: this.$t('All'),
        categoryColor: '',
        categorys: [],
        seeCategoryId: '0',
        seeCategoryName: this.$t('All'),
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
    computed: {
      ...mapState(['test', 'schoolYearInfo'])
    },
    created () {
      // this.data.schoolYearInfo = this.schoolYearInfo;
      if (JSON.stringify(this.$route.query) !== '{}') {
        this.actDateInfo.thisYear = Number(this.$route.query.year)
        this.actDateInfo.thisMonth = Number(this.$route.query.month)
        this.actDateInfo.thisDate = Number(this.$route.query.date)
        this.data.checkActEventId = this.$route.query.id;
      }
      this.data.role = getSStorage('userinfo').role;
      this.data.canEdit = getSStorage('userinfo').role === 0 || getSStorage('userinfo').calendar_flag === 1;
    },
    mounted () {
      if (!this.data.schoolYearInfo.length && this.schoolYearInfo) {
        let actDate = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate})
        for (let i = 0; i < this.schoolYearInfo.length; i++) {
          let item = this.schoolYearInfo[i];
          if (this.$moment(item.start_date) <= actDate && this.$moment(item.end_date) >= actDate) {
            this.data.schoolYearInfo = item;
            break;
          }
        }
      }
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
      }
    },
    methods: {
      ...mapMutations(['SET_TEST']),
      // 初始化页面
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

          let categorys = [{value: '0', name: this.$t('All'), color: ''}]
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
          let seeCategorys = [{value: '0', name: this.$t('All')}]
          forEach(resData.groupsList, (i, item) => {
            if (item.operation_flag == 0) return;
            let obj = {
              value: item.id,
              name: item.group_alias_name || item.group_name
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
          return this.getViews()
        }).then(() => {
          this.freshCalendar();
        })
      },
      // 周视图切换上下周
      switchWeek (targetStr) {
        let targetDate = null
        let actDateTime = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate})
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
                  hasEvent: item3.hasEvent,
                  week: weekMap[Number(i3) + 1].substr(0, 3),
                  date: item3.day,
                  isActDate: item2.day === item3.day
                }
                tempList.push(tempObj)
              })
            }
          })
        })
        this.weekTableHead = tempList;

        // 获取周视图数据
        if (this.data.initOver) {
          this.getWeekInfoData().then(() => {
            this.getViews()
          })
        }
      },
      // 获取周视图数据
      getWeekInfoData () {
        let placesList = []
        this.placesList.map((o) => { if (o.isSelected) { placesList.push('\'' + o.name + '\'') } })

        let self = this
        // console.log(this.actWeekList[6]);
        let params = {
          dayFlag: 0,
          indexFlag: '1',
          startDate: this.$moment({y: this.actWeekList[0].yearValue, M: this.actWeekList[0].monthValue - 1, d: this.actWeekList[0].day}).format('YYYY-MM-DD'),
          endDate: this.$moment({y: this.actWeekList[6].yearValue, M: this.actWeekList[6].monthValue - 1, d: this.actWeekList[6].day}).format('YYYY-MM-DD'),
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
            if (count > 15) return false;
            count++

            for (let i = 0, len = self.weekTableHead.length; i < len; i++) {
              let item = self.weekTableHead[i]
              let tempObj = {}

              for (let i2 = 0, len2 = resData.length; i2 < len2; i2++) {
                let field = JSON.parse(JSON.stringify(resData[i2]))
                if (field === null) continue

                let startDate = this.$moment(field.start_date)
                let taskStartYear = startDate.get('year')
                let taskStartMonth = startDate.get('month') + 1
                let taskStartDate = startDate.get('date')

                if (item.thisYear === taskStartYear && item.thisMonth === taskStartMonth && item.thisDate === taskStartDate) {
                  // 跳过该事件已占的日期
                  i = i + field.days - 1

                  // 重构time数据
                  // 显示顺序从上至下为：跨天allday，跨天非allday, 单天allday，单天非allday
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
                    thisDate: item.thisDate,
                    category: field.category_no
                  }
                  tempObj.source = field

                  // 如果没有选中周视图的具体事件，默认选中第一个，否则选中周视图对应事件
                  if (emptyWeekFlg && (this.data.checkActEventId === null || this.data.checkActEventId === field.id)) {
                    let actDate = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate})

                    if (actDate.isBetween(field.start_date, field.end_date) || actDate.isSame(field.start_date) || actDate.isSame(field.end_date)) {
                      emptyWeekFlg = false
                      this.weekTaskListActId = field.id
                      let createTime = field.create_time.split(' ')
                      this.taskDetailInfo = {
                        title: field.title,
                        creater: field.create_user,
                        create_time: formatDate(createTime[0], 'dd/mm/yy') + ' ' + createTime[1],
                        categroy: field.category_no,
                        color: field.category_remark,
                        place: field.campus_name,
                        room: field.place_name,
                        start: formatDate(field.start_date, 'dd/mm/yy') + ' ' + field.start_time,
                        end: formatDate(field.end_date, 'dd/mm/yy') + ' ' + field.end_time,
                        description: field.description,
                        fileList: field.fileEntities
                      }
                    }
                  }

                  // 匹配数据从原始数据队列中用null占位
                  resData.splice(i2, 1, null)
                  break;
                }
              }

              // 如果未找到匹配数据用预设对象代替
              if (JSON.stringify(tempObj) === '{}') {
                tempObj = { id: '', spanNum: 0, color: '', time: '', title: '', place: '', room: '', startTime: '', endTime: '', thisYear: item.thisYear, thisMonth: item.thisMonth, thisDate: item.thisDate }
              }
              tempList.push(tempObj)
            }
            list.push(tempList)
            self.weekTaskList = list;

            for (let i = 0, len = resData.length; i < len; i++) {
              if (resData[i] != null) {
                tempList = []
                formatWeekInfo()
                break;
              }
            }
          }
          formatWeekInfo()
          if (count === 16) console.log('周视图构造异常！');
          this.formatActDateInfoLabel()

          return res
        })
      },
      // Event列表时间
      formatActDateInfoLabel () {
        let actDate = [this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate].join('-')
        let week = new Date(actDate).getDay()
        this.data.actDateInfoLabel = this.$moment(actDate, 'YYYY-MM-DD').format('DD/MM/YYYY') + ' ' + this.$t(weekMap[week].substr(0, 3))
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
        this.data.checkActEventId = item.id || null

        if (arguments[1] != undefined) {
          let date = this.$moment(item.source.start_date).add(arguments[1], 'days')
          this.actDateInfo.thisYear = date.year()
          this.actDateInfo.thisMonth = date.month() + 1
          this.actDateInfo.thisDate = date.date()
        } else {
          this.actDateInfo.thisYear = item.thisYear
          this.actDateInfo.thisMonth = item.thisMonth
          this.actDateInfo.thisDate = item.thisDate
        }
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
        this.$nextTick(() => {
          this.freshCalendar();
        })
        this.createWeekInfo()
      },
      profileToggle (bol) {
        this.$refs.profile.show = bol;
        this.showEvent = false;
      },
      // 配置弹窗切换事件
      configToggle (bol) {
        this.$refs.config.show = bol;
        this.showEvent = false;
      },
      // Event弹窗关闭刷新数据
      closeEventModal () {
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
        this.showEvent = false
      },
      // 刷新日历的Event flag
      freshCalendar () {
        let reqData = {
          category_id: this.categoryId,
          group_id: this.seeCategoryId,
          place: []
        }
        this.placesList.map((o) => { if (o.isSelected) { reqData.place.push('\'' + o.name + '\'') } })
        if (reqData.place.length > 0) {
          reqData.place = reqData.place.join(',')
        } else {
          reqData.place = '';
        }
        return this.$refs.calendar.initCalendarFlg(reqData);
      },
      categoryChanged (item) {
        this.categoryId = item.value
        this.categoryName = item.name
        this.categoryColor = item.color
        this.getWeekInfoData().then(() => {
          return this.getViews()
        }).then(() => {
          this.freshCalendar();
        })
      },
      seeCategoryChanged (item) {
        this.seeCategoryId = item.value
        this.seeCategoryName = item.name
        this.seeCategoryColor = item.color
        this.getWeekInfoData().then(() => {
          return this.getViews()
        }).then(() => {
          this.freshCalendar();
        })
      },
      // 点击任务列表同步Event详情
      weekTaskListActIndexChanged (o) {
        let item = o.source
        this.weekTaskListActId = this.data.checkActEventId = item.id
        let createTime = item.create_time.split(' ')
        this.taskDetailInfo = {
          title: item.title,
          creater: item.create_user,
          create_time: formatDate(createTime[0], 'dd/mm/yy') + ' ' + createTime[1],
          categroy: item.category_no,
          color: item.category_remark,
          place: item.campus_name,
          room: item.place_name,
          start: formatDate(item.start_date, 'dd/mm/yy') + ' ' + item.start_time,
          end: formatDate(item.end_date, 'dd/mm/yy') + ' ' + item.end_time,
          description: item.description,
          fileList: item.fileEntities
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
        return this.$http.post('/sharedcalendarSettingCtl/event/getEventsDetailByEventId', {
          data: JSON.stringify({event_id: this.weekTaskListActId})
        }).then((res) => {
          if (res.success) {
            let resData = res.data

            self.eventsUserGroupList = resData.eventsUserGroupList
            self.eventsUserList = resData.eventsUserList
            self.eventsGroupList = resData.eventsGroupList
          }
          return res;
        })
      },
      // 新建Event
      newEvent () {
        this.eventType = 'new'
        this.showEvent = true
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
          this.$http.post('/sharedcalendarSettingCtl/event/editEvent', {
            data: JSON.stringify({id: this.weekTaskListActId, operation_flag: -1})
          }).then((res) => {
            if (res.success) {
              let banner = {
                status: 'SUCCESS',
                msg: 'Delete Succeeded'
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
      getABHWeek () {
        let row = this.actWeekList;
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
      fresh () {
        this.getWeekInfoData().then(() => {
          this.getViews()
        })
      },
      getYearWeek () {
        return getYearWeek(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  @import '../styles/homepage';
</style>
