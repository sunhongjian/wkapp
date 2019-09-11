<template>
  <f7-page login-screen color-theme="teal">
    <f7-navbar>
      <f7-nav-left>
        <f7-link popup-close>返回</f7-link>
      </f7-nav-left>
      <f7-nav-title>重置密码</f7-nav-title>
    </f7-navbar>

    <!-- <f7-block class="login-block-top" text-color="white" bg-color="lightblue">
        <f7-block-title text-color="white" large>温控产品App</f7-block-title>
    </f7-block>-->
    <f7-list no-hairlines-md style="margin: 20px 30px">
      <f7-list-input
        label="手机号"
        type="text"
        placeholder="请输入"
        clear-button
        v-model="phoneNo"
        @input="phoneNo = $event.target.value"
      >
      </f7-list-input>
      <f7-list-input
        label="验证码"
        placeholder="请输入"
        clear-button
        v-model="verifyCode"
        style="width: 60%"
        @input="verifyCode = $event.target.value"
      >
        <f7-block slot="content" class="login-abs">
          <f7-button outline v-show="isVerClick" @click="verificationHandle">短信验证</f7-button>
          <div v-show="!isVerClick" class="text-color-teal" style="font-size: 20px">{{time}}</div>
        </f7-block>

      </f7-list-input>
      <f7-list-input
        label="新密码"
        type="password"
        placeholder="请输入"
        clear-button
        v-model="password"
        @input="password = $event.target.value"
      >
      </f7-list-input>
      <f7-list-item></f7-list-item>
    </f7-list>
    <f7-block style="margin: 0 20px">
      <f7-row>
        <f7-col @click="sign">
          <f7-button large fill round>重置</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>
<script>
import global from "../../../global";
import { JSEncrypt } from "jsencrypt";
export default {
  data() {
    return {
      loginScreenOpened: false,
      reScreenOpened: false,
      phoneNo: "", // 用户名(手机号)
      verifyCode: "", // 短信验证码
      password: "", // 密码
      isVerClick: true,
      initTime: 60,
      time: "",
      loginData: {
        phoneNo: "",
        password: ""
      }
    };
  },
  watch: {},
  mounted() {
    let self = this;
    document.addEventListener(
      "deviceready",
      function() {
        document.addEventListener("backbutton", onBackKeyDown, false);
        function onBackKeyDown() {
          if (self.loginScreenOpened || self.reScreenOpened) {
            self.$f7.loginScreen.close();
          }
        }

        function exitApp() {
          // navigator.app.exitApp();
        }
      },
      false
    );
  },
  methods: {
    async sign() {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(global.publicKey);
      let passwordRsa = encrypt.encrypt(this.password);
      let res = await this.$axios({
        url: `/heating/residentApp/registration/forget`,
        method: "post",
        data: {
          phoneNo: this.phoneNo,
          verifyCode: this.verifyCode,
          password: passwordRsa
        }
      });
      global.toast(res.data.info);
      if(res.data.code == 200) {
        this.$emit("closeHandle");
      }   
    },
    // 短信验证
    async verificationHandle() {
      // 手机号验证
      let valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
      if (!this.phoneNo) {
        global.toast("请填写手机号", "");
        return false;
      }
      if (!valid_rule.test(this.phoneNo)) {
        global.toast("手机号格式错误", "");
        return false;
      }
      let res = await this.$axios({
        url: `/heating/residentApp/verification/${this.phoneNo}`,
        method: "get"
      });
      global.toast(res.data.info);

      this.isVerClick = false;
      this.time = this.initTime;
      var timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          this.time = this.initTime;
          this.isVerClick = true;
          clearTimeout(timer);
        }
      }, 1000);
    },
    backLink() {
      
    }
    //
  }
};
</script>

 <style scoped>
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
</style>
 
