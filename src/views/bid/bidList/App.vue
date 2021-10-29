<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="投标管理"></pen-header>
		<search-view v-model="searchText" place-text="搜索项目名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id" >
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>项目名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>发布时间：</p></van-col>
                        <van-col span="18"><p>{{item.publishTm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >结束时间：</p></van-col>
                        <van-col span="18"><p>{{item.completeTm}}</p></van-col>
                    </van-row>

<!--                    statusCd: "报价状态[s](1:待报名, 2:已报名待审核, 3:报名未通过, 4:待报价, 5:已报价, 6:已中标, 7:未中标)"
statusNm: "报价状态"-->
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >状态：</p></van-col>
                        <van-col span="18">
<!--                            待报名-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.10'" style="color: #FF3C00">{{item.statusNm}}</p>
                            <!--                            已报名-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.20'" style="color: #343434">{{item.statusNm}}</p>
                            <!--                            报名未通过-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.30'" style="color: #343434">{{item.statusNm}}</p>
                            <!--                            待报价-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.40'" style="color: #343434">{{item.statusNm}}</p>
                            <!--                            已报价-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.50'" style="color: #2878BE">{{item.statusNm}}</p>
                            <!--                            已中标-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.60'" style="color: #22AE2C">{{item.statusNm}}</p>
                            <!--                            未中标-->
                            <p  v-if="item.statusCd=='BID_OFFER_STATUS.70'" style="color: #9A9A9A">{{item.statusNm}}</p>
<!--                            待报名-->
                            <p  v-if="item.statusCd=='-1'" >{{item.statusNm}}</p>

                        </van-col>

                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >操作：</p></van-col>

                        <van-col span="18">
                            <div class="bottomBtn">
                                <p   class="btDown"  @click="toLoad(item)">下载附件</p>
                                <p  v-if="item.statusCd=='BID_OFFER_STATUS.40'"  class="btBaojia"  @click="baojia(item)">报价</p>
                                <p  v-if="item.statusCd=='-1'  && nowDate" class="btBaoming" @click="baoming(item)">报名</p>
                                <p       v-if="item.statusCd=='BID_OFFER_STATUS.50'
                                 || item.statusCd=='BID_OFFER_STATUS.60'
                                  || item.statusCd=='BID_OFFER_STATUS.70'" class="btDetail" @click="toDtl(item)">查看详情</p>
                            </div>

                        </van-col>

                    </van-row>

<!--                    <van-icon name="arrow"  class="arrow"/>-->
                </div>
            </van-list>

        </div>

    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
    import {mixins} from "../../person/mixins/mixins"
    import { Toast } from 'vant';
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                nowDate:true,
            };
        },
        components:{
			searchView,
            penHeader,
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/bid'
				}
			},
		    //报名
            baoming(item){
                if(this.until.TimeStep(item.completeTm) >= 0){
                    Toast('已经过了截止时间')
                    return
                }
                let form={
                    orgId:this.currentRole.id,
                    orgNm:this.currentRole.company,
                    bidId:item.id,
                    bidNm:item.nm,
                    attachment:item.attachment
                }

                this.api.bidApply(form).then(res=> {
                    Toast('报名成功')
                    //报名成功后转入哪个状态未知
                    // item.statusCd='BID_OFFER_STATUS.20'
                    // item.statusNm=''

                })
            },
            //报价
            baojia(item){
                this.until.href("./baojia.html?info="+JSON.stringify(item));
            },
		    //查看详情，
            toDtl(item){
                // this.until.href("./bidDtl.html?info="+JSON.stringify(item));
                this.until.href("./baojia.html?info="+JSON.stringify(item));
            },
            //下载附件
            toLoad(item){
                this.until.href("./bidLoad.html?info="+JSON.stringify(item));
            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toO(qry,'seq','desc')
				this.query.toP(qry,this.pageNo,this.pageSize)
                if(this.searchText){
                    this.query.toW(qry,'nm',this.searchText,'LK')
                }
                let param={
                    orgEnterId :this.currentRole.id,
                    identityCd :this.currentRole.identityCd,
                    statusCd:'',
                }
				let res =await  this.api.bidManage(this.query.toEncode(qry),param)

               res.data.list.forEach(item =>{
                   item.publishTm = item.publishTm.split(' ')[0];
                   item.completeTm = item.completeTm.split(' ')[0];
                   if(!item.statusCd){
                       item.statusCd = '-1'
                       item.statusNm = '待报名'
                   }
               })

               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total
               this.loading = false;
               this.pageNo++

			}

        },

    };
</script>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
	#container{
        .searchView{
            position: fixed;
            top:1rem;
            left: 0;
            right: 0;

        }
        .searchPlace{
            height: 1.3rem;
        }
        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0 0.2rem 0.2rem 0.2rem;



            .list-item{
                width: 100%;
                background: white;
                border-radius: 5px;
                margin-bottom: 0.2rem;
                padding: 0.15rem 0;
                position: relative;
                .row{
                    padding: 0.1rem 0.4rem;

                    .bottomBtn{
                        display: flex;
                        align-items: center;
                        .btBaojia{
                            color: #FFFFFF;
                            width: 1.2rem;
                            height: 0.4rem;
                            background: #FF3C00;
                            border-radius: 3px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.05rem 0.1rem;
                            margin-right: 0.2rem;
                        }
                        .btDown{
                            color: #2878BE;
                            white-space: nowrap;

                            height: 0.4rem;
                            border: 1px solid #2878BE;
                            border-radius: 3px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.05rem 0.1rem;
                            margin-right: 0.2rem;
                        }
                        .btBaoming{
                            padding: 0 0.05rem;
                            color: #2878BE;
                            margin-right: 0.2rem;
                        }
                    }



                }
                .arrow{
                    position: absolute;
                    top:50%;
                    transform: translateY(-50%);
                    right: 0.3rem;
                }

            }
        }




	}



</style>
