<template>
    <div class="shopDetail">
      <div class="detailBox shopInfo">
        <div @click="toPage('storeHome.html?id='+info.shopId)">
          <div class="img">
            <van-image
                    round
                    fit="cover"
                    width="1.11rem"
                    height="1.11rem"
                    :src="info.shopImg"
            />
          </div>

          <p>{{info.shopNm}}
            <span>{{follow}}人关注</span>
          </p>
          <van-icon name="arrow" />
        </div>
        <ul>
          <li v-for="item in list1" :key="item.goodsId" @click="toDetail(item.goodsId)">
            <van-image  :height="screenWidth*0.3" width="100%" :src="item.fmImgUrl" fit="cover"  v-lazy="item.img"/>
            <p class="nm">{{item.nm}}</p>
          </li>
        </ul>
        <button @click="toPage('storeHome.html?id='+info.shopId)"><img :src="shopImg"/>进店逛逛</button>
      </div>
      <p class="title"><span></span>为您推荐<span></span></p>
      <pro-list :list="list2"></pro-list>
      <p class="title" style="margin-top: 0.6rem;"><span></span>看了又看<span></span></p>
      <pro-list :list="list3"></pro-list>
    </div>
</template>

<script>
    import shopImg from '@/assets/img/trading/店铺.png'
    import list from '@/components/trade/proList'
    import ProList from "../trade/proList";
    export default {
      props:['info'],
      data(){
          return{
              shopImg,
              list1:[],
              list2:[],
              list3:[],
              screenWidth:'',
              follow:0,
          }
      },
      components:{ProList, list},
      computed:{

      },
      mounted(){
          this.screenWidth = document.body.offsetWidth;
          window.addEventListener('resize',function(){
              that.screenWidth = document.body.offsetWidth;
          })
          if(this.info){
              if(this.info.follow>10000){
                  this.follow = parseInt(this.info.follow/10000)+'万'
              }else {
                  this.follow = this.info.follow
              }
          }
      },
      watch:{
        info(){
          if(this.info.follow>10000){
              this.follow = parseInt(this.info.follow/10000)+'万'
          }else {
              this.follow = this.info.follow
          }
          this.getData()
        },
      },
      methods:{
        async getData(){
            let data = await this.api.proDetailChoice(this.info.id)
            this.list1 = data.slice(0,3)
            let qry = this.query.new()
            this.query.toW(qry,'catId',this.info.catId,'EQ')
            this.query.toW(qry,'ship',0,'EQ')
            this.list2 = await this.api.catRand(this.query.toEncode(qry),4)
            this.list3 = await this.api.proDetailLook(this.info.id)
						this.list3.forEach((item,index)=>{
							item.goodsId=item.id
							this.$set(this.list3,index,this.list3[index])
						})
            this.list3 = this.list3.slice(0,4)
        },
        toPage(url){
           this.until.href(url)
        }
      }
    }
</script>

<style lang="less" scoped>
  @import url("../../assets/css/mobile.less");
  .shopDetail{
    .shopInfo{
      background-color: #ffffff;
      border-radius: 0.2rem;
      margin-bottom: 0.6rem;
      padding: 0.36rem;
      >div{
        display: flex;
        display: -webkit-flex;
        align-items: center;
        width: 100%;
        .img{
          width: 1.11rem;
          height: 1.11rem;
          border-radius: 50%;
          background: #ffffff;
        }
        p{
          flex: 1;
          color: #343434;
          font-size: 0.3rem;
          padding: 0 0.29rem;
          span{
            display: block;
            font-size: 0.22rem;
            color: #666666;
          }
        }
      }
      ul{
        overflow: hidden;
        padding: 0.2rem 0;
        li{
          float: left;
          width: 30%;
          margin-right: 5%;
          text-align: center;
          &:last-of-type{
            margin-right: 0;
          }
        }
      }
      button{
        border: 1px solid #666666;
        width: 2.16rem;
        height: 0.63rem;
        border-radius: 0.31rem;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        margin: 0.1rem auto;
        color: #343434;
        img{
          margin-right: 0.13rem;
          width: 0.268rem;
        }
      }
    }
    .title{
      display: flex;
      display: -webkit-flex;
      font-size: 0.3rem;
      color: #343434;
      align-items: center;
      width: 100%;
      justify-content: center;
      margin-bottom: 0.3rem;
      span{
        width: 1rem;
        height: 1px;
        background: rgba(0,0,0,0.1);
        margin: 0 0.2rem;
      }
    }
  }

</style>
