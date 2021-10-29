<template>
    <div class="tab">
        <div :class="{active:item.page===page}" v-for="item in tabList" :key="item.page" @click="toPage(item.href)">
						<span class="numS" v-if="cartNum && cartNum>0 && item.page=='cart' && cartNum != 0">{{cartNum>99?'99+':cartNum}}</span>
            <img :src="item.page===page ? item.imgActive : item.img"/>
            <p>{{item.nm}}</p>
        </div>
    </div>
</template>

<script>
		import {mapState} from "vuex";
    import home from '@/assets/img/首页-未.png'
    import homeActive from '@/assets/img/首页-选中.png'
    import trading from '@/assets/img/在线交易-未.png'
    import tradingActive from '@/assets/img/在线交易-选中.png'
    import cart from '@/assets/img/购物车-未.png'
    import cartActive from '@/assets/img/购物车-选中.png'
    import person from '@/assets/img/个人中心-未.png'
    import personActive from '@/assets/img/个人中心-选中.png'
    export default {
        props:{
          page:{
              type:String,
              default:'home'
          },
            // qtCd:{
            //     type:String,
            //     default:''
            // },
        },
        data() {
            return {
                tabList:[{
                    nm:'首页',
                    img:home,
                    imgActive:homeActive,
                    page:'home',
                    href:'../home/index.html',
                },{
                    nm:'装备在线',
                    img:trading,
                    imgActive:tradingActive,
                    page:'trading',
                    href:'../trading/index.html'
                },{
                    nm:'购物车',
                    img:cart,
                    imgActive:cartActive,
                    page:'cart',
                    href:'../cart/index.html'
                },{
                    nm:'个人中心',
                    img:person,
                    imgActive:personActive,
                    page:'person',
                    href:'../person/index.html',
                }]
            };
        },
				computed: {
				    ...mapState([
				        'cartNum',
				    ])
				},
        components:{
        },
        created(){
					this.$store.commit('cartNum',this.until.seGet('cartNum'))
        },
        mounted() {
        },
        methods: {
            toPage(url) {
                // this.until.href(url)
                window.location.replace(url)
            },
            childAction(){
                // let qtType=sessionStorage.getItem("qtType");
                // console.log(qtType)
                console.log("子组件")


            },

        },

    };
</script>
<style lang="less" scoped>
    @import url("../assets/css/mobile.less");
    .tab{
        width: 100%;
        height: 1rem;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        background: #ffffff;
        border-top: 1px solid #D5D5D5;
				padding-top: 0.05rem;
				box-sizing: border-box;
        >div{
            flex: 1;
            text-align: center;
            color: #999999;
            font-size: 0.26rem;
						position: relative;
						.numS{
							position: absolute;
							background-color: #FF332E;
							color: #ffffff;
                            width: fit-content;//新增的样式
                            min-width: 0.3rem;
                            height: 0.35rem;
							line-height: 0.35rem;
                            padding: 0 0.015rem;
                            border-radius: 0.5rem;
                            transform: translateX(50%);
							top: -0.15rem;
							right: 0.5rem;
						}
            img{
                width: 0.38rem;
            }
            p{
                line-height: 0.30rem;
			    font-size: 0.2rem;
            }
        }
        .active{
            color: @themeColor;
        }
    }

</style>
