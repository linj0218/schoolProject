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
            <div class="view" @click="() => {this.showNoLogin = true;}">
              <i class="iconfont iconfont-jiantou"></i>{{ $t("View details") }}
            </div>
          </div>
          <div class="flex" style="width: 1200px;">
            <div class="item">
              <label>{{ $t("Account name") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="userName" class="lj_input" @keyup.enter.native="getLoginData"></el-input>
              </span>
            </div>
            <div class="item" style="padding-left: 50px;">
              <label>{{ $t("Login date") }}:</label>
              <span class="input_wrapper">
                <el-date-picker class="lj_date" type="date" @change="getLoginData" value-format="yyyy-MM-dd" v-model="login_time"></el-date-picker>
                -
                <el-date-picker class="lj_date" type="date" @change="getLoginData" value-format="yyyy-MM-dd" v-model="loginout_time"></el-date-picker>
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
                <el-date-picker v-model="value1" class="lj_date" type="date"></el-date-picker>
                -
                <el-date-picker v-model="value2" class="lj_date" type="date"></el-date-picker>
              </span>
            </div>
            <div class="item" style="padding-left: 50px;">
              <label>{{ $t("Operator") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="input8" class="lj_input" @keyup.enter.native="searchSync"></el-input>
              </span>
            </div>
            <div class="item" style="padding-left: 50px;">
              <label>{{ $t("Changed account") }}:</label>
              <span class="input_wrapper">
                <el-input v-model="input9" class="lj_input" @keyup.enter.native="searchSync"></el-input>
              </span>
            </div>
          </div>
          <div class="table_wrapper">
            <el-table :data="table3" border stripe style="width: 100%;">
              <el-table-column align="center" prop="id" label="ID" width="60"></el-table-column>
              <el-table-column align="center" prop="operation_type" label="Sync time" width="180"></el-table-column>
              <el-table-column align="center" prop="operation_object" label="Operator" width="180"></el-table-column>
              <el-table-column align="center" prop="description" label="Result"></el-table-column>
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
    <div class="popup" :class='{"open": showNoLogin}'>
      <div class="popup_bg" @click='() => {this.showNoLogin = false;}'></div>
      <div class="popup_content">

        <div class="popup_header">
          <span class="icon_close" @click='() => {this.showNoLogin = false;}'></span>
        </div>

        <div class="popup_body">
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
      </div>
    </div>

    <alert ref='alert'></alert>

    <prompt ref='prompt'></prompt>

  </div>
</template>

<script>
import prompt from '@/components/prompt'
import alert from '@/components/alert'

export default {
  components: {
    prompt, alert
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
      showNoLogin: false,
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
      input8: '',
      input9: '',
      value1: '',
      value2: '',
      pageIndex3: 1,
      pageSize3: 10,
      total3: 0,
      table3: []
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
      this.getNeverLogin();
    },
    // 获取登录日志
    getLoginData () {
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
      })
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

      }
    },
    // 修改未登录每页显示条数
    handleSizeChange2 (val) {
      this.pageSize4 = val;
      this.getNeverLogin();
    },
    // 翻页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      if (this.data.tab === 0) {

      } else if (this.data.tab === 1) {
        this.pageIndex2 = val;
        this.getLoginData();
      } else if (this.data.tab === 2) {

      }
    },
    // 未登录翻页
    handleCurrentChange2 (val) {
      this.pageIndex4 = val;
      this.getNeverLogin();
    },
    // 查询操作日志
    searchOperation () {
      console.log(1);
    },
    // 查询登录日志
    searchLogin () {
      console.log(2);
    },
    // 查询同步日志
    searchSync () {
      console.log(3);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  @import '../styles/components/slotLogs';
</style>
