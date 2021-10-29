<template>
<!--	设计院-->
    <div id="container">
        <pen-header title="船舶展示"></pen-header>
		<search-view v-model="searchText" place-text="搜索船舶名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id">

                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>船舶名称：</p></van-col>
                        <van-col span="18"><p>{{item.nm}}</p></van-col>
                    </van-row>

                    <van-row class="row"   type="flex">
                        <van-col span="6"><p >整船图片：</p></van-col>
                        <van-col span="18"><p><img class="pre" v-for="(j,d) in item.imgList"  :key="d" :src="j"> </p></van-col>
                    </van-row>

                    <van-row class="row"  align="center"  type="flex">
                        <van-col span="6"><p >上传时间：</p></van-col>
                        <van-col span="18"><p>{{item.crtTm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >操作：</p></van-col>
                        <van-col span="4">
                            <p  class="btn" @click="toDel(item)">删除</p>
                        </van-col>
                        <van-col span="4" offset="2">
                            <p  class="btn" @click="toAtler(item)">修改</p>
                        </van-col>

                    </van-row>
                </div>
            </van-list>

        </div>
        <b-button title="添加船舶设计"  @click="toAdd"></b-button>
    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import bButton from "../../../components/personal/bButton";
	import {mixins} from "../../person/mixins/mixins"
    import {Toast} from 'vant'
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/shipShow'
				}
			},
		    //添加船舶设计
            toAdd(){
                this.until.href("./shipAdd.html?type=1")
            },
            //修改
            toAtler(item){
                this.until.href("./shipAdd.html?type=2&id="+item.id)
            },

		    //删除
            toDel(item){
                this.api.delDesignFile(item.id).then(res=>{
                    if(res.code==0){
                        Toast("删除成功")
                        this.finished=false
                        this.pageNo=1
                        this.list=[]
                        this.getList()
                    }

                })
            },
            //我要出售按钮
            showPop(item){

            },
		   async	getList(){
				let qry = this.query.new()
				this.query.toO(qry,'seq','desc')
				this.query.toP(qry,this.pageNo,this.pageSize)

               if(this.searchText){
                   this.query.toW(qry,'nm',this.searchText,'LK')
               }
               this.currentRole=JSON.parse(this.until.loGet('currentRole'))
               this.query.toW(qry,'designId',this.currentRole.id,'EQ')
               let res= await this.api.shipList(this.query.toEncode(qry))
               res.data.list.forEach(item=>{
                   item.imgList=item.imgUrl.split(',')
                   item.crtTm=item.crtTm.split(' ')[0]
               })


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
                    .pre{
                        width:4rem;
                    }
                }

            }
        }




	}



</style>
