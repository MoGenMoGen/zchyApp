<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="子账号列表"></pen-header>
		<search-view v-model="searchText" place-text="子账户姓名"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="7"><p>姓名：</p></van-col>
                        <van-col span="17"><p>{{item.realNm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="7"><p>联系电话：</p></van-col>
                        <van-col span="17"><p>{{item.mob}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="7"><p >子账户名称：</p></van-col>
                        <van-col span="17"><p>{{item.username}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="7"><p >权限：</p></van-col>
                        <van-col span="17"><p>{{item.rscoNm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="7"><p >创建时间：</p></van-col>
                        <van-col span="17"><p>{{item.crtTm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="7"><p >备注：</p></van-col>
                        <van-col span="17"><p>{{item.rmks}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="4">
                            <p  style="color: #2778BE"  @click="del(item)">删除</p>
                        </van-col>
                        <van-col span="4">
                            <span  style="color: #2778BE" @click="edit(item)">编辑</span>
                        </van-col>
                    </van-row>
                </div>
            </van-list>

        </div>
        <b-button title="新增子账户" @click="toAdd"></b-button>
    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import bButton from "../../../components/personal/bButton";
    import { Toast } from 'vant';
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/subAccount'
				}
			},
		    //新增子账户
            toAdd(){
                this.until.href('./accountAdd.html?type=1')
            },
		    //删除
            async del(item){
               let res=await  this.api.delSubAccount(item.id)
                Toast('删除成功');
                setTimeout(() => {
                    this.pageNo=1
                    this.finished=false
                    this.list=[]
                    this.getList()
                }, 1500);
            },
            //编辑
            edit(item){
                this.until.href('./accountAdd.html?type=2&form='+JSON.stringify(item))
            },
		   async getList(){

				let qry = this.query.new()
               if(this.searchText){
                   this.query.toW(qry,'realNm',this.searchText,'LK')
                   // this.query.toW(qry,'mob',this.searchText,'LK')
                   // this.query.toW(qry,'username',this.searchText,'LK')
               }
				this.query.toP(qry,this.pageNo,this.pageSize)

				let res =await  this.api.getAccountList(this.query.toEncode(qry))
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
                padding: 0.2rem 0;
                .row{
                    padding: 0.1rem 0.4rem;

                }

            }
        }




	}



</style>
