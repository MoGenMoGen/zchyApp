<template>
<!--  基本信息-->
  <div>
    <div class="line1">

      <van-row  class="row" type="flex" align="center">
        <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/7b0c807a3a5f46a2b1dd201e30acd5f7_主要参数.png" ></p></van-col>
      </van-row>


      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 船籍：{{info.registry}}</van-col>
        <van-col span="10"> 船舶类型：{{info.typesNm}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 航区：{{info.sailingAreaNm}}</van-col>
        <van-col span="10"> 船体材质：{{info.hullMaterialNm}}</van-col>
      </van-row>

      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 船体总长(m)：{{info.totalLen}}</van-col>
        <van-col span="10"> 公约总长(m)：{{info.pactLen}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 型宽(m)：{{info.width}}</van-col>
        <van-col span="10"> 型深(m)：{{info.deep}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 满载吃水(m)：{{info.loadDraught}}</van-col>
        <van-col span="10"> 满载排水量(t)：{{info.loadDisplacement}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 航速(kn)：{{info.speed}}</van-col>
        <van-col span="10"> 定员(P)：{{info.complement}}</van-col>
      </van-row>

      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 主机品牌：{{info.hostBrand}}</van-col>
        <van-col span="10"> 主机功率(kW)：{{info.hostPower}}</van-col>
      </van-row>


      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 齿轮箱品牌：{{info.gearBrand}}</van-col>
        <van-col span="10"> 齿轮箱型号：{{info.gearModel}}</van-col>
      </van-row>

      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 发电机品牌：{{info.generatorSetBrand}}</van-col>
        <van-col span="10"> 发电机功率：{{info.generatorSetPower}}</van-col>
      </van-row>


      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 制冷机品牌：{{info.refrigeratorBrand}}</van-col>
        <van-col span="10"> 制冷机功率(kW)：{{info.refrigeratorPower}}</van-col>
      </van-row>

      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="10"> 总吨位：{{info.totalTon}}</van-col>
        <van-col span="10"> 净吨位(kW)：{{info.netTon}}</van-col>
      </van-row>


      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="18"> 完工日期：{{info.completeDate}}</van-col>
      </van-row>

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

            }
        },
        mounted() {

        },
        methods:{

        }

    }
</script>

<style scoped lang="less">
  .line1 {
    padding: 0 0.3rem;
    font-size: 0.26rem;
    .row{
      padding: 0.09rem 0;
      .title1{
        width: 100%;
        text-align: center;
        img{
          width: 80%;

        }
      }
    }
  }



</style>
