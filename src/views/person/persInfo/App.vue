<template>
<!--	个人信息-->
    <div id="container">

        <pen-header title="个人信息"></pen-header>
        <div class="body">
<!--            个人信息-->
            <div class="list-cont">
                <img class="imgTitle" :src="icPerInfo">
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1" ><p class="row-label">头像：</p></van-col>
                    <van-col span="6"><p  class="ava">
                        <img  :src="info.imgUrl" v-if="info.imgUrl">
                        <img  :src="icDefault" v-else></p></van-col>
                    <van-col span="6" offset="1">
                        <p style="color: #666666"  class="upload" >
                            <van-uploader :after-read="afterRead" capture="camera">
                                <span>上传文件</span>
                            </van-uploader>
                    </p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">姓名：</p></van-col>
                    <van-col span="17" offset="1"><input placeholder="输入姓名" v-model="info.realNm"></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">性别：</p></van-col>
                    <van-col span="17" offset="1">
                        <van-radio-group v-model="info.gender" direction="horizontal">
                            <van-radio name="男">男</van-radio>
                            <van-radio name="女" style="margin-left: 0.5rem">女</van-radio>
                        </van-radio-group>

                    </van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p style="color: #333333">联系电话：</p></van-col>
                    <van-col span="17" offset="1"><input placeholder="输入联系电话" v-model="info.mob"></van-col>
                </van-row>

            </div>

<!--            企业信息-->
            <div class="list-cont" style="margin-top: 0.2rem">

                <van-row class="row" align="center" type="flex" >
                    <van-col span="24" >
                        <p v-if="roleInfo.audit==0 || roleInfo.audit==1" class="shenhe"><img :src="shenhezhong">审核中</p>
                        <p v-if="roleInfo.audit==2" class="shenhe"><img :src="tongguo"  >审核通过</p>
                        <p v-if="roleInfo.audit==3" class="shenhe"><img :src="weitongguo"  >审核未通过</p>
                        <p v-if="roleInfo.audit==3"  class="shenhe">未通过理由：{{roleInfo.options}}</p>
                    </van-col>
                </van-row>

                <img class="imgTitle" :src="icCorpInfo">
                <van-row class="row" align="center" type="flex" style="margin-top: 0.4rem">
                    <van-col span="6" ><img :src="icBaseInfo2"></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">公司名称:</p></van-col>
                    <van-col span="17"><p>{{roleInfo.company}}</p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">公司地址:</p></van-col>
                    <van-col span="17"><p>{{roleInfo.addrNm}}{{roleInfo.address}}</p></van-col>
                </van-row>

                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">联系人：</p></van-col>
                    <van-col span="14" offset="1"><input placeholder="输入联系人" v-model="roleInfo.linkMan"></van-col>
                    <van-col span="3" offset="1"><p style="color: #2778BE;font-size: 0.22rem" @click="toChangeCorp(roleInfo.linkMan,'linkMan')">修改</p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">联系手机：</p></van-col>
                    <van-col span="14" offset="1"><input placeholder="输入联系电话" v-model="roleInfo.mob"></van-col>
                    <van-col span="3" offset="1"><p style="color: #2778BE;font-size: 0.22rem" @click="toChangeCorp(roleInfo.mob,'mob')">修改</p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="6" offset="1"><p class="row-label">电子邮箱：</p></van-col>
                    <van-col span="14" offset="1"><input placeholder="输入电子邮箱" v-model="roleInfo.email"></van-col>
                    <van-col span="3" offset="1"><p style="color: #2778BE;font-size: 0.22rem" @click="toChangeCorp(roleInfo.email,'email')">修改</p></van-col>
                </van-row>


                <van-row class="row" align="center" type="flex" style="margin-top: 0.4rem">
                    <van-col span="6"><img :src="icCorpInfo2"></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="8" offset="1"><p class="row-label">企业营业执照:</p></van-col>
                    <van-col span="14"><img :src="roleInfo.businessLicense"></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="8" offset="1"><p class="row-label">法人身份证:</p></van-col>
                    <van-col span="7"><img :src="roleInfo.idCard"></van-col>
                    <van-col span="7"><img :src="roleInfo.idCardReverse"></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="8" offset="1"><p class="row-label">企业资质证明:</p></van-col>
                    <van-col span="14"><img :src="item" v-for="(item,index) in roleInfo.qualification.split(',')" :key="index" style="margin-right: 5px"></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="22" offset="1"><p class="row-label">企业简介:</p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="22"><div v-html="roleInfo.intro"></div></van-col>
                </van-row>
            </div>

        </div>


        <van-popup v-model="showCrop" :style="{ height: '100%',width:'100%' }">
            <image-clipper :img="srcUrl"
                           @clip="clip"
                           @cancel="cancel"
                           clipper-img-width="800"
                           clipper-img-height="800"
                           v-if="showCrop">

            </image-clipper>
        </van-popup>
        <b-button2 left-text="取消" right-text="保存" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import {mixDtl} from "../mixins/mixDtl"
    import bButton2 from "../../../components/personal/bButton2";
    import imageClipper from "../../../components/personal/clipper/imageClipper";
    import shenhezhong from "./img/审核中.png"
    import weitongguo from "./img/未通过.png"
    import tongguo from "./img/通过.png"
    import { Toast } from 'vant';
	import {mapState} from "vuex";
    export default {
        mixins:[mixDtl],
        data() {
            return {
                shenhezhong,
                weitongguo,
                tongguo,
                icPerInfo:'https://sinovat.oss-cn-shanghai.aliyuncs.com/af77d74a3c70407db975166e96626343_个人信息.png',
                icCorpInfo:'https://sinovat.oss-cn-shanghai.aliyuncs.com/b0a60226d7924203b8a2b117d024a97b_企业信息.png',
                icDefault:'https://sinovat.oss-cn-shanghai.aliyuncs.com/948155dfce2d4725930e38b326cfc523_默认头像.png',
                icBaseInfo2: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/6b473c23125c4818af1a1dc9ea065c87_基本信息小标题.png',
                icCorpInfo2:'https://sinovat.oss-cn-shanghai.aliyuncs.com/807dfb2cde3a43bda1011223c6899c0b_企业信息小标题.png',
                roleInfo:'',//入驻信息
                showCrop:false,//显示剪裁组件弹框
                srcUrl:'',//原始url

            };
        },
        components:{
            penHeader,
            bButton2,
            imageClipper


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted(){
            this.info = await this.api.personInfo() //个人信息
            this.getInfo()
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/persInfo'
				}
			},
            //企业信息单独修改
            async toChangeCorp(val,type){

                if(type=='email'){


                    if(this.reg.checkMail(val)!='ok'){
                        Toast('请输入正确邮箱')
                        return
                    }


                }
                if(type=='linkMan'){

                    if(this.reg.checkName(val)!='ok'){
                        Toast('请输入用户名')
                        return
                    }
                }
                if(type=='mob'){

                    if(this.reg.checkPhone(val)!='ok'){
                        Toast('请输入正确手机号')
                        return
                    }
                }

                let param  = this.roleInfo

                if(type=='email'){
                    param.email = val
                }else if(type=='linkMan'){
                    param.linkMan = val
                }else{
                    param.mob = val
                }

                let res=await this.api.settleInUpd(param)
                Toast('修改成功')
            },

            //取消剪裁
            cancel(){
                this.showCrop=false

            },
            //图片剪裁
            async  clip(e){
                console.log("剪裁成功返回数据base64码")
                console.log(e)
                this.showCrop=false
                let file = this.until.base64toFile(e,"ava.png")
                let res=await  this.api.uploadImg2(file)
                console.log(res)
                this.info.imgUrl=res

            },
            leftClick(){
                this.until.back();
            },
            async   rightClick(){
                this.info.realNm=this.until.trim(this.info.realNm)
                if(this.reg.checkName(this.info.realNm)!='ok'){
                    Toast('请输入正确姓名')
                    return
                }

                let param = {
                    realNm: this.info.realNm,
                    gender: this.info.gender,
                    imgUrl: this.info.imgUrl,
                }
                let res=await this.api.personInfoChange(param)
                Toast('修改成功');

            },
            afterRead(file){
                // 此时可以自行将文件上传至服务器
                console.log("打开相册返回。。。")
                this.srcUrl=file.content
                this.showCrop=true

            },
            //打开相册
            toOpen(){

            },
            async getInfo(){ //入驻信息
                this.roleInfo = await this.api.getRoleDetail(this.currentRole.id)
                console.log(this.roleInfo)
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
                padding: 0.2rem;
                .imgTitle{
                    width: 75%;
                    display:block;
                    margin: 0 auto;
                }
                .row{
                    padding: 0.2rem 0;
                    flex-shrink: 0;
                    /*头像*/
                    .ava{
                        flex-shrink: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            flex-shrink: 0;
                            width: 1.90rem;
                            border-radius: 50%;
                        }
                    }
                    .row-label{
                        color: #333333;
                    }
                    .upload{

                    }
                    .shenhe{
                        img{
                            width: 0.35rem;
                            height: 0.35rem;
                            margin-right: 0.1rem;
                        }
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #333333;
                    }
                    input{
                        border: 1px solid #DDDDDD;
                        padding: 0.1rem 0.2rem;
                        width: 85%;
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
                }

            }
        }





	}



</style>
