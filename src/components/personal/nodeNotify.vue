<template>
<!--    添加船舶-->
    <div class="addProject">
        <pen-header2 title="节点通知" @leftClick="leftClick"></pen-header2>
        <div class="body">
            <div class="list-item" >
                <van-row class="row" type="flex">
                    <van-col span="6"><p>标题:</p></van-col>
                    <van-col span="18"><p>{{title}}</p></van-col>
                </van-row>
                <van-row class="row" type="flex" aline="center">
                    <van-col span="6"><p>类型:</p></van-col>
                    <van-col span="18"> <mob-select text="nm" :list="noticeType"  @change="getNotice"></mob-select></van-col>
                </van-row>
                <van-row class="row" type="flex">
                    <van-col span="6"><p>内容:</p></van-col>
                    <van-col span="18"><textarea v-model="noticeContent.cont"  placeholder="请输入内容"></textarea></van-col>
                </van-row>
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
                pageNo:1,
                pageSize:15,
                finished:false,//标记是否已经加载完
                currentRole:'',//当前角色
                searchText:'',
                loading:false,
                immediate:false,//
                noticeType:[],//通知类型
                noticeContent:{
                    typesCd:'',
                    cont:'',
                    rmks:'',
                    title:'',
                },
                ceshi:{
                    a:'666',
                    b:'77777'
                }

            }
        },
        props:{
          title:{
              type:String,
          }
        },
         async mounted(){
             this.currentRole=JSON.parse(this.until.loGet('currentRole'))
             this.noticeType = await this.api.dataDictionary('DOCS_NOTICE_TYPE')

        },
        components:{
            penHeader2,
            mobSelect,
            bButton2
        },
        methods:{

            leftClick(){
                this.$emit("leftClick")
            },

            getNotice(item){
                console.log(item)
                this.noticeContent.typesCd=item.cd
            },
            rightClick(){
                this.noticeContent.title=this.title
                console.log(this.noticeContent)
                console.log("测试。。。")
                console.log(this.ceshi)
                if(!this.noticeContent.typesCd){
                    Toast("请选择类型")
                    return
                }
                this.api.shipNotice(this.noticeContent).then(()=>{
                   Toast("提交成功")
                    let this_=this
                    setTimeout(()=>{
                        this_.$emit("leftClick")
                    },1500)

                })
            }



        }
    }
</script>

<style scoped lang="less">

    .body{
        font-size: 0.29rem;
        background:@backgroundColor;
        padding: 0.2rem 0.2rem;
        .list-item{

            border-radius: 5px;
            position: relative;
            width: 100%;
            margin-bottom: 0.2rem;
            padding: 0.15rem 0;
            background: white;
            .row{
                padding: 0.1rem 0.40rem;
                color: #343434;
                textarea{
                    width: 90%;
                    height:2.3rem;
                    border: 1px solid #DDDDDD;
                    padding: 0.2rem;
                }
            }
        }
    }


</style>
