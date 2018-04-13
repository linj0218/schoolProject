<template>
  <div class="popup" :class='{"showPopup": showPopup}'>
    <div class="popup_bg" @click='closePopup()'></div>
    <div class="popup_content">
      <div class="popup_header">
        {{ $t("Add participants") }}
        <span class="icon_close" @click='closePopup()'></span>
      </div>
      <div class="popup_body">
        <div class="flex">
          <div class="left">
            <div class="search_box">
              <div>
                <input type="text" class="form-control" :placeholder='$t("Search staff")'
                       v-model='searchValue'
                       @keyup='formSearch()'>
              </div>
            </div>
            <div>
              <template v-for='(item, index) in preSelectList'>
                <div class="li" :class='{"disabled": item.selected}' v-show='item.show'>
                  <span class="icon" :class='item.type'></span>
                  {{item.name}}
                  <span class="action_icon icon_add" @click='addItem(item, index)'></span>
                </div>
              </template>
            </div>
          </div>
          <div class="mid"></div>
          <div class="right">
            <div class="li" v-for='(item, index) in selectedList'>
              <span class="icon" :class='item.type'></span>
              {{item.name}}
              <span class="action_icon icon_delete" @click='deleteItem(item, index)'></span>
            </div>
          </div>
        </div>
      </div>
      <div class="popup_footer">
        <button type="button" class="btn btn-primary" @click='confirm()'>{{ $t("Confirm") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {forEach} from '@/script/util'
  export default {
    props: {
      showPopup: {
        type: Boolean,
        required: true
      },
      // 数据源
      dataList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        searchValue: '',
        preSelectList: [],
        selectedList: []
      }
    },
    mounted () {
    },
    watch: {
      showPopup () {
        if (this.showPopup) {
          this.preSelectList = this.dataList
          this.selectedList = []
        }
      }
    },
    methods: {
      // 回车查询 忽略大小写
      formSearch () {
        forEach(this.preSelectList, (i, item) => {
          if (item.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1) {
            item.show = true
          } else {
            item.show = false
          }
        })
      },
      // 关闭弹窗
      closePopup () {
        this.$emit('closePopup')
      },
      // 添加选项
      addItem (item, index) {
        item.selected = true
        this.selectedList.push(item)
      },
      // 删除选项
      deleteItem (item, index) {
        for (let i = 0, len = this.preSelectList.length; i < len; i++) {
          let obj = this.preSelectList[i]
          if (obj.id === item.id) {
            obj.selected = false
            break;
          }
        }
        this.selectedList.splice(index, 1)
      },
      // 提交选项
      confirm () {
        let resData = {
          status: 'ok',
          data: this.selectedList
        }
        this.$emit('closePopup', resData)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .popup{
    position: fixed;z-index: 999;width: 100%;height: 100%;top: 0;left: 0;display: none;
    .popup_bg{background: rgba(0,0,0,0.2);z-index: -1;height: 100%;}
    .popup_content{
      width: 740px;background: #fff;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);border-radius: 4px;
      .popup_header{
        font-size: 30px;color: #fff;text-align: center;background: #4E81BD;line-height: 68px;position: relative;height: 68px;
        .icon_close{position: absolute;width: 36px;height: 36px;background: url('../images/icon_close.png') 0 0 / 100% 100% no-repeat;right: 30px;top: 16px;cursor: pointer;}
      }
      .popup_body{
        padding: 20px 30px 10px;
        .left .search_box{
          padding: 7px;position: absolute;width: 100%;z-index: 1;background: #f5f5f5;
          .form-control{border-radius: 34px;background: url('../images/icon_search.png') 10px 50% no-repeat;height: 38px;padding-left: 40px;}
        }
        .left .search_box + div{
          height: 100%;padding-top: 52px;overflow: auto;
          &::-webkit-scrollbar {width: 0;height: 0;}
        }
        .left,
        .right{
          flex: 1;height: 352px;background: #f5f5f5;border-radius: 1px;overflow: auto;position: relative;
          &::-webkit-scrollbar {width: 0;height: 0;}
          .li{
            position: relative;line-height: 42px;padding: 0 16px;color: #333;text-align: left;
            .icon{width: 24px;height: 24px;display: inline-block;vertical-align: middle;margin-right: 16px;}
            .icon_member{left: 16px;background: url('../images/icon_member.png') 0 0 / 100% 100% no-repeat;}
            .icon_members{left: 16px;background: url('../images/icon_members.png') 0 0 / 100% 100% no-repeat;}
            .action_icon{width: 22px;height: 22px;cursor: pointer;position: absolute;top: 50%;transform: translateY(-50%);display: none;}
            .action_icon.icon_delete{right: 15px;background: url('../images/icon_delete.png') 0 0 / 100% 100% no-repeat;}
            .action_icon.icon_add{right: 15px;background: url('../images/icon_add.png') 0 0 / 100% 100% no-repeat;}
          }
          .li:nth-child(odd){background: #F9F9F9;}
          .li:hover{
            background: rgba(78,129,189,0.1);
            .action_icon{display: block;}
          }
          .li.disabled{color: #999;}
          .li.disabled:hover .action_icon{display: none;}
        }
        .mid{width: 60px;height: 352px;background: url('../images/icon_right_add.png') 50% 50% no-repeat;}
      }
      .popup_footer{
        text-align: center;padding: 20px;
        .btn{width: 160px;}
      }
    }
  }
  .popup.showPopup{display: block;}
  // .header{z-index: 99;}
</style>
