<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="客户档案"></pen-header>
		<search-view v-model="searchText" place-text="客户名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id" @click="toDtl(item)">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>客户名称：</p></van-col>
                        <van-col span="18"><p>{{item.custNm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>联系人：</p></van-col>
                        <van-col span="18"><p>{{item.linkman}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >联系电话：</p></van-col>
                        <van-col span="18"><p>{{item.mob}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >客户地址：</p></van-col>
                        <van-col span="18"><p>{{item.addrNm}}-{{item.address}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >创建时间：</p></van-col>
                        <van-col span="18"><p>{{item.typesNm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >备注：</p></van-col>
                        <van-col span="18"><p>{{item.rmks}}</p></van-col>
                    </van-row>
                    <van-icon name="arrow" class="arrow" />
                </div>
            </van-list>

        </div>
        <b-button title="新增客户" @click="toAdd"></b-button>
    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import {mixins} from "../../person/mixins/mixins"
    import bButton from "../../../components/personal/bButton";
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
            bButton
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/profile'
				}
			},
            toDtl(item){
                this.until.href("./profileDtl.html?id="+item.id)
            },
            toAdd(){
                this.until.href("./profileAdd.html")
            },
		   async	getList(){
				let qry = this.query.new()
               this.query.toO(qry,'crtTm',"desc")
               this.query.toP(qry,this.pageNo,this.pageSize)
               if(this.searchText){
                   this.query.toW(qry,'custNm',this.searchText,'LK')
               }
				let res =await  this.api.custInfoList(this.query.toEncode(qry))
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
                position: relative;
                .row{
                    padding: 0 0.4rem;
                    height: 0.5rem;
                }
                .arrow{
                    position: absolute;
                    top:50%;
                    transform: translateY(-50%);
                    right: 0.4rem;
                }

            }
        }




	}



</style>
