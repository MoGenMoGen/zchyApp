<template>
	<div class="trading">

		<my-header title="支付"></my-header>
		<div class="main">
			<div class="orderInfo">
				<p><img :src="success"/>支付成功！</p>
				<div class="info">
					<p>商品名称：{{proNm}}</p>
					<p>订单金额：￥{{info.orderPrice}}</p>
					<p>支付时间：{{info.payTm}}</p>
				</div>
				<div class="btnList">
					<p @click="toPage('./index.html')">查看其他商品</p>
					<p @click="toPage('./orderDetail.html?id='+id)">查看订单详情</p>
				</div>
			</div>
			<div class="proListLike">
				<div class="title"><img :src="left"/>猜你喜欢<img :src="right"/></div>
				<list :list="list"></list>
			</div>
		</div>
	</div>
</template>

<script>
    import myHeader from '@/components/myHeader'
    import left from '@/assets/img/tradingL.png'
    import right from '@/assets/img/tradingR.png'
    import success from '@/assets/img/通过.png'
	import list from '@/components/trade/proList'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                id:'',
                info:{},
                proNm:'',
                success,
                left,
				right,
                list:[],
            };
        },
        components:{
            myHeader,
            list
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},


        async created(){

        },
        async mounted() {

            this.id = this.until.getQueryString('id');
            this.info = await this.api.orderDetail(this.id)
            let arr = []
            this.info.itms.forEach(item=>{
                arr.push(item.goodsNm)
            })
            this.proNm = arr.join(',')
            let qry = this.query.new()
			this.query.toW(qry,'ship',0,'EQ')
            this.list = await this.api.catRand(this.query.toEncode(qry),4)
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/'
				}
			},

            toPage(url){
            	console.log('id',this.id)
                location.replace(url)
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
		background-color: #F1F3F2;
		.foot{
			width: 100%;
			background: @themeColor;
			color: #FFFFFF;
			padding: 0 0.38rem;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
		}
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			height: 100%;
			background: #F1F3F2;
			.proListLike{
				.title{
					color: #303030;
					font-size: 0.3rem;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					justify-content: center;
					padding-top: 0.6rem;
					padding-bottom: 0.3rem;
					font-weight: bold;
					img{
						width: 1.6rem;
						margin: 0 0.3rem;
					}
				}
			}
			.orderInfo{
				width: 96%;
				margin: 0.2rem auto;
				background: #FFFFFF;
				border-radius: 0.12rem;
				padding: 0 0.3rem;
				box-sizing: border-box;
				>p{
					border-bottom: 1px solid rgba(0,0,0,0.1);
					font-size: 0.3rem;
					color: #343434;
					text-align: center;
					padding: 0.5rem 0;
					img{
						width: 0.55rem;
						display: block;
						margin: 0 auto 0.29rem;
					}
				}
				.info{
					line-height: 0.55rem;
					color: #666666;
					padding: 0.1rem 0;
				}
				.btnList{
					display: flex;
					display: -webkit-flex;
					justify-content: space-around;
					padding-bottom: 0.73rem;
					padding-top: 0.6rem;
					p{
						padding: 0 0.54rem;
						height: 0.59rem;
						line-height: 0.59rem;
						border-radius: 0.29rem;
						&:first-of-type{
							border: 1px solid #B3B3B3;
						}
						&:last-of-type{
							background: @themeColor;
							border: 1px solid @themeColor;
							color: #FFFFFF;
						}
					}
				}
			}

		}
	}

</style>
