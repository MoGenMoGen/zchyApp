<template>
    <div class="app" :style="{backgroundImage:'url('+bg+')'}">
		<!-- 注册成功 -->
		<van-popup v-model="succShow" position="center" style="background-color: #F3F3F3;border-radius: 0.08rem;">
			<div class="succPop"><i class="iconfont iconchenggong1"></i><span>注册成功</span></div>
		</van-popup>
		<van-popup v-model="centerDialogVisible" position="bottom" class="contBox">
			<div v-html="cont"></div>
		</van-popup>

		<van-nav-bar fixed title="注册" :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			<div slot="right"><p @click="toPage('./login.html')">登录</p></div>
		</van-nav-bar>
		<div class="formBox">
			<div class="stepBox">
				<p>
					<img :src="firstH">
					<span style="color: #0064B2;font-size: 0.22rem;">1. 验证手机号</span>
				</p>
				<van-icon name="arrow" :color="stepNum>1?'#0064B2':'#999999'"/>
				<p>
					<img :src="stepNum>1?secondH:secondL">
					<span style="font-size: 0.22rem;" :style="stepNum>1?'color: #0064B2;':'color: #999999;'">2. 填写账号信息</span>
				</p>
				<van-icon name="arrow" :color="stepNum>2?'#0064B2':'#999999'"/>
				<p>
					<img :src="stepNum>2?thirdH:thirdL">
					<span style="font-size: 0.22rem;" :style="stepNum>2?'color: #0064B2;':'color: #999999;'">3. 注册成功</span>
				</p>
			</div>
			<div class="stepOne" v-if="stepNum==1">
				<div class="input">
				    <img :src="user"/>
				    <input v-model="ruleForm.username" placeholder="请输入用户名" @blur="checkUserName"/>
					<p class="toast" v-if="checkuser == true">用户名重复</p>
				</div>
				<div class="input">
				    <img :src="phone"/>
				    <input v-model="ruleForm.mob" placeholder="请输入手机号码" type="number" @blur="checkTel"/>
					<p class="toast" v-if="checktel == true">手机号重复</p>
				</div>
				<div class="input">
				    <img :src="msg"/>
				    <input v-model="ruleForm.vcode" placeholder="请输入验证码" type="number"/>
					<button class="button1" v-if="!time" @click.stop="getCode">获取验证码</button>
					<button class="button1" v-else>{{time}}S后获取</button>
				</div>
				<div class="input">
				    <img :src="password"/>
				    <input v-model="ruleForm.password" placeholder="请输入密码" type="password"/>
				</div>
				<div class="input">
				    <img :src="password"/>
				    <input v-model="ruleForm.comfirmPassword" placeholder="请再次输入密码" type="password"/>
				</div>
				<div class="agree" @click="agree=!agree">
				  <i class="iconfont" :class="{'iconfangkuang':!agree,'iconxuanzhong':agree}"></i> 我已阅读并同意<span @click.stop="centerDialogVisible=true">《中创海洋用户免责声明》</span>
				</div>
			</div>
			<div class="stepTwo" v-if="stepNum>=2">
				<div class="input">
					<p>真实姓名</p><input v-model="ruleForm.realNm" placeholder="请输入真实姓名">
				</div>
				<div class="input">
					<p>公司名称</p><input v-model="ruleForm.company" placeholder="请输入公司名称">
				</div>
				<div class="input">
					<p>所属地区</p><addr @changeAddr="changeAddr" ref="addrC"></addr>
				</div>
				<div class="input">
					<p>详细地址</p><input v-model="ruleForm.address" placeholder="请输入详细地址">
				</div>
				<div class="input">
					<p>推荐码</p><input v-model="ruleForm.inviCd" placeholder="请输入推荐码">
				</div>
			</div>
			<button @click="confirm">{{stepNum==1?'下一步':'确认提交'}}</button>

		</div>


    </div>

</template>

<script>
	import { Toast } from 'vant';
    import user from './img/账户.png'
	import password from './img/密码.png'
	import phone from './img/手机.png'
	import msg from './img/校验码.png'
	import firstH from './img/第一步.png'
	import secondH from './img/第二步.png'
	import secondL from './img/第二步-未.png'
	import thirdH from './img/第三步.png'
	import thirdL from './img/第三步-未.png'
    import bg from '@/assets/img/bg.png'
	import addr from '@/components/addr'
	import {mapState} from "vuex";
    export default {
    data() {
			var checkTel = (rule, value, callback) => {
			  let regPhone = /^(((13[0-9]{1})|(14[0-9]{1})||(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
			  if (!value) {
			    return callback(new Error('手机号码不能为空！'));
			  }else {
			    setTimeout(() => {
			      if (!regPhone.test(value)) {
			        return callback(new Error('请填写正确的手机号！'));
			      }else {
			        return callback()
			      }
			    }, 1000);
			  }
			};
      return {
        user,
        password,
		phone,
		msg,
		firstH,
		secondH,
		secondL,
		thirdH,
		thirdL,
        bg,
			agree:false,	//是否同意声明
		  checkuser:false,
		  checktel:false,
			centerDialogVisible:false,	//免责声明是否显示
			succShow:false,
			stepNum:1,	//步骤
			cont:"",
        ruleForm:{
          username:'',
          mob:'',
					vcode:'',
					password:'',
          comfirmPassword:'',
          realNm: "",
          company: "",
          addrCd: "",
          addrNm: "",
          address: "",
          referrerId:'',
          inviCd:'',
        },
				time:0,
      };
    },
    components:{
			addr
		},
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        created(){
        },
        mounted() {
        	if(this.until.seGet('inviCd')){
        	    this.ruleForm.inviCd = this.until.seGet('inviCd')
			}
					this.getCont()
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
        			window.location.href = window.location.origin+this.serverAddr+'/login/register'
        		}
        	},
					getCont(){ //声明
					  this.api.ruleDetail('5028235019260928').then(res=>{
							console.log('声明')
							console.log(res)
					    this.cont = res.data.cont
							console.log(this.cont)
					  })
					},
					async checkUserName(){
						if(this.ruleForm.username){
							await this.api.checkUsername(this.ruleForm.username).then(res=>{
								this.checkuser = false
							}).catch(err=>{
								this.checkuser = true
							})
						}else{
							this.checkuser = false
						}
					},
					async checkTel(){
						if(this.ruleForm.mob){
							 await this.api.checkMob(this.ruleForm.mob).then(res=>{
								 this.checktel = false
							 }).catch(err=>{
								 this.checktel = true
							 })
						}else{
							this.checktel =false
						}
					},
			 async confirm(){
				//下一步
				if(this.stepNum==1){
					if(!this.ruleForm.username){
						Toast.fail('请输入用户名');
						return
					}else{
						this.checkUserName();
					}
					if(this.reg.checkPhone(this.ruleForm.mob)!='ok'){
						Toast.fail(this.reg.checkPhone(this.ruleForm.mob));
						return
					}else{
						this.checkTel();
					}
					if(!this.ruleForm.vcode){
						Toast.fail('请输入验证码');
						return
					}
					if(!this.ruleForm.password){
						Toast.fail('请输入密码');
						return
					}
					if(this.ruleForm.password!=this.ruleForm.comfirmPassword){
						Toast.fail('两次密码不一致');
						return
					}
					if(!this.ruleForm.password){
						Toast.fail('验证码发送成功');
						return
					}
					if(!this.agree){
						Toast.fail('请阅读并同意《中创海洋用户免责声明》');
						return
					}
                    this.stepNum++
				}else if(this.stepNum==2){
					window.sessionStorage.setItem('changeLoading',true)
					// this.store.commit('changeLoading',true)
					this.api.register(this.ruleForm).then(res=>{
					  this.succShow=true
                        this.stepNum++
					  setTimeout(()=>{
						this.succShow=false
					  },1000)
					  setTimeout(()=>{
                          window.location.replace('./login.html')
					    // this.toPage('./login.html')
					  },250)
					})
				}

			},
			//获取地区信息
			changeAddr(info){
				console.log('父组件获取地区')
				console.log(info)
			  let data = JSON.parse(info)
			  this.ruleForm.addrNm = data.province+'-'+data.city+'-'+data.region
			  this.ruleForm.addrCd = data.provinceId+'-'+data.cityId+'-'+data.regionId
			},
			getCode(){
			  // return
			  if(this.reg.checkPhone(this.ruleForm.mob)!='ok'){
				Toast.fail(this.reg.checkPhone(this.ruleForm.mob));
			    return
			  }
			  this.api.getCode(this.ruleForm.mob).then(()=>{
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
				// window.location.href=url
                window.location.replace(url)
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
		.succPop{
			// border-radius: 0.08rem;
			padding: 0.4rem 0.67rem;
			.iconchenggong1{
				color: #16B534;
				font-size: 0.32rem;
				margin-right: 0.12rem;
			}
			span{
				color: #333333;
				font-size: 0.24rem;
			}
		}
		.contBox{
			height: 50%;
			padding: 0.2rem;
			box-sizing: border-box;
		}
		.formBox{
			margin: 0.96rem 0.3rem;
			background-color: #ffffff;
			border-radius: 0.12rem;
			padding: 0.4rem 0.48rem 0.6rem;
			.stepBox{
				display: flex;
				align-items: center;
				justify-content: space-between;
				>p{
					display: flex;
					flex-direction: column;
					align-items: center;
					>img{
						width: 0.4rem;
						height: 0.4rem;
						margin-bottom: 0.13rem;
					}
				}
				>i{
					font-size: 0.24rem;
					margin-bottom: 0.5rem;
				}

			}
			.stepOne,.stepTwo{
				margin-top: 0.5rem;
				.input{
				    width: 5.8rem;
				    margin: 0 auto 0.4rem;
				    height: 0.9rem;
				    display: flex;
				    display: -webkit-flex;
				    align-items: center;
					border-bottom: 0.01rem solid rgba(0,0,0,0.1);
					position: relative;
					>input{
					    flex: 1;
					    height: 0.53rem;
					    line-height: 0.53rem;
					    border-radius: 0;
					    font-size: 0.24rem;
						margin-right: 0.6rem;
					}
					.toast{
						position: absolute;
						color: red;
						font-size: 0.16rem;
						bottom: 0;
						right: 0;
					}
				}
			}
			.stepOne{
				.input{
				    >img{
				        width: 0.23rem;
				        height: 0.25rem;
				        margin: 0 0.6rem 0 0.23rem;
				    }
					.button1{
						white-space:nowrap;
						font-size: 0.24rem;
						color: #ffffff;
						background-color: @themeColor;
						padding: 0.11rem 0.14rem;
					}
				}
				.agree{
					font-size: 0.22rem;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					justify-content: center;
					margin-top: 0.8rem;
					>i{
						font-size: 0.3rem;
						margin-right: 0.14rem;
					}
					.iconxuanzhong{
					  color: @themeColor;
					}
					>span{
					  color: @themeColor;
					}
				}
			}
			.stepTwo{
				.input{
					>p{
						margin-left: 0.11rem;
						color: #333333;
						font-size: 0.26rem;
						width: 1.8rem;
					}
				}
			}
			>button{
				width: 5.8rem;
				border-radius: 0.03rem;
				height: 0.9rem;
			    margin: 0.4rem auto 0;
			    background: @themeColor;
			    color: #FFFFFF;
			    line-height: 0.8rem;
			    text-align: center;
			    font-size: 0.3rem;
			}
		}

    }

</style>
