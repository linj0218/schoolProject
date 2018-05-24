<template>
  <div class="configuration" :class='{"act": memoSide}'>
    <div class="config_bg" @click='closeProfile()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeProfile()'></span>
      </div>
      <div class="content">
        <template v-for="memo in memoList">
          <memo :titleType="'type1'" :memo="memo"></memo>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
import memo from './memoModel';
import { mapGetters } from 'vuex';

export default {
  props: {
    memoList: {
      type: Array,
      required: false,
      default: () => {
        return [
          {
            titleType: 'type1',
            titleColor: '#F2A200',
            contentType: 'type1',
            title: 'title',
            memos: [
              {
                subTitle: 'sub title',
                imgUrl: '../images/icon_noimg.png',
                content: 'text'
              }
            ]
          }
        ]
      }
    }
  },
  components: {
    memo
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters({
      memoSide: 'memoSide'
    })
  },
  methods: {
    closeProfile () {
      this.$store.dispatch('setMemoSide', false);
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .configuration{
    position: absolute;top: 0;right: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;
    .config_bg{position: absolute;width: 100%;height: 100%;background: rgba(0,0,0,0.2);z-index: -1;}
    .config_body{
      width: 1040px;height: 100%;background: #fff;float: right;transform: translateX(1040px);transition: all .2s;
      .icon_btn_add{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;background: url('../images/icon_btn_add.png') 50% 50% / auto auto no-repeat;}
      .title{
        height: 80px;border-bottom: 1px solid #eee;font-size: 30px;color: #4E81BD;padding: 20px 0;
        .icon_back{width: 40px;height: 40px;margin: 0 30px;float: left;background: url('../images/icon_back.png') 0 0 / 100% 100% no-repeat;display: inline-block;cursor: pointer;}
      }
      .content{
        padding: 20px 30px;

      }
    }
  }
  .configuration.act{
    z-index: 99;
    .config_body{transform: translateX(0);}
  }
</style>
