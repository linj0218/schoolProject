<template>
  <div class="body" v-cloak>

    <div class="nav_tab">
      <div><div @click='()=>{this.data.tab=0}' :class='{"act": data.tab==0}'>{{ $t("Quick Access") }}</div></div>
      <div><div @click='()=>{this.data.tab=1}' :class='{"act": data.tab==1}'>{{ $t("Power Users") }}</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <div class="nav_content" v-show='data.tab==0'>
          <div class="member_box">
            <span class="lab">{{ $t("Name") }}:</span>
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
              <span class="icon icon_delete" @click='deleteApplication()'></span>
            </div>
          </div>
          <div class="member_box">
            <span class="lab" style="vertical-align: middle;">{{ $t("Logo") }}:</span>
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
          <div class="member_box">
            <span class="lab">{{ $t("URL") }}:</span>
            <div class="name_value">
              <input class="form-control" type="text" name="" v-model='data.appUrl' @blur='submitApp(0)'>
            </div>
          </div>
          <div class="member_box">
            <span class="lab">{{ $t("Description") }}:</span>
            <div class="name_value">
              <textarea class="form-control textarea" v-model='data.appDesc' @blur='submitApp(0)'></textarea>
            </div>
          </div>
          <div class="member_box">
            <span class="lab">{{ $t("Priority") }}:</span>
            <div class="name_value">

              <drapdown :input-value='data.sortNum'
                        :input-name='data.sortNum'
                        :input-select='data.positionList'
                        :input-add='false'
                        @inputChange='positionChanged'>
              </drapdown>

            </div>
          </div>
        </div>
        <!-- Power Users -->
        <div class="nav_content" v-show='data.tab==1' style="padding: 0;text-align: left;">
          <div class="member_box">
            <span class="lab">{{ $t("Power Users") }}:</span>
            <div class="member_value">
              <div class="li" v-for='(item, index) in data.users'>
                {{item.name}}
                <span class="action_icon icon_delete" @click='removeUser(item, index)'></span>
              </div>
            </div>
          </div>
          <div class="member_box">
            <span class="lab"></span>
            <div class="name_value" style="text-align: right;">
              <button type="button" class="btn btn-primary" @click='openAddParticipantModal()'>
                <i class="iconfont iconfont-jia"></i> {{ $t("New Users") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <alert ref='alert'></alert>

    <prompt ref='prompt'></prompt>

    <!-- 选择成员弹窗 -->
    <add-participant-modal :show-popup='data.showAddParticipantPopup'
                           :data-list='data.copyAllUsers'
                           @closePopup='closeAddParticipantModal'>
    </add-participant-modal>

  </div>
</template>

<script>
  import headerr from '@/components/header'
  import drapdown from '@/components/drapdown'
  import alert from '@/components/alert'
  import prompt from '@/components/prompt'
  import addParticipantModal from '@/components/addParticipantModal'
  import {forEach} from '@/script/util'

  export default {
    components: {
      headerr, drapdown, alert, prompt, addParticipantModal
    },
    data () {
      return {
        data: {
          tab: 0,

          // Quick Access
          appList: [],
          appId: '',
          appName: '',
          appSource: {},
          appLogo: '',
          appUrl: '',
          appDesc: '',
          sortNum: 1,
          positionList: [],

          // Power Users
          users: [],
          showAddParticipantPopup: false,
          allUsers: [],
          copyAllUsers: []
        },
        actionUrl: this.$config.api_path.img_upload
      }
    },
    computed: {
    },
    mounted () {
      let tempList = [];
      for (let i = 1; i <= 20; i++) {
        tempList.push({ name: '' + i, value: '' + i });
      }
      this.data.positionList = tempList;

      this.getUsers().then(() => {
        this.getPowerUsers();
      });
      this.getQuickAccess();
    },
    methods: {
      // 查询快速访问APP列表
      getQuickAccess () {
        return this.$http.post('/appCtl/app/quickAccessList', {}).then((res) => {
          // console.log(res);
          if (res.result === 'SUCCESS') {
            // 把返回列表数据转成控件需要的数据结构
            let appList = [];
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i];
              appList.push({
                value: item.id,
                name: item.nom,
                checked: false,
                source: item
              })
            }
            this.data.appList = appList;

            // 展示默认值，列表第一项或已选中的APPID项
            let defaultItem = {};
            if (!this.data.appName && this.data.appList.length) {
              defaultItem = this.data.appList[0];
            } else {
              for (let i = 0; i < this.data.appList.length; i++) {
                if (this.data.appList[i].name === this.data.appName) {
                  defaultItem = this.data.appList[i];
                  break;
                }
              }
            }
            if (JSON.stringify(defaultItem) === '{}') return res;

            this.applicationChanged(defaultItem);
          }
          return res;
        })
      },
      addApplication () {
        this.$refs.prompt.showDialog().then((text) => {
          this.data.appId = '';
          this.data.appName = text;
          this.data.appLogo = '';
          this.data.appUrl = '';
          this.data.appDesc = '';
          this.submitApp(0)
        })
      },
      applicationChanged (item) {
        this.data.appId = item.source.id;
        this.data.appName = item.source.nom;
        this.data.appSource = item;
        if (item.source.picUrl) {
          this.data.appLogo = this.$config.api_path.img_path + item.source.picUrl;
        } else {
          this.data.appLogo = '';
        }
        this.data.appUrl = item.source.baseaddress;
        this.data.appDesc = item.source.description;

        this.data.sortNum = item.source.sortNum || '1';
      },
      // 修改APP名称
      editApplication (oldText) {
        this.$refs.prompt.showDialog(oldText).then((text) => {
          this.data.appName = text;
          this.submitApp(0);
        })
      },
      // 删除APP
      deleteApplication () {
        this.$refs.alert.showDialog('Confirm the deletion?').then(() => {
          this.data.appName = '';
          this.submitApp(-1)
          this.$refs.alert.show = false;
        })
      },
      // 提交接口
      submitApp (opt) {
        let params = {
          id: this.data.appId || 0,
          nom: this.data.appName,
          // picUrl: this.data.appLogo,
          baseaddress: this.data.appUrl,
          description: this.data.appDesc,
          insideschool: this.data.appSource ? this.data.appSource.insideschool : 1,
          auth_required: this.data.appSource ? this.data.appSource.auth_required : 1,
          disabled: opt,
          sortNum: Number(this.data.sortNum)
        }

        // console.log(params);
        return this.$http.post('/sharedcalendarSettingCtl/event/editQuickAccess', params).then((res) => {
          if (res.result === 'SUCCESS') {
            let banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
            this.$emit('openBanner', banner);
            this.getQuickAccess();
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
      // 上传成功
      handleAvatarSuccess (res, file) {
        if (res.success) {
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
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$refs.alert.showDialog('Uploading image images can only be JPG or PNG format!', true);
        }
        if (!isLt2M) {
          this.$refs.alert.showDialog('Upload profile picture size can\'t exceed 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 权重修改事件
      positionChanged (item) {
        this.data.sortNum = item.value;
        this.submitApp(0);
      },
      removeUser (user, index) {
        for (let i = 0; i < this.data.allUsers.length; i++) {
          let item = this.data.allUsers[i];
          if (item.id === user.id) {
            item.selected = false;
            this.data.users.splice(index, 1);
            this.editPowerUsers(0, [item])
            break;
          }
        }
      },
      // 开启Participant弹窗
      openAddParticipantModal () {
        this.data.copyAllUsers = JSON.parse(JSON.stringify(this.data.allUsers));
        this.data.showAddParticipantPopup = true;
      },
      // 关闭Participant弹窗
      closeAddParticipantModal (resData) {
        this.data.showAddParticipantPopup = false;
        if (resData && resData.status === 'ok') {
          this.data.allUsers = this.data.copyAllUsers;
          this.data.users = this.data.users.concat(resData.data);
          this.editPowerUsers(1, resData.data);
        }
      },
      // 获取所有用户
      getUsers () {
        let self = this;
        return this.$http.post('/sharedcalendarSettingCtl/event/getGroupsOrUsers', {
          data: {flag: 1}
        }).then((res) => {
          let resData = res.data
          let userList = []
          forEach(resData, (i, item) => {
            userList.push({
              id: item.id,
              name: item.nom,
              type: 'icon_member',
              selected: false,
              show: true
            })
          })
          self.data.allUsers = userList;
          return res
        })
      },
      // 获取所有Power Users
      getPowerUsers () {
        // type:页面类型 0-toolbar 1-calendar
        return this.$http.post('/sharedcalendarSettingCtl/event/findPowerUser', {
          data: {type: 0}
        }).then((res) => {
          let userIdList = res.data.length && res.data;
          let users = [];
          for (let i = 0; i < userIdList.length; i++) {
            let item = userIdList[i];
            for (let i2 = 0; i2 < this.data.allUsers.length; i2++) {
              let item2 = this.data.allUsers[i2];
              if (item.id === item2.id) {
                users.push(item2);
                break;
              }
            }
          }
          this.data.users = users;
        })
      },
      // 修改Power Users
      editPowerUsers (flagValue, users) {
        let postData = [];
        for (let i = 0; i < users.length; i++) {
          postData.push(users[i].id);
        }
        // type:页面类型 0-toolbar 1-calendar
        // flag_value:0-删除 1-新增
        return this.$http.post('/sharedcalendarSettingCtl/event/editPowerUser', {
          data: { userIdList: postData, type: 0, flag_value: flagValue }
        })
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
    .nav_content{
      padding: 26px 0;
      .name_value{display: inline-block;width: 350px;position: relative;}
      .name_value > .icon{position: absolute;width: 22px;height: 22px;right: 35px;top: 50%;transform: translateY(-50%);cursor: pointer;}
      .name_value > .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;right: 65px;}
      .name_value > .icon.icon_delete{background: url('../images/icon_delete.png') 0 0 / 100% 100% no-repeat;}
    }
  }
  .logo_box{
    width: 80px;height: 80px;border: 1px dashed #ccc;border-radius: 50%;background: #fff;overflow: hidden;
    img{width: 100%;height: 100%;}
  }
  .default_icon{height: 100%;background: url('../images/icon_update.png') 50% 50% / auto auto no-repeat;display: block;}
</style>
