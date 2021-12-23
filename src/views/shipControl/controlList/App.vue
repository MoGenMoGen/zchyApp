<template>
<!--	管控船舶列表，检测船舶列表是同一个列表，根据角色区分-->
    <div id="container">
        <pen-header :title="title"></pen-header>
		<search-view v-model="searchText" place-text="搜索船舶名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>船舶编号：</p></van-col>
                        <van-col span="18"><p>{{item.cd}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>船舶名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >客户名称：</p></van-col>
                        <van-col span="18"><p>{{item.productName}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >船舶状态：</p></van-col>
                        <van-col span="18">
                            <p  v-if="item.statusNm=='设计中' || item.statusNm=='建造中'">{{item.statusNm}}</p>
                            <p v-else style="color: #FF6C38">{{item.statusNm}}</p></van-col>
                    </van-row>

                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >完成时间：</p></van-col>
                        <van-col span="18"><p>{{item.deliveryTm | dateFilter}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >操作：</p></van-col>
                        <van-col span="6">
                            <span  class="btn" @click.stop="toAdd(item)" >新增</span>
                        </van-col>

                    </van-row>

                    <van-icon name="arrow" class="arrow" />
                </div>
            </van-list>

        </div>

    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
    import {mixins} from "../../person/mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                title:''
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
            console.log('角色信息')
		    console.log(this.currentRole)
			
            if(this.currentRole.identityCd=='identity50'){
            //    检验机构
                this.title='检测船舶'
            }else if(this.currentRole.identityCd=='identity40'){
                //监理机构
                this.title='管控船舶'
            }
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/shipControl'
				}
			},

		    //查看详情，跳转到船舶档案页面
            toDetail(item){
                console.log("查看详情")
				let flag=this.until.getQueryString('flag')
                this.until.href("../person/archives.html?id="+item.id+"&shipCd="+item.cd+"&shipStatus="+item.statusNm+'&flag='+flag);
            },
            //新增
            toAdd(item){
                if(this.currentRole.identityCd=='identity50'){
                    //    检验机构
                    this.until.href("./detecAdd.html?id="+item.id+'&shipCd='+item.cd+'&shipStatus='+item.statusNm+'&fileNm='+item.nm);
                }else if(this.currentRole.identityCd=='identity40'){
                    //监理机构

                    this.until.href("./controlAdd.html?id="+item.id+'&shipCd='+item.cd+'&shipStatus='+item.statusNm+'&fileNm='+item.nm);
                }

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
                position: relative;
                .row{
                    padding: 0.12rem 0.4rem;

                    .btn{
                        width: 1.3rem;
                        height: 0.5rem;
                        background: #2878BE;
                        border-radius: 3px;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                .arrow{
                    position: absolute;
                    top:50%;
                    transform: translateY(-50%);
                    right: 0.3rem;
                }

            }
        }




	}



</style>
