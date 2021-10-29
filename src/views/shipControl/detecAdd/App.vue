<template>
<!--	新增检验检测-->
    <div id="container">
        <pen-header title="新增检测"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >


                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>证书名称：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.nm"  placeholder="请输入证书名称" >
                        </van-col>
                    </van-row>


                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p>证书有效期：</p></van-col>
                        <van-col span="17" >
                           <cal-common @change="getCal"></cal-common>
                        </van-col>
                    </van-row>

<!--                    可以上传多张图片-->
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>上传图片：</p></van-col>
                        <van-col span="17" >
                            <van-uploader v-model="fileList" multiple  :after-read="afterRead"/>
                        </van-col>
                    </van-row>

                </div>




            </div>
        </div>
       <b-button2 left-text="取消" right-text="保存" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

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
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {

                form:{
                    nm:"",//标题
                    docsId: "",//船舶档案id
                    validUntil:"",//有效期
                    imgUrl: "",//证书图
                    issuerId: "",
                    issuerNm: "",

                },
                fileList:[],


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
        async mounted() {
		    this.id=this.until.getQueryString('id')
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
					let shipCd = this.until.getQueryString('shipCd')
					let shipStatus = this.until.getQueryString('shipStatus')
					let fileNm = this.until.getQueryString('fileNm')
					window.location.href = window.location.origin+this.serverAddr+'/personal/shipFileDetail?cdType=3&formW=jiance&cdType2=3&id='+this.id+'&shipCd='+shipCd+'&shipStatus='+shipStatus+'&fileNm='+fileNm
				}
			},

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

            getZhouqi(e){
                this.form.nm=e.nm
                this.form.cd=e.cd
            },

            //证书有效期
            getCal(e){
                this.form.validUntil=e
            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){

                 if(this.fileList.length>0){
                     this.fileList.forEach(item=>{
                         this.form.fileUrl=this.form.fileUrl+item.url+","
                     })
                     this.form.fileUrl = this.form.fileUrl.substring(0, this.form.fileUrl.lastIndexOf(','));
                 }
                 console.log(this.form)


                 this.form.orgEnterId = JSON.parse(this.until.loGet('currentRole')).id
                 this.form.docsId=this.id
                 this.form.surveyId=this.currentRole.id
                 this.form.surveyNm=this.currentRole.company

                 if(!this.form.validUntil){
                     Toast('请选择有效日期')
                     return
                 }

                 if(!this.form.nm){
                     Toast('请输入名称')
                     return
                 }

                this.api.inspectAdd(this.form).then(res=>{
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
