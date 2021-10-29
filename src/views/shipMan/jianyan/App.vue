<template>
    <div class="app">
			<van-nav-bar fixed title="检验检测" :border="false"  class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			</van-nav-bar>
      <div class="main">
				<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
        	<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
        	  <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
        	</van-swipe>
				</div>
			<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white" style="margin: 0 0.2rem 0.2rem;">
			  <van-swipe-item v-for="(item,index) in jianyanList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
			</van-swipe>
		</div>
    </div>
	
</template>

<script>
	import { Toast } from 'vant';
  import bgS from '@/assets/img/bgS.png'
  export default {
    data() {
      return {
        bgS,
				lunBoList:[],
				jianyanList:[],
				
            };
        },
        components:{
        }, 
		watch:{
		},
        created(){
        },
        mounted() {
			this.getAdert()
        },
        methods: {
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
				this.jianyanList=await this.api.getAdert('APPjyjc')
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
		}
    }

</style>