<template>
<!--	资金管理-付款记录-->
    <div id="container">

        <pen-header title="资金管理"></pen-header>
        <search-view place-text="订单编号查询" v-model="searchText" class="searchView"></search-view>
        <div class="searchPlace"></div>
        <div class="body">

            <!--            船东 ，代理商，服务商v-if="identityCd=='identity10' || identityCd=='identity80' || identityCd=='identity90'-->
            <div class="list-header" >
                <ul v-if="identityCd=='identity10' || identityCd=='identity80' || identityCd=='identity90' || identityCd=='identity60'">
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
<!--                <ul v-if="identityCd=='identity60' ">-->
<!--                    <li v-for="item in tab6" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>-->
<!--                </ul>-->
                <!--                船厂-->
                <ul v-if="identityCd=='identity30' ">
                    <li v-for="item in tab8" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>

            </div>
            <div class="header-place"></div>
            <div class="list-cont">

                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
<!--                   付款记录-->
                    <div class="list-item" v-for="item in list" :key="item.id" v-if="tabId==0">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>订单编号：</p></van-col>
                            <van-col span="18"><p>{{item.orderCd}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>收款单位：</p></van-col>
                            <van-col span="18"><p>{{item.payeeNm}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>付款时间：</p></van-col>
                            <van-col span="18"><p>{{item.planDate}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>款项金额：</p></van-col>
                            <van-col span="18"><p>￥{{item.fees}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>订单总额：</p></van-col>
                            <van-col span="18"><p>￥{{item.orderAmt}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>已付：</p></van-col>
                            <van-col span="18"><p style="color: #E3393C">￥{{item.alFees}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>未付：</p></van-col>
                            <van-col span="18" ><p style="color: #E3393C">￥{{item.orderAmt-item.alFees }}</p></van-col>

                        </van-row>

                    </div>


                    <!--                   收款记录-->
                    <div class="list-item" v-for="item in list" :key="item.id" v-else>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>订单编号：</p></van-col>
                            <van-col span="18"><p>{{item.orderCd}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>付款单位：</p></van-col>
                            <van-col span="18"><p>{{item.payerNm}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>收款时间：</p></van-col>
                            <van-col span="18"><p>{{item.planDate}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>款项金额：</p></van-col>
                            <van-col span="18"><p>￥{{item.fees}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>订单总额：</p></van-col>
                            <van-col span="18"><p>￥{{item.orderAmt}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>已收：</p></van-col>
                            <van-col span="18"><p style="color: #E3393C">￥{{item.alFees}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>未收：</p></van-col>
                            <van-col span="18" ><p style="color: #E3393C">￥{{item.orderAmt-item.alFees }}</p></van-col>

                        </van-row>

                    </div>

                </van-list>



            </div>


        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import searchView from "../../../components/personal/searchView";
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
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
                tab1:[{ id:0, nm:'商城付款记录',},{ id:1, nm:'船舶付款记录',}
                ],
            //    设计院
                tab2:[
                    {id:0, nm:'采购付款',},
                    {id:1, nm:'设计收款',}
                ],
                //    经销商
                tab3:[
                    { id:0, nm:'商城付款记录',},{ id:1, nm:'船舶付款记录',},
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
                userInfo:{},


            };
        },
        components:{
            penHeader,
            bButton,
            searchView
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

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
                const realVal = parseFloat(value).toFixed(2);
                return realVal;
            },
        },
		async mounted() {
            this.identityCd=this.currentRole.identityCd
            this.userInfo=JSON.parse(this.until.loGet('userInfo'))
            if(this.userInfo.pid) { //子账户查看权限
                this.getPermiList()
            }else {
                this.getList()
            }
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
					if(identityCd=='identity10' || identityCd=='identity80' || identityCd=='identity90'){
						window.location.href = window.location.origin+this.serverAddr+'/personal/payRecord'
					}else if(identityCd=='identity70'){
						window.location.href = window.location.origin+this.serverAddr+'/personal/payRecord?myCd=1'
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/personal/purchase2?myCd=1'
					}

				}
			},
            //当前账号的权限
            async getPermiList(){
                let userInfo=JSON.parse(this.until.loGet("userInfo"))
                console.log(userInfo)
                let userId=userInfo.userId
                let p={userId:userId}

                let data = await this.api.getRsco(p)
                this.permiList = data.filter(item=>item.checked)
                if(this.identityCd=='identity10' || this.identityCd=='identity80' || this.identityCd=='identity90' ){

                    this.tab1 = this.tab1.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab1.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab1[0].id
                        this.getList()
                    }
                }else if(this.identityCd=='identity20'){
                    this.tab2 = this.tab2.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab2.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab2[0].id
                        this.getList()
                    }
                }else if(this.identityCd=='identity70'){
                    this.tab3 = this.tab3.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab3.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab3[0].id
                        this.getList()
                    }
                }else if(this.identityCd=='identity50'){
                    this.tab4 = this.tab4.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab4.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab4[0].id
                        this.getList()
                    }
                }else if(this.identityCd=='identity40'){
                    this.tab5 = this.tab5.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab5.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab5[0].id
                        this.getList()
                    }
                }else if(this.identityCd=='identity60'){
                    this.tab6 = this.tab6.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab6.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab6[0].id
                        this.getList()
                    }
                }else if(this.identityCd=='identity30'){
                    this.tab8 = this.tab6.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab8.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.tabId=this.tab8[0].id
                        this.getList()
                    }
                }
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
               this.query.toW(qry,"orderCd",this.searchText,'LK')
               if(this.identityCd=='identity10' || this.identityCd=='identity80' || this.identityCd=='identity90'){ //船东，代理商，服务商
                   this.query.toW(qry,"isShop",this.tabId,'EQ')
               }
               if(this.identityCd=='identity70' && this.tabId<2){ //经销商前两项
                   this.query.toW(qry,"payerId",this.userInfo.subId,'LK')//付款记录
                   this.query.toW(qry,"isShop",this.tabId,'EQ')
               }else if(this.tabId==0){
                   this.query.toW(qry,"payerId",this.userInfo.subId,'LK')//付款记录
               }else {
                   this.query.toW(qry,"payeeId",this.userInfo.subId,'LK')//收款记录
               }

               let param={
                   orgEnterId:this.currentRole.id
                   // orgEnterId: '4982862803145728'//测试
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
                .table-header{

                    padding: 0.3rem 0;
                    p{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }

                .list-item{
                    position: relative;


                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 0.15rem 0;
                    .row{
                        padding: 0.08rem 0.40rem;
                        color: #343434;

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

    .active{
        color: #343434 !important;
        border-bottom: 3px solid #2878BE;
    }

</style>
