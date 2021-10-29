<template>
<!--	投标管理下载附件-->
    <div id="container">

        <pen-header title="下载附件"></pen-header>

        <div class="body">
            <div class="list-cont">

                <div class="list-item2" >
                    <van-row class="row2"  type="flex" v-for="(item,index) in fileList" :key="index">
                        <van-col span="18" >
                            <p @click="toChoose(item)">
                                <img  class="radio" :src="icChecked" v-if="item.checked">
                                <img  class="radio" :src="icUnChecked" v-else>

                                <img  class="file" :src="item.imgUrl"/>{{index+1}}.{{item.nm}}
                            </p>
                        </van-col>
                    </van-row>

                </div>

            </div>
        </div>
        <div class="all" @click="toChooseAll">
            <img   :src="icChecked" v-if="allChecked">
            <img   :src="icUnChecked" v-else>全选
        </div>
        <b-button2 left-text="取消" right-text="下载" @leftClick="leftClick" @rightClick="rightClick"></b-button2>
    </div>
</template>

<script>
    import penHeader from "../../../components/personal/penHeader";
    import {mixDtl} from "../../person/mixins/mixDtl"
    import bButton2 from "../../../components/personal/bButton2";
    import {Toast} from 'vant'
	import {mapState} from "vuex";
    export default {
		mixins:[mixDtl],
        data() {
            return {
                excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
                ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
                word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
                pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
                icChecked: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/d601132dedac47049c8dd0dd452cd647_单选-选中.png',
                icUnChecked:'https://sinovat.oss-cn-shanghai.aliyuncs.com/753ab87c5da04faea93a24a8e3bab5d6_单选-未选中.png',
                fileList:[],
                allChecked:false,

            };
        },
        components:{
            penHeader,
            bButton2,
        },
		computed: {
		    ...mapState([
		        'serverAddr'
		    ])
		},
        async created(){

        },
        async mounted() {
            this.info=JSON.parse(this.until.getQueryString("info"))
            if(this.info.attachment){
                let list = this.info.attachment.split(',')
                list.forEach(item =>{
                    let type = item.split('.')[item.split('.').length - 1]
                    if(type=='pdf'){
                        this.fileList.push({imgUrl:this.pdf,nm:item.slice(item.indexOf('_') + 1), url: item,checked:false})
                    }else if(type=='doc'||type=='docx'){
                        this.fileList.push({imgUrl:this.word,nm:item.slice(item.indexOf('_') + 1), url: item,checked:false})
                    }else if(type=='ppt'||type=='pptx'){
                        this.fileList.push({imgUrl:this.ppt,nm:item.slice(item.indexOf('_') + 1), url: item,checked:false})
                    }else if(type=='xls'||type=='xlsx'){
                        this.fileList.push({imgUrl:this.excel,nm:item.slice(item.indexOf('_') + 1), url: item,checked:false})
                    }
                })

            }
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
					window.location.href = window.location.origin+this.serverAddr+'/personal/bid'
				}
			},
		    //下载
            rightClick(){
                let tmpList=[]
                this.fileList.forEach(item=>{
                    if(item.checked){
                        tmpList.push(item)
                        this.$bridge.callHandler('h5_load',item.url,res=>{

                        })
                    }
                })
                if(tmpList.length==0){
                    Toast("请选中")
                    return
                }

            },
            leftClick(){
              this.until.back()
            },
            toChoose(item){
                item.checked=!item.checked
                this.ifAllChecked()
            },
            toChooseAll(){
                this.allChecked=!this.allChecked
                this.selectedAll()
            },
            selectedAll(){
                this.fileList.forEach(item=>{
                    if(this.allChecked){
                        item.checked=true
                    }else{
                        item.checked=false
                    }

                })
            },
            ifAllChecked(){
                let num=0
                this.fileList.forEach(item=>{
                    if(item.checked){
                        num++
                    }
                })
                if(this.fileList.length==num){
                    this.allChecked=true
                }else{
                    this.allChecked=false
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
                    .row2{
                        padding: 0.15rem 0.2rem;
                        color: #343434;
                        p{
                            width: 100%;
                            display: flex;
                            align-items: center;
                            .file{
                                width: 0.35rem;
                                margin-right: 0.1rem;
                            }
                            .radio{
                                width: 0.35rem;
                                margin-right: 0.3rem;
                            }
                        }




                    }
                }
            }
        }





	}
   .all{

       height: 1rem;
       position: fixed;
       bottom: 1rem;
       left: 0;
       right: 0;
       display: flex;
       align-items: center;
       padding: 0 0.5rem;
       background: white;
       border-bottom: 1px solid rgba(0,0,0,0.1);
       img{
           width: 0.35rem;
           margin-right: 0.3rem;
       }


   }

</style>
