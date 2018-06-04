<template>
  <div class="configuration" :class='{"act": show}'>
    <div class="config_bg" @click='closeProfile()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeProfile()'></span>{{ $t("Profile") }}
      </div>
      <div class="content">
        <div class="short_name">
          {{data.shortName}}
          <div class="logo_box">
            <img v-if="data.avatar" :src="data.avatar">
          </div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Name") }}:</span>
          <div class="label_value">{{data.nom||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Position") }}:</span>
          <div class="label_value">{{data.title||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Department") }}:</span>
          <div class="label_value">{{data.department||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Office No") }}:</span>
          <div class="label_value">{{data.extension||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Telephone No") }}:</span>
          <div class="label_value">{{data.tel||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("E-mail") }}:</span>
          <div class="label_value">{{data.email||'-'}}</div>
        </div>
      </div>
    </div>

    <prompt ref='prompt'></prompt>

    <alert ref='alert'></alert>

  </div>
</template>

<script>
import prompt from '@/components/prompt'
import alert from '@/components/alert'
import {getShortName, getSStorage} from '@/script/util'
export default {
  props: {
  },
  components: {
    prompt, alert
  },
  data () {
    return {
      show: false,
      sex: 'male',
      data: {
        avatar: '',
        name: '',
        shortName: '',
        role: '',
        sex: 'male',
        position: '',
        extension: '',
        tel: '',
        email: ''
      }
    }
  },
  watch: {
    show () {
      if (this.show) {
        this.initData();
      }
    }
  },
  methods: {
    // 初始化
    initData () {
      let user = getSStorage('userinfo');
      console.log(user);
      this.data = user;
      this.data.shortName = getShortName(this.data.nom);
      this.data.avatar = !this.data.avatar ? '' : (this.$config.api_path.img_path + '/avatar/' + this.data.avatar)
    },
    // 图标上传成功
    handleAvatarSuccess (res, file) {
      this.data.appLogo = URL.createObjectURL(file.raw);
    },
    // 图标上传前校验
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$refs.alert.showDialog('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$refs.alert.showDialog('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handlePreview (file) {
      console.log(file);
    },
    // 提交用户信息
    submit () {
      let banner = {
        status: 'SUCCESS',
        msg: 'Success!'
      }
      this.$emit('openBanner', banner);
      // let params = {}
      // return this.$http.post('/sharedcalendarSettingCtl/event/editUser', {

      // })
    },
    closeProfile () {
      this.show = false;
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  @import '../styles/components/profile';
</style>
