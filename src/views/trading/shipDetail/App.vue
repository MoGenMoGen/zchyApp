<template>
	<div class="app" >
		<my-header title="商品详情" v-if="isMyApp()">
			<slot>
				<div class="headerRight">
					<img :src="share2" @click="toShare"/>
				</div>
			</slot>
		</my-header>
		<div class="main">
			<div class="swipeList">
				<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
					<van-swipe-item v-for="(item,index) in imgList" :key="index"><img :src="item" alt=""></van-swipe-item>
				</van-swipe>
				<img :src="backI" @click="back" class="backI">
				<img :src="shareI" @click="toShare" class="shareI" v-if="isMyApp()">
			</div>
			<div class="infoBasic">
				<div>
					<p class="priceP" v-if="currentInfo && currentInfo.origPrice !=price"><span style="font-size: 0.24rem;">￥</span>{{currentInfo.origPrice}}</p>
					<p class="priceP" v-if="currentInfo && currentInfo.origPrice ==price"><span style="font-size: 0.24rem;">价格面议</span></p>
					<p class="startP" @click="toCollect">
						<i class="iconfont" :class="info.isCollect==1?'iconxing1':'iconxing'"></i>
						<span>收藏</span>
					</p>
				</div>
				<p>{{info.nm}}</p>
				<span v-if="info.ship">船型编码： {{currentInfo ? currentInfo.shipCd : ''}}</span>
				<span v-else>销量： {{info.salesQty}}</span>
			</div>
			<div class="whiteBox3" v-if="info.ship">
				<div style="border-bottom: 0.01rem solid rgba(0,0,0,0.1);">
					<span style="margin-right: 0.13rem;">设 计 院 ：</span>
					<p>{{info.design}}</p>
					<van-icon name="arrow" @click="toPage('../shipMan/design.html?id='+info.designOrgId)" />
				</div>
				<div>
					<span style="margin-right: 0.13rem;">承建船厂 ：</span>
					<p>{{info.supplier}}</p>
					<van-icon name="arrow" @click="toPage('../shipMan/shipYard.html?id='+info.supplierOrgId)"/>
				</div>
			</div>
			<!--<div class="whiteBox2">-->
				<!--<span style="margin-right: 0.18rem;">设 计 院 :</span>-->
				<!--<p>{{info.designNm}}</p>-->
				<!--<van-icon name="arrow" />-->
			<!--</div>-->
			<!--购买须知的弹出层-->
			<van-popup v-model="show"  position="bottom" closeable round >
				<div class="buyKnow">
					<p>购买须知</p>
					<ul>
						<li v-for="(item,index) in buyKnow" :key="index"><span></span><p>{{item}}</p></li>
					</ul>
				</div>
			</van-popup>
			<div class="whiteBox3">
                      <div style="border-bottom: 0.01rem solid rgba(0,0,0,0.1);" @click="show=true">
                          <span style="margin-right: 0.23rem;">须知</span>
                          <p>请在购买前认真阅读</p>
                          <van-icon name="arrow" />
                      </div>
              <div @click="toShow">
                  <span style="margin-right: 0.23rem;">选择</span>
                  <p>{{currentInfo?currentInfo.attrDesc:'请选择规格'}}</p>
                  <van-icon name="arrow" />
              </div>
            </div>
			<div class="whiteBox2" v-if="!info.ship && ceList.length>0">
				<span style="margin-right: 0.39rem;">证书</span>
				<div class="img">
					<img :src="item" v-for="(item,index) in ceList" :key="index"/>
				</div>
			</div>

			<!-- 详细描述/船舶设备 -->
			<div class="detailBox">
				<pro-detail :info="info" ref="shipDetail"></pro-detail>
			</div>
			<!--店铺信息-->
			<shop-info :info="info"></shop-info>

		</div>
		<!--选择规格-->
		<sku-choose :info="info"  ref="chooseSku" :currentSku="currentSku" @changeCurerent="changeCurerent"></sku-choose>
		<van-popup v-model="showBottom" position="bottom" :style="{ height: '30%' }" >
			<bottom-share :info="info" description="商品详情分享" :thumb="info.fmImgUrl"></bottom-share>
		</van-popup>
	</div>

</template>

<script>
    import shopImg from '@/assets/img/trading/优质店铺.png'
    import backI from '@/assets/img/shipMan/返回.png'
    import shareI from '@/assets/img/shipMan/分享.png'
    import share2 from '@/assets/img/trading/分享.png'
    import hookI from '@/assets/img/shipMan/勾.png'
    import proDetail from "@/components/shipMan/proDetail";
    import shopInfo from "@/components/shipMan/shopInfo";
    import skuChoose from "@/components/trade/skuChoose";
    import bottomShare from "../../../components/personal/bottomShare";

    import myHeader from '@/components/opacityHeader'

    import {mapState} from "vuex";
    export default {
        data() {
            return {
                show:false,
                skuShow:false,
                backI,
                shareI,
                share2,
                hookI,
                shopImg,
                imgList:[],
                id:"",
                info:{},
                currentInfo:{},
                specs:[],
                currentSku:'',
                ceList:[],
				sku:{
                    tree:[],
                    list:[],
                    price:'100',
				},
				showBottom:false,
                buyKnow:[],
            };
        },
        computed: {
            ...mapState([
                'cartNum',
				'price',
				'serverAddr'
            ])
        },
        components:{
            proDetail,
            shopInfo,
            skuChoose,
			bottomShare,
            myHeader
        },
        watch:{
            currentSku() {
                this.currentInfo = this.info.skus.find(item => item.skuId == this.currentSku)
					if (this.currentInfo && this.currentInfo.shipId) {
						console.log('一级')

						this.$refs.shipDetail.getInfo(this.currentInfo.shipId)
					}
                },
        },
        created(){
        },
        mounted() {
            this.id=this.until.getQueryString('id')
            this.getInfo()
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
			isMyApp(){
				let u = navigator.userAgent;
				let flag = u.indexOf('zhongChuang') > -1;
				return flag;
			},
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/Trade/productDetail?id='+this.id
				}
			},
            toShow(){
              this.$refs.chooseSku.toShow()
			},
            changeCurerent(id){
              this.currentSku = id
			},
            //购买
            onBuyClicked(){

			},
			//加入购物车
            onAddCartClicked(){

			},
            async getInfo(){
                this.info = await this.api.tradeShipDetail(this.id)
                this.imgList = this.info.imgUrl.split(',')
				let currentData = this.info.skus.find(item=>{
				    return item.stock && item.stock>0
				})
                this.currentSku = currentData.skuId

                this.specs = this.info.attrs
				if(!this.info.ship){
                    this.ceList = this.info.ce ? this.info.ce.split(',') : []
				}
				let cont =  await this.api.ruleDetail('5143053424022528')
				console.log(cont)
                this.buyKnow = cont.data.cont.split('-')
                // this.$refs.shipDetail.getInfo(this.id)
            },
			//收藏
            toCollect(){
                if (this.info.isCollect === 1) {

                    this.api.delFollow(this.id).then(()=>{
                        this.info.isCollect = 0;
					})
                } else {

                    //收藏商品
                    let param = {
                        targetId: this.id,
                        type: this.info.ship ? 2 : 3,
                    }
                    this.api.followShop(param).then(()=>{
                        this.info.isCollect = 1;
                    })
                }
			},

            back(){
                window.history.go(-1);
            },
            toShare(){
				this.showBottom=true
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
		-webkit-overflow-scrolling: touch;

		/*display: flex;*/
		/*display: -webkit-flex;*/
		/*flex-direction: column;*/
		background-color: #F1F3F2;
		.headerRight{
			display: flex;
			display: -webkit-flex;
			height: 100%;
			img{
				margin: auto;
				width: 0.4rem;
			}
		}
		.main{
			/*overflow: auto;*/
			/*flex: 1;*/
			padding-bottom: 1.1rem;
			.swipeList{
				position: relative;
				>img{
					position: absolute;
					width: 0.5rem;
					height: 0.5rem;
					top: 0.23rem;
				}
				img{
					display: block;
				}
				.backI{
					left: 0.23rem;
				}
				.shareI{
					right: 0.23rem;
				}
			}
			.buyKnow{
				width: 100%;
				color: #343434;
				>p{
					font-size: 0.3rem;
					text-align: center;
					border-bottom: 1px solid rgba(0,0,0,0.1);
					line-height: 1rem;
				}
				ul{
					padding: 0 0.5rem 0.3rem 0.34rem;
					margin-bottom: 1.87rem;
					li{
						display: flex;
						display: -webkit-flex;
						margin-top: 0.2rem;
						span{
							width: 0.04rem;
							height: 0.04rem;
							background: rgba(0,0,0,0.76);
							margin-right: 0.2rem;
							margin-top: 0.15rem;
						}
					}
				}
			}
			.infoBasic{
				background-color: #ffffff;
				padding: 0.2rem 0.27rem 0.4rem 0.35rem;
				border-radius: 0 0 0.2rem 0.2rem;
				margin-bottom: 0.2rem;
				>div{
					display: flex;
					align-items: center;
					.priceP{
						flex: 1;
						color: #FF3C3E;
						font-size: 0.37rem;
					}
					.startP{
						display: flex;
						flex-direction: column;
						align-items: center;
						>i{font-size: 0.4rem;}
						.iconxing1{color: #E4393C;}
						.iconxing{color: #343434;}
						>span{font-size: 0.18rem;}
					}
				}
				>p{
					font-size: 0.3rem;
					color: #343434;
					margin: 0.21rem 0 0.29rem;
				}
				>span{
					font-size: 0.22rem;
					color: #9a9a9a;
				}
			}
			.whiteBox2,.whiteBox3{
				background-color: #ffffff;
				border-radius: 0.2rem;
				margin-bottom: 0.2rem;
				display: flex;
				font-size: 0.24rem;
				color: #343434;
				p{
					flex: 1;
					.disc{
						margin-right: 0.12rem;
						color: #FF3C3E;
						border: 0.01rem solid #FF3C3E;
						padding: 0.08rem 0.13rem;
						border-radius: 0.05rem;
					}
				}
				i{
					font-size: 0.35rem;
					color: #9a9a9a;
				}
			}
			.whiteBox2{
				align-items: center;
				padding: 0.36rem 0.48rem 0.36rem 0.34rem;
				>div{
					flex: 1;
					display: flex;
					>p{
						flex: 1;
						display: flex;
						align-items: center;
						>img{
							width: 0.31rem;
							height: 0.31rem;
							margin-right: 0.15rem;
						}
					}
				}
				.img{
					img{
						width: 0.5rem;
						margin-right: 0.1rem;
					}
				}
			}
			.whiteBox3{
				flex-direction: column;
				>div{
					width: 100%;
					box-sizing: border-box;
					padding: 0.36rem 0.48rem 0.36rem 0.34rem;
					display: flex;
				}
			}
			.detailBox{
				background-color: #ffffff;
				border-radius: 0.2rem;
				margin-bottom: 0.2rem;

			}

		}



	}

</style>
