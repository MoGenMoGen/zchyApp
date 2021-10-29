<template>
    <div class="app" >
        <van-nav-bar fixed :title="title" :border="false" fixed class="fixTop" style="background-color: #2778BE;">
            <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
        </van-nav-bar>
        <div class="main">
            <div class="whiteBox navBox">
                <vue-qr :text="url" :size="150" :margin="8" ></vue-qr>
                <div class="top">
                    <span>我的推荐码</span>
                </div>
            </div>
            <div class="bottom">
                <span style="font-size: 0.2rem;">{{info.inviCd}}</span><p @click="copyUrl(info.inviCd)"><img src="../../../assets/img/home/形状2.png"/>点击复制</p>
            </div>
            <p class="foot" @click="copyUrl(url)">
                <img src="../../../assets/img/home/形状1.png"/>
                复制推荐链接分享
            </p>
        </div>
    </div>

</template>

<script>
    import  { Toast } from 'vant';
    import VueQr from "vue-qr"
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                list:[],
                title:'我要推荐',
                url:'',			//推荐二维码
                info:{},

            };
        },
        components:{
            VueQr
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        watch:{

        },
        created(){
            if(!this.until.loGet('token')){
                this.$dialog.confirm({
                    title: '提示',
                    message: '您未登录，立即登录?',
                })
                    .then(() => {
                        window.location.href = './home/login.html'
                    })
                    .catch(() => {

                    });
                return
            }

        },
        mounted() {
            this.getInfo()


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
        			window.location.href = window.location.origin+this.serverAddr+'/personal/myRecommend'
        		}
        	},
            //获取数据
            async getInfo(){
                this.info = await this.api.personInfo()
                this.url = this.$store.state.hostUrl+'/mob/views/home/index.html?inviCd='+this.info.inviCd
                console.log('个人信息')
                console.log(this.info)
            },
            back(){
                window.history.go(-1);
            },
            toPage(url){
                window.location.href=url
            },
            //复制推荐码
            copyUrl(url){
                var oInput = document.createElement('input');     //创建一个隐藏input
                console.log(oInput);
                oInput.value = url;    //赋值
                console.log(oInput.value);
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.$toast.success('复制成功');
            },
        },

    };
</script>
<style lang="less">
    .fixTop{
        background: none;
        .van-nav-bar__title{
            font-size: 0.36rem;
            color: #ffffff;
        }
				.van-nav-bar__left{
					font-size: 0.34rem;
				}
        .van-nav-bar__right{
            font-size: 0.28rem;
            color: #ffffff;
        }
    }
</style>
<style lang="less" scoped>

    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
        background-color: #F1F3F2;
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
            padding: 0 0.2rem;
            margin-top: 1.2rem;
            .whiteBox{
                /*margin-bottom: 0.2rem;*/
                border-radius: 0.1rem 0.1rem 0 0;
                background-color: #ffffff;
            }
            .navBox{
                display: flex;
                flex-wrap: wrap;
                padding: 0.3rem 2.2rem;
                border-bottom: 0.01rem solid rgba(0,0,0,0.1);
                .top{
                    font-size: 0.24rem;
                    color: #343434;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }
            }
            .bottom{
                height: 1.02rem;
                display: flex;
                align-items: center;
                margin-bottom: 0.9rem;
                background-color: #FFFFFF;
                justify-content: center;
                border-radius:0 0 0.1rem 0.1rem;
                >p{
                    display: flex;
                    align-items: center;
                    font-size: 0.24rem;
                    color: #343434;
                    >img{
                        width: 0.2rem;
                        height: 0.2rem;
                        margin-left: 0.82rem;
                        margin-right: 0.12rem;
                    }
                }
            }
            .foot{
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.76rem;
                height: 0.52rem;
                font-size: 0.2rem;
                background-color: #2878BE;
                border-radius: 0.255rem;
                color: #FFFFFF;
                >img{
                    width: 0.18rem;
                    height: 0.18rem;
                    margin-right: 0.13rem;
                }
            }
        }

    }

</style>
