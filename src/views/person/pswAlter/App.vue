<template>
<!--	消息详情-->
    <div id="container">

        <pen-header title="修改密码"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-row class="row" justify="space-between"  align="center" type="flex">
                    <van-col span="6" ><p class="row-label">原始密码</p></van-col>
                    <van-col span="18" ><input placeholder="请输入原始密码" v-model="form.password" type="password"> </van-col>
                </van-row>
                <van-row class="row" justify="space-between"  align="center" type="flex">
                    <van-col span="6" ><p class="row-label">新密码</p></van-col>
                    <van-col span="18" ><input placeholder="请输入新密码" v-model="form.newPassword" type="password"> </van-col>
                </van-row>
                <van-row class="row" justify="space-between"  align="center" type="flex">
                    <van-col span="6" ><p class="row-label">确认密码</p></van-col>
                    <van-col span="18" ><input placeholder="请再次输入新密码" v-model="form.rePassword" type="password"> </van-col>
                </van-row>


            </div>
        </div>
        <b-button2 left-text="取消" right-text="确认修改" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
    import {mixDtl} from "../mixins/mixDtl"
    import { Toast } from 'vant';
	import {mapState} from "vuex";
    export default {
        mixins:[mixDtl],
        data() {
            return {
                value: '',
                form:{
                    password:'',
                    rePassword:'',
                    newPassword:'',
                }
            };
        },
        components:{
            penHeader,
            bButton2


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        mounted(){

            this.getDtl(this.id)
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/pswAlter'
				}
			},
            rightClick(){
                if(!this.form.password){

                    Toast('请输入原密码');
                    return
                }
                if(!this.form.newPassword){
                    Toast('请输入新密码');
                    return
                }
                if(!this.form.rePassword){
                    Toast('请再次输入新密码');
                    return
                }

                if(this.form.rePassword!==this.form.newPassword){
                    Toast('两次输入密码不同');
                    return
                }

                this.api.changePWD2(this.form).then(res=>{
                    Toast('修改密码成功');

                })
            },
            leftClick(){
              this.until.back()
            },
           async  getDtl(id){
               this.info =  await this.api.msgDetail(id)

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
                padding: 0.2rem 0.3rem;
                .row {
                    padding: 0.27rem 0;
                    border-bottom: 1px solid #E5E5E5;
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

                }
                .row:last-of-type{
                    border-bottom: none;
                }
            }
        }





	}



</style>
