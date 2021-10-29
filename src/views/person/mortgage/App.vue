<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="分期付款"></pen-header>

        <div class="body">

            <div class="list-header">
                <van-row class="row2" align="center" type="flex">
                    <van-col span="6"><p>订单编号：</p></van-col>
                    <van-col span="18"><p>{{info.orderCd}}</p></van-col>
                </van-row>
                <van-row class="row2" align="center" type="flex">
                    <van-col span="6"><p>收款名称：</p></van-col>
                    <van-col span="18"><p>{{stageInfo.shopNm}}</p></van-col>
                </van-row>
                <van-row class="row2" align="center" type="flex">
                    <van-col span="6"><p>订单总额：</p></van-col>
                    <van-col span="18"><p>￥{{stageInfo.orderPrice}}</p></van-col>
                </van-row>
                <van-row class="row2" align="center" type="flex">
                    <van-col span="6"><p>已付金额：</p></van-col>
                    <van-col span="18"><p style="color: #FF3535">￥{{stageInfo.payAmt ? stageInfo.payAmt : '0'}}</p></van-col>
                </van-row>

            </div>


            <div class="list-cont">
                <div class="list-item" v-for="item in stageInfo.itms" :key="item.id">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>分期名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>

                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>到期时间：</p></van-col>
                        <van-col span="18"><p>{{item.expireTm.slice(0,10)}}</p></van-col>
                    </van-row>
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>付款金额：</p></van-col>
                        <van-col span="18"><p style="color: #FF3535">￥{{item.amount}}</p></van-col>
                    </van-row>

                    <van-row class="row"  type="flex">
                        <van-col span="6"><p>图片：</p></van-col>
                        <van-col span="18">
                            <van-uploader v-model="item.fileList"
                                          :max-count="1" :after-read="afterRead" @click.native="choose(item)"/>


                        </van-col>
                    </van-row>

                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>状态：</p></van-col>
                        <van-col span="18">
                            <p class="status1" v-if="item.status==2"><img :src="paySuccss">已确认付款</p>
                            <p class="status1" v-if="item.status==1"><img :src="check">付款审核中</p>
                            <p class="btn" v-if="!item.status" @click="toPay(item)">确认付款</p>
                        </van-col>
                    </van-row>


                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import paySuccss from './img/成功.png'
    import check from './img/审核中.png'
	import {mixins} from "../mixins/mixins"
    import {Toast} from 'vant'
	import {mapState} from "vuex";

    export default {
		mixins:[mixins],
        data() {
            return {
                paySuccss,
                check,
               info:{},
                stageInfo:'',
                fileList:[],
                selectItem:{},
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
		    this.info=JSON.parse(this.until.getQueryString('info'))
            console.log("订单信息i")
            console.log(this.info)
            this.getInfo()
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
					this.until.back()
				}
			},
            choose(item){
                console.log("选中的值：")
                console.log(item)
                this.selectItem=item
            },
            afterRead(e){


                this.selectItem.fileList.forEach(item=>{
                    if(item.status!="done"){
                        item.status="uploading"
                        this.api.uploadImg2(item.file).then(res=>{

                            item.status="done"
                            item.url=res
                            this.selectItem.payVoucher=res
                            console.log("上传成功返回")
                            console.log(res)
                        })
                    }

                })
            },
            //确认付款
            toPay(item){


                if(!item.payVoucher){
                    Toast('请上传支付凭证')
                    return
                }
                let param = {
                    id:item.id,
                    voucher:item.payVoucher
                }
                console.log("参数。。。。。")
                console.log(param)
                this.api.stageConfirm(param).then(()=>{
                    Toast('支付成功')
                    setTimeout(()=>{
                        this.getInfo()
                    },1000)

                })
            },

            //分期信息
            async getInfo(){
                this.stageInfo =  await this.api.stageInfo(this.info.id)
                console.log("分期付款信息")
                console.log(this.stageInfo)
                this.stageInfo.itms.forEach(item=>{
                    let list=[]
                    if(item.payVoucher){
                        let obj={
                            status:'done',
                            url:item.payVoucher
                        }
                        list.push(obj)
                    }

                    this.$set(item,'fileList',list)
                })
            },

		   async	getList(){
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

            .list-header{
                border-radius: 5px;
                margin-bottom: 0.2rem;
                background: white;
                .row2{
                    padding: 0.15rem 0.40rem;
                    color: #343434;
                }
            }

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
                        .status1{
                            display: flex;
                            align-items: center;
                            img{
                                width: 0.35rem;
                                height: 0.35rem;
                                margin-right: 0.1rem;
                            }
                        }

                        .btn{
                            width: fit-content;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.1rem 0.2rem;
                            background: #2878BE;
                            color: white;
                            border-radius: 5px;

                        }

                    }





                }
            }
        }





	}



</style>
