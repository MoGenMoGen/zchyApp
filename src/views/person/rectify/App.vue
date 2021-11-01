<template>
<!--	资金管理-付款记录-->
    <div id="container">

        <pen-header title="整改单"></pen-header>
		
<!--        <search-view place-text="时间区间" v-model="searchText" class="searchView"></search-view>-->


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader3";
    import bButton from "../../../components/personal/bButton";
    import searchView from "../../../components/personal/searchView";
    import calRange from "../../../components/personal/calRange";
    import {Toast} from 'vant'
	import {mixins} from "../mixins/mixins"
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                icCopy:'https://sinovat.oss-cn-shanghai.aliyuncs.com/8cec5c49c3b7408ebe9e6982170568a5_复制.png',
                icEdit:'https://sinovat.oss-cn-shanghai.aliyuncs.com/eace5bb2cbe4431cace00567cc9d5efd_编辑.png',
                icLook:'https://sinovat.oss-cn-shanghai.aliyuncs.com/50925c891eaf463c864c744dae908bfb_查看.png',
            };
        },
        components:{
            penHeader,
            bButton,
            searchView,
            calRange
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        
        filters:{
            numFilter(value) {
                const realVal = parseFloat(value).toFixed(2);
                return realVal;
            },
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/record'
				}
			},
            toService(){
                this.api.getKefuPhone().then(list=>{
                    let phone=list[0].cont
                    window.console.log("客服电话："+phone);
                    this.$bridge.callHandler('h5_call',phone,res=>{
                        console.log("原生调用返回")
                        console.log(res)
                    })
                })


            },
            toPage(item){
                if(this.currentRole.identityCd=='identity20'){ //设计院-跳转选型报价页面
                    this.until.href('../shipDesign/seleDtl.html?id='+item.id+'&type=detail')
                }else {

                    this.until.href('./recordDtl.html?id='+item.id)
                }

            },
            //去复制
            toCopy(item){
                this.api.xuanxingCopy(item.id).then((res)=>{
                    Toast('复制成功')
                    setTimeout(()=>{
                        this.pageNo=1
                        this.list=[]
                        this.getList()
                    },1000)

                })
            },
            //去编辑
            toEdit(item){
                this.until.href('../shipDesign/seleQuo.html?id='+item.id+'&type=edit')
            },
            //去查看
            toLook(item){
                this.until.href('../shipDesign/seleDtl.html?id='+item.id+'&type=detail')
            },

		   async getList(){
				let qry = this.query.new()
               if(this.searchText){
                   this.query.toW(qry,"crtTm",this.searchText,'BT')
               }
				this.query.toP(qry,this.pageNo,this.pageSize)
               this.query.toO(qry,"crtTm","desc")
               let res=''

               console.log("我的身份是。。。")
               console.log(this.currentRole.identityCd)
               if(this.currentRole.identityCd=='identity20'){//设计院
                   res = await this.api.xuanxingList(this.query.toEncode(qry))
               }else {
                   res = await this.api.diyList(this.query.toEncode(qry))
                   res.data.list.forEach(item=>{

                       if(item.price){
                           item.price1 = item.price.split('-')[0]
                           item.price2 = item.price.split('-')[1]
                           if(item.price2){
                               item.price3= parseFloat(item.price1).toFixed(2)+"-"+ parseFloat(item.price2).toFixed(2)
                           }else{
                               item.price3= parseFloat(item.price1).toFixed(2)
                           }
                       }else {
                           item.price3=0
                       }


                   })
               }

               res.data.list.forEach(item=>{
                   item.crtTm = item.crtTm ? item.crtTm.split(' ')[0] : ''
               })
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total ? true : false;
               this.loading = false;
               this.pageNo++

			}

        },

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{
        .searchView{
            position: fixed;
            top:1rem;
            left: 0;
            right: 0;

        }
        .searchPlace{
            height: 1.3rem;
        }
        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0 0.2rem 0.2rem 0.2rem;

            .list-cont{


                .list-item{
                    border-radius: 5px;
                    position: relative;
                    width: 100%;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0;
                    background: white;
                    .row{
                        padding: 0.1rem 0.40rem;
                        color: #343434;
                        .btn-copy{
                            padding: 0.05rem 0.05rem;
                            border-radius: 5px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            font-size: 0.20rem;
                            border:1px solid rgba(39, 120, 190, 1);
                            color:rgba(39,120,190,1);
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                            &:active{
                                opacity: 0.5;
                            }
                        }
                        .btn-edit{
                            padding: 0.05rem 0.05rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 5px;
                            width: 100%;
                            font-size: 0.20rem;
                            border:1px solid #E3882E;
                            color:#E3882E;
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                            &:active{
                                opacity: 0.5;
                            }
                        }
                        .btn-look{
                            padding: 0.05rem 0.05rem;
                            border:1px solid #2B891E;
                            border-radius: 5px;
                            color:#2B891E;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            font-size: 0.20rem;
                            img{
                                width: 0.25rem;
                                margin-right: 0.1rem;
                            }
                            &:active{
                                opacity: 0.5;
                            }
                        }
                    }
                    .price{
                        color: #FF2525;
                        position: absolute;
                        right: 0.4rem;
                        top:50%;
                        transform: translateY(-50%);
                        width: 30%;
                    }
                    .arrow{

                        position: absolute;
                        right: 0.1rem;
                        top:50%;
                        transform: translateY(-50%);

                    }

                }
            }
        }





	}



</style>
