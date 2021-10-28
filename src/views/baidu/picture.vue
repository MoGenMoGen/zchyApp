<template>
  <basic-container>
    <avue-tabs :option="option" @change="handleChange"></avue-tabs>
    <div v-if="type.prop==='colourize'" style="display: flex">
      <div>
        <span>处理前（图片最短边至少64px，最长边最大800px）：</span>
            <el-upload
              class="avatar-uploader"
              :http-request="imgUpload"
              action=""
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            style="margin-top: 10px">
              <img v-if="colourize.coverURL" :src="colourize.coverURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
      </div>
      <div style="margin-left: 100px">
        <span>处理后：</span>
        <div class="demo-image">
          <el-image
            style="width: 178px; height: 178px; margin-top: 10px"
            :src="imgUrl"
           ></el-image>
        </div>
      </div>
    </div>

    <div v-else-if="type.prop==='styleTrans'">
      <span style="margin-left: 10px">
        <el-radio-group v-model="style">
          <el-radio label="cartoon">卡通画风格</el-radio>
          <el-radio label="pencil">铅笔风格</el-radio>
          <el-radio label="color_pencil">彩色铅笔画风格</el-radio>
          <el-radio label="warm">彩色糖块油画风格</el-radio>
          <el-radio label="wave">神奈川冲浪里油画风格</el-radio>
          <el-radio label="lavender">薰衣草油画风格</el-radio>
          <el-radio label="mononoke">奇异油画风格</el-radio>
          <el-radio label="scream">呐喊油画风格</el-radio>
          <el-radio label="gothic">哥特油画风格</el-radio>
        </el-radio-group>
      </span>
      <div style="display: flex; margin-top: 20px;margin-left: 10px;">
        <div>
          <span>处理前（图片像素乘积不超过2000*2000，最短边至少50px，最长边最大4096px）：</span>
          <el-upload
            class="avatar-uploader"
            :http-request="styleTransUpload"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            style="margin-top: 10px">
            <img v-if="colourize.styleTrans" :src="colourize.styleTrans" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div style="margin-left: 100px">
          <span>处理后：</span>
          <div class="demo-image">
            <el-image
              style="width: 178px; height: 178px; margin-top: 10px"
              :src="styleTrans"
            ></el-image>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="type.prop==='selfieAnime'">
      <div style="display: flex; margin-top: 20px;margin-left: 10px;">
        <div>
          <span>处理前（图片最短边至少64px，最长边最大4096px）：</span>
          <el-upload
            class="avatar-uploader"
            :http-request="selfieAnimeUpload"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            style="margin-top: 10px">
            <img v-if="colourize.selfieAnimeCoverURL" :src="colourize.selfieAnimeCoverURL" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div style="margin-left: 100px">
          <span>处理后：</span>
          <div class="demo-image">
            <el-image
              style="width: 178px; height: 178px; margin-top: 10px"
              :src="selfieAnimeImgUrl"
            ></el-image>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
    export default {
        data () {
          return {
            type: {},
            colourize: {
              coverURL: '',
              selfieAnimeCoverURL: '',
              styleTrans: ''
            },
            style: 'cartoon',
            imgUrl: '',
            selfieAnimeImgUrl: '',
            styleTrans: '',
            option:{
              column: [{
                icon:'iconfont iconicon_sms',
                label: '黑白图片上色',
                prop: 'colourize',
              }, {
                icon:'iconfont iconicon_doc',
                label: '图片风格转换',
                prop: 'styleTrans',
              }, {
                icon:'iconfont iconicon_doc',
                label: '人物头像动漫化',
                prop: 'selfieAnime',
              }]
            },
          }
        },
      created(){
        this.type = this.option.column[0];
      },
      methods:{
        handleChange(column) {
          console.log(column)
          this.type = column
        },
        // 黑白图片上色
        imgUpload(file) {
          var fd = new FormData()
          fd.append('file', file.file)
          this.$http.post(`/api/blade-baidu/readImage`,fd,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }}).then(({data: res}) => {
            if (res.code !== 200) {
              return this.$message.error(res.msg)
            }
            this.imgUrl = 'data:image/jpeg;base64,' + res.data

            this.$http.post(`/api/blade-baidu/returnImg`,fd,{
              headers: {
                'Content-Type': 'multipart/form-data'
              }}).then(({data: res}) => {
              if (res.code !== 200) {
                return this.$message.error(res.msg)
              }
              this.$set(this.colourize, 'coverURL', 'data:image/jpeg;base64,' + res.data);
            }).catch(() => {
            })
          }).catch(() => {
          })
        },
        // 图片风格转换
        styleTransUpload(file) {
          var fd = new FormData()
          fd.append('file', file.file)
          fd.append('style', this.style)
          this.$http.post(`/api/blade-baidu/styleImage`,fd,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }}).then(({data: res}) => {
            if (res.code !== 200) {
              return this.$message.error(res.msg)
            }
            this.styleTrans = 'data:image/jpeg;base64,' + res.data

            this.$http.post(`/api/blade-baidu/returnImg`,fd,{
              headers: {
                'Content-Type': 'multipart/form-data'
              }}).then(({data: res}) => {
              if (res.code !== 200) {
                return this.$message.error(res.msg)
              }
              this.$set(this.colourize, 'styleTrans', 'data:image/jpeg;base64,' + res.data);
            }).catch(() => {
            })
          }).catch(() => {
          })
        },
        // 头像动漫化
        selfieAnimeUpload(file) {
          var fd = new FormData()
          fd.append('file', file.file)
          this.$http.post(`/api/blade-baidu/selfImage`,fd,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }}).then(({data: res}) => {
            if (res.code !== 200) {
              return this.$message.error(res.msg)
            }
            this.selfieAnimeImgUrl = 'data:image/jpeg;base64,' + res.data

            this.$http.post(`/api/blade-baidu/returnImg`,fd,{
              headers: {
                'Content-Type': 'multipart/form-data'
              }}).then(({data: res}) => {
              if (res.code !== 200) {
                return this.$message.error(res.msg)
              }
              this.$set(this.colourize, 'selfieAnimeCoverURL', 'data:image/jpeg;base64,' + res.data);
            }).catch(() => {
            })
          }).catch(() => {
          })
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt4M = file.size / 1024 / 1024 < 4;

          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 格式!');
          }
          if (!isLt4M) {
            this.$message.error('上传图片大小不能超过 4MB!');
          }
          return isJPG && isLt4M;
        },
        base64ToFile(urlData, fileName) {
          let arr = urlData.split(',');
          let mime = arr[0].match(/:(.*?);/)[1];
          let bytes = atob(arr[1]); // 解码base64
          let n = bytes.length
          let ia = new Uint8Array(n);
          while (n--) {
            ia[n] = bytes.charCodeAt(n);
          }
          return new File([ia], fileName, { type: mime });
        },
      }
    }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
