<template>
  <div>
    <div :id="id" type="text/plain" style="width: 100%;height:200px;"></div>
  </div>
</template>

<script>
import '@/../static/uedit/ueditor.config';
import '@/../static/uedit/ueditor.all.min';
import '@/../static/uedit/lang/zh-cn/zh-cn';
import '@/../static/uedit/lang/en/en';
import { mapGetters } from 'vuex';

export default {
  name: 'hello',
  props: {
    id: String,
    required: false,
    default: 'editor'
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
  created () {
  },
  mounted () {
    let lang = this.lang === 'zh-CH' ? 'zh-cn' : 'en'; // 只提供英文、中文
    this.ue = window.UE.getEditor(this.id, {
      BaseUrl: '',
      UEDITOR_HOME_URL: 'static/uedit/',
      lang: lang,
      toolbars: [
        [
          'link', // 超链接
          'attachment' // 附件
        ]
      ]
    });
    this.ue.addListener('ready', (editor) => {
      document.getElementById(this.id).style.zoom =
      document.getElementById('edui_fixedlayer').style.zoom = 2 - Number.parseFloat(document.getElementsByTagName('html')[0].style.zoom, 10);
    });
  },
  methods: {
  }
}
</script>
