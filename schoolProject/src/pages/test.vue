<template>
  <div style="padding: 20px;">
    <h3 @click="() => {this.data.showflg_1 = !this.data.showflg_1}">弹框</h3>
    <div class="" v-show="data.showflg_1">
      <button type="button" class="btn" @click='testClick()'>{{msg}}</button>
      <alert ref='dialog' :input-value='"这是一个提示框"'></alert>
    </div>
    <h3 @click="() => {this.data.showflg_2 = !this.data.showflg_2}">富文本</h3>
    <div class="" v-show="data.showflg_2">
      <uedit></uedit>
    </div>
    <h3 @click="() => {this.data.showflg_3 = !this.data.showflg_3}">拖拽排序</h3>
    <div class="" v-show="data.showflg_3">
      <ul id="items">
        <li style="border-bottom: 1px solid #999;padding: 20px 0;" v-for="field in data.list">
          {{field.name}}
        </li>
      </ul>
    </div>
    <h3 @click="() => {this.data.showflg_4 = !this.data.showflg_4}">多语言</h3>
    <div class="" v-show="data.showflg_4">
      <div v-for="(val, key) in data.lang" style="padding-bottom: 10px;">
        {{key}}: <input :value="val"/>
      </div>
    </div>
  </div>
</template>

<script>
  import alert from '@/components/alert'
  import uedit from '@/components/uedit'
  import Sortable from 'sortablejs'
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import { getSStorage } from '@/script/util'
  export default {
    name: 'test',
    components: {
      alert, uedit
    },
    data () {
      return {
        msg: 'test page',
        data: {
          showflg_1: false,
          showflg_2: false,
          showflg_3: false,
          showflg_4: true,
          list: [{name: '芒果'}, {name: '苹果'}, {name: '菠萝'}],
          lang: {}
        }
      }
    },
    computed: {
      ...mapState(['test']),
      ...mapGetters({
        lang: 'lang'
      })
    },
    watch: {
      test () {
        console.log(this.test)
      }
    },
    mounted () {
      var el = document.getElementById('items');
      Sortable.create(el);

      this.data.lang = getSStorage('lang')[this.lang];
      delete this.data.lang.el;
    },
    methods: {
      ...mapMutations(['SET_TEST']),
      testClick () {
        this.SET_TEST('test' + Math.random())
        this.$refs.dialog.showDialog().then((res) => {
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
