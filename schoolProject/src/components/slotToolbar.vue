<template>
  <div class="body" v-cloak>

    <div class="nav_tab">
      <div><div @click='()=>{this.data.tab=0}' :class='{"act": data.tab==0}'>{{ $t("Power Users") }}</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <!-- Groups -->
        <div class="nav_content" v-show='data.tab==0' style="padding: 0;text-align: left;">
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
          users: [],
          showAddParticipantPopup: false,
          allUsers: [],
          copyAllUsers: []
        }
      }
    },
    computed: {
    },
    mounted () {
      this.getUsers().then(() => {
        this.getPowerUsers();
      });
    },
    methods: {
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
    }
  }
</style>
