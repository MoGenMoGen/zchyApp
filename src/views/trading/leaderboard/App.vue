<template>
    <div class="app">
        <van-nav-bar title="排行榜单" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox"  :style="{backgroundImage:'url('+bg+')'}">
                <div class="list" v-for="(item,index) in list" :key="index" @click="toPage('../../views/trading/shipDetail.html?id='+item.goodsId)">
                    <van-image
                            width="100%"
                            height="3.45rem"
                            fit="img"
                            :src="item.img"
                            radius="0.1rem 0.1rem 0 0"
                    />
                    <div class="tip" :style="{backgroundImage:'url('+one+')'}" v-if="index == 0">
                        <p>1</p>
                    </div>
                    <div class="tip" :style="{backgroundImage:'url('+two+')'}" v-if="index == 1">
                        <p>2</p>
                    </div>
                    <div class="tip" :style="{backgroundImage:'url('+three+')'}" v-if="index == 2">
                        <p>3</p>
                    </div>
                    <div class="tip" :style="{backgroundImage:'url('+other+')'}" v-if="index>2">
                        <p>{{index+1}}</p>
                    </div>
                    <p class="nm">{{item.nm}}</p>
                    <!--<p class="pr">￥{{item.origPrice}}</p>-->
                    <p class="pr" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥{{fmoney(item.goodsMinPrice)}}</p>
                    <p class="pr" v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥{{fmoney(item.goodsMinPrice)}}-{{fmoney(item.goodsMaxPrice)}}</p>
                    <p class="pr" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</p>
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
    import one from '@/assets/img/trading/第一.png'
    import two from '@/assets/img/trading/第二.png'
    import three from '@/assets/img/trading/第三.png'
    import other from '@/assets/img/trading/其余.png'
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                bg,
                tradingL,
                tradingR,
                one,
                two,
                three,
                other,
                list:[],
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
            this.getList();
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/ranking'
				}
			},
            back(){
                window.history.go(-1);
            },
            toPage(url){
                this.until.href(url)
            },
            async getList(){
                this.list=await this.api.goodsRank30()
            }
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
                flex-wrap: wrap;
                .list{
                    width: 49%;
                    margin-right: 2%;
                    background-color: #ffffff;
                    margin-bottom: 0.2rem;
                    border-radius: 0.1rem;
                    position: relative;
                    .tip{
                        position: absolute;
                        width: 0.58rem;
                        height: 0.39rem;
                        top: 0.24rem;
                        left:  -0.07rem;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center left;
                        color: #FFFFFF;
                        padding-left: 0.15rem;
                        line-height: 0.3rem;
                        box-sizing: border-box;
                    }
                    /*.two{*/
                        /*position: absolute;*/
                        /*width: 0.58rem;*/
                        /*height: 0.33rem;*/
                        /*top: 0.24rem;*/
                        /*left:  -0.06rem;*/
                        /*display: flex;*/
                        /*align-items: center;*/
                        /*justify-content: center;*/
                        /*color: #FFFFFF;*/
                    /*}*/
                    /*.three{*/
                        /*position: absolute;*/
                        /*width: 0.58rem;*/
                        /*height: 0.33rem;*/
                        /*top: 0.24rem;*/
                        /*left:  -0.06rem;*/
                        /*display: flex;*/
                        /*align-items: center;*/
                        /*justify-content: center;*/
                        /*color: #FFFFFF;*/
                    /*}*/
                    /*.other{*/
                        /*position: absolute;*/
                        /*width: 0.58rem;*/
                        /*height: 0.33rem;*/
                        /*top: 0.24rem;*/
                        /*left:  -0.06rem;*/
                        /*display: flex;*/
                        /*align-items: center;*/
                        /*justify-content: center;*/
                        /*color: #FFFFFF;*/
                    /*}*/
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

    }

</style>
