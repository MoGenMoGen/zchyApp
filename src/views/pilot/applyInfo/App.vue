<template>
    <div class="app">
        <van-nav-bar fixed title="补贴申请查询列表" :border="false" fixed class="fixTop" style="background-color: #2778BE;
">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox custBox">
                <div class="list" v-for="(item,index) in inquirtList" @click="toDetail(item)">
                    <div class="left">
                        <div>
                            <p >项目名称：<span>{{item.projNm}}</span></p>
                            <p style="margin-top: 0.3rem;">申请日期：<span>{{item.crtTm}}</span></p>
                            <p style="margin-top: 0.3rem;">申请状态：<span :class="{org:item.auditCd=='PILOT_STATUS.20',org2:item.auditCd=='PILOT_STATUS.30',org3:item.auditCd=='PILOT_STATUS.40'}">{{item.auditNm}}</span></p>
                        </div>
                    </div>
                    <van-icon name="arrow" class="right"/>
                </div>
            </div>
        </div>
    </div> 

</template>

<script>
    import { Toast } from 'vant';
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                inquirtList:[],
                currentPage1: 1,      //前往哪页
                pageSize:10,       //每页数量
                total:0,         //总数
                list:[{
                    projNm:'123123',
                    auditNm:'待审核',
                    crtTm:'2020-09-28',
                    auditCd:'PILOT_STATUS.20'
                },{
                    projNm:'123123',
                    auditNm:'待审核',
                    crtTm:'2020-09-28',
                    auditCd:'PILOT_STATUS.30'
                },{
                    projNm:'123123',
                    auditNm:'待审核',
                    crtTm:'2020-09-28',
                    auditCd:'PILOT_STATUS.40'
                }],//测试
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
            this.getList();
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
					window.location.href = window.location.origin+this.serverAddr+'/pilotService/onlineInquiry'
				}
			},
            async getList(){
                this.inquirtList=[]
                let qry = this.query.new()
                this.query.toP(qry,this.currentPage1,this.pageSize)
                let data=await this.api.subsidiesList(this.query.toEncode(qry))
                this.total=data.page.total
                if(this.total>0){
                    data.data.list.forEach((item,index)=>{
                        item.crtTm=item.crtTm.split(' ')[0]
                        item.no=index+1
                        this.inquirtList.push(item)
                    })
                }
            },
            toDetail(item){
                this.toPage('./applyDetail.html?id='+item.id)

            },
            back(){
                window.history.go(-1);
            },
            toPage(url){
                window.location.href=url
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
            }
            .custBox{
                display: flex;
                flex-direction: column;
                .list{
                    display: flex;
                    background-color: #FFFFFF;
                    padding: 0.4rem 0.3rem;
                    margin-bottom: 0.1rem;
                    .left{
                        display: flex;
                        flex: 1;
                        >div{
                            display: flex;
                            flex-direction: column;
                            >p{
                                width: 100%;
                                .org1{
                                    color: orangered;
                                }
                                .org2{
                                    color: #0064B2;
                                }
                                .org3{
                                    color: #666666;
                                }
                            }
                        }
                    }
                    .right{
                        /*height: 100%;*/
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }

    }

</style>
