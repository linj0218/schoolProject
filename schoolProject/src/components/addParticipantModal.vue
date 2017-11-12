<template>
  <div class="popup" :class='{"showPopup": showPopup}'>
    <div class="popup_bg" @click='closePopup()'></div>
    <div class="popup_content">
      <div class="popup_header">
        Add participants
        <span class="icon_close" @click='closePopup()'></span>
      </div>
      <div class="popup_body">
        <div class="flex">
          <div class="left">
            <div class="search_box">
              <div>
                <input type="text" class="form-control" placeholder="Search staff"
                       v-model='searchValue'
                       @keyup.enter='formSearch()'>
              </div>
            </div>
            <div class="li" v-for='(item, index) in preSelectList'
                 :class='{"disabled": item.isSelected}'>
              <span class="icon" :class='item.type'></span>
              {{item.name}}
              <span class="action_icon icon_add" @click='addItem(index)'></span>
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
        <button type="button" class="btn btn-primary" @click='confirm()'>Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {forEach} from '@/plugins/util'
  export default {
    props: {
      showPopup: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        searchValue: '',
        preSelectList: [
          {value: '1', type: 'icon_member', name: 'ClassRoom 101', isSelected: false},
          {value: '2', type: 'icon_members', name: 'ConferenceRoom 301', isSelected: false},
          {value: '3', type: 'icon_member', name: 'PlayGround', isSelected: false},
          {value: '4', type: 'icon_member', name: 'Primaire', isSelected: false},
          {value: '5', type: 'icon_member', name: 'SQLDebugger', isSelected: false}
        ],
        selectedList: []
      }
    },
    mounted () {
    },
    watch: {
      showPopup () {
        // TODO 查询列表
        // console.log('1')
      }
    },
    methods: {
      // 回车查询
      formSearch () {
        console.log(this.searchValue)
      },
      // 关闭弹窗
      closePopup () {
        this.$emit('closePopup')
      },
      // 添加选项
      addItem (index) {
        this.preSelectList[index].isSelected = true
        this.selectedList.push(this.preSelectList[index])
      },
      // 删除选项
      deleteItem (item, index) {
        forEach(this.preSelectList, (i, obj) => {
          if (obj.value === item.value) {
            obj.isSelected = false
          }
        })
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
          padding: 7px;
          .form-control{border-radius: 34px;background: url('../images/icon_search.png') 10px 50% no-repeat;height: 38px;padding-left: 40px;}
        }
        .left,
        .right{
          flex: 1;height: 352px;background: #f5f5f5;border-radius: 1px;
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