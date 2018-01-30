<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @appSettingToggle='appSettingToggle'
             @profileToggle='profileToggle'>
    </headerr>

    <div class="page_body">
      <div class="page_body_box clearfix">
        <div class="part_1">
          <div class="apps container-fluid">
            <!-- <div class="app col-lg-4" v-for='app in applicationList'> -->
            <template v-for='app in applicationList'>
              <a class="app col-xs-4 col-sm-4 col-md-4 col-lg-4" target="_blank" :href='app.baseaddress' :title='app.nom' :class='{small_font: app.small_font}'>
                <div class="icon">
                  <img v-if='app.picUrl' :src='$config.api_path.img_path + app.picUrl'>
                  <img v-if='!app.picUrl' src="../images/icon_default.png">
                </div><div class="text">{{app.nom}}</div>
              </a>
            </template>
          </div>
        </div>
        <div class="part_3">
          <div class="deps">
            <div class="media" v-for='dep in departmentList'>
              <div class="media-left media-middle">
                <a href="javascript:void(0);">
                  <img class="media-object" :src='dep.imgUrl' alt="">
                </a>
              </div>
              <div class="media-body">
                <h4 class="media-heading">{{dep.title}}</h4>
                {{dep.description}}
              </div>
            </div>
            <div class="title">
              <div class="nav_btns"><a href="javascript:void(0);">&lt;</a>&nbsp;&nbsp;<a href="javascript:void(0);">&gt;</a></div>
            </div>
          </div>
        </div>
        <div class="part_2">
          <div class="calendar">
            <router-link :to='{path: "/homepage"}' tag='div' class="title">Calendar</router-link>

            <!-- 日历组件 -->
            <calendar :inputActDateInfo='actDateInfo'
                      @afterInit='syncDataFunc'
                      @syncDataFunc='syncDataFunc'>
            </calendar>

            <div class="week_cal">
              <div v-for='(li, index) in weekList'>
                <div class="drawer_title" @click='changeDrawerActIndex(index, li)' :class='drawerActIndex==index?"act":""'>{{li.week}}, {{li.date}} {{li.month}}</div>
                <div class="drawer_list">
                  <div>

                    <router-link tag='div' class="flex drawer_li"
                                 :to='{path: "/homepage", query: {year: actDateInfo.thisYear, month: actDateInfo.thisMonth, date: actDateInfo.thisDate}}'
                                 v-for='task in li.taskList'
                                 :key='task.id'>
                      <div><span class="point_icon" :class='task.color'></span></div>
                      <div>{{task.time}}</div>
                      <div>{{task.name}}</div>
                      <div><span class="icon_right"></span></div>
                    </router-link>

                  </div>
                </div>
              </div>
            </div>
            <router-link :to='{path: "/homepage"}' tag='a' class="homePageLink"><i></i>Show Details</router-link>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <banner ref='banner'></banner>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <!-- APP设置 -->
      <app-setting ref='appSetting' @openBanner='openBanner' @close='fresh'></app-setting>

    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import banner from '@/components/banner'
  import calendar from '@/components/calendar'
  import profile from '@/components/profile'
  import appSetting from '@/components/appSetting'
  import {weekMap, monthMap, forEach, formatDate} from '@/plugins/util'
  export default {
    components: {
      headerr, banner, calendar, profile, appSetting
    },
    data () {
      return {
        drawerActIndex: 0,
        calendarList: null,
        thisDateInfo: null,
        actDateInfo: { // 目标日期
          thisYear: new Date().getFullYear(),
          thisMonth: new Date().getMonth() + 1,
          thisDate: new Date().getDate()
        },
        // 当前日期所属的周数据
        actWeekList: [],
        weekList: [],
        // Application
        applicationList: [
        ],
        // Department
        departmentList: [
          {imgUrl: '', title: 'HR', description: 'Lorem ipsum dolor sit amet, consectectur adipiscing elit.Aeneam euismod bibendum laoreet.Proin gravida dolor sit amer lacus accumsan et viverra justo commodo,Proin sodales pulvinartem'},
          {imgUrl: '', title: 'IT', description: 'Lorem ipsum dolor sit amet, consectectur adipiscing elit.Aeneam euismod bibendum laoreet.Proin gravida dolor sit amer lacus accumsan et viverra justo commodo,Proin sodales pulvinartem'},
          {imgUrl: '', title: 'Doctor', description: 'Lorem ipsum dolor sit amet, consectectur adipiscing elit.Aeneam euismod bibendum laoreet.Proin gravida dolor sit amer lacus accumsan et viverra justo commodo,Proin sodales pulvinartem'}
        ],
        // 配置弹窗
        showDialog: false
      }
    },
    mounted () {
      this.initAppList()
    },
    methods: {
      init () {
        let startDate = this.actWeekList[0]
        let endDate = this.actWeekList[6]
        let params = {
          dayFlag: 0,
          place: '',
          indexFlag: '0',
          category_id: 0,
          group_id: 0,
          startDate: formatDate([startDate.yearValue, startDate.monthValue, startDate.day].join('-'), 'yyyy-mm-dd'),
          endDate: formatDate([endDate.yearValue, endDate.monthValue, endDate.day].join('-'), 'yyyy-mm-dd')
        }
        this.$http.post('/sharedcalendarCtl/event/searchOneDayEvents', {
          data: JSON.stringify(params)
        }).then((res) => {
          let resData = res.data

          // console.log(this.weekList, resData);
          // TODO更新周视图数据
          for (let i = 0, len = this.weekList.length; i < len; i++) {
            let item = this.weekList[i]
            let taskList = []
            for (let i2 = 0, len2 = resData.length; i2 < len2; i2++) {
              var targetDate = this.$moment(item.dateStr);
              var startDate = this.$moment(resData[i2].start_date);
              var endDate = this.$moment(resData[i2].end_date);
              if (targetDate >= startDate && targetDate <= endDate) {
                taskList.push({
                  id: resData[i2].id,
                  time: resData[i2].day_flag === 1 ? 'All day' : resData[i2].start_time + '-' + resData[i2].end_time,
                  name: resData[i2].title,
                  color: resData[i2].category_remark
                })
              }
            }
            item.taskList = taskList
          }
        })
      },
      // 创建日历下周任务视图
      createWeekInfo () {
        let tempList = []
        forEach(this.actWeekList, (i, item) => {
          if (item.monthValue === this.actDateInfo.thisMonth && item.day === this.actDateInfo.thisDate) {
            this.drawerActIndex = i
          }
          let tempObj = {}
          tempObj = {
            dateStr: this.$moment({y: item.yearValue, M: item.monthValue - 1, d: item.day}).format('YYYY-MM-DD'),
            week: weekMap[Number(i) + 1].substr(0, 3),
            date: item.day,
            month: monthMap[item.monthValue].substr(0, 3),
            taskList: []
          }
          tempList.push(tempObj)
        })

        this.weekList = tempList
      },
      // 切换周视图抽屉
      changeDrawerActIndex (i, item) {
        this.drawerActIndex = i

        for (let i = 0, len = this.actWeekList.length; i < len; i++) {
          let field = this.actWeekList[i]
          if (item.date === field.day) {
            this.actDateInfo.thisYear = field.yearValue
            this.actDateInfo.thisMonth = field.monthValue
            this.actDateInfo.thisDate = field.day
            return true
          }
        }
      },
      syncDataFunc (calendarList, thisDateInfo, actDateInfo) {
        this.calendarList = calendarList
        this.thisDateInfo = thisDateInfo
        this.actDateInfo = actDateInfo
        if (arguments[3]) {
          this.actWeekList = arguments[3]
        }
        this.createWeekInfo()
        this.init()
      },
      profileToggle (bol) {
        this.$refs.profile.show = bol;
      },
      // 配置弹窗切换事件
      appSettingToggle (bol) {
        this.$refs.appSetting.show = bol;
      },
      openBanner (res) {
        this.$refs.banner.show(res.msg)
      },
      fresh () {
        this.initAppList()
      },
      // 初始化appList列表
      initAppList () {
        let param = '{"apps": ""}'
        this.$http.post('/appCtl/app/appList', {
          data: param
        }).then((res) => {
          this.applicationList = res.data;
          for (let i = 0; i < this.applicationList.length; i++) {
            if (this.applicationList[i].nom.length > 15) {
              this.applicationList[i].small_font = true;
            }
          }
        })
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
  @import '../styles/mixin';
  #body{height: 100%;background: #f5f5f5;overflow: auto;}
  .page_body{
    padding: 30px 180px;position: relative;
    .part_1, .part_3{float: left;width: 63%;background: #fff;box-shadow: 0 0 1px #ddd;margin-right: 20px;margin-bottom: 20px;}
    .part_1{
      padding: 12px;
      .apps{
        height: 100%;padding: 0;
        .app{
          background: #eee;box-shadow: 0 0 1px #fff;color: #999;font-size: 22px;height: 140px;text-align: left;transition:all 0.5s; -webkit-transition:all 0.5s;text-decoration: none;overflow: hidden;position: relative;display: table;
          .icon{
            position: absolute;width: 80px;height: 80px;background: #fff;border-radius: 50%;overflow: hidden;vertical-align: middle;margin-right: 15px;top: 50%;transform: translateY(-50%);
            img{width: 100%;height: 100%;position: absolute;left: 0;top: 0;}
            img.icon_on{z-index: -1;}
          }
          .text{display: table-cell;vertical-align: middle;padding-left: 90px;}
        }
        .app.small_font{font-size: 19px;}
        .app:hover{
          color: #fff;background: #4E81BD;
          img.icon_on{z-index: 1;}
        }
      }
    }
    .part_2{
      overflow: hidden;background: #fff;box-shadow: 0 0 1px #ddd;min-height: 900px;padding: 0 20px;
      .calendar{
        .title{font-size: 40px;color: #4A90E2;text-align: center;height: 85px;line-height: 85px;border-bottom: 1px solid #f5f5f5;cursor: pointer;}
        .title:hover{text-decoration: underline;}
        .homePageLink{
          i{display: inline-block;width: 20px;height: 20px;background: url('../images/icon_homepagelink.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;margin-right: 10px;}
          right: 25px;font-size: 16px;color: #333;display: block;text-align: right;padding: 10px 20px;
        }
        .week_cal{
          padding: 0 20px;color: #003;
          .drawer_title{background: rgba(74,144,226,0.1);line-height: 40px;font-size: 18px;padding-left: 16px;border-bottom: 1px solid #fff;border-left: 4px solid #4A90E2;}
          .drawer_list{
            padding: 0 10px;font-size: 16px;color: #003;height: 0;overflow: hidden;
            & > div{padding: 5px 0;}
            & > div:empty:after{content: 'no event';padding: 10px;display: block;font-size: 18px;color: #333;}
            .point_icon{display: inline-block;width: 12px;height: 12px;border-radius: 50%;}
            // .drawer_li:nth-child(3n+1) .point_icon{background: #FFAC00;}
            // .drawer_li:nth-child(3n+2) .point_icon{background: #7873CF;}
            // .drawer_li:nth-child(3n+3) .point_icon{background: #00C1DF;}
            .drawer_li{line-height: 24px;padding: 7px 10px;}
            .drawer_li:hover{background: #eee;}
            .drawer_li div{
              flex: 5;text-align: left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
              .icon_right{display: inline-block;width: 24px;height: 24px;background: url('../images/icon_right.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;}
            }
            .drawer_li div:first-child, .drawer_li div:last-child{flex: 1;}
            .drawer_li div:last-child{color: #999;text-align: right;}
          }
          .drawer_title.act + .drawer_list{height: auto;}
        }
      }
    }
    .part_3{
      position: relative;
      .deps{
        padding: 0 30px 60px 30px;
        .title{
          text-align: center;height: 60px;border-top: 1px solid #f5f5f5;position: relative;margin-top: 15px;
          .nav_btns{
            position: absolute;right: 0;bottom: 10px;line-height: 30px;font-size: 18px;
            a{display: inline-block;width: 30px;height: 30px;color: #666;box-shadow: 0 0 1px #999;background: #f5f5f5;}
          }
        }
        .media{
          padding-left: 10px;
          img{width: 220px;height: 120px;background: #ddd;}
        }
        .media:first-child{margin-top: 15px;}
      }
    }
    .part_3:after{
      content: 'Under Construction ...'; position: absolute;width: 100%; height: 100%;background: rgba(144,144,144, 1);top: 0;left: 0;color: #fff;text-align: center;line-height: 540px;font-size: 42px;
    }
  }
</style>
