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
          <!-- <el-upload class="upload-demo"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :on-preview="handlePreview"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload"
                     :show-file-list="false">
            <img v-if="false" :src='""' class="avatar" style="width: 100px;height: 100px;position: absolute;left: 0;top: 0;">
            <i class="icon" :class='data.sex'></i>
            <button class="btn" type="primary"><i class="icon_profile_edit"></i></button>
          </el-upload> -->
          <div class="logo_box">
            <img v-if="data.avatar" :src="data.avatar">
          </div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Name") }}:</span>
          <div class="label_value">{{data.nom||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("Position") }}({{ $t("Job Title") }}):</span>
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
        <!-- <div class="user_info">
          <span class="label_key">Extension No:</span>
          <div class="label_value">{{data.extension}}</div>
        </div> -->
        <div class="user_info">
          <span class="label_key">{{ $t("Telephone No") }}:</span>
          <div class="label_value">{{data.tel||'-'}}</div>
        </div>
        <div class="user_info">
          <span class="label_key">{{ $t("E-mail") }}:</span>
          <div class="label_value">{{data.email||'-'}}</div>
        </div>
        <!-- <div class="user_info">
          <span class="label_key">System Role:</span>
          <div class="label_value">{{data.role}}</div>
        </div> -->
        <!-- <div class="save_btn">
          <button type="button" class="btn btn-primary" @click="submit()">Save</button>
        </div> -->
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
      // this.data = {
      //   name: user.nom,
      //   shortName: '-',
      //   role: user.permission_title,
      //   sex: user.sex || 'male',
      //   position: user.title,
      //   extension: user.fax || '-',
      //   tel: user.mobile || '-',
      //   email: user.email
      // }
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
  .configuration{
    position: absolute;top: 0;right: 0;width: 100%;height: 100%;overflow: hidden;z-index: -1;
    .config_bg{position: absolute;width: 100%;height: 100%;background: rgba(0,0,0,0.2);z-index: -1;}
    .config_body{
      width: 0;transition:all 0.2s; -webkit-transition:all 0.2s;
      .icon_btn_add{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;background: url('../images/icon_btn_add.png') 50% 50% / auto auto no-repeat;}
      .title{
        height: 80px;border-bottom: 1px solid #eee;font-size: 30px;color: #4E81BD;padding: 20px 0;
        .icon_back{width: 40px;height: 40px;margin: 0 30px;float: left;background: url('../images/icon_back.png') 0 0 / 100% 100% no-repeat;display: inline-block;cursor: pointer;}
      }
      .content{
        padding: 0 30px;
        .short_name{
          width: 100px;height: 100px;margin: 30px auto;background: #FFCA28;text-align: center;color: #fff;font-size: 34px;line-height: 100px;border-radius: 50%;border: 2px solid #F2BF27;position: relative;
          .icon{position: absolute;width: 30px;height: 30px;background: #5BABFF;border-radius: 50%;bottom: 0;right: 0;}
          .icon.male{background: url('../images/icon_male.png') 0 0 / 100% 100% no-repeat;}
          .icon.female{background: url('../images/icon_female.png') 0 0 / 100% 100% no-repeat;}
          .btn{position: absolute;width: 60px;height: 38px;border-radius: 38px;border: 2px solid #ddd;right: -104px;top: 50%;transform: translateY(-50%);outline: none;}
          .icon_profile_edit{background: url('../images/icon_profile_edit.png') 0 0 / 100% 100% no-repeat;display: inline-block;width: 16px;height: 16px;vertical-align: middle;}
          .logo_box{width: 100px;height: 100px;position: absolute;top: -2px;left: -2px;z-index: 2;}
          .logo_box img{width: 100%;height: 100%;float: left;}
        }
        .user_info{
          text-align: center;
          .label_key{display: inline-block;width: 150px;line-height: 78px;color: #999;text-align: left;}
          .label_value{display: inline-block;line-height: 78px;vertical-align: middle;width: 450px;text-align: left;border-bottom: 1px solid #eee;padding: 0 30px;color: #333;}
        }
        .save_btn{
          text-align: center;
          .btn{width: 150px;margin-top: 50px;}
        }
      }
    }
  }
  .configuration.act{
    z-index: 99;
    .config_body{width: 800px;height: 100%;background: #fff;float: right;}
  }
</style>
