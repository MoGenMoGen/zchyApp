<template>
	<div class="app" >
		<div class="coverBox" v-show="show" @click="show=false">
			<div class="pointBox">
				<p @click.stop="toPage('../home/index.html')"><i class="iconfont iconshouye2" style="font-size: 0.5rem;font-weight: 600;"></i>首页</p>
				<p><i class="iconfont iconfenxiang1" style="font-size: 0.48rem;"></i>分享</p>
				<p @click.stop="toPage('./storePro.html?id='+id)"><i class="iconfont icondianpu" style="font-size: 0.45rem;"></i>店铺首页</p>
			</div>
		</div>
		<div class="homeTop">
			<van-icon name="arrow-left" color="#ffffff" @click="back"/>
			<p>
				<img :src="search" style="width:0.23rem; height:0.23rem;margin-right: 0.1rem;">
				<input type="text" placeholder="店内搜索" v-model="searchNm" @keyup.enter="toSearch()">
			</p>
			<img :src="point" alt="" @click="show=true">
		</div>
		<div class="main">
			<div :style="{backgroundImage:'url('+bg+')'}">
				<div class="storeTitle">
					<!--<img :src="info.shopImg"/>-->
					<div class="img">
						<van-image
								round
								fit="contain"
								width="1.1rem"
								height="1.1rem"
								:src="info.shopImg"
						/>
					</div>

					<div class="contentBox">
						<p class="nmS"><span>{{info.nm}}</span><van-icon name="arrow"/></p>
						<span class="number">{{follows}}人关注</span>
					</div>
					<p @click="follow" class="followBox"><img :src="gz"/> {{info.isFollow ? '已关注' : '关注'}}</p>
				</div>
				<div class="whiteBox">
					<p>{{info.nm}}</p>
					<div>
						<span>供应商品:{{info.mainCore}}</span>
						<span>ISO9001:</span>
						<span class="lineSmall">公司地址:{{info.areaDetails}}</span>
						<!--<span class="lineSmall">联 系 人:{{info.contacts}}</span>-->
						<!--<span class="lineSmall">联系电话:{{info.contactPhone}}</span>-->
						<span class="lineSmall">联系邮箱:{{info.email}}</span>
					</div>
				</div>
				<div class="douWhiteBox">
					<p style="border-bottom: 0.01rem solid rgba(0,0,0,0.1);justify-content: space-between;">
						<span>证照信息</span><img :src="zhizhao">
					</p>
					<p>
						<span>开店时间</span>{{info.openTm}}
					</p>
				</div>
				<div class="douWhiteBox">
					<p style="border-bottom: 0.01rem solid rgba(0,0,0,0.1);">
						<span>店铺主营</span>{{info.mainGoods}}
					</p>
					<p>
						<span>所在地区</span>{{info.area}}
					</p>
				</div>
				<div class="douWhiteBox">
					<p>
						<span>销售品牌</span>{{info.brand}}
					</p>
				</div>
				<button @click="toPro">去看看全部商品 ></button>
			</div>


		</div>
	</div>

</template>

<script>
	import bg from '@/assets/img/bgS.png'
	import search from '@/assets/img/search.png'
	import point from '@/assets/img/trading/点.png'
	import gz from '@/assets/img/trading/gz.png'
	import zhizhao from '@/assets/img/trading/yingyezhizhao.png'
	import {mapState} from "vuex";
  export default {
    data() {
      return {
				bg,
				search,
				point,
				gz,
				zhizhao,
				show:false,
				follows:"",
				id:"",
				searchNm:"",
				info:{},
				pageNo: 1,
				pageSize: 10,
				total: 0,
      };
    },
    components:{

    },
    watch:{
		},
    created(){
    },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
    mounted() {
      this.id=this.until.getQueryString('id')
			console.log(this.id)
      this.getInfo()
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/storeHome?shopId='+this.id
				}
			},
      async getInfo(){
				this.info = await this.api.shopIntro(this.id)
				  if(this.info.follow>10000){
					  this.follows = parseInt(this.info.follow/10000)+'万'
				  }else {
					  this.follows = this.info.follow
				  }
				this.bannerList = this.info.bannerImg.split(",")
				console.log(this.info)
      },
			toSearch(){
				this.until.href("./storePro.html?searchNm="+this.searchNm+"&id="+this.id)
			},
			toPro(){
				this.until.href("./storePro.html?id="+this.id)
			},
			//关注店铺
			follow() {
			  //取消关注
			  if (this.info.isFollow === 1) {
			    this.info.isFollow = 0;
			    this.api.delFollow(this.info.id)
			  } else {
			    //关注店铺
			    let param = {
			      targetId: this.info.id,
			      type: 4,
			    }
			    this.api.followShop(param)
			    this.info.isFollow = 1;
			  }
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
</style>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");
	.app{
		width: 100%;
		height: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		background-color: #F1F3F2;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center top;
		box-sizing: border-box;
		.coverBox{
			position: fixed;
			width: 100%;
			height: 100%;
			z-index: 999;
			.pointBox{
				position: absolute;
				background-color: rgba(255,255,255,0.85);
				right: 0.4rem;
				top: 0.5rem;
				width: 2rem;
				border-radius: 0.06rem;
				>p{
					padding: 0.2rem;
					border-bottom: 0.01rem solid rgba(0,0,0,0.1);
					font-size: 0.24rem;
					color: #343434;
					>i{
						width: 0.5rem;
						margin-right: 0.1rem;
					}
				}
			}
		}
		.homeTop{
			display: flex;
			align-items: center;
			padding: 0.14rem 0;
			background: @themeColor;
			>i{margin: 0 0.37rem;font-size: 0.34rem;}
			>p{
				flex: 1;
				display: flex;
				align-items: center;
				padding: 0.15rem 0.3rem;
				border-radius: 0.36rem;
				background-color: #FFFFFF;
				>input{
					flex: 1;
					font-size: 0.22rem;
				}
			}
			>img{margin: 0 0.3rem;width: 0.21rem;}
		}
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			>div{
				padding: 0.3rem 0.2rem;
				background-repeat: no-repeat;
				background-position: top center;
				background-size: 100%;
				>button{
					width: 100%;
					padding: 0.4rem 0;
					background-color: #ffffff;
					border-radius: 0.15rem;
					margin-bottom: 0.6rem;
					font-size: 0.24rem;
					color: #E64448;

				}
			}
			.storeTitle{
				display: flex;
				align-items: center;
				padding: 0 0.08rem;
				.img{
					width: 1.1rem;
					height: 1.1rem;
					border-radius: 50%;
					margin-right: 0.25rem;
					background: #ffffff;
				}
				.contentBox{
					flex: 1;
					padding: 0.2rem 0;
					display: flex;
					flex-direction: column;
					.nmS{
						font-size: 0.3rem;
						font-weight: 600;
						margin-bottom: 0.23rem;
						display: flex;
						align-items: center;
						justify-content: space-between;
						color: #ffffff;
						span{
							width: 3.5rem;
							height: 0.5rem;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
						>i{font-size: 0.3rem;}
					}
					.number{
						font-size: 0.22rem;
					}
					>span{
						color: #ffffff;
					}
				}
				.followBox{
					color: #FFFFFF;
					background-color: #E64448;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					padding: 0.09rem 0.22rem;
					border-radius: 0.3rem;
					height: 0.4rem;
					font-size: 0.24rem;
					margin: 0.2rem 0.06rem auto 0;
					img {
						width: 0.19rem;
						height: 0.17rem;
						margin-right: 0.11rem;
					}
				}
			}
			.whiteBox{
				background-color: #ffffff;
				border-radius: 0.15rem;
				padding: 0.4rem 0.3rem 0.1rem;
				margin: 0.3rem 0 0.2rem;
				>p{
					font-weight: 600;
					font-size: 0.28rem;
					color: #343434;
					margin-bottom: 0.4rem;
				}
				>div{
					display: flex;
					flex-direction: column;
					>span{
						font-size: 0.24rem;
						color: #666666;
						margin-bottom: 0.4rem;
					}
					.lineSmall{
						margin-bottom: 0.25rem;
					}
				}
			}
			.douWhiteBox{
				background-color: #ffffff;
				border-radius: 0.15rem;
				padding: 0.1rem 0.3rem;
				margin-bottom: 0.2rem;
				>p{
					padding: 0.3rem 0;
					display: flex;
					align-items: center;
					font-size: 0.24rem;
					color: #666666;
					>span{
						width: 2rem;
					}
					>img{
						width: 0.23rem;
					}
				}
			}

		}
	}

</style>
