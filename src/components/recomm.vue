<template>
  <div id="recomm">
	<div class="classTitle">
		<img :src="tradingL">
		<p>推荐船型</p>
		<img :src="tradingR">
	</div>
	<div class="unitTab">
		  <p v-for="(item,index) in shipClass" :key="index" :class="{clickP : item.id==idNow}" @click="changeActive(item)">
			{{item.nm}}
		  </p>
		<p @click="toPage('./shipShow.html')" style="padding: 0.11rem 0;">更多 ></p>
	</div>
	<div class="unitBox">
		<img :src="imgUrlNow" @click="toShow()"/>
		<div>
			<div class="part" v-for="(item,index) in shipList" :key="index" @click="toList(item)">
			  <img :src="item.imgUrl"/>
			  <div class="ct">
			    <p>{{item.nm}}</p>
			    <p>{{item.rmks}}</p>
			  </div>
			</div>
		</div>
	</div>
  </div>
</template>
<script>
	import tradingL from '@/assets/img/tradingL.png'
	import tradingR from '@/assets/img/tradingR.png'
  import {mapState} from "vuex";
  export default {
    props:[],
    data(){
      return{
		tradingL,
		tradingR,
		shipClass:[],	//船型分类
		idNow:"",		//选中类型id
		imgUrlNow:"",	//选中类型大图
		shipList:[],	//选中类型船舶列表
      }
    },
    components: {
    },
    watch:{

    },
    computed: {
    },
    mounted(){
		this.getShipList()
    },
    methods:{
		async getShipList(){
		  let qry = this.query.new()
		  this.query.toW(qry,'pid',this.$store.state.shipId,'EQ')
		  this.query.toO(qry,'seq','asc')
		  let data=await this.api.getClassify(this.query.toEncode(qry))
		  this.shipClass=data.slice(0,3)
		  console.log('船舶类型')
		  console.log(this.shipClass)
		  this.idNow=this.shipClass[0].id
		  this.imgUrlNow=this.shipClass[0].icon1
		  this.changeActive(this.shipClass[0])
		},
		//点击船舶类型
		async changeActive(item){
		  console.log('id:'+item.id)
		  this.idNow=item.id
		  this.imgUrlNow=item.icon1
		  let qry = this.query.new()
		  this.query.toW(qry,'pid',item.id,'EQ')
		  this.query.toO(qry,'seq','asc')
		  this.shipList=await this.api.getClassify(this.query.toEncode(qry))
		  console.log('船舶列表')
		  this.shipList=this.shipList.slice(0,4)
		  console.log('this.shipList',this.shipList)
		},
		toList(item){
			console.log(item)
			// this.toPage('./shipShow.html')
			this.toPage("./shipList.html?cid3="+item.id+"&nm="+item.nm+"&img="+item.imgUrl)
		},
		toShow(item){
			// this.toPage("./shipList.html?cid2="+item.id+"&nm="+item.nm+"&img="+item.icon1)
			this.toPage('./shipShow.html')
			console.log(item)
		},
		toPage(url){
			this.until.href(url)
		}
    }
  }
</script>
<style lang="less">
  @import url("../assets/css/mobile.less");
  #recomm{
	margin-bottom: 0.2rem;
	border-radius: 0.1rem;
	background-color: #ffffff;
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
	 	font-size: 0.3rem;
	  	color: #303030;
	  	}
	}
	.unitTab{
		display: flex;
		padding: 0 0.3rem 0.12rem;
		>p{
			flex: 1;
			font-size: 0.24rem;
			color: #999999;
			padding: 0.11rem 0.31rem;
			text-align: center;
		}
		.clickP{
			background-color: @themeColor;
			border-radius: 0.3rem;
			color: #FFFFFF;
		}
	}
	.unitBox{
		padding: 0.2rem;
		>img{
			margin-bottom: 0.2rem;
		}
		>div{
			display: flex;
			flex-wrap: wrap;
			.part{
				width: 48.5%;
				height: 1.9rem;
				margin-right: 3%;
				margin-bottom: 3%;
				position: relative;
				>img{
					width: 100%;
					height: 100%;
				}
				.ct{
					position: absolute;
					bottom: 0;
					width: 100%;
					padding: 0.14rem 0;
					background-color: rgba(0,0,0,0.4);
					display: flex;
					justify-content: center;
					>p{
						color: #ffffff;
						font-size: 0.22rem;
					}
				}
			}

			.part:nth-child(2n){
				margin-right: 0;
			}
		}
	}
  }
</style>

