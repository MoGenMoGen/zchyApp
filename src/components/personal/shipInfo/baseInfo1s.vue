<template>
<!--  船舶资料基本信息-->
  <div>
    <div class="line1">


      <van-row  class="row" type="flex" align="center">
        <van-col span="24"> <img style="width: 100%" :src="info.imgUrl" ></van-col>
<!--        <van-col span="8" offset="2"> <img style="width: 100%" :src="info.imgUrl" ></van-col>-->
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 船舶编号：</van-col>
        <van-col span="18" > <span style="color: #2778BE;font-weight: bold ">{{info.cd}}</span></van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 船舶名称：</van-col>
        <van-col span="18" > <span>{{info.nm}}</span></van-col>
      </van-row>

<!--      <van-row class="row" type="flex" align="center">-->
<!--        <van-col span="6"> 整船金额：</van-col>-->
<!--        <van-col span="16" offset="2"> <span>￥{{info.totalPrice}}</span></van-col>-->
<!--      </van-row>-->

<!--      <van-row class="row" type="flex" align="center">-->
<!--        <van-col span="6"> 船舶状态：</van-col>-->
<!--        <van-col span="16" offset="2"> <span style="color: #2778BE;">{{info.statusNm}}</span></van-col>-->
<!--      </van-row>-->

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 交付时间：</van-col>
        <van-col span="18" > <span >{{info.deliveryTm}}</span></van-col>
      </van-row>


      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 设计单位：</van-col>
        <van-col span="18" > <span >{{shejiInfo.company}}</span></van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 建造单位：</van-col>
        <van-col span="18" > <span >{{jianzaoInfo.company}}</span></van-col>
      </van-row>
      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 监理单位：</van-col>
        <van-col span="18" > <span >{{jianliInfo.company}}</span></van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 总承包方：</van-col>
        <van-col span="18" > <span >中创海洋科技股份有限公司</span></van-col>
      </van-row>



      <!--      <van-row class="row" type="flex" align="center">-->
<!--        <van-col span="6"> 合同编号：</van-col>-->
<!--        <van-col span="16" offset="2"> <span >{{info.contractNo}}</span></van-col>-->
<!--      </van-row>-->

<!--      <van-row class="row" type="flex" align="center">-->
<!--        <van-col span="6"> 订单编号：</van-col>-->
<!--        <van-col span="16" offset="2"> <span >{{info.orderNo}}</span></van-col>-->
<!--      </van-row>-->

    </div>

  </div>

</template>

<script>
    export default {
        name: "fangansheji",
        props:{
          info:{
              type:Object,

          }
        },
        data(){
            return{
              currentRole:'',
              id:'',
              shejiInfo:'',
              jianzaoInfo:'',
              jianliInfo:'',
            }
        },
        async mounted() {
          this.id= this.until.getQueryString('id')
          this.getShejiInfo()
          this.getJianzaoInfo()
          let param={
            docsId:this.id,
            identityCd:'identity40'
          }
          this.jianliInfo=await this.api.orgInfoBasic(param)

        },
        methods:{
          async getShejiInfo(){

            let param={
              docsId:this.id,
              identityCd:'identity20'
            }
            this.shejiInfo=await this.api.orgInfoBasic(param)
            console.log("设计info")
            console.log(this.shejiInfo)
            // let dataList=JSON.parse(this.info.mainParams)
            // this.paraList=dataList.args
            // console.log(this.paraList)
          },

          async getJianzaoInfo(){

            let param={
              docsId:this.id,
              identityCd:'identity30'
            }
            this.jianzaoInfo=await this.api.orgInfoBasic(param)
            console.log("建造info")
            console.log(this.jianzaoInfo)

          },




        }

    }
</script>

<style scoped lang="less">
  .line1 {
    padding: 0 0.3rem;
    .row{
      padding: 0.09rem 0;
    }
  }



</style>
