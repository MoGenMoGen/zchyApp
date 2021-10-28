<template>
  <el-dialog title="视频地址"  class="mod-vod-edit"
    :close-on-click-modal="false" :visible.sync="visible"
             append-to-body>
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="visible = false" label-width="120px">
      <el-row :gutter="22">
        <el-col :span="11">
          <el-form-item label="格式">
            <label>{{ dataForm.fileURL | fileURLFilter}}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="时长:">
            <label>{{ dataForm.duration | durationFilter }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="分辨率">
            <label>{{ dataForm.width }} * {{ dataForm.height }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="码率">
            <label>{{ dataForm.bitrate }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="时长:">
            <label>{{ dataForm.duration | durationFilter }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="大小:">
            <label>{{ (dataForm.size / 1024 / 1024).toFixed(2) + 'M'}}</label>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="地址:">
            <label>{{ dataForm.fileURL }}</label>
            <!-- <el-button class="copyLink" data-clipboard-target="#msg"
              type="primary" size="small" @click="copyLink()">复制</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { timeToMinute } from '@/util/dateUtils'
  // import clipboard from 'clipboard'
  export default {
    data () {
      return {
        id: null,
        visible: false,
        dataForm: {}
      }
    },
    filters: {
      fileURLFilter (val) {
        if (val) {
          return val.substring(val.lastIndexOf('.') + 1, val.length)
        }
        return val
      },
      durationFilter (val) {
        if (val) {
          return timeToMinute(val)
        }
        return '00:00:00'
      }
    },
    // components: {
    //   clipboard
    // },
    methods: {
      init (id) {
        this.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.id) {
            this.getInfo()
          }
        })
      },
      // 获取信息
      getInfo () {
        this.$http.get(`/api/blade-resource/vod/endpoint/getMezzanineInfo/${this.id}`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data.mezzanine
          }
        }).catch(() => {})
      }
    }
  }
</script>
