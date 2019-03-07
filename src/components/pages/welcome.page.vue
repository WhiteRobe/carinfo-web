<style>
</style>
<template>
	<Spin size="large" fix></Spin>
</template>
<script type="text/javascript">
	export default{
		name:"WelcomePage",
		data:function(){
			return{
				
			}
		},
		beforeRouteEnter (to, from, next) {
			next("/login");
		}
	}
</script>