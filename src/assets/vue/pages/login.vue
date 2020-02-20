<template>
  <f7-login-screen id="login-screen">
    <f7-page login-screen color-theme="teal">
      <f7-block class="login-box">
        <div>
          <img src="../../images/icon.png" alt />
          <p>成诺智家</p>
        </div>
      </f7-block>

      <f7-list no-hairlines-md style="margin: 0 auto; padding: 0 20px">
        <f7-list-input
          label="账号"
          type="text"
          placeholder="手机号"
          v-model="loginData.phoneNo"
          @input="loginData.phoneNo = $event.target.value"
          clear-button
        ></f7-list-input>
        <f7-list-input
          label="密码"
          type="password"
          placeholder="请输入"
          v-model="loginData.password"
          style="margin-top: 15px"
          @input="loginData.password = $event.target.value"
          clear-button
        ></f7-list-input>
        <f7-list-item></f7-list-item>
      </f7-list>
      <f7-block style="margin: 0 auto; padding: 0 20px">
        <f7-row>
          <f7-col>
            <f7-button large fill round @click="login">登录</f7-button>
          </f7-col>
        </f7-row>
        <f7-row style="margin-top: 20px;">
          <f7-col>
            <f7-button large fill round @click="goRe" class="bg-gray">注册</f7-button>
          </f7-col>
        </f7-row>
      </f7-block>
      <f7-block style="text-align: center">
        <br />
        <span @click="popupOpenedRe = true">登录遇到问题?</span>
      </f7-block>
      <f7-popup class="demo-popup" :opened="popupOpenedRe" @popup:closed="popupOpened = false">
        <re-password @closeHandle="closeHandleRe"></re-password>
      </f7-popup>
      <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
        <register @closeHandle="closeHandle"></register>
      </f7-popup>
    </f7-page>
  </f7-login-screen>
</template>

<script>
import global from "../../../global";
import { JSEncrypt } from "jsencrypt";
import register from "./register";
import rePassword from "./rePassword";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    register,
    rePassword
  },
  data() {
    return {
      popupOpenedRe: false,
      popupOpened: false,
      loginData: {
        phoneNo: window.localStorage.getItem('phoneNo'),
        password: ""
      }
    };
  },
  methods: {
    ...mapMutations(['LOGIN_SUCCESS']),
    async login() {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(global.publicKey);
      let passwordRsa = encrypt.encrypt(this.loginData.password);
      try {
        let res = await this.$axios({
          url: `/heating/residentApp/login`,
          method: "post",
          data: {
            phoneNo: this.loginData.phoneNo,
            password: passwordRsa
          }
        });
        if (res.data.code == 200) {
          this.$f7.loginScreen.close();
          this.LOGIN_SUCCESS(true);
          // this.$f7router.navigate("/myHome/");
          window.localStorage.setItem("phoneNo", this.loginData.phoneNo);
          window.localStorage.setItem("appUserId", res.data.data.appUserId);
          window.localStorage.setItem("token", res.data.data.token);
        }
        global.toast(res.data.info);
      } catch (e) {
        global.toast(e);
      }
    },
    goRe() {
      this.popupOpened = true;
      // this.$f7router.navigate("/register/");
    },
    closeHandle() {
      this.popupOpened = false;
    },
    closeHandleRe() {
      this.popupOpenedRe = false;
    }
  }
};
</script>

<style>
.bg-default {
  background: #4b72f8;
}
.bg-gray {
  background: #f3f3f3;
  color: #000;
}
.login-block-top {
  width: 100%;
  align-content: center;
  padding-top: 20px;
  margin-top: 0px;
  height: 200px;
}
.icon-plant {
  width: 30px;
  height: 30px;
  margin: 0 auto;
  display: block;
  border-radius: 5px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto 100%;
}
.icon-ios-img {
  margin-top: 20px;
  width: 100px;
}
.login-icon {
  margin-left: 3px;
  margin-right: 12px;
  font-size: 35px;
}
.login-abs {
  position: absolute;
  right: -60%;
  top: 15px;
  margin: 0;
}
.login-box {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box p {
  color: #000;
  font-size: 18px;
  text-align: center;
}
.login-box div {
  width: 80px;
}
.login-box img {
  width: 100%;
}
.list .item-floating-label, .list .item-label {
  font-size: 14px;
}
</style>
