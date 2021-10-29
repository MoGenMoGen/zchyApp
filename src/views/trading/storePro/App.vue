<template>
	<div class="app" >
		<div class="coverBox" v-show="show" @click="show=false">
			<div class="pointBox">
				<p @click.stop="toPage('../home/index.html')"><i class="iconfont iconshouye2" style="font-size: 0.5rem;font-weight: 600;"></i>首页</p>
				<p><i class="iconfont iconfenxiang1" style="font-size: 0.48rem;"></i>分享</p>
				<p @click.stop="toPage('./storeHome.html?id='+id)"><i class="iconfont icondianpu" style="font-size: 0.45rem;"></i>店铺详情</p>
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
					<div class="img">
						<van-image
								round
								fit="contain"
								width="1.1rem"
								height="1.1rem"
								:src="info.shopImg"
						/>
					</div>
					<p class="contentBox">
						<span class="nmS">{{info.nm}}<van-icon name="arrow"/></span>
						<span class="number">{{follows}}人关注</span>
					</p>
					<p @click="follow" class="followBox"><img :src="gz"/> {{info.isFollow ? '已关注' : '关注'}}</p>
				</div>
				<div class="tabBox">
					<p :class="{clickP:checkId==item.id}" v-for="(item,index) in tabList" :key="index" @click="checkId=item.id">
					<span>
						{{item.nm}}
					</span>
					</p>
				</div>
				<van-swipe class="storeLun" :autoplay="3000" indicator-color="white">
					<van-swipe-item v-for="(item,index) in bannerList" :key="index"><img :src="item" alt=""></van-swipe-item>
				</van-swipe>
				<div class="sortList">
					<p v-for="(item,index) in filterList" :key="index" @click="changeActive(item)">
						{{item.nm}}
						<span v-if="index!=0">
						<i class="iconfont iconarrup" :class="{checkNow:item.checked&&sortTxt=='asc'}" style="margin-bottom: -0.07rem;"></i>
						<i class="iconfont iconarrdown" :class="{checkNow:item.checked&&sortTxt=='desc'}"></i>
					</span>
					</p>
				</div>
				<van-list
						v-model="loading"
						:finished="finished"
						:immediate-check="immediate"
						finished-text="没有更多了"
						@load="onLoad"
				>
					<pro-list :list="listNow"></pro-list>
				</van-list>
			</div>

		</div>
	</div>

</template>

<script>
	import bg from '@/assets/img/bgS.png'
	import search from '@/assets/img/search.png'
	import point from '@/assets/img/trading/点.png'
	import gz from '@/assets/img/trading/gz.png'
	import proList from "@/components/trade/proList";
	import {mapState} from "vuex";
  export default {
    data() {
      return {
				bg,
				search,
				point,
				gz,
				follows:"",
				id:"",
				show:false,
				checkId:"",
				tabList:[],
				searchNm:"",
				bannerList:[],
				info:{},
				listNow:[],
				finished:false,
				immediate:false,
				loading:false,
				pageNo: 1,
				pageSize: 10,
				total: 0,//分页总数
				filterTxt: '综合',//排序字段
				sortTxt: 'desc',//升序还是降序
				filterList: [
				  {
				    nm: '综合',
				    checked: true,
				    sort: "desc"
				  },
				  {
				    nm: '销量',
				    checked: false,
				    sort: "desc",
				  },
				  {
				    nm: '价格',
				    checked: false,
				    sort: "desc",
				  },
				],
      };
    },
    components:{
			proList
    },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
    watch:{
			checkId(){
				this.finished = false
				this.pageNo = 1
				this.listNow = []
				this.getList()
			},
		},
    created(){
    },
    mounted() {
		this.id=this.until.getQueryString('id')
		if(this.until.getQueryString('searchNm')){
			this.searchNm=this.until.getQueryString('searchNm')
		}
		console.log(this.id)
		this.getInfo()
		this.getTabList()
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/storeHome?shopId='+this.id
				}
			},
			async getList(){
				this.loading = true;
				let qry = this.query.new()
				this.query.toW(qry, 'shopId', this.id, 'EQ')
				this.setOrder(qry)
				this.query.toP(qry, this.pageNo, this.pageSize)
				//设置分类
				if(this.searchNm){
					this.query.toW(qry, 'nm', this.searchNm, 'LK')
				}
				if (this.checkId) {
				  this.query.toW(qry, 'tid', this.checkId, 'EQ')
				}
				let data=await this.api.shopGoodList(this.query.toEncode(qry))
				this.loading = false;
				this.total = data.page.total
				if(this.listNow.length>=this.total){
				  this.finished = true
				}
				this.listNow.push(...data.data.list)
			},
			//搜索
			toSearch(){
				this.finished = false
			  this.pageNo = 1
			  this.listNow = []
			  this.getList()
			},
			onLoad(){
			  this.pageNo++
				this.getList()
			},
			//  设置排序字段和顺序
			setOrder(qry) {
			  if (this.filterTxt === '综合') {
			    this.query.toO(qry, 'seq', this.sortTxt)
			  } else if (this.filterTxt === '销量') {
			    this.query.toO(qry, 'salesQty', this.sortTxt)
			  } else if (this.filterTxt === '价格') {
			    this.query.toO(qry, 'origPrice', this.sortTxt)
			  }
			},
			changeActive(item) {
			  if (item.checked) {
			    item.sort = item.sort == "asc" ? "desc" : "asc"
			    this.sortTxt = item.sort
			  } else {
			    this.filterList.forEach(item => {
			      item.checked = false
			      item.sort = 'desc'
			    })
			    item.checked = true
			    this.sortTxt = item.sort
			    this.filterTxt = item.nm
			  }
				this.finished = false
			  this.pageNo = 1
				this.listNow = []
			  this.getList()
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
			async getTabList(){
				let data = await this.api.shopCatList(this.id)
				this.tabList.push({id:'',nm:'全部'})
				data.forEach(item=>{
					this.tabList.push(item)
				})
				console.log(this.tabList)
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
			background: @themeColor;
			padding: 0.14rem 0;
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
				background-size: 100%;
				background-repeat: no-repeat;
				background-position: center top;
				padding: 0.3rem 0.2rem;
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
			.tabBox{
				display: flex;
				margin-bottom: 0.12rem;
				>p{
					flex: 1;
					text-align: center;
					font-size: 0.24rem;
					color: #ffffff;
				}
				.clickP{
					font-weight: 600;
					>span{
						border-bottom: 0.03rem solid #ffffff;
					}
				}
			}
			.storeLun{
				border-radius: 0.15rem;
				img{border-radius: 0.15rem;}
			}
			.sortList{
				display: flex;
				align-items: center;
				padding: 0.3rem 0;
				background: #F1F3F2;
				border-radius: 0.15rem;
				>p{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					>span{
						display: flex;
						flex-direction: column;
						>i{
							font-size: 0.25rem;
							color: #9A9A9A;
						}
						.checkNow{
							color: #e4393c;
						}
					}
				}
			}
		}
	}

</style>