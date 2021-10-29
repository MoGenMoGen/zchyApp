<template>
    <div class="trading" >

		<div class="homeTop">
			<van-icon name="bars"  size="25" color="#ffffff" @click="toPage('classify.html')"/>
			<div>
                <my-search></my-search>
			</div>
			<img :src="msg" style="width:0.43rem; height:0.38rem;margin-right: 0;" @click="toPage('../person/message.html')">
		</div>
        <div class="main">
			<div :style="{backgroundImage:'url('+bg+')'}">
				<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
					<van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
				</van-swipe>
			</div>

			<div class="whiteBox topMBox" style="padding: 0.4rem 0;">
				<div class="tabBox">
					<p v-for="(item,index) in tabList" :key="index" @click="toList(item)">
						<img :src="item.icon3" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
				<p><span class="line"></span><span style="margin: 0 0.24rem;">平台交易金额</span><span class="line"></span></p>
				<div class="dealTotal">
					<p><span class="num">{{volume.shipOrder}}</span><span>船舶交易总额</span></p>
					<span class="lineC"></span>
					<p><span class="num">{{volume.goodsOrder}}</span><span>产品交易总额</span></p>
				</div>
			</div>
			<!-- 重点推荐 -->
			<div class="whiteBox recomBox" style="padding: 0.3rem 0.2rem;">
				<div class="recomTitle"><img :src="recomI"><p>重点推荐</p><span></span></div>
				<div class="recomList">
					<div :style="{width: (recomList.length*1.72)-0.2+'rem'}">
						<p v-for="(item,index) in recomList" :key="index"  @click="toPage('shipDetail.html?id='+item.goodsId)">
							<img :src="item.img" alt="">
							<span v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥{{item.goodsMinPrice}}</span>
							<span v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥{{item.goodsMinPrice}}-{{item.goodsMaxPrice}}</span>
							<span v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</span>
							<!--<span class="childA">￥{{item.mktPrice}}</span>-->
						</p>
					</div>
				</div>
			</div>
			<!-- 专区 -->
			<div class="whiteBox areaBox">
				<div @click="toPage(areaList1[0].href)">
					<p><img :src="areaList1[0].icon" alt=""><span>{{areaList1[0].nm}}</span></p>
					<span class="areaCont" style="color:#EE854D;"><!-- {{areaList1[0].cont}} --></span>
					<img :src="areaList1[0].img" alt="">
				</div>
				<div @click="toPage(areaList1[1].href)">
					<p><img :src="areaList1[1].icon" alt=""><span>{{areaList1[1].nm}}</span></p>
					<span class="areaCont" style="color:#EA3A57;"><!-- {{areaList1[1].cont}} --></span>
					<img :src="areaList1[1].img" alt="">
				</div>
				<div @click="toPage(areaList1[2].href)">
					<p><img :src="areaList1[2].icon" alt=""><span>{{areaList1[2].nm}}</span></p>
					<span class="areaCont" style="color:#69CBC2;"><!-- {{areaList1[2].cont}} --></span>
					<img :src="areaList1[2].img" alt="">
				</div>
			</div>
			<div class="whiteBox areaBox">
				<div @click="toPage(areaList2[0].href)">
					<p><img :src="areaList2[0].icon" alt=""><span>{{areaList2[0].nm}}</span></p>
					<span class="areaCont" style="color:#8557EA;"><!-- {{areaList2[0].cont}} --></span>
					<img :src="areaList2[0].img" alt="">
				</div>
				<div @click="toPage(areaList2[1].href)">
					<p><img :src="areaList2[1].icon" alt=""><span>{{areaList2[1].nm}}</span></p>
					<span class="areaCont" style="color:#2778BE;"><!-- {{areaList2[1].cont}} --></span>
					<img :src="areaList2[1].img" alt="">
				</div>
				<div @click="toPage(areaList2[2].href)">
					<p><img :src="areaList2[2].icon" alt=""><span>{{areaList2[2].nm}}</span></p>
					<span class="areaCont" style="color:#FF4C4C;"><!-- {{areaList2[2].cont}} --></span>
					<img :src="areaList2[2].img" alt="">
				</div>
			</div>
			<!-- 产品列表 -->
			<div class="whiteBox classBox" v-for="(item,index) in tabList" :key="index">
				<div class="classTitle">
					<img :src="tradingL">
					<p><img :src="item.icon3" alt=""><span>{{item.nm}}</span></p>
					<img :src="tradingR">
				</div>
				<div class="classList">
					<div v-for="(v,j) in item.list" :key="j" @click="toPage('./shipDetail.html?id='+v.goodsId)">
						<van-image
								height="2rem"
								fit="cover"
								:src="v.img"
								v-if="item.ship"
						/>
						<van-image
								height="3.3rem"
								fit="cover"
								:src="v.img"
								v-else
						/>
						<!--<img :src="v.img" alt="">-->
						<p :title="v.nm">{{v.nm}}</p>
						<!--<span>￥{{v.origPrice}}</span>-->
						<span v-if="v.goodsMinPrice===v.goodsMaxPrice && v.goodsMinPrice !=price">￥{{v.goodsMinPrice}}</span>
						<span v-if="v.goodsMinPrice!==v.goodsMaxPrice">￥{{v.goodsMinPrice}}-{{v.goodsMaxPrice}}</span>
						<span v-if="v.goodsMinPrice===v.goodsMaxPrice && v.goodsMinPrice ==price">价格面议</span>
					</div>
				</div>
				<p class="seeMore" @click="toList(item)">查看更多 ></p>
			</div>
        </div>
        <tab page="trading" ref="childrenTab"></tab>
    </div>
</template>

<script>
    import tab from '@/components/tab'
	import bg from '@/assets/img/bgS.png'
	import logo from '@/assets/img/logo.png'
	import search from '@/assets/img/search.png'
	import msg from '@/assets/img/msg.png'

    import mySearch from '@/components/search'

	import recomI from '@/assets/img/trading/重点推荐.png'
	import area1 from '@/assets/img/trading/特价专区.png'
	import area2 from '@/assets/img/trading/折扣专区.png'
	import area3 from '@/assets/img/trading/发现好货.png'
	import area4 from '@/assets/img/trading/新品首发.png'
	import area5 from '@/assets/img/trading/排行榜单.png'
	import area6 from '@/assets/img/trading/优质店铺.png'
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'

    import {mapState} from "vuex";
    export default {
        computed: {
            ...mapState([
                'price',
				'serverAddr'
            ])
        },
        data() {
            return {
                bg,
				logo,
				search,
				msg,
				recomI,
				tradingL,
				tradingR,
				topShow:false,
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
				checkNm:"船舶",		//被选中的label
				searchNm	:'',	//搜索输入框内容
				lunBoList:[],
				tabList:[],
				volume:{},		//平台交易总量
				recomList:[],	//重点推荐
				areaList1:[
					{icon:area1,
						img:'',
						nm:'特价专区',
						cont:'限时疯抢',
						href:'./specialZone.html',
					},{icon:area2,
						img:'',
						nm:'优惠专区',
						cont:'享惊喜优惠',
						href:'./discountZone.html',
					},{icon:area3,
						img:'',
						nm:'发现好货',
						cont:'美好新生活',
						href:'./foundGoods.html',
					}
				],
				areaList2:[
					{icon:area4,
						img:'',
						nm:'新品首发',
						cont:'抢热门设备',
						href:'./news.html',
					},{icon:area5,
						img:'',
						nm:'排行榜单',
						cont:'跟榜购好物',
						href:'./leaderboard.html',
					},{icon:area6,
						img:'',
						nm:'优质店铺',
						cont:'进店选好品',
						href:'./quality.html',
					}
				],
            };
        },
        components:{
            tab,mySearch
        },
        async created(){

        },
        async mounted() {
			this.getAdert()
			this.getData()
			this.getProductList()
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/onlinetrading'
				}
			},
            //去船舶列表或者产品列表
            toList(item){
                if(item.ship){
                    this.toPage('shipTrade.html')
                }else {
                    this.toPage('productTrade.html?id='+item.id)
                }
			},
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
				let data=await this.api.getAdert('specialArea')
				console.log('专区')
				console.log(data)
				data.forEach((item,index)=>{
					if(index<3){
						this.areaList1[index].img=item.imgUrl
					}else{
						this.areaList2[index-3].img=item.imgUrl
					}
				})
			},
			//获取分类及分类下的列表
			async getProductList(){
                let qry = this.query.new()

                this.query.toWNull(qry,'pid')
                this.query.toO(qry,'seq','asc')
				let data=await this.api.getClassify(this.query.toEncode(qry))
				this.tabList = data
				this.tabList.forEach((item,index)=>{
				    if(item.ship){
                        let qry = this.query.new()
                        this.query.toO(qry,'seq','desc')
                        this.query.toP(qry,1,4)
                        this.api.shipTradeList(this.query.toEncode(qry)).then(res=>{
                            item.list = res.data.list
                            this.$set(this.tabList,index,item)
                        })
					}else {
                        let qry = this.query.new()
                        this.query.toW(qry,'tid',item.id,'EQ')
                        this.query.toO(qry,'seq','desc')
                        this.query.toP(qry,1,4)
                        this.api.goodList(this.query.toEncode(qry)).then(res=>{
                            item.list = res.data.list
                            this.$set(this.tabList,index,item)
                        })
					}
				})

			},
			async getData(){
				// this.volume = await this.api.volume() //平台成交总量
                this.volume.shipOrder = await this.api.volumeShip() //平台成交总量
                this.volume.goodsOrder = await this.api.volumePro() //平台成交总量
				this.recomList = await this.api.shopRecomdPro() //重点推荐
				console.log('重点推荐')
				console.log(this.recomList)
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
</style>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
    .trading{
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
		.homeTop{
			display: flex;
			align-items: center;
			padding: 0.22rem 0.27rem 0.3rem;
			background: @themeColor;
			>div{
				flex: 1;
				display: flex;
				align-items: center;
				background-color: #ffffff;
				height: 0.6rem;
				border-radius: 0.3rem;
				margin-right: 0.26rem;
                margin-left: 0.26rem;
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
				}
			}
			>img{
				margin-right: 0.26rem;
			}
		}
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;

			>div:not(:first-of-type){
				margin: 0 0.2rem;
			}
			>div{
				padding: 0 0.2rem;
				background-repeat: no-repeat;
				background-position: center top;
				background-size: contain;
			}
			.whiteBox{
				margin-bottom: 0.3rem !important;
				border-radius: 0.1rem;
				background-color: #ffffff;
			}
			.topMBox{
				// display: flex;
				// flex-direction: column;
				// align-items: center;
				margin-top: 0.3rem;
				.tabBox{
					display: flex;
					>p{
						width: 20%;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 0.6rem;
						>img{
							width: 0.42rem;
							height: 0.42rem;
							margin-bottom: 0.2rem;
						}
						>span{
							font-size: 0.22rem;
							color: #666666;
						}
					}
				}
				>p{
					font-size: 0.3rem;
					color: #303030;
					display: flex;
					font-weight: 600;
					justify-content: center;
					align-items: center;
					margin-bottom: 0.24rem;
					.line{
						display: block;
						width: 0.49rem;
						height: 0.01rem;
						background-color: rgba(0,0,0,0.1);
					}
				}
				.dealTotal{
					padding: 0 0.9rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					>p{
						display: flex;
						flex-direction: column;
						align-items: center;
						.num{
							font-size: 0.36rem;
							color: #FF3E3E;
							font-weight: 600;
							margin-bottom: 0.2rem;
						}
						>span{
							font-size: 0.24rem;
							color: #666666;
						}
					}
					.lineC{
						display: block;
						width: 0.01rem;
						height: 0.48rem;
						background-color: rgba(0,0,0,0.1);
					}
				}
			}
			.recomBox{
				.recomTitle{
					display: flex;
					align-items: center;
					margin-bottom: 0.2rem;
					>img{
						width: 0.3rem;
						height: 0.3rem;
						margin-right: 0.11rem;
					}
					>p{
						font-size: 0.3rem;
						color: #303030;
						font-weight: 600;
						flex: 1;
					}
					>span{
						font-size: 0.24rem;
						color: #999999;
					}
				}
				.recomList{
					overflow: auto;
					>div{
						display: flex;
						>p{
							display: flex;
							flex-direction: column;
							align-items: center;
							width: 1.52rem;
							margin-right: 0.2rem;
							>img{
								width: 1.52rem;
								height: 1.52rem;
								margin-bottom: 0.2rem;
							}
							>span{
								font-size: 0.22rem;
								color: #E83F42;
								font-weight: 600;
							}
							.childA{
								font-size: 0.18rem;
								color: #999999;
								font-weight: 400;
								margin-top: 0.08rem;
								text-decoration: line-through;
							}
						}
						>p:last-child{
							margin-right: 0;
						}
					}
				}
				.recomList::-webkit-scrollbar {/*滚动条整体样式*/
					/*width: 1px;   !*高宽分别对应横竖滚动条的尺寸*!*/
					height: 5px;
				}
				.recomList::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
					border-radius: 5px;
					width: 1px;
					-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
					/*background: rgba(0,0,0,0.2);*/
				}


			}
			.areaBox{
				display: flex;
				padding: 0.3rem 0 0.2rem;
				>div{
					width: 33%;
					display: flex;
					flex-direction: column;
					align-items: center;
					>p{
						margin-bottom: 0.16rem;
						display: flex;
						align-items: center;
						>img{
							width: 0.3rem;
							height: 0.3rem;
							margin-right: 0.12rem;
						}
						>span{
							font-size: 0.3rem;
							color: #303030;
							font-weight: 600;
						}
					}
					.areaCont{
						font-size: 0.24rem;
						margin-bottom: 0.25rem;
					}
					>img{
						width: 1.67rem;
						height: 1.67rem;
					    border-radius: 0.2rem;
					}
				}
			}
			.classBox{
				padding: 0.34rem 0.2rem 0.39rem;
				.classTitle{
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 0.31rem;
					>img{
						width: 1.2rem;
						// height: 0.03rem;
					}
					>p{
						margin: 0 0.3rem;
						>img{
							width: 0.28rem;
							margin-right: 0.15rem;
						}
						>span{
							font-size: 0.3rem;
							color: #303030;
						}
					}
				}
				.classList{
					display: flex;
					flex-wrap: wrap;
					>div{
						width: 48.5%;
						margin-right: 1.9%;
						margin-bottom: 0.2rem;
						border-radius: 0.1rem;
						border: 0.01rem solid #e9e9e9;
						display: flex;
						flex-direction: column;
						overflow: hidden;
						>p{
							margin-top: 0.3rem;
							font-size: 0.24rem;
							color: #666666;
							margin-bottom: 0.2rem;
							padding-left: 0.2rem;
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						>span{
							font-size: 0.24rem;
							color: #FF3B3F;
							margin-bottom: 0.3rem;
							padding-left: 0.2rem;
						}
					}
					>div:nth-child(2n){
						margin-right: 0;
					}
				}
				.seeMore{
					font-size: 0.24rem;
					color: #999999;
					margin-top: 0.2rem;
					text-align: center;
				}
			}
        }
    }

</style>
