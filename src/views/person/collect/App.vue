<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="我的收藏"></pen-header>
		<search-view v-model="searchText" place-text="搜索收藏名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">

<!--            船东-->
            <div class="list-header" >
                <ul >
                    <li v-for="item in tab1" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
            </div>


            <div class="header-place"></div>
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate">
                <div class="list-cont">
                    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)" >
<!-- 店铺-->
                        <div class="coll-item-shop" v-if="tabId==4">
                            <img :src="item.shopImg">
                            <p>{{item.nm}}</p>
                        </div>
<!--学习和直播-->
                        <div class="coll-item-learning" v-if="tabId==5 || tabId==6">
                            <img :src="item.coverUrl">
                            <p>{{item.nm}}</p>

                        </div>
<!--船舶，产品-->
                        <div class="coll-item-pro" v-if=" tabId==2 || tabId==3">
                            <img :src="item.fmImgUrl">
                            <p>{{item.nm}}</p>
                            <p><span style="font-size: 0.22rem">￥</span>{{item.origPrice}}</p>
                        </div>
<!--船舶方案，-->
                        <div class="coll-item-pro" v-if="tabId==1 ">
                            <img :src="item.solutionImg">
                            <p>{{item.solutionNm}}</p>
                            <p><span style="font-size: 0.22rem">￥</span>{{item.solutionMinPrice}}- <span style="font-size: 0.22rem">￥</span>{{item.solutionMaxPrice}}</p>
                        </div>


                    </div>
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
                tabId:'-1',
                //船东identity10
                tab1:[
                    {
                        id:1,
                        nm:'船舶方案',

                    },
                    {
                        id:2,
                        nm:'船舶',

                    },
                    {
                        id:3,
                        nm:'产品',

                    },
                    {
                        id:5,
                        nm:'学习',

                    },
                    {
                        id:4,
                        nm:'店铺',

                    },
                    {
                        id:6,
                        nm:'直播',

                    }
                ],

                identityCd:'',//

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

            this.identityCd=this.currentRole.identityCd
            this.toChoose(this.tab1[0])
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/collect'
				}
			},
            toChoose(item){
                if(item.id!=this.tabId){
                    this.tabId=item.id
                    this.pageNo=1
                    this.list=[]
                    this.getList()
                }
            },


            toDetail(item){
                //船舶方案，
                if(this.tabId==1){
                    this.until.href("../shipMan/shipDetail.html?id="+item.solutionId);
                }else if(this.tabId==2){
                //船舶，
                    this.until.href("../trading/shipDetail.html?id="+item.goodsId);
                }else if(this.tabId==3){
                //    产品
                    this.until.href("../trading/shipDetail.html?id="+item.goodsId);
                } else if(this.tabId==4){
                //    店铺
                    this.until.href("../trading/storeHome.html?id="+item.targetId);

                }else if(this.tabId==6){
                //    直播
                    this.until.href("../learning/detail.html?id="+item.targetId+"&type="+item.type);

                }else if(this.tabId==5){
                //    学习
                    this.until.href("../learning/liveDetail.html?id="+item.targetId+"&type="+item.type);

                }
            },
            //我要出售按钮
            showPop(item){

            },
		   async	getList(){
               let res = null
				let qry = this.query.new()

               this.query.toP(qry,this.pageNo,this.pageSize)

               if(this.tabId!=5){
                   this.query.toW(qry,'type',this.tabId,'EQ')
               }

               if(this.tabId==1){
                   res = await this.api.collect1(this.query.toEncode(qry),this.searchText)
               }else if(this.tabId==2 || this.tabId==3){
                   res = await this.api.collect2(this.query.toEncode(qry),this.searchText)
               }else if(this.tabId==4){
                   res = await this.api.collect3(this.query.toEncode(qry),this.searchText)
               }else if(this.tabId==5){
                   res = await this.api.collect4(this.query.toEncode(qry),this.searchText)
               }else {
                   res = await this.api.collect5(this.query.toEncode(qry),this.searchText)
               }

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

            .header-place{
                height: 0.8rem;
            }

            .list-header {
                position: fixed;
                top:2.3rem;
                left: 0.2rem;
                right: 0.2rem;
                background: white;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                z-index: 9;

                ul{
                    white-space: nowrap;
                    overflow-x: auto;
                    width: 100%;
                    display: flex;
                    height: 0.8rem;
                    li{
                        height: 100%;
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrap;
                        padding: 0 0.2rem;
                        span{
                            color: #666666;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }
            }
            .list-cont{
                padding:0.2rem 0.08rem 0 0.08rem;
                background: white;
                border-bottom-right-radius: 5px;
                border-bottom-left-radius: 5px;
                .list-item{
                    display: inline-block;
                    width: 50%;
                    background: white;
                    color: #343434;
                    position: relative;
                    margin-bottom:  0.2rem;
                    .coll-item-shop{
                        border-radius: 5px;
                        margin: 0 auto;
                        width: 3.25rem;
                        border: 1px solid #E9E9E9;
                        height: 4.15rem;
                        img{
                            width: 3.25rem;
                            height: 3.25rem;
                            display: block;
                            margin: 0 auto;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                            object-fit: cover;
                        }
                        p:nth-of-type(1){
                            padding: 0 0.2rem;
                            color: #666666;
                            font-size: 0.28rem;
                            margin-top: 0.2rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }

                    .coll-item-learning{
                        border-radius: 5px;
                        margin: 0 auto;
                        width: 3.25rem;
                        border: 1px solid #E9E9E9;
                        height: 4.15rem;
                        img{
                            width: 3.25rem;
                            height: 3.25rem;
                            display: block;
                            margin: 0 auto;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                            object-fit: cover;
                        }
                        p:nth-of-type(1){
                            padding: 0 0.2rem;
                            color: #666666;
                            font-size: 0.28rem;
                            margin-top: 0.2rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                    }
                    .coll-item-pro{
                        border-radius: 5px;
                        margin: 0 auto;
                        width: 3.25rem;
                        border: 1px solid #E9E9E9;
                        height: 4.5rem;
                        img{
                            width: 3.25rem;
                            height: 3.25rem;
                            display: block;
                            margin: 0 auto;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                            object-fit: cover;
                        }
                        p:nth-of-type(1){
                            padding: 0 0.2rem;
                            color: #666666;
                            font-size: 0.28rem;
                            margin-top: 0.2rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        p:nth-of-type(2){
                            padding: 0 0.2rem;
                            color: #FF3B3F;
                            font-size: 0.28rem;
                            margin-top: 0.1rem;
                        }
                    }



                }
            }


        }


	}

    .active{
        color: #343434 !important;
        border-bottom: 3px solid #2878BE;
    }


</style>
