<template>
<!--	修改地址或者新增地址-->
    <div id="container">

        <pen-header :title="title"></pen-header>

        <div class="body">
            <div class="list-cont">
                <van-row class="row" align="center" type="flex">
                    <van-col span="8"><p class="receNm">收货人姓名</p></van-col>
                    <van-col span="16"><p><input placeholder="请输入姓名" v-model="form.receNm"></p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="8"><p class="receNm">手机号码</p></van-col>
                    <van-col span="16"><p><input placeholder="请输入号码"  v-model="form.receMob"></p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex" >
                    <van-col span="8"><p class="receNm">省市区</p></van-col>
                    <van-col span="12"><addr v-if="dataShow"  @changeAddr="changeAddr" :addrNm="form.addrNm" ref="addrC"></addr></van-col>
                    <van-col span="2" offset="2"><van-icon name="arrow-down" /></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="8"><p class="receNm">详细地址</p></van-col>
                    <van-col span="16"><p><input placeholder="请输入详细地址" v-model="form.addrDtl"></p></van-col>
                </van-row>
                <van-row class="row" align="center" type="flex">
                    <van-col span="2">
                        <p style="display:flex; align-items: center;" @click="toCheck"><img :src="icChecked" v-if="form.hasDef==1" class="icCheck">
                            <img :src="icUnChecked" v-else class="icCheck"></p>
                    </van-col>
                    <van-col span="8" @click="toCheck"><p>默认地址</p></van-col>
                </van-row>
            </div>
        </div>


        <b-button title="保存收货地址" @click="save" v-if="type==1"></b-button>
        <b-button2 left-text="删除" right-text="保存" v-else @rightClick="save" @leftClick="del"></b-button2>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton from "../../../components/personal/bButton";
    import bButton2 from "../../../components/personal/bButton2";
    import addr from "../../../components/addr";
    import { Toast } from 'vant';
    import {mixDtl} from "../mixins/mixDtl"
	import {mapState} from "vuex";
    export default {
        mixins:[mixDtl],
        data() {
            return {
                icChecked:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d601132dedac47049c8dd0dd452cd647_单选-选中.png',
                icUnChecked:'https://sinovat.oss-cn-shanghai.aliyuncs.com/753ab87c5da04faea93a24a8e3bab5d6_单选-未选中.png',
				dataShow:false,
                value: '',
                title:'新增地址',
				id:"",
                type:1,//1-新增，2,编辑
                form:{
                    receNm:'',
                    receMob:'',
                    addrNm:'',
                    addrCd:'',
                    addrDtl:'',
                    hasDef:0,
                },
            };
        },
        components:{
            penHeader,
            bButton,
            addr,
            bButton2,

        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        mounted(){
            this.type=this.until.getQueryString("type")
            if(this.type==1){
                this.title="新增地址"
            }else{
                this.title="编辑地址"
                let info=this.until.getQueryString("info")
                this.form=JSON.parse(info)
				this.id=JSON.parse(info).id
            }
			this.dataShow=true
            this.getDtl(this.id)
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
					let type = this.until.getQueryString('type')
					if(type==1){
						window.location.href = window.location.origin+this.serverAddr+'/personal/addAddr?type='+type
					}else{
						let info = this.until.getQueryString('info')
						window.location.href = window.location.origin+this.serverAddr+'/personal/addAddr?type='+type+'&info='+info
					}
					
					
					
				}
			},
            del(){
                let t={
                    id:this.id
                }
                this.api.delAddr(t).then(res=>{
                    Toast("删除成功")
                    setTimeout(()=>{
                        this.until.back()
                    },1500)
                })
            },
            changeAddr(e){
                console.log(e)
				let data = JSON.parse(e)
				this.form.addrNm = data.province+'-'+data.city+'-'+data.region
				this.form.addrCd = data.provinceId+'-'+data.cityId+'-'+data.regionId
            },
            toCheck(){
              if(this.form.hasDef==0){
                  this.form.hasDef=1
              }else {
                  this.form.hasDef=0
              }
            },
            //保存地址
            save(){
                if(!this.form.receNm){
                    Toast('请输入收货人姓名')
                    return
                }
                if(this.reg.checkPhone(this.form.receMob)!='ok'){

                    Toast(this.reg.checkPhone(this.form.receMob))
                    return
                }
                if(!this.form.addrDtl){
                    Toast('请输入详情地址')
                    return
                }

                if(this.type==1){
                    this.api.addrAdd(this.form).then(()=>{

                        Toast.success('新增成功');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)
                    })
                }else {
                    this.api.addrUpd(this.form).then(()=>{
                        Toast.success('编辑成功');
                        setTimeout(()=>{
                            this.until.back()
                        },1500)

                    })
                }

            },
            syscAddr(addStr,addCode){
                this.form.addrNm=addStr
                this.form.addrCd=addCode
                window.console.log(addStr+addCode)

            },
           async  getDtl(id){
               this.info =  await this.api.msgDetail(id)

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
                padding: 0.2rem;
                .row{
                    padding: 0.3rem 0.2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    p{
                        input{
                            color: #333333;
                            display: flex;
                            align-items: center;
                        }
                        input::-webkit-input-placeholder {
                            color: #B8B8B8;
                        }

                        input::-moz-placeholder {
                            /* Mozilla Firefox 19+ */
                            color: #B8B8B8;
                        }

                        input:-moz-placeholder {
                            /* Mozilla Firefox 4 to 18 */
                            color: #B8B8B8;
                        }

                        input:-ms-input-placeholder {
                            /* Internet Explorer 10-11 */
                            color: #B8B8B8;
                        }
                    }
                }
                .row:last-of-type{
                    border: none;
                }

            }
        }


	}
/*选中图标*/
.icCheck{
    width: 0.4rem;
    height: 0.4rem;
}

</style>
