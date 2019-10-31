<template>
  <!-- App -->
  <f7-app :params="f7params">
    <f7-statusbar></f7-statusbar>
    <f7-view id="main-view" main url="/"></f7-view>
    <!-- Login Screen -->
    <login-page></login-page>
  </f7-app>
</template>
<script>
// Import Routes...
import routes from "./routes.js";
import loginPage from "./assets/vue/pages/login";
import global from './global';

let theme = "auto";
if (document.location.search.indexOf("theme=") >= 0) {
  theme = document.location.search.split("theme=")[1].split("&")[0];
}

export default {
  components: {
    loginPage
  },
  // 双击返回
  mounted() {
    document.removeEventListener("backbutton", this.onBackKeyDown, false);
    document.addEventListener("backbutton", this.onBackKeyDown, false);
  },
  beforeDestroy() {
    window.clearInterval(this.intervalID);
    document.removeEventListener("backbutton", this.onBackKeyDown, false);
    document.removeEventListener("backbutton", this.exitApp, false);
  },
  data() {
    return {
      f7params: {
        theme,
        routes,
        id: "io.framework7.testapp",
        dialog: {
          title: "提示",
          buttonOk: "确定",
          buttonCancel: "取消"
        }
      }
    };
  },
  methods: {
    onBackKeyDown() {
      global.toast("再按一次退出");
      document.removeEventListener("backbutton", this.onBackKeyDown, false);
      document.addEventListener("backbutton", this.exitApp, false);
      this.intervalID = window.setInterval(() => {
        document.removeEventListener("backbutton", this.exitApp, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        window.clearInterval(this.intervalID);
      }, 3000);
    },
    exitApp() {
      console.log(navigator);
      console.log(navigator.app);
      navigator.app.exitApp();
    }
  }
};
</script>