<template>
  <el-dialog title="视频播放"  class="mod-vod-play"
    :close-on-click-modal="false" :visible.sync="visible" v-if="visible"
             append-to-body>
    <div style="height: 400px">
      <aliplayer v-if="dataForm.playauth" :vid="dataForm.vid" :playauth="dataForm.playauth" height="400px" :encryptType="1"></aliplayer>
      <!-- <div class="prism-player" :id="playerId"></div> -->
      <!-- <iframe frameborder=0 :src="dataForm.url" height="400px" width="100%" allowfullscreen="true"></iframe> -->
    </div>

    <span slot="footer" class="dialog-footer">
      <!-- <el-button type="primary" @click="openWindowHandle()">新窗口查看</el-button> -->
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import aliplayer from '@/components/aliplayer'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          vid: '',
          playauth: '',
          cover: ''
        }
      }
    },
    components: {
      aliplayer
    },
    methods: {
      init (id) {
        this.dataForm.vid = ''
        this.dataForm.playauth = ''
        this.dataForm.cover = ''
        this.visible = true
        this.id = id
        this.$nextTick(() => {
          if (this.id) {
            this.getInfo()
          }
        })
      },
      // playerHandle (vid, playauth, cover) {
      //   /* eslint-disable */
      //   var player = new Aliplayer({
      //     // 播放方式二：点播用户推荐
      //     vid: vid,
      //     playauth: playauth,
      //     cover: cover,
      //     encryptType: 1, // 当播放私有加密流时需要设置。

      //     id: this.playerId,
      //     // 'source': url,
      //     width: '100%',
      //     height: '400px',
      //     autoplay: true,
      //     isLive: false,
      //     rePlay: false,
      //     playsinline: true,
      //     preload: true,
      //     controlBarVisibility: 'hover',
      //     useH5Prism: true,
      //     showBuffer: true
      //   }, function (player) {
      //     console.log('The player is created')
      //   })
      //   /* eslint-enable */
      // },
      // 获取播放信息
      getInfo () {
        this.$http.get(`/api/blade-resource/vod/endpoint/getVideoPlayAuth/${this.id}`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          // this.dataForm.url = res.data.playInfoList[0].playURL
          // this.dataForm.height = res.data.playInfoList[0].height
          // this.dataForm.width = res.data.playInfoList[0].width
          this.dataForm.vid = res.data.videoMeta.videoId
          this.dataForm.playauth = res.data.playAuth
          this.dataForm.cover = res.data.videoMeta.coverURL
          // this.playerHandle(res.data.videoMeta.videoId, res.data.playAuth, res.data.videoMeta.coverURL)
        }).catch(() => {})
      }
      /* openWindowHandle () {
        window.open(this.dataForm.url)
      } */
    }
  }
</script>
<style>
  .mod-vod-play .el-dialog {
   width: 50%;
   height: 530px;
  }
</style>
