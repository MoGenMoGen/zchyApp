<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="客户档案详情"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>客户名称：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.custNm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>联系人：</p></van-col>
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
                        <van-col span="7"><p>客户地址：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.addrNm}}-{{info.address}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>联系邮箱：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.email}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>创建时间：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.crtTm}}</span>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>备注：</p></van-col>
                        <van-col span="17" >
                            <span>{{info.rmks}}</span>
                        </van-col>
                    </van-row>

                </div>


            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import {mixDtl} from "../../person/mixins/mixDtl"
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/profileDetail?id='+this.id
				}
			},
            async getDtl(id){
                this.info= await this.api.custInfoDetail(id)
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
