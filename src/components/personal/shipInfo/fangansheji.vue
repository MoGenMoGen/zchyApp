<template>
<!--  设计院方案设计、详细设计、生产设计-->
  <div class="baseInfo2">

    <van-row  class="row" type="flex" align="center">
      <van-col span="24"> <p class="title1">
        <img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/daacdf5f92014cdd866b280245a11382_方案设计.png" v-if="flowCd==11" >
        <img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/f8d72ef31757419c9233872845023c18_详细设计.png" v-if="flowCd==12" >
        <img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/a0690fd1172b4a678ae510e3ee938ba6_生产设计.png" v-if="flowCd==13" ></p>
      </van-col>
    </van-row>
    <div class="rich-cont"  v-html="info.description"></div>

<!--    <van-row class="row" type="flex" align="center">-->
<!--      <van-col span="24"  >-->
<!--        <p v-for="j in info.imgList" @click="toLink(j.url)">-->
<!--          <img :src="j.img" style="width: 100%">-->
<!--        </p>-->
<!--      </van-col>-->
<!--    </van-row>-->
<!--    <van-row class="row" type="flex" align="center">-->
<!--      <van-col span="24"  >-->
<!--        <p v-for="j in info.fileList" @click="toLink(j.url)" class="fileList">-->
<!--          <img :src="j.img">-->
<!--          <span>{{j.fileNm}}</span>-->
<!--        </p>-->
<!--      </van-col>-->
<!--    </van-row>-->


  </div>

</template>

<script>
    export default {
        name: "fangansheji",
        props:{
          title:{
              type:String,
              default:'设计'
          },
          flowCd:{
            type:Number,
            default:1
          },
        },
        data(){
            return{
              excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
              ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
              word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
              pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
              arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
              arrowUp:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
                info:{},
                list:[],
                id:'',
                imgList:[],//图片列表
                fileList:[],//附件列表
            }
        },
      watch:{
        flowCd(){
          console.log('变化'+this.flowCd)
          this.getInfo()
        },
      },

        mounted() {
          this.id= this.until.getQueryString('id')

        },
        methods:{
          async getInfo(flowCd){
            let qry = this.query.new()

            this.query.toW(qry,'docsId',this.id,'EQ')
            let designCd=''
            let data=await this.api.dataDictionary('DOCS_DESIGN_STATUS')
            data.forEach((item,index)=>{
              if(index+1==flowCd-10){
                designCd=item.cd
              }
            })
            this.query.toW(qry,'designFlowCd',designCd,'EQ')
            this.list=await this.api.designDeptList(this.query.toEncode(qry))
            if(this.list.length>0){
              this.info=this.list[0]
              this.info.imgList=this.info.imgUrl.split(',')
              this.info.fileList=this.info.attachment.split(',')

              let imgList2=[]
              this.info.imgList.forEach(v=>{
                imgList2.push({url:v,img:v})
              })
              this.info.imgList=imgList2

              this.info.description= this.info.description.replace(/<img[^>]*>/gi, function (match) {
                return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="width:fit-content;"')})

              let fileList2=[]
              this.info.fileList.forEach(v=>{
                let type=v.split('.')[v.split('.').length - 1]
                let nmList=v.split('.com/')  //分割出url后的内容
                let nm=""
                nmList.forEach((j,z)=>{       //防止文件名中有 .com/ 所以循环加入
                  if(z!=0){
                    nm+=j
                  }
                })
                nmList=nm.split('-')        //分割随机字符后的内容
                nm=""
                nmList.forEach((j,z)=>{   //防止文件名中有 - 所以循环
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
                this.info.fileList=fileList2
              })

            }else{
              this.info={}
            }
            console.log("设计方案信息")
            console.log(this.info)

          },
        }

    }
</script>

<style scoped lang="less">

  .baseInfo2{
    padding:  0 0.2rem;
    .rich-cont{
      width: 100%;
	  overflow: auto;
    }
    .row{
      font-size: 0.29rem;
      padding: 0.09rem 0.3rem;
      .title1{
        width: 100%;
        text-align: center;
        img{
          width: 80%;

        }
      }
      .fileList{
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
        img{
          width: 0.4rem;
          margin-right: 0.2rem;

        }
      }


    }
  }

</style>
