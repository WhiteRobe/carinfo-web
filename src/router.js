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
    if(to.path.indexOf('/console')!=-1 || to.path.indexOf('/search')!=-1 || to.path.indexOf('/main')!=-1){
        // 禁止无权限用户进入控制台页面
        //return checkAuth(next);
        if(Store.state.power>=1) next(); // 权限足够则跳转
        else next("/login");
    }
	return next();
});

AppRouter.afterEach ((to, from, next) => {
    if(Store.state.token == null && to.path.indexOf('/login')!=-1){
        
    }
    console.log(Store.state.token);
	//return next();
});