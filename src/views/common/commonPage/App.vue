<template>
<!--	规则详情-->
    <div id="container">

        <pen-header :title="info.nm"></pen-header>
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(item,index) in adertList" :key="index"><img :src="item"/></van-swipe-item>
        </van-swipe>
        <div class="body">
					<div class="classTitle">
						<img :src="left">
						<p>{{info.nm}}</p>
						<img :src="right">
					</div>
            <div class="list-cont">
                <div class="cont" v-html="info.cont2">
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
		import left from '@/assets/img/left.png'
		import right from '@/assets/img/right.png'
	import {mapState} from "vuex";

    export default {
        data() {
            return {
							left,
							right,
              adertList: [],
              info:{
                  nm:'',
              },
							id:""
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
					this.id = this.until.getQueryString('id')
           this.getData()
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
					window.location.href = window.location.origin+this.serverAddr+'/commonPage2?id='+this.id
				}
			},
            async getData(){
                
                let res = await this.api.ruleDetail(this.id)
                this.info=res.data
                this.info.cont2 = this.info.cont2.replace(/<img[^>]*>/gi, function (match, capture) {
                    // console.log('=======')
                    return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;width:auto;"') // 替换style
                })
                this.adertList = this.info.iconImg ? this.info.iconImg.split(',') : []
								
								// this.info.cont = this.info.cont.replace(/<img[^>]*>/gi, function (match, capture) {
								//     // console.log('=======')
								//     return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;width:auto;"') // 替换style
								// })
								// this.adertList = this.info.imgUrl ? this.info.imgUrl.split(',') : []
								
								
                // if(this.adertList.length>0){
                //     let myImg = new Image()
                //     myImg.src = this.adertList[0]
                //     myImg.onload = ()=>{
                //         this.bannerHeight = myImg.height
                //     }
                // }else {
                //     this.bannerHeight = 0
                // }
            },

        }

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{
		.my-swipe{
			.van-swipe-item{
					padding: 0.2rem;
					box-sizing: border-box;
			}
			img{
				border-radius: 0.1rem;
				display: block;
			}
		}
        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0 0.2rem 0.2rem;
						.classTitle{
						  	display: flex;
						  	align-items: center;
						  	justify-content: center;
						  	padding: 0.38rem 0 0.28rem;
						  	>img{
						  		width: 1.2rem;
						  	}
						  	>p{
						  	margin: 0 0.3rem;
								font-size: 0.36rem;
						  	color: #303030;
						  	}
						}
            .list-cont{
                border-radius: 5px;
                background: white;
                position: relative;
                padding: 0.2rem;
                .nm{
                    text-align: center;
                    font-size: 0.3rem;
                    color: #333333;
                    margin-bottom: 0.1rem;

                }
                .sendTm{
                    text-align: center;
                    font-size: 0.25rem;
                    color: #999999;
                    margin-bottom: 0.1rem;

                }
                .cont{
                    font-size: 0.26rem;
                }

            }
        }





	}



</style>
