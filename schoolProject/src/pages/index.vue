<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @appSettingToggle='appSettingToggle'
             @profileToggle='profileToggle'>
    </headerr>

    <div class="page_body">
      <div class="page_body_box clearfix">
        <extend-search></extend-search>
        <div class="part_1">
          <div class="apps container-fluid">
            <!-- <div class="app col-lg-3" v-for='app in applicationList'> -->
            <template v-for='app in applicationList'>
              <a class="app col-xs-3 col-sm-3 col-md-3 col-lg-3" target="_blank" :href='app.baseaddress' :title='app.nom' :class='{small_font: app.small_font}'>
                <div class="icon">
                  <img v-if='app.picUrl' :src='$config.api_path.img_path + app.picUrl'>
                  <img v-if='!app.picUrl' src="../images/icon_default.png">
                </div><div class="text">{{app.nom}}</div>
              </a>
            </template>
          </div>
        </div>
        <div class="part_3">
          <template v-for="memo in memoList">
            <memo :titleType="memo.titleType" :memo="memo" @openSide="openMemoSide"></memo>
          </template>
        </div>
        <div class="part_2">
          <div class="calendar">
            <router-link :to='{path: "/homepage"}' tag='div' class="title">{{ $t("Calendar") }}</router-link>

            <!-- 日历组件 -->
            <calendar :inputActDateInfo='actDateInfo'
                      ref="calendar"
                      @afterInit='afterInit'
                      @syncDataFunc='syncDataFunc'>
            </calendar>

            <div class="week_cal">
              <div v-for='(li, index) in weekList'>
                <div class="drawer_title" @click='changeDrawerActIndex(index, li)' :class='{"act": li.openFlg}'>{{ $t(li.week) }}, {{li.date}} {{ $t(li.month) }}</div>
                <div class="drawer_list">
                  <div v-if="li.taskList.length">

                    <router-link tag='div' class="drawer_li"
                                 :to='{path: "/homepage", query: {year: actDateInfo.thisYear, month: actDateInfo.thisMonth, date: actDateInfo.thisDate, id: task.id}}'
                                 v-for='task in li.taskList'
                                 :key='task.id'>
                      <div class="li_1">
                        <el-tooltip effect="dark" :content="task.category" placement="top-start">
                          <span class="point_icon" :style='{backgroundColor: task.color}'></span>
                        </el-tooltip>
                      </div>
                      <div>
                        <el-tooltip effect="dark" :content="task.time" placement="top-start" :open-delay="1000">
                          <span class="info">{{task.time}}</span>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="task.name" placement="top-start" :open-delay="1000">
                          <span class="info">{{task.name}}</span>
                        </el-tooltip>
                      </div>
                      <div>
                        <el-tooltip effect="dark" :content="task.classRoom" placement="top-start" :open-delay="1000">
                          <span>{{task.classRoom}}</span>
                        </el-tooltip>
                      </div>
                    </router-link>

                  </div>
                  <div class="empty" v-else>
                    {{ $t("no event") }}
                  </div>
                </div>
              </div>
            </div>
            <router-link :to='{path: "/homepage"}' tag='a' class="homePageLink"><i></i>{{ $t("Show Details") }}</router-link>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <banner ref='banner'></banner>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <!-- APP设置 -->
      <app-setting ref='appSetting' @openBanner='openBanner' @close='fresh'></app-setting>

      <!-- 备忘录 -->
      <memo-side ref='memoSide' :memoList="memoSideList"></memo-side>

    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import banner from '@/components/banner'
  import calendar from '@/components/calendar'
  import profile from '@/components/profile'
  import appSetting from '@/components/appSetting'
  import extendSearch from '@/components/extendSearch'
  import memo from '@/components/memoModel'
  import memoSide from '@/components/memoSide'

  import { mapGetters } from 'vuex'
  import {weekMap, monthMap, forEach, formatDate} from '@/script/util'
  export default {
    components: {
      headerr, banner, calendar, profile, appSetting, extendSearch, memo, memoSide
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
        // Memo
        memoList: [],
        // 配置弹窗
        showDialog: false,
        isFirst: 0 // 首次加载页面展开当前日期后的所有时间
      }
    },
    watch: {
      autoLoginFinish () {
        if (this.autoLoginFinish) {
          this.initAppList();
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo',
        autoLoginFinish: 'autoLoginFinish',
        memoSideList: 'memoSideList'
      })
    },
    mounted () {
      this.initAppList();
      this.getTopMemo();
      // 关闭mode side
      if (this.$route.query.memoside == false) {
        this.$store.dispatch('setMemoSide', false);
      }
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
                  classRoom: resData[i2].campus_name + ' - ' + resData[i2].place_name,
                  category: resData[i2].category_no,
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
        let tempList = [];
        forEach(this.actWeekList, (i, item) => {
          if (item.monthValue === this.actDateInfo.thisMonth && item.day === this.actDateInfo.thisDate) {
            this.drawerActIndex = i
          }
          let tempObj = {};
          // 首次加载数据，展开当前日期往后的所有日期，往后只展开选中日期
          let openFlg = false;
          if (this.isFirst === 1 || this.isFirst === 0) { // 神奇的判断
            openFlg = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate}).add(-1, 'day') < this.$moment({y: item.yearValue, M: item.monthValue - 1, d: item.day});
          } else {
            openFlg = this.$moment({y: this.actDateInfo.thisYear, M: this.actDateInfo.thisMonth - 1, d: this.actDateInfo.thisDate}).format('YYYY-MM-DD') == this.$moment({y: item.yearValue, M: item.monthValue - 1, d: item.day}).format('YYYY-MM-DD');
          }
          // console.log(openFlg);
          tempObj = {
            dateStr: this.$moment({y: item.yearValue, M: item.monthValue - 1, d: item.day}).format('YYYY-MM-DD'),
            week: weekMap[Number(i) + 1].substr(0, 3),
            date: item.day,
            month: monthMap[item.monthValue].substr(0, 3),
            openFlg: openFlg,
            taskList: []
          }
          tempList.push(tempObj)
        })
        this.isFirst++; // 首次加载完毕

        this.weekList = tempList;
      },
      // 切换周视图抽屉
      changeDrawerActIndex (i, item) {
        this.drawerActIndex = i;
        item.openFlg = !item.openFlg;

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
      afterInit (calendarList, thisDateInfo, actDateInfo) {
        // this.calendarList = calendarList
        // this.thisDateInfo = thisDateInfo
        // this.actDateInfo = actDateInfo
        // if (arguments[3]) {
        //   this.actWeekList = arguments[3]
        // }
        // this.createWeekInfo(true); // 传入boolearn：true表示第一次加载
        // this.init();
        // this.syncDataFunc(calendarList, thisDateInfo, actDateInfo, actWeekList);
        this.$nextTick(() => {
          this.$refs.calendar.initCalendarFlg();
        })
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
        this.$store.dispatch('setMemoSide', false);
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
          if (!this.applicationList) {
            console.log(res);
            return res;
          }
          for (let i = 0; i < this.applicationList.length; i++) {
            if (this.applicationList[i].nom.length > 15) {
              this.applicationList[i].small_font = true;
            }
          }
        })
      },
      // 更多memo事件，查询该memo所属group的所有memo
      openMemoSide (groupId) {
        let params = {
          memo_groupid: groupId
        }
        return this.$http.post('/memoCtl/memo/findMemoByGroupId', params).then((res) => {
          // console.log(res);
          let memoSideList = [];
          for (let i = 0; i < res.data.length; i++) {
            let tempObj = {
              titleType: 'type2',
              titleColor: res.data[i].color,
              contentType: 'type1',
              memoId: res.data[i].id,
              memoGroupId: res.data[i].memo_groupid,
              title: res.data[i].memo_name,
              sticky_flag: res.data[i].sticky_flag,
              readonly: this.userInfo.role !== 0,
              memos: []
            }
            for (let i2 = 0; i2 < res.data[i].memoContentList.length; i2++) {
              tempObj.memos.push({
                subTitle: res.data[i].memoContentList[i2].sub_title,
                imgUrl: res.data[i].memoContentList[i2].pic_url,
                content: res.data[i].memoContentList[i2].memo_text
              })
            }
            // 编辑权限
            if (tempObj.readonly) {
              for (let i3 = 0; i3 < res.data[i].memoUserList.length; i3++) {
                if (res.data[i].memoUserList[i3].edit_userid === this.userInfo.id) {
                  tempObj.readonly = false;
                  break;
                }
              }
            }
            if (res.data[i].template === 0) tempObj.contentType = 'type2';
            else if (res.data[i].template === 1) tempObj.contentType = 'type3';
            else if (res.data[i].template === 2) tempObj.contentType = 'type1';
            memoSideList.push(tempObj);
          }
          this.$store.dispatch('setMemoSideList', memoSideList);
          this.$store.dispatch('setMemoSide', true);
        })
      },
      // 获取置顶memo列表
      getTopMemo () {
        this.$http.post('/memoCtl/memo/findStickyMemo', {}).then((res) => {
          let memoList = [];
          for (let i = 0; i < res.data.length; i++) {
            let tempObj = {
              titleType: 'type2',
              titleColor: res.data[i].color,
              contentType: 'type1',
              memoId: res.data[i].id,
              memoGroupId: res.data[i].memo_groupid,
              memoGroupName: res.data[i].memo_groupname,
              title: res.data[i].memo_name,
              sticky_flag: res.data[i].sticky_flag,
              memos: []
            }
            for (let i2 = 0; i2 < res.data[i].memoContentList.length; i2++) {
              tempObj.memos.push({
                subTitle: res.data[i].memoContentList[i2].sub_title,
                imgUrl: res.data[i].memoContentList[i2].pic_url,
                content: res.data[i].memoContentList[i2].memo_text
              })
            }
            if (res.data[i].template === 0) tempObj.contentType = 'type2';
            else if (res.data[i].template === 1) tempObj.contentType = 'type3';
            else if (res.data[i].template === 2) tempObj.contentType = 'type1';
            memoList.push(tempObj);
          }
          this.memoList = memoList;
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
  @import '../styles/index';
</style>
