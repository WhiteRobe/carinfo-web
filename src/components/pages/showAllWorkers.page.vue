<style>
.backToMainPageInShowAllWorkersPage{
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
							<Col span="4"> <b>UID</b></Col>
							<Col span="5"> <b>工号</b></Col>
							<Col span="4"> <b>工人名</b></Col>
							<Col span="4"> <b>职责</b></Col>
							<Col span="5"> <b>所属</b></Col>
							<Col span="1"> 
								<Tooltip content="刷新页面数据"><Icon type="md-refresh-circle" color="#19be6b" @click="refreshData" size="24"/></Tooltip>
							</Col>
						</Row>
						<div v-for="(item,index) in searchResult" :key="index">
							<div>
								<Card :bordered="false">
									<Row>
										<Col span="1"> &nbsp;</Col>
										<Col span="4"> <b>{{item.UID}}</b></Col>
										<Col span="5"> <b>{{item.WorkId}}</b></Col>
										<Col span="4"> <b>{{item.WorkerName}}</b></Col>
										<Col span="4"> <b>{{item.Duty}}</b></Col>
										<Col span="6"> <b>{{item.Station}}</b></Col>
									</Row>
								</Card>
							</div>
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
        	<div class="backToMainPageInShowAllWorkersPage">返回首页</div>
    	</BackTop>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../store.js';
	import SearchWidge from "./widge/search.widge.vue";
	import axios from 'axios';
	export default {
		name:"ShowAllWorkersPage",
		data:function(){
			return{
				spinShow:false,
				totalHitNum:0, // 总结果数
				searchResult:[], // 搜索结果
				currentPageIndex:1, // 当前页码
				searchResultCache:[] // 搜索结果的缓存
			}
		},
		created(){
			// 一次性拉取所有数据，在前端分页
			this.getPageData();
		},
		computed:{},
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
				this.currentPageIndex = page_index; // 服务器的页码从0记起，前端从1记起
				this.updataPageView();
			},
			updataPageView(){
				this.searchResult.splice(0, this.searchResult.length);// 清空显示内容
				let from = (this.currentPageIndex-1)*10; // 每页十个人
				let to = Math.min(this.currentPageIndex*10, this.searchResultCache.length); // 取小值防止越界
				for(var i=from; i<to; i++){
					this.searchResult.splice(i-from, 1, this.searchResultCache[i]);
				}
			},
			refreshData(){
				this.getPageData();
			},
			getPageData(){
				this.currentPageIndex = 1;
				// 获取某一页的数据
				this.$Loading.start();
				this.spinShow = true;
				var mvue = this;
				//console.log(this.formSearchData);
				axios.get(Store.state.server+'/GetAllPeopleServlet',
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							"Token":Store.state.token
						},
						params:{}
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
							console.log(res);
							mvue.searchResultCache = res.data;
							mvue.totalHitNum = res.data.length; // 强制转化为int
							mvue.updataPageView();
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
		}
	}
</script>