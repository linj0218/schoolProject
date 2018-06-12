<template>
  <div class="memo_model"
       :class='[titleType, model == "side" && memo.sticky_flag == 1 ? "top" : ""]'
       :style="{'border-left-color': titleType === 'type2' || (model == 'side' && memo.sticky_flag == 1) ? memo.titleColor : ''}">
    <!-- 标题样式1 侧栏、预览样式 -->
    <div class="title" v-if="titleType === 'type1'">
      <div class="title_bg" :style="{'backgroundColor': memo.titleColor}">
        {{memo.title}}
      </div>
      <div class="edit" @click='edit()' v-if="!readonly">
        <i class="iconfont iconfont-bianji1"></i><span>{{ $t("Edit") }}</span>
      </div>
    </div>
    <!-- 标题样式2 首页样式 -->
    <div class="title2" v-else @click="openMemoSide()">
      <div class="title_bg">
        {{memo.title}}
        <span v-if="userInfo.role===0 && memo.title">&lt;of {{memo.memoGroupName}}&gt;</span>
      </div>
      <i class="iconfont iconfont-you"></i>
    </div>
    <!-- 内容模板1 有图 -->
    <div class="contents cont_type1"
         :class="model == 'side' ? 'side_style' : ''"
         :style="{borderColor: memo.titleColor}"
         v-if="memo.contentType === 'type1' && (memo.memos.length || (model == 'side' && memo.sticky_flag != 1))">
      <div class="sub_memo" v-for="(subMemo, index) in memo.memos">
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
    <div class="contents cont_type2"
         :class="model == 'side' ? 'side_style' : ''"
         :style="{borderColor: memo.titleColor}"
         v-if="memo.contentType === 'type2' && (memo.memos.length || (model == 'side' && memo.sticky_flag != 1))">
      <div class="sub_memo" v-for="(subMemo, index) in memo.memos">
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
    <div class="contents cont_type3"
         :class="model == 'side' ? 'side_style' : ''"
         :style="{borderColor: memo.titleColor}"
         v-if="memo.contentType === 'type3' && (memo.memos.length || (model == 'side' && memo.sticky_flag != 1))">
      <div class="sub_memo">
        <div class="text_box" v-for="(subMemo, index) in memo.memos">
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
import { mapGetters } from 'vuex'
export default {
  props: {
    // 标题样式
    titleType: {
      type: String,
      required: false,
      default: 'type1'
    },
    // 模式：side-侧栏
    model: {
      type: String,
      required: false,
      default: ''
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
          memoGroupName: '',
          title: 'title',
          sticky_flag: 0,
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
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    // console.log(this.userInfo);
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
