<template>
    <div class="app" >
        <van-nav-bar title="发现好货" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox" :style="{backgroundImage:'url('+bg+')'}">
                <div class="list" v-for="(item,index) in goodPro" :key="index" @click="toPage('../../views/trading/shipDetail.html?id='+item.goodsId)">
                    <div class="left">
                        <van-image
                                width="2.4rem"
                                height="100%"
                                fit="contain"
                                :src="item.img"
                                radius="0.1rem"
                        />
                    </div>
                    <div class="right">
                        <p>{{item.nm}}</p>
                        <p>已售{{item.salesQty}}件</p>
                        <p>{{item.evalQty}}人喜欢<img :src="like"/></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import bg from '@/assets/img/bgS.png'
    import tradingL from '@/assets/img/tradingL.png'
    import tradingR from '@/assets/img/tradingR.png'
    import like from '@/assets/img/trading/喜欢.png'
	import {mapState} from "vuex";

    export default {
        data() {
            return {
                bg,
                like,
                tradingL,
                tradingR,
                goodPro: [],//发现好货列表

            };
        },

        watch:{
        },
        created(){
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
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
                this.goodPro = await this.api.shopGoodPro() //发现好货
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
                background-repeat: no-repeat;
                background-position: center top;
                padding: 0.2rem 0.2rem 0;

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
                        padding: 0.18rem 0 0 0.23rem;
                        p:nth-child(1){
                            font-size: 0.3rem;
                            color: #303030;
                            font-weight: bold;
                        }
                        p:nth-child(2){
                            font-size: 0.22rem;
                            color: #F1860C;
                            background-color: #FFF4E1;
                            padding: 0.05rem 0.11rem;
                            width: fit-content;
                            margin-top: 0.13rem;
                        }
                        p:nth-child(3){
                            color: #FF2F2F;
                            font-size: 0.24rem;
                            margin-top: 1.05rem;
                            padding-left: 0.07rem;
                            display: flex;
                            align-items: center;
                            >img{
                                width: 0.296rem;
                                height: 0.267rem;
                                margin-left: 0.19rem;
                            }
                        }

                    }
                }
            }
        }

    }

</style>
