<template>
<!--	消息详情-->
    <div id="container">

        <pen-header title="船舶档案"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="line1" style="display: none">
                    <p  v-for="(item,index) in tab1" :key="item.id"  @click="chooseTab1(item,index)">
                        <span :class="{active: tab1Id==item.id}">{{item.nm}}</span>
                    </p>
                </div>
                <div class="line2" v-if="!showWeiBao" style="display: none">
                    <p v-for="(item,index) in selectList" :key="item.id"   @click="chooseTab2(item,index)">
                        <span :class="{active2: tab2Id==item.id}">{{item.nm}}</span>
                    </p>
                </div>
                <div  v-else>
                    <weibao/>
                </div>
                <div style="padding-bottom: 0.2rem" v-if="!showWeiBao">
                    <base-info1 v-if="tab2Id==20" :info="shipBaseInfo1"></base-info1>
                    <ship-equip :id="id" v-if="tab2Id==21"></ship-equip>
                    <certificate v-if="tab2Id==22" ></certificate>
                    <base-info2 v-if="tab2Id==10 " ></base-info2>
                    <fangansheji v-show="(tab2Id==11 || tab2Id==12 || tab2Id==13) && from==1  " :title="designTitle" ref="fangan"></fangansheji>
                    <sheji-edit v-if="(tab2Id==11 || tab2Id==12 || tab2Id==13) && from==2 && currentRole.identityCd=='identity20'" :title="designTitle" :flowCd="tab2Id"></sheji-edit>




                    <base-info3 v-if="tab2Id==30"></base-info3>
                    <jianzaoguocheng v-if="tab2Id==31 && buildW==1 "></jianzaoguocheng>
                    <build-edit v-if="tab2Id==31  && buildW==2 && currentRole.identityCd=='identity30' " ></build-edit>



                    <jianlijianzao v-if="tab2Id==32"></jianlijianzao>
                    <jianyanjiance v-if="tab2Id==33"></jianyanjiance>
                    <yunjianzao v-if="tab2Id==34"></yunjianzao>



                </div>


            </div>
            <div class="list-cont" style="margin-top: 0.2rem;padding-bottom: 0.2rem" v-if="tab2Id==20">
                <base-info11 v-if="tab2Id==20" :info="shipBaseInfo1"></base-info11>
            </div>
            <div class="list-cont" style="margin-top: 0.2rem;padding-bottom: 0.2rem" v-if="tab2Id==20">
                <base-info12 v-if="tab2Id==20" :info="shipBaseInfo1" :paraList="paraList"></base-info12>
            </div>


        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import baseInfo1 from "../../../components/personal/shipInfo/baseInfo1s";
    import baseInfo2 from "../../../components/personal/shipInfo/baseInfo2";
    import baseInfo11 from "../../../components/personal/shipInfo/baseInfo11";
    import baseInfo12 from "../../../components/personal/shipInfo/baseInfo12";
    import certificate from "../../../components/personal/shipInfo/certificate";
    import baseInfo3 from "../../../components/personal/shipInfo/baseInfo3";
    import jianzaoguocheng from "../../../components/personal/shipInfo/jianzaoguocheng";
    import jianyanjiance from "../../../components/personal/shipInfo/jianyanjiance";
    import jianlijianzao from "../../../components/personal/shipInfo/jianlijianzao";
    import yunjianzao from "../../../components/personal/shipInfo/yunjianzao";
    import weibao from "../../../components/personal/shipInfo/weibao";
    import shipEquip from "../../../components/shipEquip";
    import fangansheji from "../../../components/personal/shipInfo/fangansheji";
    import shejiEdit from "../../../components/personal/shipInfo/shejiEdit";
    import buildEdit from "../../../components/personal/shipInfo/buildEdit";

    import {mixDtl} from "../mixins/mixDtl"
    export default {
        mixins:[mixDtl],
        data() {
            return {
                value: '',
                tab1Id:-1,//第一个标签页选中
                tab2Id:-1,//第二个标签页选中
                tabIndex:0,//第二个标签页底部边框偏移
                selectList:[],//选中列表
                showWeiBao:false,
                designTitle:'方案设计',//设计标题
                id:"",
                tab1:[
                    {
                        id:0,
                        nm:'船舶资料',
                    },
                    // {
                    //     id:1,
                    //     nm:'设计档案',
                    // },
                    // {
                    //     id:2,
                    //     nm:'建造档案',
                    // },
                    // {
                    //     id:3,
                    //     nm:'维保记录',
                    // },
                ],
                tab21:[
                    {
                        id:10,
                        nm:'基本信息',
                    },
                    {
                        id:11,
                        nm:'方案设计',
                    },
                    {
                        id:12,
                        nm:'送审设计',
                    },
                    {
                        id:13,
                        nm:'生产设计',
                    },
                ],
                tab22:[
                    {
                        id:20,
                        nm:'基本信息',
                    },
                    // {
                    //     id:21,
                    //     nm:'船舶设备',
                    // },
                    // {
                    //     id:22,
                    //     nm:'检验证书',
                    // },
                ],
                tab23:[
                    {
                        id:30,
                        nm:'基本信息',
                    },
                    {
                        id:31,
                        nm:'建造过程',
                    },
                    {
                        id:32,
                        nm:'建造监理',
                    },{
                        id:33,
                        nm:'检验检测',
                    },
                    {
                        id:34,
                        nm:'云监造',
                    },
                ],
                //tab10显示的值
                shipBaseInfo1:'',//船舶基本信息
                paraList:'',//技术参数列表
                certificate:'',//检验检疫证书
                from:1,//从哪里进入，默认是1，如果是2，则是在设计院中添加设计
                buildW:1,///从哪里进入，默认是1，如果是2，则是在船舶档案中添加设计

            };
        },
        components:{
            penHeader,
            baseInfo1,
            baseInfo11,
            baseInfo12,
            certificate,
            baseInfo3,
            jianzaoguocheng,
            jianyanjiance,
            jianlijianzao,
            yunjianzao,
            baseInfo2,
            weibao,
            shipEquip,
            fangansheji,
            shejiEdit,
            buildEdit

        },
        async created(){

        },
        watch:{
            tab2Id(newVal){
                if(newVal==11 || newVal == 12 || newVal==13 ){
                    console.log("调用接口。。。。"+newVal)
                    this.$refs.fangan.getInfo(newVal)
                }
            }
        },
        mounted(){
            this.id= this.until.getQueryString('id')
            let f=this.until.getQueryString('from')
            let buildW=this.until.getQueryString('buildW')
            if(f){
                this.from=f
            }
            if(buildW){
                this.buildW=buildW
            }
            console.log("from的值："+this.from)
            console.log(this.id)
            this.chooseTab1(this.tab1[0],0)
            this.shipInfoBasic()

        },
        methods: {
            chooseTab1(item,index){
                if(item.id!=this.tab1Id){
                    this.tab1Id=item.id
                    if(index==0){
                        this.selectList=this.tab22
                        this.showWeiBao=false
                        this.chooseTab2(this.selectList[0],0)
                    }else if(index==1){
                        this.selectList=this.tab21
                        this.chooseTab2(this.selectList[0],0)
                        this.showWeiBao=false
                    }else if(index==2){
                        this.selectList=this.tab23
                        this.chooseTab2(this.selectList[0],0)
                        this.showWeiBao=false
                    }else if(index==3){
                        this.tab2Id=0
                        this.showWeiBao=true
                    }

                }
            },
            chooseTab2(item,index){
                if(item.id!=this.tab2Id){
                    this.tab2Id=item.id
                    this.tabIndex=index
                    this.designTitle=item.nm
                    // if(this.tab2Id==34){
                    //
                    //     this.api.getVideoUrl("121b6f4e237c4a889df93a060d428fa0").then(res=>{
                    //         console.log("云监造")
                    //         console.log(res)
                    //         this.until.href(res)
                    //     })
                    // }

                }
            },
            //船舶基本信息
            async shipInfoBasic(){
                this.shipBaseInfo1=await this.api.shipInfoBasic(this.id)
                console.log(this.shipBaseInfo1)
                let dataList=JSON.parse(this.shipBaseInfo1.mainParams)
                this.paraList=dataList.args

            },

        }

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
                background: white;
                position: relative;
                padding: 0.2rem 0 0 0;

                .line1{
                    width: 100%;
                    display: flex;
                    background: white;
                    height: 0.8rem;
                    align-items: center;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    p{
                        font-size: 0.285rem;
                        width: 25%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        /*对所有属性过渡0.2s*/
                        transition: all 0.2s;
                        color: #666666;
                        span{
                            height: 100%;
                            display: flex;
                            align-items: center;
                        }
                        &:hover{
                            cursor: pointer;
                        }
                    }
                }
                .line2{
                    background: white;
                    margin-top: 0.1rem;
                    width: 100%;
                    display: flex;
                    padding: 0.14rem 0;
                    align-items: center;
                    position: relative;
                    justify-content: space-around;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    margin-bottom: 0.2rem;
                    p{
                        font-size: 0.25rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: #999999;
                        /*对所有属性过渡0.2s*/
                        &:hover{
                            cursor: pointer;
                        }
                    }



                }


            }
        }



	}


    .active{
        color: #333333;
        border-bottom: 2px solid #2778BE !important;
        font-weight: bold;
    }
    .active2{
        color: white;
        background: #2778BE;
        border-radius: 0.30rem;
        padding: 0.05rem 0.2rem;
    }

</style>
