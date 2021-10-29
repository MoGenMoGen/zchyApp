<template>
    <div class="myHeader">
        <p class="left"  @click="onClickLeft">
            <van-icon name="arrow-left" size="25" />
        </p>
        <p class="title">{{title}}</p>
        <div class="right">
            <slot></slot>
        </div>
    </div>
</template>

<script>

    export default {
        props:{
          title:{
              type:String,
              default:''
          },

        },
        data() {
            return {

            };
        },
        components:{
        },
        created(){
        },
        mounted() {
        },
        methods: {
            onClickLeft(){
							if(window.location.href.indexOf('trading/productTrade')>-1){
								window.localStorage.removeItem("productId");
							}
                this.until.back()
            }

        },

    };
</script>
<style lang="less" scoped>
    @import url("../assets/css/mobile.less");
    .myHeader{
        width: 100%;
        background: @themeColor;
        position: relative;
        height: 1rem;
        line-height: 1rem;
        color: #FFFFFF;
        p{
            position: absolute;
            top:0;
            height: 100%;
        }
        .left{
            left: 0.17rem;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .title{
            left:0;
            text-align: center;
            width: 100%;
            height: 100%;
            font-size: 0.36rem;
        }
        .right{
            position: absolute;
            right: 0.27rem;
            text-align: right;
            height: 100%;
        }
    }

</style>
