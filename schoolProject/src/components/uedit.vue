<template>
  <div>
    <div :id="'content' + id" type="text/plain" style="width: 100%;" :style="{height: isfix ? '258px' : '200px'}"></div>
  </div>
</template>

<script>
import '@/../static/uedit/ueditor.config';
import '@/../static/uedit/ueditor.all';
import '@/../static/uedit/lang/zh-cn/zh-cn';
import '@/../static/uedit/lang/en/en';
import { mapGetters } from 'vuex';

export default {
  name: 'hello',
  props: {
    // content id
    id: {
      type: [String, Number],
      required: false,
      default: 'editor'
    },
    // content
    content: {
      type: String,
      required: false,
      default: 'Please entry content'
    },
    // isfix
    isfix: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      ue: '',
      uedata: [],
      xierudata: []
    }
  },
  computed: {
    ...mapGetters({
      lang: 'lang'
    })
  },
  watch: {
  },
  created () {
  },
  mounted () {
    let lang = this.lang === 'zh-CH' ? 'zh-cn' : 'en'; // 只提供英文、中文
    this.ue = window.UE.getEditor('content' + this.id, {
      BaseUrl: '',
      UEDITOR_HOME_URL: 'static/uedit/',
      lang: lang,
      autosave: false,
      elementPathEnabled: false,
      autoHeightEnabled: !this.isfix,
      toolbars: [
        [
          'link', // 超链接
          'attachment', // 附件
          'simpleupload'
        ]
      ]
    });
    this.ue.addListener('ready', (editor) => {
      this.ue.setContent(this.content);
      if (!this.isfix) {
        document.getElementById('content' + this.id).style.zoom =
        document.getElementById('edui_fixedlayer').style.zoom = 2 - Number.parseFloat(document.getElementsByTagName('html')[0].style.zoom, 10);
      }
    });
    this.ue.addListener('blur', (editor) => {
      // console.log(this.ue.getContent());
      this.$emit('syncContent', this.id, this.ue.getContent());
    });
  },
  methods: {
  }
}
</script>
