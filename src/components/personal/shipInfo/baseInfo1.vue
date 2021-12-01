<template>
<!--  船舶资料基本信息-->
  <div>
    <div class="line1">


      <van-row  class="row" type="flex" align="center">
        <van-col span="10"> <img style="width: 100%" :src="info.imgUrl" ></van-col>
        <van-col span="8" offset="2"> <img style="width: 100%" :src="info.imgUrl" ></van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 船舶编号：</van-col>
        <van-col span="16" offset="2"> 
			<p style="color: #2778BE;font-weight: bold;display: flex;align-items: center;">
				{{info.cd}}
				<img :src="Vr" v-if="info.vrUrl" @click.stop="toVr(info.id)" style="width: 1.38rem; height: 0.43rem;margin-left: 0.1rem;">
			</p>
		</van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 船舶名称：</van-col>
        <van-col span="16" offset="2"> <span>{{info.nm}}</span></van-col>
      </van-row>

<!--      <van-row class="row" type="flex" align="center">-->
<!--        <van-col span="6"> 整船金额：</van-col>-->
<!--        <van-col span="16" offset="2"> <span>￥{{info.totalPrice}}</span></van-col>-->
<!--      </van-row>-->

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 船舶状态：</van-col>
        <van-col span="16" offset="2"> <span style="color: #2778BE;">{{info.statusNm}}</span></van-col>
      </van-row>

        <van-row class="row" type="flex" align="center">
        <van-col span="6"> 交付时间：</van-col>
        <van-col span="16" offset="2"> <span >{{info.deliveryTm}}</span></van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 合同编号：</van-col>
        <van-col span="16" offset="2"> <span >{{info.contractNo}}</span></van-col>
      </van-row>

      <van-row class="row" type="flex" align="center">
        <van-col span="6"> 订单编号：</van-col>
        <van-col span="16" offset="2"> <span >{{info.orderNo}}</span></van-col>
      </van-row>

    </div>

  </div>

</template>

<script>
	import Vr from '@/assets/img/Vr.png'
    export default {
        name: "fangansheji",
        props:{
          info:{
              type:Object,

          }
        },
        data(){
            return{
				Vr
            }
        },
        mounted() {

        },
        methods:{
			toVr(id){
				window.open(`../myFrame/index.html?typeCd=3&id=${id}`)
			}
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
