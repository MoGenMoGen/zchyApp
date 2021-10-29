<template>
  <div class="app">
		<!-- 下拉选择组织 -->
		<van-popup v-model="idShow" position="bottom">
			<van-picker
			  show-toolbar
			  :columns="idList"
			  value-key="nm"
			  @confirm="onConfirm"
			  @cancel="onCancel"
			/>
		</van-popup>
		<van-popup v-model="centerDialogVisible" position="bottom" class="contBox">
			<div v-html="cont"></div>
		</van-popup>
		<van-nav-bar fixed title="我要入驻" :border="false" fixed class="fixTopC">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		</van-nav-bar>
        <div class="whiteBox step1" style="margin-top: 1.2rem;">
			<p class="stepTitle"><span class="lineC"></span><span class="nameS">入驻身份</span></p>
			<div class="entryBox">
				<p class="title"><b>*</b>入驻身份:</p>
				<div class="checkIdBox" @click="idShow=true"><p>{{checkNm}}</p><van-icon name="arrow-down" color="#666666" />
			</div>
			</div>
			<div class="entryBox">
				<p class="title"><b>*</b>身份属性:</p>
				<div class="radioBox">
					<van-radio-group v-model="ruleForm.type" direction="horizontal">
					  <van-radio name="1" v-show="ruleForm.identityCd!='identity100'" style="margin-right: 0.7rem;">企业</van-radio>
					  <van-radio name="2" v-show="ruleForm.identityCd=='identity10' || ruleForm.identityCd=='identity20'">个人</van-radio>
						<van-radio name="3" v-show="ruleForm.identityCd=='identity100'">政府机构</van-radio>
					</van-radio-group>
				</div>
			</div>
			<div class="entryBox">
				<p class="title" style="width: 100%;"><b>*</b><span class="rmksS">基本信息、企业资料资料：入驻企业账号为必填，个人账号为选填 。</span></p>
			</div>
		</div>
		<div class="whiteBox step2">
			<p class="stepTitle"><span class="lineC"></span><span class="nameS">基本信息</span></p>
			<div class="entryBox">
				<p class="title">{{ruleForm.identityCd=='identity100'?"机构名称:":"公司名称:"}}</p>
				<input type="text" v-model="ruleForm.company" :placeholder="ruleForm.identityCd=='identity100'?'请输入机构名称':'请输入公司名称'">
			</div>
			<div class="entryBox">
				<p class="title">所属地区:</p>
				<div class="addrBox">
					<addr @changeAddr="changeAddr" ref="addrC" ifBorder="true"></addr>
				</div>
			</div>
			<div class="entryBox">
				<p class="title">详细地址:</p>
				<input type="text" v-model="ruleForm.address" placeholder="请输入详细地址">
			</div>
			<div class="entryBox">
				<p class="title">联系人:</p>
				<input type="text" v-model="ruleForm.linkMan" :placeholder="ruleForm.identityCd=='identity100'?'请输入机构联系人姓名':'请输入公司联系人姓名'">
			</div>
			<div class="entryBox">
				<p class="title">联系手机:</p>
				<input type="text" v-model="ruleForm.mob" :placeholder="ruleForm.identityCd=='identity100'?'请输入机构联系人手机号码':'请输入公司联系人手机号码'">
			</div>
			<div class="entryBox">
				<p class="title">电子邮箱:</p>
				<input type="text" v-model="ruleForm.email" placeholder="请输入电子邮箱">
			</div>
		</div>
		<div class="whiteBox step3" v-show="ruleForm.identityCd!='identity100'">
			<p class="stepTitle"><span class="lineC"></span><span class="nameS">企业资料</span></p>
			<div class="uploadImg">
			  <p class="title">企业营业执照:</p>
			  <div>
				  <div class="upBox" v-if="!ruleForm.businessLicense">
						<van-uploader :after-read="afterRead1" class="upLoader"/>
				    <!-- <input type="file" @change="upImg($event,1)"/> -->
				  	<span style="font-size: 0.9rem; margin-bottom: 0.2rem;">+</span>
				  	<span>上传企业营业执照复印件</span>
				  </div>
				  <div class="imgBox" v-else>
					 <img :src="ruleForm.businessLicense"><van-icon name="cross" @click='delImg(1)'/>
				  </div>
			  </div>
			</div>
			<div class="uploadImg">
			  <p class="title">法人身份证:</p>
			  <div>
				  <div class="upBox" v-if="!ruleForm.idCard">
						<van-uploader :after-read="afterRead2" class="upLoader"/>
				    <!-- <input type="file" @change="upImg($event,2)"/> -->
				  	<span style="font-size: 0.9rem; margin-bottom: 0.2rem;">+</span>
				  	<span>上传身份证正面</span>
				  </div>
				  <div class="imgBox" v-else>
					<img :src="ruleForm.idCard"><van-icon name="cross" @click='delImg(2)'/>
				  </div>
				  <div class="upBox" v-if="!ruleForm.idCardReverse">
						<van-uploader :after-read="afterRead3" class="upLoader"/>
				    <!-- <input type="file" @change="upImg($event,3)"/> -->
				  	<span style="font-size: 0.9rem; margin-bottom: 0.2rem;">+</span>
				  	<span>上传身份证正面</span>
				  </div>
				  <div class="imgBox" v-else>
				  	<img :src="ruleForm.idCardReverse"><van-icon name="cross" @click='delImg(3)'/>
				  </div>
			  </div>
			</div>
			<div class="uploadImg">
			  <p class="title">企业资质证明:</p>
			  <div>
				  <div class="upBox" v-if="!ruleForm.qualification">
						<van-uploader :after-read="afterRead4" class="upLoader"/>
				    <!-- <input type="file" @change="upImg($event,4)"/> -->
				  	<span style="font-size: 0.9rem; margin-bottom: 0.2rem;">+</span>
				  	<span>上传企业资质证明复印件</span>
				  </div>
				  <div class="imgBox" v-else>
					 <img :src="ruleForm.qualification"><van-icon name="cross" @click='delImg(4)'/>
				  </div>
			  </div>
			</div>
			<div class="uploadImg">
			  <p class="title">企业简介:</p>
			  <div>
				<textarea v-model="ruleForm.ddd" placeholder="多行输入"></textarea>
			  </div>
			</div>
		</div>
		<p class="agree" @click="agree=!agree">
			<i class="iconfont" :class="{'iconfangkuang':!agree,'iconxuanzhong':agree}"></i> 我已阅读并同意
			<span @click.stop="centerDialogVisible=true">《中创海洋用户免责声明》</span>
		</p>
		<p @click="submit" class="subBtn">
			确认提交
		</p>
		<van-popup v-model="showCrop" :style="{ height: '100%',width:'100%' }">
		    <image-clipper :img="srcUrl"
		                   @clip="clip"
		                   @cancel="cancel"
		                   clipper-img-width="550"
		                   clipper-img-height="550"
		                   v-if="showCrop">

		    </image-clipper>
		</van-popup>
  </div>

</template>

<script>
	import { Toast } from 'vant';
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
        // type:'',
				showCrop:false,
			  idShow:false,
			  checkNm:'',
			  idList:[],
			  agree:false,
			  centerDialogVisible:false,//免责声明是否显示
			  cont:'',
			  ruleForm:{
					logo:'',//logo
					imgUrl:'',//图片
					memId:'', //申请人ID(机构主账号会员id,userInfo.subId)
					identityCd:'',//入驻身份
					type:"1",//身份属性
			    company:'',//公司名称
			    business:'',//业务
			    summery:'',//简介
			    addrCd:'',//所在地区cd(格式: 110000-110100-110101)
			    addrNm:'',//所在地区(格式: 北京-北京市-东城区)
			    address:'',//详细地址
			    linkMan:'',//联系人
			    mob:'',//联系手机
			    email:'',//电子邮箱
					cont:"",
			    businessLicense:'',//营业执照
					idCard:'',//法人身份证
			    idCardReverse:'',//身份证反面
					qualification:'',//资质证明
					intro:'',//企业详细介绍
					cases:'',// 案例
				},
      };
    },
		watch:{
			'ruleForm.identityCd':{
			  handler:function () {
					if(this.ruleForm.identityCd == 'identity100'){
						this.ruleForm.type = '3'
					}else{
						this.ruleForm.type = '1'
					}
			  },
			  immediate:true
			}
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
			this.ruleForm.identityCd = this.until.getQueryString('type')
			this.ruleForm.memId = JSON.parse(localStorage.getItem('userInfo')).subId
			console.log(this.ruleForm.identityCd)
			this.getList()
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
					window.location.href = window.location.origin+this.serverAddr+'/settleIn/settleIn?type='+this.ruleForm.identityCd
				}
			},
					async afterRead1(e){
					  console.log(e)
					   let imgUrl=await this.api.uploadImg2(e.file)
						 this.ruleForm.businessLicense = imgUrl
					},
					async afterRead2(e){
					  console.log(e)
					   let imgUrl=await this.api.uploadImg2(e.file)
						 this.ruleForm.idCard = imgUrl
					},
					async afterRead3(e){
					  console.log(e)
					   let imgUrl=await this.api.uploadImg2(e.file)
						 this.ruleForm.idCardReverse = imgUrl
					},
					async afterRead4(e){
					  console.log(e)
					   let imgUrl=await this.api.uploadImg2(e.file)
						 this.ruleForm.qualification = imgUrl
					},
					getCont(){ //声明
					  this.api.ruleDetail('5028235019260928').then(res=>{
							console.log('声明')
							console.log(res)
					    this.cont = res.data.cont
							console.log(this.cont)
					  })
					},
			submit(){
				this.ruleForm.audit = 1  //状态参数1待审核
				console.log(this.ruleForm)
				if(!this.agree){
					Toast('请阅读并同意《中创海洋用户免责声明》')
					return
				}
				if(!this.ruleForm.company){
					Toast.fail('请输入公司名称');
					return
				}
				if(!this.ruleForm.address){
					Toast.fail('请输入详细地址');
					return
				}
				if(!this.ruleForm.linkMan){
					Toast.fail('请输入联系人');
					return
				}
				if(this.reg.checkPhone(this.ruleForm.mob)!='ok'){
					Toast.fail(this.reg.checkPhone(this.ruleForm.mob));
					return
				}
				if(!this.ruleForm.businessLicense&&this.ruleForm.identityCd!='identity100'){
					Toast.fail('请上传营业执照');
					return
				}
				if(!this.ruleForm.idCard&&this.ruleForm.identityCd!='identity100'){
					Toast.fail('请上传法人身份证正面');
					return
				}
				if(!this.ruleForm.idCardReverse&&this.ruleForm.identityCd!='identity100'){
					Toast.fail('请上传法人身份证反面');
					return
				}
				this.api.settleInAdd(this.ruleForm).then(()=>{

					Toast.success('提交成功，等待审核')
					setTimeout(()=>{
						// this.toPage('./settleln.html')
						this.back()
					},1500)
				})
			},
			async getList(){
				console.log('获取身份列表')
				this.idList = await this.api.getRoleList()
				let val=this.idList.find(item=>item.cd==this.ruleForm.identityCd)
				console.log(val)
				this.checkNm=val.nm
			},
			//获取地区信息
			changeAddr(info){
				console.log('父组件获取地区')
				console.log(info)
				let data = JSON.parse(info)
				this.ruleForm.addrNm = data.province+'-'+data.city+'-'+data.region
				this.ruleForm.addrCd = data.provinceId+'-'+data.cityId+'-'+data.regionId
			},
			//上传图片
			async upImg(imgType) {
			  console.log(e)
			  // this.store.commit('changeLoading',true)
			  let imgUrl = await this.api.uploadImg2(e.file)
			  if(imgType==1){
			    this.ruleForm.businessLicense = imgUrl
			  }
			  if(imgType==2){
			    this.ruleForm.idCard = imgUrl
			  }
			  if(imgType==3){
			    this.ruleForm.idCardReverse = imgUrl
			    // console.log(this.ruleForm.idCardReverse)
			    // this.$set(this.ruleForm,'idCardReverse',imgUrl)
			  }
			  if(imgType==4){
			    this.ruleForm.qualification = imgUrl
			  }
			},
			// 删除照片
			delImg(imgType){
				if(imgType==1){
				  this.ruleForm.businessLicense = ''
				}
				if(imgType==2){
				  this.ruleForm.idCard = ''
				}
				if(imgType==3){
				  this.ruleForm.idCardReverse = ''
				  // this.$set(this.ruleForm,'idCardReverse','')
				}
				if(imgType==4){
				  this.ruleForm.qualification = ''
				}
			},
			onConfirm(value, index){
				this.checkNm=value.nm
				this.ruleForm.identityCd=value.cd
				this.idShow=false
			},
			onCancel(){
				this.idShow=false
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
	.fixTopC{
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
	.radioBox{
		i{
			font-size: 0.28rem;
		}
		span{
			font-size: 0.24rem;
			color: #343434;
		}
	}
</style>
<style lang="less" scoped>

  .app{
    // width: 100%;
    height: 100%;
		background-color: #F1F3F2;
		padding: 0 0.2rem;
    // display: flex;
    // display: -webkit-flex;
    // flex-direction: column;
    // background-size: 100%;
    // background-repeat: no-repeat;
    // background-position: center top;
		.contBox{
			height: 50%;
			padding: 0.2rem;
			box-sizing: border-box;
		}
		.whiteBox{
			margin-bottom: 0.2rem;
			border-radius: 0.12rem;
			background-color: #ffffff;
			padding:0.4rem 0.5rem 0.4rem 0.23rem;
			.stepTitle{
				display: flex;
				align-items: center;
				padding-left: 0.03rem;
				margin-bottom: 0.41rem;
				.lineC{
					width: 0.05rem;
					height: 0.29rem;
					background-color: @themeColor;

					margin-right: 0.18rem;
				}
				.nameS{
					font-size: 0.28rem;
					color: #343434;
				}
			}
			.entryBox{
				display: flex;
				align-items: center;
				margin-bottom: 0.43rem;
				.title{
					position: relative;
					margin-left: 0.27rem;
					font-size: 0.24rem;
					color: #343434;
					width: 1.5rem;
					>b{
						position: absolute;
						left: -0.27rem;
						color: #FF2115;
					}
					.rmksS{
						font-size: 0.22rem;
						color: #FF2016;
					}
				}
				.checkIdBox{
					display: flex;
					align-items: center;
					border: 0.01rem solid #DDDDDD;
					height: 0.6rem;
					padding-left: 0.21rem;
					>p{
						flex: 1;
					}
					>i{
						margin-right: 0.31rem;
					}
				}
				>div,>input{
					flex: 1;
				}
				>input{
					padding-left: 0.21rem;
					border: 1px solid #DDDDDD;
					height: 0.6rem;
					font-size: 0.22rem;
					color: #343434;
				}
			}
			.uploadImg{
				display: flex;
				.title{
					margin-left: 0.27rem;
					font-size: 0.24rem;
					color: #343434;
					width: 1.92rem;
					white-space: nowrap;
				}
				>div{
					display: flex;
					flex-direction: column;
					>div{
						width: 2.95rem;
						height: 1.56rem;
						position: relative;
						margin-bottom: 0.3rem;
					}
					.upBox{
						border: 0.01rem dashed #d3d3d3;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.upLoader{
							position: absolute;
							top: 0;
							left: 0;
							opacity: 0;
							height: 100%;
							width: 100%;
						}
						>input{
							position: absolute;
							top: 0;
							left: 0;
							opacity: 0;
							height: 100%;
							width: 100%;
						}
						>span{
							color: #666666;
							font-size: 0.22rem;
						}
					}
					.imgBox{
						>img{
							width: 100%;
							height: 100%;
						}
						>i{
							position: absolute;
							top: -0.1rem;
							right: -0.1rem;
						}
					}
					>textarea{
						width: 2.55rem;
						height: 1.3rem;
						resize:none;
						border: 1px solid #DDDDDD;
						font-size: 0.22rem;
						padding: 0.13rem 0.2rem;
					}
				}

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
		.subBtn{
			width: 80.2%;
			height: 0.7rem;
			color: #ffffff;
			background-color: @themeColor;
			border-radius: 0.03rem;
		    text-align: center;
		    line-height: 0.7rem;
			margin: 0.63rem auto 0.7rem;
		}

    }

</style>
<style>

</style>
