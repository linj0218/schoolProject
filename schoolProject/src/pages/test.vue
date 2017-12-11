<template>
  <div>
    <div @click='testClick()'>{{msg}}</div>
    <alert ref='dialog' :input-value='"这是一个提示框"'></alert>
  </div>
</template>

<script>
  import alert from '@/components/alert'
  import {mapState, mapMutations} from 'vuex'
  export default {
    name: 'test',
    components: {
      alert
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
        /*
        this.$refs.dialog.showDialog().then((res) => {
          console.log(res)
          this.$refs.dialog.show = false
        })
        */
      }
    }
  }
</script>

<style lang='scss' scoped>
  
</style>