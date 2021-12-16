<template>
<!--    创厂建造订单-->
    <div class="app">
			<van-nav-bar fixed title="订单详情" :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			</van-nav-bar>
      <div class="main">
				<div class="whiteBox statusBox">
					<p>订单编号: {{info.orderCd}}</p>
					<b>{{info.statusNm}}</b>
				</div>

				<div class="whiteBox infoBox">
					<div class="classTitle">
						<img :src="tradingL">
						<p>订单信息 </p>
						<img :src="tradingR">
					</div>
					<div class="msgBox">
						<div>
							<p class="title" style="margin: 0.05rem 0 0.3rem;">产品信息</p>
							<p><span>产品名称:</span>{{info.goodsNms}}</p>
							<p><span>单价:</span>{{info.amt}}</p>
							<p><span>数量:</span>{{info.qty}}</p>
                            <p><span>小计:</span>{{info.amt}}</p>
						</div>
						<div>
							<p class="title">收款记录</p>
                            <ul>
                                <li v-for="item in listCurrent" :key="item.id">
                                    <p>款项金额：￥{{fmoney(item.payment)}}</p>
                                    <p>付款时间：{{item.payDt}}</p>
                                </li>
                            </ul>
						</div>

					</div>
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
				id:"",
				info:{},
                list:[],
                listCurrent:[],
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
			this.getInfo();
            this.getPayList();
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
            //订单信息
			async getInfo(){
				this.info=await this.api.shipOrderDetail(this.id)

			},
            //付款记录
            async getPayList(){
                let qry = this.query.new()
                this.query.toP(qry,1,100)
                this.query.toW(qry,'orderId',this.id,'EQ')
                let param={
                    orgEnterId:this.currentRole.id

                }
                let data=await this.api.paymentList(this.query.toEncode(qry),param)
                this.list = data.data.list
                this.listCurrent = this.list.slice(0,4)
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
