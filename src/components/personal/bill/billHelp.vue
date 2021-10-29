<template>
<!-- 发票帮助中心 -->
    <div class="billHelp">
        <van-list  v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList" :immediate-check="immediate">
			<div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">· {{item.title}}</div>
		</van-list>
    </div>
</template>

<script>
    export default {
        name: "billHelp",
        props:{
            
        },
        data(){
          return{
			  loading: false,
			  finished: false,
			  immediate: false,
              list:[],
			  pageNo: 1,
			  pageSize: 30
          }
        },
        methods:{
            getList() {
				let qry = this.query.new()
				this.query.toP(qry, this.pageNo, this.pageSize)
				this.api.getBillHelpList(this.query.toEncode(qry)).then(res => {
					this.list.push(...res.data.list)
					// 加载状态结束
					console.log("长度。。。。。。" + this.list.length)
					console.log("总数。。。。。。" + res.page.total)
					this.finished = this.list.length >= res.page.total
					this.loading = false;
					this.pageNo++
				})
			},
			toDetail(id) {
				this.until.href("./billHelpDetail.html?id="+id)
			}
        },
		created() {
			this.getList()
		}
    }
</script>

<style scoped lang="less">
	.billHelp {
		width: 100%;
		padding: 0.3rem 0.4rem;
		background-color: #fff;
		box-sizing: border-box;
		.list-item {
			font-size: 0.24rem;
			color: #303030;
			line-height: 0.52rem;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>