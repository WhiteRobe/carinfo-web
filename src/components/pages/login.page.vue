<style>
.loginFrom{
	text-align: center; /*让div内部文字居中*/
	background-color: #fff;
	border-radius: 10px;
	height:264px;
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
				<Form ref="loginform" :model="formData" :rules="formValidate">
					<FormItem prop="id">
						<Input prefix="md-contact"  type="text" placeholder="请输入您的账号/工号" v-model="formData.id"
							style="width: auto" @keydown.enter.native="submit"></Input>
					</FormItem>
					<FormItem prop="pw">
						<Input prefix="md-key"  type="password" placeholder="请输入您的登陆密码" v-model="formData.pw"
							style="width: auto" @keydown.enter.native="submit"></Input>
					</FormItem>
					<FormItem prop="vc">
						<Input prefix="md-barcode"  type="text" placeholder="请输入下方的验证码" v-model="formData.vc"
							style="width: auto" @keydown.enter.native="submit"></Input>
					</FormItem>
				</Form>

				验证码：<img :src="catchaURL+'?rs='+catchaSeed" @click="refreshCatcha($event)"/><br/>

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
			const asyncValiCode = (rule, value, callback) => {
				// if (!value) {
                //     return callback(new Error('请输入4位验证码'));
                // } else if(!/^[0-9a-zA-Z]{4,4}$/.test(value)){
				// 	return callback(new Error('验证码长度为4位中英文组合'));
				// }

				// 异步验证验证码
				axios.post(Store.state.server+"/CheckValiCode", qs.stringify({"Vali":value}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.then(function (response) {
					let res = response.data;
					let isSuccess = res.code==="100";
					// console.log(res,isSuccess);
					if(isSuccess){
						//console.log(res.data[0].Result==="true");
						res.data[0].Result==="true"?callback():callback(new Error("验证码错误"));
					} else {
						//console.log("异步验证验证码失败:", res.msg);
						callback(new Error("异步验证验证码失败"));
					}
				})
				.catch(function (error) {
					// console.log(error);
					callback(new Error("网络连接不稳定，无法获取验证码"));
				});
			};
			return {
				catchaSeed:Math.random(),
				LoginBGURL:LoginBG,
				formData:{
					id:'',
					pw:'',
					vc:'' // 验证码
				},
				formValidate:{
					id: [
                        { required: true, message: '请输入账号/工号', trigger: 'blur' },
						{ pattern: /^\d{9,9}$|^[a-zA-Z]{4,9}$/, message: '工号长度应为9位', trigger: 'blur' } // 九位工号或纯英文特殊账号
                    ],
					pw: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
						{ pattern: /^[A-Za-z0-9]{6,16}$/, message: '密码长度为6-16位英文数字组合', trigger: 'blur' }
                    ],
					vc: [
                        { required: true, message: '请输入4位验证码', trigger: 'blur' },
						{ type: 'string', len: 4, message: '验证码长度为4位', trigger: 'blur' },
						{ validator: asyncValiCode ,trigger: 'blur' }
                    ]
				}
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
				var mvue = this;
				this.$refs['loginform'].validate((valid) => {
                    if (!valid) {
						this.$Notice.error({
								title: '表单填写有误',
								desc: '请检查您的输入!'
							});
                    } else {
						mvue.tryLogin();
					}
                })
			},
			tryLogin(){
				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"WorkId":this.formData.id,
					"Pwd":md5(this.formData.pw + Store.state.salt) // md5加密
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
							
							let token = res.data[0].Token; // 得到Tokan
							var decoded = jwt.decode(token, {complete: true}); // 解析Token
							mvue.$Loading.finish(); // 进度条载入完毕
							var payload={
								"Token":token,
								"Power":decoded.payload.Power
								};
							Store.commit('online', payload); // 设置登录状态
							mvue.$Notice.success({
								title: '登录成功',
								desc: '欢迎回来！'+ parseInt(payload.Power)>=2?'员工:':'管理员:' + mvue.formData.id+'，即将为您进行跳转!'
							});
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