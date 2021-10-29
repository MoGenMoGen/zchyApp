<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="船舶建造"></pen-header>
		<search-view v-model="searchText" place-text="搜索船舶名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>船舶编号：</p></van-col>
                        <van-col span="18"><p>{{item.cd}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>船舶名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >整船金额：</p></van-col>
                        <van-col span="18"><p>{{item.totalPrice}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >船舶状态：</p></van-col>
                        <van-col span="18">
                            <p  v-if="item.statusNm=='设计中' || item.statusNm=='建造中'">{{item.statusNm}}</p>
                            <p v-else style="color: #FF6C38">{{item.statusNm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >交付时间：</p></van-col>
                        <van-col span="18"><p>{{item.deliveryTm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >操作：</p></van-col>
                        <van-col span="8">
                            <p  class="btn" @click="toDetail(item)">完善船舶档案</p>
                        </van-col>

                    </van-row>
                </div>
            </van-list>

        </div>

    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {

            };
        },
        components:{
			searchView,
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/shipbuild'
				}
			},

		    //查看详情，跳转到船舶档案页面
            toDetail(item){
                console.log("查看详情")
                this.until.href("./archives.html?id="+item.id+"&shipCd="+item.cd+"&shipStatus="+item.statusNm+"&buildW=2");
            },
            //我要出售按钮
            showPop(item){

            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toO(qry,'seq','desc')
				this.query.toP(qry,this.pageNo,this.pageSize)
               let param={
                   keyWord:this.searchText,
                   orgEnterId:this.currentRole.id
               }
				let res =await  this.api.allShip(this.query.toEncode(qry),param)
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
        .searchView{
            position: fixed;
            top:1rem;
            left: 0;
            right: 0;

        }
        .searchPlace{
            height: 1.3rem;
        }
        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0 0.2rem 0.2rem 0.2rem;



            .list-item{
                width: 100%;
                background: white;
                border-radius: 5px;
                margin-bottom: 0.2rem;
                padding: 0.15rem 0;
                .row{
                    padding: 0.12rem 0.4rem;
                    .btn{
                        border-radius: 5px;
                        border: 1px solid rgba(39,120,190,1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0.05rem 0;
                        color: rgba(39,120,190,1);
                    }
                }

            }
        }




	}



</style>
