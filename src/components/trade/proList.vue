<template>
  <div class="proList">
	  <div class="list" v-for="item in list" :key="item.goodsId" @click="toDetail(item.goodsId)">
		  <van-image  :height="screenWidth*0.47" width="100%" :src="item.img?item.img:item.fmImgUrl" fit="cover"  v-lazy="item.img"/>
		  <div class="content">
			  <p class="nm">{{item.nm}}</p>
			  <!--<p class="price">￥<span>{{item.origPrice}}</span></p>-->
			  <p  class="price" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥<span>{{fmoney(item.goodsMinPrice)}}</span></p>
			  <p class="price" v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥<span>{{fmoney(item.goodsMinPrice)}}-{{fmoney(item.goodsMaxPrice)}}</span></p>
			  <p class="price" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</p>
		  </div>
	  </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  export default {
      props:['list'],
    data(){
      return{
          screenWidth:'',
      }
    },
    components: {
    },
    watch:{


    },
    computed: {
		...mapState([
		    'price'
		])
    },
    mounted(){
        this.screenWidth = document.body.offsetWidth;
        window.addEventListener('resize',function(){
            that.screenWidth = document.body.offsetWidth;
        })
    },
    methods:{
		fmoney(s, n) {
		    n = n > 0 && n <= 20 ? n : 2;
		    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
		    var t = "";
		    for (let i = 0; i < l.length; i++) {
		        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		    }
		    return t.split("").reverse().join("") + "." + r;
		},
        toDetail(id){
			this.until.href('shipDetail.html?id='+id)
		}

    }
  }
</script>
<style lang="less">
  @import url("../../assets/css/mobile.less");
  .proList{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
	font-size: 0.24rem;
	.list{
		width: 47%;
		margin: 0 0 0.2rem 2%;
		background: #FFFFFF;
		border-radius: 0.1rem;
		overflow: hidden;
		/*&:nth-of-type(2n+2){*/
			/*margin-right: 0;*/
		/*}*/
		.content{
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			padding: 0.2rem 0.2rem;
			.nm{
				color: #666666;
				flex: 1;
				padding-bottom: 0.1rem;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.price{
				color: @redColor;
				span{
					font-size: 0.24rem;
				}
			}
		}

	}
  }
</style>

