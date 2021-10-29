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
		<div v-if="audit==3" class="tip-box">
			<div @click="audit=2" class="tip-btn">修改</div>
			<div @click="audit=1" class="tip-btn" style="color: #D5D5D5;border-color: #D5D5D5;">删除</div>
		</div>
		<div class="info-box" v-if="audit!=1">
			<div class="classTitle">
				<img :src="tradingL">
				<p>填写增票资质信息</p>
				<img :src="tradingR">
			</div>
			<div class="input-tips" v-if="audit==2">（所有信息均为必填）</div>
		</div>
		<b-button2 v-if="audit==2||audit2==2" left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
    </div>
</template>

<script>
	import bButton2 from "../bButton2";
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
    export default {
        name: "billQua",
        props:{
            
        },
		components:{
			bButton2
		},
        data(){
          return{
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
			  checked: false,
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
			  this.audit = 1
			},
			rightClick() {
			  this.audit = 3
			}
        },
		created() {
			this.currentRole = JSON.parse(this.until.loGet('currentRole'))
			this.api.getAdert('billAdApp').then(res => {
				this.imgTip = res[1].imgUrl
			})
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
				img{
					width: 1.2rem;
				}
				p {
					margin: 0 0.3rem;
				}
			}
			.input-tips {
				font-size: 0.24rem;
				color: #E4393C;
				margin: 0.2rem auto;
				text-align: center;
			}
		}
	}
</style>