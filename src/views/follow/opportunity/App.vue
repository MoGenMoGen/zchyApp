<template>
<!--	我的船舶-->
    <div id="container">
        <pen-header title="我的商机"></pen-header>
		<search-view v-model="searchText" place-text="客户名称"  class="searchView"></search-view>
        <div class="searchPlace"></div>

        <div class="body">
            <van-list  v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad"   :immediate-check="immediate" >
                <div class="list-item" v-for="item in list" :key="item.id" @click="toDtl(item)">
                    <van-row class="row" align="center" type="flex">
                        <van-col span="6"><p>跟进客户：</p></van-col>
                        <van-col span="18"><p>{{item.custNm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p>联系人：</p></van-col>
                        <van-col span="18"><p>{{item.linkman}}</p></van-col>
                    </van-row>
 
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >联系电话：</p></van-col>
                        <van-col span="18"><p>{{item.mob}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >商机内容：</p></van-col>
                        <van-col span="18"><p>{{item.cont}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >意向金额：</p></van-col>
                        <van-col span="18"><p>￥{{item.amt}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >创建时间：</p></van-col>
                        <van-col span="18"><p>{{item.crtTm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >状态：</p></van-col>
                        <van-col span="18"><p>{{item.statusNm}}</p></van-col>
                    </van-row>
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >备注：</p></van-col>
                        <van-col span="18"><p>{{item.rmks}}</p></van-col>
                    </van-row>
<!--更换商机状态-->
                    <van-row class="row"  align="center" type="flex">
                        <van-col span="6"><p >操作：</p></van-col>
                        <van-col span="18"><span class="btn" @click="toEdit(item)">编辑</span></van-col>
                    </van-row>

<!--                    <van-icon name="arrow" class="arrow" />-->
                </div>
            </van-list>

        </div>

        <van-popup v-model="showPicker" position="bottom":style="{ height: '40%' }">
            <van-picker
                    value-key="nm"
                    show-toolbar
                    :columns="statusList"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
            />
        </van-popup>

        <b-button title="新增商机" @click="toAdd"></b-button>
    </div>
</template>

<script>
	import searchView from "../../../components/personal/searchView";
	import penHeader from "../../../components/personal/penHeader";
	import {mixins} from "../../person/mixins/mixins"
    import bButton from "../../../components/personal/bButton";
    import { Toast } from 'vant';
	import {mapState} from "vuex";
    export default {
		mixins:[mixins],
        data() {
            return {
                statusList:[],//商机状态列表
                showPicker:false,
                //选中的项

                selectItem:{
                    id:'',
                    nm: "",//商机标题
                    custId: "",
                    custNm: "",
                    linkman: "",
                    mob: "",
                    email: "",
                    cont: "",
                    statusCd: "",
                    amt: "",
                    orgEnterId: "",
                    rmks: ""
                },
            };
        },
        components:{
			searchView,
            penHeader,
            bButton
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.getStatusList()
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/opportunity'
				}
			},
            onConfirm(e){

                this.showPicker=false
                this.selectItem.statusNm=e.nm
                this.selectItem.statusCd=e.cd
                this.api.custProjectUpd(this.selectItem).then(()=>{
                    Toast('修改成功');

                })

            },
            //商机状态
            async getStatusList(){
                this.statusList = await this.api.dataDictionary('OPPORTUNITY_STATUS')
            },
		    //编辑商机
            toEdit(item){
                console.log(item)
                this.selectItem=item
                this.showPicker=true
            },
            toDtl(item){
                // this.until.href("./profileDtl.html?id="+item.id)
            },
            toAdd(){
                this.until.href("./opporAdd.html")
            },
		   async	getList(){
				let qry = this.query.new()
               this.query.toO(qry,'crtTm',"desc")
               this.query.toP(qry,this.pageNo,this.pageSize)
               if(this.searchText){
                   this.query.toW(qry,'custNm',this.searchText,'LK')
               }
				let res =await  this.api.custProjectPage(this.query.toEncode(qry))
               this.list.push(...res.data.list)
               // 加载状态结束
               this.finished = this.list.length >= res.page.total
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



            .list-item{
                width: 100%;
                background: white;
                border-radius: 5px;
                margin-bottom: 0.2rem;
                padding: 0.15rem 0;
                position: relative;
                .row{
                    padding: 0 0.4rem;
                    height: 0.5rem;

                /*    操作按钮*/
                    .btn{
                        color: #2778BE;
                    }


                }
                .arrow{
                    position: absolute;
                    top:50%;
                    transform: translateY(-50%);
                    right: 0.4rem;
                }

            }
        }




	}



</style>
