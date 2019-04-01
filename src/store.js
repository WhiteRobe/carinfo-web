import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const Store = new Vuex.Store({
    state: {
      server:"/car", // 服务器发布地址
      imgDir:"/car/res/img", // 图片资源地址
      // 全局状态
      loginState: false,
      // 前端盐
      salt:'fo$r0dia',
      // 当前token
      token: null,
      // 当前用户权限
      power:1 // 默认权限最低
    },
    mutations: {
      online (state,token,power) {
        state.token=token;
        state.loginState=true;
        state.power = parseInt(power); // 保证为数字
        document.cookie="Token="+token; // 向Cookie中写入token
        // console.log("登记token",token,power);
      },
      offline(state){
        state.loginState=false;
        state.token=null;
        state.power = 1;
        document.cookie="Token=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // 注销token
      }
    }
})