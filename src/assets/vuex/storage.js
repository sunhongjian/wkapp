import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hasLoginSuccess: false,
    user: {}
  },

  actions: {
    userLogged ({commit}, user) {
      commit('USER_LOGGED', user);
    }
  },

  mutations: {
    LOGIN_SUCCESS(state, val) {
      state.hasLoginSuccess = val
    },
    USER_LOGGED (state, user) {
      state.user = user;
    }
  },
});