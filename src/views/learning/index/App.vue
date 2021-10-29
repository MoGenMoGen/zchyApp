<template>
			<div class="app">
        <van-nav-bar fixed title="在线学习" :border="false" class="fixTop">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
					<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
            <van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
            </van-swipe>
					</div>
            <div class="whiteBox navBox">
                <p v-for="(item,index) in navList1" :key="index" @click="toDetail(item)">
                    <img :src="item.icon">
                    <span>{{item.nm}}</span>
                </p>
            </div>
            <button class="upload" @click="toPage('../learning/upload.html')"><img :src="upload"/>上传（课件或知识包）</button>
            <!-- 在线直播/往期回顾 -->
            <div class="whiteBox custBox">
                <div class="unitTab">
                    <p @click="changeLiveStatus(item)" :class="{clickP:tabCd==item.cd}" v-for="item in tabList" :key="item.cd">
                        {{item.nm}}
                        <span v-if="tabCd==item.cd"></span>
                    </p>
                </div>
                <div class="unitBox">
                    <div v-for="(item,index) in liveList" style="cursor: pointer;">
                        <div class="cover" @click="livePlay(item)">
                            <img  :src="item.coverImg" :alt="item.nm">
                            <img class="play" :src="play" v-if="liveStatus == 2"/>
                            <img class="open" :src="open1" v-if="liveStatus == 2"/>
                            <img class="open" :src="open2" v-if="liveStatus == 1"/>
                        </div>
                        <p>{{item.name}}</p>
                        <p style="font-size: 0.22rem;color: #9A9A9A;"><img :src="pr"/>{{item.anchorName }}</p>
                    </div>
                </div>
            </div>
            <!-- 金牌讲师 -->
            <div class="whiteBox custBox">
                <div class="classTitle">
                    <img :src="tradingL">
                    <p>金牌讲师</p>
                    <img :src="tradingR">
                </div>
                <div class="sort">
                    <div  v-for="(item,index) in list3" :key="index">
                        <img :src="item.imgUrl">
                        <p>{{item.nm}}</p>
                        <p>[{{item.teachNm}}]</p>
                        <p>{{item.intro}}</p>
                    </div>
                </div>
            </div>
        </div>
        <tab  ref="childrenTab"></tab>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import tab from '@/components/tab'
    import bgS from '@/assets/img/bgS.png'
    import man1 from '@/assets/img/learning/视频学习.png'
    import man2 from '@/assets/img/learning/课件学习.png'
    import man3 from '@/assets/img/learning/法律法规.png'
    import man4 from '@/assets/img/learning/标准规范.png'
    import man5 from '@/assets/img/learning/文献资料.png'
    import play from '@/assets/img/learning/播放.png'
    import pr from '@/assets/img/learning/人物.png'
    import open1 from '@/assets/img/learning/直播中.png'
    import open2 from '@/assets/img/learning/未开始.png'
    import upload from '@/assets/img/learning/上传.png'
    import tradingL from '@/assets/img/tradingL.png'
    import tradingR from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bgS,
                tradingL,
                tradingR,
                pr,
                play,
                open1,
                open2,
                upload,
                lunBoList:[],
                navList1:[
                    {	img:man1,
                        nm:'视频学习',
                        url:'./video.html?type=2'},
                    {	img:man2,
                        nm:'课件学习',
                        url:'./video.html?type=1'},
                    {	img:man3,
                        nm:'法律法规',
                        url:'./reference.html?nm=法律法规'},
                    {	img:man4,
                        nm:'标准规范',
                        url:'./reference.html?nm=标准规范'},
                    {	img:man5,
                        nm:'文献资料',
                        url:'./reference.html?nm=文献资料'}
                ],
                tabList:[{
                    nm:'往期回顾',
                    cd:1
                },{
                    nm:'在线直播',
                    cd:2
                }],
                liveList:[],	//直播列表
                liveStatus:3,//直播状态[r](1:未开始, 2:直播中, 3:已结束, 4:暂停中, 5:已断开)
                currentPage:1,
                pageSize: 4,
                currentPage2:1,
                pageSize2: 4,
                search:'',
                tabCd:'1',		//选中的
                list3:[],//金牌讲师
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
            this.getAdert()
            this.getStudyLive()
            this.getTeacher()
            this.getList()
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
					window.location.href = window.location.origin+this.serverAddr+'/learning/learning'
				}
			},
            async getAdert(){
                this.lunBoList=await this.api.getAdert('learnBanner')
            },
            //获取直播列表（分页）
            async getStudyLive(){
                let qry = this.query.new()
                this.query.toW(qry,'name',this.search,'LK')
                if(this.liveStatus != 3){
                    this.query.toW(qry,'liveStatus',3,'NE')
                }else{
                    this.query.toW(qry,'liveStatus',3,'EQ')
                }
                this.query.toP(qry,this.currentPage,this.pageSize)
                let data = await this.api.studyLive(this.query.toEncode(qry))
                this.liveList = data.data.list
            },
            back(){
                window.history.go(-1);
            },
            //在线学习播放直播
            livePlay(item){
                this.toPage('./detail.html?id='+item.id +'&type='+'1')
            },
            toDesignDetail(){

            },
            //获取在线学习栏目列表
            async getList(){
                let qry = this.query.new()
                let data = await this.api.studyContCat(this.query.toEncode(qry))
                this.navList1 = data.data.list
            },
            //讲师库-列表
            async getTeacher(){
                let qry = this.query.new()
                this.query.toP(qry,this.currentPage2,this.pageSize2)
                let data = await this.api.getTeacherPage(this.query.toEncode(qry))
                this.list3 = data.data.list
                this.list3.forEach(item=>{
                    item.intro = item.intro.replace(/<\/?[^>]*>/g, "");
                })
            },
            toPage(url){
                this.until.href(url)
            },
            toDetail(e){
                if(e.seq == 1){
                    this.toPage('./video.html?type=2')
                }else if(e.seq==2){
                    this.toPage('./video.html?type=1')
                }else if(e.seq==3){
                    this.toPage('./reference.html?nm='+e.nm+'&cid='+e.id)
                }else if(e.seq==4){
                    this.toPage('./reference.html?nm='+e.nm+'&cid='+e.id)
                }else if(e.seq==5){
                    this.toPage('./reference.html?nm='+e.nm+'&cid='+e.id)
                }
            },
            //更改状态
            changeLiveStatus(item,index){
                this.tabCd=item.cd
                if(item.nm == '往期回顾'){
                    this.liveStatus = 3
                }else{
                    this.liveStatus = 1
                }
                this.getStudyLive()
            }
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
        .main{
            margin-top: -0.01rem;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
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
            .upload{
                /*width: 3.7rem;*/
                height: 0.73rem;
                border-radius: 0.05rem;
                background-color: #2778BE;
                color: #FFFFFF;
                margin: 0.3rem auto;
                display: flex;
                display:-webkit-flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.41rem;
                img{
                    width: 0.26rem;
                    /*display: none;*/
                    /*height: 0.26rem;*/
                    /*margin-left: 0.41rem;*/
                    margin-right: 0.2rem;
                    margin-bottom: 3px;
                }
            }
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
                .classTitle{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.38rem 0 0.28rem;
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
            }
            .navBox{
                display: flex;
                >p{
                    width: 25%;
                    margin: 0.44rem 0 0.39rem;
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
            }
            .custBox{
                .unitTab{
                    display: flex;
                    padding: 0 0.1rem 0.12rem;
                    >p{
                        flex: 1;
                        font-size: 0.3rem;
                        color: #666666;
                        padding: 0.31rem 0.31rem 0.21rem 0.31rem;
                        text-align: center;
                        position: relative;
                        >span{
                            width: 0.58rem;
                            height: 0.03rem;
                            display: block;
                            background-color: #2878BE;
                            text-align: center;
                            position: absolute;
                            left: 50%;
                            bottom: 0;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .clickP{
                        color: #343434;
                        font-weight: bold;
                    }
                }
                .sort{
                    display: flex;
                    flex-wrap: wrap;
                    flex: 1;
                    >div{
                        width: 50%;
                        padding: 0 0.2rem 0.45rem;
                        box-sizing: border-box;
                        /*justify-content: center;*/
                        align-items: center;
                        display: flex;
                        flex-direction: column;

                        img{
                            width: 1.09rem;
                            height: 1.09rem;
                            object-fit: cover;
                            border-radius: 50%;
                            margin-top: 0.2rem;
                            border: 3px solid #61B5FF;
                            box-shadow: 0px 0px 0 4px #D7ECFF;
                        }
                        p{

                            color: #343434;
                            font-size: 0.24rem;
                            &:first-of-type{
                                margin-top: 0.2rem;
                                margin-bottom: 0.1rem;
                            }
                        }
                    }
                }
                .unitBox{
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.2rem 0.2rem 0.2rem 0;
                    >div{
                        width: 48%;
                        box-sizing: border-box;
                        margin-bottom: 0.2rem;
                        margin-left: 2%;
                        border: 0.01rem solid #E8E8E8;
                        border-radius: 0.1rem;
                        .cover{
                            position: relative;
                            .play{
                                width: 0.8rem;
                                height: 0.8rem;
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                            }
                            .open{
                                width: 1.29rem;
                                height: 0.42rem;
                                position: absolute;
                                left: 0.28rem;
                                top: 0.2rem;
                            }
                        }

                        p{
                            padding: 0.1rem 0 0.1rem 0.17rem;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            display: flex;
                            align-items: center;
                            font-size: 0.24rem;
                            color: #666666;
                        }
                        p img{
                            width: 0.2rem;
                            height: 0.24rem;
                            margin-right: 0.14rem;
                        }

                    }
                }
            }
        }

    }

</style>
