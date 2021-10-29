<template>
<!--	我的消息-->
    <div id="container">

        <pen-header title="我的地址"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id" @click="choose(item)">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p class="receNm">{{item.receNm}}</p></van-col>
                            <van-col span="8"><p  class="receMob">{{item.receMob}}</p></van-col>
                            <van-col span="4" v-if="item.hasDef==1"><p class="guanli" ><span>默认</span></p></van-col>
                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="20"><p class="detail" >{{item.addrNm}}-{{item.addrDtl}}</p></van-col>
                        </van-row>

                        <img  :src= "edit" class="arrow" @click.stop="toEdit(item)">

                    </div>
                </van-list>
            </div>
        </div>
        <b-button title="新增收货地址" @click="addAddr"></b-button>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                edit: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/d35568a0b671404c9a922268ae91e9ea_addr-edit.png',
                modify:'',
                type:'',
            };
        },
        components:{
            penHeader,
            bButton,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
		    this.modify = this.until.getQueryString('modify')
		    this.type = this.until.getQueryString('payType')
            this.getList()
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
					window.location.href = window.location.origin+this.serverAddr+''
				}
			},
            toEdit(item){
				console.log(item)
                this.until.href("./addAddr.html?type=2&info="+JSON.stringify(item))
            },
            addAddr(){
                this.until.href("./addAddr.html?type=1")
            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toP(qry,this.pageNo,100)
				let res =await  this.api.addrList(this.query.toEncode(qry))
               console.log("列表")
               console.log(res)
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total
               this.loading = false;
               this.pageNo++
			},
            choose(item){
                console.log(item)
                if(this.modify == '1'){
                    location.replace("../trading/orderSubmit.html?addrId="+item.id + "&payType=" + this.type );
                    // this.until.href()
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
                background: white;
                .list-item{
                    position: relative;
                    width: 100%;

                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 0.15rem 0;
                    .row{
                        padding: 0.1rem 0.20rem;
                        .receNm{
                            color: #333333;
                        }
                        .receMob{
                            color: #333333;
                            font-size: 0.28rem;
                        }
                        .guanli{
                            span{
                                background: #2778BE;
                                color: white;
                                font-size: 0.20rem;
                                padding: 0.02rem 0.1rem;
                                border-radius: 1px;
                            }
                        }
                        .detail{
                            font-size: 0.23rem;
                            color: #777777;
                        }
                    }
                    .arrow{
                        position: absolute;
                        right: 0.35rem;
                        width: 0.5rem;
                        height: 0.5rem;
                        top:50%;
                        transform: translateY(-50%);
                    }

                }
            }
        }

	}



</style>
