<template>
<!--  设计院方案设计、详细设计、生产设计-编辑-->
  <div class="baseInfo2">




    <van-row class="row" align="center"  type="flex">
      <van-col span="7"><p>过程选择：</p></van-col>
      <van-col span="17" >
        <mob-select text="nm" :list="progressList"  @change="choosePos"></mob-select>
      </van-col>
    </van-row>

    <van-row class="row" type="flex" >
      <van-col span="7">
        <p>过程说明：</p>
      </van-col>
      <van-col span="17">
        <textarea v-model="form.description"  placeholder="请输入过程说明"></textarea>
      </van-col>
    </van-row>

    <van-row class="row" align="center" type="flex">
      <van-col span="7"><p>完成时间：</p></van-col>
      <van-col span="17" >
        <cal-common @change="getCal"></cal-common>
      </van-col>
    </van-row>

    <van-row class="row"  type="flex">
      <van-col span="7"><p>上传附件：</p></van-col>
      <van-col span="17" >
        <van-uploader v-model="imgList" multiple  :after-read="afterRead1"/>
      </van-col>
    </van-row>

    <van-row class="row"  type="flex">
      <van-col span="7"><p>上传文件：</p></van-col>
      <van-col span="17" >
        <van-uploader v-model="fileList" multiple  :after-read="afterRead2"/>
      </van-col>
    </van-row>
    <van-row class="row" type="flex" align="center">
      <van-col span="24"  >
        <p v-for="j in info.fileList"  class="fileList">
          <img :src="j.img">
          <span>{{j.fileNm}}</span>
        </p>
      </van-col>
    </van-row>

    <van-row class="row"  type="flex">
      <van-col span="24"><p class="btn" @click="submit">保存</p></van-col>

    </van-row>


  </div>

</template>

<script>


   import calCommon from "../calCommon";
   import mobSelect from "../../../components/personal/shipInfo/mobSelect";
   import { Toast } from 'vant';
    export default {
        name: "fangansheji",
        props:{
          title:{
              type:String,
              default:'设计'
          },
          flowCd:{
            type:Number,
            default:1
          },
        },
        components:{
          calCommon,
          mobSelect
        },
        data(){
            return{
              excel:'https://sinovat.oss-cn-shanghai.aliyuncs.com/d7d5b731fcd64503a193bb8f0a8aab12_excel.png',
              ppt: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/62b4c359ffb345a49fcadaffc98b9987_ppt.png',
              word:'https://sinovat.oss-cn-shanghai.aliyuncs.com/6bb0f58d475c4f18ab606556eca76033_word.png',
              pdf:'https://sinovat.oss-cn-shanghai.aliyuncs.com/5df1549175c44b5ca0c1826d534a02fc_pdf.png',
              arrowDown: 'https://sinovat.oss-cn-shanghai.aliyuncs.com/aba3c08269364bb08d852ae96bedfed0_arrowDown.png',
              arrowUp:'https://sinovat.oss-cn-shanghai.aliyuncs.com/fc38e664383c43bbab909b95c712ba7b_arrowUp.png',
              currentRole:{},
              progressList: [],//过程列表
              form:{
                cd:'',
                id:'',
                docsId: "",
                designFlowCd: "",
                description: "",
                imgUrl: "",
                attachment: "",
                shipyardId: "",
                shipyardNm: "",
                completeTm: '',
                seq:"",
                nm:"",
              },
                info:{},
                list:[],
                id:'',
                imgList:[],//图片列表
                fileList:[],//附件列表
            }
        },
      watch:{
        flowCd:{
          handler(newVal) {
            console.log("监听变化。。"+newVal)
            this.getInfo()
          },
          deep: true,
          immediate: true,
        },
      },
        mounted() {
          this.id= this.until.getQueryString('id')
          this.currentRole=JSON.parse(this.until.loGet('currentRole'))
          this.getDic()

        },
        methods:{
          //过程选择
          choosePos(e){
            this.form.cd=e.cd
            this.form.nm=e.nm

          },
          //提交
          submit(){
            this.form.docsId = this.until.getQueryString('id')
            this.form.shipyardId=this.currentRole.id
            this.form.shipyardNm=this.currentRole.company
            this.form.attachment=''
            this.form.imgUrl=''
            if(this.fileList.length>0){
              this.fileList.forEach(item=>{
                this.form.attachment=this.form.attachment+item.url+","
              })
              this.form.attachment = this.form.attachment.substring(0, this.form.attachment.lastIndexOf(','));
            }else {
              this.form.attachment=''
            }

            if(this.imgList.length>0){
              this.imgList.forEach(item=>{
                this.form.imgUrl=this.form.imgUrl+item.url+","
              })
              this.form.imgUrl = this.form.imgUrl.substring(0, this.form.imgUrl.lastIndexOf(','));
            }else{
              this.form.imgUrl=''
            }
            console.log(this.form)
            this.api.buildDeptAdd(this.form).then((res)=>{
              Toast("修改成功")

              setTimeout(()=>{
                this.getInfo()//刷新数据
              },1500)

            })


          },

          //上传图片，一张图片返回对象，多张图片返回数组
          afterRead1(e){
            console.log(e)
            this.imgList.forEach(item=>{
              if(item.status!="done"){
                item.status="uploading"
                this.api.uploadImg2(item.file).then(res=>{
                  item.status="done"
                  item.url=res
                  console.log("上传成功返回")
                  console.log(res)
                })
              }

            })

          },
          afterRead2(e){
            console.log(e)
            this.fileList.forEach(item=>{
              if(item.status!="done"){
                item.status="uploading"
                this.api.uploadImg2(item.file).then(res=>{
                  item.status="done"
                  item.url=res
                  console.log("上传成功返回")
                  console.log(res)
                })
              }

            })

          },
          async getDic(){
            this.progressList=await this.api.dataDictionary('DOCS_BUILD_SHIP_PROCESS')
          },


          //获取安装日期
          getCal(e){
            this.form.actDt=e
          },
          async getInfo(){
            this.form={}
            let qry = this.query.new()
            this.query.toW(qry,'docsId',this.until.getQueryString('id'),'EQ')
            this.list=await this.api.buildStep(this.query.toEncode(qry))
            if(this.list.length>0){
              this.info=this.list[0]
              console.log("返回信息：：")
              console.log(this.info)
              this.form.id=this.info.id
              this.form.description=this.info.description
              this.form.actDt=this.info.actDt
              let imgList1=this.info.imgUrl.split(',')
              let fileList1=this.info.attachment.split(',')
              this.info.fileList=this.info.attachment.split(',')
              this.imgList=[]
              this.fileList=[]

              if(this.info.imgUrl){
                imgList1.forEach(item=>{
                  let param={
                    url:item,
                    status: 'done',
                  }
                  this.imgList.push(param)
                })
              }

              if(this.info.attachment){
                fileList1.forEach(item=>{
                  let param={
                    url:item,
                    status: 'done',
                  }
                  this.fileList.push(param)
                })

              }



              //
              let fileList2=[]
              this.info.fileList.forEach(v=>{
                let type=v.split('.')[v.split('.').length - 1]
                let nmList=v.split('.com/')  //分割出url后的内容
                let nm=""
                nmList.forEach((j,z)=>{       //防止文件名中有 .com/ 所以循环加入
                  if(z!=0){
                    nm+=j
                  }
                })
                nmList=nm.split('-')        //分割随机字符后的内容
                nm=""
                nmList.forEach((j,z)=>{   //防止文件名中有 - 所以循环
                  if(z!=0){
                    nm+=j
                  }
                })
                nm=nm.split('.'+type)[0]
                if(type=='pdf'){
                  fileList2.push({url:v,img:this.pdf,'fileNm':nm})
                }else if(type=='doc'||type=='docx'){
                  fileList2.push({url:v,img:this.word,'fileNm':nm})
                }else if(type=='ppt'||type=='pptx'){
                  fileList2.push({url:v,img:this.ppt,'fileNm':nm})
                }else if(type=='xls'||type=='xlsx'){
                  fileList2.push({url:v,img:this.excel,'fileNm':nm})
                }else{
                  fileList2.push({url:v,img:v,'fileNm':nm})
                }
                this.info.fileList=fileList2
              })


            }else{
              this.info={}
              this.imgList=[]
              this.fileList=[]
            }
            console.log("设计方案信息")
            console.log(this.info)

          },
        }

    }
</script>

<style scoped lang="less">

  .baseInfo2{
    padding:  0 0.2rem;
    .row{
      font-size: 0.29rem;
      padding: 0.09rem 0.3rem;

      .btn{
        margin: 0 auto;
        width: 85%;
        background: #2778BE;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 0.8rem;
        &:active{
          opacity: 0.5;
        }
      }
      .title1{
        width: 100%;
        text-align: center;
        img{
          width: 80%;

        }
      }
      .fileList{
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
        img{
          width: 0.4rem;
          margin-right: 0.2rem;

        }
      }

      textarea{
        width: 90%;
        height:2.3rem;
        border: 1px solid #DDDDDD;
        padding: 0.2rem;
      }

      textarea::-webkit-input-placeholder {
        color: #B8B8B8;
      }

      textarea::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #B8B8B8;
      }

      textarea:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #B8B8B8;
      }

      textarea:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #B8B8B8;
      }


    }
  }

</style>
