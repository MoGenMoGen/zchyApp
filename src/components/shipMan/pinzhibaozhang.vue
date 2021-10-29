<template>
<!--  建造监理-->
  <div style="background-color: #F1F3F2;padding-top: 0.2rem;">

<!--    船舶信息-->
    <div class="info" v-if="!ifProDetail">
      <img :src="info.logo">

      <div>
        <p>船舶编号:<span>{{shipCd}}</span></p>
        <p>监理方:<span>{{info.company}}</span></p>
        <p>船舶状态:<span style="color: #2778BE">{{shipStatus}}</span></p>
      </div>

    </div>


    <div v-for="(item,index) in list" :key="index" class="box">
      <div class="title" @click="item.show=!item.show">

        <span>{{item.nm}}（ 检验时间 : {{item.actDt}} ）</span>
        <p>
          <span style="color: #2778BE;font-weight: bold">完成检验</span>
          <img :src="arrowDown" v-if="item.show">
          <img :src="arrowUp" v-else>
        </p>
      </div>



      <div class="rich" v-if="item.show">
        <p v-if="item.description" style="margin-bottom: 30px;">详细描述:{{item.description}}</p>
        <p class="desc">
          1. {{item.nm}}报告：
        </p>
        <div class="report">
          <p v-for="j in item.imgList">
            <img :src="j.img" @click="toLink(j.img)">
          </p>
        </div>

        <p style="margin-top: 20px">2. 随期报发送的附件：</p>
        <div class="doc">
          <p v-for="j in item.fileList" @click="toLink(j.url)">
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
                currentRole:{},
              ifProDetail:false,//是否商品详情
            }
        },
        async mounted() {
          this.ifProDetail = window.location.href.indexOf('/trading/shipDetail')===-1 ? false : true
          if(this.ifProDetail){
            return
          }
          this.id= this.until.getQueryString('id')
          this.shipCd=this.until.getQueryString('shipCd')
          this.shipStatus=this.until.getQueryString('shipStatus')
          let param={
            docsId:this.id,
            identityCd:'identity40'
          }
          this.info=await this.api.orgInfoBasic(param)
          this.getInfo()
        },
        methods:{
          async getInfo(id){
            // this.currentRole=JSON.parse(this.until.seGet('currentRole'))
            let qry = this.query.new()
            if(id){
              this.query.toW(qry,'docsId',id,'EQ')

            }else {
              this.query.toW(qry,'docsId',this.id,'EQ')

            }
            let data=await this.api.qualityList(this.query.toEncode(qry))
            if(data.length>0){
              data.forEach((item,index)=>{
                item.show=false
                let imgList1=item.imgUrl ? item.imgUrl.split(',') : []
                let imgList2=[]
                imgList1.forEach(v=>{
                  imgList2.push({url:v,img:v})
                })
                item.imgList=imgList2

                let fileList1=item.fileUrl?item.fileUrl.split(','):[]
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
              })
              this.list=data
              console.log(this.list)
            }

          },
          toLink(url){
            console.log(url)
            this.$bridge.callHandler('h5_load',url,res=>{
              console.log('res',res)
            })
          },
        }


    }
</script>

<style scoped lang="less">


  .info{
    display: flex;
    height: 150px;
    width: 100%;
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


.box{
	background-color: #ffffff;
	margin-bottom: 0.2rem;
	.title{
	  box-sizing: border-box;
	  width: 100%;
	  height: 40px;
	  background: #FFFFFF;
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
	    padding: 24px 28px;
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
	      flex-direction: column;
	      // flex-wrap: wrap;
	      width: 100%;
	      p{
	        margin-top: 5px;
	        // width: 120px;
	        display: flex;
	        cursor: pointer;
	        img{
	          width: 14px;
	          height: 14px;
	          margin-right: 3px;
	          display: block;
	          &:hover{
	          }
	        }
	        span{
	          display: block;
	          width: 100%;
	          // text-align: center;
	          color: #0066cc;
	          font-size: 12px;
	          // margin-top: 5px;
	        }
	      }
	    }
	}
}
  
</style>
