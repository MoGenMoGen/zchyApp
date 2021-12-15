<template>
<!--	消息详情-->
    <div id="container"  :style="{backgroundImage:'url('+bg+')'}">
        <pen-header v-if="isMyApp()"  title="新闻资讯详情" :show-right="showRight" @rightClick="rightClick"></pen-header>
        <div class="top" >
            <div class="top-1" :style="{backgroundImage:'url('+bg+')'}">
            </div>
            <div class="top-2">
                <van-row class="row"  align="center"  type="flex">
                    <van-col span="24">
                       <p style="text-align: center;color: #343434;font-size: 0.3rem;font-weight: bold">{{info.nm}}</p>
                    </van-col>
                </van-row>
                <van-row class="row"  justify="space-around" align="center"  type="flex">
                    <van-col span="6" style="color: #9A9A9A;text-align: center;">
                        <p >{{info.releTm}}</p>
                    </van-col>
                    <van-col span="10" style="color: #9A9A9A;text-align: center;">
                        <p style="white-space: nowrap;">来源:{{info.src}}</p>
                    </van-col>
                    <van-col span="8" style="color: #9A9A9A;text-align: center;">
                        <p>作者:{{info.author}}</p>
                    </van-col>
                </van-row>
                <div class="info" v-html="info.cont">

                </div>
            </div>


        </div>
        <van-popup v-model="showBottom" position="bottom" :style="{ height: '30%' }" >
           <bottom-share :info="info" description="新闻资讯分享" :thumb="info.imgUrl"></bottom-share>
        </van-popup>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bottomShare from "../../../components/personal/bottomShare";
    import bg from '@/assets/img/bg.png'
	import {mapState} from "vuex";

    export default {

        data() {
            return {
                bg,
                info:{},//
                showRight:true,//显示头部右侧分享按钮
                showBottom:false,//显示底部
            };
        },
        components:{
            penHeader,
            bottomShare,

        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        update(){
            document.getElementsByTagName('img').width="100%"
            document.getElementsByTagName('img').objectFit="cover";
            document.getElementsByTagName('iframe').width="100%"
            document.getElementsByTagName('table').width="100%"
        },
        mounted(){
            let id=this.until.getQueryString("id")
            this.getDetail(id)
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
		methods: {
            isMyApp(){
                let u = navigator.userAgent;
                let flag = u.indexOf('zhongChuang') > -1;
                return flag;
            },

			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					let id=this.until.getQueryString("id")
					window.location.href = window.location.origin+this.serverAddr+'/tradeInfo/infoDetail?id='+id
				}
			},
           async  getDetail(id){
                let res = await this.api.detailInfo(id)
                this.info=res.data
				this.info.cont = this.until.imgTagAddStyle(this.info.cont)
                console.log("资讯项去")
               console.log( this.info)
            },
            rightClick(){
              //点击右侧分享按钮
              console.log("右侧分享按钮。。。")

                this.showBottom=true

            },

            //跳转详情页面
            toDetail(item){
                this.until.href("./infoDetail.html?id="+item.id)
            },



        }

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        .top{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            flex: 1;
            flex-direction:column;
            padding: 0 0.2rem;
            .top-1{
                width: 100%;
                background-size: 100% 100% !important;
            }
            .top-2{
                border-radius: 5px;
                background: white;
                padding: 0.3rem 0.2rem;
                .row{
                    margin-bottom: 0.2rem;
                }
                .info{
                    overflow-x: hidden;
                    max-width: 100%;
                    img { -ms-interpolation-mode: bicubic; }
                    img { width: auto; }
                }
            }

        }



	}




</style>
