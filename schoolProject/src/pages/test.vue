<template>
  <div style="padding: 20px;">
    <h3>弹框</h3>
    <button type="button" class="btn" @click='testClick()'>{{msg}}</button>
    <alert ref='dialog' :input-value='"这是一个提示框"'></alert>
    <h3>富文本</h3>
    <uedit></uedit>
  </div>
</template>

<script>
  import alert from '@/components/alert'
  import uedit from '@/components/uedit'
  import {mapState, mapMutations} from 'vuex'
  export default {
    name: 'test',
    components: {
      alert, uedit
    },
    data () {
      return {
        msg: 'test page',
        data: {
        }
      }
    },
    computed: {
      ...mapState(['test'])
    },
    watch: {
      test () {
        console.log(this.test)
      }
    },
    methods: {
      ...mapMutations(['SET_TEST']),
      testClick () {
        this.SET_TEST('test' + Math.random())
        this.$refs.dialog.showDialog().then((res) => {
          console.log(res)
          this.$refs.dialog.show = false
        })
      }
    },
    // 离开路由注销富文本对象
    beforeRouteLeave (to, from, next) {
      window.UE.delEditor('editor');
      next();
    }
  }
</script>

<style lang='scss' scoped>

</style>
