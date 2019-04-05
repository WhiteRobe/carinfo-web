<style>
.mine-drawer-profile-profile{
	font-size: 14px;
}
.mine-drawer-profile-profile .ivu-col{
	margin-bottom: 12px;
}
.mineAvatarDiv{
	width: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	height: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	padding: 2x;
	background: #ececec;
	border-radius: 128px;
	box-shadow: 0px 0px 1px rgba(0,0,0,0.4);
	-moz-border-radius: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	-webkit-border-radius: 128px; /* 跟mineAvatarDiv中的width与height一致 */

	text-align: center;
	margin: auto;
	position: relative;
}
.mineAvatarImage{
	width: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	height: 128px;/* 跟mineAvatarDiv中的width与height一致 */
	line-height: 0;	/* remove line-height */ 
	display: inline-block;	/* circle wraps image */
	border-radius: 50%;	/* relative value */
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	transition: linear 0.25s;
}
</style>
<template>
	<div>
		<Drawer :closable="false" width="360" v-model="canShow" placement="left" title="我的资料">
			<div class="mine-drawer-profile-profile">
				<div class="mineAvatarDiv">
					<img class="mineAvatarImage" :src="imgDir+'avatar.png'"></img>
				</div>
			</div>
			<Divider />
			<div class="mine-drawer-profile-profile">
				<!--<Row>
					<Col span="2">&nbsp;</Col>
					<Col span="22">
						<br/><br/>
						<font face="微软雅黑" color="#808695">ID:</font>
						<font face="微软雅黑">{{ID}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">邮箱:</font>
						<font face="微软雅黑">{{EMAIL}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">账户等级:</font>
						<font face="微软雅黑">{{auth2String}}</font><br/><br/>
					</Col>
				</Row>
				<Divider />-->
				<Row>
					<Col span="1">&nbsp;<!--用于对齐--></Col>
					<Col span="22">
						<Button type="primary" long @click="resetUserPwdModelShow = true">修 改 密 码</Button>
						<br/>
						<Button type="error" long @click="logout">退 出 登 录</Button>
					</Col>
					<Col span="1">&nbsp;<!--用于对齐--></Col>
				</Row>
			</div>
		</Drawer>

		<!--重设用户密码-->
		<Modal v-model="resetUserPwdModelShow" title="重设用户密码">
			<Form ref="formResetUserPwd" :model="formResetUserPwdModelData" :rules="resetUserPwdRule">
				<FormItem prop="oldPwd" label="输入新密码">
					<Input type="password" v-model="formResetUserPwdModelData.oldPwd" style="width:auto" placeholder="请输入旧密码">
						<Icon type="ios-key" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="newPwd" label="设置新密码">
					<Input type="password" v-model="formResetUserPwdModelData.newPwd" style="width:auto" placeholder="请输入新密码">
						<Icon type="ios-key" slot="prepend"></Icon>
					</Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="resetUserPwdModelSubmit">提 交</Button>
			</div>
		</Modal>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	import md5 from 'js-md5';
	import jwt from 'jsonwebtoken';
	import qs from 'qs'; // 处理asiox post传参的坑

	export default{
		name:"MineWidge",
		inject:['gFrameWindow'],
		data:function(){
			return{
				canShow:false,
				pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
				resetUserPwdModelShow:false,
				formResetUserPwdModelData:{
					accountId:"",
					oldPwd:"",
					newPwd:""
				},
				resetUserPwdRule:{
					oldPwd:[
						{ required: true, message: '请输入旧密码', trigger: 'blur' },
						{ pattern: /^[A-Za-z0-9]{6,16}$/, message: '密码长度为6-16位英文数字组合', trigger: 'blur' }
					],
					newPwd:[
						{ required: true, message: '请输入新密码', trigger: 'blur' },
						{ pattern: /^[A-Za-z0-9]{6,16}$/, message: '密码长度为6-16位英文数字组合', trigger: 'blur' }
					]
				}
			}
		},
		computed:{
			imgDir(){
				return Store.state.imgDir;
			},
			token(){
				return Store.state.token;
			}
		},
		methods:{
			logout(){
				this.canShow = false;
				this.gFrameWindow.logout();
			},
			tokenLost(str){
				let pattern = /^20[1-9]{1,1}$/;
				if(pattern.test(str)){
					return true;
				}
				return false;
			},
			resetUserPwdModelSubmit(){
				var valipass = true;
				this.$refs['formResetUserPwd'].validate((valid) => {
                    if (!valid) {
						this.$Notice.error({
								title: '表单填写有误',
								desc: '请检查您的输入!'
							});
                        valipass = false;
                    } 
                })
				if(!valipass) return;

				if(this.token==null){
					mvue.$Notice.warning({
						title: '登陆已过期',
						desc: '请重新登陆'
					});
					Store.commit('offline'); // 设置登录状态
					mvue.$Loading.error(); // 进度条载入失败
					mvue.$router.push("/login"); // 跳转到主页面
					return;
				}

				this.formResetUserPwdModelData.workId = jwt.decode(this.token, {complete: true}).payload.subject;

				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"AccountId":this.formResetUserPwdModelData.workId,
					"OldPwd":md5(this.formResetUserPwdModelData.oldPwd + Store.state.salt),
					"NewPwd":md5(this.formResetUserPwdModelData.newPwd + Store.state.salt)
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/ResetPasswordServlet", qs.stringify(jsonMsg),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						}
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.code==="100";
						//console.log(res.MSG,isSuccess);
						if(mvue.tokenLost(res.code)){
							mvue.$Notice.warning({
								title: '登陆已过期',
								desc: '请重新登陆'
							});
							Store.commit('offline'); // 设置登录状态
							mvue.$Loading.error(); // 进度条载入失败
							mvue.$router.push("/login"); // 跳转到主页面
							return;
						}
						if(isSuccess){
							mvue.$Notice.success({
								title: '重设用户密码成功',
								desc: '员工用户:'+jsonMsg.AccountId+' 的密码已重设。'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '重设用户密码失败',
								desc: res.code==="508"?'您的权限不足':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.resetUserPwdModelShow = false;
				this.formResetUserPwdModelData.workId="";
				this.formResetUserPwdModelData.oldPwd="";
				this.formResetUserPwdModelData.newPwd="";
			}
		}
	}
</script>