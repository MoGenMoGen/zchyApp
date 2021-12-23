<template>
	<!--  设计院方案设计、详细设计、生产设计-编辑-->
	<div class="baseInfo2">
		<ul class="tab">
			<li v-for="item in tabList" :key="item.id" @click="toChoose(item)">
				<p :class="{tabAct:tabId==item.id}">{{item.nm}}</p>
			</li>
		</ul>
		<div v-for="item in listInfo" :key="item.id">
			<div class="title" @click="item.show=!item.show">

				<span>{{item.nm}}</span>
				<p>
					<span style="white-space: nowrap">{{item.actDt}}</span>
					<img :src="arrowDown" v-if="item.show">
					<img :src="arrowUp" v-else>
				</p>

			</div>
			<div class="rich" v-if="item.show">
				<!-- <p v-html="item.attachment"></p> -->
				<div class="topBtn" v-if="item.audit==2">
					<div>审核已通过</div>
				</div>
				<div class="topBtn" v-if="item.audit==1">
					<div>待审核</div>
					<div class="btnLeft"  @click="toDelete(item)">
						删除
					</div>
					<div class="btnRight" @click="toModify(item)">
						修改
					</div>
				</div>
				<div class="topBtn" v-if="item.audit==3">
					<div>未通过</div>
				</div>
				<p>报告：{{item.nm}}</p>
				<div class="imgBox">
					<img :src="item1" v-for="(item1,index1) in item.imgUrl" :key="index1">
				</div>
				<div v-for="(item1,index1) in item.fileUrl" class="fileList">
					<img :src="item1.img" :key="index1">
					<span>{{item1.fileNm}}</span>
				</div>
			</div>

		</div>


		<van-overlay :show="show" @click="closeMask">
			<div class="wrapper" @click.stop>
				<div class="block">
					<p style="text-align: center;font-size: 0.3rem;margin-top: 0.2rem;">{{flag}}</p>
					<van-row class="row" align="center" type="flex">
						<van-col span="7">
							<p>文件类型：</p>
						</van-col>
						<van-col span="17">
							<mob-select ref="mobSelect" text="nm" :list="tabList" @change="chooseActCd"></mob-select>
						</van-col>
					</van-row>
					<van-row class="row" align="center" type="flex">
						<van-col span="7">
							<p>过程选择：</p>
						</van-col>
						<van-col span="17">
							<mob-select ref="mobSelect1" text="nm" :list="progressList" @change="choosePos"></mob-select>
						</van-col>
					</van-row>

					<!-- <van-row class="row" type="flex">
						<van-col span="7">
							<p>过程说明：</p>
						</van-col>
						<van-col span="17">
							<textarea v-model="form.description" placeholder="请输入过程说明"></textarea>
						</van-col>
					</van-row> -->

					<van-row class="row" align="center" type="flex">
						<van-col span="7">
							<p>完成时间：</p>
						</van-col>
						<van-col span="17">
							<cal-common ref="calCommon" @change="getCal"></cal-common>
						</van-col>
					</van-row>

					<van-row class="row" type="flex">
						<van-col span="7">
							<p>上传图片：</p>
						</van-col>
						<van-col span="17">
							<van-uploader v-model="imgList" multiple :after-read="afterRead1" :before-delete="deleteImg"/>
						</van-col>
					</van-row>

					<van-row class="row" type="flex">
						<van-col span="7">
							<p>上传文件：</p>
						</van-col>
						<van-col span="17">
							<van-uploader v-model="fileList" multiple :after-read="afterRead2" :before-delete="deleteFile"/>
						</van-col>
					</van-row>
					<!-- <van-row class="row" type="flex" align="center">
						<van-col span="24">
							<p v-for="j in info.fileList" class="fileList">
								<img :src="j.img">
								<span>{{j.fileNm}}</span>
							</p>
						</van-col>
					</van-row> -->

					<van-row class="row" type="flex">
						<van-col span="24">
							<p class="btn" @click="submit">保存</p>
						</van-col>

					</van-row>
				</div>
			</div>
		</van-overlay>

		<div class="addNew" @click="addNew">
			新增
		</div>
	</div>

</template>

<script>
	import { Notify } from 'vant';
	import calCommon from "../calCommon";
	import mobSelect from "../../../components/personal/shipInfo/mobSelect";
	import {
		Toast
	} from 'vant';
	export default {
		name: "fangansheji",
		props: {
			title: {
				type: String,
				default: '建造'
			},
			// flowCd: {
			// 	type: Number,
			// 	default: 1
			// },
		},
		components: {
			calCommon,
			mobSelect
		},
		data() {
			return {
				excel: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
				ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
				word: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
				pdf: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
				arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
				arrowUp: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
				currentRole: {},
				progressList: [], //过程列表
				form: {
					nm:"",
					docsId: "",
					catCd:"",
					cd:"",
					actDt:"",
					imgUrl: "",
					fileUrl: "",
					shipyardId: "",
					shipyardNm: "",
					seq:"",
				},
				info: {},
				list: [],
				listInfo: [],
				id: '',
				imgList: [], //图片列表
				fileList: [], //附件列表
				tabList: [],
				tabId: '',
				catCd: '',
				show:false,
				flag: '',
				formId: '',
				fileListUpd: [],
				imgListUpd: []
			}
		},
		watch: {
			// flowCd: {
			// 	handler(newVal) {
			// 		this.getInfo()
			// 	},

			// 	deep: true,
			// 	immediate: true,
			// },
			catCd(newVal, oldVal) {
				console.log("监听变化。。" + newVal)
				this.listInfo = []
				this.getList(newVal)
			},
		},
		mounted() {
			this.id = this.until.getQueryString('id')
			this.currentRole = JSON.parse(this.until.loGet('currentRole'))
			this.getDic()
			this.getTab()
		},
		methods: {
			closeMask(){
				this.show=false
			},
			addNew() {
				this.form.nm=""
				this.form.docsId=""
				this.form.catCd=""
				this.form.cd=""
				this.form.actDt=""
				this.form.imgUrl=""
				this.form.fileUrl=""
				this.form.shipyardId=""
				this.form.shipyardNm=""
				this.form.seq=""
				this.imgList = []
				this.fileList = []
				this.$refs.calCommon.text = ''
				this.$refs.mobSelect.name = ''
				this.$refs.mobSelect1.name = ''
				this.show = true
				this.flag = '新增'
			},
			async getList(cd) {
				this.currentRole = JSON.parse(this.until.loGet('currentRole'))
				let qry = this.query.new()
				this.query.toW(qry, 'docsId', this.id, 'EQ')
				this.query.toW(qry, 'catCd', cd, 'EQ')
				let data = await this.api.buildStep(this.query.toEncode(qry))
				data.forEach((item, index) => {
					item.show = false
					if (item.imgUrl) {
						item.imgUrl = item.imgUrl.split(',')
					}
					// if (item.attachment) {
					// 	item.attachment = this.until.imgTagAddStyle(item.attachment)
					// }
					let fileList2 = []
					if (item.fileUrl) {
						item.fileUrl.split(",").forEach(v => {
							let type = v.split('.')[v.split('.').length - 1]
							// let nmList = v.split('.com/') //分割出url后的内容
							let nm = ""
							// nmList.forEach((j, z) => { //防止文件名中有 .com/ 所以循环加入
							// 	if (z != 0) {
							// 		nm += j
							// 	}
							// })
							let nmList = v.split('_') //分割随机字符后的内容
							nmList.forEach((j, z) => { //防止文件名中有 - 所以循环
								if (z != 0) {
									nm += j
								}
							})
							nm = nm.split('.' + type)[0]
							console.log(nm)
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
					item.fileUrl = fileList2
				})
				console.log(data)
				this.listInfo = data
			},
			toChoose(item) {
				console.log(1111);
				if (item.id != this.tabId) {
					this.tabId = item.id
					this.catCd = item.cd
				}
			},
			async getTab() {
				this.tabList = await this.api.dataDictionary("DOCS_BUILD_SHIP_CAT")
				this.tabId = this.tabList[0].id
				this.catCd = this.tabList[0].cd
			},
			//过程选择
			choosePos(e) {
				this.form.cd = e.cd
				this.form.nm = e.nm
				this.form.seq = e.busSeq
			},
			chooseActCd(e) {
				this.form.catCd = e.cd
			},
			//提交
			submit() {
				this.form.docsId = this.until.getQueryString('id')
				this.form.shipyardId = this.currentRole.id
				this.form.shipyardNm = this.currentRole.company
				this.form.fileUrl = ''
				this.form.imgUrl = ''
				console.log(this.fileListUpd,this.imgListUpd)
				if (this.fileListUpd.length > 0) {
					this.form.fileUrl = this.fileListUpd.join(",")
				}

				if (this.imgListUpd.length > 0) {
					this.form.imgUrl = this.imgListUpd.join(",")
				}
				console.log(this.form)
				if(this.flag=='新增') {
					this.api.buildDeptAdd(this.form).then((res) => {
						this.show=false
						Toast("操作成功")
						setTimeout(() => {
							this.getList(this.catCd) //刷新数据
						}, 1500)
					})
				} else if (this.flag == '修改') {
					this.form.id = this.formId
					this.api.buildDeptUpd(this.form).then((res) => {
						this.show=false
						Toast("操作成功")
						setTimeout(() => {
							this.getList(this.catCd) //刷新数据
						}, 1500)
					})
				}
			},
			toDelete(item) {
				this.api.buildDeptDel(item.id).then(res=>{
				   this.getList(this.catCd)
				   Notify({ type: 'success', message: '删除成功' });
				})
			},
			deleteImg(file, detail) {
				this.imgListUpd.splice(detail.index, 1);
				this.imgList.splice(detail.index, 1);
				console.log(this.imgListUpd);
			},
			deleteFile(file, detail) {
				this.fileListUpd.splice(detail.index, 1);
				this.fileList.splice(detail.index, 1);
				console.log(this.fileListUpd);
			},
			toModify(item) {
				console.log(item)
				this.imgList = []
				this.fileList = []
				this.show = true
				this.flag = '修改'
				this.form.nm=item.nm
				this.form.docsId=item.docsId
				this.form.catCd=item.catCd
				this.form.cd=item.cd
				this.form.actDt=item.actDt
				this.form.shipyardId=item.shipyardId
				this.form.shipyardNm=item.shipyardNm
				this.form.seq=item.seq
				this.$refs.calCommon.text = item.actDt
				this.$refs.mobSelect.name = item.catNm
				this.$refs.mobSelect1.name = item.nm
				this.formId = item.id
				this.imgListUpd = []
				this.fileListUpd = []
				if(item.imgUrl.length>0) {
					item.imgUrl.forEach(item1=> {
						let obj = new Object();
						obj.url = item1;
						this.imgList.push(obj)
					});
					this.imgListUpd = item.imgUrl
				}
				if(item.fileUrl.length>0){
					item.fileUrl.forEach(item1 => {
						this.fileList.push({
							file : new File([], item1.fileNm, {}),
							url: item1.url
						})
						this.fileListUpd.push(item1.url)
					})
				}
			},
			//上传图片，一张图片返回对象，多张图片返回数组
			afterRead1(file) {
				file.status = 'uploading';
				file.message = '上传中...'
				let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
				formData.append("file", file.file); //接口需要传的参数
				this.api.uploadImg4(formData).then((res) => {
					console.log(res, 111111);
					file.status = 'success';
					file.message = '上传成功'
					this.imgListUpd.push(res);
					console.log(this.imgListUpd)
				});
			},
			afterRead2(file) {
				file.status = 'uploading';
				file.message = '上传中...'
				let formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
				formData.append("file", file.file); //接口需要传的参数
				this.api.uploadImg4(formData).then((res) => {
					console.log(res, 111111);
					file.status = 'success';
					file.message = '上传成功'
					this.fileListUpd.push(res);
					console.log(this.fileListUpd)
				});
			},
			async getDic() {
				this.progressList = await this.api.dataDictionary('DOCS_BUILD_SHIP_PROCESS')
			},


			//获取安装日期
			getCal(e) {
				this.form.actDt = e
			},
			async getInfo() {
				this.form = {}
				let qry = this.query.new()
				this.query.toW(qry, 'docsId', this.until.getQueryString('id'), 'EQ')
				this.list = await this.api.buildStep(this.query.toEncode(qry))
				if (this.list.length > 0) {
					this.info = this.list[0]
					console.log("返回信息：：")
					console.log(this.info)
					this.form.id = this.info.id
					this.form.description = this.info.description
					this.form.actDt = this.info.actDt

					let imgList1 = this.info.imgUrl.split(',')
					let fileList1
					if (this.info.attachment) {
						fileList1 = this.info.attachment.split(',')
						this.info.fileList = this.info.attachment.split(',')
					}

					this.imgList = []
					this.fileList = []

					if (this.info.imgUrl) {
						imgList1.forEach(item => {
							let param = {
								url: item,
								status: 'done',
							}
							this.imgList.push(param)
						})
					}

					if (this.info.attachment) {
						fileList1.forEach(item => {
							let param = {
								url: item,
								status: 'done',
							}
							this.fileList.push(param)
						})

					}



					//
					let fileList2 = []
					if (this.info.fileList) {
						this.info.fileList.forEach(v => {
							let type = v.split('.')[v.split('.').length - 1]
							let nmList = v.split('.com/') //分割出url后的内容
							let nm = ""
							nmList.forEach((j, z) => { //防止文件名中有 .com/ 所以循环加入
								if (z != 0) {
									nm += j
								}
							})
							nmList = nm.split('-') //分割随机字符后的内容
							nm = ""
							nmList.forEach((j, z) => { //防止文件名中有 - 所以循环
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
							this.info.fileList = fileList2
						})
					}



				} else {
					this.info = {}
					this.imgList = []
					this.fileList = []
				}
				console.log("设计方案信息")
				console.log(this.info)

			},
		}

	}
</script>
<style lang="less">
	
	.van-uploader__wrapper {
		max-width: 4rem;
	}
</style>
<style scoped lang="less">
	.baseInfo2 {
		padding: 0 0.2rem;
		.addNew {
			width: 100%;
			height: 1rem;
			background-color: #2778BE;
			text-align: center;
			line-height: 1rem;
			font-size: 0.28rem;
			color: #FFFFFF;
			position: fixed;
			bottom: 0;
			margin-left: -0.4rem;
		}
		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 1.5rem auto;
		
			width: 80%;
			height: 80%;
		
			.block {
				width: 100%;
				height: 100%;
				background-color: #fff;
				overflow: scroll;
				.bottomBtn{
					margin-top: 0.4rem;
					padding-bottom: 0.6rem;
					display: flex;
					width: 100%;
					justify-content: space-around;
					.leftBtn{
						width: 1.2rem;
						height: 0.8rem;
						text-align: center;
						line-height: 0.8rem;
						background-color: #ffffff;
						border: 1px solid #cccccc;
					}
					.rightBtn{
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

		.title {
			margin-bottom: 10px;
			font-size: 0.24rem;
			height: 40px;
			color: #666666;
			padding: 0 0.1rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			border-top: 1px solid rgba(0, 0, 0, 0.1);

			&:hover {
				cursor: pointer;
			}

			p:nth-of-type(1) {
				flex-shrink: 0;
				display: flex;
				align-items: center;

				img {
					width: 12px;
					margin-left: 25px;
				}
			}
		}

		.date {
			padding: 0 28px;
			/*border-bottom: 1px solid rgba(0,0,0,0.1);*/
			font-size: 0.22rem;
		}

		.rich {
			padding: 24px 28px;
			.topBtn{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding:0 0.6rem 0.3rem;
				.btnLeft{
					width: 1rem;
					height: 0.52rem;
					background: rgba(245, 115, 19, 0);
					border: 1px solid #C8C8C8;
					border-radius: 0.26rem;
					text-align: center;
					line-height: 0.52rem;
					font-size: 0.24rem;
					color: #909090;
				}
				.btnRight{
					width: 1rem;
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
			.desc {
				color: #666666;
			}
			.fileList {
				display: flex;
				align-items: center;
				margin-bottom: 0.2rem;
			
				img {
					width: 0.4rem;
					margin-right: 0.2rem;
			
				}
			}
		}

		.tabAct {
			color: #333333 !important;
			font-size: 0.28rem !important;
			border-bottom: 2px solid #2778BE !important;
		}

		.tab {
			display: flex;
			align-items: center;
			overflow-x: scroll;

			li {
				padding: 0rem 0.2rem;

				p {
					padding: 0.1rem 0;
					white-space: nowrap;
					color: #999999;
					font-size: 0.24rem;
				}
			}
		}

		.row {
			font-size: 0.29rem;
			padding: 0.09rem 0.3rem;

			.btn {
				margin: 0 auto;
				width: 85%;
				background: #2778BE;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 0.8rem;

				&:active {
					opacity: 0.5;
				}
			}

			.title1 {
				width: 100%;
				text-align: center;

				img {
					width: 80%;

				}
			}

			.fileList {
				display: flex;
				align-items: center;
				margin-bottom: 0.2rem;

				img {
					width: 0.4rem;
					margin-right: 0.2rem;

				}
			}

			textarea {
				width: 90%;
				height: 2.3rem;
				border: 1px solid #DDDDDD;
				padding: 0.2rem;
			}

			textarea::-webkit-input-placeholder {
				color: #B8B8B8;
			}

			textarea::-moz-placeholder {
				/* Mozilla Firefox 19+ */
				color: #B8B8B8;
			}

			textarea:-moz-placeholder {
				/* Mozilla Firefox 4 to 18 */
				color: #B8B8B8;
			}

			textarea:-ms-input-placeholder {
				/* Internet Explorer 10-11 */
				color: #B8B8B8;
			}


		}
	}
</style>
