<template>
	<div id="container">
		<pen-header title="我的发票"></pen-header>
		<div class="body">
			<div class="info-box">
				<div class="classTitle">
					<img :src="tradingL">
					<p>电子普通发票信息</p>
					<img :src="tradingR">
				</div>
				<van-row class="row" align="center" type="flex">
					<van-col span="1"></van-col>
				    <van-col span="7"><p class="row-label">订单编号：</p></van-col>
				    <van-col span="15" offset="1"><p class="row-label">ddbh</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
				    <van-col span="7"><p class="row-label">发票类型：</p></van-col>
				    <van-col span="15" offset="1"><p class="row-label">ddbh</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
				    <van-col span="7"><p class="row-label">抬头类型：</p></van-col>
				    <van-col span="15" offset="1"><p class="row-label">ddbh</p></van-col>
				</van-row>
			</div>
		</div>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
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
			.info-box {
				width: 100%;
				padding: 0.4rem 0.5rem;
				box-sizing: border-box;
				background-color: #fff;
				border-radius: 5px;
				margin-top: 0.1rem;
			}
			.row{
			    padding: 0.2rem 0;
			    flex-shrink: 0;
				font-size: 0.24rem;
			    input{
			        border: 1px solid #DDDDDD;
			        padding: 0.1rem 0.2rem;
			        width: 85%;
					font-size: 0.22rem;
			    }
				.row-label{
				    color: #333333;
				}
			    input::-webkit-input-placeholder {
			        color: #B8B8B8;
			    }
			    input::-moz-placeholder {
			        /* Mozilla Firefox 19+ */
			        color: #B8B8B8;
			    }
			    input:-moz-placeholder {
			        /* Mozilla Firefox 4 to 18 */
			        color: #B8B8B8;
			    }
			    input:-ms-input-placeholder {
			        /* Internet Explorer 10-11 */
			        color: #B8B8B8;
			    }
			}
		}
	}
</style>
