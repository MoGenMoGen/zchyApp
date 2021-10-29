<template>
    <div class="app" :style="{backgroundImage:'url('+bg+')'}">
		<van-nav-bar fixed title="忘记密码" :border="false" class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		    <!-- <div slot="title" style="margin-top: 10pt">
		        <span class="span" style="color: #ffffff; font-size: 20px;">My inquiry</span>
		    </div> -->
			<div slot="right"><p @click="toPage('./login.html')">登录</p></div>
		</van-nav-bar>
		<div class="formBox">
			<div class="input">
			    <img :src="mob"/>
			    <input v-model="form.mob" type="text" placeholder="请输入手机号码"/>
			</div>
			<div class="input">
			    <img :src="vcode"/>
			    <input v-model="form.vcode" type="number" placeholder="请输入验证码" />
				<button class="button1" v-if="!time"  @click="getCode">获取验证码</button>
				<button class="button1" v-else>{{time}}S后获取</button>
			</div>
			<div class="input">
				<img :src="password"/>
				<input v-model="form.password" type="password" placeholder="请输入密码"/>
			</div>
			<div class="input">
				<img :src="password"/>
				<input v-model="form.comfirmPassword" type="password" placeholder="请再次输入密码"/>
			</div>
			<button @click="confirm">确认</button>
		</div>


    </div>

</template>

<script>
	import { Toast } from 'vant';
    import vcode from './img/vcode.png'
    import mob from './img/mob.png'
	import password from './img/password.png'
    import bg from '@/assets/img/bg.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                mob,
                vcode,
                password,
                bg,
                time:0,
                form:{
                    username:'',
                    password:''
                },
            };
        },
        components:{
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        created(){
        },
        mounted() {
            // console.log("js获取上(前)一页url"+document.referrer)
        
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
        			window.location.href = window.location.origin+this.serverAddr+'/login/changePWD'
        		}
        	},
			confirm(){
                if(this.reg.checkPhone(this.form.mob)!='ok'){
                    Toast.fail(this.reg.checkPhone(this.form.mob));
                    return
                }
                if(!this.form.vcode){
                    Toast.fail('请输入验证码');
                    return
                }
                if(!this.form.password || !this.form.comfirmPassword){
                    Toast.fail('请输入密码');
                    return
                }
                if(this.form.password !== this.form.comfirmPassword){
                    Toast.fail('两次密码输入不一致');
                    return
                }
                this.api.changePWD(this.form).then(res=>{
                    Toast.success('修改成功，请重新登录');
                    setTimeout(()=>{
                        window.location.replace('./login.html')
                        // this.toPage('./login.html')
                    },1500)
                })
			},
            //获取验证码
            getCode(){
                if(this.reg.checkPhone(this.form.mob)!='ok'){
                    Toast.fail(this.reg.checkPhone(this.form.mob));
                    return
                }
                this.api.getCode2(this.form.mob).then(()=>{
                    Toast.success('验证码发送成功');

                })
                this.time = 60
                let timer = setInterval(()=>{
                    if(this.time){
                        this.time--
                    }else {
                        clearInterval(timer)
                    }
                },1000)
            },
			back(){
				window.history.go(-1);
			},
            toPage(url){
                window.location.replace(url)
				// window.location.href=url
            }
        },

    };
</script>
<style lang="less">
	.fixTop{
		background: none;
		.van-nav-bar__title{
			font-size: 0.36rem;
			color: #ffffff;
		}
		.van-nav-bar__left{
			font-size: 0.34rem;
		}
		.van-nav-bar__right{
			font-size: 0.28rem;
		    color: #ffffff;
		}

	}
</style>
<style lang="less" scoped>

    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
		background-color: #F1F3F2;
		.formBox{
			margin: 0.96rem 0.3rem;
			background-color: #ffffff;
			border-radius: 0.12rem;
			padding: 1.1rem 0.6rem 1.85rem;
			.input{
			    width: 5.8rem;
			    margin: 0 auto 0.4rem;
			    height: 0.9rem;
			    display: flex;
			    display: -webkit-flex;
			    align-items: center;
				border-bottom: 0.01rem solid rgba(0,0,0,0.1);
			    >img{
			        width: 0.23rem;
			        height: 0.23rem;
			        margin: 0 0.6rem 0 0.23rem;
			    }
			    >input{
			        flex: 1;
			        height: 0.53rem;
			        line-height: 0.53rem;
					// background: #5EBAF9;
			        // border-left:1px solid rgba(0,0,0,0.2);
			        border-radius: 0;
			        font-size: 0.24rem;
			        text-indent: 0.29rem;
					/*margin-right: 0.6rem;*/
			    }
				.button1{
					height: 0.52rem;
					padding: 0 0.1rem;
					background-color: @themeColor;
					border: none;
					color: #FFFFFF;
					border-radius: 3px;
				}
				.button2{
					padding: 0 0.1rem;
					height: 0.52rem;
					border-radius: 3px;
					background-color: @themeColor;
					font-size: 16px;
					color: #FFFFFF;
				}
			}
			>button{
				width: 5.8rem;
				border-radius: 0.03rem;
				height: 0.9rem;
			    margin: 0.6rem auto 0;
			    background: @themeColor;
			    color: #FFFFFF;
			    line-height: 0.8rem;
			    text-align: center;
			    font-size: 0.3rem;
			}
		}

    }

</style>
<style>

</style>
