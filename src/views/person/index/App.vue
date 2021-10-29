<template>
    <div class="person" :style="{backgroundImage:'url('+bg1+')'}">
        <div class="main">
			<div class="personTop">
				<p>
					<img :src="icSet" @click="until.href('../person/setting.html')">
				</p>

				<p>
					<img :src="signIn" style="width:0.2rem; height:0.2rem;">
					<span @click="until.href('../person/signIn.html')">签到</span>
				</p>
			</div>
			<div class="infoBox">
				<img :src="info.imgUrl" alt="">
				<div>
					<p>{{info.realNm}}<span>({{info.mob}})</span><!-- <img :src="qi" alt=""> --></p>
					<p>{{currentRole ? currentRole.company : info.company}}&nbsp;<span v-if="currentRole">[{{currentRole.identityNm}}]</span></p>
					<p @click="toPage('../person/persInfo.html')" class="updInfo">信息完善 ></p>
				</div>
			</div>
			<button class="changeIdent" @click="toPage('../home/changeUser.html')"> <i class="iconfont iconrefresh"></i>角色转换</button>
			<div class="whiteBox myCollBox">
				<p style="border-right: 0.01rem solid rgba(0,0,0,0.1);">
					<span class="num">{{collNum}}</span><span @click="until.href('../person/collect.html')">我的收藏</span></p>
				<p>
					<span class="num">{{subscribeTotal}}</span>
					<span @click="until.href('../person/subscribe.html')"  v-if="(!info.pid || permiList.findIndex(item=>item.nm==='我的预约'&&item.checked)>-1)">我的预约</span>
					<span @click="toPage('')" v-else>我的预约</span>
				</p>
				<!-- <img :src="url" alt=""> -->
				<vue-qr :text="url" :size="150" :margin="8" ref="qrcode"  @click.native="downloadImg" ></vue-qr>
				<div>
					<span>我的推荐码</span><span style="font-size: 0.2rem;">({{info.inviCd}})</span>
					<button @click="copyUrl(info.inviCd)">点击复制</button>
				</div>
			</div>
			<!--除设计院和船厂-->
			<div class="whiteBox " style="padding: 30px 0;"
                 v-if="
                 (!info.pid || permiList.findIndex(item=>item.nm==='船舶订单'&&item.checked)>-1)
                 && currentRole && currentRole.identityCd!=='identity20' && currentRole.identityCd!=='identity30'"
            >
				<p class="titleBorder">船舶订单</p>
				<div class="listBox">
					<p v-for="(item,index) in shipList" :key="index" @click="toOrder2(item)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
			<!--除设计院和船厂-->
			<div class="whiteBox" style="padding: 30px 0;"  v-if="
			(!info.pid || permiList.findIndex(item=>item.nm==='产品订单'&&item.checked)>-1) &&
			currentRole && currentRole.identityCd!=='identity20' && currentRole.identityCd!=='identity30'">
				<p class="titleBorder">产品订单</p>
				<div class="listBox">
					<p v-for="(item,index) in productList" :key="index" @click="toOrder1(item)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
			<!--仅船厂-->
			<div class="whiteBox " style="padding: 30px 0;" v-if="
			(!info.pid || permiList.findIndex(item=>item.nm==='建造订单'&&item.checked)>-1) &&
			currentRole && currentRole.identityCd=='identity30'">
				<p class="titleBorder">建造订单</p>
				<div class="listBox">
					<p v-for="(item,index) in buildList" :key="index" @click="toOrder3(item)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
			<!--仅设计院-->
			<div class="whiteBox " style="padding: 30px 0;" v-if="
			(!info.pid || permiList.findIndex(item=>item.nm==='设计销售订单'&&item.checked)>-1) &&
			currentRole && currentRole.identityCd=='identity20'">
				<p class="titleBorder">设计销售订单</p>
				<div class="listBox">
					<p v-for="(item,index) in designList" :key="index" @click="toOrder4(item)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>

			<!--仅设计院-->
			<div class="whiteBox " style="padding: 30px 0;" v-if="
			(!info.pid || permiList.findIndex(item=>item.nm==='设计采购订单'&&item.checked)>-1) &&
			currentRole && currentRole.identityCd=='identity20'">
				<p class="titleBorder">设计采购订单</p>
				<div class="listBox">
					<p v-for="(item,index) in designList" :key="index" @click="toOrder7(item)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
			<!--设计院 和 船厂-->
			<div class="whiteBox" style="padding: 30px 0;" v-if="
			(!info.pid || permiList.findIndex(item=>item.nm==='采购订单'&&item.checked)>-1) &&
			currentRole && (currentRole.identityCd=='identity20' || currentRole.identityCd=='identity30')">
				<p class="titleBorder">采购订单</p>
				<div class="listBox">
					<p v-for="(item,index) in productList" :key="index" @click="toOrder5(item)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
			<div class="whiteBox" style="padding-top: 0.4rem;">
				<div class="toolList">
					<p v-for="(item,index) in toolList1" :key="index" @click="toPage(item.url)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
			<div class="whiteBox" style="padding-top: 0.4rem;">
				<div class="toolList">
					<p v-for="(item,index) in toolList2" :key="index" @click="toPage(item.url)">
						<img :src="item.img" alt="">
						<span>{{item.nm}}</span>
					</p>
				</div>
			</div>
        </div>
        <tab page="person" ref="childrenTab"></tab>
    </div>
</template>

<script>
	import VueQr from "vue-qr"
    import tab from '@/components/tab'
	import bg1 from '@/assets/img/person/bg1.png'
	import signIn from '@/assets/img/person/signIn.png'
	import qi from '@/assets/img/person/qi.png'
	import order1 from '@/assets/img/person/待付款.png'
	import order2 from '@/assets/img/person/待发货.png'
	import order3 from '@/assets/img/person/待收货.png'
	import order4 from '@/assets/img/person/已完成.png'
	import order5 from '@/assets/img/person/全部订单.png'
    import order6 from '@/assets/img/person/设计中.png'
    import order7 from '@/assets/img/person/建造中.png'
	import person1 from '@/assets/img/person/person1.png'
	import person2 from '@/assets/img/person/person2.png'
	import person3 from '@/assets/img/person/person3.png'
	import person4 from '@/assets/img/person/person4.png'
	import person5 from '@/assets/img/person/person5.png'
	import person6 from '@/assets/img/person/person6.png'
	import person7 from '@/assets/img/person/person7.png'
	import person8 from '@/assets/img/person/person8.png'
	import person9 from '@/assets/img/person/person9.png'
	import person10 from '@/assets/img/person/person10.png'
	import person11 from '@/assets/img/person/person11.png'
	import person12 from '@/assets/img/person/person12.png'
	import icKs from '@/assets/img/person/快速下单.png'
    import person13 from '@/assets/img/person/p13.png'
    import person14 from '@/assets/img/person/p14.png'
    import person15 from '@/assets/img/person/p15.png'
    import person16 from '@/assets/img/person/p16.png'
    import person17 from '@/assets/img/person/p17.png'
    import person18 from '@/assets/img/person/p18.png'
    import person19 from '@/assets/img/person/p19.png'
    import person20 from '@/assets/img/person/p20.png'
    import person21 from '@/assets/img/person/p21.png'
	import person23 from './img/船舶展示.png'
	import person24 from './img/船舶档案.png'
	import person25 from '@/assets/img/person/person25.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
				icSet:'https://sinovat.oss-cn-shanghai.aliyuncs.com/0fd4f45c7b7848f8a3eea62b5d7186f9_设置.png',
                bg1,
				signIn,
				qi,
				subscribeTotal:0,//我的预约显示 的数量
				permiList:[],//权限列表

				info:{},
				currentRole:{},
				collNum:0,		//我的收藏数量
				url:'',			//推荐二维码
				shipList:[  //船舶订单
					{img:order1,
						nm:'待付款',
						url:'',
						statusCd:'10',
						id:1
					},{img:order2,
						nm:'待发货',
						url:'',
						statusCd:'20',
						id:2
					},{img:order3,
						nm:'待收货',
						statusCd:'30,40',//bt
						url:'',
						id:3
					},{img:order4,
						nm:'已完成',
						statusCd:'50,90',//bt
						url:'',
						id:4
					},{img:order5,
						nm:'全部',
						url:'',
						id:0,
						statusCd:'01'}
				],
				productList:[ //产品订单
					{img:order1,
						nm:'待付款',
						url:'',
						statusCd:'10',
						id:1
					},{img:order2,
						nm:'待发货',
						url:'',
						statusCd:'20',
						id:2
					},{img:order3,
						nm:'待收货',
						statusCd:'30,40',//bt
						url:'',
						id:3
					},{img:order4,
						nm:'已完成',
						statusCd:'50,90',//bt
						url:'',
						id:4
					},{img:order5,
						nm:'全部',
						url:'',
						id:0,
						statusCd:'01'}
				],
                buyList:[ //采购订单
                    {img:order1,
                        nm:'待付款',
                        url:'',
                        statusCd:'10',
                        id:1
                    },{img:order2,
                        nm:'待发货',
                        url:'',
                        statusCd:'20',
                        id:2
                    },{img:order3,
                        nm:'待收货',
                        statusCd:'30,40',//bt
                        url:'',
                        id:3
                    },{img:order4,
                        nm:'已完成',
                        statusCd:'50,90',//bt
                        url:'',
                        id:4
                    },{img:order5,
                        nm:'全部',
                        url:'',
                        id:0,
                        statusCd:'01'}
                ],
                designList:[ //设计订单
                    {img:order1,
                        nm:'待付款',
                        url:'',
                        statusCd:'10',
                        id:1
                    },{img:order6,
                        nm:'设计中',
                        url:'',
                        statusCd:'20',
                        id:2
                    },{img:order4,
                        nm:'已完成',
                        statusCd:'50,90',//bt
                        url:'',
                        id:4
                    },{img:order5,
                        nm:'全部',
                        url:'',
                        id:0,
                        statusCd:'01'}
                ],
                buildList:[ //建造订单
                    {img:order1,
                        nm:'待付款',
                        url:'',
                        statusCd:'10',
                        id:1
                    },{img:order7,
                        nm:'建造中',
                        url:'',
                        statusCd:'20',
                        id:2
                    },{img:order4,
                        nm:'已完成',
                        statusCd:'50,90',//bt
                        url:'',
                        id:4
                    },{img:order5,
                        nm:'全部',
                        url:'',
                        id:0,
                        statusCd:'01'}
                ],
				toolList1:[
					{img:person1,
						nm:'我的预约',
						url:'../person/subscribe.html',
					},{img:person2,
						nm:'全部船舶',
						url:'../person/shipList.html',
					},{img:person3,
						nm:'我的合同',
						url:'../person/myContract.html',
					},{img:person4,
						nm:'资金管理',
						url:'../person/payRecord2.html',
					},{img:person5,
						nm:'我的推荐',
						url:'../person/myRecommend.html',
					},{img:person6,
						nm:'选型记录',
						url:'../person/record.html',
					},{img:person7,
						nm:'维保服务',
						url:'../person/repair.html',
					},{img:person8,
						nm:'我的消息',
						url:'../person/message.html',
					},{img:person25,
						nm:'我的发票',
						url:'../person/myBill.html',
					}

				],
				toolList2:[
					{img:person9,
						nm:'我的地址',
						url:'../person/addrList.html',
					},{img:person10,
						nm:'联系我们',
						url:'../person/ruleDtl.html?id=5142826823865344&nm=联系我们',
					},{img:person11,
						nm:'在线留言',
						url:'../person/lineMsg.html',
					},{img:person12,
						nm:'客服电话',
						url:'../person/ruleDtl.html?id=4936226382894080&nm=客服热线',
					},
					{img:icKs,
						nm:'快速下单',
						url:'../person/quickOrder.html',
					}
				],
                toolList10:[ //船东
                    {img:person15,
                        nm:'子账户维护',
                        url:'../person/accountList.html',}
                ],
                toolList11:[ //设计院
                    {img:person13,
                        nm:'投标管理',
                        url:'../bid/bidList.html',
                    },{img:person14,
                        nm:'选型报价',
                        url:'../shipDesign/seleQuo.html?type=add',
                    },{img:person15,
                        nm:'子账户维护',
                        url:'../person/accountList.html',},
					{img:person24,
						nm:'船舶档案',
						url:'../shipDesign/shipFile.html',},
					{img:person23,
						nm:'船舶展示',
						url:'../shipDesign/shipShow.html',}
                ],
                toolList12:[ //船厂
                    {img:person13,
                        nm:'投标管理',
                        url:'../bid/bidList.html',
                    },{img:person14,
                        nm:'船舶建造',
                        url:'../person/shipBuild.html',
                    },
					{img:person24,
						nm:'船舶档案',
						url:'../shipDesign/shipFile.html',
					},
                ],
                toolList13:[ //监理监造机构
                    {img:person13,
                        nm:'投标管理',
                        url:'../bid/bidList.html',
                    },{img:person16,
                        nm:'管控船舶',
                        url:'../shipControl/controlList.html',
                    },{img:person15,
                        nm:'子账户维护',
                        url:'../person/accountList.html',}
                ],
                toolList14:[ //检验检测机构
                    {img:person13,
                        nm:'投标管理',
                        url:'../bid/bidList.html',
                    },{img:person16,
                        nm:'管控船舶',
                        url:'../shipControl/controlList.html',
                    },{img:person15,
                        nm:'子账户维护',
                        url:'../person/accountList.html',}
                ],
                toolList15:[ //供应商
                    {img:person13,
                        nm:'投标管理',
                        url:'../bid/bidList.html',
                    },{img:person17,
                        nm:'销售订单',
                        url:'../person/myOrder.html?orderType=6&item='+JSON.stringify({id:0, nm:'全部', statusCd:'01'}),
                    },{img:person18,
                        nm:'我的产品',
                        url:'../person/myProduct.html',
                    },{img:person15,
                        nm:'子账户维护',
                        url:'../person/accountList.html',}
                ],
                toolList16:[ //经销商
                    {img:person15,
                        nm:'子账户维护',
                        url:'../person/accountList.html',
					}
                ],
                toolList17:[ //代理商
                    {img:person19,
                        nm:'跟进记录',
                        url:'../follow/followList.html',
                    },{img:person20,
                        nm:'我的商机',
                        url:'../follow/opportunity.html',
                    },{img:person21,
                        nm:'客户档案',
                        url:'../follow/profileList.html',
                    }
                ],
            };
        },
        components:{
            tab,VueQr
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
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
			this.getInfo();


		},
        async mounted() {

			this.currentRole=JSON.parse(localStorage.getItem('currentRole'))
			window.console.log(this.currentRole)
			this.getSubscribeList()

			// this.getInfo()
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
					window.location.href = window.location.origin+this.serverAddr+'/sinovat/personal/'
				}
			},

			async	getSubscribeList(){
				let qry = this.query.new()
				this.query.toP(qry,1,5)
				this.query.toO(qry,"crtTm","desc")

				let res =await  this.api.subscribeList(this.query.toEncode(qry))
				this.subscribeTotal= res.page.total

			},

			downloadImg () {
				const iconUrl = this.$refs.qrcode.$el.src
				let file=this.until.base64toFile(iconUrl,'二维码.png')
				this.api.uploadImg2(file).then(res=>{
					console.log("下载二维码。。")
					console.log(res)
					this.$bridge.callHandler('h5_load',res,res2=>{

					})
				})
			},
			async getInfo(){
				this.info = await this.api.personInfo()
                this.url = this.$store.state.hostUrl+'/sinovat/?inviCd='+this.info.inviCd
				console.log("二维码下载url")
				console.log(this.url)
                this.collNum = await this.api.favoriteTotal()
				console.log('个人信息')
				console.log(this.info)

                if(this.currentRole.identityCd=='identity10'){ //船东
                    this.toolList1.push(...this.toolList10)
                }else if(this.currentRole.identityCd=='identity20'){ //设计院
				    this.toolList1.push(...this.toolList11)
				}else if(this.currentRole.identityCd=='identity30'){ //船厂
                    this.toolList1.push(...this.toolList12)
				}else if(this.currentRole.identityCd=='identity40'){ //监理监造机构
                    this.toolList1.push(...this.toolList13)
                }else if(this.currentRole.identityCd=='identity50'){ //检验检测机构
                    this.toolList1.push(...this.toolList14)
                }else if(this.currentRole.identityCd=='identity60'){ //供应商
                    this.toolList1.push(...this.toolList15)
                }else if(this.currentRole.identityCd=='identity70'){ //经销商
                    this.toolList1.push(...this.toolList16)
                }else if(this.currentRole.identityCd=='identity80'){ //代理商
                    this.toolList1.push(...this.toolList17)
                }
                if(this.info.pid){ //是子账户需要鉴定权限
                    this.getPermiList();
                }
			},
			//复制推荐码
			copyUrl(url){
                var oInput = document.createElement('input');     //创建一个隐藏input
                console.log(oInput);
                oInput.value = url;    //赋值
                console.log(oInput.value);
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.$toast.success('复制成功');
			},
            toPage(url){
			    if(url){
                    this.until.seRemove("order-tabId")
                    this.until.seRemove("order-statusCd")
                    this.until.href(url)
                }else {
                    this.$toast.fail('没有权限');
                }

            },
			//跳转船舶订单
			toOrder2(item){
				this.until.seRemove("order-tabId")
				this.until.seRemove("order-statusCd")
				this.until.href("./myOrder.html?orderType=2&item="+JSON.stringify(item))
			},
			//跳转产品订单
			toOrder1(item){
				this.until.seRemove("order-tabId")
				this.until.seRemove("order-statusCd")
				this.until.href("./myOrder.html?orderType=1&item="+JSON.stringify(item))
			},
            //跳转建造订单
            toOrder3(item){
				this.until.seRemove("order-tabId")
				this.until.seRemove("order-statusCd")
                this.until.href("./myOrder.html?orderType=3&item="+JSON.stringify(item))
            },
            //跳转设计销售订单
            toOrder4(item){
				this.until.seRemove("order-tabId")
				this.until.seRemove("order-statusCd")
                this.until.href("./myOrder.html?orderType=5&item="+JSON.stringify(item))
            },

			//跳转设计采购订单
			toOrder7(item){
				this.until.seRemove("order-tabId")
				this.until.seRemove("order-statusCd")
				this.until.href("./myOrder.html?orderType=7&item="+JSON.stringify(item))
			},


            //跳转采购订单
            toOrder5(item){
				this.until.seRemove("order-tabId")
				this.until.seRemove("order-statusCd")
                this.until.href("./myOrder.html?orderType=4&item="+JSON.stringify(item))
            },

			async getPermiList(){
				let userInfo=JSON.parse(this.until.loGet("userInfo"))
				let userId=userInfo.userId
				let p={userId:userId}

                this.permiList = await this.api.getRsco(p)
                this.toolList1.forEach((item,index)=>{
                    console.log(item)
                    let i = this.permiList.findIndex(v=> v.nm===item.nm && !v.checked) //名字一样并且未勾选的没有权限 名字一样说明有权限区分，没有勾选说明当前账号无权限
                    if(i>-1){
                        console.log(this.permiList[i])
                        item.url = ''
                        this.$set(this.toolList1,index,item)
                    }

                })
                this.toolList2.forEach((item,index)=>{
                    if(this.permiList.findIndex(v=>v=> v.nm===item.nm && !v.checked)>-1){
                        item.url = ''
                        this.$set(this.toolList2,index,item)
                    }

                })
				console.log(p)
				console.log("权限列表")

				console.log(this.toolList1)
			}

        },

    };
</script>
<style lang="less" scoped>
    @import url("../../../assets/css/mobile.less");
    .person{
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
        .main{
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            // display: flex;
            flex: 1;
            flex-direction:column;
		    padding: 0 0.2rem;
			.personTop{
				display: flex;
				padding: 0.27rem  0.13rem 0.23rem 0.13rem;
				justify-content: space-between;
				align-items: center;
				p:nth-of-type(1){
					img{
						width: 0.35rem;
						height: 0.35rem;
					}
				}
				p:nth-of-type(2){
					display: flex;
					border-radius: 0.3rem;
					background-color: #15568E;
					align-items: center;
					padding: 0.12rem 0.26rem 0.1rem 0.26rem;
					color: #ffffff;
					font-size: 0.24rem;
					>img{
						margin-right: 0.15rem;
					}
				}
			}
			.infoBox{
				display: flex;
				align-items: center;
				>img{
					width: 1.2rem;
					height: 1.2rem;
					border-radius: 50%;
					margin-left: 0.37rem;
					margin-right: 0.29rem;
				}
				>div{
					flex: 1;
					>p{
						font-size: 0.3rem;
						color: #FFFFFF;
						margin-bottom: 0.26rem;
					}
					.updInfo{
						font-size: 0.24rem;
						color: rgba(255,255,255,0.5);
					}
				}
			}
			.changeIdent{
			    margin: 0.04rem 0.8rem 0.45rem auto;
			    display: block;
				background-color: #ffffff;
				border-radius: 0.3rem;
				color: #1665AB;
				font-size: 0.24rem;
				padding: 0.11rem 0.27rem;
				>i{
					font-size: 0.3rem;
				    margin-right: 0.12rem;
				}
			}
			.whiteBox{
				margin-bottom: 0.3rem;
				border-radius: 0.1rem;
				background-color: #ffffff;
				.titleBorder{
					padding: 0 0 0.3rem 0.45rem;
					font-size: 0.26rem;
					color: #343434;
					border-bottom: 0.01rem solid #F1F1F1;
				}
				.listBox{
					padding-top: 0.41rem;
					display: flex;
					justify-content: space-around;
					>p{
						display: flex;
						flex-direction: column;
						align-items: center;
						>img{
							width: 0.45rem;
							height: 0.45rem;
							margin-bottom: 0.18rem;
						}
						>span{
							font-size: 0.22rem;

						}
					}
				}
				.toolList{
					display: flex;
					flex-wrap: wrap;
					>p{
						width: 25%;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 0.39rem;
						>img{
							width: 0.7rem;
							height: 0.7rem;
							margin-bottom: 0.14rem;
						}
						>span{
							font-size: 0.22rem;
							color: #666666;
						}
					}
				}
			}
			.myCollBox{
				padding: 0.44rem 0.5rem 0.44rem 0;
				display: flex;
				align-items: center;
				font-size: 0.24rem;
				>p{
					padding: 0 0.5rem;
					display: flex;
					flex-direction: column;
					align-items: center;
					.num{
						color: #E43A3C;
						font-size: 0.36rem;
						margin-bottom: 0.19rem;
						font-weight: 600;
					}
					>span{
						color: #666666;
						font-size: 0.24rem;
						white-space:nowrap;
					}
				}
				>img{
					width: 1.12rem;
					height: 1.12rem;
					border: 0.01rem solid #E3E3E3;
					margin-right: 0.22rem;
				}
				>div{
					display: flex;
					flex-direction: column;
					>button{
						font-size: 0.2rem;
						border-radius: 0.3rem;
						padding: 0.06rem 0.18rem;
						background-color: @themeColor;
						color: #ffffff;
					}
				}
			}
        }

    }

</style>
