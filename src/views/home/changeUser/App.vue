<template>
    <div class="app">
		<van-nav-bar fixed title="角色切换" :border="false" fixed class="fixTopC">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		</van-nav-bar>
		<div class="listBox">
			<div>
				<span>当前账号: </span>
				<p>{{currentRole.company}} [ {{currentRole.identityNm}} ]</p>
				<!-- <i class="iconfont" :class="nowCheck?'iconchenggong1':'iconyuan'"></i> -->
			</div>
			<div v-for="(item,index) in list" :key="index">
				<span :style="index==0?'':'opacity: 0;'">切换账号: </span>
				<p>{{item.company}} [ {{item.identityNm}} ]</p>
				<i class="iconfont " :class="{'iconchenggong1':item.checked,'iconyuan':!item.checked}" @click="check(index)"></i>
			</div>
		</div>
		<div class="btnList">
			<button class="cancelB" @click="cancel">取消</button>
			<button class="confirmB" @click="confirm">确定</button>
		</div>


    </div>

</template>

<script>
	import { Toast } from 'vant';
	import {mapState} from "vuex";
    export default {
        data() {
            return {
				currentRole:{},
				checkUser:{},
				nowCheck:true,
				list:[]
            };
        },
        components:{
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        created(){
        },
        mounted() {
			this.currentRole=JSON.parse(localStorage.getItem('currentRole'))
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
        			window.location.href = window.location.origin+this.serverAddr+'/personal/'
        		}
        	},
			cancel(){
				this.until.href('../person/index.html')
			},
			confirm(){
				if(!this.checkUser){
					Toast.fail('请选择要切换的账号')
					return
				}
				window.localStorage.setItem("currentRole", JSON.stringify( this.checkUser))
				this.api.toSave('currentRole',this.checkUser)
				this.$bridge.callHandler('h5_set_role',JSON.stringify(this.checkUser),res=>{

				})
				this.until.href('../person/index.html')
			},
			async getList(){
				this.list = await this.api.roleList()

				let index=this.list.findIndex(item=>this.currentRole.id == item.id)
				console.log(index)
				this.list.splice(index,1)
			},
			check(index){
				this.nowCheck=false
				this.list.forEach((item,k)=>{
					if(index==k){
						item.checked=true
						this.checkUser=item
					}else{
						item.checked=false
					}
					this.$set(this.list,k,this.list[k])
				})
			},
			back(){
				window.history.go(-1);
			},
            toPage(url){
                this.until.href(url)
            },
        },

    };
</script>
<style lang="less">
	.fixTopC{
		background: @themeColor;
		.van-nav-bar__title{
			font-size: 0.36rem;
			color: #ffffff;
		}
		.van-nav-bar__left{
			font-size: 0.34rem;
		    color: #ffffff;
		}

	}
</style>
<style lang="less" scoped>

    .app{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
		background-color: #F1F3F2;
		.listBox{
			margin: 1.2rem 0.3rem;
			padding: 0.33rem 0.36rem;
			background-color: #ffffff;
			border-radius: 0.12rem;
			display: flex;
			flex-direction: column;
			>div{
				display: flex;
				align-items: center;
				margin-bottom: 0.2rem;
				>span,>p{
					color: #343434;
					font-size: 0.24rem;
				}
				>span{margin-right: 0.12rem;}
				>p{flex: 1;}
				>i{font-size: 0.38rem;}
				.iconchenggong1{
					color: #4ABD3B;
				}
			}
			>div:first-child{
				padding-bottom: 0.37rem;
				border-bottom: 0.01rem solid #E5E5E5;
			}
		}
		.btnList{
			display: flex;
		    position: fixed;
		    bottom: 0;
		    width: 100%;
			>button{
				flex: 1;
				height: 0.98rem;
				font-size: 0.28rem;
				line-height: 0.98rem;
				text-align: center;
				border: none;
			}
			.cancelB{
				background-color: #ffffff;
				color: #9a9a9a;
			}
			.confirmB{
				background-color: @themeColor;
				color: #ffffff;
			}
		}

    }

</style>
<style>

</style>
