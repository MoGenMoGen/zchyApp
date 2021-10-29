<template>
  <div class="app">
		<van-nav-bar fixed title="设计院所总览" :border="false" fixed class="fixTopAll">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
<!--				<van-icon name="search" slot="right" color="#ffffff" style="font-size: 0.45rem;" @click="search"/></van-icon>-->
		</van-nav-bar>
    <div class="main">
			<div class="designBox" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">
				<p class="imgP">
					<img :src="item.imgUrl">
				</p>
				<p class="infoP">
					<span class="titleS">{{item.company}}</span>
					<span class="busS">设计优势: {{item.business}}</span>
					<span v-html="item.intro" class="introS"></span>
				</p>
			</div>
		</div>
  </div>

</template>

<script>
	import { Toast } from 'vant';
	import {mapState} from "vuex";
  export default {
    data() {
      return {
        list:[]
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/ALLDesign'
				}
			},
			async getList(){
				let qry = this.query.new()
				this.query.toW(qry,'identityCd','identity20','EQ')
				this.list = await this.api.getRoleAll(this.query.toEncode(qry))
				this.list.forEach(item => {
					item.intro = item.intro.replace(/(&nbsp;)/g, "");
					item.intro = item.intro.replace(/<\/?[^>]*>/g, "").slice(0, 30) + '...';
				})
				console.log(this.list)
			},
			back(){
				window.history.go(-1);
			},
			search(){
				console.log('搜索')
			},
			toDetail(id){
				this.until.href("./design.html?id="+id)
			}
    },

  };
</script>
<style lang="less">
	.fixTopAll{
		background: @themeColor;
		.van-nav-bar__title{
			font-size: 0.36rem;
			color: #ffffff;
		}
		.van-nav-bar__left{
			font-size: 0.34rem;
		  color: #ffffff;
		}
		.van-nav-bar__right{
			font-size: 0.45rem;
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
			.designBox{
				background-color: #ffffff;
				padding: 0.3rem;
				border-radius: 0.1rem;
				margin-bottom: 0.1rem;
				height: 2.1rem;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				.imgP{
					width: 38.4%;
					height: 100%;
					margin-right: 3%;
					>img{
						width: 100%;
						height: 100%;
					}
				}
				.infoP{
					width: 58.4%;
					display: flex;
					height: 100%;
					flex-direction: column;
					justify-content: space-between;
					.titleS,.busS{
						white-space: nowrap;
						overflow: hidden;
						text-overflow:ellipsis;
					}
					.titleS{
						color: #343434;
						font-size: 0.24rem;
					}
					.busS{
						color: #666666;
						font-size: 0.22rem;
					}
					.introS{
						color: #9a9a9a;
						font-size: 0.2rem;
					}
				}
			}
		}
  }

</style>
