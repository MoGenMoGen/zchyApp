<template>
<!--	消息详情-->
    <div id="container">

        <pen-header title="消息详情"></pen-header>

        <div class="body">
            <div class="list-cont">
                <p class="nm">{{info.nm}}</p>
                <p class="sendTm">{{info.sendTm}}</p>
                <div class="cont">
                    {{info.cont}}
<!--                    <span @click="toDetail" v-if="info.targetUrl">查看详情</span>-->
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
                value: '',
				id:'',
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
        mounted(){
			this.id=this.until.getQueryString('id')
            this.getDtl(this.id)
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/msgDtl?id='+this.id
				}
			},
           async  getDtl(id){
               this.info =  await this.api.msgDetail(id)

            }

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
                .nm{
                    text-align: center;
                    font-size: 0.3rem;
                    color: #333333;
                    margin-bottom: 0.1rem;

                }
                .sendTm{
                    text-align: center;
                    font-size: 0.25rem;
                    color: #999999;
                    margin-bottom: 0.1rem;

                }
                .cont{
                    font-size: 0.26rem;
                }

            }
        }





	}



</style>
