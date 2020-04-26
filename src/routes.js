import Home from './assets/vue/pages/home.vue';
import AboutPage from './assets/vue/pages/about.vue';

import PanelLeftPage from './assets/vue/pages/panel-left.vue';
import Vuex from './assets/vue/pages/vuex.vue';

import Index from './assets/vue/pages/index'
import register from './assets/vue/pages/register'
import Manage from './assets/vue/pages/manage'
import MyHome from './assets/vue/pages/myHome'
import Login from './assets/vue/pages/login'
import Version from './assets/vue/pages/version'
import mzsm from './assets/vue/pages/mzsm'
import Person from './assets/vue/pages/person'

export default [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/login/',
    component: Login,
  },
  {
    path: '/person/',
    component: Person,
  },
  {
    path: '/register/',
    component: register,
  },
  {
    path: '/myHome/',
    component: MyHome
  },
  {
    path: '/about/',
    component: AboutPage
  },
  {
    path: '/version/',
    component: Version
  },
  {
    path: '/mzsm/',
    component: mzsm
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage
  },
  {
    path: '/manage/',
    component: Manage
  },
];
