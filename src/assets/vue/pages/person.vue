<template>
   <f7-page class="bg-white">
     <f7-navbar title="版本信息" back-link="返回"></f7-navbar>
    <f7-block-title>关于</f7-block-title>
    <f7-list>
      <f7-list-item title="版本信息" link="/version/"></f7-list-item>
      <f7-list-item title="检查更新"></f7-list-item>
      <f7-list-item title="意见反馈"></f7-list-item>
      <f7-list-item title="免责声明" link="/mzsm/"></f7-list-item>
      <f7-list-item title="常见问题"></f7-list-item>
      <f7-list-item title="关于我们"></f7-list-item>
    </f7-list>
    <f7-block-title>账户</f7-block-title>
    <f7-list>
      <f7-list-item title="修改密码" @click="popupczOpened = true"></f7-list-item>
      <f7-list-item title="退出登录" @click="logout"></f7-list-item>
    </f7-list>
    <f7-popup class="popup" :opened="popupczOpened" @popup:closed="popupczOpened = false">
      <f7-page login-screen color-theme="teal">
        <f7-navbar>
          <f7-nav-left>
            <f7-link popup-close>返回</f7-link>
          </f7-nav-left>
          <f7-nav-title>修改密码</f7-nav-title>
        </f7-navbar>
        <f7-list no-hairlines-md style="margin: 20px 30px">
          <f7-list-input
            label="手机号"
            type="text"
            placeholder="请输入"
            clear-button
            v-model="phoneNo"
            @input="phoneNo = $event.target.value"
          ></f7-list-input>
          <f7-list-input
            label="旧密码"
            type="password"
            placeholder="请输入"
            clear-button
            v-model="oldPassword"
            @input="oldPassword = $event.target.value"
          ></f7-list-input>
          <f7-list-input
            label="新密码"
            type="password"
            placeholder="请输入"
            clear-button
            v-model="newPassword"
            @input="newPassword = $event.target.value"
          ></f7-list-input>
          <f7-list-item></f7-list-item>
        </f7-list>
        <f7-block style="margin: 0 20px">
          <f7-row>
            <f7-col>
              <f7-button large fill round @click="changePassword">确定</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
      </f7-page>
    </f7-popup>
   </f7-page>
</template>

<script>
import global from "../../../global";
import { JSEncrypt } from "jsencrypt";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      popupczOpened: false,
      phoneNo: "",
      newPassword: "",
      oldPassword: ""
    };
  },
  methods: {
    ...mapMutations(["LOGIN_SUCCESS"]),
    logout() {
      window.localStorage.clear("appUserId");
      window.localStorage.clear("token");
      this.LOGIN_SUCCESS(false);
      this.$f7.loginScreen.open("#login-screen");
      var mySwiper = document.querySelector('.swiper-container').swiper
      mySwiper.destroy()
    },
    async changePassword() {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(global.publicKey);
      let oldPasswordRsa = encrypt.encrypt(this.oldPassword);
      let newPasswordRsa = encrypt.encrypt(this.newPassword);
      try {
        let res = await this.$axios({
          url: `/heating/residentApp/modifyPassword`,
          method: "post",
          data: {
            phoneNo: this.phoneNo,
            oldPassword: oldPasswordRsa,
            newPassword: newPasswordRsa
          }
        });
        if (res.data.code == 200) {
          this.popupczOpened = false;
        }
        global.toast(res.data.info);
      } catch (e) {
        global.toast(e);
      }
    }
  }
};
</script>

<style>
</style>
