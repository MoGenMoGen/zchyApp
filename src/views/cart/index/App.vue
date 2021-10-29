<template>
  <div class="cart">
		<div class="cartTop">
			<!-- <i class="iconfont iconzuojiantou" @click="toBack"></i> -->
			<p class="title">购物车</p>
			<p class="topEditor" @click="editorShow=!editorShow">{{editorShow?'完成':'编辑'}}</p>
		</div>
    <div class="main">
			<div class="goodsBox" :style="{backgroundImage:'url('+bgS+')'}">
				<div v-for="(item,index) in list" :key="index">
					<div class="title">
						<p>
							<i class="iconfont icondanxuankuang-copy" v-if="item.check" @click="checkGood(index,'',1)"></i>
							<i class="iconfont iconyuan" v-else @click="checkGood(index,'',1)"></i>
							<img :src="shopName">
							<span @click="toPage('../trading/storeHome.html?id='+item.id)">店铺:{{item.nm}}</span>
						</p>
					</div>
					<div class="content" v-for="(i,k) in item.items" :key="k">
						<i class="iconfont icondanxuankuang-copy" v-if="i.check" @click="checkGood(index,k,2)"></i>
						<i class="iconfont iconyuan" v-else @click="checkGood(index,k,2)"></i>
						<img :src="i.img" alt="" @click="toPage('../trading/shipDetail.html?id='+i.goodsId)">
						<div>
							<span @click="toPage('../trading/shipDetail.html?id='+i.goodsId)">{{i.goodsNm}}</span>
							<p>
								<span v-if="i.origPrice === price">价格面议</span>
								<span v-else> ￥ <b>{{i.origPrice}}</b></span>
								<van-stepper v-model="i.qty" min="1" class="stepGoods" integer @change="numChange(i)"/>
							</p>
						</div>
					</div>
				</div>
			</div>
        </div>
		<div class="checkBotton">
			<p class="checkBox" @click="checkAll">
				<i class="iconfont icondanxuankuang-copy" v-if="allShow"></i>
				<i class="iconfont iconyuan" v-else></i>全选
			</p>
			<p class="totalBox" v-show="!editorShow">合计 :<span>{{sumPirce}}</span></p>
			<p class="totalBox" v-show="editorShow"></p>
			<p class="btnBox" @click="submit">{{editorShow?'删除':'结算'}}</p>
		</div>
        <tab page="cart" ref="childrenTab"></tab>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import tab from '@/components/tab'
	import bgS from '@/assets/img/bgS.png'
	import shopName from '@/assets/img/trading/shopName.png'
  export default {
    data() {
      return {
        bgS,
				shopName,
				editorShow:false,
				allShow:false,
				list:[],
				sumPirce:0,
      };
    },
    components:{
      tab,
    },
      computed: {
          ...mapState([
              'price',
			  'serverAddr'
          ])
      },
		watch:{
			// list(){

			// }
		},
    async created(){
		if(!this.until.loGet('token')){
			this.$dialog.confirm({
				title: '提示',
				message: '您未登录，立即登录?',
			})
					.then(() => {
						window.location.href = '../home/login.html'
					})
					.catch(() => {

					});
			return
		}
    },
    async mounted() {
			this.getList()
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
					window.location.href = window.location.origin+this.serverAddr+'/order/cart'
				}
			},
        toBack(){
					console.log('返回了')
          this.until.back()
				},
			submit(){
				if(this.editorShow){
					  let idArr=[]
					  this.list.forEach(item=>{
					    item.items.forEach(v=>{
					       if(v.check){
					         idArr.push(v.cartId)
					       }
					    })
					  })
					  this.cartDelet(idArr.join(','))
				}else{
					let proArr=[]
					 this.list.forEach(item=>{
					   let proArr2 = JSON.parse(JSON.stringify(item))  //所有信息保存，除了商品信息
					   proArr2.items = []
					   item.items.forEach(v=>{
					     if(v.check){
					       proArr2.items.push(v)  //选中的商品信息保存
					     }
					   })
					   if(proArr2.items.length>0){ //如果有选中的商品信息，则这个店的信息保存
					     proArr.push(proArr2)
					   }
					 })
					 if(proArr.length==0){
						 this.$toast.fail('您未选择商品，请选择商品结算');
					 }else {
					  console.log(proArr)
					    this.until.seSave('cartList',JSON.stringify(proArr))
					    this.toPage('../trading/orderSubmit.html?payType=cart')
					 }
				}
			},
			cartDelet(id){
			  let param = {
			      ids:id
			  }
			  this.store.commit('changeLoading',true)
			  this.api.cartDelet(param).then(()=>{
					this.$toast.success("删除成功")
			    this.getList()
			  })
			},
			checkGood(index,k,num){
				let flag=0
				if(num==1){	//num为1点击了店铺
					this.list[index].check=!this.list[index].check
					this.list[index].items.forEach(i=>{	//判断该店铺的商品是否全部被选中
						if(!i.check){
							flag++
						}
					})
					if(flag>0){	//不是全部被选中，就全部选中
						this.list[index].items.forEach(i=>{
							if(!i.check){
								i.check=true
							}
						})
					}else{//已全选，则全部不选
						this.list[index].items.forEach(i=>{
							i.check=false
							this.allShow=false
						})
					}
				}else if(num==2){//num为2点击商品
					if(this.list[index].items[k].check){//如果是商品已被选择，则将店铺和全选的状态设为false
						this.list[index].items[k].check=false
						this.list[index].check=false
						this.allShow=false
					}else{//如上平未被选择，则将商品设为true
						this.list[index].items[k].check=true
						let flag=0
						this.list[index].items.forEach(i=>{	//判断商品设为true后是否全店铺都被选中
							if(i.check){
								flag++
							}
						})
						if(flag==this.list[index].items.length){
							this.list[index].check=true
						}
					}
				}
				this.sumPirce=0
				this.list.forEach(item=>{
					item.items.forEach(i=>{
						if(i.check){
							this.sumPirce+=i.qty*i.origPrice
						}
					})
				})
				this.$set(this.list,index,this.list[index])
				let checkIndex = this.list.findIndex(item=>!item.check)
				if(checkIndex>-1){
                    this.allShow=false
				}else {
                    this.allShow=true
				}
			},
			checkAll(){//全选
				if(this.allShow){
          this.allShow=false
          this.list.forEach((item,index)=>{
            item.check=false
            item.items.forEach(i=>{
              i.check=false
            })
						this.$set(this.list,index,this.list[index])
					})
          this.sumPirce=0
				}else {
          this.allShow=true
          this.list.forEach((item,index)=>{
						item.check=true
            item.items.forEach(i=>{
              i.check=true
            })
            this.$set(this.list,index,this.list[index])
          })
          this.sumPirce=0
					this.list.forEach(item=>{
            item.items.forEach(i=>{
              if(i.check){
                this.sumPirce+=i.qty*i.origPrice
              }
            })
					})
				}
			},
			numChange(item){//更改购物车数量
				console.log()
				if(item.qty>=1){
					this.sumPirce=0
					this.list.forEach(item=>{
						item.items.forEach(i=>{
							if(i.check){
								this.sumPirce+=i.qty*i.origPrice
							}
						})
					})
				  let param = {
				    cartId:item.cartId,
				    qty:item.qty
				  }
				  this.api.cartChangeNum(param)
				}
			},
			async getList(){
				// this.sumPirce=0
				this.list = await this.api.cartList()
				this.list.forEach((item,index)=>{
					item.check=false
					item.items.forEach(i=>{
						// this.sumPirce+=i.qty*i.origPrice
						i.check=false
					})
					this.$set(this.list,index,this.list[index])
				})
				console.log('购物车列表')
				console.log(this.list)
			},
      toPage(url){
        this.until.href(url)
      },
		},
	};
</script>
<style lang="less">
	.stepGoods{
		border-radius: 0.05rem;
		>button,>input{
			background-color: #FFFFFF;
			border: 0.01rem solid#C5C5C5;
		}
	}
</style>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
  .cart{
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center top;
    box-sizing: border-box;
		background-color: #F1F3F2;
		.cartTop{
			display: flex;
			align-items: center;
			padding:0.27rem 0.36rem;
			color: #ffffff;
			background-color: @themeColor;
			>i{
				font-size: 0.36rem;
				width: 0.8rem;
			}
			.title{
				font-size: 0.36rem;
				flex: 1;
				text-align: center;
				margin-left: 0.8rem;
			}
			.topEditor{
				font-size: 0.3rem;
				width: 0.8rem;
			}

		}
    .main{
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      // display: flex;
      flex: 1;
      flex-direction:column;
			margin-top: -0.01rem;
			.goodsBox{
				background-size: 100%;
				background-repeat: no-repeat;
				background-position: center top;
				margin-bottom:0.5rem;
				padding: 0 0.3rem;
				>div{
					// display: flex;

					background-color: #ffffff;
					border-radius: 0.12rem;
					margin-bottom: 0.2rem;
					padding: 0.05rem 0 0.1rem;
					i{
						color: #999999;
						font-size: 0.36rem;
						margin-right: 0.19rem;
					}
					.title{
						box-sizing: border-box;
						padding: 0 0.2rem;
						width: 100%;
						>p{
							display: flex;
							align-items: center;
							width: 100%;
							padding: 0.2rem 0.1rem;
							box-sizing: border-box;
							border-bottom: 0.01rem solid rgba(0,0,0,0.1);
							>img{
								width: 0.25rem;
								margin-right: 0.2rem;
							}
							>span{
								font-size: 0.24rem;
								color: #666666;
							}
						}
					}
					.content{
						display: flex;
						align-items: center;
						padding: 0.3rem;
						border-bottom: 0.01rem solid rgba(0,0,0,0.1);
						>img{
							width: 1.8rem;
							height: 1.8rem;
							margin-right: 0.21rem;
							border-radius: 0.1rem;
						}
						>div{
							flex: 1;
							height: 1.54rem;
							padding: 0.1rem 0 0.16rem;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							>p{
								display: flex;
								justify-content: space-between;
								>span{
									font-size: 0.24rem;
									color: #FF332E;
									>b{
										font-size: 0.36rem;
									}
								}
							}
						}
					}
					.content:last-child{
						border-bottom:none;
					}

				}
			}
        }
		.checkBotton{
			display: flex;
			align-items: center;
			height: 1rem;
			color: #565656;
			background-color: #ffffff;
			.checkBox{
				font-size: 0.27rem;
				>i{
					font-size: 0.34rem;
					margin-right: 0.16rem;
					margin-left: 0.6rem;
				}
			}
			.totalBox{
				flex: 1;
				font-size: 0.3rem;
				text-align: end;
				padding-right: 0.6rem;
				>span{
					margin-left: 0.1rem;
					color: #FF3430;
					font-size: 0.37rem;
				}
			}
			.btnBox{
				width: 1.6rem;
				height: 1rem;
				background-color: @themeColor;
				color: #ffffff;
				font-size: 0.3rem;
				line-height: 1rem;
				text-align: center;
			}

		}
    }

</style>
