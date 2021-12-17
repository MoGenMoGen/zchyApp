<template>
<!--  云监造-->
    <div  class="yunjianzao">
        <div class="body">
            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"
                           :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id"
                         :class="{active:selectId==item.id}">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="7"><p>所属机构：</p></van-col>
                            <van-col span="17"><p>{{item.orgNm}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="7"><p>云监造：</p></van-col>
<!--                            <van-col span="17"><p>{{item.cameraNm}}</p></van-col>-->
                            <van-col span="17"><p class="yun-btn" @click="toDetail(item)"><img :src="icYjz"><span>查看</span></p></van-col>

                        </van-row>
                        <van-row class="row"  type="flex">
                            <van-col span="7"><p>附件：</p></van-col>
                            <van-col span="17">
                                <p style="word-break: break-word;margin-bottom: 0.2rem" v-for="j in item.fileList2" @click.stop="toDown(j)">
                                    <img :src="j.img"> {{j.fileNm}}
                                </p>
                            </van-col>

                        </van-row>



                    </div>
                </van-list>
            </div>
        </div>
    </div>
</template>

<script>
    import icYjz from '../img/摄像头.png'
    export default {
        name: "yunjianzao",
        data(){
            return{
                icYjz,
                excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
                ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
                word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
                pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
                pageNo:1,
                pageSize:15,
                finished:false,//标记是否已经加载完
                currentRole:'',//当前角色
                searchText:'',
                loading:false,
                immediate:false,//
                list:[],
                selectId:-1,//选中id
            }
        },
        mounted(){
            this.currentRole=JSON.parse(this.until.loGet('currentRole'))
            this.getList()
        },
        methods:{
            //下载
            toDown(j){
                this.$bridge.callHandler('h5_load',j.url,res=>{

                })
            },
            async	getList(){
                let id=this.until.getQueryString("id")
                let qry = this.query.new()
                this.query.toP(qry,this.pageNo,this.pageSize)
                this.query.toW(qry,"docsIds",id,"LK")
                let res =await  this.api.myVideoList(this.query.toEncode(qry))
                res.data.list.forEach(item=>{
                    let fileList=  item.attachment.split(",")
                    let fileList2=[]
                    fileList.forEach(v=>{
                        let type=v.split('.')[v.split('.').length - 1]
                        let nmList=v.split('.com/')  //分割出url后的内容
                        let nm=""
                        nm=nmList[nmList.length-1]
                        let nmlist2=nm.split("_")
                        nm=nmlist2[1]
                        if(nmlist2.length>2){
                            nm +=nmlist2[2]
                        }
                        if(type=='pdf'){
                            fileList2.push({url:v,img:this.pdf,'fileNm':nm})
                        }else if(type=='doc'||type=='docx'){
                            fileList2.push({url:v,img:this.word,'fileNm':nm})
                        }else if(type=='ppt'||type=='pptx'){
                            fileList2.push({url:v,img:this.ppt,'fileNm':nm})
                        }else if(type=='xls'||type=='xlsx'){
                            fileList2.push({url:v,img:this.excel,'fileNm':nm})
                        }else{
                            fileList2.push({url:v,img:v,'fileNm':nm})
                        }
                    })
                    this.$set(item,'fileList2',fileList2)

                })
                this.list.push(...res.data.list)
                // 加载状态结束
                this.finished = this.list.length >= res.page.total
                this.loading = false;
                this.pageNo++

            },
            onLoad(){
                this.getList()

            },
            toDetail(item){
                   this.selectId=item.id
                    window.console.log(this.selectId)


                    this.api.getVideoUrl(item.cameraId).then(res=>{
                        console.log("云监造")
                        console.log(res)
                        this.until.href(res)
                    })
            }
        }

    }
</script>

<style scoped lang="less">
    .yunjianzao{
        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            .list-cont{
                border-radius: 5px;
                background: white;
                .list-item{
                    position: relative;
                    width: 100%;

                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 0.15rem 0;
                    .row{
                        padding: 0.08rem 0.40rem;
                        color: #343434;
                        img{
                            width: 0.4rem;
                        }
                    }

                }
            }
        }
    }
    .active{

        background: rgba(0,0,0,0.1) !important;
    }


    .yun-btn{
        border:  1px solid #2778BE;
        padding: 0.05rem 0.1rem;
        color:  #2778BE;
        width: fit-content;
        border-radius: 5px;
        display: flex;
        align-items: center;
        span{
            margin-left: 0.1rem;
        }

    }
</style>
