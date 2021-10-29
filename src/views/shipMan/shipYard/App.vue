<template>
    <div class="app" >
		<my-header title="船厂详情">
		</my-header>
      <div class="main">
				<div class="swipeList">
					<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
						<van-swipe-item v-for="(item,index) in imgList" :key="index"><img :src="item" alt=""></van-swipe-item>
					</van-swipe>
					<img :src="backI" @click="back" class="backI">
<!--					<img :src="info.collected==1?started:start" @click="toCollect" class="startI">-->
				</div>
				<div class="infoBasic">
					<p style="font-size: 0.3rem;color: #343434;">{{info.company}}</p>
					<p style="font-size: 0.24rem;color: #666666;margin-bottom: 0.3rem;">建造优势：{{info.business}}</p>
					<p class="smallP" style="margin-bottom: 0.3rem;">{{info.summery}}</p>
					<p class="smallP"><img :src="addr"/><span>公司地址：</span>{{info.addrNm}}{{info.address}}</p>
					<p class="smallP"><img :src="link"/><span>联系人：</span>{{info.linkMan}}</p>
					<p class="smallP"><img :src="mob"/><span>联系电话：</span>{{info.mob}}</p>
					<p class="smallP"><img :src="mail"/><span>联系邮箱：</span>{{info.email}}</p>
				</div>
				<div class="whiteBox contentBox">
					<div v-html="info.intro">
					</div>
				</div>
				<div class="whiteBox" style="margin-bottom: 0.6rem;">
					<div class="classTitle">
						<img :src="tradingL">
						<p>推荐船型</p>
						<img :src="tradingR">
					</div>
					<div class="shipList">
						<div class="part" v-for="(item,index) in list2" :key="index" @click="toDetail(item.id)">
						  <img :src="item.imgUrl"/>
						  <div class="ct">
						    <p>{{item.nm}}</p>
						    <p>{{item.rmks}}</p>
						  </div>
						</div>
					</div>
				</div>
			</div>
    </div>

</template>

<script>
	import { Toast } from 'vant';
	import backI from '@/assets/img/shipMan/返回.png'
	import start from '@/assets/img/shipMan/收藏.png'
	import started from '@/assets/img/shipMan/已收藏.png'
	import addr from '@/assets/img/shipMan/地址.png'
	import link from '@/assets/img/shipMan/联系人.png'
	import mob from '@/assets/img/shipMan/联系电话.png'
	import mail from '@/assets/img/shipMan/联系邮箱.png'
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
    import myHeader from '@/components/opacityHeader'
	import {mapState} from "vuex";
  export default {
    data() {
      return {
				backI,
				start,
				started,
				addr,
				link,
				mob,
				mail,
				tradingL,
				tradingR,
				imgList:[],
				id:"",
				info:{},
				list2:[],
      };
    },
    components:{
        myHeader
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
			this.id=this.until.getQueryString('id')
			this.getInfo()
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/shipyard?id='+this.id
				}
			},
			async getInfo(){
			  this.info = await this.api.getRoleDetail2(this.id)
				this.info.summery = this.info.summery.slice(0, 80) + '...';
			  this.imgList = this.info.imgUrl.split(',')
				console.log('详情')
			  console.log(this.info)
			},
			async getShipList(){
		    let qry = this.query.new()
		    // this.query.toW(qry,'designId',this.id,'EQ')
		    let data= await this.api.shipList2(this.query.toEncode(qry))
				this.list2=data.splice(0,4)
				console.log('推荐船型')
		    console.log(this.list2)
		  },
			back(){
				window.history.go(-1);
			},
			toCollect(){
				console.log('收藏')
			},
			toDetail(id){
				this.until.href("./shipDetail.html?id="+id)
			},
      toPage(url){
				window.location.href=url
      },
    },
  };
</script>
<style lang="less">
</style>
<style lang="less" scoped>
  .app{
		width: 100%;
    min-height: 100%;
		background-color: #F1F3F2;
	  -webkit-overflow-scrolling: touch;

	  .main{

			.swipeList{
				position: relative;
				>img{
					position: absolute;
					width: 0.5rem;
					height: 0.5rem;
					top: 0.23rem;
				}
				.backI{
					left: 0.23rem;
				}
				.startI{
					right: 0.23rem;
				}
			}
			.infoBasic{
				background-color: #ffffff;
				padding: 0.4rem 0.27rem 0.38rem 0.35rem;
				border-radius: 0 0 0.2rem 0.2rem;
				margin-bottom: 0.2rem;
				>p{
					margin-bottom: 0.18rem;
					>img{
						width: 0.21rem;
						height: 0.21rem;
						margin-right: 0.2rem;
					}
				}
				.smallP{
					font-size: 0.22rem;
					color: #9a9a9a;
				}
			}
			.whiteBox{
				background-color: #ffffff;
				border-radius: 0.2rem;
				margin-bottom: 0.2rem;
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
				.shipList{
					display: flex;
					flex-wrap: wrap;
					padding: 0 0.4rem;
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
