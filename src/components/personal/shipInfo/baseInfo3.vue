<template>
<!--  建造档案基本信息-->
  <div class="baseInfo3">
    <van-row  class="row" type="flex" align="center">
      <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/69e27403ffc84762a02dda0662f339c0_建筑公司简介.png" ></p></van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="24"><span style="font-weight:bold;color: #303030">{{info.company}}</span> </van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="20" > <span style="color: #666666">优势设计:{{info.business}}</span></van-col>
    </van-row>
    <van-row class="row" type="flex" align="center">
      <van-col span="24" > <span style="color: #999999;font-size: 0.27rem" >{{info.summery}}</span></van-col>
    </van-row>


    <van-row class="row" type="flex">
      <van-col span="5" > <span style="color: #999999;font-size: 0.27rem" >公司地址:</span></van-col>
      <van-col span="19" > <span style="color: #999999;font-size: 0.27rem" >{{info.address}}</span></van-col>
    </van-row>

    <van-row class="row" type="flex" align="center">
      <van-col span="5" > <span style="color: #999999;font-size: 0.27rem" >公司网址:</span></van-col>
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

    <van-row  class="row" type="flex" align="center">
      <van-col span="24"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/02a9a019e6344d0c85788b295d0d9ce6_船长展示图片.png" ></p></van-col>
    </van-row>
    <div class="rich">
      富文本
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
                list:[],
                info:{},
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
              identityCd:'identity30'
            }
            this.info=await this.api.orgInfoBasic(param)
            console.log(this.info)

          },
        }

    }
</script>

<style scoped lang="less">
  .baseInfo3{

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
    }
    .rich{
      padding: 0.09rem 0.3rem;
    }
  }


</style>
