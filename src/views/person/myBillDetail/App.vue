<template>
	<!--	我的船舶-->
	<div id="container">
		<pen-header title="我的发票"></pen-header>
		<div class="body">
		</div>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import download from "@/assets/img/person/下载.png";
	import {
		mixins
	} from "../mixins/mixins"
	import {
		mapState
	} from "vuex";
	export default {
		mixins: [mixins],
		data() {
			return {
				download
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
		async mounted() {
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
					window.location.href = window.location.origin + this.serverAddr + '/personal/myContract'
				}
			},
		},

	};
</script>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");

	#container {
		.body {
			font-size: 0.29rem;
			background: @backgroundColor;
			padding: 0 0.2rem 0.2rem 0.2rem;
			.header-place {
				height: 1rem;
			}
			.list-place {
				position: fixed;
				top: 1rem;
				left: 0.2rem;
				right: 0.2rem;
				padding-top: 0.2rem;
				z-index: 9;
				background-color: @backgroundColor;
			}
			.list-header {
				background: white;
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				margin: 0 auto;
				ul {
					width: 100%;
					display: flex;
					height: 0.8rem;

					li {
						height: 100%;
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: center;

						span {
							color: #666666;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}

	.active {
		color: #343434 !important;
		border-bottom: 3px solid #2878BE;
	}
</style>
