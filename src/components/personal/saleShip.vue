<template>
<!--    出售出阿伯-->
    <div class="addProject">
        <pen-header2 title="出售船舶" @leftClick="leftClick"></pen-header2>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="6"><p>联系人：</p></van-col>
                        <van-col span="18" >
                            <input v-model="form.linkman" placeholder="请输入联系人" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="6"><p>联系电话：</p></van-col>
                        <van-col span="18" >
                            <input v-model="form.phone" placeholder="请输入联系电话" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="6"><p>出售金额：</p></van-col>
                        <van-col span="18" >
                            <input v-model="form.salesAmt" placeholder="请输入出售金额" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="6"><p>备注：</p></van-col>
                        <van-col span="18" >
                            <input v-model="form.rmks" placeholder="请输入备注" >
                        </van-col>
                    </van-row>


                </div>
            </div>
        </div>
        <b-button2 left-text="取消" right-text="确认" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
    </div>
</template>

<script>
    import penHeader2 from "./penHeader2";
    import mobSelect from "./shipInfo/mobSelect";
    import bButton2 from "./bButton2";
    import {Toast} from 'vant'
    export default {
        name: "addProject",
        data(){
            return{

                form:{
                    linkman:'',
                    phone:'',
                    salesAmt:'',
                    rmks:'',

                },
                projCatIdf:'',
                // projectInfo:'',
            }
        },
         mounted(){


        },
        props:{
            projectInfo:{
                type:Object,
            },
            productInfo:{
                type:Object,
            }
        },
        components:{
            penHeader2,
            mobSelect,
            bButton2
        },
        methods:{
            rightClick(){
                if(this.until.trim(this.form.linkman)==''){
                    Toast('请输入联系人')
                    return
                }

                if(this.until.trim(this.form.phone.toString())==''){
                    Toast('请输入联系电话')
                    return
                }
                if(this.until.trim(this.form.salesAmt.toString())==''){
                    Toast('请输入金额')
                    return
                }

                this.$emit("rightClick",this.form)

            },
            leftClick(){
                this.$emit("leftClick")
            },



        }
    }
</script>

<style scoped lang="less">

    .body{
        font-size: 0.29rem;
        background:@backgroundColor;
        padding: 0.2rem 0.2rem;
        .list-cont{
            border-radius: 5px;

            .list-item2 {
                position: relative;
                background: white;
                border-radius: 5px;
                margin-bottom: 0.2rem;
                padding: 0.15rem 0.2rem;

                .row{
                    padding: 0.15rem 0.2rem;
                    color: #343434;
                    .radio-group{
                        display: flex;
                        flex-wrap: wrap;
                        .van-radio{
                            width: 50%;
                            padding-bottom: 0.25rem;
                        }
                    }
                }
                .row2{
                    padding: 0.15rem 0.2rem;
                    color: #343434;

                    .btnAdd{
                        width: fit-content;
                        padding: 0.1rem 0.2rem;
                        color: white;
                        background: #2778BE;
                        border-radius:2px;
                        margin: 0 auto;
                    }

                    .rowTitle{
                        width: 80%;
                        display: block;
                        margin: 0 auto;
                    }
                    input{
                        width: 90%;
                        padding: 0.15rem 0.2rem;
                        border: 1px solid #DDDDDD;
                    }
                    textarea{
                        width: 90%;
                        height:2.3rem;
                        border: 1px solid #DDDDDD;
                        padding: 0.2rem;
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

                    textarea::-webkit-input-placeholder {
                        color: #B8B8B8;
                    }

                    textarea::-moz-placeholder {
                        /* Mozilla Firefox 19+ */
                        color: #B8B8B8;
                    }

                    textarea:-moz-placeholder {
                        /* Mozilla Firefox 4 to 18 */
                        color: #B8B8B8;
                    }

                    textarea:-ms-input-placeholder {
                        /* Internet Explorer 10-11 */
                        color: #B8B8B8;
                    }


                }
            }
        }
    }


</style>
