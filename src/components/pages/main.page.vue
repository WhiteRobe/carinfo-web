<style>
</style>
<template>
	<Row>
		<Col span="3">&nbsp;<!--留白--></Col>
		<Col span="14">
			<!--车辆管理-->
			<div>
				<Divider orientation="left">车辆管理</Divider>
				<Card :bordered="false">
					<p slot="title">车辆信息检索</p>
					<Form ref="formSearch" :model="formSearchData" :rules="formSearchRule">
						<FormItem prop="carId">
							<Input search enter-button placeholder="请输入除省份简称外的车牌号,如A12345(若缺省将搜索所有该类型车辆的数据)"
							 @on-search="searchSubmit"  @on-enter="searchSubmit" v-model="formSearchData.carId">
								<Select v-model="formSearchData.carIdPartI" slot="prepend" style="width:auto" placeholder="省份简称">
									<Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
								</Select>
							</Input>
						</FormItem>
						<FormItem prop="beanType" label="数据类型">
							<Select v-model="formSearchData.beanType" style="width: auto" placeholder="请选择数据类型">
								<!--value的枚举值参见DDTOType.java-->
								<Option value="CAR_ESCAPE">升档车辆</Option>
								<Option value="CAR_REAPER">联合收割机</Option>
								<Option value="CAR_SPECIAL_ENTRY">专用作业车(入口)</Option>
								<Option value="CAR_SPECIAL_EXIT">专用作业车(出口)</Option>
								<Option value="CAR_HUGE_ENTRY">大件运输车(入口)</Option>
								<Option value="CAR_HUGE_EXIT">大件运输车(出口)</Option>
							</Select>
						</FormItem>
						<FormItem label="按时间筛选">
							<Row>
								<Col span="5">
									<FormItem prop="dateBegin">
										<DatePicker type="date" style="width: auto" format="yyyy-MM-dd" placeholder="请选择开始日期"  @on-change="setDateBegin"></DatePicker>
									</FormItem>
								</Col>
								<Col span="1">&nbsp;至</Col>
								<Col span="5">
									<FormItem prop="dateEnd">
										<DatePicker type="date" style="width: auto" format="yyyy-MM-dd" placeholder="请选择结束日期"  @on-change="setDateEnd"></DatePicker>
									</FormItem>
								</Col>
							</Row>
						</FormItem>
						<Divider>其它筛选项</Divider>
						<FormItem prop="shift" label="按班次筛选">
							<Select v-model="formSearchData.shift" style="width: auto" sise="large" placeholder="请选择班次，可缺省">
								<Option value="早班">早班</Option>
								<Option value="中班">中班</Option>
								<Option value="晚班">晚班</Option>
							</Select>
						</FormItem>
					</Form>
				</Card>
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
						<Button type="warning" size="large" long icon="md-car" @click="tryToShowBlackCarModel">录入黑名单车辆</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<!--随便放个什么按钮...-->
						<Button type="error" size="large" long icon="md-log-out" @click="gFrameWindow.logout()">退 出 登 陆</Button>
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
						<Button type="success" size="large" long icon="md-person-add" @click="signInNewUserModelShow = true">录入新员工账户</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button type="info" size="large" long icon="md-home" @click="signInNewTollModelShow = true">录入新收费站</Button>
					</Col>
				</Row>
			</div>
			<!--超级管理员界面-->
			<div v-if="isSuperAdmin">
				<br></br>
				<Divider orientation="left">超级管理员界面</Divider>
				<Row><!--n x 3 布局-->
					<Col span="6">
						<Button type="primary" size="large" long icon="md-refresh" @click="resetUserPwdModelShow = true">重设用户密码</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button type="warning" size="large" long icon="md-create" @click="editUserPowerModelShow = true">调整用户权限</Button>
					</Col>
					<Col span="3">&nbsp;<!--留白--></Col>
					<Col span="6">
						<Button type="error" size="large" long icon="md-remove-circle" @click="removeUserModelShow = true">移除员工账号</Button>
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
								<Input type="text" v-model="formCheckBlackCarData.carId"  placeholder="请输入黑名单车辆的车牌后五位">
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
								<Select v-model="formNewBlackCarData.newCarIdPartI" size="default" style="width:auto">
									<Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="2">
							<FormItem >
								<Select v-model="formNewBlackCarData.newCarIdPartII" size="default" style="width:auto">
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
		<!--录入新员工账户-->
		<Modal v-model="signInNewUserModelShow" title="录入新员工账户">
			<Form ref="formNewUser" :model="formSignInNewUserData" :rules="signInNewUserRule">
				<FormItem prop="workId" label="工号 / 账号">
					<Input type="text" v-model="formSignInNewUserData.workId" style="width:auto" placeholder="请输入员工工号/账号">
						<Icon type="md-person" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="workerName" label="员工的姓名">
					<Input type="text" v-model="formSignInNewUserData.workerName" style="width:auto" placeholder="请输入员工名字">
						<Icon type="md-bookmark" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="duty" label="员工的职责">
					<Select v-model="formSignInNewUserData.duty" size="default" style="width:auto" placeholder="请选择员工的职责">
						<Option v-for="item in dutyList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="signInNewUserModelSubmit">提 交</Button>
			</div>
		</Modal>
		<!--重设用户密码-->
		<Modal v-model="resetUserPwdModelShow" title="重设用户密码">
			<Form ref="formResetUserPwd" :model="formResetUserPwdModelData" :rules="resetUserPwdRule">
				<FormItem prop="workId" label="工号 / 账号">
					<Input type="text" v-model="formResetUserPwdModelData.workId" style="width:auto" placeholder="请输入员工工号/账号">
						<Icon type="md-person" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="pwd" label="设置新密码">
					<Input type="password" v-model="formResetUserPwdModelData.pwd" style="width:auto" placeholder="请输入他的新密码">
						<Icon type="ios-key" slot="prepend"></Icon>
					</Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="resetUserPwdModelSubmit">提 交</Button>
			</div>
		</Modal>
		<!--重设用户权限-->
		<Modal v-model="editUserPowerModelShow" title="重设用户密码">
			<Form ref="formEditUserPower" :model="formEditUserPowerModelData" :rules="editUserPowerRule">
				<FormItem prop="workId" label="工号 / 账号">
					<Input type="text" v-model="formEditUserPowerModelData.workId" style="width:auto" placeholder="请输入员工工号/账号">
						<Icon type="md-person" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="power" label="设置新权限">
					<Select v-model="formEditUserPowerModelData.power" size="default" style="width:auto" placeholder="请选择员工的职责">
						<Option v-for="item in powerList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="editUserPowerModelSubmit">提 交</Button>
			</div>
		</Modal>
		<!--移除员工账号-->
		<Modal v-model="removeUserModelShow" title="移除员工账号">
			<Form ref="formRemoveUserPower" :model="formRemoveUserModelData" :rules="removeUserRule">
				<FormItem prop="workId" label="工号 / 账号">
					<Input type="text" v-model="formRemoveUserModelData.workId" style="width:auto" placeholder="请输入员工工号/账号">
						<Icon type="md-person" slot="prepend"></Icon>
					</Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="removeUserModelSubmit">提 交</Button>
			</div>
		</Modal>
		<!--登记新收费站-->
		<Modal v-model="signInNewTollModelShow" title="录入新收费站">
			<Form ref="formNewToll" :model="formNewTollData" :rules="signInNewTollRule">
				<FormItem prop="tollName" label="新收费站名字">
					<Input type="text" v-model="formNewTollData.tollName" style="width:auto" placeholder="如: 西安收费站">
						<Icon type="md-home" slot="prepend"></Icon>
					</Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" size="large" long  @click="formNewTollModelSubmit">提 交</Button>
			</div>
		</Modal>

		<!--通用模态框-->
		<Modal :title="generalModelTitle" v-model="generalModelShow" :mask-closable="false">
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
		inject:['gFrameWindow'],
		data:function(){
			return {
				signInNewCarTypeModelShow:false,
				signInNewBlackCarModelShow:false,
				checkBlackCarModelShow:false,
				generalModelShow:false,
				signInNewUserModelShow:false,
				editUserPowerModelShow:false,
				removeUserModelShow:false,
				resetUserPwdModelShow:false,
				signInNewTollModelShow:false,

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
				formSignInNewUserData:{
					workId:"",
					workerName:"",
					duty:""
				},
				formResetUserPwdModelData:{
					workId:"",
					pwd:""
				},
				formEditUserPowerModelData:{
					workId:"",
					power:""
				},
				formRemoveUserModelData:{
					workId:""
				},
				formNewTollData:{
					tollName:""
				},
				formSearchData:{
					beanType:"", 
					carIdPartI:"陕",
					carId:"",
					shift:"",
					dateBegin:"",
					dateEnd:"",
					station:"" // 入口站
				},

				carTypeList:[],

				signInewCarTypeRule:{
					newCarType:[
						{ required: true, message: '请输入其车型', trigger: 'blur' },
						{ type: 'string', max: 10, message: '长度在10字以内', trigger: 'blur' }
					]
				},
				signInBlackCarRule:{
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
				signInNewUserRule:{
					workId:[
						{ required: true, message: '请输入员工工号', trigger: 'blur' },
						{ pattern: /^[0-9]{9,9}$/, message: '员工工号不合法', trigger: 'blur' }
					],
					workerName:[
						{ required: true, message: '请输入员工名字', trigger: 'blur' },
						{ type: 'string', max: 5, message: '长度在5字以内', trigger: 'blur' }
					],
					duty:[
						{ required: true, message: '请选择职责', trigger: 'blur' }
					]
				},
				resetUserPwdRule:{
					workId:[
						{ required: true, message: '请输入员工工号', trigger: 'blur' },
						{ pattern: /^[0-9]{9,9}$/, message: '员工工号不合法', trigger: 'blur' }
					],
					pwd:[
						{ required: true, message: '请输入新密码', trigger: 'blur' },
						{ pattern: /^[A-Za-z0-9]{6,16}$/, message: '密码长度为6-16位英文数字组合', trigger: 'blur' }
					]
				},
				editUserPowerRule:{
					workId:[
						{ required: true, message: '请输入员工工号', trigger: 'blur' },
						{ pattern: /^[0-9]{9,9}$/, message: '员工工号不合法', trigger: 'blur' }
					],
					power:[
						{ required: true, message: '请选择赋予权限', trigger: 'blur' }
					]
				},
				removeUserRule:{
					workId:[
						{ required: true, message: '请输入员工工号', trigger: 'blur' },
						{ pattern: /^[0-9]{9,9}$/, message: '员工工号不合法', trigger: 'blur' }
					]
				},
				signInNewTollRule:{
					tollName:[
						{ required: true, message: '请输入收费站名', trigger: 'blur' },
						{ type: 'string', max: 20, message: '长度在20字以内', trigger: 'blur' }
					]
				},
				formSearchRule:{
					beanType:[
						{ required: true, message: '请选择其车型', trigger: 'blur' }
					],
					carId:[
						{ pattern: /^[A-Z]{1,1}[0-9A-Z]{5,5}$|\s+/, message: '车牌号不合法,输入车牌后六位或防空;正确格式如：A12345', trigger: 'blur' }
					],
					// shift:{

					// },
					dateBegin:[
						{ required: true, message: '请选择开始日期', trigger: 'blur' }
					],
					dateEnd:[
						{ required: true, message: '请选择结束日期', trigger: 'blur' }
					]
					// station:{

					// }
				},

				provinceList:['京','津','冀','晋','蒙','辽','吉','黑','沪','苏','浙','皖',
								'闽','赣','鲁','豫','鄂','湘','粤','桂','琼','渝','川','黔',
								'滇','藏','陕','甘','青','宁','新','台','港','澳'],
				alphabetList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
				dutyList:['其它','员工','班长','站长'],
				powerList:['员工', '管理员', '超级管理员'] // 权限应依次为1 2 3...
			}
		},
		computed:{
			isAdmin(){
				return Store.state.power>=2;
			},
			isSuperAdmin(){
				return Store.state.power>=3;
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
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						}
                    })
                    .then(function (response) {
                        let res = response.data;
                        let isSuccess = res.code=="100";
                        //console.log(res,isSuccess);
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
			},
			signInNewUserModelSubmit(){
				var valipass = true;
				this.$refs['formNewUser'].validate((valid) => {
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
					"WorkId":this.formSignInNewUserData.workId,
					"WorkerName":this.formSignInNewUserData.workerName,
					"Duty":this.formSignInNewUserData.duty
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/RegisterServlet", qs.stringify(jsonMsg),
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
								title: '注册新员工用户成功',
								desc: '新员工用户:'+jsonMsg.WorkerName+'已录入\n(默认权限为一般用户,默认密码为工号后六位)'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '登记新员工用户失败',
								desc: res.code==="101"?'数据库中已存在该用户':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.signInNewUserModelShow = false;
				this.formSignInNewUserData.workId="";
				this.formSignInNewUserData.workerName="";
				this.formSignInNewUserData.duty="";
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

				this.$Loading.start(); // 进度条开始载入
				var jsonMsg = {
					"AccountId":this.formResetUserPwdModelData.workId,
					"NewPwd":md5(this.formResetUserPwdModelData.pwd + Store.state.salt)
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
				this.formResetUserPwdModelData.pwd="";
			},
			editUserPowerModelSubmit(){
				var valipass = true;
				this.$refs['formEditUserPower'].validate((valid) => {
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
					"AccountId":this.formEditUserPowerModelData.workId,
					"Power":this.powerList.indexOf(this.formEditUserPowerModelData.power)+1,
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/ResetPowerServlet", qs.stringify(jsonMsg),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						}
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.code==="100";
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
								title: '移除员工账号成功',
								desc: '员工用户:(工号)'+jsonMsg.AccountId+' 的权限已设为:' + mvue.powerList[parseInt(jsonMsg.Power)-1]
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '移除员工账号失败',
								desc: res.code==="508"?'您的权限不足':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.editUserPowerModelShow = false;
				this.formEditUserPowerModelData.workId="";
				this.formEditUserPowerModelData.power="";
			},
			removeUserModelSubmit(){
				var valipass = true;
				this.$refs['formRemoveUserPower'].validate((valid) => {
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
					"WorkId":this.formRemoveUserModelData.workId
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/RemoveWorkerServlet", qs.stringify(jsonMsg),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						}
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.code==="100";
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
								title: '重设用户权限成功',
								desc: '员工用户:(工号)'+jsonMsg.WorkId+'的账号已注销！'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '重设用户权限失败',
								desc: res.code==="508"?'您的权限不足':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.removeUserModelShow = false;
				this.formRemoveUserModelData.workId="";
			},
			formNewTollModelSubmit(){
				var valipass = true;
				this.$refs['formNewToll'].validate((valid) => {
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
					"TollName":this.formNewTollData.tollName
				};
				var mvue = this;// 向内传vue实体
				// 采用字符串方式发送
				axios.post(Store.state.server+"/SignInTollServlet", qs.stringify(jsonMsg),
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						}
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.code==="100";
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
								title: '添加新收费站成功',
								desc: '收费站:'+jsonMsg.TollName+' 已添加！'
							});
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Notice.error({
								title: '添加新收费站失败',
								desc: res.code==="508"?'您的权限不足':res.msg
							});
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						mvue.$Loading.error(); // 进度条载入失败
					});
				// 清空数据
				this.signInNewTollModelShow = false;
				this.formNewTollData.tollName="";
			},
			searchSubmit(){
				//console.log(this.formSearchData.dateBegin,this.formSearchData.dateEnd);
				var valipass = true;
				this.$refs['formSearch'].validate((valid) => {
                    if (!valid) {
						this.$Notice.error({
								title: '表单填写有误',
								desc: '请检查您的输入!'
							});
                        valipass = false;
                    } 
                });
				if(!valipass) return;
				let url='/search?'+
					'beanType='+ this.formSearchData.beanType +
					'&&carIdPartI='+ this.formSearchData.carIdPartI +
					'&&carId='+ this.formSearchData.carId +
					'&&shift='+ this.formSearchData.shift +
					'&&dateBegin='+ this.formSearchData.dateBegin +
					'&&dateEnd='+ this.formSearchData.dateEnd +
					'&&station='+ this.formSearchData.station;
				console.log()

				this.$router.push(url); // 跳到搜索页
			},
			setDateBegin(value,type){
				this.$refs['formSearch'].validate((valid) => {});
				this.formSearchData.dateBegin=value;
			},
			setDateEnd(value,type){
				this.$refs['formSearch'].validate((valid) => {});
				this.formSearchData.dateEnd=value;
			}

		}
    }
</script>

<!--
<Row>
	<Col span="6">
		<Button icon="ios-car" size="large" long to="/">升 档 车 辆</Button>
	</Col>
	<Col span="3">&nbsp;</Col>
	<Col span="6">
		<Button icon="ios-car" size="large" long to="/">运输联合收割机车辆</Button>
	</Col>
	<Col span="3">&nbsp;</Col>
	<Col span="6">
		<Button icon="ios-car" size="large" long to="/">专用作业车 (入 口)</Button>
	</Col>
</Row>
<br></br>
<Row>
	<Col span="6">
		<Button icon="ios-car" size="large" long to="/">专用作业车 (出 口)</Button>
	</Col>
	<Col span="3">&nbsp;</Col>
	<Col span="6">
		<Button icon="ios-car" size="large" long to="/">大件运输车 (入 口)</Button>
	</Col>
	<Col span="3">&nbsp;</Col>
	<Col span="6">
	<Button icon="ios-car" size="large" long to="/">大件运输车 (出 口)</Button>
	</Col>
</Row>
-->