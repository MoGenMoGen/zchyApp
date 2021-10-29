<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="维保服务"></pen-header>

        <div class="body">
<!--            服务商才可以看到-->
            <p style="margin-bottom: 0.2rem" v-if=" currentRole.identityCd =='identity90'">
                维保服务单：<span style="color: #FF2020">{{repaireTotal}}</span>
            </p>
            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>服务单号：</p></van-col>
                            <van-col span="18"><p>{{item.cd}}</p></van-col>
                        </van-row>

                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>设备名称：</p></van-col>
                            <van-col span="18"><p>{{item.deviceNms}}</p></van-col>
                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>问题描述：</p></van-col>
                            <van-col span="18"><p>{{item.serviceCont}}</p></van-col>
                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>备注信息：</p></van-col>
                            <van-col span="18"><p>{{item.rmks}}</p></van-col>
                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>提交时间：</p></van-col>
                            <van-col span="18"><p>{{item.crtTm}}</p></van-col>
                        </van-row>

                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>状态：</p></van-col>
                            <van-col span="18"><p>{{item.statusNm}}</p></van-col>
                        </van-row>
<!--
evelStatus   服务评价状态（0.未填调查表, 1.已填调查表）
statusCd   服务状态（1.待受理, 2.已受理, 3.拒绝受理, 4.已派单到服务商，5.已派单到负责人, 6.维修中, 7.完成维修, 8.已支付服务款, 9.终止申请）    -->



                        <van-row class="row" align="center" type="flex">
                            <van-col span="24">
                                <div style="display: flex">
                                    <p  class="btn" v-if="item.evelStatus==0   && (item.statusCd=='TASK_NOTE_STATUS.70' || item.statusCd=='TASK_NOTE_STATUS.80')"
                                        @click.stop="toEval(item)"><span class="btn-pingjia">服务评价</span></p>
                                    <p  class="yipingjia" v-if="item.evelStatus==1"
                                    ><span >已评价</span></p>
<!--                                    40，50 -->
                                    <p v-if=" item.statusCd=='TASK_NOTE_STATUS.50' || item.statusCd=='TASK_NOTE_STATUS.40'" class="btn"
                                       @click.stop="paiDan(item)">
                                        <span class="btn-paidan">接单</span>
                                    </p>

                                    <p v-if=" item.statusCd=='TASK_NOTE_STATUS.60'" class="btn"
                                       @click.stop="confirm(item)">
                                        <span class="btn-pingjia">确认完成</span>
                                    </p>
                                </div>

                            </van-col>

                        </van-row>

                        <van-icon name="arrow" class="arrow" />

                    </div>
                </van-list>
            </div>
        </div>
        <b-button title="新增维保单"  v-if=" currentRole.identityCd !='identity90'"  @click="toAdd"></b-button>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                repaireTotal:0,//维保服务单总数
            };
        },
        components:{
            penHeader,
            bButton,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
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
					if(this.currentRole.identityCd =='identity90'){
						window.location.href = window.location.origin+this.serverAddr+'/personal/repairService'
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/personal/repair'
					}
					
				}
			},
		    //去详情


		    //确认完成
            confirm(item){
                this.until.href('./repairConfirm.html?id='+item.id)
            },
            //去派单
            paiDan(item){
                this.until.href('./repairDispatch.html?id='+item.id)
            },
		    //新增维保单
            toAdd(){
                this.until.href('./repairAdd.html')
            },
            //服务评价
            toEval(item){
                this.until.href('./repairEval.html?id='+item.id)
            },

		    //查看详情，跳转到详情页面
            toDetail(item){
                console.log("查看详情")
                this.until.href('./repairDtl.html?id='+item.id)
            },
		   async	getList(){

				let qry = this.query.new()
               let param={
                   orgId:this.currentRole.id
               }

				this.query.toP(qry,this.pageNo,this.pageSize)
               this.query.toO(qry,'crtTm','desc')
				let res =await  this.api.maintenR(this.query.toEncode(qry),param)
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total
               this.loading = false;
               this.pageNo++
               this.repaireTotal=res.page.total

			}

        },

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{

        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0.2rem 0.2rem;
            .list-cont{
                border-radius: 5px;

                .list-item{
                    position: relative;
                    width: 100%;
                    background: white;
                    border-radius: 5px;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0;
                    .row{
                        padding: 0.08rem 0.40rem;
                        color: #343434;
                        .btn{
                            width: fit-content;
                            display: flex;
                            align-items: center;
                            margin-right: 0.3rem;
                            span{
                                height: 0.6rem;
                                border-radius: 5px;
                                color: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 0.2rem;
                                &:active{
                                    opacity: 0.5;
                                }
                            }

                            /* 评价按钮,确认完成按钮*/
                            .btn-pingjia{
                                background: #2878BE;
                                width: 1.2rem;

                            }
                            /*派单*/
                            .btn-paidan{
                                background: #FF761A;
                                width: 1.0rem;
                                font-size: 0.25rem;
                            }

                        }
                    /*    已评价*/
                        .yipingjia{
                            color: #999999;
                            margin-right: 0.3rem;
                        }
                    }

                    .arrow{
                        position: absolute;
                        right: 0.2rem;
                        top:50%;
                        transform: translateY(-50%);
                    }



                }
            }
        }





	}



</style>
