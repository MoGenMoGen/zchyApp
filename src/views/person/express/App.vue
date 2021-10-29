<template>
<!--	物流信息-->
    <div id="container">

        <pen-header title="物流信息"></pen-header>

        <div class="body">
            <div class="list-cont" >
                <van-steps :active="active" direction="vertical">
                    <van-step v-for="(item,index) in list" :key="index">
                        <h3>{{item.context}}</h3>
                        <p>{{item.ftime}}</p>
                    </van-step>
                </van-steps>


            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";

    import {mixDtl} from "../mixins/mixDtl"
	import {mapState} from "vuex";
    export default {
        mixins:[mixDtl],
        data() {
            return {
                value: '',
                active:0,//active属性表示当前步骤的索引，从 0 起计
                list:[],
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
            let item=JSON.parse(this.until.getQueryString("item"))
            this.getDtl(item)
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
					this.until.back()
				}
			},
           async  getDtl(item) {


               let res = await this.api.trace2(item.logiEntpCd, item.logiCd)
               let parse = JSON.parse(res.msg);
               this.list = parse.data;
               console.log("66666566666")
               console.log(this.list)

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


            }
        }





	}



</style>
