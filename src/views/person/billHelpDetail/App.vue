<template>
	<!--发票帮助详情-->
	<div id="container" :style="{backgroundImage:'url('+bg+')'}">
		<pen-header title="发票帮助详情"></pen-header>
		<div class="top">
			<div class="top-1" :style="{backgroundImage:'url('+bg+')'}">
			</div>
			<div class="top-2">
				<van-row class="row" align="center" type="flex">
					<van-col span="24">
						<p style="text-align: center;color: #343434;font-size: 0.3rem;font-weight: bold">{{info.title}}</p>
					</van-col>
				</van-row>
				<div class="info" v-html="info.cont">

				</div>
			</div>


		</div>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import bg from '@/assets/img/bg.png'
	import {
		mapState
	} from "vuex";

	export default {

		data() {
			return {
				bg,
				info: {}, 
			};
		},
		components: {
			penHeader,
		},
		computed: {
			...mapState([
				'serverAddr'
			])
		},
		async created() {

		},
		update() {
			document.getElementsByTagName('img').width = "100%"
			document.getElementsByTagName('img').objectFit = "cover";
			document.getElementsByTagName('iframe').width = "100%"
			document.getElementsByTagName('table').width = "100%"
		},
		mounted() {
			let id = this.until.getQueryString("id")
			this.getDetail(id)
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
			//切换设备
			changeDevice() {
				console.log("=========== " + window.location.pathname + " ===========")
				let isPC = this.app.IsPC()
				if (isPC) {
					let id = this.until.getQueryString("id")
					window.location.href = window.location.origin + this.serverAddr + '/tradeInfo/infoDetail?id=' + id
				}
			},
			async getDetail(id) {
				let res = await this.api.getBillHelpDetail(id)
				this.info = res.data
			},
		}
	};
</script>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");

	#container {
		width: 100%;
		height: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center top;
		background-color: #F1F3F2;

		.top {
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			flex-direction: column;
			padding: 0 0.2rem;

			.top-1 {
				width: 100%;
				background-size: 100% 100% !important;
			}

			.top-2 {
				border-radius: 5px;
				background: white;
				padding: 0.3rem 0.2rem;
				min-height: calc(~"100vh - 1.8rem");
				.row {
					margin-bottom: 0.2rem;
				}

				.info {
					overflow-x: hidden;
					max-width: 100%;

					img {
						-ms-interpolation-mode: bicubic;
					}

					img {
						width: 90%;
					}
				}
			}

		}



	}
</style>
