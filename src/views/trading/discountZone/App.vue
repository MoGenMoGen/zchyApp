<template>
    <div class="app" >
        <van-nav-bar title="优惠专区" :border="false"  class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox" :style="{backgroundImage:'url('+bg+')'}">
                <div class="list" v-for="(item,index) in discountPro" :key="index" @click="toPage('../../views/trading/shipDetail.html?id='+item.goodsId)">
                    <div class="left">
                        <van-image
                          width="2.4rem"
                          height="100%"
                          fit="cover"
                          :src="item.img"
                          radius="0.1rem"
                        />
                    </div>
                    <div class="right">
                        <p class="nmP">{{item.nm}}</p>
												<p class="saleP">已售{{item.salesQty}}件</p>
												<p class="imgP" :style="{backgroundImage:'url('+priceBg+')'}">
													<span class="discS">超值购</span>
													<!--<span class="origS">￥{{item.origPrice}}</span>-->
                                                    <span class="origS" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥{{fmoney(item.goodsMinPrice)}}</span>
                                                    <span class="origS" v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥{{fmoney(item.goodsMinPrice)}}-{{fmoney(item.goodsMaxPrice)}}</span>
                                                    <span class="origS" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</span>
													<!--<span class="mktS">￥{{item.mktPrice}}</span>-->
												</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import {mapState} from 'vuex'
    import bg from '@/assets/img/bgS.png'
		import priceBg from '@/assets/img/trading/价格.png'
    export default {
        data() {
            return {
                bg,
								priceBg,
                discountPro: [],//发现好货列表
            };
        },
        computed:{
            ...mapState([
                'price',
				'serverAddr'
            ])
        },
        watch:{
        },
        created(){
        },
        mounted() {
            this.getData();
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
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
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/Trade/onlinetrading'
				}
			},
            async getData(){
								let data = await this.api.shopDiscountPro() //折扣产品
								data.forEach(item=>{
									item.items.forEach(i=>{
										// i.disc= Math.round(i.origPrice*10/i.mktPrice)
										this.discountPro.push(i)
									})
								})
								console.log(this.discountPro)
            },
            back(){
                window.history.go(-1);
            },
            toPage(url){
                this.until.href(url)
            },
        },

    };
</script>
<style lang="less">
    @import url("../../../assets/css/mobile.less");
    .fixTop{
        background: @themeColor;
        .van-nav-bar__title{
            font-size: 0.36rem;
            color: #ffffff;
        }
				.van-nav-bar__left{
					font-size: 0.34rem;
				}
        .van-nav-bar__right{
            font-size: 0.28rem;
            color: #ffffff;
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
            .whiteBox{
                margin-bottom: 0.2rem;
                padding: 0.2rem 0.2rem 0;
                background-size: 100%;
                background-repeat: no-repeat;
                background-position: center top;
            }
            .navBox{
                display: flex;
                flex-direction: column;
                .list{
                    display: flex;
                    margin-bottom: 0.2rem;
                    padding: 0.2rem;
                    box-sizing: border-box;
                    background-color: #ffffff;
										border-radius: 0.1rem;
                    .right{
                        flex: 1;
                        padding: 0.18rem 0 0.1rem 0.23rem;
												display: flex;
										    flex-direction: column;
										    justify-content: space-between;
                        .nmP{
                            font-size: 0.3rem;
                            color: #303030;
                            font-weight: bold;
                        }
												.saleP{
													padding: 0.05rem 0.11rem;
													border-radius: 0.03rem;
													background-color: #FEF3E0;
													font-size: 0.22rem;
													color: #F1850B;
													margin: 0.1rem auto 0.5rem 0;
												}
												.imgP{
													background-size: 100% 100%;
													background-repeat: no-repeat;
													height: 0.62rem;
													margin-right: 0.48rem;
													width: 100%;
													box-sizing: border-box;
													display: flex;
													align-items: center;
													>span{
                                                    }
													.discS{
														color: #B86011;
														font-size: 0.24rem;
                                                        width: 1.4rem;
                                                        text-indent: 0.1rem;
													}
													.origS{
                                                        flex: 1;
                                                        color: #FFFFFF;
														font-size: 0.24rem;
														font-weight: 600;
														line-height: initial;
													}
													.mktS{
														color: rgba(255,255,255,0.2);
														font-size: 0.22rem;
														text-decoration: line-through;
														text-align: start;
													}
												}
                    }
                }
            }
        }

    }

</style>
