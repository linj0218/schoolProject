<template>
  <div class="configuration" :class='{"act": show}'>
    <div class="config_bg" @click='closeDialog()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeDialog()'></span>Configuration
      </div>
      <div class="content">
        <div class="nav_tab flex">
          <div><div @click='()=>{this.data.tab=3}' :class='{"act": data.tab==3}'>Groups</div></div>
          <div><div @click='()=>{this.data.tab=0}' :class='{"act": data.tab==0}'>App Management</div></div>
          <div><div @click='()=>{this.data.tab=1}' :class='{"act": data.tab==1}'>User Permission</div></div>
        </div>
        <div class="nav_body">
          <div class="body">
            <!-- Groups -->
            <div class="nav_content_1" v-show='data.tab==3' style="padding: 0;text-align: left;">
              <el-table ref="groups"
                        height="772"
                        :data="groupsData.groupList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="">
                </el-table-column>
                <el-table-column prop="group_name"
                                 label="Ad group"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="group_alias_name"
                                 label="Alias"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column label=""
                                 width="140">
                  <template slot-scope="scope">
                    <span class="icon icon_edit" @click='editGroupAlias(scope.$index, scope.row)'></span>
                  </template>
                </el-table-column>
                <el-table-column label="Active"
                                 width="80">
                  <template slot-scope="scope">
                    <div class="checkbox"
                         :class='{"checked": scope.row.operation_flag==1}'
                         @click='groupStatusChanged(scope.$index, scope.row)'></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- Application Management -->
            <div class="nav_content_1" v-show='data.tab==0'>
              <div class="name_box">
                <span class="lab">Name:</span>
                <div class="name_value">

                  <drapdown :input-value='data.appName'
                            :input-name='data.appName'
                            :input-select='data.appList'
                            :input-add='true'
                            :input-item-text='"New Application"'
                            @addItem='addApplication'
                            @inputChange='applicationChanged'>
                  </drapdown>

                  <span class="icon icon_edit" @click='editApplication(data.appName)'></span>
                  <span class="icon icon_delete" @click='deleteApp()'></span>
                </div>
              </div>
              <div class="name_box">
                <span class="lab" style="vertical-align: middle;">Logo:</span>
                <div class="name_value" style="vertical-align: middle;">

                  <!-- 图片上传 -->
                  <el-upload class="logo_box"
                             name="file"
                             :data="{appid: data.appId}"
                             :action="actionUrl"
                             :show-file-list="false"
                             :on-success="handleAvatarSuccess"
                             :before-upload="beforeAvatarUpload">
                    <img v-if="data.appLogo" :src="data.appLogo" class="avatar">
                    <i v-else class="default_icon"></i>
                  </el-upload>

                </div>
              </div>
              <div class="name_box">
                <span class="lab">URL:</span>
                <div class="name_value">
                  <input class="form-control" type="text" name="" v-model='data.appUrl' @blur='submitApp(0)'>
                </div>
              </div>
              <div class="name_box">
                <span class="lab">Description:</span>
                <div class="name_value">
                  <textarea class="form-control textarea" v-model='data.appDesc' @blur='submitApp(0)'></textarea>
                </div>
              </div>
              <div class="name_box">
                <span class="lab">Position:</span>
                <div class="name_value">

                  <drapdown :input-value='data.sortNum'
                            :input-name='data.sortNum'
                            :input-select='data.positionList'
                            :input-add='false'
                            @inputChange='positionChanged'>
                  </drapdown>

                </div>
              </div>
              <div class="name_box">
                <span class="lab">Permission:</span>
                <div class="name_value show_border scroll_box">
                  <div class="check_all">
                    <div class="checkbox">
                      <label :class='{"checked": data.groupsInAppChecked}'>
                        <input @click='appCheckAllChange()' type="checkbox" v-model='data.groupsInAppChecked'> All Groups
                      </label>
                    </div>
                  </div>
                  <div class="check_list">
                    <div class="checkbox" v-for='item in data.groupsInApp' v-if='item.operation_flag==1'>
                      <label :class='{"checked": item.checked}'>
                        <input @click='appCheckChange(item)' type="checkbox" v-model='item.checked'>
                        <span class="app_app_bg"></span>

                        <el-tooltip class="item" effect="dark" :content="item.group_alias_name || item.group_name" placement="left">
                          <span>{{item.group_alias_name || item.group_name}}</span>
                        </el-tooltip>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- User Permission -->
            <div class="nav_content_1" v-show='data.tab==1'>
              <!-- Users -->
              <div v-show='data.subtab==1'>
                <div class="name_box">
                  <span class="lab">User:</span>
                  <div class="name_value hide-icon">

                    <el-select filterable default-first-option placeholder=""
                               v-model="data.userId"
                               :name="data.userName"
                               :filter-method="userFilter"
                               @visible-change="visibleChanged"
                               @change="userChanged(data.userId)">
                      <el-option v-for="user in data.userList"
                                 :key="user.value"
                                 :label="user.name"
                                 :value="user.value">
                      </el-option>
                    </el-select>

                  </div>
                </div>
                <div class="name_box">
                  <span class="lab"></span>
                  <div class="name_value">
                    <div class="checkbox">
                      <label class="allCheck" :class='{"checked": data.user_flag}'>
                        <input type="checkbox" @click='userPermissionChanged' v-model='data.user_flag'>Only search in custom permission users
                      </label>
                    </div>
                  </div>
                </div>
                <div class="name_box">
                  <span class="lab" style="vertical-align: middle;">Grouped in:</span>
                  <div class="name_value" style="vertical-align: top;">
                    <div class="card" v-for='group in data.userGroupedIn' :title='group.name' :class='{enable: group.operation_flag == 1}'>
                      <span class="icon icon_members"></span> {{group.name}}
                    </div>
                  </div>
                </div>
                <div class="name_box">
                  <span class="lab">Custom Permission:</span>
                  <div class="name_value">
                    <div class="lj_switch" :class='{"on": data.switch_flag, "off": !data.switch_flag}' @click='switchChanged'>
                      <div class="icon_switch"></div>
                    </div>
                  </div>
                </div>
                <div class="name_box">
                  <span class="lab"></span>
                  <div class="name_value show_border scroll_box">
                    <div class="check_all">
                      <div class="checkbox">
                        <label :class='{"checked": data.userPermissionAll}'>
                          <input @click='checkAllChange("user")' :disabled='!data.switch_flag' type="checkbox" v-model='data.userPermissionAll'> All Applications
                        </label>
                      </div>
                    </div>
                    <div class="check_list">
                      <div class="checkbox" v-for='item in data.userPermissionList'>
                        <label :class='{"checked": item.checked}'>
                          <input @click='checkChange(item, "user")' :disabled='!data.switch_flag' type="checkbox" v-model='item.checked'>
                          <span class="app_app_bg" :class='{defaultIcon: !item.background}' :style="{ background: item.background }"></span>

                          <el-tooltip class="item" effect="dark" :content="item.name" placement="left">
                            <span>{{item.name}}</span>
                          </el-tooltip>
                        </label>
                      </div>
                    </div>
                  </div>
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
import drapdown from '@/components/drapdown'
import alert from '@/components/alert'
import prompt from '@/components/prompt'
import {forEach} from '@/script/util'
export default {
  props: {
  },
  components: {
    drapdown, alert, prompt
  },
  data () {
    return {
      show: false,
      actionUrl: this.$config.api_path.img_upload,
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
        groupsInApp: []
      },
      // Groups data
      groupsData: {
        groupList: [],
        names: [],
        membersList: []
      }
    }
  },
  mounted () {
    let levels = [];
    for (let i = 1; i <= 20; i++) {
      levels.push({value: i, name: i})
    }
    this.data.levels = levels;
  },
  watch: {
    show () {
      if (this.show) {
        // $.fn.scrollUnique = function () {
        //   return $(this).each(function () {
        //     var eventType = 'mousewheel';
        //     // 火狐是DOMMouseScroll事件
        //     if (document.mozHidden !== undefined) {
        //       eventType = 'DOMMouseScroll';
        //     }
        //     $(this).on(eventType, function (event) {
        //       // 一些数据
        //       var scrollTop = this.scrollTop;
        //       var scrollHeight = this.scrollHeight;
        //       var height = this.clientHeight;
        //
        //       var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);
        //
        //       if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
        //         // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
        //         this.scrollTop = delta > 0 ? 0 : scrollHeight;
        //         // 向上滚 || 向下滚
        //         event.preventDefault();
        //       }
        //     });
        //   });
        // };
        this.getGroups().then(() => {
          this.getAppList();
        })
        this.getUsers().then(() => {
          this.getPermission('user');
        })
      }
    }
  },
  methods: {
    // 获取所有APP数据
    getAppList (flg) {
      let param = {apps: ''};
      return this.$http.post('/appCtl/app/appAllList', param).then((res) => {
        let appList = [];
        // 设置默认值
        let setDefault = (item) => {
          // console.log(item);
          let defaultItem = item || appList[0].source;
          this.data.appId = defaultItem.id;
          this.data.appName = defaultItem.nom;
          this.data.appSource = defaultItem;
          if (defaultItem.picUrl) {
            this.data.appLogo = this.$config.api_path.img_path + defaultItem.picUrl;
          } else {
            this.data.appLogo = '';
          }
          this.data.appUrl = defaultItem.baseaddress;
          this.data.appDesc = defaultItem.description;

          this.data.sortNum = defaultItem.sortNum || '1';
          // 设置选中groups
          if (!defaultItem || !defaultItem.appRoleList || !defaultItem.appRoleList.length) return false;
          for (let i = 0; i < defaultItem.appRoleList.length; i++) {
            let item = defaultItem.appRoleList[i].group_id;
            for (let i2 = 0; i2 < this.data.groupsInApp.length; i2++) {
              let item2 = this.data.groupsInApp[i2];
              if (item == item2.id) {
                item2.checked = true;
                break;
              }
            }
          }
        }

        forEach(res.data, (i, item) => {
          if (appList.length && this.data.appName === item.nom) {
            setDefault(item);
          }
          appList.push({
            value: item.id,
            name: item.nom,
            checked: false,
            source: item
          })
        })
        // 设置默认值
        if ((appList.length && this.data.appName === '') || flg) {
          setDefault();
        }

        this.data.appList = appList;
        this.data.groupPermissionAll = false;
        this.data.groupPermissionList = JSON.parse(JSON.stringify(appList));
        this.data.userPermissionAll = false;
        this.data.userPermissionList = JSON.parse(JSON.stringify(appList));
        for (let i = 0; i < this.data.userPermissionList.length; i++) {
          let item = this.data.userPermissionList[i];
          if (item.source.picUrl) {
            item.background = 'url("' + this.$config.api_path.img_path + item.source.picUrl + '") 0 0 / 100% 100% no-repeat';
          } else {
            item.background = '';
          }
        }
        return res;
      })
    },
    // 获取所有user数据
    getUsers () {
      let params = {flag: 1};
      return this.$http.post('/sharedcalendarSettingCtl/event/getGroupsOrUsers', params).then((res) => {
        // console.log(res)
        let userList = [];
        forEach(res.data, (i, item) => {
          userList.push({
            value: item.id,
            name: item.nom,
            user_flag: !!item.user_flag,
            source: item
          })
        })

        // this.data.userList = userList;
        this.data.copyUserList = JSON.parse(JSON.stringify(userList));
        return res;
      })
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
      }).then(() => {
        this.getAppList(true);
      })
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
    // 通过groupId、userId获取group权限、user权限
    getPermission (role) {
      let params = {};
      if (role === 'group') {
        params = {group_id: this.data.groupId, role_flag: 0}
      } else if (role === 'user') {
        if (!this.data.userId) return;
        params = {user_id: this.data.userId, role_flag: 1}
      }
      params.user_flag = this.data.switch_flag ? 1 : 0;
      return this.$http.post('/sharedcalendarSettingCtl/event/searchAppRole', params).then((ret) => {
        let list = [];
        if (role === 'group') {
          list = this.data.groupPermissionList;
        } else if (role === 'user') {
          list = this.data.userPermissionList;
        }
        forEach(list, (i, item) => {
          item.checked = false;
        })
        forEach(ret.data, (i, item) => {
          for (let i2 = 0; i2 < list.length; i2++) {
            if (item.app_id === list[i2].value) {
              list[i2].checked = true;
            }
          }
        })
        if (!ret.data.length) {
          this.data.userPermissionAll = false;
          forEach(list, (i, item) => {
            item.checked = false;
          })
        } else {
          let checkAll = true;
          for (let i = 0; i < list.length; i++) {
            if (!list[i].checked) {
              checkAll = false;
              break;
            }
          }
          this.data.userPermissionAll = checkAll;
        }
        return ret;
      });
    },
    // Application Manage functions
    // APP切换
    applicationChanged (item) {
      this.data.appId = item.source.id;
      this.data.appName = item.source.nom;
      this.data.appSource = item.source;
      if (item.source.picUrl) {
        this.data.appLogo = this.$config.api_path.img_path + item.source.picUrl;
      } else {
        this.data.appLogo = '';
      }
      this.data.appUrl = item.source.baseaddress;
      this.data.appDesc = item.source.description;
      // console.log(item, this.data.groupsInApp);
      this.data.sortNum = item.source.sortNum || '1';
      if (this.data.groupsInApp || this.data.groupsInApp.length) {
        for (let i2 = 0; i2 < this.data.groupsInApp.length; i2++) {
          let item2 = this.data.groupsInApp[i2];
          item2.checked = false;
        }
      }
      for (let i = 0; i < item.source.appRoleList.length; i++) {
        let obj = item.source.appRoleList[i];
        for (let i2 = 0; i2 < this.data.groupsInApp.length; i2++) {
          let item2 = this.data.groupsInApp[i2];
          // console.log(obj.group_id, item2.id);
          if (obj.group_id == item2.id) {
            item2.checked = true;
            break;
          }
        }
      }
      this.data.groupsInAppChecked = true;
      for (let i = 0; i < this.data.groupsInApp.length; i++) {
        if (!this.data.groupsInApp[i].checked && this.data.groupsInApp[i].operation_flag == 1) {
          this.data.groupsInAppChecked = false;
          break;
        }
      }
    },
    // 新增APP
    addApplication () {
      this.$refs.prompt.showDialog().then((text) => {
        this.data.appId = '';
        this.data.appName = text;
        this.data.appSource = null;
        this.data.appLogo = '';
        this.data.appUrl = '';
        this.data.appDesc = '';
        this.submitApp(0)
      })
    },
    // 修改APP名称
    editApplication (oldText) {
      this.$refs.prompt.showDialog(oldText).then((text) => {
        this.data.appName = text;
        this.submitApp(0);
      })
    },
    // 图标上传成功
    handleAvatarSuccess (res, file) {
      if (res.success) {
        // this.data.appLogo = URL.createObjectURL(file.raw);
        this.data.appLogo = this.$config.api_path.img_path + res.data[0].picUrl;
      } else {
        let banner = {
          status: 'ERROR',
          msg: res.msg
        }
        this.$emit('openBanner', banner);
      }
    },
    // 图标上传前校验
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$refs.alert.showDialog('Uploading image images can only be JPG format!', true);
      }
      if (!isLt2M) {
        this.$refs.alert.showDialog('Upload profile picture size can\'t exceed 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 删除APP
    deleteApp () {
      this.$refs.alert.showDialog('Confirm the deletion?').then(() => {
        this.data.appName = '';
        this.submitApp(-1)
        this.$refs.alert.show = false;
      })
    },
    appCheckAllChange () {
      this.data.groupsInAppChecked = !this.data.groupsInAppChecked;
      forEach(this.data.groupsInApp, (i, item) => {
        if (item.operation_flag === 0) return;
        item.checked = this.data.groupsInAppChecked;
      })
      this.submitApp(0)
    },
    appCheckChange (obj) {
      let bol = !obj.checked;
      obj.checked = bol;
      if (!bol) {
        this.data.groupsInAppChecked = bol;
      } else {
        this.data.groupsInAppChecked = bol;
        for (let i = 0, len = this.data.groupsInApp.length; i < len; i++) {
          let item = this.data.groupsInApp[i];
          if (item.operation_flag == 1 && !item.checked) {
            this.data.groupsInAppChecked = false;
            break;
          }
        }
      }
      this.submitApp(0);
    },
    // position切换事件
    positionChanged (item) {
      this.data.sortNum = item.value;
      this.submitApp(0);
    },
    // 提交APP
    submitApp (opt) {
      let groups = [];
      forEach(this.data.groupsInApp, (i, item) => {
        if (item.operation_flag == 1 && item.checked) {
          groups.push(item.id);
        }
      })
      let params = {
        id: this.data.appId || 0,
        nom: this.data.appName,
        // picUrl: this.data.appLogo,
        baseaddress: this.data.appUrl,
        description: this.data.appDesc,
        insideschool: this.data.appSource ? this.data.appSource.insideschool : 1,
        auth_required: this.data.appSource ? this.data.appSource.auth_required : 1,
        disabled: opt,
        sortNum: Number(this.data.sortNum),
        groupIdList: groups
      }

      // console.log(params)
      return this.$http.post('/sharedcalendarSettingCtl/event/editApplication', params).then((res) => {
        if (res.result === 'SUCCESS') {
          let banner = {
            status: 'SUCCESS',
            msg: 'Succeeded!'
          }
          this.$emit('openBanner', banner);
          this.getAppList();
        } else {
          let banner = {
            status: 'ERROR',
            msg: res.msg
          }
          this.$emit('openBanner', banner);
        }
        return res;
      })
    },
    // permission functions
    // AD Groups切换事件
    groupChanged (item) {
      this.data.groupId = item.value
      this.data.groupName = item.name
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
    // 用户过滤器
    userFilter (input) {
      if (input) {
        let tempUserList = [];
        if (this.data.user_flag) {
          let len = this.data.copyUserList.length;
          for (let i = 0; i < len; i++) {
            if (this.data.user_flag === this.data.copyUserList[i].user_flag && this.data.copyUserList[i].name.toLowerCase().indexOf(input) > -1) {
              tempUserList.push(this.data.copyUserList[i])
            }
          }
          this.data.userList = tempUserList;
        } else {
          let len = this.data.copyUserList.length;
          for (let i = 0; i < len; i++) {
            if (this.data.copyUserList[i].name.toLowerCase().indexOf(input) > -1) {
              tempUserList.push(this.data.copyUserList[i])
            }
          }
          this.data.userList = tempUserList;
        }
      } else {
        let tempUserList = [];
        if (this.data.user_flag) {
          let len = this.data.copyUserList.length;
          for (let i = 0; i < len; i++) {
            if (this.data.user_flag === this.data.copyUserList[i].user_flag) {
              tempUserList.push(this.data.copyUserList[i])
            }
          }
          this.data.userList = tempUserList;
        } else {
          this.data.userList = this.data.copyUserList;
        }
      }
      // this.data.userList
    },
    // 下拉框显示、隐藏事件
    visibleChanged (bol) {
      if (bol) this.userFilter('')
    },
    // 用户改变
    userChanged (id) {
      for (let i = 0, len = this.data.userList.length; i < len; i++) {
        let item = this.data.userList[i];
        // TODO 设置所属组和user_flag
        if (item.value === id) {
          console.log(item);
          this.data.switch_flag = !!item.user_flag;
          this.data.userGroupedIn = [];
          forEach(item.source.userGroupList, (i2, field) => {
            this.data.userGroupedIn.push({name: field.group_alias_name || field.group_name, operation_flag: field.operation_flag});
          })
          break;
        }
      }
      this.getPermission('user')
    },
    // 用户自定义过滤条件改变事件
    userPermissionChanged () {
      this.data.user_flag = !this.data.user_flag;
    },
    // 用户自定义权限开关改变事件
    switchChanged () {
      if (!this.data.userId) return;
      this.data.switch_flag = !this.data.switch_flag;

      var params = {
        user_flag: this.data.switch_flag ? 1 : 0,
        user_id: this.data.userId
      }
      return this.$http.post('/sharedcalendarSettingCtl/event/updUserFlagByUserId', params).then((res) => {
        if (res.result === 'SUCCESS') {
          let banner = {
            status: 'SUCCESS',
            msg: 'Succeeded!'
          }
          this.$emit('openBanner', banner);
        }
        return res;
      }).then(() => {
        return this.getUsers();
      }).then(() => {
        this.getPermission('user');
      })
    },
    // 全选
    checkAllChange (str) {
      if (!this.data.switch_flag) return;
      if (str === 'group') {
        let bol = !this.data.groupPermissionAll;
        this.data.groupPermissionAll = bol;
        forEach(this.data.groupPermissionList, (i, item) => {
          item.checked = bol;
        })
      } else if (str === 'user') {
        let bol = !this.data.userPermissionAll;
        this.data.userPermissionAll = bol;
        forEach(this.data.userPermissionList, (i, item) => {
          item.checked = bol;
        })
      }
      this.submitGroup(0)
    },
    // 复选框状态切换
    checkChange (item, str) {
      if (!this.data.switch_flag) return;
      let bol = !item.checked;
      item.checked = bol;
      if (str === 'group') {
        if (!bol) this.data.groupPermissionAll = bol;
        else {
          this.data.groupPermissionAll = bol;
          for (let i = 0, len = this.data.groupPermissionList.length; i < len; i++) {
            let item = this.data.groupPermissionList[i];
            if (!item.checked) {
              this.data.groupPermissionAll = false;
              break;
            }
          }
        }
      } else if (str === 'user') {
        if (!bol) this.data.userPermissionAll = bol;
        else {
          this.data.userPermissionAll = bol;
          for (let i = 0, len = this.data.userPermissionList.length; i < len; i++) {
            let item = this.data.userPermissionList[i];
            if (!item.checked) {
              this.data.userPermissionAll = false;
              break;
            }
          }
        }
      }
      this.submitGroup(0).then(() => {
        this.getPermission('user');
      })
    },
    closeDialog () {
      this.show = false;
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .configuration{
    position: absolute;top: 0;right: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;
    .config_bg{position: absolute;width: 100%;height: 100%;background: rgba(0,0,0,0.2);z-index: -1;}
    .config_body{
      width: 0;transition:all 0.2s; -webkit-transition:all 0.2s;
      .icon_btn_add{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;background: url('../images/icon_btn_add.png') 50% 50% / auto auto no-repeat;}
      .title{
        height: 80px;border-bottom: 1px solid #eee;font-size: 30px;color: #4E81BD;padding: 20px 0;
        .icon_back{width: 40px;height: 40px;margin: 0 30px;float: left;background: url('../images/icon_back.png') 0 0 / 100% 100% no-repeat;display: inline-block;cursor: pointer;}
      }
      .content{
        padding: 0 30px;
        .nav_tab{height: 100px;}
        .nav_tab > div{flex: 1;padding: 34px 0;text-align: center;}
        .nav_tab > div > div{height: 32px;display: inline-block;border-bottom: 4px solid #fff;font-size: 20px;color: #ccc;line-height: 20px;cursor: pointer;}
        .nav_tab > div > div.act{border-bottom: 4px solid #4F81BE;color: #333;}
        .nav_body{
          padding: 0 30px;min-height: 465px;
          .body{border: 1px solid #eee;border-radius: 2px;background: #F9F9F9;height: 100%;}
          .nav_content_1{
            text-align: center;padding: 26px 0;max-height: 772px;overflow: auto;
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
            .name_value.show_border{border-radius: 2px;border: 1px solid #ccc;max-height: 560px;background: #fff;overflow: auto;}
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
      }
      table .icon{position: absolute;width: 22px;height: 22px;left: 0;top: 50%;transform: translateY(-50%);cursor: pointer;}
      table .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;}
      .button_box .name_value{text-align: right;margin-top: 14px;margin-bottom: 26px;}
      table .checkbox{width: 20px;height: 20px;background: url('../images/icon_checkbox_unchecked.png') 50% 50%/auto auto no-repeat;cursor: pointer;}
      table .checkbox.checked{background: url('../images/icon_checkbox_checked.png') 50% 50% / auto auto no-repeat;}
    }
  }
  .configuration.act{
    z-index: 99;
    .config_body{width: 800px;height: 100%;background: #fff;float: right;}
  }
</style>
