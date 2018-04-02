<template>
  <div class="configuration" :class='{"act": showConfig}'>
    <div class="config_bg" @click='closeConfig()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeConfig()'></span>{{eventType=="new"?"New":"Edit"}} event
        <span v-if="data.requiredFlg" style="color:#f56c6c;font-size:18px;margin-left: 20px;">Please enter the required fields</span>
      </div>
      <div class="content">

        <!-- 选择成员弹窗 -->
        <add-participant-modal :show-popup='data.showAddParticipantPopup'
                               :data-list='data.allParticipants'
                               @closePopup='closeAddParticipantModal'>
        </add-participant-modal>

        <!-- event弹窗 -->
        <div>
          <div class="left" :class="{'request_check': data.check}">
            <div>
              <span class="lab">Title</span>
              <div class="name_value">
                <input class="form-control" type="text" name="" v-model='data.title' :class='{"noInput": !!data.titleRequired}'>
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
                          :input-required='data.categoryRequired'
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
                          :input-required='data.placeRequired'
                          @inputChange='placeChanged'>
                </drapdown>
                <drapdown :input-value='data.roomId'
                          :input-name='data.roomName'
                          :input-select='data.rooms'
                          :input-required='data.placeRequired'
                          @inputChange='roomChanged'>
                </drapdown>
              </div>
            </div>
            <div>
              <span class="lab">Start</span>
              <div class="name_value flex">
                <date-select :input-value='data.start_date'
                             :show-icon='false'
                             :input-required='data.startDateRequired'
                             @dataChange='startDateChange'>
                </date-select>
                <div class="lj_time_select" :class='{"noInput": data.startTimeRequired}'>
                  <el-time-picker v-model="data.start_time"
                                  :picker-options="{ selectableRange: '00:00:00 - 23:59:00' }"
                                  :disabled='data.day_flag'
                                  @change='startTimeChanged'
                                  @focus='timeFocus'
                                  @blur="timeBlur"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  placeholder="Select">
                  </el-time-picker>
                </div>
              </div>
            </div>
            <div>
              <span class="lab">End</span>
              <div class="name_value flex">
                <date-select :input-value='data.end_date'
                             :show-icon='false'
                             :input-required='data.endDateRequired'
                             @dataChange='endDateChange'>
                </date-select>
                <div class="lj_time_select" :class='{"noInput": data.endTimeRequired}'>
                  <el-time-picker v-model="data.end_time"
                                  :picker-options="{ selectableRange: '00:00:00 - 23:59:00' }"
                                  :disabled='data.day_flag'
                                  @change='endTimeChanged'
                                  @focus='timeFocus'
                                  @blur="timeBlur"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  placeholder="Select">
                  </el-time-picker>
                </div>
              </div>
            </div>
            <div>
              <span class="lab">Description</span>
              <div class="name_value">
                <textarea class="form-control textarea" v-model='data.description'></textarea>
              </div>
            </div>
            <div>
              <span class="lab">Attachment</span>
              <div class="name_value" style="background: #f5f5f5;border: 1px solid #ccc;border-radius: 4px;height: 150px;position: relative;">
                <el-upload class="upload-demo"
                          :action="actionUrl"
                          :limit="3"
                          :on-exceed="handleExceed"
                          :before-upload="beforeAvatarUpload"
                          :on-success="handleAvatarSuccess"
                          :on-remove='handleRemove'
                          :file-list="data.fileList">
                  <a class="upload_a" v-show='data.fileList.length < 3'><i class="iconfont iconfont-shangchuan"></i>Upload</a>
                </el-upload>
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
                  <div class="checkbox" v-for='item in data.viewedList' v-if='item.operation_flag==1'>
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

    <alert ref='alert'></alert>

  </div>
</template>

<script>
import drapdown from '@/components/drapdown'
import alert from '@/components/alert'
import dateSelect from '@/components/dateSelect'
import addParticipantModal from '@/components/addParticipantModal'
import {forEach, formatDate, getSStorage} from '@/plugins/util'
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
    drapdown, alert, dateSelect, addParticipantModal
  },
  data () {
    return {
      actionUrl: this.$config.api_path.file_upload,
      data: {
        requiredFlg: false,
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
        viewedList: [],
        fileList: [],
        titleRequired: false,
        categoryRequired: false,
        placeRequired: false,
        startDateRequired: false,
        startTimeRequired: false,
        endDateRequired: false,
        endTimeRequired: false,
        check: false
      },
      copyData: {}
    }
  },
  created () {
    this.data.start_date = this.$moment().format('DD/MM/YYYY')
    this.data.end_date = this.$moment().format('DD/MM/YYYY')

    this.data.start_time =
    this.data.end_time = this.$moment().format('HH:mm')

    let timeList = [];
    let stime = this.$moment('2000-01-01 00:00:00');
    let etime = this.$moment('2000-01-02 00:00:00');
    // 递归构造时间
    let dealFunc = () => {
      if (stime < etime) {
        let formatTime = stime.format('H:mm');
        timeList.push({value: formatTime, name: formatTime})
        stime.add(15, 'm');
        dealFunc();
      }
    }
    dealFunc();
    // console.log(timeList);
    this.data.startTimeList =
    this.data.endTimeList = timeList;
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
            name: item.group_alias_name || item.group_name,
            operation_flag: item.operation_flag
          })
        })
        self.data.viewedList = viewedList

        // TODO设置participants包含groups和users
        let groupList = []
        forEach(resData.groupsList, (i, item) => {
          if (item.operation_flag == 0) return;
          groupList.push({
            id: item.id,
            name: item.group_alias_name || item.group_name,
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

        // 附件
        if (resData.eventInfo && resData.eventInfo.fileEntities) {
          let fileList = [];
          forEach(resData.eventInfo.fileEntities, (i, item) => {
            fileList.push({
              id: item.id,
              name: item.file_name,
              url: this.$config.api_path.img_path + item.file_url
            })
          })
          this.data.fileList = fileList;
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
        if (item.value && item.operation_flag == 1) groupIds.push(item.id)
      })
      // 文件
      let files = [];
      forEach(this.data.fileList, (i, item) => {
        files.push(item.id)
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
        userGroupId: userGroupId.join(','),
        eventFileIds: files
      }
      if (this.eventType === 'new') {
        reqData.createUserId = getSStorage('userinfo').id;
      }

      // console.log(reqData)

      this.data.check = true;
      setTimeout(() => {
        this.data.check = false;
      }, 500)
      // 必填校验
      let passflg = true;
      if (!reqData.title || !reqData.category_id || !reqData.place_id || !reqData.start_date || !reqData.end_date) passflg = false;
      if (!this.data.day_flag && (!reqData.start_time || !reqData.end_time)) passflg = false;

      this.data.titleRequired = !reqData.title;
      this.data.categoryRequired = !reqData.category_id;
      this.data.placeRequired = !reqData.place_id;
      this.data.startDateRequired = !reqData.start_date;
      this.data.endDateRequired = !reqData.end_date;
      this.data.startTimeRequired = !this.data.day_flag && !reqData.start_time;
      this.data.endTimeRequired = !this.data.day_flag && !reqData.end_time;

      if (!passflg) {
        // console.log(this.data.titleRequired, this.data.categoryRequired, this.data.placeRequired, this.data.startDateRequired, this.data.endDateRequired, this.data.startTimeRequired, this.data.endTimeRequired)
        // this.$refs.alert.showDialog('Please fill in the required fields.', true);
        this.data.requiredFlg = true;
        return new Promise((resolve, reject) => {
          resolve({success: false})
        });
      }

      return this.$http.post('sharedcalendarSettingCtl/event/editEvent', {
        data: JSON.stringify(reqData)
      }).then((res) => {
        if (res.success) {
          let result = {
            status: 'ok',
            msg: 'Save Succeeded'
          }
          this.$emit('openBanner', result)
          return res
        }
      })
    },
    // 保存并关闭
    saveAndClose () {
      this.save().then((res) => {
        if (res.success) this.closeConfig()
      })
    },
    // 保存并继续
    saveAndContinue () {
      this.save().then((res) => {
        if (res.success) {
          this.data = JSON.parse(JSON.stringify(this.copyData))
          this.findEvent().then(() => {
            this.getUsers()
          })
        }
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
      let startDate = this.$moment(startDateStr + ' ' + this.data.start_time, 'DD/MM/YYYY HH:mm');
      let endDate = this.$moment(endDateStr + ' ' + this.data.end_time, 'DD/MM/YYYY HH:mm');
      if (startDate > endDate) {
        this.$refs.alert.showDialog('The end time cannot be earlier than the start time', true);
        return false
      }
      return true
    },
    startTimeChanged (value) {
      if (!value) return;
      this.data.end_time = value;
    },
    endTimeChanged (value) {
      if (!value) return;
      if (!this.checkTimeChange(this.data.start_time, value)) {
        this.data.end_time = this.data.start_time;
        return false;
      }
      this.data.end_time = value;
    },
    // 校验开始、结束时间
    checkTimeChange (start, end) {
      let startTime = this.$moment(this.data.start_date + ' ' + start, 'DD/MM/YYYY HH:mm');
      let endTime = this.$moment(this.data.end_date + ' ' + end, 'DD/MM/YYYY HH:mm');
      if (startTime > endTime) {
        this.$refs.alert.showDialog('The end time cannot be earlier than the start time', true);
        return false;
      }
      return true;
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
        for (let i = 0; i < resData.data.length; i++) {
          let item = resData.data[i];
          if (item.type === 'icon_member') continue;
          for (let i2 = 0; i2 < this.data.viewedList.length; i2++) {
            let item2 = this.data.viewedList[i2];
            if (item.id === item2.id) {
              item2.value = true;
              this.checkChange(item2)
              break;
            }
          }
        }
      }
    },
    // 删除Participant
    deleteParticipant (item, index) {
      this.data.participants.splice(index, 1)
    },
    // 图片上传
    handleExceed (files, fileList) {
      this.$refs.alert.showDialog('No More Then 3 Files', true);
    },
    // 上传前校验
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isLt2M) {
        this.$refs.alert.showDialog('The File Size Cannot Exceed 10MB!', true);
      }
      return isLt2M;
    },
    // 上传成功
    handleAvatarSuccess (res, file) {
      if (res.success) {
        this.data.fileList.push({
          id: res.data[0].id,
          name: res.data[0].file_name,
          url: res.data[0].file_url
        })
        // this.$nextTick(() => {
        // })
      } else {
        // this.data.fileList = [{name: file.name, url: '', status: 'error'}]
      }
    },
    // 删除
    handleRemove (file, fileList) {
      // console.log(file, fileList);
      this.data.fileList = fileList;
    },
    // 关闭弹窗
    closeConfig () {
      this.$emit('closeEventModal')
    },
    timeFocus () {
      setTimeout(() => {
        document.getElementsByClassName('el-time-panel__footer')[0].getElementsByClassName('cancel')[0].innerHTML = 'cancel'
        document.getElementsByClassName('el-time-panel__footer')[0].getElementsByClassName('confirm')[0].innerHTML = 'confirm'
        if (document.getElementsByClassName('el-time-panel__footer')[1]) {
          document.getElementsByClassName('el-time-panel__footer')[1].getElementsByClassName('cancel')[0].innerHTML = 'cancel'
          document.getElementsByClassName('el-time-panel__footer')[1].getElementsByClassName('confirm')[0].innerHTML = 'confirm'
        }
      }, 100)
    },
    timeBlur (obj) {
      // if (parseInt(obj.userInput) === 'NaN') return false;
      // let time = parseInt(obj.userInput);
      // if (time > 0 && time < 10) {
      //   time = '0' + time + ':00';
      // } else if (time > 0 && time < 24) {
      //   time = time + ':00';
      // } else if (time === 0 || time === 24) {
      //   time = '00:00';
      // } else {
      //   time = this.$moment().format('HH:mm');
      // }
      // this.data.start_time = this.data.end_time = obj.userInput = time;
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
            .textarea{height: 140px;;}
            .form-control{background: #f5f5f5;}
          }
          .name_value .dropdown{
            flex: 1;
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
            height: 368px;background: #f5f5f5;border-radius: 2px;border: 1px solid #ddd;overflow: auto;
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
  .upload-demo{padding: 10px;}
  .upload-demo .upload_a{}
  .lj_time_select{margin-left: 20px;flex: 1;}
  .el-date-editor.el-input{width: 100%;}
  .form-control.noInput{border: 1px solid #f56c6c;}
</style>
