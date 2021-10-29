<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="新增维保服务"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系人：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.linkman" placeholder="请输入联系人">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.mob" placeholder="请输入联系电话" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>公司名称：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.company" placeholder="请输入公司名称">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>服务地址：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.addr" placeholder="请输入服务地址">
                        </van-col>
                    </van-row>

                </div>
                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>维保船舶：</p></van-col>
                        <van-col span="17" >
                            <mob-select text="nm" :list="shipList"  @change="getShip"></mob-select>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>产品名称：</p></van-col>
                        <van-col span="17" >
                            <multi-select text="nm" :list="proList"  @change="getPro"></multi-select>
<!--                            <mob-select text="nm" :list="proList"  @change="getPro"></mob-select>-->
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>安装日期：</p></van-col>
                        <van-col span="17" >
                           <cal-common @change="getCal"></cal-common>
                        </van-col>
                    </van-row>

                    <van-row class="row"  type="flex">
                        <van-col span="7"><p>服务内容：</p></van-col>
                        <van-col span="17" class="radio-cont">
                            <van-radio-group v-model="form.serviceItemCd"  class="radio-group" >
                                <van-radio :name="item.cd"  class="van-radio" v-for="item in serviceList"  :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>服务说明：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="form.serviceCont" placeholder="请输入内容说明"></textarea>
                        </van-col>
                    </van-row>
<!--                    可以上传多张图片-->
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>图片上传：</p></van-col>
                        <van-col span="17" >
                            <van-uploader v-model="fileList" multiple  :after-read="afterRead"/>
                        </van-col>
                    </van-row>

                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>预约时间：</p></van-col>
                        <van-col span="17" >
                            <cal-common @change="getCal2"></cal-common>
                        </van-col>
                    </van-row>
                    <van-row class="row"  type="flex">
                        <van-col span="7"><p></p></van-col>
                        <van-col span="17" class="radio-cont">
                            <van-radio-group v-model="form.dateSlice" class="radio-group" >
                                <van-radio :name="item.nm"  class="van-radio" v-for="item in amList" :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>

                </div>




            </div>
        </div>
       <b-button2 left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
    import multiSelect from "../../../components/personal/multiSelect";
    import calCommon from "../../../components/personal/calCommon";
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    addr: "",//服务地点
                    installDt:'',//
                    company:'',//
                    appointmentTm: "",//预约时间
                    dateSlice: "上午",//上下午
                    deviceIds: "",//产品名称ids
                    deviceNms: "",//设备名称
                    docsId: "",//档案id
                    orgEnterId: "",//当前身份下的机构id
                    evelStatus: 0,//服务评价状态（0.未填调查表, 1.已填调查表）
                    receiptsImg: "",//维修协议/确认单（图片）
                    linkman: "",//联系人姓名
                    mob: "",//联系电话
                    serviceCont: "",//服务内容说明
                    serviceItemCd: "",//服务内容TASK_NOTE_SERVICE_ITEM[c](10.维修, 20.安装/调试, 30.保养, 40.咨询)
                    statusCd: "TASK_NOTE_STATUS.10",//服务状态TASK_NOTE_STATUS（10.待受理, 20.已受理, 30.拒绝受理, 40.已派单到服务商，50.已派单到负责人, 60.维修中, 70.完成维修, 80.已支付服务款, 90.终止申请）
                },
                imgList:[],//上传图片列表
                docsId:'',//船舶id
                fileList:[],
                shipList:[],//维保船舶列表
                proList:[],//产品名称
                serviceList:[],//服务内容列表
                result:[],//产品选中索引数组
                amList:[
                    {
                        id:0,
                        nm:'上午',
                    },
                    {
                        id:1,
                        nm:'下午',
                    },
                ],

            };
        },
        components:{
            penHeader,
            bButton2,
            calCommon,
            mobSelect,
            multiSelect


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
		watch:{
            docsId(){
                console.log("观察者")
		       this.getProList()
            }
        },
        async mounted() {
            this.getInfo()
            this.getShipList('') //船舶
            this.getService()
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
					if(this.currentRole.identityCd =='identity90'){
						window.location.href = window.location.origin+this.serverAddr+'/personal/repairService'
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/personal/repair'
					}
				}
			},
            //获取个人信息
            async getInfo(){
                this.info = await this.api.personInfo() //个人信息
                this.form.addr = this.info.addrNm+this.info.address
                this.form.company = this.info.company
                this.form.linkman = this.info.realNm
                this.form.mob = this.info.mob
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

		    //获取预约时间
            getCal2(e){
                this.form.appointmentTm=e
            },

            //获取安装日期
            getCal(e){
                this.form.installDt=e
            },
            //船舶列表项
            getShip(item){
                this.docsId=item.id

            },
            //产品名称项
            getPro(str){
                this.result=JSON.parse(str)
            },
            //服务
            async getService(){
                this.serviceList = await this.api.dataDictionary('TASK_NOTE_SERVICE_ITEM')
            },
            //获取产品列表
            async getProList(){
                let param = {
                    docsId:this.docsId,
                }
                let qry = this.query.new()
                this.proList  = await this.api.fileDeviceList(this.query.toEncode(qry),param)
            },


            //获取船舶列表
            async getShipList(key){
                let qry = this.query.new()
                this.query.toW(qry,'statusCd','DOCS_STATUS.03','EQ')
                this.query.toP(qry,1,50)
                let param = {
                    orgEnterId:this.currentRole.id,
                    keyWord:key
                }
                let data = await this.api.allShip(this.query.toEncode(qry),param)
                this.shipList = data.data.list
                console.log(this.shipList)
            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                console.log(this.form)
                 console.log(this.fileList)
                 this.form.deviceNms=''
                 this.form.deviceIds=''

                  if(this.result.length>0){
                      this.result.forEach(item=>{
                          this.form.deviceNms=this.form.deviceNms+ this.proList[item].nm+","
                      })
                      this.form.deviceNms = this.form.deviceNms.substring(0, this.form.deviceNms.lastIndexOf(','));
                      this.form.deviceIds = this.result.join(',')
                  }

                  this.form.receiptsImg=''
                 if(this.fileList.length>0){
                     this.fileList.forEach(item=>{
                         this.form.receiptsImg=this.form.receiptsImg+item.url+","
                     })
                     this.form.receiptsImg = this.form.receiptsImg.substring(0, this.form.receiptsImg.lastIndexOf(','));
                 }

                 this.form.orgEnterId = JSON.parse(this.until.loGet('currentRole')).id
                 this.form.docsId=this.docsId

                // 验证表单
                if(!this.form.linkman){
                    Toast('请输入联系人姓名')
                    return
                }
                 if(this.reg.checkPhone(this.form.mob)!='ok'){
                     Toast('请输入正确手机号')
                     return
                 }
                 if(!this.form.company){
                     Toast('请输入公司名称')
                     return
                 }
                 if(!this.form.addr){
                     Toast('请输入服务地址')
                     return
                 }
                 if(!this.form.docsId){
                     Toast('请选择维保船舶')
                     return
                 }
                 if(!this.form.deviceIds){
                     Toast('请选择产品名称')
                     return
                 }
                 if(!this.form.installDt){
                     Toast('请选择安装日期')
                     return
                 }
                 if(!this.form.serviceItemCd){
                     Toast('请选择服务内容')
                     return
                 }
                 if(!this.form.serviceCont){
                     Toast('请输入服务说明')
                     return
                 }
                 if(!this.form.receiptsImg){
                     Toast('请上传图片')
                     return
                 }
                 if(!this.form.appointmentTm){
                     Toast('请选择预约时间')
                     return
                 }

                this.api.taskNoteAdd(this.form).then(res=>{
                    Toast('添加成功');
                    setTimeout(() => {
                        this.until.back();
                    }, 1500);
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
