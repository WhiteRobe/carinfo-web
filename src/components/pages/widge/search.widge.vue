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
					<Button type="primary" size="large" long @click="tryToBuildDoc(info.UID, beanType)">生 成 文 档</Button>
				</Col>
			</Row>
		</Card>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	export default{
		name:"SearchWidge",
		props:['info','beanType'],
		data:function(){
			return {
				
			}
		},
		computed:{
			
		},
		methods:{
			tryToBuildDoc(uid, type){
				console.log(uid, type);
			}
		}
	}
</script>