<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @profileToggle='profileToggle'></headerr>

    <div class="page_body">
      <crumbs :name="data.crumbsName"></crumbs>
      <div class="page_body_box">
        <div class="content">
          <div class="form_field">
            <label class="lab">{{$t('Title')}}:</label>
            <div class="val">
              <input class="form-control" type="text" v-model="data.memo.memo_name">
              <el-color-picker id="lj_colorpicker"
              v-model="data.memo.color"
              :predefine="predefineColors"
              @change="">
            </el-color-picker>
            </div>
          </div>
          <div class="form_field"  v-if="userInfo.role===0">
            <label class="lab">{{ $t("Editor") }}:</label>
            <div class="val editors">
              <div class="li" v-for='(item, index) in data.editors'>
                {{item.name}}
                <i class="iconfont iconfont-chahao" @click="removeEditor(item, index)"></i>
              </div>
              <button type="button" :disabled="!data.allUsers.length" @click='openAddParticipantModal()' class="li_add"></button>
            </div>
          </div>
          <!-- <div class="form_field">
            <label class="lab"></label>
            <div class="val" style="width: 348px;height: 38px;">
              <button type="button" class="btn btn-primary" id="new_editor" @click='openAddParticipantModal()' :disabled="!data.allUsers.length">
                <i class="iconfont iconfont-jia"></i> {{ $t("New Editor") }}
              </button>
            </div>
          </div> -->
          <div class="form_field">
            <label class="lab">{{$t('Template')}}:</label>
            <div class="val">
              <div class="temp_icon icon_temp_1" :class="data.memo.template === 0 ? 'act' : ''" @click="switchTemplate(0)"></div>
              <div class="temp_icon icon_temp_2" :class="data.memo.template === 1 ? 'act' : ''" @click="switchTemplate(1)"></div>
              <!-- <div class="temp_icon icon_temp_3" :class="data.templateAct === 2 ? 'act' : ''" @click="switchTemplate(2)"></div> -->
            </div>
          </div>
          <div class="form_field" v-for="(cont, index) in data.memo.memoContentList" v-if="cont.del_flag != -1">
            <label class="lab" style="vertical-align: top">{{$t('Content')}} {{index + 1}}:</label>
            <div class="val">
              <div class="temp_cont" v-if='!cont.open' @click="trigger(cont)">
                <span class="_title">{{cont.sub_title}}</span>
                <i class="iconfont iconfont-lajitong" @click.stop="deleteContent(cont, index)" v-if="data.memo.memoContentList.length > 1"></i>
                <i class="iconfont iconfont-shuangjiantou"></i>
              </div>
              <div class="temp_cont2" v-else>
                <i class="iconfont iconfont-lajitong" @click.stop="deleteContent(cont, index)" v-if="data.memo.memoContentList.length > 1"></i>
                <i class="iconfont iconfont-shuangjiantou" style="transform: rotate(180deg);" @click="trigger(cont)"></i>
                <label class="temp_lab">{{$t("Subtitle")}}</label>
                <div class="">
                  <input class="form-control" type="text" v-model="cont.sub_title">
                </div>
                <!-- <label class="temp_lab">{{$t("Picture")}}</label>
                <div class="">
                  <div class="empty_pic">
                    <i class="iconfont iconfont-tupian"></i>
                  </div>
                </div> -->
                <label class="temp_lab">{{$t("Text")}}</label>
                <div class="">
                  <uedit :id="cont.id" :content="cont.memo_text" @syncContent="syncContent"></uedit>
                </div>
              </div>
            </div>
          </div>
          <div class="form_field">
            <label class="lab"></label>
            <div class="val">
              <div class="edit_box">
                <button type="button" class="btn btn-primary" @click="addContent()">
                  <i class="iconfont iconfont-jia"></i> {{ $t("New Contents") }}
                </button>
                <div class="edit_info">
                  <div class="edit_lab">{{ $t("Last Edition") }}</div>
                  <div class="edit_val">{{$moment(data.memo.last_updatetime).format('DD/MM/YYYY HH:mm') || $moment(data.memo.create_time).format('DD/MM/YYYY HH:mm')}}</div>
                  <div class="edit_val">{{data.memo.last_update_username || data.memo.create_username}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btns">
            <button type="button" class="btn _preview" @click="openPreview()">{{ $t("Preview") }}</button>
            <button type="button" class="btn _save" @click="save()">{{ $t("Save") }}</button>
            <button type="button" class="btn _cancel" @click="cancel()">{{ $t("Save and quit") }}</button>
          </div>
        </div>
      </div>

      <!-- 预览 -->
      <div class="memo_preview" v-if="data.previewFlg">
        <div class="_content">
          <div class="prev_head">
            {{ $t("Preview") }}
            <span class="icon_close" @click='closePreview()'></span>
          </div>
          <div class="" style="background: #fff;padding: 20px 30px;">
            <memo :titleType="'type1'" :memo="data.previewMemo" :readonly="true"></memo>
          </div>
        </div>
      </div>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <banner ref='banner'></banner>

      <alert ref='alert'></alert>

      <!-- 选择成员弹窗 -->
      <add-participant-modal :show-popup='data.showAddParticipantPopup'
                             :data-list='data.copyAllUsers'
                             @closePopup='closeAddParticipantModal'>
      </add-participant-modal>
    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import crumbs from '@/components/crumbs'
  import banner from '@/components/banner'
  import profile from '@/components/profile'
  import uedit from '@/components/uedit'
  import memo from '@/components/memoModel'
  import alert from '@/components/alert'
  import addParticipantModal from '@/components/addParticipantModal'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      headerr, crumbs, banner, profile, uedit, memo, alert, addParticipantModal
    },
    data () {
      return {
        data: {
          memo: {},
          templateAct: 0,
          previewFlg: false,
          previewMemo: {},
          crumbsName: '',
          editors: [],
          showAddParticipantPopup: false,
          copyAllUsers: [],
          allUsers: []
        },
        predefineColors: [
          '#DB465F', '#B59479', '#716DC2', '#2C66C2', '#47AD56', '#687280', '#00B3CF', '#F2A200', '#00CFB0', '#4A90E2', '#5ACE6D'
        ]
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      // !@#$%^&*()_+
      document.getElementsByClassName('el-color-dropdown')[0].style.zoom = 2.1 - Number.parseFloat(document.getElementsByTagName('html')[0].style.zoom, 10);
      this.init();
    },
    methods: {
      init () {
        this.getUsers();
        this.getMemo();
      },
      // 按id查询memo
      getMemo () {
        let params = {
          id: this.$route.query.memo_id
        }
        return this.$http.post('/memoCtl/memo/findMemoById', params).then((res) => {
          // this.data.memo = res.data;
          if (!res.data.memoContentList.length) {
            let list = [{id: 'temp_id_' + this.$moment().format('X'), open: true, memo_text: ''}]
            res.data.memoContentList = list;
          } else {
            for (let i = 0; i < res.data.memoContentList.length; i++) {
              res.data.memoContentList[i].open = true;
            }
          }
          let editors = [];
          for (let i = 0; i < res.data.memoUserList.length; i++) {
            let tempObj = {
              id: res.data.memoUserList[i].edit_userid,
              name: res.data.memoUserList[i].edit_username,
              type: 'icon_member',
              selected: true,
              show: true
            }
            editors.push(tempObj);
          }
          this.data.editors = editors;
          this.data.memo = res.data;
          this.data.crumbsName = res.data.memo_name;
          return res;
        })
      },
      profileToggle (bol) {
        this.$refs.profile.show = bol;
      },
      // 条幅
      openBanner (res) {
        this.$refs.banner.show(res.msg);
      },
      // 切换模板
      switchTemplate (i) {
        this.data.memo.template = i;
      },
      // 抽屉开关
      trigger (item) {
        item.open = !item.open;
        // 关闭时清除缓存，开启时重新构建uedit
        if (!item.open) {
          window.UE.delEditor('content' + item.id);
        }
      },
      // 删除内容
      deleteContent (content, index) {
        this.$refs.alert.showDialog().then(() => {
          this.data.memo.memoContentList.splice(index, 1);
          this.$set(this.data.memo, 'memoContentList', this.data.memo.memoContentList);
        })
      },
      // 开启预览
      openPreview () {
        let tempObj = {
          titleType: 'type1',
          titleColor: this.data.memo.color,
          contentType: 'type1',
          memoId: this.data.memo.id,
          memoGroupId: this.data.memo.memo_groupid,
          title: this.data.memo.memo_name,
          memos: []
        }
        if (this.data.memo.template === 0) tempObj.contentType = 'type2';
        else if (this.data.memo.template === 1) tempObj.contentType = 'type3';
        else if (this.data.memo.template === 2) tempObj.contentType = 'type1';
        for (let i = 0; i < this.data.memo.memoContentList.length; i++) {
          tempObj.memos.push({
            subTitle: this.data.memo.memoContentList[i].sub_title,
            imgUrl: this.data.memo.memoContentList[i].pic_url,
            content: this.data.memo.memoContentList[i].memo_text
          })
        }
        this.data.previewMemo = tempObj;
        this.data.previewFlg = true;
      },
      // 关闭预览
      closePreview () {
        this.data.previewFlg = false;
      },
      // 新增content
      addContent () {
        this.data.memo.memoContentList.push({id: 'temp_id_' + this.$moment().format('X'), open: true, memo_text: ''})
      },
      // 从富文本编辑器同步到memo
      syncContent (id, content) {
        for (let i = 0; i < this.data.memo.memoContentList.length; i++) {
          if (id === this.data.memo.memoContentList[i].id) {
            this.$set(this.data.memo.memoContentList[i], 'memo_text', content);
            break;
          }
        }
      },
      // 保存
      save () {
        let contentList = [];
        for (let i = 0; i < this.data.memo.memoContentList.length; i++) {
          let tempObj = {
            id: this.data.memo.memoContentList[i].id,
            sub_title: this.data.memo.memoContentList[i].sub_title,
            memo_text: this.data.memo.memoContentList[i].memo_text,
            memo_id: this.data.memo.id,
            sort_no: i,
            del_flag: this.data.memo.memoContentList[i].del_flag || 0
          }
          if (typeof tempObj.id === 'string' && tempObj.id.indexOf('temp_id') === 0) {
            tempObj.id = 0;
          }
          if (tempObj.sub_title && tempObj.memo_text) {
            contentList.push(tempObj);
          }
        }
        let params = JSON.parse(JSON.stringify(this.data.memo));
        params.memoContentList = contentList;
        // editors
        params.memoUserList = [];
        for (let i = 0; i < this.data.editors.length; i++) {
          let tempObj = {
            edit_userid: this.data.editors[i].id
          }
          params.memoUserList.push(tempObj);
        }
        // console.log(params);
        return this.$http.post('/memoCtl/memo/editMemoContents', params).then((res) => {
          // console.log(res);
          let banner = {};
          if (res.result === 'SUCCESS') {
            banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
          } else {
            banner = {
              status: 'FAIL',
              msg: res.msg
            }
          }
          this.openBanner(banner);
          this.init();

          return this.updateMemoSide().then((res) => {
            return res;
          })
        })
      },
      // 更新memo list
      updateMemoSide () {
        let params = {
          memo_groupid: this.data.memo.memo_groupid
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
            memoSideList.push(tempObj);
          }
          this.$store.dispatch('setMemoSideList', memoSideList);
          return res;
        })
      },
      // 退出编辑
      cancel () {
        this.save().then(() => {
          this.$router.back();
        })
      },
      // 获取所有用户
      getUsers () {
        // console.log(1);
        let self = this;
        return this.$http.post('/sharedcalendarSettingCtl/event/getGroupsOrUsers', {
          data: {flag: 1}
        }).then((res) => {
          let resData = res.data
          let userList = []
          for (let i = 0; i < resData.length; i++) {
            let item = resData[i];
            userList.push({
              id: item.id,
              name: item.nom,
              type: 'icon_member',
              selected: false,
              show: true
            })
          }
          self.data.allUsers = userList;
          return res
        })
      },
      // 删除editor
      removeEditor (item, index) {
        this.data.editors.splice(index, 1);
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
          this.data.editors = this.data.editors.concat(resData.data);
          // this.save();
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  @import '../styles/memo';
</style>
