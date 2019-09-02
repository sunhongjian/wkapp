<template>
  <div class="bg-white">
    <div class="head-top">
      <div class="title">住宅管理</div>
    </div>
    <f7-toolbar tabbar style="background: #fff">
      <f7-link tab-link="#tab-1" tab-link-active>主控</f7-link>
      <f7-link tab-link="#tab-2">从控</f7-link>
    </f7-toolbar>
    <f7-tabs>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <div class="list-wrapper">
          <div v-for="item in list" :key="item.houseMgtId" class="list-item">
            <div class="left-content">
              <div class="title">{{item.houseName}}</div>
              <div class="sub-title">{{item.address}}</div>
            </div>
            <div class="right-content">
              <i class="f7-icons">chevron_right</i>
            </div>
          </div>
        </div>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-block>
          <p>Tab 2 content</p>...
        </f7-block>
      </f7-tab>
    </f7-tabs>
  </div>
</template>

<script>
import global from "../../../global";
import { mapState, mapMutations } from "vuex";

export default {
  created() {},
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapState({
      hasLoginSuccess: state => state.hasLoginSuccess
    })
  },
  mounted() {
    window.x = this
    this.initData();
  },
  watch: {
    hasLoginSuccess(val,old) {
      if(val == true && old == false) {
        this.initData();
        this.LOGIN_SUCCESS(false);
      }
    }
  },
  methods: {
    ...mapMutations(['LOGIN_SUCCESS']),
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
        } catch (error) {
          if (error.response.status == "401") {
          }
        }
        global.toast(res.data.info);
      });
    }
  }
};
</script>

<style scoped>
.bg-white {
  background: #fff;
}
.head-top {
  height: 150px;
  background-image: url("../../images/headtop.png");
  background-size: 100% 100%;
}
.head-top .title {
  font-size: 20px;
  padding: 20px;
  padding-top: 60px;
  color: teal;
}
.list-wrapper {
  padding: 20px;
}
.list-wrapper .list-item .title {
  color: teal;
  font-size: 18px;
}
.list-wrapper .list-item .sub-title {
  color: teal;
  opacity: 0.6;
}
.list-wrapper .list-item {
  position: relative;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: #ebebeb 2px 2px 3px 1px;
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
