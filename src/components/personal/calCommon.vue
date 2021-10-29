<template>
    <div class="calCommon">
        <van-row @click="show=true" class="row">
            <van-col span="20" offset="1">
                <p class="text">{{text}}</p>
            </van-col>
            <van-col span="2" ><van-icon name="calendar-o" /></van-col>
        </van-row>
        <van-calendar v-model="show" :max-date="maxDate" :min-date="minDate"  @confirm="onConfirm" />
    </div>
</template>

<script>
    export default {
        name: "calCommon",
        data(){
            return{
                text:'',//日历显示的值
                show:false,//显示日历组件
                // minDate:new Date(1950, 1, 1),
                // maxDate: new Date(2099, 1, 31),

            }
        },
        props:{
            minDate:{
                type:Date ,
                default:()=>{
                    return new Date(1950, 2, 2)
                }
            },
            maxDate:{
                type:Date ,
                default:()=>{
                    return new Date(2099, 2, 22)
                }
            }
        },
        methods:{
            //设置默认值
            setDefault(nm){
                this.text=nm
            },


            onConfirm(e){
                this.show=false
                console.log(" 日历的值")
                console.log(e)
                this.text=`${this.formatDate(e)}`
                this.$emit('change',this.text)
            },
            formatDate(date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
        }
    }
</script>

<style scoped lang="less">
    .calCommon{
        width: 100%;
        box-sizing: border-box;
        .row{
            border-radius: 5px;
            border: 1px solid rgba(0,0,0,0.1);
            padding: 0.12rem 0;
            .text{
                color: #343434;
            }
        }

    }

</style>
