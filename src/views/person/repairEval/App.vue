<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="服务评价"></pen-header>

        <div class="body">
            <div class="list-cont">
                <div class="list-item" >
                    <van-row class="row"  type="flex">
                        <van-col span="6"><p>解决速度：</p></van-col>
                        <van-col span="18" class="radio-cont">
                            <van-radio-group v-model="repairFrom.speed" class="radio-group" >
                                <van-radio :name="item.nm"  class="van-radio" v-for="item in evaluateList" :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>
                </div>
                <div class="list-item" >
                    <van-row class="row"  type="flex">
                        <van-col span="6"><p>服务态度：</p></van-col>
                        <van-col span="18" class="radio-cont">
                            <van-radio-group v-model="repairFrom.attitude" class="radio-group" >
                                <van-radio :name="item.nm"  class="van-radio" v-for="item in evaluateList" :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>
                </div>
                <div class="list-item" >
                    <van-row class="row"  type="flex">
                        <van-col span="6"><p>技术能力：</p></van-col>
                        <van-col span="18" class="radio-cont">
                            <van-radio-group v-model="repairFrom.capacity" class="radio-group" >
                                <van-radio :name="item.nm"  class="van-radio" v-for="item in evaluateList" :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>
                </div>
                <div class="list-item" >
                    <van-row class="row"  type="flex">
                        <van-col span="6"><p>服务价格：</p></van-col>
                        <van-col span="18" class="radio-cont">
                            <van-radio-group v-model="repairFrom.price" class="radio-group" >
                                <van-radio :name="item.nm"  class="van-radio" v-for="item in evaluateList" :key="item.id">{{item.nm}}</van-radio>
                            </van-radio-group>
                        </van-col>
                    </van-row>
                </div>

                <div class="list-item2" >
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>联系人：</p></van-col>
                        <van-col span="17" >
                            <input v-model="repairFrom.linkman" placeholder="请输入联系人">
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="repairFrom.phone" placeholder="请输入联系电话" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>职务：</p></van-col>
                        <van-col span="17" >
                            <input v-model="repairFrom.job" placeholder="请输入职务">
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>要求和建议：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="repairFrom.moreEvel" placeholder="请输入要求和建议"></textarea>
                        </van-col>
                    </van-row>

                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>备注：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="repairFrom.rmks" placeholder="请输入要求和建议"></textarea>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p>签名：</p></van-col>
                        <van-col span="17" >
                           <div class="sign">
                               <signature ref='s1' />
                               <p class="signBtn"> <span @click="clear">重签</span> <span style="margin-left: 0.3rem" @click="confirm">确定</span></p>
                               <img :src="repairFrom.sign" class="signImg" v-if="repairFrom.sign">
                           </div>
                        </van-col>
                    </van-row>


                </div>
            </div>
        </div>
       <b-button2 left-text="取消" right-text="提交" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
    import signature from "../../../components/personal/signature";
	import {mixDtl} from "../mixins/mixDtl"
    import { Toast } from 'vant';
	import {mapState} from "vuex";

    export default {
		mixins:[mixDtl],
        data() {
            return {
                repairFrom:{
                    taskId:"",
                    speed: "非常满意",
                    attitude: "非常满意",
                    capacity: "非常满意",
                    price: "非常满意",
                    job: "",
                    moreEvel: "",
                    sign:"",//签名，
                    rmks:''
                },
                evaluateList:[
                    {
                        id:0,
                        nm:'非常满意',
                    },
                    {
                        id:1,
                        nm:'比较满意',
                    },
                    {
                        id:2,
                        nm:'一般',
                    },
                    {
                        id:3,
                        nm:'不满意',
                    }
                    ]
            };
        },
        components:{
            penHeader,
            bButton2,
            signature,


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.repairFrom.taskId=this.until.getQueryString("id")
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/repair'
				}
			},
            clear(){
                this.$refs.s1.clear()
                this.repairFrom.sign = ''
            },
           async  confirm(){
                let temp= this.$refs.s1.getSignature()
                let file =  this.until.base64toFile(temp,"sign.png")
                let res=await  this.api.uploadImg2(file)
               this.repairFrom.sign=res
                console.log(this.repairFrom.sign)


            },
		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                console.log(this.repairFrom)
                this.api.toRepair(this.repairFrom).then(res=>{
                    Toast('评价成功');
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

                .list-item{
                    position: relative;
                    width: 100%;
                    background: white;
                    border-radius: 5px;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0;
                    .row{
                        padding: 0.25rem 0.40rem 0 0.4rem;
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



                }
                .list-item2 {
                    position: relative;
                    background: white;
                    border-radius: 5px;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0.2rem;
                    .row2{
                        padding: 0.2rem 0.2rem;
                        color: #343434;
                        border-bottom: 1px solid rgba(0,0,0,0.1);

                        &:last-of-type{
                            border-bottom: none;
                        }

                        .sign{
                            width: 100%;
                            .signBtn{
                                margin-top: 0.2rem;
                                margin-bottom: 0.2rem;
                                display: flex;
                                align-items: center;

                                color: #2878BE;
                            }
                            .signImg{
                                width: 3.5rem;
                                height: 3.5rem;
                            }
                        }

                        input{
                            width: 100%;
                            padding: 0 0.2rem;
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
