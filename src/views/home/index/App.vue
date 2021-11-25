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
		<div class="homeTop">
			<img :src="logo" style="width:0.4rem; height:0.38rem;" >
			<div>
				<p @click="topShow=true" class="checkTop">{{checkNm}}<i class="iconfont iconarrdown"></i></p>
				<p class="searchTop">
					<img :src="search" style="width:0.23rem; height:0.23rem;margin-right: 0.1rem;">
					<input type="text" placeholder="请输入关键词查询产品" v-model="searchNm" @keyup.enter="toSearch" >
				</p>
			</div>
			<p class="msgNumBox">
				<img :src="msg" style="width:0.43rem; height:0.38rem;" @click="toPage('../person/message.html')">
				<span v-show="msgNum>0">{{msgNum>99?'99+':msgNum}}</span>
			</p>

<!--			<img :src="msg" style="width:0.43rem; height:0.38rem;" @click="toTest">-->
			<img :src="photo" style="width:0.39rem; height:0.39rem;margin-right: 0;" @click="toScan">
		</div>
    <div class="main" id="defaultScroll">
			<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
				<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
				  <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" style="display: block;" alt=""></van-swipe-item>
				</van-swipe>
			</div>

			<div class="navBox">
				<p v-for="(item,index) in navList" :key="index" @click="toPage(item.url)">
					<img :src="item.img">
					<span>{{item.nm}}</span>
				</p>
			</div>
			<div class="publishBox">
				<div class="newsTitle">
					<img :src="news" alt="">
					<p>平台发布</p>
					<span @click="toPage('../tradeInfo/index.html?tabId=1')">更多 ></span>
				</div>
				<div class="msgBox" v-for="(item,index) in publishList" :key="index" @click="toPage('../tradeInfo/infoDetail.html?id='+item.id)">
					<p class="title">· {{item.title}}</p>
					<p class="content">{{item.releTm}}</p>
				</div>
			</div>
			<div class="shipShowBox">
				<div class="imgTitle">
					<span class="lineBlue"></span>
					<p>船舶展示</p>
					<span class="more" @click="toPage('../shipMan/shipShow.html')">更多 ></span>
				</div>
				<div class="shipImgBox">
					<div>
						<div v-for="(item,index) in shipClassify" :key="index">
							<p class="img">
								<img :src="item.imgUrl" @click="toPage(`../shipMan/shipList.html?cid2=${item.id}&nm=${item.nm}&img=${item.imgUrl2}`)">
							</p>
							<p class="bottomSpan"><span class="textS">{{item.nm}}</span></p>
						</div>
					</div>
				</div>
			</div>
			<div class="productBox">
				<div class="imgTitle">
					<span class="lineBlue"></span>
					<p>热门产品</p>
					<span class="more" @click="toPage('../trading/productTrade.html?id=4942037425116160')">更多 ></span>
				</div>
				<div class="productImgBox">
					<div :style="{width: equipList.length*2.5+'rem'}">
						<div v-for="(item,index) in equipList" :key="index">
							<p>
								<img :src="item.img" @click="toPage('../trading/shipDetail.html?id='+item.goodsId)">
							</p>
							<span>{{item.nm}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="tradeBox">
				<div class="newsTitle" style="border: none;">
					<img :src="news" alt="">
					<p>行业新闻</p>
					<span @click="toPage('../tradeInfo/index.html?tabId=5002994673669120')">更多 ></span>
				</div>
				<div class="msgBox" v-for="(item,index) in infoList" :key="index" @click="toPage('../tradeInfo/infoDetail.html?id='+item.id)">
					<p class="imgBox">
						<img :src="item.imgUrl" >
					</p>
					<p class="contentBox">
						<span class="nmSpan">{{item.nm}}</span>
						<span class="contSpan">{{item.cont}}</span>
					</p>
				</div>
			</div>
        </div>
		<div class="fixBottom">
			<img :src="fixMsg" @click="openK">
			<img :src="toTop" @click="goTop">
		</div>
        <tab page="home"   ref="childrenTab"></tab>
    </div>
</template>
<script>
    import tab from '@/components/tab'
    import bgS from '@/assets/img/bgS.png'
	import logo from '@/assets/img/logo.png'
	import msg from '@/assets/img/msg.png'
	import photo from '@/assets/img/photo.png'
	import search from '@/assets/img/search.png'
	import news from '@/assets/img/news.png'
	import home1 from '@/assets/img/home/home1.png'
	import home2 from '@/assets/img/home/home2.png'
	import home3 from '@/assets/img/home/home3.png'
	import home4 from '@/assets/img/home/home4.png'
	import home5 from '@/assets/img/home/home5.png'
	import home6 from '@/assets/img/home/home6.png'
	import home7 from '@/assets/img/home/home7.png'
	import home8 from '@/assets/img/home/home8.png'
	import home9 from '@/assets/img/home/home9.png'
	import home10 from '@/assets/img/home/home10.png'
	import fixMsg from '@/assets/img/home/fixMsg.png'
	import toTop from '@/assets/img/home/toTop.png'
	import {Toast} from 'vant'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bgS,
				logo,
				msg,
				photo,
				search,
				news,
				fixMsg,
				toTop,
				topShow:false,	//顶部搜索处的选择
				checkNm:'船舶', //顶部搜索处被选中的选项
				msgNum:0,	//未读消息数量
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
				searchNm:'',	//搜索的关键字
				lunBoList:[],
				navList:[
					{	img:home1,
						nm:'船舶管理',
						url:'../shipMan/index.html',},
					{	img:home2,
						nm:'装备在线',
						url:'../trading/index.html'},
					{	img:home3,
						nm:'金融保险',
						url:'../safe/safe.html'},
					{	img:home4,
						nm:'试点服务',
						url:'../pilot/index.html'},
					{	img:home5,
						nm:'智慧船舶',
						url:'../wisdom/index.html'},
					{	img:home6,
						nm:'平台服务',
						url:'../service/index.html'},
					{	img:home7,
						nm:'新闻资讯',
						url:'../tradeInfo/index.html'},
					{	img:home8,
						nm:'在线学习',
						url:'../learning/index.html'},
					{	img:home9,
						nm:'我要入驻',
						url:'./settleln.html'},
					{	img:home10,
						nm:'我要推荐',
						url:'./recommend.html'},
				],
				publishList:[],	//平台发布
				shipClassify:[],//船舶展示
				equipList:[],	//热门设备
				infoList:[],	//行业新闻
				scrollTop: 0,	//距离顶部距离
				selectCheck:'1',
            };
        },
        components:{
            tab,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){


			// window.console.log("登录信息"+test)

			if(this.until.getQueryString('inviCd')){
			    this.until.seSave('inviCd',this.until.getQueryString('inviCd'))
				if(!this.until.loGet('token')){
					this.$dialog.confirm({
						title: '提示',
						message: '您未登录，立即登录?',
					})
							.then(() => {
								window.location.href = '../home/login.html'
							})
							.catch(() => {

							});
					return
				}
			}
        },

        async mounted() {
            if(window.localStorage.getItem("token")){
                this.msgNum=await this.api.getMsgNum()
            }
			console.log('未读:'+this.msgNum)
			this.getAdert()
			this.getPublish()
			this.getShip()
			this.getEquipList()
			this.getInfoData()
			// this.getUserInfo()
			this.registerScan()

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
        			window.location.href = window.location.origin+this.serverAddr+'/'
        		}
        	},
        	//注册方法接收扫码结果,对此可进行操作
			registerScan(){
				let this_=this
				this.$bridge.registerHandler("java_scanning", (data, responseCallback) =>{
					window.console.log("h5收到从android的数据333：")
					window.console.log(data)
					responseCallback("h5收到通知，返回android结果6666666"+data)
					this_.until.href(data)
					Toast(data)
				})
			},

        	//获取安卓用户信息
        	getUserInfo(){
				this.$bridge.callHandler('h5_get_user',"",res=>{
					console.log("从安卓获取用户信息")
					console.log(res)
					if(res !=''){
						let loginInfo=JSON.parse(res)
						window.localStorage.setItem("token",loginInfo.token)
						window.localStorage.setItem("userInfo",JSON.stringify(loginInfo.userInfo))
					}

				})
				this.$bridge.callHandler('h5_get_role',"",res=>{
					console.log("从安卓获取用户信息")
					console.log(res)
					if(res !=''){
						window.localStorage.setItem('currentRole',res)
					}

				})
			},

			setupWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					return callback(WebViewJavascriptBridge);
				}
				if (window.WVJBCallbacks) {
					return window.WVJBCallbacks.push(callback);
				}
				window.WVJBCallbacks = [callback];
				var WVJBIframe = document.createElement('iframe');
				WVJBIframe.style.display = 'none';
				WVJBIframe.src = 'https://__bridge_loaded__';
				document.documentElement.appendChild(WVJBIframe);
				setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
			},

        	//扫码
			toScan(){

				window.console.log("点击按钮。。。")
				this.$bridge.callHandler('h5_scanning',"666666",res=>{
					window.console.log("安卓或者ios回传。。。")
				})
            //
            //     this.$bridge.callHandler('testObjcCallback',{'foo': 'bar'},res=>{
            //         window.console.log("安卓或者ios回传。。。")
            //         window.console.log(res)
            //     })


			},
			//搜索
			toSearch(){
			  if(this.selectCheck == 5){
				  this.until.href('../search/program.html?keyWord='+this.searchNm)
			  }else if(this.selectCheck == 1){
				  this.until.href('../search/ship.html?keyWord='+this.searchNm)
			  }else if(this.selectCheck == 2){
				  this.until.href('../search/product.html?keyWord='+this.searchNm)
			  }else if(this.selectCheck == 7){
				  this.until.href('../search/store.html?keyWord='+this.searchNm)
			  }else if(this.selectCheck == 4){
				  this.until.href('../search/info.html?keyWord='+this.searchNm)
			  }
			  // else if(this.selectCheck == 8){
				//   this.until.href('../search/brandSearch?keyWord='+this.keyWord + "&selectCheck=" + this.selectCheck)
			  // }
			},
			//跳转测试页面
			toTest(){
				this.until.href('./ExampleApp.html')
			},
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
				console.log('首页轮播图')
				console.log(this.lunBoList)
			},
			//平台发布
			async getPublish(){
				let qry = this.query.new()
				// this.query.toW(qry,'cid','5032642222281728','EQ')
				this.query.toP(qry,1,3)
				this.query.toO(qry,'releTm','desc')
				let data = await this.api.getZbggList(this.query.toEncode(qry))
				data.data.list.forEach((item,index)=>{
					// if(index<2){
						// item.cont = item.cont.replace(/<\/?[^>]*>/g, "").slice(0,35) + '...';
						// item.cont = item.cont.replace(/(&nbsp;)/g, "");
						item.releTm = item.releTm.substring(0,10)
						this.publishList.push(item)
					// }
				})
			},
			// 获取船舶分类信息
			async getShip(){
			  let qry = this.query.new()
			  this.query.toW(qry,'pid',this.$store.state.shipId,'EQ')
			  this.query.toO(qry,'seq','asc')
			  this.shipClassify = await this.api.getClassify(this.query.toEncode(qry))
			  this.shipClassify = this.shipClassify.slice(0,4)
			  for(let i=0;i<this.shipClassify.length;i++){
			    let qry2 = this.query.new()
			    this.query.toW(qry2,'pid',this.shipClassify[i].id,'EQ')
			    this.query.toO(qry2,'seq','asc')
			    let data = await this.api.getClassify(this.query.toEncode(qry2))
			    this.shipClassify[i].list = data
			    this.shipClassify[i].imgUrl = this.shipClassify[i].imgUrl ? this.shipClassify[i].imgUrl.split(',')[0] : ''
			    this.$set(this.shipClassify,i,this.shipClassify[i])
			  }
			},
			//热门产品
			async getEquipList(){
			  this.equipList = await this.api.shopRecomdPro()
			  this.equipList.splice(15)
			},
			// 筛选行业新闻
			async getInfoData(){
			   let qry = this.query.new()
			   this.query.toW(qry,'cid','5002994673669120','EQ')
			   // this.query.toO(qry,'releTm','desc')
			   let data = await this.api.tradeInfo(this.query.toEncode(qry))
			   data.data.list.forEach((item,index)=>{
					if(index<3){
						// item.cont = item.cont.replace(/(&nbsp;)/g, "");
						// item.cont = item.cont.replace(/(↵)/g, "");
						// item.cont = item.cont.replace(/<\/?[^>]*>/g, "").slice(0,28) + '...';
						item.cont = item.cont.replace(/(↵)/g, "");
					    item.cont = item.cont.replace(/\s*|\t|\r|\n/g, "");// 去除tab、空格、空行(会去掉图片和字体颜色样式)
					    item.cont = item.cont.replace(/(&nbsp;)/g, "");
					    item.cont = item.cont.replace("<html><head><title></title></head><body>", "");
						item.cont = item.cont.replace(/<\/?[^>]*>/g, "").slice(0,28) + '...';
						this.infoList.push(item)
					}
			   })
			   console.log('行业新闻')
			   console.log(this.infoList)
			},
			openK(){	//打开客服
				ysf('open');
			},
			goTop(){	//返回首页
				var otop = document.getElementById('defaultScroll');
				var timer=null
				timer = setInterval(function(){
					otop.scrollTop -= 50;
					if(otop.scrollTop == 0){
			            clearInterval(timer);
			        }
			    },20)
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
</style>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
    .home{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        box-sizing: border-box;
		background-color: #F1F3F2;
        .homeTop{
					background-color: @themeColor;
			display: flex;
			align-items: center;
			padding: 0.22rem 0.27rem 0.3rem;
			>div{
				flex: 1;
				display: flex;
				align-items: center;
				background-color: #ffffff;
				height: 0.6rem;
				border-radius: 0.3rem;
				margin-right: 0.26rem;
				padding: 0 0.26rem;
				overflow: hidden;
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
			.msgNumBox{
				position: relative;
				>img{
					margin-right: 0.26rem;
				}
				>span{
					position: absolute;
					background-color: #FF332E;
					color: #ffffff;
					width: fit-content;//新增的样式
					min-width: 0.3rem;
					height: 0.35rem;
					line-height: 0.35rem;
					padding: 0 0.015rem;
					border-radius: 0.5rem;
					transform: translateX(100%);
					top: -0.15rem;
					right: 0.5rem;
					text-align: center;
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
		    // padding: 0 0.2rem;
				.lunboBox{
					background-size: 100%;
					background-repeat: no-repeat;
					background-position: center top;
					background-color: rgba(0,0,0,0);
					margin: 0 0 0.2rem;
					padding: 0 0.2rem;
					border-radius: 0;
				}
			>div{
				background-color: #ffffff;
				margin-bottom: 0.3rem;
				border-radius: 0.1rem;
				margin:0 0.2rem 0.2rem;
				.newsTitle{
					padding: 0.29rem 0.25rem 0.2rem 0.2rem;
					display: flex;
					align-items: center;
					border-bottom: 0.01rem solid rgba(0,0,0,0.1);
					>img{
						width: 0.2rem;
						height: 0.2rem;
						margin-right: 0.15rem;
					}
					>p{
						flex: 1;
						font-size: 0.28rem;
						color: #303030;
					}
					>span{
						font-size: 0.2rem;
						color: #666666;
					}
				}
				.imgTitle{
					display: flex;
					padding: 0.29rem 0.29rem 0.2rem 0.2rem;
					align-items: center;
					.lineBlue{
						display: block;
						width: 0.04rem;
						height: 0.25rem;
						margin-right: 0.18rem;
						background: @themeColor;
					}
					>p{
						flex: 1;
						font-size: 0.28rem;
						color: #303030;
					}
					.more{
						font-size: 0.2rem;
						color: #666666;
					}
				}
			}
			.navBox{
				padding: 0rem 0.28rem 0.4rem;
				display: flex;
				flex-wrap: wrap;
				>p{
					width: 20%;
					margin-top: 0.44rem;
					display: flex;
					flex-direction: column;
					align-items: center;
					>img{
						margin-bottom: 0.2rem;
						width: 0.41rem;
						height: 0.44rem;
					}
					>span{
						font-size: 0.22rem;
						color: #666666;
					}
				}
				>p:nth-child(5n){
					margin-right: 0;
				}
			}
			.publishBox{
				display: flex;
				flex-direction: column;
				.msgBox{
					padding: 0.3rem 0.22rem;
					border-bottom: 0.01rem solid rgba(0,0,0,0.1);
					>p{
						white-space:nowrap;
						overflow:hidden;
					    text-overflow:ellipsis;
					}
					.title{
						margin-right: 0.33rem;
						margin-bottom: 0.19rem;
						font-size: 0.28rem;
						color: #303030;
					}
					.content{
						margin-left: 0.2rem;
						margin-right: 0.48rem;
						font-size: 0.24rem;
						color: #9a9a9a;
					}
				}
				.msgBox:last-child{
					border-bottom: none;
				}
			}
			.shipShowBox{
				.shipImgBox{
					overflow-x: scroll;
					width: 100%;
					// padding: 0 0.2rem;
					>div{
						justify-content: space-between;
						width: 16.6rem;
						padding: 0 0.2rem;
						display: flex;
						margin-bottom: 0.3rem;
						>div{
							width: 4rem;
							position: relative;
							// display: inline-block;
							.img{
								width: 4rem;
								height: 2.25rem;
								>img{
									width: 100%;
									height: 100%;

								}
							}
							.bottomSpan{
								position: absolute;
								width: 100%;
								// left: 0;
								text-align: center;
								color: #ffffff;
								bottom: 0;
								background-color: rgba(0, 0, 0, 0.35);
								padding: 8px 0;
								.textS{
								  margin: 0 10px;
								  font-size: 0.2rem;
								}
							}
						}
					}
				}
			}
			.productBox{
				.productImgBox{
					overflow-x: scroll;
					width: 100%;
					>div{
						justify-content: space-between;
						// width: 35rem;
						padding: 0 0.2rem;
						display: flex;
						margin-bottom: 0.3rem;
						>div{
							width: 2.3rem;
							display: flex;
							flex-direction: column;
							// align-items: center;
							// display: inline-block;
							>P{
								width: 2.3rem;
								height: 2.3rem;
								margin-bottom: 0.2rem;
								>img{
									width: 100%;
									height: 100%;
								}
							}
							>span{
								white-space:nowrap;
								overflow:hidden;
								text-overflow:ellipsis;
								width: 100%;
								text-align: center;
								font-size: 0.24rem;
								color: #666666;
							}
						}
					}
				}
			}
			.tradeBox{
				.msgBox{
					padding: 0 0.35rem 0.3rem 0.2rem;
					display: flex;
					.imgBox{
						width: 2.5rem;
						height: 1.4rem;
						margin-right: 0.16rem;
					    border: 0.01rem solid #EBEBEB;
						>img{
							width: 100%;
							height: 100%;
						}
					}
					.contentBox{
						flex: 1;
						width: 40%;
						height: 100%;
						display: flex;
					  flex-direction: column;
					  justify-content: space-between;
						.nmSpan{
							display: block;
							white-space:nowrap;
							overflow:hidden;
							text-overflow:ellipsis;
							font-size: 0.28rem;
							color: #303030;
							// margin-bottom: 0.2rem;
						}
						.contSpan{
							font-size: 0.24rem;
							color: #9A9A9A;

						}
					}
				}
			}

        }
		.fixBottom{
			position: fixed;
			display: flex;
			flex-direction: column;
			align-items: center;
			bottom: 1.2rem;
			right: 0.43rem;
		    background: 0;
			>img{
				width: 0.62rem;
				height: 0.62rem;
				margin-bottom: 0.08rem;
			}
		}
    }

</style>
