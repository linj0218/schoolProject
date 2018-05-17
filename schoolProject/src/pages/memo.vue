<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @profileToggle='profileToggle'></headerr>

    <div class="page_body">
      <crumbs></crumbs>
      <div class="page_body_box">
        <div class="content">
          <div class="form_field">
            <label class="lab">{{$t('Title')}}:</label>
            <div class="val">
              <input class="form-control" type="text">
            </div>
          </div>
          <div class="form_field">
            <label class="lab">{{$t('Color')}}:</label>
            <div class="val">
              <el-color-picker id="lj_colorpicker"
                               v-model="data.color"
                               :predefine="predefineColors"
                               @change="">
              </el-color-picker>
            </div>
          </div>
          <div class="form_field">
            <label class="lab">{{$t('Template')}}:</label>
            <div class="val">
              <div class="temp_icon icon_temp_1" :class="data.templateAct === 0 ? 'act' : ''" @click="switchTemplate(0)"></div>
              <div class="temp_icon icon_temp_2" :class="data.templateAct === 1 ? 'act' : ''" @click="switchTemplate(1)"></div>
              <div class="temp_icon icon_temp_3" :class="data.templateAct === 2 ? 'act' : ''" @click="switchTemplate(2)"></div>
            </div>
          </div>
          <div class="form_field" v-for="(cont, index) in data.contentList">
            <label class="lab" style="vertical-align: top">{{$t('Contents')}} {{++index}}:</label>
            <div class="val">
              <div class="temp_cont" v-if='!cont.open' @click="trigger(cont)">
                <span class="_title">Test Title</span>
                <i class="iconfont iconfont-lajitong" @click.stop="deleteContent(cont)"></i>
                <i class="iconfont iconfont-shuangjiantou"></i>
              </div>
              <div class="temp_cont2" v-else>
                <i class="iconfont iconfont-lajitong" @click.stop="deleteContent(cont)"></i>
                <i class="iconfont iconfont-shuangjiantou" style="transform: rotate(180deg);" @click="trigger(cont)"></i>
                <label class="temp_lab">{{$t("Subtitle")}}</label>
                <div class="">
                  <input class="form-control" type="text">
                </div>
                <label class="temp_lab">{{$t("Picture")}}</label>
                <div class="">
                  <div class="empty_pic">
                    <i class="iconfont iconfont-tupian"></i>
                  </div>
                </div>
                <label class="temp_lab">{{$t("Text")}}</label>
                <div class="">
                  <uedit :id="cont.id"></uedit>
                </div>
              </div>
            </div>
          </div>
          <div class="form_field">
            <label class="lab"></label>
            <div class="val">
              <div class="edit_box">
                <button type="button" class="btn btn-primary">
                  <i class="iconfont iconfont-jia"></i> {{ $t("New Contents") }}
                </button>
                <div class="edit_info">
                  <div class="edit_lab">{{ $t("Last Edition") }}</div>
                  <div class="edit_val">02/05/2018 16:29</div>
                  <div class="edit_val">William Trang</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btns">
            <button type="button" class="btn _preview" @click="openPreview()">{{ $t("Preview") }}</button>
            <button type="button" class="btn _save">{{ $t("Save") }}</button>
            <button type="button" class="btn _cancel">{{ $t("Cancel") }}</button>
          </div>
        </div>
      </div>

      <!-- 预览 -->
      <div class="memo_preview" v-if="data.previewFlg">
        <div class="_content">
          <div class="prev_head">
            Preview
            <span class="icon_close" @click='closePreview()'></span>
          </div>
          <div class="">
            <memo></memo>
          </div>
        </div>
      </div>

      <!-- 个人设置 -->
      <profile ref='profile' @openBanner='openBanner'></profile>

      <banner ref='banner'></banner>

      <alert ref='alert'></alert>

    </div>
  </div>
</template>

<script>
  import headerr from '@/components/header'
  import crumbs from '@/components/crumbs'
  import banner from '@/components/banner'
  import profile from '@/components/profile'
  import uedit from '@/components/uedit'
  import memo from '@/components/memoModel'
  import alert from '@/components/alert'

  export default {
    components: {
      headerr, crumbs, banner, profile, uedit, memo, alert
    },
    data () {
      return {
        data: {
          color: '#ff0000',
          templateAct: 2,
          contentList: [
            {id: 'content_1', open: false},
            {id: 'content_2', open: false}
          ],
          previewFlg: false
        },
        predefineColors: [
          '#DB465F', '#B59479', '#716DC2', '#2C66C2', '#47AD56', '#687280', '#00B3CF', '#F2A200', '#00CFB0', '#4A90E2', '#5ACE6D'
        ]
      }
    },
    computed: {
    },
    mounted () {
      // !@#$%^&*()_+
      document.getElementsByClassName('el-color-dropdown')[0].style.zoom = 2.1 - Number.parseFloat(document.getElementsByTagName('html')[0].style.zoom, 10);
    },
    methods: {
      profileToggle (bol) {
        this.$refs.profile.show = bol;
      },
      // 条幅
      openBanner (res) {
        this.$refs.banner.show(res.msg);
      },
      // 切换模板
      switchTemplate (i) {
        this.data.templateAct = i;
      },
      // 抽屉开关
      trigger (item) {
        item.open = !item.open;
        if (!item.open) {
          window.UE.delEditor(item.id);
        }
      },
      deleteContent (content) {
        this.$refs.alert.showDialog().then(() => {
          console.log(content.id);
        })
      },
      // 开启预览
      openPreview () {
        this.data.previewFlg = true;
      },
      // 关闭预览
      closePreview () {
        this.data.previewFlg = false;
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  @import '../styles/memo';
</style>
