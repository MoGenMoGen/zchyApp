<template>
	<!--	我的船舶-->
	<div id="container">
		<pen-header title="投标详情"></pen-header>
		<div class="body">
		<div class="topMenu">
			<div class="menuItem" v-for="(item,index) in info" :key="index" @click="changeMenu(index)">
				<img :src="item.selectImgUrl" v-if="selectIndex==index">
				<img :src="item.imgUrl" v-else>
				<div>
				  <span :style="{color:selectIndex==index?'#0064B2':''}">{{item.afficheTypeNm}}</span>
				  <span>{{item.releTm}}</span>
				</div>
				<img :src="jt1" v-if="selectIndex>=index&&info.length - 1>index">
				<img :src="jt2" v-if="selectIndex<index&&info.length - 1>index">
			</div>
		</div>
		<div class="contTitle" style="text-align: center; background-color: #ffffff; padding:0.1rem; font-size: 0.3rem;">
			{{title}}
		</div>
		<div class="contBody" v-html="cont">
		
		</div>
			
		</div>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import cg1 from '@/assets/img/person/采购公告2.png'
	import cg2 from '@/assets/img/person/采购公告.png'
	import gz1 from '@/assets/img/person/更正公告2.png'
	import gz2 from '@/assets/img/person/更正公告.png'
	import jg1 from '@/assets/img/person/结果公告2.png'
	import jg2 from '@/assets/img/person/结果公告.png'
	import jt1 from '@/assets/img/person/箭头.png'
	import jt2 from '@/assets/img/person/箭头-灰.png'
	import {
		mixins
	} from "../mixins/mixins"
	import {
		mapState
	} from "vuex";
	export default {
		mixins: [mixins],
		data() {
			return {
				cg1,
				gz1,
				gz2,
				jg1,
				jg2,
				jt1,
				jt2,
				cg2,
				cont:'',
				title:'',
				id:'',
				info:[],
				userInfo: {},
				selectIndex:0,
			};
		},
		components: {
			penHeader
		},
		computed: {
			...mapState([
				'serverAddr'
			])
		},
		
		async mounted() {
			this.id = this.until.getQueryString('id')
			console.log(this.id);
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
			this.getData()
			console.log(this.info);
		},
		methods: {
			//切换设备
			changeDevice() {
				console.log("=========== " + window.location.pathname + " ===========")
				let isPC = this.app.IsPC()
				if (isPC) {
					window.location.href = window.location.origin + this.serverAddr + '/personal/myContract'
				}
			},
			toChoose(item) {
				if (item.id != this.tabId) {
					this.tabId = item.id
				}
			},
		getData(){
		  let nowTm = this.until.formatTime(new Date())
		  let qry = this.query.new()
		  this.query.toW(qry,'bidId',this.id,'EQ')
		  this.query.toO(qry,'afficheTypeCd','esc')
		  this.query.toW(qry, 'releTm', nowTm, 'LT')
		  this.api.getBidAfficheList2(this.query.toEncode(qry)).then(res => {
		    res.data.list.forEach(item => {
		      item.releTm = item.releTm.substring(0,10)
		      if(item.afficheTypeCd=='5635882628584448'){
		        item.selectImgUrl = cg1
		        item.imgUrl = cg2
		      } else if(item.afficheTypeCd=='5635883070706688'){
		        item.selectImgUrl = gz1
		        item.imgUrl = gz2
		      } else if(item.afficheTypeCd=='5635883361522688'){
		        item.selectImgUrl = jg1
		        item.imgUrl = jg2
		      }
		      item.cont = this.until.imgStyle(item.cont)
		    })
		    this.info = res.data.list
		    this.cont = this.info[this.selectIndex].cont
			this.title=this.info[this.selectIndex].title
		  })
		},
			changeMenu(index){
				this.selectIndex=index
				this.cont=this.info[this.selectIndex].cont
				this.title=this.info[this.selectIndex].title
			}
		},

	};
</script>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");

	#container {
		.body {
			font-size: 0.29rem;
			background: @backgroundColor;
			padding: 0 0.2rem 0.2rem 0.2rem;
			.topMenu{
				width: 100%;
				margin: 0.4rem auto 0;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #ffffff;
				border-radius: 0.12rem;
				box-sizing: border-box;
				border-bottom:0.01rem solid rgba(0,0,0,0.1) ;
				.menuItem{
					display: flex;
					align-items: center;
					margin-right:0.2rem;
					cursor: pointer;
					img:first-child {
					  width: 0.5rem;
					  height: 0.5rem;
					  margin-right: 0.2rem;
					}
					div {
					  display: flex;
					  flex-direction: column;
					  font-size: 0.2rem;
					  color: #909090;
					  span:first-child {
					    font-size: 0.24rem;
					  }
					}
					img:last-child {
					  width: 0.07rem;
					  height: 0.13rem;
					  margin-left: 0.2rem;
					}
				}
			}
			.contBody{
				background-color: #ffffff;
				padding: 0.25rem 0.08rem;
				width: 100%;
				margin: 0 auto;
				line-height: 0.52rem;
				box-sizing: border-box;
				color: #303030;
				text-align: justify;
				/*text-align-last:justify;*/
				-moz-text-align-last: justify ;
				/*-webkit-text-align-last:justify;*/
				text-justify:inter-ideograph;/*ie中必须有这个*/
				/*text-align-last:justify;*/
				
				p{
				  text-indent: 18px;
				}
			}
		}
	}

	.active {
		color: #343434 !important;
		border-bottom: 3px solid #2878BE;
	}
</style>
