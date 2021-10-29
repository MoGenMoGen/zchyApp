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
	import {mapState} from "vuex";
  export default {
    data() {
      return {
        bg,
				lunBoList:[],
				titleNm:"设计规范详情",
				id:"",
				infoDetail:{},
      };
    },
    components:{
    },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/designDetail?id='+this.id
				}
			},
			async getInfo(){
			  this.infoDetail = await this.api.standardDetail(this.id)
				console.log(this.infoDetail)
				this.infoDetail.cont = this.imgTagAddStyle(this.infoDetail.cont)
				// this.infoDetail.cont = this.infoDetail.cont.replace(/<img[^>]*>/gi, function (match, capture) {
				// 	return match.replace(/(<img[^>]*)(\/?>)/gi, "$1 style='width:auto;max-width:100%;height:auto;' $2")
					// return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="width:auto;max-width:100%;height:auto;"') // 替换style

				// })
			},
				 imgTagAddStyle (htmlstr) {
				// 正则匹配所有img标签
				// var regex0 = new RegExp("(i?)(\<img)([^\>]+\>)","gmi");
				// 正则匹配不含style="" 或 style='' 的img标签
				// eslint-disable-next-line no-useless-escape
				var regex1 = new RegExp("(i?)(\<img)(?!(.*?style=['\"](.*)['\"])[^\>]+\>)", 'gmi')
				// 给不含style="" 或 style='' 的img标签加上style=""
				htmlstr = htmlstr.replace(regex1, '$2 style=""$3')
				console.log('增加style=""后的html字符串：' + htmlstr)
				// 正则匹配含有style的img标签
				// eslint-disable-next-line no-useless-escape
				var regex2 = new RegExp("(i?)(\<img.*?style=['\"])([^\>]+\>)", 'gmi')
				// 在img标签的style里面增加css样式(这里增加的样式：display:block;max-width:100%;height:auto;border:5px solid red;)
				htmlstr = htmlstr.replace(regex2, '$2width:auto;height:auto;$3')
				console.log('在img标签的style里面增加样式后的html字符串：' + htmlstr)
				return htmlstr
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
