import VueRouter from 'vue-router';
import {Store} from './store.js';

import axios from 'axios';

import WelcomePage from "./components/pages/welcome.page.vue";
import LoginPage from "./components/pages/login.page.vue";
import ConsolePage from "./components/pages/console.page.vue";
import MainPage from "./components/pages/main.page.vue";
import SearchPage from "./components/pages/search.page.vue";

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
    if(to.path.indexOf('/login')==-1 && Store.state.power<1){ 
        console.log('您的权限不足，请先登陆');
        Store.commit('offline');
        return next("/login");// 但凡不是访问登录页且权限小于1的(非系统用户)，跳转回登录页
    }
    return next();// 权限足够则跳转
});