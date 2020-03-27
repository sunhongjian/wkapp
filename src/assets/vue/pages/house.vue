<template>
  <f7-page>
    <loading :show="loadingSwitch"></loading>
    <!-- Slider main container -->
    <div class="swiper-container main-slide">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div v-if="list.length == 0 && !loadingSwitch" class="add-block">
          <div class="main-nav-add">
            <div class="main-nav-sett">
              <f7-link href="/person/">
                <i class="f7-icons">settings</i>
              </f7-link>
            </div>
            <div class="main-nav-title">成诺智家</div>
            <div class="main-nav-list">
              <i @click="goDetail()" class="f7-icons">list</i>
            </div>
          </div>
          <i @click="add" style="color: teal" class="f7-icons add-icon">add</i>
        </div>
        <div class="swiper-slide" v-for="item in list">
          <div class="bg-white">
            <div class="head-top">
              <div class="main-nav">
                <div class="main-nav-sett">
                  <f7-link href="/person/">
                    <i class="f7-icons">settings</i>
                  </f7-link>
                </div>
                <div class="main-nav-title">成诺智家</div>
                <div class="main-nav-list">
                  <i @click="goDetail()" class="f7-icons">list</i>
                </div>
              </div>
              <div class="title">{{item.houseControlInfo.houseName}}</div>
              <!-- <div class="sub-title">{{item.houseControlInfo.address}}</div> -->
              <div class="sub-time-title">更新时间: {{item.houseControlInfo.lastUpdateTime}}</div>
              <!-- <div @click="initData(true)" class="house-refresh"></div> -->
              <f7-button class="moshipaixu" @click="modeAndSort(item)" fill round>模式和排序</f7-button>
            </div>
            <div style="padding: 10px" class="group">
              <div
                class="item"
                v-for="child in item.houseRoomInfo"
                :class="{'gray-theme': child.switchStatus == 'N'}"
              >
                <div class="item-inner-content">
                  <div style="text-align: center; margin-bottom: 5px">
                    <div style="display: flex">
                      <span style="font-size: 15px; color:teal; flex: 1" :style="{fontSize: child.remark.length> 4 ? '12px' : '15px'}">
                        <span
                          v-if="!child.showEditRemark"
                          @click="editRemark(child,item.houseRoomInfo)"
                        >{{child.remark}}</span>
                        <input
                          style="width: 50px"
                          v-model="child.remark"
                          v-if="child.showEditRemark"
                          autofocus
                          @blur="blurRemark(child)"
                        />
                      </span>
                      <span v-if="!child.appIcon" class="icon-home" @click="showIconChose(child)"></span>
                      <span v-if="child.appIcon" class="icon-chosen" @click="showIconChose(child)">
                        <img :src="getImgUrl(child.appIcon)" alt />
                      </span>
                      <span style="font-size: 18px; color: teal; flex: 1">{{child.setTemp}}°</span>
                    </div>
                  </div>
                  <f7-button
                      raised
                      round
                      small
                      class="icon-round-room room-refresh"
                      @click="refreshRoom(child)"
                    >
                    </f7-button>
                  <div class="realTemp">{{child.realTemp}}°</div>
                  <div class="display-flex" style="margin-top: 5px">
                    <!-- <div style="color: teal" @click="changeMode(child, item);">{{modelType(child)}}</div> -->
                    <!-- <div
                      @click="goModeDetail(child)"
                      v-if="child.modelType == 1"
                      class="icon-settings"
                    ></div>-->
                  </div>
                  <div class="flex" style="width: 100%">
                    <div>
                      <f7-button
                        raised
                        round
                        small
                        class="icon-round"
                        @click="editTemp(child,'-1', item)"
                      >
                        <div class="icon-add"></div>
                      </f7-button>
                    </div>
                    <div>
                      <f7-button
                        raised
                        round
                        small
                        class="icon-round"
                        @click="editTemp(child, '1', item)"
                      >
                        <div class="icon-delete"></div>
                      </f7-button>
                    </div>
                    <div>
                      <f7-button
                        raised
                        round
                        small
                        class="icon-round"
                        @click="changeSwitch(child, item)"
                      >
                        <div
                          class="icon-switch"
                          :class="{'icon-switch-open' : child.switchStatus == 'Y'}"
                        ></div>
                      </f7-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
    </div>
    <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
      <manage ref="manage" @closeHandle="closeHandle"></manage>
    </f7-popup>
    <!-- 排序 -->
    <f7-popup class="demo-popup" :opened="popupSort" @popup:closed="popupSort = false">
      <sort ref="sort" @closeHandle="closeHandleSort"></sort>
    </f7-popup>
    <!-- 选择图标 -->
    <f7-actions :grid="true" :opened="actionGridOpened" @actions:closed="actionGridOpened = false">
      <f7-actions-group>
        <f7-actions-button @click="changeIcon(1)">
          <img slot="media" src="../../../assets/images/1.png" width="48" />
        </f7-actions-button>
        <f7-actions-button @click="changeIcon(2)">
          <img slot="media" src="../../../assets/images/2.png" width="48" />
        </f7-actions-button>
        <f7-actions-button @click="changeIcon(3)">
          <img slot="media" src="../../../assets/images/3.png" width="48" />
        </f7-actions-button>
      </f7-actions-group>
      <f7-actions-group>
        <f7-actions-button @click="changeIcon(4)">
          <img slot="media" src="../../../assets/images/4.png" width="48" />
        </f7-actions-button>
        <f7-actions-button @click="changeIcon(5)">
          <img slot="media" src="../../../assets/images/5.png" width="48" />
        </f7-actions-button>
        <f7-actions-button @click="changeIcon(6)">
          <img slot="media" src="../../../assets/images/6.png" width="48" />
        </f7-actions-button>
      </f7-actions-group>
      <f7-actions-group>
        <f7-actions-button @click="changeIcon(7)">
          <img slot="media" src="../../../assets/images/7.png" width="48" />
        </f7-actions-button>
        <f7-actions-button @click="changeIcon(8)">
          <img slot="media" src="../../../assets/images/8.png" width="48" />
        </f7-actions-button>
        <f7-actions-button @click="changeIcon(9)">
          <img slot="media" src="../../../assets/images/9.png" width="48" />
        </f7-actions-button>
      </f7-actions-group>
    </f7-actions>
  </f7-page>
</template>

<script>
import Swiper from "swiper";
import global from "../../../global";
import { mapState, mapMutations } from "vuex";
import manage from "./manage";
import sort from "./sort";
import loading from "../components/loading";

export default {
  data() {
    return {
      imgsrc1: require("../../../assets/images/1.png"),
      imgsrc2: require("../../../assets/images/2.png"),
      imgsrc3: require("../../../assets/images/3.png"),
      imgsrc4: require("../../../assets/images/4.png"),
      imgsrc5: require("../../../assets/images/5.png"),
      imgsrc6: require("../../../assets/images/6.png"),
      imgsrc7: require("../../../assets/images/7.png"),
      imgsrc8: require("../../../assets/images/8.png"),
      imgsrc9: require("../../../assets/images/9.png"),
      actionGridOpened: false,
      loadingSwitch: false,
      changeIconRoomId: "",
      firstInit: true, // 首次加载
      loading: false,
      list: [],
      popupOpened: false,
      popupRoom: false,
      popupSort: false,
      modeDetailData: {}, // 温度详情
      activeIndex: 0,
      tempVal: 0,
      canAction: true,
      canActionRefresh: true
    };
  },
  components: {
    manage,
    loading,
    sort
  },
  created() {
    window.x = this;
    this.initData();
  },
  computed: {
    ...mapState({
      hasLoginSuccess: state => state.hasLoginSuccess
    })
  },
  watch: {
    hasLoginSuccess(val, old) {
      if (val == true && old == false) {
        this.initData();
      }
    }
  },
  methods: {
    ...mapMutations(["LOGIN_SUCCESS"]),
    goDetail() {
      this.$refs.manage.initData();
      this.popupOpened = true;
    },
    closeHandle(idx) {
      this.popupOpened = false;
      var mySwiper = document.querySelector(".swiper-container").swiper;
      mySwiper.slideTo(idx, 0, false);
      // this.initData();
    },
    closeHandleSort() {
      this.popupSort = false;
      this.initData();
    },
    // 选择图标
    showIconChose(item) {
      this.changeIconRoomId = item.roomId;
      this.actionGridOpened = true;
    },
    getImgUrl(value) {
      let temp = "imgsrc" + value;
      return this[temp];
    },
    // 刷新房间
    refreshRoom(item) {
      if(this.canActionRefresh) {
        this.canActionRefresh = false
         setTimeout(()=> {
           this.canActionRefresh = true
             this.refreshRoomTrue(item)  
         }, 2000)
      }
    },
    async refreshRoomTrue(item) {
        // 增加延迟   
        let res = await this.$axios({
          url: `app/heating/residentApp/getLastValue/${item.roomId}`,
          method: "get",
        });
        if(res.data.code == '200') {
        let list = this.list
        list.forEach((n,idx) => {
          n.houseRoomInfo.forEach((child, cidx) => {
            if(child.roomId == item.roomId) {
              for(let key in child) {
                child[key] = res.data.data[key]
              }
            }
          })
        })
        this.list = [...list]
        global.toast('房间数据刷新成功');
        } else {
          global.toast('刷新异常');
        }


    },
    editRemark(item, data) {
      // 关闭其他的输入框
      data.forEach(n => {
        if (n.roomId == item.roomId) {
        } else {
          n.showEditRemark = false;
        }
      });
      item.showEditRemark = !item.showEditRemark;
      this.list = [...this.list];
    },
    // 更改图标
    async changeIcon(value) {
      try {
        let res = await this.$axios({
          url: "app/heating/residentApp/modifyRoomIcon",
          method: "post",
          data: {
            roomId: this.changeIconRoomId,
            appIcon: value
          }
        });
        this.initData();
        global.toast(res.data.info);
      } catch (error) {}
    },
    // 失去焦点
    async blurRemark(value) {
      try {
        let res = await this.$axios({
          url: "app/heating/residentApp/modifyRoomName",
          method: "post",
          data: {
            roomId: value.roomId,
            remark: value.remark
          }
        });
        this.initData();
        global.toast(res.data.info);
      } catch (error) {}
    },
    // 进入温度详情
    async goModeDetail(item) {
      let res = await this.$axios({
        url: `app/heating/residentApp/getRoomModelList/${item.roomId}`,
        method: "get"
      });
      res.data.data.forEach(element => {
        if (element.isPresent == 0) {
          this.modeDetailData = element.details;
          if (element.modelFlag == 1) {
            this.modeDetailData.isEdit = true;
          }
        }
      });
      this.popupRoom = true;
    },
    add() {
      this.$f7.dialog.prompt("请输入住宅码", async code => {
        try {
          let res = await this.$axios({
            url: "app/heating/residentApp/addMasterControl",
            method: "post",
            data: {
              houseCode: code,
              appUserId: window.localStorage.getItem("appUserId")
            }
          });
          this.initData();
          global.toast(res.data.info);
        } catch (error) {}
      });
    },
    modelType(child) {
      if (child.modelType == 0) {
        return "自由模式";
      } else if (child.modelType == 1) {
        return "编程模式";
      }
    },
    // 模式和排序
    async modeAndSort(item) {
      this.loadingSwitch = true;
      let res = await this.$axios({
        url: `app/heating/residentApp/getRoomHeatOrder/${item.houseControlInfo.houseMgtId}/${window.localStorage.getItem("appUserId")}`,
        method: "get"
      });
      this.loadingSwitch = false;
      let temp = res.data.data[0].roomList;
      item.houseRoomInfo.forEach(n => {
        temp.forEach(child => {
          if (n.roomId == child.roomId) {
            child.houseRoomInfo = n;
          }
        });
      });
      this.$refs.sort.list = temp;
      console.log(temp);
      this.$refs.sort.houseControlInfo = item.houseControlInfo;
      this.popupSort = true;
    },
    // 温度调控
    editTemp(item, val, par) {
      // 三秒发一次真实请求

      if(this.canAction) {
        item.tempVal = val
        this.canAction = false
         setTimeout(()=> {
           this.canAction = true
           if(item.tempVal !== 0) {
             this.editTempTrue(item, item.tempVal, par)
           }         
         }, 2000)
      } else {
        item.tempVal = Number(item.tempVal) + Number(val)
        return false
      }
    },
    async editTempTrue(item, val, par) {
      if(item.modelId != "") {
        global.toast("切换到自由模式再调整温度");
        return;
      }
      // 三秒发一次请求
      if (item.switchStatus == "N") {
        global.toast("请先开机");
        return;
      }
      if (par.houseControlInfo.controlMode == 0) {
        global.toast("集中户住宅不能操控温度");
        return;
      }
      if (item.setTemp + Number(item.tempVal) > 35) {
        global.toast("温度不能超过35度");
        return;
      }
      if (item.setTemp + Number(item.tempVal) < 5) {
        global.toast("温度不能低于5度");
        return;
      }
      let res = await this.$axios({
        url: `app/heating/residentApp/setTempSwitch/${
          item.roomId
        }/${item.setTemp + Number(item.tempVal)}/${item.switchStatus}`,
        method: "get"
      });
      if (res.data.code == 200) {
        item.setTemp = item.setTemp + Number(item.tempVal);
        item.tempVal = 0;
        global.toast("温度设置成功");
      }
    },
    async changeSwitch(item, par) {
      if (par.houseControlInfo.controlMode == 0) {
        global.toast("集中户住宅不能操控开关");
        return;
      }
      let status = item.switchStatus == "Y" ? "N" : "Y";
      let res = await this.$axios({
        url: `app/heating/residentApp/setTempSwitch/${item.roomId}/${item.setTemp}/${status}`,
        method: "get"
      });
      if (res.data.code == 200) {
        let msg = item.switchStatus == "N" ? "已开启" : "已关闭";
        global.toast(msg);
        item.switchStatus = item.switchStatus == "Y" ? "N" : "Y";
      }
    },
    async initData(spec) {
      // if (document.querySelector(".swiper-container")) {
      //   var mySwiper = document.querySelector(".swiper-container").swiper;
      //   mySwiper.destroy();
      // }

      this.loadingSwitch = true;
      let appUserId = window.localStorage.getItem("appUserId");
      // 刷新获取houseMgtId
      let url = `app/heating/residentApp/getHouseAndRoomList/${appUserId}`
      if(spec) {
        let houseMgtId = this.list[this.activeIndex].houseControlInfo.houseMgtId
        url= `app/heating/residentApp/getHouseAndRoomList/${appUserId}?houseMgtId=${houseMgtId}`
      }
      let res = await this.$axios({
        url,
        method: "get"
      });
      this.loadingSwitch = false;
      if (res.data.code == 200) {
        // 取前5个
        this.list = res.data.data.splice(0,5);
        this.list.forEach(n => {
          n.houseRoomInfo.forEach(c => {
            c.showEditRemark = false;
          });
        });
        // this.list.forEach(k => {
        //   k.houseRoomInfo.forEach(async n => {
        //     let res = await this.$axios({
        //       url: `app/heating/residentApp/getRoomModelList/${n.roomId}`,
        //       method: "get"
        //     });
        //     let name = "";
        //     console.log(res);
        //     res.data.forEach(child => {
        //       if (child.isPresent == 0) {
        //         name = child.modelName;
        //       }
        //     });
        //     n.modelName = name;
        //   });
        // });
        let self = this
        this.$nextTick(function() {
          if (this.list.length == 0 || spec) {
            return;
          }
          if (!this.firstInit) {
            var mySwiper = document.querySelector(".swiper-container").swiper;
            mySwiper.destroy();
          } else {
            var swiper = new Swiper(".swiper-container", {
              on:{
                slideChange: function(){
                  self.activeIndex = swiper.activeIndex
                },
              },
              renderBullet: function(index, className) {
                return (
                  '<span class="' + className + '">' + (index + 1) + "</span>"
                );
              },
              pagination: {
                el: ".swiper-pagination",
                type: "bullets"
              }
            });
            swiper.init();
            this.firstInit = false;
          }
        });
      }
    }
  }
};
</script>
<style>
.main-slide {
  height: calc(100vh);
}
</style>
<style scoped>
.main-nav {
}
.gray-theme {
  filter: grayscale(100%);
}
.moshipaixu {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.add-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-block .add-icon {
  font-size: 50px;
  display: block;
  border: 3px solid teal;
  border-radius: 50%;
}
.display-flex {
  display: flex;
  text-align: center;
  margin: 10px 0;
  align-items: center;
  justify-content: center;
}
.icon-home {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url("../../images/sy1.png");
  background-size: 30px auto;
  vertical-align: bottom;
  background-repeat: no-repeat;
}
.icon-chosen {
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: bottom;
}
.icon-chosen img {
  width: 100%;
}
.house-refresh {
  position: absolute;
  top: 60px;
  color: teal;
  font-size: 40px;
  right: 20px !important;
  width: 35px;
  height: 35px;
  background-size: 35px auto;
  background-image: url("../../images/refresh.png");
}
.room-refresh {
  display: block;
  position: absolute;
  top: 78px;
  color: teal;
  font-size: 40px;
  right: 20px !important;
  width: 20px !important;
  height: 32px !important;
  background-repeat: no-repeat;
  background-size: 20px auto;
  background-position: 6px;
  padding: 0 !important;
  background-image: url("../../images/refresh.png"); 
}
.icon-add {
  width: 32px;
  height: 32px;
  background-image: url("../../images/sy3.png");
  background-size: 32px auto;
  background-repeat: no-repeat;
  position: absolute;
  left: 2px;
  top: 2px;
}
.icon-settings {
  width: 24px;
  height: 24px;
  background-image: url("../../images/sy2.png");
  background-size: 24px auto;
  background-repeat: no-repeat;
  margin-left: 5px;
}
.icon-switch {
  width: 32px;
  height: 32px;
  background-image: url("../../images/sy6.png");
  background-size: 32px auto;
  background-repeat: no-repeat;
  position: absolute;
  left: 2px;
  top: 2px;
}
.icon-switch-open {
  background-image: url("../../images/sy5.png");
}
.icon-delete {
  width: 32px;
  height: 32px;
  background-image: url("../../images/sy4.png");
  background-size: 32px auto;
  background-repeat: no-repeat;
  position: absolute;
  left: 2px;
  top: 2px;
}
.bg-white {
  background: #fff;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: auto;
  flex: 1;
}
.flex {
  display: flex;
}
.item {
  width: 50%;
}
.item-inner-content {
  margin: 10px;
  border-radius: 10px;
  box-shadow: #f6f6f6 2px 2px 3px 1px;
  padding: 20px 10px;
  position: relative;
}
.icon-round {
  width: 35px;
  height: 35px;
  line-height: 35px;
  margin: 0 auto;
}
.icon-round-room {
  width: 35px;
  height: 35px;
  line-height: 35px;
}
.flex > div {
  flex: 1;
}
.icon-round i {
  color: #888888;
}
.head-top {
  position: relative;
  height: 180px;
  background-image: url("../../images/headtop.png");
  background-size: 100% 100%;
}
.head-top .title {
  font-size: 20px;
  padding: 10px 20px;
  padding-top: 20px;
  color: teal;
}
.head-top .sub-title {
  color: teal;
  font-size: 16px;
  padding-left: 20px;
}
.head-top .sub-time-title {
  color: teal;
  font-size: 12px;
  margin-top: 10px;
  padding-left: 20px;
}
.main-nav-add {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.main-nav {
  display: flex;
}
.main-nav-title {
  flex: 1;
  padding: 20px 0;
  text-align: center;
  font-size: 20px;
  color: #005454;
}
.main-nav-sett .f7-icons {
  padding: 20px;
  color: #005454;
}
.main-nav-list .f7-icons {
  padding: 20px;
  color: #005454;
}
.head-top .f7-icons-refresh {
  position: absolute;
  top: 80px;
  color: teal;
  font-size: 40px;
  right: 20px !important;
}
.realTemp {
  text-align: center;
  font-size: 35px;
  font-weight: bold;
  margin-top: 20px;
  color: teal;
}
</style>
