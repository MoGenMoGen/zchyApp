<template>
    <div class="app" :style="{backgroundImage:'url('+bg+')'}">
		<van-nav-bar fixed title="我要入驻" :border="false" fixed class="fixTop">
		    <van-icon name="arrow-left" slot="left" color="#ffffff" style="font-size: 0.34rem;" @click="back"></van-icon>
		</van-nav-bar>
		<div class="listBox">
			<p v-for="(item,index) in list" :key="index" @click="toPage(item.cd)">
				<img :src="item.arg1">
				<span>{{item.nm}}</span>
			</p>
		</div>
        
		
    </div>

</template>

<script>
	import { Toast } from 'vant';
    import bg from '@/assets/img/bg.png'
	import sz1 from '@/assets/img/home/船东.png'
	import sz2 from '@/assets/img/home/设计院所.png'
	import sz3 from '@/assets/img/home/建造船厂.png'
	import sz4 from '@/assets/img/home/监理监造.png'
	import sz5 from '@/assets/img/home/检测机构.png'
	import sz6 from '@/assets/img/home/供应商.png'
	import sz7 from '@/assets/img/home/经销商.png'
	import sz8 from '@/assets/img/home/代理商.png'
	import sz9 from '@/assets/img/home/服务商.png'
	import {mapState} from "vuex";
    export default {
        data() {
            return {
                bg,
                list:[
					{img:sz1,
						nm:'船东',
						cd:'',
					},{img:sz2,
						nm:'设计院所',
						cd:''
					},{img:sz3,
						nm:'建造船厂',
						cd:''
					},{img:sz4,
						nm:'监理单位',
						cd:''
					},{img:sz5,
						nm:'检测机构',
						cd:''
					},{img:sz6,
						nm:'供应商',
						cd:''
					},{img:sz7,
						nm:'经销商',
						cd:''
					},{img:sz8,
						nm:'代理商',
						cd:''
					},{img:sz9,
						nm:'服务商',
						cd:''
					},
				],
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
					window.location.href = window.location.origin+this.serverAddr+'/settleIn'
				}
			},
			async getList(){
				// let data = await this.api.getRoleList()
				// data.forEach((item,index)=>{
				// 	this.list[index].cd=item.cd
				// 	this.$set(this.list,index,this.list[index])
				// })
				this.list = await this.api.getRoleList()
			},
			back(){
				window.history.go(-1);
			},
            toPage(cd){
				window.location.href='./settlelnForm.html?type='+cd
            }
        },

    };
</script>
<style lang="less">
	.fixTop{
		background: none;
		.van-nav-bar__title{
			font-size: 0.36rem;
			color: #ffffff;
		}
		.van-nav-bar__left{
			font-size: 0.34rem;
		}
		.van-nav-bar__right{
			font-size: 0.28rem;
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
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center top;
		background-color: #F1F3F2;
		.listBox{
			margin: 0.96rem 0.3rem;
			background-color: #ffffff;
			border-radius: 0.12rem;
			display: flex;
			flex-wrap: wrap;
			>p{
				width: 33%;
				height: 2.6rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				// border: 0.01rem solid #E9E9E9;
				>img{
					width: 0.44rem;
					margin-bottom: 0.2rem;
				}
				>span{
					font-size: 0.22rem;
					color: #666666;
				}
			}
			>p:nth-child(-n+3){
				border-bottom: 0.01rem solid #E9E9E9;
			}
			>p:nth-child(3n+1){
				border-right: 0.01rem solid #E9E9E9;
			}
			>p:nth-child(3n){
				border-left: 0.01rem solid #E9E9E9;
			}
			>p:nth-child(n+4):nth-child(-n+9){
				border-bottom: 0.01rem solid #E9E9E9;
			}
		}
        
    }

</style>
<style>

</style>