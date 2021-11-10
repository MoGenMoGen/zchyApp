<template>
    <div class="app" :style="{backgroundImage:'url('+bg+')'}">
		<van-nav-bar fixed title="登录" :border="false" class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		    <!-- <div slot="title" style="margin-top: 10pt">
		        <span class="span" style="color: #ffffff; font-size: 20px;">My inquiry</span>
		    </div> -->
			<div slot="right"><p @click="toPage('./register.html')">注册</p></div>
		</van-nav-bar>
		<div class="formBox">
			<div class="input">
			    <img :src="user"/>
			    <input v-model="form.username" type="text" placeholder="请输入登录名或手机号"/>
			</div>
			<div class="input">
			    <img :src="password"/>
			    <input v-model="form.password" placeholder="请输入密码" type="password"/>
				<button @click="toPage('./forgetPWD.html')">忘记密码</button>
			</div>
			<div class="input" style="opacity: 0;height: 0">
				<img :src="password"/>
				<input v-model="form.password" placeholder="请输入密码" type="password"/>
				<button @click="toPage('./forgetPWD.html')">忘记密码</button>
			</div>
			<button @click="confirm">登录</button>
		</div>


    </div>

</template>

<script>
	import { Toast } from 'vant';
    import user from './img/user.png'
	import password from './img/password.png'
    import bg from '@/assets/img/bg.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                user,
                password,
                bg,
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
			this.changeDevice()
			window.onresize = () => {
			  this.changeDevice()
			}
            // console.log("js获取上(前)一页url"+document.referrer)
        },
        methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/login/login'
				}
			},
			confirm(){
				if(!this.form.username){
					Toast.fail('请输入登录名或手机号');
					return
				}
				if(!this.form.password){
					Toast.fail('请输入密码');
					return
				}
				this.api.login(this.form).then(res=>{
					console.log("登录信息")
				  console.log(res)
				  window.localStorage.setItem("token",res.token)
				  window.localStorage.setItem("userInfo",JSON.stringify(res.userInfo))


				  Toast.success('登录成功');
					this.$bridge.callHandler('h5_set_user',JSON.stringify(res),res=>{

					})
                    //获取上次登录最后的角色
                    this.api.toGet('currentInfo').then(data=>{
                        if(data){
                            this.store.dispatch('save',data)
							this.until.loSave('currentRole',JSON.stringify(data))
                        }
                    })
				  setTimeout(()=>{
				      //有上级地址并且上级地址不是注册页面时，登录成功后直接返回上级页面
				      if(document.referrer && document.referrer.indexOf('register')=='-1'&&document.referrer.indexOf('setting')=='-1'){
                          window.location.replace(document.referrer)
                      }else { //否则跳转到首页
                          window.location.replace('../home/index.html?email='+this.form.username+'&password='+this.form.password+'&_='+(new Date()).valueOf())

                      }
				  },1500)

				})
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
			        height: 0.25rem;
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
					margin-right: 0.6rem;
			    }
				>button{
					color: @themeColor;
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
