<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="选型详情"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="24"><img :src="ic1"> </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶类型:{{info.typesNm}}</p></van-col>
                        <van-col span="11" offset="1"><p>船舶总吨数:{{info.tonnage}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶材质:{{info.hullMaterialNm}}</p></van-col>
                        <van-col span="11" offset="1"><p>船舶航速:{{info.speed}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶总长:{{info.lengthNm}}</p></van-col>
                        <van-col span="11" offset="1"><p>冷却系统:{{info.freezingSys == 1?'有':'无'}}</p></van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶户籍:{{info.registry}}</p></van-col>
                        <van-col span="11" offset="1"><p>主机品牌:{{info.hostBrandNm}}</p></van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶航区:{{info.sailingAreaNm}}</p></van-col>
                        <van-col span="11" offset="1"><p>制冷机组品牌:{{info.refrigeratorBrandNm}}</p></van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶定员:{{info.complement}}</p></van-col>
                        <van-col span="11" offset="1"><p>其他要求:{{info.intro}}</p></van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶型宽:{{info.width}}</p></van-col>
                        <van-col span="11" offset="1"><p>主机功率:{{info.hostPowerNm}}</p></van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>船舶型深:{{info.deep}}</p></van-col>
                        <van-col span="11" offset="1"><p>制冷机组功率:{{info.refrigeratorPowerNm}}</p></van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="12"><p>公约船长:{{info.pactLen}}</p></van-col>

                    </van-row>



                </div>


                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>提交时间：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.crtTm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="9"><p>整体参考价格：</p></van-col>
                        <van-col span="15" >
                            <span style="color: #FF3232;font-size: 0.36rem">{{info.price?'￥'+info.price+'起':'暂无报价，详情请咨询客服'}}</span>
                        </van-col>
                    </van-row>
                </div>
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
                ic1:'https://sinovat.oss-cn-shanghai.aliyuncs.com/18d5cbf35f40455e85fc4ae2eef4f82b_基本参数.png',



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
					let id=this.until.getQueryString("id")
					window.location.href = window.location.origin+this.serverAddr+'/personal/recordDetail?id='+id
				}
			},
            async getDtl(id){
                this.info= await this.api.diyDetail(id)
                this.info.price1 = this.info.price.split('-')[0]
                this.info.price2 = this.info.price.split('-')[1]
                if(this.info.price2){
                    this.info.price3= parseFloat(this.info.price1).toFixed(2)+"-"+ parseFloat(this.info.price2).toFixed(2)
                }else{
                    this.info.price3= parseFloat(this.info.price1).toFixed(2)
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
