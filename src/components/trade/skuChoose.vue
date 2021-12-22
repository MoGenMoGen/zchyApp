<template>
  <div class="sku">
	  <van-sku
			  v-model="show"
			  :sku="sku"
			  :goods="goods"
			  :goods-id="goodsId"
			  :initial-sku="initialSku"
			  :hide-stock="sku.hide_stock"
			  @buy-clicked="onBuyClicked"
			  @sku-prop-selected="changeSelect"
			  @sku-selected="changeSkuSelect"
			  ref="getSku"
	  >
		  <!--自定义价格-->
		  <template #sku-header-price="props">
			  <div class="van-sku__goods-price"  v-show="props.price&&props.price!=price">
				  <span class="van-sku__price-symbol">￥</span>
				  <span class="van-sku__price-num">{{ fmoney(props.price) }}</span>
			  </div>
			  <div class="van-sku__goods-price"  v-show="!props.price||props.price==price">
				  价格面议
			  </div>
		  </template>
		  <!--自定义其他-->
		  <template #sku-header-extra="props" >
			  <div v-show="leadTime">
				  交货期：{{leadTime}}天
			  </div>
		  </template>
		  <!--自定义按键-->
		  <template #sku-actions="props">
			  <div class="van-sku-actions">
				  <button class="buy1" v-if="info && info.ship" @click="props.skuEventBus.$emit('sku:buy')">立即下单</button>
				  <button class="buy2" v-if="info && !info.ship" @click="toCart">加入购物车</button>
				  <button class="buy2" v-if="info && !info.ship" @click="props.skuEventBus.$emit('sku:buy','buy')">立即购买</button>
				  <!--<van-button square size="large" type="warning" @click="props.skuEventBus.$emit('sku:buy')">-->
					  <!--积分兑换-->
				  <!--</van-button>-->
				  <!--&lt;!&ndash; 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 &ndash;&gt;-->
				  <!--<van-button-->
						  <!--square-->
						  <!--size="large"-->
						  <!--type="danger"-->
						  <!--@click="props.skuEventBus.$emit('sku:buy')"-->
				  <!--&gt;-->
					  <!--买买买-->
				  <!--</van-button>-->
			  </div>
		  </template>
	  </van-sku>
	  <div class="btnList">
		  <p @click="toPage('storeHome.html?id='+info.shopId)">
			  <img :src="shopImg"/>
			  店铺
		  </p>
		  <p @click="openK">
			  <img :src="service"/>
			  客服
		  </p>
		  <p @click="toPage('../cart/index.html')">
			  <span v-if="cartNum && cartNum>0">{{cartNum>99?'99+':cartNum}}</span>
			  <img :src="cart"/>
			  购物车
		  </p>
		  <button class="buy1" v-if="info && info.ship" @click="show=true">立即下单</button>
		  <button class="buy2" v-if="info && !info.ship" @click="show=true">加入购物车</button>
		  <button class="buy2" v-if="info && !info.ship" @click="show=true">立即购买</button>
	  </div>

  </div>
</template>
<script>
  import {mapState} from "vuex";
  import shopImg from '@/assets/img/trading/店铺.png'
  import cart from '@/assets/img/trading/购物车.png'
  import service from '@/assets/img/trading/客服.png'
  export default {
      props:['info','currentSku'],
    data(){
      return{
          leadTime:0,
          goods:{},
          goodsId:'',
          show:false,
          shopImg,
          cart,
          service,
          skus:[],
          attr:[],
          initialSku:{
              s0:'5169764411085824',  //选中的属性id
              s1: '0',
              s2: '0',
              // 初始选中数量
              selectedNum: 1,
		  },
          currentSpec:[],
          sku: {
              // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
              // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
              tree: [
                  {
                      k: '颜色',
                      k_id: '1',
                      v: [
                          {
                              id: '30349',
                              name: '天蓝色',
                              imgUrl:
                                  'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg'
                          },
                          {
                              id: '1215',
                              name: '白色'
                          }
                      ],
                      k_s: 's0',
                      count: 2
                  },
              ],
			  // info:{},
              // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
              list: [
                  {
                      id: 2259, // skuId，下单时后端需要
                      price: 100, // 价格（单位分）
                      s0: '30349', // 规格类目 k_s 为 s1 的对应规格值 id，对应上面tree-v里的id
                      s1: '0',
                      s2: '0',
                      stock_num: 110 // 当前 sku 组合对应的库存
                  },
                  {
                      id: 22592, // skuId，下单时后端需要
                      price: 100, // 价格（单位分）
                      s0: '1215', // 规格类目 k_s 为 s1 的对应规格值 id，对应上面tree-v里的id
                      s1: '0',
                      s2: '0',
                      stock_num: 110 // 当前 sku 组合对应的库存
                  }
              ],
              // price: '1.00', // 默认价格（单位元）
              // stock_num: 227, // 商品总库存
              none_sku: false, // 是否无规格商品
              hide_stock: true // 是否隐藏剩余库存
          }
      }
    },
      computed: {
          ...mapState([
              'cartNum',
			  'price'
          ])
      },
    components: {
    },
    watch:{
        info:{
            handler:function(){
                // return
                if(!this.info){
                    return
				}
				this.skus = this.info.skus
                // this.info.attrs[0].vals = this.info.attrs[0].vals
                this.attr = this.info.attrs
                if(!this.attr){
                    console.log(this.attr)
                    return
                }
				let tree = []
				this.goodsId = this.info.id
				this.goods.picture = this.info.fmImgUrl

				this.attr.forEach((item,index)=>{
				    let list = []
					item.vals.forEach(val=>{
					    list.push({
                            name:val.nm,
							id:val.id.toString()
						})
					})
				    let info = {
				        k:item.nm,
                        k_s:'s'+index,
                        v:list
					}
					tree.push(info)
				})
				// console.log('tree')
				// console.log(tree)
				this.sku.tree = tree

				let lists = []
                this.skus.forEach(item=>{
                    let arr = item.skuAttr.split(',')
					console.log(arr)
					let info = {   //这里后端返回的sku列表里，规格id应该是这样的字符串(规格id:属性值id，规格id:属性值id)
                        id: item.skuId, // skuId
                        s0: arr.length>0?arr[0].split(':')[1]:'0', // 规格类目 k_s 为 s1 的对应规格值 id
                        s1: arr.length>1?arr[1].split(':')[1]:'0', // 规格类目 k_s 为 s2 的对应规格值 id
						 s2:arr.length>2?arr[2].split(':')[1]:'0',
                        price: item.origPrice*100, // 价格（单位分）
						leadTime:item.leadTime,
                        stock_num: item.stock // 当前 sku 组合对应的库存
					}

					lists.push(info)
				})
				console.log('list')
				// console.log(lists)
                this.sku.list = lists
				// console.log('此时info变化为：',this.info)
				console.log(this.sku)
 			 },
			immediate:true

		},
        currentSku:{
            handler:function () {
                // return
                if(!this.currentSku){
                    return
				}
				console.log(this.currentSku)
				console.log(this.info.skus)
				let data = this.info.skus.find(item=>item.skuId==this.currentSku)
				console.log(data)
				let list = {}
				let arr = data.skuAttr.split(',')
                arr.forEach(item=>{
				    let arr = []
					arr[0] = item.split(':')[1]
				    list[item.split(':')[0]] = arr
				})
				this.initialSku = {
				    s0:arr.length>0 ? arr[0].split(':')[1] : '0',
                    s1:arr.length>1 ? arr[1].split(':')[1] : '0',
                    s2:arr.length>2 ? arr[2].split(':')[1] : '0',
                    selectedNum:1,
					// selectedProp:{'5025317371597824':['5025317371778048']}
                    selectedProp:list
				}
				// console.log('选中的规格')
				// console.log(this.initialSku)
            },
			immediate:true
		}

    },
	  created(){
		  console.log(this.props.price,this.price)
        this.$store.commit('cartNum',this.until.seGet('cartNum'))
	  },
    mounted(){
      	// console.log('info123',this.info)
    },
    methods:{
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
        openK(){	//打开客服
            ysf('open');
        },
		toPage(url){
			this.until.href(url)

		},
          toShow(){
              this.show = true
		  },
		//切换规格类目
        changeSkuSelect(skuValue, selectedSku, selectedSkuComb){
            console.log('切换规格类目')
			// console.log(skuValue)
			// console.log(selectedSku)
			console.log(skuValue.selectedSkuComb)
			this.leadTime = skuValue.selectedSkuComb.leadTime
            this.$emit('changeCurerent',skuValue.selectedSkuComb.id)
		},
		//切换属性
        changeSelect(propValue, selectedProp, selectedSkuComb){
            console.log('切换属性')
			console.log(propValue)
			console.log(selectedProp)
			console.log(selectedSkuComb)
		},
          //立即购买
        onBuyClicked(data,type){
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
            console.log('buy')
			console.log(type)
            let proArr = []
			let currentInfo = {}
            currentInfo = this.skus.find(item=>item.skuId==data.selectedSkuComb.id)
            proArr[0] = {
                nm: this.info.shopNm,
                ship: this.info.ship,
                skuId: currentInfo.skuId,
                items: [{
                    img: this.info.fmImgUrl,
                    goodsNm: this.info.nm,
                    attrDesc: currentInfo.attrDesc,
                    origPrice: currentInfo.origPrice,
                    qty: data.selectedNum,
                    gift:this.info.gift,
                    giftItems:this.info.gifts,
					leadTime:currentInfo.leadTime
                }]
            }
            this.until.seSave('cartList', JSON.stringify(proArr))
            this.until.href('./orderSubmit.html?payType=1')
		},
		//加入购物车
        toCart(){
        	// console.log('123')
            let data = this.$refs.getSku.getSkuData()
            console.log(data)
			if(!data.selectedSkuComb){
        	    this.$toast('请先选择商品规格');

                return
			}
			// if(data.selectedSkuComb.price==this.price){
             //    this.$toast('当前规则无法加入购物车');
             //    return
			// }
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
            let param = {
                goodsId: data.goodsId,
                goodsSkuId: data.selectedSkuComb.id,
                qty: data.selectedNum
            }
            this.api.addCart(param).then(() => {
               this.$toast( '加入购物车成功！');
               this.show = false

            })
		}
    }
  }
</script>
<style lang="less">
	@import url("../../assets/css/mobile.less");
	.van-sku-row__image-item--active, .van-sku-row__item--active{
		background:@themeColor;
		color: #FFFFFF;
	}
</style>
<style lang="less">
  @import url("../../assets/css/mobile.less");
  .sku{
	  position: fixed;
	  z-index: 10;
	  width: 100%;
	  left: 0;
	  bottom: 0;
	  .btnList{
		  display: flex;
		  width: 100%;
		  height: 0.98rem;
		  align-items: center;
		  background: #FFFFFF;
		  border-top: 1px solid rgba(0,0,0,0.1);
		  p{
			  flex: 1;
			  font-size: 0.2rem;
			  color: #343434;
			  display: flex;
			  display: -webkit-flex;
			  align-items: center;
			  justify-content: center;
			  position: relative;
			  flex-direction: column;
              line-height: 0.3rem;
			  span{
				  position: absolute;
				  top:-10px;
				  left: 50%;
                  font-size: 0.18rem;
				  background: @redColor;
				  color: #FFFFFF;
				  border-radius: 0.5rem;
                  transform: translateX(50%);
				  width: fit-content;//新增的样式
				  min-width: 0.3rem;
				  height: 0.3rem;
				  padding: 0.03rem;
				  display: flex;
				  align-items: center;
				  justify-content: center;
			  }
			  img{
				  display: block;
				  width: 0.384rem;
			  }
		  }
		  button{
			  height: 0.76rem;
			  line-height: 0.76rem;
			  text-align: center;
			  border-radius: 0.38rem;
			  color: #FFFFFF;
		  }
		  .buy1{
			  width: 4.07rem;
			  background: linear-gradient(90deg, #DE3C22, #EB5A30);
			  margin-right: 0.43rem;
			  margin-left: 0.2rem;
			  font-size: 0.28rem;
		  }
		  .buy2{
			  flex: 2;
			  &:first-of-type{
				  background: linear-gradient(90deg, #DE3C22, #EB5A30);
				  margin-right: 0.12rem;
			  }
			  &:last-of-type{
				  background: linear-gradient(90deg, #F2AC3C, #F4BC40);
			  }
		  }
	  }
	  .van-sku-actions{
		  width: 100%;
		  box-sizing: border-box;
		  padding: 0.2rem 0.34rem;
		  display: flex;
		  display: -webkit-flex;
		  align-items: center;
		  justify-content: space-between;
		  border-top: 1px solid rgba(0,0,0,0.1);
		  button{
			  height: 0.76rem;
			  line-height: 0.76rem;
			  text-align: center;
			  border-radius: 0.38rem;
			  color: #FFFFFF;
		  }
		  .buy1{
			  flex: 1;
			  background: linear-gradient(90deg, #DE3C22, #EB5A30);
			  margin-right: 0.2rem;
			  margin-left: 0.2rem;
			  font-size: 0.28rem;
		  }
		  .buy2{
			  width: 3.07rem;
			  &:first-of-type{
				  background: linear-gradient(90deg, #DE3C22, #EB5A30);
				  margin-right: 0.12rem;
			  }
			  &:last-of-type{
				  background: linear-gradient(90deg, #F2AC3C, #F4BC40);
			  }
		  }
	  }
  }
</style>

