<template>
<!-- 发票帮助中心 -->
    <div class="billQua">
		<div class="img-tips">
			<img :src="imgTip">
		</div>
        <div v-if="audit==1" class="tip-box">
			<div class="tip-word">您的增票资质：<span style="font-size: 0.24rem;color: #909090;">未添加</span></div>
			<div @click="audit=2" class="tip-btn">添加增票资质</div>
		</div>
		<!-- <div v-if="audit==3" class="tip-box">
			<div @click="audit=2" class="tip-btn">修改</div>
			<div @click="delInfo" class="tip-btn" style="color: #D5D5D5;border-color: #D5D5D5;">删除</div>
		</div> -->
		<div class="info-box" v-if="audit!=1">
			<div class="classTitle">
				<img :src="tradingL">
				<p>填写增票资质信息</p>
				<img :src="tradingR">
			</div>
			<div class="input-tips" v-if="audit==2">（所有信息均为必填）</div>
			<van-row class="row" align="center" type="flex" v-if="audit==2">
			    <van-col span="8" offset="1"><p class="row-label">单位名称：</p></van-col>
			    <van-col span="15" offset="1"><input placeholder="输入单位名称" v-model="info.nm"></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==2">
			    <van-col span="8" offset="1"><p class="row-label">纳税人识别码：</p></van-col>
			    <van-col span="15" offset="1"><input placeholder="输入纳税人识别码" v-model="info.taxNum"></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==2">
			    <van-col span="8" offset="1"><p class="row-label">注册地址：</p></van-col>
			    <van-col span="15" offset="1"><input placeholder="输入注册地址" v-model="info.address"></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==2">
			    <van-col span="8" offset="1"><p class="row-label">注册电话：</p></van-col>
			    <van-col span="15" offset="1"><input placeholder="输入注册电话" v-model="info.tel" type="number"></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==2">
			    <van-col span="8" offset="1"><p class="row-label">开户银行：</p></van-col>
			    <van-col span="15" offset="1"><input placeholder="输入开户银行" v-model="info.bank"></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==2">
			    <van-col span="8" offset="1"><p class="row-label">银行账户：</p></van-col>
			    <van-col span="15" offset="1"><input placeholder="输入银行账户" v-model="info.account" type="number"></van-col>
			</van-row>
			<!-- <van-row class="row" align="center"  type="flex" justify="center" v-if="audit==2">
				<van-col>
					<van-checkbox v-model="checked" shape="square" icon-size="0.24rem"></van-checkbox>
				</van-col>
				<van-col style="margin-left: 0.1rem;">
					<p class="row-label" style="font-size: 0.22rem;">我已阅读并同意<span style="color: #E4393C;">《增票资质确认书》</span></p>
				</van-col>
			</van-row> -->
			<van-row class="row" align="center" type="flex" v-if="audit==3">
				<van-col offset="1"><p class="row-label">单位名称：{{info.nm}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==3">
				<van-col offset="1"><p class="row-label">纳税人识别码：{{info.taxNum}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==3">
				<van-col offset="1"><p class="row-label">注册地址：{{info.address}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==3">
				<van-col offset="1"><p class="row-label">注册电话：{{phone}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==3">
				<van-col offset="1"><p class="row-label">开户银行：{{info.nm}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit==3">
				<van-col offset="1"><p class="row-label">银行账户：{{account}}</p></van-col>
			</van-row>
		</div>
		<div class="info-box">
			<div class="classTitle">
				<img :src="tradingL">
				<p>增票收票地址</p>
				<img :src="tradingR">
				<span class="classTitle-btn" @click="audit2=2" v-if="isPass2&&audit2==3">修改</span>
				<span class="classTitle-btn2" @click="del2" v-if="isPass2&&audit2==3">删除</span>
			</div>
			<van-row class="row" align="center" type="flex" v-if="audit2==1">
			    <van-col offset="1">
					<div class="row-label" style="font-size: 0.28rem;display: flex;align-items: center;">您还未设置收票地址：<p class="row-btn" @click="audit2=2">立即设置</p></div>
				</van-col>
			</van-row>
			<van-row  class="row" align="center" type="flex" v-if="audit2==2">
				<van-col span="8" offset="1"><p class="row-label">收票人姓名：</p></van-col>
				<van-col span="15"><input placeholder="输入收票人姓名" v-model="recInfo.linkman"></van-col>
			</van-row>
			<van-row  class="row" align="center" type="flex" v-if="audit2==2">
				<van-col span="8" offset="1"><p class="row-label">收票人手机号：</p></van-col>
				<van-col span="15"><input placeholder="输入收票人手机号" v-model="recInfo.phone"></van-col>
			</van-row>
			<van-row  class="row" align="center" type="flex" v-if="audit2==2">
				<van-col span="8" offset="1"><p class="row-label">收票人地区：</p></van-col>
				<van-col span="12"><addr @changeAddr="changeAddr" :addrNm="recInfo.addrNm" ref="addrC"></addr></van-col>
				<van-col span="2"><van-icon name="arrow-down" /></van-col>
			</van-row>
			<van-row  class="row" align="center" type="flex" v-if="audit2==2">
				<van-col span="8" offset="1"><p class="row-label">收票人地址：</p></van-col>
				<van-col span="15"><input placeholder="输入收票人地址" v-model="recInfo.addrDetail"></van-col>
			</van-row>
			<van-row  class="row" align="center" type="flex" v-if="audit2==2">
				<van-col span="8" offset="1"><p class="row-label">收票人邮箱：</p></van-col>
				<van-col span="15"><input placeholder="输入收票人邮箱" v-model="recInfo.email"></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit2==3">
				<van-col offset="1"><p class="row-label">收票人姓名：{{recInfo.linkman}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit2==3">
				<van-col offset="1"><p class="row-label">收票人手机号：{{phone2}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit2==3">
				<van-col offset="1"><p class="row-label">收票人地区：{{recInfo.addrNm}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit2==3">
				<van-col offset="1"><p class="row-label">收票人地址：{{recInfo.addrDetail}}</p></van-col>
			</van-row>
			<van-row class="row" align="center" type="flex" v-if="audit2==3">
				<van-col offset="1"><p class="row-label">收票人邮箱：{{recInfo.email}}</p></van-col>
			</van-row>
		</div> 
		<b-button2 v-if="audit==2" left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
		<b-button2 v-if="audit2==2" left-text="取消" right-text="提交" @leftClick="leftClick2" @rightClick="rightClick2"></b-button2>
    </div>
</template>

<script>
	import bButton2 from "../bButton2";
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import addr from '../../addr.vue'
	import { Toast } from 'vant';
    export default {
        name: "billQua",
        props:{
            
        },
		components:{
			bButton2,
			addr
		},
        data(){
          return{
			  id:"",
			  tradingL,
			  tradingR,
			  isPass:false,
			  audit:1, //1未填写，2填写中（填写或修改），3填写完成
			  info: {
			    orgEnterId: '',
			    nm: "", //名字
			    taxNum: "", //税号
			    tel: "", //电话号码
			    address: "", //地址
			    bank: "", //开户行
			    account: "", //账户
			  },
			  recInfo: {
			    orgEnterId: '', //机构id
			    linkman: "", //联系人
			    phone: "", //联系电话
			    addrNm: "", //地址名称
			    addrDetail: "", //发票寄送地址
			    email: "", //电子邮箱，比如 example@qq.com
			  },
			  phone: '',
			  account: '',
			  phone2: '',
			  // checked: false,
			  isPass2: false,
			  audit2: 1, //1未填写，2填写中（填写或修改），3填写完成
			  currentRole: '',
			  imgTip: ''
          }
        },
        methods:{
			toDetail(id) {
			},
			leftClick(){
			  if(this.isPass) {
			    this.audit = 3
			  } else {
			    this.audit = 1
			  }
			},
			leftClick2(){
			  if(this.isPass2) {
			    this.audit2 = 3
			  } else {
			    this.audit2 = 1
			  }
			},
			rightClick() {
			  this.info.orgEnterId = this.currentRole.id
			  if(this.info.nm=='') {
			    Toast('请输入单位名称');
			    return
			  }
			  if(this.info.taxNum=='') {
			    Toast('请输入纳税人识别码');
			    return
			  }
			  if(this.info.address=='') {
			    Toast('请输入注册地址');
			    return
			  }
			  // if(this.reg.checkPhone(this.info.tel)!='ok') {
			  //   Toast(this.reg.checkPhone(this.info.tel));
			  //   return
			  // }
			  if(this.info.tel=='') {
			    Toast('请输入注册电话');
			    return
			  }
			  if(this.info.bank=='') {
			    Toast('请输入开户银行');
			    return
			  }
			  if(this.info.account=='') {
			    Toast('请输入银行账户');
			    return
			  }
			  // if(!this.checked) {
			  //   Toast('请阅读并同意《增票资质确认书》');
			  //   return
			  // }
			  if(!this.isPass) {
			    this.api.qualiAdd(this.info).then(res => {
			      if(res.msg=='成功') {
			        Toast('增票资质添加成功！')
			        this.audit = 3
			        this.isPass = true
			        this.getInfo()
			      }
			    })
			  } else {
			    this.api.qualiUpd(this.info).then(res => {
			      if(res.msg=='成功') {
			        Toast('增票资质修改成功！')
			        this.audit = 3
			        this.getInfo()
			      }
			    })
			  }
			},
			rightClick2() {
			  this.recInfo.orgEnterId = this.currentRole.id
			  if(this.recInfo.linkman=='') {
			    Toast('请输入收票人姓名');
			    return
			  }
			  if(this.reg.checkPhone(this.recInfo.phone)!='ok') {
			    Toast(this.reg.checkPhone(this.recInfo.phone));
			    return
			  }
			  if(this.recInfo.addrNm=='') {
			    Toast('请选择收票人地区');
			    return
			  }
			  if(this.recInfo.addrDetail=='') {
			    Toast('请输入收票人地址');
			    return
			  }
			  if(this.reg.checkMail(this.recInfo.email)!='ok') {
			    Toast(this.reg.checkMail(this.recInfo.email));
			    return
			  }
			  if(!this.isPass2) {
			    this.api.qualiAddrAdd(this.recInfo).then(res => {
			      if(res.msg=='成功') {
			        Toast('收票地址设置成功！')
			        this.audit2 = 3
			        this.isPass2 = true
			      }
			    })
			  } else {
			    this.api.qualiAddrUpd(this.recInfo).then(res => {
			      if(res.msg=='成功') {
			        Toast('收票地址修改成功！')
			        this.audit2 = 3
			      }
			    })
			  }
			},
			getInfo() {
			  let param={
			    orgEnterId:this.currentRole.id
			  }
			  this.api.getQualiInfo(param).then(res => {
			    if(res.data) {
			      this.audit=3
			      this.isPass = true
			      this.info = res.data
			      this.id = res.data.id
			      this.phone = this.info.tel
			      this.account = this.info.account
			      this.getRecInfo()
			    } else {
			      this.audit=1
			    }
			  })
			},
			getRecInfo() {
			  let param={
			    orgEnterId:this.currentRole.id
			  }
			  this.api.getQualiAddrInfo(param).then(res => {
			    if(res.data.list.length>0) {
			      this.audit2 = 3
			      this.isPass2 = true
			      this.recInfo = res.data.list[0]
			      this.phone2 = this.recInfo.phone
			    } else {
			      this.audit2 = 1
			    }
			  })
			},
			delInfo() {
				this.api.qualiDel({ids:this.id}).then(res => {
				  if(res.msg=='成功') {
				    Toast('增票资质删除成功！')
				    this.audit = 1
				    this.isPass = false
				  }
				})
			},
			del2() {
			    this.api.qualiAddrDel({ids:this.recInfo.id}).then(res => {
			      if(res.msg=='成功') {
					Toast('增票收票地址删除成功！')
			        this.audit2 = 1
			        this.isPass2 = false
			      }
			    })
			},
			changeAddr(e) {
				let data = JSON.parse(e)
				this.recInfo.addrNm = data.province+'-'+data.city+'-'+data.region
			}
        },
		created() {
			this.currentRole = JSON.parse(this.until.loGet('currentRole'))
			this.api.getAdert('billAdApp').then(res => {
				this.imgTip = res[1].imgUrl
			})
			if(this.currentRole) {
				this.getInfo()
			} else {
				Toast('您未入驻，请完善信息')
				setTimeout(()=>{
					this.until.href('./persInfo.html')
				},1500)
			}
		}
    }
</script>

<style scoped lang="less">
	.billQua {
		width: 100%;
		.img-tips {
			width: 100%;
			padding: 0.2rem;
			box-sizing: border-box;
			background-color: #fff;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			img {
				width: 100%;
			}
		}
		.tip-box {
			width: 100%;
			margin-top: 0.1rem;
			border-radius: 5px;
			padding: 0.4rem;
			box-sizing: border-box;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.tip-word {
				font-size: 0.28rem;
				color: #303030;
				display: flex;
				align-items: center;
			}
			.tip-btn {
				width: 2.3rem;
				height: 0.55rem;
				text-align: center;
				line-height: 0.55rem;
				font-size: 0.28rem;
				color: #2778BE;
				border: 1px solid #2778BE;
				border-radius: 4px;
			}
		}
		.info-box {
			width: 100%;
			padding: 0.4rem 0.5rem;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 5px;
			margin-top: 0.1rem;
			.classTitle{
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.3rem;
				color: #303030;
				position: relative;
				img{
					width: 1.2rem;
				}
				p {
					margin: 0 0.3rem;
				}
				.classTitle-btn {
					position: absolute;
					right: -0.2rem;
					top: -0.2rem;
					font-size: 0.24rem;
					color: #2778BE;
				}
				.classTitle-btn2 {
					position: absolute;
					right: -0.2rem;
					top: 0.2rem;
					font-size: 0.24rem;
					color: #2778BE;
				}
			}
			.input-tips {
				font-size: 0.24rem;
				color: #E4393C;
				margin: 0.2rem auto;
				text-align: center;
			}
			.row{
			    padding: 0.2rem 0;
			    flex-shrink: 0;
				font-size: 0.24rem;
			    input{
			        border: 1px solid #DDDDDD;
			        padding: 0.1rem 0.2rem;
			        width: 85%;
					font-size: 0.22rem;
			    }
				.row-label{
				    color: #333333;
					.row-btn {
						width: 1.73rem;
						height: 0.55rem;
						box-sizing: border-box;
						border: 1px solid #2778BE;
						color: #2778BE;
						text-align: center;
						line-height: 0.55rem;
					}
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
			}
		}
	}
</style>