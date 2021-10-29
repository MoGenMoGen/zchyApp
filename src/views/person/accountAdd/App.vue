<template>
<!--	我的预约-->
    <div id="container">
        <pen-header :title="title"></pen-header>
        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p><span class="red">*</span>账户名称：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.username" placeholder="请输入登录账户手机号码" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center"  type="flex">
                        <van-col span="7"><p><span class="red">*</span>姓名：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.realNm" placeholder="请输入姓名" >
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p><span class="red">*</span>联系电话：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.mob" placeholder="请输入联系电话" type="number">
                        </van-col>
                    </van-row>
                    <van-row class="row2" align="center" type="flex">
                        <van-col span="7"><p><span class="red"></span>联系邮箱：</p></van-col>
                        <van-col span="17" >
                            <input v-model="form.email" placeholder="请输入联系邮箱">
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p><span class="red"></span>备注：</p></van-col>
                        <van-col span="17" >
                            <textarea v-model="form.rmks" placeholder="请输入备注"></textarea>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex" v-show="orgEnterIds.length > 0 ">
                        <van-col span="7"><p><span class="red"></span>权限设置：</p></van-col>
                        <van-col span="17" >
                            <van-checkbox-group v-model="form.permList" direction="horizontal" >
                                <van-checkbox shape="square" style="margin-left: 0.2rem;margin-bottom: 0.2rem"
                                              :name="item.id"  v-for="item in levelList" :key="item.id"
                                               v-show="item.show"
                                >{{item.nm}}</van-checkbox>
                            </van-checkbox-group>
                        </van-col>
                    </van-row>
                    <van-row class="row2"  type="flex">
                        <van-col span="7"><p><span class="red">*</span>选择角色：</p></van-col>
                        <van-col span="17" >
                            <van-checkbox-group v-model="form.orgEnterIds"  >
                                <van-checkbox shape="square" style="margin-left: 0.2rem;margin-bottom: 0.2rem"
                                              :name="item.id"  v-for="item in roleList" :key="item.id">{{item.company}}[{{item.identityNm}}]</van-checkbox>
                            </van-checkbox-group>
                        </van-col>
                    </van-row>


                </div>


            </div>
        </div>
       <b-button2 left-text="取消" right-text="保存" @leftClick="leftClick" @rightClick="rightClick"></b-button2>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import bButton2 from "../../../components/personal/bButton2";
	import {mixDtl} from "../mixins/mixDtl"
    import { Toast } from 'vant';
    import mobSelect from "../../../components/personal/shipInfo/mobSelect";
    import multiSelect from "../../../components/personal/multiSelect";
    import calCommon from "../../../components/personal/calCommon";
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                title:'新增子账户',
                form:{
                    id: 0,
                    userId: '',
                    username: "",
                    mob: "",
                    realNm: "",
                    email: "",
                    rmks: "",
                    orgEnterIds: [],
                    permList: []
                },
                orgEnterIds:[],//当前角色的权限列表
                levelList:[],//权限列表
                roleList:[],//角色列表

                type:1,

            };
        },
        watch:{
		  'form.orgEnterIds':{
		      deep:true,
              handler:function () {
                  this.orgEnterIds = []
                  this.roleList.forEach(item=>{
                      console.log(item.id)
                      if(this.form.orgEnterIds.findIndex(v=>v==item.id)>-1){
                          this.orgEnterIds.push(item)
                      }
                  })
                  console.log(this.orgEnterIds)
                  this.levelList.forEach((item,index)=>{
                      this.orgEnterIds.forEach(v=>{
                          console.log(v.identityCd)
                          if(item.identityCds.indexOf(v.identityCd)>-1){
                              // console.log('可以显示的')
                              item.show = true
                          }else {
                              // console.log('不可以显示的')
                              item.show = false
                          }
                          this.$set(this.levelList,index,item)
                      })
                  })
              }
          }
        },
        components:{
            penHeader,
            bButton2,
            calCommon,
            mobSelect,
            multiSelect


        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
           this.type=this.until.getQueryString('type')
            if(this.type==2){
                this.title='编辑子账户'

                window.console.log(this.form)
                let info =JSON.parse(this.until.getQueryString('form'))
                window.console.log("子账户列表")
                window.console.log(info)
                this.form.userId=info.userId
                this.form.username=info.username
                this.form.mob=info.mob
                this.form.realNm=info.realNm
                this.form.email=info.email
                this.form.rmks=info.rmks
                this.form.id=info.id

            }
            this.getRsco(this.form.userId)

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
					window.location.href = window.location.origin+this.serverAddr+'/personal/subAccount'
				}
			},

            //查询账户权限
            async getRsco(userId){

                let p={userId:userId}
                let data =await this.api.getRsco(p)
                this.levelList = data
                //权限默认选中
                this.levelList.forEach(item=>{
                    if(item.checked){
                        this.form.permList.push(item.id)
                    }
                })
                if(this.type==1){
                    this.getRole()
                }else {
                    this.getRoleList(this.form.id)
                }
                // console.log(1)
            },
            async getRole(){
                this.roleList = await this.api.roleList()
                console.log(this.roleList)
            },


            async getRoleList(userId){
                let p={subAccountId:userId}
                this.roleList=await this.api.getListIdentities(p)
                this.roleList.forEach(item=>{
                    if(item.checked){
                        this.form.orgEnterIds.push(item.id)
                        this.orgEnterIds.push(item)
                    }
                })


            },

		    //左侧按钮
            leftClick(){
                this.until.back();
            },
            //提交
             rightClick(){
                console.log(this.form)
                 if(!this.form.username){
                     Toast('请输入登录账户');
                     return
                 }

                 if(!this.form.realNm){
                     Toast('请输入用户名称');
                     return
                 }
                 if(this.reg.checkPhone(this.form.mob)!='ok'){
                     Toast('请输入正确手机号码');
                     return
                 }

                 if(this.reg.checkMail(this.form.email)!='ok'){
                     Toast('请输入正确邮箱');
                     return
                 }
                 if(!this.form.rmks){
                     Toast('请输入备注');
                     return
                 }



                 //权限选中列表。。。
                if(this.type==1){
                    this.api.addSubAccount(this.form).then(res=>{
                        Toast('添加成功');
                        setTimeout(() => {
                            this.until.back();
                        }, 1500);
                    })
                }else {
                    this.api.updSubAccount(this.form).then(res=>{
                        Toast('修改成功');
                        setTimeout(() => {
                            this.until.back();
                        }, 1500);
                    })
                }



            }


        },

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

                .list-item2 {
                    position: relative;
                    background: white;
                    border-radius: 5px;
                    margin-bottom: 0.2rem;
                    padding: 0.15rem 0.2rem;

                    .row{
                        padding: 0.15rem 0.2rem;
                        color: #343434;
                        .radio-group{
                            display: flex;
                            flex-wrap: wrap;
                            .van-radio{
                                width: 50%;
                                padding-bottom: 0.25rem;
                            }
                        }
                    }
                    .row2{
                        padding: 0.15rem 0.2rem;
                        color: #343434;


                        input{
                            width: 90%;
                            padding: 0.15rem 0.2rem;
                            border: 1px solid #DDDDDD;
                        }
                        textarea{
                            width: 90%;
                            height:2.3rem;
                            border: 1px solid #DDDDDD;
                            padding: 0.2rem;
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

                        textarea::-webkit-input-placeholder {
                            color: #B8B8B8;
                        }

                        textarea::-moz-placeholder {
                            /* Mozilla Firefox 19+ */
                            color: #B8B8B8;
                        }

                        textarea:-moz-placeholder {
                            /* Mozilla Firefox 4 to 18 */
                            color: #B8B8B8;
                        }

                        textarea:-ms-input-placeholder {
                            /* Internet Explorer 10-11 */
                            color: #B8B8B8;
                        }


                    }
                }
            }
        }





	}



</style>
