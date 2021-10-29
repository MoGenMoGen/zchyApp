<template>
<!--	设计院用于快速选择船舶档案用-->
    <div id="container">

        <pen-header title="船舶档案"></pen-header>

        <div class="body">

            <div class="list-cont">
                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id" >
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>船舶编号:</p></van-col>
                            <van-col span="18"><p>{{item.cd}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>船舶名称:</p></van-col>
                            <van-col span="18"><p>{{item.nm}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex">
                            <van-col span="6"><p>船舶状态:</p></van-col>
                            <van-col span="18"><p>{{item.statusNm}}</p></van-col>
                        </van-row>
                        <van-row class="row" type="flex" >
                            <van-col span="6" ><p>操作</p></van-col>
                            <van-col span="5" ><p  class="btn-copy" @click="toAdd(item)">添加</p></van-col>
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
    import searchView from "../../../components/personal/searchView";
    import calRange from "../../../components/personal/calRange";
	import {mixins} from "../../person/mixins/mixins"
    export default {
		mixins:[mixins],
        data() {
            return {

            };
        },
        components:{
            penHeader,
            bButton,
            searchView,
            calRange
        },
        async created(){

        },
        async mounted() {
            this.getList()
        },
        filters:{
            numFilter(value) {
                const realVal = parseFloat(value).toFixed(2);
                return realVal;
            },
        },
        methods: {
           async  toAdd(item){
                let res = await this.api.shipInfoBasic(item.id)

                this.until.seSave('shipFile',JSON.stringify(item))
                this.until.back()
            },

		   async getList(){
               let qry = this.query.new()
               this.query.toP(qry,this.pageNo,this.pageSize)

               let param={
                   keyWord:'',
                   orgEnterId:this.currentRole.id
               }
               let res=await this.api.allShip(this.query.toEncode(qry),param)
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total ? true : false;
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
            padding: 0.2rem;

            .list-cont{


                .list-item{
                    border-radius: 5px;
                    position: relative;
                    width: 100%;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0;
                    background: white;
                    .row{
                        padding: 0.1rem 0.40rem;
                        color: #343434;
                        .btn-copy{
                            padding: 0.05rem 0.05rem;
                            border-radius: 5px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            font-size: 0.20rem;
                            border:1px solid rgba(39, 120, 190, 1);
                            color:rgba(39,120,190,1);
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                            &:active{
                                opacity: 0.5;
                            }
                        }
                        .btn-edit{
                            padding: 0.05rem 0.05rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 5px;
                            width: 100%;
                            font-size: 0.20rem;
                            border:1px solid #E3882E;
                            color:#E3882E;
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                            &:active{
                                opacity: 0.5;
                            }
                        }
                        .btn-look{
                            padding: 0.05rem 0.05rem;
                            border:1px solid #2B891E;
                            border-radius: 5px;
                            color:#2B891E;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            font-size: 0.20rem;
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                            &:active{
                                opacity: 0.5;
                            }
                        }
                    }
                    .price{
                        color: #FF2525;
                        position: absolute;
                        right: 0.2rem;
                        top:50%;
                        transform: translateY(-50%);
                    }

                }
            }
        }





	}



</style>
