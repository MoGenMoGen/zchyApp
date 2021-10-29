<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="预约详情"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="list-item2" >

                    <van-row class="row2"  type="flex">
                        <van-col span="24"><img :src="ic1"> </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶户籍：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.registry}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶类型：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.typesNm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶航区：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.sailingAreaNm}}</span>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶材质：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.hullMaterialNm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶总长：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.totalLen}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>公约船长：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.pactLen}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶型宽：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.width}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶总吨位：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.tonnage}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶航速：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.speed}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>船舶定员：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.complement}}</span>
                        </van-col>
                    </van-row>


                </div>


                <div class="list-item2" >

                    <van-row class="row2"  type="flex">
                        <van-col span="24"><img :src="ic2"> </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>主机品牌：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.hostBrand}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>齿轮箱品牌：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.gearBrand}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>发电机品牌：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.electricGeneratorBrand}}</span>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>主机功率：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.hostPower}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>齿轮箱型号：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.gearModel}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>发电机功率：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.electricGeneratorPower}}</span>
                        </van-col>
                    </van-row>

                </div>

<!--                <div class="list-item2" >-->

<!--                    <van-row class="row2"  type="flex">-->
<!--                        <van-col span="7"><p>整体价格约：</p></van-col>-->
<!--                        <van-col span="17" >-->
<!--                            <span style="color: #FF3232;font-size: 0.36rem">￥{{info.ddd}}</span>-->
<!--                        </van-col>-->
<!--                    </van-row>-->
<!--                </div>-->
            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
	import {mixDtl} from "../mixins/mixDtl"
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                ic1:'https://sinovat.oss-cn-shanghai.aliyuncs.com/7d9f0651d3a6442eb2b13fecfb96d8ae_船舶基本参数.png',
                ic2:'https://sinovat.oss-cn-shanghai.aliyuncs.com/439b6ea858c9483185d5754f3e3dc0ae_船舶设备参数.png',


            };
        },
        components:{
            penHeader,


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
					window.location.href = window.location.origin+this.serverAddr+'/personal/subscribe'
				}
			},
            async getDtl(id){
                this.info= await this.api.subscribeDetail(id)
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
                        img{
                            width: 80%;
                            display: block;
                            margin: 0 auto;
                        }




                    }
                }
            }
        }





	}



</style>
