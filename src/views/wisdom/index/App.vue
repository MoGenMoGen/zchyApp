<template>
    <div class="home">
        <van-nav-bar fixed title="智慧船舶" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
					<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
            <van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,index) in lunBoList" @click="toPage(item.locUrl)" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
            </van-swipe>
					</div>
          <img class="listImg" v-for="(item,index) in imageList" :key="index" :src="item.imgUrl" @click="toPage(item.locUrl)"/>
        </div>
        <tab page="" ref="childrenTab"></tab>
    </div>
</template>

<script>
    import tab from '@/components/tab'
	import bgS from '@/assets/img/bgS.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bgS,
                lunBoList:[],//轮播图
                imageList:[],//图片
            };
        },
        components:{
            tab,
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
            this.getImage();
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
					window.location.href = window.location.origin+this.serverAddr+'/wisdom/wisdom'
				}
			},
            async getAdert(){
                this.lunBoList=await this.api.getAdert('wisdomBanner')
            },
            async getImage(){
                this.imageList=await this.api.getAdert('wisdomImage')
            },
            toPage(url){
              if(url){
                  window.location.href = url
              }
            },
            //返回上一级
            back(){
                window.history.go(-1);
            },
        },

    };
</script>
<style lang="less">
    .homeLunBo  {
        border-radius: 0.15rem !important;
        box-sizing: border-box;
        .van-swipe-item{
            >img{
                border-radius: 0.15rem;
                height: 100%;
                min-height: 100%;
            }
        }
    }
    .fixTop{
        position: relative;
        background-color: @themeColor;
        box-sizing: border-box;
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
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        box-sizing: border-box;
		background-color: #F1F3F2;
        .main{
          margin-top: -0.01rem;
          overflow: auto;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          flex: 1;
          flex-direction:column;
          width: 100%;
          .lunboBox{
            box-sizing: border-box;
            background-size: 100%;
          	background-repeat: no-repeat;
          	background-position: center top;
          	background-color: rgba(0,0,0,0);
          	margin: 0 0 0.2rem;
          	padding: 0 0.2rem;
          	border-radius: 0;
          }
            .listImg{
                width: -webkit-fill-available;
            }
            >img{
                box-sizing: border-box;
				margin: 0 0.2rem 0.2rem;
                border-radius: 0.15rem;
                max-width: 100%;
                &:first-of-type{
                    margin-top: 0.1rem;
                }
            }
        }
    }

</style>
