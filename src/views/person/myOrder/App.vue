<template>
<!--	我的订单-->
    <div id="container">
        <pen-header :title="title"></pen-header>


        <div class="body">

<!--            产品订单，船舶订单，采购订单-->
            <div class="list-header" v-if="orderType==1 || orderType==2 || orderType==4">
                <p class="place-h"></p>
                <ul >
                    <li v-for="item in tab1" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>




            <!--            设计订单-->
            <div class="list-header" v-if="orderType==5 || orderType==7">
                <p class="place-h"></p>
                <ul >
                    <li v-for="item in tab2" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>

            <!--            建造订单-->
            <div class="list-header" v-if="orderType==3">
                <p class="place-h"></p>
                <ul >
                    <li v-for="item in tab3" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>

            <!--            销售订单-->
            <div class="list-header" v-if="orderType==6">
                <p class="place-h"></p>
                <ul >
                    <li v-for="item in tab4" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>
<!--==============================================产品订单、船舶订单==============================================================================-->

            <div class="header-place"></div>
            <van-list  v-model="loading"
                       :finished="finished"
                       finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate"
                       v-if="orderType==1 || orderType==2 "
            >
                <div class="list-item" v-for="item in list" :key="item.id"  @click.stop="toOrderDetail(item)">
<!--                    店铺名称-->
                    <van-row class="row" align="center" type="flex">
                        <van-col span="1" style="display: flex;align-items: center;justify-content: center"><img style="width: 100%" :src="icShop"></van-col>
                        <van-col span="18" offset="1"><p>店铺：{{item.shopNm}}</p></van-col>
                        <van-col span="4">
                            <p class="orderStatus1" v-if="item.statusCd==10" style="white-space: nowrap">{{item.statusNm}}</p>
                            <p  v-else >{{item.statusNm}}</p>
                        </van-col>
                    </van-row>
<!--                 商品列表   -->
                    <van-row class="row" align="center" >
                        <van-row   type="flex" v-for="j in item.itms" :key="j.id">
                            <van-col span="8" ><img style="width: 90%;border-radius: 5px" :src="j.goodsImgUrl"></van-col>
                            <van-col span="16" style="display: flex;flex-direction: column;justify-content: space-between;padding: 0.2rem 0;box-sizing: border-box">
                                <van-row class="row" align="center" justify="space-between" type="flex">
                                    <van-col span="16"><p style="text-align: left">{{j.goodsNm}}</p></van-col>
                                    <van-col span="8"><p style="text-align: right">{{j.goodsPrice !=0 ? j.goodsPrice : '价格面议'}}</p></van-col>
                                </van-row>
                                <van-row class="row" align="center" justify="space-between" type="flex">
                                    <van-col span="16"><p style="text-align: left;font-size: 0.22rem;color: #666666">{{j.goodsSkuAttrNm}}</p></van-col>
                                    <van-col span="8"><p style="text-align: right;font-size: 0.2rem">×{{j.qty}}</p></van-col>
                                </van-row>

                            </van-col>
                        </van-row>
                    </van-row>
<!--                    总数-->

                    <van-row class="row" align="center" type="flex" style="border-bottom: 1px solid rgba(0,0,0,0.1)">
                        <van-col span="24" ><p style="text-align: right">应付款:￥{{item.orderPrice !=0 ? item.orderPrice : '价格面议'}}</p></van-col>

                    </van-row>
<!--待付款-->
                    <van-row class="row" align="center" justify="right" type="flex" v-if="item.status==10">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  @click.stop="toPay(item)" class="payButton"  v-if="item.orderPrice!=0 ">去支付</p>
                                <p  class="commonButton" v-if="item.stageStatus==1" @click.stop>分期申请中</p>
                                <p  class="commonButton" v-if="item.stageStatus==3" @click.stop>分期申请未通过</p>
                                <p  class="commonButton" v-if="item.offlineStatus==1" @click.stop>线下付款申请中</p>
                                <p  class="commonButton" v-if="item.offlineStatus==3" @click.stop>线下付款申请未通过</p>
                                <p  class="commonButton" @click.stop="toCancel(item)">取消订单</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>
                    </van-row>
<!--                   待发货-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==20">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton3" @click.stop="toInvoice(item)">申请开票</p>
                                <p  class="commonButton" @click.stop="toCancel(item)">取消订单</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>
                    </van-row>
<!--                    待收货-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==30 || item.status==40">

                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton3" @click.stop="toInvoice(item)">申请开票</p>
                                <p  class="commonButton" @click.stop="trace(item)">查看物流</p>
                                <p  class="commonButton3" @click.stop="confirmGoods(item)">确认收货</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                                <p  class="commonButton4" @click.stop="toReturn(item)">退货</p>
                            </div>
                        </van-col>

                    </van-row>
                    <!--                    已完成 -->
                    <van-row class="row" align="center" type="flex" v-if="item.status==50 || item.status==60 ||  item.status==90 " >

                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  @click.stop="toPay(item)" class="payButton" v-if="item.orderPrice!=0 ">去支付</p>
                                <p  class="commonButton3" @click.stop="toInvoice(item)">申请开票</p>
                                <p  class="commonButton" @click.stop="trace(item)">查看物流</p>
                                <p  class="commonButton" @click.stop="delOrder(item)">删除订单</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>
                    </van-row>
                </div>
            </van-list>

<!--  =============================================采购订单==================================================================================================-->
            <van-list  v-model="loading"
                       :finished="finished"
                       finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate"
                       v-if=" orderType==4"
            >
                <div class="list-item" v-for="item in list" :key="item.id"  @click.stop="toOrderDetail(item)">
                    <!--                    店铺名称-->
                    <van-row class="row" align="center" type="flex">
                        <van-col span="1" style="display: flex;align-items: center;justify-content: center"><img style="width: 100%" :src="icShop"></van-col>
                        <van-col span="18" offset="1"><p>店铺：{{item.shopNm}}</p></van-col>
                        <van-col span="4">
                            <p class="orderStatus1" v-if="item.statusCd==10" style="white-space: nowrap">{{item.statusNm}}</p>
                            <p  v-else style="white-space: nowrap">{{item.statusNm}}</p>
                        </van-col>
                    </van-row>
                    <!--                 商品列表   -->
                    <van-row class="row" align="center" >
                        <van-row   type="flex" v-for="j in item.itms" :key="j.id">
                            <van-col span="8" ><img style="width: 90%;border-radius: 5px" :src="j.goodsImgUrl"></van-col>
                            <van-col span="16" style="display: flex;flex-direction: column;justify-content: space-between;padding: 0.2rem 0;box-sizing: border-box">
                                <van-row class="row" align="center" justify="space-between" type="flex">
                                    <van-col span="16"><p style="text-align: left">{{j.goodsNm}}</p></van-col>
                                    <van-col span="8"><p style="text-align: right">{{j.goodsPrice !=0 ? j.goodsPrice :'价格面议'}}</p></van-col>
                                </van-row>
                                <van-row class="row" align="center" justify="space-between" type="flex">
                                    <van-col span="16"><p style="text-align: left;font-size: 0.22rem;color: #666666">{{j.goodsSkuAttrNm}}</p></van-col>
                                    <van-col span="8"><p style="text-align: right;font-size: 0.2rem">×{{j.qty}}</p></van-col>
                                </van-row>

                            </van-col>
                        </van-row>
                    </van-row>
                    <!--                    总数-->

                    <van-row class="row" align="center" type="flex" style="border-bottom: 1px solid rgba(0,0,0,0.1)">
                        <van-col span="24" ><p style="text-align: right">应付款:￥{{item.orderPrice !=0 ? item.orderPrice : '价格面议'}}</p></van-col>

                    </van-row>
                    <!--待付款-->
                    <van-row class="row" align="center" justify="right" type="flex" v-if="item.status==10">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  @click.stop="toPay(item)" class="payButton" v-if="item.orderPrice!=0 ">去支付</p>

                                <p  class="commonButton" @click.stop="toCancel(item)">取消订单</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>
                    </van-row>
                    <!--                   待发货-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==20">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton3" @click.stop="toInvoice(item)">申请开票</p>
                                <p  class="commonButton" @click.stop="toCancel(item)">取消订单</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>
                    </van-row>
                    <!--                    已发货-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==30 || item.status==40">


                        <div class="row-bottom">

                            <p  class="commonButton" @click.stop="trace(item)">查看物流</p>
                            <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                        </div>
                    </van-row>
                    <!--                    已完成 -->
                    <van-row class="row" align="center" type="flex" v-if="item.status==50 || item.status==60 ||  item.status==90 " >

                        <van-col span="24" >
                            <div class="row-bottom">

                                <p  class="commonButton" @click.stop="toContract(item)">查看合同</p>
                                <p  class="commonButton" @click.stop="delOrder(item)">删除订单</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>
                    </van-row>
                </div>
            </van-list>
<!--========================================================销售订单====================================================-->

            <van-list  v-model="loading"
                       :finished="finished"
                       finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate"
                       v-if="orderType==6"
            >
                <div class="list-item" v-for="item in list" :key="item.id" >
                    <!--                    店铺名称-->
                    <van-row class="row" align="center" >
                        <van-col span="18" offset="1"><p>订单号：{{item.orderCd}}</p></van-col>
                        <van-col span="4">
                            <p class="orderStatus1" v-if="item.statusCd==10" style="white-space: nowrap">{{item.statusNm}}</p>
                            <p  v-else style="white-space: nowrap">{{item.statusNm}}</p>
                        </van-col>
                    </van-row>
                    <!--                 商品列表   -->
                    <van-row class="row" align="center" >
                        <van-row   type="flex" v-for="j in item.dsPurchaseItms" :key="j.id">
                            <van-col span="8" ><img style="width: 90%;border-radius: 5px" :src="j.goodsImgUrl"></van-col>
                            <van-col span="16" style="display: flex;flex-direction: column;justify-content: space-between;padding: 0.2rem 0;box-sizing: border-box">
                                <van-row class="row" align="center" justify="space-between" type="flex">
                                    <van-col span="16"><p style="text-align: left">{{j.goodsNm}}</p></van-col>
                                    <van-col span="8"><p style="text-align: right">{{j.goodsPrice !=0 ? j.goodsPrice : '价格面议'}}</p></van-col>
                                </van-row>
                                <van-row class="row" align="center" justify="space-between" type="flex">
                                    <van-col span="16"><p style="text-align: left;font-size: 0.22rem;color: #666666">{{j.goodsSkuAttrNm}}</p></van-col>
                                    <van-col span="8"><p style="text-align: right;font-size: 0.2rem">×{{j.qty}}</p></van-col>
                                </van-row>

                            </van-col>
                        </van-row>
                    </van-row>
                    <!--                    总数-->

                    <van-row class="row" align="center" type="flex" style="border-bottom: 1px solid rgba(0,0,0,0.1)">
                        <van-col span="24" ><p style="text-align: right">应付款:￥{{item.orderPrice !=0 ? item.orderPrice : '价格面议'}}</p></van-col>

                    </van-row>
                    <!--待付款-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==10">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton" @click.stop="toCancel(item)">取消订单</p>
                                <p  class="payButton" @click.stop="toPay(item)" v-if="item.orderPrice!=0 ">去支付</p>

                            </div>
                        </van-col>
                    </van-row>
                    <!--                   待发货-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==20">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton" @click.stop="toContract(item)">查看合同</p>
                            </div>
                        </van-col>
                    </van-row>
                    <!--                    已发货-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==30|| item.status==40">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton" @click.stop="trace(item)">查看物流</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>

                        </van-col>
                    </van-row>
                    <!--                    已完成-->
                    <van-row class="row" align="center" type="flex" v-if="item.status==50 || item.status==90">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton3" @click.stop="toInvoice(item)">申请开票</p>
                                <p  class="commonButton" @click.stop="delOrder(item)">删除订单</p>
                            </div>
                        </van-col>
                    </van-row>
                </div>
            </van-list>

<!--建造订单或者设计订单=============================================================================================================-->
            <van-list  v-model="loading"
                       :finished="finished"
                       finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate"
                       v-if="orderType==3 || orderType==5 || orderType==7"
            >
                <div class="list-item" v-for="item in list" :key="item.id" >
                    <!--                    店铺名称-->
                    <van-row class="row" align="center" >
                        <van-col span="18" offset="1"><p>订单号：{{item.cd}}</p></van-col>
                        <van-col span="4">
                            <p class="orderStatus1" v-if="item.statusCd==10" style="white-space: nowrap">{{item.statusNm}}</p>
                            <p  v-else style="white-space: nowrap">{{item.statusNm}}</p>
                        </van-col>
                    </van-row>

                    <van-row class="row" align="center" >
                        <van-col span="23" offset="1"><p>服务购买方：{{item.consumerNm}}</p></van-col>

                    </van-row>

                    <van-row class="row" align="center" justify="space-between" type="flex">
                        <van-col span="16" offset="1"><p style="text-align: left">{{item.goodsNms}}</p></van-col>
                        <van-col span="7"><p style="text-align: right;color: #FF3636">￥{{item.amt}}</p></van-col>
                    </van-row>

                    <!--                    总数-->

                    <van-row class="row" align="center" type="flex" style="border-bottom: 1px solid rgba(0,0,0,0.1)">
                        <van-col span="24" ><p style="text-align: right">实收款:<span style="color: #FF3636">￥{{item.paid}}</span></p></van-col>

                    </van-row>
                    <!--代收款-->
                    <van-row class="row" align="center" type="flex" v-if="item.statusCd=='ORDER_STATUS.01'">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton" @click.stop="toContract(item)">查看合同</p>
                                <p  class="commonButton3" @click.stop="confirmRev(item)">确认收款</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>


                    </van-row>
                    <!--                   建造中-->
                    <van-row class="row" align="center" type="flex" v-if="item.statusCd=='ORDER_STATUS.03'">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton" @click.stop="toContract(item)">查看合同</p>
                                <p  class="commonButton3" @click.stop="confirmFinish(item)">确认完成</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>

                    </van-row>
                    <!--                    已完成-->
                    <van-row class="row" align="center" type="flex" v-if="item.statusCd=='ORDER_STATUS.04'">
                        <van-col span="24" >
                            <div class="row-bottom">
                                <p  class="commonButton" @click.stop="toContract(item)">查看合同</p>
                                <p  class="commonButton2" @click.stop="toOrderDetail(item)">订单详情</p>
                            </div>
                        </van-col>


                    </van-row>

                </div>
            </van-list>



        </div>
        <van-popup v-model="showRecord"  :style="{ height: '100%',width:  '100%',background:'#efefef' }" >
            <rev-recored v-if="showRecord"  :id="selectedInfo.id" :audit="selectedInfo.audit" @leftClick="showRecord=false"></rev-recored>
        </van-popup>
    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import revRecored from "../../../components/personal/revRecored";
	import {mixins} from "../mixins/mixins"
    import { Dialog } from 'vant';
	import { Toast } from 'vant'
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                icShop: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/49bf9998afe74e9a8b699bbfeb9822d2_商城图片.png',
                tabId:'-1',
                status:'',//状态编码
                statusCd:'',
                /*
        订单类型，1-产品订单，2-船舶订单，3-建造订单，4-采购订单，5-设计订单，6-销售订单，共6中订单,3个接口

            建造订单（/ship/order/apis/page）
            设计订单（/ship/order/apis/page）
            采购订单（ds/order/myPage）
            产品订单（ds/order/myPage）
            船舶订单（ds/order/myPage）
            销售订单（ds/purchase/pageBySupplier）
        */
                orderType:1,
                title:'',
                //产品订单，船舶订单，采购订单
                tab1:[
                    {
                        id:0,
                        nm:'全部',
                        statusCd:'01'
                    },
                    {
                        id:1,
                        nm:'待付款',
                        statusCd:'10'
                    },
                    {
                        id:2,
                        nm:'待发货',
                        statusCd:'20'
                    },
                    {
                        id:3,
                        nm:'待收货',
                        statusCd:'30,40'//bt
                    },
                    {
                        id:4,
                        nm:'已完成',
                        statusCd:'50,90'//bt
                    }
                ],
                //设计订单
                tab2:[
                    {
                        id:0,
                        nm:'全部',
                        status:'-1'
                    },
                    {
                        id:1,
                        nm:'待收款',
                        statusCd:'ORDER_STATUS.01'
                    },
                    {
                        id:2,
                        nm:'设计中',
                        statusCd:'ORDER_STATUS.03'
                    },
                    {
                        id:4,
                        nm:'已完成',
                        statusCd:'ORDER_STATUS.04'
                    }
                ],
                //建造订单
                tab3:[
                    {
                        id:0,
                        nm:'全部',
                        statusCd:'01'
                    },
                    {
                        id:1,
                        nm:'待收款',
                        statusCd:'ORDER_STATUS.01'
                    },
                    {
                        id:2,
                        nm:'建造中',
                        statusCd:'ORDER_STATUS.03'
                    },
                    {
                        id:4,
                        nm:'已完成',
                        statusCd:'ORDER_STATUS.04'
                    }
                ],


                //销售订单
                tab4:[
                    {
                        id:0,
                        nm:'全部',
                        statusCd:'01'
                    },
                    {
                        id:1,
                        nm:'未付款',
                        statusCd:'10'
                    },
                    {
                        id:2,
                        nm:'待发货',
                        statusCd:'20'//eq
                    },
                    {
                        id:3,
                        nm:'已发货',
                        statusCd:'30,40'//bt
                    },
                    {
                        id:4,
                        nm:'已完成',
                        statusCd:'50,90'//bt
                    }
                ],


                identityCd:'',//
                showRecord:false,//显示收款记录弹框
                selectedInfo:{},//选中订单信息
            };
        },
        components:{
			searchView,
            penHeader,
            revRecored,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.identityCd=this.currentRole.identityCd
		    this.orderType=this.until.getQueryString("orderType")

		    if(this.orderType==1){
		        this.title='产品订单'
            }else if(this.orderType==2){
                this.title='船舶订单'
            }else if(this.orderType==3){
                this.title='建造订单'
            }else if(this.orderType==4){
                this.title='采购订单'
            }else if(this.orderType==5){
                this.title='设计销售订单'
            }else if(this.orderType==7){
                this.title='设计采购订单'
            }else if(this.orderType==6){
                this.title='销售订单'
            }

            let item=JSON.parse(this.until.getQueryString('item'))
            if(this.until.seGet("order-tabId")){
                item.tabId=this.until.seGet("order-tabId")
                item.statusCd=this.until.seGet("order-statusCd")
            }
            this.toChoose(item)
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
					
					if(this.identityCd=='identity20'||this.identityCd=='identity30'){
						window.location.href = window.location.origin+this.serverAddr+'/personal/myOrder2?cdType='+this.orderType
					}else if(this.orderType==6){
						window.location.href = window.location.origin+this.serverAddr+'/personal/myOrder3?cdType='+this.orderType
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/personal/myOrder1?cdType='+this.orderType
					}
					
				}
			},
		    //确认完成
            confirmFinish(item){
                Dialog.confirm({
                    title: '确认完成',
                    message: '您确认完成吗？',
                }).then(() => {
                    this.api.confirmFinishOrder(item.id).then((res) => {
                        if (res.code === 0) {
                            Toast("确认成功")
                            setTimeout(()=>{
                                this.pageNo=1
                                this.list=[]
                                this.getList()
                            },500)

                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
            //确认收款
            confirmRev(item){
                this.selectedInfo=item
                this.showRecord=true
            },
            toOrderDetail(item){
              if(this.orderType==1 || this.orderType==2 || this.orderType==4 || this.orderType==6){
                  this.until.href("../trading/orderDetail.html?id="+item.id)
              }  else if(this.orderType==3 || this.orderType==5){
                  //建造订单或者设计订单
                  this.until.href("../trading/orderDetail.html?id="+item.id)
              }
            },

            toPay(item){

                if(item.stageStatus==2){
                    console.log("分期付款")
                    console.log(item)
                    this.until.href('./mortgage.html?info='+JSON.stringify(item))
                }else if(item.orderPrice==0){
                    Toast("待商家修改价格")
                }else{
                    this.until.href('../trading/toPay.html?id='+item.id)
                }



            },

		    //确认收货
            confirmGoods(item){
                Dialog.confirm({
                    title: '确认收货',
                    message: '您确认收货吗？',
                }).then(() => {
                    this.api.confirmGoods(item.id).then((res) => {
                        if (res.code === 0) {
                            Toast("确认收货成功")
                            setTimeout(()=>{
                                this.pageNo=1
                                this.list=[]
                                this.getList()
                            },500)

                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
		    //取消订单
            toCancel(item){
                Dialog.confirm({
                    title: '取消订单',
                    message: '您确认取消订单吗？',
                }).then(() => {
                    this.api.cancelPay(item.id).then((res) => {
                        if (res.code === 0) {
                            Toast("取消订单成功")
                            setTimeout(()=>{
                                this.pageNo=1
                                this.list=[]
                                this.getList()
                            },500)

                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
		    //查看合同--待定，订单类型不确定
            toContract(item){
                this.until.href("./contractDetail.html?id="+item.contractId)
            },
		    //申请开票
            toInvoice(item){
                this.until.href("./invoice.html?item="+JSON.stringify(item))
            },
            //删除订单
            delOrder(item){
                Dialog.confirm({
                    title: '删除订单',
                    message: '您确认删除订单吗？',
                }).then(() => {
                    this.api.delOrder(item.id).then((res) => {
                        if (res.code === 0) {
                            Toast("删除订单成功")
                            setTimeout(()=>{
                                this.pageNo=1
                                this.list=[]
                                this.getList()
                            },500)

                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
            toReturn(item){
                this.until.href("./toReturn.html?item="+JSON.stringify(item))
            },
            trace(item){
                this.until.href("./express.html?item="+JSON.stringify(item))
            },
            toChoose(item){
                if(item.id!=this.tabId){

                    this.tabId=item.id
                    this.statusCd=item.statusCd
                    this.until.seSave("order-tabId",this.tabId)
                    this.until.seSave("order-statusCd",this.statusCd)
                    this.pageNo=1
                    this.list=[]
                    this.getList()
                }
            },

		    //查看详情，跳转到船舶档案页面
            toDetail(item){
                console.log("查看详情")
                this.until.href("./contractDetail.html?id="+item.id);
            },
            //我要出售按钮
            showPop(item){

            },
		   async	getList(){
                let res=''
				let qry = this.query.new()
               this.query.toP(qry,this.pageNo,this.pageSize)
                if(this.orderType==1 || this.orderType==2 || this.orderType==4 ||this.orderType==6){

                    if(this.statusCd=='01'){
                        //不加载取消等状态列表
                        // this.query.toW(qry,'status',["10","20","30","40","50","60","90"],'IN')
                    }
                    else if(this.statusCd=='10'){
                        this.query.toW(qry,'status','10','EQ')
                    }
                    else if(this.statusCd=='20'){
                        this.query.toW(qry,'status','20','EQ')
                    }
                    else if(this.statusCd=='30,40'){
                        this.query.toW(qry,'status',["30","40"],'BT')
                    }
                    else if(this.statusCd=='50,90'){
                        this.query.toW(qry,'status',["50","90"],'BT')
                    }

                    //产品订单
                    if (this.orderType === '1'){
                        this.query.toW(qry,'ship',0,'EQ')
                    }
                    //船舶订单
                    if (this.orderType === '2'){
                        this.query.toW(qry,'ship',1,'EQ')
                    }
                    this.query.toO(qry,'crtTm','desc')

                    if(this.orderType==6){
                        //销售订单
                        res =await  this.api.shopOrder(this.query.toEncode(qry))
                    }else{
                        //产品订单，船舶订单，采购订单
                        res =await  this.api.myOrderP(this.query.toEncode(qry))
                    }

                    res.data.list.forEach((item,index)=>{
                        if(item.status=='10'){
                            this.$set(item,'statusNm','待支付')
                            if(item.stageStatus==1){
                                this.$set(item,'statusNm','分期支付申请中')
                            }
                            if(item.stageStatus==2){
                                this.$set(item,'statusNm','待分期支付')
                            }
                            if(item.stageStatus==3){
                                this.$set(item,'statusNm','分期支付未通过')
                            }
                        }else if(item.status=='20'){
                            this.$set(item,'statusNm','待发货')
                        }else if(item.status=='30'){
                            this.$set(item,'statusNm','已发货')
                        }else if(item.status=='40'){
                            this.$set(item,'statusNm','未签收')
                        }else if(item.status=='50'){
                            this.$set(item,'statusNm','自动签收')
                        }else if(item.status=='60'){
                            this.$set(item,'statusNm','用户确认收货')
                        }else if(item.status=='70'){
                            this.$set(item,'statusNm','自动确认收货')
                        }else if(item.status=='80'){
                            this.$set(item,'statusNm','待评价')
                        }else if(item.status=='90'){
                            this.$set(item,'statusNm','已完成')
                        }else if(item.status=='100'){
                            this.$set(item,'statusNm','取消处理中')
                        }else if(item.status=='110'){
                            this.$set(item,'statusNm','取消中')
                        }else if(item.status=='120'){
                            this.$set(item,'statusNm','已取消')
                        }else if(item.status=='160'){
                            this.$set(item,'statusNm','删除订单')
                        }
                    })


                }else if(this.orderType==5 || this.orderType==7    ){
                //    设计销售订单，设计采购订单

                    let param={
                        keyWord:this.shipNm,
                        orgEnterId:this.currentRole.id,
                    }
                    if(this.tabId!=0){
                        this.query.toW(qry,'statusCd',this.statusCd,'EQ')
                    }

                    this.query.toW(qry,'typesCd',this.orderType==5 ? 'ORDER_TYPE.08' : 'ORDER_TYPE.01','EQ')
                    res =await  this.api.shipOderPage(this.query.toEncode(qry),param)

                }else if(this.orderType==3){
                    //建造订单
                    let param={
                        keyWord:this.shipNm,
                        orgEnterId:this.currentRole.id,
                    }
                    if(this.tabId!=0){
                        this.query.toW(qry,'statusCd',this.statusCd,'EQ')
                    }



                    this.query.toW(qry,'typesCd', 'ORDER_TYPE.02','EQ')
                    res =await  this.api.shipOderPage(this.query.toEncode(qry),param)
                }

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
                height: 1.1rem;
            }

            .list-header {
                position: fixed;
                top:1rem;
                left: 0.2rem;
                right: 0.2rem;
                background: @backgroundColor;

                border-bottom: 1px solid rgba(0,0,0,0.1);
                z-index: 9;
                .place-h{
                  height: 0.3rem;

                }
                ul{
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    background: white;
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


            .list-item{
                width: 100%;
                background: white;
                border-radius: 5px;
                margin-bottom: 0.2rem;
                padding: 0.1rem 0 0.05rem 0;
                color: #343434;
                position: relative;

                .row{
                    padding: 0.1rem 0.3rem;

                    .row-bottom{
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        .payButton{
                            background: #e4393c;
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 5px;
                            width: fit-content;
                            padding: 0.05rem 0.15rem;
                            font-size: 0.25rem;

                        }
                        .commonButton{
                            color: #999999;
                            font-size: 0.25rem;
                            text-align: center;
                            width: fit-content;
                            margin-left: 0.2rem;
                        }
                        .commonButton2{
                            color: #2878BE;
                            font-size: 0.25rem;
                            text-align: center;
                            width: fit-content;
                            margin-left: 0.2rem;
                        }
                        .commonButton3{
                            background: #2878BE !important;
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 5px;
                            width: fit-content;
                            padding: 0.05rem 0.15rem;
                            font-size: 0.25rem;
                            margin-left: 0.2rem;
                        }
                        .commonButton4{
                            border-radius: 3px;
                            border: 1px solid #2878BE !important;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.22rem;
                            padding: 0.01rem 0.12rem;
                            margin-left: 0.2rem;
                            color:#2878BE;
                        }

                    }

                }
                /*第一个上边没有圆角*/
                &:first-of-type{
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }
                .arrow{
                    right: 0.3rem;
                    top:50%;
                    transform: translateY(-50%);
                    position: absolute;
                }

            }
        }


	}

    .active{
        color: #343434 !important;
        border-bottom: 3px solid #2878BE;
    }
    /*待付款*/
    .orderStatus1{
        color: #FF3636;
    }



</style>
