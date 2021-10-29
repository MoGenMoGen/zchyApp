<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="维保服务确认"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>联系人姓名：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.linkman}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.mob}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>公司名称：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.company}}</span>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>服务地点：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.addr}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>维保船舶：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.docsNm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>产品名称：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.deviceNms}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>服务内容：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.serviceItemNm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="8"><p>服务内容说明：</p></van-col>
                        <van-col span="16" >
                            <span>{{info.serviceCont}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>预约时间：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.appointmentTm}} {{info.dateSlice}}</span>
                        </van-col>
                    </van-row>

                </div>

                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="8"><p>维修服务内容：</p></van-col>
                        <van-col span="16" >
                            <textarea v-model="form.serviceContProvider" placeholder="请输入内容说明"></textarea>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p></p></van-col>
                        <van-col span="17" >
                            <van-uploader v-model="fileList" multiple  :after-read="afterRead" accept="*/*"/>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>负责人员：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.handleRealNm}}</span>
                        </van-col>
                    </van-row>

                </div>

            </div>
        </div>

        <b-button2 left-text="取消" right-text="确认" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../mixins/mixDtl"
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    serviceContProvider:'',//服务内容填入
                    id:'',//维保服务id
                    types:'',//付款类型[r]（0.无需付款,1.分期付款,2.全额付款）
                    receiptsImg:'',// 图片
                },
                fileList:[],


            };
        },
        components:{
            penHeader,
            bButton2,


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            let id=this.until.getQueryString("id")
            this.getDtl(id)
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

            afterRead(e){
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

            //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
            rightClick() {
                console.log(this.form)
                this.form.id = this.info.id
                this.form.types = this.info.type
                this.form.receiptsImg = ''
                if (this.fileList.length > 0) {
                    this.fileList.forEach(item => {
                        this.form.receiptsImg = this.form.receiptsImg + item.url + ","
                    })
                    this.form.receiptsImg = this.form.receiptsImg.substring(0, this.form.receiptsImg.lastIndexOf(','));
                }

                this.api.taskNoteFinish(this.form).then(res => {
                    Toast('保存成功');
                    setTimeout(() => {
                        this.until.back();
                    }, 1500);
                })
            },
            async getDtl(id){
                this.info= await this.api.taskNoteDetail(id)
                let imgList=[]
                if(this.info.receiptsImg){
                    imgList=this.info.receiptsImg.split(',')
                }
                this.$set(this.info,'imgList',imgList)
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
                        textarea{
                            width: 90%;
                            height:2.3rem;
                            border: 1px solid #DDDDDD;
                            padding: 0.2rem;
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
