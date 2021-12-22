<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="我的船舶"></pen-header>
		<search-view v-model="searchText" place-text="搜索船舶名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id" style="position: relative;">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>船舶编号：</p></van-col>
                        <van-col span="18"><p>{{item.cd}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>船舶名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>

                    <!-- <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >整船金额：</p></van-col>
                        <van-col span="18"><p>{{item.totalPrice}}</p></van-col>
                    </van-row> -->

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
                        <van-col span="6"><p >船舶档案：</p></van-col>
                        <van-col span="6">
                            <p  style="color: #2778BE"  @click="toDetail(item)">查看详情</p>
                        </van-col>
                        <van-col span="6" v-if="item.statusCd=='DOCS_STATUS.03'">
                            <span  style="color: #FF3F3F" @click="showSalePop(item)">我要出售</span>
                        </van-col>
                        <van-col span="6" v-if="currentRole.identityCd!='identity10'">
                            <p  style="color: #FF3F3F;display: none"  @click="showPop2(item)">节点通知</p>
                        </van-col>
                    </van-row>
					<!-- <img :src="Vr" v-if="item.vrUrl" @click.stop="toUrl(item.id)" style="width: 1.38rem; height: 0.43rem;position: absolute;right:0.3rem; bottom: 0.3rem;"> -->
				</div>
            </van-list>

        </div>
        <van-popup v-model="showPop"  :style="{ height: '100%',width:  '100%',background:'#efefef' }" >
            <sale-ship v-if="showPop" @leftClick="showPop=false" @rightClick="sellShip"></sale-ship>
        </van-popup>

        <van-popup v-model="showDevie"  :style="{ height: '100%',width:  '100%',background:'#efefef' }" >
            <node-notify v-if="showDevie" @leftClick="showDevie=false" :title="selectedItem.nm" ></node-notify>
        </van-popup>
    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import saleShip from "../../../components/personal/saleShip";
    import nodeNotify from "../../../components/personal/nodeNotify";
	import {mixins} from "../mixins/mixins"
    import {Toast} from 'vant'
	import {mapState} from "vuex";
	import Vr from '@/assets/img/Vr.png'
    export default {
		mixins:[mixins],
        data() {
            return {
				Vr,
                showPop:false,
                docsId:'',
                showDevie:false,
                selectedItem:{},
            };
        },
        components:{
			searchView,
            penHeader,
            saleShip,
            nodeNotify
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/allShipList'
				}
			},
            showPop2(item){
                this.selectedItem=item
                this.showDevie=true
            },
		    //出售船舶
           async sellShip(form){
                this.showPop=false
               form.orgEnterId=this.currentRole.id
                form.docsId=this.docsId
               await this.api.toSale(form)
               Toast('出售成功')
            },

		    //查看详情，跳转到船舶档案页面
            toDetail(item){
                console.log("查看详情")
                this.until.href("./archives.html?id="+item.id+"&shipCd="+item.cd+"&shipStatus="+item.statusNm);
            },
            //我要出售按钮
            showSalePop(item){
                this.docsId = item.id
                this.showPop=true
            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toO(qry,'cd','asc')
				this.query.toP(qry,this.pageNo,this.pageSize)
               let param={
                   keyWord:this.searchText,
                   orgEnterId:this.currentRole.id
               }
				let res =await  this.api.getMyShipList(this.query.toEncode(qry),param)
				res.data.list.forEach(item=>{
					item.deliveryTm=item.deliveryTm.substring(0,10)
				})
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total
               this.loading = false;
               this.pageNo++

			},
			toUrl(id){
				window.open(`../myFrame/index.html?typeCd=3&id=${id}`)
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
                }

            }
        }




	}



</style>
