<template>
  <div class="app">
		<van-nav-bar fixed :title=titleNm :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		</van-nav-bar>
    <div class="main">
			<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
				<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
					<van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item" alt=""></van-swipe-item>
				</van-swipe>
			</div>
			<div class="whiteBox" v-if="list.length>0">
				<div class="part" v-for="(i,k) in list" :key="k" @click="toDetail(i.id)">
					<img :src="i.imgUrl"/>
					<div class="ct">
						<p>{{i.nm}}</p>
						<p>{{i.rmks}}</p>
					</div>
				</div>
			</div>
		</div>
    </div>
	
</template>

<script>
	import { Toast } from 'vant'; 
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
				list:[],
				cid2:"",
				cid3:"",
				titleNm:"船舶展示",
            };
        },
        components:{
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
			if(this.until.getQueryString('img')){
				this.lunBoList.push(this.until.getQueryString('img'))
			}
			if(this.until.getQueryString('cid2')){
				this.cid2=this.until.getQueryString('cid2')
			}else if(this.until.getQueryString('cid3')){
				this.cid3=this.until.getQueryString('cid3')
			}
			if(this.until.getQueryString('nm')){
				this.titleNm=this.until.getQueryString('nm')+"展示"
			}
			
			this.getList()
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
					let img=this.until.getQueryString('img')
					let nm=this.until.getQueryString('nm')
					if(this.until.getQueryString('cid2')){
						window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/shipShow?cId='+this.cid2+'&cNm='+nm+'&cImg='+img
					}else if(this.until.getQueryString('cid3')){
						window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/shipShow?cId3='+this.cid3+'&cNm='+nm+'&cImg='+img
					}
					
				}
			},
			async getList(){
			  let qry = this.query.new()
			  if(this.cid2||this.cid3){
				if(this.cid2){
				  this.query.toW(qry,'cid2',this.cid2)
				}
				if(this.cid3){
				  this.query.toW(qry,'cid3',this.cid3)
				}
				this.query.toO(qry,'seq','asc')
				this.list = await this.api.shipList2(this.query.toEncode(qry))
			  }
			  
			},
			back(){
				window.history.go(-1);
			},
      toDetail(id){
				this.until.href("./shipDetail.html?id="+id)
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
		/*height: 3.5rem;*/
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
				display: flex;
				flex-wrap: wrap;
				padding: 0.2rem 0.2rem 0;
				.part{
					width: 48.5%;
					height: 1.9rem;
					margin-right: 3%;
					margin-bottom: 3%;
					position: relative;
					>img{
						width: 100%;
						height: 100%;
					}
					.ct{
						position: absolute;
						bottom: 0;
						width: 100%;
						padding: 0.14rem 0;
						background-color: rgba(0,0,0,0.4);
						display: flex;
						justify-content: center;
						>p{
							color: #ffffff;
							font-size: 0.22rem;
						}
					}
				}
				.part:nth-child(2n){
					margin-right: 0;
				}
			}
		}
    }

</style>