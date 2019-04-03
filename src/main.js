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

import WindowFrame from "./components/window.frame.vue";
//-------------------//

import jwt from 'jsonwebtoken';
var app = new Vue({
  el: '#app',
  data: {
    msg:"应用成功部署运行！"
  },
  methods:{
    checkLoginStatu(){
      // 读取本地cookie
      // console.log(document.cookie);
      let token = this.getCookie("Token");
      // console.log(token, token != null);
      if(token != null){
        var decoded = jwt.decode(token, {complete: true});
        var payload={
          "Token":token,
          "Power":decoded.payload.Power
        };
        Store.commit('online', payload); // 设置用户状态
      }
    },
    getCookie(cname){
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) 
      {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
      return null;
    }
  },
  mounted: function () {
    this.checkLoginStatu();
  },
  components:{
    "window-frame":WindowFrame
  },
  
  router:AppRouter
});
