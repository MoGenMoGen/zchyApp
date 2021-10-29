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
				<div v-for="(item,index) in list" :key="index" @click="toPage('../../shipMan/shipDetail.html?id='+item.id)">
					<van-image :src="item.imgurl" class="image" fit="cover"/>
					<p v-html="item.nm"></p>
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
				selectCheck:'5',
				search:{
					keywords:'',
					pageNo:1,
					size:10,
				},
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
					window.location.href = window.location.origin+this.serverAddr+'/search/programSearch'+this.search.keywords
					
				}
			},
            onLoad(){
                this.search.pageNo++
                this.getData();
            },
			//获取数据
			async getData(){
                this.loading = true;
				let data = await this.api.programSearch(this.search)
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
					this.getData();
				}else if(this.selectCheck == 1){
					this.until.href('./ship.html?keyWord='+this.searchNm)
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
			margin-top: 0.2rem;
			.content{
				display: flex;
				flex-wrap: wrap;
				box-sizing: border-box;
				padding-top: 0.2rem;
				>div{
					width: 47%;
					background-color: #FFFFFF;
					margin-bottom: 0.3rem;
					border-radius: 0.1rem;
					margin-right: 2%;
					margin-left: 2%;
					box-sizing: border-box;
					position: relative;
					&:nth-of-type(2n){
						margin-right: 2%;
						margin-left: 0;
					}
					.image{
						height: 1.82rem;
						width: 100%;
						object-fit: cover;
						display: block;
					}
					p{
						color: #FFFFFF;
						box-sizing: border-box;
						width: 100%;
						background-color: rgba(0,0,0,0.4);
						height: 0.5rem;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						padding-left: 0.18rem;
						display: flex;
						justify-content: center;
						position: absolute;
						left: 0;
						bottom: 0;
						align-items: center;
					}
				}
			}
		}

	}

</style>
