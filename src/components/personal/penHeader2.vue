<template>
<!--    个人中心头部-->
    <div class="penHeader">
        <div class="cont">
            <p>{{title}}</p>
            <van-icon name="arrow-left"  class="arrow-left" @click="onClickLeft"/>
            <img :src="icShare" class="right-icon" @click="onClickRight" v-if="showRight">
        </div>
        <div class="place">

        </div>
    </div>
</template>

<script>
    export default {
        name: "pen-header",
        props:{
            title:{
                type:String,
                default:"标题"
            },
            showRight:{
                type:Boolean,
                default: false
            }
        },
        methods:{
            onClickLeft(){
                this.$emit("leftClick")
            },
            onClickRight(){
                this.$emit("rightClick")
            }
        },
        data(){
            return{
                icShare:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fbf45294bfbe49b0a303229a02132e8a_分享.png',
            }
        }
    }
</script>

<style scoped lang="less">

    .penHeader{

        .cont{
            width: 100%;
            position: fixed;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 1rem;
            background: #2778BE;
            color: white;
            font-size: 0.32rem;
            z-index: 100;
            .arrow-left{
                position: absolute;
                left: 0.23rem;
                top: 50%;
                transform: translateY(-50%);
            }
            .right-icon{
                position: absolute;
                right: 0.23rem;
                top: 50%;
                width: 0.35rem;
                transform: translateY(-50%);
            }
        }


        .place{
            height: 1rem;
        }
    }


</style>

