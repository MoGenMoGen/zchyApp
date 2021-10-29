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
			<van-list
					class="content"
					v-model="loading"
					:finished="finished"
					:immediate-check="immediate"
					finished-text="没有更多了"
					@load="onLoad"
			>
				<div v-for="(item,index) in list" :key="index">
					<div class="header">
						<van-image
								round
								fit="cover"
								:src="item.shopimg"
								width="0.87rem"
								height="0.87rem"
						/>
						<div class="name">
							<p v-html="item.nm"></p>
							<p>主营：<span>{{item.maingoods}}</span></p>
						</div>
						<span @click="toPage('../../views/trading/storeHome.html?id='+item.id)">进店</span>
					</div>
					<div class="footer">
						<div class="pt" v-for="(v,t) in item.goodsVos" :key="t" @click="toPage('../../views/trading/shipDetail.html?id='+item.id)">
							<img :src="v.fmImgUrl"/>
							<p>￥{{v.origPrice}}</p>
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>
<script>
	import bg from '@/assets/img/bg.png'
	import px from '@/assets/img/排序.png'
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
				list:[],
				topShow:false,	//顶部搜索处的选择
				checkNm:'店铺', //顶部搜索处被选中的选项
				search:{
					keywords:'',
					pageNo:1,
					size:6,
					overall:'DESC',
					salesqty:'',
				},
				searchList:[{
					value: '1',
					label:'船舶'
				},{
					value: '2',
					label:'产品'
				}, {
					value: '4',
					label:'资讯'
				}, {
					value: '5',
					label:'方案'
				}, {
					value: '7',
					label:'店铺'
				}],
				selectCheck:'7',
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
						window.location.href = window.location.origin+this.serverAddr+'/search/storeSearch'+this.search.keywords
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/Trade/qualityStore'
					}
				}
			},
            onLoad(){
                this.search.pageNo++
                this.getData();
            },
			//获取数据
			async getData(){
                this.loading = true;
				let data = await this.api.storeSearch(this.search)
					// this.list = data.data.result
                this.list.push(...data.data.result)
                this.loading = false;
                this.total = data.data.total
                if(this.list.length>=this.total){
                    this.finished = true
                }
			},
			//搜索
			toSearch(){
				this.searchNm = this.search.keywords
				if(this.selectCheck == 5){
					this.until.href('./program.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 1){
					this.until.href('./ship.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 2){
					this.until.href('./product.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 7){
					this.getData();
				}else if(this.selectCheck == 4){
					this.until.href('./info.html?keyWord='+this.searchNm)
				}
			},
			back(){
				window.history.go(-1);
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
			.content{
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				>div{
					display: flex;
					padding: 0.3rem 0.2rem 0.2rem 0.2rem;
					width: 100%;
					box-sizing: border-box;
					background-color: #FFFFFF;
					flex-wrap: wrap;
					.header{
						width: 100%;
						display: flex;
						margin-bottom: 0.3rem;
						.name{
							margin-left: 0.27rem;
							flex: 1;
							display: flex;
							flex-direction: column;
							>p:first-child{
								color: #303030;
								font-size: 0.26rem;
							}
							>p:last-child{
								color: #9A9A9A;
								font-size: 0.22rem;
							}
						}
						>span{
							width: 0.9rem;
							height: 0.34rem;
							color: #2878BE;
							font-size: 0.22rem;
							border-radius: 0.03rem;
							border: 0.01rem solid #2878BE;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
					.footer{
						display: flex;
						flex: 1;
						.pt{
							position: relative;
							margin-right: 0.2rem;
							&:nth-of-type(3n){
								margin-right: 0;
							}
							>img{
								width: 2.1rem;
								height: 2.1rem;
							}
							>p{
								position: absolute;
								bottom: 0;
								left: 0;
								background-color: rgba(0,0,0,0.3);
								height: 0.41rem;
								color: #FFFFFF;
								width: 100%;
							}
						}
					}
				}
			}
		}

	}

</style>
