<template>
  <div id="body" v-cloak>

    <!-- 头部 -->
    <headerr @profileToggle='profileToggle'></headerr>

    <div class="page_body">
      <div class="page_body_box">
        <div class="search_box">
          <button type="button" class="btn iconfont iconfont-fanhui" @click="back()"></button>
          <div class="search_input">
            <i class="iconfont iconfont-fangdajing"></i>
            <input class="form-control" type="text" v-model='data.searchText' placeholder="Search" @keyup.enter='searchEvent()'>
          </div>
          <div class="search_result">Found <span class="color_red">{{data.dataList.length}}</span> results</div>
        </div>
        <div class="content">
          <div class="content_main">
            <div class="card" v-for='item in data.dataList'>
              <div class="_header">
                {{item.shortName || '-'}}
                <div class="logo_box" v-if="!data.canUpload">
                  <img v-if="item.avatar" :src="item.avatar">
                </div>
                <el-upload class="logo_box"
                           v-if="data.canUpload"
                           name="file"
                           :data="{userId: item.id}"
                           :action="actionUrl"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img v-if="item.avatar" :src="item.avatar">
                  <i class="iconfont iconfont-bianji"></i>
                </el-upload>
              </div>
              <el-tooltip effect="dark" :content="item.nom || '-'" placement="top-start">
                <div class="fullname">
                  <span v-for='(name, index) in item.nameList' :style="{color: index == 1 ? '#f00' : ''}">{{name}}</span>
                </div>
              </el-tooltip>
              <div class="form_label">Position(Job Title)</div>
              <el-tooltip class="item" effect="dark" :content="item.title || '-'" placement="top-start">
                <div class="form_value">
                  <span v-for='(title, index) in item.titleList' :style="{color: index == 1 ? '#f00' : ''}">{{index == 0 && !item.title ? '-' : title}}</span>
                </div>
              </el-tooltip>
              <div class="form_label">Department</div>
              <el-tooltip class="item" effect="dark" :content="item.department || '-'" placement="top-start">
                <div class="form_value">
                  <span v-for='(department, index) in item.departmentList' :style="{color: index == 1 ? '#f00' : ''}">{{index == 0 && !item.department ? '-' : department}}</span>
                </div>
              </el-tooltip>
              <div class="form_label">Office No</div>
              <el-tooltip class="item" effect="dark" :content="item.ext || '-'" placement="top-start">
                <div class="form_value">
                  <span v-for='(ext, index) in item.extList' :style="{color: index == 1 ? '#f00' : ''}">{{index == 0 && !item.ext ? '-' : ext}}</span>
                </div>
              </el-tooltip>
              <div class="form_label">Telephone No</div>
              <el-tooltip class="item" effect="dark" :content="item.mobile || '-'" placement="top-start">
                <div class="form_value">
                  <span v-for='(mobile, index) in item.mobileList' :style="{color: index == 1 ? '#f00' : ''}">{{index == 0 && !item.mobile ? '-' : mobile}}</span>
                </div>
              </el-tooltip>
              <div class="form_label">E-mail</div>
              <el-tooltip class="item" effect="dark" :content="item.email || '-'" placement="top-start">
                <div class="form_value">
                  <span v-for='(email, index) in item.emailList' :style="{color: index == 1 ? '#f00' : ''}">{{index == 0 && !item.email ? '-' : email}}</span>
                </div>
              </el-tooltip>
            </div>
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
  import banner from '@/components/banner'
  import profile from '@/components/profile'
  import alert from '@/components/alert'

  import {getShortName, getSStorage} from '@/plugins/util'

  export default {
    components: {
      headerr, banner, profile, alert
    },
    data () {
      return {
        data: {
          searchText: '',
          dataList: [],
          canUpload: false
        },
        actionUrl: this.$config.api_path.user_img_upload
      }
    },
    computed: {
    },
    mounted () {
      this.data.searchText = this.$route.query.searchText == undefined ? '' : this.$route.query.searchText;
      this.data.canUpload = getSStorage('userinfo').role === 0 || this.$config.userinfo.toolbar_flag === 1; // 上传图标权限
      this.searchEvent();
    },
    methods: {
      profileToggle (bol) {
        this.$refs.profile.show = bol;
      },
      // 条幅
      openBanner (res) {
        this.$refs.banner.show(res.msg)
      },
      back () {
        this.$router.go(-1)
      },
      searchEvent () {
        return this.$http.post('/adSynchronizeCtl/sys/getUserAddressBook', { 'search': this.data.searchText }).then((res) => {
          if (res.result === 'SUCCESS') {
            // console.log(res.data);
            let dataList = [];
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i];
              item.shortName = getShortName(item.nom);
              item.avatar = !item.avatar ? '' : (this.$config.api_path.img_path + item.avatar);

              item.nameList = this.str2list(item.nom);
              item.titleList = this.str2list(item.title);
              item.departmentList = this.str2list(item.department);
              item.extList = this.str2list(item.ext);
              item.mobileList = this.str2list(item.mobile);
              item.emailList = this.str2list(item.email);

              dataList.push(item);
            }
            this.data.dataList = dataList;
          }
        })
      },
      // 字符切割
      str2list (str) {
        let searchText = this.data.searchText.toLowerCase();
        let list = [str, '', ''];
        if (!str) return list;
        let string = str.toLowerCase();
        let startIndex = string.indexOf(searchText);
        let strLength = searchText.length;
        if (startIndex > -1) {
          let strPart1 = str.substr(0, startIndex);
          let strPart2 = str.substr(startIndex, strLength);
          let strPart3 = str.substr(startIndex + strLength, str.length);
          list = [strPart1, strPart2, strPart3];
        }
        return list;
      },
      // 图标上传成功
      handleAvatarSuccess (res, file) {
        if (res.success) {
          // this.data.appLogo = this.$config.api_path.img_path + res.data[0].picUrl;
          this.searchEvent();
        } else {
          let banner = {
            status: 'ERROR',
            msg: res.msg
          }
          this.openBanner(banner);
        }
      },
      // 图标上传前校验
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$refs.alert.showDialog('Uploading image images can only be JPG or PNG format!', true);
        }
        if (!isLt2M) {
          this.$refs.alert.showDialog('Upload profile picture size can\'t exceed 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  #body{height: 100%;background: #f5f5f5;overflow: auto;position: relative;}
  .page_body{
    padding: 100px 180px 30px 180px;width: 100%;height: 100%;position: absolute;top: 0;left: 0;
    .page_body_box{
      height: 100%;position: relative;padding-top: 126px;
      .search_box{
        height: 126px;line-height: 80px;position: absolute;width: 100%;top: 0;left: 0;background: #f5f5f5;
        .iconfont-fanhui{width: 100px;height: 42px;border-radius: 42px;border: 0;outline: none;font-size: 24px;background: #4E81BD;color: #fff;}
        .search_input{
          width: 800px;display: inline-block;height: 42px;line-height: 42px;vertical-align: middle;border-radius: 3px;margin-left: 20px;position: relative;overflow: hidden;
          .iconfont-fangdajing{position: absolute;width: 42px;height: 42px;font-size: 34px;color: #999;left: 6px;}
          .form-control{height: 100%;padding-left: 48px;color: #999;}
        }
        .search_result{
          height: 46px;line-height: 46px;color: #999;
          .color_red{color: #f00;}
        }
      }
      .content{
        height: 100%;overflow: hidden;
        .content_main{
          height: 100%;overflow: auto;
          .card{
            width: 300px;background: #fff;border: 1px solid #ddd;padding: 0 30px 20px 30px;float: left;margin: 0 13px 13px 0;
            ._header{
              width: 90px;height: 90px;border: 2px solid #F2BF27;border-radius: 50%;background: #FFCA28;color: #fff;text-align: center;line-height: 90px;font-size: 36px;margin: 20px auto;position: relative;
              .logo_box{
                width: 90px;height: 90px;position: absolute;top: -2px;left: -2px;
                img{width: 100%;height: 100%;position: absolute;top: 0;left: 0;border-radius: 50%;}
                .iconfont{position: absolute;width: 25px;height: 25px;right: 0;bottom: 0;background: #999;border-radius: 50%;color: #fff;line-height: 25px;font-size: 12px;cursor: pointer;}
              }
            }
            .fullname{text-align: center;color: #333;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
            .form_label{font-size: 12px;color: #999;}
            .form_value{color: #333;margin-bottom: 5px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
          }
          .card:nth-child(5n){margin-right: 0;}
        }
      }
    }
  }
</style>
