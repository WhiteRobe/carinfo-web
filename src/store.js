import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const Store = new Vuex.Store({
    state: {
      protocol:"http",// 文件传输协议
      server:"/car", // 服务器发布地址
      imgDir:"/car/data/img/", // 图片资源地址
      docDir:"/car/data/doc/", // doc资源地址
      // 全局状态
      loginState: false,
      // 前端盐
      salt:'fo$r0dia',
      // 当前token
      token: null,
      // 当前用户权限
      power:0 // 默认权限最低 0
    },
    mutations: {
      online (state, payload) {
        state.token=payload.Token;
        state.loginState=true;
        state.power = parseInt(payload.Power); // 保证为数字
        document.cookie="Token="+payload.Token; // 向Cookie中写入token
        //console.log("登记token",payload.Token,payload.Power);
      },
      offline(state){
        state.loginState=false;
        state.token=null;
        state.power = 0;
        document.cookie="Token=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // 注销token
      }
    }
})