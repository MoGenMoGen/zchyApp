<template>
  <el-dialog title="视频点播配置" class="mod-vod-config" :close-on-click-modal="false" :visible.sync="visible"
             append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item size="mini" label="存储类型">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">阿里云</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type === 1">
        <el-form-item label="userId">
          <el-input v-model="dataForm.userId" placeholder="阿里云userId"></el-input>
        </el-form-item>
        <el-form-item label="accessKeyId">
          <el-input v-model="dataForm.accessKeyId" placeholder="阿里云accessKeyId"></el-input>
        </el-form-item>
        <el-form-item label="accessKeySecret">
          <el-input v-model="dataForm.accessKeySecret" placeholder="阿里云accessKeySecret"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import debounce from 'lodash/debounce'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
        },
        dataForm2: {
          id: '',
          paramKey: 'sys-vod',
          paramValue: '',
          status: 1
        },
        dataRule: {}
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          this.getInfo()
        })
      },
      getInfo () {
        this.$http.get(`/api/blade-system/param/detail?paramKey=${this.dataForm2.paramKey}`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          if (res.data) {
            this.dataForm = {
              ...this.dataForm,
              ...JSON.parse(res.data.paramValue)
            }
            this.dataForm2 = {
              ...this.dataForm2,
              ...res.data
            }
          }
        }).catch(() => {})
      },
      // 表单提交
      dataFormSubmit: debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm2.paramValue = JSON.stringify(this.dataForm)
            this.$http.post('/api/blade-system/param/submit', {...this.dataForm2}).then(({data: res}) => {
              if (res && res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
</script>

