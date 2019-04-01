import VueRouter from 'vue-router';
import {Store} from './store.js';

import axios from 'axios';

import WelcomePage from "./components/pages/welcome.page.vue";
import LoginPage from "./components/pages/login.page.vue";
import ConsolePage from "./components/pages/console.page.vue";

export const AppRouter = new VueRouter({
    routes:[
        { path:"/", component: WelcomePage},
        { path:"/login", component: LoginPage},
        { path:"/console", component: ConsolePage}
    ]
});

// 路由守卫
AppRouter.beforeEach((to, from, next) => {
    if(to.path.indexOf('/console')!=-1 ){
        // 禁止无权限用户进入控制台页面
        //return checkAuth(next);
        if(Store.state.power>=2) next(); // 权限足够则跳转
        else next("/main");
    }
	return next();
});