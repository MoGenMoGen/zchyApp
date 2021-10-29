<template>
<!--	在线留言-->
    <div id="container">

        <pen-header title="在线留言"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-row class="row"  type="flex">
                    <van-col span="5" offset="2" ><p class="row-label">留言内容:</p></van-col>
                    <van-col span="16" >
                        <textarea placeholder="可在线提交您的宝贵意见，我们会尽力做到更好。" v-model="form.cont"></textarea>
                    </van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="5" offset="2" ><p class="row-label">联系人:</p></van-col>
                    <van-col span="16" >
                        <input placeholder="单行输入" v-model="form.linkman">
                    </van-col>
                </van-row>

                <van-row class="row" align="center" type="flex">
                    <van-col span="5" offset="2" ><p class="row-label">联系电话:</p></van-col>
                    <van-col span="16" >
                        <input placeholder="单行输入" v-model="form.phone">
                    </van-col>
            </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="5" offset="2" ><p class="row-label">联系邮箱:</p></van-col>
                    <van-col span="16" >
                        <input placeholder="单行输入" v-model="form.email">
                    </van-col>
                </van-row>

            </div>
        </div>

        <b-button2 left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
    import { Toast } from 'vant';
    import {mixDtl} from "../mixins/mixDtl"
	import {mapState} from "vuex";
    export default {
        mixins:[mixDtl],
        data() {
            return {
                value: '',
                form:{
                    linkman: "",
                    phone: "",
                    email: "",
                    cont: "",
                }
            };
        },
        components:{
            penHeader,
            bButton2,


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        mounted(){

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
					window.location.href = window.location.origin+this.serverAddr+'/sinovat/personal/'
				}
			},
            leftClick(){
              this.until.back()
            },
            async  rightClick(){

                if(this.form.cont==''){
                    Toast("请输入留言内容")
                    return
                }
                if(this.form.linkman==''){
                    Toast("请输入联系人")
                    return
                }
                if(this.reg.checkPhone(this.form.phone)!='ok'){
                    Toast("请输入正确手机号码")
                    return
                }
                if(this.reg.checkMail(this.form.email)!='ok'){
                    Toast("请输入正确邮箱")
                    return
                }

                let res= this.api.msgAdd(this.form)
                console.log(res)
                Toast("留言提交成功")
                setTimeout(()=>{
                    this.until.back()
                },2000)
            }
        }

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
                background: white;
                position: relative;
                padding: 0.2rem;
                .row {
                    padding: 0.15rem 0;
                    textarea{
                        width: 90%;
                        border: 1px solid #DDDDDD;
                        min-height: 2rem;
                        padding: 0.05rem 0.2rem;
                        font-size: 0.28rem;
                    }
                    input{
                        width: 90%;
                        border: 1px solid #DDDDDD;
                        height: 0.5rem;
                        padding: 0.05rem 0.2rem;
                        font-size: 0.28rem;
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



</style>
