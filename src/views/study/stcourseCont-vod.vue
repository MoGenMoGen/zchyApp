<template>
  <el-dialog title="视频上传"  class="mod-stcourse-info"
    :close-on-click-modal="false" :visible.sync="visible" @close="closeHandle()" append-to-body>
    <div class="mod-vod-upload">
<!--      <el-form :inline="true">-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" size="small" @click="addHandle()">添加视频</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->

      <el-table :data="dataList" border stripe style="width: 100%;">
        <el-table-column prop="index" label="视频" header-align="center" align="center">
          <template slot-scope="scope">
            <div :class="scope.row.index">
              <uploadVod @my-event="getMyEvent"></uploadVod>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle()">最小化</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import uploadVod from './aliyunUploadVod'
  export default {
    data () {
      return {
        count: 0,
        dataList: [{index: this.count}],
        visible: false,
        dataForm: {},
        vid: ''
      }
    },
    components: {
      uploadVod
    },
    methods: {
      init (id) {
        this.id = id
        this.visible = true
        this.$nextTick(() => {
          // if (this.id) {
          //   }
        })
      },
      addHandle () {
        this.count++
        this.dataList.push({
          index: this.count
        })
      },
      getMyEvent (vid) {
        console.log('接收的数据--------->' + vid)
        this.vid = vid
        this.getMezzanineInfo(vid)
        // this.getVideoInfo(vid)
        this.$message({
          message: '接收的数据---->' + vid,
          type: 'success'
        })
      },
      closeHandle () {
        console.log("----vid----")
        console.log(this.vid);
        if (this.vid) {
          this.getVideoInfo(this.vid)
        }
      },
      // 获取信息
      getMezzanineInfo (id) {
        // this.$http.get(`/general/vod/getMezzanineInfo/${id}`).then(({data: res}) => {
        this.$http.get(`/api/blade-resource/vod/endpoint/getMezzanineInfo/${id}`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.dataForm.fileURL = res.data.mezzanine.fileURL
          this.dataForm.size = res.data.mezzanine.size
          this.dataForm.fileName = res.data.mezzanine.fileName
          // this.$emit('getFileUrl', res.data.mezzanine.fileURL)
        }).catch(() => {})
      },
      getVideoInfo (id) {
        // this.$http.get(`/general/vod/getVideoInfo/${id}`).then(({data: res}) => {
        this.$http.get(`/api/blade-resource/vod/endpoint/getVideoInfo/${id}`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.dataForm.duration = res.data.video.duration
          if (res.data.video.coverURL === null || res.data.video.coverURL === undefined || res.data.video.coverURL === "") {
            this.$confirm(`封面图尚未生成,确定关闭?`, '提示', {
              confirmButtonText: '继续关闭',
              cancelButtonText: '稍等片刻',
              cancelButtonClass: 'btn-custom-cancel',
              type: 'warning'
            }).then(() => {
              this.dataForm.coverURL = res.data.video.coverURL
              this.$emit('getFileUrl', this.dataForm)
              this.visible = false
            }).catch(() => {})
          } else {
            this.dataForm.coverURL = res.data.video.coverURL
            this.$emit('getFileUrl', this.dataForm)
            this.visible = false
          }
        }).catch(() => {})
      }
    }
  }
</script>
<style>
  .btn-custom-cancel {
    float: right;
    margin-left: 10px;
  }
</style>
