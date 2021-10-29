<template>
    <div class="certificate">
        <!-- <div class="title">船舶检验证书</div> -->
        <div v-for="(item,index) in list1" :key="index">
          <div class="title" @click="toOpen(index)">
            <span>{{item.nm}}</span>
            <p>
              <!-- <span style="color: #2778BE;font-weight: bold">完成检验</span> -->
              <img :src="arrowDown" v-if="item.show">
              <img :src="arrowUp" v-else>
            </p>
          </div>
          <div class="rich" v-show="item.show">
            <div class="imgBox">
              <p v-for="j in item.imgList">
                <img :src="j" @click="toLink(j)">
              </p>
            </div>
            <div class="doc">
              <p v-for="j in item.fileList">
                <img :src="j.img" @click="toLink(j.url)">
                <span @click="toLink(j.url)">{{j.fileNm}}</span>
              </p>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  import {mapState} from "vuex";
    export default {
      props:['list'],
        name: "productList",
      data(){
          return{
			excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
			ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
			word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
			pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
			arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
			arrowUp:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
			size:1,//证书图片的宽高比
            list1:[],
            list2:[],
            certificateList:[],
          }
      },
      computed:{

      },
      watch:{
        // list:{
        //   handler:function () {
        //     this.list1 = []  //检验证书
        //     this.list2 = [] //产品证书
        //     this.list.forEach(item=>{
        //         if(item.types==0){
        //           this.list1.push(item)
        //         }else {
        //           this.list2.push(item)
        //         }
        //     })
        //   },
        //   deep:true
        // }
      },
      mounted() {
        this.id= this.until.getQueryString('id')
        this.getInfo()
      },
      methods:{
        toLink(url){
          console.log(url)
          this.$bridge.callHandler('h5_load',url,res=>{
            console.log('res',res)
          })
        },
        toOpen(index){
          console.log('hhh')
          this.list1[index].show=!this.list1[index].show
          this.$set(this.list1,index,this.list1[index])
          console.log(this.list1)
          // item.show=!item.show
        },
        async getInfo(){
          this.certificateList=[]
          let qry = this.query.new()
          // this.currentRole=JSON.parse(this.until.seGet('currentRole'))
          this.query.toW(qry,'docsId',this.id,'EQ')
          this.query.toW(qry,'types','0','EQ')
          this.query.toP(qry,'1','100')
          // console.log('路由')
          // console.log(window.location.href.indexOf('personal')>-1)
          let data
          if(window.location.href.indexOf('personal')>-1){
            this.certificateList=await this.api.jianyanList(this.query.toEncode(qry))
          }else{
            this.certificateList=await this.api.certNotLoginList(this.query.toEncode(qry))
          }
          // this.total=data.page.total

          // console.log(this.certificateList)
          this.certificateList.forEach(item=>{
            // item.validUntil=item.validUntil?item.validUntil.split(' ')[0]:"-"
            item.imgList=item.imgUrl?item.imgUrl.split(','):[]
            // let imgList1=item.imgUrl.split(',')
            // let imgList2=[]
            // imgList1.forEach(v=>{
            //   imgList2.push({url:v,img:v})
            // })
            // item.imgList=imgList2

            let fileList1=item.attachment?item.attachment.split(','):[]
            let fileList2=[]
            fileList1.forEach(v=>{
              let type=v.split('.')[v.split('.').length - 1]
              let nmList=v.split('.com/')  //分割出url后的内容
              let nm=""
              nmList.forEach((j,z)=>{       //防止文件名中有 .com/ 所以循环加入
                if(z!=0){
                  nm+=j
                }
              })
              nmList=nm.split('_')        //分割随机字符后的内容
              nm=""
              nmList.forEach((j,z)=>{   //防止文件名中有 _ 所以循环
                if(z!=0){
                  nm+=j
                }
              })
              nm=nm.split('.'+type)[0]
              if(type=='pdf'){
              	fileList2.push({url:v,img:this.pdf,'fileNm':nm})
              }else if(type=='doc'||type=='docx'){
              	fileList2.push({url:v,img:this.word,'fileNm':nm})
              }else if(type=='ppt'||type=='pptx'){
              	fileList2.push({url:v,img:this.ppt,'fileNm':nm})
              }else if(type=='xls'||type=='xlsx'){
              	fileList2.push({url:v,img:this.excel,'fileNm':nm})
              }else{
              	fileList2.push({url:v,img:v,'fileNm':nm})
              }
              item.fileList=fileList2
            })
            item.show=false
            this.list1.push(item)
          })
          console.log(this.list1)
        },
      }
    }
</script>

<style lang="less" scoped>
@import url("../../assets/css/mobile.less");
.certificate{
	background-color: #F1F3F2;
	padding-top: 0.2rem;
	>div{
		background-color: #ffffff;
		margin-bottom: 0.2rem;
		.title{
			// margin-bottom: 10px;
			box-sizing: border-box;
			width: 100%;
			height: 40px;
			background: #ffffff;
			color: #666666;
			padding:0 28px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			p:nth-of-type(1){
				display: flex;
				align-items: center;
				img{
					width: 12px;
					margin-left: 25px;
				}
			}
		}
		.rich{
			border-top: 0.01rem solid #dedede;
			box-sizing: border-box;
			padding: 0.2rem 0.2rem 0;
			.imgBox{
				display: flex;
				flex-wrap: wrap;
				>p{
					width: 22.5%;
					margin-right: 3%;
					&:nth-of-type(4n){
						margin-right: 0;
					}
				}
			}
			.doc{
				display: flex;
				flex-direction: column;
				// flex-wrap: wrap;
				width: 100%;
				p{
					margin-top: 5px;
					// width: 120px;
					display: flex;
					img{
						width: 14px;
						height: 14px;
						margin-right: 3px;
						display: block;
					}
					span{
						// display: block;
						// width: 100%;
						// text-align: center;
						color: #0066cc;
						font-size: 12px;
						cursor: pointer;
						// margin-top: 5px;
					}
				}
			}
		}
	}
}

</style>
