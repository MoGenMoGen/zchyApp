<template>
    <div class="app" >
        <van-nav-bar  title="详情" :border="false" class="fixTop" style="background-color: #2778BE;">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox">
                <p class="ct1">{{info.nm}}</p>
                <p class="ct2" v-html="info.summary"></p>
                <p class="ct3">{{info.tm}}</p>
                <p class="last">
                    <span>来源：</span>
                    {{info.src}}
                    <span>作者：</span>
                    {{info.author}}
                </p>
            </div>
            <div class="whiteBox detail">
                <p v-html="info.cont" style="padding-bottom: 0.4rem;"></p>
            </div>
        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import scan from '@/assets/img/learning/浏览数.png';
    import fav from '@/assets/img/learning/收藏.png';
    import share from '@/assets/img/learning/分享.png';
    import tradingL from '@/assets/img/tradingL.png'
    import tradingR from '@/assets/img/tradingR.png'
    import play from "@/assets/img/learning/播放.png"
	import {mapState} from "vuex";

    export default {
        data() {
            return {
                scan,
                fav,
                tradingL,
                tradingR,
                share,
                play,
                info:{
                    nm:'船舶电工安全培训',
                    ct:'分科课程也称文化课程，是一种主张以学科为中心来编定的课程',
                    tm:'2020-04-08',
                    vt:'100'
                },
                cont:'课程简介',
                type:'',//当前是视频还是课件
                id:'',//当前课程id
                list:[],
            };
        },
        watch:{
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        created(){
        },
        mounted() {
            this.id = this.until.getQueryString('id')
            this.getStudyContDetail();
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
					window.location.href = window.location.origin+this.serverAddr+'/pilotService/infoDetail?sid='+this.id
				}
			},
            back(){
                window.history.go(-1);
            },
            //详情
            async getStudyContDetail(){
                this.info = await this.api.serviceDetail(this.id)
                this.info.cont = this.until.imgTagAddStyle(this.info.cont)
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
</style>
<style lang="less" scoped>
    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
            padding: 0.2rem;
            margin-top: 0.1rem;
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
                .classTitle{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.38rem 1.6rem 0.28rem 1.6rem;
                    >img{
                        width: 1.2rem;
                    }
                    >p{
                        margin: 0 0.3rem;
                        font-size: 0.3rem;
                        color: #303030;
                        font-weight: bold;
                    }
                }
                .sort{
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.2rem 0.4rem;
                    box-sizing: border-box;
                    >div{
                        width: 49%;
                        margin-right: 2%;
                        position: relative;
                        margin-bottom: 0.2rem;
                        &:nth-of-type(2n){
                            margin-right: 0;
                        }
                        >p{
                            height: 0.5rem;
                            color: #FFFFFF;
                            font-size: 0.22rem;
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: rgba(0,0,0,0.4);
                        }
                    }
                }

                .ct1{
                    font-size: 0.3rem;
                    color: #343434;
                    font-weight: bold;
                    margin-top: 0.29rem;
                }
                .ct2{
                    margin-top: 0.19rem;
                    font-size: 0.24rem;
                    color: #666666;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .ct3{
                    color: #9A9A9A;
                    font-size: 0.24rem;
                    margin-top: 0.19rem;

                }
                .last{
                    display: flex;
                    align-items: center;
                    color: #343434;
                    font-size: 0.22rem;
                    margin-top: 0.35rem;
                    margin-bottom: 0.35rem;
                    span:not(:first-of-type){
                        padding-left: 0.1rem;
                    }
                    .firstImg{
                        height: 0.245rem;
                        width: 0.364rem;
                        margin-right: 0.1rem;
                    }
                    .lastImg{
                        height: 0.23rem;
                        width: 0.23rem;
                        margin-left: 1rem;
                        margin-right: 0.15rem;
                    }
                }
            }
            .navBox{
                display: flex;
                flex-wrap: wrap;
                .title{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    color: #303030;
                    font-size: 0.28rem;
                    font-weight: bold;
                    margin-bottom: 0.19rem;
                    margin-top: 0.39rem;
                    >span{
                        display: block;
                        width: 0.04rem;
                        height: 0.25rem;
                        background-color: #2878BE;
                        margin-right: 0.17rem;
                    }
                }
                >p{
                    width: 100%;
                    padding-left: 0.35rem;
                }
            }
            .detail{
                padding: 0.2rem;
            }
        }

    }

</style>
