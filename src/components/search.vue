<template>
    <div class="tab">
        <!-- 搜索的下拉选择 -->
        <van-popup v-model="topShow" position="bottom">
            <van-picker
                    default-index="0"
                    show-toolbar
                    :columns="searchList"
                    value-key="label"
                    @confirm="onConfirm"
                    @cancel="onCancel"
            />
        </van-popup>
        <div class="homeTop">
            <p @click="topShow=true" class="checkTop">{{checkNm}}<i class="iconfont iconarrdown"></i></p>
            <p class="searchTop">
                <img :src="search" style="width:0.23rem; height:0.23rem;margin-right: 0.1rem;">
                <input type="text"  @keyup.enter="toSearch" placeholder="请输入关键词查询产品" v-model="searchNm">
            </p>
        </div>
    </div>
</template>

<script>
    import search from '@/assets/img/search.png'

    export default {
        props:{

        },
        data() {
            return {
                topShow:false,
                search,
                searchNm:'',
                checkNm:'船舶',
                selectCheck:'1',	//被选中的value
                searchList:[{
                    value: '1',
                    // label: '船舶方案'
                    label:'船舶'
                },{
                    value: '2',
                    // label: '船舶'
                    label:'产品'
                }, {
                    value: '4',
                    // label: '产品'
                    label:'资讯'
                }, {
                    value: '5',
                    // label: '店铺'
                    label:'方案'
                }, {
                    value: '7',
                    // label: '资讯'
                    label:'店铺'
                }],
            };
        },
        components:{
        },
        created(){
        },
        mounted() {
        },
        methods: {
            //搜索
            toSearch(){
                console.log('=============')
                console.log(this.searchNm)
                if(this.selectCheck == 5){
                    this.until.href('../search/program.html?keyWord='+this.searchNm)
                }else if(this.selectCheck == 1){
                    this.until.href('../search/ship.html?keyWord='+this.searchNm)
                }else if(this.selectCheck == 2){
                    this.until.href('../search/product.html?keyWord='+this.searchNm)
                }else if(this.selectCheck == 7){
                    this.until.href('../search/store.html?keyWord='+this.searchNm)
                }else if(this.selectCheck == 4){
                    this.until.href('../search/info.html?keyWord='+this.searchNm)
                }
                // else if(this.selectCheck == 8){
                //   this.until.href('../search/brandSearch?keyWord='+this.keyWord + "&selectCheck=" + this.selectCheck)
                // }
            },
            onConfirm(value, index){
                this.checkNm=value.label
                this.selectCheck=value.value
                this.topShow=false
            },
            onCancel(){
                this.topShow=false
            },
            toPage(url) {
                this.until.href(url)
            },

        },

    };
</script>
<style lang="less" scoped>
    @import url("../assets/css/mobile.less");
    .tab{
        .homeTop{
            display: flex;
            align-items: center;
            background-color: #ffffff;
            height: 0.6rem;
            border-radius: 0.3rem;
            margin-right: 0.26rem;
            padding: 0 0.26rem;
            .checkTop{
                font-size: 0.24rem;
                margin-right: 0.2rem;
                border-right: 0.01rem solid rgba(0,0,0,0.2);
                white-space:nowrap;
                color: #343434;
                >i{
                    margin-left: 0.1rem;
                    margin-right: 0.16rem;
                    font-size: 0.16rem;
                }
            }
            .searchTop{
                font-size: 0.22rem;
                display: flex;
                align-items: center;
            }

        }

    }

</style>
