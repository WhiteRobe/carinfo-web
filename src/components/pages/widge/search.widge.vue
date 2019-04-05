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
		<Card :bordered="false">
			<Row>
				<Col span="3"> {{info.CarId}}</Col>
				<Col span="4"> {{info.SignTime}}</Col>
				<Col span="3"> {{info.Worker}}</Col>
				<Col span="3"> {{info.Shift}}</Col>
				<Col span="3"> {{info.Charger}}</Col>
				<Col span="3"> {{info.EntryToll}}</Col>
				<Col span="5"> 
					<Button type="primary" size="default" shape="circle" long @click="tryToBuildDoc(info.UID, beanType)" v-if="buildDocStatus==1" icon="md-document">生 成 文 档</Button>
					<Button type="success" size="default" shape="circle" long @click="download" v-else-if="buildDocStatus==2" icon="md-download">下 载 文 档</Button>
					<Button type="warning" size="default" shape="circle" long @click="tryToBuildDoc(info.UID, beanType)" v-else-if="buildDocStatus==3" icon="md-refresh-circl">重新尝试生成文档</Button>
					<Button type="error" size="default" shape="circle" long @click="reLogin" v-else icon="md-close-circle">服务器错误请重新登陆</Button>
				</Col>
			</Row>
		</Card>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	import qs from 'qs'; // 处理asiox post传参的坑

	export default{
		name:"SearchWidge",
		props:['info','beanType'],
		watch:{
			info(){
				this.downloadFileUrl="",
				this.buildDocStatus=1
			}
		},
		data:function(){
			return {
				downloadFileUrl:"", // 文件的下载地址
				buildDocStatus:1 // 1:尚未尝试建立 2:已建立成功 3:建立失败可重试 4:服务器问题请，重新登陆
			}
		},
		computed: {
			docUrl(){ //doc 的前缀
				return Store.state.protocol + "://" + location.hostname + ":" + location.port + Store.state.docDir
			}
		},
		methods:{
			tokenLost(str){
				let pattern = /^20[1-9]{1,1}$/;
				if(pattern.test(str)){
					return true;
				}
				return false;
			},
			
			tryToBuildDoc(uid, type){
				var jsonMsg ={
					"BeanType":type,
					"UID":uid
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/BuildDocServlet", qs.stringify(jsonMsg),
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
							mvue.downloadFileUrl = res.data[0].Url;
							mvue.buildDocStatus = 2;
							mvue.$Loading.finish(); // 进度条载入完毕
							
							mvue.$Notice.success({
								title: '生成文档成功',
								desc: '点击按钮下载相应文档!'
							});
						} else {
							mvue.buildDocStatus = 3;
							mvue.$Notice.error({
								title: '生成文档失败',
								desc: '稍后请点击按钮重试'
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.buildDocStatus = 4;
						mvue.$Loading.error(); // 进度条载入失败
					});

			},
			reLogin(){
				Store.commit('offline');
				this.$router.push('/login');
			},
			download(){
				let url = this.docUrl + this.downloadFileUrl;
				//console.log(url);
				window.open(url);
			}
		}
	}
</script>