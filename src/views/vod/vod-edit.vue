<template>
  <el-dialog title="编辑视频信息"  class="mod-vod-edit"
    :close-on-click-modal="false" :visible.sync="visible"
             append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitVod()" label-width="120px">
      <el-row :gutter="22">
        <el-col :span="22">
          <el-form-item label="封面" prop="coverURL">
            <el-upload
              class="avatar-uploader"
              :http-request="imgUpload"
              action=""
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
              <img v-if="dataForm.coverURL" :src="dataForm.coverURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="名称" prop="title">
            <el-input v-model="dataForm.title" placeholder="名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="dataForm.description" placeholder="描述"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="11">
          <el-form-item label="分类" prop="cateId">
            <el-input v-model="dataForm.cateId" placeholder="分类"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="22">
          <el-form-item label="ID:" prop="videoId">
            <label>{{ dataForm.videoId }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="存储地址:" prop="storageLocation">
            <label>{{ dataForm.storageLocation }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="时长:" prop="duration">
            <label>{{ dataForm.duration | durationFilter }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="原片大小:" prop="size">
            <label>{{ (dataForm.size / 1024 / 1024).toFixed(2) + 'M'}}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间:" prop="createTime">
            <label>{{ dataForm.createTime }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="修改时间" prop="modifyTime">
            <label>{{ dataForm.modifyTime }}</label>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitVod()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import imgUpload from '@/components/imgUpload'
  import { timeToMinute } from '@/util/dateUtils'
  import {update} from "@/api/vod/vod";
  export default {
    data () {
      return {
        id: null,
        visible: false,
        dataForm: {
          coverURL: ''
        },
        dataRule: {
          coverURL: [
            { required: true, message: '编码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {
      durationFilter (val) {
        if (val) {
          return timeToMinute(val)
        }
        return '00:00:00'
      }
    },
    // components: {
    //   imgUpload
    // },
    methods: {
      init(id) {
        this.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.id) {
            this.getInfo()
          }
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 图片上传
      imgUpload(file) {
        var fd = new FormData()
        fd.append('file', file.file)
        this.$http.post(`/api/blade-resource/oss/endpoint/put-file`,fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }}).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.$set(this.dataForm, 'coverURL', res.data.link);
        }).catch(() => {
        })
      },
      // 获取系统短信信息
      getInfo() {
        this.$http.get(`/api/blade-resource/vod/endpoint/getVideoInfo/${this.id}`).then(({data: res}) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data.video
          }
        }).catch(() => {
        })
      },
      submitVod() {
        // 表单验证
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            update(this.dataForm).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                })
                setTimeout(() => {
                  this.visible = false
                }, 1000)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
          }
        })
      }
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
