<template>
  <div>
    <f7-block>
      <f7-link @click="$f7router.navigate('/myHome/')">About</f7-link>
      <f7-button raised large fill @click="reScreenOpened = true">注册</f7-button>
    </f7-block>
    <f7-block>
      <f7-button raised large fill @click="loginScreenOpened = true">登录</f7-button>
    </f7-block>
    <f7-login-screen
      color-theme="lightblue"
      class="re-screen"
      :opened="reScreenOpened"
      @loginscreen:closed="reScreenOpened = false"
    >
      <f7-page login-screen>
        <f7-navbar title="注册" back-link @back-click="backLink"></f7-navbar>
        <!-- <f7-block class="login-block-top" text-color="white" bg-color="lightblue">
        <f7-block-title text-color="white" large>温控产品App</f7-block-title>
        </f7-block>-->
        <f7-list no-hairlines-md>
          <f7-list-input
            label="手机号"
            type="text"
            floating-label
            placeholder="请输入"
            clear-button
            v-model="phoneNo"
            @input="phoneNo = $event.target.value"
          >
            <f7-icon f7="phone" slot="media" text-color="lightblue"></f7-icon>
          </f7-list-input>
          <f7-list-input
            label="验证码"
            type="text"
            floating-label
            placeholder="请输入"
            clear-button
            v-model="verifyCode"
            style="width: 60%"
            @input="verifyCode = $event.target.value"
          >
            <f7-block slot="content" class="login-abs">
              <f7-button outline v-show="isVerClick" @click="verificationHandle">短信验证</f7-button>
              <div
                v-show="!isVerClick"
                class="text-color-lightblue"
                style="font-size: 20px"
              >{{time}}</div>
            </f7-block>

            <f7-icon f7="message" slot="media" text-color="lightblue"></f7-icon>
          </f7-list-input>
          <f7-list-input
            label="密码"
            type="password"
            floating-label
            placeholder="请输入"
            clear-button
            v-model="password"
            @input="password = $event.target.value"
          >
            <f7-icon f7="lock" slot="media" text-color="lightblue"></f7-icon>
          </f7-list-input>
          <f7-list-item></f7-list-item>
        </f7-list>
        <f7-block>
          <f7-row>
            <f7-col>
              <f7-button large fill @click="sign">注册</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
        <f7-block-footer>
          <br />
          <span>版本号：v1.0</span>
        </f7-block-footer>
      </f7-page>
    </f7-login-screen>
    <f7-login-screen
      color-theme="lightblue"
      class="login-screen"
      :opened="loginScreenOpened"
      @loginscreen:closed="loginScreenOpened = false"
    >
      <f7-page login-screen>
        <f7-navbar title="登录" back-link @back-click="backLink"></f7-navbar>
        <!-- <f7-block class="login-block-top" text-color="white" bg-color="lightblue">
        <f7-block-title text-color="white" large>温控产品App</f7-block-title>
        </f7-block>-->
        <f7-list no-hairlines-md>
          <f7-list-input
            label="手机号"
            type="text"
            floating-label
            placeholder="请输入"
            clear-button
            v-model="loginData.phoneNo"
            @input="loginData.phoneNo = $event.target.value"
          >
            <f7-icon f7="phone" slot="media" text-color="lightblue"></f7-icon>
          </f7-list-input>
          <f7-list-input
            label="密码"
            type="password"
            floating-label
            placeholder="请输入"
            clear-button
            v-model="loginData.password"
            @input="loginData.password = $event.target.value"
          >
            <f7-icon f7="lock" slot="media" text-color="lightblue"></f7-icon>
          </f7-list-input>
          <f7-list-item></f7-list-item>
        </f7-list>
        <f7-block>
          <f7-row>
            <f7-col>
              <f7-button large fill @click="login">登录</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
        <f7-block-footer>
          <br />
          <span>版本号：v1.0</span>
        </f7-block-footer>
      </f7-page>
    </f7-login-screen>
  </div>
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
        phoneNo: '',
        password: ''
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
          if(self.loginScreenOpened || self.reScreenOpened) {
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
      encrypt.setPublicKey(
        global.publicKey
      );
      let passwordRsa = encrypt.encrypt(this.password);
      let res = await this.$axios({
        url: `/heating/residentApp/registration/regist`,
        method: "post",
        data: {
          phoneNo: this.phoneNo,
          verifyCode: this.verifyCode,
          password: passwordRsa
        }
      });
      global.toast(res.data.info);
    },
    async login() {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(
        global.publicKey
      );
      let passwordRsa = encrypt.encrypt(this.loginData.password);
      try{
      let res = await this.$axios({
        url: `/heating/residentApp/login`,
        method: "post",
        data: {
          phoneNo: this.loginData.phoneNo,
          password: passwordRsa
        }
      });
      console.log(res.data)
      if(res.data.code == 200) {
        this.$f7router.navigate('/myHome/')
      }
      global.toast(res.data.info);
            window.localStorage.setItem("appUserId", res.data.data.appUserId);
      window.localStorage.setItem("token", res.data.data.token);
      } catch(e) {
        global.toast(e);
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
      this.$f7.loginScreen.close();
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
 
