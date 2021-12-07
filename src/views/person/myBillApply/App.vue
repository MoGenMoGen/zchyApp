<template>
	<div id="container">
		<van-popup v-model="showPicker" round position="bottom">
			<van-picker show-toolbar :columns="invoiceType" value-key="nm" @cancel="showPicker = false"
				@confirm="onConfirm" />
		</van-popup>
		<van-popup v-model="showPicker2" round position="bottom">
			<van-picker show-toolbar :columns="headUpType" value-key="label" @cancel="showPicker2 = false"
				@confirm="onConfirm2" />
		</van-popup>
		<pen-header title="我的发票"></pen-header>
		<div class="body" style="padding-bottom: 0;">
			<div class="info-box">未开金额：<span style="color: red;">{{canOpenSum - openedSum}}</span></div>
		</div>
		<div class="body">
			<div class="info-box">
				<div class="classTitle">
					<img :src="tradingL">
					<p>电子发票信息</p>
					<img :src="tradingR">
				</div>
				<van-row class="row" align="center" type="flex">
					<van-col span="1"></van-col>
					<van-col span="7">
						<p class="row-label">订单编号：</p>
					</van-col>
					<van-col span="15" offset="1">
						<p class="row-label">{{orderCd}}</p>
					</van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">发票类型：</p>
					</van-col>
					<van-col span="15" offset="1"
						style="display: flex;align-items: center;justify-content: space-between;">
						<p @click="showPicker=true" style="flex:1"><span v-if="invoice">{{invoice}}</span><span
								v-else>请选择</span></p>
						<van-icon name="arrow" />
					</van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">抬头类型：</p>
					</van-col>
					<van-col span="15" offset="1"
						style="display: flex;align-items: center;justify-content: space-between;">
						<p @click="showPicker2=true" style="flex:1"><span v-if="headUp">{{headUp}}</span><span
								v-else>请选择</span></p>
						<van-icon name="arrow" />
					</van-col>
				</van-row>
				<van-row class="row" align="center" type="flex" v-if="headUp!='个人'">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">单位名称：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入单位名称" v-model="buyerName"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex" v-if="headUp=='个人'">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">发票抬头：</p>
					</van-col>
					<van-col span="15" offset="1"><input v-model="buyerName"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex" v-if="headUp=='个人'">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">收票人邮箱：</p>
					</van-col>
					<van-col span="15" offset="1"><input v-model="email"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex" v-if="headUp!='个人'">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">纳税人识别号：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入纳税人识别号" v-model="buyerTaxNum"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1"></van-col>
					<van-col span="7">
						<p class="row-label">备注：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入备注" v-model="rmks"></van-col>
				</van-row>
			</div>
			<div class="info-box" v-if="!flag">
				<div class="classTitle">
					<img :src="tradingL">
					<p>资质信息</p>
					<img :src="tradingR">
				</div>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">地址：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入地址" v-model="buyerAddress"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">电话：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入电话" v-model="buyerTel"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">开户银行：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入开户银行" v-model="bank"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">银行账户：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入银行账户" v-model="account"></van-col>
				</van-row>
			</div>
			<div class="info-box" v-if="!flag">
				<div class="classTitle">
					<img :src="tradingL">
					<p>收票信息</p>
					<img :src="tradingR">
				</div>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;"></van-col>
					<van-col span="7">
						<p class="row-label">收票人姓名：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入收票人姓名" v-model="linkman"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;"></van-col>
					<van-col span="7">
						<p class="row-label">收票人手机号：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入收票人手机号" v-model="phone"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;"></van-col>
					<van-col span="7">
						<p class="row-label">收票人地区：</p>
					</van-col>
					<van-col span="15" offset="1" style='display: flex;align-items: center;'>
						<addr @changeAddr="changeAddr" :addrNm="addrNm" ref="addrC"></addr>
						<van-icon name="arrow-down" />
					</van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;"></van-col>
					<van-col span="7">
						<p class="row-label">收票人地址：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入收票人地址" v-model="address"></van-col>
				</van-row>
				<van-row class="row" align="center" type="flex">
					<van-col span="1" style="color:#FF2015;">*</van-col>
					<van-col span="7">
						<p class="row-label">收票人邮箱：</p>
					</van-col>
					<van-col span="15" offset="1"><input placeholder="输入收票人邮箱" v-model="email"></van-col>
				</van-row>
			</div>
		</div>
		<b-button2 left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import addr from "../../../components/addr";
	import bButton2 from "../../../components/personal/bButton2";
	import {
		Toast
	} from 'vant';
	import {
		Dialog
	} from 'vant';
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
				showPicker: false,
				showPicker2: false,
				invoiceType: [],
				invoice: '',
				headUpType: [{
					value: '1',
					label: '公司'
				}, {
					value: '2',
					label: '个人'
				}],
				headUp: '',
				id: '',
				orderCd: '',
				invoice: '',
				invoiceCd: '',
				headUp: '',
				rmks: '',
				buyerName: '',
				buyerTaxNum: '',
				buyerTel: '',
				bank: '',
				account: '',
				buyerAddress: '',
				linkman: '',
				phone: '',
				address: '',
				addrNm: "",
				email: '',
				type: '',
				openedSum: '',
				canOpenSum: '',
				flag: false //true为增值税电子普通发票,公司个人下面没有， false为增值税专用发票，公司有下面
			};
		},
		components: {
			penHeader,
			addr,
			bButton2
		},
		computed: {
			...mapState([
				'serverAddr'
			])
		},
		async created() {

		},
		async mounted() {
			this.id = this.until.getQueryString('id')
			this.orderCd = this.until.getQueryString('orderCd')
			this.api.getInvoiceResult({orderNo:this.orderCd}).then(res => {
				console.log(res)
			  this.openedSum = res.openedSum
			  this.canOpenSum = res.canOpenSum
			})
			this.api.dataDictionary('INVOICE_TYPE').then(res => {
				this.invoiceType = res
			})
			if(this.until.loGet('currentRole')) {
				this.getDefault()
			} else {
				this.headUpType = [{
					value: '2',
					label: '个人'
				}]
			}
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
			onConfirm(e) {
				this.invoice = e.nm
				this.invoiceCd = e.cd
				if(this.headUp=='公司') {
					if(this.invoiceCd == 'INVOICE_TYPE.10') {
					  this.flag = true
					} else {
					  this.flag = false
					}
				} else {
					this.flag = true
				}
				this.showPicker = false
			},
			onConfirm2(e) {
				this.headUp = e.label
				this.type = e.value
				this.showPicker2 = false
				if (this.headUp == '个人') {
					this.buyerName = '个人'
					this.invoiceType.splice(0,1)
					this.invoice = ''
					this.invoiceCd = ''
					this.flag = true
				} else {
					if(this.invoiceCd == 'INVOICE_TYPE.10') {
					  this.flag = true
					} else {
					  this.flag = false
					}
					let param = {
						orgEnterId: JSON.parse(this.until.loGet('currentRole')).id
					}
					this.api.getQualiInfo(param).then(res => {
						this.buyerName = res.data.nm
					})
					this.api.dataDictionary('INVOICE_TYPE').then(res => {
						this.invoiceType = res
					})
				}
			},
			changeAddr(e) {
				let data = JSON.parse(e)
				this.addrNm = data.province + '-' + data.city + '-' + data.region
			},
			leftClick() {
				this.until.back()
			},
			rightClick() {
				let param
				if (this.invoice == "") {
					Toast('请选择发票类型!')
					return
				}
				if (this.headUp == '') {
					Toast('请选择抬头类型!')
					return
				} else if (this.headUp == '公司'&&!this.flag) {
					if (this.buyerName == '') {
						Toast('请输入单位名称!')
						return
					}
					if (this.buyerAddress == "") {
						Toast('请输入地址!')
						return
					}
					if (this.buyerTaxNum == '') {
						Toast('请输入纳税人识别号!')
						return
					}
					if (this.reg.checkPhone(this.buyerTel) != 'ok') {
						Toast('请输入正确电话!')
						return
					}
					if (this.bank == "") {
						Toast('请输入开户银行!')
						return
					}
					if (this.account == "") {
						Toast('请输入银行账户!')
						return
					}
					// if(this.linkman=="") {
					//   Toast('请输入收票人姓名!')
					//   return
					// }
					// if(this.reg.checkPhone(this.phone)!='ok'){
					//     Toast('请输入正确收票人手机号!')
					//     return
					// }
					// if(this.address=="") {
					//   Toast('请输入收票人地址!')
					//   return
					// }
					if (this.email == "") {
						Toast('请输入收票人邮箱!')
						return
					}
					param = {
						orgEnterId: JSON.parse(this.until.loGet('currentRole')).id,
						orderId: this.id,
						orderCd: this.orderCd,
						type: this.type,
						invoiceTypeCd: this.invoiceCd,
						buyerName: this.buyerName,
						buyerTaxNum: this.buyerTaxNum,
						buyerTel: this.buyerTel,
						buyerAddress: this.buyerAddress,
						buyerAccount: this.bank + this.account,
						linkman: this.linkman,
						phone: this.phone,
						email: this.email,
						rmks: this.rmks,
						invoiceAddr: this.addrNm.replace(/-/g, '') + this.address
					}
				} else if (this.headUp=='公司'&&this.flag) {
					if (this.buyerName == '') {
						Toast('请输入单位名称!')
						return
					}
					if (this.buyerTaxNum == '') {
						Toast('请输入纳税人识别号!')
						return
					}
					param = {
						orgEnterId: JSON.parse(this.until.loGet('currentRole')).id,
						orderId: this.id,
						orderCd: this.orderCd,
						type: this.type,
						invoiceTypeCd: this.invoiceCd,
						buyerName: this.buyerName,
						buyerTaxNum: this.buyerTaxNum,
						buyerTel: this.buyerTel,
						buyerAddress: this.buyerAddress,
						buyerAccount: this.bank + this.account,
						linkman: this.linkman,
						phone: this.phone,
						email: this.email,
						rmks: this.rmks,
						invoiceAddr: this.addrNm.replace(/-/g, '') + this.address
					}
				} else {
					if (this.email == "") {
						Toast('请输入收票人邮箱!')
						return
					}
					param = {
						orgEnterId: JSON.parse(this.until.loGet('currentRole')).id,
						orderId: this.id,
						orderCd: this.orderCd,
						type: this.type,
						invoiceTypeCd: this.invoiceCd,
						buyerName: this.buyerName,
					}
				}
				Dialog.confirm({
					title: '提示',
					message: '是否确认申请',
				}).then(() => {
					this.api.invoiceApply(param).then(res => {
						if (res.msg == '成功') {
							Toast('申请成功')
							setTimeout(() => {
								this.until.back()
							}, 1000)
						}
					})
				}).catch(() => {

				});

			},
			getDefault() {
				let param = {
					orgEnterId: JSON.parse(this.until.loGet('currentRole')).id
				}
				this.api.getQualiInfo(param).then(res => {
					if (res.data) {
						this.quaName = res.data.nm
						this.buyerName = res.data.nm
						this.buyerTel = res.data.tel
						this.buyerTaxNum = res.data.taxNum
						this.buyerAddress = res.data.address
						this.bank = res.data.bank
						this.account = res.data.account
					}
				})
				this.api.getQualiAddrInfo(param).then(res => {
					if (res.data.list.length > 0) {
						this.linkman = res.data.list[0].linkman
						this.phone = res.data.list[0].phone
						this.address = res.data.list[0].addrDetail
						this.addrNm = res.data.list[0].addrNm
						this.email = res.data.list[0].email
						console.log(this.addrNm)
						this.$refs.addrC.getProvice(this.addrNm)
					}
				})
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

				.classTitle {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 0.3rem;
					color: #303030;
					position: relative;

					img {
						width: 1.2rem;
					}

					p {
						margin: 0 0.3rem;
					}
				}
			}

			.row {
				padding: 0.2rem 0;
				flex-shrink: 0;
				font-size: 0.24rem;

				input {
					border: 1px solid #DDDDDD;
					padding: 0.1rem 0.2rem;
					width: 85%;
					font-size: 0.22rem;
				}

				.row-label {
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
