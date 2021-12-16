<template>
	<div>
		<iframe :src="iframeUrl" class="frame-box" frameborder="0"></iframe>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				iframeUrl: '',
				typeCd: 1, //1 船舶设计进入，不需要登录 2船舶商城进入，不需要登录 3船舶档案进去，需要登录
				id: ''
			};
		},
		components: {},
		computed: {
			...mapState([
				'price',
				'serverAddr'
			])
		},
		watch: {},
		async created() {
			this.typeCd = this.until.getQueryString('typeCd')
			this.id = this.until.getQueryString('id')
			if (this.typeCd == 3) {
				if (!this.until.loGet('currentRole')) {
					this.$dialog.confirm({
							title: '提示',
							message: '您未登录，立即登录?',
						}).then(() => {
							window.location.href = '../home/login.html'
						})
						.catch(() => {

						});
					return
				} else {
					let orgEnterId = JSON.parse(this.until.loGet('currentRole')).id
					this.api.shipInfoBasic(this.id, {
						orgEnterId: orgEnterId
					}).then(res => {
						this.iframeUrl = res.vrUrl.split(',')[1]
					})
				}
			} else if (this.typeCd == 1) {
				this.api.designFileDetail(this.id).then(res => {
					this.iframeUrl = res.vrUrl.split(',')[1]
				})
			} else if (this.typeCd == 2) {
				this.api.productGetVr(this.id).then(res => {
					this.iframeUrl = res.msg.split(',')[1]
				})
			}
		},
		async mounted() {},
		methods: {
			toPage(url) {
				this.until.href(url)
			},
		},
	};
</script>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");

	.frame-box {
		width: 100vw;
		height: 100vh;
	}
</style>
