<template>
  <f7-page>
    <!-- Slider main container -->
    <div class="swiper-container main-slide">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div v-if="list.length == 0" class="add-block">
          <i @click="add" style="color: teal" class="f7-icons">add</i>
        </div>
        <div class="swiper-slide" v-for="item in list">
          <div class="bg-white">
            <div class="head-top">
              <div class="title">{{item.houseControlInfo.houseName}}</div>
              <div class="sub-title">{{item.houseControlInfo.address}}</div>
              <i @click="goDetail()" class="f7-icons">list</i>
            </div>
            <div style="padding: 10px" class="group">
              <div class="item" v-for="child in item.houseRoomInfo">
                <div class="item-inner-content">
                  <div style="text-align: center">
                    <div>
                      <span style="font-size: 18px; color:teal">{{child.remark}}/</span>
                      <span style="font-size: 18px; color: #ffcc00">{{child.setTemp}}°</span>
                    </div>
                  </div>
                  <div style="margin-top: 15px">
                    <div class="icon-home"></div>
                  </div>
                  <div class="display-flex">
                    <div style="color: teal" @click="changeMode(child);">{{modelType(child)}}</div>
                    <div
                      @click="goModeDetail(child)"
                      v-if="child.modelType == 1"
                      class="icon-settings"
                    ></div>
                  </div>
                  <div class="flex" style="width: 100%" v-if="child.modelType == 0">
                    <div>
                      <f7-button
                        raised
                        round
                        small
                        class="icon-round"
                        @click="editTemp(child,'-1')"
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
                        @click="editTemp(child, '1')"
                      >
                        <div class="icon-delete"></div>
                      </f7-button>
                    </div>
                    <div>
                      <f7-button raised round small class="icon-round" @click="changeSwitch(child)">
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
    <f7-popup class="demo-popup" :opened="popupRoom" @popup:closed="popupRoom = false">
      <f7-page>
        <f7-navbar title="温控详情">
          <f7-nav-right>
            <f7-link popup-close>关闭</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <div>
          <div class="list media-list">
            <ul>
              <li class="media-item" v-for="item in 8">
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">{{modeDetailData['time'+item]}}</div>
                      <div class="item-after">
                        <span>{{modeDetailData['temp'+item]}}°</span>
                        <span>
                          <f7-link popover-open=".popover-menu" @click="editDetail(item)">
                            <i style="color: teal;" class="f7-icons">edit</i>
                          </f7-link>
                        </span>
                      </div>
                    </div>
                    <div class="item-subtitle">{{modeDetailData['starttime'+item]}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </f7-page>
      <f7-popover class="popover-menu" :opened="true">
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input
            label="名称"
            type="text"
            :value="condition.time"
            @input="condition.time = $event.target.value"
            placeholder="名称"
          ></f7-list-input>
          <f7-list-input
            label="开始时间"
            type="text"
            :value="condition.starttime"
            @input="condition.starttime = $event.target.value"
            placeholder="开始时间"
          ></f7-list-input>
          <f7-list-input
            label="温度"
            type="text"
            :value="condition.temp"
            @input="condition.temp = $event.target.value"
            placeholder="温度"
          ></f7-list-input>
        </f7-list>
        <div style="padding: 20px;">
          <f7-button popover-close style="background: teal; color: #fff;" round @click="saveTemp">保存</f7-button>
        </div>
      </f7-popover>
    </f7-popup>
  </f7-page>
</template>

<script>
import Swiper from "swiper";
import global from "../../../global";
import { mapState, mapMutations } from "vuex";
import manage from "./manage";

export default {
  data() {
    return {
      loading: false,
      list: [],
      popupOpened: false,
      popupRoom: false,
      modeDetailData: {}, // 温度详情
      condition: {
        time: '',
        starttime: '',
        temp: '',
        num: ''
      } // 暂存温度
    };
  },
  components: {
    manage
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
    closeHandle() {
      this.popupOpened = false;
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
          if (element.modelId == 4) {
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
    editDetail(item) {
      this.condition.starttime = this.modeDetailData['starttime'+item]
      this.condition.time = this.modeDetailData['time'+item]
      this.condition.temp = this.modeDetailData['temp'+item]
      this.condition.num = item
    },
    // 修改子模式中自定义模式
    async saveTemp() {
      this.modeDetailData['starttime'+this.condition.num] = this.condition.starttime
      this.modeDetailData['time'+this.condition.num] = this.condition.time
      this.modeDetailData['temp'+this.condition.num] = this.condition.temp
      let res = await this.$axios({
        url: "app/heating/residentApp/modifyModelDetails",
        method: "post",
        data: this.modeDetailData
      });
    },
    // 变更模式
    async changeMode(item) {
      console.log(item);
      let res = await this.$axios({
        url: `app/heating/residentApp/getRoomModelList/${item.roomId}`,
        method: "get"
      });
      let buttons = [];
      res.data.data.forEach(element => {
        const self = this;
        let text = "";
        if (element.isPresent == 0 && item.modelType == 1) {
          text =
            '<i style="color: teal" class="f7-icons">check</i>' +
            element.modelName;
        } else {
          text = element.modelName;
        }
        buttons.push({
          text,
          async onClick(val) {
            if (item.modelType == 0) {
              let resMode = await self.$axios({
                url: `app/heating/residentApp/changeRoomModel/${item.roomId}`,
                method: "get"
              });
              if (resMode.data.code == 200) {
                item.modelType = item.modelType == "0" ? "1" : "0";
              }
            }
            let res = await self.$axios({
              url: `app/heating/residentApp/applyModel/${item.roomId}/${element.modelId}`,
              method: "get"
            });
            console.log(element);
          }
        });
      });
      const self = this;
      const app = self.$f7;
      self.actionsToPopover = app.actions.create({
        buttons: [
          [
            {
              text: "自由模式",
              async onClick(val) {
                if (item.modelType == 1) {
                  let resMode = await self.$axios({
                    url: `app/heating/residentApp/changeRoomModel/${item.roomId}`,
                    method: "get"
                  });
                  if (resMode.data.code == 200) {
                    item.modelType = item.modelType == "0" ? "1" : "0";
                  }
                }
              }
            }
          ],
          buttons,
          [
            {
              text: "取消",
              color: "red"
            }
          ]
        ],
        targetEl: self.$el.querySelector(".button-to-popover")
      });
      self.actionsToPopover.open();
      // let res = await this.$axios({
      //   url: `app/heating/residentApp/changeRoomModel/${
      //     item.roomId
      //   }`,
      //   method: "get"
      // });
      // if (res.data.code == 200) {
      //   item.modelType = item.modelType == '0' ? '1' : '0'
      // }
    },
    modelType(child) {
      if (child.modelType == 0) {
        return "自由模式";
      } else if (child.modelType == 1) {
        return "编程模式";
      }
    },
    // 温度调控
    async editTemp(item, val) {
      let res = await this.$axios({
        url: `app/heating/residentApp/setTempSwitch/${
          item.roomId
        }/${item.setTemp + Number(val)}/${item.switchStatus}`,
        method: "get"
      });
      if (res.data.code == 200) {
        item.setTemp = item.setTemp + Number(val);
      }
    },
    async changeSwitch(item) {
      let status = item.switchStatus == "Y" ? "N" : "Y";
      let res = await this.$axios({
        url: `app/heating/residentApp/setTempSwitch/${item.roomId}/${item.setTemp}/${status}`,
        method: "get"
      });
      if (res.data.code == 200) {
        item.switchStatus = item.switchStatus == "Y" ? "N" : "Y";
      }
    },
    async initData(event, done) {
      let appUserId = window.localStorage.getItem("appUserId");
      let res = await this.$axios({
        url: `app/heating/residentApp/getHouseAndRoomList/${appUserId}`,
        method: "get"
      });
      if (res.data.code == 200) {
        this.list = res.data.data;
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
        this.$nextTick(function() {
          if (this.list.length == 0) {
            return;
          }
          var swiper = new Swiper(".swiper-container", {
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
        });
      }
      if (done) {
        global.toast("刷新成功");
        done();
      }
    }
  }
};
</script>
<style>
.main-slide {
  height: calc(100vh - 50px);
}
</style>
<style scoped>
.add-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-block i {
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
  width: 27px;
  height: 27px;
  background-image: url("../../images/sy1.png");
  background-size: 27px auto;
  background-repeat: no-repeat;
  margin: 0 auto;
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
  height: 150px;
  border-radius: 10px;
  box-shadow: #f6f6f6 2px 2px 3px 1px;
  padding: 10px;
}
.icon-round {
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
  height: 160px;
  background-image: url("../../images/headtop.png");
  background-size: 100% 100%;
}
.head-top .title {
  font-size: 20px;
  padding: 10px 20px;
  padding-top: 60px;
  color: teal;
}
.head-top .sub-title {
  color: teal;
  font-size: 16px;
  padding-left: 20px;
}
.head-top .f7-icons {
  position: absolute;
  right: 20px;
  top: 60px;
  color: teal;
}
</style>