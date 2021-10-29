<template>
    <div class="app">
			<van-nav-bar fixed title="设计规范" :border="false" class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
			</van-nav-bar>
      <div class="main">
				<div class="lunboBox" :style="{backgroundImage:'url('+bgS+')'}">
					<van-swipe class="homeLunBo" :autoplay="3000" indicator-color="white">
						<van-swipe-item v-for="(item,index) in lunBoList" :key="index"><img :src="item.imgUrl" alt=""></van-swipe-item>
					</van-swipe>
				</div>
				<div class="listBox">
					<div class="title">
						<p><span v-for="(item,index) in classList" :key="index" :class="{checkP:idNow==item.id}" @click="check(item)">{{item.nm}}</span></p>
					</div>
					<van-list
						v-model="loading"
						:finished="finished"
						:immediate-check="immediate"
						finished-text="没有更多了"
						@load="onLoad"
						class="contentBox"
					>
						<p v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">
							<span style="color: #343434;font-size: 0.28rem;"><b style="width: 0.14rem;">·</b>{{item.nm}}</span>
							<span class="contS">{{item.cont}}</span> 
						</p>
					</van-list>
				</div>
			</div>
    </div>
	
</template>

<script>
	import { Toast } from 'vant';
  import bgS from '@/assets/img/bgS.png'
	import {mapState} from "vuex";
  export default {
    data() {
      return {
        bgS,
				lunBoList:[],
				classList:[],//船舶分类列表
				finished:false,
				immediate:false,
				loading:false,
				pageNo: 1,
				pageSize: 10,
				total: 0,//分页总数
				list:[],
				titleNow:"",
				idNow:"",
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
			idNow(e){
				this.finished = false
				this.pageNo=1
				this.list=[]
				this.getList(e)
			}
		},
    created(){
    },
    mounted() {
			this.getAdert()
			this.getClass()
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
					window.location.href = window.location.origin+this.serverAddr+'/shipDisplay/designRule'
				}
			},
			check(item){
				this.idNow=item.id
				this.titleNow=item.nm
			},
			async getClass(){
				let qry = this.query.new()
				this.query.toW(qry,'pid',this.$store.state.shipId,'EQ')
				this.query.toO(qry,'seq','asc')
				this.classList = await this.api.getClassify(this.query.toEncode(qry))
				this.idNow=this.classList[0].id
				this.titleNow=this.classList[0].nm
			},
			async getList(id){
				this.loading = true;
				let qry = this.query.new()
				this.query.toW(qry,'cid',id,'EQ')
				this.query.toW(qry,'type',1,'EQ')
				this.query.toP(qry,this.pageNo,this.pageSize)
				let data = await this.api.standardList(this.query.toEncode(qry))
				this.loading = false;
				this.total = data.page.total
				if(this.list.length>=this.total){
				  this.finished = true
				}
				this.list.push(...data.data.list)
				this.list.forEach(item =>{
					item.cont = item.cont.replace(/(&nbsp;)/g, "");
				  item.cont = item.cont.replace(/<\/?[^>]*>/g, "")
				})
			},
			onLoad(){
			  this.pageNo++
				this.getList(this.idNow)
			},
			async getAdert(){
				this.lunBoList=await this.api.getAdert('appHome')
			},
			
			back(){
				window.history.go(-1);
			},
			toDetail(id){
				this.until.href("./desRuleDetail.html?id="+id+"&titleNm="+this.titleNow)
			}
    },
  };
</script>
<style lang="less">
	.fixTop{
		position: relative;
		background-color: @themeColor;
		.van-nav-bar__title{
			font-size: 0.36rem;
			color: #ffffff;
		}
		.van-nav-bar__left{
			font-size: 0.34rem;
		}
	}
	.homeLunBo  {
		border-radius: 0.15rem !important;
		margin-bottom: 0.2rem;
		.van-swipe-item{
			>img{
			border-radius: 0.15rem;
		    height: 100%;
		    min-height: 100%;
			}
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
			margin-top: -0.01rem;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			// display: flex;
			flex: 1;
			flex-direction:column;
			// padding: 0 0.2rem;
			// margin-top: 1.2rem;
			.lunboBox{
				background-size: 100%;
				background-repeat: no-repeat;
				background-position: center top;
				background-color: rgba(0,0,0,0);
				margin: 0 0 0.2rem;
				padding: 0 0.2rem;
				border-radius: 0;
			}
			.listBox{
				background-color: #ffffff;
				border-radius: 0.1rem;
				width: 100%;
				.title{
					overflow-x: auto;
					width: 100%;
					height: 1rem;
					>p{
						display: flex;
						border-bottom: 0.01rem solid rgba(0,0,0,0.1);
						>span{
							padding: 0.36rem 0 0.2rem;
							margin: 0 0.3rem ;
							white-space: nowrap;
							color: #666666;
							font-size: 0.28rem;
							box-sizing: border-box;
						}
						.checkP{
							color: #343434;
							border-bottom: 0.03rem solid @themeColor;
						}
					}
				}
				.contentBox{
					padding: 0.1rem 0.3rem 0;
					>p{
						padding: 0.29rem 0;
						display: flex;
						flex-direction: column;
						border-bottom: 0.01rem solid rgba(0,0,0,0.1);
						.contS{
							margin-top: 0.19rem;
							color: #9a9a9a;
							font-size: 0.24rem;
							padding-left: 0.14rem;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
					>p:last-child{
						border-bottom: none;
					}
				}
			}
		}
   }

</style>