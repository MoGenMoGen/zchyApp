<template>
    <div class="app">
        <van-nav-bar fixed title="试点服务" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
					<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
            <van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
            </van-swipe>
					</div>
            <div class="whiteBox custBox" v-if="list[0]">
                <div class="header">
                    <p><img  :src="msg"/>{{list[0].nm}}</p>
                    <p @click="toPage('list.html?id='+list[0].id)">更多<van-icon name="arrow" /></p>
                </div>
                <div class="nav1">
                    <p v-for="(item,index) in list[0].children" :key="index" :class="{highLight:index == cd}" @click="changeHighLight(item,index)">{{item.nm}}</p>
                </div>
                <div class="content">
                    <div v-for="(item,index) in infoList" :key="index" @click="toPage('referenceDetail.html?id='+item.id)">
                        <p>{{item.nm}}</p>
                        <p>{{item.releTm}}</p>
                    </div>
                </div>
            </div>
            <div class="whiteBox custBox" v-if="list[1]">
                <div class="header">
                    <p><img :src="build"/>{{list[1].nm}}</p>
                    <p @click="toPage('list.html?id='+list[1].id)">更多<van-icon name="arrow" /></p>
                </div>
                <div class="nav2">
                    <p v-for="(item,index) in list[1].children" :key="index" :class="{highLight:index == cd2}" @click="changeHighLight2(item,index)">{{item.nm}}</p>
                </div>
                <div class="content">
                    <div v-for="(item,index) in infoList2" :key="index"  @click="toPage('referenceDetail.html?id='+item.id)">
                        <p>{{item.nm}}</p>
                        <p>{{item.releTm}}</p>
                    </div>
                </div>
            </div>
            <div class="whiteBox custBox">
                <div class="part">
                    <p class="title"><span></span>质量管控</p>
                    <div class="cont">
                        <div v-for="(item,index) in controlList" :key="index" @click="toPage(item.locUrl)">
                            <van-image
                                    width="2.1rem"
                                    height="1.35rem"
                                    fit="cover"
                                    :src="item.imgUrl"
                            />
                            <p><span>—</span> <span class="textS">{{item.nm}}</span> <span>—</span></p>
                        </div>
                    </div>
                </div>
                <div class="part">
                    <p class="title"><span></span>办事窗口</p>
                    <div class="cont2">
                        <div class="button">
                            <p @click="toPage('./applyFor.html')"><img :src="shenQing" alt="">补贴在线申请</p>
                            <p @click="toPage('./applyInfo.html')"><img :src="chaXun" alt="">补贴申请查询</p>
                        </div>
                    </div>
                </div>
            </div>
						<div class="whiteBox shipShowBox">
							<div class="imgTitle">
								<span class="lineBlue"></span>
								<p>标准船型展示</p>
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
						<div class="whiteBox productBox">
							<div class="imgTitle">
								<span class="lineBlue"></span>
								<p>材料和装备</p>
								<span class="more" @click="toPage('../trading/productTrade.html?id=4942037425116160')">更多 ></span>
							</div>
							<div class="productImgBox">
								<div :style="{width: equipList.length*2.5+'rem'}">
									<div v-for="(item,index) in equipList" :key="index">
										<p>
											<img :src="item.img" @click="toPage('../trading/shipDetail.html?id='+item.goodsId)"><!-- ../shipDisplay/shipShow?cId=${item.id}&cNm=${item.nm}&cImg=${item.imgUrl2} -->
										</p>
										<span>{{item.nm}}</span>
									</div>
								</div>
							</div>
						</div>
        </div>
        <tab page="" ref="childrenTab"></tab>
    </div>

</template>

<script>
    import { Toast } from 'vant';
    import tab from '@/components/tab'
    import bgS from '@/assets/img/bgS.png'
		import build from '@/assets/img/pilot/标准建设.png'
		import msg from '@/assets/img/pilot/信息公开.png'
		import chaXun from '@/assets/img/pilot/补贴查询.png'
		import shenQing from '@/assets/img/pilot/补贴申请.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bgS,
                build,
                msg,
                chaXun,
                shenQing,
                lunBoList:[],
                list:[],
                cd:'',//高亮
                cd2:'',
                infoList:[],
                infoList2:[],
                cid:'5074848970085376',//分类Id
                cid2:'5074855332533248',
                controlList:[],//质量管控列表
                shipClassify:[],//船舶展示
                equipList:[],	//热门设备
            };
        },
        components:{
            tab
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
            this.getSevenA()
            this.getAdert()
            this.getData()
            this.getInfo()
            this.getInfo2()
            this.getShip()
            this.getEquipList()
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
					window.location.href = window.location.origin+this.serverAddr+'/pilotService/pilotService'
				}
			},
            async getAdert(){
                this.lunBoList=await this.api.getAdert('pilotApp')
            },
            //获取质量管控列表
            async getSevenA(){
                this.controlList = await this.api.getAdert('controlList')
            },
            async getData(){
                let qry = this.query.new()
                let data = await this.api.serviceTree(this.query.toEncode(qry))
                this.list = data.data.list
            },
            async getInfo(){
                let qry = this.query.new()
                this.query.toW(qry,'cid',this.cid,'EQ')
                let data =await this.api.serviceInfo(this.query.toEncode(qry))
                console.log(data)
                this.infoList = data.data.list.splice(0,3)
            },
            async getInfo2(){
                let qry = this.query.new()
                this.query.toW(qry,'cid',this.cid2,'EQ')
                let data =await this.api.serviceInfo(this.query.toEncode(qry))
                console.log(data)
                this.infoList2 = data.data.list.splice(0,3)
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
            back(){
                window.history.go(-1);
            },
            toPage(url){
                let arr = url.split('^')
                window.location.href=arr[arr.length-1]
            },
            //信息公开高亮
            changeHighLight(item,index){
                this.cd = index
                this.cid = item.id
                this.getInfo();
            },
            //标准建设高亮
            changeHighLight2(item,index){
                this.cd2 = index
                this.cid2 = item.id
                this.getInfo();
            },
        },

    };
</script>
<style lang="less">
    .fixTop{
        position: relative;
        background-color: @themeColor;
        .van-nav-bar__title{
            font-size: 0.36rem;
            color: #ffffff;
        }
        .van-nav-bar__left{
            font-size: 0.34rem;
        }
        .van-nav-bar__right{
            font-size: 0.28rem;
            color: #ffffff;
        }
    }
    .homeLunBo  {
        border-radius: 0.15rem !important;
        margin-bottom: 0.2rem;
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

    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        box-sizing: border-box;
        .main{
            margin-top: -0.01rem;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            box-sizing: border-box;
            flex-direction:column;
            // padding: 0 0.2rem;
            // margin-top: 1.2rem;
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
                margin: 0 0.2rem 0.2rem;
            }
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
                box-sizing: border-box;
                .imgTitle{
                        display: flex;
                        padding: 0.29rem 0.29rem 0.2rem 0.2rem;
                        align-items: center;
                        box-sizing: border-box;
                    .lineBlue{
                            display: block;
                            width: 0.05rem;
                            height: 0.25rem;
                            margin-right: 0.17rem;
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
                .part{
                    padding: 0.29rem 0.19rem 0 0.19rem;
                    display: flex;
                    flex-wrap: wrap;
                    box-sizing: border-box;
                    .title{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        color: #303030;
                        font-size: 0.28rem;
                        font-weight: bold;
                        margin-bottom: 0.19rem;
                        >span{
                            display: block;
                            width: 0.04rem;
                            height: 0.25rem;
                            background-color: #2878BE;
                            margin-right: 0.17rem;
                        }
                    }
                    .cont2{
                        display: flex;
                        width: 100%;
                        .button{
                            display: flex;
                            width: 100%;
                            justify-content: space-between;
                            padding: 0.2rem 0.42rem 0.42rem 0.6rem;
                            >p{
                                background-color: #2878BE;
                                width: 2.39rem;
                                height: 0.56rem;
                                color: #FFFFFF;
                                border-radius: 0.275rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                >img{
                                    width: 0.24rem;
                                    margin-right: 0.05rem;
                                }
                            }
                        }
                    }
                    .cont{
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        >div{
                            position: relative;
                            width: 31.5%;
                            display: flex;
                            >p{
                                width: 100%;
                                background-color: rgba(0,0,0,0.35);
                                position: absolute;
                                bottom: 0;
                                color:rgba(255,255,255,1);
                                text-align: center;
																display: flex;
																justify-content: space-around;
                                .textS{
                                    opacity: 1;
                                    font-size:0.24rem;
                                }
                                >span{
                                    opacity: 0.2;
                                }
                            }
                        }
                    }
                }
            }
            .custBox{
                .header{
                    display: flex;
                    height: 0.75rem;
                    >p:first-child{
                        display: flex;
                        align-items: center;
                        flex: 1;
                        color: #303030;
                        font-size: 0.28rem;
                        font-weight: bold;
                        >img{
                            width: 0.2rem;
                            height: 0.2rem;
                            margin-right: 0.14rem;
                            margin-left: 0.2rem;
                        }
                    }
                    >p:last-child{
                        display: flex;
                        align-items: center;
                        color: #666666;
                        font-size: 0.2rem;
                        margin-right: 0.25rem;
                    }
                }
                .nav1{
                    display: flex;
                    display: -webkit-flex;
                    padding: 0 0.19rem;
                    >p{
                        height: 0.8rem;
                        line-height: 0.8rem;
                        color: #666666;
                        font-size: 0.24rem;
                        border: 0.01rem solid #E5E5E5;
                        border-radius: 0 0 0.05rem 0.05rem;
                        text-align: center;
                        flex: 1;
                        margin-right: 0.06rem;
                        box-sizing: border-box;
                        &:last-of-type{
                            margin-right: 0;
                        }
                    }
                }
                .nav2{
                    display: flex;
                    padding: 0 0.19rem;
                    >p{
                        color: #666666;
                        font-size: 0.24rem;
                        border: 0.01rem solid #E5E5E5;
                        border-radius: 0 0 0.05rem 0.05rem;
                        padding: 0.15rem 0.15rem 0.15rem 0.15rem;
                        margin-right: 0.06rem;
                        &:last-of-type{
                            margin-right: 0;
                        }
                    }
                }
                .highLight{
                    background-color: #2878BE;
                    color: #FFFFFF!important;
                }
                .content{
                    >div{
                        display: flex;
                        flex-direction: column;
                        /*width: 100%;*/
                        padding: 0 0.19rem;
                        border-bottom: 0.01rem solid rgba(0,0,0,0.1);
                        &:last-of-type{
                            border-bottom: none;
                        }
                        >p:first-child{
                            color: #303030;
                            font-size: 0.26rem;
                            font-weight: bold;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            margin-top: 0.31rem;
                            width: 6.85rem;
                        }
                        >p:last-child{
                            color: #9A9A9A;
                            font-size: 0.24rem;
                            margin: 0.21rem 0 0.29rem;
                        }
                    }

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
        }

    }

</style>
