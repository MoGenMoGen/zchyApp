<template>
	<!--	我的发票-->
	<div id="container">
		<pen-header title="发票详情"></pen-header>
		<div class="body">
			<div class="info-box">未开金额：<span style="color: red;">{{fmoney(canOpenSum - openedSum)}}</span></div>
			<div class="info-box">已开金额：<span style="color: red;">{{fmoney(openedSum)}}</span></div>
		</div>
		<div class="body">
			<div class="info-box" v-for="(item,index) in list" :key="index">
				<div class="classTitle">
					<img :src="tradingL">
					<p>发票信息</p>
					<img :src="tradingR">
				</div>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><p class="row-label">发票状态：{{item.statusMsg}}</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><p class="row-label">发票类型：{{item.invoiceKind}}</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><p class="row-label">发票抬头：{{item.payerName}}</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><p class="row-label">发票代码：{{item.invoiceCode}}</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><p class="row-label">发票号码：{{item.invoiceNo}}</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><p class="row-label">微信扫码获取电子普通发票：</p></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1"><vue-qr :text="item.qrCode" :size="200"></vue-qr></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
				    <van-col offset="1" @click="downLoadImg(item.pdfUrl)">
						<p class="row-label"><img :src="download" class="download" style="width: 0.27rem;height: 0.27rem;" >下载电子普通发票</p>
					</van-col>
				</van-row>
			</div>
		</div>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import download from "@/assets/img/person/下载.png";
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import { Toast } from 'vant';
	import vueQr from 'vue-qr'
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
				tradingL,
				tradingR,
				download,
				id: '',
				isOver: true,
				list: [],
				openedSum: '',
				canOpenSum: ''
			};
		},
		components: {
			penHeader,vueQr
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
			this.id = this.until.getQueryString('orderCd')
			this.api.getInvoiceResult({orderNo:this.id}).then(res => {
			  console.log(res)
			  this.list = res.data.list
			  this.openedSum = res.openedSum
			  this.canOpenSum = res.canOpenSum
			})
		},
		methods: {
			fmoney(s, n) {
			    n = n > 0 && n <= 20 ? n : 2;
			    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
			    var t = "";
			    for (let i = 0; i < l.length; i++) {
			        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			    }
			    return t.split("").reverse().join("") + "." + r;
			},
			//切换设备
			changeDevice() {
				console.log("=========== " + window.location.pathname + " ===========")
				let isPC = this.app.IsPC()
				if (isPC) {
					window.location.href = window.location.origin + this.serverAddr + '/personal/myContract'
				}
			},
			downLoadImg(url) {
			  window.open(url)
			}
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
				.classTitle{
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 0.3rem;
					color: #303030;
					position: relative;
					img{
						width: 1.2rem;
					}
					p {
						margin: 0 0.3rem;
					}
				}
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
