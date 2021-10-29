<template>
    <div class="app" :style="{backgroundImage:'url('+bg+')'}">
			<van-nav-bar fixed :title="titleNm" :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			</van-nav-bar>
      <div class="main">
				<div>
					<p>{{infoDetail.nm}}</p>
					<div v-html="infoDetail.cont">
					</div>
				</div>
			</div>
    </div>
	
</template>

<script>
	import { Toast } from 'vant';
  import bg from '@/assets/img/bg.png'
  export default {
    data() {
      return {
        bg,
				lunBoList:[],
				titleNm:"建造规范详情",
				id:"",
				infoDetail:{},
      };
    },
    components:{
    }, 
		watch:{
		},
    created(){
    },
    mounted() {
			this.id=this.until.getQueryString('id')
			this.titleNm=this.until.getQueryString('titleNm')
			this.getAdert()
			this.getInfo()
    },
    methods: {
			async getInfo(){
			  this.infoDetail = await this.api.standardDetail(this.id)
				console.log(this.infoDetail)
			},
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
			},
			
			back(){
				window.history.go(-1);
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
			>div{
				background-color: #ffffff;
				border-radius: 0.1rem;
				padding: 0.37rem 0.3rem 0.25rem;
				>p{
					padding-bottom: 0.37rem;
					text-align: center;
					color: #303030;
					font-size: 0.28rem;
					font-weight: 600;
				}
			}
		}
   }

</style>