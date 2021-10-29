<template>
    <div class="trading" >
        <!--筛选弹出层-->
        <van-popup v-model="showPopup" position="right" style="width:80%; height: 100% ">
			<choose-classify type="ship" ref="choose" :checkList="checkList" @confirm="chooseConfirm"></choose-classify>
		</van-popup>
		<my-header title="船舶交易">
			<slot>
                <div class="headerRight">
                    <img :src="choose" @click="toChoose"/>
                 </div>
            </slot>
		</my-header>
		<!-- 搜索的下拉选择 -->
		<div class="homeTop">
			<div>
				<p class="searchTop">
					<img :src="search" style="width:0.23rem; height:0.23rem;margin-right: 0.1rem;">
					<input type="text" placeholder="请输入关键词查询船舶" v-model="searchNm" @keyup.enter="toSearch">
				</p>
			</div>
		</div>
		<div class="tab">
			<p v-for="(item,index) in tabList" :key="index" :class="{active:checkList[0] && item.id==checkList[0]}" @click="toChangeClassify(item)">{{item.nm}}</p>
		</div>
        <div class="main">
			<!--排序方式-->
			<div class="sort">
				<p @click="toGetList(1)" :class="{acitve:currentType==1}"><span>综合</span></p>
				<p @click="toGetList(2)" :class="{acitve:currentType.charAt(0)==2}"><span>销量</span>
					<span>
						<van-icon name="arrow-up" color="#2778BE" v-if="currentType==21"/>
						<van-icon name="arrow-up"  v-else/>
						<van-icon name="arrow-down" color="#2778BE" v-if="currentType==22"/>
						<van-icon name="arrow-down" v-else/>
					</span>
				</p>
				<p @click="toGetList(3)" :class="{acitve:currentType.indexOf('3')>-1}">
					<span>价格</span>

					<span>
						<van-icon name="arrow-up" color="#2778BE" v-if="currentType==31"/>
						<van-icon name="arrow-up"  v-else/>
						<van-icon name="arrow-down" color="#2778BE" v-if="currentType==32"/>
						<van-icon name="arrow-down" v-else/>
					</span>
				</p>
			</div>
			<!--列表数据-->
			<van-list
					v-model="loading"
					:finished="finished"
					:immediate-check="immediate"
					finished-text="没有更多了"
					@load="onLoad"
			>
				<div class="list" v-for="item in list" :key="item.goodsId" @click="toDetail(item)">
					<van-image  height="4rem" width="100%" :src="item.img" fit="cover"  v-lazy="item.img"/>
					<div class="content">
						<p class="nm"><b>{{item.nm}}</b><img :src="item.used==1?newShip:old"/></p>
						<p class="param">
							<span>船舶总长：{{item.totalLen}}</span>
							<span>公约船长：{{item.pactLen}}</span>
							<span>船舶型宽：{{item.width}}</span>
							<span>船舶型深：{{item.deep}}</span>
						</p>
						<!--<p class="price">￥{{item.origPrice}}</p>-->
						<p class="price" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice !=price">￥{{item.goodsMinPrice}}</p>
						<p class="price" v-if="item.goodsMinPrice!==item.goodsMaxPrice">￥{{item.goodsMinPrice}}-{{item.goodsMaxPrice}}</p>
						<p class="price" v-if="item.goodsMinPrice===item.goodsMaxPrice && item.goodsMinPrice ==price">价格面议</p>
					</div>
				</div>
			</van-list>
        </div>
    </div>
</template>

<script>
    import myHeader from '@/components/myHeader'
    import tab from '@/components/tab'
    import chooseClassify from '@/components/trade/choose'
	import search from '@/assets/img/search.png'
    import choose from '@/assets/img/trading/筛选.png'
    import old from '@/assets/img/trading/二手船.png'
    import newShip from '@/assets/img/trading/新造船.png'
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                showPopup:false,
                loading:false,
                finished:false,
                immediate:false,
                choose,
				search,
                old,
				newShip,
                checkList:[],
                searchNm:'',
                currentType:'1',
				tabList:[],
				list:[],
				pageNo:1,
				total:0,
            };
        },
        computed:{
            ...mapState([
                'price',
				'serverAddr'
            ])
        },
        components:{
            tab,myHeader,chooseClassify
        },
        async created(){

        },
        async mounted() {
			this.getData()
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
					let ids = this.until.getQueryString('ids') ? JSON.parse(this.until.getQueryString('ids')) : []
					// if(ids.length==2){
					ids.splice(0,0,this.$store.state.shipId)
					
					window.location.href = window.location.origin+this.serverAddr+'/Trade/shipTrade?id='+JSON.stringify(ids)
				}
			},
            //筛选确认
            chooseConfirm(checkList){
				this.checkList = checkList
                this.finished = false
                this.pageNo = 1
                this.list = []
                this.showPopup=false
				this.getList()
			},
			//筛选弹窗
			toChoose(){
                this.showPopup=true
				this.$nextTick(()=>{
                    this.$refs.choose.getShip(this.checkList,this.$store.state.shipId)
                })
			},
            //切换分类
            toChangeClassify(item){
                this.finished = false
                this.pageNo = 1
                this.list = []
				this.checkList[0] = item.id
				this.checkList.splice(1)
                this.getList()
			},
            //去详情
            toDetail(item){
              this.until.href('shipDetail.html?id='+item.goodsId)
			},
            //排序方式更换
            toGetList(type){
				if(type==1){
				    // this.currentType = type
				    this.currentType = '1'
				}else if(type==2){
					if(this.currentType=='21'){
                        this.currentType = '22'
					}else {
					    this.currentType = '21'
					}
				}else {
                    if(this.currentType=='31'){
                        this.currentType = '32'
                    }else {
                        this.currentType = '31'
                    }
				}
                this.finished = false
				this.pageNo = 1
				this.list = []
				this.getList()
			},
			//搜索
			toSearch(){
                this.finished = false
                this.pageNo = 1
                this.list = []
                this.getList()
			},
			//获取产品列表
			async getList(){
                this.loading = true;
                let qry = this.query.new()
                if(this.currentType==1){
                    this.query.toO(qry,'seq','desc')
                }
                if(this.currentType==21){
                    this.query.toO(qry,'salesQty','desc')
                }
                if(this.currentType==22){
                    this.query.toO(qry,'salesQty','asc')
                }
                if(this.currentType==31){
                    this.query.toO(qry,'origPrice','desc')
                }
                if(this.currentType==32){
                    this.query.toO(qry,'origPrice','asc')
                }
                if(this.checkList.length==0){
                    this.query.toW(qry,'tid',this.$store.state.shipId,'EQ')
                }else if(this.checkList.length==1){
                    console.log(this.checkList)
                    this.query.toW(qry,'sid',this.checkList[0],'EQ')
				}else if(this.checkList.length==2){
                    this.query.toW(qry,'catId',this.checkList[1],'EQ')
                }
                this.query.toW(qry,'nm',this.searchNm,'LK')
				// this.query.toO(qry,'seq','desc')
				this.query.toP(qry,this.pageNo,4)
				let data = await this.api.shipTradeList(this.query.toEncode(qry))
                this.loading = false;
				if(this.list.length>=this.total){
				    this.finished = true
				}
				this.list.push(...data.data.list)
				this.total = data.page.total
			},
			async getData(){
                let qry = this.query.new()
                this.query.toW(qry,'pid',this.$store.state.shipId,'EQ')
                this.query.toO(qry,'seq','asc')
                this.tabList = await this.api.getClassify(this.query.toEncode(qry))
				if(this.until.getQueryString('ids')){
                    this.checkList= JSON.parse(this.until.getQueryString('ids'))
				}else {
                    this.checkList[0] = this.tabList[0].id

                }
				this.getList()
			},
            toPage(url){
                this.until.href(url)
            },
            onLoad(){
                this.pageNo++
				this.getList()
			}
        },

    };
</script>
<style lang="less">

</style>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
    .trading{
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
		.headerRight{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: flex-end;
			height: 100%;
			img{
				width: 0.45rem;
			}
		}
		.homeTop{
			display: flex;
			padding: 0.22rem 0 0.3rem;
			background: @themeColor;

			>div{
				width: 70%;
				margin: auto;
				display: flex;
				align-items: center;
				height: 0.6rem;
				border-radius: 0.3rem;
				padding: 0 0.26rem;
				background: #FFFFFF;
				.searchTop{
					font-size: 0.22rem;
					display: flex;
					align-items: center;
					flex: 1;
					input{
						flex: 1;
					}
				}
			}

		}
		.tab{
			width: 100%;
			background: @themeColor;
			color: #FFFFFF;
			white-space: nowrap;
			overflow-x: scroll;
			&::-webkit-scrollbar { height: 0 !important }
			-ms-overflow-style: none;
			overflow: -moz-scrollbars-none;
			padding-bottom: 0.2rem;
			box-sizing: border-box;
			padding-left: 0.35rem;
			p{
				margin-right: 0.35rem;
				display: inline-block;
				padding: 0.1rem 0;
				font-size: 0.3rem;
			}
			.active{
				font-weight: bold;
				background: url("../../../assets/img/trading/下划线.png") bottom center no-repeat;
				/*background-size: 50%;*/
			}
		}
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
		    padding: 0 0.2rem;
			.sort{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				align-items: center;
				padding: 0.3rem 0;
				p{
					flex: 1;
					display: flex;
					align-items: center;
					font-size: 0.3rem;
					justify-content: center;
					span:first-of-type{
						color: #343434;
					}
					span{
						display: flex;
						display: -webkit-flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-left: 0.1rem;
						i{
							font-size: 0.02rem;
						}
					}
				}
				.acitve{
					span:first-of-type{
						color: @themeColor;
					}
				}
			}

        }
    }
	.list{
		background: #FFFFFF;
		border-radius: 0.12rem;
		overflow: hidden;
		margin-bottom: 0.3rem;
		.content{
			padding: 0.3rem;
			.nm{
				display: flex;
				display: -webkit-flex;
				font-size: 0.28rem;
				align-items: center;
				b{
					color: #343434;
				}
				img{
					width: 1.7rem;
					margin-left: 0.3rem;
				}
			}
			.param{
				color: #9A9A9A;
				padding: 0.2rem 0;
				line-height: 0.6rem;
				span{
					width: 48%;
					display: inline-block;
				}
			}
			.price{
				color: @redColor;
			}
		}
	}
</style>
