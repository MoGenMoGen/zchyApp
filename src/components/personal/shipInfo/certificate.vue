<template>
<!--   检验建议证书-->
    <div class="certificate">

        <van-row  class="row" type="flex" align="center">
            <van-col span="5"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/24a95d69424142928170eb313bca4ffe_检验证书.png" ></p></van-col>
        </van-row>

        <ul>
          <li v-for="(item,index) in list1" :key="index">
            <div class="imgCont" >
              <img :src="item.imgUrl">
            </div>
            <p>{{item.nm}}</p>
              <p>有效期:</p>
            <p>{{item.validUntil}}</p>
			<div style="display: flex;">
			<div class="fileCont" style="margin-right: 0.2rem;" v-for="(item1,index1) in item.file" :key="index1" @click="toFile(item1.url)" > 
				<van-icon name="description" size="1.8rem"/>
				<p>{{item1.nm}}</p>
			</div>
			</div>
          </li>
            <li v-for="(item,index) in 3-list1.length%3" :key="index" v-if="list1.length/5!=0">

            </li>
        </ul>


       <!-- <van-row  class="row" type="flex" align="center" style="margin-top: 0.3rem">
            <van-col span="5"> <p class="title1"><img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/5d1d0cfc66bd4a7d9920ca4658a549e2_产品证书.png" ></p></van-col>
        </van-row>
        <ul>
            <li v-for="(item,index) in list2" :key="index">
                <div class="imgCont" >
                    <img :src="item.imgUrl">
                </div>
                <p>{{item.nm}}</p>
                <p>有效期:</p>
                <p>{{item.validUntil}}</p>
            </li>
            <li v-for="(item,index) in 3-list2.length%3" :key="index" v-if="list2.length/5!=0">

            </li>
        </ul> -->
    </div>
</template>

<script>
  import {mapState} from "vuex";
    export default {
      props:['list'],
        name: "productList",
      data(){
          return{
            size:1,//证书图片的宽高比

            listp:[
                {
                    id:1,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:2,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:3,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:4,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:5,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:6,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },
                {
                    id:7,
                    imgUrl:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6c5939d9af3b4789b971adf9c4d4dd2a_船舶展示.png',
                    nm:'证书名',
                    validUntil:'2020-23-20',//有效期
                },


            ],
            list1:[],
            list2:[],
            certificateList:[],
          }
      },
      computed:{
        ...mapState([
          'bWidth',
          'width'
        ]),

      },
      watch:{
        list:{
          handler:function () {
            this.list1 = []  //检验证书
            this.list2 = [] //产品证书
            this.list.forEach(item=>{
                if(item.types==0){
                  this.list1.push(item)
                }else {
                  this.list2.push(item)
                }
            })
          },
          deep:true
        }
      },
      mounted() {
        this.id= this.until.getQueryString('id')
        this.getInfo()
      },
      methods:{
		  toFile(url){
			window.open(url)  
		  },
        async getInfo(){
          this.certificateList=[]
          let qry = this.query.new()
          // this.currentRole=JSON.parse(this.until.seGet('currentRole'))
          this.query.toW(qry,'docsId',this.id,'EQ')
		  // this.query.toW(qry,'types',0,'EQ')
          this.query.toP(qry,'1','100')
          let data=await this.api.certificate(this.query.toEncode(qry))
          this.total=data.page.total
          this.certificateList.push(...data.data.list)
          console.log(this.certificateList)
          this.certificateList.forEach(item=>{
              if(item.validUntil){
                  item.validUntil=item.validUntil.split(' ')[0]
              }

            if(item.types==0){
              this.list1.push(item)
			  this.list1.forEach(item=>{
				  if(item.attachment){
					  item.attachment=item.attachment.split(',')
					  item.file=[]
					  item.attachment.forEach(item1=>{
						  let fileObj={}
						  fileObj.url=item1
						  fileObj.nm=item1.substring(item1.indexOf('_')+1,item1.length)
						  item.file.push(fileObj)
					  })
				  }
				  console.log(123, this.list1);
				  
			  })
            }else {
              this.list2.push(item)
            }
          })
        },
      }
    }
</script>

<style lang="less" scoped>

    .certificate{
        padding: 0 0.4rem;

        .row{
            padding: 0.09rem 0;
            .title1{
                width: 100%;
            }
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            li{

                flex-shrink: 0;
                width: 1.8rem;
                .imgCont{
                    width: 1.8rem;
                    height: 1.8rem;
                    background: #E7E7E7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                p:nth-of-type(1){
                    margin-top: 0.05rem;
                    color: #333333;
                    font-size: 0.26rem;
                }
                p:nth-of-type(2){
                    color: #999999;
                    font-size: 0.17rem;
                }
                p:nth-of-type(3){
                    color: #999999;
                    font-size: 0.17rem;
                }
            }
        }

    }


</style>
