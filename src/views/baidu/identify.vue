<template>
  <basic-container>
    <avue-tabs :option="option" @change="handleChange"></avue-tabs>
    <div v-if="type.prop==='animal'" style="display: flex">
      <div style="margin-left: 10px">
        <span>动物图片（图片最短边至少15px，最长边最大4096px）：</span>
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
      <div style="margin-left: 200px">
        <span>结果：</span>
        <div>
          <el-table :data="animalResult" border stripe v-loading="loading"
                    height="200" class="yui-search-table" ref="table" style="width: 500px">
            <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="score" label="可信度" header-align="center" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div v-else-if="type.prop==='plant'" style="display: flex">
      <div style="margin-left: 10px">
        <span>植物图片（图片最短边至少15px，最长边最大4096px）：</span>
        <el-upload
          class="avatar-uploader"
          :http-request="plantUpload"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          style="margin-top: 10px">
          <img v-if="colourize.plantCoverURL" :src="colourize.plantCoverURL" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div style="margin-left: 200px">
        <span>结果：</span>
        <div>
          <el-table :data="plantResult" border stripe v-loading="loading"
                    height="200" class="yui-search-table" ref="table" style="width: 500px">
            <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="score" label="可信度" header-align="center" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div v-else-if="type.prop==='car'" style="display: flex">
      <div style="margin-left: 10px">
        <span>车辆图片：</span>
        <el-upload
          class="avatar-uploader"
          :http-request="carUpload"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          style="margin-top: 10px">
          <img v-if="colourize.carCoverURL" :src="colourize.carCoverURL" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div style="margin-left: 200px">
        <span>结果：</span>
        <div>
          <el-table :data="carResult" border stripe v-loading="loading"
                    height="200" class="yui-search-table" ref="table" style="width: 500px">
            <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="score" label="可信度" header-align="center" align="center"></el-table-column>
            <el-table-column prop="year" label="年份" header-align="center" align="center"></el-table-column>
          </el-table>
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
          plantCoverURL: '',
          carCoverURL: ''
        },
        style: 'cartoon',
        animalResult: [],
        plantResult: [],
        carResult: [],
        option:{
          column: [{
            icon:'iconfont iconicon_sms',
            label: '动物识别',
            prop: 'animal',
          }, {
            icon:'iconfont iconicon_doc',
            label: '植物识别',
            prop: 'plant',
          }, {
            icon:'iconfont iconicon_doc',
            label: '车辆识别',
            prop: 'car',
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
      // 动物识别
      imgUpload(file) {
        var fd = new FormData()
        fd.append('file', file.file)
        this.$http.post(`/api/blade-baidu/animal`,fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }}).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          console.log(res.data)
          this.animalResult = res.data

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
      // 植物识别
      plantUpload(file) {
        var fd = new FormData()
        fd.append('file', file.file)
        fd.append('style', this.style)
        this.$http.post(`/api/blade-baidu/plant`,fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }}).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.plantResult = res.data

          this.$http.post(`/api/blade-baidu/returnImg`,fd,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }}).then(({data: res}) => {
            if (res.code !== 200) {
              return this.$message.error(res.msg)
            }
            this.$set(this.colourize, 'plantCoverURL', 'data:image/jpeg;base64,' + res.data);
          }).catch(() => {
          })
        }).catch(() => {
        })
      },
      // 车辆识别
      carUpload(file) {
        var fd = new FormData()
        fd.append('file', file.file)
        this.$http.post(`/api/blade-baidu/car`,fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }}).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.carResult = res.data

          this.$http.post(`/api/blade-baidu/returnImg`,fd,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }}).then(({data: res}) => {
            if (res.code !== 200) {
              return this.$message.error(res.msg)
            }
            this.$set(this.colourize, 'carCoverURL', 'data:image/jpeg;base64,' + res.data);
          }).catch(() => {
          })
        }).catch(() => {
        })
      },
      beforeAvatarUpload (file) {
        let _this = this
        const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
        const is4M = file.size / 1024 / 1024 < 4; // 限制小于1M
        const isSize = new Promise(function (resolve, reject) {
          let minWidth = 15;
          let minHeight = 15;
          let width = 4096; // 限制图片尺寸为654X270
          let height = 4096;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function () {
            let valid = img.width >= minWidth && img.height >= minHeight && img.width <= width && img.height <= height;
            valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
        }).then(() => {
          return file;
        }, () => {
          _this.$message.error('图片尺寸最小边15px，最长边4096，大小不可超过4MB')
          return Promise.reject();
        });
        if (!isType) {
          this.$message.error('上传图片只能是 JPG、PNG、BMP 格式!');
        }
        if (!is4M) {
          _this.$message.error('图片尺寸最小边15px，最长边4096，大小不可超过4MB')
        }
        return isSize&is4M
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
