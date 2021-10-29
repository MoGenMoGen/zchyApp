<template>
<!--	我的预约-->
    <div id="container">
        <pen-header title="接单"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>服务单号：</p></van-col>
                        <van-col span="17" >
                           <p>{{form.taskId}}</p>
                        </van-col>
                    </van-row>
<!--                    <van-row class="row2" align="center"  type="flex">-->
<!--                        <van-col span="7"><p>负责人员：</p></van-col>-->
<!--                        <van-col span="17" >-->
<!--                            <mob-select text="username" :list="manList"  @change="getMan"></mob-select>-->
<!--                        </van-col>-->
<!--                    </van-row>-->
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p>负责人员：</p></van-col>
                        <van-col span="17" >
                            <input v-model="handleUserNm" placeholder="请输入接单人员">
                        </van-col>
                    </van-row>

                </div>

            </div>
        </div>
       <b-button2 left-text="取消" right-text="确定" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
	import {mapState} from "vuex";

    export default {
		mixins:[mixDtl],
        data() {
            return {
                form:{
                    taskId:'',//维保服务id
                    handleMemId:'',//指派服务商对应的负责人memId
                },

                manList:[],//维保人员列表
                handleUserNm:'',


            };
        },
        components:{
            penHeader,
            bButton2,
            mobSelect,

        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.form.taskId=this.until.getQueryString('id')
            this.getShipList('') //船舶
            this.manList = await this.api.toRepairMan(this.currentRole.id)
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/repairService'
				}
			},
            getMan(e){
                console.log(e)
                this.form.handleMemId=e.memId
            },

            //获取船舶列表
            async getShipList(key){
                let qry = this.query.new()
                this.query.toW(qry,'statusCd','DOCS_STATUS.03','EQ')
                this.query.toP(qry,1,50)
                let param = {
                    orgEnterId:this.currentRole.id,
                    keyWord:key
                }
                let data = await this.api.allShip(this.query.toEncode(qry),param)
                this.shipList = data.data.list
                console.log(this.shipList)
            },


		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                console.log(this.form)
                 if(!this.handleUserNm){
                     Toast("请输入接单人员")
                     return
                 }
                 this.form.handleUserNm=this.handleUserNm
                this.api.toDispatch(this.form).then(res=>{
                    Toast('接单成功');
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
