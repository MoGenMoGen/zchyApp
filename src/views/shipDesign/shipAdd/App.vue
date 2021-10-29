<template>
<!--	我的预约-->
    <div id="container">
        <pen-header :title="title"></pen-header>
        <div class="body">
            <div class="list-cont">
                <van-row  class="row-btn" align="center"  type="flex" justify="center" v-if="type==1">
                    <van-col span="24"><p @click="toAddShip">添加船舶</p></van-col>
                </van-row>
                <van-row  class="row-tip" align="center"  type="flex" v-if="type==1">
                    <van-col span="24"><p>*可以从船舶档案获取船舶信息，快速新增船舶设计</p></van-col>
                </van-row>

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶名称：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.nm" placeholder="请输入船舶名称">
                        </van-col>
                    </van-row>
                    <!--                    可以上传多张图片-->
                    <van-row class="row2"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶主图：</p></van-col>
                        <van-col span="17" >
                            <van-uploader v-model="fileList" multiple  :after-read="afterRead" accept="*/*"/>
                        </van-col>
                    </van-row>
<!--                    级联选择器-->
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶分类：</p></van-col>
                        <van-col span="17" >
                           <casc-select @change="chooseCasc" ref="classSelect"></casc-select>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>最高价格：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.origMaxPrice" placeholder="请输入最高价格" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>最低价格：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.origMinPrice" placeholder="请输入最低价格" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶户籍：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.registry" placeholder="船舶户籍">
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶材质：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="rawList"  ref="rawSelect" @change="chooseRaw" place="请选择材质"></mob-select>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶长度：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="lengthList" ref="lengthSelect"  @change="chooseLength" place="船舶长度(m)"></mob-select>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center" type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>完工日期：</p></van-col>
                        <van-col span="17" >
                            <cal-common @change="getCal" ref="calComplete"></cal-common>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p>*</p></van-col>
                        <van-col span="6"><p>船舶航区：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="sailList" ref="sailSelect"  @change="chooseSail" place="请选择航区"></mob-select>
                        </van-col>
                    </van-row>



                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶型宽：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.width" placeholder="船舶型宽(m)" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶航速：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.speed" placeholder="船舶航速" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶总长：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.totalLen" placeholder="船舶总长(m)" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶型深：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.deep" placeholder="船舶型深(m)" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>主机品牌：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.hostBrand" placeholder="主机品牌" >
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>公约总长：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.pactLen" placeholder="公约总长(m)" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>齿轮箱品牌：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.gearBrand" placeholder="齿轮箱品牌" >
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>主机功率：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.hostPower" placeholder="主机功率(kw)" type="number">
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>发动机组品牌：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.generatorSetBrand" placeholder="发动机组品牌" >
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>齿轮箱型号：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.gearModel" placeholder="齿轮箱型号" type="number">
                        </van-col>
                    </van-row>


                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>制冷机组品牌：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.refrigeratorBrand" placeholder="制冷机组品牌" >
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>发动机组功率：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.generatorSetPower" placeholder="发动机组功率(kw)" type="number">
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>总吨位：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.totalTon" placeholder="总吨位" type="number">
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>制冷机组功率：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.refrigeratorPower" placeholder="制冷机组功率(kw)" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>满载排水：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.loadDisplacement" placeholder="满载排水" type="number">
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>净吨位：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.netTon" placeholder="净吨位" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶定员：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.complement" placeholder="船舶定员" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>满载吃水：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.loadDraught" placeholder="满载吃水" type="number">
                        </van-col>
                    </van-row>


                    <van-row class="row2"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>详情描述：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="form.description" placeholder="请输入详情描述"></textarea>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex" align="center">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>主要参数：</p></van-col>
                        <van-col span="17" >
                           <p class="addParam" @click="toAddParam">新增参数</p>
                        </van-col>
                    </van-row>


                    <div v-for="(item,index) in parametList" :key="index" >
                        <van-row  class="row2" type="flex" align="center">
                            <van-col span="1"><p></p></van-col>
                            <van-col span="6"><p>第{{index+1}}个参数名：</p></van-col>
                            <van-col span="17" >
                                <input  placeholder="参数名" v-model="item.colNm">
                            </van-col>
                        </van-row>
                        <van-row  class="row2"  type="flex" align="center">
                            <van-col span="1"><p></p></van-col>
                            <van-col span="6"><p>第{{index+1}}个参数值：</p></van-col>
                            <van-col span="17" >
                                <input  placeholder="参数值" v-model="item.value" >
                            </van-col>
                        </van-row>

                    </div>

<!--                    富文本编辑器-->

                    <van-row class="row2"  type="flex">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶详情：</p></van-col>
                        <van-col span="17" >
                            <wang-editor :getEditConts="getEditConts" :insertImg="insertImgHandle" ref="wangeditor"></wang-editor>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex" align="center">
                        <van-col span="1"><p></p></van-col>
                        <van-col span="6"><p>船舶设备：</p></van-col>
                        <van-col span="17" >
                            <p class="addParam" @click="showDevie=true">添加设备</p>
                        </van-col>
                    </van-row>
                </div>

            </div>
            <!--设备分类列表-->
            <device-list :type-list="typeList" ref="deviceList"></device-list>
        </div>


       <b-button2 left-text="取消" right-text="确认" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
        <van-popup v-model="showDevie"  :style="{ height: '100%',width:  '100%',background:'#efefef' }" >
            <add-device v-if="showDevie" @leftClick="showDevie=false" @rightClick="getDevice"></add-device>
        </van-popup>
        <van-popup v-model="showAdd"  :style="{ height: '100%',width:  '100%',background:'#efefef' }" >
            <add-ship v-if="showAdd"  @add="getShip" @leftClick="showAdd=false"></add-ship>
        </van-popup>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../../person/mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
    import multiSelect from "../../../components/personal/multiSelect";
    import calCommon from "../../../components/personal/calCommon";
    import wangEditor from "../../../components/personal/wangeditor"
    import cascSelect from "../../../components/personal/cascSelect";
    import addDevice from "../../../components/personal/addDevice";
    import deviceList from "../../../components/personal/deviceList";
    import addShip from "../../../components/personal/addShip";
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                type:1,//1-新增,2-修改
                title:'新增船舶设计',
                showDevie:false,
                showAdd:false,
                form:{
                    cid: "",  //分类id
                    cid1: "", //一级分类id
                    cid2: "", //二级分类id
                    cid3: "", //三级分类id
                    cids: "", //多级分类id
                    designId: "", //设计院id
                    cd: "", //商品编码
                    nm: "", //商品名称
                    description: "",  //描述
                    imgUrl: "", //图片

                    origMinPrice: "", //最低价格
                    origMaxPrice: "", //最高价格
                    registry: "", //船舶户籍
                    typesCd: "",  //船舶类型
                    sailingAreaCd: "",  //船舶航区
                    hullMaterialCd: "", //船体材质
                    lengthCd: "", //船舶长度
                    totalLen: "", //船舶总长
                    pactLen:"", //公约船长
                    width: "",  //船舶型宽
                    deep: "", //船舶型深
                    loadDraught: "",  //满载吃水
                    loadDisplacement: "", //满载排水
                    speed: "",  //船舶航速
                    complement: "", //船舶定员
                    hostBrandId: "",  //主机品牌id
                    hostBrand: "",  //主机品牌
                    hostPower: "",  //主机功率
                    gearBrandId: "",  //齿轮箱品牌id
                    gearBrand: "",  //齿轮箱品牌
                    gearModel: "",  //齿轮箱型号
                    totalTon: "", //总吨位
                    netTon: "", //净吨位
                    generatorSetBrandId: "",  //发电机组品牌id
                    generatorSetBrand: "",  //发电机组品牌
                    generatorSetPower: "",  //发电机组功率
                    refrigeratorBrandId: "",  //制冷机组品牌id
                    refrigeratorBrand: "",  //制冷机组品牌
                    refrigeratorPower: "",  //制冷机组功率
                    completeDate: "", //完工日期
                    mainParam: {

                    },  //船舶其他参数
                    intro: "",  //详请
                    // "seq": "排序",
                    // "istop": "",  //是否置顶(0:未置顶, 1:已置顶)
                    rmks: "", //备注
                    shipSoluDeviceRos: [  //设备
                        // {
                        //   "solutionId": "", //船舶设计方案id
                        //   "goodsId": "",  //商品id
                        //   "skuId": "",  //sku id
                        //   "deviceType": "", //设备型号
                        //   "deviceSupply": "", //供应商
                        //   "deviceSupplyId": "", //供应商id
                        //   "cid": "",  //分类id
                        //   "cid1": "", //一级分类
                        //   "cid2": "", //二级分类
                        //   "cid3": "", //三级分类
                        //   "cids": "", //多级分类id
                        //   "cd": "", //编码
                        //   "nm": "", //名称
                        //   "num": "",  //数量
                        //   "imgUrl": "", //图片
                        //   "origMinPrice": "", //最低价格
                        //   "origMaxPrice": "", //最高价格
                        //   // "status": "", //状态 [r](0：上架，1：下架)
                        //   "rmks": "", //备注
                        //   "intro": "" //详细描述
                        // }
                    ],
                    delDeviceIds: []  //删除设备id
                },
                imgList:[],//上传图片列表
                docsId:'',//船舶id
                fileList:[],
                rawList:[],//船舶材质列表
                lengthList:[],//船舶长度列表
                sailList:[],//船舶航区
                parametList:[],//参数列表
                result:[],//产品选中索引数组
                typeList:[],
                shipSoluDeviceRos:[],


            };
        },
        components:{
            penHeader,
            bButton2,
            calCommon,
            mobSelect,
            multiSelect,
            wangEditor,
            cascSelect,
            addDevice,
            deviceList,
            addShip
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {

		    this.type=this.until.getQueryString('type')
            if(this.type==1){
                this.title='新增船舶设计'
                //    获取设备列表
                this.getTypeList()
            }else{
                this.title='修改船舶设计'
                this.id= this.until.getQueryString('id')
                this.getInfo()
            }
            this.rawList = await this.api.dataDictionary('HULL_MATERIAL')  //船舶材质
            this.lengthList = await this.api.dataDictionary('SHIP_LENGTH')  //船舶长度
            this.sailList = await this.api.dataDictionary('SAILING_AREA')  //船舶航区
             let shipFileStr=this.until.seGet('shipFile')
            if(shipFileStr){
                console.log("船舶档案66666666。。。。")
                console.log(JSON.parse(shipFileStr))
            }
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
					if(this.type==1){
						window.location.href = window.location.origin+this.serverAddr+'/personal/addShip?ways=add'
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/personal/addShip?id='+this.id
					}

				}
			},
		    //获得船舶
            getShip(e){
                window.console.log("获得船舶。。")
                window.console.log(e)
                this.showAdd=false
                this.form=e
                this.fileList=[]
                let newList= this.form.imgUrl.split(',')
                newList.forEach(item=>{
                    this.fileList.push({url:item,status:"done"})
                })
                this.$refs.rawSelect.setDefault(this.form.hullMaterialNm)
                this.$refs.lengthSelect.setDefault(this.form.lengthNm)
                this.$refs.sailSelect.setDefault(this.form.sailingAreaNm)
                this.$refs.calComplete.setDefault(this.form.completeDate)
                let ids=this.form.cids.split(",")
                this.getLevel2Nm(ids)
                // this.$refs.classSelect.setDefault(nm1+"-"+nm2)

            },

            //获取类型列表
            async getTypeList(){
                let qry = this.query.new()
                let res=await this.api.shipCatList(this.query.toEncode(qry))
                this.typeList = []
                for(let [k,v] of Object.entries(res.data)){
                    this.typeList.push({
                        nm:k,
                        id:v[0].tid,
                        checked:false,
                        subList:v
                    })
                }
                console.log("设备列表。。。")
                console.log(this.typeList)
                this.typeList.forEach(item=>{
                    item.subList.forEach(j=>{
                        this.$set(j,'checked',false)
                        this.$set(j,'proList',[])
                    })
                })
                //默认选中第一项
                this.$refs.deviceList.toChoose(this.typeList[0])
            },
            getDevice(e){
                this.showDevie=false
                window.console.log("添加设备。。")
                window.console.log(e)
                let this_=this
                this.typeList.forEach(item=>{
                    //选中一级分类
                    if(item.id==e.cid1){
                        this.$refs.deviceList.toChoose(item)
                        item.subList.forEach(i=>{
                            // i.checked=false
                            if(i.id==e.cid2){
                                //二级分类新增产品列表,并且去掉重复的,并展开分类列表
                                i.checked=true
                                let t=0
                                i.proList.forEach(j=>{
                                    if(j.id==e.id){
                                        t++
                                    }
                                })
                                if(t==0){

                                    i.proList.push(e)
                                    this_.shipSoluDeviceRos.push(e)
                                }

                            }
                        })

                    }

                })
            },
            //新增参数
            toAddParam(){
                let tmp={
                    colNm:"",
                    value:"",
                }
                this.parametList.push(tmp)
            },

		    //级联选择器选中
            chooseCasc(e){
                window.console.log("父组件级联选择器选中。。。")
                window.console.log(e)
                this.form.cids=e.provinceId+","+e.cityId
            },
		    //       初始化富文本编辑器内容
		    initEdit(s){
                this.$refs.wangeditor.setEditorContent(s);
            },

            // 获取编辑器内容 格式为html
            getEditConts (value) {
                window.console.log("富文本编辑器：")
                window.console.log(value)
                this.form.intro=value
            },
            // 插入图片操作
            insertImgHandle (res, insertImg, editor) {
                window.console.log("上传图片。。。")
                if (res && res.code === 0) {
                    insertImg(res.data)
                }
            },
            toAddShip(){
              // this.until.href('./shipIncre.html')
                this.showAdd=true
            },


		    //上传图片，一张图片返回对象，多张图片返回数组
            afterRead(e){
                console.log(e)
                this.fileList.forEach(item=>{
                    if(item.status!="done"){
                        item.status="uploading"
                        this.api.uploadImg2(item.file).then(res=>{
                            item.status="done"
                            item.url=res
                            console.log("上传成功返回")
                            console.log(res)
                        })
                    }

                })

            },
            //选中船舶航区
            chooseSail(e){
                this.form.sailingAreaCd=e.cd
            },
            //获取船舶长度
            chooseLength(e){
                this.form.lengthCd=e.cd
            },

            //获取船舶材质列表
            chooseRaw(e){
                this.form.hullMaterialCd=e.cd
            },



            //获取完工日期
            getCal(e){
                this.form.completeDate=e
            },
            //获取2级分类名称

            async  getLevel2Nm(ids){
                let list=await this.api.getClassify2()
                let list2=await this.api.getShipClassify(ids[0])
                let nm1=''
                let nm2=''
                for(let i=0;i<list.length;i++){
                    if(list[i].id==ids[0]){
                        nm1=list[i].nm
                        break
                    }
                }
                for(let i=0;i<list2.length;i++){
                    if(list2[i].id==ids[1]){
                        nm2=list2[i].nm
                        break
                    }
                }
                this.$refs.classSelect.setDefault(nm1+"-"+nm2)

            },
            async getInfo(){
                let res = await this.api.designFileDetail(this.id)
                console.log('获取详情')
                console.log(res)
                this.form=res
                this.initEdit(this.form.intro)
                let newList= res.imgUrl.split(',')
                newList.forEach(item=>{
                    this.fileList.push({url:item,status:"done"})
                })

                this.$refs.rawSelect.setDefault(this.form.hullMaterialNm)
                this.$refs.lengthSelect.setDefault(this.form.lengthNm)
                this.$refs.sailSelect.setDefault(this.form.sailingAreaNm)
                this.$refs.calComplete.setDefault(this.form.completeDate)
                let ids=this.form.cids.split(',')

                this.getLevel2Nm(ids)
                let mainParam=JSON.parse(this.form.mainParam)

                this.parametList=mainParam.args
                console.log('参数列表')
                console.log(this.parametList)

                this.initDevList()


            },
            //初始化设备列表
            async initDevList(){
                //    获取设备列表
                await this.getTypeList()
                let qry = this.query.new()
                this.query.toW(qry,'solutionId',this.id,'EQ')
               this.shipSoluDeviceRos = await this.api.designGoodsList(this.query.toEncode(qry))
                window.console.log("66666设备列表。。。")
                window.console.log(this.shipSoluDeviceRos)
                this.typeList.forEach(item=>{
                    this.shipSoluDeviceRos.forEach(e=>{
                        if(e.cid1==item.id){
                            window.console.log("88888888888设备列表。。。")
                            item.subList.forEach(i=>{

                                if(i.id==e.cid2){
                                    i.checked=true
                                    i.proList.push(e)

                                }
                            })
                        }
                    })
                })

            },
		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){

                 if(!this.form.nm){
                     Toast('请填写船舶名称')
                     return
                 }
                 if(this.fileList.length==0){
                     Toast('请上传船舶照片')
                     return
                 }
                 if(!this.form.cids){
                     Toast('请选择船舶分类')
                     return
                 }
                 if(!this.form.origMaxPrice){
                     Toast('请填写最高价格')
                     return
                 }
                 if(!this.form.origMinPrice){
                     Toast('请填写最低价格')
                     return
                 }
                 if(!this.form.registry){
                     Toast('请填写船舶户籍')
                     return
                 }
                 if(!this.form.hullMaterialCd){
                     Toast('请选择船舶材质')
                     return
                 }
                 if(!this.form.sailingAreaCd){
                     Toast('请选择船舶航区')
                     return
                 }

                 this.form.cid=this.form.cid3
                 this.form.designId=this.currentRole.id
                 this.form.imgUrl=''
                 if(this.fileList.length>0){
                     this.fileList.forEach(item=>{
                         this.form.imgUrl=this.form.imgUrl+item.url+","
                     })
                     this.form.imgUrl = this.form.imgUrl.substring(0, this.form.imgUrl.lastIndexOf(','));
                 }

                 this.form.orgEnterId = JSON.parse(this.until.loGet('currentRole')).id
                 this.form.docsId=this.docsId
                 let mainParam={
                     args:[]
                 }
                 mainParam.args=this.parametList
                 this.form.mainParam=JSON.stringify(mainParam)
                 this.shipSoluDeviceRos=[]
                 this.typeList.forEach(item=>{
                     item.subList.forEach(j=>{
                         j.proList.forEach(k=>{
                             this.shipSoluDeviceRos.push(k)
                         })
                     })
                 })
                 this.form.shipSoluDeviceRos=this.shipSoluDeviceRos
                 window.console.log("上传表单。。")
                 window.console.log(this.form)

                 if(this.type==1){
                     this.api.addDesignFile(this.form).then(res=>{
                         Toast('添加成功');
                         setTimeout(() => {
                             this.until.back();
                         }, 1500);
                     })
                 }else{

                     this.api.updDesignFile(this.form).then(res=>{
                         Toast('修改成功');
                         setTimeout(() => {
                             this.until.back();
                         }, 1500);
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
                /*顶部添加按钮*/
                .row-btn{
                    p{
                        background: #2878BE;
                        color: white;
                        border-radius: 5px;
                        width: 1.65rem;
                        height: 0.57rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto;
                    }
                }
                .row-tip{
                    p{
                        text-align: center;
                        color:#9A9A9A;
                        margin: 0.2rem 0;
                    }
                }


                .list-item2 {
                    position: relative;
                    background: white;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    padding: 0.15rem 0.2rem 0.4rem 0.2rem;

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
                        /*添加参数按钮*/
                        .addParam{
                            background: #2878BE;
                            color: white;
                            border-radius: 5px;
                            width: 1.65rem;
                            height: 0.57rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
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


	}


</style>
