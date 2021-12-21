<template>
<!--  基本信息-->
  <div>
    <div class="line1">

      <van-row  class="row" type="flex" align="center">
        <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/7b0c807a3a5f46a2b1dd201e30acd5f7_主要参数.png" ></p></van-col>
      </van-row>
	  <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 船舶类型：{{info.typesNm}}</van-col>
		<van-col span="11"> 船体材质：{{info.hullMaterialNm}}</van-col>
	  </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="11"> 船籍：{{info.registry}}</van-col>
		<van-col span="11"> 船舶状态：{{info.statusNm}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="11"> 船舶航区：{{info.sailingAreaNm}}</van-col>
		<van-col span="11"> 完工日期：{{info.completeDate}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 船舶证书签发日期：{{info.signDate}}</van-col>
		<van-col span="11"> 船舶总长(m)：{{info.totalLen}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
        <!-- <van-col span="11"> 公约长度：{{info.lengthNm}}</van-col> -->
        <van-col span="11"> 公约船长(m)：{{info.pactLen}}</van-col>
		<van-col span="11"> 船舶型宽(m)：{{info.width}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 船舶型深(m)：{{info.deep}}</van-col>
		<van-col span="11"> 满载吃水(m)：{{info.loadDraught}}</van-col>
        <!-- <van-col span="11"> 主机品牌：{{info.hostBrand}}</van-col> -->
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 满载排水(t)：{{info.loadDisplacement}}</van-col>
		<van-col span="11"> 船舶航速(m/s)：{{info.speed}}</van-col>
        <!-- <van-col span="11"> 齿轮箱品牌：{{info.gearBrand}}</van-col> -->
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 船舶定员：{{info.complement}}</van-col>
		<van-col span="11"> 总吨位：{{info.totalTon}}</van-col>
        <!-- <van-col span="11"> 发电机组品牌：{{info.generatorSetBrand}}</van-col> -->
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 净吨位：{{info.netTon}}</van-col>
		<van-col span="11"> 主机型号：{{info.hostBrandModel}}</van-col>
      </van-row>
      <!-- <van-row class="row" type="flex" align="center" justify="space-between">
        <van-col span="11"> 制冷机组品牌：{{info.refrigeratorBrand}}</van-col>
      </van-row> -->
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 主机功率(KW)：{{info.hostPower}}</van-col>
		<van-col span="11"> 齿轮箱型号：{{info.gearModel}}</van-col>
      </van-row>
      <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 发电机组型号：{{info.generatorSetBrandModel}}</van-col>
		<van-col span="11"> 发电机组功率(KW)：{{info.generatorSetPower}}</van-col>
      </van-row>
	  <van-row class="row" type="flex" align="center" justify="space-between">
		<van-col span="11"> 制冷机组功率(KW)：{{info.refrigeratorPower}}</van-col>
		<van-col span="11"> </van-col>
	  </van-row>
	  <!-- <van-row class="row" type="flex" align="center" justify="space-between">
	  </van-row> -->
	  <div class="entireLine" v-for="item in paraList">
	    <p class="colNm" v-show="item.colNm">{{item.colNm}} : <span> {{item.value}}</span></p>
	  </div>
    </div>

  </div>

</template>

<script>
    export default {
        name: "fangansheji",
        props:{
          info:{
              type:Object,
          },
		  paraList:{
			  type:Array,
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
	.entireLine{
	  padding: 0.09rem 0;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  flex-wrap: wrap;
	  .colNm{
		width: 36%;
	    margin-right: 0.4rem;
	  }
	}
  }



</style>
