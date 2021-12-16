<template>
<!--  监理建造-->
  <div class="jianlijianzao">

<!--    船舶信息-->
    <div class="info">
      <img :src="info.logo">

      <div>
        <p>船舶编号:<span>{{shipCd}}</span></p>
        <p>监理方:<span>{{info.company}}</span></p>
        <p>船舶状态:<span style="color: #2778BE">{{shipStatus}}</span></p>
      </div>

    </div>

    <ul class="tab">
      <li v-for="item in tabList" :key="item.id" @click="toChoose(item)" >
        <p :class="{tabAct:tabId==item.id}">{{item.nm}}</p>
      </li>
    </ul>





    <div v-for="(item,index) in list" :key="index">
      <div class="title" @click="item.show=!item.show">

        <span>{{item.title}}（ 时间 : {{item.actDt}} ）</span>
        <p>
          <span style="color: #2778BE;font-weight: bold">检验完成</span>
          <img :src="arrowDown" v-if="item.show">
          <img :src="arrowUp" v-else>
        </p>
      </div>



      <div class="rich" v-if="item.show">
        <!-- <div class="detail" v-if="item.description"  v-html="item.description"></div> -->
        <p class="desc" v-show="catCd!='DOCS_SURVEY_CYCLE.70'">
           期报：
        </p>
        <div class="doc" v-show="catCd!='DOCS_SURVEY_CYCLE.70'">
          <p v-for="j in item.fileList" @click="toLink(j.url)">
            <img :src="j.img">
            <span style="color: #06c;">{{j.fileNm}}</span>
          </p>
        </div>
        <p style="margin-top: 20px"> {{item.nm}}报告：</p>
        <div class="report" v-show="catCd!='DOCS_SURVEY_CYCLE.70'">
          <p v-for="j in item.imgList" @click="toLink(j.url)">
            <img :src="j.img">
          </p>
        </div>
        <div class="report" v-show="catCd=='DOCS_SURVEY_CYCLE.70'">
          <p v-for="j in item.imgList1" @click="toLink(j)">
            <img :src="j">
          </p>
        </div>

        <p style="margin-top: 20px" v-show="catCd!='DOCS_SURVEY_CYCLE.70'"> 附件：</p>
        <div class="doc"  v-show="catCd!='DOCS_SURVEY_CYCLE.70'">
          <p v-for="j in item.attachmentList" @click="toLink(j.url)">
            <img :src="j.img">
            <span>{{j.fileNm}}</span>
          </p>
        </div>
      </div>

    </div>

  </div>

</template>

<script>

    export default {
        name: "fangansheji",
        data(){
            return{

              excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
              ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
              word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
              pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
              arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
              arrowUp:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
                shipCd:"",
                shipStatus:"",
                list:[],
                info:{},
              tabId:'',
              catCd:'',
                tabList:[],
            }
        },
        async mounted() {
          this.id= this.until.getQueryString('id')
          this.shipCd=this.until.getQueryString('shipCd')
          this.shipStatus=this.until.getQueryString('shipStatus')
          let param={
            docsId:this.id,
            identityCd:'identity40'
          }
          this.info=await this.api.orgInfoBasic(param)
          this.getTab()
          // this.getInfo()
        },
        watch:{
          catCd(newVal,oldVal){
            this.list=[]
            this.getInfo(newVal)
          }
        },

        methods:{
          async getTab(){
            this.tabList= await this.api.dataDictionary("DOCS_SURVEY_CYCLE")
            this.tabId=this.tabList[0].id
            this.catCd=this.tabList[0].cd
          },
          toChoose(item){
            if(item.id!=this.tabId){
              this.tabId=item.id
              this.catCd=item.cd
            }
          },
          async getInfo(cd){
            let qry = this.query.new()
            this.query.toW(qry,'docsId',this.id,'EQ')
            this.query.toW(qry,'cd',cd,'EQ')
            let data=await this.api.qualityList(this.query.toEncode(qry))
              let data1=[]
              if(data.length>0){

                  data.forEach((item,index)=>{
                      if(index==0){
                          item.show=true
                      }else{
                          item.show=false
                      }

                      if(cd!='DOCS_SURVEY_CYCLE.70'){
                          let imgList1=item.imgUrl ? item.imgUrl.split(',') : []
                          let imgList2=[]
                          imgList1.forEach(v=>{
                              imgList2.push({url:v,img:v})
                          })
                          item.imgList=imgList2

                          let fileList1=item.fileUrl?item.fileUrl.split(','):[]
                          let fileList2=[]
                          let fileList11=item.attachment?item.attachment.split(','):[]
                          let fileList22=[]
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
                          fileList11.forEach(v=>{
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
                                  fileList22.push({url:v,img:this.pdf,'fileNm':nm})
                              }else if(type=='doc'||type=='docx'){
                                  fileList22.push({url:v,img:this.word,'fileNm':nm})
                              }else if(type=='ppt'||type=='pptx'){
                                  fileList22.push({url:v,img:this.ppt,'fileNm':nm})
                              }else if(type=='xls'||type=='xlsx'){
                                  fileList22.push({url:v,img:this.excel,'fileNm':nm})
                              }else{
                                  fileList22.push({url:v,img:v,'fileNm':nm})
                              }
                              item.attachmentList=fileList22
                          })
                      }else{
                          item.imgList1=item.imgUrl ? item.imgUrl.split(',') : []
                          if(data1.length==0){
                              console.log(item)
                              data1[0]=item
                          }else{
                              if(item.actDt==data1[data1.length-1].actDt){
                                  data1[data1.length-1].imgList1.push(...item.imgList1)
                              }else{
                                  data1.push(item)
                              }
                          }
                      }
                  })
              }
              if(cd!='DOCS_SURVEY_CYCLE.70'){
                  this.list=data
              }else{
                  this.list=data1
              }

          },
          toLink(url){
            console.log(url)
            // this.$bridge.callHandler('h5_load',url,res=>{
            //   console.log('res',res)
            // })
            window.open(url)
          },
        }


    }
</script>

<style scoped lang="less">

.jianlijianzao{

}
  .info{
    display: flex;
    height: 150px;
    padding: 0 0.3rem;
    margin-bottom: 30px;

    img{
      width: 150px;
      height: 150px;
      margin-right: 19px;
    }
    div{
      padding-bottom: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .title{
    padding: 0 0.3rem;
    margin-bottom: 10px;
    height: 40px;
    font-size: 0.24rem;
    color: #666666;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.1);

    &:hover{
      cursor: pointer;
    }
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

      padding: 24px 28px;
      .detail{
        margin-bottom: 0.2rem;
      }
      .desc{
        color: #666666;

      }

      .report{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        p{
          width: 330px;
          margin-top: 20px;
          img{
            display: block;
            width: 300px;
            height: 397px;
            object-fit: cover;
            margin: 0 auto;
          }
        }

      }

      .doc{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        p{
          margin-top: 20px;
          width: 120px;

          img{
            width: 70px;
            /*height: 90px;*/
            margin: 0 auto;
            display: block;
            &:hover{
              cursor: pointer;
            }
          }
          span{
            display: block;
            width: 100%;
            text-align: center;
            color: #666666;
            margin-top: 5px;
          }
        }

      }
  }

.tabAct{
  color: #333333 !important;
  font-size: 0.28rem !important;
  border-bottom:2px solid #2778BE !important;
}

.tab{

  display: flex;
  align-items: center;
  overflow-x: scroll;

  li{
    padding: 0rem 0.2rem;
    p{
      padding: 0.1rem 0;
      white-space: nowrap;
      color: #999999;
      font-size: 0.24rem;
    }
  }
}
</style>
