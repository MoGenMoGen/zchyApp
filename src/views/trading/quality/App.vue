<template>
    <div class="app" >
        <van-nav-bar title="优选店铺" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="content" :style="{backgroundImage:'url('+bg+')'}">
                <div v-for="(item,index) in list" :key="index">
                    <div class="header" :style="{backgroundImage:'url('+imgList[index%4]+')'}">
                        <van-image
                                round
                                fit="contain"
                                :src="item.shopImg"
                                width="0.87rem"
                                height="0.87rem"
                                style="background-color: #FFFFFF;"
                        />
                        <div class="name">
                            <p v-html="item.nm"></p>
                            <p><span>{{item.follow>=10000?item.wan:item.follow}}</span>人关注</p>
                        </div>
                        <span @click="toPage('../../views/trading/storeHome.html?id='+item.id)">进店</span>
                    </div>
                    <div class="footer">
                        <div class="pt" v-for="(v,t) in item.items" :key="t" @click="toPage('../../views/trading/shipDetail.html?id='+v.goodsId)">
                            <img :src="v.img"/>
                            <!--<p>￥{{v.origPrice}}</p>-->
                            <p v-if="v.goodsMinPrice===v.goodsMaxPrice && v.goodsMinPrice !=price">￥{{fmoney(v.goodsMinPrice)}}</p>
                            <p v-if="v.goodsMinPrice!==v.goodsMaxPrice">￥{{fmoney(v.goodsMinPrice)}}-{{fmoney(v.goodsMaxPrice)}}</p>
                            <p v-if="v.goodsMinPrice===v.goodsMaxPrice && v.goodsMinPrice ==price">价格面议</p>
                        </div>
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
    import bg1 from '@/assets/img/trading/1.png'
    import bg2 from '@/assets/img/trading/2.png'
    import bg3 from '@/assets/img/trading/3.png'
    import bg4 from '@/assets/img/trading/4.png'
    export default {
        data() {
            return {
                bg,

                imgList:[
                    bg1,
                    bg2,
                    bg3,
                    bg4],
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/qualityStore'
				}
			},
            back(){
                window.history.go(-1);
            },
            toPage(url){
                this.until.href(url)
            },
            async getList(){
                this.list=await this.api.shopGoodStore()
                this.list.forEach(item =>{
                    if(item.follow >= 10000){
                        let frist_init = item.follow .slice(0, item.follow.length - 4);
                        let last_four = item.follow.substr(item.follow.length - 4);
                        let wan = frist_init + '.'+last_four.slice(0,2) + '万';
                        this.$set(this.list,'wan',wan)
                    }
                })
                console.log(this.list)

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
    .homeLunBo  {
        border-radius: 0.15rem !important;
        margin-bottom: 0.2rem;
        .van-swipe-item{
            >img{
                border-radius: 0.15rem;
                height: 100%;
                min-height: 100%;
            }
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
            /*margin-top: 1.2rem;*/
            .content{
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                box-sizing: border-box;
                /*border-radius: 0.1rem;*/
                padding: 0.2rem 0.2rem 0;
                background-size: 100%;
                background-repeat: no-repeat;
                background-position: center top;
                >div{
                    display: flex;
                    padding: 0.3rem 0.2rem 0.2rem 0.2rem;
                    width: 100%;
                    box-sizing: border-box;
                    background-color: #FFFFFF;
                    flex-wrap: wrap;
                    border-radius: 0.1rem;
                    margin-bottom: 0.2rem;
                    .header{
                        width: 100%;
                        display: flex;
                        margin-bottom: 0.3rem;
                        padding: 0.2rem;
                        background-size: 100%;
                        background-repeat: no-repeat;
												align-items: center;
                        .name{
                            margin-left: 0.27rem;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            >p:first-child{
                                color: #FFFFFF;
                                font-size: 0.26rem;
                                max-width: 3rem;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                            }
                            >p:last-child{
                                color: #FFFFFF;
                                font-size: 0.22rem;
                            }
                        }
                        >span{
                            width: 0.9rem;
                            height: 0.34rem;
                            color: #FFFFFF;
                            // margin-top: 0.27rem;
                            font-size: 0.22rem;
                            border-radius: 0.03rem;
                            border: 0.01rem solid #FFFFFF;
                            display: flex;
                            align-items: center;
                            justify-content: center;
														box-sizing: border-box;
                        }
                    }
                    .footer{
                        display: flex;
                        flex: 1;
                        .pt{
                            position: relative;
                            margin-right: 0.2rem;
                            &:nth-of-type(3n){
                                margin-right: 0;
                            }
                            >img{
                                width: 2.1rem;
                                height: 2.1rem;
                                display: block;
                            }
                            >p{
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                background-color: rgba(0,0,0,0.3);
                                height: 0.41rem;
                                line-height: 0.41rem;
                                color: #FFFFFF;
                                width: 100%;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
                            }
                        }
                    }
                }
            }
        }

    }

</style>
