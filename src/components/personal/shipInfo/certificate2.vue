<template>
	<!--   检验建议证书-->
	<div class="container">
		<van-overlay :show="show" @click="closeMask">
			<div class="wrapper" @click.stop>
				<div class="block">
					<p style="text-align: center;font-size: 0.3rem;margin-top: 0.2rem;">新增</p>

					<div class="list">
						<van-cell-group>
							<van-field v-model="nm" label="报告名称" placeholder="请输入报告名称" />
						</van-cell-group>
					</div>
					<div class="list">
						<van-field readonly clickable label="报告出具时间" :value="validUntil" placeholder="选择时间"
							@click="showPicker = true" />
						<van-popup v-model="showPicker" round position="bottom">
							<van-datetime-picker v-model="currentDate" type="date" title="选择时间" @confirm='confirmTime'
								@cancel='cancelTime' />
						</van-popup>
					</div>
					<div class="list" style="display: flex; margin: 0.3rem 0;">
						<div class="listTitle" style="margin-left: 0.3rem;
					width: 6.7em;">上传图片</div>
						<van-uploader v-model="imgList" :after-read="afterRead" :before-delete="deleteImg" />
					</div>
					<div class="list" style="display: flex; margin: 0.2rem 0;">
						<div class="listTitle" style="margin-left: 0.3rem;
					width: 6.7em;">上传文件</div>
						<van-uploader v-model="fileList" :after-read="afterReadFile" :before-delete="deleteFile">
							<div
								style="width:1.6rem; height:0.6rem; background-color:#2778be;text-align: center;line-height: 0.6rem;color: #ffffff;">
								选择文件
							</div>
						</van-uploader>
					</div>
					<div class="bottomBtn">
						<div class="leftBtn" @click="cancel">
							取消
						</div>
						<div class="rightBtn" @click="save">
							确定
						</div>
					</div>
				</div>
			</div>
		</van-overlay>
		<div class="topPage">
			<img :src="arrLeft" class="imgLeft" @click="lastPageNum">
			<img :src="arrRight" class="imgRight" @click="nextPageNum">
			<p>船舶证书</p>
		</div>
		<div class="bodyList">
			<div class="list" v-for="(item,index) in listOne" :key='index'>
				<div class="listTop" @click="item.show=!item.show">
					<p class="pOne">{{item.nm}}</p>
					<p style="margin-left:0.2rem ;">证件有效期：{{item.validUntil}}</p>
					<img :src="arrowDown" v-if="item.show" />
					<img :src="arrowUp" v-else />
				</div>
				<div class="listContainer" v-if="item.show">
					<div class="imgBox">
						<img  style="object-fit: cover;":src="item1" v-for="(item1,index1) in item.imgUrl" :key="index1" @click="viewImg(item.imgUrl,index1)">
					</div>
					<div class="fileBox">
						<div class="fileList" v-for="(item1,index1) in item.attachment" :key="index1"
							@click="toFile(item1.url)">
							<img :src="item1.img">
							<p style="word-break:break-word">{{item1.fileNm}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="topPage">
			<img :src="arrLeft" class="imgLeft" @click="lastPageNum2">
			<img :src="arrRight" class="imgRight" @click="nextPageNum2">
			<p>设备证书</p>
		</div>
		<div class="bodyList">
			<div class="list" v-for="(item,index) in listTwo" :key='index'>
				<div class="listTopTwo" @click="item.show=!item.show">
					<div class="top">
						<p class="pOne">{{item.nm}}</p>
						<p style="margin-left:0.2rem ;">证件有效期：{{item.validUntil}}</p>
						<img :src="arrowDown" v-if="item.show" />
						<img :src="arrowUp" v-else />
					</div>
					<div class="bottom" style="font-size: 0.22rem; color:#236CAB;" v-if="item.audit==2&&currentRole.identityCd=='identity50'">
						审核通过
					</div>
					<div class="bottom" style="font-size: 0.22rem; color: red;" v-if="item.audit==3&&currentRole.identityCd=='identity50'">
						审核未通过
					</div>
					<div class="bottom" style="font-size: 0.22rem; color: red;" v-if="item.audit==1&&currentRole.identityCd=='identity50'">
						未审核
					</div>

				</div>
				<div class="listContainer" v-if="item.show">
					<div class="topBtn">
						<div class="btnLeft" @click="toDelete(item)"
							v-if="item.audit != '2'&&currentRole.identityCd=='identity50'">
							删除
						</div>
						<div class="btnRight" @click="toModify(item)"
							v-if="item.audit != '2'&&currentRole.identityCd=='identity50'">
							修改
						</div>
					</div>
					<div class="imgBox">
						<img style="object-fit: cover;" :src="item1" v-for="(item1,index1) in item.imgUrl" :key="index1" @click="viewImg(item.imgUrl,index1)">
					</div>
					<div class="fileBox">
						<div class="fileList" v-for="(item1,index1) in item.attachment" :key="index1"
							@click="toFile(item1.url)">
							<img :src="item1.img">
							<p style="word-break:break-word">{{item1.fileNm}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="addBtn" @click="show=true" v-if="currentRole.identityCd=='identity50'" >
				<img :src="add">
				<p>新增</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import {
		Dialog
	} from 'vant';
	import {
		Notify
	} from 'vant';
	import { ImagePreview } from 'vant';
	import add from "../img/addPhone.png"
	import arrLeft from "../img/arrLeft.png"
	import arrRight from "../img/arrRight.png"
	export default {
		props: ['list'],
		name: "productList",
		data() {
			return {
				arrLeft,
				arrRight,
				add,
				excel: "https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png",
				ppt: "https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png",
				word: "https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png",
				pdf: "https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
				arrowDown: "https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png",
				arrowUp: "https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png",
				size: 1, //证书图片的宽高比
				listOne: [{
					name: '国内海洋渔船安全证书',
					time: '2026-10-28 00:00:00',
					show: true,
					imgUrl: [],
					fileUrl: []
				}],
				listTwo: [],
				listp: [{
						id: 1,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},
					{
						id: 2,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},
					{
						id: 3,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},
					{
						id: 4,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},
					{
						id: 5,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},
					{
						id: 6,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},
					{
						id: 7,
						imgUrl: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
						nm: '证书名',
						validUntil: '2020-23-20', //有效期
					},


				],
				listFile: [],
				list1: [],
				list2: [],
				certificateList: [],
				pageOne: 1,
				PageNumOne: 3,
				pageTwo: 1,
				PageNumTwo: 3,
				show: false,
				showPicker: false,
				currentDate: new Date(),
				nm: '', //报告名称
				validUntil: '', //报告出具时间
				imgList: [],
				imgListUpd: [],
				fileList: [],
				fileListUpd: [],
				total: '',
				totalTwo: '',
				modifyFlag: false, //是否为修改
				formId: '',
				currentRole:{},
			}
		},
		computed: {
			...mapState([
				'bWidth',
				'width'
			]),

		},
		watch: {
			list: {
				handler: function() {
					this.list1 = [] //检验证书
					this.list2 = [] //产品证书
					this.list.forEach(item => {
						if (item.types == 0) {
							this.list1.push(item)
						} else {
							this.list2.push(item)
						}
					})
				},
				deep: true
			}
		},
		mounted() {
			this.currentRole = JSON.parse(this.until.loGet('currentRole'))
			this.id = this.until.getQueryString('id')
			this.getInfoOne()
			this.getInfoTwo()
		},
		methods: {
			viewImg(item,index){
			  	ImagePreview({
					images: item,
					 startPosition: index,
				})
			},
			toModify(item) {
				this.show = true
				this.modifyFlag = true
				this.nm = item.nm
				this.validUntil = item.validUntil
				this.imgListUpd = item.imgUrl
				this.fileListUpd = item.attachment
				this.formId = item.id
				if (item.imgUrl) {
					let urlStr = item.imgUrl
					urlStr.forEach(item1 => {
						let obj = new Object();
						obj.url = item1;
						this.imgList.push(obj)
					});
				}
				if (item.attachment) {
					let modelList = item.attachment
					if (modelList.length > 0) {
						for (let i = 0; i < modelList.length; i++) {
							this.fileList.push({
								file: new File([], modelList[i].fileNm, {}),
								url: modelList[i].url
							})
						}

					}
				}

			},
			toDelete(item) {
				Dialog.confirm({
						title: '',
						message: '是否确认删除',
					})
					.then(() => {
						this.api.inspectDel(item.id).then(res => {
							Notify({
								type: 'success',
								message: '删除成功'
							});
							this.getInfoTwo()
						})
					})
					.catch(() => {
						Notify({
							type: 'success',
							message: '已取消删除'
						});
					});

			},
			lastPageNum() {
				if (this.pageOne == 1) {
					return
				} else {
					this.pageOne--
					this.getInfoOne()
				}
			},
			nextPageNum() {
				if (this.pageOne * this.PageNumOne >= this.total) {
					return
				} else {
					this.pageOne++
					this.getInfoOne()
				}
			},
			lastPageNum2() {
				if (this.pageTwo == 1) {
					return
				} else {
					this.pageTwo--
					this.getInfoTwo()()
				}
			},
			nextPageNum2() {
				if (this.pageTwo * this.PageNumTwo >= this.totalTwo) {
					return
				} else {
					this.pageTwo++
					this.getInfoTwo()()
				}
			},
			cancel() {
				this.closeMask()
			},
			save() {
				if (this.nm == '') {
					Notify({
						type: 'danger',
						message: '报告名称不能为空'
					});
					return false
				}
				if (this.modifyFlag == false) {
					let obj = {
						nm: this.nm,
						docsId: this.id,
						validUntil: this.validUntil,
						imgUrl: this.imgListUpd ? this.imgListUpd.join(',') : '',
						attachment: this.fileListUpd ? this.fileListUpd.join(',') : '',
						issuerId: this.currentRole.id,
						issuerNm: this.currentRole.company,
						types: '1',
					}
					this.api.inspectAdd(obj).then(res => {
						Notify({
							type: 'success',
							message: '新增成功'
						});
						this.closeMask()
						this.getInfoTwo()
					})
				} else {
					let attachment = []
					if (this.fileListUpd) {
						this.fileListUpd.forEach(item => {
							if (item.url) {
								attachment.push(item.url)
							} else {
								attachment.push(item)
							}
						})
					}

					let obj = {
						nm: this.nm,
						docsId: this.id,
						id: this.formId,
						validUntil: this.validUntil,
						imgUrl: this.imgListUpd ? this.imgListUpd.join(',') : '',
						attachment: attachment ? attachment.join(',') : '',
						issuerId: this.currentRole.id,
						issuerNm: this.currentRole.company,
						types: '1',
					}
					this.api.inspectUpd(obj).then(res => {
						Notify({
							type: 'success',
							message: '修改成功'
						});
						this.closeMask()
						this.getInfoTwo()
					})
				}


			},
			afterReadFile(file) {
				file.status = 'uploading';
				file.message = '上传中...'
				let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
				formData.append("file", file.file); //接口需要传的参数
				this.api.uploadImg4(formData).then((res) => {
					file.status = 'success';
					file.message = '上传成功'
					this.fileListUpd.push(res);
				});
			},
			deleteFile(file, detail) {
				this.fileListUpd.splice(detail.index, 1);
				this.fileList.splice(detail.index, 1);
			},
			afterRead(file) {
				file.status = 'uploading';
				file.message = '上传中...'
				let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
				formData.append("file", file.file); //接口需要传的参数
				this.api.uploadImg4(formData).then((res) => {
					file.status = 'success';
					file.message = '上传成功'
					this.imgListUpd.push(res);
				});
			},
			deleteImg(file, detail) {
				this.imgListUpd.splice(detail.index, 1);
				this.imgList.splice(detail.index, 1);
			},
			confirmTime(val) {
				let year = val.getFullYear()
				let month = val.getMonth() + 1
				let day = val.getDate()
				let hour = val.getHours()
				let minute = val.getMinutes()
				if (month >= 1 && month <= 9) {
					month = `0${month}`
				}
				if (day >= 1 && day <= 9) {
					day = `0${day}`
				}
				if (hour >= 0 && hour <= 9) {
					hour = `0${hour}`
				}
				if (minute >= 0 && minute <= 9) {
					minute = `0${minute}`
				}
				this.validUntil = `${year}-${month}-${day}`
				this.showPicker = false
			},
			cancelTime() {
				this.showPicker = false
			},
			closeMask() {
				this.show = false
				this.modifyFlag = false
				this.nm = ''
				this.validUntil = ''
				this.imgList = []
				this.imgListUpd = []
				this.fileList = []
				this.fileListUpd = []
			},
			toFile(url) {
				window.open(url)
			},
			getInfoOne() {
				let qry = this.query.new()
				this.query.toW(qry, 'docsId', this.id, 'EQ')
				this.query.toW(qry, 'types', 0, 'EQ')
				this.query.toP(qry, this.pageOne, this.PageNumOne)
				this.api.certificate(this.query.toEncode(qry)).then(res => {
					this.total = res.page.total
					res.data.list.forEach(item => {
						if (item.attachment) {
							item.attachment = item.attachment.split(",")
							this.getFile(item.attachment)
							item.attachment = this.listFile
						}
						if (item.imgUrl) {
							item.imgUrl = item.imgUrl.split(",")
						}
						item.show = false
						if(item.validUntil)
						{
							item.validUntil=item.validUntil.substring(1,10)
						}
					})
					this.listOne = res.data.list

					console.log(1213, this.listOne);
				})
			},
			getInfoTwo() {
				let qry = this.query.new()
				this.query.toW(qry, 'docsId', this.id, 'EQ')
				this.query.toW(qry, 'types', 1, 'EQ')
				this.query.toP(qry, this.pageTwo, this.PageNumTwo)
				if (this.currentRole.identityCd == 'identity50') {
					this.api.certificateAll(this.query.toEncode(qry)).then(res => {
						this.totalTwo = res.page.total
						res.data.list.forEach(item => {
							if (item.attachment) {
								item.attachment = item.attachment.split(",")
								this.getFile(item.attachment)
								item.attachment = this.listFile
							}
							if (item.imgUrl) {
								item.imgUrl = item.imgUrl.split(",")
							}
							item.show = false
							if(item.validUntil)
							{
								item.validUntil=item.validUntil.substring(1,10)
							}
						})
						this.listTwo = res.data.list

						console.log(1213, this.listTwo);
					})
				} else {
					this.api.certificate(this.query.toEncode(qry)).then(res => {
						this.totalTwo = res.page.total
						res.data.list.forEach(item => {
							if (item.attachment) {
								item.attachment = item.attachment.split(",")
								this.getFile(item.attachment)
								item.attachment = this.listFile
							}
							if (item.imgUrl) {
								item.imgUrl = item.imgUrl.split(",")
							}
							item.show = false
							if(item.validUntil)
							{
								item.validUntil=item.validUntil.substring(1,10)
							}
						})
						this.listTwo = res.data.list

						console.log(1213, this.listTwo);
					})
				}

			},
			getFile(info) {
				this.listFile = []
				let data = info
				let data1 = []
				let fileList2 = []
				if (data.length > 0) {
					data.forEach(v => {
						let type = v.split('.')[v.split('.').length - 1]
						let nmList = v.split('.com/') //分割出url后的内容
						let nm = ""
						nmList.forEach((j, z) => { //防止文件名中有 .com/ 所以循环加入
							if (z != 0) {
								nm += j
							}
						})
						nmList = nm.split('_') //分割随机字符后的内容
						nm = ""
						nmList.forEach((j, z) => { //防止文件名中有 _ 所以循环
							if (z != 0) {
								nm += j
							}
						})
						nm = nm.split('.' + type)[0]
						if (type == 'pdf') {
							fileList2.push({
								url: v,
								img: this.pdf,
								'fileNm': nm
							})
						} else if (type == 'doc' || type == 'docx') {
							fileList2.push({
								url: v,
								img: this.word,
								'fileNm': nm
							})
						} else if (type == 'ppt' || type == 'pptx') {
							fileList2.push({
								url: v,
								img: this.ppt,
								'fileNm': nm
							})
						} else if (type == 'xls' || type == 'xlsx') {
							fileList2.push({
								url: v,
								img: this.excel,
								'fileNm': nm
							})
						} else {
							fileList2.push({
								url: v,
								img: v,
								'fileNm': nm
							})
						}

					})
				}
				this.listFile = fileList2
			},

			//     async getInfo(){
			//       this.certificateList=[]
			//       let qry = this.query.new()
			//       // this.currentRole=JSON.parse(this.until.seGet('currentRole'))
			//       this.query.toW(qry,'docsId',this.id,'EQ')
			// this.query.toW(qry,'types',0,'EQ')
			//       this.query.toP(qry,'1','100')
			//       let data=await this.api.certificate(this.query.toEncode(qry))
			//       this.total=data.page.total
			//       this.certificateList.push(...data.data.list)
			//       console.log(this.certificateList)
			//       this.certificateList.forEach(item=>{
			//           if(item.validUntil){
			//               item.validUntil=item.validUntil.split(' ')[0]
			//           }

			//         if(item.types==0){
			//           this.list1.push(item)
			//  this.list1.forEach(item=>{
			//   if(item.attachment){
			// 	  item.attachment=item.attachment.split(',')
			// 	  item.file=[]
			// 	  item.attachment.forEach(item1=>{
			// 		  let fileObj={}
			// 		  fileObj.url=item1
			// 		  fileObj.nm=item1.substring(item1.indexOf('_')+1,item1.length)
			// 		  item.file.push(fileObj)
			// 	  })
			//   }
			//   console.log(123, this.list1);

			//  })
			//         }else {
			//           this.list2.push(item)
			//         }
			//       })
			//     },
		}
	}
</script>
<style lang="less">
	.van-cell {
		margin-top: 0.2rem;
	}

	.van-cell::after {
		border-bottom: 0;
	}

	.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border-width: 0
	}

	.van-uploader__wrapper {
		max-width: 4rem;
	}
</style>

<style lang="less" scoped>
	// .certificate{
	//     padding: 0 0.4rem;

	//     .row{
	//         padding: 0.09rem 0;
	//         .title1{
	//             width: 100%;
	//         }
	//     }
	//     ul{
	//         display: flex;
	//         flex-wrap: wrap;
	//         justify-content: space-between;
	//         li{

	//             flex-shrink: 0;
	//             width: 1.8rem;
	//             .imgCont{
	//                 width: 1.8rem;
	//                 height: 1.8rem;
	//                 background: #E7E7E7;
	//                 display: flex;
	//                 align-items: center;
	//                 justify-content: center;
	//             }
	//             p:nth-of-type(1){
	//                 margin-top: 0.05rem;
	//                 color: #333333;
	//                 font-size: 0.26rem;
	//             }
	//             p:nth-of-type(2){
	//                 color: #999999;
	//                 font-size: 0.17rem;
	//             }
	//             p:nth-of-type(3){
	//                 color: #999999;
	//                 font-size: 0.17rem;
	//             }
	//         }
	//     }

	// }
	.container {
		.topPage {
			height: 0.96rem;
			width: 100%;
			text-align: center;
			line-height: 0.96rem;
			border-bottom: 1px solid #2778BE;
			position: relative;

			p {
				font-size: 0.24rem;
				font-weight: bold;
				color: #303030;
			}

			.imgLeft {
				width: 0.22rem;
				height: 0.22rem;
				position: absolute;
				left: 0.15rem;
				top: 50%;
				transform: translateY(-50%);
			}

			.imgRight {
				width: 0.22rem;
				height: 0.22rem;
				position: absolute;
				right: 0.15rem;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.bodyList {
			.list {
				margin-top: 0.17rem;

				.listTop {
					display: flex;
					flex-wrap: wrap;
					padding: 0.1rem 0.3rem;
					background: #F7F7F7;
					border: 0.01px solid #EEEEEE;
					position: relative;

					p {
						font-size: 0.22rem;
						font-family: PingFang SC;
						font-weight: 400;
						color: #666666;
						line-height: 0.24rem;
					}

					.pOne {
						width: 2.2rem;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}

					img {
						width: 0.2rem;
						height: 0.2rem;
						position: absolute;
						right: 0.2rem;
					}
				}

				.listTopTwo {
					padding: 0.1rem 0.3rem;
					background: #F7F7F7;
					border: 0.01px solid #EEEEEE;
					position: relative;

					.top {
						display: flex;

						p {
							font-size: 0.22rem;
							font-family: PingFang SC;
							font-weight: 400;
							color: #666666;
							line-height: 0.24rem;
						}

						.pOne {
							width: 2.2rem;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}

						img {
							width: 0.2rem;
							height: 0.2rem;
							position: absolute;
							right: 0.2rem;
							top: 50%;
							transform: translateY(-50%);
						}
					}

				}

				.listContainer {
					background-color: #ffffff;

					.topBtn {
						display: flex;
						justify-content: space-between;
						padding: 0 0.6rem 0.3rem;
						margin-top: 0.5rem;

						.btnLeft {
							width: 1.92rem;
							height: 0.52rem;
							background: rgba(245, 115, 19, 0);
							border: 1px solid #C8C8C8;
							border-radius: 0.26rem;
							text-align: center;
							line-height: 0.52rem;
							font-size: 0.24rem;
							color: #909090;
						}

						.btnRight {
							width: 1.92rem;
							height: 0.52rem;
							background: rgba(245, 115, 19, 0);
							border: 1px solid #2778BE;
							border-radius: 0.26rem;
							text-align: center;
							line-height: 0.52rem;
							font-size: 0.24rem;
							color: #2778BE;
						}
					}

					.imgBox {
						display: flex;
						flex-wrap: wrap;

						img {
							width: 3.1rem;
							height: 1.9rem;
							margin-left: 0.3rem;
							margin-top: 0.3rem;
						}
					}

					.fileBox {
						display: flex;
						flex-wrap: wrap;

						.fileList {
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							width: 3.1rem;
							height: 1.9rem;
							margin-left: 0.3rem;
							margin-top: 0.3rem;

							img {
								width: 0.96rem;
								height: 0.82rem;
							}

							p {
								font-size: 0.22rem;
								font-weight: 400;
								color: #236CAB;
								margin-top: 0.1rem;
							}
						}

					}
				}
			}

			.addBtn {
				width: 1.3rem;
				height: 0.5rem;
				background: #2778BE;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0.35rem auto;

				img {
					width: 0.27rem;
					height: 0.27rem;
				}

				p {
					font-size: 0.24rem;
					color: #FFFFFF;
					margin-left: 0.1rem;
				}
			}
		}

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 1.5rem auto;
			width: 80%;
			height: 70%;

			.block {
				width: 100%;
				height: 100%;
				background-color: #fff;
				overflow: scroll;

				.bottomBtn {
					margin-top: 0.8rem;
					padding-bottom: 0.6rem;
					display: flex;
					width: 100%;
					justify-content: space-around;

					.leftBtn {
						width: 1.2rem;
						height: 0.8rem;
						text-align: center;
						line-height: 0.8rem;
						background-color: #ffffff;
						border: 1px solid #cccccc;
					}

					.rightBtn {
						width: 1.2rem;
						height: 0.8rem;
						text-align: center;
						line-height: 0.8rem;
						background-color: #2778BE;
						color: #ffffff;
					}
				}
			}
		}
	}
</style>
