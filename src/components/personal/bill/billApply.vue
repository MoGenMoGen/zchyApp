<template>
<!-- 发票帮助中心 -->
    <div class="billApply">
		<div class="img-tips">
			<img :src="imgTip">
		</div>
        <van-list  v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList" :immediate-check="immediate">
			<div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
				<div class="list-item-top">
					<div><img src="../../../assets/img/trading/shopName.png"><span>店铺：{{item.shopNm}}</span></div>
					<span v-if="item.invoiceType==0" style="color: #E4393C;">未开票</span>
					<span v-if="item.invoiceType==1" style="color: #2778BE;">已开票</span>
				</div>
				<div class="list-shop-item" v-for="newItem in item.itms" :key="newItem.id">
					<img :src="newItem.goodsImgUrl">
					<div class="list-shop-info">
						<div>
							<span style="width: 75%;">{{newItem.goodsNm}}</span>
							<span>￥{{newItem.goodsPrice}}</span>
						</div>
						<div>
							<span style="width: 75%;">{{newItem.goodsSkuAttrNm}}</span>
							<span>x {{newItem.qty}}</span>
						</div>
					</div>
				</div>
				<div class="list-item-bottom">
					<div></div>
					<div>
						<span v-if="item.invoiceType!=0&&item.invoiceType!=1" @click="bidDetail(item.id)">发票详情</span>
						<span v-if="item.invoiceType!=3" class="apply-btn" @click="applyBid(item.id)">申请开票</span>
					</div>
				</div>
			</div>
		</van-list>
    </div>
</template>

<script>
    export default {
        name: "billApply",
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
			  imgTip: ''
          }
        },
        methods:{
            getList() {
				let qry = this.query.new()
				this.query.toO(qry,'crtTm','desc')
				this.query.toP(qry, this.pageNo, this.pageSize)
				this.api.myOrderP(this.query.toEncode(qry)).then(res => {
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
			bidDetail(id) {
				this.until.href("./myBillDetail.html?id="+id)
			},
			applyBid(id) {
				this.until.href("./myBillApply.html?id="+id)
			}
        },
		created() {
			this.api.getAdert('billAdApp').then(res => {
				this.imgTip = res[0].imgUrl
			})
			this.getList()
		}
    }
</script>

<style scoped lang="less">
	.billApply {
		width: 100%;
		.img-tips {
			width: 100%;
			padding: 0.2rem;
			box-sizing: border-box;
			background-color: #fff;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			img {
				width: 100%;
			}
		}
		.list-item {
			width: 100%;
			display: flex;
			flex-direction: column;
			background-color: #fff;
			margin-top: 0.1rem;
			border-radius: 5px;
			.list-item-top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0.3rem 0.4rem;
				box-sizing: border-box;
				font-size: 0.24rem;
				color: #666666;
				border-bottom: 1px solid rgba(0,0,0,0.1);
				div {
					display: flex;
					align-items: center;
					width: 85%;
					img {
						width: 0.25rem;
						height: 0.23rem;
						margin-right: 0.1rem;
					}
					span {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
			.list-shop-item {
				display: flex;
				align-items: center;
				padding: 0.3rem 0.3rem;
				box-sizing: border-box;
				font-size: 0.22rem;
				color: #303030;
				border-bottom: 1px solid rgba(0,0,0,0.1);
				img {
					width: 1.8rem;
					height: 1.8rem;
					border-radius: 10px;
					margin-right: 0.2rem;
				}
				.list-shop-info {
					display: flex;
					flex-direction: column;
					width: calc(~"100% - 2rem");
					div {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
					div:first-child {
						margin-bottom: 0.8rem;
					}
				}
			}
			.list-item-bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0.2rem 0.4rem;
				box-sizing: border-box;
				font-size: 0.24rem;
				color: #333333;
				div {
					span {
						width: 1.2rem;
						height: 0.45rem;
						line-height: 0.45rem;
						text-align: center;
						display: block;
					}
					.apply-btn {
						color: #2778BE;
						border: 1px solid #2778BE;
						box-sizing: border-box;
						margin-left: 0.1rem;
					}
				}
			}
		}
	}
</style>