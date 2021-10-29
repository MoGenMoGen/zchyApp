<template>
   <div class="search-cont">
       <div class="search">
           <img :src="icSearch">
           <input :placeholder="placeText" v-model="textValue">
       </div>
   </div>
</template>

<script>
    export default {
        name: "searchView",
        data(){
            return{
                icSearch:'https://sinovat.oss-cn-shanghai.aliyuncs.com/9c0c92763b324ec0852f0d7d4581b9fb_ic-search.png',
                textValue:''
            }
        },
        props:{
            //=================此处一定要用value
            value: {
                type: String
            },
            placeText:{
                type: String,
                default:'搜索'
            }
        },
        watch:{

            textValue(newVal){

                this.$emit('input', newVal)

            }

        },
    }
</script>

<style scoped lang="less">
    .search-cont{
        padding: 0.3rem;
        background: #efefef;
        z-index: 10;
        .search{
            width: 100%;
            border-radius: 0.3rem;
            background: white;
            height: 0.7rem;
            display: flex;
            align-items: center;
            img{
                margin-left: 0.3rem;
                margin-right: 0.1rem;
                width: 0.4rem;
            }
            input{
                color: #333333;
                display: flex;
                align-items: center;
            }
            input::-webkit-input-placeholder {
                color: #B8B8B8;
            }

            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #B8B8B8;
            }

            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #B8B8B8;
            }

            input:-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                color: #B8B8B8;
            }
        }
    }



</style>
