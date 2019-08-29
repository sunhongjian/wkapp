<template>
  <f7-page>
    <f7-navbar title="我的住宅" back-link="返回"></f7-navbar>
    <f7-list media-list>
      <f7-list-item
        v-for="item in list"
        :key="item.houseMgtId"
        link="#"
        
        :title="item.houseName"
        :subtitle="item.address"
      >
       <f7-icon slot="media" icon="lock"></f7-icon>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let appUserId = window.localStorage.getItem('appUserId');
      let res = await this.$axios({
        url: `app/heating/residentApp/getHouseList/${appUserId}`,
        method: "get"
      });
      if(res.data.code == 200) {
        this.list = res.data.data
      }
    }
  }
};
</script>

<style>
</style>