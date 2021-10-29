<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="我的积分"></pen-header>
		<div class="total-jifen">

          <div class="total-cont">
              <van-row align="center" type="flex" >
                  <van-col span="2"></van-col>
                  <van-col span="3">
                      <div style="display: flex;align-items: center;height: 0.9rem;">
                          <img style="width: 80%" :src="icJifen">
                      </div>
                  </van-col>
                  <van-col span="10">
                      <p style="display: flex;align-items: center">
                          <span style="color: #E54246;font-size: 0.40rem;margin-right: 0.2rem">8000</span>
                          <span>当前积分</span>
                      </p>
                  </van-col>

              </van-row>
          </div>

        </div>
        <div class="searchPlace"></div>

        <div class="body">

<!--            船东-->
            <div class="list-header">
                <ul >
                    <li v-for="item in tab1" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
                </ul>
                <van-row  align="center" type="flex" class="tips">
                    <van-col span="8"><p >事件</p></van-col>
                    <van-col span="8"><p >时间</p></van-col>
                    <van-col span="8"><p >积分</p></van-col>
                </van-row>
            </div>



            <div class="header-place"></div>
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"
                       @load="onLoad"
                       :immediate-check="immediate" >
               <div class="list-cont">
                   <div class="list-item" v-for="item in tmpList" :key="item.id" >
                       <van-row class="row" align="center" type="flex">
                           <van-col span="8"><p>{{item.nm}}</p></van-col>
                           <van-col span="8"><p>{{item.tm}}</p></van-col>
                           <van-col span="8"><p>{{item.num}}</p></van-col>
                       </van-row>
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
                icJifen:'https://sinovat.oss-cn-shanghai.aliyuncs.com/75c505a2aa0d4fc587e4bf805e11921f_jifen.png',
                //船东identity10
                tab1:[
                    {
                        id:0,
                        nm:'收入明细',
                    },
                    {
                        id:1,
                        nm:'支出明细',

                    }
                ],

                identityCd:'',//
                tmpList:[
                    {
                        id:1,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'65',
                    },
                    {
                        id:2,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'655',
                    },
                    {
                        id:3,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'333',
                    },
                    {
                        id:4,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'667767',
                    },
                    {
                        id:65,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'65',
                    },
                    {
                        id:56,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'655',
                    },
                    {
                        id:33,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'333',
                    },
                    {
                        id:355,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'667767',
                    },
                    {
                        id:678,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'65',
                    },
                    {
                        id:345,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'655',
                    },
                    {
                        id:788,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'333',
                    },
                    {
                        id:6332,
                        nm:'时间名称',
                        tm:'2012-12-12',
                        num:'667767',
                    }


                ]

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
					window.location.href = window.location.origin+this.serverAddr+'/sinovat/personal/'
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

            //我要出售按钮
            showPop(item){

            },
		   async	getList(){
				let qry = this.query.new()
               this.query.toW(qry,'contractTypeCd',this.cd,'EQ')

				this.query.toP(qry,this.pageNo,this.pageSize)
               let param={
                   keyWord:this.searchText,
                   orgEnterId:this.currentRole.id
               }
				let res =await  this.api.contractList(this.query.toEncode(qry),param)
               this.list.push(...res.data.list)
               // 加载状态结束
               console.log("长度。。。。。。" +this.list.length)
               console.log("总数。。。。。。" +res.page.total)
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
        .total-jifen{
            height: 1.3rem;
            position: fixed;
            top:1rem;
            left: 0;
            right: 0;
            padding: 0.2rem;
            background: @backgroundColor;
            z-index: 9;
            .total-cont{
                background: white;
                border-radius: 5px;
                height: 0.9rem;



            }
        }
        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0 0.2rem 0.2rem 0.2rem;

            .header-place{
                height: 1.6rem;
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
                .tips{
                    p{
                        height: 0.8rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #9A9A9A;
                        font-size: 0.26rem;
                    }
                }
                ul{
                    width: 100%;
                    display: flex;
                    height: 0.8rem;
                    li{
                        height: 100%;
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
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
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
                background: white;
                .list-item{
                    width: 100%;
                    background: white;
                    padding: 0.2rem 0;
                    color: #343434;
                    position: relative;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    .row{
                        padding: 0.1rem 0.3rem;
                        p{
                            text-align: center;
                        }

                    }
                    /*&:first-of-type{*/
                    /*    border-bottom-right-radius: 5px;*/
                    /*    border-bottom-left-radius: 5px;*/
                    /*    background: red;*/
                    /*}*/

                }
            }



        }


	}

    .active{
        color: #343434 !important;
        border-bottom: 3px solid #2878BE;
    }


</style>
