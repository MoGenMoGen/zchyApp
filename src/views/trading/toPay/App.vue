<template>
	<div class="trading">

		<my-header title="支付"></my-header>
		<div class="main">
			<div class="orderInfo">
				<p>订单信息</p>
				<div>
					<p>订单编号：{{info.orderCd}}</p>
					<p>商品名称：{{proNm}}</p>
					<p>订单金额：￥{{info.orderPrice}}</p>
					<p>订单时间：{{info.crtTm}}</p>
				</div>
			</div>
			<div class="payType">
				<div class="item" v-for="(item,index) in list" :key="item.id" :class="{active:selectId==item.id}" @click="toChoose(item)">
					<div class="itemCont">
						<div>
							<p>
								<img class="checked" :src="checked" v-if="item.id==selectId">
								<img class="checked" :src="unChecked" v-else>
								<img class="type" :src="item.img">
								<span>{{item.nm}}</span>
							</p>
						</div>

						<div v-if="item.id==selectId" class="money">
							支付<span>{{info.orderPrice}}</span>元
						</div>
					</div>
					<div class="uploadImg"  v-if="item.id==4 && selectId==item.id ">
						<van-uploader v-model="fileList" multiple
									  :after-read="afterRead"
									  :max-size="1024 * 1024 * 5"
									  @delete="deletImg"
									  @oversize="onOversize" />
					</div>
					<div class="bankList" v-show="item.id==1 && selectId==item.id ">
						<div class="list">
							<van-radio-group v-model="brankId" direction="horizontal">
								<van-radio :name="v.id" v-for="(v,i) in brandList" :key="i">
									<van-image width="2.5rem" height="0.8rem" :src="v.imgUrl" fit="contain" class="img" />
								</van-radio>
							</van-radio-group>
						</div>
						<button>到网上银行支付</button>
					</div>

				</div>
			</div>
		</div>
		<div class="foot" @click="toPay">
			确认支付
		</div>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	import myHeader from '@/components/myHeader'

    import checked from '@/assets/img/已勾选.png'
    import unChecked from '@/assets/img/未勾选.png'
    import zhifubao from '@/assets/img/zhifubao.png'
    import weixin from '@/assets/img/weixin.png'
    import xianxia from '@/assets/img/xianxia.png'
    import yinlian from '@/assets/img/yinlian.png'
    import fenqi from '@/assets/img/分期.png'
    // import suc from '../../assets/img/success.png'
    // import close from "@/assets/img/close.png"
    // import wxPayIcon from '@/assets/img/wxPay.png'
    // import timeOut from "../../components/timeOut/timeOut";
    // import delImg from '@/assets/img/personal/del.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                id:'',
				info:{},
				proNm:'',
                brankId: 1,
                fileList:[],
                // fenqiShow:false,
                checked,
                unChecked,
                brandList: [{
                    id: 1,
                    imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/ea6b01f89744454288c94b2d69a943bc-%E4%B8%AD%E4%BF%A1%E9%93%B6%E8%A1%8C.png',
                }, {
                    id: 2,
                    imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/ad7f521c4c6842d4a861c08ae29e32d8-%E4%B8%AD%E5%9B%BD%E9%93%B6%E8%A1%8C.png',
                }, {
                    id: 3,
                    imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/76dd67e91e434738bc233f4c50013be9-%E6%8B%9B%E5%95%86%E9%93%B6%E8%A1%8C.png',
                }, {
                    id: 4,
                    imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/833332c7489e49048fcb0ed6216984b4-%E9%82%AE%E6%94%BF.png',
                },{
                    id:5,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/685e958a19984a3685b3f4e66616ab62-%E5%85%B4%E4%B8%9A%E9%93%B6%E8%A1%8C.png'
                },{
                    id:6,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/0c6adffd42a24b6889e395dc4fa275e0-%E4%B8%8A%E6%B5%B7%E9%93%B6%E8%A1%8C.png'
                },{
                    id:7,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/3b76c25c3b51436e9f9588dd08c787c8-%E6%B5%A6%E5%8F%91%E9%93%B6%E8%A1%8C.png'
                },{
                    id:8,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/8026698744d2410dbe10aedb7108df26-%E5%86%9C%E4%B8%9A%E9%93%B6%E8%A1%8C.png'
                },{
                    id:9,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/1dcb24eb45e34df09ff9892ab2d64f91-%E6%B0%91%E7%94%9F%E9%93%B6%E8%A1%8C.png'
                },{
                    id:10,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/727d93b602054fc09a0044a05f5c16e4-%E4%BA%A4%E9%80%9A%E9%93%B6%E8%A1%8C.png'
                },{
                    id:11,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/7445acc5a8a546e4b0669bdcbc2a754c-%E5%BB%BA%E8%AE%BE%E9%93%B6%E8%A1%8C.png'
                },{
                    id:12,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/be6ec5743e0b4b65bcefa297a9ad531e-%E5%8D%8E%E5%A4%8F%E9%93%B6%E8%A1%8C.png'
                },{
                    id:13,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/3694dcf965e84f9bbc941ccd80031471-%E5%B9%BF%E5%8F%91%E9%93%B6%E8%A1%8C.png'
                },{
                    id:14,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/68d7a0576586489ab8b314ecf46aec8c-%E5%85%89%E5%A4%A7%E9%93%B6%E8%A1%8C.png'
                },{
                    id:15,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/23044458506e4e8cbff92407f1640bcf-%E5%B7%A5%E5%95%86%E9%93%B6%E8%A1%8C.png'
                }],
                selectId:2,
                list: [
                    {
                        id: 1,
                        nm: '网银支付',
                        checked: false,
                        up: false,//上传图片图标
                        img: yinlian

                    },
                    {
                        id: 2,
                        nm: '支付宝支付',
                        checked: false,
                        up: false,//上传图片图标
                        img: zhifubao
                    },
                    {
                        id: 3,
                        nm: '微信支付',
                        checked: false,
                        up: false,//上传图片图标
                        img: weixin
                    },
                    {
                        id: 4,
                        nm: '线下支付',
                        checked: false,
                        up: true,//上传图片图标
                        img: xianxia
                    },{
                        id: 5,
                        nm: '申请分期付款',
                        checked: false,
                        img: fenqi
                    }
                ],
                img:[],
            };
        },
        components:{
            myHeader,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},


        async created(){

        },
        async mounted() {
			this.alipaySuccess();
            this.id = this.until.getQueryString('id');
			this.info = await this.api.orderDetail(this.id)
			let arr = []
			this.info.itms.forEach(item=>{
			    arr.push(item.goodsNm)
			})
			this.proNm = arr.join(',')
			console.log('进入时id',this.id)
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/order/toPay?id='+this.id
				}
			},
        	//支付宝和微信支付成功的回调，需要依赖服务端的异步通知
			alipaySuccess(){
				this.$bridge.registerHandler("java_alipay", (data, responseCallback) =>{
					window.console.log("h5收到从android的数据333：")
					window.console.log(data)
					responseCallback("h5收到通知，返回android结果6666666"+data)
					window.location.replace('./paySuccess.html?id='+this.id)
				})
			},

            //删除图片
            deletImg(file,detail){
				this.img.splice(detail.index,1)
			},
            //图片过大提醒
            onOversize(){
                this.$toast('文件大小不能超过 500kb');
			},
			//上传图片
            async afterRead(file,detail){
				Toast.loading({
				  duration: 0,
				  message: '上传中...',
				  forbidClick: true,
				  overlay: true,
				});
                console.log(file)
				console.log(detail)
				if(file.file){
                    let img = await this.api.uploadImg2(file.file)
                    this.img.push(img)
					Toast.clear();
				}else {
                    for(let i=0;i<file.length;i++){
                        let img = await this.api.uploadImg2(file[i].file)
                        this.img.push(img)
                    }
					Toast.clear();
                }
			},
            toPage(url){
				this.until.href(url)
			},
            toChoose(item) {
                if (item.id != this.selectId) {
                    this.selectId = item.id
                }
            },
            toPay(){
                if (this.selectId == 2) { //支付宝
                	window.console.log("支付宝支付按钮按下222222")
					let tmp={
						ids:this.id
					}
					this.api.alipay(tmp).then(res=>{
						this.$bridge.callHandler('h5_alipay',res.data)
					})

                } else if (this.selectId == 3) { //微信
					let tmp={
						ids:this.id
					}
					window.console.log("微信支付按钮按下")
					this.api.wxpay(tmp).then(res=>{
						window.console.log("微信支付返回数据")
						window.console.log(res.data)
						this.$bridge.callHandler('h5_wxpay',JSON.stringify(res.data))
					})


                }else if (this.selectId == 4) { //线下支付
                    if(this.img.length==0){
                        this.$toast.fail('请上传付款凭证');
                        return
                    }
                    let param = {
                        id:this.id,
                        img:this.img.join(','),
                    }
                    this.api.payXX(param).then(() => {
                        this.$toast.success('提交成功');
                        setTimeout(()=>{
                        	console.log('线下支付id',this.id)
                            // this.until.href('./paySuccess.html?id='+this.id)
                            location.replace('./paySuccess.html?id='+this.id)
                        },1500)
                    })
                }else if (this.selectId == 5) { //分期
                    this.api.applyStaging(this.id).then(()=>{
                        // this.fenqiShow = true
                        setTimeout(()=>{
                            // this.until.href('./paySuccess.html?id='+this.id)
                            location.replace('./paySuccess.html?id='+this.id)
                        },1500)
                    })
                    // this.api.orderCheck(this.id).then((res) => {
                    //   if (res.code = '0') {
                    //     this.api.wxPay(this.id).then((res) => {
                    //       if (res.code = '0') {
                    //         this.qrImg = res.data
                    //         this.qrShow = true
                    //         this.timer = setInterval(this.payStatus, 1000);
                    //       }
                    //     })
                    //
                    //   }
                    // })
                }
			},
        },

    };
</script>

<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");
	.trading{
		width: 100%;
		height: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		background-color: #F1F3F2;
		.foot{
			width: 100%;
			background: @themeColor;
			color: #FFFFFF;
			/*padding: 0 0.38rem;*/
			height: 1rem;
			line-height: 1rem;
			text-align: center;
		}
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			height: 100%;
			background: #F1F3F2;
			>div{
				width: 96%;
				margin: 0.2rem auto;
				background: #FFFFFF;
				border-radius: 0.12rem;
				padding: 0 0.3rem;
				box-sizing: border-box;
			}
			.orderInfo{
				>p{
					border-bottom: 1px solid rgba(0,0,0,0.1);
					font-size: 0.3rem;
					color: #343434;
					height: 0.86rem;
					line-height: 0.86rem;
				}
				>div{
					line-height: 0.55rem;
					color: #666666;
					padding: 0.1rem 0;
				}
			}
			.payType{
				.item {

					color: #333333;
					border-bottom: 1px solid rgba(0,0,0,0.1);
					&:last-of-type{
						border-bottom: 0;
					}
					.itemCont {
						display: flex;
						justify-content: space-between;

						div:nth-of-type(1) {
							display: flex;

							p {
								height: 1.15rem;
								display: flex;
								align-items: center;

								.checked {
									width: 0.24rem;
									margin-right: 0.3rem;
								}

								.type {
									margin-right: 0.23rem;
									width: 0.35rem;
								}

								span {
									margin-right: 29px;
								}
							}

							.up {
								display: block;
								margin: 0.32rem 0 0.32rem 0.29rem;
								width: 1.62rem;
								height: 1.56rem;
								border: 1px dotted #D3D3D3;
								border-radius: 5px;
								position: relative;

								span {
									display: block;
									position: absolute;

								}

								span:nth-of-type(1) {

									top: 40%;
									left: 50%;
									transform: translate(-50%, -50%);
									font-size: 50px;
									color: #999999;
									font-weight: 100;
								}

								span:nth-of-type(2) {
									width: 100%;
									top: 70%;
									left: 50%;
									transform: translate(-50%, -50%);
									position: absolute;
									color: #666666;
									text-align: center;
								}
							}
						}

						.money {
							height: 1.15rem;
							display: flex;
							align-items: center;
							padding-right: 0.6rem;

							span {
								color: @redColor;
								font-weight: 400;
							}
						}
					}
				}
			}
			.bankList {
				width: 100%;

				.list {
					width: 100%;
					overflow: hidden;
					.img{
						border: 1px solid #DADADA;
						margin: 0.1rem 0;
					}
				}

				> button {
					width: 240px;
					height: 46px;
					text-align: center;
					line-height: 46px;
					background: #E64347;
					color: #ffffff;
					border-radius: 5px;
					border: none;
					font-size: 18px;
					margin: 0 auto 60px;
					display: block;
				}
			}
			.uploadImg{
				margin: 0.3rem 0;
				width: 100%;
			}
		}
	}

</style>
