<template>
  <div class="body" v-cloak>
    <div class="nav_tab flex">
      <div><div @click='()=>{this.tab=1}' :class='{"act": tab==1}'>{{ $t("School years") }}</div></div>
      <div><div @click='()=>{this.tab=2}' :class='{"act": tab==2}'>{{ $t("Places") }}</div></div>
      <div><div @click='()=>{this.tab=3}' :class='{"act": tab==3}'>{{ $t("Categories") }}</div></div>
      <div><div @click='()=>{this.tab=4}' :class='{"act": tab==4}'>{{ $t("Power Users") }}</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <!-- School years -->
        <div class="nav_content_1" v-show='tab==1'>
          <div class="name_box">
            <span class="lab long_text">{{ $t("Name") }}:</span>
            <div class="name_value">

              <drapdown :input-value='schoolYearData.yearId'
                        :input-name='schoolYearData.yearName'
                        :input-select='schoolYearData.years'
                        :input-add='true'
                        :input-item-text='"New School years"'
                        @inputChange='yearChanged'
                        @addItem='addSchoolYear()'>
              </drapdown>

              <span class="icon icon_edit" @click='editYearName()'></span>
              <span class="icon icon_delete" @click='submitSchoolYear(-1)'></span>
            </div>
          </div>
          <div class="name_box">
            <span class="lab long_text">{{ $t("Start date") }}:</span>
            <div class="name_value">

              <date-select :input-value='schoolYearData.startDate'
                           @dataChange='startDateChange'>
              </date-select>

            </div>
          </div>
          <div class="name_box">
            <span class="lab long_text">{{ $t("End date") }}:</span>
            <div class="name_value">

              <date-select :input-value='schoolYearData.endDate'
                           @dataChange='endDateChange'>
              </date-select>

            </div>
          </div>
          <div class="name_box">
            <span class="lab long_text">{{ $t("Define First Week A/B") }}:</span>
            <div class="name_value">

              <drapdown :input-value='schoolYearData.weekName'
                        :input-name='schoolYearData.weekName'
                        :input-color-type='"background"'
                        :input-color='schoolYearData.weekColor'
                        :input-select='schoolYearData.weeks'
                        @inputChange='weekChanged'>
              </drapdown>

            </div>
          </div>
          <div class="member_box">
            <span class="lab long_text">{{ $t("Week to Skip") }}:</span>
            <div class="member_value">
              <div class="li" v-for='(item, index) in schoolYearData.holidays'>
                <span class="icon_H">H</span>
                {{item.name}}
                <span class="action_icon icon_delete" @click='delHoliday(item)'></span>
              </div>
            </div>
          </div>
          <div class="button_box">
            <span class="lab"></span>
            <div class="name_value">
              <button type="button" class="btn btn-primary" @click='()=>{this.showWeekSelectModal=true}'>
                <span class="icon_btn_add"></span> {{ $t("New Hoildays") }}
              </button>

              <week-select-modal :show-popup='showWeekSelectModal'
                                 @closePopup='()=>{this.showWeekSelectModal=false}'
                                 @inputChange='selectWeekChanged'>
              </week-select-modal>

            </div>
          </div>
        </div>
        <!-- Places -->
        <div class="nav_content_1" v-show='tab==2'>
          <div class="name_box">
            <span class="lab">{{ $t("Places") }}:</span>
            <div class="name_value">

              <drapdown :input-value='placesData.value'
                        :input-name='placesData.name'
                        :input-select='placesData.places'
                        :input-add='true'
                        :input-item-text='"New Places"'
                        @addItem='addPlace()'
                        @inputChange='placeChanged'>
              </drapdown>

              <span class="icon icon_edit" @click='editPlace()'></span>
              <span class="icon icon_delete" @click='delPlace()'></span>
            </div>
          </div>
          <div class="member_box">
            <span class="lab">{{ $t("Rooms") }}:</span>
            <div class="member_value">
              <div class="li" v-for='(item, index) in placesData.rooms'>
                {{item.name}}
                <span class="action_icon icon_edit" @click='editPlaceRoom(item)'></span>
                <span class="action_icon icon_delete" @click='delPlaceRoom(item)'></span>
              </div>
            </div>
          </div>
          <div class="button_box">
            <span class="lab"></span>
            <div class="name_value">
              <button type="button" class="btn btn-primary" @click='addPlaceRoom()'>
                <span class="icon_btn_add"></span> {{ $t("New room") }}
              </button>
            </div>
          </div>
        </div>
        <!-- Categories -->
        <div class="nav_content_1" v-show='tab==3'>
          <div class="name_box">
            <span class="lab">{{ $t("Name") }}:</span>
            <div class="name_value">
              <drapdown :input-value='categoryData.name'
                        :input-name='categoryData.name'
                        :input-select='categoryData.nameList'
                        :input-add='true'
                        :input-item-text='"New Categories"'
                        @addItem='addCategory()'
                        @inputChange='categoryChanged'>
              </drapdown>

              <span class="icon icon_edit" @click='editCategory()'></span>
              <span class="icon icon_delete" @click='delCategory()'></span>
            </div>
          </div>
          <div class="name_box">
            <span class="lab">{{ $t("Color") }}:</span>
            <div class="name_value">
              <!-- <drapdown :input-value='categoryData.color'
                        :input-name='""'
                        :input-color-type='"background"'
                        :input-color='categoryData.color'
                        :input-select='categoryData.colorList'
                        @inputChange='editCategoryColor'>
              </drapdown> -->
              <el-color-picker v-model="categoryData.color"
                               :predefine="predefineColors"
                               @change="editCategoryColor">
              </el-color-picker>
            </div>
          </div>
        </div>
        <!-- Power Users -->
        <div class="nav_content" v-show='tab==4'>
          <div class="member_box">
            <span class="lab">{{ $t("Power Users") }}:</span>
            <div class="member_value">
              <div class="li" v-for='(item, index) in data.users'>
                {{item.name}}
                <span class="action_icon icon_delete" @click='removeUser(item, index)'></span>
              </div>
            </div>
          </div>
          <div class="member_box">
            <span class="lab"></span>
            <div class="name_value" style="text-align: right;">
              <button type="button" class="btn btn-primary" @click='openAddParticipantModal()'>
                <i class="iconfont iconfont-jia"></i> {{ $t("New Users") }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <alert ref='alert'></alert>
    <prompt ref='prompt'></prompt>

    <!-- 选择成员弹窗 -->
    <add-participant-modal :show-popup='data.showAddParticipantPopup'
                           :data-list='data.copyAllUsers'
                           @closePopup='closeAddParticipantModal'>
    </add-participant-modal>

  </div>
</template>

<script>
import drapdown from '@/components/drapdown'
import dateSelect from '@/components/dateSelect'
import weekSelectModal from '@/components/weekSelectModal'
import alert from '@/components/alert'
import prompt from '@/components/prompt'
import banner from '@/components/banner'
import addParticipantModal from '@/components/addParticipantModal'
import {forEach, formatDate, monthMap} from '@/script/util'
import {mapMutations} from 'vuex'
export default {
  components: {
    drapdown, dateSelect, weekSelectModal, alert, prompt, banner, addParticipantModal
  },
  data () {
    return {
      tab: 1,
      show: false,
      // School years data
      schoolYearData: {
        yearId: '',
        yearName: '',
        years: [],
        startDate: '2017-10-22',
        endDate: '2017-10-22',
        weekName: 'A',
        weekColor: 'bg_color_10',
        weeks: [
          {value: 'A', name: 'A', color: 'bg_color_10'},
          {value: 'B', name: 'B', color: 'bg_color_11'}
        ],
        holidays: []
      },
      // Places
      placesData: {
        value: '',
        name: '',
        places: [],
        rooms: []
      },
      // Categories
      categoryData: {
        value: '',
        name: '',
        color: '',
        nameList: [],
        colorList: []
      },
      predefineColors: [
        '#DB465F',
        '#B59479',
        '#716DC2',
        '#2C66C2',
        '#47AD56',
        '#687280',
        '#00B3CF',
        '#F2A200',
        '#00CFB0',
        '#4A90E2',
        '#5ACE6D'
      ],
      showWeekSelectModal: false,
      data: {
        users: [],
        showAddParticipantPopup: false,
        allUsers: [],
        copyAllUsers: []
      }
    }
  },
  mounted () {
    this.init().then(() => {
      this.getHoliday()
    })
    this.getUsers().then(() => {
      this.getPowerUsers();
    });
    // !@#$%^&*()_+
    document.getElementsByClassName('el-color-dropdown')[0].style.zoom = 2.1 - Number.parseFloat(document.getElementsByTagName('html')[0].style.zoom, 10);
  },
  methods: {
    ...mapMutations(['SET_HOLIDAY']),
    // 初始化页面数据
    init () {
      let self = this
      let param = '{"event_id": 0}'
      return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', {
        data: param
      }).then((res) => {
        let resData = res.data
        self.placesList = []

        let placesList = []
        forEach(resData.campusList, (i, item) => {
          if (i === '0') {
            self.placesData.value = item.id
            self.placesData.name = item.campus_name
            self.getRoomsById(item.id)
          }
          let obj = {
            value: item.id,
            name: item.campus_name
          }
          placesList.push(obj)
        })
        this.placesData.places = placesList
        let categoryList = []
        forEach(resData.categoryList, (i, item) => {
          if (i === '0') {
            this.categoryData.value = item.id
            this.categoryData.name = item.category_no
            this.categoryData.color = item.category_remark
          }
          let data = resData.categoryList[i]
          let obj = {
            value: data.id,
            name: data.category_no,
            color: data.category_remark
          }
          categoryList.push(obj)
        })
        this.categoryData.nameList = categoryList
        // 颜色列表
        // let colorList = [];
        // for (let i = 1; i <= 11; i++) {
        //   let color = {
        //     value: 'bg_color_' + i,
        //     name: '',
        //     color: 'bg_color_' + i
        //   }
        //   colorList.push(color)
        // }
        // this.categoryData.colorList = colorList
        let schoolYearList = []
        forEach(resData.schoolYearList, (i, item) => {
          if (i === '0') {
            self.schoolYearData.yearId = item.id
            self.schoolYearData.yearName = item.year_label
            self.schoolYearData.startDate = item.start_date
            self.schoolYearData.endDate = item.end_date
            self.schoolYearData.weekName = item.week_flag
            self.schoolYearData.weekColor = item.week_flag === 'A' ? 'bg_color_10' : 'bg_color_11'
          }
          let obj = {
            value: item.id,
            name: item.year_label,
            startDate: item.start_date,
            endDate: item.end_date,
            weekName: item.week_flag
          }
          schoolYearList.push(obj)
        })
        this.schoolYearData.years = schoolYearList

        return res
      })
    },
    // School years functions
    yearChanged (item) {
      this.schoolYearData.yearId = item.value
      this.schoolYearData.yearName = item.name
      this.schoolYearData.startDate = item.startDate
      this.schoolYearData.endDate = item.endDate
      this.schoolYearData.weekName = item.weekName
      this.schoolYearData.weekColor = item.weekName === 'A' ? 'bg_color_10' : 'bg_color_11'

      this.getHoliday()
    },
    startDateChange (calendarList, thisDateInfo, actDateInfo) {
      this.schoolYearData.startDate = formatDate([actDateInfo.thisYear, actDateInfo.thisMonth, actDateInfo.thisDate].join('-'), 'yyyy-mm-dd')
      this.submitSchoolYear(0)
    },
    endDateChange (calendarList, thisDateInfo, actDateInfo) {
      this.schoolYearData.endDate = formatDate([actDateInfo.thisYear, actDateInfo.thisMonth, actDateInfo.thisDate].join('-'), 'yyyy-mm-dd')
      this.submitSchoolYear(0)
    },
    weekChanged (item) {
      this.schoolYearData.weekName = item.name
      this.schoolYearData.weekColor = item.color
      this.submitSchoolYear(0)
    },
    addSchoolYear () {
      this.$refs.prompt.showDialog().then((text) => {
        this.schoolYearData.yearId = 0
        this.schoolYearData.yearName = text

        this.submitSchoolYear(1)
      })
    },
    editYearName () {
      this.$refs.prompt.showDialog(this.schoolYearData.yearName).then((text) => {
        this.schoolYearData.yearName = text

        this.submitSchoolYear(0)
      })
    },
    submitSchoolYear (opt) {
      // opt: -1 删除 0 修改 1 新增
      let _submit = () => {
        let param = {
          'id': this.schoolYearData.yearId,
          'year_label': this.schoolYearData.yearName,
          'start_date': formatDate(this.schoolYearData.startDate, 'yyyy-mm-dd'),
          'end_date': formatDate(this.schoolYearData.endDate, 'yyyy-mm-dd'),
          'week_flag': this.schoolYearData.weekName,
          'operation_flag': opt === 1 ? 0 : opt
        }
        return this.$http.post('/sharedcalendarSettingCtl/event/editSchoolYear', {
          data: JSON.stringify(param)
        }).then((res) => {
          if (res.success) {
            let banner = {
              status: 'SUCCESS',
              msg: 'Succeeded!'
            }
            this.$emit('openBanner', banner);
            return res;
          }
        })
      }
      if (opt === -1) {
        this.$refs.alert.showDialog().then(() => {
          _submit().then(() => {
            this.init();
          })
        })
      } else {
        _submit().then(() => {
          if (opt === 1) this.init();
        })
      }
    },
    getHoliday () {
      this.$http.post('/sharedcalendarSettingCtl/event/getHoildayByYearId', {
        data: JSON.stringify({schoolyear_id: this.schoolYearData.yearId})
      }).then((res) => {
        let holidays = []
        forEach(res.data, (i, item) => {
          let tempObj = {
            value: item.id,
            start_date: item.start_date,
            end_date: item.end_date,
            name: this.formatHolidayDate(item.start_date) + '-' + this.formatHolidayDate(item.end_date)
          }
          holidays.push(tempObj)
        })

        this.schoolYearData.holidays = holidays
      })
    },
    selectWeekChanged (weekList) {
      this.addHoliday(weekList)
      this.showWeekSelectModal = false
    },
    addHoliday (weekList) {
      if (this.schoolYearData.yearId === '') return false
      let start = weekList[0]
      let end = weekList[6]

      let params = {
        schoolyear_id: this.schoolYearData.yearId,
        start_date: formatDate([start.yearValue, start.monthValue, start.day].join('-'), 'yyyy-mm-dd'),
        end_date: formatDate([end.yearValue, end.monthValue, end.day].join('-'), 'yyyy-mm-dd'),
        operation_flag: 0
      }
      this.$http.post('/sharedcalendarSettingCtl/event/editSchoolYearHoilday', {
        data: JSON.stringify(params)
      }).then((res) => {
        if (res.success) {
          this.getHoliday()
          this.resetHoliday();
        }
      })
    },
    delHoliday (item) {
      if (this.schoolYearData.yearId === '') return false
      this.$refs.alert.showDialog().then(() => {
        let params = {
          schoolyear_id: this.schoolYearData.yearId,
          id: item.value,
          operation_flag: 1
        }
        this.$http.post('/sharedcalendarSettingCtl/event/editSchoolYearHoilday', {
          data: JSON.stringify(params)
        }).then((res) => {
          if (res.success) {
            this.getHoliday()
            this.resetHoliday();
          }
        })
      })
    },
    formatHolidayDate (date) {
      let d = this.$moment(date)
      return d.date() + '.' + monthMap[d.month() + 1].substr(0, 3) + ',' + d.year();
    },
    // 重新给vuex中的holidays赋值
    resetHoliday () {
      let params = {event_id: 0};
      return this.$http.post('/sharedcalendarSettingCtl/event/initDatas', params).then((res) => {
        let holidayList = [];
        forEach(res.data.schoolYearList, (i, item) => {
          if (item.hoildayList) holidayList = holidayList.concat(item.hoildayList)
        })
        this.SET_HOLIDAY(holidayList)
        return res;
      })
    },
    // places functions
    // Place切换事件
    placeChanged (item) {
      this.placesData.value = item.value
      this.placesData.name = item.name
      this.getRoomsById(item.value)
    },
    // 添加Place
    addPlace () {
      this.$refs.prompt.showDialog().then((text) => {
        this.placesData.value = 0
        this.placesData.name = text

        return this.submitPlace(0);
      }).then((ret) => {
        this.init();
      })
    },
    // 修改Place
    editPlace () {
      this.$refs.prompt.showDialog(this.placesData.name).then((text) => {
        this.placesData.name = text

        return this.submitPlace(0).then((res) => {
          if (res.result === 'SUCCESS') {
            for (let i = 0; i < this.placesData.places.length; i++) {
              let item = this.placesData.places[i];
              if (item.value === this.placesData.value) {
                item.name = this.placesData.name;
                break;
              }
            }
          }
        })
      })
    },
    delPlace () {
      this.$refs.alert.showDialog().then(() => {
        return this.submitPlace(-1)
      }).then((ret) => {
        this.init();
      })
    },
    // 提交Place表单
    submitPlace (opt) {
      // opt: -1 删除 0 修改/新增
      let param = {
        'id': this.placesData.value,
        'campus_name': this.placesData.name,
        'address': this.placesData.name,
        'operation_flag': opt
      }
      return this.$http.post('/sharedcalendarSettingCtl/event/editCampus', {
        data: JSON.stringify(param)
      }).then((res) => {
        let banner = {};
        if (res.success) {
          banner = {
            status: 'SUCCESS',
            msg: 'Succeeded!'
          }
        } else {
          banner = {
            status: 'FAIL',
            msg: res.msg
          }
        }
        this.$emit('openBanner', banner);
        return res;
      })
    },
    // 通过Place ID查询rooms
    getRoomsById (id) {
      let param = JSON.stringify({campus_id: id})
      this.$http.post('/sharedcalendarSettingCtl/event/getPlacesByCampusId', {
        data: param
      }).then((res) => {
        let resData = res.data
        let objList = []
        forEach(resData, (i, item) => {
          let obj = {
            value: item.id,
            name: item.place_name
          }
          objList.push(obj)
        })
        this.placesData.rooms = objList
      })
    },
    // 添加room
    addPlaceRoom () {
      this.$refs.prompt.showDialog().then((text) => {
        let item = {
          value: 0,
          name: text
        }
        return this.submitPlaceRoom(item, 0)
      }).then(() => {
        this.getRoomsById(this.placesData.value)
      })
    },
    // 编辑room
    editPlaceRoom (item) {
      this.$refs.prompt.showDialog(item.name).then((text) => {
        item.name = text;
        return this.submitPlaceRoom(item, 0)
      })
    },
    // 删除room
    delPlaceRoom (item) {
      this.$refs.alert.showDialog('Confirm the deletion?').then(() => {
        return this.submitPlaceRoom(item, -1)
      }).then(() => {
        this.getRoomsById(this.placesData.value)
      })
    },
    // 提交room表单
    submitPlaceRoom (item, opt) {
      // opt: -1 删除 0 修改/新增
      let param = {
        'campus_id': this.placesData.value,
        'place_name': item.name,
        'operation_flag': opt,
        'id': item.value
      }

      return this.$http.post('/sharedcalendarSettingCtl/event/editPlaces', {
        data: JSON.stringify(param)
      }).then((res) => {
        let banner = {};
        if (res.success) {
          banner = {
            status: 'SUCCESS',
            msg: 'Succeeded!'
          }
        } else {
          banner = {
            status: 'FAIL',
            msg: res.msg
          }
        }
        this.$emit('openBanner', banner);
        return res;
      })
    },
    // categories functions
    categoryChanged (item) {
      this.categoryData.value = item.value
      this.categoryData.name = item.name
      this.categoryData.color = item.color
    },
    addCategory () {
      this.$refs.prompt.showDialog().then((text) => {
        this.categoryData.value = 0
        this.categoryData.name = text
        this.categoryData.color = '#ff0000'

        this.submitCategory(0)
      })
    },
    editCategory () {
      this.$refs.prompt.showDialog(this.categoryData.name).then((text) => {
        this.categoryData.name = text

        this.submitCategory(0)
      })
    },
    editCategoryColor (item) {
      if (!item) {
        this.categoryData.color = '#ff0000';
        return false;
      }
      this.categoryData.color = item;
      for (let i = 0; i < this.categoryData.nameList.length; i++) {
        if (this.categoryData.nameList[i].value === this.categoryData.value) {
          this.categoryData.nameList[i].color = item;
          break;
        }
      }

      this.submitCategory(0)
    },
    delCategory () {
      this.$refs.alert.showDialog('Confirm the deletion?').then(() => {
        this.submitCategory(-1)
      })
    },
    submitCategory (opt) {
      let param = {
        'id': this.categoryData.value,
        'category_no': this.categoryData.name,
        'category_remark': this.categoryData.color,
        'operation_flag': opt
      }
      this.$http.post('/sharedcalendarSettingCtl/event/editCategory', {
        data: JSON.stringify(param)
      }).then((res) => {
        if (res.success) {
          let banner = {
            status: 'SUCCESS',
            msg: 'Succeeded!'
          }
          this.$emit('openBanner', banner);
          if (this.categoryData.value === 0 || opt === -1) {
            this.init()
          }
        } else {
          let banner = {
            status: 'FAIL',
            msg: res.msg
          }
          this.$emit('openBanner', banner);
        }
      })
    },
    // Power Users functions
    removeUser (user, index) {
      for (let i = 0; i < this.data.allUsers.length; i++) {
        let item = this.data.allUsers[i];
        if (item.id === user.id) {
          item.selected = false;
          this.data.users.splice(index, 1);
          this.editPowerUsers(0, [item])
          break;
        }
      }
    },
    // 开启Participant弹窗
    openAddParticipantModal () {
      this.data.copyAllUsers = JSON.parse(JSON.stringify(this.data.allUsers));
      this.data.showAddParticipantPopup = true;
    },
    // 关闭Participant弹窗
    closeAddParticipantModal (resData) {
      this.data.showAddParticipantPopup = false;
      if (resData && resData.status === 'ok') {
        this.data.allUsers = this.data.copyAllUsers;
        this.data.users = this.data.users.concat(resData.data);
        this.editPowerUsers(1, resData.data);
      }
    },
    // 获取所有用户
    getUsers () {
      // console.log(1);
      let self = this;
      return this.$http.post('/sharedcalendarSettingCtl/event/getGroupsOrUsers', {
        data: {flag: 1}
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
        self.data.allUsers = userList;
        return res
      })
    },
    // 获取所有Power Users
    getPowerUsers () {
      // type:页面类型 0-toolbar 1-calendar
      return this.$http.post('/sharedcalendarSettingCtl/event/findPowerUser', {
        data: {type: 1}
      }).then((res) => {
        let userIdList = res.data.length && res.data;
        let users = [];
        for (let i = 0; i < userIdList.length; i++) {
          let item = userIdList[i];
          for (let i2 = 0; i2 < this.data.allUsers.length; i2++) {
            let item2 = this.data.allUsers[i2];
            if (item.id === item2.id) {
              users.push(item2);
              break;
            }
          }
        }
        this.data.users = users;
      })
    },
    // 修改Power Users
    editPowerUsers (flagValue, users) {
      let postData = [];
      for (let i = 0; i < users.length; i++) {
        postData.push(users[i].id);
      }
      // type:页面类型 0-toolbar 1-calendar
      // flag_value:0-删除 1-新增
      return this.$http.post('/sharedcalendarSettingCtl/event/editPowerUser', {
        data: { userIdList: postData, type: 1, flag_value: flagValue }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  @import '../styles/components/slotCalendar'
</style>
