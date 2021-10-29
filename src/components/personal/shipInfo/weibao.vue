<template>
<!--	船舶档案   维保服务  tab-->
    <div id="container">
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


                    </div>
                </van-list>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                repaireTotal:0,//维保服务单总数
                pageNo:1,
                pageSize:15,
                finished:false,//标记是否已经加载完
                currentRole:'',//当前角色
                searchText:'',
                loading:false,
                immediate:false,//
                list:[]
            };
        },
        components:{

        },
        async created(){

        },
        async mounted() {
            this.currentRole=JSON.parse(this.until.loGet('currentRole'))
            this.getList()
        },
        filters:{
            //时间过滤器，去掉时分秒
            dateFilter(val){
                if(val){
                    return val.split(' ')[0]
                }else{
                    return val
                }
            }
        },
        methods: {
            onLoad(){
                this.getList()
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
            padding: 0.2rem 0;
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
                    }
                    .btn{
                        width: fit-content;
                        position: absolute;
                        right: 0.6rem;
                        top:50%;
                        transform: translateY(-50%);
                        display: flex;
                        align-items: center;
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
