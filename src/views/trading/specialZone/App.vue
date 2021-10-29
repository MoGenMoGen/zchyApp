<template>
    <div class="app">
        <van-nav-bar title="特价专区" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox"  :style="{backgroundImage:'url('+bg+')'}">
                <div class="list" v-for="(item,index) in dailyPro" :key="index" @click="toPage('../../views/trading/shipDetail.html?id='+item.goodsId)">
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
                        <p class="imgP" :style="{backgroundImage:'url('+priceBg2+')'}">
                            <span class="discS">超值速抢</span>
                            <!--<span class="origS">￥{{item.origPrice}}</span>-->
                            <!--<span class="mktS">￥{{item.mktPrice}}</span>-->
                            <span class="origS" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥{{item.goodsMinPrice}}</span>
                            <span class="origS" v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥{{item.goodsMinPrice}}-{{item.goodsMaxPrice}}</span>
                            <span class="origS" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</span>
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
		import priceBg2 from '@/assets/img/trading/价格2.png'
    export default {
        data() {
            return {
                bg,
								priceBg2,
                dailyPro: [],//发现好货列表
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
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/Trade/onlinetrading'
				}
			},
            async getData(){
				let data = await this.api.shopDailySpecials() //特价产品
				data.forEach(item=>{
					item.items.forEach(i=>{
						this.dailyPro.push(i)
					})
				})
				console.log(this.dailyPro)
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
                background-size: 100%;
                padding: 0.2rem 0.2rem 0;
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
                                                        /*flex: 1;*/
                                                        /*text-align: center;*/
                                                    }
													.discS{
														color: #B86011;
														font-size: 0.24rem;
														width: 1.8rem;
                                                        text-indent: 0.2rem;
													}
													.origS{
                                                        flex: 1;
														color: #FFFFFF;
														font-size: 0.24rem;
														font-weight: 600;
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
