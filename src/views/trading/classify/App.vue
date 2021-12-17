<template>
	<div class="trading">

		<div class="header">
			<van-icon name="arrow-left"  size="25" color="#ffffff" @click="toBack"/>
			<search class="search"></search>
			<van-icon name="scan"  size="25" color="#ffffff"  @click="toMa"/>
		</div>
		<div class="main">
			<div class="left">
				<p v-for="(item,index) in classifyAll" :key="index" :class="{active:index==currentIndex}" @click="currentIndex=index">{{item.nm}}</p>
			</div>
			<div class="right" v-if="classifyAll[currentIndex]">
				<img :src="classifyAll[currentIndex].imgUrl3" />
				<div v-for="(item,index) in classifyAll[currentIndex].children" :key="index">
					<b>{{item.nm}}</b>
					<ul>
						<!-- v-show="v.imgUrl" -->
						<li v-for="(v,i) in item.children" :key="i" @click="toList(item,v)" >
							<van-image
									height="1rem"
									fit="cover"
									:src="v.imgUrl"
									v-lazy="v.imgUrl"
							/>
							<p>{{v.nm}}</p>
						</li>
					</ul>

				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import search from '@/components/search'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                classifyAll:[],
				 currentIndex:0,
            };
        },
        components:{
            search,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
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
					window.location.href = window.location.origin+this.serverAddr+'/Trade/onlinetrading'
				}
			},
            async getData(){
                this.classifyAll = await this.api.getAllClassify()
			},
            //扫码
            toMa(){
                this.$bridge.callHandler('h5_scanning',"666666",res=>{
                    window.console.log("安卓或者ios回传。。。")
                })
			},
			//去列表
            toList(pitem,item){
                let url = ''
                if(this.classifyAll[this.currentIndex].ship){ //船舶
                    let id = [pitem.id,item.id]
                    url = 'shipTrade.html?ids='+JSON.stringify(id)
				}else {//id当前分类id  pid顶级分类id  pid2二级分类id
                    let id = [this.classifyAll[this.currentIndex].id,pitem.id,item.id]
                    url = 'productTrade.html?ids='+JSON.stringify(id)
				}
                this.until.href(url)

            },
			//返回
            toBack(){
              this.until.back()
			},


        },

    };
</script>

<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");
	.trading{
		width: 100%;
		height: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center top;
		box-sizing: border-box;
		background-color: #F1F3F2;
		.header{
			display: flex;
			align-items: center;
			padding: 0.22rem 0.2rem;
			background: @themeColor;
			.search{
				flex: 1;
			}
			>i{
				margin-right: 0.26rem;
			}
		}
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			height: 100%;
			display: flex;
			display: -webkit-flex;
			background: #F1F3F2;
			.left{
				width: 30%;
				background: #FFFFFF;
				height: 100%;
				box-sizing: border-box;
				padding-top: 0.2rem;
				p{
					font-size: 0.26rem;
					color: #666666;
					text-align: center;
					margin: 0.4rem auto;
					width: 1.5rem;
					height: 0.5rem;
					line-height: 0.5rem;
				}
				p.active{
					background: @themeColor;
					color: #FFFFFF;
					border-radius: 0.24rem;
				}
			}
			.right{
				flex: 1;
				padding: 0.2rem;
				box-sizing: border-box;
				height: 100%;
				overflow-y: scroll;
				-webkit-overflow-scrolling: touch;
				>img{
					width: 100%;
					border-radius: 0.1rem;
					margin-bottom: 0.2rem;
				}
				>div{
					width: 100%;
					border-radius: 0.1rem;
					background: #FFFFFF;
					margin-bottom: 0.2rem;
					>b{
						display: block;
						/*width: 100%;*/
						border-bottom: 1px solid #F1F1F1;
						color: #343434;
						padding-left: 0.3rem;
						line-height: 0.8rem;
						margin-bottom: 0.2rem;
					}
					ul{
						display: flex;
						display: -webkit-flex;
						flex-wrap: wrap;
						li{
							display: inline-block;
							text-align: center;
							color: #666666;
							font-size: 0.22rem;
							width: 29%;
							margin: 0 2.1% 0.2rem ;
							&:nth-of-type(3n+3){
								margin-right: 0;
							}
						}
					}

				}
			}
		}
	}

</style>
