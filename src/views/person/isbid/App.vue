<template>
	<!--	我的船舶-->
	<div id="container">
		<pen-header title="投标管理"></pen-header>
		<!-- <div class="headcontent" v-if="tabId==2">
			项目结果公告将在5个工作日内发布，请及时关注“国家渔业装备科 技创新联盟信息网 / 新材料船舶综合服务平台”查看相关公告
		</div> -->
		<div class="body">
			<div class="list-place" >
				<div class="list-header">
					<ul>
						<li v-for="item in tab" @click="toChoose(item)"><span :class="{active:tabId==item.id}">{{item.nm}}</span></li>
					</ul>
				</div>
			</div>
			<div class="header-place"></div>
			<bidRegistration v-if="tabId==0"></bidRegistration>
			<allBids v-if="tabId==1"></allBids>
			<bidResults v-if="tabId==2"></bidResults>
		</div>
	</div>
</template>

<script>
	import penHeader from "../../../components/personal/penHeader";
	import bidRegistration from "../../../components/personal/isbid/bidRegistration";
	import allBids from "../../../components/personal/isbid/allBids";
	import bidResults from "../../../components/personal/isbid/bidResults";
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
				tabId: '-1',
				tab: [{
						id: 0,
						nm: '投标报名',
					},
					{
						id: 1,
						nm: '全部投标',
					},
					{
						id: 2,
						nm: '投标结果',
					}
				],
				userInfo: {}
			};
		},
		components: {
			penHeader,
			bidResults,
			bidRegistration,
			allBids
		},
		computed: {
			...mapState([
				'serverAddr'
			])
		},
		async created() {

		},
		async mounted() {
			this.userInfo = JSON.parse(this.until.loGet("userInfo"))
			this.toChoose(this.tab[0])
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
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
			}
		},

	};
</script>
<style lang="less" scoped>
	@import url("../../../assets/css/mobile.less");

	#container {
		.headcontent{
			box-sizing: border-box;
			font-size: 0.24rem;
			font-weight: 500;
			color: #E4393C;
			position: fixed;
			padding: 0.3rem 0.2rem 0 0.2rem;
		}
		.body {
			font-size: 0.29rem;
			background: @backgroundColor;
			padding: 0 0.2rem 0.2rem 0.2rem;
			.header-place {
				height: 1rem;
			}
			.list-place {
				position: fixed;
				top: 1rem;
				left: 0.2rem;
				right: 0.2rem;
				padding-top: 0.2rem;
				z-index: 9;
				background-color: @backgroundColor;
			}
			.active2{
				position: fixed;
				top: 2.3rem;
			}
			.list-header {
				background: white;
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				margin: 0 auto;
				ul {
					width: 100%;
					display: flex;
					height: 0.8rem;

					li {
						height: 100%;
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: center;

						span {
							color: #666666;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}

	.active {
		color: #343434 !important;
		border-bottom: 3px solid #2878BE;
	}
</style>
