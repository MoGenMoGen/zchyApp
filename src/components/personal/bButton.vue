<template>
<!--    底部按钮-->
    <div class="bButton">
        <div class="cont" @click="toClick">
           <p>{{title}}</p>
        </div>
        <div class="place">

        </div>
    </div>
</template>

<script>
    export default {
        name: "bButtom",
        props:{
            title:{
                type:String,
                default:"标题"
            }
        },
        methods:{
            toClick(){
                this.$emit("click")
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
            justify-content: center;
            height: 1rem;
            background: #2778BE;
            color: white;
            font-size: 0.32rem;
            z-index: 10;
            p{
                text-align: center;
            }
        }


        .place{
            height: 1rem;
        }
    }

</style>
