<template>
  <div class="configuration" :class='{"act": showConfig}'>
    <div class="config_bg" @click='closeConfig()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeConfig()'></span>News event
      </div>
      <div class="content">
        <div>
          <div class="left">
            <div>
              <span class="lab">Title</span>
              <div class="name_value">
                <input class="form-control" type="text" name="" v-model='title'>
              </div>
            </div>
            <div class="all_day">
              <div class="checkbox">
                <label>
                  <input @click='checkAllDayChange()' type="checkbox" v-model='allDay'> All day
                </label>
              </div>
            </div>
            <div>
              <span class="lab">Categroy</span>
              <div class="name_value flex">
                <drapdown :input-value='categroyId'
                          :input-name='categroyName'
                          :input-select='categroys'
                          @inputChange='categroyChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Place</span>
              <div class="name_value flex">
                <drapdown :input-value='placeId'
                          :input-name='placeName'
                          :input-select='places'
                          @inputChange='placeChanged'>
                </drapdown>
                <drapdown :input-value='roomId'
                          :input-name='roomName'
                          :input-select='rooms'
                          @inputChange='roomChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Start</span>
              <div class="name_value flex">
                <date-select :input-value='startDate'
                             :show-icon='false'
                             @dataChange='startDateChange'>
                </date-select>
                <drapdown :input-value='startTimeId'
                          :input-name='startTimeName'
                          :input-select='startTimeList'
                          :input-disabled='allDay'
                          @inputChange='startTimeChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">End</span>
              <div class="name_value flex">
                <date-select :input-value='endDate'
                             :show-icon='false'
                             @dataChange='endDateChange'>
                </date-select>
                <drapdown :input-value='endTimeId'
                          :input-name='endTimeName'
                          :input-select='endTimeList'
                          :input-disabled='allDay'
                          @inputChange='endTimeChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Description</span>
              <div class="name_value">
                <textarea class="form-control textarea"></textarea>
              </div>
            </div>
          </div>
          <div class="right">
            <div>
              <span class="lab">Participants</span>
              <div class="participants">
                <div class="li" v-for='(item, index) in participants'>
                  <span class="icon" :class='item.type'></span>{{item.name}}<span class="action_icon icon_delete" @click='deleteParticipant(index)'></span>
                </div>
                <button type="button" class="btn btn-primary" @click='()=>{this.showAddParticipantPopup=true}'>
                  <span class="icon_btn_add"></span> Participants
                </button>

                <add-participant-modal :showPopup='showAddParticipantPopup'
                                       @closePopup='()=>{this.showAddParticipantPopup=false}'>
                </add-participant-modal>

              </div>
            </div>
            <div>
              <span class="lab">Viewed by</span>
              <div class="viewed_by">
                <div class="check_all">
                  <div class="checkbox">
                    <label>
                      <input @click='checkAllChange()' type="checkbox" v-model='viewedAll'> All Employees
                    </label>
                  </div>
                </div>
                <div class="check_list">
                  <div class="checkbox" v-for='item in viewedList'>
                    <label>
                      <input @click='checkChange(item)' type="checkbox" v-model='item.value'> {{item.name}}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-danger">Save and continue</button>
        <button type="button" class="btn cancel" @click='closeConfig()'>Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import drapdown from '@/components/drapdown'
import dateSelect from '@/components/dateSelect'
import addParticipantModal from '@/components/addParticipantModal'
import {forEach} from '@/plugins/util'
export default {
  props: {
    showConfig: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    drapdown, dateSelect, addParticipantModal
  },
  data () {
    return {
      // part_left ------------------------------------------------------
      title: '',
      // All day
      allDay: false,
      // Categroy
      categroyId: '10086',
      categroyName: 'option1',
      categroys: [
        {value: '10086', name: 'option1'},
        {value: '10087', name: 'option2'},
        {value: '10088', name: 'option3'}
      ],
      // Place
      placeId: '10086',
      placeName: 'place1',
      places: [
        {value: '10086', name: 'place1'},
        {value: '10087', name: 'place2'},
        {value: '10088', name: 'place3'}
      ],
      roomId: '10086',
      roomName: 'ClassRoom1',
      rooms: [
        {value: '10086', name: 'ClassRoom1'},
        {value: '10087', name: 'ClassRoom2'},
        {value: '10088', name: 'ClassRoom3'}
      ],
      // Start
      startDate: '2017-10-22',
      startTimeId: '8:00',
      startTimeName: '8:00',
      startTimeList: [
        {value: '8:00', name: '8:00'},
        {value: '9:00', name: '9:00'},
        {value: '10:00', name: '10:00'},
        {value: '11:00', name: '11:00'}
      ],
      // End
      endDate: '2017-10-22',
      endTimeId: '8:00',
      endTimeName: '8:00',
      endTimeList: [
        {value: '8:00', name: '8:00'},
        {value: '9:00', name: '9:00'},
        {value: '10:00', name: '10:00'},
        {value: '11:00', name: '11:00'}
      ],
      // part_right ------------------------------------------------------
      // Participants
      participants: [
        {value: '1', name: 'ClassRoom 101', type: 'icon_member'},
        {value: '2', name: 'ConferenceRoom 301', type: 'icon_members'},
        {value: '3', name: 'PlayGround', type: 'icon_member'},
        {value: '4', name: 'Primaire', type: 'icon_member'},
        {value: '5', name: 'PlayGround', type: 'icon_member'}
      ],
      showAddParticipantPopup: false,
      // Viewed by
      viewedAll: false,
      viewedList: [
        {id: '1', value: false, name: 'Administration of Qingpu'},
        {id: '2', value: false, name: 'Educational Director'},
        {id: '3', value: false, name: 'Secondary school of Qingpu'},
        {id: '4', value: false, name: 'Secondary school of Qingpu'},
        {id: '5', value: false, name: 'Administration of Pudong'},
        {id: '6', value: false, name: 'Director'},
        {id: '7', value: false, name: 'Primary school of Qingpu'}
      ]
    }
  },
  methods: {
    closeConfig () {
      this.$emit('eventToggleFunc')
    },
    checkAllDayChange () {

    },
    checkAllChange () {
      let flg = this.viewedAll
      forEach(this.viewedList, (i, obj) => {
        obj.value = flg
      })
    },
    checkChange (item) {
      if (!item.value) {
        this.viewedAll = false
      } else {
        let flg = true
        forEach(this.viewedList, (i, obj) => {
          if (!obj.value) {
            flg = false
          }
        })
        this.viewedAll = flg
      }
    },
    startDateChange (calendarList, thisDateInfo, actDateInfo) {
      this.startDate = actDateInfo.thisYear + '-' + actDateInfo.thisMonth + '-' + actDateInfo.thisDate
    },
    endDateChange (calendarList, thisDateInfo, actDateInfo) {
      this.endDate = actDateInfo.thisYear + '-' + actDateInfo.thisMonth + '-' + actDateInfo.thisDate
    },
    startTimeChanged (item) {
      this.startTimeId = item.value
      this.startTimeName = item.name
    },
    endTimeChanged (item) {
      this.endTimeId = item.value
      this.endTimeName = item.name
    },
    roomChanged (item) {
      this.roomId = item.value
      this.roomName = item.name
    },
    categroyChanged (item) {
      this.categroyId = item.value
      this.categroyName = item.name
    },
    placeChanged (item) {
      this.placeId = item.value
      this.placeName = item.name
    },
    deleteParticipant (index) {
      this.participants.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../styles/mixin';
  .configuration{
    position: absolute;top: 0;right: 0;width: 0;height: 100%;z-index: 99;overflow: hidden;
    .config_bg{position: absolute;width: 100%;height: 100%;background: rgba(0,0,0,0.2);z-index: -1;}
    .config_body{
      width: 0;
      .icon_btn_add{display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;background: url('../images/icon_btn_add.png') 50% 50% / auto auto no-repeat;}
      .title{
        height: 80px;border-bottom: 1px solid #eee;font-size: 30px;color: #4E81BD;padding: 20px 0;
        .icon_back{width: 40px;height: 40px;margin: 0 30px;float: left;background: url('../images/icon_back.png') 0 0 / 100% 100% no-repeat;display: inline-block;cursor: pointer;}
      }
      .content{
        padding: 0 40px;
        .left{
          float: left;width: 530px;padding-right: 30px;
          .all_day{text-align: right;}
          .lab{color: #999;font-size: 16px;line-height: 34px;display: block;}
          .name_value{
            height: 34px;
            .textarea{height: 322px;}
            .form-control{background: #f5f5f5;}
          }
          .name_value .dropdown{
            flex: 1;background: #f5f5f5;
          }
          .name_value .dropdown:nth-child(2){margin-left: 20px;}
        }
        .right{
          overflow: hidden;
          .lab{color: #999;font-size: 16px;line-height: 34px;display: block;}
          .participants{
            height: 300px;background: #f5f5f5;border-radius: 2px;position: relative;padding-bottom: 58px;border: 1px solid #ddd;
            .li{
              position: relative;line-height: 34px;padding: 0 16px;color: #333;
              .icon{width: 24px;height: 24px;display: inline-block;vertical-align: middle;margin-right: 16px;}
              .icon_member{left: 16px;background: url('../images/icon_member.png') 0 0 / 100% 100% no-repeat;}
              .icon_members{left: 16px;background: url('../images/icon_members.png') 0 0 / 100% 100% no-repeat;}
              .action_icon{width: 22px;height: 22px;cursor: pointer;position: absolute;top: 50%;transform: translateY(-50%);display: none;}
              .action_icon.icon_delete{right: 30px;background: url('../images/icon_delete.png') 0 0 / 100% 100% no-repeat;}
              .action_icon.icon_edit{right: 62px;background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;}
            }
            .li:nth-child(odd){background: #F9F9F9;}
            .li:hover{
              background: rgba(78,129,189,0.1);
              .action_icon{display: block;}
            }
            .btn{position: absolute;bottom: 12px;right: 10px;}
          }
          .viewed_by{
            height: 368px;background: #f5f5f5;border-radius: 2px;border: 1px solid #ddd;
            .check_all{padding: 0 16px;}
            .check_list{padding: 0 52px;}
          }
        }
      }
      .btns{
        text-align: center;padding-top: 80px;
        .cancel{background: #ccc;color: #fff;}
        .btn:nth-child(1),
        .btn:nth-child(3){width: 160px;}
        .btn:nth-child(2){width: 300px;margin: 0 30px;}
      }
    }
  }
  .configuration.act{
    width: 100%;
    .config_body{width: 1012px;height: 100%;background: #fff;float: right;transition:all 0.2s; -webkit-transition:all 0.2s;}
  }
</style>