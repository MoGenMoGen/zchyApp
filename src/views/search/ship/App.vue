<template>
	<div class="home">
		<!-- 搜索的下拉选择 -->
		<van-popup v-model="topShow" position="bottom">
			<van-picker
					show-toolbar
					:columns="searchList"
					value-key="label"
					@confirm="onConfirm"
					@cancel="onCancel"
			/>
		</van-popup>
		<div class="cartTop">
			<i class="iconfont iconzuojiantou" @click="back"></i>
			<div>
				<p @click="topShow=true" class="checkTop">{{checkNm}}<i class="iconfont iconarrdown"></i></p>
				<p class="searchTop">
					<input type="text" placeholder="请输入关键词查询产品" v-model="search.keywords" @keyup.enter="toSearch">
				</p>
			</div>
			<span class="topEdit"></span>
		</div>
		<div class="main" id="defaultScroll">
			<div class="nav">
				<span v-for="(item,index) in navList" :key="index" @click="sort(item.cd)">
					{{item.nm}}
					<img v-if="item.cd != 1" :src="px"/>
				</span>
			</div>
			<van-list
					class="content"
					v-model="loading"
					:finished="finished"
					:immediate-check="immediate"
					finished-text="没有更多了"
					@load="onLoad"
			>
				<div v-for="(item,index) in list" :key="index" @click="toPage('../../views/trading/shipDetail.html?id='+item.id)">
					<van-image :src="item.fmimgurl" class="image" fit="cover"/>
					<div class="new">
						<p v-html="item.nm"></p><img :src="New" v-if="item.used == 1" /><img v-if="item.used == 2" :src="old" />
					</div>
					<div class="canshu">
						<p>船舶总长：{{item.tl}}</p>
						<p>公约船长：{{item.ml}}</p>
						<p>船舶型宽：{{item.wd}}</p>
						<p>船舶型深：{{item.hd}}</p>
					</div>
					<p style="color: #FF3B3F;margin-top:0.3rem;margin-bottom: 0.29rem;font-weight: normal;padding-left: 0.18rem" v-if="item.origprice">￥{{item.origprice}}</p>
					<p style="color: #FF3B3F;margin-top:0.3rem;margin-bottom: 0.29rem;font-weight: normal;padding-left: 0.18rem" v-else>价格面议</p>
				</div>
			</van-list>
		</div>
	</div>
</template>
<script>
	import bg from '@/assets/img/bg.png'
	import px from '@/assets/img/排序.png'
	import New from '@/assets/img/新造船.png'
	import old from '@/assets/img/二手船.png'
	import {mapState} from "vuex";
	export default {
		data() {
			return {
                total:0,
                finished:false,
                loading:false,
                immediate:false,
				bg,
				px,
				New,
				old,
				navList:[{
					nm:'综合',
					cd:1
				},{
					nm:'销售',
					cd:2
				},{
					nm:'价格',
					cd:3
				}],
				list:[],
				search:{
					pageNo:1,
					size:6,
					ship:1,
					keywords:'',
					overall:'DESC',//综合排序
					salesqty:'',//销量排序
					origprice:'',//价格排序
					used: ''
				},
				topShow:false,	//顶部搜索处的选择
				checkNm:'船舶', //顶部搜索处被选中的选项
				searchNm:'',	//搜索的关键字
				searchList:[{
					value: '1',
					// label: '船舶方案'
					label:'船舶'
				},{
					value: '2',
					// label: '船舶'
					label:'产品'
				}, {
					value: '4',
					// label: '产品'
					label:'资讯'
				}, {
					value: '5',
					// label: '店铺'
					label:'方案'
				}, {
					value: '7',
					// label: '资讯'
					label:'店铺'
				}],
				selectCheck:'1',
			};
		},
		async created(){

		},
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},

		async mounted() {
			let arr = this.until.getQueryString('keyWord')
			this.search.keywords = arr
			this.getData()
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
					if(this.until.getQueryString('keyWord')){
						window.location.href = window.location.origin+this.serverAddr+'/search/shipSearch'+this.search.keywords
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/Trade/shipTrade'
					}
				}
			},
			async getData(){
                this.loading = true;
				let data = await this.api.goodsSearch(this.search)
				// this.list = data.data.result
				// this.total = data.total
                this.list.push(...data.data.result)
                this.loading = false;
                this.total = data.data.total
                if(this.list.length>=this.total){
                    this.finished = true
                }
			},
            onLoad(){
                this.search.pageNo++
                this.getData();
            },
			//搜索
			toSearch(){
				this.searchNm = this.search.keywords
				if(this.selectCheck == 5){
					this.until.href('./program.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 1){
					this.getData();
				}else if(this.selectCheck == 2){
					this.until.href('./product.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 7){
					this.until.href('./store.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 4){
					this.until.href('./info.html?keyWord='+this.searchNm)
				}
			},
			onConfirm(value, index){
				this.checkNm=value.label
				this.selectCheck=value.value
				this.topShow=false
			},
			onCancel(){
				this.topShow=false
			},
			toPage(url){
				this.until.href(url)
			},
			back(){
				window.history.go(-1);
			},
			//排序
			sort(index){
                this.list = []
                this.search.pageNo = 1
				if(index == 1){
					if(this.search.overall == '' || this.search.overall == 'ASC'){
						this.search.overall = 'DESC';
					}else{
						this.search.overall = 'ASC';
					}
					this.search.origprice = '';
					this.search.salesqty = '';
					this.getData();
				}else if(index == 2){
					if(this.search.salesqty == '' || this.search.salesqty == 'ASC'){
						this.search.salesqty = 'DESC';
					}else{
						this.search.salesqty = 'ASC';
					}
					this.search.overall = '';
					this.search.origprice = '';
					this.getData();
				}else if(index == 3){
					if(this.search.origprice == '' || this.search.origprice == 'ASC'){
						this.search.origprice = 'DESC';
					}else{
						this.search.origprice = 'ASC';
					}
					this.search.overall = '';
					this.search.salesqty = '';
					this.getData();
				}
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
	.van-list__finished-text{
		width: 100%;
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
		.cartTop{
			display: flex;
			align-items: center;
			padding:0.27rem 0.36rem;
			color: #ffffff;
			background-color: #2878BE;
			>i{
				font-size: 0.36rem;
				width: 0.8rem;
			}
			>div{
				flex: 1;
				display: flex;
				align-items: center;
				height: 0.6rem;
				background-color: #FFFFFF;
				border-radius: 0.3rem;
				margin-right: 0.27rem;
				padding: 0 0.26rem;
				.checkTop{
					font-size: 0.24rem;
					margin-right: 0.2rem;
					border-right: 0.01rem solid rgba(0,0,0,0.2);
					white-space:nowrap;
					color: #343434;
					>i{
						margin-left: 0.1rem;
						margin-right: 0.16rem;
						font-size: 0.16rem;
					}
				}
				.searchTop{
					font-size: 0.22rem;
					display: flex;
					align-items: center;
					color: #333333;
				}
			}
			.topEditor{
				font-size: 0.3rem;
				width: 0.8rem;
			}

		}
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			flex-direction:column;
			padding: 0 0.2rem;
			.nav{
				display: flex;
				>span{
					width: 33.3%;
					height: 0.88rem;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 0.3rem;
					color: #343434;
					>img{
						width: 0.0891rem;
						height: 0.179rem;
						margin-left: 0.13rem;
					}
				}
			}
			.content{
				display: flex;
				flex-wrap: wrap;
				>div{
					width: 100%;
					background-color: #FFFFFF;
					margin-bottom: 0.3rem;
					border-radius: 0.1rem;
					.image{
						width: 100%;
						/*min-height: 4rem;*/
					}
					.canshu{
						display: flex;
						flex-wrap: wrap;
						flex: 1;
						margin-top: 0.2rem;
						padding-left: 0.18rem;
						>p{
							width: 45%;
							color: #9A9A9A;
							font-size: 0.24rem;
						}
					}
					.new{
						display: flex;
						align-items: center;
						margin-top: 0.2rem;
						flex: 1;
						p{
							color: #343434;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							font-size: 0.28rem;
							font-weight: bold;
							padding-left: 0.18rem;
						}
						>img{
							width: 1.35rem;
							height: 0.46rem;
							margin-left: 0.3rem;
						}
					}

				}
			}
		}

	}

</style>
