<template>
    <!--    底部按钮-->
    <div class="bButton">
        <div class="cont" >
            <p @click="toClick1">{{leftText}}</p>
            <p @click="toClick2">{{rightText}}</p>
        </div>
        <div class="place">

        </div>
    </div>
</template>

<script>
    export default {
        name: "bButtom2",
        props:{
            leftText:{
                type:String,
                default:"标题1"
            },
            rightText:{
                type:String,
                default:"标题2"
            }
        },
        methods:{
            toClick1(){
                this.$emit("leftClick")
            },
            toClick2(){
                this.$emit("rightClick")
            }
        }
    }
</script>

<style scoped lang="less">
    .bButton{

        .cont{
            width: 100%;
            position: fixed;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;

            background: #2778BE;
            color: white;
            font-size: 0.32rem;
            z-index: 100;
            p{
                text-align: center;
                height: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            p:nth-of-type(1){
                flex: 1;
                background: white;
                color: #999999;
            }
            p:nth-of-type(2){
                flex: 1;
                background: #2778BE;
                color: white;
            }
        }


        .place{
            height: 1rem;
        }
    }

</style>
