<template>
<!--	每日签到-->
    <div id="container">

        <pen-header title="每日签到"></pen-header>

        <div class="body">
            <div class="list-cont">
                <calendar class="cal" ref="sign"></calendar>
                <div class="line4-btn">
                    <p class="btn"  v-if="hasSign">今日已签到</p>
                    <p class="btn noSign" @click="toSign" v-else>签到</p>
                    <p class="signDay">本月已签到<span style="color: #E4393C"> {{signDay}}</span>天</p>
                </div>


            </div>
        </div>


    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import calendar from "../../../components/personal/calendar";
	import {mapState} from "vuex";

    export default {
        data() {
            return {
                value: '',
                list:[],
                hasSign:false,//是否签到
                signDay:0,//当月签到天数
            };
        },
        components:{
            penHeader,
            calendar,

        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        mounted(){

            this.isSign()
            this.getSignDay()
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/signIn'
				}
			},
            //签到分页列表
            async getList() {
                let qry = this.query.new();
                this.query.toP(qry, 1, 31)
                this.query.toW(qry, "crtTm", "[2020-07-01,2020-07-31]", "BT")
                this.query.toO(qry, 'crtTm', "asc")
                let res = await this.api.signList(this.query.toEncode(qry))
            },
            //签到接口
            toSign() {
                this.api.signIn().then(res => {
                    this.$refs.sign.updData()
                })
            },
            //    是否签到
            async isSign() {
                let date = new Date()

                let qry = this.query.new();
                this.query.toP(qry, 1, 1)
                this.query.toW(qry, "crtTm", this.dateFormat(date), "LK")
                this.query.toO(qry, 'crtTm', "asc")
                let res = await this.api.signList(this.query.toEncode(qry))

                if (res.list.length > 0) {
                    this.hasSign = true

                } else {
                    this.hasSign = false
                }
            },
            //格式化日期
            dateFormat(date) {
                if (date instanceof Date) {
                    var year = date.getFullYear();
                    /* 在日期格式中，月份是从0开始的，因此要加0
                     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                     * */
                    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    // 拼接
                    return year + "-" + month + "-" + day;
                } else {
                    return date
                }
            },

            dateFormat2(date) {
                if (date instanceof Date) {
                    var year = date.getFullYear();
                    /* 在日期格式中，月份是从0开始的，因此要加0
                     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                     * */
                    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    // 拼接
                    return year + "-" + month;
                } else {
                    return date
                }
            },

            //    获取当月签到天数
            async getSignDay() {
                let date = new Date()
                let qry = this.query.new();
                this.query.toP(qry, 1, 31)
                this.query.toW(qry, "crtTm", this.dateFormat2(date), "LK")
                this.query.toO(qry, 'crtTm', "asc")
                let res = await this.api.signList(this.query.toEncode(qry))
                this.signDay = res.list.length
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
                border-radius: 20px;
                background: white;
                position: relative;
                .cal{
                    margin: 0 auto;
                }
                .line4-btn{
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top:70%;

                    /*签到按钮*/
                    .btn{
                        width:153px;
                        height:40px;
                        background:rgba(153,153,153,1);
                        border-radius:5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 17px;
                        margin: 25px auto;
                        &:hover{
                            cursor: pointer;
                        }
                        &:active{
                            opacity: 0.5;
                        }
                    }
                    .noSign{
                        background: @themeColor;
                        color: #ffffff;
                    }


                    /*签到天数*/
                    .signDay{
                        text-align: center;
                        font-size:16px;
                        font-family:PingFang SC;
                        /*font-weight:500;*/
                        color:rgba(102,102,102,1);
                    }
                }

            }
        }





	}



</style>
