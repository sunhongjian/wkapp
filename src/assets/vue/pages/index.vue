<template>
  <f7-page color-theme="teal" class="no-padd">
    <house></house>
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