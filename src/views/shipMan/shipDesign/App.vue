<template>
    <div class="app">
			<van-nav-bar fixed title="船舶设计" :border="false" class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			</van-nav-bar>
      <div class="main">
				<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
        	<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
        	  <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
        	</van-swipe>
				</div>
			<div class="whiteBox navBox">
				<p v-for="(item,index) in navList1" :key="index" @click="toPage(item.url)">
					<img :src="item.img">
					<span>{{item.nm}}</span>
				</p>
			</div>
			<!-- 设计流程 -->
			<div class="whiteBox custBox">
				<div class="classTitle">
					<img :src="tradingL">
					<p>设计流程</p>
					<img :src="tradingR">
				</div>
				<div class="stepBox">
					<img :src="designStep" alt="">
				</div>
			</div>
			<!-- 推荐船型 -->
			<recomm></recomm>
		</div>
    </div>
	
</template>

<script>
	import { Toast } from 'vant';
	import recomm from '@/components/recomm'
  import bgS from '@/assets/img/bgS.png'
	import design1 from '@/assets/img/shipMan/diy报价.png'
	import design2 from '@/assets/img/shipMan/设计预约.png'
	import design3 from '@/assets/img/shipMan/设计规范.png'
	import design4 from '@/assets/img/shipMan/设计院所.png'
	import designStep from '@/assets/img/shipMan/设计流程.png'
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";
  export default {
    data() {
      return {
        bgS,
				tradingL,
				tradingR,
				designStep,
				lunBoList:[],
				navList1:[
					{	img:design1,
						nm:'DIY报价',
						url:'./diyQuote.html'},
					{	img:design2,
						nm:'设计预约',
						url:'./designAppo.html'},
					{	img:design3,
						nm:'设计规范',
						url:'./designRule.html'},
					{	img:design4,
						nm:'设计院所',
						url:'./allDesign.html'}
				],
            };
        },
        components:{
			recomm
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/shipDesign'
				}
			},
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
			},
			
			back(){
				window.history.go(-1);
			},
			
            toPage(url){
				window.location.href=url
            },
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
					}
				}
				.stepBox{
					box-sizing: border-box;
					padding: 0.35rem;
				}
			}
			.navBox{
				display: flex;
				>p{
					flex: 1;
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
		}
        
    }

</style>
<style>

</style>