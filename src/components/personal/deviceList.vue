<template>
<!--    设备列表-->
    <div class="deviceList">
        <div class="line-1">
            <p v-for="item in typeList"><span :class="{active1:item.checked}" @click="toChoose(item)">{{item.nm}}</span></p>
        </div>
        <div class="line-2">
            <div  class="line-2-item" v-for="item in selectList">
                <div class="line-2-title" @click="toChooseSub(item)"  :class="{active2:item.checked}">
                    <p>{{item.nm}}</p>
                    <p><van-icon name="arrow-down" v-if="item.checked" />
                        <van-icon name="arrow-up"  v-else/>
                    </p>
                </div>
                <div class="line-2-cont" v-if="item.checked">
                    <van-row class="row"  v-if="item.proList.length>0">
                       <van-col span="3"><p class="col">序号</p></van-col>
                        <van-col span="3"><p class="col">图片</p></van-col>
                        <van-col span="6"><p class="col">名称</p></van-col>
                        <van-col span="5"><p class="col">型号</p></van-col>
                        <van-col span="4"><p class="col">供应商</p></van-col>
                        <van-col span="3"><p class="col">操作</p></van-col>
                    </van-row>
                    <van-row class="row"  v-for="(j,jex) in item.proList" :key="jex">
                        <van-col span="3"><p class="col">{{jex+1}}</p></van-col>
                        <van-col span="3"><p class="col"><img :src="j.imgUrl"></p></van-col>
                        <van-col span="6"><p class="col">{{j.nm}}</p></van-col>
                        <van-col span="5"><p class="col">{{j.attrDesc}}</p></van-col>
                        <van-col span="4"><p class="col">{{j.deviceSupply}}</p></van-col>
                        <van-col span="3"><p class="col" @click="toDel(item,jex)">删除</p></van-col>
                    </van-row>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "deviceList",
        props:{
            typeList:{
                type:Array,
            }
        },
        data(){
          return{
              selectList:[],
          }
        },
        methods:{
            //选择标题
            toChoose(item){
                this.typeList.forEach(i=>{
                    i.checked=false
                })
                item.checked=true
                this.selectList=item.subList
            },
            //展开或这收缩
            toChooseSub(item){
                if(item.proList && item.proList.length>0){
                    item.checked=!item.checked
                }
            },
            toDel(item,j){
                item.proList.splice(j,1)
                if(item.proList.length==0){
                    item.checked=false
                }
            }
        }

    }
</script>

<style scoped lang="less">

    .deviceList{
        background: white;
        .line-1{

            display: flex;
            p{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999999;
            }

        }
        .line-2{
            .line-2-item{
                .line-2-title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.2rem 0.2rem;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    color: #333333;
                }
                .line-2-cont{
                    background: #efefef;
                    .row{
                        border-top: 1px solid rgba(0,0,0,0.1);
                        padding: 0.2rem 0;
                        .col{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            img{
                                width: 100%;
                            }
                        }
                    }
                }


            }
        }

    }

    .active1{
        color: white;
        background: #2778BE;
        padding: 0.05rem 0.2rem;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .active2{
        background: #efefef;
    }

</style>
