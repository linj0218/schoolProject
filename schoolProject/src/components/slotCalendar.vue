<template>
  <div class="body" v-cloak>
    <div class="nav_tab flex">
      <div v-if='false'><div @click='()=>{this.tab=0}' :class='{"act": tab==0}'>Groups</div></div>
      <div><div @click='()=>{this.tab=1}' :class='{"act": tab==1}'>School years</div></div>
      <div><div @click='()=>{this.tab=2}' :class='{"act": tab==2}'>Places</div></div>
      <div><div @click='()=>{this.tab=3}' :class='{"act": tab==3}'>Categories</div></div>
    </div>
    <div class="nav_body">
      <div class="_body">
        <!-- Groups -->
        <div class="nav_content_1" v-show='tab==0' style="padding: 0;text-align: left;display: none;">
          <el-table ref="groups"
                    :data="groupsData.groupList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="">
            </el-table-column>
            <el-table-column prop="group_name"
                             label="Ad group"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="group_alias_name"
                             label="Alias"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label=""
                             width="140">
              <template slot-scope="scope">
                <span class="icon icon_edit" @click='editGroupAlias(scope.$index, scope.row)'></span>
              </template>
            </el-table-column>
            <el-table-column label="Active"
                             width="80">
              <template slot-scope="scope">
                <div class="checkbox"
                     :class='{"checked": scope.row.operation_flag==1}'
                     @click='groupStatusChanged(scope.$index, scope.row)'></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- School years -->
        <div class="nav_content_1" v-show='tab==1'>
          <div class="name_box">
            <span class="lab long_text">Name:</span>
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
            <span class="lab long_text">Start date:</span>
            <div class="name_value">

              <date-select :input-value='schoolYearData.startDate'
                           @dataChange='startDateChange'>
              </date-select>

            </div>
          </div>
          <div class="name_box">
            <span class="lab long_text">End date:</span>
            <div class="name_value">

              <date-select :input-value='schoolYearData.endDate'
                           @dataChange='endDateChange'>
              </date-select>

            </div>
          </div>
          <div class="name_box">
            <span class="lab long_text">Define First Week A/B:</span>
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
            <span class="lab long_text">Week to Skip:</span>
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
                <span class="icon_btn_add"></span> New Hoildays
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
            <span class="lab">Name:</span>
            <div class="name_value">

              <drapdown :input-value='placesData.name'
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
            <span class="lab">Room/Places:</span>
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
                <span class="icon_btn_add"></span> New room
              </button>
            </div>
          </div>
        </div>
        <!-- Categories -->
        <div class="nav_content_1" v-show='tab==3'>
          <div class="name_box">
            <span class="lab">Name:</span>
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
            <span class="lab">Color:</span>
            <div class="name_value">
              <drapdown :input-value='categoryData.color'
                        :input-name='""'
                        :input-color-type='"background"'
                        :input-color='categoryData.color'
                        :input-select='categoryData.colorList'
                        @inputChange='editCategoryColor'>
              </drapdown>
            </div>
          </div>
        </div>
      </div>

    </div>

    <alert ref='alert'></alert>
    <prompt ref='prompt'></prompt>

  </div>
</template>

<script>
import drapdown from '@/components/drapdown'
import dateSelect from '@/components/dateSelect'
import weekSelectModal from '@/components/weekSelectModal'
import alert from '@/components/alert'
import prompt from '@/components/prompt'
import banner from '@/components/banner'
import {forEach, formatDate, monthMap} from '@/plugins/util'
import {mapMutations} from 'vuex'
export default {
  components: {
    drapdown, dateSelect, weekSelectModal, alert, prompt, banner
  },
  data () {
    return {
      tab: 1,
      show: false,
      // Groups data
      groupsData: {
        groupList: [],
        names: [],
        membersList: []
      },
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
      showWeekSelectModal: false
    }
  },
  mounted () {
    this.init().then(() => {
      this.getHoliday()
    })
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

        this.groupsData.groupList = resData.groupsList
        let placesList = []
        forEach(resData.campusList, (i, item) => {
          if (i === '0') {
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
        let colorList = []
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
          let color = {
            value: data.category_remark,
            name: '',
            color: data.category_remark
          }
          categoryList.push(obj)
          colorList.push(color)
        })
        this.categoryData.nameList = categoryList
        this.categoryData.colorList = colorList
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
    findUsersByGroupId (id) {
      let param = JSON.stringify({group_id: id})
      this.$http.post('/sharedcalendarSettingCtl/event/getUsersByGroupId', {
        data: param
      }).then((res) => {
        let resData = res.data
        let objList = []
        forEach(resData, (i, item) => {
          let obj = {
            value: item.id,
            name: item.nom,
            type: 'icon_member'
          }
          objList.push(obj)
        })
        this.groupsData.membersList = objList
      })
    },
    closeConfig () {
      this.show = false;
      this.$emit('close');
    },
    // groups functions
    // 修改group别名
    editGroupAlias (index, row) {
      this.$refs.prompt.showDialog(row.group_alias_name).then((text) => {
        row.group_alias_name = text;
        this.submitGroup(row)
      })
    },
    // group状态修改
    groupStatusChanged (index, row) {
      row.operation_flag = row.operation_flag === 1 ? 0 : 1;
      this.submitGroup(row)
    },
    // 提交groups表单
    submitGroup (row) {
      // console.log(row)
      let param = {
        'id': row.id,
        'group_name': row.group_name,
        'operation_flag': row.operation_flag,
        'group_alias_name': row.group_alias_name
      }
      return this.$http.post('/sharedcalendarSettingCtl/event/editGroups', {
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

        return this.submitPlace(0)
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
      this.categoryData.color = item.value

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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';
  .body{position: relative;height: 100%;overflow: hidden;}
  .nav_tab{height: 100px;border-bottom: 1px solid #eee;position: absolute;width: 100%;}
  .nav_tab > div{padding: 34px 0;text-align: center;display: inline-block;margin: 0 20px;}
  .nav_tab > div > div{height: 32px;display: inline-block;border-bottom: 4px solid #fff;font-size: 20px;color: #ccc;line-height: 20px;cursor: pointer;}
  .nav_tab > div > div.act{border-bottom: 4px solid #4F81BE;color: #333;}
  .nav_body{
    padding-top: 100px;height: 100%;overflow: hidden;
    ._body{border-radius: 2px;height: 100%;overflow: auto;}
    .nav_content_1{
      padding: 26px 0;
      .name_box{margin-top: 14px;}
      .lab{font-size: 18px;color: #999;vertical-align: top;display: inline-block;width: 120px;text-align: right;margin-right: 10px;line-height: 34px;}
      .lab.long_text{width: 185px;}
      .name_value{display: inline-block;width: 350px;position: relative;}
      .name_value > .icon{position: absolute;width: 22px;height: 22px;right: 35px;top: 50%;transform: translateY(-50%);cursor: pointer;}
      .name_value > .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;right: 65px;}
      .name_value > .icon.icon_delete{background: url('../images/icon_delete.png') 0 0 / 100% 100% no-repeat;}
      .member_box{margin-top: 14px;}
      .member_value{
        display: inline-block;width: 350px;min-height: 293px;background: #fff;border: 1px solid #ddd;border-radius: 2px;text-align: left;overflow-y: auto;overflow-x: hidden;
        .li{
          position: relative;line-height: 42px;padding: 0 16px;color: #333;
          .icon_H{width: 30px;height: 30px;background: #F4A222;font-size: 16px;color: #fff;display: inline-block;vertical-align: middle;line-height: 30px;text-align: center;border-radius: 2px;margin-right: 10px;}
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
      }
      table .icon{position: absolute;width: 22px;height: 22px;left: 0;top: 50%;transform: translateY(-50%);cursor: pointer;}
      table .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;}
      .button_box .name_value{text-align: right;margin-top: 14px;margin-bottom: 26px;}
      table .checkbox{width: 20px;height: 20px;background: url('../images/icon_checkbox_unchecked.png') 50% 50%/auto auto no-repeat;cursor: pointer;}
      table .checkbox.checked{background: url('../images/icon_checkbox_checked.png') 50% 50% / auto auto no-repeat;}
    }
    .nav_content_1_btn{
      text-align: center;
      .btn{width: 150px;margin-top: 50px;}
      .cancel{background: #ccc;color: #fff;}
    }
  }
</style>
