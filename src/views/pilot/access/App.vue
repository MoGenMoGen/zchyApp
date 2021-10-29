<template>
    <div class="home">
        <van-nav-bar fixed title="产品准入" :border="false" class="fixTop" id="pen-header">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main" :style="{marginTop:height+'px'}">
            <div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
                <van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
                </van-swipe>
            </div>
            <div>
                <van-sticky :offset-top="height">
                    <div class="nav">
                        <p v-for="(item,index) in list" :key="index" :class="{active:choose == item.id}" @click="changeActive(item.id)">
                          {{item.nm}}
                        </p>
                    </div>
                </van-sticky>
                <div class="content" v-html="info.cont">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import bgS from '@/assets/img/bgS.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                height:55,//顶部高度
                bgS,
                lunBoList:[],//轮播图
                currentPage3:1,
                pageSize:10,
                choose:'',
                list:[],
                info:{},
            };
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.getAdert();
            this.getList();
            this.height= document.getElementById("pen-header").clientHeight
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
					window.location.href = window.location.origin+this.serverAddr+'/pilotService/accessProduct'
				}
			},
            async getAdert(){
                this.lunBoList=await this.api.getAdert('accessProductApp')
            },
            async getList(){
                let qry = this.query.new()
                this.query.toW(qry,'cid','5075273153057792','EQ')
                this.query.toP(qry,this.currentPage3,this.pageSize)
                let data = await this.api.serviceContent(this.query.toEncode(qry))
                this.list=data.data.list
                console.log(this.list)
                this.choose=this.list[0].id
                this.getInfo(this.choose)
            },
            async getInfo(id){
                this.info=await this.api.serviceDetail(id)
                console.log(this.info)
            },
            //返回上一级
            back(){
                window.history.go(-1);
            },
            //  选中项高亮
            changeActive(id){
                this.choose=id
                this.getInfo(this.choose)
            },
        },

    };
</script>
<style lang="less">
    .homeLunBo  {
        border-radius: 0.15rem !important;
        .van-swipe-item{
            >img{
                border-radius: 0.15rem;
                height: 100%;
                min-height: 100%;
            }
        }
    }
    .fixTop{
        /*position: relative;*/
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
</style>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
    .home{
        width: 100%;
        min-height: 100%;
        background-color: #F1F3F2;
        .main{
            /*margin-top: -0.01rem;*/
            -webkit-overflow-scrolling: touch;

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
            >div{
                background-color: #FFFFFF;
                border-radius: 3px;
                .nav{
                    display: flex;
                    width: 100%;
                    border-radius: 3px 3px 0 0;
                    background-color: #FFFFFF;
                    >p{
                        font-size: 0.28rem;
                        color: #666666;
                        flex: 1;
                        text-align: center;
                        border-bottom: 1px solid rgba(0,0,0,0.1);
                        height: 0.85rem;
                        line-height: 0.85rem;
                    }
                    .active{
                        font-size: 0.3rem;
                        color: #343434;
                        font-weight: bold;
                        background: url("../../../assets/img/trading/下划线Blue.png") bottom center no-repeat;
                    }
                }
                .content{
                    padding: 0.2rem;
                }
            }
        }
    }

</style>
