<template>
<!--	我的消息的-->
    <div id="container">

        <pen-header title="我的消息"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="23" offset="1"><p>{{item.nm}}</p></van-col>
                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="23" offset="1">
                                <p style="color: #999999;font-size: 0.26rem">{{item.sendTm}}</p>
                            </van-col>
                        </van-row>
                        <van-icon name="arrow" color="#666666" class="arrow" />
                        <img :src="icRead" class="read" v-if="item.status==0">
                    </div>
                </van-list>
            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import icRead from './img/新消息红点.png'
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                icRead,
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

            window.console.log("屏幕宽度："+window.screen.width)
            window.console.log("设备像素比："+window.devicePixelRatio)
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/message'
				}
			},
            toDetail(item){
              this.until.href("./msgDtl.html?id="+item.id)
            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toP(qry,this.pageNo,this.pageSize)
				let res =await  this.api.msgList(this.query.toEncode(qry))
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total;
               this.loading = false;
               this.pageNo++

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
                        padding: 0.08rem 0.20rem;
                    }
                    .arrow{
                        position: absolute;
                        right: 0.2rem;
                        top:50%;
                        transform: translateY(-50%);
                    }
                    .read{
                        width: 0.2rem;
                        position: absolute;
                        left: 0.15rem;
                        top:50%;
                        transform: translateY(-50%);
                    }

                }
            }
        }





	}



</style>
