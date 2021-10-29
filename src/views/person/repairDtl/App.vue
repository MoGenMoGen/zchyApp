<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="维保服务详情"></pen-header>

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
                            <div class="img-cont">
                                <img v-for="(item,index) in info.imgList" :src="item" :key="index">

                            </div>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>负责人员：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.handleRealNm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>完成时间：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.finishTm}}</span>
                        </van-col>
                    </van-row>
                </div>

<!--服务已完成显示评价内容-->
                <div class="list-item2"  v-if="info.statusCd=='TASK_NOTE_STATUS.100'">
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>评价内容：</p></van-col>
                        <van-col span="17" >
                            <span>解决速度：{{info.speed}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p></p></van-col>
                        <van-col span="17" >
                            <span>服务态度：{{info.attitude}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p></p></van-col>
                        <van-col span="17" >
                            <span>技术能力：{{info.capacity}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p></p></van-col>
                        <van-col span="17" >
                            <span>服务价格：{{info.price}}</span>
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
					if(this.currentRole.identityCd =='identity90'){
						window.location.href = window.location.origin+this.serverAddr+'/personal/repairService'
					}else{
						window.location.href = window.location.origin+this.serverAddr+'/personal/repair'
					}
				}
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
                        .img-cont{
                           display: flex;
                            flex-wrap: wrap;

                            img{
                                margin-right: 5px;
                                width: 45%;
                            }
                        }

                    }
                }
            }
        }





	}



</style>
