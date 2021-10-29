<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="选型报价详情"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="24"><img class="rowTitle" :src="img1"></van-col>

                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>报价单标题：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.nm" placeholder="请输入标题" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶户籍：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.registry" placeholder="船籍" disabled>
                        </van-col>
                    </van-row>


                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶类型：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.typesNm" placeholder="船舶类型" disabled>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶航区：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.sailingAreaNm" placeholder="船舶航区" disabled>

                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶材质：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.hullMaterialNm" placeholder="船舶材质" disabled>
<!--                            <mob-select text="nm" :list="materialList"  @change="chooseMater"></mob-select>-->
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶总长：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.totalLen" placeholder="船舶总长(m)" type="number" disabled>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>公约船长：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.pactLen" placeholder="公约船长(m)" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶型宽：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.width" placeholder="船舶型宽(m)" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶型深：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.deep" placeholder="船舶型深(m)" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶总吨位：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.tonnage" placeholder="船舶总吨位" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶航速：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.speed" placeholder="船舶航速(kn)" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶定员：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.complement" placeholder="船舶定员(kn)" disabled>
                        </van-col>
                    </van-row>

                </div>
<!--                项目参数详情-->
                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="24"><img class="rowTitle" :src="img2"></van-col>
                    </van-row>


<!--                    项目工程列表-->
                    <div class="list-project" v-for="(item,index) in projectList" :key="index">
                        <van-row class="row3" align="center"  type="flex" style="padding: 0.2rem 0.15rem">
                            <van-col span="12">
                                <p style="display: flex;align-items: center" @click="chooseProject(item)">
                                <img  v-if="item.selected" :src="icCheck" style="display: none">
                                <img  v-else :src="icUnCheck"  style="display: none">
                                    {{item.nm}}
                                </p>
                            </van-col>
                            <van-col span="12"><p style="text-align: right"><span style="color:#FF2525 ">￥</span>{{item.amt}}</p></van-col>
                        </van-row>

                        <van-row class="row3" align="center"  type="flex">
                            <van-col span="22"  class="row3-cont">
                               <div class="row3-left">
                                   <p>项目名称</p>
                                   <p>规格型号</p>
                                   <p>单位</p>
                                   <p>数量</p>
                                   <p>单价(元)</p>
                                   <p>总价(万元)</p>
<!--                                   <p>操作</p>-->
                               </div>
<!--                                项目列表-->
                                <div class="row3-right">
                                    <div class="row3-item" v-for="(j,dex) in item.projItem ">
                                        <p>{{j.nm}}</p>
                                        <p>{{j.models}}</p>
                                        <p>{{j.unitNm}}</p>
                                        <p>{{j.num}}</p>
                                        <p>{{j.unitPrice}}</p>
                                        <p>{{j.amt}}</p>
<!--                                        <p class="row3-opa"><span class="row3-edit" @click="editProduct1(item,j)">编辑</span><span class="row3-divide">|</span><span class="row3-del" @click="toDel(item,j)">删除</span></p>-->
                                    </div>
                                </div>

                            </van-col>
                            <van-col span="2"  ><p class="row3Btn" >添加项目</p></van-col>
                        </van-row>


                    </div>




                </div>
<!--建造材料和成本小计-->
                <div class="list-item2" style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;margin-bottom: 0;">
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="24"><img class="rowTitle" :src="img3"></van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>人工费用：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.labourFee" placeholder="请输入" @input="changeMoney" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>企业管理费用5%：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.manageFee" placeholder="请输入" @input="changeMoney" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>税票7%：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.taxes" placeholder="请输入" @input="changeMoney" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>模具制作费用：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.mouldFee" placeholder="请输入" @input="changeMoney" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>试航费用：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.trialTripFee" placeholder="请输入" @input="changeMoney" type="number" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶检验费：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.surveyFee" placeholder="请输入" @input="changeMoney" type="number" disabled>
                        </van-col>
                    </van-row>


                </div>
                <div  class="list-item2" style="border-top-left-radius: 0;border-top-right-radius: 0;border-top: 1px solid rgba(0,0,0,0.1)">
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="24"><p style="text-align: center">整船预算报价：<span style="color: #E64347;">￥{{form.budget*10000}}</span>元</p></van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex" >
                        <van-col span="24"><p style="color: #999999;font-size: 0.23rem"><span  style="color: #E64347;">注: </span>该船初步方案参考造价约为人民币 {{form.budget}} 万元；此价格不含船级社检验费用，制冷设备及其安装费用。</p></van-col>
                    </van-row>
                </div>

<!--产品整船概算造价-->
                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="24"><img class="rowTitle" :src="img4"></van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">

                        <van-col span="24"><p style="text-align: center;color: #333333">设计、管理和监理费（造价3%)：</p></van-col>

                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="4"><p></p></van-col>
                        <van-col span="16" >
                            <input v-model="form.designOtherFee" placeholder="请输入" type="number" disabled>
                        </van-col>
                        <van-col span="4"><p></p></van-col>
                    </van-row>

                </div>

            </div>
        </div>


<!--        <b-button2 left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>-->

    </div>
</template>

<script>
    import img1 from './img/船舶基本参数.png'
    import img2 from './img/项目参数详情.png'
    import img3 from './img/建造材料和设备成本小计.png'
    import img4 from './img/产品整船概算造价.png'
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../../person/mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
    import multiSelect from "../../../components/personal/multiSelect";
    import calCommon from "../../../components/personal/calCommon";
    import addProject from "../../../components/personal/addProject";
    import addProduct from "../../../components/personal/addProduct";
    import editProduct from "../../../components/personal/editProduct";
    import { Dialog } from 'vant';
    import icCheck from './img/checked.png'
    import icUnCheck from './img/unchecked.png'
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                img1,
                img2,
                img3,
                img4,
                icCheck,
                icUnCheck,
                selectProject:"",//选中工程
                selectProduct:'',//选中项目
                projectList:[],
                form:{
                    orgEnterId: "",
                    nm: "",//报价单名称（选型名称）
                    cid: "",//船舶分类id
                    registry: "",//船舶户籍
                    typesCd: "",//船舶类型
                    sailingAreaCd: "",//船舶航区
                    hullMaterialCd: "",//船舶材质
                    totalLen: "",//船舶长度
                    pactLen: "",//公约总长
                    width: "",//船舶宽度
                    deep: "",//船舶深度
                    tonnage: "",//吨位
                    speed: "",//速度
                    complement: "",  //船舶定员
                    labourFee: '',//人工费用
                    manageFee: '',//企业管理费用
                    taxes: '',//税
                    mouldFee: '',//模具制作费用
                    trialTripFee: '',//试航费用
                    surveyFee: '',//船舶检验费
                    designOtherFee: '', //设计、管理和监理费

                    budget: 0,
                    rmks: "",
                    crtOrgId: "",
                    crtById: "",
                    tntId: "",
                    projectItem: [

                    ]
                },
                imgList:[],//上传图片列表
                fileList:[],
                typeList: [],//船舶类型
                areaList: [],//航区
                materialList: [],//船舶材质


            };
        },
        components:{
            penHeader,
            bButton2,
            calCommon,
            mobSelect,
            multiSelect,
            addProject,
            addProduct,
            editProduct,


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.getInfo()
            this.typeList=await this.api.dataDictionary('SHIP_TYPES')
            this.materialList=await this.api.dataDictionary('HULL_MATERIAL')
            this.areaList=await this.api.dataDictionary('SAILING_AREA')
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					let id=this.until.getQueryString('id')
					window.location.href = window.location.origin+this.serverAddr+'/personal/recordDetail?id='+id
				}
			},
            //获取详情
            async getInfo(){
                this.form = await this.api.xuanxingDetail(this.until.getQueryString('id'))
                this.form.shipProjCatList.forEach((item,index)=>{
                    item.check = true
                    this.$set(this.form.shipProjCatList,index,item)
                })
                this.projectList = this.form.shipProjCatList

            },

            //预算改变
            changeMoney(){
                let amt = this.projectList.filter(item=>item.selected).reduce((total,item)=>{
                    console.log(total)
                    console.log(item)
                    return total+item.amt
                },0)
                this.form.labourFee = this.form.labourFee ? this.form.labourFee : 0
                this.form.manageFee = this.form.manageFee ? this.form.manageFee : 0
                this.form.taxes = this.form.taxes ? this.form.taxes : 0
                this.form.mouldFee = this.form.mouldFee ? this.form.mouldFee : 0
                this.form.trialTripFee = this.form.trialTripFee ? this.form.trialTripFee : 0
                this.form.surveyFee = this.form.surveyFee ? this.form.surveyFee : 0
                this.form.budget =
                    parseFloat(this.form.labourFee)+
                    parseFloat(this.form.manageFee)+
                    parseFloat(this.form.taxes)+
                    parseFloat(this.form.mouldFee)+
                    parseFloat(this.form.trialTripFee)+
                    parseFloat(this.form.surveyFee)+
                    parseFloat(amt)

            },


		    //删除项目,不知道为什么无法更新
            toDel(item,j){
                this.selectProject=item
                this.selectProduct=j

                Dialog.confirm({
                    title: '删除',
                    message: '确认删除'+j.nm,
                })
                    .then(() => {

                        for(let i=0;i<this.selectProject.projItem.length;i++){
                            let item=this.selectProject.projItem[i]
                            if(item.id==j.id){

                                 this.selectProject.projItem.splice(i,1)

                                break
                            }
                        }
                        console.log("待删除元素。。。。")
                        console.log(this.projectList)

                    })
                    .catch(() => {
                        // on cancel
                    });
            },


            chooseProject(item){
              item.selected=!item.selected
            },

            //计算总价
            calTotal(){
                this.projectList.forEach(item =>{
                    item.amt=0
                    item.projItem.forEach(j=>{
                        item.amt=parseFloat(item.amt)+parseFloat(j.amt)
                    })
                })
            },



            //获取类型
            chooseType(e){
                this.form.typesCd=e.cd
            },
            //获取航区
            chooseArea(e){
                this.form.sailingAreaCd=e.cd
            },
            //获取材质
            chooseMater(e){
                this.form.hullMaterialCd=e.cd
            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){

                 if(!this.form.nm){
                     Toast('请输入造型报价标题')
                     return
                 }
                 if(!this.form.registry){
                     Toast('请输入船舶户籍')
                     return
                 }
                 if(!this.form.typesCd){
                     Toast('请选择船舶类型')
                     return
                 }
                 if(!this.form.sailingAreaCd){
                     Toast('请选择船舶航区')
                     return
                 }
                 if(!this.form.hullMaterialCd){
                     Toast('请选择船舶材质')
                     return
                 }
                 if(!this.form.totalLen){
                     Toast('请输入船舶总长')
                     return
                 }

                 this.form.projectItem=this.projectList.filter(item=>item.selected)
                 this.form.orgEnterId = JSON.parse(this.until.loGet('currentRole')).id
                 console.log(this.form)
                this.api.xuanxingAdd(this.form).then(res=>{
                    Toast('添加成功');
                    // setTimeout(() => {
                    //     this.until.back();
                    // }, 1500);
                })
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

                    .list-project{
                        border: 1px solid rgba(0,0,0,0.1);
                        border-bottom: none;
                        margin-bottom: 0.5rem;
                        .row3{
                            color: #343434;
                            border-bottom: 1px solid rgba(0,0,0,0.1);

                            .row3-cont{
                                overflow-x: auto;
                                display: flex;
                                flex-wrap: nowrap;
                                border-right: 1px solid rgba(0,0,0,0.1);
                                .row3-left{
                                    display: inline-block;
                                    width: 1.8rem;
                                    flex-shrink: 0;
                                    p{
                                        border-bottom: 1px solid rgba(0,0,0,0.1);
                                        white-space: nowrap;
                                        /*padding: 0.16rem 0rem;*/
                                        height: 0.8rem;
                                        text-align: center;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        background: #F7F6F9;
                                        color: #999999;
                                        &:last-of-type{
                                            border-bottom: none;
                                        }
                                    }
                                }
                                .row3-right{
                                    display: flex;
                                    flex-wrap: nowrap;
                                    flex-shrink: 0;
                                    .row3-item{
                                        display: inline-block;
                                        p{
                                            border-bottom: 1px solid rgba(0,0,0,0.1);
                                            white-space: nowrap;
                                            padding:0rem 0.1rem;
                                            height: 0.8rem;
                                            text-align: center;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            color: #343434;
                                            &:last-of-type{
                                                border-bottom: none;
                                            }

                                        }
                                        /*操作按钮*/
                                        .row3-opa{
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            .row3-edit{
                                                color: #2778BE;
                                            }
                                            .row3-divide{
                                                margin: 0 0.2rem;
                                                color: #999999;
                                            }
                                            .row3-del{

                                            }
                                        }

                                    }
                                }

                            }

                            .row3Btn{
                                border: 1px solid #2778BE;
                                border-radius: 2px;
                                color:  #2778BE;
                                margin: 0 auto;
                                width: fit-content;
                                text-align: center;
                                writing-mode:vertical-lr;  //垂直方向，从左向右
                                padding: 0.1rem 0;
                            }
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                        }
                    }



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
                            background: none;
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





	}



</style>
