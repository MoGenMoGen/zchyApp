<template>
    <div class="app">
        <van-nav-bar fixed title="平台服务" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
					<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
            <van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
            </van-swipe>
					</div>
            <div class="whiteBox navBox">
                <p v-for="(item,index) in navList1" :key="index" @click="toPage(item.locUrl)">
                    <img :src="item.imgUrl">
                    <span>{{item.nm}}</span>
                </p>
            </div>
            <!-- 合同单位 -->
            <div class="whiteBox custBox">
                <div class="classTitle">
                    <img :src="tradingL">
                    <p>合同单位</p>
                    <img :src="tradingR">
                </div>
                <div class="unitBox">
                    <div v-for="(item,index) in unitList" style="cursor: pointer;">
                        <p>
                            <img :src="item.logo" @click="toDesignDetail(item)">
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <tab page="" ref="childrenTab"></tab>
    </div>

</template>

<script>
    import { Toast } from 'vant';
    import tab from '@/components/tab'
    import bgS from '@/assets/img/bgS.png'

    import tradingL from '@/assets/img/tradingL.png'
    import tradingR from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bgS,
                tradingL,
                tradingR,
                lunBoList:[],
                navList1:[],
                tabCd:'',		//选中的
                unitList:[],	//合作单位列表
            };
        },
        components:{
            tab
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        watch:{

        },
        created(){
        },
        mounted() {
            this.getAdert()
            this.getCompany()
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
					window.location.href = window.location.origin+this.serverAddr+'/service/service'
				}
			},
            async getAdert(){
                this.lunBoList=await this.api.getAdert('serviceBanner')
                this.navList1=await this.api.getAdert('appService')
            },
            getCompany(){
                let qry = this.query.new()
                this.query.toW(qry,'identityCd','identity90','EQ')
                this.query.toP(qry,1,6)
                this.api.getRoleAll(this.query.toEncode(qry)).then(res=>{
                    this.unitList = res
                })
            },
            back(){
                window.history.go(-1);
            },
            toPage(url){
                    if(url){
                        window.location.href=url
                    }

            },
            toDesignDetail(){

            }
        },

    };
</script>
<style lang="less">
    .fixTop{
				position: relative;
				background-color: @themeColor;
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
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        .main{
            margin-top: -0.01rem;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
            // padding: 0 0.2rem;
            // margin-top: 1.2rem;
            .lunboBox{
            	background-size: 100%;
            	background-repeat: no-repeat;
            	background-position: center top;
            	background-color: rgba(0,0,0,0);
            	margin: 0 0 0.2rem;
            	padding: 0 0.2rem;
            	border-radius: 0;
            }
            >div{
            	margin: 0 0.2rem 0.2rem;
            }
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
                .classTitle{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.38rem 0 0.28rem;
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
            }
            .navBox{
                display: flex;
                >p{
                    width: 25%;
                    margin: 0.44rem 0 0.39rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    >img{
                        margin-bottom: 0.2rem;
                        width: 0.41rem;
                        height: 0.44rem;
                    }
                    >span{
                        font-size: 0.22rem;
                        color: #666666;
                    }
                }
            }
            .custBox{
                .unitBox{
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.2rem 0.2rem 0.2rem 0;
                    >div{
                        width: 33.3%;
                        box-sizing: border-box;
                        margin-bottom: 0.2rem;
                        padding-left: 0.2rem;
                        >p{
                          box-sizing: border-box;
                          border: 0.01rem solid #dedede;
                          height: 1.1rem;
                          // overflow: hidden;
                          >img{
                            display: block;
                            width: 96%;
                            // margin: auto;
                            height: 96%;
                            max-height: 1.08rem;
                            margin: 2%;
                          }
                        }
                    }
                }
            }
        }

    }

</style>
