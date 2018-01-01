<template>
  <div class="configuration" :class='{"act": showConfig}'>
    <div class="config_bg" @click='closeConfig()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeConfig()'></span>{{eventType=="new"?"News":"Edit"}} event
      </div>
      <div class="content">

        <!-- 选择成员弹窗 -->
        <add-participant-modal :show-popup='data.showAddParticipantPopup'
                               :data-list='data.allParticipants'
                               @closePopup='closeAddParticipantModal'>
        </add-participant-modal>

        <!-- event弹窗 -->
        <div>
          <div class="left">
            <div>
              <span class="lab">Title</span>
              <div class="name_value">
                <input class="form-control" type="text" name="" v-model='data.title'>
              </div>
            </div>
            <div class="all_day">
              <div class="checkbox">
                <label :class='{"checked": data.day_flag}'>
                  <input type="checkbox" v-model='data.day_flag'> All day
                </label>
              </div>
            </div>
            <div>
              <span class="lab">Category</span>
              <div class="name_value flex">
                <drapdown :input-value='data.category_id'
                          :input-name='data.categoryName'
                          :input-color-type='"circle"'
                          :input-color='data.categoryColor'
                          :input-select='data.categorys'
                          @inputChange='categoryChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Place</span>
              <div class="name_value flex">
                <drapdown :input-value='data.place_id'
                          :input-name='data.placeName'
                          :input-select='data.places'
                          @inputChange='placeChanged'>
                </drapdown>
                <drapdown :input-value='data.roomId'
                          :input-name='data.roomName'
                          :input-select='data.rooms'
                          @inputChange='roomChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Start</span>
              <div class="name_value flex">
                <date-select :input-value='data.start_date'
                             :show-icon='false'
                             @dataChange='startDateChange'>
                </date-select>
                <drapdown :input-value='data.start_time'
                          :input-name='data.start_time'
                          :input-select='data.startTimeList'
                          :input-disabled='data.day_flag'
                          @inputChange='startTimeChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">End</span>
              <div class="name_value flex">
                <date-select :input-value='data.end_date'
                             :show-icon='false'
                             @dataChange='endDateChange'>
                </date-select>
                <drapdown :input-value='data.end_time'
                          :input-name='data.end_time'
                          :input-select='data.endTimeList'
                          :input-disabled='data.day_flag'
                          @inputChange='endTimeChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Description</span>
              <div class="name_value">
                <textarea class="form-control textarea" v-model='data.description'></textarea>
              </div>
            </div>
          </div>
          <div class="right">
            <div>
              <span class="lab">Participants</span>
              <div class="participants">
                <div style="height: 100%;overflow: auto;">
                  <div class="li" v-for='(item, index) in data.participants'>
                    <span class="icon" :class='item.type'></span>
                    {{item.name}}
                    <span class="action_icon icon_delete" @click='deleteParticipant(item, index)'></span>
                  </div>
                </div>
                <button type="button" class="btn btn-primary" @click='()=>{this.data.showAddParticipantPopup=true}'>
                  <span class="icon_btn_add"></span> Participants
                </button>
              </div>
            </div>
            <div>
              <span class="lab">Viewed by</span>
              <div class="viewed_by">
                <div class="check_all">
                  <div class="checkbox">
                    <label :class='{"checked": data.viewedAll}'>
                      <input @click='checkAllChange()' type="checkbox" v-model='data.viewedAll'> All Employees
                    </label>
                  </div>
                </div>
                <div class="check_list">
                  <div class="checkbox" v-for='item in data.viewedList'>
                    <label :class='{"checked": item.value}'>
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
        <button type="button" class="btn btn-primary" @click='saveAndClose()'>Save</button>
        <button type="button" class="btn btn-danger" v-show='eventType=="new"' @click='saveAndContinue()'>Save and continue</button>
        <button type="button" class="btn cancel" @click='closeConfig()'>Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import drapdown from '@/components/drapdown'
import dateSelect from '@/components/dateSelect'
import addParticipantModal from '@/components/addParticipantModal'
import {forEach, formatDate} from '@/plugins/util'
export default {
  props: {
    showConfig: {
      type: Boolean,
      required: true,
      default: false
    },
    eventType: {
      type: String,
      required: false,
      default: 'new'
    },
    eventId: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  components: {
    drapdown, dateSelect, addParticipantModal
  },
  data () {
    return {
      data: {
        // part_left ------------------------------------------------------
        title: '',
        // All day
        day_flag: false,
        // Category
        category_id: '',
        categoryName: '',
        categoryColor: '',
        categorys: [],
        // Place
        place_id: '',
        placeName: '',
        places: [],
        roomId: '',
        roomName: '',
        rooms: [],
        // Start
        start_date: '',
        start_time: '',
        startTimeList: [],
        // End
        end_date: '',
        end_time: '',
        endTimeList: [],
        // description
        description: '',
        // part_right ------------------------------------------------------
        // Participants
        participants: [],
        allParticipants: [],
        showAddParticipantPopup: false,
        // Viewed by
        viewedAll: false,
        viewedList: []
      },
      copyData: {}
    }
  },
  created () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    this.data.start_date = day + '/' + month + '/' + year
    this.data.end_date = day + '/' + month + '/' + year
    let hour = date.getHours();
    if (hour <= 12) {
      hour = hour + ':00 AM'
    } else {
      hour = (hour - 12) + ':00 PM'
    }
    this.data.start_time =
    this.data.startTimeName =
    this.data.end_time =
    this.data.endTimeName = hour
    this.data.startTimeList =
    this.data.endTimeList = [
      {value: '0:00 AM', name: '0:00 AM'}, {value: '0:30 AM', name: '0:30 AM'},
      {value: '1:00 AM', name: '1:00 AM'}, {value: '1:30 AM', name: '1:30 AM'},
      {value: '2:00 AM', name: '2:00 AM'}, {value: '2:30 AM', name: '2:30 AM'},
      {value: '3:00 AM', name: '3:00 AM'}, {value: '3:30 AM', name: '3:30 AM'},
      {value: '4:00 AM', name: '4:00 AM'}, {value: '4:30 AM', name: '4:30 AM'},
      {value: '5:00 AM', name: '5:00 AM'}, {value: '5:30 AM', name: '5:30 AM'},
      {value: '6:00 AM', name: '6:00 AM'}, {value: '6:30 AM', name: '6:30 AM'},
      {value: '7:00 AM', name: '7:00 AM'}, {value: '7:30 AM', name: '7:30 AM'},
      {value: '8:00 AM', name: '8:00 AM'}, {value: '8:30 AM', name: '8:30 AM'},
      {value: '9:00 AM', name: '9:00 AM'}, {value: '9:30 AM', name: '9:30 AM'},
      {value: '10:00 AM', name: '10:00 AM'}, {value: '10:00 AM', name: '10:30 AM'},
      {value: '11:00 AM', name: '11:00 AM'}, {value: '11:00 AM', name: '11:30 AM'},
      {value: '0:00 PM', name: '0:00 PM'}, {value: '0:30 PM', name: '0:30 PM'},
      {value: '1:00 PM', name: '1:00 PM'}, {value: '1:30 PM', name: '1:30 PM'},
      {value: '2:00 PM', name: '2:00 PM'}, {value: '2:30 PM', name: '2:30 PM'},
      {value: '3:00 PM', name: '3:00 PM'}, {value: '3:30 PM', name: '3:30 PM'},
      {value: '4:00 PM', name: '4:00 PM'}, {value: '4:30 PM', name: '4:30 PM'},
      {value: '5:00 PM', name: '5:00 PM'}, {value: '5:30 PM', name: '5:30 PM'},
      {value: '6:00 PM', name: '6:00 PM'}, {value: '6:30 PM', name: '6:30 PM'},
      {value: '7:00 PM', name: '7:00 PM'}, {value: '7:30 PM', name: '7:30 PM'},
      {value: '8:00 PM', name: '8:00 PM'}, {value: '8:30 PM', name: '8:30 PM'},
      {value: '9:00 PM', name: '9:00 PM'}, {value: '9:30 PM', name: '9:30 PM'},
      {value: '10:00 PM', name: '10:00 PM'}, {value: '10:30 PM', name: '10:30 PM'},
      {value: '11:00 PM', name: '11:00 PM'}, {value: '11:30 PM', name: '11:30 PM'}
    ]
    this.copyData = JSON.parse(JSON.stringify(this.data))
  },
  watch: {
    showConfig () {
      if (this.showConfig && this.eventType === 'new') {
        this.data = JSON.parse(JSON.stringify(this.copyData))
      }
      if (this.showConfig) {
        this.findEvent().then(() => {
          this.getUsers().then(() => {
            if (this.eventType === 'new') return
            this.getViews()
          })
        })
      }
    }
  },
  methods: {
    // 初始化Event
    findEvent () {
      let self = this
      return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', {
        data: JSON.stringify({event_id: this.eventType === 'new' ? 0 : this.eventId || 0})
      }).then((res) => {
        let resData = res.data

        // 初始化数据
        let categorys = []
        forEach(resData.categoryList, (i, item) => {
          if (resData.eventInfo && resData.eventInfo.category_id === item.id) {
            self.data.categoryName = item.category_no
            self.data.categoryColor = item.category_remark
          }
          categorys.push({
            value: item.id,
            name: item.category_no,
            color: item.category_remark
          })
        })
        self.data.categorys = categorys

        let places = []
        forEach(resData.campusList, (i, item) => {
          if (resData.eventInfo && resData.eventInfo.campus_name === item.campus_name) {
            self.data.place_id = item.id
            self.data.placeName = item.campus_name
          }
          // TODO设置campus
          places.push({
            value: item.id,
            name: item.address
          })
        })
        self.data.places = places

        let rooms = []
        forEach(resData.placesList, (i, item) => {
          if (resData.eventInfo && resData.eventInfo.place_name === item.place_name) {
            self.data.roomId = item.id
            self.data.roomName = item.place_name
          }
          // TODO设置place
          rooms.push({
            value: item.id,
            name: item.place_name
          })
        })
        self.data.rooms = rooms

        if (self.eventType === 'new') self.data.viewedAll = true
        else self.data.viewedAll = false
        let viewedList = []
        forEach(resData.groupsList, (i, item) => {
          viewedList.push({
            id: item.id,
            value: self.eventType === 'new',
            name: item.group_alias_name
          })
        })
        self.data.viewedList = viewedList

        // TODO设置participants包含groups和users
        let groupList = []
        forEach(resData.groupsList, (i, item) => {
          groupList.push({
            id: item.id,
            name: item.group_alias_name,
            type: 'icon_members',
            selected: false,
            show: true
          })
        })
        self.data.allParticipants = groupList

        // TODO将Event数据同步到表单
        if (resData.eventInfo) {
          self.data.title = resData.eventInfo.title
          self.data.category_id = resData.eventInfo.category_id
          self.data.day_flag = !!resData.eventInfo.day_flag
          self.data.start_date = formatDate(resData.eventInfo.start_date, 'dd/mm/yyyy')
          self.data.start_time = resData.eventInfo.start_time
          self.data.end_date = formatDate(resData.eventInfo.end_date, 'dd/mm/yyyy')
          self.data.end_time = resData.eventInfo.end_time
          self.data.description = resData.eventInfo.description
        }
        return res
      })
    },
    // 获取groups users
    getViews () {
      if (!this.eventId || this.eventId === 0) return false
      let self = this
      this.$http.post('/sharedcalendarSettingCtl/event/getEventsDetailByEventId', {
        data: JSON.stringify({event_id: this.eventId})
      }).then((res) => {
        if (res.success) {
          let resData = res.data

          for (let i = 0, len = resData.eventsGroupList.length; i < len; i++) {
            let item = resData.eventsGroupList[i]

            for (let i2 = 0, len2 = self.data.viewedList.length; i2 < len2; i2++) {
              let item2 = self.data.viewedList[i2]
              if (item.group_id === item2.id) {
                // console.log(item2.name)
                item2.value = true
              }
            }
          }

          let flg = true
          forEach(this.data.viewedList, (i, obj) => {
            if (!obj.value) {
              flg = false
            }
          })
          this.data.viewedAll = flg

          let participants = []
          forEach(resData.eventsUserGroupList, (i, item) => {
            let tempObj = {
              id: item.group_id,
              name: item.group_alias_name,
              type: 'icon_members',
              selected: true,
              show: true
            }
            participants.push(tempObj)
          })
          forEach(resData.eventsUserList, (i, item) => {
            let tempObj = {
              id: item.user_id,
              name: item.nom,
              type: 'icon_member',
              selected: true,
              show: true
            }
            participants.push(tempObj)
          })
          self.data.participants = participants

          // 同步allParticipants中选中项
          forEach(self.data.participants, (i, item) => {
            for (let i2 = 0, len2 = self.data.allParticipants.length; i2 < len2; i2++) {
              let item2 = self.data.allParticipants[i2]
              if (item.id === item2.id) {
                item2.selected = true
                break;
              }
            }
          })
        }
      })
    },
    // 获取users
    getUsers () {
      let self = this
      return this.$http.post('/sharedcalendarSettingCtl/event/getGroupsOrUsers', {
        data: JSON.stringify({flag: 1})
      }).then((res) => {
        let resData = res.data
        let userList = []
        forEach(resData, (i, item) => {
          userList.push({
            id: item.id,
            name: item.nom,
            type: 'icon_member',
            selected: false,
            show: true
          })
        })
        self.data.allParticipants = self.data.allParticipants.concat(userList)
        // console.log(self.data.allParticipants.length)
        return res
      })
    },
    // 表单保存
    save () {
      let userIds = []
      let userGroupId = []
      forEach(this.data.participants, (i, item) => {
        if (item.type === 'icon_member') {
          userIds.push(item.id)
        } else {
          userGroupId.push(item.id)
        }
      })

      let groupIds = []
      forEach(this.data.viewedList, (i, item) => {
        if (item.value) groupIds.push(item.id)
      })

      let reqData = {
        id: this.eventType === 'new' ? 0 : this.eventId || 0,
        title: this.data.title,
        day_flag: this.data.day_flag ? 1 : 0,
        category_id: this.data.category_id,
        start_date: formatDate(this.data.start_date, 'yyyy-mm-dd'),
        start_time: this.data.day_flag ? '' : this.data.start_time,
        end_date: formatDate(this.data.end_date, 'yyyy-mm-dd'),
        end_time: this.data.day_flag ? '' : this.data.end_time,
        description: this.data.description,
        place_id: this.data.roomId,
        groupIds: groupIds.join(','),
        userIds: userIds.join(','),
        userGroupId: userGroupId.join(',')
      }
      // console.log(reqData)

      return this.$http.post('sharedcalendarSettingCtl/event/editEvent', {
        data: JSON.stringify(reqData)
      }).then((res) => {
        if (res.success) {
          let result = {
            status: 'ok',
            msg: 'Save Successed'
          }
          this.$emit('openBanner', result)
          return res
        }
      })
    },
    // 保存并关闭
    saveAndClose () {
      this.save().then((res) => {
        this.closeConfig()
      })
    },
    // 保存并继续
    saveAndContinue () {
      this.save().then((res) => {
        this.data = JSON.parse(JSON.stringify(this.copyData))
        this.findEvent().then(() => {
          this.getUsers()
        })
      })
    },
    checkAllDayChange () {

    },
    // 全选复选框切换
    checkAllChange () {
      setTimeout(() => {
        let flg = this.data.viewedAll
        forEach(this.data.viewedList, (i, obj) => {
          obj.value = flg
        })
      }, 0)
    },
    // 员工复选框切换
    checkChange (item) {
      setTimeout(() => {
        if (!item.value) {
          this.data.viewedAll = false
        } else {
          let flg = true
          forEach(this.data.viewedList, (i, obj) => {
            if (!obj.value) {
              flg = false
            }
          })
          this.data.viewedAll = flg
        }
      }, 0)
    },
    startDateChange (calendarList, thisDateInfo, actDateInfo) {
      let dateStr = [actDateInfo.thisDate, actDateInfo.thisMonth, actDateInfo.thisYear].join('/')
      // if (!this.checkDateChange(dateStr, this.data.end_date)) return false
      this.data.start_date = dateStr
      this.data.end_date = dateStr
    },
    endDateChange (calendarList, thisDateInfo, actDateInfo) {
      let dateStr = [actDateInfo.thisDate, actDateInfo.thisMonth, actDateInfo.thisYear].join('/')
      if (!this.checkDateChange(this.data.start_date, dateStr)) return false
      this.data.end_date = dateStr
    },
    // 检验开始、结束日期
    checkDateChange (startDateStr, endDateStr) {
      let startDateTime = new Date(startDateStr.split('/').reverse().join('.')).getTime()
      let endDateTime = new Date(endDateStr.split('/').reverse().join('.')).getTime()
      if (startDateTime > endDateTime) {
        alert('The end time cannot be earlier than the start time')
        return false
      }
      return true
    },
    startTimeChanged (item) {
      this.data.start_time = item.value
    },
    endTimeChanged (item) {
      this.data.end_time = item.value
    },
    categoryChanged (item) {
      this.data.category_id = item.value
      this.data.categoryName = item.name
      this.data.categoryColor = item.color
    },
    placeChanged (item) {
      this.data.place_id = item.value
      this.data.placeName = item.name

      this.data.roomId =
      this.data.roomName = ''
      this.$http.post('/sharedcalendarSettingCtl/event/getPlacesByCampusId', {
        data: JSON.stringify({campus_id: item.value})
      }).then((res) => {
        let rooms = []
        forEach(res.data, (i, item) => {
          let tempObj = {
            value: item.id,
            name: item.place_name
          }
          rooms.push(tempObj)
        })
        this.data.rooms = rooms
      })
    },
    roomChanged (item) {
      this.data.roomId = item.value
      this.data.roomName = item.name
    },
    // 关闭Participant弹窗
    closeAddParticipantModal (resData) {
      this.data.showAddParticipantPopup = false
      if (resData && resData.status === 'ok') {
        this.data.participants = this.data.participants.concat(resData.data)
      }
    },
    // 删除Participant
    deleteParticipant (item, index) {
      this.data.participants.splice(index, 1)
    },
    // 关闭弹窗
    closeConfig () {
      this.$emit('closeEventModal')
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
            height: 300px;background: #f5f5f5;border-radius: 2px;position: relative;padding-bottom: 58px;border: 1px solid #ddd;overflow: hidden;
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
  .checkbox input[type=checkbox], .checkbox-inline input[type=checkbox]{display: none;}
  .checkbox label{padding-left: 24px;}
  .checkbox label:before{content: "";position: absolute;width: 20px;height: 20px;margin-left: -24px;background: url('../images/icon_checkbox_unchecked.png') 50% 50% / auto auto no-repeat;}
  .checkbox .checked:before{background: url('../images/icon_checkbox_checked.png') 50% 50% / auto auto no-repeat;}
</style>
