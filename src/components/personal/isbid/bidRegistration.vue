<template>
<!-- 投标报名 -->
<div class="container">
	 <van-list  v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList" :immediate-check="immediate">
	<div class="bodyList" v-for="(item,index) in list" :key="index" @click="toDetail(item.bidId)">
		<div class="listContent">
			<div class="left">
				项目信息：
			</div>
			<div class="right">
				{{item.bidNm}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				项目编号：
			</div>
			<div class="right">
				{{item.bidCd}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				报名申请时间：
			</div>
			<div class="right">
				{{item.crtTm}}
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				报名状态：
			</div>
			<div class="right" v-if="item.audit==1" style="color: #FF9129;">
				待审核
			</div>
			<div class="right" v-if="item.audit==2" style="color:#FF2626 ;">
				通过
			</div>
			<div class="right" v-if="item.audit==3" style="color: #FF2626 ;">
				已驳回
			</div>
		</div>
		<div class="listContent">
			<div class="left">
				备注：
			</div>
			<div class="right">
				{{item.rmks}}
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
          }
        },
        methods:{
            getList() {
				let qry = this.query.new()
				this.query.toW(qry,'orgId',this.orgEnterId+'','EQ')
				this.query.toP(qry,this.pageNo,this.pageSize)
				this.api.getMyBidApplyList(this.query.toEncode(qry)).then(res => {
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
			this.orgEnterId=JSON.parse(this.until.loGet('currentRole')).id;
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