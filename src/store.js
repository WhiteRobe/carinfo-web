import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const Store = new Vuex.Store({
    state: {
      server:"/carwebapp", // 服务器发布地址
      imgDir:"/carwebapp/res/img", // 图片资源地址
      // 全局状态
      loginState: false,
      // 网站作者信息
      email:'test@outlook.com',
      salt:'FosRoda'
    },
    mutations: {
      online (state) {
        state.loginState=true;
      },
      offline(state){
        state.loginState=false;
      }
    }
})