<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="投标详情"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>项目名称:</p></van-col>
                        <van-col span="18" ><p>{{info2.bidNm}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>发布时间:</p></van-col>
                        <van-col span="18" ><p>{{info.publishTm}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>结束时间:</p></van-col>
                        <van-col span="18" ><p>{{info.completeTm}}</p></van-col>
                    </van-row>

                </div>

                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>报名时间:</p></van-col>
                        <van-col span="18" ><p>{{info2.applyTm}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>报价时间:</p></van-col>
                        <van-col span="18" ><p>{{info2.offerTm}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>报价金额:</p></van-col>
                        <van-col span="18" ><p>{{info2.offerAmt}}元</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>上传附件:</p></van-col>
                        <van-col span="18" >
                            <div class="img-cont">
                                <p v-for="(item,index) in fileList" :key="index"><img :src="item.imgUrl"/>{{index+1}}.{{item.nm}}</p>
                            </div>

                        </van-col>
                    </van-row>

                </div>

                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>中标状态:</p></van-col>
                        <van-col span="18" >
                            <p :class="[info.statusCd == 'BID_OFFER_STATUS.60'? 'green':'',info.statusCd == 'BID_OFFER_STATUS.70'? 'red':'']">{{info.statusNm}}</p>

                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="6"><p>评审时间:</p></van-col>
                        <van-col span="18" ><p>{{info.winBidTm}}</p></van-col>
                    </van-row>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import {mixDtl} from "../../person/mixins/mixDtl"
    export default {
		mixins:[mixDtl],
        data() {
            return {
                excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
                ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
                word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
                pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
                fileList:[],
                info2:{

                }
            };
        },
        components:{
            penHeader,


        },
        async created(){

        },
        async mounted() {
            this.info=JSON.parse(this.until.getQueryString("info"))
            console.log("查看详情。。。")
            console.log(this.info)
            this.getDtl()
        },
        methods: {
            async getDtl(){

                let res = await this.api.bidOfferDetail(this.info)
                this.info2 =res.data
                if(this.info2.attachment){
                    let list = this.info2.attachment.split(',')
                    list.forEach(item =>{
                        let type = item.split('.')[item.split('.').length - 1]
                        if(type=='pdf'){
                            this.fileList.push({imgUrl:this.pdf,nm:item.slice(item.indexOf('_') + 1), url: item})
                        }else if(type=='doc'||type=='docx'){
                            this.fileList.push({imgUrl:this.word,nm:item.slice(item.indexOf('_') + 1), url: item})
                        }else if(type=='ppt'||type=='pptx'){
                            this.fileList.push({imgUrl:this.ppt,nm:item.slice(item.indexOf('_') + 1), url: item})
                        }else if(type=='xls'||type=='xlsx'){
                            this.fileList.push({imgUrl:this.excel,nm:item.slice(item.indexOf('_') + 1), url: item})
                        }
                    })
                }


            }



        },

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{

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
                    .row2{
                        padding: 0.15rem 0.2rem;
                        color: #343434;
                        .img-cont{
                            p{
                                width: 100%;
                                display: flex;
                                align-items: center;
                                img{
                                    width: 0.3rem;
                                    margin-right: 0.1rem;
                                }
                            }
                        }




                    }
                }
            }
        }





	}

    .green{
        color: #21AE2B;
    }
    .red{
        color: #FF3E3E;
    }

</style>
