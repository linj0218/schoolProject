<template>
  <div id="body" v-cloak>
    <headerr @configurationToggleFunc='configurationToggleFunc'></headerr>
    <div class="page_body">
      <div class="page_body_box clearfix">
        <div class="part_1">
          <div class="title">Calendar</div>
          
          <!-- 日历组件 -->
          <calendar :inputActDateInfo='actDateInfo'
                    :showMonthInfo='false'
                    @afterInit='syncDataFunc'
                    @syncDataFunc='syncDataFunc'>
          </calendar>

          <div class="title bg_color">Places</div>
          <div class="places">
            <button type="button" class="btn btn-block"
                    v-for='place in placesList'
                    :class='place.isSelected ? "act" : ""'
                    @click='placeSelectedChange(place)'>
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
              <button type="button" class="btn btn-primary" @click='()=>{this.showEvent=true}'>
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
                <div v-for='th in weekTableHead' :class='{"act": th.isActDate}'></div>
              </div>
              <div class="li" v-for='li in weekTaskList'>
                <div v-for='td in li' :class='"task_" + td.spanNum'><div><div :class='td.color'>{{td.time}} {{td.title}}</div></div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="part_3">
          <div class="task_title">
            <template v-for='li in weekTaskList'>
              <div class="li container-fluid"
                   v-for='td in li'
                   v-if='td.spanNum!==0'
                   :class='{"act": td.id==weekTaskListActId}'
                   @click='weekTaskListActIndexChanged(td)'>
                <div class="col-lg-6"><span :class='td.color'></span>{{td.time}}</div>
                <div class="col-lg-6">{{td.place}}</div>
                <div class="col-lg-12">{{td.title}}</div>
              </div>
            </template>
          </div>
          <div class="task_detail">
            <div class="tast_detail_left">
              <div class="item">
                <span>Title:</span><div>{{taskDetailInfo.title}}</div>
              </div>
              <div class="item">
                <span>Categroy:</span><div>{{taskDetailInfo.categroy}} <i></i></div>
              </div>
              <div class="item">
                <span>Place:</span><div>{{taskDetailInfo.place}}</div>
              </div>
              <div class="item">
                <span>Start:</span><div>{{taskDetailInfo.start}}</div>
              </div>
              <div class="item">
                <span>End:</span><div>{{taskDetailInfo.end}}</div>
              </div>
              <div class="item">
                <span>Description:</span><div>{{taskDetailInfo.description}}</div>
              </div>
            </div>
            <div class="tast_detail_right">
              <div class="title">Participants</div>
              <button type="button" class="btn btn-block"><span></span>Administration o...</button>
              <button type="button" class="btn btn-block"><span></span>Kan Chen</button>
              <div class="title margin_top">Viewed by</div>
              <button type="button" class="btn btn-block">Administration of Qi...</button>
              <button type="button" class="btn btn-block">Educational Director</button>
              <button type="button" class="btn btn-block">Administration of Pud...</button>
              <button type="button" class="btn btn-block">Secondary school of...</button>
            </div>
          </div>
        </div>
      </div>

      <configuration :showConfig='showConfig'
                     @configurationToggleFunc='configurationToggleFunc'>
      </configuration>

      <new-event :showConfig='showEvent'
                 @eventToggleFunc='eventToggleFunc'>
      </new-event>
      
    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import configuration from '@/components/configuration'
  import calendar from '@/components/calendar'
  import newEvent from '@/components/newEvent'
  import drapdown from '@/components/drapdown'
  import {weekMap, forEach, getMonthWeek, getYearWeek} from '@/plugins/util'

  export default {
    components: {
      headerr, calendar, configuration, newEvent, drapdown
    },
    data () {
      return {
        // part_1 ------------------------------------------------------------
        // Calendar
        calendarList: null,
        thisDateInfo: null,
        actDateInfo: { // 目标日期
          thisYear: new Date().getFullYear(),
          thisMonth: new Date().getMonth() + 1,
          thisDate: new Date().getDate()
        },
        // Places
        placesList: [
          {isSelected: true, name: 'Campus Qingpu', value: ''},
          {isSelected: true, name: 'Campus Exterieur', value: ''},
          {isSelected: true, name: 'Campus Pudong', value: ''},
          {isSelected: true, name: 'Campus Exterieur', value: ''},
          {isSelected: true, name: 'Campus Pudong', value: ''}
        ],
        // part_2 ------------------------------------------------------------
        // Week info
        categoryId: '0',
        categoryName: 'All',
        categorys: [
          {value: '0', name: 'All'},
          {value: '1', name: 'option1'}
        ],
        seeCategoryId: '0',
        seeCategoryName: 'All',
        seeCategorys: [
          {value: '0', name: 'All'},
          {value: '1', name: 'option1'}
        ],
        weekTableHead: [
        ],
        weekTaskListActId: null,
        weekTaskList: [
          [
            {id: '1', spanNum: 1, color: 'bg_color_3', time: 'All day', title: 'Title name', place: 'QingPu'},
            {id: '2', spanNum: 2, color: 'bg_color_8', time: 'All day', title: 'Title name', place: 'QingPu'},
            {id: '3', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '4', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '5', spanNum: 1, color: 'bg_color_3', time: 'All day', title: 'Title name', place: 'QingPu'},
            {id: '6', spanNum: 1, color: 'bg_color_1', time: 'All day', title: 'Title name', place: 'QingPu'}
          ],
          [
            {id: '7', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '8', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '9', spanNum: 2, color: 'bg_color_7', time: 'All day', title: 'Title name', place: 'QingPu'},
            {id: '10', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '11', spanNum: 1, color: 'bg_color_5', time: 'All day', title: 'Title name', place: 'QingPu'},
            {id: '12', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''}
          ],
          [
            {id: '13', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '14', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '15', spanNum: 2, color: 'bg_color_7', time: 'All day', title: 'Title name', place: 'QingPu'},
            {id: '16', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '17', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''},
            {id: '18', spanNum: 0, color: 'bg_color_1', time: '', title: '', place: ''}
          ]
        ],
        // part_3 ------------------------------------------------------------
        // Task info
        taskDetailInfo: {
          title: 'Title name',
          categroy: 'lable2',
          place: 'Qingpu ClassRoom 102',
          start: '2017-09-19',
          end: '2017-09-20',
          description: 'Occasionally, Dad would get out his mandolin and play for the family. We three children: Trisha, Monte and I, George Jr., would often sing along. Songs such as the Tennessee Waltz'
        },
        // 配置弹窗
        showConfig: false,
        // 新建事件弹窗
        showEvent: false
      }
    },
    mounted () {
    },
    methods: {
      // 地址切换事件
      placeSelectedChange (place) {
        place.isSelected = !place.isSelected
      },
      switchWeek (targetStr) {
        let actDateTime = new Date(this.actDateInfo.thisYear, this.actDateInfo.thisMonth, this.actDateInfo.thisDate).getTime()
        let targetDate = null
        if (targetStr === 'prev') {
          targetDate = new Date(actDateTime - 7 * 24 * 3600 * 1000)
        } else {
          targetDate = new Date(actDateTime + 7 * 24 * 3600 * 1000)
        }
        this.actDateInfo.thisYear = targetDate.getFullYear()
        this.actDateInfo.thisMonth = targetDate.getMonth()
        this.actDateInfo.thisDate = targetDate.getDate()
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
                  thisYear: this.actDateInfo.thisYear,
                  thisMonth: this.actDateInfo.thisMonth,
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
      },
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
        this.createWeekInfo()
      },
      // 配置弹窗切换事件
      configurationToggleFunc () {
        this.showConfig = !this.showConfig
      },
      // 新建事件弹窗切换事件
      eventToggleFunc () {
        this.showEvent = !this.showEvent
      },
      categoryChanged (item) {
        this.categoryId = item.value
        this.categoryName = item.name
      },
      seeCategoryChanged (item) {
        this.seeCategoryId = item.value
        this.seeCategoryName = item.name
      },
      weekTaskListActIndexChanged (item) {
        this.weekTaskListActId = item.id
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
      background: #fff;float: left;width: 420px;height: 918px;margin-right: 20px;box-shadow: 0 0 1px #ddd;
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
          .select{width: 90px;display: inline-block;height: 36px;vertical-align: middle;line-height: 36px;margin: 0 20px;}
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
          min-height: 229px;position: relative;padding: 4px 0;z-index: 0;
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
            .task_1 > div,
            .task_2 > div{padding: 4px 8px;height: 100%;display: table;width: 100%;}
            .task_1 > div > div,
            .task_2 > div > div{height: 100%;border-radius: 3px;font-size: 18px;color: #fff;display: table-cell;vertical-align: middle;line-height: 18px;padding: 0 25px;}
            .task_0{flex: 1;}
          }
        }
      }
    }
    .part_3{
      height: 533px;
      .task_title{
        float: left;width: 323px;height: 100%;overflow-y: auto;
        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
        .li{
          height: 78px;line-height: 29px;border-bottom: 1px solid #eee;padding: 10px 20px;color: #003;font-size: 16px;
          span{width: 12px;height: 12px;border-radius: 50%;position: absolute;left: 0;top: 50%;transform: translateY(-50%);}
        }
        .li.act{border-left: 2px solid #4A90E2;background: rgba(74,144,226,0.1);}
        .li:hover{border-left: 2px solid #4A90E2;background: rgba(74,144,226,0.1);cursor: default;}
      }
      .task_detail{
        overflow: hidden;height: 100%;border-left: 3px solid #4A90E2;
        .tast_detail_left{
          float: left;width: 500px;padding: 20px 0;height: 100%;
          .item{
            line-height: 24px;padding: 10px 0;
            span{float: left;width: 140px;text-align: right;color: #999;font-size: 16px;margin-right: 10px;}
            div{overflow: hidden;font-size: 18px;color: #333;}
            i{display: inline-block;width: 20px;height: 20px;background: #FFAC00;border-radius: 50%;vertical-align: middle;}
          }
        }
        .tast_detail_right{
          overflow: hidden;padding: 30px;
          .title{text-align: center;color: #999;font-size: 16px;margin-bottom: 12px;}
          .margin_top{margin-top: 35px;}
          .btn{border: 1px solid #4E81BD;color: #4E81BD;font-size: 14px;background: #fff;outline: none;cursor: default;}
        }
      }
    }
  }
</style>