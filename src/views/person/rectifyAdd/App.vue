<template>
<!--	资金管理-付款记录-->
    <div id="container">
        <pen-header title="新增整改单"></pen-header>
		<div class="containerBody" v-if="showNext==false">
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						整改名称：
					</div>
				</div>
				<div class="right">
					<van-field v-model="value1"  placeholder="请输入整改名称"  style="font-size: 0.22rem;"/>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						整改单位：
					</div>
				</div>
				<div class="right">
					<van-field
					  readonly
					  clickable
					  :value="value2"
					  placeholder="选择整改单位"
					  @click="showPicker = true"
					  style="font-size: 0.22rem;"
					/>
					<van-popup v-model="showPicker" round position="bottom">
					  <van-picker
					    show-toolbar
						value-key="company"
					    :columns="options"
					    @cancel="showPicker = false"
					    @confirm="onConfirm1"
					  />
					</van-popup>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						检查区域：
					</div>
				</div>
				<div class="right">
					<van-field v-model="value3"  placeholder="请输入检查区域"  style="font-size: 0.22rem;"/>
				</div>
			</div>
			<div class="bodyList" style="display: flex; align-items: flex-start;">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						隐患说明：
					</div>
				</div>
				<div class="right">
					<textarea rows="" cols="" placeholder="请输入主要事项内容详情" v-model="value4"></textarea>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						责任整改人：
					</div>
				</div>
				<div class="right">
					<van-field
					  readonly
					  clickable
					  :value="value5"
					  placeholder="选择责任整改人"
					  @click="showPicker2 = true"
					  style="font-size: 0.22rem;"
					/>
					<van-popup v-model="showPicker2" round position="bottom">
					  <van-picker
					    show-toolbar
						value-key="realNm"
					    :columns="optionsTwo"
					    @cancel="showPicker2 = false"
					    @confirm="onConfirm2"
					  />
					</van-popup>
				</div>
			</div>
			<div class="bodyList" style="display: flex; align-items: flex-start;">
				<div class="left">
					<span style="color:#FF2015;opacity: 0;">*</span>
					<div class="name">
						整改要求：
					</div>
				</div>
				<div class="right">
					<textarea rows="" cols="" placeholder="请按照要求进行整改" v-model="value6"></textarea>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						整改期限：
					</div>
				</div>
				<div class="right">
					<van-field
					  readonly
					  clickable
					  :value="value7"
					  placeholder="选择整改期限"
					  @click="showPickerTwo = true"
					  style="font-size: 0.22rem;"
					   right-icon="clock-o"
					/>
					<van-popup v-model="showPickerTwo" round position="bottom">
				<van-datetime-picker
				  v-model="currentDate"
				  type="date"
				  title="选择年月日"
				   @cancel="showPickerTwo = false"
				   @confirm="onConfirm3"
				/>
					</van-popup>
				</div>
			</div>
			<div class="imgUpload">
					<div class="top">
						隐患图片<span>(上传完图片后，可以点击图片进行编辑)</span>
					</div>
					<div class="imgBox">
						<van-uploader :after-read="afterRead" v-model="imgList" :before-delete="deleteImg"/>
					</div>
			</div>
		
		</div>
		<div class="bottomBtn" v-if="showNext==false">
			<div class="leftBtn" @click="cancel">
				取消
			</div>
			<div class="rightBtn" @click="nextStep">
				下一步
			</div>
		</div>
		<div class="containerBody" v-if="showNext==true">
			<div class="bodyTitle">
				<img :src="tradingL">
				<p>安全隐患通知整改单</p>
				<img :src="tradingR">
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						整改单号：
					</div>
					<div class="listRight">
						{{Numbers}}
					</div>
				</div>
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						整改名称：
					</div>
					<div class="listRight">
					   {{value1}}
					</div>
				</div>
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						整改单位：
					</div>
					<div class="listRight">
					   {{value2}}
					</div>
				</div>
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						隐患说明：
					</div>
					<div class="listRight">
					   {{value4}}
					</div>
				</div>
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						整改要求：
					</div>
					<div class="listRight">
					   {{value6}}
					</div>
				</div>
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						整改负责人：
					</div>
					<div class="listRight">
					   {{value5}}
					</div>
				</div>
			</div>
			<div class="bodyContent">
				<div class="contentList" style="display: flex; flex-direction: column;">
					<div class="listLeft" style="width: 2rem;">
						整改负责人签字：
					</div>
					<div class="listRight"style="margin: 0 auto;">
						<signature ref='s1' v-show="!sign"/>
						<img :src="sign" class="signImg" v-if="sign" style="border: 0.01rem solid #cccccc; box-sizing: border-box;">
						<p class="signBtn"> <span @click="clear">重签</span> <span style="margin-left: 0.3rem" @click="confirm">确定</span></p>
					</div>
					</div>
			</div>
			<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						复查日期：
					</div>
					<div class="listRight">
					   <van-field
					   	  readonly
					   	  clickable
					   	  :value="value8"
					   	  placeholder="选择复查日期"
					   	  @click="showPickerThree = true"
					   	  style="font-size: 0.22rem;"
					   	/>
					   	<van-popup v-model="showPickerThree" round position="bottom">
					   <van-datetime-picker
					     v-model="currentDate2"
					     type="date"
					     title="选择年月日"
					      @cancel="showPickerThree = false"
						   @confirm="onConfirm4"
					   />
					   	</van-popup>
					</div>
				</div>
			</div>
		<!-- 	<div class="bodyContent">
				<div class="contentList">
					<div class="listLeft">
						复查情况：
					</div>
					<div class="listRight">
						<textarea rows="" cols="" placeholder="请输入复查情况" v-model="value9"></textarea>
					</div>
				</div>
			</div> -->
			<div class="bodyContent">
				<div class="contentList" style="display: flex; flex-direction: column;">
					<div class="listLeft">
						复查人签字：
					</div>
					<div class="listRight" style="margin: 0 auto;" >
						<signature ref='s2' v-show="!sign2"/>
						<img :src="sign2" class="signImg" v-if="sign2" style="border: 0.01rem solid #cccccc; box-sizing: border-box;">
						<p class="signBtn"> <span @click="clear2">重签</span> <span style="margin-left: 0.3rem" @click="confirm2">确定</span></p>
					</div>
					</div>
			</div>
			<div class="bodyContent">
				<div class="contentList" style="display: flex;flex-direction: column; border-bottom:0 ;">
					<div class="listLeft">
						隐患图片:
					</div>
					<div class="listRightImg" >
						<img :src="item" v-for="(item,index) in imgListUpd" :key="index" @click="preview(index)">
					</div>
					</div>
			</div>
			
		</div>
		<div class="bottomBtn" v-if="showNext==true">
			<div class="leftBtn" @click="lastStep">
				上一步
			</div>
			<div class="rightBtn" @click="confirmTo">
			     确认
			</div>
		</div>

    </div>
</template>

<script>
	import { ImagePreview } from 'vant';
    import signature from "../../../components/personal/signature";
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import searchView from "../../../components/personal/searchView";
    import calRange from "../../../components/personal/calRange";
    import {Toast} from 'vant'
	import {mixins} from "../mixins/mixins"
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
				sign:'',
				sign2:'',
				Numbers:'',
				tradingL,
				tradingR,
				imgListUpd:[],
				imgList:[],
				currentDate:'',
				currentDate2:'',
				value1:'',//整改名称
				value2:'',//整改单位
				value3:'',//检查区域
				value4:'',//隐患说明
				value5:'',//责任整改人
				value6:'',//整改要求
				value7:'',//整改期限
				value8:'',//复查日期
				value9:'',//复查情况
				orgEnterId:'',//整改单位id
				rectifyer:'',//整改负责人id
				currentRoleId:'',
				showPicker:false,
				showPicker2:false,
				showPickerTwo:false,
				showPickerThree:false,
				options:[],
				optionsTwo:[],
				optionsThree:[],
				columns:[
					
				],
				showNext:false
            };
        },
        components:{
			signature,
            penHeader,
            bButton,
            searchView,
            calRange
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        
        filters:{
            numFilter(value) {
                const realVal = parseFloat(value).toFixed(2);
                return realVal;
            },
        },
		async mounted() {
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
			this.api.getDocsRectifyCd().then(res=>{
			   this.Numbers=res.data
			})
			//获取整改单位列表
			this.currentRoleId = JSON.parse(this.until.loGet('currentRole')).id
			let qry1 = this.query.new()
			let qry3 = this.query.new()
			this.query.toW(qry1, 'identityCd', 'identity30', 'EQ')
			this.query.toW(qry1, 'audit', '2', 'EQ')
			this.query.toW(qry3, 'identityCd', 'identity50', 'EQ')
			this.query.toW(qry3, 'audit', '2', 'EQ')
			this.api.getRecitifyList(this.query.toEncode(qry1)).then(res => {
			  this.options = res.data.list
			})
			this.api.getRecitifyList(this.query.toEncode(qry3)).then(res => {
			  this.optionsThree = res.data.list
			})
			this.currentDate=new Date(new Date().getTime())
		},
		methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/personal/record'
				}
			},
            toService(){
                this.api.getKefuPhone().then(list=>{
                    let phone=list[0].cont
                    window.console.log("客服电话："+phone);
                    this.$bridge.callHandler('h5_call',phone,res=>{
                        console.log("原生调用返回")
                        console.log(res)
                    })
                })


            },
            toPage(item){
                if(this.currentRole.identityCd=='identity20'){ //设计院-跳转选型报价页面
                    this.until.href('../shipDesign/seleDtl.html?id='+item.id+'&type=detail')
                }else {
                    this.until.href('./recordDtl.html?id='+item.id)
                }

            },
			afterRead(file){
				if(file instanceof Array &&file.length){
					file.forEach(item=>{
						let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
						　　formData.append('file', item.file); //接口需要传的参数
						this.api.uploadImg3(formData).then(res=>{
							　　	console.log(res,111111);
								this.imgListUpd.push(res)
								console.log(this.imgList);
						})
					})
				}
				else{
					let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
					　　formData.append('file', file.file); //接口需要传的参数
					this.api.uploadImg3(formData).then(res=>{
						　　	console.log(res,111111);
							this.imgListUpd.push(res)
							console.log(this.imgListUpd);
							})
				}
				
				　　
			},
			deleteImg(file,detail){
				this.imgListUpd.splice(detail.index,1)
				this.imgList.splice(detail.index,1)
				console.log(this.imgListUpd);
				},
			cancel(){
				this.until.back()
			},
			nextStep(){
				if(!this.value1){
					Toast('整改名称不能为空')
					return false
				}
				if(!this.value2){
					Toast('整改单位不能为空')
					return false
				}
				if(!this.value3){
					Toast('检查区域不能为空')
					return false
				}
				if(!this.value4){
					Toast('隐患说明不能为空')
					return false
				}
				if(!this.value5){
					Toast('责任整改人不能为空')
					return false
				}
				if(!this.value7){
					Toast('整改期限不能为空')
					return false
				}
				this.showNext=true
				
			},
			lastStep(){
				this.showNext=false
			},
			confirmTo(){
				if(!this.sign){
					Toast('整改责任人未签字')
					return false
				}
				if(!this.value8){
					Toast('复查日期不能为空')
					return false
				}
				if(!this.sign2){
					Toast('复查人未签字')
					return false
				}
				console.log(this.imgListUpd);
				let obj={
					docsId:0,
					cd:this.Numbers,
					nm:this.value1,
					orgEnterId:this.orgEnterId,
					inspArea:this.value3,
					rectifyer:this.rectifyer,
					explains:this.value4,
					rectifyDemand:this.value6,
					troubleImg:this.imgListUpd.join(','),
					rectifyerSign:this.sign,
					rectifyTmLimit:this.value7,
					reviewerTm:this.value8,
					reviewerSign:this.sign2,
					rmks:'',
				}
				this.api.postDocsRectifyAdd(obj).then(res=>{
						this.until.back()
				})
			},
			clear(){
				this.$refs.s1.clear()
				this.sign = ''
			},
			async  confirm(){
			     let temp= this.$refs.s1.getSignature()
			     let file =  this.until.base64toFile(temp,"sign.png")
			     let res=await  this.api.uploadImg2(file)
			    this.sign=res
			 },
			 clear2(){
			 	this.$refs.s2.clear()
			 	this.sign2 = ''
			 },
			 async  confirm2(){
			      let temp= this.$refs.s2.getSignature()
			      let file =  this.until.base64toFile(temp,"sign.png")
			      let res=await  this.api.uploadImg2(file)
			     this.sign2=res
			  },
			 onConfirm1(val){
				 this.orgEnterId=val.id
				 this.value2=val.company
				 let query=this.query.new()
				 this.query.toW(query,'orgEnterId',this.orgEnterId,"EQ")
				 this.api.getMemberOrgEnterLink(this.query.toEncode(query)).then(res=>{
					 this.optionsTwo = res.data.list
					 this.showPicker=false
				 })
			 },
			onConfirm2(val){
				this.value5=val.realNm
				this.rectifyer=val.id
				this.showPicker2=false
			},
			onConfirm3(val){
				this.value7=this.formatTime(val)
				this.showPickerTwo=false
				this.value8=this.formatTimeTwo(val)
				console.log(this.value7);
			},
			onConfirm4(val){
				this.value8=this.formatTime(val)
				this.showPickerThree=false	
			},
			formatTime(date) {
			  let myDate = new Date(date)
			  let year = myDate.getFullYear();
			  let month = myDate.getMonth() + 1;
			  let day = myDate.getDate();
			  let hour = myDate.getHours();
			  let minute = myDate.getMinutes();
			  let second = myDate.getSeconds();
			  return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) 
			},
			formatTimeTwo(date) {
			  let myDate = new Date(new Date(date).getTime() + 2 * 24 * 60 * 60 * 1000)
			  let year = myDate.getFullYear();
			  let month = myDate.getMonth() + 1;
			  let day = myDate.getDate();
			  let hour = myDate.getHours();
			  let minute = myDate.getMinutes();
			  let second = myDate.getSeconds();
			  return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) 
			},
			
			formatTen(num) {
			  return num > 9 ? (num + "") : ("0" + num);
			},
			preview(index){
				ImagePreview({
				  images: this.imgListUpd,
				  closeable: true,
				    startPosition: index,
				});
			}
			


        },

    };
</script>
<style lang="less" scoped>

 @import url("../../../assets/css/mobile.less");
	#container{
		.containerBody{
			background-color: #ffffff;
			width: 7.09rem;
			padding: 0.4rem 0.2rem;
			box-sizing: border-box;
			margin: 0.2rem auto;
			border-radius: 0.12rem;
			.bodyTitle{
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
			.bodyContent{
				padding: 0.3rem 0 0.3rem 0;
				box-sizing: border-box;
				.contentList{
					display: flex;
					padding-bottom: 0.2rem;
					box-sizing: border-box;
					border-bottom: 0.01rem solid #E5E5E5;
					.listLeft{
						width: 1.5rem;
						font-size: 0.24rem;
						font-weight: 500;
						color: #333333;
					}
					.listRight{
						font-size: 0.24rem;
						font-weight: 500;
						color: #333333;
						margin-left: 0.8rem;
						.van-cell{
							height: 0.2rem;
							display: flex;
							align-items: center;
							padding-left: 0;
							font-size: 0.24rem;
							width: 4rem;
						}
						.van-cell::after{
							border-bottom: 0;
						}
						.van-cell::placeholder{
							color: #999999;
						}
						textarea{
							width: 4rem;
							height: 2.12rem;
							box-sizing: border-box;
							font-size: 0.24rem;
						}
						textarea::placeholder{
							color: #999999;
						}
					}
					.listRightImg{
						display: flex;
						flex-wrap: wrap;
						img{
							margin-left: 0.2rem;
							width: 2rem;
							height: 2rem;
						}
					}
				}
			}
			.bodyList{
				display: flex;
				align-items: center;
				margin-bottom: 0.3rem;
				.left{
					display: flex;
					align-items: center;
					width: 1.8rem;
					.name{
						font-size: 0.24rem;
						font-weight: 500;
						color: #333333;
						margin-left: 0.1rem;
						width: 1.5rem;
					}
				}
				.right{
					margin-left:0.1rem ;
					font-weight: 500;
					color: #303030;
					.van-cell{
						width: 4.57rem;
						border: 0.01rem solid #DDDDDD;
					    height: 0.6rem;
						display: flex;
						 align-items: center;
					}
					.van-cell::after{
						border-bottom: 0;
					}
					.van-cell::placeholder{
						color: #999999;
					}
					textarea{
						width: 4.57rem;
						height: 2.12rem;
						border: 0.01rem solid #DDDDDD;
						padding: 0.2rem 0.32rem;
						box-sizing: border-box;
						font-size: 0.22rem;
					}
					textarea::placeholder{
						color: #999999;
					}
				}
			}
			.imgUpload{
				margin-left: 0.5rem;
				.top{
					font-size: 0.24rem;
					font-weight: 500;
					color: #333333;
					margin-bottom: 0.3rem;
					span{
						font-size: 0.24rem;
						font-weight: 500;
						color: #909090;
					}
				}
				.imgBox{
					
				}
			}
		}
		.bottomBtn{
			display: flex;
			margin-top: 1rem;
			width: 100%;
			.leftBtn{
				width: 50%;
				height: 1rem;
				text-align: center;
				background-color: #ffffff;
				line-height: 1rem;
				font-size: 0.28rem;
				color: #999999;
			}
			.rightBtn{
				width: 50%;
				height: 1rem;
				text-align: center;
				background-color: #2778BE;
				line-height: 1rem;
				font-size: 0.28rem;
				color: #ffffff;
			}
		}
	}



</style>
