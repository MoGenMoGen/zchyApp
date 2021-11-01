<template>
<!--	资金管理-付款记录-->
    <div id="container">
        <pen-header title="新增整改单"></pen-header>
		<div class="containerBody">
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						整改名称：
					</div>
				</div>
				<div class="right">
					<van-field v-model="value"  placeholder="请输入整改名称"  style="font-size: 0.22rem;"/>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						整改单位：
					</div>
				</div>
				<div class="right">
					<van-field
					  readonly
					  clickable
					  :value="value"
					  placeholder="选择城市"
					  @click="showPicker = true"
					  style="font-size: 0.22rem;"
					/>
					<van-popup v-model="showPicker" round position="bottom">
					  <van-picker
					    show-toolbar
					    :columns="columns"
					    @cancel="showPicker = false"
					    @confirm="onConfirm"
					  />
					</van-popup>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						检查区域：
					</div>
				</div>
				<div class="right">
					<van-field v-model="value"  placeholder="请输入检查区域"  style="font-size: 0.22rem;"/>
				</div>
			</div>
			<div class="bodyList" style="display: flex; align-items: flex-start;">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						隐患说明：
					</div>
				</div>
				<div class="right">
					<textarea rows="" cols="" placeholder="请输入主要事项内容详情"></textarea>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						责任整改人：
					</div>
				</div>
				<div class="right">
					<van-field
					  readonly
					  clickable
					  :value="value"
					  placeholder="选择责任整改人"
					  @click="showPicker = true"
					  style="font-size: 0.22rem;"
					/>
					<van-popup v-model="showPicker" round position="bottom">
					  <van-picker
					    show-toolbar
					    :columns="columns"
					    @cancel="showPicker = false"
					    @confirm="onConfirm"
					  />
					</van-popup>
				</div>
			</div>
			<div class="bodyList" style="display: flex; align-items: flex-start;">
				<div class="left">
					<span style="color:#FF2015;opacity: 0;">*</span>
					<div class="name">
						整改要求：
					</div>
				</div>
				<div class="right">
					<textarea rows="" cols="" placeholder="请按照要求进行整改"></textarea>
				</div>
			</div>
			<div class="bodyList">
				<div class="left">
					<span style="color:#FF2015 ;">*</span>
					<div class="name">
						整改期限：
					</div>
				</div>
				<div class="right">
					<van-field
					  readonly
					  clickable
					  :value="value"
					  placeholder="选择整改期限"
					  @click="showPickerTwo = true"
					  style="font-size: 0.22rem;"
					   right-icon="clock-o"
					/>
					<van-popup v-model="showPickerTwo" round position="bottom">
				<van-datetime-picker
				  v-model="currentDate"
				  type="date"
				  title="选择年月日"
				  :min-date="minDate"
				  :max-date="maxDate"
				   @cancel="showPickerTwo = false"
				/>
					</van-popup>
				</div>
			</div>
			<div class="imgUpload">
					<div class="top">
						隐患图片<span>(上传完图片后，可以点击图片进行编辑)</span>
					</div>
					<van-uploader :after-read="afterRead" />
			</div>
		
		</div>
		


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
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
				value:'',
				showPicker:false,
				showPickerTwo:false,
				columns:[
					'姚峰',
					'摩根'
				]
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


        },

    };
</script>
<style lang="less" scoped>

    @import url("../../../assets/css/mobile.less");
	#container{
		
		.containerBody{
			background-color: #ffffff;
			width: 7.09rem;
			padding: 0.4rem 0.2rem;
			box-sizing: border-box;
			margin: 0.2rem auto;
			border-radius: 0.12rem;
			.bodyList{
				display: flex;
				align-items: center;
				margin-bottom: 0.3rem;
				.left{
					display: flex;
					align-items: center;
					width: 1.8rem;
					.name{
						font-size: 0.24rem;
						font-weight: 500;
						color: #333333;
						margin-left: 0.1rem;
						width: 1.5rem;
					}
				}
				.right{
					margin-left:0.1rem ;
					font-weight: 500;
					color: #303030;
					.van-cell{
						width: 4.57rem;
						border: 0.01rem solid #DDDDDD;
					    height: 0.6rem;
						display: flex;
						 align-items: center;
					}
					.van-cell::after{
						border-bottom: 0;
					}
					.van-cell::placeholder{
						color: #999999;
					}
					textarea{
						width: 4.57rem;
						height: 2.12rem;
						border: 0.01rem solid #DDDDDD;
						padding: 0.2rem 0.32rem;
						box-sizing: border-box;
						font-size: 0.22rem;
					}
					textarea::placeholder{
						color: #999999;
					}
				}
			}
			.imgUpload{
				margin-left: 0.5rem;
				.top{
					font-size: 0.24rem;
					font-weight: 500;
					color: #333333;
					span{
						font-size: 0.24rem;
						font-weight: 500;
						color: #909090;
					}
				}
			}
		}

	}



</style>
