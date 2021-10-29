<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="申请开票"></pen-header>
        <div class="body">
            <div class="list-cont">


                <div class="list-item2" >

                    <van-row class="row"  type="flex" align="center">
                        <van-col span="7"><p><span style="color: #FF3232">*</span>发票类型：</p></van-col>
                        <van-col span="17" class="radio-cont">
                            <van-radio-group v-model="form.invoiceTypeCd"  class="radio-group" >
                                <van-radio :name="item.cd"  class="van-radio" v-for="item in typeList"  :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>

                    <van-row class="row"  type="flex">
                        <van-col span="7"><p><span style="color: #FF3232">*</span>抬头类型：</p></van-col>
                        <van-col span="17" class="radio-cont">
                            <van-radio-group v-model="form.type" class="radio-group" >
                                <van-radio :name="item.id"  class="van-radio" v-for="item in amList" :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>发票抬头：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="custumList"  @change="chooseCompany"></mob-select>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex" v-if="form.type==1">
                        <van-col span="7"><p><span style="color: #FF3232">*</span>纳税识别号：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.cd" placeholder="请输入纳税识别号">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>开户行账号：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.bankAccount" placeholder="请输入开户行账号" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>地址电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.addrPhone" placeholder="请输入地址电话">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>开票金额：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.invoiceAmt" placeholder="请输入开票金额" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>商品明细：</p></van-col>
                        <van-col span="17" >
                           {{invoiceProNm}}
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>地址列表：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="showNm" :list="addrList"  @change="chooseAddr"></mob-select>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>联系人：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.linkman" placeholder="请输入联系人" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.phone" placeholder="请输入电话" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>邮箱：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.email" placeholder="请输入邮箱" >
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>备注：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="form.rmks" placeholder="请输入备注"></textarea>
                        </van-col>
                    </van-row>



                </div>





            </div>
        </div>
       <b-button2 left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    orgEnterId: "",
                    orderId: "",
                    type: "1",
                    invoiceTypeCd: "",
                    nm: "",
                    cd: "",
                    addrPhone: "",
                    bankAccount: "",
                    invoiceAmt: "",
                    linkman: "",
                    phone: "",
                    invoiceAddr: "",
                    email: "",
                    rmks: "",
                    invoiceId:'',
                },
                invoiceProNm:'',//商品明细
                addrList:[],//地址列表
                typeList:[],//发票类型
                custumList:[],
                amList:[
                    {
                        id:2,
                        nm:'个人',
                    },
                    {
                        id:1,
                        nm:'企业',
                    },
                ],

            };
        },
        components:{
            penHeader,
            bButton2,
            mobSelect,



        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            let  item=JSON.parse(this.until.getQueryString('item'))
            let arr = []
            item.itms.forEach(v=>{
                arr.push(v.goodsNm)
            })
            this.invoiceProNm = arr.join('/')

            this.id=item.id
            this.getType()
            this.getCompany('')
            this.getAddrList('')
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

            //选中地址
            chooseAddr(val){
                this.form.linkman = val.receNm
                this.form.phone = val.receMob
                this.form.invoiceAddr=val.id

            },
            //选中公司
            chooseCompany(val){
                this.form.nm = val.nm
                this.form.cd = val.cd
                this.form.addrPhone = val.addrPhone
                this.form.bankAccount = val.bankAccount
                this.form.invoiceId=val.id
            },

            //地址列表
            async getAddrList(val){
                let qry = this.query.new()
                this.query.toW(qry,'receNm',val,'LK')
                this.query.toP(qry,1,100)
                let res = await this.api.addrList(this.query.toEncode(qry))

                this.addrList=res.data.list
                console.log("地址列表：")
                console.log(this.addrList)
                this.addrList.forEach(item=>{
                    this.$set(item,'showNm',item.addrDtl+item.receNm+item.receMob)
                })
            },

            async getCompany(v){
                let qry = this.query.new()
                this.query.toW(qry,'nm',v,'LK')
                this.custumList = await this.api.invoiceCompany(this.query.toEncode(qry))
                this.loading = false
            },

            //发票类型
            async getType(){
                this.typeList = await this.api.dataDictionary('INVOICE_TYPE')
            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                 this.form.orgEnterId = JSON.parse(this.until.loGet('currentRole')).id
                 this.form.orderId = this.id

                console.log(this.form)

                this.api.invoiceApply(this.form).then(res=>{
                    Toast('申请成功');
                    setTimeout(() => {
                        this.until.back();
                    }, 1500);
                })
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

                .list-item2 {
                    position: relative;
                    background: white;
                    border-radius: 5px;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0.2rem;

                    .row{
                        padding: 0.15rem 0.2rem;
                        color: #343434;
                        .radio-group{
                            display: flex;
                            flex-wrap: wrap;
                            .van-radio{
                                width: 50%;
                                padding-bottom: 0.25rem;
                            }
                        }
                    }
                    .row2{
                        padding: 0.15rem 0.2rem;
                        color: #343434;


                        input{
                            width: 90%;
                            padding: 0.15rem 0.2rem;
                            border: 1px solid #DDDDDD;
                        }
                        textarea{
                            width: 90%;
                            height:2.3rem;
                            border: 1px solid #DDDDDD;
                            padding: 0.2rem;
                        }

                        input::-webkit-input-placeholder {
                            color: #B8B8B8;
                        }

                        input::-moz-placeholder {
                            /* Mozilla Firefox 19+ */
                            color: #B8B8B8;
                        }

                        input:-moz-placeholder {
                            /* Mozilla Firefox 4 to 18 */
                            color: #B8B8B8;
                        }

                        input:-ms-input-placeholder {
                            /* Internet Explorer 10-11 */
                            color: #B8B8B8;
                        }

                        textarea::-webkit-input-placeholder {
                            color: #B8B8B8;
                        }

                        textarea::-moz-placeholder {
                            /* Mozilla Firefox 19+ */
                            color: #B8B8B8;
                        }

                        textarea:-moz-placeholder {
                            /* Mozilla Firefox 4 to 18 */
                            color: #B8B8B8;
                        }

                        textarea:-ms-input-placeholder {
                            /* Internet Explorer 10-11 */
                            color: #B8B8B8;
                        }


                    }
                }
            }
        }





	}



</style>
