<template>
  <!-- App -->
  <f7-app :params="f7params">
    <f7-statusbar></f7-statusbar>
    <f7-view id="main-view" main url="/">
      
    </f7-view>
        <!-- Login Screen -->
    <login-page></login-page>
  </f7-app>
</template>
<script>
// Import Routes...
import routes from "./routes.js";
import loginPage from './assets/vue/pages/login'

let theme = "auto";
if (document.location.search.indexOf("theme=") >= 0) {
  theme = document.location.search.split("theme=")[1].split("&")[0];
}

export default {
  components: {
    loginPage
  },
  mounted() {
    let self = this;
    document.addEventListener(
      "deviceready",
      function() {
        document.addEventListener("backbutton", exitApp, false);
        function exitApp() {
          navigator.app.exitApp();
        }
      },
      false
    );
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
  }
};
</script>