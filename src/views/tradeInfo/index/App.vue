<template>
	<!--	消息详情-->
	<div id="container">
		<pen-header title="新闻资讯" id="pen-header"></pen-header>

		<div class="top">
			<div class="top-1" :style="{backgroundImage:'url('+bg+')'}">
			</div>
			<div class="top-2"></div>
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="item in adertList" :key="item.id" @click="toPage(item.locUrl)">
					<img class="swipe-img" :src="item.imgUrl">
				</van-swipe-item>
			</van-swipe>

		</div>


		<van-sticky :offset-top="height">
			<div class="body1">
				<div class="list-cont1">
					<div class="line1">
						<p v-for="(item,index) in tab1" :key="item.id" @click="chooseTab1(item.id)">
							<span :class="{active: tab1Id==item.id}">{{item.nm}}</span>
						</p>
					</div>
				</div>

			</div>
		</van-sticky>

		<div class="body2" v-if="tab1Id!=1">
			<div class="list-cont2">

				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
					:immediate-check="immediate">
					<div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
						<van-row class="row" align="center" type="flex">
							<van-col span="10">
								<div class="left">
									<img :src="item.imgUrl" style="width: 100%;object-fit: cover">
								</div>
							</van-col>
							<van-col span="13" offset="1">
								<div class="right">
									<p>{{item.nm}}</p>
									<p>{{item.cont}}<span @click="toDetail(item)">查看更多
											<van-icon name="arrow" />
										</span></p>
									<p>{{item.releTm}}</p>
								</div>
							</van-col>
						</van-row>

					</div>
				</van-list>

			</div>
		</div>
		<div class="body2" v-if="tab1Id==1">
			<div class="topSearch">
				<div class="leftSearch">
					<input v-model="nm" placeholder="请输入项目名称"  @blur="toSearch"/>
				</div>
				<div class="rightSearch">
					<span @click="showPicker=true" :style="{'color':beginTime?'#000000':''}">{{beginTime?beginTime:'开始时间'}}</span>
					<van-popup v-model="showPicker" round position="bottom">
					  <van-datetime-picker
					    v-model="currentDate"
					    type="date"
					    title="选择年月日"
						@confirm="confirmTo"
						@cancel="cancelTo"
					  />
					</van-popup>
					~
					<span  @click="showPicker2=true" :style="{'color':endTime?'#000000':''}">{{endTime?endTime:'结束时间'}}</span>
					<van-popup v-model="showPicker2" round position="bottom" >
					  <van-datetime-picker
					    v-model="currentDate"
					    type="date"
					    title="选择年月日"
						@confirm="confirmTo2"
						@cancel="cancelTo2"
					  />
					</van-popup>
				</div>
			</div>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
				:immediate-check="immediate">
			<div class="bodyList" v-for="(item,index) in list" :key='index' @click="toDetailTwo(item)">
				<div class="list">
					<div class="listLeft">
						项目名称:
					</div>
					<div class="listRight">
						{{item.nm}}
					</div>
				</div>
				<div class="list">
					<div class="listLeft">
						发布日期:
					</div>
					<div class="listRight">
						{{item.publishTm}}
					</div>
				</div>
				<div class="list">
					<div class="listLeft">
						报名截止日期:
					</div>
					<div class="listRight">
						{{item.completeTm}}
					</div>
				</div>
				<div class="list" style="margin-bottom: 0;">
					<div class="listLeft">
						项目状态:
					</div>
					<div class="listRight">
						<p v-if="returnDate(item.completeTm)" style="color: #2778BE;">进行中</p>
						<p v-else>已结束</p>
					</div>
				</div>
				<img src="../../../assets/img/person/arrow_right.png" >
			</div>
			</van-list>
		</div>

	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import bg from '@/assets/img/bg.png'
	import {
		mapState
	} from "vuex";

	export default {

		data() {
			return {
				nm:'',//筛选条件 项目名称
				beginTime:'',
				endTime:'',
				currentDate:'',
				completeTm:'',//筛选条件 开始时间~结束时间
				bg,
				value: '',
				tab1Id: -1, //第一个标签页选中
				adertList: [], //轮播图列表
				pageNo: 1,
				pageSize: 10,
				finished: false, //标记是否已经加载完
				showPicker:false,
				showPicker2:false,
				loading: false,
				immediate: false,
				list: [],
				tab1: [{
						id: 0,
						nm: '船舶资料',
					},
					{
						id: 1,
						nm: '设计档案',
					},
					{
						id: 2,
						nm: '建造档案',
					},
					{
						id: 3,
						nm: '维保记录',
					},
				],
				height: 55, //顶部高度


			};
		},
		components: {
			penHeader,

		},
		computed: {
			...mapState([
				'serverAddr'
			])
		},
		async created() {

		},
		mounted() {
			this.getAdert();
			this.getCatList()
			this.height = document.getElementById("pen-header").clientHeight
			console.log("顶部高度" + this.height)
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
			this.currentDate=new Date()
			console.log(this.currentDate);
		},
		methods: {
			//切换设备
			changeDevice() {
				console.log("=========== " + window.location.pathname + " ===========")
				let isPC = this.app.IsPC()
				if (isPC) {
					window.location.href = window.location.origin + this.serverAddr + '/tradeInfo/tradeInfo'
				}
			},
			async getAdert() {
				let list = await this.api.getAdert('newsLun')
				this.adertList.push(...list)
			},
			//跳转详情页面
			toDetail(item) {
				window.localStorage.setItem('tradeId', this.tab1Id)
				this.until.href("./infoDetail.html?id=" + item.id)
			},
			toDetailTwo(item){
				window.localStorage.setItem('tradeId', this.tab1Id)
				this.until.href("./infoDetailTwo.html?id=" + item.id)
			},
			chooseTab1(id) {
				if (id != this.tab1Id) {
					this.tab1Id = id
					this.pageNo = 1
					this.list = []
					this.finished = false
					this.getList()
				}
			},
			toPage(url) {
				if (url) {
					window.location.href = url
				}
			},
			async getList() {

				let qry = this.query.new()
				if (this.tab1Id == 1) {
					if(this.nm){
						 this.query.toW(qry,'nm',this.nm,'LK')
					}
					if(this.beginTime){
						this.query.toW(qry,'completeTm',this.beginTime,'GT')
					}
					if(this.endTime){
						this.query.toW(qry,'completeTm',this.endTime,'LT')
					}
					this.query.toO(qry,'completeTm','desc')
					this.query.toP(qry,this.pageNo,this.pageSize)
					this.api.getBidList(this.query.toEncode(qry)).then(res => {
					  res.data.list.forEach(item => {
					    item.completeTm = item.completeTm.substring(0,10)
					    item.publishTm = item.publishTm.substring(0,10)
					  })
					  this.list.push(...res.data.list)
					  this.finished = this.list.length >= res.page.total
					  this.loading = false;
					  this.pageNo++
					  console.log(this.list);
					})
				}
				else{
					this.query.toW(qry, 'cid', this.tab1Id, 'EQ')
					this.query.toP(qry, this.pageNo, this.pageSize)
					let res = await this.api.tradeInfo(this.query.toEncode(qry))
					res.data.list.forEach((item, index) => {
						item.cont = item.cont.replace(/<\/?[^>]*>/g, "").slice(0, 35) + '...';
						item.cont = item.cont.replace(/(&nbsp;)/g, "");
						// this.objectFitImages(this.$refs['img'+index])
						// console.log(item.id)
					})
					this.list.push(...res.data.list)
					// 加载状态结束
					this.finished = this.list.length >= res.page.total
					this.loading = false;
					this.pageNo++
				}
		
			},
			//分类列表
			async getCatList() {
				let qry = this.query.new()
				this.tab1 = await this.api.infoList(this.query.toEncode(qry))
				this.tab1.push({
					nm: '招标公告',
					id: 1
				})
				if (localStorage.getItem('tradeId')) {
					this.chooseTab1(window.localStorage.getItem('tradeId'))
				} else if (this.until.getQueryString("tabId")) {
					this.chooseTab1(this.until.getQueryString("tabId"))
				} else {
					this.chooseTab1(this.tab1[0].id)
				}
			},
			onLoad() {
				if (!this.finished) {
					console.log("加载。。。。")
					this.getList()
				}
			},
			confirmTo(value){
				console.log(value);
				this.pageNo = 1
				this.list = []
				this.finished = false
				this.beginTime=this.until.formatTime(value)
				this.showPicker=false
				this.getList()
			},
			confirmTo2(value){
				console.log(value);
				this.pageNo = 1
				this.list = []
				this.finished = false
				this.endTime=this.until.formatTime(value)
				this.showPicker2=false
				this.getList()
			},
			cancelTo(){
				this.showPicker=false
			},
			cancelTo2(){
				this.showPicker2=false
			},
			toSearch(){
				this.pageNo = 1
				this.list = []
				this.finished = false
				this.getList()
			},
			returnDate() {
			  return (date) => {
			    if((new Date(date+' 23:59:59')).getTime()>this.nowDate){
			      return true
			    } else {
			      return false
			    }
			  }
			}
		}
	};
</script>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");

	#container {

		.top {
			width: 100%;
			height: 3.7rem;
			z-index: 9;
			position: relative;

			.top-1 {
				height: 2.6rem;
				width: 100%;
				background-size: 100% 100% !important;
			}

			.top-2 {
				height: 1.1rem;
			}

			.my-swipe {
				position: absolute;
				top: 0.2rem;
				left: 0;
				right: 0;
				height: 3.5rem;
				width: 100%;

				.swipe-img {
					border-radius: 5px;
					display: block;
					margin: 0 auto;
					width: 94%;
					height: 100%;
					object-fit: cover;
				}
			}
		}

		.top-place {
			height: 3.7rem;
		}

		.body1 {
			font-size: 0.29rem;
			background: @backgroundColor;
			padding: 0.2rem 0.2rem 0 0.2rem;
			z-index: 10;

			.list-cont1 {
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				background: white;
				position: relative;
				padding: 0.2rem 0 0 0;

				.line1 {
					width: 100%;
					display: flex;
					background: white;
					height: 0.8rem;
					align-items: center;
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);
					padding: 0 0.2rem;
					box-sizing: border-box;
					overflow-x: auto;
					overflow-y: hidden;
					white-space: nowrap;

					/*标题*/
					p {
						font-size: 0.285rem;
						margin: 0 0.1rem;
						height: 95%;
						display: flex;
						align-items: center;
						justify-content: center;
						// height: 100%;
						/*对所有属性过渡0.2s*/
						transition: all 0.2s;
						color: #666666;

						span {
							height: 100%;
							display: flex;
							align-items: center;
						}

						&:hover {
							cursor: pointer;
						}
					}

				}
				.line1::-webkit-scrollbar { 
					height: 0 !important;
				}
			}
		}

		.body2 {
			font-size: 0.29rem;
			background: @backgroundColor;
			padding: 0 0.2rem 0.2rem 0.2rem;

			.list-cont2 {
				border-bottom-left-radius: 5px;
				border-bottom-right-radius: 5px;
				background: white;
				position: relative;
				padding: 0 0.2rem 0 0.2rem;



				.list-item {
					.row {
						padding: 0.2rem 0.2rem;
						font-size: 0.23rem;
						border-bottom: 1px solid rgba(0, 0, 0, 0.1);

						.left {
							width: 100%;
							height: 100%;
							display: flex;
							align-items: center;

							img {
								width: 100%;
								object-fit: cover;

							}
						}

						.right {
							p:nth-of-type(1) {
								color: #343434;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								font-size: 0.28rem;
							}

							p:nth-of-type(2) {
								color: #666666;
								font-size: 0.20rem;

								span {
									color: rgba(39, 120, 190, 1);
								}
							}

							p:nth-of-type(3) {
								color: #666666;
								font-size: 0.20rem;
							}
						}
					}
				}



			}
			.topSearch{
				width: 100%;
				padding: 0.2rem;
				box-sizing: border-box;
				background-color:#FFFFFF;
				display: flex;
				justify-content: space-between;
				border-bottom: 0.01rem solid rgba(0,0,0,0.1);
				.leftSearch{
					input{
						width: 2.52rem;
						height: 0.6rem;
						background: #FFFFFF;
						border: 0.01rem solid #E5E5E5;
						border-radius: 0.3rem;
						padding: 0.2rem;
						box-sizing: border-box;
						font-size: 0.22rem;
					}
					input::placeholder{
						font-size: 0.22rem;
						color: #B8B8B8;
					}
				}
				.rightSearch{
					width: 4rem;
					height: 0.6rem;
					background: #FFFFFF;
					border: 0.01rem solid #E5E5E5;
					border-radius: 0.3rem;
					box-sizing: border-box;
					font-size: 0.22rem;
					text-align: center;
					line-height: 0.6rem;
					color: #B8B8B8;
				}
			}
			.bodyList{
				padding: 0.4rem 0.3rem;
				box-sizing: border-box;
				background-color: #ffffff;
				margin-bottom:0.1rem ;
				border-radius: 0.1rem;
				position: relative;
				.list{
					display: flex;
					margin-bottom: 0.29rem;
					.listLeft{
						font-size: 0.24rem;
						color: #333333;
						width: 1.8rem;
					}
					.listRight{
						font-size: 0.24rem;
						color: #333333;
						margin-left:0.2rem;
						
					}
				}
				img{
					width: 0.12rem;
					height: 0.22rem;
					position: absolute;
					right: 0.3rem;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

	}


	.active {
		color: #333333;
		border-bottom: 2px solid #2778BE !important;
		font-weight: bold;
	}
</style>
