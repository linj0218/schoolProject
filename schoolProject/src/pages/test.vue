<template>
  <div>
    <div @click='testClick()'>{{msg}}</div>
    <alert ref='dialog' :input-value='"这是一个提示框"'></alert>
  </div>
</template>

<script>
import alert from '@/components/alert'
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
  methods: {
    testClick () {
      this.$refs.dialog.showDialog().then((res) => {
        console.log(res)
        this.$refs.dialog.show = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  
</style>