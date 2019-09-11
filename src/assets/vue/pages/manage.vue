<template>
  <f7-page class="bg-white">
    <div class="head-top">
      <i class="f7-icons left-icon" @click="goDetail()">arrow_left</i>
      <div class="title">住宅管理</div>
      <i @click="add" class="f7-icons add-icon">add</i>
    </div>
    <div class="list-wrapper">
      <div v-for="item in list" :key="item.houseMgtId" class="list-item" @click="goDetail()">
        <div class="left-content">
          <div class="title">{{item.houseName}}</div>
          <div class="sub-title">{{item.address}}</div>
          <div class="flex" style="margin-top: 8px" v-if="item.flag == 0">
            <div class="home"></div>
            <div style="margin-left: 8px; color: teal">主</div>
          </div>
        </div>
        <div class="right-content" v-if="item.flag == 0" @click.stop="handleSub(item)">
          <i class="f7-icons">settings</i>
        </div>
      </div>
    </div>
    <f7-popup class="demo-popup" :opened="popupOpenedCk" @popup:closed="popupOpenedCk = false">
      <f7-page login-screen color-theme="teal">
        <f7-navbar>
          <f7-nav-left>
            <f7-link @click="popupOpenedCk= false">返回</f7-link>
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
                </div>
              </div>
              <div class="sub-title">{{item.phoneNo}}</div>
            </div>
            <div class="right-content">
              <i style="color: teal" @click="$refs.actionsOneGroup.open(); temp=item" class="f7-icons">edit</i>
            </div>
          </div>
        </div>
      </f7-page>
    </f7-popup>
    <f7-actions ref="actionsOneGroup">
      <f7-actions-group>
        <f7-actions-label></f7-actions-label>
        <f7-actions-button @click="changeName()">更改名称</f7-actions-button>
        <f7-actions-button>移交主控</f7-actions-button>
        <f7-actions-button @click="trashSub()" color="red">删除</f7-actions-button>
      </f7-actions-group>
    </f7-actions>
  </f7-page>
</template>

<script>
import global from "../../../global";
import { mapState, mapMutations } from "vuex";

export default {
  created() {},
  data() {
    return {
      popupOpenedCk: false,
      list: [],
      subData: {},
      sublist: [],
      temp: {}
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
    // hasLoginSuccess(val, old) {
    //   if (val == true && old == false) {
    //     this.initData();
    //     this.LOGIN_SUCCESS(false);
    //   }
    // }
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
    goDetail() {
      this.$emit("closeHandle");
    },
    async handleSub(item) {
      this.subData = item
      this.popupOpenedCk = true;
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
            controlId: this.temp.controlId,
            remark: code
          }
        });
        global.toast(res.data.info);
        this.handleSub(this.temp);
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
      this.$f7.dialog.confirm("确定删除该从控吗?", async () => {
        try {
          let res = await this.$axios({
            url: `app/heating/residentApp/deleteSlaveControl/${this.temp.controlId}`,
            method: "get",
          });
          global.toast(res.data.info);
          this.initData();
        } catch (error) {}
      });
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
.left-icon {
  position: absolute;
  top: 5px;
  left: 5px;
  color: teal;
  font-size: 30px;
}
.head-top .title {
  font-size: 20px;
  padding: 20px;
  padding-top: 60px;
  color: teal;
}
.head-top .add-icon {
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
