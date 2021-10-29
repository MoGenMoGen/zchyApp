<template>
    <div class="app">
        <van-nav-bar fixed title="补贴申请详情" :border="false" fixed class="fixTop" style="background-color: #2778BE;">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox custBox">
                <p v-if="info.type=='1'||info.type=='2'"><van-icon name="warning" color="#FFA03C" size="34"/></p>
                <p v-if="info.type=='3'"><van-icon color="#49BD3A" name="success"  size="34"/></p>
                <p v-if="info.type=='4'"><van-icon name="warning" color="#FFA03C"  size="34"/></p>
                <p v-if="info.type=='3'" class="content">{{content}} <span style="color: #FF3535;">{{info.subsidyAmt}}</span>万元</p>
                <p v-else class="content">{{content}}</p>
            </div>
        </div>
    </div>

</template>

<script>
    import { Toast } from 'vant';
    export default {
        data() {
            return {
                id:'',
                type:'',
                info:{},
                content:'',
            };
        },
        watch:{

        },
        created(){
        },
        mounted() {
            this.id= this.until.getQueryString('id')
            this.getInfo()

        },
        methods: {
            async getInfo(){
                this.info=await this.api.subsidiesDetail(this.id)
                if(this.info.auditCd=='PILOT_STATUS.10'){  //待审核
                    this.info.type=1
                    this.content='审核中，请稍后在查询补贴申请结果'
                }else if(this.info.auditCd=='PILOT_STATUS.20'){  //审核中
                    this.info.type=2
                    this.content='审核中，请稍后在查询补贴申请结果'
                }else if(this.info.auditCd=='PILOT_STATUS.30'){  //审核通过
                    this.info.type=3
                    this.content='经审核，该项目符合财政补助资金申请条件，应补助金额总计为：'
                }else if(this.info.auditCd=='PILOT_STATUS.40'){  //审核未通过
                    this.info.type=4
                    this.content='经审核，该项目不符合财政补助资金申请条件。'
                }
                console.log(this.info)
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
                background: #ffffff;
                text-align: center;
                padding: 0.6rem 0;
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
