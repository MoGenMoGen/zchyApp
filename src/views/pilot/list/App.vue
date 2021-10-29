<template>
    <!--	消息详情-->
    <div id="container">
        <pen-header :title="nm" @back="back" id="pen-header"></pen-header>
        <van-sticky :offset-top="height">
            <div class="body1">
                <div class="list-cont1">
                    <div class="line1">
                        <p  v-for="(item,index) in tab1" :key="item.id"  @click="chooseTab1(item.id)">
                            <span :class="{active: tab1Id==item.id}">{{item.nm}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </van-sticky>

        <div class="body2">
            <div class="list-cont2">

                <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
                        <van-row class="row"  align="center" type="flex">
                            <van-col span="10">
                                <div class="left">
                                    <img :src="item.imgUrl" style="width: 100%;object-fit: cover">
                                </div>
                            </van-col>
                            <van-col span="13" offset="1" >
                                <div class="right">
                                    <p>{{item.nm}}</p>
                                    <p>{{item.cont}}<span @click="toDetail(item)">查看更多<van-icon name="arrow" /></span></p>
                                    <p>{{item.releTm}}</p>
                                </div>
                            </van-col>
                        </van-row>

                    </div>
                </van-list>

            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bg from '@/assets/img/bg.png'
	import {mapState} from "vuex";
    export default {

        data() {
            return {
                bg,
                nm:'',
                value: '',
                tab1Id:-1,//第一个标签页选中
                adertList:[],//轮播图列表
                pageNo:1,
                pageSize:10,
                finished:false,//标记是否已经加载完

                loading:false,
                immediate:false,
                list:[],
                tab1:[],
                height:55,//顶部高度


            };
        },
        components:{
            penHeader,

        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        mounted(){


            this.getCatList()
            this.height= document.getElementById("pen-header").clientHeight
            console.log("顶部高度"+this.height)
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
					let id=this.until.getQueryString('id')
					window.location.href = window.location.origin+this.serverAddr+'/pilotService/serviceInfo?id='+id
				}
			},
            back(){
              this.until.loRemove('pilotTabId')
            },
            //跳转详情页面
            toDetail(item){
                this.until.loSave('pilotTabId',this.tab1Id)
                this.until.href("./referenceDetail.html?id="+item.id)
            },
            chooseTab1(id){
                if(id!=this.tab1Id) {
                    this.tab1Id = id
                    this.pageNo=1
                    this.list=[]
                    this.finished=false
                    this.getList()
                }
            },
            async  getList(){
                let qry = this.query.new()
                this.query.toW(qry,'cid',this.tab1Id,'EQ')
                this.query.toP(qry,this.pageNo,this.pageSize)
                let res =await this.api.serviceInfo(this.query.toEncode(qry))
                res.data.list.forEach((item,index) =>{
                    item.cont = item.cont.replace(/<\/?[^>]*>/g, "").slice(0,35) + '...';
                    item.cont = item.cont.replace(/(&nbsp;)/g, "");
                    // this.objectFitImages(this.$refs['img'+index])
                    // console.log(item.id)
                })

                this.list.push(...res.data.list)
                // 加载状态结束
                this.finished = this.list.length >= res.page.total
                this.loading = false;
                this.pageNo++
            },
            //分类列表
            async getCatList(){
                let qry = this.query.new()
                // this.query.toW(qry,'pid',this.until.getQueryString('id'))
                let data = await this.api.serviceTree(this.query.toEncode(qry))
                console.log(data)
                let catList = data.data.list.find(item=>item.id==this.until.getQueryString('id'))
                this.nm = catList.nm
                this.tab1= catList.children
                if(this.until.loGet('pilotTabId')){
                    this.chooseTab1(this.until.loGet('pilotTabId'))
                }else{
                    this.chooseTab1(this.tab1[0].id)
                }
            },
            onLoad(){
                if(!this.finished){
                    console.log("加载。。。。")
                    this.getList()
                }

            },


        }

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
    #container{

        .top{
            width: 100%;
            height: 3.7rem;
            z-index: 9;
            position: relative;
            .top-1{
                height: 2.6rem;
                width: 100%;
                background-size: 100% 100% !important;
            }
            .top-2{
                height: 1.1rem;
            }
            .my-swipe{
                position: absolute;
                top:0.2rem;
                left: 0;
                right: 0;
                height: 3.5rem;
                width: 100%;
                .swipe-img{
                    border-radius: 5px;
                    display: block;
                    margin: 0 auto;
                    width: 94%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
        .top-place{
            height: 3.7rem;
        }

        .body1{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0.2rem 0.2rem 0 0.2rem;
            z-index: 10;
            .list-cont1{
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                background: white;
                position: relative;
                padding: 0.2rem 0 0 0;

                .line1{
                    width: 100%;
                    display: flex;
                    background: white;
                    height: 0.8rem;
                    align-items: center;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    /*标题*/
                    p{
                        font-size: 0.285rem;
                        width: 25%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        /*对所有属性过渡0.2s*/
                        transition: all 0.2s;
                        color: #666666;
                        span{
                            height: 100%;
                            display: flex;
                            align-items: center;
                        }
                        &:hover{
                            cursor: pointer;
                        }
                    }

                }

            }
        }

        .body2{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0 0.2rem 0.2rem  0.2rem;
            .list-cont2{
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
                background: white;
                position: relative;
                padding:0 0.2rem 0 0.2rem;



                .list-item{
                    .row{
                        padding: 0.2rem 0.2rem;
                        font-size: 0.23rem;
                        border-bottom: 1px solid rgba(0,0,0,0.1);
                        .left{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            img{
                                width: 100%;
                                object-fit: cover;

                            }
                        }

                        .right{
                            p:nth-of-type(1){
                                color: #343434;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                font-size: 0.28rem;
                            }
                            p:nth-of-type(2){
                                color: #666666;
                                font-size: 0.20rem;
                                span{
                                    color: rgba(39, 120, 190, 1);
                                }
                            }
                            p:nth-of-type(3){
                                color: #666666;
                                font-size: 0.20rem;
                            }
                        }
                    }
                }



            }
        }

    }


    .active{
        color: #333333;
        border-bottom: 2px solid #2778BE !important;
        font-weight: bold;
    }


</style>
