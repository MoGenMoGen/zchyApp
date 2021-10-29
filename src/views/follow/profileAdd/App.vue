<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="新增客户"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>客户名称：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.custNm"  placeholder="请输入客户名称/公司名称" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系人：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.linkman" placeholder="请输入联系人"  >
                        </van-col> 
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.mob" placeholder="请输入联系电话" type="number" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系邮箱：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.email" placeholder="请输入联系邮箱" >
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>客户区域：</p></van-col>
                        <van-col span="17" >
                            <div style="border: 1px solid #DDDDDD;padding: 0.17rem 0.2rem">
                                <addr v-if="dataShow"  @changeAddr="changeAddr" :addrNm="form.addrNm" ref="addrC"></addr>
                            </div>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>详细地址：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.address" placeholder="请输入详细地址"  >
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
       <b-button2 left-text="取消" right-text="保存" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../../person/mixins/mixDtl"
    import { Toast } from 'vant';
	import addr from "../../../components/addr";
	import {mapState} from "vuex";

    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    orgEnterId:'',
                    custNm:'',//客户姓名
                    linkman:'',//
                    mob:'',
                    email:'',
                    addrCd:'',
                    addrNm:'',
                    address:'',
                    rmks:'',
                },
                dataShow:false,

            };
        },
        components:{
            penHeader,
            bButton2,
            addr

        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.dataShow=true
            this.form.orgEnterId = this.currentRole.id
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/profile'
				}
			},
            changeAddr(e){
                console.log(e)
                let data = JSON.parse(e)
                this.form.addrNm = data.province+'-'+data.city+'-'+data.region
                this.form.addrCd = data.provinceId+'-'+data.cityId+'-'+data.regionId
            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                console.log(this.form)
                 if(!this.form.custNm){
                     Toast('请输入客户名称')
                     return
                 }
                 if(!this.form.linkman){
                     Toast('请输入联系人名称')
                     return
                 }
                 if(this.reg.checkPhone(this.form.mob)!='ok'){
                     Toast(this.reg.checkPhone(this.form.mob))
                     return
                 }
                 if(this.reg.checkMail(this.form.email)!='ok'){
                     Toast(this.reg.checkMail(this.form.email))
                     return
                 }
                 if(!this.form.address){
                     Toast('请输入详情地址')
                     return
                 }
                this.api.addCustomer(this.form).then(res=>{
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
