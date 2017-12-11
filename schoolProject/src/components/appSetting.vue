<template>
  <div class="configuration" :class='{"act": show}'>
    <div class="config_bg" @click='closeDialog()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeDialog()'></span>App permission
      </div>
      <div class="content">
        <div class="nav_tab flex">
          <div><div @click='()=>{this.data.tab=0}' :class='{"act": data.tab==0}'>Application Management</div></div>
          <div><div @click='()=>{this.data.tab=1}' :class='{"act": data.tab==1}'>Application Permission</div></div>
        </div>
        <div class="nav_body">
          <div class="body">
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
                </div>
              </div>
              <div class="name_box">
                <span class="lab" style="vertical-align: middle;">Logo:</span>
                <div class="name_value" style="vertical-align: middle;">

                  <!-- 图片上传 -->
                  <el-upload class="logo_box"
                             action="https://jsonplaceholder.typicode.com/posts/"
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
                  <input class="form-control" type="text" name="" v-model='data.appUrl'>
                </div>
              </div>
              <div class="name_box">
                <span class="lab">Description:</span>
                <div class="name_value">
                  <textarea class="form-control textarea" v-model='data.appDesc'></textarea>
                </div>
              </div>
            </div>
            <!-- Application Permission -->
            <div class="nav_content_1" v-show='data.tab==1'>
              <!-- sub tabs -->
              <div class="nav_subtab">
                <div :class='{"act": data.subtab==0}' @click='()=>{this.data.subtab=0}'>AD Groups</div>
                <div :class='{"act": data.subtab==1}' @click='()=>{this.data.subtab=1}'>Users</div>
                <div class="slide_block" :class='{"right": data.subtab==1}'></div>
              </div>
              <!-- sub tabs content -->
              <!-- Groups -->
              <div v-show='data.subtab==0'>
                <div class="name_box">
                  <span class="lab">AD Groups:</span>
                  <div class="name_value">

                    <drapdown :input-value='data.groupId'
                              :input-name='data.groupName'
                              :input-select='data.groupList'
                              :input-add='true'
                              :input-item-text='"New Group"'
                              @inputChange='groupChanged'
                              @addItem='addGroup'>
                    </drapdown>

                    <span class="icon icon_edit" @click='editGroup(data.groupName)'></span>
                  </div>
                  <div class="name_box">
                    <span class="lab">Permissions:</span>
                    <div class="name_value show_border">
                      <div class="check_all">
                        <div class="checkbox">
                          <label :class='{"checked": data.groupPermissionAll}'>
                            <input @click='checkAllChange("group")' type="checkbox" v-model='data.groupPermissionAll'> All Programs
                          </label>
                        </div>
                      </div>
                      <div class="check_list">
                        <div class="checkbox" v-for='item in data.groupPermissionList'>
                          <label :class='{"checked": item.checked}'>
                            <input @click='checkChange(item, "group")' type="checkbox" v-model='item.checked'>
                            <span class="app_app_bg"></span>
                            {{item.name}}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Users -->
              <div v-show='data.subtab==1'>
                <div class="name_box">
                  <span class="lab">User:</span>
                  <div class="name_value">

                    <el-select v-model="data.userName" filterable default-first-option placeholder="请选择">
                      <el-option v-for="user in data.userList"
                                 :key="user.value"
                                 :label="user.name"
                                 :value="user.value">
                      </el-option>
                    </el-select>

                  </div>
                </div>
                <div class="name_box">
                  <span class="lab" style="vertical-align: middle;">Grouped in:</span>
                  <div class="name_value" style="vertical-align: middle;">
                    <div class="card">
                      <span class="icon icon_member"></span> {{data.userGroupedIn}}
                    </div>
                  </div>
                </div>
                <div class="name_box">
                  <span class="lab">Permissions:</span>
                  <div class="name_value show_border">
                    <div class="check_all">
                      <div class="checkbox">
                        <label :class='{"checked": data.userPermissionAll}'>
                          <input @click='checkAllChange("user")' type="checkbox" v-model='data.userPermissionAll'> All Programs
                        </label>
                      </div>
                    </div>
                    <div class="check_list">
                      <div class="checkbox" v-for='item in data.userPermissionList'>
                        <label :class='{"checked": item.checked}'>
                          <input @click='checkChange(item, "user")' type="checkbox" v-model='item.checked'>
                          <span class="app_app_bg"></span>
                          {{item.name}}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show='data.tab==0' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="saveApp()">Save</button>
            <button type="button" class="btn btn-danger" @click="deleteApp()">Delete</button>
          </div>
          <div v-show='data.tab==1 && data.subtab==0' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="saveGroup()">Save</button>
            <button type="button" class="btn btn-danger" @click="deleteGroup()">Delete</button>
          </div>
          <div v-show='data.tab==1 && data.subtab==1' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="">Save</button>
            <button type="button" class="btn btn-danger" @click="">Delete</button>
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
import {forEach} from '@/plugins/util'
export default {
  props: {
  },
  components: {
    drapdown, alert, prompt
  },
  data () {
    return {
      show: false,
      data: {
        tab: 0,
        subtab: 0,
        // App management
        appList: [
          {value: '1', name: 'app 1'},
          {value: '2', name: 'app 2'}
        ],
        appId: '1',
        appName: 'app 1',
        appScouce: null,
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
        userList: [
          {value: '1', name: 'William Trang'},
          {value: '2', name: 'William Trang 2'}
        ],
        userId: '1',
        userName: 'William Trang',
        userGroupedIn: 'Qingpu Techer',
        userPermissionAll: false,
        userPermissionList: [
          {value: 3, name: 'App name 3', checked: false},
          {value: 4, name: 'App name 4', checked: false}
        ]
      }
    }
  },
  mounted () {
  },
  watch: {
    show () {
      if (this.show) {
        this.getAppList();
        this.getUsers();
      }
    }
  },
  methods: {
    // 获取数据
    getAppList () {
      let param = {apps: ''};
      return this.$http.post('/appCtl/app/appAllList', {
        data: JSON.stringify(param)
      }).then((res) => {
        let appList = [];
        forEach(res.data, (i, item) => {
          appList.push({
            value: item.id,
            name: item.nom,
            source: item
          })
        })
        // 设置默认值
        if (appList.length) {
          this.data.appId = appList[0].source.id;
          this.data.appName = appList[0].source.nom;
          this.data.appScouce = appList[0].source;
          this.data.appLogo = appList[0].source.picUrl;
          this.data.appUrl = appList[0].source.baseaddress;
          this.data.appDesc = appList[0].source.description;
        }

        this.data.appList = appList;
        return res;
      })
    },
    getUsers () {
      let params = {flag: 1};
      return this.$http.post('/sharedcalendarSettingCtl/event/getGroupsOrUsers', {
        data: JSON.stringify(params)
      }).then((res) => {
        // console.log(res)
        let userList = [];
        forEach(res.data, (i, item) => {
          userList.push({
            value: item.id,
            name: item.nom,
            source: item
          })
        })

        if (userList.length) {
          this.data.userId = userList[0].value;
          this.data.userName = userList[0].name;
        }

        this.data.userList = userList;
        return res;
      })
    },
    // Application Manage functions
    // APP切换
    applicationChanged (item) {
      this.data.appId = item.source.id;
      this.data.appName = item.source.nom;
      this.data.appScouce = item.source;
      this.data.appLogo = item.source.picUrl;
      this.data.appUrl = item.source.baseaddress;
      this.data.appDesc = item.source.description;
    },
    // 新增APP
    addApplication () {
      this.$refs.prompt.showDialog().then((text) => {
        this.data.appId = '';
        this.data.appName = text;
        this.data.appScouce = null;
        this.data.appLogo = '';
        this.data.appUrl = '';
        this.data.appDesc = '';
        this.data.appList.push({value: text, name: text});
      })
    },
    // 修改APP名称
    editApplication (oldText) {
      this.$refs.prompt.showDialog(oldText).then((text) => {
        for (let i = 0, len = this.data.appList.length; i < len; i++) {
          let item = this.data.appList[i];
          if (oldText === item.name) {
            item.value = item.name = text;
            break;
          }
        }
        this.data.appName = text;
      })
    },
    // 图标上传成功
    handleAvatarSuccess (res, file) {
      this.data.appLogo = URL.createObjectURL(file.raw);
    },
    // 图标上传前校验
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$refs.alert.showDialog('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$refs.alert.showDialog('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 保存APP
    saveApp () {
      this.submitApp(0)
    },
    // 删除APP
    deleteApp () {
      this.$refs.alert.showDialog('Confirm the deletion?').then(() => {
        this.submitApp(-1)
        this.$refs.alert.show = false;
      })
    },
    // 提交APP
    submitApp (opt) {
      let params = {
        id: this.data.appId || 0,
        nom: this.data.appName,
        // picUrl: this.data.appLogo,
        baseaddress: this.data.appUrl,
        description: this.data.appDesc,
        insideschool: this.data.appScouce ? this.data.appScouce.insideschool : 1,
        auth_required: this.data.appScouce ? this.data.appScouce.auth_required : 1,
        disabled: opt
      }

      // console.log(params)
      return this.$http.post('/sharedcalendarSettingCtl/event/editApplication', {
        data: JSON.stringify(params)
      }).then((res) => {
        if (res.result === 'SUCCESS') {
          let banner = {
            status: 'SUCCESS',
            msg: 'Success!'
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
    // 修改AD Groups
    editGroup (oldText) {
      this.$refs.prompt.showDialog(oldText).then((text) => {
        this.data.groupName = text;
        for (let i = 0, len = this.data.groupList.length; i < len; i++) {
          let item = this.data.groupList[i];
          if (oldText === item.name) {
            item.name = text;
            break;
          }
        }
      })
    },
    // 新增group
    addGroup () {
      this.$refs.prompt.showDialog().then((text) => {
        this.data.groupId = '';
        this.data.groupName = text;
        this.data.groupList.push({value: text, name: text});
      })
    },
    // 保存group
    saveGroup () {
      this.submitGroup(0);
    },
    // 删除group
    deleteGroup () {
      this.$refs.alert.showDialog('Confirm the deletion?').then(() => {
        this.submitGroup(-1);
      })
    },
    // 提交group
    submitGroup (opt) {
      let params = {
        groupId: this.data.groupId,
        groupName: this.data.groupName,
        opt: opt,
        apps: ''
      }

      console.log(params)
      return this.$http.post('/', {
        data: JSON.stringify(params)
      }).then((res) => {
        if (res.result === 'SUCCESS') {
          let banner = {
            status: 'SUCCESS',
            msg: 'Success!'
          }
          this.$emit('openBanner', banner);
        }
        return res;
      })
    },
    // 全选
    checkAllChange (str) {
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
    },
    // 复选框状态切换
    checkChange (item, str) {
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
    },
    closeDialog () {
      this.show = false;
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
            text-align: center;padding: 26px 0;
            .name_box{margin-top: 14px;}
            .lab{font-size: 18px;color: #999;vertical-align: top;display: inline-block;width: 120px;text-align: right;margin-right: 10px;line-height: 34px;}
            .lab.long_text{width: 185px;}
            .name_value{
              display: inline-block;width: 350px;position: relative;text-align: left;
              .textarea{height: 140px;}
              .logo_box{width: 80px;height: 80px;border: 1px dashed #ccc;border-radius: 50%;background: #fff;}
              .default_icon{height: 100%;background: url('../images/icon_update.png') 50% 50% / auto auto no-repeat;display: block;}
              .check_all{padding: 0 16px;}
              .check_list{padding: 0 16px 0 32px;}
              .checkbox input[type=checkbox], .checkbox-inline input[type=checkbox]{display: none;}
              .checkbox label{padding-left: 0;display: block;}
              .checkbox label:before{content: "";position: absolute;width: 20px;height: 20px;right: 0;background: url('../images/icon_checkbox_unchecked.png') 50% 50% / auto auto no-repeat;top: 50%;transform: translateY(-50%);}
              .checkbox .checked:before{background: url('../images/icon_checkbox_checked.png') 50% 50% / auto auto no-repeat;}
              .checkbox .app_app_bg{display: inline-block;width: 30px;height: 30px;background: #ccc;vertical-align: middle;border-radius: 50%;}
              .card{width: 150px;border-radius: 2px;border: 1px solid #4F81BE;vertical-align: middle;padding: 3px 5px;background: #fff;}
              .icon{width: 20px;height: 20px;display: inline-block;vertical-align: middle;margin-right: 5px;}
              .icon_member{left: 16px;background: url('../images/icon_member.png') 0 0 / 100% 100% no-repeat;}
              .icon_members{left: 16px;background: url('../images/icon_members.png') 0 0 / 100% 100% no-repeat;}
            }
            .name_value.show_border{border-radius: 2px;border: 1px solid #ccc;height: 300px;background: #fff;}
            .name_value > .icon{position: absolute;width: 22px;height: 22px;right: 45px;top: 50%;transform: translateY(-50%);cursor: pointer;}
            .name_value > .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;}
            .button_box .name_value{text-align: right;margin-top: 14px;margin-bottom: 26px;}
            .nav_subtab{
              width: 300px;margin: auto;border-radius: 34px;overflow: hidden;color: #4F81BE;position: relative;z-index: 0;background: #fff;border: 1px solid #ccc;
              div{float: left;width: 50%;line-height: 34px;}
              .act{color: #fff;}
              .slide_block{position: absolute;left: 0;height: 100%;background: #4F81BE;z-index: -1;border-radius: 34px;transition: all 0.2s;}
              .slide_block.right{left: 50%;}
            }
          }
          .nav_content_1_btn{
            text-align: center;
            .btn{width: 150px;margin-top: 50px;}
            .cancel{background: #ccc;color: #fff;}
          }
        }
      }
    }
  }
  .configuration.act{
    z-index: 99;
    .config_body{width: 800px;height: 100%;background: #fff;float: right;}
  }
</style>
