<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @profileToggle='profileToggle'></headerr>

    <div class="page_body">
      <div class="page_body_box">
        <div class="tabs">
          <button type="button" class="btn iconfont iconfont-fanhui" @click="back()"></button>
          <div class="tab">
            <button type="button" class="btn" :class="{act: currentTab == 0}" @click='switchTab(0)'>
              <i class="iconfont iconfont-shezhi"></i><span>{{ $t("General") }}</span>
            </button>
            <button type="button" class="btn" :class="{act: currentTab == 2}" @click='switchTab(2)'>
              <i class="iconfont iconfont-gongjuxiang"></i><span>{{ $t("Toolbox") }}</span>
            </button>
            <button type="button" class="btn" :class="{act: currentTab == 3}" @click='switchTab(3)'>
              <i class="iconfont iconfont-gongneng"></i><span>{{ $t("Launcher") }}</span>
            </button>
            <button type="button" class="btn" :class="{act: currentTab == 4}" @click='switchTab(4)'>
              <i class="iconfont iconfont-gongneng"></i><span>{{ $t("Memo") }}</span>
            </button>
            <button type="button" class="btn" :class="{act: currentTab == 1}" @click='switchTab(1)'>
              <i class="iconfont iconfont-rili"></i><span>{{ $t("Calendar") }}</span>
            </button>
          </div>
        </div>
        <div class="content">
          <div class="tab_content" v-if='data.tab==0'>
            <app-setting @openBanner='openBanner' @switchTab="switchChildTab"></app-setting>
          </div>
          <div class="tab_content" v-if='data.tab==1'>
            <calendar @openBanner='openBanner'></calendar>
          </div>
          <div class="tab_content" v-if='data.tab==2'>
            <toolbar @openBanner='openBanner'></toolbar>
          </div>
          <div class="tab_content" v-if='data.tab==3'>
            <launcher @openBanner='openBanner' ref='launcher'></launcher>
          </div>
          <div class="tab_content" v-if="data.tab==4">
            <memo-setting @openBanner='openBanner'></memo-setting>
          </div>
        </div>
      </div>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <banner ref='banner'></banner>

    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import banner from '@/components/banner'
  import profile from '@/components/profile'

  import appSetting from '@/components/slotAppSetting'
  import calendar from '@/components/slotCalendar'
  import toolbar from '@/components/slotToolbar'
  import launcher from '@/components/slotLauncher'
  import memoSetting from '@/components/slotMemoSetting'

  export default {
    components: {
      headerr, banner, profile, appSetting, calendar, toolbar, launcher, memoSetting
    },
    data () {
      return {
        data: {
          tab: 0
        }
      }
    },
    computed: {
      currentTab () {
        this.data.tab = this.$route.query.tabflg;
        return this.data.tab;
      }
    },
    mounted () {
    },
    methods: {
      profileToggle (bol) {
        this.$refs.profile.show = bol;
      },
      // 条幅
      openBanner (res) {
        this.$refs.banner.show(res.msg)
      },
      back () {
        this.$router.go(-1)
      },
      switchTab (tab) {
        this.$router.replace({path: '/setting', query: {tabflg: tab}})
      },
      switchChildTab (tab, data) {
        this.data.tab = tab;
        this.$refs.launcher.data.tab = data.subTab;
        this.$refs.launcher.data.userId = data.userId;
        this.$refs.launcher.userChanged(data.userId);
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  @import '../styles/setting';
</style>
