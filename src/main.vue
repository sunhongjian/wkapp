<template>
  <!-- App -->
  <f7-app :params="f7params">
    <f7-view id="main-view" main>
      <f7-page>
        <f7-tabs animated>
          <f7-tab id="manage">
            <manage></manage>
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
            icon-ios="f7:email_fill"
            icon-aurora="f7:email_fill"
            icon-md="material:email"
          ></f7-link>
          <f7-link
            tab-link="#person"
            text="我的"
            icon-ios="f7:today_fill"
            icon-aurora="f7:today_fill"
            icon-md="material:today"
          ></f7-link>
        </f7-toolbar>
      </f7-page>
    </f7-view>
  </f7-app>
</template>
<script>
// Import Routes...
import { f7App, f7Panel, f7View, f7Statusbar, f7Pages } from "framework7-vue";
import routes from "./routes.js";
import Person from "./assets/vue/pages/person";
import Manage from "./assets/vue/pages/manage";

let theme = "auto";
if (document.location.search.indexOf("theme=") >= 0) {
  theme = document.location.search.split("theme=")[1].split("&")[0];
}

export default {
  components: {
    Person,
    Manage
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