<template>
<!--  设计院方案设计、详细设计、生产设计-编辑-->
  <div class="baseInfo2">

    <van-row  class="row" type="flex" align="center">
      <van-col span="24"> <p class="title1">
        <img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/daacdf5f92014cdd866b280245a11382_方案设计.png" v-if="flowCd==11" >
        <img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/a9af88258e1940989d3ed12051f87f93_送审设计.png" v-if="flowCd==12" >
        <img  src="https://sinovat.oss-cn-shanghai.aliyuncs.com/a0690fd1172b4a678ae510e3ee938ba6_生产设计.png" v-if="flowCd==13" ></p>
      </van-col>
    </van-row>

<!--    富文吧-->
    <van-row class="row" type="flex" >
      <van-col span="8">
        <p>上传内容：</p>
      </van-col>
    </van-row>

    <van-row class="row" type="flex" >
      <van-col span="24">
        <wang-editor :getEditConts="getEditConts" :insertImg="insertImgHandle" ref="wangeditor"></wang-editor>
<!--          <vue-ueditor-wrap v-model="form.description" style="z-index: 99;width: 100%"  :config="myConfig"></vue-ueditor-wrap>-->
      </van-col>
    </van-row>


<!--    <van-row class="row" type="flex" >-->
<!--      <van-col span="8">-->
<!--        <p>方案设计说明：</p>-->
<!--      </van-col>-->
<!--      <van-col span="16">-->
<!--        <textarea v-model="form.description"  placeholder="请输入设计说明"></textarea>-->
<!--      </van-col>-->
<!--    </van-row>-->

<!--    <van-row class="row" align="center" type="flex">-->
<!--      <van-col span="8"><p>完成时间：</p></van-col>-->
<!--      <van-col span="16" >-->
<!--        <cal-common @change="getCal"></cal-common>-->
<!--      </van-col>-->
<!--    </van-row>-->

<!--    <van-row class="row"  type="flex">-->
<!--      <van-col span="8"><p>上传附件：</p></van-col>-->
<!--      <van-col span="16" >-->
<!--        <van-uploader v-model="imgList" multiple  :after-read="afterRead1"/>-->
<!--      </van-col>-->
<!--    </van-row>-->

    <van-row class="row"  type="flex">
      <van-col span="8"><p>上传文件：</p></van-col>
      <van-col span="16" >
        <van-uploader v-model="fileList"   :after-read="afterRead2"/>
      </van-col>
    </van-row>
<!--    <van-row class="row" type="flex" align="center">-->
<!--      <van-col span="24"  >-->
<!--        <p v-for="j in info.fileList"  class="fileList">-->
<!--          <img :src="j.img">-->
<!--          <span>{{j.fileNm}}</span>-->
<!--        </p>-->
<!--      </van-col>-->
<!--    </van-row>-->

    <van-row class="row"  type="flex">
      <van-col span="24"><p class="btn" @click="submit2">确认提交</p></van-col>

    </van-row>


  </div>

</template>

<script>
   import calCommon from "../calCommon";
   import wangEditor from "../wangeditor"
   import VueUeditorWrap from "vue-ueditor-wrap";
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
          wangEditor,
          VueUeditorWrap
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
                richText:'666666',
              form:{
                id:'',
                docsId: "",
                designFlowCd: "",
                description: "",
                imgUrl: "",
                attachment: "",
                designerId: "",
                designerNm: "",
                completeTm: '',
              },
                info:{},
                list:[],
                id:'',
                imgList:[],//图片列表
                fileList:[],//附件列表

                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 440,
                    // 初始容器宽度
                    initialFrameWidth: "100%",
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    serverUrl: "https://www.sinovatocean.com/general/oss/upload",
                    // UEDITOR_HOME_URL: '/static/ueditor/'
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    // UEDITOR_HOME_URL:
                    //   process.env.NODE_ENV === "production"
                    //     ? "/static/ueditor/"
                    //     : "/static/ueditor/"

                },
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


        },
        methods:{
            //获取附件名称
            getFileNm(url){
                if(url){
                    let str= url.split("_")
                    return str[str.length-1]
                }else {
                    return url
                }

            },
            //获取后缀图片
            getFileSuffix(url){
                if(url){
                   let str= url.split(".")
                  if(str[str.length-1]=="jpg"){
                      return "<img src="+this.ppt+">"
                  } else  if(str[str.length-1]=="word"){
                      return "<img src="+this.word+">"
                  }else  if(str[str.length-1]=="excel"){
                      return "<img src="+this.excel+">"
                  }else  if(str[str.length-1]=="pdf"){
                      return "<img src="+this.pdf+">"
                  }
                }

            },


          //       初始化富文本编辑器内容
          initEdit(s){
            this.$refs.wangeditor.setEditorContent(s);
          },

          // 获取编辑器内容 格式为html
          getEditConts (value) {
            window.console.log("富文本编辑器：")
            window.console.log(value)
            this.form.description=value
          },
          // 插入图片操作
          insertImgHandle (res, insertImg, editor) {
            window.console.log("上传图片。。。")
            if (res && res.code === 0) {
              insertImg(res.data)
            }
          },

          //提交富文本
          submit2(){

              this.form.designerNm=this.currentRole.company
              this.form.docsId = this.until.getQueryString('id')
              this.form.designerId=this.currentRole.id
              this.form.id=this.info.id
              if(!this.form.description){
                  Toast("请输入富文本内容")
                  return
              }

              if(this.form.id){
                  this.api.designDeptUpd(this.form).then(()=>{
                      Toast("修改成功")
                      this.getInfo();
                  })
              }else {
                  this.api.designDeptAdd(this.form).then(()=>{
                      Toast("添加成功")
                      this.getInfo();
                  })
              }

          },
          //提交
          submit(){
            this.form.docsId = this.until.getQueryString('id')
            this.form.designerId=this.currentRole.id

            this.form.designerNm=this.currentRole.company
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
            this.api.designDeptUpd(this.form).then((res)=>{
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
          //  上传文件
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
                    let rich="<br><a href="+res+">附件:"+this.getFileNm(res)+"</a>"
                    this.form.description=this.form.description+rich
                    this.initEdit(this.form.description)
                })
              }

            })

          },


          //获取安装日期
          getCal(e){
            this.form.completeTm=e
          },
          async getInfo(){
            this.form= {
                      id:'',
                      docsId: "",
                      designFlowCd: "",
                      description: "",
                      imgUrl: "",
                      attachment: "",
                      designerId: "",
                      designerNm: "",
                      completeTm: '',
            }
            let qry = this.query.new()

            this.query.toW(qry,'docsId',this.until.getQueryString('id'),'EQ')
            let data=await this.api.dataDictionary('DOCS_DESIGN_STATUS')
            data.forEach((item,index)=>{
              if(index+1==this.flowCd-10){
                this.form.designFlowCd=item.cd
              }
            })
            this.query.toW(qry,'designFlowCd',this.form.designFlowCd,'EQ')
            this.list=await this.api.designDeptList(this.query.toEncode(qry))
            if(this.list.length>0){
              this.info=this.list[0]
              console.log("返回信息：：")
              console.log(this.info)
              this.form.id=this.info.id
              this.form.description=this.info.description
                this.form.description=this.until.imgTagAddStyle(this.form.description)

                this.initEdit(this.form.description)
              this.form.completeTm=this.info.completeTm
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
                this.form.description=""
                this.form.id=""
                this.form.completeTm=""
                this.initEdit(this.form.description)
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
        padding: 0.1rem 0;
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

