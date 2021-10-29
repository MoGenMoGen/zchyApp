<template>
<!--	消息详情-->
    <div id="container">

        <pen-header title="我的产品"></pen-header>

        <div class="body">
<!--            <div class="list-cont">-->
<!--                <ship-equip></ship-equip>-->
<!--            </div>-->
            <div>店铺管理后台链接</div>
            <div @click="copyUrl">
                https://www.sinovatocean.com/shop-admin/index.html#/login
            </div>
        </div>

    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import shipEquip from "../../../components/shipEquip";
    import {mixDtl} from "../mixins/mixDtl"
    export default {
        mixins:[mixDtl],
        data() {
            return {
                value: '',
            };
        },
        components:{
            penHeader,
            shipEquip,

        },
        async created(){

        },
        mounted(){

            this.getDtl(this.id)
        },
        methods: {
           async  getDtl(id){
               this.info =  await this.api.msgDetail(id)

            },
            //复制推荐码
            copyUrl(){
               let url="https://www.sinovatocean.com/shop-admin/index.html#/login"
                var oInput = document.createElement('input');     //创建一个隐藏input
                console.log(oInput);
                oInput.value = url;    //赋值
                console.log(oInput.value);
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                this.$toast.success('复制成功');
            },

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
                .nm{
                    text-align: center;
                    font-size: 0.3rem;
                    color: #333333;
                    margin-bottom: 0.1rem;

                }
                .sendTm{
                    text-align: center;
                    font-size: 0.25rem;
                    color: #999999;
                    margin-bottom: 0.1rem;

                }
                .cont{
                    font-size: 0.26rem;
                }

            }
        }





	}



</style>
