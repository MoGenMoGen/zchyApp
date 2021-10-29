<template>
    <div class="app" >
        <van-nav-bar fixed :title="title" :border="false" fixed class="fixTop" style="background-color: #2778BE;">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox">
                <div v-for="(item,index) in list" :key="index" class="list" @click="toDetail(item)">
                    <van-image
                            width="100%"
                            height="3.25rem"
                            fit="cover"
                            :src="item.coverUrl"
                    />
                    <p class="child1">{{item.nm}}</p>
                    <p class="child2"><span>上传时间：</span>{{item.tm}}</p>
                    <img class="play" :src="play" v-if="type == '2'"/>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import play from "@/assets/img/learning/播放.png"
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                play,
                list:[],
                title:'视频学习',
                type:'',

            };
        },
        watch:{
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        created(){
        },
        mounted() {
            this.type = this.until.getQueryString('type')
            if(this.type == '2'){
                this.title = '视频学习'
            }else{
                this.title = '课件学习'
            }
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
					if(this.type == '2'){
						window.location.href = window.location.origin+this.serverAddr+'/learning/fishery?nm=视频学习'
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/learning/fishery?nm=课件学习'
					}
					
				}
			},
            //获取数据
            async getData(){
                let qry = this.query.new()
                // this.query.toW(qry,'cid',this.cid,'EQ')
                this.query.toW(qry,'type',this.type,'LK')
                let data = await this.api.getStudyCont(this.query.toEncode(qry))
                this.list = data.data.list
                this.list.forEach(item=>{
                    item.tm = item.tm.split(' ')[0]
                })
                console.log('data',data)
            },
            back(){
                window.history.go(-1);
            },
            toPage(url){
                window.location.href=url
            },
            toDetail(item){
                this.toPage('./liveDetail.html?id='+item.id +'&type=' + this.type)
            }
        },

    };
</script>
<style lang="less">
    .fixTop{
        background: none;
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
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
            padding: 0 0.2rem;
            margin-top: 1.2rem;
            .whiteBox{
                margin-bottom: 0.2rem;
                border-radius: 0.1rem;
                background-color: #ffffff;
            }
            .navBox{
                display: flex;
                flex-wrap: wrap;
                padding-bottom: 0.2rem;
                .list{
                    width: 46%;
                    margin: 0.2rem 0 0 0.2rem;
                    box-sizing: border-box;
                    border: 0.01rem solid #E8E8E8;
                    border-radius: 0.1rem;
                    position: relative;
                    /*&:nth-of-type(2n){*/
                    /*    padding-right: 0.2rem;*/
                    /*}*/
                    .play{
                        width: 0.8rem;
                        height: 0.8rem;
                        position: absolute;
                        left: 50%;
                        top: 37%;
                        transform: translate(-50%,-50%);
                    }
                    .child1{
                        padding-left: 0.17rem;
                        margin-top: 0.3rem;
                        color: #303030;
                        font-size: 0.24rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .child2{
                        padding-left: 0.17rem;
                        margin-top: 0.24rem;
                        color: #9A9A9A;
                        font-size: 0.22rem;
                    }
                }
            }
        }

    }

</style>
