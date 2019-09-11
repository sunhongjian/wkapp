<template>
  <div>
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
                <div class="item-inner">
                  <div style="text-align: center">
                    <div>
                      <span style="font-size: 18px; color:teal">{{child.remark}}/</span>
                      <span style="font-size: 18px; color: #ffcc00">{{child.setTemp}}°</span>
                    </div>
                  </div>
                  <div style="margin-top: 15px">
                    <div class="icon-home"></div>
                  </div>
                  <div
                    class="display-flex"
                    @click="changeMode(child);"
                  >
                    <div style="color: teal">{{modelType(child.modelType)}}</div>
                    <div class="icon-settings"></div>
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
  </div>
</template>

<script>
import Swiper from "swiper";
import global from "../../../global";
import { mapState, mapMutations } from "vuex";
import manage from "./manage";

export default {
  data() {
    return {
      list: [],
      popupOpened: false
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
    async changeMode(item) {
      let res = await this.$axios({
        url: `app/heating/residentApp/changeRoomModel/${
          item.roomId
        }`,
        method: "get"
      });
      if (res.data.code == 200) {

      }
    },
    modelType(type) {
      if (type == 0) {
        return "自由模式";
      } else if (type == 1) {
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
    async initData() {
      let appUserId = window.localStorage.getItem("appUserId");
      let res = await this.$axios({
        url: `app/heating/residentApp/getHouseAndRoomList/${appUserId}`,
        method: "get"
      });
      if (res.data.code == 200) {
        this.list = res.data.data;
        this.$nextTick(function() {
          if(this.list.length == 0) {
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
.add-block  i {
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
.item-inner {
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