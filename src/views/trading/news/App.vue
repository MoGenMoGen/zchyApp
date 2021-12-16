<template>
    <div class="app" :style="{backgroundImage:'url('+bg2+')'}">
        <my-header title="新品首发">
        </my-header>
        <van-nav-bar  title="新品首发" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="swiper">
                <van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(item,index) in list" :key="index"  @click="toPage('./shipDetail.html?id='+item.goodsId)">
                        <img :src="item.img" alt="">
                        <p>{{item.nm}}</p>
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="whiteBox navBox">
                <div class="title">
                    <p><img :src="lf" style="margin-right: 0.3rem;"/>上新推荐<img style="margin-left: 0.3rem" :src="rt"/></p>
                </div>
                <div class="list">
                    <div v-for="(item,index) in list" :key="index" @click="toPage('../../views/trading/shipDetail.html?id='+item.goodsId)">
                        <van-image
                                width="100%"
                                height="3.45rem"
                                fit="img"
                                :src="item.img"
                                radius="0.1rem 0.1rem 0 0"
                        />
                        <p class="nm">{{item.nm}}</p>
                        <!--<p class="pr">￥{{item.origPrice}}</p>-->
                        <p class="pr" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥{{fmoney(item.goodsMinPrice)}}</p>
                        <p class="pr" v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥{{fmoney(item.goodsMinPrice)}}-{{fmoney(item.goodsMaxPrice)}}</p>
                        <p class="pr" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import {mapState} from 'vuex'
    import bg from '@/assets/img/bg.png'
    import bg2 from '@/assets/img/trading/新品首发背景.png'
    import lf from '@/assets/img/trading/左.png'
    import rt from '@/assets/img/trading/右.png'

    import myHeader from '@/components/opacityHeader'
    export default {
        data() {
            return {
                bg,
                bg2,
                lf,
                rt,
                list:[],
            };
        },
        components:{myHeader},
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
            this.getAdert()
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/starting'
				}
			},
            async getAdert(){
                this.list=await this.api.shopNewPro()
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
    .fixTop{
        background: none;
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
    .homeLunBo  {
        border-radius: 0.15rem !important;
        margin-bottom: 0.2rem;
        .van-swipe-item{
			width: 100%;
			height: 6rem;
            >img{
                border-radius: 0.15rem;
				position: relative;
                height: 100%;
                min-height: 100%;
                display: block;
            }
            >p{
                position: absolute;
                bottom: 0;
                width: 100%;
                font-size: 0.28rem;
                color: #FFFFFF;
                height: 1.2rem;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>
<style lang="less" scoped>

    .app{
        width: 100%;
        min-height: 100%;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        -webkit-overflow-scrolling: touch;

        .main{
            /*overflow: auto;*/
            /*// display: flex;*/
            /*flex: 1;*/
            /*flex-direction:column;*/
            padding: 0 0.2rem;
            margin-top: 0.2rem;
            .swiper{
                padding: 0 0.55rem;
            }
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                .title{
                    width: 100%;
                    padding-top: 0.6rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.3rem;
                    >P{
                        display: flex;
                        color: #333333;
                        font-weight: bold;
                        font-size: 0.3rem;
                        align-items: center;
                        >img{
                            height: 0.141rem;
                            width: 0.231rem;
                        }
                    }
                }
                .list{
                    /*background-color: #ffffff;*/
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    >div{
                        width: 49%;
                        margin-right: 2%;
                        background-color: #ffffff;
                        margin-bottom: 0.2rem;
                        border-radius: 0.1rem;
                        &:nth-of-type(2n){
                            margin-right: 0;
                        }
                        .nm{
                            font-size: 0.24rem;
                            color: #666666;
                            padding-left: 0.2rem;
                            padding-top: 0.3rem;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        .pr{
                            color: #FF3B3F;
                            font-size: 0.24rem;
                            padding-left: 0.2rem;
                            padding-top: 0.2rem;
                            margin-bottom: 0.2rem;
                        }
                    }
                }
            }
            .navBox{
                display: flex;
                flex-direction: column;
            }
        }

    }

</style>
