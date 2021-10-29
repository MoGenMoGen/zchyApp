<template>
    <div class="app" >
        <van-nav-bar fixed :title="title" :border="false" fixed class="fixTop" style="background-color: #2778BE;">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox">
                <div v-for="(item,index) in list" :key="index" class="list" @click="toPage('./referenceDetail.html?id='+ item.id)">
                    <p>{{item.nm}}</p>
                    <p><span>上传日期：</span>{{item.updTm}}</p>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
	import {mapState} from "vuex";

    export default {
        data() {
            return {
                list:[{
                    nm:'· 工作级ROV甲板总布置除了机器人本体和收放系...',
                    tm:'2020-02-12',
                },{
                    nm:'· 工作级ROV甲板总布置除了机器人本体和收放系...',
                    tm:'2020-02-12',
                },{
                    nm:'· 工作级ROV甲板总布置除了机器人本体和收放系...',
                    tm:'2020-02-12',
                },{
                    nm:'· 工作级ROV甲板总布置除了机器人本体和收放系...',
                    tm:'2020-02-12',
                },{
                    nm:'· 工作级ROV甲板总布置除了机器人本体和收放系...',
                    tm:'2020-02-12',
                }],
                nm:'',
                cid:'',
                title:'',
                currentPage:1,
                pageSize: 15,
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
            this.nm = this.until.getQueryString('nm')
            this.cid = this.until.getQueryString('cid')
            this.title = this.nm
            this.getStudyCont();
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
					window.location.href = window.location.origin+this.serverAddr+'/learning/fishery?cid='+this.cid+'&nm='+this.nm
				}
			},
            back(){
                window.history.go(-1);
            },
            toPage(url){
                window.location.href=url
            },
            async getStudyCont(){
                let qry = this.query.new()
                this.query.toP(qry,this.currentPage,this.pageSize)
                this.query.toW(qry,'cid',this.cid,'EQ')
                let data = await this.api.getStudyCont(this.query.toEncode(qry))
                this.list = data.data.list
                this.list.forEach(item =>{
                    item.updTm = item.updTm.split(' ')[0]
                })
            },
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
                flex-direction: column;
                .list{
                    width: 100%;
                    padding: 0.29rem;
                    box-sizing: border-box;
                    border: 0.01rem solid rgba(0,0,0,0.1);
                    >p:first-child{
                        color: #303030;
                        font-size: 0.28rem;
                        font-weight: bold;
                    }
                    >p:last-child{
                        margin-top: 0.17rem;
                        color: #9A9A9A;
                        font-size: 0.24rem;
                    }
                }
            }
        }

    }

</style>
