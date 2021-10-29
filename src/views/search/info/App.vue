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
				<div v-for="(item,index) in list" :key="index" @click="toPage('../../tradeInfo/tradeDetail.html?id='+item.id)">
					<div class="left">
						<van-image :src="item.imgurl" class="image" fit="cover" width="100%" height="100%"/>
					</div>
					<div class="right">
						<p v-html="item.nm"></p>
						<p >{{item.cont}}<span @click="toPage(item)">查看更多</span></p>
						<p>{{item.reletm}}</p>
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
				checkNm:'资讯', //顶部搜索处被选中的选项
				search:{
					keywords:'',
					pageNo:1,
					size:5,
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
				selectCheck:'4',
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
						window.location.href = window.location.origin+this.serverAddr+'/search/infoSearch'+this.search.keywords
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/tradeInfo/tradeInfo'
					}
				}
			},
            onLoad(){
                this.search.pageNo++
                this.getData();
            },
			//获取数据，若不存在关键词，进入全部资讯页面
			async getData(){
                this.loading = true;
					let data = await this.api.infoSearch(this.search)
					let list = data.data.result
					list.forEach(item =>{
						item.cont = item.cont.replace(/<\/?[^>]*>/g, "").slice(0,45) + '...';
						item.cont = item.cont.replace(/(&nbsp;)/g, "");
					})
                this.list.push(...list)
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
					this.until.href('./store.html?keyWord='+this.searchNm)
				}else if(this.selectCheck == 4){
					this.getData();
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
					padding: 0.3rem;
					width: 100%;
					box-sizing: border-box;
					background-color: #FFFFFF;
					.left{
						width: 2.5rem;
						max-height: 1.9rem;
						box-sizing: border-box;
					}
					.right{
						flex: 1;
						display: flex;
						flex-direction: column;
						margin-left: 0.22rem;
						box-sizing: border-box;
						p:nth-child(1){
							font-size: 0.24rem;
							color: #333333;
							font-weight: bold;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							margin-bottom: 0.18rem;
							max-width: 3.52rem;
						}
						p:nth-child(2){
							color: #666666;
							max-width: 3.52rem;
							font-size: 0.2rem;
							margin-bottom: 0.3rem;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2; //需要控制的文本行数
							overflow: hidden;
							>span{
								color: @themeColor;
							}
						}
						p:nth-child(3){
							max-width: 3.52rem;
							font-size: 0.2rem;
							color: #999999;
						}
					}
				}
			}
		}

	}

</style>
