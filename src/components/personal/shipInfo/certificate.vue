<template>
<!--   检验建议证书-->
    <div class="certificate">

        <van-row  class="row" type="flex" align="center">
            <van-col span="5"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/24a95d69424142928170eb313bca4ffe_检验证书.png" ></p></van-col>
        </van-row>

        <ul>
          <li v-for="(item,index) in list1" :key="index">
            <div class="imgCont" >
              <img :src="item.imgUrl">
            </div>
            <p>{{item.nm}}</p>
              <p>有效期:</p>
            <p>{{item.validUntil}}</p>
			<div style="display: flex;">
			<div class="fileCont" style="margin-right: 0.2rem;" v-for="(item1,index1) in item.file" :key="index1" @click="toFile(item1.url)" > 
				<van-icon name="description" size="1.8rem"/>
				<p>{{item1.nm}}</p>
			</div>
			</div>
          </li>
            <li v-for="(item,index) in 3-list1.length%3" :key="index" v-if="list1.length/5!=0">

            </li>
        </ul>


       <van-row  class="row" type="flex" align="center" style="margin-top: 0.3rem">
            <van-col span="5"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/5d1d0cfc66bd4a7d9920ca4658a549e2_产品证书.png" ></p></van-col>
        </van-row>
        <ul>
            <li v-for="(item,index) in list2" :key="index">
                <div class="imgCont" >
                    <img :src="item.imgUrl">
                </div>
                <p>{{item.nm}}</p>
                <p>有效期:</p>
                <p>{{item.validUntil}}</p>
            </li>
            <li v-for="(item,index) in 3-list2.length%3" :key="index" v-if="list2.length/5!=0">

            </li>
        </ul>
    </div>
	<!-- <div class="container">
		<div class="topPage">
			<img :src="arrLeft" class="imgLeft" >
			<img :src="arrRight" class="imgRight" >
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
						<img :src="item1" v-for="(item1,index1) in item.imgUrl" :key="index1">
					</div>
					<div class="fileBox">
						<div class="fileList" v-for="(item1,index1) in item.attachment" :key="index1" @click="toFile(item1.url)">
								<img :src="item1.img" >
								<p>{{item1.fileNm}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="topPage">
			<img :src="arrLeft" class="imgLeft" >
			<img :src="arrRight" class="imgRight" >
			<p>设备证书</p>
		</div>
		<div class="bodyList">
			<div class="list" v-for="(item,index) in listTwo" :key='index'>
				<div class="listTop" @click="item.show=!item.show">
					<p class="pOne">{{item.nm}}</p>
					<p style="margin-left:0.2rem ;">证件有效期：{{item.validUntil}}</p>
					<img :src="arrowDown" v-if="item.show" />
					<img :src="arrowUp" v-else />
				</div>
				<div class="listContainer" v-if="item.show">
					<div class="imgBox">
						<img :src="item1" v-for="(item1,index1) in item.imgUrl" :key="index1">
					</div>
					<div class="fileBox">
						<div class="fileList" v-for="(item1,index1) in item.attachment" :key="index1" @click="toFile(item1.url)">
								<img :src="item1.img" >
								<p>{{item1.fileNm}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="addBtn">
				<img :src="add" >
			</div>
		</div>
	</div> -->
</template>

<script>
  import {mapState} from "vuex";
  import add from "../img/addPhone.png"
  import arrLeft from "../img/arrLeft.png"
  import arrRight from "../img/arrRight.png"
    export default {
      props:['list'],
        name: "productList",
      data(){
          return{
			  arrLeft,
			  arrRight,
			  add,
			  excel: "https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png",
			  ppt: "https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png",
			  word: "https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png",
			  pdf: "https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
			 arrowDown: "https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png",
			 arrowUp: "https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png",
            size:1,//证书图片的宽高比
			listOne:[{
				name:'国内海洋渔船安全证书',
				time:'2026-10-28 00:00:00',
				show:true,
				imgUrl:['https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png','https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png','https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png'],
				fileUrl:[
					{
						url:"https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
						name:'浙普雨62288安全证书'
					},
					{
						url:"https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
						name:'浙普雨62288安全证书'
					},
					{
						url:"https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
						name:'浙普雨62288安全证书'
					},
					{
						url:"https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png",
						name:'浙普雨62288安全证书'
					},
				]
			}],
			listTwo:[],
            listp:[
                {
                    id:1,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:2,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:3,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:4,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:5,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:6,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:7,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },


            ],
			listFile:[],
            list1:[],
            list2:[],
            certificateList:[],
			pageOne:1,
			PageNumOne:3,
			pageTwo:1,
			PageNumTwo:3,
          }
      },
      computed:{
        ...mapState([
          'bWidth',
          'width'
        ]),

      },
      watch:{
        list:{
          handler:function () {
            this.list1 = []  //检验证书
            this.list2 = [] //产品证书
            this.list.forEach(item=>{
                if(item.types==0){
                  this.list1.push(item)
                }else {
                  this.list2.push(item)
                }
            })
          },
          deep:true
        }
      },
      mounted() {
        this.id= this.until.getQueryString('id')
		this.getInfo()
  //       this.getInfoOne()
		// this.getInfoTwo()
      },
      methods:{
		  toFile(url){
			window.open(url)  
		  },
		 //  getInfoOne(){
			//   let qry=this.query.new()
			//    this.query.toW(qry,'docsId',this.id,'EQ')
			//    this.query.toW(qry,'types',0,'EQ')
			//    this.query.toP(qry,this.pageOne,this.PageNumOne)
			//    this.api.certificate(this.query.toEncode(qry)).then(res=>{
			// 	    this.total=res.page.total
			// 		res.data.list.forEach(item=>{
			// 			if(item.attachment){
			// 				item.attachment=item.attachment.split(",")
			// 				this.getFile(item.attachment)
			// 				item.attachment=this.listFile
			// 			}
			// 			if(item.imgUrl){
			// 				item.imgUrl=item.imgUrl.split(",")
			// 			}
			// 			item.show=false
			// 		})
			// 		this.listOne=res.data.list
			
			// 		console.log(1213,this.listOne);
			//    })
		 //  },
		 //  getInfoTwo(){
		 //  			  let qry=this.query.new()
		 //  			   this.query.toW(qry,'docsId',this.id,'EQ')
		 //  			   this.query.toW(qry,'types',1,'EQ')
		 //  			   this.query.toP(qry,this.pageTwo,this.PageNumTwo)
		 //  			   this.api.certificate(this.query.toEncode(qry)).then(res=>{
		 //  				    this.totalTwo=res.page.total
		 //  					res.data.list.forEach(item=>{
		 //  						if(item.attachment){
		 //  							item.attachment=item.attachment.split(",")
		 //  							this.getFile(item.attachment)
		 //  							item.attachment=this.listFile
		 //  						}
		 //  						if(item.imgUrl){
		 //  							item.imgUrl=item.imgUrl.split(",")
		 //  						}
		 //  						item.show=false
		 //  					})
		 //  					this.listTwo=res.data.list
		  			
		 //  					console.log(1213,this.listTwo);
		 //  			   })
		 //  },
			//  getFile(info) {
			//   	this.listFile = []
			//   	let data = info
			//   	let data1 = []
			//   	let fileList2 = []
			//   	if (data.length > 0) {
			//   		data.forEach(v => {
			//   			let type = v.split('.')[v.split('.').length - 1]
			//   			let nmList = v.split('.com/') //分割出url后的内容
			//   			let nm = ""
			//   			nmList.forEach((j, z) => { //防止文件名中有 .com/ 所以循环加入
			//   				if (z != 0) {
			//   					nm += j
			//   				}
			//   			})
			//   			nmList = nm.split('_') //分割随机字符后的内容
			//   			nm = ""
			//   			nmList.forEach((j, z) => { //防止文件名中有 _ 所以循环
			//   				if (z != 0) {
			//   					nm += j
			//   				}
			//   			})
			//   			nm = nm.split('.' + type)[0]
			//   			if (type == 'pdf') {
			//   				fileList2.push({
			//   					url: v,
			// 					img: this.pdf,
			//   					'fileNm': nm
			//   				})
			//   			} else if (type == 'doc' || type == 'docx') {
			//   				fileList2.push({
			//   					url: v,
			// 					img:this.word,
			//   					'fileNm': nm
			//   				})
			//   			} else if (type == 'ppt' || type == 'pptx') {
			//   				fileList2.push({
			//   					url: v,
			// 					img:this.ppt,
			//   					'fileNm': nm
			//   				})
			//   			} else if (type == 'xls' || type == 'xlsx') {
			//   				fileList2.push({
			//   					url: v,
			// 					img:this.excel,
			//   					'fileNm': nm
			//   				})
			//   			} else {
			//   				fileList2.push({
			//   					url: v,
			//   					img: v,
			//   					'fileNm': nm
			//   				})
			//   			}
			  
			//   		})
			//   	}
			//   	this.listFile = fileList2
			//   },
		  
        async getInfo(){
          this.certificateList=[]
          let qry = this.query.new()
          // this.currentRole=JSON.parse(this.until.seGet('currentRole'))
          this.query.toW(qry,'docsId',this.id,'EQ')
		  this.query.toW(qry,'types',0,'EQ')
          this.query.toP(qry,'1','100')
          let data=await this.api.certificate(this.query.toEncode(qry))
          this.total=data.page.total
          this.certificateList.push(...data.data.list)
          console.log(this.certificateList)
          this.certificateList.forEach(item=>{
              if(item.validUntil){
                  item.validUntil=item.validUntil.split(' ')[0]
              }

            if(item.types==0){
              this.list1.push(item)
			  this.list1.forEach(item=>{
				  if(item.attachment){
					  item.attachment=item.attachment.split(',')
					  item.file=[]
					  item.attachment.forEach(item1=>{
						  let fileObj={}
						  fileObj.url=item1
						  fileObj.nm=item1.substring(item1.indexOf('_')+1,item1.length)
						  item.file.push(fileObj)
					  })
				  }
				  console.log(123, this.list1);
				  
			  })
            }else {
              this.list2.push(item)
            }
          })
        },
      }
    }
</script>

<style lang="less" scoped>

    .certificate{
        padding: 0 0.4rem;

        .row{
            padding: 0.09rem 0;
            .title1{
                width: 100%;
            }
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            li{

                flex-shrink: 0;
                width: 1.8rem;
                .imgCont{
                    width: 1.8rem;
                    height: 1.8rem;
                    background: #E7E7E7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                p:nth-of-type(1){
                    margin-top: 0.05rem;
                    color: #333333;
                    font-size: 0.26rem;
                }
                p:nth-of-type(2){
                    color: #999999;
                    font-size: 0.17rem;
                }
                p:nth-of-type(3){
                    color: #999999;
                    font-size: 0.17rem;
                }
            }
        }

    }
	.container{
		.topPage{
			height: 0.96rem;
			width: 100%;
			text-align: center;
			line-height: 0.96rem;
			border-bottom: 1px solid #2778BE;
			position: relative;
			p{
				font-size: 0.24rem;
				font-weight: bold;
				color: #303030;
			}
			.imgLeft{
				width: 0.22rem;
				height: 0.22rem;
				position: absolute;
				left:0.15rem;
				top: 50%;
				transform: translateY(-50%);
			}
			.imgRight{
				width: 0.22rem;
				height: 0.22rem;
				position: absolute;
				right:0.15rem;
				top: 50%;
				transform: translateY(-50%); 
			}
		}
		.bodyList{
			.list{
				margin-top: 0.17rem;
				.listTop{
					display: flex;
					padding:0.1rem 0.3rem ;
					background: #F7F7F7;
					border: 0.01px solid #EEEEEE;
					position: relative;
					p{
						font-size: 0.22rem;
						font-family: PingFang SC;
						font-weight: 400;
						color: #666666;
						line-height: 0.24rem;
					}
					.pOne{
						width: 2.2rem;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
					img{
						width: 0.2rem;
						height: 0.2rem;
						position: absolute;
						right:0.2rem;
					}
				}
				.listContainer{
					background-color: #ffffff;
					.imgBox{
						display: flex;
						flex-wrap: wrap;
						img{
							width: 3.1rem;
							height: 1.9rem;
							margin-left: 0.3rem;
							margin-top: 0.3rem;
						}
					}
					.fileBox{
						display: flex;
						flex-wrap: wrap;
						.fileList{
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							width: 3.1rem;
							height: 1.9rem;
							margin-left: 0.3rem;
							margin-top: 0.3rem;
							img{
								width: 0.96rem;
								height: 0.82rem;
							}
							p{
								font-size: 0.22rem;
								font-weight: 400;
								color: #236CAB;
								margin-top: 0.1rem;
							}
						}
						
					}
				}
			}
			.addBtn{
				width: 1.3rem;
				height: 0.5rem;
				background: #2778BE;
				margin-top: 0.35rem;
				display: flex;
				text-align: center;
				line-height: 0.5rem;
				margin: 0 auto;
			}
		}
	}

</style>
