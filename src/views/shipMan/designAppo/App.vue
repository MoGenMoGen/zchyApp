<template>
    <div class="app">
		<van-popup v-model="pickerShow" position="bottom">
			<van-picker
			  show-toolbar
			  :columns="pickerList"
			  value-key="nm"
			  @confirm="onConfirm"
			  @cancel="pickerShow=false"
			  :default-index="index"
			/>
		</van-popup>
		<van-nav-bar fixed title="船舶设计预约" :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		</van-nav-bar>
        <div class="main">
			<!-- 船舶基本参数 -->
			<div class="whiteBox">
				<div class="classTitle">
					<img :src="tradingL">
					<p>船舶基本参数</p>
					<img :src="tradingR">
				</div>
				<div class="paramBox">
					<div>
						<span>船舶户籍 :</span><input type="text" placeholder="船籍" v-model="form.registry">
					</div>
					<div>
						<b>*</b><span>船舶类型 :</span>
						<p @click="pickerCh('class')" class="checkBox" :style="classNm?'color:#303030':'color: #9A9A9A'">
							{{classNm?classNm:'请选择船舶类型'}}<van-icon name="arrow-down" /></i>
						</p>
					</div>
					<div>
						<span>船舶航区 :</span>
						<p @click="pickerCh('area')" class="checkBox" :style="areaNm?'color:#303030':'color: #9A9A9A'">
							{{areaNm?areaNm:'请选择航区'}}<van-icon name="arrow-down" /></i>
						</p>
					</div>
					<div>
						<b>*</b><span>船舶材质 :</span>
						<p @click="pickerCh('mater')" class="checkBox" :style="materNm?'color:#303030':'color: #9A9A9A'">
							{{materNm?materNm:'请选择材质'}}<van-icon name="arrow-down" /></i>
						</p>
					</div>
					<div>
						<b>*</b><span>船舶总长 :</span>
						<input type="number" placeholder="船舶总长(M)" v-model="form.totalLen">
						<!-- <p @click="pickerCh('length')" class="checkBox" :style="lengthNm?'color:#303030':'color: #9A9A9A'">
							{{lengthNm?lengthNm:'船舶总长(M)'}}<van-icon name="arrow-down" /></i>
						</p> -->
					</div>
					<div>
						<span>公约船长 :</span><input type="number" placeholder="公约总长(M)" v-model="form.pactLen">
					</div>
					<div>
						<span>船舶型宽 :</span><input type="number" placeholder="船舶型宽(M)" v-model="form.width">
					</div>
					<div>
						<span>船舶型深 :</span><input type="number" placeholder="船舶型深(M)" v-model="form.deep">
					</div>
					<div>
						<span>船舶总吨位 :</span><input type="number" placeholder="船舶总吨位" v-model="form.tonnage">
					</div>
					<div>
						<span>船舶航速 :</span><input type="number" placeholder="船舶航速(KN)" v-model="form.speed">
					</div>
					<div>
						<span>船舶定员 :</span><input type="text" placeholder="船舶定员(P)" v-model="form.complement">
					</div>
				</div>
			</div>
			
			<!-- 船舶设备参数 -->
			<div class="whiteBox">
				<div class="classTitle">
					<img :src="tradingL">
					<p>船舶设备参数</p>
					<img :src="tradingR">
				</div>
				<div class="paramBox">
					<div>
						<span>主机品牌 :</span>
						<input type="text" v-model="form.hostBrand" placeholder="主机品牌">
						<!-- <p @click="pickerCh('host')" class="checkBox" :style="hostNm?'color:#303030':'color: #9A9A9A'">
							{{hostNm?hostNm:'主机品牌'}}<van-icon name="arrow-down" /></i>
						</p> -->
					</div>
					<div>
						<span>齿轮箱品牌 :</span>
						<input v-model="form.gearBrand" type="text" placeholder="齿轮箱品牌">
						<!-- <p @click="pickerCh('refriger')" class="checkBox" :style="refrigerNm?'color:#303030':'color: #9A9A9A'">
							{{refrigerNm?refrigerNm:'制冷机品牌'}}<van-icon name="arrow-down" /></i>
						</p> -->
					</div>
					<div>
						<span>发电机品牌 :</span>
						<input type="text" v-model="form.electricGeneratorBrand" placeholder="发电机组品牌">
						<!-- <p @click="pickerCh('electric')" class="checkBox" :style="electricNm?'color:#303030':'color: #9A9A9A'">
							{{electricNm?electricNm:'发电机品牌'}}<van-icon name="arrow-down" /></i>
						</p> -->
					</div>
					<div>
						<span>主机功率 :</span>
						<p @click="pickerCh('hostP')" class="checkBox" :style="hostPNm?'color:#303030':'color: #9A9A9A'">
							{{hostPNm?hostPNm:'主机功率(KW)'}}<van-icon name="arrow-down" /></i>
						</p>
					</div>
					<div>
						<span>齿轮箱型号 :</span>
						<input v-model="form.gearModel" type="text" placeholder="齿轮箱型号">
						<!-- <p @click="pickerCh('refrigerP')" class="checkBox" :style="refrigerPNm?'color:#303030':'color: #9A9A9A'">
							{{refrigerPNm?refrigerPNm:'制冷机组功率(kW)'}}<van-icon name="arrow-down" /></i>
						</p> -->
					</div>
					<div>
						<span>发动机功率 :</span>
						<p @click="pickerCh('electricP')" class="checkBox" :style="electricPNm?'color:#303030':'color: #9A9A9A'">
							{{electricPNm?electricPNm:'发动机功率(KW)'}}<van-icon name="arrow-down" /></i>
						</p>
					</div>
					
				</div>
			</div>
		</div>
		<div class="btnList">
			<button class="resetB" @click="back">取消</button>
			<button class="confirmB" @click="toSubmit">确定</button>
		</div>
  </div>
	
</template>

<script>
	import { Toast } from 'vant';
  import bg from '@/assets/img/bg.png'
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";
  export default {
    data() {
      return {
        bg,
				tradingL,
				tradingR,
				pickerShow:false,
				pickerList:[],
				classList:[],		//船舶类型
				areaList:[],		//船舶航区
				materList:[],		//船舶材质
				hostPList:[],         //主机功率
				electricPList:[],     //发电机功率
				classNm:"",
				areaNm:"",
				materNm:"",
				hostPNm:"",
				electricPNm:"",
				form:{
					registry: "",//船舶户籍
					typesCd: "",//船舶类型
					sailingAreaCd: "",//船舶航区
					hullMaterialCd: "",//船舶材质
					lengthCd: "",//船舶长度
					totalLen: "",//船舶总长
					pactLen: "",//公约船长
					width: "",//船舶型宽
					deep: "",//船舶型深
					tonnage: "",//船舶总吨位
					speed: "",//船舶航速
					complement: "",//定员
					hostBrand: "",//主机品牌
					hostPower: "",//主机功率
					gearBrand: "",//齿轮箱品牌
					gearModel: "",//齿轮箱型号
					electricGeneratorBrand: "",//发动机品牌
					electricGeneratorPower: "",//发动机功率
					rmks:"",
				},
				index:0,
			};
    },
    components:{
    }, 
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
		watch:{
		},
    created(){
    },
    mounted() {
			this.getList()
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/shipDesign'
				}
			},
			toSubmit(){
				console.log(this.form)
				if(!this.form.typesCd){
					Toast.fail('请选择船舶类型');
					return
				}
				if(!this.form.hullMaterialCd){
					Toast.fail('请选择船舶材质');
					return
				}
				if(!this.form.totalLen){
					Toast.fail('请输入船舶总长');
					return
				}
				this.api.designAdd(this.form)
			},
			onConfirm(value){
				if(value){
					if(value.type=='class'){
						this.classNm=value.nm
						this.form.typesCd=value.cd
					}else if(value.type=='area'){
						this.areaNm=value.nm
						this.form.sailingAreaCd=value.cd
					}else if(value.type=='mater'){
						this.materNm=value.nm
						this.form.hullMaterialCd=value.cd
					}else if(value.type=='hostP'){
						this.hostPNm=value.nm
						this.form.hostPower=value.cd
					}else if(value.type=='electricP'){
						this.electricPNm=value.nm
						this.form.electricGeneratorPower=value.cd
					}
				}
				this.pickerShow=false
			},
			pickerCh(type){
				let index=0
				if(type=='class'){
					this.pickerList=this.classList
					if(this.classNm){
						index=this.classList.findIndex(item=>item.nm==this.classNm)
					}
				}else if(type=='area'){
					this.pickerList=this.areaList
					if(this.areaNm){
						index=this.areaList.findIndex(item=>item.nm==this.areaNm)
					}
				}else if(type=='mater'){
					this.pickerList=this.materList
					if(this.materNm){
						index=this.materList.findIndex(item=>item.nm==this.materNm)
					}
				}else if(type=='hostP'){
					this.pickerList=this.hostPList
					if(this.hostPNm){
						index=this.hostPList.findIndex(item=>item.nm==this.hostPNm)
					}
				}else if(type=='electricP'){
					this.pickerList=this.electricPList
					if(this.electricPNm){
						index=this.electricPList.findIndex(item=>item.nm==this.electricPNm)
					}
				}
				this.index=index
				this.pickerShow=true
			},
			async getList(){
				let classList=await this.api.dataDictionary('SHIP_TYPES')	//船舶类型
				classList.forEach(item=>{
					item.type='class'
					this.classList.push(item)
				})
				let areaList=await this.api.dataDictionary('SAILING_AREA')	//船舶航区
				areaList.forEach(item=>{
					item.type='area'
					this.areaList.push(item)
				})
				let materList=await this.api.dataDictionary('HULL_MATERIAL')//船舶材质
				materList.forEach(item=>{
					item.type='mater'
					this.materList.push(item)
				})
				let hostPList=await this.api.dataDictionary('HOST_POWER')	//主机功率
				hostPList.forEach(item=>{
					item.type='hostP'
					this.hostPList.push(item)
				})
				let electricPList=await this.api.dataDictionary('ELECTRIC_POWER')//发动机功率
				electricPList.forEach(item=>{
					item.type='electricP'
					this.electricPList.push(item)
				})
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
	.homeLunBo  {
		border-radius: 0.15rem !important;
		margin-bottom: 0.2rem;
		.van-swipe-item{
			>img{
			border-radius: 0.15rem;
		    height: 100%;
		    min-height: 100%;
			}
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
		    padding: 0 0.2rem;
			margin-top: 1.2rem;
			.whiteBox{
				margin-bottom: 0.2rem;
				border-radius: 0.1rem;
				background-color: #ffffff;
				.classTitle{
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0.38rem 0 0.28rem;
					>img{
						width: 1.2rem;
					}
					>p{
						margin: 0 0.3rem;
						font-size: 0.3rem;
						color: #303030;
					}
				}
				.paramBox{
					padding-bottom: 0.1rem;
					>div{
						display: flex;
						align-items: center;
						height: 0.6rem;
						margin-bottom: 0.3rem;
						padding-right: 0.5rem;
						position: relative;
						>b{
							position: absolute;
							left: 0.22rem;
							color: #FF2115;
						}
						>span{
							width: 1.7rem;
							font-size: 0.26rem;
							color: #343434;
							margin-left: 0.5rem;
						}
						>input,.checkBox{
							height: 0.6rem;
							flex: 1;
							border: 0.01rem solid #dedede;
							color: #303030;
							padding: 0 0.24rem;
							font-size: 0.26rem;
						}
						>input::-webkit-input-placeholder {
						    color: #9A9A9A;
						}
						
						>input::-moz-placeholder {
						    /* Mozilla Firefox 19+ */
						    color: #9A9A9A;
						}
						
						>input:-moz-placeholder {
						    /* Mozilla Firefox 4 to 18 */
						    color: #9A9A9A;
						}
						>input:-ms-input-placeholder {
						    /* Internet Explorer 10-11 */
						    color: #9A9A9A;
						}
						.checkBox{
							display: flex;
							align-items: center;
							
							>i{
								margin-left: auto;
							}
						}
					}
				}
			}
			.priceBox{
				margin-bottom: 0.2rem;
				border-radius: 0.1rem;
				background-color: #ffffff;
				display: flex;
				align-items: center;
				padding: 0.47rem 0 0.39rem;
				>span{
					width: 1.7rem;
					font-size: 0.26rem;
					color: #343434;
					margin-left: 0.5rem;
				}
				>p{
					color: #FF2016;
					font-weight: 600;
					font-size: 0.36rem;
				}
			}
		}
		.btnList{
			width: 100%;
			height: 0.9rem;
			display: flex;
			>button{
				box-sizing: border-box;
				flex: 1;
				height: 0.9rem;
				line-height: 0.9rem;
				text-align: center;
				font-size: 0.3rem;
			}
			.resetB{
				color: #666666;
			}
			.confirmB{
				color: #ffffff;
				background-color: @themeColor;
			}
		}
    }

</style>