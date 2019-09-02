// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Style
import Framework7CSS from 'framework7/css/framework7.bundle.min.css';

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css';

// Import Material Icons
import MaterialIcons from 'material-design-icons/iconfont/material-icons.css';

// Import Fontawesome Theme Styles
import FontAwesome from '@fortawesome/fontawesome-free/css/all.min.css';

// Import fastClick
import FastClick from 'fastclick';

// Import App Custom Styles
// import AppStyles from './assets/sass/main.scss'

// Import App Component
import app from './main.vue';

// Import Vuex Storage
import store from './assets/vuex/storage.js';

// Different F7-Vue plugin initialization with f7 v3.0
Framework7.use(Framework7Vue);

import axios from 'axios';
import global from './global';
// 设置api路径
axios.defaults.baseURL = global.host;
axios.interceptors.request.use(function (config) {
  let AUTH_TOKEN = window.localStorage.getItem('token');
  config.headers['Authorization']=AUTH_TOKEN;
  return config;
});
axios.interceptors.response.use(
  response => {
      return response;
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 401:
                global.routeToLogin()
          }
      }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });
Vue.prototype.$axios = axios;

// Init Vue App
export default new Vue({
  // Root Element
  el: '#app',
  store,
  render: c => c('app'),
  components: {
    app
  },
  mounted() {
    window.addEventListener('load', () => {
      // run after everything is in-place
      FastClick.attach(document.body);
    });
  }
});
