<template>
  <!-- 合同列表组件 -->

  <div class="container">
	<div class="dealTotal">
		<p><span>总金额</span><span class="num">{{fmoney(totalPrice)}}<span style="font-size: 0.14rem;">元</span></span></p>
		<span class="lineC"></span>
		<p><span>未付总金额</span><span class="num">{{fmoney(paid)}}<span style="font-size: 0.14rem;">元</span></span></p>
		<span class="lineC"></span>
		<p><span>未付总金额</span><span class="num">{{fmoney(npaid)}}<span style="font-size: 0.14rem;">元</span></span></p>
	</div>
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getList"
    >
      <div
        class="item"
        v-for="(item, index) in ctList"
        @click="toDetail(item.id)"
        :key="index"
      >
        <img class="arrow" :src="arrow_right" />
        <div class="row">
          <div class="left">合同编号：</div>
          <div class="right">{{ item.contractNo }}</div>
        </div>
        <div class="row">
          <div class="left">合同名称：</div>
          <div class="right">{{ item.nm }}</div>
        </div>
        <div class="row">
          <div class="left">签约日期：</div>
          <div class="right">{{ item.signTm.substring(0,10) }}</div>
        </div>
        <div class="row">
          <div class="left">合同金额：</div>
          <div class="right">￥{{ fmoney(item.totalPrice) }}元</div>
        </div>
        <div class="row">
          <div class="left">已付金额：</div>
          <div class="right">￥{{ fmoney(item.paid) }}元</div>
        </div>
        <div class="row">
          <div class="left">未付金额：</div>
          <div class="right" style="color: #ff2626">￥{{ fmoney(item.nPaid) }}元</div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import arrow_right from "@/assets/img/person/arrow_right.png";

export default {
  name: "contract",
  props: {},
  data() {
    return {
      arrow_right,
      // 每页显示条数
      pageSize: 10,
      total: 0,
      // 当前页
      pageNo: 1,
      id: "",
      ctList: [],
      finished: false,
      loading: false,
      currentRole: "",
	  totalPrice: 0,
	  paid: 0,
	  npaid: 0
    };
  },
  computed: {},
  methods: {
	  fmoney(s, n) {
	      n = n > 0 && n <= 20 ? n : 2;
	      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	      var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
	      var t = "";
	      for (let i = 0; i < l.length; i++) {
	          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	      }
	      return t.split("").reverse().join("") + "." + r;
	  },
    toDetail(id) {
      this.until.href("./contractDetail.html?id=" + id);
    },
	getData() {
		let param={
		  docsId:this.id,
		  orgEnterId:this.currentRole.id
		}
		this.api.shipContractSum(param).then(res => {
		  console.log(res)
		  this.totalPrice = res.data.totalPrice.toFixed(2)
		  this.paid = res.data.paid.toFixed(2)
		  this.npaid = (res.data.totalPrice - res.data.paid).toFixed(2)
		})
	},
    async getList() {
      let qry = this.query.new();
      this.query.toP(qry, this.currentPage3, this.pageSize);
      this.query.toO(qry, "crtTm", "desc");
      let param = {
        docsId: this.id,
        orgEnterId: this.currentRole.id,
      };
      let data = await this.api.shipContractList(
        this.query.toEncode(qry),
        param
      );
      this.total = data.page.total;
      this.ctList = [...this.ctList, ...data.data.list];
      console.log(this.ctList);

      this.ctList.forEach((item, index) => {
        item.totalPrice = Number(item.totalPrice);
        item.paid = Number(item.paid);
        item.nPaid = Number(item.totalPrice - item.paid);

        item.totalPrice = item.totalPrice.toFixed(2);
        item.paid = item.paid.toFixed(2);
        item.nPaid = (item.totalPrice - item.paid).toFixed(2);
        this.$set(this.ctList, index, this.ctList[index]);
      });
      this.finished = this.ctList.length >= data.page.total;

      this.loading = false;
      this.pageNo++;
      //   console.log(this.ctList,this.finished);
    },
  },
  created() {
    this.currentRole = JSON.parse(this.until.loGet("currentRole"));
  },
  mounted() {
    this.id = this.until.getQueryString("id");
    this.ctList = [];
	this.getData()
  },

  watch: {},
};
</script>
<style lang="less" scoped>
.container {
  padding: 1rem 0.2rem;
  padding-top: 0;
  .dealTotal{
  	width: 100%;
  	box-sizing: border-box;
  	padding: 0.4rem 0;
  	display: flex;
  	justify-content: space-between;
  	align-items: center;
	border-bottom: 1px solid rgba(0,0,0,0.1);
  	>p{
  		display: flex;
  		flex-direction: column;
  		align-items: center;
  		.num{
  			font-size: 0.3rem;
  			color: #FF0000;
  			margin-bottom: 0;
  		}
  		>span{
  			margin-bottom: 0.1rem;
  			font-size: 0.24rem;
  			color: #606060;
  		}
  	}
  	.lineC{
  		display: block;
  		width: 0.01rem;
  		height: 0.48rem;
  		background-color: rgba(0,0,0,0.1);
  	}
  }
  .item {
    padding: 0.4rem 0.3rem;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    .arrow {
      width: 0.12rem;
      height: 0.22rem;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
    .row {
      display: flex;
      align-items: center;
      margin-bottom: 0.1rem;
      .left {
        font-size: 0.28rem;
        font-size: #333;
        font-weight: bold;
        margin-right: 0.1rem;
      }
      .right {
        font-size: 0.26rem;
        font-size: #333;
      }
      .rightImg {
        display: flex;
        flex-wrap: wrap;
        img {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.2rem;
          margin-bottom: 0.2rem;
        }
        video {
          width: 4rem;
          height: 2.5rem;
          margin-right: 0.2rem;
          margin-bottom: 0.2rem;
        }
      }
    }
    .item:last-child {
      border: none;
    }
  }
}
</style>

