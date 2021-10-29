<template>
<!--	消息详情-->
    <div id="container">

        <pen-header title="高级设置"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-row class="row" justify="space-between"  align="center" type="flex" @click="toPage('../person/pswAlter.html')">
                    <van-col span="6"><p class="row-label">修改密码</p></van-col>
                    <van-col span="2" ><p class="arrow"><van-icon name="arrow" /></p></van-col>
                </van-row>
            </div>

            <div class="list-cont" style="margin-top: 0.2rem;">
                <van-row class="row" justify="space-between"  align="center" type="flex">
                    <van-col span="6" ><p class="row-label">版本号</p></van-col>
                    <van-col span="6" ><p style="text-align: right">{{version}}</p></van-col>
                </van-row>
                <van-row class="row" justify="space-between"  align="center" type="flex" @click="toUpdate">
                    <van-col span="6" ><p class="row-label">版本升级</p></van-col>
                    <van-col span="2" ><p class="arrow"><van-icon name="arrow" /></p></van-col>
                </van-row>
                <van-row class="row" justify="space-between"  align="center" type="flex" @click="toClear">
                    <van-col span="6" ><p class="row-label">清理缓存</p></van-col>
                    <van-col span="2" ><p class="arrow"><van-icon name="arrow" /></p></van-col>
                </van-row>
            </div>

            <div class="list-cont" style="margin-top: 0.2rem;" v-for="item in catList" :key="item.id">
                <van-row class="row"  v-for="j in item.list" :key="j.id"
                         justify="space-between"  align="center" type="flex" @click="toDetail(j)">
                    <van-col span="6" ><p class="row-label">{{j.nm}}</p></van-col>
                    <van-col span="2" ><p class="arrow"><van-icon name="arrow" /></p></van-col>
                </van-row>
            </div>
        </div>

        <div class="btnOut" @click="toLogout">退出</div>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import { Toast } from 'vant';
    import {mixDtl} from "../mixins/mixDtl"
	import {mapState} from "vuex";
    export default {
        mixins:[mixDtl],
        data() {
            return {
                value: '',
                catList:[],//规则列表
                version:'1.1',
            };
        },
        components:{
            penHeader,


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        mounted(){

            this.getCatList()
            this.$bridge.callHandler('h5_version',"",res=>{
                this.version=res
            })
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
            //版本上升級
            toUpdate(){
                this.$bridge.callHandler('h5_check',"",res=>{

                })
            },
            toClear(){
                Toast("缓存清理成功")
            },
            toBack(){
              this.until.back();
            },
            toLogout(){

                this.api.logout().then(()=>{
                    localStorage.clear()
                    sessionStorage.clear()
                    Toast('退出成功');
                    setTimeout(()=>{
                        this.$bridge.callHandler('h5_logout',"",res=>{

                        })
                        window.location.replace('../home/login.html');
                    },1500)
                })
            },
            toPage(url){
                this.until.href(url)
            },
            toDetail(j){
                if(j.type==1){
                    this.until.href('./ruleDtl.html?id='+j.id+"&nm="+j.nm)
                }else{
                    this.until.href(j.link+"")
                }

            },

             getCatList(){
                this.api.ruleCatList().then(res1=>{
                    let tmpList=res1.data.list
                    for(let i=0;i<tmpList.length;i++){
                        let item =tmpList[i]
                        let qry = this.query.new()
                        this.query.toW(qry,'cid',item.id,'EQ')
                        this.api.ruleList(this.query.toEncode(qry)).then(res2=>{
                            let ruleList=res2.data.list
                            let list2= ruleList.filter(item=>{
                                return item.id!="4936350072853504" && item.id !="5007397095773184"
                            })

                            this.$set(item,"list",list2)

                        })


                    }
                    for(let  i=0;i<tmpList.length;i++){
                        if(tmpList[i].status==1){
                            this.catList.push(tmpList[i])
                        }
                    }
               })




            }

        }

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{

        .body{
            font-size: 0.29rem;
            background:@backgroundColor;
            padding: 0.2rem 0.2rem;
            .list-cont{
                border-radius: 5px;
                background: white;
                position: relative;
                padding: 0.2rem 0.4rem;

                .row {
                    padding: 0.2rem 0;
                    border-bottom: 1px solid #E5E5E5;
                    .arrow{
                        text-align: right;
                    }
                }
                .row:last-of-type{
                    border-bottom: none;
                }


            }
        }





	}

.btnOut{

    width: 6rem;
    height:0.8rem;
    background: #FFFFFF;
    border: 1px solid #E9E9E9;
    border-radius: 40px;
    margin:0.3rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
