<template>
  <div class="body" v-cloak>
    <div class="nav_tab">
      <div v-if="false"><div @click='switchTab(0)' :class='{"act": data.tab==0}'>{{ $t("Operation logs") }}</div></div>
      <div><div @click='switchTab(1)' :class='{"act": data.tab==1}'>{{ $t("Login logs") }}</div></div>
      <div><div @click='switchTab(2)' :class='{"act": data.tab==2}'>{{ $t("Ad sync logs") }}</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <!-- 操作日志 -->
        <div class="nav_content_1" v-if='data.tab==0'>
          <div class="flex" style="justify-content: space-between">
            <div class="item">
              <label>{{ $t("Operation logs") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="input1" class="lj_input" @keyup.enter.native="searchOperation"></el-input>
              </span>
            </div>
            <div class="item">
              <label>{{ $t("Operation object") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="input2" class="lj_input" @keyup.enter.native="searchOperation"></el-input>
              </span>
            </div>
            <div class="item">
              <label>{{ $t("Operator") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="input3" class="lj_input" @keyup.enter.native="searchOperation"></el-input>
              </span>
            </div>
            <div class="item">
              <label>{{ $t("Time") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="input4" class="lj_input" @keyup.enter.native="searchOperation"></el-input>
              </span>
            </div>
          </div>
          <div class="table_wrapper">
            <el-table :data="table1" border stripe style="width: 100%;">
              <el-table-column align="center" prop="id" label="ID" width="60"></el-table-column>
              <el-table-column align="center" prop="operation_type" label="Operation Type" width="180"></el-table-column>
              <el-table-column align="center" prop="operation_object" label="Operation Object" width="180"></el-table-column>
              <el-table-column align="center" prop="description" label="Description"></el-table-column>
              <el-table-column align="center" prop="operator" label="Operator" width="180"></el-table-column>
              <el-table-column align="center" prop="time" label="Time" width="180"></el-table-column>
            </el-table>
            <div class="table_footer">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex1"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1">
              </el-pagination>
            </div>
          </div>
        </div>
        <!-- 登录日志 -->
        <div class="nav_content_1" v-if='data.tab==1'>
          <div class="no_login" style="width: 1200px;">
            {{total4}} {{ $t("accounts never login") }}
            <div class="view" @click="viewNeverLogin">
              <i class="iconfont iconfont-jiantou"></i>{{ $t("View details") }}
            </div>
          </div>
          <div class="flex" style="width: 1200px;">
            <div class="item">
              <label>{{ $t("Account name") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="userName" class="lj_input" @keyup.enter.native="getLoginData(true)"></el-input>
              </span>
            </div>
            <div class="item" style="padding-left: 50px;">
              <label>{{ $t("Login date") }}:</label>
              <span class="input_wrapper">
                <el-date-picker class="lj_date" type="date" @change="getLoginData(true)" value-format="yyyy-MM-dd" v-model="login_time"></el-date-picker>
                -
                <el-date-picker class="lj_date" type="date" @change="getLoginData(true)" value-format="yyyy-MM-dd" v-model="loginout_time"></el-date-picker>
              </span>
            </div>
          </div>
          <div class="table_wrapper" style="width: 1200px;">
            <el-table :data="table2" border stripe style="width: 100%;">
              <el-table-column align="center" type="index" :index="(index) => { return index + 1; }" label="ID" width="60"></el-table-column>
              <el-table-column align="center" prop="user_name" label="Account name" width="180"></el-table-column>
              <el-table-column align="center" prop="login_time" label="Login date"></el-table-column>
              <el-table-column align="center" prop="loginout_time" label="Logout date"></el-table-column>
            </el-table>
            <div class="table_footer">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex2"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total2">
              </el-pagination>
            </div>
          </div>
        </div>
        <!-- AD同步日志 -->
        <div class="nav_content_1" v-if='data.tab==2'>
          <div class="flex">
            <div class="item">
              <label>{{ $t("Date") }}:</label>
              <span class="input_wrapper">
                <el-date-picker v-model="startDate" class="lj_date" type="date" value-format="yyyy-MM-dd" @change="getADSyncLogs(true)"></el-date-picker>
                -
                <el-date-picker v-model="endDate" class="lj_date" type="date" value-format="yyyy-MM-dd" @change="getADSyncLogs(true)"></el-date-picker>
              </span>
            </div>
            <div class="item" style="padding-left: 50px;">
              <label>{{ $t("Operator") }}:</label>
              <span class="input_wrapper">
                <el-select v-model="operator_flag" @change="getADSyncLogs(true)">
                  <el-option label="System" value="System"></el-option>
                  <el-option label="Manual" value="Manual"></el-option>
                </el-select>
              </span>
            </div>
            <div class="item" style="padding-left: 50px;">
              <label>{{ $t("Changed account") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="userName_ad" class="lj_input" @keyup.enter.native="getADSyncLogs(true)"></el-input>
              </span>
            </div>
          </div>
          <div class="table_wrapper">
            <el-table :data="table3" border stripe style="width: 100%;">
              <el-table-column align="center" type="index" :index="(index) => { return index + 1; }" label="ID" width="60"></el-table-column>
              <el-table-column align="center" prop="sync_time" label="Sync time" width="180"></el-table-column>
              <el-table-column align="center" prop="operator_flag" label="Operator" width="180"></el-table-column>
              <el-table-column align="center" label="Result">
                <template slot-scope="scope">
                  <span style="padding: 0 10px;">Adds:&nbsp;<i class="sync_num" @click="viewSync('Adds', scope.row.addsList)">{{ scope.row.addsNum }}</i></span>
                  <span style="padding: 0 10px;">Updates:&nbsp;<i class="sync_num" @click="viewSync('Updates', scope.row.updatesList)">{{ scope.row.updatesNum }}</i></span>
                  <span style="padding: 0 10px;">Deletes:&nbsp;<i class="sync_num" @click="viewSync('Deletes', scope.row.deleteList)">{{ scope.row.deleteNum }}</i></span>
                  <span style="padding: 0 10px;">Renames:&nbsp;<i class="sync_num" @click="viewSync('Renames', scope.row.renameList)">{{ scope.row.renameNum }}</i></span>
                  <span style="padding: 0 10px;">Unchanged:&nbsp;<i style="font-style: normal;">{{ scope.row.unchangedNum }}</i></span>
                </template>
              </el-table-column>
            </el-table>
            <div class="table_footer">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex3"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize3"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total3">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未登录过用户弹窗 -->
    <popup-table ref="popupTable">
      <div slot="content">
        <el-table :data="table4" border stripe style="width: 100%;">
          <el-table-column align="center" type="index" :index="(index) => { return index + 1; }" label="ID" width="60"></el-table-column>
          <el-table-column align="center" prop="nom" label="Name"></el-table-column>
          <el-table-column align="center" prop="department" label="Position(Job Title)"></el-table-column>
        </el-table>
        <div class="table_footer">
          <el-pagination
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="pageIndex4"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize4"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total4">
          </el-pagination>
        </div>
      </div>
    </popup-table>

    <!-- AD同步弹窗 -->
    <popup-table ref="popupTable_ad" :title="popupTableTitle">
      <div slot="content">
        <el-table :data="table5" border stripe style="width: 100%;" class="lj_ad_popup">
          <el-table-column align="center" type="index" :index="(index) => { return index + 1; }" label="ID" width="60"></el-table-column>
          <el-table-column align="center" prop="user_name" label="Name"></el-table-column>
          <el-table-column align="center" prop="department" label="Position"></el-table-column>
          <el-table-column align="center" label="Set User Permission" width="190">
            <template slot-scope="scope">
              <router-link tag="div" :to="{path: 'setting', query: {tabflg: 3, userId: scope.row.user_id, userName: scope.row.user_name}}">
                <el-button type="primary">Set</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </popup-table>

    <alert ref='alert'></alert>

    <prompt ref='prompt'></prompt>

  </div>
</template>

<script>
import prompt from '@/components/prompt'
import alert from '@/components/alert'
import popupTable from '@/components/popupTable'

export default {
  components: {
    prompt, alert, popupTable
  },
  data () {
    return {
      data: {
        tab: 1
      },
      // 操作日志
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      pageIndex1: 1,
      pageSize1: 10,
      total1: 0,
      table1: [],
      // 登录日志
      userName: '',
      login_time: '',
      loginout_time: '',
      pageIndex2: 1,
      pageSize2: 10,
      total2: 0,
      table2: [],
      // 未登录日志
      pageIndex4: 1,
      pageSize4: 10,
      total4: 0,
      table4: [],
      // AD同步日志
      startDate: '',
      endDate: '',
      operator_flag: '',
      userName_ad: '',
      pageIndex3: 1,
      pageSize3: 10,
      total3: 0,
      table3: [],
      // AD同步弹窗
      popupTableTitle: '',
      table5: []
    }
  },
  computed: {
  },
  mounted () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.getLoginData();
      // this.getNeverLogin();
      this.getADSyncLogs();
    },
    // 获取登录日志
    getLoginData (reset) {
      if (reset) this.pageIndex2 = 1;
      let params = {
        pageIndex: this.pageIndex2,
        pageSize: this.pageSize2,
        userName: this.userName,
        login_time: this.login_time,
        loginout_time: this.loginout_time
      };
      return this.$http.post('/loginCtl/user/userLoginLogs', { data: params }).then((res) => {
        // console.log(res);
        if (res.result === 'SUCCESS') {
          this.table2 = res.data;
          this.total2 = res.total;
        }
      })
    },
    // 获取未登录日志
    getNeverLogin () {
      // user/findNeverLoginUser
      let params = {
        pageIndex: this.pageIndex4,
        pageSize: this.pageSize4
      };
      return this.$http.post('/loginCtl/user/findNeverLoginUser', { data: params }).then((res) => {
        // console.log(res);
        if (res.result === 'SUCCESS') {
          this.table4 = res.data;
          this.total4 = res.total;
        }
        return res;
      })
    },
    // 开启未登录日志弹窗
    viewNeverLogin () {
      this.getNeverLogin().then(() => {
        this.$refs.popupTable.show = true;
      })
    },
    // 获取AD同步日志
    getADSyncLogs (reset) {
      if (reset) this.pageIndex3 = 1;
      let params = {
        pageIndex: this.pageIndex3,
        pageSize: this.pageSize3,
        startDate: this.startDate,
        endDate: this.endDate,
        operator_flag: this.operator_flag,
        userName: this.userName_ad
      };
      return this.$http.post('/adSynchronizeCtl/sys/searchAdSyncLogs', { data: params }).then((res) => {
        // console.log(res);
        if (res.result === 'SUCCESS') {
          this.table3 = res.data;
          this.total3 = res.total;
        }
      })
    },
    // 开启AD同步弹窗
    viewSync (type, data) {
      this.table5 = data;
      this.popupTableTitle = type;
      this.$refs.popupTable_ad.show = true;
    },
    switchTab (i) {
      this.data.tab = i;
    },
    // 修改每页显示条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      if (this.data.tab === 0) {

      } else if (this.data.tab === 1) {
        this.pageSize2 = val;
        this.getLoginData();
      } else if (this.data.tab === 2) {
        this.pageSize3 = val;
        this.getADSyncLogs();
      }
    },
    // 翻页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      if (this.data.tab === 0) {

      } else if (this.data.tab === 1) {
        this.pageIndex2 = val;
        this.getLoginData();
      } else if (this.data.tab === 2) {
        this.pageIndex3 = val;
        this.getADSyncLogs();
      }
    },
    // 修改未登录每页显示条数
    handleSizeChange2 (val) {
      this.pageSize4 = val;
      this.getNeverLogin();
    },
    // 未登录翻页
    handleCurrentChange2 (val) {
      this.pageIndex4 = val;
      this.getNeverLogin();
    },
    // 查询操作日志
    searchOperation () {
      console.log(1);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  @import '../styles/components/slotLogs';
</style>
