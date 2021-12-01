<template>
    <div class="app" >
        <div class="main">
			<div class="swipeList">
				<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
				  <van-swipe-item v-for="(item,index) in imgList" :key="index"><img :src="item" alt=""></van-swipe-item>
				</van-swipe>
				<img :src="backI" @click="back" class="backI" >
				<img :src="shareI" @click="toShare" class="shareI" v-if="showShare">
			</div>
			<div class="infoBasic">
				<div>
					<p class="priceP"><span style="font-size: 0.24rem;">￥</span>{{info.origMinPrice}}~{{info.origMaxPrice}}万<img :src="Vr" v-if="info.vrUrl" @click.stop="toVr(info.id)" style="width: 1.38rem;height: 0.43rem;margin-left: 0.1rem;"></p>
					<p class="startP" @click="toCollect">
						<i class="iconfont" :class="info.collected==1?'iconxing1':'iconxing'"></i>
						<span>收藏</span>
					</p>
				</div>
				<p>{{info.nm}}</p>
				<span>{{info.typesNm}}</span>
			</div>
			<div class="whiteBox2" @click="toPage('./design.html?id='+info.designId)">
				<span style="margin-right: 0.18rem;">设 计 院 :</span>
				<p>{{info.designNm}}</p>
				<van-icon name="arrow" />
			</div>
      <!-- <div class="whiteBox3">
				<div style="border-bottom: 0.01rem solid rgba(0,0,0,0.1);">
					<span style="margin-right: 0.23rem;">须知</span>
					<p>请在购买前认真阅读</p>
					<van-icon name="arrow" />
				</div>
        <div>
        	<span style="margin-right: 0.23rem;">选择</span>
        	<p>请选择规格</p>
        	<van-icon name="arrow" />
        </div>
      </div> -->
			<!-- <div class="whiteBox2">
				<span style="margin-right: 0.23rem;">优惠</span>
				<p><span class="disc">满减</span>满3000元，可减10元现金</p>
				<van-icon name="arrow" />
			</div> -->
			<!-- <div class="whiteBox2">
				<span style="margin-right: 0.39rem;">服务</span>
				<div>
					<p><img :src="hookI">500元包邮</p>
					<p><img :src="hookI">品质保障</p>
					<p><img :src="hookI">中创自营</p>
				</div>
			</div> -->
			<!-- 详细描述/船舶设备 -->
			<div class="detailBox">
				<pro-detail :info="info" ref="shipDetail" shipShow="true"></pro-detail>
			</div>
		</div>
		<div class="btnList">
			<button class="yard" @click="toPage('./allDesign.html')">设计院逛逛</button>
			<button class="appo" @click="toPage('./designAppo.html')">设计预约</button>
		</div>

		<van-popup v-model="showBottom" position="bottom" :style="{ height: '30%' }" >
			<bottom-share :info="info" description="船舶设计分享" :thumb="imgList[0]"></bottom-share>
		</van-popup>
    </div>

</template>

<script>
	import { Toast } from 'vant';
	import backI from '@/assets/img/shipMan/返回.png'
	import shareI from '@/assets/img/shipMan/分享.png'
	import hookI from '@/assets/img/shipMan/勾.png'
	import proDetail from "@/components/shipMan/proDetail";
	import bottomShare from "../../../components/personal/bottomShare";
    import myHeader from '@/components/opacityHeader'
	import {mapState} from "vuex";
	import Vr from '@/assets/img/Vr.png'
    export default {
        data() {
            return {
				backI,
				shareI,
				hookI,
				Vr,
				imgList:[],
				id:"",
				info:{},
				showBottom:false,
				showShare:false,
            };
        },
        components:{
			proDetail,
			bottomShare,
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
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
			isMyApp(){
				let u = navigator.userAgent;
				this.showShare = u.indexOf('zhongChuang') > -1;

			},
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/showDetail?id='+this.id
				}
			},
            //收藏
            toCollect(){
                if (this.info.collected === 1) {

                    this.api.delFollow(this.id).then(()=>{
                        this.info.collected = 0;
                    })
                } else {

                    //收藏商品
                    let param = {
                        targetId: this.id,
                        type: 1,
                    }
                    this.api.followShop(param).then(()=>{
                        this.info.collected = 1;
                    })
                }
            },
			async getInfo(){
			  this.info = await this.api.shipDetail(this.id)
			  this.imgList = this.info.imgUrl.split(',')
			  console.log(this.info)
			  // this.$refs.shipDetail.getInfo(this.id)
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
			toVr(id) {
				window.open(`../myFrame/index.html?typeCd=1&id=${id}`)
			}
        },

    };
</script>
<style lang="less">
</style>
<style lang="less" scoped>
    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
		background-color: #F1F3F2;
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
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
				.shareI{
					right: 0.23rem;
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
						display: flex;
						align-items: center;
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
				margin-bottom: 0.6rem;

			}
		}
		.btnList{
			display: flex;
			width: 100%;
			height: 0.98rem;
			>button{
				flex: 1;
				font-size: 0.28rem;
				color: #ffffff;
			}
			.yard{
				background-color: @themeColor;
			}
			.appo{
				background-color: #F2AC3C;
			}
		}


    }

</style>
