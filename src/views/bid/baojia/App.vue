<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="报价"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>项目名称：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.bidNm" placeholder="请输入项目名称" disabled>
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>投标金额：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.offerAmt" placeholder="请填写投标金额" type="number">
                        </van-col>
                    </van-row>
                    <!--                    可以上传多张图片-->
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>附件上传：</p></van-col>
                        <van-col span="17" >
                            <van-uploader v-model="fileList" :max-count="1"  :after-read="afterRead" accept="*/*"/>
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
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    orgId: "5024282848367616",
                    orgNm: "中创海洋科技股份有限公司",
                    bidId: "5031217130673152",
                    bidNm: "",
                    offerAmt: "",
                    imgUrl: "",
                    attachment: '',
                    rmks: "",
                    completeTm:'',
                },
                fileList:[],
                info:{},
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
            this.info=JSON.parse(this.until.getQueryString('info'))
            this.form.orgId = this.info.orgId
            this.form.orgNm = this.info.orgNm
            this.form.bidId = this.info.bidId
            this.form.bidNm = this.info.nm
            this.form.completeTm = this.info.completeTm
            console.log("66666666666666")
            console.log(this.info)
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/bid'
				}
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

		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){

                 this.form.attachment=''
                  if(this.fileList.length==0){
                      Toast('请上传附件')
                      return
                  }
                 if(this.fileList.length>0){
                     this.fileList.forEach(item=>{
                         this.form.attachment=this.form.attachment+item.url+","
                     })
                     this.form.attachment = this.form.attachment.substring(0, this.form.attachment.lastIndexOf(','));
                 }


                // 验证表单
                if(!this.form.offerAmt){
                    Toast('请输入报价单金额')
                    return
                }
                 console.log("报价信息。")
                 console.log(this.form)
                this.api.bidOffer(this.form).then(res=>{
                    Toast('报价成功');
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
