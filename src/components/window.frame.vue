<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #2d8cf0;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    float: left;
    top: 15px;
    left: 10px;
    margin: 0 auto;
    margin-left: 10px;
}
.layout-nav{
    width: 220px;
    margin: 0 auto;
    margin-right: 10px;
    float:right;
}
.layout-footer-center{
    text-align: center;
}
</style>

<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1" @on-select="handleMenuItemSelect">
                    <div class="layout-logo">
                        <Avatar :src="logoUrl" ></Avatar>
                        <font face="微软雅黑" size="5" color="#ffffff" style="font-weight:bold">&nbsp; 特情车辆智能处理系统</font>
                    </div>
                    <div class="layout-nav" v-if="!isLoginIn">
                        <MenuItem name="1" to="/login">
                            <Icon type="md-log-in" />
                            登录
                        </MenuItem>
                    </div>
                    <div class="layout-nav" v-else>
                        <MenuItem name="MINE_WIDGE">
                            <Icon type="md-person" />
                            我的..
                        </MenuItem>
                        <MenuItem name="LOGOUT">
                            <Icon type="md-log-out" />
                            退出登录
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Content :style="{padding: '0 0px'}">
                <!-- 内部界面 -->
                <slot name="page_content"></slot>
            </Content>
            <Footer class="layout-footer-center">
                <Divider />
                <font color="#808695">2018-2019 &copy; 陕西高速 特情车辆智能处理系统</font>
            </Footer>
        </Layout>
        <!--抽屉效果-->
        <mine-widge ref="mineWidge"></mine-widge>
    </div>
</template>

<script type="text/javascript">
    import MineWidge from "./pages/widge/mine.widge.vue";
    import Logo_Jpg from '../pics/logo.png';
    import {Store} from '../store.js';
    import axios from 'axios';
    export default {
        name:"WindowFrame",
        provide:function(){
            return {
                gFrameWindow:this
            }
        },
        data:function(){
            return {
                logoUrl:Logo_Jpg
            }
        },
        methods:{
            handleMenuItemSelect(menuName){
                switch(menuName){
                    case 'MINE_WIDGE':
                        this.$refs.mineWidge.canShow = true;
                        break;
                    case 'LOGOUT':
                        this.logout();
                        break;
                    default:
                        break;
                }
            },
            logout : function(){ // 退出登录
                var mvue = this;
                axios.get(Store.state.server+"/LogoutServlet",
                    {   
                        headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
                            "Token":Store.state.token
						}
                    })
                    .then(function (response) {
                        let res = response.data;
                        let isSuccess = res.code=="100";
                        //console.log(res.MSG,isSuccess);
                        if(isSuccess){
                            mvue.$Notice.success({
                                title: '退出成功',
                                desc: '您已安全退出!'
                            });
                            Store.commit('offline'); // 设置登录状态:退出
                            mvue.$router.push("/login"); // 跳转到登陆页
                        } else {
                            mvue.$Notice.error({
                                title: '退出失败',
                                desc: res.msg
                            });
                        }
                    })
                    .catch(function (error) {
                        mvue.$Notice.error({
                            title: '退出失败',
                            desc: '连接超时：未从服务器获得数据'
                        });
                        console.log(error);
                    });
            }
        },
        computed:{
            isLoginIn:function(){
                return Store.state.loginState;
            }
        },
        components:{
            'mine-widge':MineWidge
        }
    }
</script>