<template>
<!--	资金管理-付款记录-->
    <div id="container">

        <pen-header title="资金管理"></pen-header>
        <search-view place-text="订单编号查询" v-model="searchText" class="searchView"></search-view>
        <div class="searchPlace"></div>
        <div class="body">

            <!--            船东 ，代理商，服务商v-if="identityCd=='identity10' || identityCd=='identity80' || identityCd=='identity90'-->
            <div class="list-header" >
                <ul v-if="identityCd=='identity10' || identityCd=='identity80' || identityCd=='identity90'">
                    <li v-for="item in tab1" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
<!--设计院-->
                <ul v-if="identityCd=='identity20' ">
                    <li v-for="item in tab2" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
<!--                经销商-->
                <ul v-if="identityCd=='identity70' ">
                    <li v-for="item in tab3" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>

                <!--                检验检测机构-->
                <ul v-if="identityCd=='identity50' ">
                    <li v-for="item in tab4" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
                <!--                监理建造机构-->
                <ul v-if="identityCd=='identity40' ">
                    <li v-for="item in tab5" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
                <!--                供应商-->
                <ul v-if="identityCd=='identity60' ">
                    <li v-for="item in tab6" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
                <!--                船厂-->
                <ul v-if="identityCd=='identity30' ">
                    <li v-for="item in tab8" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>

            </div>
            <div class="header-place"></div>
            <div class="list-cont">
                <van-row class="table-header" align="center"  type="flex">
                    <van-col span="6"><p>订单编号</p></van-col>
                    <van-col span="6"><p>订单总额</p></van-col>
                    <van-col span="6"><p>已付</p></van-col>
                    <van-col span="6"><p>待付</p></van-col>
                </van-row>
                <van-list  v-model="loading" :finished="finished"   @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p class="val">{{item.cd}}</p></van-col>
                            <van-col span="6"><p class="val">￥{{fmoney(item.amt)}}</p></van-col>
                            <van-col span="6"><p class="val">￥{{fmoney(item.paid)}}</p></van-col>
                            <van-col span="6"><p class="val">￥{{item.amt-item.paid | numFilter}}</p></van-col>
                        </van-row>

                    </div>
                </van-list>
                <van-row class="table-total" align="center"  type="flex">
                    <van-col span="6"><p>合计</p></van-col>
                    <van-col span="6"><p>￥{{total1 | numFilter }}</p></van-col>
                    <van-col span="6"><p>￥{{total2 | numFilter }}</p></van-col>
                    <van-col span="6"><p>￥{{total3 | numFilter }}</p></van-col>
                </van-row>

            </div>


        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import searchView from "../../../components/personal/searchView";
	import {mixins} from "../mixins/mixins"
    export default {
		mixins:[mixins],
        data() {
            return {
                total1:0,//订单总额合计
                total2:0,//已付合计
                total3:0,//待付合计
                tabId:0,
                identityCd:'',
            //    船东，代理商，服务商
                tab1:[{ id:0, nm:'商城付款',},{ id:1, nm:'船舶付款',}
                ],
            //    设计院
                tab2:[
                    {id:0, nm:'采购付款',},
                    {id:1, nm:'设计收款',}
                ],
                //    经销商
                tab3:[
                    { id:0, nm:'商城付款',},{ id:1, nm:'船舶付款',},
                    { id:2, nm:'收款记录',}
                ],          //    检验检测机构
                tab4:[
                    {id:0, nm:'订单付款',},
                    {id:1, nm:'检测收款',}
                ],          //    监理监造机构
                tab5:[
                    {id:0, nm:'订单付款',},
                    {id:1, nm:'监理收款',}
                ],
                //供应商
                tab6:[
                    {id:0, nm:'采购付款',},
                    {id:1, nm:'销售收款',}
                ],
                //船厂
                tab8:[
                    {id:0, nm:'采购付款',},
                    {id:1, nm:'建造收款',}
                ],


            };
        },
        components:{
            penHeader,
            bButton,
            searchView
        },
        async created(){

        },
        async mounted() {
            this.identityCd=this.currentRole.identityCd
            this.getList()
        },
        watch:{
            list(){
                this.total1=0;
                this.total2=0;
                this.total3=0;

                this.list.forEach(item=>{
                    this.total1=this.total1+item.amt
                    this.total2=this.total2+item.paid
                })
                this.total3=this.total1-this.total2
            }
        },
        filters:{
            numFilter(value) {
                // const realVal = parseFloat(value).toFixed(2);
                return this.fmoney(value);
            },
        },
        methods: {
			fmoney(s, n) {
			    n = n > 0 && n <= 20 ? n : 2;
			    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
			    var t = "";
			    for (let i = 0; i < l.length; i++) {
			        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			    }
			    return t.split("").reverse().join("") + "." + r;
			},
            toChoose(item){
                if(item.id!=this.tabId){
                    this.tabId=item.id
                    this.pageNo=1
                    this.list=[]
                    this.getList()
                }
            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toP(qry,this.pageNo,this.pageSize)
               this.query.toW(qry,"cd",this.searchText,'LK')
               let param={
                   orgEnterId:this.currentRole.id
                   // orgEnterId: '4982862803145728'//测试
               }
               if(this.identityCd=='identity10' || this.identityCd=='identity80' || this.identityCd=='identity90'){
                   this.query.toW(qry,"isShop",this.tabId,'EQ')
               }
               if(this.identityCd=='identity70' && this.tabId<2){
                   this.query.toW(qry,"isShop",this.tabId,'EQ')
               }
				let res =await  this.api.paymentList(this.query.toEncode(qry),param)
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
            .header-place{
                height: 0.8rem;
            }

            .list-header {
                position: fixed;
                top:2.3rem;
                left: 0.2rem;
                right: 0.2rem;
                background: white;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                z-index: 9;

                ul{
                    width: 100%;
                    display: flex;
                    height: 0.8rem;
                    li{
                        height: 100%;
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        span{
                            color: #666666;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }
            }


            .list-cont{
                border-radius: 5px;
                background: white;
                overflow: auto;
                .table-header{
                    width: 15rem;
                    padding: 0.3rem 0;
                    p{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }

                .list-item{
                    position: relative;
                    width: 15rem;

                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 0.15rem 0;
                    .row{
                        padding: 0.08rem 0.20rem;
                        .val{
                            text-align: center;
                        }
                    }
                    .arrow{
                        position: absolute;
                        right: 0.2rem;
                        top:50%;
                        transform: translateY(-50%);
                    }

                }
                .table-total{
                    width: 15rem;
                    padding: 0.2rem 0;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                    background: #FAE2D2;
                    p{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }

        }





	}

    .active{
        color: #343434 !important;
        border-bottom: 3px solid #2878BE;
    }

</style>
