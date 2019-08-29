<template>
  <div>
    <f7-row>
      <f7-col>
        <f7-menu>
          <f7-button outline href="/myHome/">我的住宅</f7-button>
        </f7-menu>
      </f7-col>
      <f7-col>
        <f7-menu>
          <f7-button outline href="/myHome/">我的住宅</f7-button>
        </f7-menu>
      </f7-col>
    </f7-row>
    <f7-row>
      <f7-col>
        <f7-menu>
        <f7-button outline @click="add()">添加住宅</f7-button>
        </f7-menu>
        <!-- <f7-menu>
          <f7-menu-item @click="add()" text="添加住宅"></f7-menu-item>
        </f7-menu>-->
      </f7-col>
      <f7-col>
        <f7-menu>
          <f7-button outline href="/myHome/">我的住宅</f7-button>
        </f7-menu>
      </f7-col>
    </f7-row>
  </div>
</template>

<script>
import global from "../../../global";
export default {
  methods: {
    add() {
      this.$f7.dialog.prompt("请输入住宅码", async code => {
        try {
        let res = await this.$axios({
            url: 'app/heating/residentApp/addMasterControl',
            method: "post",
            data: {
              houseCode: code,
              appUserId: window.localStorage.getItem('appUserId')
            }
          });
        } catch(error) {
          if(error.response.status == '401') {
            global.toast('请先登录');
          }        
        }
        global.toast(res.data.info);
      });
    }
  }
};
</script>

<style>
</style>