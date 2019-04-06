import VueRouter from 'vue-router';
import {Store} from './store.js';

import axios from 'axios';

import WelcomePage from "./components/pages/welcome.page.vue";
import LoginPage from "./components/pages/login.page.vue";
import ConsolePage from "./components/pages/console.page.vue";
import MainPage from "./components/pages/main.page.vue";
import SearchPage from "./components/pages/search.page.vue";

import jwt from 'jsonwebtoken';

export const AppRouter = new VueRouter({
    routes:[
        { path:"/", component: WelcomePage},
        { path:"/login", component: LoginPage},
        { path:"/console", component: ConsolePage},
        { path:"/main", component: MainPage},
        { path:"/search", component: SearchPage}
    ]
});

// 路由守卫
AppRouter.beforeEach((to, from, next) => {
    if(to.path.indexOf('/login')!=-1){
        // 跳转的是login(无权限即可访问的页面),如果已登陆就跳转到主页
        if(Store.state.power>0) return next('/main');
        else return next();
    } else {
        // 跳转的是需权限控制页面
        if(Store.state.power<1){
            // 权限不够尝试Cookie登陆
            if(checkLoginStatus()){ // 检查本地Cookie尝试登陆
                return next('/main'); // 尝试Cookie登陆成功则直接跳转主页
            } else {
                console.log('您的权限不足，请先登陆!');
                Store.commit('offline');
                return next("/login");// 但凡不是访问登录页且权限小于1的(非系统用户或未登陆)，跳转回登录页
            }
        } else {
            // 权限够直接跳转
            return next();
        }
    }
    // if(to.path.indexOf('/login')==-1 && Store.state.power<1){ 
    //     if(!checkLoginStatus()){ // 检查本地Cookie尝试登陆
    //         console.log('您的权限不足，请先登陆!');
    //         Store.commit('offline');
    //         return next("/login");// 但凡不是访问登录页且权限小于1的(非系统用户或未登陆)，跳转回登录页
    //     } else {
    //         return next('/main');
    //     }
    // }
    // return next();// 权限足够则跳转
});

function checkLoginStatus(){
    // 读取本地cookie
    //console.log(document.cookie);
    let token = getCookie("Token");
    // console.log(token, token != null);
    if(token != null){
      var decoded = jwt.decode(token, {complete: true});
      var payload={
        "Token":token,
        "Power":decoded.payload.Power
      };
      Store.commit('online', payload); // 设置用户状态
      return true;
    }
    return false;
}

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return null;
}