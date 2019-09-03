<template>
  <div class="bg-white">
    <div class="head-top">
      <div class="title">住宅管理</div>
      <i @click="add" class="f7-icons">add</i>
    </div>
    <div class="list-wrapper">
      <div v-for="item in list" :key="item.houseMgtId" class="list-item" @click="handleSub(item)">
        <div class="left-content">
          <div class="title">{{item.houseName}}</div>
          <div class="sub-title">{{item.address}}</div>
          <div class="flex" style="margin-top: 8px" v-if="item.flag == 0">
            <div class="home"></div>
            <div style="margin-left: 8px; color: teal">主</div>
          </div>
        </div>
        <div class="right-content">
          <i class="f7-icons">chevron_right</i>
        </div>
      </div>
    </div>
    <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
      <f7-page login-screen color-theme="teal">
        <f7-navbar>
          <f7-nav-left>
            <f7-link popup-close>返回</f7-link>
          </f7-nav-left>
          <f7-nav-title>从控列表</f7-nav-title>
          <f7-nav-right>
            <f7-link @click="addSub">添加</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <div class="list-wrapper">
          <div v-for="item in sublist" :key="item.houseMgtId" class="list-item">
            <div class="left-content">
              <div>
                <div class="title">
                  <span>{{item.remark}}</span>
                  <span>
                    <i style="color: teal" @click="changeName(item)" class="f7-icons">edit</i>
                  </span>
                </div>
              </div>
              <div class="sub-title">{{item.phoneNo}}</div>
            </div>
            <div class="right-content">
              <i style="color: teal" @click="trashSub" class="f7-icons">trash</i>
            </div>
          </div>
        </div>
      </f7-page>
    </f7-popup>
  </div>
</template>

<script>
import global from "../../../global";
import { mapState, mapMutations } from "vuex";

export default {
  created() {},
  data() {
    return {
      popupOpened: false,
      list: [],
      subData: {},
      sublist: []
    };
  },
  computed: {
    ...mapState({
      hasLoginSuccess: state => state.hasLoginSuccess
    })
  },
  mounted() {
    window.x = this;
    this.initData();
  },
  watch: {
    hasLoginSuccess(val, old) {
      if (val == true && old == false) {
        this.initData();
        this.LOGIN_SUCCESS(false);
      }
    }
  },
  methods: {
    ...mapMutations(["LOGIN_SUCCESS"]),
    async initData() {
      let appUserId = window.localStorage.getItem("appUserId");
      let res = await this.$axios({
        url: `app/heating/residentApp/getHouseList/${appUserId}`,
        method: "get"
      });
      if (res.data.code == 200) {
        this.list = res.data.data;
      }
    },
    async handleSub(item) {
      this.subData = item
      this.popupOpened = true;
      let appUserId = window.localStorage.getItem("appUserId");
      let res = await this.$axios({
        url: `app/heating/residentApp/getSlaveControl/${item.houseMgtId}`,
        method: "get"
      });
      if (res.data.code == 200) {
        this.sublist = res.data.data;
      }
    },
    changeName(item) {
      this.$f7.dialog.prompt("请输入新名称", async code => {
        let res = await this.$axios({
          url: "app/heating/residentApp/modifySlaveControlName",
          method: "post",
          data: {
            controlId: item.controlId,
            remark: code
          }
        });
        global.toast(res.data.info);
        this.handleSub(item);
      });
    },
    addSub() {
      this.$f7.dialog.prompt("请输入从控手机号", async code => {
        let res = await this.$axios({
          url: "app/heating/residentApp/addSlaveControl",
          method: "post",
          data: {
            houseName: this.subData.houseName,
            houseMgtId: this.subData.houseMgtId,
            phoneNo: code
          }
        });
        global.toast(res.data.info);
        this.handleSub(item);
      });
    },
    trashSub() {
      this.$f7.dialog.confirm("确定删除该从控吗?", () => {});
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
          global.toast(res.data.info);
        } catch (error) {}
      });
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
}
.bg-white {
  background: #fff;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.head-top {
  position: relative;
  height: 160px;
  background-image: url("../../images/headtop.png");
  background-size: 100% 100%;
}
.head-top .title {
  font-size: 20px;
  padding: 20px;
  padding-top: 60px;
  color: teal;
}
.head-top .f7-icons {
  position: absolute;
  right: 20px;
  top: 60px;
  color: teal;
  background: #fff;
  border-radius: 50%;
}
.list-wrapper {
  padding: 20px;
  overflow: auto;
  flex: 1;
}
.list-wrapper .list-item .title {
  color: teal;
  font-size: 18px;
}
.list-wrapper .list-item .sub-title {
  color: teal;
  opacity: 0.6;
}
.list-wrapper .list-item .home {
  width: 20px;
  height: 20px;
  background-image: url("../../images/home.jpeg");
  background-size: 100% 100%;
}
.list-wrapper .list-item {
  position: relative;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: #f6f6f6 2px 2px 3px 1px;
  padding: 10px;
  display: flex;
}
.list-wrapper .list-item i {
  color: #949494;
  font-size: 18px;
}
.left-content {
  flex: 1;
}
.right-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
