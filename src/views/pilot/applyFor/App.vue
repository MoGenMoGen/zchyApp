<template>
  <div class="app">
		<van-popup v-model="certShow" position="bottom">
			<van-datetime-picker
				v-model="certiDate"
				type="date"
				title="选择年月日"
				@confirm="certConfirm"
				@cancel="certShow=false"
			/>
		</van-popup>
		<van-popup v-model="buildShow" position="bottom">
			<van-datetime-picker
				v-model="buildDate"
				type="date"
				title="选择年月日"
				@confirm="buildConfirm"
				@cancel="buildShow=false"
			/>
		</van-popup>
		
    <van-nav-bar fixed title="补贴在线申请" :border="false" fixed class="fixTop">
      <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
    </van-nav-bar>
    <div class="main">
      <div class="whiteBox">
				<div class="classTitle">
					<img :src="tradingL">
					<p>财政补助资金申请表</p>
					<img :src="tradingR">
				</div>
				<p class="inputBox"><span>企业名称:</span><input type="text" placeholder="单行输入" v-model="form.company"></p>
				<p class="inputBox"><span>项目名称:</span><input type="text" placeholder="单行输入" v-model="form.projNm"></p>
				<p class="inputBox"><span>所属县(区):</span><input type="text" placeholder="单行输入" v-model="form.county"></p>
				<p class="inputBox"><span>所属街道:</span><input type="text" placeholder="单行输入" v-model="form.street"></p>
				<p class="inputBox"><span>项目地址:</span><input type="text" placeholder="单行输入" v-model="form.address"></p>
				<p class="inputBox"><span>产权性质:</span><input type="text" placeholder="单行输入" v-model="form.propertyRight"></p>
				<p class="inputBox"><span>产权证号:</span><input type="text" placeholder="原渔船产权证号" v-model="form.oldCertNo"></p>
				<p class="inputBox"><span>证书时间:</span>
					<span class="input" :style="form.certTm?'color:#343434;':'color:#9a9a9a;'" @click="certShow=true">
					{{form.certTm?form.certTm:"获得产权证书时间"}}</span>
				</p>
				<p class="inputBox"><span>建造时间:</span>
					<span class="input" :style="form.buildTm?'color:#343434;':'color:#9a9a9a;'" @click="buildShow=true">
					{{form.buildTm?form.buildTm:"原渔船建造时间"}}</span>
				</p>
				<p class="inputBox"><span>已用年限:</span><input type="number" placeholder="原渔船已经用年限" v-model="form.used"></p>
				<p class="inputBox"><span>联 系 人:</span><input type="text" placeholder="单行输入" v-model="form.linkman"></p>
				<p class="inputBox"><span>开户名称:</span><input type="text" placeholder="单行输入" v-model="form.accountNm"></p>
				<p class="inputBox"><span>联系电话:</span><input type="number" placeholder="单行输入" v-model="form.mob"></p>
				<p class="inputBox"><span>开户银行:</span><input type="text" placeholder="单行输入" v-model="form.accountBank"></p>
				<p class="inputBox"><span>补助金额:</span><input type="number" placeholder="单行输入" v-model="form.subsidyAmt"><span class="abS">万元</span></p>
				<p class="inputBox"><span>银行账号:</span><input type="text" placeholder="补助资金转入银行账号" v-model="form.accountNo"></p>
				<div class="lineTitleBox">
					<span class="lineS"></span><p>渔船改造后技术参数:</p>
				</div>
				<p class="inputBox"><span>总  长:</span><input type="number" placeholder="单行输入" v-model="form.totalLen"></p>
				<p class="inputBox"><span>型  宽:</span><input type="number" placeholder="单行输入" v-model="form.width"></p>
				<p class="inputBox"><span>吃  水:</span><input type="number" placeholder="单行输入" v-model="form.loadDraught"></p>
				<p class="inputBox"><span>主机功率:</span><input type="number" placeholder="单行输入" v-model="form.hostPower"></p>
				<p class="inputBox"><span>航  速:</span><input type="number" placeholder="单行输入" v-model="form.speed"></p>
				<p class="inputBox"><span>定  员:</span><input type="number" placeholder="单行输入" v-model="form.complement"></p>
				<p class="redP">* 企业法定代表人（船东）确认（船东对提交材料的真实性 负责）</p>
				<p class="inputBox"><span>船舶证书号:</span><input type="text" placeholder="船舶证产权证书号" v-model="form.newCertNo"></p>
				<p class="inputBox"><span>船东姓名:</span><input type="text" placeholder="单行输入" v-model="form.shipowner"></p>
				<p class="inputBox"><span>联系电话:</span><input type="number" placeholder="单行输入" v-model="form.shipownerMob"></p>
      </div>
    </div>
		<div class="btnBox">
			<button class="cancelB" @click="toCancel">取消</button>
			<button class="confirmB" @click="toSubmit">确认</button>
		</div>
  </div>

</template>

<script>
  import { Toast } from 'vant';
	import { Dialog } from 'vant';
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";
  export default {
    data() {
      return {
				tradingL,
				tradingR,
				certShow:false,
				buildShow:false,
				certiDate:new Date(),	//证书时间
				buildDate:new Date(),	//建造时间
				form:{
				  company:"",
				  projNm:"",
				  county:"",
				  street:"",
				  address:"",
				  propertyRight:"",
				  oldCertNo:"",
				  certTm:"",
				  buildTm:"",
				  used:"",
				  linkman:"",
				  accountNm:"",
				  mob:"",
				  accountBank:"",
				  subsidyAmt:"",
				  accountNo:"",
				  totalLen:"",
				  width:"",
				  loadDraught:"",
				  hostPower:"",
				  speed:"",
				  complement:"",
				  newCertNo:"",
				  shipowner:"",
				  shipownerMob:"",
				  // attachment:"",
				},
      };
    },
    watch:{
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
		},
		methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/pilotService/applyFor'
				}
			},
			toSubmit(){
				console.log(this.form)
				for(let key  in this.form){
				  if(!this.form[key]){
				    console.log(this.form[key])
						Toast.fail("请确认申请表是否填写完整")
				    return
				  }
				}
				console.log('完整了')
				Dialog.confirm({
				  title: '提示',
				  message: '是否确认提交申请表?',
				})
				.then(() => {
					
				  this.submit()
			 })
				.catch(() => {
					console.log('xxx')
				});
			},
			toCancel(){
				Dialog.confirm({
				  title: '提示',
				  message: '确定取消补助资金申请?',
				})
				.then(() => {
					setTimeout(() => {
						this.back()
					},1000)
				})
				.catch(() => {
				  
				});
			},
			submit(){
				console.log('大大大')
				this.api.subsidiesAdd(this.form).then(res=>{
				  if(res.code==0){
					Toast.success("提交成功")
				    setTimeout(() => {
				      this.back()
				    }, 1000)
				  }
				})
			},
			certConfirm(value){//证书时间确认
				let time=this.until.formatDate(value)
				this.form.certTm=time.year+"-"+time.month+"-"+time.day
				this.certShow=false
			},
			buildConfirm(value){//建造时间确认
				let time=this.until.formatDate(value)
				this.form.buildTm=time.year+"-"+time.month+"-"+time.day
				this.buildShow=false
			},
      back(){
        window.history.go(-1);
      },
      toPage(url){
        window.location.href=url
      },
    },
	};
</script>
<style lang="less">
  .fixTop{
    background: @themeColor;
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
    .main{
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      // display: flex;
      flex: 1;
      flex-direction:column;
			padding: 0.3rem 0.2rem;
      margin-top: 0.9rem;
     .whiteBox{
        margin-bottom: 0.2rem;
        border-radius: 0.1rem;
        background-color: #ffffff;
				padding-bottom: 0.27rem;
				.classTitle{
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0.38rem 0;
					>img{
						width: 1.2rem;
					}
					>p{
						margin: 0 0.18rem;
						font-size: 0.3rem;
						color: #303030;
						font-weight: 600;
					}
				}
				.inputBox{
					display: flex;
					align-items: center;
					padding: 0 0.5rem;
					margin-bottom: 0.3rem;
					position: relative;
					>span{
						width: 1.6rem;
						font-size: 0.24rem;
						color: #343434;
					}
					>input{
						flex: 1;
						line-height: 0.5rem;
						padding-left: 0.25rem;
						box-sizing: border-box;
						border: 0.01rem solid #dddddd;
						font-size: 0.22rem;
						color: #343434;
					}
					.input{
						flex: 1;
						/*height: 0.5rem;*/
						box-sizing: border-box;
						padding-left: 0.25rem;
						border: 0.01rem solid #dddddd;
						font-size: 0.22rem;
						line-height: 0.5rem;
					}
					>input::-webkit-input-placeholder {
					    color: #9a9a9a;
					}
					
					>input::-moz-placeholder {
					    /* Mozilla Firefox 19+ */
					    color: #9a9a9a;
					}
					
					>input:-moz-placeholder {
					    /* Mozilla Firefox 4 to 18 */
					    color: #9a9a9a;
					}
					
					>input:-ms-input-placeholder {
					    /* Internet Explorer 10-11 */
					    color: #9a9a9a;
					}
					.abS{
						position: absolute;
						font-size: 0.22rem;
						color: #9a9a9a;
						right: 0.05rem;
						width: auto;
					}
				}
				.lineTitleBox{
					display: flex;
					align-items: center;
					padding: 0.35rem 0.56rem 0.3rem;
					.lineS{
						width: 0.05rem;
						height: 0.25rem;
						background-color: @themeColor;
						margin-right: 0.1rem;
					}
					>p{
						font-size: 0.24rem;
						color: #343434;
					}
				}
				.redP{
					padding: 0.1rem 0.39rem 0.36rem 0.51rem;
					color: #FF2F2F;
					font-size: 0.24rem;
				}
			}
    }
		.btnBox{
			display: flex;
			height: 0.9rem;
			>button{
				flex: 1;
				height: 0.9rem;
				font-size: 0.3rem;
				box-sizing: border-box;
			}
			.cancelB{
				background-color: #ffffff;
				color: #666666;
				border-top: 0.01rem solid #CFCFCF;
			}
			.confirmB{
				background-color: @themeColor;
				color: #ffffff;
			}
		}
	}

</style>
