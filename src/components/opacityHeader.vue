<template>
    <div class="myHeader" :style="{opacity:opacity}">
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
                opacity:0,
            };
        },
        components:{
        },
        created(){
        },
        mounted() {
            console.log('=============')
            window.addEventListener('scroll',this.scrollHandle);//绑定页面滚动事件
        },
        methods: {
            scrollHandle(e){
                let top = e.srcElement.scrollingElement.scrollTop;    // 获取页面滚动高度
                console.log(top);
                this.opacity = top/300>1? 1 : top/300
            },
            onClickLeft(){
                this.until.back()
            }

        },
        beforeDestroy(){
            window.removeEventListener("scroll",this.scrollHandle)
        }
    };
</script>
<style lang="less" scoped>
    @import url("../assets/css/mobile.less");
    .myHeader{
        width: 100%;
        background: @themeColor;
        height: 1rem;
        line-height: 1rem;
        color: #FFFFFF;
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        z-index: 100;
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
