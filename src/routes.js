import Home from './assets/vue/pages/home.vue';
import AboutPage from './assets/vue/pages/about.vue';
import FormPage from './assets/vue/pages/form.vue';
import DynamicRoutePage from './assets/vue/pages/dynamic-route.vue';

import PanelLeftPage from './assets/vue/pages/panel-left.vue';
import ColorThemes from './assets/vue/pages/color-themes.vue';
import Chat from './assets/vue/pages/chat.vue';
import Vuex from './assets/vue/pages/vuex.vue';

import Index from './assets/vue/pages/index'
import register from './assets/vue/pages/register'
import Manage from './assets/vue/pages/manage'
import MyHome from './assets/vue/pages/myHome'
import Login from './assets/vue/pages/login'
import Version from './assets/vue/pages/version'
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
    path: '/form/',
    component: FormPage
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage
  },
  {
    path: '/color-themes/',
    component: ColorThemes
  },
  {
    path: '/chat/',
    component: Chat
  },
  {
    path: '/manage/',
    component: Manage
  },
];
