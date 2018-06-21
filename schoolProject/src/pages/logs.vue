<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @profileToggle='profileToggle'></headerr>

    <div class="page_body">
      <div class="page_body_box">
        <crumbs></crumbs>
        <div class="cont_wrapper">
          <div class="content">
            <div class="tab_content" v-if='data.tab==0'>
              <logs @openBanner='openBanner'></logs>
            </div>
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
  import crumbs from '@/components/crumbs'

  import logs from '@/components/slotLogs'

  export default {
    components: {
      headerr, banner, profile, crumbs, logs
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
    },
    methods: {
      profileToggle (bol) {
        this.$refs.profile.show = bol;
      },
      // 条幅
      openBanner (res) {
        this.$refs.banner.show(res.msg)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  @import '../styles/logs';
</style>
