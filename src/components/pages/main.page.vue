<style>
</style>
<template>
	<Row>
		<Col span="3">&nbsp;<!--留白--></Col>
		<Col span="14">
			<!--车辆管理-->
			<div>
				<Divider orientation="left">车辆管理</Divider>
				<Row><!--n x 3 布局-->
					<Col span="6">
						<Button icon="ios-car" size="large" long to="/">升 档 车 辆</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button icon="ios-car" size="large" long to="/">运输联合收割机车辆</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button icon="ios-car" size="large" long to="/">专用作业车 (入 口)</Button>
					</Col>
				</Row>
				<br></br>
				<Row><!--n x 3 布局-->
					<Col span="6">
						<Button icon="ios-car" size="large" long to="/">专用作业车 (出 口)</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button icon="ios-car" size="large" long to="/">大件运输车 (入 口)</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
					<Button icon="ios-car" size="large" long to="/">大件运输车 (出 口)</Button>
					</Col>
				</Row>
			</div>
			<!--通用功能-->
			<div>
				<br></br>
				<Divider orientation="left">通用功能</Divider>
				<!--<Button type="primary" icon="ios-search">车辆车型查询</Button>-->
				<Row><!--n x 3 布局-->
					<Col span="6">
						<Button type="primary" size="large" long icon="ios-search" @click="checkBlackCarModelShow = true">黑名单车辆查询</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button type="error" size="large" long icon="md-car" @click="tryToShowBlackCarModel">录入黑名单车辆</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<!--其它按钮-->
					</Col>
				</Row>
			</div>
			<!--管理员管理界面-->
			<div v-if="isAdmin">
				<br></br>
				<Divider orientation="left">管理员管理界面</Divider>
				<Row><!--n x 3 布局-->
					<Col span="6">
						<Button type="primary" size="large" long icon="md-add" @click="signInNewCarTypeModelShow = true">录入新车型</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<!--其它按钮-->
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<!--其它按钮-->
					</Col>
				</Row>
			</div>
		</Col>
		<Col span="7">&nbsp;<!--右侧边栏--></Col>
		<!--模态框-->
		<!--查询黑名单车辆-->
		<Modal v-model="checkBlackCarModelShow" title="检索黑名单车辆">
			<Form ref="formCheckBlackCar" :model="formCheckBlackCarData" :rules="checkBlackCarRule">
				<FormItem label="车 牌 号">
					<Row>
						<Col span="2">
							<FormItem >
								<Select v-model="formCheckBlackCarData.carIdPartI" size="small" style="width:auto">
									<Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="2">
							<FormItem >
								<Select v-model="formCheckBlackCarData.carIdPartII" size="small" style="width:auto">
									<Option v-for="item in alphabetList" :value="item" :key="item">{{ item }}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="1">&nbsp;<!--留白--></Col>
						<Col span="15">
							<FormItem prop="carId">
								<Input type="text" v-model="formCheckBlackCarData.carId"   placeholder="请输入黑名单车辆的车牌后五位">
								</Input>
							</FormItem>
						</Col>
					</Row>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="checkBlackCarSubmit">提 交</Button>
			</div>
		</Modal>
		<!--登记新车车型-->
		<Modal v-model="signInNewCarTypeModelShow" title="录入新车型">
			<Form ref="formNewCarType" :model="formNewCarTypeData" :rules="signInewCarTypeRule">
				<FormItem prop="newCarType">
					<Input type="text" v-model="formNewCarTypeData.newCarType" placeholder="请输入新车型">
						<Icon type="md-add" slot="prepend"></Icon>
					</Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="signInNewCarTypeModelSubmit">提 交</Button>
			</div>
		</Modal>
		<!--登记新黑名单车辆-->
		<Modal v-model="signInNewBlackCarModelShow" title="录入黑名单车辆" @on-visible-change="cleanCarTypeList">
			<Form ref="formNewBlackCar" :model="formNewBlackCarData" :rules="signInBlackCarRule">
				<FormItem label="车 牌 号">
					<Row>
						<Col span="2">
							<FormItem >
								<Select v-model="formNewBlackCarData.newCarIdPartI" size="small" style="width:auto">
									<Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="2">
							<FormItem >
								<Select v-model="formNewBlackCarData.newCarIdPartII" size="small" style="width:auto">
									<Option v-for="item in alphabetList" :value="item" :key="item">{{ item }}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="1">&nbsp;<!--留白--></Col>
						<Col span="15">
							<FormItem prop="newCarId">
								<Input type="text" v-model="formNewBlackCarData.newCarId" placeholder="请输入黑名单车辆的车牌后五位">
								</Input>
							</FormItem>
						</Col>
					</Row>
				</FormItem>
				<FormItem label="车辆  类型" prop="newCarType">
					<Select v-model="formNewBlackCarData.newCarType" placeholder="请选择黑名单车辆的车型">
						<Option v-for="item in carTypeList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</FormItem>
				<FormItem label="黑名单原因" prop="newCarCause">
					<Input type="textarea" v-model="formNewBlackCarData.newCarCause" 
						:autosize="{minRows: 2,maxRows: 5}" placeholder="请输入录入黑名单的原因(100字以内)">
					</Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="signInBlackCarModelSubmit">提 交</Button>
			</div>
		</Modal>
		<!--通用模态框-->
		<Modal
			:title="generalModelTitle"
			v-model="generalModelShow"
			:mask-closable="false">
			<p>{{generalModelContent}}</p>
		</Modal>
	</Row>
</template>
<script type="text/javascript">

	import {Store} from '../../store.js';
	import axios from 'axios';
	import md5 from 'js-md5';
	import jwt from 'jsonwebtoken';

	import qs from 'qs'; // 处理asiox post传参的坑
  	export default{
		name:"MainPage",
		data:function(){
			return {
				signInNewCarTypeModelShow:false,
				signInNewBlackCarModelShow:false,
				checkBlackCarModelShow:false,
				generalModelShow:false,
				generalModelTitle:"",
				generalModelContent:"",
				formNewCarTypeData: {
					newCarType:""
				},
				formNewBlackCarData: {
					newCarIdPartI:"陕",
					newCarIdPartII:"A",
					newCarId:"",
					newCarType:"",
					newCarCause:""
				},
				formCheckBlackCarData:{
					carIdPartI:"陕",
					carIdPartII:"A",
					carId:""
				},
				carTypeList:[],
				signInewCarTypeRule:{
					newCarType:[
						{ required: true, message: '请输入其车型', trigger: 'blur' },
						{ type: 'string', max: 10, message: '长度在10字以内', trigger: 'blur' }
					]
				},
				signInBlackCarRule : {
					newCarId:[
						{ required: true, message: '请输入车牌号', trigger: 'blur' },
						{ pattern: /^[0-9A-Z]{5,5}$/, message: '车牌号不合法', trigger: 'blur' }
					],
					newCarType:[
						{ required: true, message: '请选择其车型', trigger: 'blur' }
					],
					newCarCause:[
						{ required: true, message: '请输入原因', trigger: 'blur' },
						{ type: 'string', max: 200, message: '长度在100字以内', trigger: 'blur' }
					]
				},
				checkBlackCarRule:{
					carId:[
						{ required: true, message: '请输入车牌号', trigger: 'blur' },
						{ pattern: /^[0-9A-Z]{5,5}$/, message: '车牌号不合法', trigger: 'blur' }
					]
				},
				provinceList:['京','津','冀','晋','蒙','辽','吉','黑','沪','苏','浙','皖',
								'闽','赣','鲁','豫','鄂','湘','粤','桂','琼','渝','川','黔',
								'滇','藏','陕','甘','青','宁','新','台','港','澳'],
				alphabetList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
			}
		},
		computed:{
			isAdmin(){
				return Store.state.power>=2;
			}
		},
		methods:{
			signInNewCarTypeModelSubmit(){
				var valipass = true;
				this.$refs['formNewCarType'].validate((valid) => {
                    if (!valid) {
						this.$Notice.error({
								title: '表单填写有误',
								desc: '请检查您的输入!'
							});
                        valipass = false;
                    } 
                })
				if(!valipass) return;

				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"CarType":this.formNewCarTypeData.newCarType
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/SignInCarType", qs.stringify(jsonMsg),
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
						if(isSuccess){
							mvue.$Notice.success({
								title: '登记新车型成功',
								desc: '新车型:'+jsonMsg.CarType+'已录入!'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '登记新车型失败',
								desc: res.code==="103"?'数据库中已存在该车型':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.signInNewCarTypeModelShow = false;
				this.formNewCarTypeData.newCarType="";
			},
			signInBlackCarModelSubmit(){
				var valipass = true;
				this.$refs['formNewBlackCar'].validate((valid) => {
                    if (!valid) {
						this.$Notice.error({
								title: '表单填写有误',
								desc: '请检查您的输入!'
							});
                        valipass = false;
                    } 
                })
				if(!valipass) return;

				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"CarId":
						this.formNewBlackCarData.newCarIdPartI+
						this.formNewBlackCarData.newCarIdPartII+
						this.formNewBlackCarData.newCarId,
					"CarType":this.formNewBlackCarData.newCarType,
					"Cause":this.formNewBlackCarData.newCarCause
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/SignInBlackCar", qs.stringify(jsonMsg),
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
						if(isSuccess){
							mvue.$Notice.success({
								title: '登记新黑名单车辆成功',
								desc: '新黑名单车辆:'+jsonMsg.CarId+'已录入!'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '登记新黑名单车辆失败',
								desc: res.code==="103"?'数据库中已存在该车':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.signInNewBlackCarModelShow = false;
				this.formNewBlackCarData.newCarIdPartI="陕";
				this.formNewBlackCarData.newCarIdPartII="A";
				this.formNewBlackCarData.newCarId="";
				this.formNewBlackCarData.newCarType="";
				this.formNewBlackCarData.newCarCause="";
				// 清空拉取的车型数据 下次重新读取
				//this.carTypeList.splice(0,this.carTypeList.length);
			},
			tryToShowBlackCarModel(){
				// 拉取车辆类型 若成功则显示模态框
				var mvue = this;
				axios.get(Store.state.server+"/GetCarTypeList",
                    {   
                        headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
                    })
                    .then(function (response) {
                        let res = response.data;
                        let isSuccess = res.code=="100";
                        //console.log(res,isSuccess);
                        if(isSuccess){
							let dataList = res.data;
							for(var i=0;i<dataList.length;i++){
								mvue.carTypeList.push(dataList[i].CarType);
							}
							mvue.signInNewBlackCarModelShow = true; // 显示模态框
                        } else {
							mvue.$Notice.error({
								title: '拉取车型列表失败',
								desc: '服务器正忙，请稍后尝试'
							});
                        }
                    })
                    .catch(function (error) {
                        mvue.$Notice.error({
								title: '拉取车型列表失败',
								desc: '您的网络连接似乎不稳定，请稍后尝试'
							});
                    });
			},
			checkBlackCarSubmit(){
				var valipass = true;
				this.$refs['formCheckBlackCar'].validate((valid) => {
                    if (!valid) {
						this.$Notice.error({
								title: '表单填写有误',
								desc: '请检查您的输入!'
							});
                        valipass = false;
                    } 
                })
				if(!valipass) return;

				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"CarId":
						this.formCheckBlackCarData.carIdPartI +
						this.formCheckBlackCarData.carIdPartII +
						this.formCheckBlackCarData.carId
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/CheckBlackCar", qs.stringify(jsonMsg),
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
						if(isSuccess){
							if(res.data[0].Result==="false"){
								mvue.$Message.info({
									content: '该车('+jsonMsg.CarId+')并非黑名单车辆!',
                    				duration: 10,
                    				closable: true
								});
							} else{
								mvue.generalModelShow = true; // 显示结果框
								mvue.generalModelTitle = '该车('+jsonMsg.CarId+')是黑名单车辆!';
								mvue.generalModelContent = '黑名单原因：'+res.data[0].Cause;
							}
							
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '查询黑名单车辆失败',
								desc: res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});

					this.checkBlackCarModelShow = false;
					this.formCheckBlackCarData.carIdPartI="陕";
					this.formCheckBlackCarData.carIdPartII="A";
					this.formCheckBlackCarData.carId="";
			},
			cleanCarTypeList(){
				if(!this.signInNewBlackCarModelShow && this.carTypeList.length>0){
					// 登记新黑名单车辆的对话框关闭时 清空拉取的车型数据 以便重新读取
					this.carTypeList.splice(0,this.carTypeList.length);
				}
			}

		}
    }
</script>