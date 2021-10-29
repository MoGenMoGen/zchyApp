<template>
<!--  建造流程-->
  <div>

    <ul class="tab">
      <li v-for="item in tabList" :key="item.id" @click="toChoose(item)" >
        <p :class="{tabAct:tabId==item.id}">{{item.nm}}</p>
      </li>
    </ul>

    <div v-for="item in list" :key="item.id">
      <div class="title" @click="item.show=!item.show">

        <span>{{item.nm}}</span>
        <p>
          <span style="white-space: nowrap">{{item.actDt}}</span>
          <img :src="arrowDown" v-if="item.show">
          <img :src="arrowUp" v-else>
        </p>

      </div>
<!--      <div class="date">{{item.actDt}}</div>-->
      <div class="rich" v-if="item.show">

        <p v-html="item.attachment"></p>
<!--        <p class="desc">-->
<!--          {{item.description}}-->
<!--        </p>-->
<!--        <div class="doc">-->
<!--          <p v-for="j in item.imgList" @click="toLink(j.url)">-->
<!--            <img :src="j.img">-->
<!--          </p>-->
<!--          <p v-for="j in item.fileList" @click="toLink(j.url)">-->
<!--            <img :src="j.img">-->
<!--            <span>{{j.fileNm}}</span>-->
<!--          </p>-->
<!--        </div>-->
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
                currentRole:{},
                list:[],
              tabList:[],
              tabId:'',
              catCd:'',
            }
        },
        mounted() {
          this.id= this.until.getQueryString('id')
          this.getTab()
        },

        watch:{
          catCd(newVal,oldVal){
            this.list=[]
            this.getInfo(newVal)
          }
        },
        methods:{
          toChoose(item){
            if(item.id!=this.tabId){
              this.tabId=item.id
              this.catCd=item.cd
            }
          },
          async getTab(){
             this.tabList= await this.api.dataDictionary("DOCS_BUILD_SHIP_CAT")
              this.tabId=this.tabList[0].id
              this.catCd=this.tabList[0].cd
          },

          async getInfo(cd){
            this.currentRole=JSON.parse(this.until.loGet('currentRole'))
            let qry = this.query.new()
            this.query.toW(qry,'docsId',this.id,'EQ')
            this.query.toW(qry,'catCd',cd,'EQ')
            let data=await this.api.buildStep(this.query.toEncode(qry))
            data.forEach((item,index)=>{
              item.show=false

              item.attachment = this.until.imgTagAddStyle(item.attachment)
            })
            console.log(data)
            this.list=data
          },
          toLink(url){
            console.log(url)
            window.open(url)
          },
        }


    }
</script>

<style scoped lang="less">


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


  .title{
    margin-bottom: 10px;
    font-size: 0.24rem;
    height: 40px;
    color: #666666;
    padding:0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.1);

    &:hover{
      cursor: pointer;
    }
    p:nth-of-type(1){
      flex-shrink: 0;
      display: flex;
      align-items: center;
      img{
        width: 12px;
        margin-left: 25px;
      }
    }
  }
  .date{
    padding:0 28px;
    /*border-bottom: 1px solid rgba(0,0,0,0.1);*/
    font-size: 0.22rem;
  }
  .rich{
      padding: 24px 28px;
      .desc{
        color: #666666;
      }
  }

  .tabAct{
    color: #333333 !important;
    font-size: 0.28rem !important;
    border-bottom:2px solid #2778BE !important;
  }
</style>
