<template>
	<div class="trading">

		<my-header title="提交订单"></my-header>
		<div class="main">
			<div
					class="addr"
					v-if="addrList.length>0"
					@click="toPage('../person/addrList.html?modify='+ '1' + '&payType=' + type)"
			>
				<div class="name">
					<p>{{addr.receNm}}</p>
					<span>{{addr.receMob}}</span>
				</div>
				<div class="address">
					<van-icon name="location" />
					<p>{{addr.addrNm}} {{addr.addrDtl}}</p>
					<van-icon name="arrow" color="#CCCCCC" />
				</div>
				<img :src="addrBg" />
			</div>
			<div class="addrAdd" v-if="addrList.length==0">
				<p
						:style="{backgroundImage:'url(' + addBg + ')'}"
						@click="toPage('../person/addrList.html?modify='+ '1' + '&payType=' + type)"
				>
					<img :src="add" />新增收货地址
				</p>
				<!--        <img :src="addrBg" mode="widthFix" /> -->
			</div>
			<div class="list">
				<div v-for="(item,index) in orderList" :key="index" class="product">
					<p><img :src="shopImg"/>店铺：{{item.nm}} </p>
					<ul>
						<li v-for="(v,i) in item.items" :key="i">
							<van-image
									width="1.8rem"
									height="1.8rem"
									lazy-load
									:src="v.img"
									fit="cover"
									radius="10"
									v-if="v.img"
							/>
							<div v-else style="width: 1.8rem;height: 1.8rem;border-radius: 0.1rem;border: 1px solid #969799;"></div>
							<div class="content">
								<p class="nm">{{v.goodsNm}}</p>
								<p class="attr">{{v.attrDesc}}</p>
								<p class="attr" v-if="v.leadTime">交货期：{{v.leadTime}}天</p>
								<p class="price">
									<span v-if="v.origPrice!=price">￥{{fmoney(v.origPrice)}}</span>
									<span v-if="v.origPrice==price">价格面议</span>
									x {{v.qty}}</p>
							</div>
						</li>
					</ul>
				</div>

			</div>
			<div class="common">
				<div><p>订单总额</p>
					<span class="red" v-if="orderPrice!=price">￥{{fmoney(orderPrice)}}</span>
					<span class="red" v-else>价格面议</span>
				</div>
				<div><p>运费总额</p><span>￥{{fmoney(shipPrice)}}</span></div>
			</div>
			<!--<div class="reMark">-->
				<!--<p>备注</p><input v-model="reMark" placeholder="请输入备注"/>-->
			<!--</div>-->
		</div>
		<div class="foot">
			<p v-if="orderPrice!=price" >实际支付：￥{{fmoney(payPrice)}}</p>
			<p v-else>实际支付：价格面议</p>
			<button @click="toPay">去付款</button>
		</div>
	</div>
</template>

<script>
    import {mapState} from "vuex";
    import add from "@/assets/img/add.png";
    import addBg from "@/assets/img/addBg.png";
    import addrBg from "@/assets/img/addrBg.png";
	import myHeader from '@/components/myHeader'
    import shopImg from '@/assets/img/trading/shopName.png'
    export default {
        data() {
            return {
                add,
				addrBg,
                addBg,
                shopImg,
                classifyAll:[],
				 currentIndex:0,
                addrList: [],
                orderList: [],
				phone:'',
                addr: {
                },
                orderPrice:'0.00',
                shipPrice:'0.00',
                reMark:'',
				type:'',//‘’立即下单 cart购物车下单
            };
        },
        components:{
            myHeader,
        },
		computed:{
            payPrice(){
                return parseFloat(this.orderPrice)+parseFloat(this.shipPrice)
			},
            ...mapState([
                'price',
				'serverAddr'
            ])
		},
		watch:{
            'addr.id':function(){
                if(this.addr.id){
                    // return
                    this.fare()
                }
            }
		},
        async created(){

        },
        async mounted() {
            this.type = this.until.getQueryString('payType');
			this.getData()
			this.changeDevice()
			window.onresize = () => {
				this.changeDevice()
			}
		},
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
			//切换设备
			changeDevice(){
				console.log("=========== "+window.location.pathname+" ===========" )
				let isPC=this.app.IsPC()
				if(isPC){
					window.location.href = window.location.origin+this.serverAddr+'/order/payment?type='+this.type
				}
			},
            //查询运费
            fare(){

                this.list = JSON.parse(this.until.seGet('cartList'))
                if (this.until.getQueryString('payType') == 'cart') {  //购物车
                    let idArr = []
                    this.list.forEach(item => {
                        item.items.forEach(v => {
                            idArr.push(v.cartId)
                        })
                    })
                    let param = {
                        addrId: this.addr.id,
                        cartIds: idArr.join(','),
                    }
                    this.api.cartFare(param).then(res => {
                        this.shipPrice = 0;
                        if (res.code === 0){
                            for(let key in res.data){
                                for (let i = 0; i <this.list.length ; i++) {
                                    if (key == this.list[i].id){
                                        this.list[i].fare = res.data[key];
                                        this.shipPrice += Number(res.data[key]);
                                    }
                                }
                            }
                        }
                    })
                }else {
                    this.shipPrice = 0
					this.list.forEach(item=>{
                        let param = {
                            skuId: item.skuId,
                            qty: item.items[0].qty,
                            addrId: this.addr.id,
                            ship: item.ship,
                        }
                        this.api.byNewFare(param).then(res => {
                            console.log(res)
                            item.fare = res.data;
                            this.shipPrice += parseFloat(res.data);
                        })
					})




                }
            },
            async getData(){
                //地址
                let qry = this.query.new()
                if(this.until.getQueryString('addrId')){
					this.query.toW(qry,'id',this.until.getQueryString('addrId'),'EQ')
				}else {
                    this.query.toW(qry,'hasDef',1,'EQ')
				}
                let data = await this.api.addrList(this.query.toEncode(qry))
                this.addrList=data.data.list
				if(this.addrList.length>0){
                    this.addr = this.addrList[0]
					this.phone = this.addr.receMob.slice(0,4)+'****'+this.addr.receMob.slice(8)
                }

                //列表
				this.orderList = JSON.parse(this.until.seGet('cartList'))
				console.log(this.orderList)
				this.orderPrice = 0
				this.orderList.forEach(item=>{
				    let price = item.items.reduce((p,n)=>{
				       return p+parseFloat(n.origPrice)*parseInt(n.qty)
					},0)
					this.orderPrice+=price
				})
			},
            toPage(url){
				this.until.href(url)
			},
            toPay(){
                if (!this.addr.id) {
                    this.$toast.fail('请选择地址');
                    return
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                });
                if (this.until.getQueryString('payType') == 'cart') {  //购物车
                    let idArr = []
					let flag = 0
                    this.list.forEach(item => {
                        item.items.forEach(v => {
                            if(v.origPrice===this.price){
                                flag++
							}
                            idArr.push(v.cartId)
                        })
                    })
                    let param = {
                        addrId: this.addr.id,
                        cartIds: idArr.join(','),
                    }
                    this.api.orderCrearCart(param).then(res => {
                        this.api.cartList();

                        if(flag>0){ //有价格面议的商品
                            this.$toast.success('提交成功，等待卖家修改价格,可在个人中心产品订单查询')
                            setTimeout(() => {
                                location.replace('../person/index.html?id='+res.id)
                            })
						}else {
                            this.$toast.success('提交成功')
                            this.until.seSave('orderPayList', JSON.stringify(res))
                            setTimeout(() => {
                                location.replace('./toPay.html?id='+res[0].id)
                            }, 1500)
						}

                    })
                } else if(this.until.getQueryString('payType')=='quickly') { //快速下单
                    let param=[]
                    let flag = 0
                    this.list.forEach(item=>{
                        item.items.forEach(v => {
                            if(v.origPrice===this.price){
                                flag++
                            }
                        })
                        param.push({
                            skuId: item.skuId,
                            num: item.items[0].qty,
                            goodsId:item.goodsId,
                            addrId: this.addr.id,
                            ship: item.ship,
                            supplierId:item.supplier,
                            quickId:item.quickId
                        })
                    })
                    this.api.quickOrderCreat(param).then(res => {
                        if(flag>0){
                            this.$toast.success('提交成功，等待卖家修改价格,可在个人中心产品订单查询')
                            setTimeout(() => {
                                location.replace('../person/index.html')
                            })
                        }else {
                            this.$toast.success('提交成功')
							this.until.seSave('orderPayList', JSON.stringify(res))
                            setTimeout(() => {
                                location.replace('./toPay.html')
                            }, 1500)
                        }
                    })
                }else { //立即购买
                    let param = {
                        skuId: this.list[0].skuId,
                        qty: this.list[0].items[0].qty,
                        addrId: this.addr.id,
                        ship: this.list[0].ship,
                    }
                    this.api.orderCreat(param).then(res => {
                        if(this.orderPrice==this.price){
                            this.$toast.success('提交成功，等待卖家修改价格,可在个人中心产品订单查询')
                            location.replace('../person/index.html?id='+res.id)
                        }else {
                            this.$toast.success('提交成功')
                            setTimeout(() => {
								location.replace('./toPay.html?id='+res.id)
                            }, 1500)
                        }

                    })
                }
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
			background: #FFFFFF;
			height: 1rem;
			display: flex;
			display: -webkit-flex;
			align-items: center;
			p{
				flex: 1;
				padding-left: 0.3rem;
				color: #565656;
				font-size: 0.3rem;
				span{
					font-size: 0.375rem;
					color: @redColor;
				}
			}
			button{
				background: @themeColor;
				color: #FFFFFF;
				padding: 0 0.38rem;
				height: 1rem;
				line-height: 1rem;
			}
		}
		.main{
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			height: 100%;
			background: #F1F3F2;
			.addrAdd {
				background: #ffffff;
				padding: 0.2rem 0;
				margin-bottom: 0.3rem;
				p {
					background-size: 100% 100%;
					width: 96%;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					justify-content: center;
					height: 1.5rem;
					color: #999999;
					img {
						width: 0.2rem;
						margin-right: 0.1rem;
					}
				}
			}
			.addr {
				background: #ffffff;
				margin-bottom: 0.3rem;
				> img {
					width: 100%;
					margin-top: 0.2rem;
					display: block;
				}
				.name {
					display: flex;
					display: -webkit-flex;
					align-items: center;
					padding: 0.2rem 0.35rem;
					color: #343434;
					p {
						flex: 1;
						font-size: 0.3rem;
					}
					span {
						font-size: 28rpx;
						color: #333333;
					}
				}
				.address {
					padding: 0 0.35rem;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					span {
						color: #cccccc;
					}
					p {
						padding-left: 0.12rem;
						padding-right: 0.2rem;
						color: #787878;
						flex: 1;
											}

				}
			}
			.list {
				width: 96%;
				margin: 0 auto;
				>div{
					background: #FFFFFF;
					border-radius: 0.12rem;
					margin: 0.1rem auto; //添加边距
					padding: 0 0.3rem;
					>p{
						width: 100%;
						display: flex;
						display: -webkit-flex;
						align-items: center;
						border-bottom: 1px solid rgba(0,0,0,0.1);
						height: 0.83rem;
						img{
							width: 0.25rem;
							margin-right: 0.12rem;
						}
					}
					ul li{
						display: flex;
						display: -webkit-flex;
						padding: 0.3rem 0;
						border-bottom: 1px solid rgba(0,0,0,0.1);
						&:last-of-type{
							border-bottom: 0;
						}

						.content{
							margin-left: 0.2rem;
							display: flex;
							display: -webkit-flex;
							flex-direction: column;
							width: 4.6rem;
							.nm{
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
								max-height: 0.8rem;
								line-height: 0.4rem;
							}
							.attr{
								flex: 1;
							}
							.price{
								display: flex;
								display: -webkit-flex;
								span{
									flex: 1;
									color: @redColor;
								}
							}
						}
					}
				}
			}
			.common{
				width: 96%;
				margin: 0.2rem auto;
				background: #FFFFFF;
				border-radius: 0.12rem;
				padding: 0 0.3rem;
				box-sizing: border-box;
				>div{
					width: 100%;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					border-bottom: 1px solid rgba(0,0,0,0.1);
					font-size: 0.28rem;
					height: 0.86rem;
					color: #343434;
					&:last-of-type{
						border-bottom: 0;
					}
					p{
						flex: 1;
					}
					.red{
						color: @redColor;
					}
				}
			}
			.reMark{
				width: 96%;
				margin: 0.2rem auto;
				background: #FFFFFF;
				border-radius: 0.12rem;
				display: flex;
				display: -webkit-flex;
				font-size: 0.28rem;
				color: #343434;
				line-height: 0.86rem;
				padding: 0 0.3rem;
				box-sizing: border-box;
				p{
					margin-right: 0.1rem;
				}
			}
		}
	}

</style>
