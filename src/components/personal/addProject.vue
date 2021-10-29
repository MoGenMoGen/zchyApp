<template>
<!--    添加项目工程-->
    <div class="addProject">
        <pen-header2 title="添加项目工程" @leftClick="leftClick"></pen-header2>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>项目工程名称：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="projectList"  @change="chooseProject" place="选择项目工程"></mob-select>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>项目名称：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="productList"  @change="chooseProduct" place="选择项目"></mob-select>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>规格型号：</p></van-col>
                        <van-col span="17" >
                            <input v-model="currentInfo.models" placeholder="请输入" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>数量：</p></van-col>
                        <van-col span="17" >
                            <input v-model="currentInfo.num" placeholder="请输入" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>单价(元)：</p></van-col>
                        <van-col span="17" >
                            <input v-model="currentInfo.unitPrice" placeholder="请输入" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>单位：</p></van-col>
                        <van-col span="17" >
                            <input v-model="currentInfo.unitNm" placeholder="请输入" >
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
                projectList:[],//工程名称
                productList:[],//项目名称
                currentInfo:{
                    unitPrice:'',
                    unitNm:'',
                    models:'',

                },
                projCatIdf:'',
                projectInfo:'',
            }
        },
         mounted(){
           this.api.xuanxingProjectList().then(res=>{
               this.projectList =res
           })
             this.getProduct('')
        },
        components:{
            penHeader2,
            mobSelect,
            bButton2
        },
        methods:{
            rightClick(){
                if(this.until.trim(this.currentInfo.unitNm)==''){
                    Toast('请输入单位')
                    return
                }
                if(this.until.trim(this.currentInfo.models)==''){
                    Toast('请输入规格')
                    return
                }
                if(this.until.trim(this.currentInfo.num.toString())==''){
                    Toast('请输入数量')
                    return
                }
                if(this.until.trim(this.currentInfo.unitPrice.toString())==''){
                    Toast('请输入单价')
                    return
                }

                this.$set(this.currentInfo,'amt',(this.currentInfo.num*this.currentInfo.unitPrice/10000).toFixed(2))
                this.$emit("rightClick",this.projectInfo,this.currentInfo)

            },
            leftClick(){
                this.$emit("leftClick")
            },
            //选中项目工程名称
            chooseProject(e){
               this.projCatIdf=e.id
                this.projectInfo=e
                this.$set(this.projectInfo,'selected',true)
            },
            //选中项目名称
            chooseProduct(val){
                console.log("999999999999999999999999999999")
                console.log(val)
                this.currentInfo=val

                if(val){

                    this.currentInfo.models = val.attrDesc
                    this.currentInfo.unitPrice = val.origPrice
                    this.currentInfo.unitNm = val.unitNm

                }else {

                    this.currentInfo.models = ''
                    this.currentInfo.unitPrice = ''
                    this.currentInfo.unitNm = ''
                }
            },
            //获取设备列表
            async getProduct(val){
                let qry = this.query.new()
                this.query.toW(qry,'nm',val,'LK')
                this.productList = await this.api.xuanxingProductList(this.query.toEncode(qry))

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
