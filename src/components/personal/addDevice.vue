<template>
<!--    添加设备-->
    <div class="addProject">
        <pen-header2 title="添加设备" @leftClick="leftClick"></pen-header2>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>设备类型:：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="typeList"  @change="chooseType" place="选择设备类型"></mob-select>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>商品名称：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="skuName" :list="cid3List"  @change="chooseProduct" place="选择设备具体商品"></mob-select>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>商品数量：</p></van-col>
                        <van-col span="17" >
                            <van-stepper v-model="num" />
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
                typeList:[],//类型列表

                cid3List:[],
                cid1:'',
                cid3:'',
                num:1,
                cid3Item:'',//cid3List选中项

            }
        },
         mounted(){

             this.getTypeList()
        },
        components:{
            penHeader2,
            mobSelect,
            bButton2
        },
        methods:{
            rightClick(){
                if(!this.cid3){
                    Toast('请选择商品')

                    return
                }

                let param={
                    goodsId: this.cid3Item.goodsId,      //商品id
                    skuId: this.cid3Item.skuId,      //sku id
                    deviceType: this.cid3Item.attrDesc,    // 设备型号
                    attrDesc:this.cid3Item.attrDesc, //规格名称
                    deviceSupply: this.cid3Item.supplier,  // 供应商
                    cid1:  this.cid3Item.tid,
                    cid2:  this.cid3Item.sid,
                    cid3: this.cid3Item.catId,
                    cids: this.cid3Item.tid+','+this.cid3Item.sid+','+this.cid3Item.catId,
                    cd: this.cid3Item.cd,   //编码
                    nm: this.cid3Item.nm,
                    num: this.num,
                    imgUrl: this.cid3Item.imgUrl,
                    price:this.cid3Item.mktPrice ,  //最低价格
                    id:this.cid3Item.id

                }
                console.log(param)
                this.$emit('rightClick',param)


            },
            leftClick(){
                this.$emit("leftClick")
            },
            //选中类型
            chooseType(e){
                this.cid1=e.id
                this.getCid3List()
            },
            //选中项目名称
            chooseProduct(val){
                this.cid3=val.id
                this.cid3Item=val

            },
            //获取类型列表
            async getTypeList(){
                let qry = this.query.new()
                let res=await this.api.shipCatList(this.query.toEncode(qry))
                console.log("类型列表")
                console.log(Object.entries(res.data))
                this.typeList = []
                for(let [k,v] of Object.entries(res.data)){
                    this.typeList.push({
                        nm:k,
                        id:v[0].tid,

                    })
                }
            },
            async getCid3List(){  //获取三级列表
                let qry = this.query.new()
                // this.query.toW(qry,'pid',this.cid2,'EQ')
                console.log(this.cid1)
                let param={
                    tid:this.cid1,
                }
                this.cid3List=await this.api.designCatList(this.query.toEncode(qry),param)
                this.cid3List.forEach((item,index)=>{
                    item.skuName=item.nm+'['+item.attrDesc+']'
                    this.$set(this.cid3List,index,this.cid3List[index])
                })

                console.log('子组件——三级列表')
                console.log(this.cid3List)
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
