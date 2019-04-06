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
				<Row>
					<Col span="2">&nbsp;</Col>
					<Col span="22">
						<br/><br/>
						<font face="微软雅黑" color="#808695">工号/登陆账号:</font>
						<font face="微软雅黑">{{userInfo.workId}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">姓名:</font>
						<font face="微软雅黑">{{userInfo.workerName}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">职责:</font>
						<font face="微软雅黑">{{userInfo.duty}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">权限:</font>
						<font face="微软雅黑">{{myPower}}</font>
						<Tooltip content="我能进行什么操作？">
							<Icon type="md-help-circle" @click="showWhatCanIdo"/>
						</Tooltip>
						<br/><br/>
					</Col>
				</Row>
				<Divider />
				<Row>
					<Col span="1">&nbsp;<!--用于对齐--></Col>
					<Col span="22">
						<Button type="default" long @click="showEditWorkerNameNotice">修 改 姓 名</Button>
						<br/><br/>
						<Button type="primary" long @click="resetUserPwdModelShow = true">修 改 密 码</Button>
						<br/><br/>
						<Button type="error" long @click="logout">退 出 登 录</Button>
					</Col>
					<Col span="1">&nbsp;<!--用于对齐--></Col>
				</Row>
			</div>
		</Drawer>

		<!--重设用户密码-->
		<Modal v-model="resetUserPwdModelShow" title="重设用户密码">
			<Form ref="formResetUserPwd" :model="formResetUserPwdModelData" :rules="resetUserPwdRule">
				<FormItem prop="oldPwd" label="输入旧密码">
					<Input type="password" v-model="formResetUserPwdModelData.oldPwd" style="width:auto" placeholder="请输入旧密码" @keydown.enter.native="resetUserPwdModelSubmit">
						<Icon type="ios-key-outline" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="newPwd" label="设置新密码">
					<Input type="password" v-model="formResetUserPwdModelData.newPwd" style="width:auto" placeholder="请输入新密码" @keydown.enter.native="resetUserPwdModelSubmit">
						<Icon type="ios-key" slot="prepend" ></Icon>
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
				userInfo:{
					workId:"",
					workerName:"",
					duty:""
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
			},
			myPower(){
				let power = Store.state.power;
				switch(power){
					case 1:
						return '一般员工账号';
					case 2:
						return '管理员账号';
					case 3:
						return '超级管理员账号';
					default:
						return '其它类型账号(尚未登陆)';
				}
			}
		},
		methods:{
			showEditWorkerNameNotice(){
				this.$Message.info('请联系管理员进行操作');
			},
			returnToLogin(){
				this.$Notice.warning({
						title: '登陆已过期',
						desc: '请重新登陆'
					});
				Store.commit('offline'); // 设置登录状态
				this.$Loading.error(); // 进度条载入失败
				this.$router.push("/login"); // 跳转到主页面
			},
			initData(){
				if(this.token == null){
					return this.returnToLogin();
				}
				var mWorkId = jwt.decode(this.token, {complete: true}).payload.sub;

				if(!/^[0-9]{9,9}$/.test(mWorkId)){
					this.canShow = true; // 非九位工号的特殊账户
					this.userInfo.workId = mWorkId;
					this.userInfo.workerName = '特殊账户';
					this.userInfo.duty = '特殊账户';
					return;
				}
				
				this.$Loading.start(); // 进度条开始载入
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.get(Store.state.server+"/GetWorkerInfo",
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						},
						params:{
							"WorkId":mWorkId
						}
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.code==="100";
						if(isSuccess){
							mvue.canShow = true;
							mvue.userInfo.workId = res.data[0].WorkId;
							mvue.userInfo.workerName = res.data[0].WorkerName;
							mvue.userInfo.duty = res.data[0].Duty;
						} else {
							mvue.canShow = false;
							mvue.$Notice.error({
								title: '获取用户信息失败',
								desc: res.code==="508"?'您的权限不足':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.canShow = false;
						mvue.$Loading.error(); // 进度条载入失败
					});
			},
			showWhatCanIdo(){
				this.$Message.info({
					content: '一般用户可以搜寻数据库数据及生成文档；\n管理员可以对数据库进行操作；\n超级管理员可以对所有用户的信息进行操作',
					duration: 10
				});
			},
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
					return this.returnToLogin();
				}

				var accountId = jwt.decode(this.token, {complete: true}).payload.sub; // 修改账号时用的其实时 系统账号而非工号
				this.formResetUserPwdModelData.workId = accountId; // 一般情况下工号与账号同名

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
							return mvue.returnToLogin();
						}
						if(isSuccess){
							mvue.$Notice.success({
								title: '重设用户密码成功',
								desc: '员工用户:'+jsonMsg.AccountId+' 的密码已重设，请重新登陆。'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
							Store.commit('offline');
							mvue.$router.push('/login');
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