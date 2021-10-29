<template>
<!--  检验检测-->
  <div>
<!--    船舶信息-->
    <div class="info" v-if="!ifProDetail">
      <div style="display: flex;">
        <p style="margin-right: 60px;">船舶编号：<span>{{shipCd}}</span></p>
        <p>船舶状态：<span style="color: #2778BE">{{shipStatus}}</span></p>
      </div>
      <div v-for="(item,index) in info" :key="index" class="comBox">
        <img :src="item.logo">
        <p>{{item.unitNum==0?"检验机构：":"检测机构："}}<span>{{item.company}}</span></p>
      </div>
    </div>

    <div class="certificate">
      <!-- <div class="title">检验检测证书</div> -->
      <div v-for="(item,index) in list" :key="index">
        <div class="title" @click="item.show=!item.show">
          <span>{{item.nm}}</span>
          <p>
            <span>{{item.validUntil}}</span>
            <img :src="arrowDown" v-if="item.show">
            <img :src="arrowUp" v-else>
          </p>
        </div>
        <div class="rich" v-if="item.show">
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

  </div>

</template>

<script>
	import {mapState} from "vuex";
    export default {
        computed:{
        },
        data(){
            return{
                excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
                ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
                word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
                pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
                arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
                arrowUp:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
                size:1,//证书图片的宽高比
                shipCd:"",
                shipStatus:"",
                list:[],
                info:[],
                currentRole:{},
                ifProDetail:false,//是否商城详情页
            }
        },
        async mounted() {
          this.ifProDetail = window.location.href.indexOf('/trading/shipDetail')===-1 ? false : true
          if(!this.ifProDetail){
            this.id= this.until.getQueryString('id')
            this.shipCd=this.until.getQueryString('shipCd')
            this.shipStatus=this.until.getQueryString('shipStatus')
            let param={
              docsId:this.id,
              identityCd:'identity50'
            }
            let data=await this.api.orgInfoBasic(param)
            this.info=data.list
            console.log(this.info)
            this.getInfo()

          }

        },
        methods:{
          async getInfo(id){
			  console.log('三级')
            this.list=[]
            let qry = this.query.new()
            if(id){
              this.query.toW(qry,'docsId',id,'EQ')

            }else {
              this.query.toW(qry,'docsId',this.id,'EQ')
            }
            this.query.toW(qry,'types','1','EQ')
            this.query.toP(qry,'1','999')
            // console.log('路由')
            // console.log(window.location.href.indexOf('personal')>-1)
            let data

            if(window.location.href.indexOf('person')>-1){
              data=await this.api.jianyanList(this.query.toEncode(qry))
            }else{
              data=await this.api.certNotLoginList(this.query.toEncode(qry))
            }

            if(data.length>0){
              data.forEach((item,index)=>{
                item.show=false
                item.imgList=item.imgUrl.split(',')

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
                item.validUntil=item.validUntil?item.validUntil.split(' ')[0]:'-'
                this.list.push(item)
                // if(item.types==1){

                //   item.imgList=item.imgUrl.split(',')
                //   this.list.push(item)
                // }
              })
            }
            console.log('列表')
            console.log(this.list)
          },
          toLink(url){
            console.log(url)
            window.open(url)
          },
        }


    }
</script>

<style scoped lang="less">


  .info{
    display: flex;
    // height: 150px;
    // justify-content: space-between;
    flex-direction: column;
    width: 100%;
    margin-bottom: 30px;


    .comBox{
      display: flex;
      align-items: center;
      margin-top: 25px;
      >img{
        width: 100px;
        height: 100%;
        margin-right: 10px;
      }
    }
  }


    .certificate{
      .title{
        margin-bottom: 10px;
		box-sizing: border-box;
        width: 100%;
        height: 40px;
        background: #ffffff;
        color: #666666;
        padding:0 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;

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
              cursor: pointer;
              &:hover{
              }
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

</style>
