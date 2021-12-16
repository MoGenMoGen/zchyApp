<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="我的合同"></pen-header>
		<search-view v-model="searchText" place-text="搜索合同名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">

<!--            船东identity10 、-->
            <div class="list-header" v-if="identityCd=='identity10' || identityCd=='identity90' ||identityCd=='identity80' || identityCd=='identity70' ">
                <ul >
                    <li v-for="item in tab1" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>
<!--            船厂-->
            <div class="list-header" v-if="identityCd=='identity30'">
                <ul >
                    <li v-for="item in tab2" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>
<!--           设计院 -->
            <div class="list-header" v-if="identityCd=='identity20'">
                <ul >
                    <li v-for="item in tab3" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>

            <!--           供应商 不显示我的合同-->
<!--            <div class="list-header" v-if="identityCd=='identity60'">-->
<!--                <ul >-->
<!--                    <li v-for="item in tab4" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>-->
<!--                </ul>-->
<!--            </div>-->
            <!--           监理建造 -->
            <div class="list-header" v-if="identityCd=='identity40'">
                <ul >
                    <li v-for="item in tab5" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>
            <!--           检验检测 -->
            <div class="list-header" v-if="identityCd=='identity50'">
                <ul >
                    <li v-for="item in tab6" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>

<!--            服务商identity90、代理商identity80、经销商identity70-->
            <div class="list-header" v-if=" identityCd=='identity90' ||identityCd=='identity80' || identityCd=='identity70' ">
                <ul >
                    <li v-for="item in tab7" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>


            <div class="header-place"></div>
<!--            供应商不显示销售合同和采购合同-->
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate" v-if="identityCd!='identity60'">
                <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>合同编号：</p></van-col>
                        <van-col span="18"><p>{{item.contractNo}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>合同名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >签约日期：</p></van-col>
                        <van-col span="18"><p>{{item.signTm.substring(0,10)}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >交付时间：</p></van-col>
                        <van-col span="18"><p>{{item.deliveryTm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >合同总额：</p></van-col>
                        <van-col span="18"><p><span style="color: #FF2727">￥{{fmoney(item.totalPrice)}}</span></p></van-col>
                    </van-row>
                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >已付金额：</p></van-col>
                        <van-col span="18"><p>￥{{fmoney(item.paid)}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >未付金额：</p></van-col>
                        <van-col span="18"><p>￥{{fmoney(item.totalPrice-item.paid)}}</p></van-col>
                    </van-row>
                    <van-icon name="arrow"  class="arrow"/>


                </div>
            </van-list>

        </div>

    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                tabId:'-1',
                //船东identity10 、
                tab1:[
                    {
                        id:0,
                        nm:'船舶合同',
                        cd: "CONTRACT_TYPE.07",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"NE"}]
                    },
                    {
                        id:1,
                        nm:'产品合同',
                        cd: "CONTRACT_TYPE.07", //{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"}]
                    }
                ],
                //船厂identity30
                tab2:[
					{
					    id:1,
					    nm:'采购合同',
					    cd: "CONTRACT_TYPE.07",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"},{"k":"partyaId","v":4954475896755200,"m":"EQ"}]
					
					},
                    {
                        id:0,
                        nm:'建造合同',
                        cd: "CONTRACT_TYPE.02",  //{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.02","m":"EQ"}]
                    },
                    
                ],
                //设计院identity20
                tab3:[
                    {
                        id:0,
                        nm:'设计采购合同',
                        cd: "CONTRACT_TYPE.01",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.01","m":"EQ"}]
                    },
                    {
                        id:1,
                        nm:'设计销售合同',
                        cd: "CONTRACT_TYPE.08",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.01","m":"EQ"}]
                    },
                    {
                        id:2,
                        nm:'采购合同',
                        cd: "CONTRACT_TYPE.06",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"},{"k":"partyaId","v":4954475896755200,"m":"EQ"}]
                    }
                ],
                //供应商identity60
                tab4:[
                    {
                        id:0,
                        nm:'采购合同',
                        cd: "CONTRACT_TYPE.07",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"},{"k":"partyaId","v":5152705592054784,"m":"EQ"}],"o":[],"p":{"n":1,"s":3}}
                    },
                    {
                        id:1,
                        nm:'销售合同',
                        cd: "CONTRACT_TYPE.06",//"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"},{"k":"partybId","v":5152705592054784,"m":"EQ"}]
                    },

                ],
                //监理建造identity40
                tab5:[
                    {
                        id:0,
                        nm:'监理监造合同',
                        cd: "CONTRACT_TYPE.03",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.03","m":"EQ"}],"o":[],"p":{"n":1,"s":3}}
                    },

                    {
                        id:1,
                        nm:'产品合同',
                        cd: "CONTRACT_TYPE.07",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"}],"
                    }
                ],
                //检验结构identity50
                tab6:[
                    {
                        id:0,
                        nm:'检验检测合同',
                        cd: "CONTRACT_TYPE.04",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.04","m":"EQ"}],"o":[],"p":{"n":1,"s":3}}
                    },
                    {
                        id:2,
                        nm:'产品合同',
                        cd: "CONTRACT_TYPE.07",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"}]
                    }
                ],
                //服务商identity90、代理商identity80、经销商identity70
                tab7:[
                    {
                        id:0,
                        nm:'船舶合同',
                        cd: "CONTRACT_TYPE.06",//{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.06","m":"EQ"}]
                    },
                    {
                        id:1,
                        nm:'产品合同',
                        cd: "CONTRACT_TYPE.07", //{"w":[{"k":"contractTypeCd","v":"CONTRACT_TYPE.07","m":"EQ"}]
                    }
                ],




                identityCd:'',//
                cd:'',
                permiList:[],
                userInfo:{}
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
            this.identityCd=this.currentRole.identityCd
            this.userInfo=JSON.parse(this.until.loGet("userInfo"))
            if(this.userInfo.pid){ //子账户查看权限
                this.getPermiList()
            }else {
                if(this.identityCd=='identity10'){
                    this.toChoose(this.tab1[0])
                }else if(this.identityCd=='identity30'){
                    this.toChoose(this.tab2[0])
                }else if(this.identityCd=='identity20'){
                    this.toChoose(this.tab3[0])
                }else if(this.identityCd=='identity60'){
                    this.toChoose(this.tab4[0])
                }else if(this.identityCd=='identity40'){
                    this.toChoose(this.tab5[0])
                }else if(this.identityCd=='identity50'){
                    this.toChoose(this.tab6[0])
                }
            }

			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
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
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/personal/myContract'
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
                if(this.identityCd=='identity10'){

                    this.tab1 = this.tab1.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab1.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.toChoose(this.tab1[0])
                    }
                }else if(this.identityCd=='identity30'){
                    this.tab2 = this.tab2.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab2.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.toChoose(this.tab2[0])
                    }
                }else if(this.identityCd=='identity20'){
                    this.tab3 = this.tab3.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab3.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.toChoose(this.tab3[0])
                    }
                }else if(this.identityCd=='identity60'){
                    this.tab4 = this.tab4.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab4.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.toChoose(this.tab4[0])
                    }
                }else if(this.identityCd=='identity40'){
                    this.tab5 = this.tab5.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab5.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.toChoose(this.tab5[0])
                    }
                }else if(this.identityCd=='identity50'){
                    this.tab6 = this.tab6.filter(item=>this.permiList.findIndex(v=>v.nm===item.nm)>-1)
                    if(this.tab6.length==0){
                        this.$toast.fail('没有权限');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    }else {
                        this.toChoose(this.tab6[0])
                    }
                }
            },
            toChoose(item){
                if(item.id!=this.tabId){
                    this.tabId=item.id
                    this.cd=item.cd
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
				let qry = this.query.new()


               // console.log("角色信息")
               // console.log(this.currentRole)
               //船东
               if(this.currentRole.identityCd=="identity10"){
                   if(this.tabId==0){
                       this.query.toW(qry,'contractTypeCd',this.cd,'NE')
                   }else {
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')
                   }
               }else if(this.currentRole.identityCd=="identity30"){
               //  船长
                   if(this.tabId==0){
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')
                   }else {
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')

                       this.query.toW(qry,'partyaId',this.currentRole.id,'EQ')
                   }

               }else if(this.currentRole.identityCd=="identity20"){
                   //  设计院
                   if(this.tabId==0){
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')
                   }else {
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')

                       // this.query.toW(qry,'partyaId',this.currentRole.id,'EQ')
                   }

               }else if(this.currentRole.identityCd=="identity60"){
                   //  供应商
                   if(this.tabId==0){
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')

                       this.query.toW(qry,'partybId',this.currentRole.id,'EQ')
                   }else {
                       this.query.toW(qry,'contractTypeCd',this.cd,'EQ')

                       this.query.toW(qry,'partyaId',this.currentRole.id,'EQ')
                   }

               }else {
               //    其余角色
                   this.query.toW(qry,'contractTypeCd',this.cd,'EQ')

               }

				this.query.toP(qry,this.pageNo,this.pageSize)
               let param={
                   keyWord:this.searchText,
                   orgEnterId:this.currentRole.id
               }
				let res =await  this.api.contractList(this.query.toEncode(qry),param)
               this.list.push(...res.data.list)
               // 加载状态结束
               console.log("长度。。。。。。" +this.list.length)
               console.log("总数。。。。。。" +res.page.total)
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


            .list-item{
                width: 100%;
                background: white;
                border-radius: 5px;
                margin-bottom: 0.2rem;
                padding: 0.2rem 0;
                color: #343434;
                position: relative;

                .row{
                    padding: 0.1rem 0.3rem;



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


</style>
