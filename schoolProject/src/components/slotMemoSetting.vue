<template>
  <div class="body" v-cloak>
    <div class="nav_tab">
      <div><div @click='switchTab(0)' :class='{"act": data.tab==0}'>{{ $t("Memo Group") }}</div></div>
      <div><div @click='switchTab(1)' :class='{"act": data.tab==1}'>{{ $t("Memo") }}</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <div class="nav_content_1" v-show='data.tab==0'>
          <div class="name_box">
            <span class="lab">{{ $t("Memo Group name") }}:</span>
            <div class="name_value" style="width: 350px;">

              <drapdown :input-value='data.memoGroupId'
                        :input-name='data.memoGroupName'
                        :input-select='data.memoGroupList'
                        :input-add='true'
                        @addItem='addMemoGroup'
                        @inputChange='memoGroupChanged'>
              </drapdown>

              <span class="icon icon_edit" @click='editMemoGroup(data.memoGroupName)'></span>
              <span class="icon icon_delete" @click='deleteMemoGroup()'></span>
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{ $t("Priority") }}:</span>
            <div class="name_value" style="width: 350px;">

              <drapdown :input-value='data.sort_no'
                        :input-name='data.sort_no'
                        :input-select='data.sortList'
                        :input-add='false'
                        @inputChange='sortnoChanged'>
              </drapdown>

            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{ $t("Memos") }}:</span>
            <!-- <div class="name_value" id="sort_list">
              <div class="memo_bg" v-for="memo in data.memoList">
                <div class="memo_box">
                  <div class="memo_title" :style="{borderLeft: '3px solid ' + memo.color}">
                    {{memo.name}}
                  </div>
                  <div class="memo_editor">
                    {{statusFilter(memo.status)}}
                  </div>
                  <span class="icon icon_link" @click='viewMemo(memo)'></span>
                  <span class="icon icon_delete" @click='deleteMemo(memo)'></span>
                </div>
              </div>
              <span class="top_bg"></span>
            </div> -->

            <!-- 排序 v2 -->
            <div class="name_value">
              <draggable v-model="data.memoList" @end="sortMemo">
                <div class="memo_bg" v-for="memo in data.memoList" :key="memo.id">
                  <div class="memo_box">
                    <div class="memo_title" :style="{borderLeft: '3px solid ' + memo.color}">
                      {{memo.name}}
                    </div>
                    <div class="memo_editor">
                      {{statusFilter(memo.status)}}
                    </div>
                    <span class="icon icon_link" @click='viewMemo(memo)'></span>
                    <span class="icon icon_delete" @click='deleteMemo(memo)'></span>
                  </div>
                </div>
                <span class="top_bg"></span>
              </draggable>
            </div>
          </div>
          <div class="name_box">
            <span class="lab"></span>
            <div class="name_value" style="width: 820px;height: 38px;">
              <button type="button" class="btn btn-primary" id="new_memo" @click="addMemo()">
                <i class="iconfont iconfont-jia"></i> {{ $t("New Memo") }}
              </button>
            </div>
          </div>
        </div>
        <div class="nav_content_1" v-show='data.tab==1'>
          <div class="name_box">
            <span class="lab">{{ $t("Memo name") }}:</span>
            <div class="name_value" style="width: 350px;">

              <drapdown :input-value='data.memoId'
                        :input-name='data.memoName'
                        :input-select='data.memoList'
                        :input-add='false'
                        @addItem='addMemo'
                        @inputChange='memoChanged'>
              </drapdown>

              <span class="icon icon_edit" @click='editMemo(data.memoName)'></span>
              <span class="icon icon_delete" @click='deleteMemo()'></span>
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{$t('Memo of')}}:</span>
            <div class="name_value">
              {{data.memoGroupName}}
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{$t('Color')}}:</span>
            <div class="name_value">
              <el-color-picker class="lj_colorpicker"
                               v-model="data.color"
                               :predefine="predefineColors"
                               @change="submitMemo(0)">
              </el-color-picker>
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{ $t("Editor") }}:</span>
            <div class="member_value">
              <div class="li" v-for='(item, index) in data.editors'>
                {{item.name}}
                <span class="action_icon icon_delete" @click='removeEditor(item, index)'></span>
              </div>
            </div>
          </div>
          <div class="name_box">
            <span class="lab"></span>
            <div class="name_value" style="width: 348px;height: 38px;">
              <button type="button" class="btn btn-primary" id="new_editor" @click='openAddParticipantModal()'>
                <i class="iconfont iconfont-jia"></i> {{ $t("New Editor") }}
              </button>
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{$t('Last Edition')}}:</span>
            <div class="name_value">
              {{data.editTime}}  {{data.editName}}
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{$t('Status')}}:</span>
            <div class="name_value">
              {{statusFilter(data.status)}}
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
import drapdown from '@/components/drapdown'
import prompt from '@/components/prompt'
import alert from '@/components/alert'
import addParticipantModal from '@/components/addParticipantModal'
// import Sortable from 'sortablejs'
import draggable from 'vuedraggable'

export default {
  components: {
    drapdown, prompt, alert, addParticipantModal, draggable
  },
  data () {
    return {
      data: {
        tab: 0,
        memoGroupId: 0,
        memoGroupName: '',
        sort_no: 0,
        sortList: [],
        memoGroupList: [{value: '1', name: 'memo 1'}, {value: '2', name: 'memo 2'}],
        memoList: [],
        memoId: 0,
        memoName: '',
        color: '',
        sticky_flag: 0, // 是否置顶
        status: 0, // memo编辑状态
        showAddParticipantPopup: false,
        editTime: '', // 编辑时间
        editName: '',
        editors: [],
        copyAllUsers: [],
        allUsers: []
      },
      predefineColors: [
        '#DB465F', '#B59479', '#716DC2', '#2C66C2', '#47AD56', '#687280', '#00B3CF', '#F2A200', '#00CFB0', '#4A90E2', '#5ACE6D'
      ]
    }
  },
  computed: {
  },
  mounted () {
    // !@#$%^&*()_+
    document.getElementsByClassName('el-color-dropdown')[0].style.zoom = 2.1 - Number.parseFloat(document.getElementsByTagName('html')[0].style.zoom, 10);
    this.initPage();
    // 初始化排序插件
    // var el = document.getElementById('sort_list');
    // let _this = this;
    // Sortable.create(el, {
    //   onEnd (evt) {
    //     console.log(evt, _this.data.memoList);
    //   }
    // });
  },
  methods: {
    initPage () {
      this.getUsers();
      this.getMemoGroup().then(() => {
        this.getMemoList();
      })
      let sortList = [];
      for (let i = 1; i <= 20; i++) {
        sortList.push({value: i, name: '' + i});
      }
      this.data.sortList = sortList;
    },
    switchTab (i) {
      if (i === 1 && !this.data.memoList.length) return false;
      this.data.tab = i;
    },
    // 获取memo group
    getMemoGroup () {
      return this.$http.post('/memoCtl/memo/getMemoGroupList', {}).then((res) => {
        let memoGroupList = [];
        for (let i = 0; i < res.data.length; i++) {
          let tempObj = {value: res.data[i].id, name: res.data[i].memo_groupname, field: res.data[i]};
          memoGroupList.push(tempObj);

          if (this.data.memoGroupName === '') {
            this.data.memoGroupId = tempObj.value;
            this.data.memoGroupName = tempObj.name;
            this.data.sort_no = res.data[i].sort_no || 1;
          } else if (this.data.memoGroupName === tempObj.name) {
            this.data.memoGroupId = tempObj.value;
            this.data.sort_no = res.data[i].sort_no || 1;
          }
        }
        this.data.memoGroupList = memoGroupList;
        return res;
      })
    },
    // 新增memo group
    addMemoGroup () {
      this.$refs.prompt.showDialog().then((text) => {
        this.data.memoGroupId = 0;
        this.data.memoGroupName = text;
        this.data.sort_no = 1;
        this.submitMemoGroup(1);
      })
    },
    // memo group改变事件
    memoGroupChanged (item) {
      this.data.memoName = '';
      this.data.memoGroupId = item.value;
      this.data.memoGroupName = item.name;
      this.data.sort_no = item.field.sort_no || 1;
      this.getMemoList();
    },
    // 编辑memo group
    editMemoGroup (str) {
      this.$refs.prompt.showDialog(str).then((text) => {
        this.data.memoGroupName = text;
        this.submitMemoGroup(0);
      })
    },
    // 删除memo group
    deleteMemoGroup () {
      this.$refs.alert.showDialog().then(() => {
        this.submitMemoGroup(-1).then(() => {
          this.data.memoGroupId = 0;
          this.data.memoGroupName = '';
        })
      })
    },
    sortnoChanged (item) {
      this.data.sort_no = item.value;
      this.submitMemoGroup(0);
    },
    // 提交memo group表单
    submitMemoGroup (opt) {
      // opt -1删除 0修改 1新增
      let params = {
        id: this.data.memoGroupId,
        memo_groupname: this.data.memoGroupName,
        del_flag: opt,
        sort_no: this.data.sort_no
      }
      return this.$http.post('/memoCtl/memo/editMemoGroup', {
        data: params
      }).then((res) => {
        let banner = {};
        if (res.result === 'SUCCESS') {
          banner = {
            status: 'SUCCESS',
            msg: 'Succeeded!'
          }
          this.getMemoGroup().then(() => {
            this.getMemoList();
          })
        } else {
          banner = {
            status: 'FAIL',
            msg: res.msg
          }
        }
        this.$emit('openBanner', banner);
        return res;
      })
    },
    // 按memo group ID查询memos
    getMemoList () {
      let params = {
        memo_groupid: this.data.memoGroupId
      }
      return this.$http.post('/memoCtl/memo/findMemoByGroupId', params).then((res) => {
        // console.log(res);
        let memoList = [];
        for (let i = 0; i < res.data.length; i++) {
          let field = res.data[i];
          field.value = field.id;
          field.name = field.memo_name;
          memoList.push(field);

          if (this.data.memoName === '' || this.data.memoName === field.name) {
            this.getMemo(field.id);
          }
        }
        this.data.memoList = memoList;
        return res;
      })
    },
    // memo编辑状态过滤器
    statusFilter (i) {
      return i === 1 ? this.$t('Newly created') : this.$t('Edited');
    },
    // 查看当前memo
    viewMemo (item) {
      this.data.tab = 1;
      this.getMemo(item.value);
    },
    // 编辑memo
    editMemo (str) {
      this.$refs.prompt.showDialog(str).then((text) => {
        this.data.memoName = text;
        this.submitMemo(0);
      })
    },
    // 按memo ID查询
    getMemo (id) {
      let params = {
        id: id
      }
      return this.$http.post('/memoCtl/memo/findMemoById', params).then((res) => {
        this.data.memoId = res.data.id;
        this.data.memoName = res.data.memo_name;
        this.data.color = res.data.color;
        this.data.status = res.data.status;
        this.data.sticky_flag = res.data.sticky_flag; // 是否置顶
        if (res.data.last_updatetime) {
          this.data.editTime = this.$moment(res.data.last_updatetime).format('DD/MM/YYYY');
          this.data.editName = res.data.last_update_username;
        } else {
          this.data.editTime = this.$moment(res.data.create_time).format('DD/MM/YYYY');
          this.data.editName = res.data.create_username;
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
        return res;
      })
    },
    // memo改变事件
    memoChanged (item) {
      this.viewMemo(item);
    },
    // 删除editor
    removeEditor (item, index) {
      this.data.editors.splice(index, 1);
      this.submitMemo();
    },
    // 新增memo
    addMemo () {
      this.$refs.prompt.showDialog().then((text) => {
        this.data.memoId = 0;
        this.data.memoName = text;
        this.data.editors = [];
        this.submitMemo(1);
      })
    },
    // 删除memo
    deleteMemo (item) {
      this.$refs.alert.showDialog().then(() => {
        if (item) {
          this.data.memoId = item.value;
        }
        this.submitMemo(-1).then(() => {
          this.data.memoId = 0;
          this.data.memoName = '';
        })
      })
    },
    // 提交memo表单
    submitMemo (opt) {
      let params = {
        id: this.data.memoId,
        memo_name: this.data.memoName,
        memo_groupid: this.data.memoGroupId,
        del_flag: opt, // -1 删除 0 修改 1 新增
        color: opt === 1 ? '#DB465F' : this.data.color, // 颜色
        memoUserList: []
      }
      // 0 不置顶 1 置顶
      if (opt === 1 && !this.data.memoList.length) {
        params.sticky_flag = 1;
      } else if (opt === 1) {
        params.sticky_flag = this.data.memoList.length + 1;
      } else {
        params.sticky_flag = this.data.sticky_flag;
      }
      for (let i = 0; i < this.data.editors.length; i++) {
        let tempObj = {
          edit_userid: this.data.editors[i].id
        }
        params.memoUserList.push(tempObj);
      }
      // console.log(params);
      return this.$http.post('/memoCtl/memo/editMemo', params).then((res) => {
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
        this.$emit('openBanner', banner);
        this.getMemoList();
        return res;
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
    // memo排序
    sortMemo () {
      let params = {
        memoList: JSON.parse(JSON.stringify(this.data.memoList))
      }
      for (let i = 0; i < params.memoList.length; i++) {
        params.memoList[i].sticky_flag = i + 1;
      }
      // console.log(params);
      return this.$http.post('/memoCtl/memo/sortMemo', params);
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
        this.submitMemo(0);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  @import '../styles/components/slotMemoSetting';
</style>
