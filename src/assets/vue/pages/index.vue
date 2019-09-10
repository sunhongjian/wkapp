<template>
  <f7-page color-theme="teal" class="no-padd">
    <f7-tabs animated>
      <f7-tab tab-active id="manage" style="background: #fff;">
        <house></house>
      </f7-tab>
      <f7-tab id="person">
        <person></person>
      </f7-tab>
    </f7-tabs>
    <f7-toolbar bottom tabbar labels>
      <f7-link
        tab-link="#manage"
        tab-link-active
        text="管理"
        icon-f7="home"
      ></f7-link>
      <f7-link tab-link="#person" text="设置" icon-f7="person"></f7-link>
    </f7-toolbar>
  </f7-page>
</template>

<script>
import global from "../../../global";
import Person from "./person";
import Manage from "./manage";
import House from "./house";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Person,
    Manage,
    House
  },
  computed: {
    ...mapState({
      hasLoginSuccess: state => state.hasLoginSuccess
    })
  },
  watch: {
    hasLoginSuccess(val, old) {
      if (val == true && old == false) {
        this.$f7.tab.show('#manage');
      }
    }
  },
  async created() {
    try {
      let appUserId = window.localStorage.getItem("appUserId");
      let res = await this.$axios({
        url: `app/heating/residentApp/getHouseList/${appUserId}`,
        method: "get"
      });
      if (res.data.code == 200) {
        this.list = res.data.data;
      } else {
        global.toast(res.data.info);
      }
    } catch (error) {}
  }
};
</script>

<style>
</style>