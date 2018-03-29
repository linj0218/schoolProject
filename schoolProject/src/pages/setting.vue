<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @profileToggle='profileToggle'></headerr>

    <div class="page_body">
      <div class="page_body_box">
        <div class="tabs">
          <button type="button" class="btn iconfont iconfont-fanhui" @click="back()"></button>
          <div class="tab">
            <button type="button" class="btn" :class="{act: data.tab == 0}" @click='()=>{this.data.tab=0}'>
              <i class="iconfont iconfont-shezhi"></i><span>General</span>
            </button>
            <button type="button" class="btn" :class="{act: data.tab == 2}" @click='()=>{this.data.tab=2}'>
              <i class="iconfont iconfont-gongjuxiang"></i><span>Toolbox</span>
            </button>
            <button type="button" class="btn" :class="{act: data.tab == 3}" @click='()=>{this.data.tab=3}'>
              <i class="iconfont iconfont-gongneng"></i><span>Launcher</span>
            </button>
            <button type="button" class="btn" :class="{act: data.tab == 1}" @click='()=>{this.data.tab=1}'>
              <i class="iconfont iconfont-rili"></i><span>Calendar</span>
            </button>
          </div>
        </div>
        <div class="content">
          <div class="tab_content" v-show='data.tab==0'>
            <app-setting @openBanner='openBanner' @switchTab="switchTab"></app-setting>
          </div>
          <div class="tab_content" v-show='data.tab==1'>
            <calendar @openBanner='openBanner'></calendar>
          </div>
          <div class="tab_content" v-show='data.tab==2'>
            <toolbar @openBanner='openBanner'></toolbar>
          </div>
          <div class="tab_content" v-show='data.tab==3'>
            <launcher @openBanner='openBanner' ref='launcher'></launcher>
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

  export default {
    components: {
      headerr, banner, profile, appSetting, calendar, toolbar, launcher
    },
    data () {
      return {
        data: {
          tab: 0
        }
      }
    },
    computed: {
    },
    mounted () {
      this.data.tab = this.$route.query.tabflg;
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
      switchTab (tab, data) {
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
  #body{height: 100%;background: #f5f5f5;overflow: auto;position: relative;}
  .page_body{
    padding: 100px 180px 30px 180px;width: 100%;height: 100%;position: absolute;top: 0;left: 0;
    .page_body_box{
      height: 100%;position: relative;background: #fff;padding-top: 80px;
      .tabs{
        height: 80px;line-height: 80px;position: absolute;width: 100%;top: 0;left: 0;background: #f5f5f5;
        .iconfont-fanhui{width: 100px;height: 42px;border-radius: 42px;border: 0;outline: none;font-size: 24px;background: #4E81BD;color: #fff;}
        .tab{
          display: inline-block;height: 42px;line-height: 42px;vertical-align: middle;border: 1px solid #ddd;border-radius: 3px;margin-left: 20px;position: relative;overflow: hidden;
          .btn{
            position: relative;float: left;width: 180px;height: 100%;background: transparent;color: #ccc;padding: 0;border: 0;outline: none;border-radius: 0;
            .iconfont{font-size: 22px;margin-right: 10px;vertical-align: middle;}
            span{font-size: 18px;vertical-align: middle;display: inline-block;}
          }
          .btn.act{color: #4E81BD;background: #fff;}
        }
        .tab .btn:after{content: '';position: absolute;right: 0;height: 100%;top: 0;width: 1px;background: #ddd;}
        .tab .btn:last-child:after{content: '';width: 0;}
      }
      .content{height: 100%;border: 1px solid #ddd;overflow: hidden;}
      .content .tab_content{padding: 0 40px;height: 100%;}
    }
  }
</style>
