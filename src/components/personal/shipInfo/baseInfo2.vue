<template>
<!--  设计院基本信息-->
  <div class="baseInfo2">

    <van-row  class="row" type="flex" align="center">
      <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/f27668339302477ab85e34f9fe45d861_设计院简介.png" ></p></van-col>
    </van-row>
    <van-row class="row" type="flex" align="center">
      <van-col span="24"><span style="font-weight:bold;color: #303030">{{info.company}}</span> </van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="14" > <span style="color: #666666">优势设计:{{info.business}}</span></van-col>
    </van-row>
    <van-row class="row" type="flex" align="center">
      <van-col span="24" > <span style="color: #999999;font-size: 0.27rem" >{{info.summery}}</span></van-col>
    </van-row>


    <van-row class="row" type="flex">
      <van-col span="5" > <span style="color: #999999;font-size: 0.27rem" >公司地址:</span></van-col>
      <van-col span="19" > <span style="color: #999999;font-size: 0.27rem" >{{info.address}}</span></van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="5" > <span style="color: #999999;font-size: 0.27rem" >联 系 人:</span></van-col>
      <van-col span="19" > <span style="color: #999999;font-size: 0.27rem" >{{info.linkMan}}</span></van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="5" > <span style="color: #999999;font-size: 0.27rem" >联系电话:</span></van-col>
      <van-col span="19" > <span style="color: #999999;font-size: 0.27rem" >{{info.mob}}</span></van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="5" > <span style="color: #999999;font-size: 0.27rem" >联系邮箱:</span></van-col>
      <van-col span="19" > <span style="color: #999999;font-size: 0.27rem" >{{info.email}}</span></van-col>
    </van-row>



    <van-row class="row" type="flex" align="center">
      <van-col span="10" > <p class="row-img"><img class="icon" :src="yingyezhizhao">企业营业执照:</p></van-col>
      <van-col span="14" ><img class="pre" :src="info.businessLicense"></van-col>

    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="10" > <p class="row-img"><img class="icon" :src="zizhizhengshu">设计资质证书:</p></van-col>
      <van-col span="14" v-show="info.qualification"><img class="pre" :src="info.qualification"></van-col>

    </van-row>

    <!-- <van-row class="row" type="flex" align="center">
      <van-col span="10" > <p class="row-img"><img class="icon" :src="shenfenzheng">法人身份证:</p></van-col>
      <van-col span="6" ><img class="pre2" :src="info.idCard"></van-col>
      <van-col span="6" ><img class="pre2" :src="info.idCardReverse"></van-col>

    </van-row> -->



    <van-row  class="row" type="flex" align="center">
      <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/c8c1b9289ba44ddc9dfe7c159a72a3d3_方案设计资料图.png" ></p></van-col>
    </van-row>

    <div v-html="info.intro">
    </div>



  </div>

</template>

<script>

    export default {
        name: "fangansheji",
        props:{
          title:{
              type:String,
              default:'设计'
          }
        },
        data(){
            return{

                shenfenzheng:'https://sinovat.oss-cn-shanghai.aliyuncs.com/55ef6928c4b844f7944a562afe879d4f_shenfenzheng.png',
                yingyezhizhao:'https://sinovat.oss-cn-shanghai.aliyuncs.com/9949514af538447f8d1fe94f442c89d6_yingyezhizhao.png',
                zizhizhengshu:'https://sinovat.oss-cn-shanghai.aliyuncs.com/07bb2d5ce5f745c5b6c3f3130cd34c70_zizhizhengshu.png',
                info:{},
                list:[],
                id:'',
            }
        },
        mounted() {
          this.id= this.until.getQueryString('id')
          this.getInfo()
        },
        methods:{
          async getInfo(){
            this.currentRole=JSON.parse(this.until.loGet('currentRole'))
            let param={
              docsId:this.id,
              identityCd:'identity20'
            }
            this.info=await this.api.orgInfoBasic(param)
            console.log(this.info)
            // let dataList=JSON.parse(this.info.mainParams)
            // this.paraList=dataList.args
            // console.log(this.paraList)
          },
        }

    }
</script>

<style scoped lang="less">

  .baseInfo2{
    padding:  0 0.2rem;
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
      .row-img{
        padding: 0.2rem 0;
        display: flex;
        align-items: center;
        img{
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.2rem;
        }
      }
      .pre{
        width: 1.3rem;
        height: 1.3rem;
      }
      .pre2{
        width: 1rem;
        height: 1rem;
      }
    }
  }

</style>
