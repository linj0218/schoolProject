<template>
  <div class="memo_model" :class='titleType' :style="{'border-left': titleType === 'type2' ? '3px solid ' + memo.titleColor : '0'}">
    <!-- 标题样式1 -->
    <div class="title" v-if="titleType === 'type1'" :style="{'border-bottom': '3px solid ' + memo.titleColor}">
      <div class="title_bg" :style="{'border-bottom': '38px solid ' + memo.titleColor}">
        {{memo.title}}
      </div>
      <div class="edit" @click='edit()' v-if="!readonly">
        <i class="iconfont iconfont-bianji1"></i><span>{{ $t("Edit") }}</span>
      </div>
      <div class="top" v-if="memo.topflg"></div>
    </div>
    <!-- 标题样式2 -->
    <div class="title2" v-else>
      <div class="title_bg">
        {{memo.title}}
      </div>
      <span class="more_memo" @click="openMemoSide()"><i></i>{{ $t("More") }}</span>
    </div>
    <!-- 内容模板1 有图 -->
    <div class="contents cont_type1" v-if="memo.contentType === 'type1' && memo.memos.length">
      <div class="sub_memo" v-for="(subMemo, index) in memo.memos" v-if="titleType === 'type1' || (titleType === 'type2' && index === 0)">
        <div class="img_box">
          <img class="img" src="../images/icon_noimg.png">
        </div>
        <div class="text_box">
          <div class="sub_title">
            {{subMemo.subTitle}}
          </div>
          <div class="text">
            <span v-html="subMemo.content"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容模板2 单行 -->
    <div class="contents cont_type2" v-if="memo.contentType === 'type2' && memo.memos.length">
      <div class="sub_memo" v-for="(subMemo, index) in memo.memos" v-if="titleType === 'type1' || (titleType === 'type2' && index === 0)">
        <div class="text_box">
          <div class="sub_title">
            {{subMemo.subTitle}}
          </div>
          <div class="text">
            <span v-html="subMemo.content"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容模板3 两行 -->
    <div class="contents cont_type3" v-if="memo.contentType === 'type3' && memo.memos.length">
      <div class="sub_memo">
        <div class="text_box" v-for="(subMemo, index) in memo.memos" v-if="titleType === 'type1' || (titleType === 'type2' && index < 2)">
          <div class="sub_title">
            {{subMemo.subTitle}}
          </div>
          <div class="text">
            <span v-html="subMemo.content"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 标题样式
    titleType: {
      type: String,
      required: false,
      default: 'type1'
    },
    // 是否可编辑
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    // memo
    memo: {
      type: Object,
      required: false,
      default: () => {
        const a = {
          titleType: 'type1',
          titleColor: '#47AD56',
          contentType: 'type1',
          memoId: 0,
          memoGroupId: 0,
          title: 'title',
          memos: [
            {
              subTitle: 'sub title',
              imgUrl: '../images/icon_noimg.png',
              content: 'text'
            }
          ]
        }
        return a;
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    openMemoSide () {
      this.$emit('openSide', this.memo.memoGroupId);
      // this.$store.dispatch('setMemoSide', true);
    },
    edit () {
      this.$router.push({path: '/memo', query: {memo_id: this.memo.memoId}})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  @import '../styles/components/memoModel';
</style>
