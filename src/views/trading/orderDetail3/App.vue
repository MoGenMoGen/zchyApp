<template>
<!--	供应商销售订单订单详情-->
    <div class="app">
			<van-nav-bar fixed title="订单详情" :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			</van-nav-bar>
      <div class="main">
				<div class="whiteBox statusBox">
					<p>订单编号: {{info.orderId}}</p>
					<b>{{info.statusNm}}</b>
<!--					<button v-show="info.status=='10'" @click="toCancel">取消订单</button>-->
				</div>
<!--				<div class="whiteBox">-->
<!--					<div class="classTitle">-->
<!--						<img :src="tradingL">-->
<!--						<p>物流信息</p>-->
<!--						<img :src="tradingR">-->
<!--					</div>-->
<!--					<div class="contentBox" id="box" v-if="expressList.length>0">-->
<!--						<div v-for="(item,index) in expressList">-->
<!--							<p>{{item.time}}</p>-->
<!--							<p>{{item.context}}</p>-->
<!--						</div>-->
<!--						<img :src="tradingR">  &lt;!&ndash; :style="{width:boxWidth+'rem'}" &ndash;&gt;-->
<!--					</div>-->
<!--				</div>-->
				<div class="whiteBox infoBox">
					<div class="classTitle">
						<img :src="tradingL">
						<p>订单信息 </p>
						<img :src="tradingR">
					</div>
					<div class="msgBox">
						<div>
							<p class="title" style="margin: 0.05rem 0 0.3rem;">收货信息</p>
							<p><span>收 货 人:</span>{{info.receNm}}</p>
							<p><span>联系电话:</span>{{info.receMob}}</p>
							<p><span>收货地址:</span>{{info.addrNm}}</p>
						</div>
						<div>
							<p class="title">配送信息</p>
							<p><span>配送方式:</span>{{info.logiEntpNm}}</p>
							<p><span>运 费:</span>￥{{fmoney(info.payShip)}}</p>
						</div>
<!--						<div>-->
<!--							<p class="title">付款信息</p>-->
<!--							<p><span>付款方式:</span>{{payType}}</p>-->
<!--							<p><span>付款时间:</span>{{info.payTm}}</p>-->
<!--							<p><span>支付金额:</span>￥{{info.orderPrice}}</p>-->
<!--						</div>-->
					</div>
				</div>
				<div class="whiteBox goodsList">
<!--					<div class="titleBox">-->
<!--						<img :src="shop">-->
<!--						<p>店铺: {{info.shopNm}}</p>-->
<!--					</div>-->
					<div :class="info.ship=='1'?'shipBox':'proBox'">
						<div v-for="(item,index) in goodList" :key="index">
							<img :src="item.goodsImgUrl">
							<div v-if="info.ship=='1'">
								<p style="color: #303030;">{{item.goodsNm}}</p>
								<p style="color: #666666;">{{item.goodsSkuAttrNm}}</p>
								<p>
									<span>￥{{item.goodsPrice}}</span>
									<span style="color: #303030;font-size: 0.22rem;">×{{item.qty}}</span>
								</p>
							</div>
							<div v-else>
								<p style="color: #303030;"><span>{{item.goodsNm}}</span><span>￥{{fmoney(item.goodsPrice)}}</span></p>
								<p style="color: #666666;"><span>{{item.goodsSkuAttrNm}}</span><span>×{{item.qty}}</span></p>
							</div>
						</div>
					</div>
				</div>
				<div class="whiteBox priceBox">
					<p><span class="title">商品总额</span><span class="priceS">￥{{fmoney(moneySum)}}</span></p>
<!--					<p><span class="title">运费总额</span><span class="title">￥{{info.payShip}}</span></p>-->
					<p><span class="title">应付总额</span><span class="priceS">￥{{fmoney(moneySum+info.payShip)}}</span></p>
				</div>
			</div>
		</div>
  </div>

</template>

<script>
	import { Toast } from 'vant';
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import shop from '@/assets/img/trading/shopName.png'
  export default {
    data() {
      return {
				tradingL,
				tradingR,
				shop,
				  form:'',

				  goodList:[],
				  nm:'',
				  imgUrl:'',
				  id:"",
				  info:{},
				  num:0,
				  moneySum:0,
				// boxWidth:0,
			};
    },
    components:{
    },
		watch:{
		},
    created(){
    },
    mounted() {
			this.id = this.until.getQueryString('id')
			console.log(this.id)
			this.getInfo()
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
			async getInfo(){
				this.info=await this.api.shopBasicDetail(this.id)


				if(this.info.status=='10'){
					this.info.statusNm='待支付'
				}else if(this.info.status=='20'){
					this.info.statusNm='待发货'
				}else if(this.info.status=='30'){
					this.info.statusNm='已发货'
				}else if(this.info.status=='40'){
					this.info.statusNm='未签收'
				}else if(this.info.status=='50'){
					this.info.statusNm='自动签收'
				}else if(this.info.status=='60'){
					this.info.statusNm='用户确认收货'
				}else if(this.info.status=='70'){
					this.info.statusNm='自动确认收货'
				}else if(this.info.status=='80'){
					this.info.statusNm='待评价'
				}else if(this.info.status=='90'){
					this.info.statusNm='已完成'
				}else if(this.info.status=='100'){
					this.info.statusNm='取消处理中'
				}else if(this.info.status=='110'){
					this.info.statusNm='取消中'
				}else if(this.info.status=='120'){
					this.info.statusNm='已取消'
				}else if(this.info.status=='160'){
					this.info.statusNm='删除订单'
				}
				console.log('基本信息')
				console.log(this.info)

				let qry = this.query.new()
				this.query.toW(qry,'orderId',this.id,'EQ')
				this.goodList=await this.api.shopProductDetail(this.query.toEncode(qry))
				console.log('产品信息')
				console.log(this.goodList)
				this.goodList.forEach(item=>{
					// item.total=item.goodsPrice*item.qty
					this.num+=item.qty
					this.moneySum+=item.totalPrice
				})


			},

			back(){
				window.history.go(-1);
			},
      toPage(url){
				window.location.href=url
      },
    },

  };
</script>
<style lang="less">
	.fixTop{
		background: @themeColor;
		.van-nav-bar__title{
			font-size: 0.36rem;
			color: #ffffff;
		}
		.van-nav-bar__left{
			font-size: 0.34rem;
		}
	}
</style>
<style lang="less" scoped>
  .app{
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
		background-color: #F1F3F2;
		.main{
		  overflow: auto;
		  -webkit-overflow-scrolling: touch;
		  // display: flex;
		  flex: 1;
		  flex-direction:column;
		  padding: 0 0.3rem;
			margin-top: 1.2rem;
			.whiteBox{
				background-color: #ffffff;
				border-radius: 0.12rem;
				margin-bottom: 0.2rem;
				.classTitle{
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0.4rem 0 0.3rem;
					>img{
						width: 1.2rem;
					}
					>p{
						margin: 0 0.5rem;
						font-size: 0.3rem;
						color: #303030;
						font-weight: 600;
					}
				}
				.contentBox{
					position: relative;
					padding-bottom: 0.5rem;
					>div{
						display: flex;
						margin-bottom: 0.2rem;
						>p{
							padding: 0 0.3rem;
							flex: 1;
							font-size: 0.22rem;
							color: #666666;
						}
					}
					>img{
						max-width: 500%;
						height: 0.2rem;
						position: absolute;
						top: 20%;
						left: 50%;
						transform: translate(-50%, 0) rotate(90deg);
					}
				}
			}
			.statusBox{
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0.5rem 0 0.56rem;
				>p{
					font-size: 0.24rem;
					color: #666666;
				}
				>b{
					font-size: 0.36rem;
					color: #E64448;
					margin: 0.3rem 0;
				}
				>button{
					background-color: #f5f5f5;
					color: #9a9a9a;
					font-size: 0.24rem;
					border: 0.01rem solid #dedede;
					padding: 0.13rem 0.23rem;
					border-radius: 0.03rem;
				}
			}
			.infoBox{
				padding: 0 0.3rem;
				.msgBox{
					>div{
						padding-bottom: 0.15rem;
						border-bottom: 0.01rem solid rgba(0,0,0,0.1);
						.title{
							font-size: 0.28rem;
							color: #303030;
							margin: 0.4rem 0 0.3rem;
						}
						>p{
							margin-bottom: 0.25rem;
							font-size: 0.24rem;
							color: #666666;
							>span{
								width: 1.5rem;
							}
						}
					}
					>div:last-child{
						border-bottom: none;
					}
				}
			}
			.goodsList{
				padding: 0.3rem 0.3rem 0.2rem;
				.titleBox{
					display: flex;
					align-items: center;
					padding-bottom: 0.3rem;
					border-bottom: 0.01rem solid rgba(0,0,0,0.1);
					>img{
						width: 0.25rem;
						height: 0.23rem;
						margin-right: 0.16rem;
					}
					>span{
						font-size: 0.24rem;
						color: #666666;
					}
				}
				.proBox{
					padding-top: 0.3rem;
					>div{
						padding-bottom: 0.3rem;
						display: flex;
						align-items: center;
						height: 1.8rem;
						>img{
							width: 1.8rem;
							height: 1.8rem;
							margin-right: 0.2rem;
							border-radius: 0.1rem;
						}
						>div{
							padding: 0.2rem 0;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							width: 100%;
					    height: 1.8rem;
					    box-sizing: border-box;
							>p{
								display: flex;
								font-size: 0.22rem;
								>span:first-child{
									flex: 1;
								}
							}
						}
					}
				}
				.shipBox{
					padding-top: 0.3rem;
					>div{
						padding-bottom: 0.3rem;
						display: flex;
						align-items: center;
						// height: 1rem;
						>img{
							width: 1.8rem;
							// height: 1rem;
							margin-right: 0.2rem;
							border-radius: 0.1rem;
						}
						>div{
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							width: 100%;
					    // height: 1rem;
					    box-sizing: border-box;
							>p{
								display: flex;
								font-size: 0.24rem;
								>span:first-child{
									flex: 1;
									font-size: 0.32rem;
									color: #F43E3A;
									font-weight: 600;
								}
							}
						}
					}
					>div:last-child{padding-bottom: 0.1rem;}
				}
			}
			.priceBox{
				padding: 0 0.3rem;
				>p{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0.3rem 0;
					border-bottom: 0.01rem solid rgba(0,0,0,0.1);
					font-size: 0.28rem;
					.title{color: #343434;}
					.priceS{
						font-weight: 600;
						color: #D84844;
					}
				}
				>p:last-child{
					border-bottom: none;
				}
			}
		}
  }

</style>
