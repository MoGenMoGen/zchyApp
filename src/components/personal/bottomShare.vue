<template>
<!--    底部分享-->
    <div class="bottomshare">
        <div v-for="item in list" :key="item.id" class="bottomshare-1">
            <div class="contt">
                <img :src="item.url" @click="toShare(item)">
                <p>{{item.nm}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'vant'
    export default {
        name: "bottomShare",
        props:{
            info:{
                type:Object,
            },
            description:{
                type:String,
                default:"分享描述"
            },
            //分享的缩略图
            thumb:{
                type:String,
                default:"https://sinovat.oss-cn-shanghai.aliyuncs.com/2d9e8687f05f444abe3e9fc4aa9e208b_图标.png"
            }

        },
        data(){
            return{
                list:[
                    {
                        id:1,
                        nm:'微信好友',
                        url:'https://sinovat.oss-cn-shanghai.aliyuncs.com/b2dfddf280334538b451b4069b98cdf7_微信好友.png',
                    },
                    {
                        id:2,
                        nm:'朋友圈',
                        url:'\n' +
                            'https://sinovat.oss-cn-shanghai.aliyuncs.com/9b5527034f3f4b2981a483a0146ba94b_微信朋友圈.png',
                    },
                    {
                        id:3,
                        nm:'QQ好友',
                        url:'https://sinovat.oss-cn-shanghai.aliyuncs.com/c98e17e7503d4ea7a35e5dba39f0358b_QQ好友.png',
                    },
                    {
                        id:4,
                        nm:'QQ空间',
                        url:'https://sinovat.oss-cn-shanghai.aliyuncs.com/a2dc8f94b9e547369a9530b23325d39f_qq空间.png',
                    },
                    {
                        id:5,
                        nm:'复制链接',
                        url:'https://sinovat.oss-cn-shanghai.aliyuncs.com/f688129451d643749619fdbbef9d7e57_复制链接.png',
                    },
                ]
            }

        },
        methods:{
            toShare(item){
                if(item.id!=5){
                    console.log("分享地址。。。。")
                    console.log(window.location.href)
                    //    微信好友
                    let tmp={
                        type:item.id,
                        title:this.info.nm,
                        description:this.description,
                        url:window.location.href,
                        thumb:this.thumb,

                    }
                    this.$bridge.callHandler('h5_share',JSON.stringify(tmp),(res)=>{

                    })
                }else if(item.id==5){
                //    复制链接
                   this.copy(window.location.href)
                }
            },
            copy(e){
                let transfer = document.createElement('input');
                document.body.appendChild(transfer);
                transfer.value = e;  // 这里表示想要复制的内容
                transfer.focus();
                transfer.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                }
                transfer.blur();
                Toast('复制成功')

                document.body.removeChild(transfer);
            },



        }

    }
</script>

<style scoped lang="less">
    .bottomshare{
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        .bottomshare-1{
            width: 20%;
            flex-shrink: 0;
            .contt{
                width:100%;
                img{
                    flex-shrink: 0;
                    display: block;
                    margin: 0 auto;
                    width:65%;
                }
                p{
                    margin-top: 0.1rem;
                    text-align: center;
                }
            }
        }
    }


</style>
