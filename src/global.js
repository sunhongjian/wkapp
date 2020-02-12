import Vue from 'vue';
export default new Vue({
  data() {
    return {
      host:'http://123.57.62.19:8090',//测式环境
      contextPath:'/heating/residentApp',
      publicKey: "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIRhQFF/Aa9Jad5DJliqEKj3jYoSVBY3OmuLoE4WqzZB6BRDVHeMhEDaNvYNIJZAehLoOkJBwjnGpSnUiRFUXlMCAwEAAQ=="
    }
  },
  methods: {
    toast(msg) {
      const self = this;
      self.toastCenter = self.$f7.toast.create({//toast延迟
        text: msg,
        position: 'center',
        closeTimeout: 2500,
        destroyOnClose: true
      });
      self.toastCenter.open();
    },
    routeToLogin() {
      this.$f7.loginScreen.open("#login-screen");
    }
  }
})
