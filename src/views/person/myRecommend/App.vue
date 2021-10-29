<template>
<!--	我的预约-->
    <div id="container">

        <pen-header title="我的推荐"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>客户名称：</p></van-col>
                            <van-col span="18"><p>{{item.tDsCommissionBuyerRealNm}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>客户类型：</p></van-col>
                            <van-col span="18"><p>{{item.tDsCommissionLevel}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>联系人：</p></van-col>
                            <van-col span="18"><p>{{item.tDsCommissionBuyerRealNm}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>联系电话：</p></van-col>
                            <van-col span="18"><p>{{item.tDsCommissionBuyerPhone}}</p></van-col>

                        </van-row>
                        <van-row class="row" align="center" type="flex">
                            <van-col span="6"><p>成交时间：</p></van-col>
                            <van-col span="18"><p>{{item.crtTm}}</p></van-col>

                        </van-row>


                    </div>
                </van-list>
            </div>
        </div>


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
					window.location.href = window.location.origin+this.serverAddr+'/personal/myRecommend'
				}
			},
            toSub(){
              this.until.href('../shipMan/designAppo.html')
            },
		    //查看详情，跳转到船舶档案页面
            toDetail(item){
                console.log("查看详情")
                // this.until.href("./subscribeDtl.html?id="+item.id)
            },

		   async	getList(){
				let qry = this.query.new()
				this.query.toP(qry,this.pageNo,this.pageSize)
				let res =await  this.api.myRecommend(this.query.toEncode(qry))
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total
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
                        padding: 0.08rem 0.40rem;
                        color: #343434;
                    }

                }
            }
        }



	}



</style>
