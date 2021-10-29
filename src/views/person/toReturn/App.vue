<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="退货申请"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2"   type="flex">
                        <van-col span="7"><p>退货商品：</p></van-col>
                        <van-col span="17" >
                            <ul>
                                <li v-for="item in form.itms" :key="item.id">
                                    <img :src="item.goodsImgUrl"/>
                                    <p>{{item.goodsNm}}</p>
                                </li>
                            </ul>
                        </van-col>
                    </van-row>


                    <van-row class="row"  type="flex" >
                        <van-col span="7"><p>服务类型</p></van-col>
                        <van-col span="17" class="radio-cont">
                            <van-radio-group v-model="form.type" class="radio-group" >
                                <van-radio :name="item.id"
                                           class="van-radio"
                                           v-for="item in amList" :key="item.id">
                                    {{item.nm}}
                                </van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>退款原因：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="form.applyReas" placeholder="请输入退款原因"></textarea>
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
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.receMob" placeholder="请输入联系电话">
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
                    orderId:"",//订到id
                    type:1,//服务类型
                    applyReas:"",//退货原因
                    img:"",//上传图片
                    receMob:"",//联系电话
                    itmVos:"",//sku集合
                    itms:[],
                },

                fileList:[],
                amList:[
                    {
                        id:1,
                        nm:'仅退款',
                    },
                    {
                        id:0,
                        nm:'退货退款',
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
        async mounted() {


		    let info=JSON.parse(this.until.getQueryString("item"))
		    console.log("商品信息")
            console.log(this.info)

            this.form.orderId=info.id
            this.form.itms=info.itms
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
					this.until.back()
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
                console.log(this.form)
                 console.log(this.fileList)

                 if(this.fileList.length==0){
                     Toast('请上传附件')
                     return
                 }

                  this.form.img=''
                 if(this.fileList.length>0){
                     this.fileList.forEach(item=>{
                         this.form.img=this.form.img+item.url+","
                     })
                     this.form.img = this.form.img.substring(0, this.form.img.lastIndexOf(','));
                 }

                 this.form.orgEnterId = JSON.parse(this.until.loGet('currentRole')).id


                // 验证表单

                 if(this.reg.checkPhone(this.form.receMob)!='ok'){
                     Toast('请输入正确手机号')
                     return
                 }
                 if(!this.form.applyReas){
                     Toast('请输入退款原因')
                     return
                 }


                 let list = []
                 this.form.itms.forEach(item=>{
                     list.push({
                         orderItmId:item.id,
                         rtnQty:item.qty
                     })
                 })
                 this.form.itmVos=list



                 console.log("表单信息")
                 console.log(this.form)
                this.api.orderReturn(this.form).then(res=>{
                    Toast('申请成功');
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
                        ul{
                            li{
                                margin-bottom: 0.2rem;
                                img{
                                    width: 1.5rem;height: 1.5rem;object-fit: cover;
                                    margin-bottom: 0.1rem;
                                }

                            }
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
