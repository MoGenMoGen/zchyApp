<template>
<!--  基本信息-->
  <div>
    <div class="line1">

      <van-row  class="row" type="flex" align="center">
        <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png" ></p></van-col>
      </van-row>


      <div class="entireLine" v-for="item in paraList">
        <span class="colNm" v-show="item.colNm">{{item.colNm}} : </span><span> {{item.value}}</span>
      </div>
      <div v-html="info.intro">
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
  }



</style>
