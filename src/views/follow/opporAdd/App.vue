<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="新增商机"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>标题：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.nm"  placeholder="请输入商机名称" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>客户名称：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" place="请选择跟进客户" :list="custumList"  @change="getCustumList"></mob-select>
                        </van-col> 
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系人：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.linkman"  placeholder="请输入联系人" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.mob" placeholder="请输入联系电话" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系邮箱：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.email" placeholder="请输入联系邮箱"  disabled>
                        </van-col>
                    </van-row>



                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>商机内容：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="form.cont" placeholder="请输入商机内容"></textarea>
                        </van-col>
                    </van-row>



                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>商机状态：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="statusList" place="请选择商机状态" @change="chooseStatus"></mob-select>
                        </van-col>
                    </van-row>


                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>意向金额：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.amt" placeholder="请输入金额"  type="number" >
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
	import {mixDtl} from "../../person/mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    nm: "",//商机标题
                    custId: "",
                    custNm: "",
                    linkman: "",
                    mob: "",
                    email: "",
                    cont: "",
                    statusCd: "",
                    amt: "",
                    orgEnterId: "",
                    rmks: ""
                },

                custumList:[],//客户列表
                statusList:[],//状态列表



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
            this.form.orgEnterId = this.currentRole.id
            this.getCustum('')
            this.getStatus()
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/opportunity'
				}
			},
		    //商机状态回调
            chooseStatus(e){
                this.form.statusCd=e.cd
            },


		    //客户选择回调
            getCustumList(e){
                this.form.linkman = e.linkman ? e.linkman : ''
                this.form.mob = e.mob ? e.mob : ''
                this.form.custId = e.id
                this.form.custNm = e.custNm ? e.custNm : ''
                this.form.email = e.email

            },

            //客户档案-跟进记录列表
            async getCustum(val){
                let qry = this.query.new()
                this.query.toW(qry,'custNm',val,'LK')
                this.custumList = await this.api.custInfoList2(this.query.toEncode(qry))
                this.custumList.forEach(item=>{
                    this.$set(item,'nm',item.custNm+item.linkman)
                })

            },
            //获取跟进状态及方式
            async getStatus(){
                this.statusList = await this.api.dataDictionary('OPPORTUNITY_STATUS')

            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                console.log(this.form)

                 if(!this.form.nm){
                     Toast("请输入商机名称")
                     return
                 }
                 if(!this.form.custId){
                     Toast("请选择跟进客户")

                     return
                 }
                 if(!this.form.cont){
                     Toast("请输入商机内容")
                     return
                 }
                 if(!this.form.statusCd){
                     Toast("请选择商机状态")
                     return
                 }
                 if(!this.form.amt){
                     Toast("请输入意向金额")
                     return
                 }

                this.api.custProjectAdd(this.form).then(res=>{
                    Toast('添加成功');
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
                            background: none;
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
