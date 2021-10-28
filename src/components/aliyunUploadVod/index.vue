<template>
  <div class="container">
    <!-- <div class="setting">
      <div class="input-control">
        <label for="timeout">请求过期时间（构造参数 timeout, 默认 60000）:</label>
        <input type="text" id="timeout" v-model="timeout" placeholder="输入过期时间, 单位毫秒">
      </div>

      <div class="input-control">
        <label for="partSize">分片大小（构造参数 partSize, 默认 1048576）:</label>
        <input type="text" class="form-control" id="partSize" v-model="partSize" placeholder="输入分片大小, 单位bit, 最小100k">
      </div>

      <div class="input-control">
        <label for="parallel">上传分片数（构造参数 parallel, 默认 5）:</label>
        <input type="text" class="form-control" id="parallel" v-model="parallel" placeholder="输入并行上传分片个数, 默认为5">
      </div>

      <div class="input-control">
        <label for="retryCount">网络失败重试次数（构造参数 retryCount, 默认 3）:</label>
        <input type="text" class="form-control" id="retryCount" v-model="retryCount" placeholder="输入网络失败重试次数, 默认为3">
      </div>

      <div class="input-control">
        <label for="retryDuration">网络失败重试间隔（构造参数 retryDuration, 默认 2）:</label>
        <input type="text" class="form-control" id="retryDuration" v-model="retryDuration" placeholder="输入网络失败重试间隔, 默认2秒">
      </div>

      <div class="input-control">
        <label for="region">配置项 region, 默认 cn-shanghai:</label>
        <select v-model="region">
          <option>cn-shanghai</option>
          <option>eu-central-1</option>
          <option>ap-southeast-1</option>
        </select>
      </div>

      <div class="input-control">
        <label for="userId">阿里云账号ID</label>
        <input type="text" class="form-control" v-model="userId" disabled placeholder="输入阿里云账号ID">
      </div>
    </div> -->
    <div class="upload">
      <el-form :inline="true">
        <el-row :gutter="24">
          <el-col :span="2">
            <el-form-item>
              <div class="filebox">
                <input type="file" id="fileUpload" @change="fileChange($event)" class="filebtn">
                <div class="flletit">选择视频</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <div class="filetitle">{{fileTitle}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <div class="status">上传状态: <span>{{statusText}}</span></div>
              <el-progress :text-inside="true" :stroke-width="16" :percentage=authProgress :status='authProgress == 100 ? "success":"text"'></el-progress>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="upload-type">
                <el-button slot="trigger" size="small" type="primary"  @click="authUpload" :disabled="uploadDisabled">开始上传</el-button>
                <el-button style="margin-left: 10px;" size="small" type="danger" @click="pauseUpload" :disabled="pauseDisabled">暂停</el-button>
                <el-button slot="trigger" size="small" type="success"  :disabled="resumeDisabled" @click="resumeUpload">恢复上传</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- <div class="upload">
      <div class="filebox">
        <input type="file" id="fileUpload" @change="fileChange($event)" class="filebtn">
        <div class="flletit">选择视频</div>
      </div>
      <div class="filetitle">{{fileTitle}}</div>
      <div class="status">上传状态: <span>{{statusText}}</span></div>
      <div class="fileProgress">
        <el-progress :text-inside="true" :stroke-width="14" :percentage=authProgress :status='authProgress == 100 ? "success":"text"'></el-progress>
      </div>
      <div class="upload-type">
        <el-button slot="trigger" size="small" type="primary"  @click="authUpload" :disabled="uploadDisabled">开始上传</el-button>
        <el-button style="margin-left: 10px;" size="small" type="danger" @click="pauseUpload" :disabled="pauseDisabled">暂停</el-button>
        <el-button slot="trigger" size="small" type="success"  :disabled="resumeDisabled" @click="resumeUpload">恢复上传</el-button>
      </div>
    </div> -->
    <!-- <div class="upload">
      <div>
        <input type="file" id="fileUpload" @change="fileChange($event)">
        <label class="status">上传状态: <span>{{statusText}}</span></label>
      </div>
      <div class="upload-type">
        <button @click="authUpload" :disabled="uploadDisabled">开始上传</button>
        <button @click="pauseUpload" :disabled="pauseDisabled">暂停</button>
        <button :disabled="resumeDisabled" @click="resumeUpload">恢复上传</button>
        <span class="progress">上传进度: <i id="auth-progress">{{authProgress}}</i> %</span>
      </div>
    </div> -->
  </div>
</template>
<script>
  // import axios from 'axios'
  export default {
    data () {
      return {
        fileTitle: '',
        timeout: '',
        partSize: '',
        parallel: '',
        retryCount: '',
        retryDuration: '',
        region: 'cn-shanghai',
        // userId: '218511932860672742',
        userId: '',
        file: null,
        authProgress: 0,
        uploadDisabled: true,
        resumeDisabled: true,
        pauseDisabled: true,
        uploader: null,
        statusText: ''
      }
    },
    mounted () {
      this.getInfo()
    },
    methods: {
      getInfo () {
        this.$http.get(`/api/blade-system/param/detail`,{
          params:{
            paramKey: 'sys-vod'
          }
        }).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          if (res.data) {
            let config = JSON.parse(res.data.paramValue)
            console.log(config)
            this.userId = config.userId
          }
          console.log(this.userId)
        }).catch(() => {})
      },
      fileChange (e) {
        this.file = e.target.files[0]
        if (!this.file) {
          alert('请先选择需要上传的文件!')
          return
        }
        var Title = this.file.name
        this.fileTitle = Title
        var userData = '{"Vod":{}}'
        if (this.uploader) {
          this.uploader.stopUpload()
          this.authProgress = 0
          this.statusText = ''
        }
        this.uploader = this.createUploader()
        // console.log(userData)
        this.uploader.addFile(this.file, null, null, null, userData)
        this.uploadDisabled = false
        this.pauseDisabled = true
        this.resumeDisabled = true
      },
      authUpload () {
        // 然后调用 startUpload 方法, 开始上传
        if (this.uploader !== null) {
          this.uploader.startUpload()
          this.uploadDisabled = true
          this.pauseDisabled = false
        }
      },
      // 暂停上传
      pauseUpload () {
        if (this.uploader !== null) {
          this.uploader.stopUpload()
          this.resumeDisabled = false
          this.pauseDisabled = true
        }
      },
      // 恢复上传
      resumeUpload () {
        if (this.uploader !== null) {
          this.uploader.startUpload()
          this.resumeDisabled = true
          this.pauseDisabled = false
        }
      },
      createUploader (type) {
        let self = this
        /* eslint-disable */
        let uploader = new AliyunUpload.Vod({
          timeout: self.timeout || 60000,
          partSize: self.partSize || 1048576,
          parallel: self.parallel || 5,
          retryCount: self.retryCount || 3,
          retryDuration: self.retryDuration || 2,
          region: self.region,
          userId: self.userId,
          // 添加文件成功
          addFileSuccess: function (uploadInfo) {
            self.uploadDisabled = false
            self.resumeDisabled = false
            self.statusText = '添加文件成功, 等待上传...'
            console.log('addFileSuccess: ' + uploadInfo.file.name + 'videoId:' + uploadInfo.videoId)
          },
          /* eslint-enable */
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
            // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
            // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
            if (!uploadInfo.videoId) {
              // let createUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6'
              // axios.get(createUrl).then(({data}) => {
              // console.log(uploadInfo)
              // let title = uploadInfo.file.name.substr(0, uploadInfo.file.name.lastIndexOf('.'))
              self.$http.get('/api/blade-resource/vod/endpoint/createUploadVideo', {
                params: { title: uploadInfo.file.name, fileName: uploadInfo.file.name }
              }).then(({ data: res }) => {
                console.log(res)
                if (res.code !== 200) {
                  return self.$message.error(res.msg)
                }
                let uploadAuth = res.data.uploadAuth
                let uploadAddress = res.data.uploadAddress
                let videoId = res.data.videoId
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
              })
              self.statusText = '文件开始上传...'
              // console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
            } else {
              // 如果videoId有值，根据videoId刷新上传凭证
              // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
              // let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
              // axios.get(refreshUrl).then(({data}) => {
              self.$http.get('/api/blade-resource/vod/endpoint/refreshUploadVideo', {
                params: { videoId: uploadInfo.videoId }
              }).then(({ data: res }) => {
                if (res.data.code === 501) {
                  self.$http.get('/api/blade-resource/vod/endpoint/createUploadVideo', {
                    params: { title: uploadInfo.file.name, fileName: uploadInfo.file.name }
                  }).then(({ data: res }) => {
                    if (res.code !== 200) {
                      return self.$message.error(res.msg)
                    }
                    let uploadAuth = res.data.uploadAuth
                    let uploadAddress = res.data.uploadAddress
                    let videoId = res.data.videoId
                    uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                  })
                  self.statusText = '文件开始上传...'
                  return
                }
                if (res.data.code !== 200) {
                  return self.$message.error(res.data.msg)
                }
                let uploadAuth = res.data.uploadAuth
                let uploadAddress = res.data.uploadAddress
                let videoId = res.data.videoId
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
              })
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
            self.statusText = '文件上传成功!'
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
            self.statusText = '文件上传失败!'
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo, code, message) {
            console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
            self.statusText = '文件已暂停上传'
          },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
            let progressPercent = Math.ceil(progress * 100)
            self.authProgress = progressPercent
            self.statusText = '文件上传中...'
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo) {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
            // let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
            // axios.get(refreshUrl).then(({data}) => {
            self.$http.get('/api/blade-resource/vod/endpoint/refreshUploadVideo', {
              params: { videoId: uploadInfo.videoId }
            }).then(({ data: res }) => {
              if (res.data.data.code !== 0) {
                return self.$message.error(res.data.msg)
              }
              let uploadAuth = res.data.data.uploadAuth
              uploader.resumeUploadWithAuth(uploadAuth)
              console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
            })
            self.statusText = '文件超时...'
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo) {
            console.log('onUploadEnd: uploaded all the files')
            self.statusText = '文件上传完毕'
          }
        })
        return uploader
      }
    }
  }
</script>
<style>
  .container{
    align-content: center;
    line-height: 1;
    height: 60px;
  }
  .filebox{
    width: 80px;
    height: 32px;
    color: #fff;
    background-color: #17B3A3;
    border-color: #17B3A3;
    position: relative;
    border-radius: 3px;
    text-align: center;
    line-height: 32px;
    margin: 0 auto;
  }
  .filebox .filebtn{
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;

  }
 .filebox .flletit{
   width: 100%;
   height: 100%;
 }
  /* .filetitle{
    margin: 10px 0;
  } */
  .status span{
    color: #FF4C52;
  }
</style>

