import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Vuex from 'vuex';
Vue.use(Vuex);

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import {AppRouter} from "./router.js"; // 应用路由
import {Store} from "./store.js"; // 应用全局状态
import axios from 'axios';

import WindowFrame from "./components/window.frame.vue";
//-------------------//

var app = new Vue({
  el: '#app',
  data: {
    msg:"应用成功部署运行！"
  },
  components:{
    "window-frame":WindowFrame
  },
  created: function(){
    axios.get(Store.state.server+'/GetProtocolServlet')
      .then( response => {
        Store.commit('setProtocol', response.data);
      })
      .catch(error => {});
  },
  router:AppRouter
});
