<style>
.loginFrom{
	text-align: center; /*让div内部文字居中*/
	background-color: #fff;
	border-radius: 10px;
	height:324px;
	width:512px;
	margin: auto;
	position: relative;
	top: 206px;
	left: 0;
	right: 0;
	bottom: 0;
}
.login-back-to-welcome-top{
	padding: 10px;
	background: rgba(0, 153, 229, .7);
	color: #fff;
	text-align: center;
	border-radius: 2px;
}
</style>
<template>
	<div :style="{backgroundImage:'url('+LoginBGURL+')',height:864+'px',weight:1920+'px'}">
		<div class="loginFrom">
			<Card :bordered="false" dis-hover>
				<p slot="title">欢迎回来 ^_^</p>
				<Input prefix="md-contact" name="idinput" type="text" placeholder="请输入您的账号" 
					style="width: auto" v-model="id" @keydown.enter.native="submit"></Input><br/><br/>

				<Input prefix="md-key" name="pwinput" type="password" placeholder="请输入您的密码" 
					style="width: auto" v-model="pw" @keydown.enter.native="submit"></Input><br/><br/>

				<Input prefix="md-barcode" name="valicodeinput" type="text" placeholder="请输入验证码" 
					style="width: auto" v-model="vc" @keydown.enter.native="submit"></Input><br/><br/>

				验证码：<img :src="catchaURL+'?rs='+catchaSeed" @click="refreshCatcha($event)"/><br/><br/>

				<!--<Checkbox  v-model="keepLoginState"><Icon type="md-lock"></Icon><font color="#808695">记住我的登录状态</font></Checkbox >-->

				<Divider/>
				<Button size="large" long icon="md-log-in" type="primary" @click="submit">提交</Button>
			</Card>
		</div>
	</div>
</template>
<script type="text/javascript">

	import {Store} from '../../store.js';
	import axios from 'axios';
	import md5 from 'js-md5';
	import jwt from 'jsonwebtoken';

	import LoginBG from '../../pics/login_bg.jpg';

	import qs from 'qs'; // 处理asiox post传参的坑
  	export default{
		name:"LoginPage",
		data:function(){
			return{
				catchaSeed:Math.random(),
				LoginBGURL:LoginBG,
				id:'',
				pw:'',
				vc:'' // 验证码
				//keepLoginState:false // 保持登录状态
			}
		},
		computed:{
			catchaURL(){
				return Store.state.server+"/GetCaptcha";
			}
		},
		methods:{
			refreshCatcha(event){
				this.catchaSeed = Math.random();
			},
			submit:function(){
				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"WorkId":this.id,
					"Pwd":md5(this.pw + Store.state.salt) // md5加密
				};
				//console.log(JSON.stringify(jsonMsg));
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/LoginServlet", qs.stringify(jsonMsg),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.code==="100";
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							mvue.$Notice.success({
								title: '登录成功',
								desc: '欢迎回来！员工工号:'+mvue.id+'，即将为您进行跳转!'
							});
							let token = res.data[0].Token; // 得到Tokan
							var decoded = jwt.decode(token, {complete: true});
							mvue.$Loading.finish(); // 进度条载入完毕
							Store.commit('online', token, decoded.payload.Power); // 设置登录状态
							mvue.$router.push("/main"); // 跳转到主页面
						} else {
							Store.commit('offline'); // 设置登录状态
							mvue.$Notice.error({
								title: '登录失败',
								desc: res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
			}
		}
  }
</script>