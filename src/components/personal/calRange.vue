<template>
<!--    日历区间选择-->
   <div class="search-cont">
       <div class="search" @click="toShow">
           <img :src="icSearch" class="icSearch">
           <input :placeholder="placeText" v-model="textValue" disabled>
           <img :src="icDel" class="icDel" v-if="textValue.length>0" @click.stop="toDel">
       </div>
<!--       设置 type 为 range 后可以选择日期区间，此时 confirm 事件返回的 date 为数组结构，数组第一项为开始时间，第二项为结束时间。-->
       <van-calendar v-model="showCal"  type="range"  @confirm="onConfirm"  :min-date="minDate" :max-date="maxDate"/>
   </div>
</template>

<script>
    export default {
        name: "searchView",
        data(){
            return{
                icSearch:'https://sinovat.oss-cn-shanghai.aliyuncs.com/9c0c92763b324ec0852f0d7d4581b9fb_ic-search.png',
                icDel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/3e11798cc163430a9c4c053560929e99_delete.png',
                textValue:'',
                showCal:false,
                minDate: new Date(1900, 0, 1),
                maxDate: new Date(2099, 0, 31),
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
        methods:{
            toDel(){
              this.textValue=''
            },
            formatDate(date) {

                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            //2020-09-03,2020-09-29
            onConfirm(date) {
                this.showCal = false;
                const [start, end] = date;
                console.log("日历选择返回")
                this.textValue = `${this.formatDate(start)} , ${this.formatDate(end)}`

            },
            toShow(){
                console.log("。。。。")
                this.showCal=true
            }
        }
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
            position: relative;
            .icSearch{
                margin-left: 0.3rem;
                margin-right: 0.1rem;
                width: 0.4rem;
            }
            .icDel{
                position: absolute;
                right: 0.3rem;
                width: 0.3rem;
                height: 0.3rem;
            }
            input{
                color: #333333;
                display: flex;
                align-items: center;
                background: none;
                width: 100%;
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
