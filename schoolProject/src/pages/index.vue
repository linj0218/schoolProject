<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @configurationToggleFunc='configurationToggleFunc'></headerr>

    <div class="page_body">
      <div class="page_body_box clearfix">
        <div class="part_1">
          <div class="apps container-fluid">
            <div class="app col-lg-4" v-for='app in applicationList'><div class="icon"></div>{{app.name}}</div>
          </div>
        </div>
        <div class="part_3">
          <div class="deps">
            <div class="title">
              Department
              <div class="nav_btns"><a href="javascript:void(0);">&lt;</a>&nbsp;&nbsp;<a href="javascript:void(0);">&gt;</a></div>
            </div>
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
          </div>
        </div>
        <div class="part_2">
          <div class="calendar">
            <div class="title">Calendar</div>
            
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
                                 :to='{path: "/homepage"}'
                                 v-for='task in li.taskList'
                                 :key='task.id'>
                      <div><span class="point_icon"></span></div>
                      <div>{{task.time}}</div>
                      <div>{{task.name}}</div>
                      <div>{{task.address}}</div>
                      <div><span class="icon_right"></span></div>
                    </router-link>
                    <!-- <div class="flex drawer_li" v-for='task in li.taskList'>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
            <router-link :to='{path: "/homepage"}' tag='a' class="homePageLink">Weekly view >></router-link>
          </div>
        </div>
      </div>

      <configuration :showConfig='showConfig'
                     @configurationToggleFunc='configurationToggleFunc'>
      </configuration>

    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import calendar from '@/components/calendar'
  import configuration from '@/components/configuration'
  import {weekMap, monthMap, forEach} from '@/plugins/util'
  export default {
    components: {
      headerr, calendar, configuration
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
        weekList: [],
        // Application
        applicationList: [
          {value: '', name: 'Application'},
          {value: '', name: 'Application'},
          {value: '', name: 'Application'},
          {value: '', name: 'Application'},
          {value: '', name: 'Application'},
          {value: '', name: 'Application'}
        ],
        // Department
        departmentList: [
          {imgUrl: '', title: 'HR', description: 'Lorem ipsum dolor sit amet, consectectur adipiscing elit.Aeneam euismod bibendum laoreet.Proin gravida dolor sit amer lacus accumsan et viverra justo commodo,Proin sodales pulvinartem'},
          {imgUrl: '', title: 'IT', description: 'Lorem ipsum dolor sit amet, consectectur adipiscing elit.Aeneam euismod bibendum laoreet.Proin gravida dolor sit amer lacus accumsan et viverra justo commodo,Proin sodales pulvinartem'},
          {imgUrl: '', title: 'Doctor', description: 'Lorem ipsum dolor sit amet, consectectur adipiscing elit.Aeneam euismod bibendum laoreet.Proin gravida dolor sit amer lacus accumsan et viverra justo commodo,Proin sodales pulvinartem'}
        ],
        // 配置弹窗
        showConfig: false
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
      },
      // 创建日历下周任务视图
      createWeekInfo () {
        let tempList = []
        forEach(this.calendarList, (i, item) => {
          forEach(item, (i2, item2) => {
            if (item2.monthValue === this.actDateInfo.thisMonth && item2.day === this.actDateInfo.thisDate) {
              this.drawerActIndex = i2
              forEach(this.calendarList[i], (i3, item3) => {
                let tempObj = {}
                tempObj = {
                  week: weekMap[Number(i3) + 1].substr(0, 3),
                  date: item3.day,
                  month: monthMap[item3.monthValue].substr(0, 3),
                  taskList: [
                    {id: '1', time: '08:00-10:00', name: 'Title name', address: 'Qing Pu'},
                    {id: '2', time: '08:00-10:00', name: 'Title name', address: 'Qing Pu'},
                    {id: '3', time: '08:00-10:00', name: 'Title name', address: 'Qing Pu'}
                  ]
                }
                tempList.push(tempObj)
              })
            }
          })
        })
        this.weekList = tempList
      },
      // 切换周视图抽屉
      changeDrawerActIndex (i, item) {
        this.drawerActIndex = i
        // console.log(item)
      },
      syncDataFunc (calendarList, thisDateInfo, actDateInfo) {
        this.calendarList = calendarList
        this.thisDateInfo = thisDateInfo
        this.actDateInfo = actDateInfo
        // console.log(calendarList, thisDateInfo, actDateInfo)
        this.createWeekInfo()
      },
      // 配置弹窗切换事件
      configurationToggleFunc () {
        this.showConfig = !this.showConfig
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
      height: 304px;padding: 12px;
      .apps{
        height: 100%;padding: 0;
        .app{
          height: 50%;background: #eee;box-shadow: 0 0 1px #fff;color: #999;font-size: 22px;line-height: 140px;text-align: center;transition:all 0.5s; -webkit-transition:all 0.5s;
          .icon{display: inline-block;width: 80px;height: 80px;background: #fff;border-radius: 50%;vertical-align: middle;margin-right: 15px;}
        }
        .app:hover{color: #fff;background: #4E81BD;}
      }
    }
    .part_2{
      overflow: hidden;background: #fff;box-shadow: 0 0 1px #ddd;height: 900px;padding: 0 20px;
      .calendar{
        .title{font-size: 40px;color: #4A90E2;text-align: center;height: 85px;line-height: 85px;border-bottom: 1px solid #f5f5f5;}
        .homePageLink{right: 25px;font-size: 20px;color: #00f;display: block;text-align: right;padding: 0 20px;}
        .week_cal{
          padding: 0 20px;color: #003;
          .drawer_title{background: rgba(74,144,226,0.1);line-height: 40px;font-size: 18px;padding-left: 16px;border-bottom: 1px solid #fff;border-left: 4px solid #4A90E2;}
          .drawer_list{
            padding: 0 20px;font-size: 16px;color: #003;height: 0;overflow: hidden;
            & > div{padding: 5px 0;}
            .point_icon{display: inline-block;width: 12px;height: 12px;border-radius: 50%;}
            .drawer_li:nth-child(3n+1) .point_icon{background: #FFAC00;}
            .drawer_li:nth-child(3n+2) .point_icon{background: #7873CF;}
            .drawer_li:nth-child(3n+3) .point_icon{background: #00C1DF;}
            .drawer_li{line-height: 24px;}
            .drawer_li:hover{background: #eee;}
            .drawer_li div{
              flex: 4;text-align: center;
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
      .deps{
        padding: 0 30px 60px 30px;
        .title{
          font-size: 40px;color: #4A90E2;text-align: center;height: 85px;line-height: 85px;border-bottom: 1px solid #f5f5f5;position: relative;
          .nav_btns{
            position: absolute;right: 0;bottom: 10px;line-height: 30px;font-size: 18px;
            a{display: inline-block;width: 30px;height: 30px;color: #666;box-shadow: 0 0 1px #999;background: #f5f5f5;}
          }
        }
        .media{
          padding-left: 10px;
          img{width: 220px;height: 120px;background: #ddd;}
        }
      }
    }
  }
</style>