<template>
  <div class="app">
		<van-nav-bar fixed title="船舶展示" :border="false" class="fixTop">
		  <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		</van-nav-bar>
    <div class="main">
			<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
				<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
					<van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
				</van-swipe>
			</div>
			<div class="whiteBox" v-for="(item,index) in shipClassify" :key="index">
				<div class="classTitle">
					<img :src="tradingL">
					<p>{{item.nm}}</p>
					<img :src="tradingR">
				</div>
				<p @click="toList(item,1)">
					<img :src="item.icon1" alt="">
				</p>
				<div class="imgBox">
					<div class="part" v-for="(i,k) in item.list" :key="k" @click="toList(i,2)">
					  <img :src="i.imgUrl"/>
					  <div class="ct">
					    <p>{{i.nm}}</p>
					    <p>{{i.rmks}}</p>
					  </div>
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
				shipClassify:[],
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
			this.getAdert()
			this.getShipList()
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/shipCat'
				}
			},
			async getShipList(){
			  let qry = this.query.new()
			  this.query.toW(qry,'pid',this.$store.state.shipId,'EQ')
			  this.query.toO(qry,'seq','asc')
			  this.shipClassify = await this.api.getClassify(this.query.toEncode(qry))
			  // this.shipClassify = this.shipClassify.slice(0,7)
			  for(let i=0;i<this.shipClassify.length;i++){
			    let qry2 = this.query.new()
			    this.query.toW(qry2,'pid',this.shipClassify[i].id,'EQ')
			    this.query.toO(qry2,'seq','asc')
			    let data = await this.api.getClassify(this.query.toEncode(qry2))
			    this.shipClassify[i].list = data.slice(0,4)
			    this.shipClassify[i].imgUrl = this.shipClassify[i].imgUrl ? this.shipClassify[i].imgUrl.split(',')[0] : ''
			    this.$set(this.shipClassify,i,this.shipClassify[i])
			  }
			  console.log(this.shipClassify)
			},
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
			},
			back(){
				window.history.go(-1);
			},
			toList(item,type){
				console.log(item)
				console.log(type)
				if(type==1){
					this.until.href("./shipList.html?cid2="+item.id+"&nm="+item.nm+"&img="+item.imgUrl2)
				}else{
					this.until.href("./shipList.html?cid3="+item.id+"&nm="+item.nm+"&img="+item.imgUrl)
				}
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
				>p{
					padding: 0 0.2rem 0.2rem;
				}
				.imgBox{
					display: flex;
					flex-wrap: wrap;
					padding: 0 0.2rem;
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
    }

</style>