<template>
<!-- 投标结果 -->
<div class="container">
	 <van-list  v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList" :immediate-check="immediate">
	<div class="bodyList" v-for="(item,index) in list" :key="index" @click="toDetail(item.bidId)">
		<div class="listContent">
			<div class="left">
				项目信息：
			</div>
			<div class="right">
				{{item.nm}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				项目编号：
			</div>
			<div class="right">
				{{item.cd}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				采购金额：
			</div>
			<div class="right">
				{{item.budget}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				开标时间：
			</div>
			<div class="right">
				{{item.bidOpenTm}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
			状态：
			</div>
			<div class="right" v-if="item.myOfferStatus==0" style="color: #F57313;">
				未中标
			</div>
			<div class="right" v-if="item.myOfferStatus==1" style="color: #2778BE;">
				已中标
			</div>
			<div class="right" v-if="item.myOfferStatus==2" style="color: #303030;">
				已驳回
			</div>
		</div>
	
	</div>
	</van-list>
</div>
</template>

<script>
    export default {
        name: "BidRegistration",
        props:{
            
        },
        data(){
          return{
			  loading: false,
			  finished: false,
			  immediate: false,
              list:[],
			  pageNo: 1,
			  pageSize: 5,
			  imgTip: '',
			  orgEnterId:'',
			  identityCd:'',
			  currentRoleId:'',
          }
        },
        methods:{
            getList() {
				let qry = this.query.new()
				this.query.toO(qry, 'publishTm', 'desc')
				this.query.toP(qry, this.pageNum, this.pageSize)
				this.query.toWNotNull(qry, 'bidDecideTm')
				this.query.toW(qry, 'viewRangeCd', this.identityCd+'', 'LK')
				this.api.getMyBidList(this.query.toEncode(qry),this.currentRoleId).then(res => {
					console.log(res)
					this.list.push(...res.data.list)
					// 加载状态结束
					console.log("长度。。。。。。" + this.list.length)
					console.log("总数。。。。。。" + res.page.total)
					this.finished = this.list.length >= res.page.total
					this.loading = false;
					this.pageNo++
				})
			},
			bidDetail(item) {
				this.until.href(`./myBillDetail.html?id=${item.id}&orderCd=${item.orderCd}`)
			},
			applyBid(item) {
				this.until.href(`./myBillApply.html?id=${item.id}&orderCd=${item.orderCd}`)
			},
			toDetail(id){
				this.until.href(`./isbidDetail.html?id=${id}`)
			}
        },
		created() {
			this.identityCd = JSON.parse(this.until.loGet('currentRole')).identityCd
			this.currentRoleId = JSON.parse(this.until.loGet('currentRole')).id
			console.log(this.orgEnterId);
			this.getList()
		}
    }
</script>

<style scoped lang="less">
	.container{
		.bodyList{
			width: 7.09rem;
			margin: 0 auto;
			background-color: #ffffff;
			padding: 0.4rem 0.3rem;
			box-sizing: border-box;
			border-radius: 0.12rem;
			margin-bottom: 0.2rem;
			.listContent{
				margin-top: 0.3rem;
				display: flex;
				.left{
					width: 1.8rem;
					font-size: 0.24rem;
					font-weight: 500;
				}
				.right{
					margin-left: 0.1rem;
					font-size: 0.24rem;
					font-weight: 500;
				}
			}
		}
		
	}
</style>