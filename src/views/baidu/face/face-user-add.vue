<template>
  <el-dialog :title="'用户管理'" width="1200px" :visible.sync="visible"
             append-to-body>
    <basic-container>
      <avue-form :option="option" ref="form" v-model="form" @submit="rowSave">
        <template slot-scope="row" slot="creamUrl">
          <div>
            <!--开启摄像头-->
            <Button  type="primary"  @click="callCamera" style="margin-right: 10px;">开启摄像头</Button>
            <!--关闭摄像头-->
            <Button  type="primary"  @click="closeCamera" style="display: block">关闭摄像头</Button>
            <!--图片展示-->
            <video ref="video" width="640" height="480" autoplay v-if="isVideo"></video>
            <!--canvas截取流-->
            <canvas ref="canvas" width="640" height="480" v-if="picture"></canvas>
            <!--确认-->
            <Button  type="primary" @click="ph" v-if="isVideo" style="display: block">拍照</Button>
            <img style="width: 280px" :src="imgUrl" />
            <br><el-button v-show="imgUrl !== null && imgUrl !== ''" style="margin-top:10px"  type="danger" plain size="mini" @click="imgUrl=null">删除</el-button>
            <el-button v-show="imgUrl !== null && imgUrl !== ''" style="margin-top:10px"  type="primary" plain size="mini" @click="cropperVisible=true">裁剪图像</el-button>
          </div>
        </template>
      </avue-form>
      <el-dialog title="裁剪图片" :visible.sync="cropperVisible" width="70%" @open="cropperOpen" append-to-body >
        <div class="download-cropper" style="height: 70vh">
          <vueCropper
            ref="cropper"
            :img="creamOption.img"
            :info="true"
            :outputSize="creamOption.size"
            :outputType="creamOption.outputType"
            :fixed-box="creamOption.fixedBox"
            :can-move="creamOption.canMove"
            :can-move-box="creamOption.canMoveBox"
            :autoCrop="creamOption.autoCrop"
            :auto-crop-width="creamOption.autoCropWidth"
            :auto-crop-height="creamOption.autoCropHeight"
          ></vueCropper>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="cropperVisible = false">取 消</el-button>
                <el-button type="primary" @click="cropperOk">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </el-dialog>
</template>

<script>
  import {add} from "@/api/face/faceuser";
  import {VueCropper} from 'vue-cropper'
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        visible: false,
        form: {
          creamType: 1,
        },
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        imgUrl: '',
        picture: false,
        isVideo: false,
        videoWidth: 280,
        videoHeight: 320,
        cropperVisible: false,
        video: null,
        canvas: null,
        context: null,
        creamOption: {
          img: '',
          info: true,
          size: 1,
          outputType: 'jpg',
          full: true,
          fixedBox: false,
          canMove: true,
          canMoveBox: true,
          canScale: true,
          original: false,
          centerBox: true,
          high: true,
          // 只有自动截图开启 宽度高度才生效
          autoCrop: true,
          autoCropWidth: 280,
          autoCropHeight: 320,
          // 开启宽度和高度比例
          fixed: false,
          fixedNumber: [4, 3]
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "用户组id",
              prop: "groupId",
              rules: [{
                required: true,
                message: "请输入用户组id",
                trigger: "blur"
              }]
            },
            {
              label: "用户id",
              prop: "userId",
              type: 'select',
              dicUrl: "/api/blade-user/user-list",
              props: {
                label: "realName",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入用户id",
                trigger: "blur"
              }]
            },
            {
              label: "上传类型",
              prop: "creamType",
              type: 'radio',
              dicData: [{
                label: '图片上传',
                value: 1
              },{
                label: '拍照',
                value: 2
              }],
              change: ({value}) => {
                this.form.creamType = value;
                let column = this.findObject(this.option.column, 'creamUrl');
                let column1 = this.findObject(this.option.column, 'imgUrl');
                if (value === 2) {
                  column.display = true;
                  column1.display = false
                } else {
                  column.display = false;
                  column1.display = true
                }
              }
            },
            {
              label: "图片存储地址",
              prop: "imgUrl",
              span: 24,
              dataType: 'string',
              type: 'upload',
              listType: 'picture-img',
              limit: 1,
              loadText: '附件上传中，请稍等',
              action: '/api/blade-resource/oss/endpoint/put-file',
              propsHttp: {
                res: 'data',
                url: 'link',
              },
              rules: [{
                required: true,
                message: "请输入图片存储地址",
                trigger: "blur"
              }]
            }, {
              label: "摄像头拍照",
              prop: "creamUrl",
              display: false,
              formslot:true,
              span: 24
            }, {
              label: "人脸图片的唯一标识",
              prop: "faceToken",
              display: false,
              rules: [{
                required: true,
                message: "请输入人脸图片的唯一标识",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.face_add, false),
          viewBtn: this.vaildData(this.permission.face_view, false),
          delBtn: this.vaildData(this.permission.face_delete, false),
          editBtn: this.vaildData(this.permission.face_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    components: {
      VueCropper
    },
    methods: {
      init (id) {
        this.imgUrl = '';
        this.picture = false;
        this.isVideo = false;
        this.visible = true;
        this.form.groupId = id
      },
      rowSave(form, done, loading) {
        // 调用
        // var blob = this.dataURLtoBlob(this.imgUrl);
        // var file = this.blobToFile(blob, new Date().getTime());
        //
        // var fd = new FormData()
        // fd.append('file', file)
        // this.$http.post(`/api/blade-resource/oss/endpoint/put-file`,fd,{
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }}).then(({data: res}) => {
        //   if (res.code !== 200) {
        //     return this.$message.error(res.msg)
        //   }
        //   this.form.imgUrl = this.form.imgUrl + res.data.link
        // }).catch(() => {
        // })
        // 表单验证
        this.$refs['form'].validate((valid) =>{
          if(valid){
            add(this.form).then(res =>{
              if(res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                });
                this.visible = false;
                setTimeout(()=>{
                  done()
                },1000)
              }
            }, error => {
              loading();
              window.console.log(error);
            });
          }
        })
      },
      // 摄像头拍照方法区*********开始
      // 调用摄像头
      callCamera () {
        this.isVideo = true;
        // H5调用电脑摄像头API
        navigator.mediaDevices.getUserMedia({
          video: true
        }).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success;
          // 实时拍照效果
          this.$refs['video'].play()
        }).catch(() => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      },
      ph() {
        this.picture = true;
        this.$nextTick(() => {
          this.photograph()
        })
      },
      // 拍照
      photograph () {
        let ctx = this.$refs['canvas'].getContext('2d');
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs['video'], 0, 0, 640, 480);
        let dataurl = this.$refs['canvas'].toDataURL('image/jpeg');
        this.imgUrl = dataurl;
        // 转base64格式、图片格式转换、图片质量压缩---支持两种格式image/jpeg+image/png
        // let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)

        /**------------到这里为止，就拿到了base64位置的地址，后面是下载功能----------*/
        //调用
        // var blob = this.dataURLtoBlob(imgBase64);
        // var file = this.blobToFile(blob, new Date().getTime());

        // var fd = new FormData()
        // fd.append('file', file)
        // this.$http.post(`/api/blade-resource/oss/endpoint/put-file`,fd,{
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }}).then(({data: res}) => {
        //   if (res.code !== 200) {
        //     return this.$message.error(res.msg)
        //   }
        //   this.$set(this.form, 'imgUrl', res.data.link);
        // }).catch(() => {
        // })
        //   // 由字节转换为KB 判断大小
        // let str = imgBase64.replace('data:image/jpeg;base64,', '')
        // let strLength = str.length
        // let fileLength = parseInt(strLength - (strLength / 8) * 2)// 图片尺寸  用于判断
        // let size = (fileLength / 1024).toFixed(2)
        // console.log(size)// 上传拍照信息  调用接口上传图片 .........
        //
        // // 保存到本地
        // let ADOM = document.createElement('a')
        // ADOM.href = this.headImgSrc
        // ADOM.download = new Date().getTime() + '.jpeg'
        // ADOM.click()
      },
      // 关闭摄像头
      closeCamera () {
        if (!this.$refs['video'].srcObject) return;
        let stream = this.$refs['video'].srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop()
        });
        this.$refs['video'].srcObject = null;
        this.isVideo = false
      },
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      },
      blobToFile(theBlob, fileName){
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
      },
      // 图片裁剪
      // 图片裁剪赋值
      cropperOpen () {
        this.creamOption.img = this.imgUrl
      },
      // 图片裁剪提交
      cropperOk () {
        this.$refs.cropper.getCropData((data) => {
          this.imgUrl = data;
          this.creamOption.img = data
        });
        this.cropperVisible = false
      }
    }
  };
</script>

<style>
</style>
