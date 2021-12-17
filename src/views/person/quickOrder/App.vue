<template>
<!--	我的预约-->
    <div id="container">

<!--        <pen-header title="快速下单">-->
<!--        </pen-header>-->

        <div class="penHeader">
            <div class="cont">
                <p>快速下单</p>
                <van-icon name="arrow-left"  class="arrow-left" @click="onClickLeft"/>
                <p class="topEditor" @click="deleteOrd">删除</p>
            </div>
            <div class="place">

            </div>
        </div>

        <div class="body">
            <div class="list-cont">
<!--                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >-->
<!--                    -->
<!--                </van-list>-->
                <div class="list-item" v-for="(item,index) in orderList" :key="item.id"  @click="toDetail(item)">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>产品名称：</p></van-col>
                        <van-col span="16">
                            <mob-select2 text="nm"
                                         v-model="item.goodsNm"
                                         :list="goodsList"
                                         @change="getGood"
                                         place="产品名称选择" :disable-input="disableInput"></mob-select2>
                        </van-col>
                    </van-row>

                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>规格型号：</p></van-col>
                        <van-col span="16">
                            <mob-select2 text="attrDesc" :list="item.skuList"
                                         @change="getSku" place="规格型号"
                                         v-model="item.skuNm"></mob-select2>
                        </van-col>
                    </van-row>
                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>供应商：</p></van-col>
                        <van-col span="16"><p>{{item.supplier}}</p></van-col>
                    </van-row>
                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>单价：</p></van-col>
                        <van-col span="16">
                            <p v-if="item.origPrice !=0" style="color: #E53E41">￥{{fmoney(item.origPrice)}}</p>
                            <p v-else>价格面议</p>
                        </van-col>
                    </van-row>
                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>交货日期：</p></van-col>
                        <van-col span="16"><p>{{item.leadTime}}</p></van-col>
                    </van-row>

                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>数量：</p></van-col>
                        <van-col span="16">
                            <van-stepper v-model="item.num"
                                         :disabled="item.stock==0"
                                         :min="1" :max="item.stock"
                                         integer
                                         @change="onChange(item)" />
                        </van-col>
                    </van-row>
                    <van-row class="row" align="center" type="flex">
                        <van-col span="2"></van-col>
                        <van-col span="6"><p>合计：</p></van-col>
                        <van-col span="16">
                            <p v-if="item.origPrice !=0" style="color: #E53E41">￥{{fmoney(item.origPrice*item.num)}}</p>
                            <p v-else>价格面议</p></van-col>
                    </van-row>
                    <p  class="single"  @click="toSingleCheck(item)">
                        <img :src="icXz" v-if="item.check">
                        <img :src="icWx" v-else  >
                    </p>



                </div>
            </div>


            <div class="btn-add" @click="toAdd">添加</div>
        </div>
<!--        占位符-->
        <div style="height: 1rem;width: 100%">

        </div>
        <div class="bottom">
            <div @click="toAll">
                <img :src="icXz" v-if="allCheck">
                <img :src="icWx" v-else>

                全选</div>
            <div>
                <p @click="toSub">立即下单</p>
                <p @click="addCart">加入购物车</p>
            </div>
        </div>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import mobSelect2 from "../../../components/personal/shipInfo/mobSelect2";
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
    import icXz from './img/单选选中.png'
    import icWx from './img/单选未选.png'
    import {Toast} from 'vant'
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                icXz,
                icWx,
                allCheck:false,//全选
                orderList:[],//快速下单列表
                goodsList:[],//商品列表
                value:1,
                selectItem:{},//选中快速下单列表项目


                disableInput:false,//是否可以输入

                editorShow:false,
            };
        },
        components:{
            penHeader,
            bButton,
            mobSelect2,
            mobSelect
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
            this.goodsList=await this.api.getQuickGoods() //商品列表
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/quicklyOrder'
				}
			},
            deleteOrd(){
                let idList=[]
                let ids=""
                this.orderList.forEach(item=>{
                    if(item.check && item.add){
                        idList.push(item.id)
                    }
                })
                idList.forEach((item,index)=>{
                    ids+=item
                    if(index<idList.length){
                        ids+=','
                    }
                })
                console.log(idList)
                this.api.delQuickOrder(ids).then(res=>{
                    Toast('删除成功');
                    setTimeout(()=>{
                        this.orderList=[]
                        this.pageNo=1
                        this.getList()
                    },1000)
                })
            },
            onClickLeft(){
                if(window.location.href.indexOf('tradeInfo/index')>-1){
                    window.localStorage.removeItem("tradeId");
                }
                this.$emit('back')
                this.until.back();
            },
            //立即下单
            toSub(){


                let proArr=[]
                this.orderList.forEach(item=>{

                    if(item.check && item.add){
                        let imgUrl=""
                        item.skuList.forEach(i=>{
                            if(i.id==item.skuId){
                                imgUrl=i.imgUrl
                            }
                        })
                        let shop={
                            nm: item.shopNm,
                            supplierId:item.supplierId,
                            ship: item.ship,
                            skuId: item.skuId,
                            goodsId: item.goodsId,
                            quickId:item.id,
                            items: [{
                                img: imgUrl,
                                qty: item.num,
                                goodsId:item.goodsId,
                                attrDesc: item.skuNm,
                                origPrice: item.origPrice,
                                leadTime:item.leadTime
                            }]
                        }
                        proArr.push(shop)
                    }
                })

                console.log("购物车订单。。。。。")
                console.log(proArr)
                if(proArr.length==0){
                    this.$toast.fail('您未选择商品，请选择商品结算');
                }else {
                    console.log(proArr)
                    this.until.seSave('cartList',JSON.stringify(proArr))
                    location.href = '../trading/orderSubmit.html?payType=quickly'
                }

            },
            //加入购物车
            addCart(){
                let flag=0
                this.orderList.forEach(item=>{
                    if(item.check && item.add){
                        flag++
                        let param = {
                            goodsId: item.goodsId,
                            goodsSkuId: item.skuId,
                            qty: item.num
                        }
                        console.log(param)
                        this.api.addCart(param)
                    }
                })
                if(flag>0){
                    Toast("加入购物车成功!")
                    setTimeout(()=>{
                        this.orderList=[]
                        this.getList()
                    },1000)
                }
            },


		    //单选
            toSingleCheck(item){
                item.check=!item.check
                this.isAll()
            },
            //判断是否单选
            isAll(){

               let num = 0
                this.orderList.forEach(item=>{
                    if( item.check){
                        num++
                    }
                })
                if(num==this.orderList.length){
                    this.allCheck=true
                }else {
                    this.allCheck=false
                }

            },

		    //全选
            toAll(){
                this.allCheck=!this.allCheck

                this.orderList.forEach(item=>{
                        if(this.allCheck) {
                            item.check=true
                        }else {
                            item.check=false
                        }
                })
            },
		    //添加按钮
            toAdd(){
                this.orderList.push({
                    check:false,
                    goodsId: '',
                    skuId: '',
                    supplier:'',
                    supplierId: '',
                    origPrice:'',
                    leadTime:'',
                    num: 1,
                    add:false //用来判断是否新增成功
                })
            },
            getSku(e){
                console.log("选中水库。。。。。。。。。。。。。。")
                console.log(e)

                if(typeof this.selectItem.id  != 'undefined'){
                    let param={
                        goodsId: this.selectItem.goodsId,
                        skuId: e.id,
                        supplierId: this.selectItem.supplierId,
                        num: this.selectItem.num>this.selectItem.stock?this.selectItem.stock:this.selectItem.num
                    }
                    param.id=this.selectItem.id


                    if(this.selectItem.skuId!=e.id){
                        this.api.updQuickOrder(param).then(res=>{ //修改
                            Toast( '修改成功');
                            this.selectItem.skuId=e.id
                            this.selectItem.skuNm=e.attrDesc

                        })
                    }

                }else{

                    let param={
                        goodsId: this.selectItem.goodsId,
                        skuId: e.id,
                        supplierId: this.selectItem.supplierId,
                        num: this.selectItem.num>this.selectItem.stock?this.selectItem.stock:this.selectItem.num
                    }

                    this.api.addQuickOrder(param).then(res=>{ //新增
                        Toast( '新增成功');
                        setTimeout(()=>{
                            this.orderList=[]
                            this.getList()
                        },1000)

                    })
                }
            },

            toDetail(item){
                this.selectItem=item
                console.log("选中商品666")
            },
		    //去详情
           async getGood(e){
                console.log("选中商品")
               console.log(e)
               this.selectItem.supplier=e.supplier
               this.selectItem.goodsId=e.id

               this.selectItem.supplierId=e.supplierId
               this.selectItem.skuNm=""
               //清除picker中选中的值
               let skuList=await this.api.getSkuList(e.id)
               this.$set(this.selectItem,"skuList",skuList)
            },

            onChange(item) {
                console.log(item)
                let param={
                    id:item.id,
                    goodsId: item.goodsId,
                    skuId: item.skuId,
                    supplierId: item.supplierId,
                    num: item.num
                }
                console.log(param)
                this.api.updQuickOrder(param)
            },
		   async	getList(){

				// let qry = this.query.new()
				// this.query.toP(qry,this.pageNo,this.pageSize)
               // this.query.toO(qry,'crtTm','desc')
               let res=await this.api.getQuickOrder2() //订单列表
               res.data.list.forEach((item,index)=>{
                   item.check=false
                   item.add=true  //用来判断是否已新增
                   //默认选中一条sku
                   this.api.getSkuList(item.goodsId).then(res1=>{
                       // item.skuList=res1
                       this.$set(item,"skuList",res1)

                   })


               })
               console.log(this.orderList)

               this.orderList.push(...res.data.list)
               // 加载状态结束
               // this.finished = this.orderList.length >= res.page.total
               // this.loading = false;
               // this.pageNo++

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
                        padding: 0.2rem 0.40rem;
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

                    .single{
                        position: absolute;
                        left: 0 ;
                        top:50%;
                        transform: translateY(-50%);
                        padding: 0.38rem;
                        img{
                            width: 0.3rem;
                        }
                    }



                }
            }
        }





	}

    .btn-add{
        margin: 0.2rem auto;
        width: 3.3rem;
        height: 0.8rem;
        background: #FFFFFF;
        border: 1px solid #D4D4D4;
        border-radius: 37px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bottom{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        border-top: 1px solid #DBDBDB;
        div:nth-of-type(1){

            display: flex;
            align-items: center;

            img{
                margin-left: 0.6rem;
                width: 0.3rem;
                margin-right: 0.2rem;
            }
        }
        div:nth-of-type(2){
            display: flex;
            align-items: center;
            p{
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                border-radius: 37px;
                width: 1.8rem;
                height: 0.7rem;
                margin-right: 0.2rem;
            }
            p:nth-of-type(1){

                background: linear-gradient(90deg, #2778BE, #3596EA);

            }
            p:nth-of-type(2){

                background: linear-gradient(90deg, #DE3C22, #EB5930);

            }
        }
    }

    .penHeader{

        .cont{
            width: 100%;
            position: fixed;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 1rem;
            background: #2778BE;
            color: white;
            font-size: 0.32rem;
            z-index: 100;
            .arrow-left{
                position: absolute;
                left: 0.23rem;
                top: 50%;
                transform: translateY(-50%);
            }
            .topEditor{
                position: absolute;
                right: 0.5rem;
                top: 50%;
                width: 0.35rem;
                font-size: 0.28rem;
                white-space: nowrap;
                transform: translateY(-50%);
            }
        }


        .place{
            height: 1rem;
        }
    }

</style>
