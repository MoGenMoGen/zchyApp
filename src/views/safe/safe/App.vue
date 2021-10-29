<template>
    <div id="container">
        <pen-header title="金融保险"  ></pen-header>

        <div class="top" >
            <div class="top-1" :style="{backgroundImage:'url('+bg+')'}">
            </div>
            <div class="top-2">
                <van-row class="row"  type="flex" align="center">
                    <van-col  span="2">
                        <img :src="ic1">
                    </van-col>
                    <van-col  span="20" offset="2">
                        <input placeholder="单位名称" v-model="form.company">
                    </van-col>
                </van-row>
                <van-row class="row"  type="flex" align="center">
                    <van-col  span="2">
                        <img :src="ic2">
                    </van-col>
                    <van-col  span="20" offset="2">
                        <input placeholder="融资金额/万元" v-model="form.amt">
                    </van-col>
                </van-row>
                <van-row class="row"  type="flex" align="center">
                    <van-col  span="2">
                        <img :src="ic3">
                    </van-col>
                    <van-col  span="20" offset="2">
                        <input placeholder="联系人" v-model="form.linkman">
                    </van-col>
                </van-row>

                <van-row class="row"  type="flex" align="center">
                    <van-col  span="2">
                        <img :src="ic4">
                    </van-col>
                    <van-col  span="20" offset="2">
                        <input placeholder="联系电话" v-model="form.phone">
                    </van-col>
                </van-row>
                <van-row class="row"  type="flex" align="center">
                    <van-col  span="24">
                       <p class="btn" @click="submit">快速申请</p>
                    </van-col>

                </van-row>


            </div>

            <div class="top-3" style="margin-top: 0.2rem">
                <div class="title">
                    <img :src="left"/>金融服务<img :src="right"/>
                </div>
                <van-row class="row2" :border="false"  type="flex" align="center">
                    <van-col  span="24">
                        <img :src="lc[0].imgUrl" v-if="lc.length>0">
                    </van-col>
                </van-row>

                <van-grid :column-num="3" :border="false" :gutter="5">
                    <van-grid-item v-for="(item,m) in adertList1" :key="m" v-if="m>0" @click="toPage(item.locUrl)">
                        <div class="adert">
                            <p>{{item.nm}}</p>
                            <van-image
                                    width="100%"
                                    height="100%"
                                    fit="cover"
                                    :src="item.imgUrl"
                            />
                        </div>
                    </van-grid-item>
                </van-grid>
                <div class="title">
                    <img :src="left"/>申请金融机构<img :src="right"/>
                </div>
<!--                金融合作机构-->

                <van-grid :column-num="3" :gutter="10">
                    <van-grid-item v-for="(item,m) in list1" :key="m">
                        <van-image :src="item.imgUrl" />
                    </van-grid-item>
                </van-grid>


            </div>
            <div class="top-3" style="margin-top: 0.2rem">
                <div class="title">
                    <img :src="left"/>保险服务<img :src="right"/>
                </div>
                <van-grid :column-num="3" :border="false" :gutter="5">
                    <van-grid-item v-for="(item,m) in adertList2" :key="m" @click="toPage(item.locUrl)" >
                        <div class="adert">
                            <p>{{item.nm}}</p>
                            <van-image
                                    width="100%"
                                    height="100%" fit="cover"
                                    :src="item.imgUrl"
                            />
                        </div>
                    </van-grid-item>
                </van-grid>
                <div class="title">
                    <img :src="left"/>合作保险机构<img :src="right"/>
                </div>
                <!--合作保险机构-->

                <van-grid :column-num="3" :gutter="10">
                    <van-grid-item v-for="(item,m) in list2" :key="m">
                        <van-image :src="item.imgUrl" />
                    </van-grid-item>
                </van-grid>
            </div>

            <div class="top-3" style="margin-top: 0.2rem;margin-bottom: 0.2rem;">
                <div class="title">
                    <img :src="left"/>保险租赁业务<img :src="right"/>
                </div>
                <van-grid :column-num="2" :border="false" :gutter="5">
                    <van-grid-item v-for="(item,m) in adertList3" :key="m" @click="toPage(item.locUrl)" >
                        <div class="adert">
                            <p>{{item.nm}}</p>
                            <van-image
                                    width="100%"
                                    height="100%" fit="cover"
                                    :src="item.imgUrl"
                            />
                        </div>
                    </van-grid-item>
                </van-grid>
            </div>


        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bg from '@/assets/img/bg.png'
    import ic1 from './img/单位名称.png'
    import ic2 from './img/融资金额.png'
    import ic3 from './img/联系人.png'
    import ic4 from './img/联系电话.png'
    import icLiucheng from './img/流程图.png'
    import ic5 from './img/服务介绍.png'
    import ic6 from './img/申请流程.png'
    import ic7 from './img/准备资料.png'
    import icTitle1 from './img/金融合作机构.png'
    import icTitle2 from './img/合作保险机构.png'

    import left from '@/assets/img/tradingL.png'
    import right from '@/assets/img/tradingR.png'
	import {mapState} from "vuex";


    export default {

        data() {
            return {
                left,
                right,
                ic1,
                ic2,
                ic3,
                ic4,
                ic5,
                ic6,
                ic7,
                bg,
                icLiucheng,
                icTitle1,
                icTitle2,
                info:{},//
                lc:[],
                adertList1:[],
                adertList2:[],//保险服务
                adertList3:[],//保险服务
                list1:[],//金融合作机构
                list2:[],//保险合作机构

                form:{
                    company:'',
                    amt:'',
                    linkman:'',
                    phone:''
                },



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

            this.getData()
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
					window.location.href = window.location.origin+this.serverAddr+'/safe/safe'
				}
			},
            async getData(){
                let list = await this.api.getAdert('JRBX')
                this.lc = list.splice(0,1)
                console.log('list')
                console.log(list)
                console.log("金融服务")
                console.log(this.lc)
                this.adertList1 = list.splice(0,4)
                console.log(this.adertList1)
                this.adertList2 = list.splice(0,3)
                this.adertList3 = list.splice(0,2)
                this.list1 = await this.api.getAdert('financial')
                this.list2 = await this.api.getAdert('insurance')
            },
            toPage(url){
                if(url){
                    let myUrl = url.split('^')

                    window.location.href=myUrl[myUrl.length-1]
                }
            },
            submit(){
                if(!this.form.company){
                    this.$toast.fail('请输入单位名称');
                }else if(!this.form.amt){

                    this.$toast.fail('请输入融资金额');
                }else if(!this.form.linkman){

                    this.$toast.fail('请输入联系人');
                }else if(this.reg.checkPhone(this.form.phone)!='ok'){

                    this.$toast.fail(this.reg.checkPhone(this.form.phone));
                }else {
                    this.api.financeApplic(this.form).then(res=>{
											this.$toast.success('提交成功')
                    })

                }

            },
        }

    };
</script>
<style lang="less">
    .top-3{
        .van-grid-item__content{
            padding: 0;
        }
    }
</style>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{
        .list{
            width: 100%;
            overflow: hidden;
            padding-left:2.5% ;
            box-sizing: border-box;

            li{
                float: left;
                width:30% ;
                margin-right: 2.5%;
                border: 1px solid #DEDEDE;
                box-sizing: border-box;
                display: flex;
                display: -webkit-flex;
                height: 1.5rem;
                img{
                    display: block;
                    margin: auto;
                }
            }
        }
        .top{
            /*height: 3.7rem;*/
            position: relative;
            z-index: 9;
            padding: 0.2rem;
            .top-1{
                position: absolute;
                top:0;
                left: 0;
                right: 0;
                height: 2.6rem;
                width: 100%;
                background-size: 100% 100% !important;
                z-index: -1;
            }
            .top-2{
                border-radius: 5px;
                background: white;
                padding: 0.3rem 0.9rem;
                font-size: 0.3rem;
                .row{
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 0.25rem 0.3rem;
                    margin-bottom: 0.2rem;
                    &:last-of-type{
                        border-bottom: none;
                        margin-top: 0.1rem;
                    }
                    img{
                        width: 0.35rem;
                    }
                    .btn{
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: white;
                        height: 0.70rem;
                        background: #2778BE;
                        border-radius: 3px;
                    }
                    input{
                        width: 100%;
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
            .top-3{
                border-radius: 5px;
                background: white;
                padding: 0.2rem 0;
                margin: 0.2rem auto;
                .row2{
                    margin: 0.2rem auto;
                    .liucheng{

                        width: 100%;
                    }

                }
            }



        }

        .adert{
            position: relative;
            height: 1.5rem;
            p{
                position: absolute;
                background: rgba(0,0,0,0.3);
                color: #FFFFFF;
                text-align: center;
                height: 0.4rem;
                line-height: 0.4rem;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 5;
            }
        }
        .title{
            width: 100%;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            font-size: 0.3rem;
            color: #303030;
            justify-content: center;
            padding-top: 0.4rem;
            padding-bottom: 0.2rem;
            font-weight: bold;
            img{
                width: 1rem;
                margin: 0 0.2rem;
            }
        }

	}




</style>
