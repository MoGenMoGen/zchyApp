<template>
<!--    设计订单，建造订单收款记录-->
    <div class="addProject">
        <pen-header2 title="收款记录" @leftClick="leftClick"></pen-header2>
        <div class="body">

            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id">
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>付款单位:</p></van-col>
                            <van-col span="18"><p>{{item.payerNm}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>款项金额:</p></van-col>
                            <van-col span="18"><p>￥{{item.payment}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>付款时间:</p></van-col>
                            <van-col span="18"><p>{{item.payDt}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>订单总额:</p></van-col>
                            <van-col span="18"><p>￥{{item.amt}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>已收:</p></van-col>
                            <van-col span="18"><p>￥{{item.paid}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>未收:</p></van-col>
                            <van-col span="18"><p>￥{{item.amt-item.paid}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex" >
                            <van-col span="6" ><p>操作</p></van-col>
                            <van-col span="5" >

                                <p  class="btn-copy"  v-if="audit==1" @click="toConfirm(item)">确认收款</p>
                                <p  v-if="audit==2">已确认收款</p>
                                <p  v-if="audit==3">拒绝确认收款</p>
                            </van-col>
                        </van-row>

                    </div>
                </van-list>
            </div>
        </div>

    </div>
</template>

<script>
    import penHeader2 from "./penHeader2";
    import mobSelect from "./shipInfo/mobSelect";
    import bButton2 from "./bButton2";
    import {Toast} from 'vant'
    import { Dialog } from 'vant';
    export default {
        name: "addProject",
        data(){
            return{
                pageNo:1,
                pageSize:15,
                finished:false,//标记是否已经加载完
                currentRole:'',//当前角色
                searchText:'',
                loading:false,
                immediate:false,//
                list:[]

            }
        },
        props:{
            id:{
                type:Number,
            }

        },
        watch:{
            id:{
                //.第一个handler：其值是一个回调函数。即监听到变化时应该执行的函数。
                handler:"getList",
                //确认是否以当前的初始值执行handler的函数。 immediate:true必须添加
                immediate:true

            },
            audit:{
                type:Number
            }
        },
         mounted(){

             // this.getList()
        },
        components:{
            penHeader2,
            mobSelect,
            bButton2
        },
        methods:{
            async  toAdd(item){

                let res = await this.api.shipInfoBasic(item.id)
                if(res.cids.split(',').length==3){
                    res.cid2=parseInt(res.cids.split(',')[1])
                    res.cid3=parseInt(this.form.cids.split(',')[2])
                }else if(res.cids.split(',').length==2){
                    res.cid2=parseInt(res.cids.split(',')[0])
                    res.cid3=parseInt(res.cids.split(',')[1])
                }
                this.$emit('confirm',res)

            },

            toConfirm(){
                Dialog.confirm({
                    title: '确认收款',
                    message: '您确认收款吗？',
                }).then(() => {
                    this.api.confirmRev({id:this.id,audit:2}).then((res) => {
                        if (res.code === 0) {
                            Toast("收款成功")
                            setTimeout(()=>{
                                this.$emit("leftClick")
                            },500)

                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
            leftClick(){
                this.$emit("leftClick")
            },
            onLoad(){
                this.getList()

            },

            async getList(){
                this.currentRole=JSON.parse(this.until.loGet('currentRole'))
                let qry = this.query.new()
                this.query.toP(qry,this.pageNo,this.pageSize)

                this.query.toW(qry,'orderId',this.id,'EQ')
                let param={
                    orgEnterId:this.currentRole.id
                }
                let res=await this.api.paymentList(this.query.toEncode(qry),param)
                this.list.push(...res.data.list)
                // 加载状态结束
                this.finished = this.list.length >= res.page.total ? true : false;
                this.loading = false;
                this.pageNo++

            }

        }
    }
</script>

<style scoped lang="less">

    .body{
        font-size: 0.29rem;
        background:@backgroundColor;
        padding: 0.2rem 0.2rem;
        .list-cont{


            .list-item{
                border-radius: 5px;
                position: relative;
                width: 100%;
                margin-bottom: 0.2rem;
                padding: 0.15rem 0;
                background: white;
                .row{
                    padding: 0.1rem 0.40rem;
                    color: #343434;
                    .btn-copy{
                        padding: 0.05rem 0.05rem;
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        font-size: 0.20rem;
                        border:1px solid rgba(39, 120, 190, 1);
                        color:rgba(39,120,190,1);
                        img{
                            width: 0.25rem;
                            margin-right: 0.1rem;
                        }
                        &:active{
                            opacity: 0.5;
                        }
                    }
                    .btn-edit{
                        padding: 0.05rem 0.05rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 5px;
                        width: 100%;
                        font-size: 0.20rem;
                        border:1px solid #E3882E;
                        color:#E3882E;
                        img{
                            width: 0.25rem;
                            margin-right: 0.1rem;
                        }
                        &:active{
                            opacity: 0.5;
                        }
                    }
                    .btn-look{
                        padding: 0.05rem 0.05rem;
                        border:1px solid #2B891E;
                        border-radius: 5px;
                        color:#2B891E;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        font-size: 0.20rem;
                        img{
                            width: 0.25rem;
                            margin-right: 0.1rem;
                        }
                        &:active{
                            opacity: 0.5;
                        }
                    }
                }
                .price{
                    color: #FF2525;
                    position: absolute;
                    right: 0.2rem;
                    top:50%;
                    transform: translateY(-50%);
                }

            }
        }
    }


</style>
