<template>
    <div class="app" >
        <div class="main">
            <div class="whiteBox navBox">
                <div class="header">
                    <van-image
                            v-if="type == 1"
                            width="100%"
                            height="100%"
                            fit="cover"
                            :src="info.coverUrl"
                    />
                    <video @click="toPlay(info.id)" v-if="type==2" :src="info.url" preload="auto" controls="controls" :poster="info.coverUrl" height="100%" width="100%">
                        your browser does not support the video tag
                    </video>
<!--                    <img  style="width: 100%;height: 100%;"/>-->
<!--                    <img :src="play" class="play" v-if="type==1"/>-->
                    <p class="lf" @click="back()">
                        <van-icon name="arrow-left" />
                    </p>
                    <p class="rt"  v-if="showShare">
                        <img :src="share" @click="toShare"/>
                    </p>
                </div>
                <p class="ct1">{{info.nm}}</p>
                <p class="ct2" v-html="info.summary"></p>
                <p class="ct3">{{info.tm}}</p>
                <p class="last">
                    <img class="firstImg" :src="scan"/>
                    <span>浏览数：</span>
                    {{info.visitQty}}
                    <img class="lastImg" :src="fav" />
                    <span @click="collectGoods">{{info.collected?'已收藏':'收藏'}}</span>

                </p>
            </div>
            <div class="whiteBox navBox">
                <p class="title"><span></span>课程简介</p>
                <p v-html="info.cont" style="padding-bottom: 0.4rem;"></p>
            </div>

            <!-- 推荐课程 -->
            <div class="whiteBox custBox">
                <div class="classTitle">
                    <img :src="tradingL">
                    <p>推荐课程</p>
                    <img :src="tradingR">
                </div>
                <div class="sort">
                    <div  v-for="(item,index) in list" :key="index" @click="livePlay(item)">
                        <img style="height: 100%;width: 100%;" :src="item.coverUrl">
                        <p>{{item.nm}}</p>
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model="showBottom" position="bottom" :style="{ height: '30%' }" >
            <bottom-share :info="info" description="视频分享" :thumb="info.coverUrl"></bottom-share>
        </van-popup>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import scan from '@/assets/img/learning/浏览数.png';
    import fav from '@/assets/img/learning/收藏.png';
    import share from '@/assets/img/shipMan/分享.png';
    import tradingL from '@/assets/img/tradingL.png'
    import tradingR from '@/assets/img/tradingR.png'
    import play from "@/assets/img/learning/播放.png"
    import bottomShare from "../../../components/personal/bottomShare";
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                scan,
                fav,
                tradingL,
                tradingR,
                share,
                play,
                info:{
                    nm:'船舶电工安全培训',
                    ct:'分科课程也称文化课程，是一种主张以学科为中心来编定的课程',
                    tm:'2020-04-08',
                    vt:'100'
                },
                cont:'课程简介',
                type:'',//当前是视频还是课件
                id:'',//当前课程id
                list:[],
                showBottom:false,
                showShare:false,
            };
        },
        watch:{
        },
        created(){
        },
        components:{
            bottomShare
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        mounted() {
            this.type = this.until.getQueryString('type')
            this.id = this.until.getQueryString('id')
            this.getStudyContDetail();
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
			this.isMyApp()
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
					window.location.href = window.location.origin+this.serverAddr+'/learning/lessonDetail?id='+this.id+'&type='+this.type
				}
			},
            toShare(){
                this.showBottom=true
            },
            back(){
                window.history.go(-1);
            },
            toPage(url){
                window.location.href=url
            },
            livePlay(item){
                this.toPage('./liveDetail.html?id='+item.id +'&type=' + this.type)
            },
            //课程详情列表
            async getStudyContDetail(){
                let data = await this.api.studyCont(this.id)
                this.info = data.data
                console.log("视频分享详情：：")
                console.log(this.info)
                this.type = this.info.type
                this.getStudyCont();
            },
            //右侧推荐课程列表
            async getStudyCont(){
                let qry = this.query.new()
                // this.query.toW(qry,'cid',this.info.cid,'EQ')
                this.query.toP(qry,1,4)
                this.query.toW(qry,'type',this.type,'LK')
                let data = await this.api.getStudyCont(this.query.toEncode(qry))
                this.list = data.data.list
            },
            async toPlay(e){
                await this.api.studyContPlay(e);
                console.log(e)
            },
            //收藏商品
            collectGoods(){
                if(!this.until.loGet('token')){
                    Toast('您未登录，是否登录？').then(() => {
                        this.toPage('../home/index.html')
                    })
                    return
                }
                if (this.info.collected === 1) {
                    this.api.delFollow(this.id).then(()=>{
                        this.info.collected = 0;
                        this.$set(this.info,'collected',0)
                    })
                } else {
                    //收藏商品
                    let param = {
                        targetId: this.id,
                        type: 5,
                    }
                    this.api.followShop(param).then(()=>{
                        this.info.collected = 1;
                        this.$set(this.info,'collected',1)
                    })
                }
            },
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
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
            /*padding: 0 0.2rem;*/
            /*margin-top: 1.2rem;*/
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
                .classTitle{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.38rem 1.6rem 0.28rem 1.6rem;
                    >img{
                        width: 1.2rem;
                    }
                    >p{
                        margin: 0 0.3rem;
                        font-size: 0.3rem;
                        color: #303030;
                        font-weight: bold;
                    }
                }
                .sort{
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.2rem 0.4rem;
                    box-sizing: border-box;
                    >div{
                        width: 49%;
                        margin-right: 2%;
                        position: relative;
                        margin-bottom: 0.2rem;
                        &:nth-of-type(2n){
                            margin-right: 0;
                        }
                        >p{
                            height: 0.5rem;
                            color: #FFFFFF;
                            font-size: 0.22rem;
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: rgba(0,0,0,0.4);
                        }
                    }
                }
                .header{
                    position: relative;
                    width: 100%;
                    .play{
                        width: 0.67rem;
                        height: 0.67rem;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                    }
                    .lf{
                        position: absolute;
                        border-radius: 50%;
                        background-color: rgba(0,0,0,0.5);
                        width: 0.5rem;
                        height: 0.5rem;
                        left: 0.22rem;
                        top: 0.27rem;
                        color: #FFFFFF;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .rt{
                        position: absolute;
                        background-color: rgba(0,0,0,0.5);
                        color: #FFFFFF;
                        border-radius: 50%;
                        width: 0.5rem;
                        height: 0.5rem;
                        top: 0.27rem;
                        right: 0.22rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        >img{
                            width: 0.28rem;
                            height: 0.27rem;
                        }
                    }
                }
                >p{
                    width: 100%;
                    padding-left: 0.35rem;
                }
                .ct1{
                    font-size: 0.3rem;
                    color: #343434;
                    font-weight: bold;
                    margin-top: 0.29rem;
                }
                .ct2{
                    margin-top: 0.19rem;
                    font-size: 0.24rem;
                    color: #666666;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .ct3{
                    color: #9A9A9A;
                    font-size: 0.24rem;
                    margin-top: 0.19rem;

                }
                .last{
                    display: flex;
                    align-items: center;
                    color: #343434;
                    font-size: 0.22rem;
                    margin-top: 0.35rem;
                    margin-bottom: 0.35rem;
                    .firstImg{
                        height: 0.245rem;
                        width: 0.364rem;
                        margin-right: 0.1rem;
                    }
                    .lastImg{
                        height: 0.23rem;
                        width: 0.23rem;
                        margin-left: 1rem;
                        margin-right: 0.15rem;
                    }
                }
            }
            .navBox{
                display: flex;
                flex-wrap: wrap;
                .title{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    color: #303030;
                    font-size: 0.28rem;
                    font-weight: bold;
                    margin-bottom: 0.19rem;
                    margin-top: 0.39rem;
                    >span{
                        display: block;
                        width: 0.04rem;
                        height: 0.25rem;
                        background-color: #2878BE;
                        margin-right: 0.17rem;
                    }
                }

            }
        }

    }

</style>
