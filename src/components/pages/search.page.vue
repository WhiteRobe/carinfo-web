<style>
.backToMainPage{
        padding: 10px;
        background: rgba(0, 153, 229, .7);
        color: #fff;
        text-align: center;
        border-radius: 2px;
    }
</style>
<template>
	<div style="top:32px;position: relative;position: relative;">
		<Row>
			<Col span="2">&nbsp;</Col>
			<Col span="20">
				<Breadcrumb>
					<BreadcrumbItem to="/main"><Icon type="md-home"></Icon>&nbsp;返回首页</BreadcrumbItem>
					<BreadcrumbItem>检索结果显示页面</BreadcrumbItem>
				</Breadcrumb>
				<Divider orientation="left">检索结果</Divider>
				<div v-if="totalHitNum<=0">
					<Alert show-icon>
						没有任何结果
						<Icon type="ios-bulb-outline" slot="icon"></Icon>
						<template slot="desc">请检查您的搜索关键字及筛选方案</template>
					</Alert>
					<Button size="large" long type="primary" @click="backToMainPageEvent"><Icon type="md-arrow-round-back" />&nbsp;返 回 首 页</Button>
				</div>
				<div v-else>
					<Card :bordered="false" dis-hover>
						<Row slot="title">
							<Col span="1"> &nbsp;</Col>
							<Col span="2"> <b>车牌号</b></Col>
							<Col span="3"> <b>时间</b></Col>
							<Col span="3"> <b>处理人</b></Col>
							<Col span="2"> <b>班次</b></Col>
							<Col span="3"> <b>班长</b></Col>
							<Col span="3"> <b>入口站</b></Col>
							<Col span="3"> <b>出口站</b></Col>
							<Col span="3"> <b>操作</b></Col>
							<Col span="1"> 
								<Tooltip content="刷新页面数据"><Icon type="md-refresh-circle" color="#19be6b" @click="refreshData" size="24"/></Tooltip>
							</Col>
						</Row>
						<div v-for="(item,index) in searchResult" :key="index">
							<search-widge :info="item" :beanType="formSearchData.beanType"></search-widge>
							<Divider dashed v-if="index!=searchResult.length-1"/>
						</div>
					</Card>
				</div>
				<Divider/>
				<Row>
					<!--页码导航-->
					<div style="text-align: center;margin: auto;">
						<Page :total="totalHitNum" show-elevator @on-change="changePage" show-total :page-size="10"/>
					</div>
				</Row>
			</Col>
			<Col span="2">&nbsp;</Col>
		</Row>
		<Spin size="large" fix v-if="spinShow"></Spin>
		<BackTop :height="0" :bottom="100" @on-click="backToMainPageEvent">
        	<div class="backToMainPage">返回首页</div>
    	</BackTop>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../store.js';
	import SearchWidge from "./widge/search.widge.vue";
	import axios from 'axios';
	export default {
		name:"SearchPage",
		data:function(){
			return{
				spinShow:false,
				totalHitNum:0, // 总结果数
				searchResult:[], // 搜索结果

				formSearchData:{
					beanType:"", 
					carIdPartI:"陕",
					carId:"",
					shift:"",
					dateBegin:"",
					dateEnd:"",
					station:"",
					page:1
				}
			}
		},
		created(){
			this.formSearchData.beanType = this.$route.query.beanType;
			this.formSearchData.carIdPartI = this.$route.query.carIdPartI;
			this.formSearchData.carId = this.$route.query.carId;
			this.formSearchData.shift = this.$route.query.shift;
			this.formSearchData.dateBegin = this.$route.query.dateBegin;
			this.formSearchData.dateEnd = this.$route.query.dateEnd;
			this.formSearchData.station = this.$route.query.station;
			this.formSearchData.exitStation = this.$route.query.exitStation;
			this.getPageData();
		},
		computed:{
			
		},
		methods:{
			tokenLost(str){
				let pattern = /^20[1-9]{1,1}$/;
				if(pattern.test(str)){
					return true;
				}
				return false;
			},
			backToMainPageEvent(){
				this.$router.push('/main'); // 返回首页
			},
			changePage(page_index){
				// 改变页码
				this.formSearchData.page = page_index; // 服务器的页码从0记起，前端从1记起
				this.getPageData();
			},
			refreshData(){
				this.getPageData();
			},
			getPageData(){
				// 获取某一页的数据
				this.$Loading.start();
				this.spinShow = true;
				var mvue = this;
				//console.log(this.formSearchData);
				axios.get(Store.state.server+'/SearchCarBeanServlet',
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						},
						params:{
							"BeanType":mvue.formSearchData.beanType,
							"CarId":mvue.formSearchData.carId===""?"":mvue.formSearchData.carIdPartI+mvue.formSearchData.carId,
							"Shift":mvue.formSearchData.shift,
							"DateBegin":mvue.formSearchData.dateBegin,
							"DateEnd":mvue.formSearchData.dateEnd,
							"Station":mvue.formSearchData.station,
							"ExitStation":mvue.formSearchData.exitStation,
							"Page":mvue.formSearchData.page
						}
					})
					.then(function (response) {
						mvue.$Loading.finish();
						mvue.spinShow = false;
						let res = response.data;
						let isSuccess = res.code==="100";
						if(mvue.tokenLost(res.code)){
							mvue.$Notice.warning({
								title: '登录已过期',
								desc: '请重新登录'
							});
							Store.commit('offline'); // 设置登录状态
							mvue.$Loading.error(); // 进度条载入失败
							mvue.$router.push("/login"); // 跳转到主页面
							return;
						}
						if(isSuccess){
							//console.log(res);
							// 最后一行为一个数字，即总搜索命中数
							mvue.searchResult.splice(0,mvue.searchResult.length);// 清空显示内容
							for(var i=0;i<res.data.length-1;i++){
								mvue.searchResult.splice(i,1,res.data[i]);
							}
							mvue.totalHitNum = parseInt(''+res.data[res.data.length-1]); // 强制转化为int
						} else {
							mvue.$Notice.error({
								title: '获取数据失败',
								desc: res.msg
							});
							mvue.$router.push('/main'); // 返回首页
						}
					})
					.catch(function (error) {
						mvue.$Loading.error();
						mvue.$Message.error('载入页面数据失败，请刷新重试');
						console.log(error);
					});
			},
		},
		components:{
			'search-widge':SearchWidge
		}
	}
</script>