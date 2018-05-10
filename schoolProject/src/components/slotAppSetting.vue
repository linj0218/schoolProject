<template>
  <div class="body" v-cloak>

    <div class="nav_tab">
      <div><div @click='()=>{this.data.tab=3}' :class='{"act": data.tab==3}'>{{ $t("Groups") }}</div></div>
      <div><div @click='()=>{this.data.tab=2}' :class='{"act": data.tab==2}'>{{ $t("Ad sync") }}</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <!-- Groups -->
        <div class="nav_content_1" v-show='data.tab==3' style="padding: 0;text-align: left;">
          <el-table ref="groups"
                    :data="groupsData.groupList"
                    style="width: 680px;"
                    tooltip-effect="dark"
                    :empty-text='$t("No Data")'
                    @selection-change="">
            <el-table-column prop="group_name"
                             :label='$t("Ad group")'
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="group_alias_name"
                             :label='$t("Alias")'
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label=""
                             width="140">
              <template slot-scope="scope">
                <span class="icon icon_edit" @click='editGroupAlias(scope.$index, scope.row)'></span>
              </template>
            </el-table-column>
            <el-table-column :label='$t("Active")'
                             width="80">
              <template slot-scope="scope">
                <div class="checkbox"
                     :class='{"checked": scope.row.operation_flag==1}'
                     @click='groupStatusChanged(scope.$index, scope.row)'></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- Ad Sync -->
        <div class="nav_content_1" v-show='data.tab==2'>
          <div class="name_box">
            <span class="lab" style="width: 220px;">{{ $t("Daily synchronization time") }}:</span>
            <div class="name_value" style="width: 500px;">
              <el-time-picker v-model="data.taskTime"
                              :picker-options="{ selectableRange: '00:00:00 - 23:59:00' }"
                              style="width: 350px;margin-bottom: 10px;"
                              @change='changeSyncTime'
                              @focus='timeFocus'
                              format="HH:mm"
                              value-format="HH:mm"
                              :placeholder='$t("Select")'>
              </el-time-picker>
              <button class="btn btn-primary" @click="syncAdData()" style="display: block;height: 42px;vertical-align: top;">{{ $t("Manual Sync") }}</button>
            </div>
          </div>
          <div class="name_box">
            <span class="lab" style="width: 220px;">{{ $t("Last sync time") }}:</span>
            <div class="name_value" style="line-height: 34px;font-size: 18px;color: #333;">
              {{data.lastSyncTime}}
            </div>
          </div>
          <!-- 查询条件 -->
          <!-- <div class="name_box">
            <span class="lab" style="width: 220px;">{{ $t("Last sync statistics") }}:</span>
            <div class="name_value" style="width: 800px;">
              <el-date-picker v-model="data.searchDate"
                              @change="dateRangeChanged()"
                              class="lj_date_picker"
                              type="daterange"
                              range-separator="-"
                              :editable="false"
                              :start-placeholder="$t('Start date')"
                              :end-placeholder="$t('End date')">
              </el-date-picker>
              <input type="text" class="form-control" v-model='data.searchName' :placeholder='$t("User")' @keyup.enter='searchEvent()'>
            </div>
          </div> -->
          <div class="name_box">
            <span class="lab" style="width: 220px;">{{ $t("Last sync statistics") }}:</span>
            <div class="name_value" style="width: 1000px;">
              <div class="sync_nav_tab">
                <div><div @click='()=>{this.data.sync_tab=1}' :class='{"act": data.sync_tab==1}'>{{ $t("Adds") }}<span class="_badge">{{data.syncData.addsNum}}</span></div></div>
                <div><div @click='()=>{this.data.sync_tab=2}' :class='{"act": data.sync_tab==2}'>{{ $t("Updates") }}<span class="_badge">{{data.syncData.updatesNum}}</span></div></div>
                <div><div @click='()=>{this.data.sync_tab=3}' :class='{"act": data.sync_tab==3}'>{{ $t("Renames") }}<span class="_badge">{{data.syncData.renameNum}}</span></div></div>
                <div><div @click='()=>{this.data.sync_tab=4}' :class='{"act": data.sync_tab==4}'>{{ $t("Deletes") }}<span class="_badge">{{data.syncData.deleteNum}}</span></div></div>
                <div><div @click='()=>{this.data.sync_tab=0}' :class='{"act": data.sync_tab==0}'>{{ $t("Unchanged") }}<span class="_badge">{{data.syncData.unchangedNum}}</span></div></div>
              </div>
              <div class="sync_list" v-if="data.sync_tab==1">
                <div class="sync_field" v-for="item in data.syncData.addsList" @click="userPermission(item)">
                  <el-tooltip class="item" effect="dark" :content="item.user_name" placement="top">
                    <span>{{item.user_name}}</span>
                  </el-tooltip>
                  <i class="iconfont iconfont-xiugailianxiren"></i>
                </div>
              </div>
              <div class="sync_list" v-if="data.sync_tab==2">
                <div class="sync_field" v-for="item in data.syncData.updatesList" @click="userPermission(item)">
                  <el-tooltip class="item" effect="dark" :content="item.user_name" placement="top">
                    <span>{{item.user_name}}</span>
                  </el-tooltip>
                  <i class="iconfont iconfont-xiugailianxiren"></i>
                </div>
              </div>
              <div class="sync_list" v-if="data.sync_tab==3">
                <div class="sync_field" v-for="item in data.syncData.renameList" @click="userPermission(item)">
                  <el-tooltip class="item" effect="dark" :content="item.user_name" placement="top">
                    <span>{{item.user_name}}</span>
                  </el-tooltip>
                  <i class="iconfont iconfont-xiugailianxiren"></i>
                </div>
              </div>
              <div class="sync_list" v-if="data.sync_tab==4">
                <div class="sync_field" v-for="item in data.syncData.deleteList" @click="userPermission(item)">
                  <el-tooltip class="item" effect="dark" :content="item.user_name" placement="top">
                    <span>{{item.user_name}}</span>
                  </el-tooltip>
                  <i class="iconfont iconfont-xiugailianxiren"></i>
                </div>
              </div>
              <div class="sync_list" v-if="data.sync_tab==0">
                <div class="sync_field" v-for="item in data.syncData.unchangedList" @click="userPermission(item)">
                  <el-tooltip class="item" effect="dark" :content="item.user_name" placement="top">
                    <span>{{item.user_name}}</span>
                  </el-tooltip>
                  <i class="iconfont iconfont-xiugailianxiren"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <alert ref='alert'></alert>
    <prompt ref='prompt'></prompt>

  </div>
</template>

<script>
  import headerr from '@/components/header'
  import drapdown from '@/components/drapdown'
  import alert from '@/components/alert'
  import prompt from '@/components/prompt'
  import {forEach} from '@/script/util'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      headerr, drapdown, alert, prompt
    },
    data () {
      return {
        data: {
          tab: 3,
          subtab: 1,
          // App management
          appList: [
            {value: '1', name: 'app 1'},
            {value: '2', name: 'app 2'}
          ],
          appId: '1',
          appName: '',
          appSource: null,
          appLogo: '',
          appUrl: 'http://www.baidu.com',
          appDesc: 'description',
          // member groups
          groupList: [
            {value: '1', name: 'group 1'},
            {value: '2', name: 'group 2'}
          ],
          groupId: '1',
          groupName: 'group 1',
          groupPermissionAll: false,
          groupPermissionList: [
            {value: 1, name: 'App name 1', checked: false},
            {value: 2, name: 'App name 2', checked: false}
          ],
          userList: [],
          userId: '',
          userName: '',
          user_flag: false,
          switch_flag: false,
          userGroupedIn: [],
          userPermissionAll: false,
          userPermissionList: [
            {value: 3, name: 'App name 3', checked: false},
            {value: 4, name: 'App name 4', checked: false}
          ],
          levels: [],
          sortNum: '1',
          positionList: [
            {value: '1', name: '1'}, {value: '2', name: '2'}, {value: '3', name: '3'}, {value: '4', name: '4'}, {value: '5', name: '5'},
            {value: '6', name: '6'}, {value: '7', name: '7'}, {value: '8', name: '8'}, {value: '9', name: '9'}, {value: '10', name: '10'},
            {value: '11', name: '11'}, {value: '12', name: '12'}, {value: '13', name: '13'}, {value: '14', name: '14'}, {value: '15', name: '15'},
            {value: '16', name: '16'}, {value: '17', name: '17'}, {value: '18', name: '18'}, {value: '19', name: '19'}, {value: '20', name: '20'}
          ],
          groupsInAppChecked: false,
          groupsInApp: [],
          // Ad Sync
          syncDataList: [{name: 'William trang'}, {name: 'William trang'}, {name: 'William trang'}, {name: 'William trang'}, {name: 'William trang'}],
          sync_tab: 1,
          syncData: {},
          taskTime: '',
          searchDate: '',
          searchName: ''
        },
        actionUrl: this.$config.api_path.img_upload,
        // Groups data
        tableHeight: 0,
        groupsData: {
          groupList: [],
          names: [],
          membersList: []
        }
      }
    },
    computed: {
      ...mapGetters({
        lang: 'lang'
      })
    },
    mounted () {
      let levels = [];
      for (let i = 1; i <= 20; i++) {
        levels.push({value: i, name: i})
      }
      this.data.levels = levels;

      this.tableHeight = document.getElementsByClassName('content')[0].offsetHeight
      // console.log(this.tableHeight);

      this.getGroups();

      this.getSyncLog();
      this.getSyncTime();
    },
    methods: {
      profileToggle (bol) {
        this.$refs.profile.show = bol;
        this.showEvent = false;
      },
      // 获取所有AD group数据
      getGroups () {
        return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', {event_id: 0}).then((ret) => {
          this.groupsData.groupList = ret.data.groupsList;
          this.data.groupsInApp = JSON.parse(JSON.stringify(ret.data.groupsList));
          return ret;
        })
      },
      // groups functions
      // 修改group别名
      editGroupAlias (index, row) {
        this.$refs.prompt.showDialog(row.group_alias_name).then((text) => {
          row.group_alias_name = text;
          this.submitGroup1(row)
        })
      },
      // group状态修改
      groupStatusChanged (index, row) {
        row.operation_flag = row.operation_flag === 1 ? 0 : 1;
        this.submitGroup1(row).then(() => {
          return this.getGroups();
        });
      },
      // 提交groups表单
      submitGroup1 (row) {
        // console.log(row)
        let param = {
          'id': row.id,
          'group_name': row.group_name,
          'operation_flag': row.operation_flag,
          'group_alias_name': row.group_alias_name
        }
        return this.$http.post('/sharedcalendarSettingCtl/event/editGroups', {
          data: JSON.stringify(param)
        }).then((res) => {
          if (res.success) {
            let banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
            this.$emit('openBanner', banner);
            return res;
          }
        })
      },
      // 提交group权限
      submitGroup (opt) {
        let params = {
          id: 1,
          role_flag: this.data.subtab, // 0-group,1-user
          operation_flag: 0,
          appIdList: [],
          user_flag: this.data.switch_flag ? 1 : 0
        }
        if (this.data.subtab === 0) {
          params.group_id = this.data.groupId;
          forEach(this.data.groupPermissionList, (i, item) => {
            if (item.checked) {
              params.appIdList.push(item.value)
            }
          })
        } else if (this.data.subtab === 1) {
          params.user_id = this.data.userId;
          forEach(this.data.userPermissionList, (i, item) => {
            if (item.checked) {
              params.appIdList.push(item.value)
            }
          })
        }

        // console.log(params)
        return this.$http.post('/sharedcalendarSettingCtl/event/editAppRole', params).then((res) => {
          if (res.result === 'SUCCESS') {
            let banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
            this.$emit('openBanner', banner);
          }
          return res;
        })
      },
      syncAdData () {
        return this.$http.get('/adSynchronizeCtl/sys/toSynchronize', {}).then((res) => {
          // console.log(res);
          if (res.result === 'SUCCESS') {
            let banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
            this.$emit('openBanner', banner);
            this.getSyncLog();
          }
        })
      },
      // 获取同步日志
      getSyncLog () {
        return this.$http.get('/adSynchronizeCtl/sys/findAdSyncLogAll', {}).then((res) => {
          // console.log(res);
          if (res.result === 'SUCCESS') {
            this.data.syncData = res.data;
            this.data.lastSyncTime = this.$moment(res.data.unchangedList[0].sync_time).format('HH:mm:ss DD/MM/YYYY');
          }
        })
      },
      timeFocus () {
        if (this.lang === 'zh-CH') return;
        setTimeout(() => {
          document.getElementsByClassName('el-time-panel__footer')[0].getElementsByClassName('cancel')[0].innerHTML = 'cancel'
          document.getElementsByClassName('el-time-panel__footer')[0].getElementsByClassName('confirm')[0].innerHTML = 'confirm'
        }, 100)
      },
      userPermission (item) {
        let data = {
          subTab: 1,
          userId: item.user_id,
          userName: item.user_name
        }
        this.$emit('switchTab', 3, data);
      },
      // 查询同步时间
      getSyncTime () {
        let params = {
          userName: this.data.searchName,
          startDate: '',
          endDate: ''
        }
        if (this.data.searchDate) {
          params.startDate = this.$moment(this.data.searchDate[0]).format('YYYY-MM-DD');
          params.endDate = this.$moment(this.data.searchDate[1]).format('YYYY-MM-DD');
        }
        return this.$http.post('/adSynchronizeCtl/sys/findAdSyncTaskTime', params).then((res) => {
          if (res.result === 'SUCCESS' && res.data[0]) {
            let taskTime = res.data[0].task_time;
            this.data.taskId = res.data[0].id;
            this.data.taskTime = this.$moment('2000/01/01 ' + taskTime, 'YYYY/MM/DD HH:mm:ss').format('HH:mm');
          }
        })
      },
      // 更新同步时间
      changeSyncTime (value) {
        if (!value) return;
        this.data.taskTime = value;
        let params = {
          id: this.data.taskId,
          task_time: value + ':00'
        };
        return this.$http.post('/adSynchronizeCtl/sys/updAdSyncTaskTime', params).then((res) => {
          if (res.result === 'SUCCESS') {
            let banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
            this.$emit('openBanner', banner);
          }
        })
      },
      dateRangeChanged () {
        // console.log(this.$moment(this.data.searchDate[0]).format('YYYY-MM-DD'));
        this.getSyncTime();
      },
      searchEvent () {
        // console.log(this.data.searchName);
        this.getSyncTime();
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .body{position: relative;height: 100%;overflow: hidden;}
  .nav_tab{height: 100px;border-bottom: 1px solid #eee;position: absolute;width: 100%;}
  .nav_tab > div{padding: 34px 0;text-align: center;display: inline-block;margin: 0 20px;}
  .nav_tab > div > div{height: 32px;display: inline-block;border-bottom: 4px solid #fff;font-size: 20px;color: #ccc;line-height: 20px;cursor: pointer;}
  .nav_tab > div > div.act{border-bottom: 4px solid #4F81BE;color: #333;}
  .nav_body{
    padding-top: 100px;height: 100%;overflow: auto;
    ._body{border-radius: 2px;height: 100%;overflow: auto;}
    .nav_content_1{
      padding: 26px 0;
      .name_box{margin-top: 14px;}
      .lab{font-size: 18px;color: #999;vertical-align: top;display: inline-block;width: 170px;text-align: right;margin-right: 10px;line-height: 34px;}
      .lab.long_text{width: 185px;}
      .name_value{
        display: inline-block;width: 350px;position: relative;text-align: left;
        .textarea{height: 140px;}
        .logo_box{
          width: 80px;height: 80px;border: 1px dashed #ccc;border-radius: 50%;background: #fff;overflow: hidden;
          img{width: 100%;height: 100%;}
        }
        .default_icon{height: 100%;background: url('../images/icon_update.png') 50% 50% / auto auto no-repeat;display: block;}
        .check_all{padding: 0 40px 0 16px;}
        .check_list{padding: 0 40px 0 32px;}
        .checkbox input[type=checkbox], .checkbox-inline input[type=checkbox]{display: none;}
        .checkbox label{padding-left: 0;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
        .checkbox label:before{content: "";position: absolute;width: 20px;height: 20px;right: -24px;background: url('../images/icon_checkbox_unchecked.png') 50% 50% / auto auto no-repeat;top: 50%;transform: translateY(-50%);}
        .checkbox label.allCheck{padding-left: 25px;color: #333;}
        .checkbox label.allCheck:before{content: "";left: 0;background: url('../images/icon_checkbox_unchecked.png') 50% 45% / auto auto no-repeat;}
        .checkbox label.allCheck.checked:before{content: "";background: url('../images/icon_checkbox_checked.png') 50% 45% / auto auto no-repeat;}
        .checkbox .checked:before{background: url('../images/icon_checkbox_checked.png') 50% 50% / auto auto no-repeat;}
        .checkbox .app_app_bg{display: inline-block;width: 30px;height: 30px;background: url('../images/icon_members_disabled.png') 0 0 / 100% 100% no-repeat;vertical-align: middle;border-radius: 50%;}
        .checkbox .app_app_bg.defaultIcon{background: url('../images/icon_default.png') 0 0 / 100% 100% no-repeat !important;}
        .checkbox .checked .app_app_bg{background: url('../images/icon_members.png') 0 0 / 100% 100% no-repeat;}
        .card{width: 240px;border-radius: 2px;border: 1px solid #aaa;color: #aaa;vertical-align: middle;padding: 5px 5px 5px 40px;background: #fff;margin-bottom: 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;position: relative;}
        .card.enable{border: 1px solid #4F81BE;color: #4F81BE;}
        .icon{width: 25px;height: 25px;display: inline-block;vertical-align: middle;margin-right: 5px;}
        .icon_members{left: 10px;background: url('../images/icon_members_disabled.png') 0 0 / 100% 100% no-repeat;position: absolute;top: 50%;transform: translateY(-50%);}
        .enable .icon_members{left: 10px;background: url('../images/icon_members.png') 0 0 / 100% 100% no-repeat;position: absolute;top: 50%;transform: translateY(-50%);}
        .lj_switch{width: 70px;height: 30px;position: relative;border-radius: 4px;}
        .icon_switch{width: 24px;height: 24px;background: url('../images/icon_switch.png') 0 0 / 100% 100% no-repeat;position: absolute;}
        .lj_switch.on{
          background: #4E81BD;
          &:after{content: 'Yes';color: #fff;line-height: 31px;display: block;text-align: center;text-indent: -30px;}
          .icon_switch{top: 3px;right: 3px;transition: all .3s;}
        }
        .lj_switch.off{
          background: #aaa;
          &:after{content: 'No';color: #fff;line-height: 31px;display: block;text-align: center;text-indent: 30px;}
          .icon_switch{top: 3px;left: 3px;transition: all .3s;}
        }
      }
      .name_value.show_border{border-radius: 2px;border: 1px solid #ccc;background: #fff;overflow: auto;}
      .name_value > .icon{position: absolute;width: 22px;height: 22px;right: 35px;top: 50%;transform: translateY(-50%);cursor: pointer;}
      .name_value > .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;right: 65px;}
      .name_value > .icon.icon_delete{background: url('../images/icon_delete.png') 0 0 / 100% 100% no-repeat;}
      .button_box .name_value{text-align: right;margin-top: 14px;margin-bottom: 26px;}
      .nav_subtab{
        width: 300px;margin: auto;border-radius: 34px;overflow: hidden;color: #4F81BE;position: relative;z-index: 0;background: #fff;border: 1px solid #ccc;
        div{float: left;width: 50%;line-height: 34px;}
        .act{color: #fff;}
        .slide_block{position: absolute;left: 0;height: 100%;background: #4F81BE;z-index: -1;border-radius: 34px;transition: all 0.2s;}
        .slide_block.right{left: 50%;}
      }
      .scroll_box{}
      .scroll_box::-webkit-scrollbar {width: 5px;height: auto;}
      .scroll_box::-webkit-scrollbar-thumb {background: #bbb;border-radius: 5px;}
      .scroll_box::-webkit-scrollbar-track-piece {background-color: #F9F9F9;}
    }
  }
  table .icon{position: absolute;width: 22px;height: 22px;left: 0;top: 50%;transform: translateY(-50%);cursor: pointer;}
  table .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;}
  .button_box .name_value{text-align: right;margin-top: 14px;margin-bottom: 26px;}
  table .checkbox{width: 20px;height: 20px;background: url('../images/icon_checkbox_unchecked.png') 50% 50%/auto auto no-repeat;cursor: pointer;}
  table .checkbox.checked{background: url('../images/icon_checkbox_checked.png') 50% 50% / auto auto no-repeat;}
  .syncBtn{position: absolute;top: 100px;left: 0;width: 680px;color: #999;line-height: 50px;border-bottom: 1px solid #eee;height: 50px;}
  .syncBtn .btn{position: absolute;right: 0;top: 50%;transform: translateY(-50%);}
  // Ad sync
  .sync_nav_tab{height: 48px;background: #f9f9f9;border: 1px solid #eee;border-radius: 2px 2px 0 0;}
  .sync_nav_tab > div{height: 100%;line-height: 48px;text-align: center;display: inline-block;margin: 0 10px;}
  .sync_nav_tab > div > div{height: 100%;display: inline-block;border-bottom: 4px solid transparent;font-size: 20px;color: #ccc;line-height: 48px;cursor: pointer;padding: 0 10px;}
  .sync_nav_tab > div > div.act{border-bottom: 4px solid #4F81BE;color: #4E81BD;}
  .sync_nav_tab ._badge{position: relative;background: #ccc;color: #fff;font-size: 12px;display: inline-block;padding: 0 10px;height: 18px;line-height: 18px;border-radius: 2px;text-align: center;vertical-align: middle;margin-left: 10px;}
  .sync_nav_tab ._badge:before{content: '';width: 6px;height: 6px;transform: translateX(0) translateY(6px) rotate(45deg);top: 0;left: -3px;position: absolute;background: inherit;z-index: 2;}
  .sync_nav_tab .act ._badge{background: #FF3B30;}
  .sync_list{padding: 0 20px;}
  .sync_list .sync_field{
    border-bottom: 1px solid #eee;height: 60px;line-height: 60px;display: inline-block;width: 25%;font-size: 16px;padding: 0 20px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: center;cursor: pointer;
    .iconfont{color: #4E81BD;}
  }
  .sync_list .sync_field:nth-child(4n+1){text-align: left;}
  .sync_list .sync_field:nth-child(4n+4){text-align: right;}
  .lj_date_picker{display: inline-block;}
  .lj_date_picker + .form-control{display: inline-block;width: 200px;height: 40px;border: 1px solid #dcdfe6;}
</style>
