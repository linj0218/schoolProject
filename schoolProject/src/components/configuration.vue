<template>
  <div class="configuration" :class='{"act": showConfig}'>
    <div class="config_bg" @click='closeConfig()'></div>
    <div class="config_body">
      <div class="title">
        <span class="icon_back" @click='closeConfig()'></span>Configuration
      </div>
      <div class="content">
        <div class="nav_tab flex">
          <div><div @click='()=>{this.tab=0}' :class='{"act": tab==0}'>Groups</div></div>
          <div><div @click='()=>{this.tab=1}' :class='{"act": tab==1}'>School years</div></div>
          <div><div @click='()=>{this.tab=2}' :class='{"act": tab==2}'>Places</div></div>
          <div><div @click='()=>{this.tab=3}' :class='{"act": tab==3}'>Categories</div></div>
        </div>
        <div class="nav_body">
          <div class="body">
            <!-- Groups -->
            <div class="nav_content_1" v-show='tab==0'>
              <div class="name_box">
                <span class="lab">Name:</span>
                <div class="name_value">

                  <drapdown :input-value='groupsData.name'
                            :input-name='groupsData.name'
                            :input-select='groupsData.names'
                            :input-add='true'
                            :input-item-text='"New Groups"'
                            @addItem='showConfirm(addGroup)'
                            @inputChange='groupsChanged'>
                  </drapdown>
                  
                  <span class="icon icon_edit" @click='showConfirm(groupsNameChanged, groupsData.name)'></span>
                </div>
              </div>
              <div class="member_box">
                <span class="lab">Members:</span>
                <div class="member_value">
                  <div class="li" v-for='(item, index) in groupsData.membersList'>
                    <span class="icon" :class='item.type'></span>
                    {{item.name}}
                    <span class="action_icon icon_delete" @click='delMember(index)'></span>
                  </div>
                </div>
              </div>
              <div class="button_box">
                <span class="lab"></span>
                <div class="name_value">
                  <button type="button" class="btn btn-primary" @click='()=>{this.groupsData.showAddParticipantPopup=true}'>
                    <span class="icon_btn_add"></span> Members/Groups
                  </button>

                  <add-participant-modal :showPopup='groupsData.showAddParticipantPopup'
                                         @closePopup='()=>{this.groupsData.showAddParticipantPopup=false}'>
                  </add-participant-modal>

                </div>
              </div>
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
                            @addItem='showConfirm()'>
                  </drapdown>

                  <span class="icon icon_edit" @click='showConfirm(yearNameChanged, schoolYearData.yearName)'></span>
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

                  <drapdown :input-value='schoolYearData.weekId'
                            :input-name='schoolYearData.weekName'
                            :input-color-type='"background"'
                            :input-color='schoolYearData.weekColor'
                            :input-select='schoolYearData.weeks'
                            @inputChange='weekChanged'>
                  </drapdown>

                </div>
              </div>
              <div class="member_box">
                <span class="lab long_text">Hoilday（week）:</span>
                <div class="member_value">
                  <div class="li" v-for='(item, index) in schoolYearData.holidays'>
                    {{item.name}}
                    <span class="action_icon icon_delete" @click='delHoliday(index)'></span>
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
                                     :input-value='"2017-10-22"'
                                     @closePopup='()=>{this.showWeekSelectModal=false}'>
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
                            @addItem='showConfirm()'
                            @inputChange='placeChanged'>
                  </drapdown>

                  <span class="icon icon_edit" @click='showConfirm(placeNameChanged, placesData.name)'></span>
                </div>
              </div>
              <div class="member_box">
                <span class="lab">Room/Places:</span>
                <div class="member_value">
                  <div class="li" v-for='(item, index) in placesData.rooms'>
                    {{item.name}}
                    <span class="action_icon icon_edit" @click='showConfirm()'></span>
                    <span class="action_icon icon_delete" @click='deleteRoom(index)'></span>
                  </div>
                </div>
              </div>
              <div class="button_box">
                <span class="lab"></span>
                <div class="name_value">
                  <button type="button" class="btn btn-primary" @click='showConfirm()'>
                    <span class="icon_btn_add"></span> New places
                  </button>
                </div>
              </div>
            </div>
            <!-- Categories -->
            <div class="nav_content_1" v-show='tab==3'>
              <div class="name_box">
                <span class="lab">Name:</span>
                <div class="name_value">
                  <drapdown :input-value='categoriesData.name'
                            :input-name='categoriesData.name'
                            :input-select='categoriesData.nameList'
                            :input-add='true'
                            :input-item-text='"New Categories"'
                            @addItem='showConfirm()'
                            @inputChange='categoriesChanged'>
                  </drapdown>

                  <span class="icon icon_edit" @click='showConfirm(categoriesNameChanged, categoriesData.name)'></span>
                </div>
              </div>
              <div class="name_box">
                <span class="lab">Color:</span>
                <div class="name_value">
                  <drapdown :input-value='categoriesData.color'
                            :input-name='""'
                            :input-color-type='"background"'
                            :input-color='categoriesData.color'
                            :input-select='categoriesData.colorList'
                            @inputChange='categoriesColorChanged'>
                  </drapdown>
                </div>
              </div>
            </div>

            <confirm-modal :show-popup='textInput.showInputPopup'
                           :input-value='textInput.inputValue'
                           :input-method='textInput.inputMethod'
                           @closePopup='closeTextInput'>
            </confirm-modal>

          </div>

          <div v-show='tab==0' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="submitGroupsAndMember(0)">Save</button>
            <button type="button" class="btn btn-danger" @click="submitGroupsAndMember(-1)">Delete</button>
          </div>
          <div v-show='tab==1' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="submitSchoolYear(0)">Save</button>
            <button type="button" class="btn btn-danger" @click="submitSchoolYear(-1)">Delete</button>
          </div>
          <div v-show='tab==2' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="submitPlaceAndRooms(0)">Save</button>
            <button type="button" class="btn btn-danger" @click="submitPlaceAndRooms(-1)">Delete</button>
          </div>
          <div v-show='tab==3' class="nav_content_1_btn">
            <button type="button" class="btn btn-primary" @click="submitCategory(0)">Save</button>
            <button type="button" class="btn btn-danger" @click="submitCategory(-1)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drapdown from '@/components/drapdown'
import dateSelect from '@/components/dateSelect'
import confirmModal from '@/components/confirmModal'
import addParticipantModal from '@/components/addParticipantModal'
import weekSelectModal from '@/components/weekSelectModal'
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
    drapdown, dateSelect, confirmModal, addParticipantModal, weekSelectModal
  },
  data () {
    return {
      tab: 0,
      // Groups data
      groupsData: {
        name: '',
        names: [],
        membersList: [],
        showAddParticipantPopup: false
      },
      // School years data
      schoolYearData: {
        yearId: '1',
        yearName: '2017-2018 school years',
        years: [
          {value: '1', name: '2017-2018 school years'},
          {value: '2', name: '2018-2019 school years'},
          {value: '3', name: '2019-2020 school years'}
        ],
        startDate: '2017-10-22',
        endDate: '2017-10-23',
        weekId: '1',
        weekName: 'A',
        weekColor: 'bg_color_10',
        weeks: [
          {value: '1', name: 'A', color: 'bg_color_10'},
          {value: '2', name: 'B', color: 'bg_color_11'}
        ],
        holidays: [
          {value: '1', name: '1.Oct,2017 - 8.Oct,2017'},
          {value: '2', name: '25.Dec,2017 - 3.Jan,2018'},
          {value: '3', name: '25.Dec,2017 - 3.Jan,2018'}
        ]
      },
      // Places
      placesData: {
        name: '',
        places: [],
        rooms: []
      },
      // Categories
      categoriesData: {
        name: '',
        nameList: [],
        color: '',
        colorList: []
      },
      textInput: {
        showInputPopup: false,
        inputValue: '',
        inputMethod: ''
      },
      showWeekSelectModal: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let self = this
      let param = '{"event_id": 0}'
      this.$http.post('/sharedcalendarSettingCtl/event/initDatas', {
        data: param
      }).then((res) => {
        let resData = res.data
        self.placesList = []
        let objList = []
        forEach(resData.groupsList, (i, item) => {
          let data = resData.groupsList[i]
          let obj = {
            value: data.id,
            name: data.group_name
          }
          objList.push(obj)
        })
        this.groupsData.names = objList
        let placesList = []
        forEach(resData.placesList, (i, item) => {
          let data = resData.placesList[i]
          let obj = {
            value: data.id,
            name: data.place_name
          }
          placesList.push(obj)
        })
        this.placesData.places = placesList
        let categoryList = []
        let colorList = []
        forEach(resData.categoryList, (i, item) => {
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
        this.categoriesData.nameList = categoryList
        this.categoriesData.colorList = colorList
        let schoolYearList = []
        forEach(resData.schoolYearList, (i, item) => {
          let data = resData.schoolYearList[i]
          let obj = {
            value: data.id,
            name: data.year_label,
            startDate: data.start_date,
            endDate: data.end_date,
            weekName: data.week_flag
          }
          schoolYearList.push(obj)
        })
        this.schoolYearData.years = schoolYearList
      })
    },
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
      this.$emit('configurationToggleFunc')
    },
    groupsChanged (item) {
      this.groupsData.value = item.value
      this.groupsData.name = item.name
      this.findUsersByGroupId(item.value)
    },
    delMember (index) {
      this.groupsData.membersList.splice(index, 1)
    },
    yearChanged (item) {
      this.schoolYearData.yearId = item.value
      this.schoolYearData.yearName = item.name
      this.schoolYearData.startDate = item.startDate
      this.schoolYearData.endDate = item.endDate
      this.schoolYearData.weekName = item.weekName
    },
    weekChanged (item) {
      this.schoolYearData.weekId = item.value
      this.schoolYearData.weekName = item.name
      this.schoolYearData.weekColor = item.color
    },
    delHoliday (index) {
      this.schoolYearData.holidays.splice(index, 1)
    },
    placeChanged (item) {
      this.placesData.value = item.value
      this.placesData.name = item.name
      this.getRoomsById(item.value)
    },
    startDateChange (calendarList, thisDateInfo, actDateInfo) {
      // console.log(calendarList, thisDateInfo, actDateInfo)
      this.schoolYearData.startDate = actDateInfo.thisYear + '-' + actDateInfo.thisMonth + '-' + actDateInfo.thisDate
    },
    endDateChange (calendarList, thisDateInfo, actDateInfo) {
      // console.log(calendarList, thisDateInfo, actDateInfo)
      this.schoolYearData.endDate = actDateInfo.thisYear + '-' + actDateInfo.thisMonth + '-' + actDateInfo.thisDate
    },
    deleteRoom (index) {
      this.placesData.rooms.splice(index, 1)
    },
    categoriesChanged (item) {
      this.categoriesData.value = item.value
      this.categoriesData.name = item.name
      this.categoriesData.color = item.color
    },
    categoriesColorChanged (item) {
      this.categoriesData.color = item.value
    },
    // 编辑文本 --------------------------------------------------------------------
    showConfirm (method, text) {
      this.textInput.inputValue = text || ''
      this.textInput.inputMethod = method || ''

      this.textInput.showInputPopup = true
    },
    closeTextInput () {
      this.textInput.showInputPopup = false
    },
    groupsNameChanged (str) {
      this.groupsData.name = str
    },
    yearNameChanged (str) {
      this.schoolYearData.yearName = str
    },
    placeNameChanged (str) {
      this.placesData.name = str
    },
    categoriesNameChanged (str) {
      this.categoriesData.name = str
    },
    addGroup (str) {
      console.log(str)
    },
    submitGroupsAndMember (opt) {
      let param = JSON.stringify({'id': this.groupsData.value, 'group_name': this.groupsData.name, 'operation_flag': opt})
      this.$http.post('/sharedcalendarSettingCtl/event/editGroups', {
        data: param
      }).then((res) => {
        if (res.success) {
          alert('SUCCESS!')
        }
      })
    },
    submitSchoolYear (opt) {
      let param = JSON.stringify({'id': this.schoolYearData.yearId, 'year_label': this.schoolYearData.yearName, 'start_date': this.schoolYearData.startDate, 'end_date': this.schoolYearData.endDate, 'week_flag': this.schoolYearData.weekName, 'operation_flag': opt})
      this.$http.post('/sharedcalendarSettingCtl/event/editSchoolYear', {
        data: param
      }).then((res) => {
        if (res.success) {
          alert('SUCCESS!')
        }
      })
    },
    submitPlaceAndRooms (opt) {
      let param = JSON.stringify({'id': this.placesData.value, 'place_name': this.placesData.name, 'operation_flag': opt})
      this.$http.post('/sharedcalendarSettingCtl/event/editPlaces', {
        data: param
      }).then((res) => {
        if (res.success) {
          alert('SUCCESS!')
        }
      })
    },
    submitCategory (opt) {
      let param = JSON.stringify({'id': this.categoriesData.value, 'category_no': this.categoriesData.name, 'category_remark': this.categoriesData.color, 'operation_flag': opt})
      this.$http.post('/sharedcalendarSettingCtl/event/editCategory', {
        data: param
      }).then((res) => {
        if (res.success) {
          alert('SUCCESS!')
        }
      })
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
        .nav_tab{height: 100px;}
        .nav_tab > div{flex: 1;padding: 34px 0;text-align: center;}
        .nav_tab > div > div{height: 32px;display: inline-block;border-bottom: 4px solid #fff;font-size: 20px;color: #ccc;line-height: 20px;cursor: pointer;}
        .nav_tab > div > div.act{border-bottom: 4px solid #4F81BE;color: #333;}
        .nav_body{
          padding: 0 30px;min-height: 465px;
          .body{border: 1px solid #eee;border-radius: 2px;background: #F9F9F9;height: 100%;}
          .nav_content_1{
            text-align: center;padding: 26px 0;
            .name_box{margin-top: 14px;}
            .lab{font-size: 18px;color: #999;vertical-align: top;display: inline-block;width: 120px;text-align: right;margin-right: 10px;line-height: 34px;}
            .lab.long_text{width: 185px;}
            .name_value{display: inline-block;width: 350px;position: relative;}
            .name_value > .icon{position: absolute;width: 22px;height: 22px;right: 45px;top: 50%;transform: translateY(-50%);cursor: pointer;}
            .name_value > .icon.icon_edit{background: url('../images/icon_edit.png') 0 0 / 100% 100% no-repeat;}
            .member_box{margin-top: 14px;}
            .member_value{
              display: inline-block;width: 350px;height: 293px;background: #fff;border: 1px solid #ddd;border-radius: 2px;text-align: left;overflow: auto;
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
            }
            .button_box .name_value{text-align: right;margin-top: 14px;margin-bottom: 26px;}
          }
          .nav_content_1_btn{
            text-align: center;
            .btn{width: 150px;margin-top: 50px;}
          }
        }
      }
    }
  }
  .configuration.act{
    z-index: 99;
    .config_body{width: 800px;height: 100%;background: #fff;float: right;}
  }
</style>